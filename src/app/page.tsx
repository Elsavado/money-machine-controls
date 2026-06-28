'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  Download,
  Plus,
  Filter,
  Search,
  Settings,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  Lock,
  Unlock,
  ChevronDown,
  Calendar,
  Globe,
  CreditCard,
  Activity,
  Target,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUpIcon,
  Bell,
  Menu,
  X,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface KPIMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend: number;
  isPositive: boolean;
  icon: React.ReactNode;
  chart?: number[];
}

interface PaymentCycleStep {
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  timestamp?: Date;
}

interface OperationsDataRow {
  id: string;
  project: string;
  client: string;
  contractor: string;
  audioHours: number;
  completed: boolean;
  qa: boolean;
  invoiceReady: boolean;
  contractorPayReady: boolean;
  clientBillingReady: boolean;
  missingInfo: string[];
  status: 'ready' | 'needs_attention' | 'blocked';
  notes: string;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  project: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  remaining: number;
  paymentMethod: string;
}

interface ContractorPayment {
  id: string;
  contractor: string;
  country: string;
  paymentMethod: 'bank' | 'wise' | 'paypal' | 'stripe';
  hourlyRate: number;
  audioHours: number;
  billableHours: number;
  adjustments: number;
  bonuses: number;
  deductions: number;
  taxes: number;
  totalDue: number;
  status: 'pending' | 'approved' | 'paid' | 'hold';
  paymentDate?: Date;
  transactionId?: string;
}

interface ApprovalItem {
  id: string;
  worker: string;
  client: string;
  project: string;
  amount: number;
  reason: string;
  submittedBy: string;
  financeApproved: boolean;
  ceoApproved: boolean;
  readyToPay: boolean;
}

// ============================================================================
// DEMO DATA
// ============================================================================

const generateMonthlyData = () => [
  { month: 'Jan', revenue: 145000, expenses: 89000, payroll: 62000 },
  { month: 'Feb', revenue: 158000, expenses: 92000, payroll: 65000 },
  { month: 'Mar', revenue: 172000, expenses: 95000, payroll: 68000 },
  { month: 'Apr', revenue: 189000, expenses: 98000, payroll: 71000 },
  { month: 'May', revenue: 201000, expenses: 101000, payroll: 73000 },
  { month: 'Jun', revenue: 218000, expenses: 104000, payroll: 76000 },
];

const generatePayrollTrend = () => [
  { month: 'Jan', amount: 62000 },
  { month: 'Feb', amount: 65000 },
  { month: 'Mar', amount: 68000 },
  { month: 'Apr', amount: 71000 },
  { month: 'May', amount: 73000 },
  { month: 'Jun', amount: 76000 },
];

const generateCashFlow = () => [
  { month: 'Jan', inflow: 145000, outflow: 151000 },
  { month: 'Feb', inflow: 158000, outflow: 157000 },
  { month: 'Mar', inflow: 172000, outflow: 163000 },
  { month: 'Apr', inflow: 189000, outflow: 169000 },
  { month: 'May', inflow: 201000, outflow: 174000 },
  { month: 'Jun', inflow: 218000, outflow: 180000 },
];

const generateRevenueDistribution = () => [
  { name: 'TechCorp Inc', value: 45000 },
  { name: 'MediaGroup Ltd', value: 38000 },
  { name: 'HealthSys', value: 32000 },
  { name: 'FinanceFlow', value: 28000 },
  { name: 'Others', value: 75000 },
];

const COLORS = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

const demoInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    client: 'TechCorp Inc',
    project: 'Product Interviews',
    issueDate: new Date('2024-06-01'),
    dueDate: new Date('2024-06-15'),
    status: 'paid',
    subtotal: 12500,
    tax: 1250,
    discount: 0,
    total: 13750,
    amountPaid: 13750,
    remaining: 0,
    paymentMethod: 'Stripe',
  },
  {
    id: '2',
    number: 'INV-2024-002',
    client: 'MediaGroup Ltd',
    project: 'Podcast Transcription',
    issueDate: new Date('2024-06-10'),
    dueDate: new Date('2024-06-24'),
    status: 'pending',
    subtotal: 8900,
    tax: 890,
    discount: 0,
    total: 9790,
    amountPaid: 0,
    remaining: 9790,
    paymentMethod: 'ACH',
  },
  {
    id: '3',
    number: 'INV-2024-003',
    client: 'HealthSys',
    project: 'Medical Records Transcription',
    issueDate: new Date('2024-05-15'),
    dueDate: new Date('2024-05-29'),
    status: 'overdue',
    subtotal: 15000,
    tax: 1500,
    discount: 500,
    total: 16000,
    amountPaid: 5000,
    remaining: 11000,
    paymentMethod: 'Wire',
  },
];

const demoContractors: ContractorPayment[] = [
  {
    id: '1',
    contractor: 'Sarah Chen',
    country: 'USA',
    paymentMethod: 'bank',
    hourlyRate: 45,
    audioHours: 120,
    billableHours: 118,
    adjustments: 200,
    bonuses: 500,
    deductions: 0,
    taxes: 2700,
    totalDue: 7400,
    status: 'approved',
    paymentDate: new Date('2024-06-15'),
  },
  {
    id: '2',
    contractor: 'Marcus Rodriguez',
    country: 'Mexico',
    paymentMethod: 'wise',
    hourlyRate: 28,
    audioHours: 156,
    billableHours: 154,
    adjustments: 0,
    bonuses: 0,
    deductions: 150,
    taxes: 1200,
    totalDue: 3974,
    status: 'pending',
  },
  {
    id: '3',
    contractor: 'Yuki Tanaka',
    country: 'Japan',
    paymentMethod: 'wise',
    hourlyRate: 35,
    audioHours: 98,
    billableHours: 96,
    adjustments: 100,
    bonuses: 250,
    deductions: 0,
    taxes: 1100,
    totalDue: 4450,
    status: 'paid',
  },
  {
    id: '4',
    contractor: 'Emma Wilson',
    country: 'UK',
    paymentMethod: 'paypal',
    hourlyRate: 42,
    audioHours: 134,
    billableHours: 132,
    adjustments: 0,
    bonuses: 0,
    deductions: 0,
    taxes: 2200,
    totalDue: 3326,
    status: 'hold',
  },
];

const demoOperationsData: OperationsDataRow[] = [
  {
    id: '1',
    project: 'Product Interviews',
    client: 'TechCorp Inc',
    contractor: 'Sarah Chen',
    audioHours: 120,
    completed: true,
    qa: true,
    invoiceReady: true,
    contractorPayReady: true,
    clientBillingReady: true,
    missingInfo: [],
    status: 'ready',
    notes: 'All documentation complete',
  },
  {
    id: '2',
    project: 'Podcast Transcription',
    client: 'MediaGroup Ltd',
    contractor: 'Marcus Rodriguez',
    audioHours: 156,
    completed: true,
    qa: true,
    invoiceReady: false,
    contractorPayReady: true,
    clientBillingReady: false,
    missingInfo: ['Client address update', 'Tax ID'],
    status: 'needs_attention',
    notes: 'Waiting on client updated information',
  },
  {
    id: '3',
    project: 'Medical Records',
    client: 'HealthSys',
    contractor: 'Yuki Tanaka',
    audioHours: 98,
    completed: false,
    qa: false,
    invoiceReady: false,
    contractorPayReady: false,
    clientBillingReady: false,
    missingInfo: ['QA review', 'Compliance check'],
    status: 'blocked',
    notes: 'HIPAA compliance review required',
  },
  {
    id: '4',
    project: 'Legal Deposition',
    client: 'FinanceFlow',
    contractor: 'Emma Wilson',
    audioHours: 134,
    completed: true,
    qa: false,
    invoiceReady: false,
    contractorPayReady: false,
    clientBillingReady: false,
    missingInfo: ['QA sign-off', 'Time audit'],
    status: 'needs_attention',
    notes: 'In QA queue',
  },
];

