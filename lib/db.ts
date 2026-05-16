import dbConnect from './mongodb';

/**
 * MongoDB database adapter for Orders and Users
 * Replaces the previous JSON-based approach
 */

export const db = {
  // Helpers to get models dynamically to avoid initialization issues
  async getUserModel() {
    const User = (await import('../models/User')).default;
    return User;
  },
  async getOrderModel() {
    const Order = (await import('../models/Order')).default;
    return Order;
  },
  async getCategoryModel() {
    const Category = (await import('../models/Category')).default;
    return Category;
  },
  async getWebhookLogModel() {
    const WebhookLog = (await import('../models/WebhookLog')).default;
    return WebhookLog;
  },
  async getGlobalSettingsModel() {
    const GlobalSettings = (await import('../models/GlobalSettings')).default;
    return GlobalSettings;
  },
  async getVisitModel() {
    const VisitModel = (await import('../models/Visit')).default;
    return VisitModel;
  },

  // Analytics logic
  async incrementVisit(options: { 
    city?: string, 
    productId?: string, 
    productName?: string, 
    referrer?: string,
    deviceType?: 'mobile' | 'desktop' | 'tablet'
  }): Promise<void> {
    try {
      const { city, productId, productName, referrer, deviceType } = options;
      await dbConnect();
      const Visit = await this.getVisitModel();
      const dateStr = new Date().toISOString().split('T')[0];
      
      let visitRecord = await Visit.findOne({ dateStr });
      if (!visitRecord) {
        visitRecord = new Visit({ 
          dateStr, 
          count: 0, 
          cities: [], 
          products: [], 
          referrers: [],
          devices: { mobile: 0, desktop: 0, tablet: 0 }
        });
      }

      visitRecord.count += 1;

      // Update City
      if (city) {
        const cityIndex = visitRecord.cities.findIndex((c: any) => c.name === city);
        if (cityIndex > -1) {
           visitRecord.cities[cityIndex].count += 1;
        } else {
           visitRecord.cities.push({ name: city, count: 1 });
        }
      }

      // Update Product
      if (productId && productName) {
        if (!visitRecord.products) visitRecord.products = [];
        const prodIndex = visitRecord.products.findIndex((p: any) => p.productId === productId);
        if (prodIndex > -1) {
          visitRecord.products[prodIndex].count += 1;
        } else {
          visitRecord.products.push({ productId, name: productName, count: 1 });
        }
      }

      // Update Referrer
      if (referrer) {
        if (!visitRecord.referrers) visitRecord.referrers = [];
        let domain = 'Directo';
        try {
          const url = new URL(referrer);
          domain = url.hostname.replace('www.', '');
          // Identify common social referrers
          if (domain.includes('instagram.com')) domain = 'Instagram';
          if (domain.includes('facebook.com')) domain = 'Facebook';
          if (domain.includes('google.com')) domain = 'Google';
          if (domain.includes('t.co') || domain.includes('twitter.com')) domain = 'Twitter/X';
        } catch (e) {
          // If not a valid URL, it might be 'direct' or similar
          domain = referrer;
        }

        const refIndex = visitRecord.referrers.findIndex((r: any) => r.domain === domain);
        if (refIndex > -1) {
          visitRecord.referrers[refIndex].count += 1;
        } else {
          visitRecord.referrers.push({ domain, count: 1 });
        }
      }

      // Update Device
      if (deviceType && visitRecord.devices) {
        visitRecord.devices[deviceType] = (visitRecord.devices[deviceType] || 0) + 1;
      }

      await visitRecord.save();
    } catch (error) {
      console.error('DB Error [incrementVisit]:', error);
    }
  },

  async getRecentVisits(days: number = 7): Promise<any[]> {
    try {
      await dbConnect();
      const Visit = await this.getVisitModel();
      
      const visits = await Visit.find({})
        .sort({ dateStr: -1 })
        .limit(days)
        .lean();
        
      return visits.reverse(); // Return oldest first for charting
    } catch (error) {
      console.error('DB Error [getRecentVisits]:', error);
      return [];
    }
  },

  // Orders logic
  async getOrders(): Promise<any[]> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      return await Order.find({}).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('DB Error [getOrders]:', error);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<any | undefined> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      return await Order.findOne({ id }).lean();
    } catch (error) {
      console.error('DB Error [getOrderById]:', error);
      throw error;
    }
  },

  async getOrdersByEmail(email: string): Promise<any[]> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      const normalizedEmail = email.toLowerCase();
      return await Order.find({ userEmail: normalizedEmail }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('DB Error [getOrdersByEmail]:', error);
      throw error;
    }
  },

  async saveOrder(orderData: any): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      if (orderData.userEmail) {
        orderData.userEmail = orderData.userEmail.toLowerCase();
      }

      const existingOrder = await Order.findOne({ id: orderData.id });
      if (existingOrder) {
        await Order.updateOne({ id: orderData.id }, orderData);
      } else {
        await Order.create(orderData);
      }
    } catch (error) {
      console.error('DB Error [saveOrder]:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: string, navePaymentId?: string): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      const updateData: any = { status };
      
      let query: any = { id };
      if (navePaymentId) {
        query = { $or: [{ id }, { navePaymentId }] };
        updateData.navePaymentId = navePaymentId;
      }

      await Order.updateOne(query, updateData);

      // AUTOMATIC STOCK DECREMENT Logic
      if (status === 'APPROVED' || status === 'SHIPPED') {
        const order = await Order.findOne(query);
        if (order && !order.stockDecremented) {
          await this.decrementOrderStock(order.id);
        }
      }
    } catch (error) {
      console.error('DB Error [updateOrderStatus]:', error);
      throw error;
    }
  },

  async decrementOrderStock(orderId: string): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      const Product = await this.getProductModel();
      
      const order = await Order.findOne({ id: orderId });
      if (!order || order.stockDecremented) return;

      console.log(`Decreasing stock for order ${orderId}...`);
      
      for (const item of order.items) {
        if (!item.productId) {
          console.warn(`Item ${item.name} missing productId, trying to find by name...`);
          const prod = await Product.findOne({ name: item.name });
          if (prod) {
            await Product.updateOne({ id: prod.id }, { $inc: { stock: -(item.quantity || 1) } });
          }
        } else {
          await Product.updateOne({ id: item.productId }, { $inc: { stock: -(item.quantity || 1) } });
        }
      }

      await Order.updateOne({ id: orderId }, { stockDecremented: true });
      console.log(`Stock decreased for order ${orderId}`);
    } catch (error) {
      console.error('DB Error [decrementOrderStock]:', error);
      throw error;
    }
  },

  async updateOrderTracking(id: string, trackingCode: string): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      await Order.updateOne({ id }, { trackingCode });
    } catch (error) {
      console.error('DB Error [updateOrderTracking]:', error);
      throw error;
    }
  },

  async deleteOrder(id: string): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      await Order.deleteOne({ id });
    } catch (error) {
      console.error('DB Error [deleteOrder]:', error);
      throw error;
    }
  },

  async getCategories(): Promise<any[]> {
    try {
      await dbConnect();
      const Category = await this.getCategoryModel();
      return await Category.find({}).sort({ name: 1 }).lean();
    } catch (error) {
      console.error('DB Error [getCategories]:', error);
      throw error;
    }
  },

  async saveCategory(categoryData: any): Promise<void> {
    try {
      await dbConnect();
      const Category = await this.getCategoryModel();
      const { id, slug, markupPercent, markupFixed } = categoryData;
      
      // Update Category
      await Category.findOneAndUpdate(
        { $or: [{ id }, { slug }] },
        { $set: categoryData },
        { upsert: true, new: true }
      );

      // Trigger automatic price recalculation for all products in this category
      if (typeof markupPercent === 'number') {
        const settings = await this.getGlobalSettings();
        await this.recalculateProductPrices(slug, markupPercent, markupFixed, settings.exchangeRate);
      }
    } catch (error) {
      console.error('DB Error [saveCategory]:', error);
      throw error;
    }
  },

  async getGlobalSettings(): Promise<any> {
    try {
      await dbConnect();
      const GlobalSettings = await this.getGlobalSettingsModel();
      let settings = await GlobalSettings.findOne().lean();
      if (!settings) {
        settings = await GlobalSettings.create({ exchangeRate: 1500 });
      }
      return settings;
    } catch (error) {
      console.error('DB Error [getGlobalSettings]:', error);
      return { exchangeRate: 1500 };
    }
  },

  /**
   * Core pricing logic
   */
  calculatePrice(cost: number, rate: number, markupPercent: number, markupFixed?: string): number {
    const margin = 1 + (markupPercent / 100);
    let subtotal = 0;

    if (cost >= 500) {
      // Rule for > 500: Cost + 10% then rate
      subtotal = (cost * 1.10) * rate;
    } else {
      // Determine fixed adjustment (< 500)
      let fixedAdj = 0;
      let isUSD = true;
      
      if (markupFixed) {
         const cleanFixed = markupFixed.toUpperCase();
         const usdMatch = cleanFixed.match(/\$(\d+)\s*USD/i);
         const arsMatch = cleanFixed.match(/\$(\d+)(K)?\s*ARS/i);
         
         if (arsMatch) {
           fixedAdj = parseFloat(arsMatch[1]);
           if (arsMatch[2]) fixedAdj *= 1000;
           isUSD = false;
         } else if (usdMatch) {
           fixedAdj = parseFloat(usdMatch[1]);
           isUSD = true;
         } else {
           const usdMatchNoSign = cleanFixed.match(/(\d+)\s*USD/i);
           const arsMatchNoSign = cleanFixed.match(/(\d+)(K)?\s*ARS/i);
           if (arsMatchNoSign) {
             fixedAdj = parseFloat(arsMatchNoSign[1]);
             if (arsMatchNoSign[2]) fixedAdj *= 1000;
             isUSD = false;
           } else if (usdMatchNoSign) {
             fixedAdj = parseFloat(usdMatchNoSign[1]);
             isUSD = true;
           } else {
             fixedAdj = 20; // Default
             isUSD = true;
           }
         }
      } else {
        fixedAdj = 20;
        isUSD = true;
      }

      if (isUSD) {
        subtotal = (cost + fixedAdj) * rate;
      } else {
        subtotal = (cost * rate) + fixedAdj;
      }
    }

    let finalPrice = subtotal * margin;
    
    // Rounding
    if (finalPrice > 100000) {
      finalPrice = Math.round(finalPrice / 100) * 100;
    } else {
      finalPrice = Math.round(finalPrice / 10) * 10;
    }

    return finalPrice;
  },

  /**
   * Recalculates all product prices in a category based on margin rules
   */
  async recalculateProductPrices(categorySlug: string, markupPercent: number, markupFixed?: string, rate?: number): Promise<number> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      const products = await Product.find({ category: categorySlug });
      
      console.log(`[recalculateProductPrices] Found ${products.length} products for category: ${categorySlug}`);
      if (products.length === 0) return 0;

      if (!rate) {
        const settings = await this.getGlobalSettings();
        rate = settings.exchangeRate;
      }

      const operations: any[] = [];
      
      for (const p of products) {
        if (!p.costPrice || isNaN(p.costPrice)) {
           continue;
        }
        
        const finalPrice = this.calculatePrice(p.costPrice, rate || 1500, markupPercent, markupFixed);

        operations.push({
          updateOne: {
            filter: { _id: (p as any)._id },
            update: { $set: { price: finalPrice, originalPrice: finalPrice } }
          }
        });
      }

      console.log(`[recalculateProductPrices] Prepared ${operations.length} operations for category: ${categorySlug}`);
      if (operations.length > 0) {
        const result = await Product.bulkWrite(operations);
        console.log(`[recalculateProductPrices] Result: ${result.modifiedCount} updated`);
        return result.modifiedCount || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error recalculating prices:', error);
      throw error;
    }
  },

  async recalculateAllProducts(): Promise<number> {
    try {
      await dbConnect();
      const categories = await this.getCategories();
      const settings = await this.getGlobalSettings();
      const rate = settings.exchangeRate;
      
      let totalUpdated = 0;
      for (const cat of categories) {
        if (typeof cat.markupPercent === 'number') {
           const count = await this.recalculateProductPrices(cat.slug, cat.markupPercent, cat.markupFixed, rate);
           totalUpdated += count;
        }
      }
      return totalUpdated;
    } catch (error) {
      console.error('Error recalculating all products:', error);
      throw error;
    }
  },

  async logWebhook(service: string, method: string, payload: any, headers?: any): Promise<void> {
    try {
      await dbConnect();
      const WebhookLog = await this.getWebhookLogModel();
      
      const orderId = payload?.reference || payload?.external_payment_id || payload?.id;
      const status = payload?.status || payload?.state;

      await WebhookLog.create({
        service,
        method,
        payload,
        headers,
        orderId,
        status: status?.toString()
      });
    } catch (error) {
      console.error('DB Error [logWebhook]:', error);
      // Don't throw for logging failures to avoid breaking the main flow
    }
  },

  async getProductModel() {
    const Product = (await import('../models/Product')).default;
    return Product;
  },

  // Products logic
  async getProducts(): Promise<any[]> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      return await Product.find({}).lean();
    } catch (error) {
      console.error('DB Error [getProducts]:', error);
      throw error;
    }
  },

  async saveProducts(products: any[]): Promise<void> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      
      // We use upsert for each product to either update existing or create new
      const operations = products.map(p => ({
        updateOne: {
          filter: { id: p.id },
          update: { $set: p },
          upsert: true
        }
      }));

      if (operations.length > 0) {
        await Product.bulkWrite(operations);
      }

      // Auto-create missing categories
      const Category = await this.getCategoryModel();
      const distinctCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      
      for (const catSlug of distinctCategories) {
        const existing = await Category.findOne({ slug: catSlug });
        if (!existing) {
          console.log(`Auto-creating missing category: ${catSlug}`);
          await Category.create({
            id: `cat-${catSlug}`,
            slug: catSlug,
            name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1).replace(/-/g, ' '),
            image: `/images/categories/${catSlug}.png`, // Try to follow naming convention
            isMain: false,
            description: `Productos de la categoría ${catSlug}`
          }).catch(err => console.error(`Failed to auto-create category ${catSlug}:`, err));
        }
      }
    } catch (error) {
      console.error('DB Error [saveProducts]:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      await Product.deleteOne({ id });
    } catch (error) {
      console.error('DB Error [deleteProduct]:', error);
      throw error;
    }
  },

  async deleteProducts(ids: string[]): Promise<void> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      await Product.deleteMany({ id: { $in: ids } });
    } catch (error) {
      console.error('DB Error [deleteProducts]:', error);
      throw error;
    }
  },

  // Users logic
  async getUsers(): Promise<any[]> {
    try {
      await dbConnect();
      const User = await this.getUserModel();
      return await User.find({}).lean();
    } catch (error) {
      console.error('DB Error [getUsers]:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string): Promise<any | undefined> {
    try {
      await dbConnect();
      const User = await this.getUserModel();
      return await User.findOne({ email }).lean();
    } catch (error) {
      console.error('DB Error [getUserByEmail]:', error);
      throw error;
    }
  },

  async saveUser(userData: any): Promise<void> {
    try {
      await dbConnect();
      const User = await this.getUserModel();
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        await User.updateOne({ email: userData.email }, userData);
      } else {
        await User.create(userData);
      }
    } catch (error) {
      console.error('DB Error [saveUser]:', error);
      throw error;
    }
  }
};
