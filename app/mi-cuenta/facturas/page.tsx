import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InvoicesManager from "@/app/components/Profile/InvoicesManager";

export default async function FacturasPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const invoiceOrders = userOrders.filter((order: any) => 
    (order.status === 'APPROVED' || order.status === 'SHIPPED' || order.status === 'DELIVERED') && 
    order.invoiceUrl
  );
  const sortedOrders = invoiceOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-8">
        <div>
          <h1 className="text-4xl font-light text-slate-500 tracking-tight uppercase m-0 border-b border-gray-100 pb-4">ESTADO DE LA COMPRA</h1>
          <p className="text-blue-500 text-sm mt-3 font-normal uppercase tracking-tight">Mis Facturas</p>
        </div>
      </div>

      <InvoicesManager orders={JSON.parse(JSON.stringify(sortedOrders))} />

      {/* Footer Info Block */}
      <div className="mt-20 pt-10 border-t border-gray-100">
        <div className="bg-gray-50/50 rounded-2xl p-8 md:p-12 border border-gray-100">
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight font-sans">Información sobre Facturación</h3>
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
              <p>
                Si no ves tu factura aquí o necesitás cambiarla, escribinos a <strong><a href="mailto:contacto@innovasum.com.ar" className="text-blue-600 hover:underline">contacto@innovasum.com.ar</a></strong> con los siguientes datos:
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li>Número de factura o número de compra (JB-XXXXX)</li>
                <li>Número de CUIT para la nueva factura</li>
                <li>Número y tipo de inscripción en Ingresos Brutos</li>
                <li>Tené en cuenta que somos agentes de percepción de ingresos brutos y podrías, en caso que la AGIP lo determine, tener que abonar un adicional.</li>
              </ul>
              <p className="italic text-gray-400 text-xs mt-8 font-sans">
                * Las facturas se generan y adjuntan manualmente por nuestro equipo administrativo una vez validado el pago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
