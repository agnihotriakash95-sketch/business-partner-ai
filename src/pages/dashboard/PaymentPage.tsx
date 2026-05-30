export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-cyan-500/20 bg-slate-950 p-8 shadow-2xl">

        <h1 className="mb-4 text-4xl font-bold text-cyan-400">
          Upgrade Membership
        </h1>

        <p className="mb-10 text-slate-400">
          Unlock premium AI business tools, DPR generation, analytics,
          finance management, and unlimited reports.
        </p>

        <div className="grid gap-6 md:grid-cols-3">

          {/* BASIC */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-2 text-2xl font-bold">Basic</h2>

            <p className="mb-6 text-slate-400">
              Starter plan for small businesses.
            </p>

            <div className="mb-6 text-4xl font-black text-cyan-400">
              ₹499
              <span className="text-base text-slate-400"> /month</span>
            </div>

            <ul className="mb-8 space-y-3 text-sm text-slate-300">
              <li>✔ AI Chat</li>
              <li>✔ Basic DPR</li>
              <li>✔ CRM Access</li>
              <li>✔ Analytics</li>
            </ul>

            <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black">
              Buy Now
            </button>
          </div>

          {/* PRO */}
          <div className="rounded-2xl border border-cyan-400 bg-slate-900 p-6 shadow-[0_0_30px_rgba(34,211,238,.25)]">
            <h2 className="mb-2 text-2xl font-bold text-cyan-400">
              Pro
            </h2>

            <p className="mb-6 text-slate-400">
              Best for growing startups.
            </p>

            <div className="mb-6 text-4xl font-black text-cyan-400">
              ₹1999
              <span className="text-base text-slate-400"> /month</span>
            </div>

            <ul className="mb-8 space-y-3 text-sm text-slate-300">
              <li>✔ Unlimited AI Chat</li>
              <li>✔ Professional DPR</li>
              <li>✔ AI Voice Assistant</li>
              <li>✔ Payment Gateway</li>
              <li>✔ Analytics Dashboard</li>
            </ul>

            <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black">
              Upgrade Now
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-2 text-2xl font-bold">
              Enterprise
            </h2>

            <p className="mb-6 text-slate-400">
              Large business solution.
            </p>

            <div className="mb-6 text-4xl font-black text-cyan-400">
              ₹9999
              <span className="text-base text-slate-400"> /month</span>
            </div>

            <ul className="mb-8 space-y-3 text-sm text-slate-300">
              <li>✔ All Pro Features</li>
              <li>✔ Team Access</li>
              <li>✔ AI Automation</li>
              <li>✔ Custom Branding</li>
              <li>✔ Priority Support</li>
            </ul>

            <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black">
              Contact Sales
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}