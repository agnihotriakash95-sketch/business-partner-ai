import { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import { generateRecoveryPlan } from '../../services/openaiService';

export const RecoveryPage = () => {
  const [problem, setProblem] = useState(
    'Revenue is not growing even though marketing spend increased. Repeat purchase is slow and cash is stuck in pending payments.'
  );
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      setSteps(await generateRecoveryPlan(problem));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Recovery plan generation failed');
    } finally {
      setLoading(false);
    }
  };

  const displaySteps = steps.length
    ? steps
    : ['Problem diagnosis will appear here.', 'Solutions will appear here.', 'Action plan will appear here.'];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Recovery System</h1>
        <p className="mt-2 text-slate-400">
          Analyze why the business is not growing and get problems, solutions, and action plan.
        </p>
      </div>
      <Card className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white">
        <Textarea
          label="Describe the growth problem"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
        />
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
        <Button loading={loading} onClick={run} className="sm:w-fit">
          <LifeBuoy className="h-4 w-4" /> Build Recovery Plan
        </Button>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {displaySteps.map((step, index) => (
          <Card key={step} className="border-cyan-300/20 bg-slate-950/80 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-300 font-black text-slate-950">
              {index + 1}
            </span>
            <p className="mt-4 text-sm leading-6 text-slate-300">{step}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
