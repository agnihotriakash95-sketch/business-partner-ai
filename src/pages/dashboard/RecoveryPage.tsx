import { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { generateRecoveryPlan, isOpenAIConfigured } from '../../services/openaiService';
import { buildBusinessMetrics } from '../../utils/analyticsEngine';

export const RecoveryPage = () => {
  const { profile } = useAuth();
  const { transactions, customers } = useBusinessData();
  const [problem, setProblem] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    if (!problem.trim() || !isOpenAIConfigured()) return;
    setLoading(true);
    setError('');
    setSteps([]);
    try {
      setSteps(
        await generateRecoveryPlan(problem, {
          userName: profile.name,
          metrics: buildBusinessMetrics(transactions, customers, profile.name),
        })
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Recovery plan generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Recovery System</h1>
        <p className="mt-2 text-slate-400">OpenAI-powered diagnosis, strategy, and 7-day action plan.</p>
      </div>
      <OpenAIKeyWarning />
      <Card className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white">
        <Textarea
          label="Describe the growth problem"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          placeholder="Explain why revenue stalled, cash is stuck, or growth slowed..."
        />
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
        <Button loading={loading} onClick={run} disabled={!isOpenAIConfigured()} className="sm:w-fit">
          <LifeBuoy className="h-4 w-4" /> Build Recovery Plan
        </Button>
      </Card>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="h-36 animate-pulse border-cyan-300/20 bg-white/5" />
          ))}
        </div>
      ) : steps.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={`${index}-${step.slice(0, 20)}`} className="border-cyan-300/20 bg-slate-950/80 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-300 font-black text-slate-950">
                {index + 1}
              </span>
              <p className="mt-4 text-sm leading-6 text-slate-300">{step}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-white/10 bg-slate-950/50 p-8 text-center text-sm text-slate-400">
          Describe your business problem and generate an AI recovery plan.
        </Card>
      )}
    </div>
  );
};
