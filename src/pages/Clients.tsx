import { useState, useEffect } from 'react';
import { Users, Search, Phone, Calendar, Star, MoreVertical } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Client {
  id: number;
  name: string;
  phone: string;
  visits: number;
  last_visit: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (error) {
        toast.error("Erro ao carregar clientes");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  if (loading) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Base de <span className="text-premium-gold">Clientes</span></h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1">Gerencie a fidelidade dos seus clientes.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou telefone..."
            className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-premium-gold outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="p-6 bg-surface rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-premium-gold/20 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-matte-black border border-white/5 flex items-center justify-center relative">
                <Users size={24} className="text-gray-700" />
                {client.visits >= 5 && (
                  <div className="absolute -top-2 -right-2 bg-premium-gold text-matte-black p-1 rounded-full">
                    <Star size={10} fill="currentColor" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold uppercase tracking-widest leading-none mb-2">{client.name}</div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest">
                    <Phone size={10} /> {client.phone}
                  </div>
                   <div className="flex items-center gap-1 text-[10px] text-premium-gold uppercase tracking-widest font-black">
                    <Star size={10} /> {client.visits} Visitas
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12 w-full md:w-auto justify-between">
              <div className="text-left md:text-right">
                <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Último Atendimento</div>
                <div className="text-xs font-bold uppercase tracking-widest">
                  {client.last_visit ? new Date(client.last_visit).toLocaleDateString('pt-BR') : 'Sem registros'}
                </div>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-20 bg-surface rounded-3xl border border-white/5 border-dashed">
            <Users className="mx-auto text-gray-800 mb-4" size={48} />
            <p className="text-gray-500 uppercase text-xs tracking-widest">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
