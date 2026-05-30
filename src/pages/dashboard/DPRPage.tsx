export default function DPRPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">
        MSME DPR Generator
      </h1>

      <div className="bg-black/40 border border-blue-500 rounded-xl p-6">
        <input
          placeholder="Business Name"
          className="w-full p-3 rounded bg-black mb-4"
        />

        <input
          placeholder="Project Cost"
          className="w-full p-3 rounded bg-black mb-4"
        />

        <textarea
          placeholder="Business Details"
          className="w-full p-3 rounded bg-black mb-4"
        />

        <button className="bg-blue-600 px-6 py-3 rounded-xl">
          Generate DPR Report
        </button>
      </div>
    </div>
  );
}