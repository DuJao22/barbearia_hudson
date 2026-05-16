import { motion } from 'motion/react';
import { Scissors, Calendar, Star, MapPin, Phone, Instagram, Facebook, Clock, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const reviews = [
  { text: "Ótimo local atendimento de primeira profissionais de primeira show de bola", author: "Cliente Google" },
  { text: "O melhor salão pra homens do Monte Castelo!!!", author: "Cliente Google" },
  { text: "Atendimento ímpar ambiente agradável sou cliente desde 1999 no mínimo", author: "Cliente Google" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-matte-black text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Scissors className="text-premium-gold w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter uppercase">Hudson</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#inicio" className="hover:text-premium-gold transition-colors">Início</a>
          <a href="#sobre" className="hover:text-premium-gold transition-colors">Sobre</a>
          <a href="#servicos" className="hover:text-premium-gold transition-colors">Serviços</a>
          <a href="#contato" className="hover:text-premium-gold transition-colors">Contato</a>
        </div>
        <Link to="/agendar" className="bg-premium-gold text-matte-black px-6 py-2 rounded-full font-bold uppercase text-xs tracking-tighter hover:scale-105 transition-transform active:scale-95">
          Agendar Agora
        </Link>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Barbershop Atmosphere" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-black uppercase mb-4 tracking-tighter leading-none">
              Barbearia do <span className="gold-text">Hudson</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 font-light tracking-wide uppercase">
              Excelência e tradição em corte masculino desde 1999. Onde o estilo encontra a perfeição.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link to="/agendar" className="bg-premium-gold text-matte-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                Garanta seu Horário
              </Link>
              <div className="flex items-center gap-2 px-6 py-4 glass rounded-full">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-matte-black bg-gray-700" />
                  ))}
                </div>
                <div className="text-left leading-none">
                  <div className="flex items-center gap-1 text-premium-gold mb-1">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">4.8</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">242+ Avaliações</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-12 glass border-y border-premium-gold/20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="text-premium-gold mb-2" />
            <span className="text-2xl font-bold">10k+</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Clientes</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="text-premium-gold mb-2" />
            <span className="text-2xl font-bold">25 Anos</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Experiência</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="text-premium-gold mb-2" />
            <span className="text-2xl font-bold">Nota 4.8</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">No Google</span>
          </div>
          <div className="flex flex-col items-center">
            <Scissors className="text-premium-gold mb-2" />
            <span className="text-2xl font-bold">Premium</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Atendimento</span>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="sobre" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-12 text-center tracking-tighter">O que nossos <span className="text-premium-gold">clientes</span> dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-surface-dark rounded-3xl border border-border-dim relative"
              >
                <div className="flex gap-1 text-premium-gold mb-4">
                  {[1,2,3,4,5].map(j => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 italic mb-4 leading-relaxed font-light">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center">
                    <Users size={20} className="text-premium-gold" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{r.author}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none">Nossos <span className="gold-text">Serviços</span></h2>
              <p className="text-gray-400 uppercase text-xs tracking-[0.2em]">O melhor cuidado para o seu visual.</p>
            </div>
            <Link to="/agendar" className="text-premium-gold font-bold uppercase text-xs tracking-widest border-b border-premium-gold pb-1 hover:opacity-80 transition-opacity">
              Ver todos os serviços
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Corte Masculino", price: "R$ 40", desc: "Corte moderno com finalização profissional." },
              { name: "Barba Completa", price: "R$ 30", desc: "Aparagem, contorno e hidratação de barba." },
              { name: "Corte + Barba", price: "R$ 60", desc: "O combo ideal para o homem moderno." },
            ].map((s, i) => (
              <div key={i} className="group p-8 bg-matte-black rounded-3xl border border-white/5 hover:border-premium-gold/50 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold uppercase tracking-tighter">{s.name}</h3>
                  <span className="text-premium-gold font-bold">{s.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed uppercase tracking-tighter">{s.desc}</p>
                <div className="h-px bg-white/5 w-full mb-6 group-hover:bg-premium-gold/30 transition-all" />
                <Link to="/agendar" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-white/50 group-hover:text-premium-gold transition-all">
                  Reservar <Calendar size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contato" className="bg-matte-black border-t border-white/5 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-20">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Scissors className="text-premium-gold w-10 h-10" />
                <span className="text-2xl font-black tracking-tighter uppercase">Hudson</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 uppercase tracking-tighter">
                Mais de 25 anos elevando o patamar da barbearia em Contagem. Onde o clássico encontra o contemporâneo.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-premium-gold transition-colors"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-premium-gold transition-colors"><Facebook size={18} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">Localização</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-premium-gold shrink-0" size={20} />
                  <p className="text-gray-400 text-sm leading-snug uppercase tracking-tighter">
                    R. Rio Hudson, 702<br />
                    Novo Riacho, Contagem - MG
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-premium-gold shrink-0" size={20} />
                  <p className="text-gray-400 text-sm uppercase tracking-tighter">(31) 99673-5806</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">Horários</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                <li className="flex justify-between"><span>Segunda - Sexta</span> <span className="text-white">09:00 - 19:00</span></li>
                <li className="flex justify-between"><span>Sábado</span> <span className="text-white">08:00 - 17:00</span></li>
                <li className="flex justify-between"><span>Domingo</span> <span className="text-premium-gold">Fechado</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-[10px] text-gray-600 uppercase tracking-[0.5em]">
            © 2024 Barbearia do Hudson • Desenvolvido com padrão Premium
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/5531996735806" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[60] bg-green-600 text-white p-4 rounded-full shadow-[0_10px_30px_rgba(22,163,74,0.4)] hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}
