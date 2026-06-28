use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  BarChart3,
  ZoomIn,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Search,
  Plus,
  Sliders,
  SlidersHorizontal,
  Layers,
  Sparkles,
  HelpCircle,
  TrendingDown,
  Briefcase,
  FileSpreadsheet,
  Zap,
  MoreVertical,
  Check,
  X,
  AlertTriangle,
  Info,
  Calendar,
  Globe,
  Settings
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ==============================================================================
// ENTERPRISE HIGH-FIDELITY DEMO DATA
// ==============================================================================

const INITIAL_METRICS = [
  { label: 'Outstanding Invoices', value: '$142,380.00', change: '+12.4%', isPositive: true, subtext: 'vs last month', category: 'Receivables' },
  { label: 'Amount Due (Contractors)', value: '$64,150.00', change: '-3.2%', isPositive: true, subtext: 'Current batch pool', category: 'Payables' },
  { label: 'Payments Pending', value: '$18,920.00', change: '+8.1%', isPositive: false, subtext: 'Awaiting signature', category: 'Operations' },
  { label: 'Payments Completed', value: '$412,980.00', change: '+24.3%', isPositive: true, subtext: 'This month ledger', category: 'Settled' },
  { label: 'Monthly Revenue', value: '$285,400.00', change: '+14.2%', isPositive: true, subtext: 'MRR + One-off bursts', category: 'P&L' },
  { label: 'Monthly Payroll', value: '$73,240.00', change: '+5.6%', isPositive: false, subtext: 'Editors & QAs total', category: 'P&L' },
  { label: 'Gross Margin', value: '74.3%', change: '+2.1%', isPositive: true, subtext: 'Target benchmark 70%', category: 'Efficiency' },
  { label: 'Operating Margin', value: '45.8%', change: '+1.5%', isPositive: true, subtext: 'Post SaaS-infrastructure', category: 'Efficiency' },
  { label: 'Cash Available', value: '$892,400.00', change: '+9.4%', isPositive: true, subtext: 'Mercury & SVB accounts', category: 'Liquidity' },
  { label: 'Accounts Receivable', value: '$186,500.00', change: '+11.2%', isPositive: true, subtext: 'Net 30 average duration', category: 'Receivables' },
  { label: 'Accounts Payable', value: '$12,450.00', change: '-18.4%', isPositive: true, subtext: 'Corporate SaaS overheads', category: 'Payables' },
  { label: 'Average Project Margin', value: '68.4%', change: '+0.8%', isPositive: true, subtext: 'Earnings calls segment high', category: 'Efficiency' },
];

const VALIDATION_DATA = [
  { id: 'VAL-001', project: 'Q2 Earnings Call', client: 'S&P Global', contractor: 'Sarah Chen', hours: 14.5, completed: true, qa: true, invoiceReady: true, contractorPayReady: true, clientBillingReady: true, missingInfo: [], status: 'Valid', notes: 'Automated match confirmed.' },
  { id: 'VAL-002', project: 'Analyst Day Session 1', client: 'BlackRock Inc.', contractor: 'Marcus Rodriguez', hours: 22.0, completed: true, qa: true, invoiceReady: false, contractorPayReady: true, clientBillingReady: false, missingInfo: ['Client PO Missing'], status: 'Action Required', notes: 'Awaiting internal PO clearance.' },
  { id: 'VAL-003', project: 'Deposition Transcript #94', client: 'Latham & Watkins', contractor: 'Yuki Tanaka', hours: 8.2, completed: true, qa: false, invoiceReady: false, contractorPayReady: false, clientBillingReady: false, missingInfo: ['QA Review Pending'], status: 'In Review', notes: 'High legal terminology check.' },
  { id: 'VAL-004', project: 'Tech Summit Panel', client: 'Vercel Inc.', contractor: 'Emma Wilson', hours: 4.0, completed: true, qa: true, invoiceReady: true, contractorPayReady: true, clientBillingReady: true, missingInfo: [], status: 'Valid', notes: 'Ready for batch trigger.' },
  { id: 'VAL-005', project: 'UK Market Briefing', client: 'Barclays Bank', contractor: 'Liam Gallagher', hours: 18.7, completed: false, qa: false, invoiceReady: false, contractorPayReady: false, clientBillingReady: false, missingInfo: ['Audio Upload Incomplete', 'Tax Form W-8BEN Expired'], status: 'Critical Flag', notes: 'Contractor onboarding stalled.' },
];

