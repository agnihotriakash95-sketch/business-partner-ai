import { useState } from 'react';
import { CalendarDays, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { demoReports } from '../../data/demoData';
import { generateReport } from '../../services/openaiService';
import type { ReportPeriod } from '../../types';

export const ReportsPage = () => {
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      setContent(await generateReport(period, 'Nova Retail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Daily Report System</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Generate daily, weekly, and monthly reports for business reviews.</p>
      </div>
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-black/10 p-1 dark:border-white/10">
          {(['daily', 'weekly', 'monthly'] as ReportPeriod[]).map((item) => (
            <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-4 py-2 text-sm font-semibold capitalize ${period === item ? 'bg-gold-400 text-black' : ''}`}>
              {item}
            </button>
          ))}
        </div>
        <Button loading={loading} onClick={run}>
          <CalendarDays className="h-4 w-4" /> Generate Report
        </Button>
      </Card>
      {content ? <Card><h2 className="font-semibold">Generated {period} report</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-600 dark:text-neutral-300">{content}</p></Card> : null}
      <div className="grid gap-4 md:grid-cols-3">
        {demoReports.map((report) => (
          <Card key={report.id}>
            <FileText className="mb-4 h-6 w-6 text-gold-400" />
            <span className="text-xs font-bold uppercase text-gold-600 dark:text-gold-300">{report.period}</span>
            <h3 className="mt-2 font-semibold">{report.title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{report.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
