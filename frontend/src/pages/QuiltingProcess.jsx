import Reveal from '../components/ui/Reveal';

const STEPS = [
  { t: 'Sustainable Fabric', d: 'Organic cotton, hemp, linen, or recycled cotton is sourced and inspected before anything is cut.' },
  { t: 'Cotton Batting', d: 'A breathable cotton or bamboo batting layer is added for insulation and structure.' },
  { t: 'Layering', d: 'Outer fabric, batting, and a food-safe inner lining are aligned and basted together.' },
  { t: 'Quilting', d: 'The layered panel is stitched in a diamond, square, or wave pattern for strength and texture.' },
  { t: 'Cutting', d: 'The finished quilted fabric is cut to the exact pattern for each pocket style.' },
  { t: 'Stitching', d: 'Edges are bound and sealed by hand for durability through hundreds of washes.' },
  { t: 'Finished Culinary Pocket', d: 'Each pocket is quality-checked, labelled, and packed in reusable cloth wrap.' },
];

export default function QuiltingProcess() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">Fabric development</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft mb-4">From raw fibre to finished pocket</h1>
          <p className="opacity-70 max-w-xl mx-auto">Every EcoPocket goes through seven deliberate stages of sustainable fabric development.</p>
        </Reveal>

        <div className="relative pl-2">
          <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-forest/15 dark:bg-white/15" />
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06} className="relative flex gap-6 mb-10">
              <div className="w-14 h-14 rounded-full bg-forest text-cream flex items-center justify-center font-display font-bold flex-shrink-0 z-10">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="glass rounded-2xl p-6 flex-1">
                <h3 className="font-display font-semibold text-lg mb-1.5">{s.t}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
