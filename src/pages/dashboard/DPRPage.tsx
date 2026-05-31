import { useState } from 'react';
import { Download, FileText, Sparkles } from 'lucide-react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { generateMsmeReport } from '../../services/openaiService';
import type { MsmeReport } from '../../types';

interface DPRFormData {
  businessName: string;
  ownerName: string;
  location: string;
  loanAmount: string;
  projectCost: string;
  businessType: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  cover: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#334155',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    color: '#0369a1',
    fontWeight: 'bold',
    borderBottom: '1 solid #0ea5e9',
    paddingBottom: 4,
  },
  text: {
    lineHeight: 1.7,
    marginBottom: 8,
  },
  table: {
    width: '100%',
    border: '1 solid #cbd5e1',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cellHeader: {
    width: '50%',
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: 8,
    borderRight: '1 solid #fff',
    fontWeight: 'bold',
  },
  cell: {
    width: '50%',
    padding: 8,
    borderRight: '1 solid #cbd5e1',
    borderTop: '1 solid #cbd5e1',
  },
});

const DPRDocument = ({
  form,
  aiSummary,
  aiSections,
}: {
  form: DPRFormData;
  aiSummary?: string;
  aiSections?: MsmeReport;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.cover}>
        <Text style={styles.title}>{form.businessName || 'Business Name'}</Text>
        <Text style={styles.subtitle}>Detailed Project Report (DPR)</Text>
        <Text style={styles.text}>Prepared For Bank / NBFC / PMEGP / Mudra Loan</Text>
        <Text style={styles.text}>Prepared By Business Partner AI</Text>
        <Text style={styles.text}>Owner: {form.ownerName || 'Promoter Name'}</Text>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Executive Summary</Text>
        <Text style={styles.text}>
          {aiSummary ||
            `${form.businessName} is a modern ${form.businessType} business located in ${form.location}. This project report has been prepared for financial assistance, business planning, and investment evaluation purposes.`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Project Details</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Particular</Text>
            <Text style={styles.cellHeader}>Details</Text>
          </View>
          {[
            ['Business Name', form.businessName],
            ['Owner Name', form.ownerName],
            ['Business Type', form.businessType],
            ['Location', form.location],
            ['Project Cost', `₹ ${form.projectCost}`],
            ['Loan Requirement', `₹ ${form.loanAmount}`],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.cell}>{label}</Text>
              <Text style={styles.cell}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Market Analysis</Text>
        {(aiSections?.dprReport || [
          `The market demand for ${form.businessType} businesses is increasing due to changing consumer behavior and urban growth.`,
          'The project has strong growth potential and is expected to generate stable revenue with good profitability margins.',
        ]).map((line) => (
          <Text key={line} style={styles.text}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Financial Analysis</Text>
        {(aiSections?.financialProjections || [
          `Estimated project cost is ₹ ${form.projectCost}. The promoter is seeking financial assistance of ₹ ${form.loanAmount}.`,
          'The business is projected to achieve operational break-even within the first 18–24 months.',
        ]).map((line) => (
          <Text key={line} style={styles.text}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Conclusion</Text>
        <Text style={styles.text}>
          {aiSections?.bankReadiness?.[0] ||
            'Based on projected revenue, operational scalability, and market demand, this project is financially viable and suitable for bank loan approval under MSME / PMEGP / Mudra schemes.'}
        </Text>
      </View>
    </Page>
  </Document>
);

const emptyForm: DPRFormData = {
  businessName: '',
  ownerName: '',
  location: '',
  loanAmount: '',
  projectCost: '',
  businessType: '',
};

export const DPRPage = () => {
  const [form, setForm] = useState<DPRFormData>(emptyForm);
  const [aiReport, setAiReport] = useState<MsmeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof DPRFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const generateAiContent = async () => {
    const projectCost = Number(form.projectCost);
    const loanAmount = Number(form.loanAmount);
    if (!form.businessType || !form.location || projectCost <= 0 || loanAmount <= 0) {
      setError('Fill business type, location, project cost, and loan amount for AI-enhanced DPR.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      setAiReport(
        await generateMsmeReport({
          businessType: form.businessType,
          investmentAmount: projectCost,
          loanAmount,
          location: form.location,
          machinery: 'As per project requirement',
          monthlyRevenue: Math.round(projectCost / 24),
          expenses: Math.round(projectCost / 36),
        })
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'AI DPR generation failed');
    } finally {
      setLoading(false);
    }
  };

  const canDownload = form.businessName && form.ownerName && form.projectCost;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Professional DPR Generator</h1>
        <p className="mt-2 text-slate-400">Generate CA-level bank loan project reports with optional AI-enhanced sections.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="grid gap-4 border-cyan-300/20 bg-slate-950/80 text-white">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Business Name" value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
            <Input label="Owner Name" value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} />
            <Input label="Location" value={form.location} onChange={(e) => update('location', e.target.value)} />
            <Input label="Business Type" value={form.businessType} onChange={(e) => update('businessType', e.target.value)} />
            <Input label="Project Cost (₹)" value={form.projectCost} onChange={(e) => update('projectCost', e.target.value)} />
            <Input label="Loan Amount (₹)" value={form.loanAmount} onChange={(e) => update('loanAmount', e.target.value)} />
          </div>
          {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button loading={loading} onClick={generateAiContent}>
              <Sparkles className="h-4 w-4" /> Enhance with AI
            </Button>
            {canDownload ? (
              <PDFDownloadLink
                document={
                  <DPRDocument
                    form={form}
                    aiSummary={aiReport?.executiveSummary}
                    aiSections={aiReport || undefined}
                  />
                }
                fileName={`${form.businessName || 'business'}-DPR.pdf`}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"
              >
                {({ loading: pdfLoading }) => (
                  <>
                    <Download className="h-4 w-4" />
                    {pdfLoading ? 'Preparing PDF...' : 'Download Professional DPR'}
                  </>
                )}
              </PDFDownloadLink>
            ) : null}
          </div>
        </Card>

        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-cyan-300" />
            <h2 className="font-display text-xl font-bold">DPR Preview</h2>
          </div>
          {aiReport ? (
            <div className="mt-5 grid gap-4">
              <p className="text-sm leading-6 text-slate-300">{aiReport.executiveSummary}</p>
              {(
                [
                  ['Financial Projections', aiReport.financialProjections],
                  ['Profit Analysis', aiReport.profitAnalysis],
                  ['Break-even Analysis', aiReport.breakEvenAnalysis],
                  ['Bank Readiness', aiReport.bankReadiness],
                ] as const
              ).map(([heading, lines]) => (
                <div key={heading}>
                  <h3 className="font-semibold text-cyan-200">{heading}</h3>
                  <ul className="mt-2 grid gap-2 text-sm text-slate-300">
                    {lines.map((line) => (
                      <li key={line} className="rounded-lg bg-white/10 p-3">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Fill project details and optionally enhance with AI before downloading your bank-ready DPR PDF.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};
