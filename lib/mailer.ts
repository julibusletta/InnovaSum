import nodemailer from 'nodemailer';
import path from 'path';
import { logToFile } from './logger';

/**
 * Mailer utility using nodemailer
 * Handles sending purchase confirmation and status update emails
 */

const BASE_URL = 'https://www.innovasum.com.ar';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'), 
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug logs
  logger: true // Log to console
});

export const mailer = {
  async sendPurchaseConfirmation(to: string, userName: string, orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 0; background-color: #f7fafc; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
          .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #edf2f7; }
          .content { padding: 40px; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #edf2f7; }
          .button { display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 25px; }
          .order-id { color: #2563eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
             <img src="cid:logo" alt="Innovasum" style="max-height: 80px; width: auto; display: block; margin: 0 auto;" />
          </div>
          <div class="content">
            <h1 style="margin-top: 0; color: #1a202c; font-size: 24px; text-align: center;">¡Gracias por tu compra!</h1>
            <p style="font-size: 16px; color: #4a5568; text-align: center;">Hola <strong>${userName}</strong>, hemos recibido tu pedido y está siendo procesado.</p>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin: 25px 0; border: 1px solid #edf2f7;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #718096; font-size: 14px;">Número de pedido:</span>
                <span class="order-id">#${orderDetails.id.substring(0, 12).toUpperCase()}</span>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #edf2f7;">
                  <th style="padding: 12px; text-align: left; color: #718096; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Producto</th>
                  <th style="padding: 12px; text-align: right; color: #718096; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.items.map((item: any) => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #edf2f7;">
                      <div style="font-weight: 600; color: #2d3748; font-size: 14px;">${item.name}</div>
                      <div style="font-size: 11px; color: #a0aec0;">Cantidad: ${item.quantity}</div>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #2d3748; font-weight: 700;">
                      $${item.price.toLocaleString('es-AR')}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 20px 12px 12px; font-weight: 900; font-size: 18px; color: #1a202c;">TOTAL</td>
                  <td style="padding: 20px 12px 12px; font-weight: 900; font-size: 20px; text-align: right; color: #2563eb;">$${orderDetails.total.toLocaleString('es-AR')}</td>
                </tr>
              </tfoot>
            </table>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${BASE_URL}/mi-cuenta/compras" style="display: inline-block; padding: 14px 28px; background-color: #1e293b; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Gestionar mi pedido</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 5px;"><strong>Innovasum - Tecnología a un solo clic</strong></p>
            <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Innovasum. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"Innovasum" <${process.env.EMAIL_USER}>`,
        to,
        bcc: process.env.EMAIL_USER,
        subject: `Confirmación de pedido #${orderDetails.id} - Innovasum`,
        html,
        attachments: [{
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logotest9.png'),
          cid: 'logo'
        }]
      });
      logToFile(`Purchase confirmation sent to ${to} for #${orderDetails.id}`);
    } catch (e: any) {
      logToFile(`ERROR sending confirmation to ${to}`, e.message);
    }
  },

  async sendTransferOrderReceived(to: string, userName: string, orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Montserrat', sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .wrapper { max-width: 650px; margin: 20px auto; background: #ffffff; border: 1px solid #eee; }
          .header { border-bottom: 2px solid #f4f4f4; padding: 25px; text-align: left; }
          .body { padding: 30px; }
          .title { font-size: 22px; font-weight: 900; margin-bottom: 20px; color: #000; }
          .info-grid { display: table; width: 100%; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 25px; }
          .info-col { display: table-cell; width: 50%; vertical-align: top; font-size: 13px; }
          .label { font-weight: bold; color: #666; margin-bottom: 4px; }
          .val { font-weight: 800; color: #000; margin-bottom: 12px; text-transform: uppercase; }
          .step-box { background: #fff; border: 1px solid #eee; padding: 20px; margin-bottom: 20px; }
          .step-num { display: inline-block; width: 28px; height: 28px; background: #666; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 15px; font-size: 14px; }
          .bank-grid { background: #fafafa; border: 1px solid #eee; padding: 25px; margin: 25px 0; }
          .bank-item { margin-bottom: 15px; }
          .bank-label { font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 1px; }
          .bank-val { font-size: 14px; font-weight: 900; color: #000; font-family: monospace; }
          .product-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
          .product-table th { background: #f9f9f9; padding: 12px; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; border-bottom: 2px solid #eee; }
          .product-table td { padding: 15px 12px; border-bottom: 1px solid #f4f4f4; font-size: 13px; }
          .total-row { background: #f9f9f9; font-weight: 900; font-size: 16px; }
          .footer { padding: 20px; background: #fafafa; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <img src="cid:logo" alt="Innovasum" style="max-height: 100px; width: auto; display: block;" />
          </div>
          <div class="body">
            <h1 class="title">Hola ${userName}!</h1>
            <p style="font-size: 14px; color: #666;">Detalle de Pedido: <strong>#${orderDetails.id.split('-').pop()}</strong></p>
            
            <div class="info-grid">
              <div class="info-col">
                <div class="label">Nombre:</div><div class="val">${userName}</div>
                <div class="label">Forma de Pago:</div><div class="val">Transferencia Bancaria</div>
              </div>
              <div class="info-col">
                <div class="label">Email:</div><div class="val">${orderDetails.userEmail}</div>
                <div class="label">Método de Envío:</div><div class="val">${orderDetails.shippingAddress?.shippingMethod || 'Logística JB'}</div>
              </div>
            </div>

            <div class="step-box">
              <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <span class="step-num">1</span>
                <p style="margin: 0; font-size: 13px;"><strong>Realiza la transferencia dentro de las 48 horas</strong> posteriores a tu compra. Vencido este plazo, la reserva será cancelada automáticamente.</p>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span class="step-num">2</span>
                <p style="margin: 0; font-size: 13px;"><strong>Adjunta el comprobante</strong> desde tu panel de usuario o respondiendo a este correo para que podamos validar el pago y despachar tu pedido.</p>
              </div>
            </div>

            <h3 style="font-size: 16px; font-weight: 900; margin-top: 40px; border-bottom: 1px solid #000; padding-bottom: 10px;">DATOS BANCARIOS</h3>
            <div class="bank-grid">
              <div class="bank-item">
                <div class="bank-label">Banco:</div>
                <div class="bank-val">BANCO GALICIA</div>
              </div>
              <div class="bank-item">
                <div class="bank-label">Titular:</div>
                <div class="bank-val uppercase">JULIAN BUSLETTA</div>
              </div>
              <div class="bank-item">
                <div class="bank-label">C.B.U:</div>
                <div class="bank-val">0070695330004003192534</div>
              </div>
              <div class="bank-item">
                <div class="bank-label">Alias:</div>
                <div class="bank-val uppercase">innovasum.galicia</div>
              </div>
              <div class="bank-item">
                <div class="bank-label">CUIT:</div>
                <div class="bank-val">20-37991025-5</div>
              </div>
              <div style="margin-top: 25px; border-top: 1px dashed #ddd; padding-top: 15px;">
                <div class="bank-label" style="color: #000; font-size: 11px;">Monto total a transferir:</div>
                <div style="font-size: 28px; font-weight: 900; color: #2563eb;">$${orderDetails.total.toLocaleString('es-AR')}</div>
              </div>
            </div>

            <table class="product-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style="text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.items.map((item: any) => `
                  <tr>
                    <td><strong>${item.name}</strong><br/><span style="color: #999; font-size: 11px;">Cantidad: ${item.quantity}</span></td>
                    <td style="text-align: right; font-weight: 700;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td style="padding: 20px;">TOTAL FINAL</td>
                  <td style="padding: 20px; text-align: right; color: #2563eb;">$${orderDetails.total.toLocaleString('es-AR')}</td>
                </tr>
              </tbody>
            </table>

            <div style="text-align: center; margin-top: 40px;">
              <p style="font-size: 12px; color: #999; margin-bottom: 20px;">Puedes seguir tu envío fácilmente desde tu cuenta</p>
              <a href="${BASE_URL}/mi-cuenta/compras" style="display: inline-block; padding: 18px 35px; background: #000; color: #fff; text-decoration: none; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Ir a Mis Compras</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>Innovasum - Tecnología a un solo clic</strong></p>
            <p>Este es un mensaje automático. No hace falta responderlo salvo para adjuntar el comprobante.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"Innovasum" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Pendiente de Pago: Reserva #${orderDetails.id.split('-').pop()} - Innovasum`,
        html,
        attachments: [{
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logotest9.png'),
          cid: 'logo'
        }]
      });
      logToFile(`Transfer order email sent to ${to} for #${orderDetails.id}`);
    } catch (e: any) {
      logToFile(`ERROR sending transfer email to ${to}`, e.message);
    }
  },

  async notifyAdminProofUploaded(orderId: string, userName: string) {
    const html = `
      <div style="font-family: sans-serif; padding: 30px; border: 1px solid #eee; max-width: 500px;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
          <img src="cid:logo" alt="Innovasum" style="max-height: 60px; width: auto;" />
        </div>
        <h2 style="color: #2563eb;">¡Nuevo Comprobante Recibido!</h2>
        <p>Se ha subido un nuevo comprobante para la orden <strong>#${orderId}</strong>.</p>
        <p><strong>Cliente:</strong> ${userName}</p>
        <div style="margin-top: 30px;">
          <a href="${BASE_URL}/admin/orders" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px;">Ver en Panel Admin</a>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Sistema Innovasum" <${process.env.EMAIL_USER}>`,
        to: "contacto@innovasum.com.ar, ventas@innovasum.com.ar",
        subject: `URGENTE: Comprobante subido - Orden #${orderId}`,
        html,
        attachments: [{
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logotest9.png'),
          cid: 'logo'
        }]
      });
      logToFile(`Admin notification sent for proof on #${orderId}`);
    } catch (e: any) {
      logToFile(`ERROR sending admin notification`, e.message);
    }
  },

  async notifyAdminFavoriteAdded(userName: string, userEmail: string, product: { id: string, name: string }) {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; max-width: 550px; margin: 20px auto;">
        <div style="text-align: center; margin-bottom: 30px;">
           <h2 style="color: #111827; font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">¡Producto Favorito! ⭐</h2>
           <div style="height: 4px; width: 40px; background: #0066cc; margin: 0 auto;"></div>
        </div>
        
        <p style="color: #4b5563; font-size: 15px; text-align: center; margin-bottom: 30px;">Un cliente ha marcado un producto con estrella. Esto indica un fuerte interés de compra.</p>
        
        <div style="background: white; padding: 25px; border-radius: 10px; border: 1px solid #f3f4f6; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="margin-bottom: 20px;">
            <div style="font-size: 11px; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Producto</div>
            <div style="font-size: 16px; color: #111827; font-weight: 700;">${product.name}</div>
            <div style="font-size: 12px; color: #6b7280;">ID: ${product.id}</div>
          </div>
          
          <div style="border-top: 1px solid #f3f4f6; padding-top: 15px;">
            <div style="font-size: 11px; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Interesado</div>
            <div style="font-size: 15px; color: #111827; font-weight: 600;">${userName}</div>
            <div style="font-size: 13px; color: #0066cc;">${userEmail}</div>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${BASE_URL}/admin/products" style="display: inline-block; background: #111827; color: white; padding: 12px 24px; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-radius: 6px;">Ver Catálogo</a>
        </div>
        
        <div style="margin-top: 35px; text-align: center; color: #9ca3af; font-size: 11px;">
           Innovasum Dashboard • Notificaciones Automáticas
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Favoritos JB" <${process.env.EMAIL_USER}>`,
        to: "contacto@innovasum.com.ar, ventas@innovasum.com.ar",
        subject: `Interés: ${userName} marcó un favorito ⭐`,
        html,
        attachments: [{
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logotest9.png'),
          cid: 'logo'
        }]
      });
      logToFile(`Admin favorite notification sent for ${product.name}`);
    } catch (e: any) {
      logToFile(`ERROR sending admin favorite notification`, e.message);
    }
  },

  async sendAbandonedCartRecovery(to: string, userName: string, orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 0; background-color: #f7fafc; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
          .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #edf2f7; }
          .content { padding: 40px; }
          .footer { background-color: #f8fafc; padding: 25px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #edf2f7; }
          .button { display: inline-block; padding: 16px 32px; background-color: #058c8c; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin: 30px 0; text-transform: uppercase; letter-spacing: 1px; }
          .highlight { color: #058c8c; font-weight: bold; }
          .product-box { background: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #edf2f7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
             <img src="cid:logo" alt="Innovasum" style="max-height: 70px; width: auto; display: block; margin: 0 auto;" />
          </div>
          <div class="content">
            <h1 style="margin-top: 0; color: #1a202c; font-size: 22px; text-align: center; font-weight: 800;">¿TE AYUDAMOS CON TU PEDIDO?</h1>
            <p style="font-size: 16px; color: #4a5568; text-align: center;">¡Hola <strong>${userName}</strong>! 👋</p>
            
            <p style="font-size: 15px; color: #4a5568;">Te escribimos de <strong>Innovasum</strong> porque notamos que estuviste a punto de llevarte tu nuevo equipo el día de hoy, pero la compra no llegó a completarse.</p>
            
            <p style="font-size: 15px; color: #4a5568;">A veces surgen dudas de último momento o fallas técnicas, y no queremos que te quedes con las ganas. Te comentamos que el stock de tu selección es <span class="highlight">limitado y se agota rápido</span>, por lo que te reservamos tu unidad por un tiempo breve:</p>

            <div class="product-box">
               <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: bold; color: #a0aec0; text-transform: uppercase; letter-spacing: 1px;">Tu selección:</p>
               ${orderDetails.items.map((item: any) => `
                 <div style="font-size: 14px; color: #2d3748; font-weight: 600; margin-bottom: 5px;">• ${item.name} (x${item.quantity})</div>
               `).join('')}
            </div>

            <div style="text-align: center;">
              <a href="${BASE_URL}/mi-cuenta/compras" class="button">Retomar mi compra ahora</a>
            </div>

            <p style="font-size: 14px; color: #4a5568; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 20px;">
              <strong>¿Tuviste algún problema con el pago o necesitás asesoramiento técnico?</strong><br/>
              No dudes en responder a este mail o escribirnos por <strong>WhatsApp</strong>. Estamos en línea para darte una mano al instante y asegurar que elijas lo mejor para vos.
            </p>

            <p style="font-size: 14px; text-align: center; color: #4a5568; font-weight: 700; margin-top: 30px;">¡Esperamos que puedas disfrutar de tu nuevo producto pronto!</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 5px;"><strong>Innovasum - Tecnología a un solo clic</strong></p>
            <p>Este es un recordatorio de cortesía sobre tu pedido pendiente #${orderDetails.id.slice(-8).toUpperCase()}.</p>
            <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} Innovasum. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"Innovasum" <${process.env.EMAIL_USER}>`,
        to,
        subject: `¿Te ayudamos con tu pedido? El stock de tu selección es limitado 👋⚡`,
        html,
        attachments: [{
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'images', 'logotest9.png'),
          cid: 'logo'
        }]
      });
      logToFile(`Abandoned cart recovery email sent to ${to} for #${orderDetails.id}`);
      return { success: true };
    } catch (e: any) {
      logToFile(`ERROR sending recovery email to ${to}`, e.message);
      return { success: false, error: e.message };
    }
  }
};

