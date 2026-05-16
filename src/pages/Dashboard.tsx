import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import api from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalClients: number;
  totalAppointments: number;
  todayAppointments: number;
  revenue: number;
  topServices: { name: string; count: number }[];
}

interface Appointment {
  id: number;
  clientName: string;
  clientPhone: string;
  barberName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/appointments')
      ]);
      setStats(statsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/appointments/${id}`, { status });
      toast.success(`Agendamento ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-premium-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { label: 'Clientes Total', value: stats?.totalClients, icon: Users, color: 'text-blue-500' },
    { label: 'Agendamentos', value: stats?.totalAppointments, icon: Calendar, color: 'text-purple-500' },
    { label: 'Hoje', value: stats?.todayAppointments, icon: Clock, color: 'text-orange-500' },
    { label: 'Faturamento', value: `R$ ${stats?.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold">Dashboard Geral</h2>
          <p className="text-xs text-neutral-500">Bem-vindo de volta, Hudson 👋</p>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-surface-light px-4 py-2 rounded-full border border-border-accent">
            <span className="text-gold-accent">★</span>
            <span className="text-sm font-bold">4.8</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">242 avaliações</span>
          </div>
          <button className="bg-white text-black text-sm font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-neutral-200 transition-colors uppercase tracking-widest">+ Novo Agendamento</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-dark p-6 px-10 rounded-3xl border border-border-dim">
          <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Agendamentos Hoje</p>
          <p className="text-3xl font-black">{stats?.todayAppointments}</p>
          <div className="text-[10px] text-green-500 mt-2 font-bold tracking-widest">+12% vs. ontem</div>
        </div>
        <div className="bg-surface-dark p-6 px-10 rounded-3xl border border-border-dim">
          <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Faturamento Total</p>
          <p className="text-3xl font-black">R$ {stats?.revenue.toFixed(0)}</p>
          <div className="text-[10px] text-neutral-500 mt-2 font-bold tracking-widest uppercase">Ticket médio: R$ 55</div>
        </div>
        <div className="bg-surface-dark p-6 px-10 rounded-3xl border border-border-dim">
          <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Total Clientes</p>
          <p className="text-3xl font-black">{stats?.totalClients}</p>
          <div className="text-[10px] text-green-500 mt-2 font-bold tracking-widest uppercase">Este mês</div>
        </div>
        <div className="bg-surface-dark p-6 px-10 rounded-3xl border border-border-dim">
          <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Serviço Top</p>
          <p className="text-3xl font-black whitespace-nowrap overflow-hidden text-ellipsis">{stats?.topServices[0]?.name || 'N/A'}</p>
          <div className="text-[10px] text-gold-accent mt-2 font-bold tracking-wider uppercase">Campeão de vendas</div>
        </div>
      </div>

      {/* Main Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Appointments Table */}
        <div className="lg:col-span-2 bg-surface-dark rounded-3xl border border-border-dim overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-dim flex justify-between items-center bg-[#141414]/50">
            <h3 className="font-bold flex items-center gap-2">
              <Clock size={16} className="text-gold-accent" /> Próximos Clientes
            </h3>
            <span className="text-xs text-gold-accent hover:underline cursor-pointer font-bold uppercase tracking-widest">Ver todos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-neutral-500 tracking-tighter border-b border-border-dim">
                  <th className="px-6 py-4">Horário</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Serviço</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {appointments.slice(0, 6).map((appt) => (
                  <tr key={appt.id} className="border-b border-border-dim hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-gold-accent font-bold">{appt.time}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{appt.clientName}</div>
                      <div className="text-[10px] text-neutral-500 uppercase tracking-tighter">{appt.clientPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 group-hover:text-white transition-colors">{appt.serviceName}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {appt.status === 'Agendado' && (
                          <button onClick={() => updateStatus(appt.id, 'Confirmado')} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-all uppercase">Confirmar</button>
                        )}
                        {appt.status !== 'Finalizado' && appt.status !== 'Cancelado' && (
                          <button onClick={() => updateStatus(appt.id, 'Finalizado')} className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20 hover:bg-green-500/20 transition-all uppercase underline">Finalizar</button>
                        )}
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest leading-none flex items-center ${
                          appt.status === 'Confirmado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          appt.status === 'Finalizado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          appt.status === 'Cancelado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gold-accent/10 text-gold-accent border-gold-accent/20'
                        }`}>
                          {appt.status}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Area */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-surface-light to-surface-dark p-6 rounded-3xl border border-border-dim">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-gold-accent" /> Destaque da Equipe
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-800 rounded-full border-2 border-gold-accent flex items-center justify-center text-xl shadow-lg shadow-amber-900/20">🧔</div>
              <div>
                <p className="font-bold text-sm leading-none mb-1">Hudson Oliveira</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Especialista desde 1999</p>
              </div>
              <div className="ml-auto text-gold-accent font-bold text-xs underline cursor-pointer">Agenda</div>
            </div>
          </div>

          <div className="bg-gold-accent text-black p-6 rounded-3xl relative overflow-hidden shadow-2xl shadow-amber-900/30">
            <div className="relative z-10">
              <h3 className="text-xl font-black leading-none mb-1">FIDELIDADE</h3>
              <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">Sistema de Pontos Ativo</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tighter">{stats?.totalClients}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Clientes Fiéis</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Scissors size={100} strokeWidth={1} />
            </div>
          </div>

          <div className="bg-surface-dark p-6 rounded-3xl border border-border-dim">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Metas Semanais</h3>
               <span className="text-xs font-bold text-gold-accent">82%</span>
             </div>
             <div className="flex items-end gap-2 h-20">
               {[40, 70, 30, 90, 100, 20, 10].map((h, i) => (
                 <div key={i} className="flex-1 bg-gold-accent/20 rounded-sm relative group">
                   <div 
                     className="absolute bottom-0 w-full bg-gold-accent rounded-sm transition-all group-hover:brightness-125" 
                     style={{ height: `${h}%` }}
                   />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
