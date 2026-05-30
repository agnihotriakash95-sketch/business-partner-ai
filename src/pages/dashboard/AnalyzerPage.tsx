import { FormEvent, useState } from 'react';
import { Bot, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { analyzeBusiness } from '../../services/openaiService';
import type { BusinessAnalysis, BusinessAnalysisInput } from '../../types';
import { validateBusinessInput } from '../../utils/validators';

const initialInput: BusinessAnalysisInput = {
  businessName: 'Nova Retail',
  industry: 'Retail and FMCG',
  monthlyRevenue: 860000,
  monthlyExpenses: 469000,
  employeeCount: 14,
  location: 'Mumbai, India',
  problemsFacing: 'Pending payments, rising marketing cost, slow repeat purchases.',
};

export const AnalyzerPage = () => {
  const [input, setInput] = useState(initialInput);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessAnalysisInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof BusinessAnalysisInput, value: string) => {
    setInput((current) => ({
      ...current,
      [key]: ['monthlyRevenue', 'monthlyExpenses', 'employeeCount'].includes(key) ? Number(value) : value,
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validation = validateBusinessInput(input);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setLoading(true);
    setError('');
    try {
      setAnalysis(await analyzeBusiness(input));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'AI analyzer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Business Analyzer</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Generate a business report, growth ideas, risk analysis, cost cutting, and competitor strategy.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Card>
          <form className="grid gap-4" onSubmit={submit}>
            <Input label="Business Name" value={input.businessName} error={errors.businessName} onChange={(event) => update('businessName', event.target.value)} />
            <Input label="Industry" value={input.industry} error={errors.industry} onChange={(event) => update('industry', event.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Monthly Revenue" type="number" value={input.monthlyRevenue} error={errors.monthlyRevenue} onChange={(event) => update('monthlyRevenue', event.target.value)} />
              <Input label="Monthly Expenses" type="number" value={input.monthlyExpenses} error={errors.monthlyExpenses} onChange={(event) => update('monthlyExpenses', event.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Employee Count" type="number" value={input.employeeCount} error={errors.employeeCount} onChange={(event) => update('employeeCount', event.target.value)} />
              <Input label="Location" value={input.location} error={errors.location} onChange={(event) => update('location', event.target.value)} />
            </div>
            <Textarea label="Problems Facing" value={input.problemsFacing} error={errors.problemsFacing} onChange={(event) => update('problemsFacing', event.target.value)} />
            {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
            <Button loading={loading}>
              <Bot className="h-4 w-4" /> Generate AI Report
            </Button>
          </form>
        </Card>
        <div className="grid gap-4">
          {analysis ? (
            <>
              <Card className="border-gold-400/50">
                <div className="flex items-start gap-4">
                  <FileText className="mt-1 h-6 w-6 text-gold-400" />
                  <div>
                    <h2 className="font-display text-xl font-bold">Score {analysis.healthScore}/100</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{analysis.summary}</p>
                  </div>
                </div>
              </Card>
              {[analysis.businessReport, analysis.growthOpportunities, analysis.riskAnalysis, analysis.costCutting, analysis.revenueIdeas, analysis.competitorStrategy, analysis.actionPlan].map((section) => (
                <Card key={section.title}>
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="mt-3 grid gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    {section.points.map((point) => (
                      <li key={point} className="rounded-lg bg-black/[0.04] p-3 dark:bg-white/10">{point}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </>
          ) : (
            <Card className="grid min-h-96 place-items-center text-center">
              <div>
                <Bot className="mx-auto h-12 w-12 text-gold-400" />
                <h2 className="mt-4 font-display text-2xl font-bold">AI report will appear here</h2>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">The demo mode returns realistic analysis without needing an API key.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
