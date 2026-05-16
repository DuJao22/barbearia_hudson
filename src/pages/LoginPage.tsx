import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } catch (error) {
      toast.error('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matte-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-premium-gold/10 rounded-2xl mb-6">
            <Scissors className="text-premium-gold" size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Painel <span className="text-premium-gold">Admin</span></h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Acesso restrito à equipe</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-premium-gold outline-none transition-all"
                placeholder="admin@barbearia.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-premium-gold outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-premium-gold text-matte-black py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] text-gray-600 uppercase tracking-widest">
          Esqueceu seu acesso? Contate o suporte.
        </p>
      </motion.div>
    </div>
  );
}
