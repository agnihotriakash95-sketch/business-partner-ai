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
  businessName,
  ownerName,
  location,
  loanAmount,
  projectCost,
  businessType,
}: any) => (
  <Document>
    {/* COVER PAGE */}
    <Page size="A4" style={styles.page}>
      <View style={styles.cover}>
        <Text style={styles.title}>{businessName}</Text>

        <Text style={styles.subtitle}>
          Detailed Project Report (DPR)
        </Text>

        <Text style={styles.text}>
          Prepared For Bank / NBFC / PMEGP / Mudra Loan
        </Text>

        <Text style={styles.text}>
          Prepared By Business Partner AI
        </Text>

        <Text style={styles.text}>
          Founder: Akash Agnihotri
        </Text>
      </View>
    </Page>

    {/* EXECUTIVE SUMMARY */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Executive Summary</Text>

        <Text style={styles.text}>
          {businessName} is a modern {businessType} business located in{' '}
          {location}. The business aims to establish a scalable and
          profitable operation with strong market demand and future
          growth opportunities.
        </Text>

        <Text style={styles.text}>
          This project report has been prepared for financial assistance,
          business planning, and investment evaluation purposes.
        </Text>
      </View>

      {/* PROJECT DETAILS */}
      <View style={styles.section}>
        <Text style={styles.heading}>Project Details</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Particular</Text>
            <Text style={styles.cellHeader}>Details</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>Business Name</Text>
            <Text style={styles.cell}>{businessName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>Owner Name</Text>
            <Text style={styles.cell}>{ownerName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>Business Type</Text>
            <Text style={styles.cell}>{businessType}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>Location</Text>
            <Text style={styles.cell}>{location}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>Project Cost</Text>
            <Text style={styles.cell}>₹ {projectCost}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>Loan Requirement</Text>
            <Text style={styles.cell}>₹ {loanAmount}</Text>
          </View>
        </View>
      </View>

      {/* MARKET ANALYSIS */}
      <View style={styles.section}>
        <Text style={styles.heading}>Market Analysis</Text>

        <Text style={styles.text}>
          The market demand for {businessType} businesses is increasing
          rapidly due to changing consumer behavior, urban growth, and
          rising digital awareness.
        </Text>

        <Text style={styles.text}>
          The project has strong growth potential and is expected to
          generate stable revenue with good profitability margins.
        </Text>
      </View>

      {/* FINANCIAL ANALYSIS */}
      <View style={styles.section}>
        <Text style={styles.heading}>Financial Analysis</Text>

        <Text style={styles.text}>
          Estimated project cost is ₹ {projectCost}. The promoter is
          seeking financial assistance of ₹ {loanAmount}.
        </Text>

        <Text style={styles.text}>
          The business is projected to achieve operational break-even
          within the first 18–24 months.
        </Text>

        <Text style={styles.text}>
          Revenue growth is expected to increase annually due to market
          expansion and customer acquisition.
        </Text>
      </View>

      {/* CONCLUSION */}
      <View style={styles.section}>
        <Text style={styles.heading}>Conclusion</Text>

        <Text style={styles.text}>
          Based on projected revenue, operational scalability, and market
          demand, this project is financially viable and suitable for
          bank loan approval under MSME / PMEGP / Mudra schemes.
        </Text>
      </View>
    </Page>
  </Document>
);

export default function DPRPage() {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [location, setLocation] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [projectCost, setProjectCost] = useState('');
  const [businessType, setBusinessType] = useState('');

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-500/20 bg-slate-950 p-8 shadow-2xl">
        <h1 className="mb-2 text-4xl font-bold text-cyan-400">
          Professional DPR Generator
        </h1>

        <p className="mb-8 text-slate-400">
          Generate CA-level bank loan project reports instantly.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <input
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4"
          />

          <input
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4"
          />

          <input
            placeholder="Business Type"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4"
          />

          <input
            placeholder="Project Cost"
            value={projectCost}
            onChange={(e) => setProjectCost(e.target.value)}
            className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4"
          />

          <input
            placeholder="Loan Amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="rounded-xl border border-cyan-500/20 bg-slate-900 p-4"
          />
        </div>

        <div className="mt-8">
          <PDFDownloadLink
            document={
              <DPRDocument
                businessName={businessName}
                ownerName={ownerName}
                location={location}
                loanAmount={loanAmount}
                projectCost={projectCost}
                businessType={businessType}
              />
            }
            fileName={`${businessName}-DPR.pdf`}
            className="inline-flex rounded-xl bg-cyan-400 px-6 py-4 font-bold text-black"
          >
            {({ loading }) =>
              loading
                ? 'Generating PDF...'
                : 'Download Professional DPR'
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}