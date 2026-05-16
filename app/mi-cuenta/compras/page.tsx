import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OrdersManager from "@/app/components/Profile/OrdersManager";
import StatusChecker from '@/app/components/Checkout/StatusChecker';
import { Suspense } from 'react';

export default async function MisComprasPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-in fade-in duration-700">
      <Suspense fallback={null}>
        <StatusChecker />
      </Suspense>
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-8">
        <div>
          <h1 className="text-4xl font-light text-slate-500 tracking-tight uppercase m-0 border-b border-gray-100 pb-4">ESTADO DE LA COMPRA</h1>
          <p className="text-blue-500 text-sm mt-3 font-normal uppercase tracking-tight">Mis compras</p>
        </div>
      </div>

      <OrdersManager orders={JSON.parse(JSON.stringify(sortedOrders))} />
    </div>
  );
}