const CLIENT_INVOICES = [
  { id: 'INV-2026-001', client: 'S&P Global', project: 'Q2 Earnings Call', issueDate: '2026-06-15', dueDate: '2026-07-15', status: 'Paid', subtotal: 4500.00, tax: 360.00, discount: 0.00, total: 4860.00, amountPaid: 4860.00, method: 'Stripe ACH' },
  { id: 'INV-2026-002', client: 'BlackRock Inc.', project: 'Analyst Day Session 1', issueDate: '2026-06-18', dueDate: '2026-07-18', status: 'Pending', subtotal: 6800.00, tax: 544.00, discount: 200.00, total: 7144.00, amountPaid: 0.00, method: 'Wire Transfer' },
  { id: 'INV-2026-003', client: 'Latham & Watkins', project: 'Deposition Transcript #94', issueDate: '2026-06-20', dueDate: '2026-07-20', status: 'Draft', subtotal: 2400.00, tax: 192.00, discount: 0.00, total: 2592.00, amountPaid: 0.00, method: 'ACH' },
  { id: 'INV-2026-004', client: 'Vercel Inc.', project: 'Tech Summit Panel', issueDate: '2026-05-10', dueDate: '2026-06-10', status: 'Overdue', subtotal: 1200.00, tax: 96.00, discount: 0.00, total: 1296.00, amountPaid: 0.00, method: 'Credit Card' },
  { id: 'INV-2026-005', client: 'Sequoia Capital', project: 'LP Meeting 2026', issueDate: '2026-06-01', dueDate: '2026-07-01', status: 'Paid', subtotal: 15400.00, tax: 1232.00, discount: 500.00, total: 16132.00, amountPaid: 16132.00, method: 'Wire Transfer' },
];

const CONTRACTOR_PAYMENTS = [
  { name: 'Sarah Chen', country: 'United States', method: 'Bank Transfer', rate: 85.00, audioHours: 14.5, billableHours: 14.5, adjustments: 0.00, bonuses: 150.00, deductions: 0.00, taxes: 0.00, totalDue: 1382.50, status: 'Approved', txId: 'TXN-908234-US' },
  { name: 'Marcus Rodriguez', country: 'Argentina', method: 'Wise', rate: 65.00, audioHours: 22.0, billableHours: 22.0, adjustments: -25.00, bonuses: 0.00, deductions: 25.00, taxes: 0.00, totalDue: 1405.00, status: 'Ready to Pay', txId: 'Awaiting Trigger' },
  { name: 'Yuki Tanaka', country: 'Japan', method: 'Wise', rate: 90.00, audioHours: 8.2, billableHours: 8.2, adjustments: 0.00, bonuses: 50.00, deductions: 0.00, taxes: 0.00, totalDue: 788.00, status: 'Hold', txId: 'None' },
  { name: 'Emma Wilson', country: 'United Kingdom', method: 'PayPal', rate: 75.00, audioHours: 4.0, billableHours: 4.0, adjustments: 0.00, bonuses: 0.00, deductions: 0.00, taxes: 0.00, totalDue: 300.00, status: 'Paid', txId: 'TXN-712411-UK' },
  { name: 'Liam Gallagher', country: 'Ireland', method: 'Bank Transfer', rate: 70.00, audioHours: 18.7, billableHours: 0.0, adjustments: 0.00, bonuses: 0.00, deductions: 0.00, taxes: 0.00, totalDue: 0.00, status: 'Hold', txId: 'None' },
];

const APPROVAL_QUEUE = [
  { id: 'APP-01', worker: 'Marcus Rodriguez', client: 'BlackRock Inc.', project: 'Analyst Day Session 1', amount: '$1,405.00', reason: 'Standard cycle processing', submittedBy: 'System Core Engine', statuses: { ready: true, finApproved: true, ceoApproved: false } },
  { id: 'APP-02', worker: 'Sarah Chen', client: 'S&P Global', project: 'Special Urgent Flash Call', amount: '$450.00', reason: 'Out-of-cycle rush bonus applied', submittedBy: 'Ops Lead (Alex)', statuses: { ready: true, finApproved: true, ceoApproved: true } },
  { id: 'APP-03', worker: 'Yuki Tanaka', client: 'Latham & Watkins', project: 'Deposition Transcript #94', amount: '$788.00', reason: 'Manual override log review required', submittedBy: 'QA Controller (Dmitri)', statuses: { ready: false, finApproved: false, ceoApproved: false } },
];

