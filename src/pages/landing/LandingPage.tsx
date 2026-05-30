import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, Check, CreditCard, LineChart, Mail, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const features = [
  { icon: Bot, title: 'AI Business Analyzer', text: 'Convert revenue, expenses, location, team size, and business problems into a practical growth plan.' },
  { icon: BarChart3, title: 'Finance Intelligence', text: 'Track income, expenses, cash flow, profit/loss, and business health from one dashboard.' },
  { icon: CreditCard, title: 'Collection Assistant', text: 'Detect pending dues and generate WhatsApp or email follow-ups in seconds.' },
  { icon: ShieldCheck, title: 'Recovery System', text: 'Find why growth is stuck and receive a clear action plan for the next 30 days.' },
];

const pricing = [
  { name: 'Free', price: 'INR 0', items: ['Demo dashboard', 'Basic reports', '10 AI prompts/month'] },
  { name: 'Pro', price: 'INR 1,999', featured: true, items: ['Unlimited analyzer', 'Finance manager', 'Collections AI', 'Priority insights'] },
  { name: 'Enterprise', price: 'Custom', items: ['Admin controls', 'Team onboarding', 'Custom workflows', 'Dedicated support'] },
];

export const LandingPage = () => (
  <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-obsidian dark:text-white">
    <header className="sticky top-0 z-20 border-b border-black/10 bg-neutral-50/80 backdrop-blur dark:border-white/10 dark:bg-obsidian/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-400 font-black text-black">B</span>
          <span className="font-display text-lg font-extrabold">Business Partner AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="hidden text-sm font-semibold sm:inline-flex">
            Login
          </Link>
          <Link to="/signup">
            <Button>Start Free</Button>
          </Link>
        </div>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0 bg-gold-grid bg-[length:42px_42px] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,169,11,.25),transparent_38%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl content-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-700 dark:text-gold-200">
              <Sparkles className="h-4 w-4" />
              AI advisor for growing businesses
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">Business Partner AI</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Analyze your business, improve cash flow, recover pending dues, and get practical AI-powered suggestions for growth, risk, finance, and competitor strategy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button className="w-full sm:w-auto">
                  Launch Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65 }} className="self-center">
            <Card className="grid gap-5 bg-white/85 dark:bg-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Business Health</p>
                  <p className="text-5xl font-black text-gold-500">87</p>
                </div>
                <LineChart className="h-14 w-14 text-gold-400" />
              </div>
              <div className="grid gap-3">
                {['Recover INR 84,000 overdue this week', 'Reduce marketing waste by 12%', 'Launch premium bundle for repeat buyers'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-black/[0.04] p-3 dark:bg-white/10">
                    <Check className="h-5 w-5 text-gold-400" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" id="features">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-black sm:text-4xl">Everything a founder checks daily</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">Built for practical decisions across sales, expenses, collections, customers, and strategy.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="mb-5 h-8 w-8 text-gold-400" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-black py-16 text-white dark:border-white/10" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-black sm:text-4xl">Plans for every stage</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pricing.map((plan) => (
              <Card key={plan.name} className={plan.featured ? 'border-gold-400 bg-gold-400 text-black' : 'bg-white/[0.06] text-white'}>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-3 text-3xl font-black">{plan.price}</p>
                <div className="mt-6 grid gap-3">
                  {plan.items.map((item) => (
                    <span key={item} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4" /> {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2" id="testimonials">
        <div>
          <h2 className="font-display text-3xl font-black">Founder-loved insights</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">Demo testimonials showing the intended product experience.</p>
        </div>
        <div className="grid gap-4">
          {['It made our cash flow problems visible in one week.', 'The collection messages saved hours for our accounts team.'].map((quote, index) => (
            <Card key={quote}>
              <p className="text-lg font-semibold">"{quote}"</p>
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">Founder #{index + 1}, D2C and services business</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 py-16 dark:border-white/10" id="contact">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <h2 className="font-display text-3xl font-black">Ready to grow with sharper decisions?</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">Start with demo data, then connect Firebase and OpenAI when you deploy.</p>
          </Card>
          <Card className="grid gap-3">
            <span className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-gold-400" /> hello@businesspartner.ai</span>
            <span className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-gold-400" /> +91 90000 00000</span>
            <span className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-gold-400" /> For founders and teams</span>
          </Card>
        </div>
      </section>
    </main>
  </div>
);
