import { useState } from 'react';
import { CalendarDays, FileText } from 'lucide-react';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { saveReportRecord } from '../../services/firestoreService';
import { generateReport, isOpenAIConfigured } from '../../services/openaiService';
import type { Report, ReportPeriod } from '../../types';
import { buildBusinessMetrics } from '../../utils/analyticsEngine';

export const ReportsPage = () => {
  const { profile } = useAuth();
  const { transactions, customers } = useBusinessData();
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [reports, setReports] = useState<Report[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const metrics = buildBusinessMetrics(transactions, customers, profile.name);

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      const reportContent = await generateReport(
        period,
        `${profile.name} — Revenue ${metrics.revenue}, Profit ${metrics.profit}, Dues ${metrics.pendingDues}`
      );
      setContent(reportContent);
      const record: Report = {
        id: crypto.randomUUID(),
        ownerId: profile.id,
        period,
        title: `${period.charAt(0).toUpperCase()}${period.slice(1)} AI Report`,
        content: reportContent,
        createdAt: new Date().toISOString(),
      };
      setReports((items) => [record, ...items]);
      await saveReportRecord(profile.id, { period, title: record.title, content: reportContent, createdAt: record.createdAt });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Report generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpenAIConfigured()) {
    return (
      <div className="grid gap-6">
        <OpenAIKeyWarning />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Report System</h1>
        <p className="mt-2 text-slate-400">Generate daily, weekly, and monthly AI business reports from your live data.</p>
      </div>
      <Card className="flex flex-col gap-4 border-cyan-300/20 bg-slate-950/80 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-white/10 p-1">
          {(['daily', 'weekly', 'monthly'] as ReportPeriod[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`rounded-md px-4 py-2 text-sm font-semibold capitalize ${
                period === item ? 'bg-cyan-300 text-slate-950' : 'text-slate-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <Button loading={loading} onClick={run}>
          <CalendarDays className="h-4 w-4" /> Generate Report
        </Button>
      </Card>
      {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      {content ? (
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <h2 className="font-semibold text-cyan-200">Generated {period} report</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{content}</p>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {reports.length ? (
          reports.map((report) => (
            <Card key={report.id} className="border-cyan-300/20 bg-slate-950/80 text-white">
              <FileText className="mb-4 h-6 w-6 text-cyan-300" />
              <span className="text-xs font-bold uppercase text-cyan-200">{report.period}</span>
              <h3 className="mt-2 font-semibold">{report.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-400">{report.content}</p>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-cyan-300/20 bg-slate-950/80 p-8 text-center text-slate-400">
            No reports yet. Generate your first AI business report above.
          </Card>
        )}
      </div>
    </div>
  );
};