const UNIT_ECONOMICS = [
  { label: 'Revenue Per Audio Hour', value: '$310.00', description: 'Blended premium tier average' },
  { label: 'Cost Per Audio Hour', value: '$78.50', description: 'Blended contractor payout scale' },
  { label: 'Gross Margin %', value: '74.6%', description: 'Net production calculation margin' },
  { label: 'Net Margin %', value: '45.8%', description: 'Post infrastructure overheads' },
  { label: 'Average Contractor Cost', value: '$1,150.00', description: 'Per specialized monthly pool instance' },
  { label: 'Average Client Spend', value: '$14,200.00', description: 'Enterprise accounts ARR dynamic' },
  { label: 'Utilization Rate', value: '94.2%', description: 'Active transcription grid workload' },
  { label: 'Profit Per Project', value: '$2,480.00', description: 'Mean weighted standard projects' },
];

const RECENT_TRANSACTIONS = [
  { id: 'TX-10023', type: 'Incoming Payment', entity: 'S&P Global', method: 'Stripe', amount: '+$4,860.00', timestamp: '10 mins ago', status: 'Success' },
  { id: 'TX-10024', type: 'Payroll Outflow', entity: 'Emma Wilson', method: 'PayPal', amount: '-$300.00', timestamp: '1 hour ago', status: 'Success' },
  { id: 'TX-10025', type: 'Invoice Paid', entity: 'Sequoia Capital', method: 'Bank Transfer', amount: '+$16,132.00', timestamp: '4 hours ago', status: 'Success' },
  { id: 'TX-10026', type: 'Manual Adjustment', entity: 'Marcus Rodriguez', method: 'Wise Ledger', amount: '-$25.00', timestamp: '1 day ago', status: 'Processed' },
  { id: 'TX-10027', type: 'Wire Transfer Out', entity: 'Amazon Web Services', method: 'Mercury Auth', amount: '-$4,210.50', timestamp: '2 days ago', status: 'Success' },
];

const RECHARTS_CHART_DATA = [
  { name: 'Jan', revenue: 185000, expenses: 110000, payroll: 52000, cashflow: 75000 },
  { name: 'Feb', revenue: 210000, expenses: 115000, payroll: 55000, cashflow: 95000 },
  { name: 'Mar', revenue: 245000, expenses: 130000, payroll: 61000, cashflow: 115000 },
  { name: 'Apr', revenue: 230000, expenses: 128000, payroll: 59000, cashflow: 102000 },
  { name: 'May', revenue: 275000, expenses: 145000, payroll: 68000, cashflow: 130000 },
  { name: 'Jun', revenue: 285400, expenses: 148000, payroll: 73240, cashflow: 137400 },
];

const RECHARTS_PIE_DATA = [
  { name: 'S&P Global', value: 35 },
  { name: 'BlackRock Inc.', value: 25 },
  { name: 'Latham & Watkins', value: 20 },
  { name: 'Vercel Inc.', value: 12 },
  { name: 'Others', value: 8 },
];

const COLORS = ['#0f172a', '#1e3a8a', '#2563eb', '#3b82f6', '#94a3b8'];

// ==============================================================================
// MAIN COMPONENT EXPORT
// ==============================================================================

