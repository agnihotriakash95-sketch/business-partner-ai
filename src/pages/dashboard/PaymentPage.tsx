export const PaymentPage = () => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Upgrade Plans
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">
            Pro Plan
          </h2>

          <p className="mt-4 text-5xl font-black">
            ₹999
          </p>

          <button className="mt-6 rounded-lg bg-cyan-400 px-6 py-3 font-bold text-black">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};