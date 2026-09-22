import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      const res = await api.post('/contact', data);
      setStatus({ ok: true, msg: res.data.message });
      reset();
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.message || 'Something went wrong — please try again.' });
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-14">
        <Reveal>
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">Contact</p>
          <h1 className="font-display font-bold text-3xl text-forest dark:text-sage-soft mb-8">Let's talk sustainable fabric</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Name" error={errors.name}>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="Your name" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" {...register('email', { required: 'Email is required' })} className="input" placeholder="you@example.com" />
            </Field>
            <Field label="Subject">
              <input {...register('subject')} className="input" placeholder="What's this about?" />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea {...register('message', { required: 'Message is required', minLength: { value: 5, message: 'Please write a bit more' } })} rows={4} className="input resize-none" placeholder="Tell us what you're looking for..." />
            </Field>
            <button disabled={isSubmitting} type="submit" className="px-7 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-earth transition-colors disabled:opacity-60">
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>
            {status && <p className={`text-sm ${status.ok ? 'text-sage' : 'text-red-500'}`}>{status.msg}</p>}
          </form>

          <div className="flex gap-3 mt-8">
            {[FiInstagram, FiTwitter, FiMail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-forest/15 dark:border-white/15 flex items-center justify-center hover:bg-sage/15 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="glass rounded-2xl flex items-center justify-center p-8 min-h-[320px]">
          <svg viewBox="0 0 300 240" width="85%">
            <rect x="10" y="10" width="280" height="220" rx="14" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
            <path d="M20 150 Q100 100 160 140 T280 110" stroke="#8BA888" strokeWidth="2" fill="none" />
            <circle cx="160" cy="120" r="8" fill="#7B5B43" />
            <text x="150" y="100" fontSize="11" fill="currentColor" fontFamily="Poppins" textAnchor="middle">EcoPocket Studio</text>
          </svg>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
