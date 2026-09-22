import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function StatCounter({ n, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * n));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(n);
    }
    requestAnimationFrame(tick);
  }, [inView, n]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-extrabold text-4xl">{value.toLocaleString()}{suffix}</p>
      <p className="text-xs opacity-70 mt-2">{label}</p>
    </div>
  );
}
