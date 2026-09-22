import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMic, FiZap, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { PRODUCTS, formatPrice } from '../../data/products';

const QUICK_PROMPTS = [
  'Recommend for office lunch',
  'How to keep chapatis warm?',
  'Washing & care instructions',
  'What fabrics do you use?',
  'Best for snacks on the go',
  'Under ₹1,000 products',
];

const INITIAL_BOT_MESSAGE = {
  role: 'bot',
  text: "Hello! I'm EcoBot 🌿 — your smart zero-waste shopping assistant. Ask me anything about our 24 handcrafted products, fabrics, care instructions, or budget recommendations!",
};

export default function EcoBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Clean markdown/emojis for speech
        const cleanText = text.replace(/[*_#`]/g, '').slice(0, 200);
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        // Ignore speech synthesis errors if disabled
      }
    }
  };

  // Smart Offline Knowledge & Decision Engine
  const generateBotReply = (rawInput) => {
    const q = rawInput.toLowerCase().trim();

    // 1. Greetings
    if (/^(hi|hello|hey|greetings|hola|namaste|good morning|good evening|good afternoon)/.test(q)) {
      return {
        text: "Hi there! 🌿 How can I help you live more sustainably today? You can ask me for product recommendations, fabric advice, washing tips, or gifts under a budget!",
      };
    }

    // 2. Budget / Price queries (e.g. "under 1000", "cheap", "budget", "affordable")
    if (q.includes('under 1000') || q.includes('under 1k') || q.includes('under 800') || q.includes('budget') || q.includes('affordable') || q.includes('cheap')) {
      const budgetMax = q.includes('800') ? 800 : 1000;
      const affordable = PRODUCTS.filter((p) => p.price <= budgetMax).slice(0, 4);
      return {
        text: `Here are our best sustainable picks under ₹${budgetMax}:`,
        products: affordable,
      };
    }

    // 3. Chapati / Roti / Warm food questions
    if (q.includes('chapati') || q.includes('roti') || q.includes('flatbread') || q.includes('keep warm') || q.includes('casserole') || q.includes('paratha')) {
      const warmPicks = PRODUCTS.filter((p) =>
        ['chapati-pocket', 'insulated-casserole-cover', 'tiffin-tote'].includes(p.slug)
      );
      return {
        text: "For keeping chapatis and warm food soft and hot, our **Chapati Pocket** (insulated with natural bamboo batting) and **Insulated Casserole Cover** are specifically designed to retain heat without trapping moisture or getting soggy!",
        products: warmPicks,
      };
    }

    // 4. Lunch & Bento / Office meal queries
    if (q.includes('lunch') || q.includes('office') || q.includes('bento') || q.includes('tiffin') || q.includes('meal')) {
      const lunchPicks = PRODUCTS.filter((p) =>
        ['tiffin-tote', 'artisan-bento-roll', 'quilted-sandwich-pocket', 'lunch-wrap'].includes(p.slug)
      );
      return {
        text: "For office and daily lunch routines, we recommend combining a padded **Tiffin Tote** or **Artisan Bento Roll** with our washable **Quilted Sandwich Pocket** or **Lunch Wrap** (which doubles as a placemat!).",
        products: lunchPicks,
      };
    }

    // 5. Snacks / Fruits / Produce
    if (q.includes('snack') || q.includes('fruit') || q.includes('nuts') || q.includes('produce') || q.includes('groceries') || q.includes('market')) {
      const snackPicks = PRODUCTS.filter((p) =>
        ['snack-bag', 'quilted-snack-pod-set', 'fruit-pocket', 'reusable-produce-bag-set', 'zero-waste-market-tote'].includes(p.slug)
      );
      return {
        text: "For healthy snacking and fresh groceries, check out our **Quilted Snack Pod Set** (trio for nuts & treats), breathable **Fruit Pocket**, and heavy-duty **Zero-Waste Market Tote**.",
        products: snackPicks.slice(0, 4),
      };
    }

    // 6. Drinkware / Bottles / Coffee
    if (q.includes('bottle') || q.includes('coffee') || q.includes('tea') || q.includes('drink') || q.includes('soup') || q.includes('thermos')) {
      const drinkPicks = PRODUCTS.filter((p) =>
        ['bottle-sleeve', 'coffee-cup-sleeve', 'thermal-soup-jar-pouch', 'vintage-linen-tea-cozy'].includes(p.slug)
      );
      return {
        text: "We have dedicated quilted insulators for drinks and soups: the elastic-fit **Bottle Sleeve**, reusable **Coffee Cup Sleeve**, and heavy-core **Thermal Soup Jar Pouch**.",
        products: drinkPicks,
      };
    }

    // 7. Cutlery & Utensils
    if (q.includes('cutlery') || q.includes('fork') || q.includes('spoon') || q.includes('straw') || q.includes('utensil')) {
      const cutleryPicks = PRODUCTS.filter((p) =>
        ['cutlery-holder', 'eco-cutlery-straw-roll'].includes(p.slug)
      );
      return {
        text: "Never use single-use plastic cutlery again! Our **Eco Cutlery & Straw Roll** has individual slots for your bamboo fork, spoon, and metal straw with a wipeable lining.",
        products: cutleryPicks,
      };
    }

    // 8. Beeswax / Natural wraps
    if (q.includes('beeswax') || q.includes('wax') || q.includes('cling') || q.includes('plastic wrap') || q.includes('seal')) {
      const wrapPicks = PRODUCTS.filter((p) =>
        ['beeswax-fabric-wrap', 'foldable-beeswax-fabric-wrap', 'tea-time-wrap', 'herb-keeper-wrap'].includes(p.slug)
      );
      return {
        text: "Our **Beeswax Fabric Wraps** are infused with organic beeswax, tree resin, and jojoba oil. Warm them with your hands to mold over bowls, sandwiches, and cut vegetables — completely replacing cling film for over a year!",
        products: wrapPicks.slice(0, 3),
      };
    }

    // 9. Washing, cleaning, and maintenance
    if (q.includes('wash') || q.includes('clean') || q.includes('care') || q.includes('maintain') || q.includes('laundry')) {
      return {
        text: "🧼 **EcoPocket Care Guide:**\n• **Cotton & Hemp pockets:** Machine washable on cold gentle cycle or hand wash with mild eco-detergent. Line dry naturally.\n• **Linen items:** Gentle wash, air dry (iron while slightly damp for crispness).\n• **Beeswax wraps:** Wash only with cool water and a drop of gentle soap — avoid hot water and microwaves!\n• Do not tumble dry high heat to protect the organic quilting stitch.",
      };
    }

    // 10. Fabrics, materials, and quilting
    if (q.includes('fabric') || q.includes('material') || q.includes('quilt') || q.includes('cotton') || q.includes('hemp') || q.includes('linen') || q.includes('stitch')) {
      return {
        text: "🌿 **Our Materials & Craft:**\nWe only use 100% GOTS-certified organic cotton, natural unbleached hemp, French linen, and post-consumer recycled cotton. Our signatures include Diamond, Wave, and Square quilting patterns that reinforce fabric strength so each piece survives 500+ washes.",
      };
    }

    // 11. Environmental impact / Sustainability / Plastic saved
    if (q.includes('impact') || q.includes('sustainab') || q.includes('eco') || q.includes('plastic') || q.includes('green') || q.includes('carbon') || q.includes('zero waste')) {
      return {
        text: "🌍 **Your Impact With EcoPocket:**\n• A single pocket replaces **500+** single-use plastic wraps.\n• Our customers have prevented over **12,500 plastic bags** from landfills.\n• 38% lower carbon footprint compared to synthetic lunch containers.\n• 100% biodegradable and zero microplastics!",
      };
    }

    // 12. Direct search match on any product name or keyword
    const matchedProducts = PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q)
    );

    if (matchedProducts.length > 0) {
      return {
        text: `Here is what matches "${rawInput}":`,
        products: matchedProducts.slice(0, 3),
      };
    }

    // 13. Smart fallback with popular highlights
    const featured = PRODUCTS.slice(0, 3);
    return {
      text: `I'd love to help! You can ask about keeping food warm, machine washing, products under ₹1,000, or explore our top customer favorites:`,
      products: featured,
    };
  };

  const send = (text) => {
    const message = (text ?? input).trim();
    if (!message) return;

    setMessages((m) => [...m, { role: 'user', text: message }]);
    setInput('');
    setTyping(true);

    // Natural assistant delay simulation (350ms - 600ms)
    setTimeout(() => {
      const reply = generateBotReply(message);
      setMessages((m) => [...m, { role: 'bot', ...reply }]);
      setTyping(false);
      speak(reply.text);
    }, 450);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your message!");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        send(transcript);
      };
      recognition.start();
    } catch (err) {
      setListening(false);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_BOT_MESSAGE]);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open EcoBot Assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-forest text-cream shadow-2xl flex items-center justify-center border-2 border-sage-soft/40 relative group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-forest animate-pulse" />
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>

      {/* CHAT CONTAINER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm h-[540px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-forest/15 dark:border-white/15"
          >
            {/* CHAT HEADER */}
            <div className="px-5 py-4 bg-forest text-cream flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sage-soft/30 flex items-center justify-center text-sage-soft shadow-inner">
                  <FiZap size={17} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm leading-none mb-1 flex items-center gap-1.5">
                    EcoBot AI 🌿
                  </p>
                  <p className="text-[10px] text-sage-soft flex items-center gap-1.5 opacity-90">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Always Online • Smart Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 text-cream/70 hover:text-cream transition-colors"
                >
                  <FiRefreshCw size={13} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 text-cream/70 hover:text-cream transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-forest text-cream rounded-br-none'
                        : 'bg-white/95 dark:bg-white/10 text-forest dark:text-cream rounded-bl-none border border-forest/10 dark:border-white/10'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                    {/* PRODUCT RECOMMENDATION CARDS */}
                    {m.products?.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-forest/10 dark:border-white/10 flex flex-col gap-2">
                        {m.products.map((p) => (
                          <Link
                            key={p._id || p.slug}
                            to={`/products/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl bg-forest/5 dark:bg-white/5 hover:bg-forest/10 dark:hover:bg-white/10 transition-colors group"
                          >
                            <img
                              src={p.images?.[0]?.url || '/images/products/quilted-sandwich-pocket.jpg'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-forest/10 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-forest dark:text-cream truncate group-hover:text-earth">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-earth font-bold">
                                {formatPrice(p.price)} • <span className="opacity-70 font-normal">{p.fabric}</span>
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/90 dark:bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5 border border-forest/10 dark:border-white/10 items-center">
                    <span className="text-[10px] opacity-60 mr-1">EcoBot is thinking</span>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-forest/60 dark:bg-white/60 animate-bounce"
                        style={{ animationDelay: `${i * 0.14}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* QUICK PROMPTS CAROUSEL */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-forest/5 dark:border-white/5 scrollbar-none">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[10px] px-3 py-1.5 rounded-full border border-forest/15 dark:border-white/15 bg-white/50 dark:bg-white/5 hover:bg-sage/20 dark:hover:bg-white/15 font-medium whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* INPUT FORM */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 border-t border-forest/10 dark:border-white/10 flex items-center gap-2 bg-white/60 dark:bg-black/20"
            >
              <button
                type="button"
                onClick={startVoiceInput}
                title="Voice input"
                aria-label="Voice input"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                  listening
                    ? 'bg-earth text-cream border-earth animate-pulse'
                    : 'border-forest/15 dark:border-white/15 hover:bg-forest/5'
                }`}
              >
                <FiMic size={14} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EcoBot anything..."
                className="flex-1 px-3.5 py-2 rounded-full bg-white/90 dark:bg-white/10 text-xs focus:outline-none placeholder:opacity-50 border border-forest/10 dark:border-white/10"
              />

              <button
                type="submit"
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-earth transition-colors shadow-md flex-shrink-0"
              >
                <FiSend size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
