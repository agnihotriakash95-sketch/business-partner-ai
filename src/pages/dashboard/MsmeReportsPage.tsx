import { FormEvent, useState } from 'react';
import { Download, Landmark, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { exportMsmeReportPdf } from '../../services/pdfService';
import { generateMsmeReport } from '../../services/openaiService';
import type { MsmeReport, MsmeReportInput } from '../../types';

const initialInput: MsmeReportInput = {
  businessType: 'Food processing unit',
  investmentAmount: 1800000,
  loanAmount: 1200000,
  location: 'Indore, Madhya Pradesh',
  machinery: 'Pulverizer, packing machine, sealing machine, weighing scale',
  monthlyRevenue: 420000,
  expenses: 270000,
};

export const MsmeReportsPage = () => {
  const [input, setInput] = useState(initialInput);
  const [report, setReport] = useState<MsmeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof MsmeReportInput, value: string) => {
    setInput((current) => ({
      ...current,
      [key]: ['investmentAmount', 'loanAmount', 'monthlyRevenue', 'expenses'].includes(key) ? Number(value) : value,
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      setReport(await generateMsmeReport(input));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'MSME report generation failed');
    } finally {
      setLoading(false);
    }
  };

  const sections = report
    ? [
        ['DPR Report', report.dprReport],
        ['Financial Projections', report.financialProjections],
        ['Profit Analysis', report.profitAnalysis],
        ['Break-even Analysis', report.breakEvenAnalysis],
        ['PMEGP/MSME Format', report.msmeFormat],
        ['Bank-ready Checklist', report.bankReadiness],
      ] as const
    : [];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">MSME Project Report Generator</h1>
        <p className="mt-2 text-slate-400">Generate DPR, projections, break-even analysis, PMEGP/MSME format, and bank-ready PDF.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <form className="grid gap-4" onSubmit={submit}>
            <Input label="Business Type" value={input.businessType} onChange={(event) => update('businessType', event.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Investment Amount" type="number" value={input.investmentAmount} onChange={(event) => update('investmentAmount', event.target.value)} />
              <Input label="Loan Amount" type="number" value={input.loanAmount} onChange={(event) => update('loanAmount', event.target.value)} />
            </div>
            <Input label="Location" value={input.location} onChange={(event) => update('location', event.target.value)} />
            <Textarea label="Machinery" value={input.machinery} onChange={(event) => update('machinery', event.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Monthly Revenue" type="number" value={input.monthlyRevenue} onChange={(event) => update('monthlyRevenue', event.target.value)} />
              <Input label="Monthly Expenses" type="number" value={input.expenses} onChange={(event) => update('expenses', event.target.value)} />
            </div>
            {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
            <Button loading={loading}><Sparkles className="h-4 w-4" /> Generate Bank Report</Button>
          </form>
        </Card>
        <div className="grid gap-4">
          {report ? (
            <>
              <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-black">{report.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{report.executiveSummary}</p>
                  </div>
                  <Landmark className="h-8 w-8 text-cyan-300" />
                </div>
                <Button className="mt-5" onClick={() => exportMsmeReportPdf(report)}>
                  <Download className="h-4 w-4" /> Download Bank-ready PDF
                </Button>
              </Card>
              {sections.map(([heading, lines]) => (
                <Card key={heading} className="border-cyan-300/20 bg-slate-950/80 text-white">
                  <h3 className="font-semibold text-cyan-200">{heading}</h3>
                  <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                    {lines.map((line) => <li key={line} className="rounded-lg bg-white/10 p-3">{line}</li>)}
                  </ul>
                </Card>
              ))}
            </>
          ) : (
            <Card className="grid min-h-96 place-items-center border-cyan-300/20 bg-slate-950/80 text-center text-white">
              <div>
                <Landmark className="mx-auto h-12 w-12 text-cyan-300" />
                <h2 className="mt-4 font-display text-2xl font-black">MSME report preview</h2>
                <p className="mt-2 text-sm text-slate-400">Fill the project details and generate a bank-ready report.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
