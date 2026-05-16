'use client';

import React, { useState, useEffect } from 'react';
import { FaCode, FaHistory, FaCheckCircle, FaExclamationTriangle, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Log {
  _id: string;
  service: string;
  method: string;
  payload: any;
  headers?: any;
  timestamp: string;
  orderId?: string;
  status?: string;
}

export default function WebhookAuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin/webhooks');
      const data = await resp.json();
      if (data.success) {
        setLogs(data.logs);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => 
    (l.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.service || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse font-medium">Cargando auditoría...</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="admin-v2-page-title mb-1">Auditoría de Pagos</h1>
          <p className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
             Registro técnico de comunicaciones con pasarelas de pago (Nave, Andreani, etc.)
          </p>
        </div>

        {/* Filters */}
        <div className="admin-v2-card p-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="text" 
              placeholder="Buscar por ID de Orden o Estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm transition focus:border-[#058c8c] focus:bg-white font-medium"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="admin-v2-card overflow-hidden mb-20 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-6 py-5">Fecha / Hora</th>
                  <th className="px-6 py-5">Servicio</th>
                  <th className="px-6 py-5">Referencia</th>
                  <th className="px-6 py-5">Estado Recibido</th>
                  <th className="px-6 py-5 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr className={`hover:bg-gray-50/30 transition-all cursor-pointer ${expandedId === log._id ? 'bg-gray-50/50' : ''}`} onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-900 leading-tight">
                            {new Date(log.timestamp).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                          {log.service}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-bold text-gray-700 tracking-tight">#{log.orderId || '---'}</span>
                      </td>
                      <td className="px-6 py-5">
                        {log.status ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                            ['approved', 'paid', 'success', 'success_processed'].includes(log.status.toLowerCase()) 
                            ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'
                          }`}>
                            {log.status}
                          </span>
                        ) : (
                          <span className="text-[9px] text-gray-300 italic">No disponible</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-gray-300 hover:text-[#058c8c] transition-colors">
                          {expandedId === log._id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail */}
                    {expandedId === log._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-6 py-6 border-inner border-gray-200">
                          <div className="bg-[#1e293b] rounded-lg p-5 shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                  <FaCode /> Datos Crudos Recibidos (JSON)
                               </span>
                            </div>
                            <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                            {log.headers && (
                              <div className="mt-6 pt-6 border-t border-slate-700">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-4">Headers</span>
                                <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.headers, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
