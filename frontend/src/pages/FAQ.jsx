import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Reveal from '../components/ui/Reveal';

const FAQS = [
  { q: 'What fabrics are used?', a: 'We use organic cotton, hemp, linen, and recycled cotton for the outer layer, with cotton or bamboo batting inside and a certified food-safe inner lining.' },
  { q: 'Is it food-safe?', a: "Yes — every pocket's inner lining is certified food-safe and free from PFAS and other harmful coatings." },
  { q: 'Is it washable?', a: 'All EcoPocket products are washable; most are machine washable on a gentle cycle, while a few delicate styles recommend hand washing.' },
  { q: 'How long does it last?', a: 'With normal daily use and washing, an EcoPocket is designed to last 500+ wash-and-reuse cycles — roughly two to three years of everyday use.' },
  { q: 'Can it replace plastic packaging?', a: 'Yes — EcoPocket is designed as a direct, reusable replacement for cling film, sandwich bags, and other single-use food packaging.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Reveal className="text-center mb-14">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">FAQ</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft">Common questions</h1>
        </Reveal>

        <div>
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b border-forest/10 dark:border-white/10 py-5">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between text-left font-display font-semibold">
                {f.q}
                <motion.span animate={{ rotate: openIndex === i ? 45 : 0 }} className="text-earth text-xl">
                  <FiPlus />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="text-sm opacity-70 leading-relaxed pt-3">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
