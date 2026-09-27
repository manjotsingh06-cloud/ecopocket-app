import Reveal from '../components/ui/Reveal';
import { FiRefreshCw, FiDroplet, FiFeather, FiHeart } from 'react-icons/fi';

const POINTS = [
  { icon: FiRefreshCw, title: 'Zero Waste Dining', text: 'Every pocket replaces hundreds of single-use wraps and bags across its lifetime, cutting kitchen waste at the source.' },
  { icon: FiFeather, title: 'Sustainable Fabrics', text: 'Organic cotton, hemp, linen, and recycled cotton — chosen for durability and a lighter footprint than synthetics.' },
  { icon: FiHeart, title: 'Conscious Design', text: 'Every seam and pattern is chosen deliberately, so sustainable choices feel considered rather than compromised.' },
  { icon: FiDroplet, title: 'Real Benefits', text: 'Machine washable, food-safe, and built for 500+ reuse cycles — practical enough for daily life.' },
];

export default function About() {
  return (
    <div className="page-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">About the project</p>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-forest dark:text-cream mb-6">Fabric, folded with purpose</h1>
          <p className="text-forest/85 dark:text-cream/80 text-base leading-relaxed">
            EcoPocket is a sustainable textile project that replaces single-use food packaging with quilted, washable fabric pockets.
            Every pocket is layered from organic cotton, hemp, or recycled fibres, quilted by hand, and finished with a food-safe
            inner lining — built to be reused thousands of times instead of thrown away once.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="glass rounded-2xl p-7">
              <div className="w-11 h-11 rounded-full bg-sage/15 dark:bg-sage/25 flex items-center justify-center mb-4">
                <p.icon className="text-sage dark:text-sage-soft" size={18} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-forest dark:text-cream">{p.title}</h3>
              <p className="text-sm text-forest/75 dark:text-cream/70 leading-relaxed">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
