export default function PaymentPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Upgrade Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-black/40 p-6 rounded-2xl border border-blue-500">
          <h2 className="text-2xl font-bold">Pro</h2>
          <p className="text-4xl mt-4">₹999</p>

          <button className="mt-6 bg-blue-600 px-6 py-3 rounded-xl">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}