export default function FinanceOperationsDashboard() {
  // Global View Layout Modes & Skeletons / Drawers simulations
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('All');
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);

  // Scenario Planning simulation state
  const [simulationMode, setSimulationMode] = useState<'Expected' | 'Best Case' | 'Worst Case'>('Expected');

  // Automation toggles state
  const [automations, setAutomations] = useState({
    autoInvoice: true,
    autoContractorPay: false,
    autoReminders: true,
    autoLateFee: true,
    autoMarginCalc: true,
    autoPayrollCalc: true,
    autoClientStatements: false,
    autoWeeklyReports: true,
    autoBackups: true
  });

  const handleToggleAutomation = (key: keyof typeof automations) => {
    setAutomations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Simulated live metrics based on planning mode
  const currentRevenueForecast = useMemo(() => {
    if (simulationMode === 'Best Case') return '$342,000.00 (+19.8%)';
    if (simulationMode === 'Worst Case') return '$210,500.00 (-26.2%)';
    return '$285,400.00 (Stable Baseline)';
  }, [simulationMode]);

  const currentPayrollForecast = useMemo(() => {
    if (simulationMode === 'Best Case') return '$82,500.00 (High demand volume)';
    if (simulationMode === 'Worst Case') return '$54,000.00 (Lower fulfillment pool)';
    return '$73,240.00 (Standard Queue)';
  }, [simulationMode]);

  const filteredInvoices = useMemo(() => {
    return CLIENT_INVOICES.filter(invoice => {
      const matchesStatus = selectedInvoiceStatus === 'All' || invoice.status === selectedInvoiceStatus;
      const matchesSearch = invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            invoice.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [selectedInvoiceStatus, searchQuery]);

  const triggerDataRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 antialiased">
      
      {/* GLOBAL TOP ANNOUNCEMENT BANNER */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="bg-blue-600 text-[10px] uppercase font-black px-1.5 py-0.5 rounded text-white">Live System</span>
          <span>Core Infrastructure Engine Active v2.4.9 // FinOps Guardrails Synchronized.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Server Epoch: 2026-06-28</span>
          <button onClick={triggerDataRefresh} className="hover:text-white flex items-center gap-1 transition-colors">
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Sync Ledger
          </button>
        </div>
      </div>

      {/* PARENT RESPONSIVE EXECUTIVE LAYOUT GRID */}
      <div className="max-w-[1700px] mx-auto p-4 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT & CENTER INTERNET-SCALE CONSOLE AREA (9 COLUMNS) */}
        <main className="xl:col-span-9 space-y-8">
          
          {/* ==============================================================================
              PAGE HEADER BLOCK
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:border-slate-300">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">
                <Layers className="w-3.5 h-3.5" /> Core Payment Infrastructure
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Finance Operations <span className="text-slate-400 text-xl font-normal font-mono">/ Headquarters</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage corporate client invoices, automated payment cycles, cross-border contractor payroll, and realtime unit profitability thresholds.
              </p>
            </div>
            
            {/* Action buttons matching Stripe SaaS layout rules */}
            <div className="flex flex-wrap items-center gap-2">
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all duration-200 flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export Reports
              </button>
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all duration-200 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Import Operations Data
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Create Invoice
              </button>
              <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Run Payment Cycle
              </button>
            </div>
          </div>

          {/* ==============================================================================
              TOP METRIC CONSOLE (12 CARD GRID SIMULATED IN TIGHT SAAS HOVER FLEX)
             ============================================================================== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Live KPIs Threshold Monitor</h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">Data update real-time</span>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse h-24" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {INITIAL_METRICS.map((metric, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-slate-500 truncate block max-w-[80%]">{metric.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        metric.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900 tracking-tight mt-1 group-hover:text-blue-900 transition-colors">
                      {metric.value}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                      <span>{metric.subtext}</span>
                      <span className="bg-slate-50 text-slate-500 uppercase px-1 rounded text-[9px] font-sans font-bold">{metric.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==============================================================================
              PAYMENT CYCLE STATUS CONTROL PANEL
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  Active Payout Cycle Blueprint
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Current settlement processing sequence for period ending June 2026.</p>
              </div>
              <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 bg-white text-slate-900 rounded font-bold shadow-xs">Batch Cycle #CYC-2026-06</span>
              </div>
            </div>

            {/* Pipeline Stepper Control Map with High Visibility States */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-center">
              {[
                { title: 'Collection Status', status: 'Success', color: 'bg-emerald-500', desc: '98.4% Collected' },
                { title: 'Ops Data Sync', status: 'Success', color: 'bg-emerald-500', desc: 'All Audio Logs In' },
                { title: 'QA Completed', status: 'Warning', color: 'bg-amber-500', desc: '1 Project Pending' },
                { title: 'Invoices Generated', status: 'Success', color: 'bg-emerald-500', desc: 'Automated 42 client' },
                { title: 'Payments Ready', status: 'Neutral', color: 'bg-blue-600', desc: 'Awaiting Run Action' },
                { title: 'Payments Sent', status: 'Idle', color: 'bg-slate-300', desc: '0% Dispatched' },
                { title: 'Reconciliation', status: 'Idle', color: 'bg-slate-300', desc: 'Post-payment phase' },
              ].map((step, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 relative hover:bg-white hover:border-slate-200 transition-all">
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400" style={{ backgroundColor: step.color === 'bg-emerald-500' ? '#10b981' : step.color === 'bg-amber-500' ? '#f59e0b' : step.color === 'bg-blue-600' ? '#2563eb' : '#cbd5e1' }} />
                  <div className="text-[11px] font-bold text-slate-400 font-mono tracking-wider mb-1">STEP 0{idx + 1}</div>
                  <div className="text-xs font-black text-slate-800 line-clamp-1">{step.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono leading-tight">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ==============================================================================
              OPERATIONS DATA VALIDATION ENGINE
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Audio Operations Pipeline Validation Engine</h3>
              </div>
              <span className="text-[10px] bg-red-900 text-red-200 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                Auto-Flag Activated
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Project & Client</th>
                    <th className="p-4">Contractor</th>
                    <th className="p-4 text-center">Audio Hours</th>
                    <th className="p-4 text-center">QA Verification</th>
                    <th className="p-4 text-center">Client Bill / Pay Ready</th>
                    <th className="p-4">Validation Flags & Missing Data</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {VALIDATION_DATA.map((val) => {
                    const isAlert = val.status === 'Critical Flag' || val.status === 'Action Required';
                    return (
                      <tr key={val.id} className={`hover:bg-slate-50 transition-colors ${isAlert ? 'bg-amber-50/40' : ''}`}>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{val.project}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{val.client}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{val.contractor}</td>
                        <td className="p-4 text-center font-mono font-semibold text-slate-900">{val.hours} hrs</td>
                        <td className="p-4 text-center">
                          {val.qa ? (
                            <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">Verified</span>
                          ) : (
                            <span className="inline-flex items-center justify-center bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">Pending QA</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-[10px]">
                            <span className={`px-1.5 py-0.5 rounded font-mono ${val.clientBillingReady ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Bill</span>
                            <span className={`px-1.5 py-0.5 rounded font-mono ${val.contractorPayReady ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Pay</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {val.missingInfo.length > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              {val.missingInfo.map((info, i) => (
                                <span key={i} className="text-[10px] text-rose-700 font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-rose-500 flex-shrink-0" /> {info}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px] font-mono">{val.notes}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            val.status === 'Valid' ? 'bg-emerald-100 text-emerald-900' : 
                            val.status === 'In Review' ? 'bg-blue-100 text-blue-900' : 'bg-rose-100 text-rose-900'
                          }`}>
                            {val.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==============================================================================
              CLIENT INVOICES HEADQUARTERS
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Client Invoicing Register</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Filter, search, audit and issue customer billing manifests globally.</p>
                </div>
                
                {/* Search input and advanced status filter row */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search accounts..." 
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-hidden focus:border-blue-600 transition-all font-mono"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-1 text-xs font-medium text-slate-600">
                    {['All', 'Paid', 'Pending', 'Overdue', 'Draft'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => setSelectedInvoiceStatus(status)}
                        className={`px-2.5 py-1 rounded-md text-[11px] transition-all font-bold ${
                          selectedInvoiceStatus === status ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Client Entity</th>
                    <th className="p-4">Project Association</th>
                    <th className="p-4">Timeline Dates</th>
                    <th className="p-4 text-right">Financial Breakdown (USD)</th>
                    <th className="p-4 text-center">Settlement</th>
                    <th className="p-4 text-center">Route Method</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-blue-900">{invoice.id}</td>
                      <td className="p-4 font-sans font-bold text-slate-800">{invoice.client}</td>
                      <td className="p-4 font-sans text-slate-600 text-[11px]">{invoice.project}</td>
                      <td className="p-4 text-[11px] text-slate-500">
                        <div>Issued: {invoice.issueDate}</div>
                        <div className="font-semibold text-slate-700">Due: {invoice.dueDate}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-sans font-black text-slate-900">${invoice.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                        <div className="text-[10px] text-slate-400">Sub: ${invoice.subtotal} // Tax: ${invoice.tax}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-black ${
                          invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 
                          invoice.status === 'Pending' ? 'bg-amber-100 text-amber-900' : 
                          invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-900' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {invoice.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center text-slate-600 font-sans text-[11px]">{invoice.method}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white shadow-xs text-[11px] font-sans overflow-hidden">
                          <button className="px-2.5 py-1 hover:bg-slate-50 text-slate-700 border-r border-slate-100">Send</button>
                          <button className="px-2.5 py-1 hover:bg-slate-50 text-slate-700 border-r border-slate-100">PDF</button>
                          <button className="px-2.5 py-1 hover:bg-slate-50 text-slate-900 font-bold bg-slate-50">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-sans italic">
                        No invoices matches selected scope filters. Try adjusting query scope parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==============================================================================
              CONTRACTOR PAYROLL CONTROLLER
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Contractor Global Payroll Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Calculated production payouts across global bank wire systems, Wise batches, and PayPal APIs.</p>
              </div>
              <button className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                Export Mass Wise Batch CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Contractor Name</th>
                    <th className="p-4"><Globe className="w-3 h-3 inline mr-1" /> Destination</th>
                    <th className="p-4">Route System</th>
                    <th className="p-4 text-right">Hourly Rate</th>
                    <th className="p-4 text-center">Audio / Bill Hours</th>
                    <th className="p-4 text-right">Bonuses / Adj</th>
                    <th className="p-4 text-right font-black text-slate-900">Total Net Due</th>
                    <th className="p-4 text-center">System Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {CONTRACTOR_PAYMENTS.map((con, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-sans font-bold text-slate-900">{con.name}</td>
                      <td className="p-4 font-sans text-slate-600 text-[11px]">{con.country}</td>
                      <td className="p-4 font-sans">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                          {con.method}
                        </span>
                      </td>
                      <td className="p-4 text-right">${con.rate.toFixed(2)}/hr</td>
                      <td className="p-4 text-center text-slate-600">
                        {con.audioHours} / <span className="font-bold text-slate-900">{con.billableHours}</span>
                      </td>
                      <td className="p-4 text-right text-emerald-700">
                        +${con.bonuses.toFixed(2)} <span className="text-rose-600">(-${con.deductions.toFixed(2)})</span>
                      </td>
                      <td className="p-4 text-right font-sans font-black text-blue-900 text-sm">
                        ${con.totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="p-4 text-center font-sans">
                        <div className="flex items-center justify-center gap-1.5">
                          {con.status === 'Approved' && <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Approved</span>}
                          {con.status === 'Ready to Pay' && <button className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded hover:bg-blue-700">Execute</button>}
                          {con.status === 'Hold' && <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">On Hold</span>}
                          {con.status === 'Paid' && <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono truncate max-w-[80px]">{con.txId}</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==============================================================================
              PAYMENT APPROVAL QUEUE BLOCK
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Multi-Signatory Multi-Level Payment Approval Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dual-authorization requirements for enterprise risk mitigations before capital flight occurs.</p>
              </div>
              <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-mono font-bold">3 Batches Awaiting Node Clearance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {APPROVAL_QUEUE.map((app) => (
                <div key={app.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all duration-200 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono bg-slate-900 text-slate-200 px-1.5 py-0.5 rounded font-bold">{app.id}</span>
                      <h4 className="text-xs font-black text-slate-900 mt-1">{app.worker}</h4>
                    </div>
                    <div className="text-base font-black text-blue-900 tracking-tight">{app.amount}</div>
                  </div>
                  
                  <div className="text-[11px] text-slate-500 space-y-1 my-3 bg-white p-2 rounded border border-slate-100 font-mono">
                    <div><span className="text-slate-400">Client:</span> {app.client}</div>
                    <div className="truncate"><span className="text-slate-400">Proj:</span> {app.project}</div>
                    <div className="text-[10px] text-slate-400 italic">"{app.reason}"</div>
                  </div>

                  {/* Node approval signatures checkboxes map */}
                  <div className="space-y-1.5 mb-4 text-[10px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Finance Controller Sign:</span>
                      <span className={app.statuses.finApproved ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {app.statuses.finApproved ? '✓ Cleared' : '○ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Executive CEO Sign:</span>
                      <span className={app.statuses.ceoApproved ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {app.statuses.ceoApproved ? '✓ Cleared' : '○ Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold py-1.5 rounded text-rose-700 transition-colors">Reject</button>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-medium py-1.5 rounded text-slate-600 transition-colors">Modify</button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 rounded shadow-xs transition-colors">Approve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==============================================================================
              UNIT ECONOMICS & FINANCIAL MODELS ENGINE
             ============================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Interactive Scenario Planning Simulator */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    Macro Capital Scenario Predictor Simulator
                  </h3>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 mb-4">Simulate financial projections using active contractor billing trends against transcription fulfillment quotas.</p>
                
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-4">
                  {(['Worst Case', 'Expected', 'Best Case'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSimulationMode(mode)}
                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                        simulationMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Revenue Generation Run-Rate:</span>
                    <span className="font-bold text-slate-900">{currentRevenueForecast}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Fulfillment Contractor Outflow:</span>
                    <span className="font-bold text-slate-900">{currentPayrollForecast}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Pricing Multiplier Matrix:</span>
                    <span className="font-bold text-blue-700">1.45x blended scalar</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-[11px] text-slate-600 font-sans mt-4">
                <strong>Simulation Insight:</strong> Switching to {simulationMode} adjusts production margin vectors automatically. System updates cash runway variables across current enterprise liabilities.
              </div>
            </div>

            {/* Tight Grid of Unit Economics Metrics */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Unit Economic Margin Calculations</h3>
              <div className="grid grid-cols-2 gap-3">
                {UNIT_ECONOMICS.map((ue, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-white hover:border-slate-200 transition-all">
                    <div className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">{ue.label}</div>
                    <div className="text-base font-black text-slate-900 font-mono tracking-tight mt-0.5">{ue.value}</div>
                    <div className="text-[9px] text-slate-400 font-sans leading-tight mt-1">{ue.description}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ==============================================================================
              FINANCE CHARTS & VISUALIZATIONS (RECHARTS)
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Corporate Profitability & Outflow Visualizer</h3>
                <p className="text-xs text-slate-500 mt-0.5">Realtime monitoring of cashflows, monthly gross margins, and contractor payroll curves.</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Revenue Flow
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-slate-900" /> Contractor Payroll
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Primary Area Flow Chart */}
              <div className="lg:col-span-2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={RECHARTS_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Gross Revenue" />
                    <Area type="monotone" dataKey="payroll" stroke="#0f172a" strokeWidth={2} fillOpacity={0} name="Payroll Expense" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Distribution of Revenue across Major Client Accounts */}
              <div className="h-64 flex flex-col justify-between">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase text-center mb-1">Client Revenue Density</div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={RECHARTS_PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                        {RECHARTS_PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-500">
                  {RECHARTS_PIE_DATA.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="truncate">{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ==============================================================================
              AUTOMATION CENTER SYSTEMS PANEL
             ============================================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">FinOps Automation Routing Center</h3>
                <p className="text-xs text-slate-500">Configure autonomous cron triggers for processing client retainers and global contractor disbursements.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(automations) as Array<keyof typeof automations>).map((key) => (
                <div key={key} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex items-center justify-between hover:border-slate-200 transition-all">
                  <div>
                    <div className="text-xs font-bold text-slate-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{automations[key] ? 'Autonomous active' : 'Manual verification'}</div>
                  </div>
                  <button
                    onClick={() => handleToggleAutomation(key)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden ${
                      automations[key] ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform duration-200 ${automations[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* ==============================================================================
            RIGHT SIDEBAR CONTROL MODULE (3 COLUMNS)
           ============================================================================== */}
        <aside className="xl:col-span-3 space-y-6">

          {/* SIMULATED SYSTEM NOTIFICATION CENTER */}
          {isNotificationOpen && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-xs relative">
              <button 
                onClick={() => setIsNotificationOpen(false)}
                className="absolute top-3 right-3 text-amber-600 hover:text-amber-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex gap-2.5 items-start">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">FinOps Ledger Alerts (4)</h4>
                  <ul className="text-xs text-amber-800 space-y-2 mt-2 list-disc list-inside font-sans">
                    <li>Marcus Rodriguez missing valid W-8BEN form logs.</li>
                    <li>Latham & Watkins invoice overdue by 18 days.</li>
                    <li>2 transactions awaiting CEO multi-sig key validation.</li>
                    <li>Margin drop alert on transcript job segment #904.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* QUICK ACTIONS SIDE PANEL CONTAINER */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" /> Executive Quick Controls
            </h3>
            
            <div className="space-y-2.5 text-xs">
              {[
                { title: 'Generate Client Invoice', desc: 'Instant batch or single manifest' },
                { title: 'Pay Contractor Manually', desc: 'One-off priority override node' },
                { title: 'Create Credit Note', desc: 'Client compensation system adjustment' },
                { title: 'Record Corporate Expense', desc: 'Infrastructure or tool hosting' },
                { title: 'Sync Accounting Software', desc: 'Push current logs to QuickBooks/Xero' },
              ].map((act, i) => (
                <button 
                  key={i} 
                  className="w-full text-left bg-slate-800 border border-slate-700/60 hover:bg-slate-700/60 p-3 rounded-lg block transition-all group"
                >
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{act.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{act.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* CEO STRATEGIC INSIGHTS COGNITIVE PANEL */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600" /> CEO Intelligence Node
              </h3>
              <span className="text-[9px] uppercase font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">AI Enabled</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="text-slate-400 font-mono text-[10px]">HIGHEST PROFIT ACCOUNT:</div>
                <div className="font-bold text-slate-900 mt-0.5">S&P Global Operations <span className="text-emerald-600 font-mono font-normal">(78.4% Margin)</span></div>
              </div>
              <div className="border-t border-slate-100 pt-2.5">
                <div className="text-slate-400 font-mono text-[10px]">CRITICAL RUNWAY DEPTH:</div>
                <div className="font-bold text-slate-900 mt-0.5">14.2 Months <span className="text-slate-400 font-normal">at current base capital overheads</span></div>
              </div>
              <div className="border-t border-slate-100 pt-2.5">
                <div className="text-slate-400 font-mono text-[10px]">OUTSTANDING AUDIT RISKS:</div>
                <div className="font-semibold text-rose-700 mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> $12,400 locked in expired tax vectors
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2.5">
                <div className="text-slate-400 font-mono text-[10px]">STRATEGIC REALIGNMENT RECOMMENDATION:</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/40">
                  Legal transcription jobs display a 14% increase in processing complexity. Recommend increasing client base-tier pricing by $0.40/minute to sustain current margins.
                </p>
              </div>
            </div>
          </div>

          {/* REALTIME TIMELINE OF LEDGER TRANSFERS */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono mb-4">Ledger Stream Timeline</h3>
            
            <div className="space-y-4 relative before:absolute before:top-1 before:bottom-1 before:left-3 before:w-0.5 before:bg-slate-100">
              {RECENT_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="relative pl-7 group text-xs">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white group-hover:bg-blue-600 transition-colors" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900">{tx.entity}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.type} • {tx.method}</div>
                    </div>
                    <div className={`font-mono font-bold ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.amount}
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">{tx.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPORT ROUTING HUB (INTEGRATIONS CENTER) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Native Accounting Integrations
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
              {['QuickBooks', 'Xero Connect', 'NetSuite', 'Stripe Sync', 'Wise Node', 'Excel Macro'].map((plat) => (
                <button key={plat} className="border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 py-1.5 rounded transition-all text-slate-600 font-medium">
                  {plat}
                </button>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* ==============================================================================
          GLOBAL FOOTER SUMMARY STRIP (COMPREHENSIVE BALANCES MAPPED EDGE TO EDGE)
         ============================================================================== */}
      <footer className="mt-12 bg-slate-950 text-white border-t border-slate-900 sticky bottom-0 z-50 shadow-2xl backdrop-blur-md bg-opacity-95">
        <div className="max-w-[1700px] mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-4 text-xs font-mono items-center">
          
          <div className="lg:col-span-2">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider font-sans font-bold">Consolidated System Margin</div>
            <div className="text-lg font-black text-blue-400 mt-0.5">74.32% <span className="text-xs font-normal text-slate-500">Gross</span></div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px]">TOTAL REVENUE</div>
            <div className="font-bold text-white mt-0.5">$285,400.00</div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px]">TOTAL EXPENSES</div>
            <div className="font-bold text-rose-400 mt-0.5">$148,000.00</div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px]">NET CASH FLOW</div>
            <div className="font-bold text-emerald-400 mt-0.5">+$137,400.00</div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px]">ACCOUNTS RECEIVABLE</div>
            <div className="font-bold text-white mt-0.5">$186,500.00</div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px]">ACCOUNTS PAYABLE</div>
            <div className="font-bold text-slate-300 mt-0.5">$12,450.00</div>
          </div>

          <div>
            <div className="text-slate-400 text-[10px]">BATCH PAYROLL DUE</div>
            <div className="font-bold text-amber-400 mt-0.5">$64,150.00</div>
          </div>

          <div className="lg:col-span-1 text-right">
            <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-sans font-black tracking-wide border border-emerald-800/40">
              <Check className="w-3 h-3" /> LEDGER AUDITED
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
