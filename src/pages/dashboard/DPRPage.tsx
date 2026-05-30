export const DPRPage = () => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">
        DPR Report Generator
      </h1>

      <div className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-6">
        <input
          type="text"
          placeholder="Business Name"
          className="w-full rounded-lg bg-slate-800 p-3 mb-4"
        />

        <input
          type="text"
          placeholder="Project Cost"
          className="w-full rounded-lg bg-slate-800 p-3 mb-4"
        />

        <textarea
          placeholder="Business Details"
          className="w-full rounded-lg bg-slate-800 p-3 mb-4 h-40"
        />

        <button className="rounded-lg bg-cyan-400 px-6 py-3 font-bold text-black">
          Generate DPR
        </button>
      </div>
    </div>
  );
};