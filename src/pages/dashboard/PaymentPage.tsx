export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">

      <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-500/20 bg-slate-950 p-8">

        <h1 className="mb-3 text-4xl font-bold text-cyan-400">
          Upgrade Membership
        </h1>

        <p className="mb-10 text-slate-400">
          Unlock premium AI tools and business features.
        </p>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-2 text-2xl font-bold">
              Basic
            </h2>

            <div className="mb-6 text-4xl font-black text-cyan-400">
              ₹499
            </div>

            <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black">
              Buy Now
            </button>
          </div>

          <div className="rounded-2xl border border-cyan-400 bg-slate-900 p-6">
            <h2 className="mb-2 text-2xl font-bold text-cyan-400">
              Pro
            </h2>

            <div className="mb-6 text-4xl font-black text-cyan-400">
              ₹1999
            </div>

            <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black">
              Upgrade
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-2 text-2xl font-bold">
              Enterprise
            </h2>

            <div className="mb-6 text-4xl font-black text-cyan-400">
              ₹9999
            </div>

            <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black">
              Contact
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}