import { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 12,
  },

  title: {
    fontSize: 28,
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
  },

  text: {
    marginBottom: 10,
    lineHeight: 1.6,
  },
});

const DPRDocument = ({
  businessName,
  ownerName,
  projectCost,
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>

      <Text style={styles.title}>
        Detailed Project Report
      </Text>

      <Text style={styles.text}>
        Business Name: {businessName}
      </Text>

      <Text style={styles.text}>
        Owner Name: {ownerName}
      </Text>

      <Text style={styles.text}>
        Project Cost: ₹ {projectCost}
      </Text>

      <Text style={styles.heading}>
        Executive Summary
      </Text>

      <Text style={styles.text}>
        This business project is financially viable and suitable
        for MSME and Bank Loan funding.
      </Text>

    </Page>
  </Document>
);

export default function DPRPage() {

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [projectCost, setProjectCost] = useState('');

  return (
    <div className="min-h-screen bg-black p-8 text-white">

      <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-500/20 bg-slate-950 p-8">

        <h1 className="mb-6 text-4xl font-bold text-cyan-400">
          Professional DPR Generator
        </h1>

        <div className="grid gap-4">

          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="rounded-xl bg-slate-900 p-4"
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="rounded-xl bg-slate-900 p-4"
          />

          <input
            type="text"
            placeholder="Project Cost"
            value={projectCost}
            onChange={(e) => setProjectCost(e.target.value)}
            className="rounded-xl bg-slate-900 p-4"
          />

        </div>

        <div className="mt-8">

          <PDFDownloadLink
            document={
              <DPRDocument
                businessName={businessName}
                ownerName={ownerName}
                projectCost={projectCost}
              />
            }
            fileName="Professional-DPR.pdf"
            className="rounded-xl bg-cyan-400 px-6 py-4 font-bold text-black"
          >
            Download Professional DPR
          </PDFDownloadLink>

        </div>

      </div>

    </div>
  );
}