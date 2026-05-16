import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Scissors, User, Phone, CheckCircle, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { format, addDays, startOfDay, isBefore, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Barber {
  id: number;
  name: string;
  photo: string;
  specialty: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    barberId: null as number | null,
    serviceId: null as number | null,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersRes, servicesRes] = await Promise.all([
          api.get('/barbers'),
          api.get('/services')
        ]);
        setBarbers(barbersRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.time) return toast.error("Selecione um horário");
    setLoading(true);
    try {
      await api.post('/appointments', formData);
      toast.success("Agendamento realizado com sucesso!");
      setStep(5); // Success step
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao agendar");
    } finally {
      setLoading(false);
    }
  };

  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="min-h-screen bg-matte-black text-white p-6 md:p-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-premium-gold transition-colors mb-12 uppercase text-xs font-black tracking-widest">
        <ArrowLeft size={16} /> Voltar para o Início
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Reservar <span className="text-premium-gold">Horário</span></h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${step >= i ? 'bg-premium-gold' : 'bg-surface'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-gold" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: João Silva"
                      className="w-full bg-surface-dark border border-border-dim rounded-2xl py-4 pl-12 pr-4 focus:border-premium-gold outline-none transition-all placeholder:text-gray-700"
                      value={formData.clientName}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Seu Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-gold" size={18} />
                    <input 
                      type="tel" 
                      placeholder="(XX) XXXXX-XXXX"
                      className="w-full bg-surface-dark border border-border-dim rounded-2xl py-4 pl-12 pr-4 focus:border-premium-gold outline-none transition-all placeholder:text-gray-700"
                      value={formData.clientPhone}
                      onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <button 
                disabled={!formData.clientName || !formData.clientPhone}
                onClick={handleNext}
                className="w-full bg-white text-matte-black py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-premium-gold transition-all disabled:opacity-50"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Selecione o Serviço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setFormData({ ...formData, serviceId: s.id }); handleNext(); }}
                    className={`p-6 rounded-2xl border text-left flex justify-between items-center transition-all ${formData.serviceId === s.id ? 'border-gold-accent bg-gold-accent/5' : 'border-border-dim bg-surface-dark hover:border-border-accent'}`}
                  >
                    <div>
                      <div className="text-sm font-bold uppercase tracking-widest">{s.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{s.duration} min</div>
                    </div>
                    <div className="text-premium-gold font-black">R$ {s.price}</div>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="text-gray-500 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                <ChevronLeft size={16} /> Voltar
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Escolha o Barbeiro</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {barbers.map(b => (
                  <button 
                    key={b.id}
                    onClick={() => { setFormData({ ...formData, barberId: b.id }); handleNext(); }}
                    className={`p-6 rounded-3xl border transition-all text-center group ${formData.barberId === b.id ? 'border-gold-accent bg-gold-accent/5' : 'border-border-dim bg-surface-dark hover:border-border-accent'}`}
                  >
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/10 group-hover:border-gold-accent/30">
                      <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest">{b.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{b.specialty}</div>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="text-gray-500 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                <ChevronLeft size={16} /> Voltar
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Data e Horário</h3>
              
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {days.map(day => (
                  <button 
                    key={day.toISOString()}
                    onClick={() => setFormData({ ...formData, date: format(day, 'yyyy-MM-dd'), time: '' })}
                    className={`shrink-0 p-4 rounded-2xl border transition-all text-center min-w-[80px] ${formData.date === format(day, 'yyyy-MM-dd') ? 'border-gold-accent bg-gold-accent/5' : 'border-border-dim bg-surface-dark hover:border-border-accent'}`}
                  >
                    <div className="text-[10px] uppercase tracking-tighter text-gray-500 mb-1">
                      {format(day, 'EEE', { locale: ptBR })}
                    </div>
                    <div className="text-lg font-black">{format(day, 'dd')}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {timeSlots.map(t => (
                  <button 
                    key={t}
                    onClick={() => setFormData({ ...formData, time: t })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.time === t ? 'border-gold-accent bg-gold-accent text-matte-black' : 'border-border-dim bg-surface-dark hover:border-border-accent'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <button 
                  disabled={!formData.time || loading}
                  onClick={handleSubmit}
                  className="w-full bg-gold-accent text-matte-black py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Confirmando...' : 'Finalizar Agendamento'}
                </button>
                <button onClick={handleBack} className="text-gray-500 uppercase text-[10px] font-black tracking-widest flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Voltar
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Agendado com Sucesso!</h2>
              <p className="text-gray-400 mb-8 uppercase tracking-widest text-xs">
                {formData.clientName}, seu horário foi reservado em {format(new Date(formData.date), "dd 'de' MMMM", { locale: ptBR })} às {formData.time}h.
              </p>
              <Link to="/" className="inline-block bg-white text-matte-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-premium-gold transition-all">
                Voltar para o Início
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
