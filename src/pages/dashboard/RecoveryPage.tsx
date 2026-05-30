import { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import { generateRecoveryPlan } from '../../services/openaiService';

export const RecoveryPage = () => {
  const [problem, setProblem] = useState('Revenue is not growing even though marketing spend increased. Repeat purchase is slow and cash is stuck in pending payments.');
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      setSteps(await generateRecoveryPlan(problem));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Recovery System</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Analyze why the business is not growing and get problems, solutions, and action plan.</p>
      </div>
      <Card className="grid gap-4">
        <Textarea label="Describe the growth problem" value={problem} onChange={(event) => setProblem(event.target.value)} />
        <Button loading={loading} onClick={run} className="sm:w-fit">
          <LifeBuoy className="h-4 w-4" /> Build Recovery Plan
        </Button>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {(steps.length ? steps : ['Problem diagnosis will appear here.', 'Solutions will appear here.', 'Action plan will appear here.']).map((step, index) => (
          <Card key={step}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-400 font-black text-black">{index + 1}</span>
            <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{step}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