const demoApprovalQueue: ApprovalItem[] = [
  {
    id: '1',
    worker: 'Sarah Chen',
    client: 'TechCorp Inc',
    project: 'Product Interviews',
    amount: 7400,
    reason: 'Monthly contractor payment',
    submittedBy: 'Finance Bot',
    financeApproved: true,
    ceoApproved: false,
    readyToPay: false,
  },
  {
    id: '2',
    worker: 'Marcus Rodriguez',
    client: 'MediaGroup Ltd',
    project: 'Podcast Transcription',
    amount: 3974,
    reason: 'Monthly contractor payment',
    submittedBy: 'Finance Bot',
    financeApproved: false,
    ceoApproved: false,
    readyToPay: false,
  },
];
// ============================================================================
// COMPONENT: KPI CARD
// ============================================================================

const KPICard: React.FC<{ metric: KPIMetric }> = ({ metric }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-600 font-medium">{metric.label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {typeof metric.value === 'number'
              ? `$${metric.value.toLocaleString()}`
              : metric.value}
            {metric.unit && <span className="text-sm text-slate-500"> {metric.unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
        <div className="text-slate-400">{metric.icon}</div>
      </div>
      <div className="flex items-center gap-2">
        {metric.isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span className={metric.isPositive ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(metric.trend)}%
        </span>
        <span className="text-xs text-slate-500">vs last month</span>
      </div>
      {metric.chart && (
        <div className="mt-4 h-12 flex items-end gap-1">
          {metric.chart.map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-200 rounded-t"
              style={{ height: `${(value / Math.max(...metric.chart!)) * 100)}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT: PAYMENT CYCLE STATUS
// ============================================================================

const PaymentCycleStatus: React.FC<{
  steps: PaymentCycleStep[];
}> = ({ steps }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Cycle Status - June 2024</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {step.status === 'completed' && (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
                {step.status === 'in_progress' && (
                  <Clock className="w-6 h-6 text-blue-600 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                )}
                {step.status === 'failed' && (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <span className="font-medium text-slate-900">{step.name}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {step.timestamp ? step.timestamp.toLocaleDateString() : 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: OPERATIONS DATA TABLE
// ============================================================================

const OperationsDataTable: React.FC<{
  data: OperationsDataRow[];
}> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 overflow-hidden">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Operations Data Validation</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Project</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Contractor</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Audio Hrs</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Completed</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">QA</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Invoice Ready</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Pay Ready</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Missing Info</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{row.project}</td>
                <td className="px-4 py-3 text-slate-600">{row.client}</td>
                <td className="px-4 py-3 text-slate-600">{row.contractor}</td>
                <td className="px-4 py-3 text-right text-slate-600">{row.audioHours}</td>
                <td className="px-4 py-3 text-center">
                  {row.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.qa ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.invoiceReady ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.contractorPayReady ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {row.missingInfo.length > 0 ? (
                    <div className="text-xs text-red-600 font-medium">
                      {row.missingInfo.length} items
                    </div>
                  ) : (
                    <span className="text-xs text-green-600">Complete</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {row.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: INVOICES TABLE
// ============================================================================

const InvoicesTable: React.FC<{
  invoices: Invoice[];
}> = ({ invoices }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = useMemo(() => {
    if (statusFilter === 'all') return invoices;
    return invoices.filter((inv) => inv.status === statusFilter);
  }, [invoices, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Client Invoices</h3>
        <div className="flex gap-2">
          {['all', 'pending', 'paid', 'overdue', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Invoice</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Project</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Due Date</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Total</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Paid</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Remaining</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{invoice.number}</td>
                <td className="px-4 py-3 text-slate-600">{invoice.client}</td>
                <td className="px-4 py-3 text-slate-600">{invoice.project}</td>
                <td className="px-4 py-3 text-slate-600">
                  {invoice.dueDate.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  ${invoice.total.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-green-600 font-medium">
                  ${invoice.amountPaid.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  ${invoice.remaining.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: CONTRACTOR PAYMENTS TABLE
// ============================================================================

const ContractorPaymentsTable: React.FC<{
  payments: ContractorPayment[];
}> = ({ payments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Contractor Payments</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Contractor</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Country</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Method</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Rate</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Hours</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Adjustments</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Total Due</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{payment.contractor}</td>
                <td className="px-4 py-3 text-slate-600">{payment.country}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{payment.paymentMethod}</td>
                <td className="px-4 py-3 text-right text-slate-600">
                  ${payment.hourlyRate}/hr
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{payment.audioHours}</td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {payment.adjustments > 0 ? '+' : ''}${payment.adjustments}
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">
                  ${payment.totalDue.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: APPROVAL QUEUE
// ============================================================================

const ApprovalQueue: React.FC<{
  items: ApprovalItem[];
}> = ({ items }) => {
  const pendingItems = items.filter((item) => !item.readyToPay);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Approval Queue</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-900">{item.worker}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {item.client} • {item.project}
                </p>
              </div>
              <p className="text-lg font-bold text-slate-900">${item.amount.toLocaleString()}</p>
            </div>

            <div className="space-y-2 mb-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                {item.financeApproved ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs text-slate-600">Finance Approved</span>
              </div>
              <div className="flex items-center gap-2">
                {item.ceoApproved ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs text-slate-600">CEO Approved</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
                Approve
              </button>
              <button className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-medium rounded transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: UNIT ECONOMICS
// ============================================================================

const UnitEconomics: React.FC = () => {
  const metrics = [
    {
      label: 'Revenue Per Audio Hour',
      value: '$52.50',
      trend: '+8.2%',
      positive: true,
    },
    {
      label: 'Cost Per Audio Hour',
      value: '$18.75',
      trend: '+2.1%',
      positive: false,
    },
    {
      label: 'Gross Margin %',
      value: '64.3%',
      trend: '+5.1%',
      positive: true,
    },
    {
      label: 'Average Client Spend',
      value: '$14,250',
      trend: '+12.5%',
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-600 font-medium">{metric.label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metric.value}</p>
          <div className="flex items-center gap-1 mt-2">
            {metric.positive ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={metric.positive ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
              {metric.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function FinanceDashboard() {
  const [showSidebar, setShowSidebar] = useState(true);

  const paymentCycleSteps: PaymentCycleStep[] = [
    {
      name: 'Operations Data Received',
      status: 'completed',
      timestamp: new Date('2024-06-01'),
    },
    { name: 'QA Completed', status: 'completed', timestamp: new Date('2024-06-02') },
    { name: 'Invoices Generated', status: 'completed', timestamp: new Date('2024-06-03') },
    {
      name: 'Payments Ready for Approval',
      status: 'in_progress',
      timestamp: new Date('2024-06-04'),
    },
    { name: 'CEO Approval', status: 'pending' },
    { name: 'Payments Sent', status: 'pending' },
    { name: 'Reconciliation', status: 'pending' },
  ];

  const kpiMetrics: KPIMetric[] = [
    {
      label: 'Outstanding Invoices',
      value: '$20,790',
      trend: -12.5,
      isPositive: true,
      icon: <FileText className="w-6 h-6" />,
      chart: [65, 72, 68, 75, 82, 78],
    },
    {
      label: 'Monthly Revenue',
      value: '$218,000',
      trend: 9.2,
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      chart: [145, 158, 172, 189, 201, 218],
    },
    {
      label: 'Monthly Payroll',
      value: '$76,000',
      trend: 3.8,
      isPositive: false,
      icon: <Users className="w-6 h-6" />,
      chart: [62, 65, 68, 71, 73, 76],
    },
    {
      label: 'Gross Margin',
      value: '64.3%',
      trend: 5.1,
      isPositive: true,
      icon: <TrendingUp className="w-6 h-6" />,
      chart: [45, 48, 52, 58, 62, 64],
    },
    {
      label: 'Cash Available',
      value: '$387,500',
      trend: 6.8,
      isPositive: true,
      icon: <Target className="w-6 h-6" />,
      chart: [280, 305, 335, 360, 375, 387],
    },
    {
      label: 'Accounts Payable',
      value: '$14,250',
      trend: -8.3,
      isPositive: true,
      icon: <CreditCard className="w-6 h-6" />,
      chart: [18, 17.5, 16, 15.2, 14.8, 14.25],
    },
  ];

  const monthlyData = generateMonthlyData();
  const payrollTrend = generatePayrollTrend();
  const cashFlow = generateCashFlow();
  const revenueDistribution = generateRevenueDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Finance Operations</h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage invoices, payments, payroll, profitability and financial performance
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Invoice
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Run Payment Cycle
              </button>
              <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-900 font-medium rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Reports
              </button>
              <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-900 font-medium rounded-lg transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Import Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-8 py-8">
        {/* KPI CARDS */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiMetrics.map((metric, index) => (
              <KPICard key={index} metric={metric} />
            ))}
          </div>
        </section>

        {/* PAYMENT CYCLE STATUS */}
        <section className="mb-8">
          <PaymentCycleStatus steps={paymentCycleSteps} />
        </section>

        {/* OPERATIONS DATA */}
        <section className="mb-8">
          <OperationsDataTable data={demoOperationsData} />
        </section>

        {/* INVOICES */}
        <section className="mb-8">
          <InvoicesTable invoices={demoInvoices} />
        </section>

        {/* CONTRACTOR PAYMENTS */}
        <section className="mb-8">
          <ContractorPaymentsTable payments={demoContractors} />
        </section>

        {/* APPROVAL QUEUE */}
        <section className="mb-8">
          <ApprovalQueue items={demoApprovalQueue} />
        </section>

        {/* UNIT ECONOMICS */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Unit Economics</h2>
          <UnitEconomics />
        </section>

        {/* FINANCIAL CHARTS */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Revenue vs Expenses */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue & Expenses Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payroll Trend */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payroll Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cash Flow */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cash Flow Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="inflow" fill="#10b981" name="Inflow" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="outflow" fill="#f59e0b" name="Outflow" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Client Revenue Distribution */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Client Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* CEO INSIGHTS */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">CEO Insights & Decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <p className="text-sm text-green-800 font-medium">Highest Profit Client</p>
              <p className="text-2xl font-bold text-green-900 mt-2">TechCorp Inc</p>
              <p className="text-xs text-green-700 mt-2">$45,000 revenue • 68% margin</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <p className="text-sm text-orange-800 font-medium">Revenue Growth</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">+50.3%</p>
              <p className="text-xs text-orange-700 mt-2">YoY growth rate</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-blue-800 font-medium">Cash Runway</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">14.2 months</p>
              <p className="text-xs text-blue-700 mt-2">At current burn rate</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <p className="text-sm text-purple-800 font-medium">Overdue Invoices</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">$11,000</p>
              <p className="text-xs text-purple-700 mt-2">1 invoice over 30 days</p>
            </div>
          </div>
        </section>

        {/* BOTTOM SUMMARY */}
        <section className="bg-white border border-slate-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Financial Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-xs text-slate-600 font-medium uppercase">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$218K</p>
              <p className="text-xs text-green-600 mt-1">+9.2% vs last month</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium uppercase">Total Expenses</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$180K</p>
              <p className="text-xs text-red-600 mt-1">+4.1% vs last month</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium uppercase">Gross Profit</p>
              <p className="text-3xl font-bold text-green-600 mt-2">$38K</p>
              <p className="text-xs text-slate-600 mt-1">17.4% margin</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium uppercase">Outstanding A/R</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$20.8K</p>
              <p className="text-xs text-slate-600 mt-1">3 invoices pending</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium uppercase">Cash Balance</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">$387.5K</p>
              <p className="text-xs text-green-600 mt-1">+6.8% vs last month</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
