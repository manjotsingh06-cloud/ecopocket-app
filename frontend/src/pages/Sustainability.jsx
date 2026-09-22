import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Reveal from '../components/ui/Reveal';
import StatCounter from '../components/ui/StatCounter';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const STATS = [
  { n: 12500, suffix: '+', label: 'Plastic Bags Saved' },
  { n: 38, suffix: '%', label: 'Carbon Footprint Reduced' },
  { n: 500, suffix: '+', label: 'Reuse Cycles per Pocket' },
  { n: 4, suffix: '', label: 'Sustainable Materials Used' },
  { n: 65000, suffix: '+', label: 'Litres of Water Saved' },
];

const materialData = {
  labels: ['Organic Cotton', 'Hemp', 'Linen', 'Recycled Cotton'],
  datasets: [{ data: [40, 25, 15, 20], backgroundColor: ['#8BA888', '#7B5B43', '#C9D9C2', '#1F3D2B'], borderWidth: 0 }],
};

const yearlyImpact = {
  labels: ['2022', '2023', '2024', '2025', '2026'],
  datasets: [{ label: 'Plastic bags saved (thousands)', data: [1.2, 3.4, 6.8, 9.5, 12.5], backgroundColor: '#8BA888', borderRadius: 6 }],
};

export default function Sustainability() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">Sustainability dashboard</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft">Our impact, measured</h1>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="glass rounded-2xl p-6">
              <StatCounter {...s} />
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal className="glass rounded-2xl p-8">
            <h3 className="font-display font-semibold mb-6">Materials used across our catalogue</h3>
            <Doughnut data={materialData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </Reveal>
          <Reveal delay={0.1} className="glass rounded-2xl p-8">
            <h3 className="font-display font-semibold mb-6">Plastic bags saved, year over year</h3>
            <Bar data={yearlyImpact} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="glass rounded-2xl p-8 mt-8">
          <h3 className="font-display font-semibold mb-3">Circular economy</h3>
          <p className="text-sm opacity-70 leading-relaxed max-w-3xl">
            Fabric off-cuts from larger products are repurposed into smaller accessories like cutlery holders, and
            end-of-life pockets are accepted back into the studio for fibre recovery — keeping material in use rather
            than in landfill.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
