'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from 'lucide-react';

// ==============================================================================
// TYPE DEFINITIONS - Real Finance Operations Data
// ==============================================================================

interface Contractor {
  id: string;
  name: string;
  rate: number; // hourly or project rate
  status: 'active' | 'on_hold' | 'inactive';
  hoursWorked?: number;
  amountDue?: number;
  paymentMethod: 'stripe' | 'wise' | 'ach' | 'crypto';
  riskFlags?: string[];
}

interface PaymentCycle {
  id: string;
  period: string; // "Jan 2025" or date range
  status: 'pending_inputs' | 'data_received' | 'processed' | 'paid' | 'reconciled';
  startDate: Date;
  dueDate: Date;
  contractors: Contractor[];
  totalAmount: number;
  issuesCount: number;
}

interface FinancialMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  previousValue: number;
}

interface UnitEconomic {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'green' | 'yellow' | 'red';
}

interface CashFlowProjection {
  month: string;
  inflows: number;
  outflows: number;
  netCash: number;
  runwayMonths: number;
}

// ==============================================================================
// FINANCE OPERATIONS LEAD DASHBOARD
// ==============================================================================

export default function FinanceOperationsDashboard() {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE: PAYMENT CYCLE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  const [currentCycle, setCurrentCycle] = useState<PaymentCycle>({
    id: 'cycle-2025-01',
    period: 'January 2025',
    status: 'data_received',
    startDate: new Date(2025, 0, 1),
    dueDate: new Date(2025, 0, 31),
    contractors: [
      {
        id: 'c1',
        name: 'Sarah Chen',
        rate: 85,
        status: 'active',
        hoursWorked: 160,
        amountDue: 13600,
        paymentMethod: 'stripe',
        riskFlags: [],
      },
      {
        id: 'c2',
        name: 'Marcus Rodriguez',
        rate: 120,
        status: 'active',
        hoursWorked: 144,
        amountDue: 17280,
        paymentMethod: 'wise',
        riskFlags: [],
      },
      {
        id: 'c3',
        name: 'Yuki Tanaka',
        rate: 95,
        status: 'active',
        hoursWorked: 160,
        amountDue: 15200,
        paymentMethod: 'ach',
        riskFlags: ['missing_docs'],
      },
      {
        id: 'c4',
        name: 'Emma Wilson',
        rate: 110,
        status: 'active',
        hoursWorked: 156,
        amountDue: 17160,
        paymentMethod: 'stripe',
        riskFlags: [],
      },
      {
        id: 'c5',
        name: 'Kai Park',
        rate: 75,
        status: 'active',
        hoursWorked: 140,
        amountDue: 10500,
        paymentMethod: 'wise',
        riskFlags: ['rate_change_pending'],
      },
    ],
    totalAmount: 0,
    issuesCount: 2,
  });

  const [paymentCycles, setPaymentCycles] = useState<PaymentCycle[]>([currentCycle]);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showCashFlow, setShowCashFlow] = useState(false);
  const [selectedContractorDetail, setSelectedContractorDetail] = useState<Contractor | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // STATE: FINANCIAL METRICS & UNIT ECONOMICS
  // ─────────────────────────────────────────────────────────────────────────

  const [monthlyRevenue, setMonthlyRevenue] = useState(285000);
  const [monthlyOpex, setMonthlyOpex] = useState(156000);
  const [contractorCosts, setContractorCosts] = useState(73240);
  const [grossMargin, setGrossMargin] = useState(45.3);
  const [runway, setRunway] = useState(8.2); // months
  const [burnRate, setBurnRate] = useState(12100);

  const [unitEconomics, setUnitEconomics] = useState<UnitEconomic[]>([
    {
      name: 'CAC (Customer Acquisition Cost)',
      currentValue: 2400,
      targetValue: 1800,
      unit: 'USD',
      trend: 'red',
    },
    {
      name: 'LTV (Lifetime Value)',
      currentValue: 28500,
      targetValue: 32000,
      unit: 'USD',
      trend: 'yellow',
    },
    {
      name: 'LTV:CAC Ratio',
      currentValue: 11.9,
      targetValue: 15,
      unit: 'x',
      trend: 'yellow',
    },
    {
      name: 'Avg Revenue Per User (ARPU)',
      currentValue: 4200,
      targetValue: 5500,
      unit: 'USD',
      trend: 'yellow',
    },
    {
      name: 'Churn Rate',
      currentValue: 4.2,
      targetValue: 2.5,
      unit: '%',
      trend: 'red',
    },
    {
      name: 'Gross Margin %',
      currentValue: 45.3,
      targetValue: 55,
      unit: '%',
      trend: 'yellow',
    },
  ]);

  const [cashFlowProjection, setCashFlowProjection] = useState<CashFlowProjection[]>([
    { month: 'Jan', inflows: 285000, outflows: 156000, netCash: 129000, runwayMonths: 8.2 },
    { month: 'Feb', inflows: 310000, outflows: 158000, netCash: 152000, runwayMonths: 9.1 },
    { month: 'Mar', inflows: 295000, outflows: 162000, netCash: 133000, runwayMonths: 8.5 },
    { month: 'Apr', inflows: 320000, outflows: 165000, netCash: 155000, runwayMonths: 9.3 },
    { month: 'May', inflows: 315000, outflows: 168000, netCash: 147000, runwayMonths: 8.9 },
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // STATE: OPERATIONAL FLAGS & DECISION ITEMS
  // ─────────────────────────────────────────────────────────────────────────

  const [operationalAlerts, setOperationalAlerts] = useState([
    {
      id: 'alert-1',
      severity: 'high',
      title: 'Contractor Documentation Missing',
      description: 'Yuki Tanaka missing W9 and tax docs for Jan cycle. Blocks ACH payment.',
      actionRequired: 'Contact contractor, request docs by EOD',
      daysOld: 2,
    },
    {
      id: 'alert-2',
      severity: 'medium',
      title: 'Rate Change Pending Review',
      description: 'Kai Park requested rate increase from $75/hr to $85/hr. Impact: +$1,600/month.',
      actionRequired: 'Review with CEO, approve or negotiate',
      daysOld: 5,
    },
    {
      id: 'alert-3',
      severity: 'medium',
      title: 'Wise Transfer Delay',
      description: 'Last international payment took 3 days. Current transfer pending for Marcus.',
      actionRequired: 'Monitor, consider alternate provider',
      daysOld: 1,
    },
  ]);

  const [decisionItems, setDecisionItems] = useState([
    {
      id: 'decision-1',
      title: 'Pricing Strategy Review',
      description: 'CAC increased 15% YoY. Should we adjust pricing to improve LTV:CAC ratio?',
      impact: 'High',
      dueDate: '2025-02-15',
      owner: 'CEO',
    },
    {
      id: 'decision-2',
      title: 'Contractor Scaling Plan',
      description: 'Current team at capacity. Need 2 more contractors by Q2. Budget impact: +$15K/month.',
      impact: 'High',
      dueDate: '2025-02-01',
      owner: 'Finance Lead',
    },
    {
      id: 'decision-3',
      title: 'Payment Provider Evaluation',
      description: 'Comparing Stripe Connect vs Wise vs ACH for international payouts. Fee comparison needed.',
      impact: 'Medium',
      dueDate: '2025-02-28',
      owner: 'Finance Lead',
    },
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS: CALCULATE TOTALS & SIMULATE LIVE UPDATES
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const total = currentCycle.contractors.reduce((sum, c) => sum + (c.amountDue || 0), 0);
    setCurrentCycle((prev) => ({ ...prev, totalAmount: total }));
  }, [currentCycle.contractors]);

  // Simulate minute-by-minute updates (like a real operations dashboard)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update metrics slightly (simulating actual ops changes)
      setMonthlyRevenue((prev) => prev + Math.random() * 2000 - 1000);
      setContractorCosts((prev) => prev + Math.random() * 500 - 250);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS: PAYMENT CYCLE ACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  const handleMarkPaymentCycleComplete = () => {
    setCurrentCycle((prev) => ({ ...prev, status: 'paid' }));
  };

  const handleExportPaymentData = () => {
    // CSV export for accounting system (Xero, QuickBooks, etc.)
    const csvContent = [
      ['Contractor', 'Hours', 'Rate', 'Amount', 'Payment Method', 'Status', 'Issues'],
      ...currentCycle.contractors.map((c) => [
        c.name,
        c.hoursWorked || 0,
        c.rate,
        c.amountDue || 0,
        c.paymentMethod,
        c.status,
        c.riskFlags?.join('; ') || 'None',
      ]),
      ['TOTAL', '', '', currentCycle.totalAmount, '', '', ''],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-cycle-${currentCycle.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  const getCycleStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending_inputs: 'bg-red-50 border-red-200 text-red-900',
      data_received: 'bg-blue-50 border-blue-200 text-blue-900',
      processed: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      paid: 'bg-green-50 border-green-200 text-green-900',
      reconciled: 'bg-slate-50 border-slate-200 text-slate-900',
    };
    return colors[status] || 'bg-slate-50';
  };

  const getPaymentMethodBadge = (method: string) => {
    const styles: { [key: string]: string } = {
      stripe: 'bg-blue-100 text-blue-800',
      wise: 'bg-green-100 text-green-800',
      ach: 'bg-slate-100 text-slate-800',
      crypto: 'bg-purple-100 text-purple-800',
    };
    return styles[method] || 'bg-slate-100';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-red-600" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-green-600" />;
    return <span className="text-slate-400 text-sm">—</span>;
  };

  const getTrendColor = (unitTrend: string) => {
    if (unitTrend === 'green') return 'text-green-700 bg-green-50 border-green-200';
    if (unitTrend === 'yellow') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getCurrentMargin = () => {
    return ((monthlyRevenue - monthlyOpex) / monthlyRevenue * 100).toFixed(1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Finance Operations Control
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Payment cycles • Unit economics • Cash forecasting • CEO decision support
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Current Cycle
              </div>
              <div className="text-xl font-bold text-slate-900">{currentCycle.period}</div>
              <div
                className={`text-xs font-semibold mt-1 px-3 py-1 rounded-full inline-block ${getCycleStatusColor(
                  currentCycle.status
                )}`}
              >
                {currentCycle.status.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* ════════════════════════════════════════════════════════════════ */
        {/* SECTION 1: PAYMENT CYCLE AT A GLANCE */}
        {/* ════════════════════════════════════════════════════════════════ */}

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total to Pay */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Total to Pay This Cycle
                </span>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                ${(currentCycle.totalAmount / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {currentCycle.contractors.length} contractors
              </div>
            </div>

            {/* Issues to Resolve */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Issues Before Payment
                </span>
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div
                className={`text-3xl font-black ${
                  operationalAlerts.length > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {operationalAlerts.filter((a) => a.severity === 'high').length}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {operationalAlerts.length} total alerts
              </div>
            </div>

            {/* Days Until Due */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Days Until Due
                </span>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {Math.ceil(
                  (currentCycle.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Due {currentCycle.dueDate.toLocaleDateString()}
              </div>
            </div>

            {/* Avg Contractor Cost */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Avg Contractor Cost
                </span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                ${Math.round(currentCycle.totalAmount / currentCycle.contractors.length / 1000)}K
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Monthly run rate
              </div>
            </div>
          </div>

          {/* PAYMENT CYCLE DETAILS (Collapsible) */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-200"
            >
              <h2 className="font-bold text-slate-900">Payment Cycle Details</h2>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${
                  showPaymentDetails ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showPaymentDetails && (
              <div className="p-6">
                {/* Contractor Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">
                          Contractor
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-700">
                          Rate
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-700">
                          Hours
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-700">
                          Amount
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-700">
                          Method
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-700">
                          Issues
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCycle.contractors.map((contractor) => (
                        <tr
                          key={contractor.id}
                          className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedContractorDetail(contractor)}
                        >
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {contractor.name}
                          </td>
                          <td className="text-right px-4 py-3 text-slate-600">
                            ${contractor.rate}/hr
                          </td>
                          <td className="text-right px-4 py-3 text-slate-600">
                            {contractor.hoursWorked}
                          </td>
                          <td className="text-right px-4 py-3 font-semibold text-slate-900">
                            ${contractor.amountDue?.toLocaleString()}
                          </td>
                          <td className="text-center px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${getPaymentMethodBadge(
                                contractor.paymentMethod
                              )}`}
                            >
                              {contractor.paymentMethod.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center px-4 py-3">
                            {contractor.status === 'active' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-600 mx-auto" />
                            )}
                          </td>
                          <td className="text-center px-4 py-3">
                            {contractor.riskFlags && contractor.riskFlags.length > 0 ? (
                              <span className="text-xs font-bold text-red-600">
                                {contractor.riskFlags.length} flag{contractor.riskFlags.length > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleMarkPaymentCycleComplete}
                    disabled={operationalAlerts.filter((a) => a.severity === 'high').length > 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Release Payments
                  </button>
                  <button
                    onClick={handleExportPaymentData}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export to CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */
        {/* SECTION 2: FINANCIAL METRICS & UNIT ECONOMICS */}
        {/* ════════════════════════════════════════════════════════════════ */}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Financial Health</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Monthly P&L */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Monthly Revenue
                </div>
                <div className="text-3xl font-black text-slate-900">
                  ${(monthlyRevenue / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Monthly OpEx
                </div>
                <div className="text-3xl font-black text-red-600">
                  ${(monthlyOpex / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Gross Profit
                </div>
                <div className="text-3xl font-black text-green-600">
                  ${((monthlyRevenue - monthlyOpex) / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {getCurrentMargin()}% margin
                </div>
              </div>
            </div>

            {/* Runway & Burn */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Runway
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {runway.toFixed(1)} mo
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  at current burn
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Monthly Burn
                </div>
                <div className="text-3xl font-black text-orange-600">
                  ${(burnRate / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Contractor Costs
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  ${(contractorCosts / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {((contractorCosts / monthlyOpex) * 100).toFixed(0)}% of OpEx
                </div>
              </div>
            </div>

            {/* Key Ratios */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  CAC Payback
                </div>
                <div className="text-3xl font-black text-slate-900">
                  3.2 mo
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  NDR (Net Dollar Retention)
                </div>
                <div className="text-3xl font-black text-green-600">
                  108%
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  MRR Growth
                </div>
                <div className="text-3xl font-black text-green-600">
                  +8.2%
                </div>
              </div>
            </div>
          </div>

          {/* Unit Economics Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Unit Economics vs Target</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unitEconomics.map((ue) => (
                <div
                  key={ue.name}
                  className={`border rounded-lg p-4 ${getTrendColor(ue.trend)}`}
                >
                  <div className="text-xs font-semibold mb-2 uppercase tracking-widest">
                    {ue.name}
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-black">
                      {ue.currentValue.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold">{ue.unit}</span>
                  </div>
                  <div className="text-xs font-semibold mb-2">
                    Target: {ue.targetValue.toLocaleString()} {ue.unit}
                  </div>
                  <div className="w-full bg-white bg-opacity-40 rounded h-2">
                    <div
                      className="bg-current opacity-60 h-2 rounded"
                      style={{
                        width: `${Math.min(
                          (ue.currentValue / ue.targetValue) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */
        {/* SECTION 3: CASH FLOW FORECAST & MODELING */}
        {/* ════════════════════════════════════════════════════════════════ */}

        <section className="mb-12">
          <button
            onClick={() => setShowCashFlow(!showCashFlow)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <h2 className="text-2xl font-bold text-slate-900">Cash Flow Forecast (5M)</h2>
            <ChevronDown
              className={`w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-transform ${
                showCashFlow ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showCashFlow && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm mb-6">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700">
                        Month
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-700">
                        Inflows
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-700">
                        Outflows
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-700">
                        Net Cash
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-700">
                        Runway
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlowProjection.map((row) => (
                      <tr key={row.month} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {row.month}
                        </td>
                        <td className="text-right px-4 py-3 text-green-600 font-semibold">
                          ${(row.inflows / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right px-4 py-3 text-red-600 font-semibold">
                          ${(row.outflows / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right px-4 py-3 font-bold text-slate-900">
                          ${(row.netCash / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right px-4 py-3 font-semibold">
                          <span className="text-slate-900">{row.runwayMonths.toFixed(1)}mo</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Forecast Note:</strong> Assuming 8% MRR growth and stable OpEx.
                  Runway maintains 8+ months under current assumptions. Risk: If churn
                  accelerates to 6%, runway drops to 6.2 months.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════ */
        {/* SECTION 4: OPERATIONAL ALERTS & DECISION ITEMS */}
        {/* ════════════════════════════════════════════════════════════════ */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* OPERATIONAL ALERTS */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Operational Alerts</h2>
            <div className="space-y-3">
              {operationalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.severity === 'high'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`font-bold text-sm ${
                          alert.severity === 'high'
                            ? 'text-red-900'
                            : 'text-yellow-900'
                        }`}
                      >
                        {alert.title}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          alert.severity === 'high'
                            ? 'text-red-700'
                            : 'text-yellow-700'
                        }`}
                      >
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-2 ${
                      alert.severity === 'high'
                        ? 'bg-red-200 text-red-900'
                        : 'bg-yellow-200 text-yellow-900'
                    }`}
                  >
                    {alert.actionRequired}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {alert.daysOld}d old
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CEO DECISION ITEMS */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">CEO Decision Items</h2>
            <div className="space-y-3">
              {decisionItems.map((decision) => (
                <div
                  key={decision.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-slate-900 text-sm">
                      {decision.title}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        decision.impact === 'High'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {decision.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{decision.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Due: {decision.dueDate}</span>
                    <span className="font-semibold">Owner: {decision.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */
        {/* FOOTER: KEY TAKEAWAYS FOR CEO */}
        {/* ════════════════════════════════════════════════════════════════ */}

        <section className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            📊 This Week's Financial Snapshot
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              ✓ <strong>Payment cycle on track:</strong> ${(currentCycle.totalAmount / 1000).toFixed(1)}K to {currentCycle.contractors.length} contractors by {currentCycle.dueDate.toLocaleDateString()}
            </li>
            <li>
              ✓ <strong>Healthy unit economics:</strong> LTV:CAC ratio 11.9x (target: 15x). Focus: reduce CAC by improving pricing strategy.
            </li>
            <li>
              ✓ <strong>Runway solid:</strong> {runway.toFixed(1)} months at current burn. No immediate funding pressure.
            </li>
            <li>
              ⚠️ <strong>Churn alert:</strong> Churn rate 4.2% (target: 2.5%). Recommend customer health review.
            </li>
            <li>
              ⚠️ <strong>2 high-priority blocks:</strong> Missing contractor docs + rate change decision. Will delay payment if not resolved.
            </li>
          </ul>
        </section>

        {/* CONTRACTOR DETAIL MODAL */}
        {selectedContractorDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedContractorDetail.name}
                </h3>
                <button
                  onClick={() => setSelectedContractorDetail(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    HOURLY RATE
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    ${selectedContractorDetail.rate}/hr
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    HOURS THIS MONTH
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {selectedContractorDetail.hoursWorked} hrs
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    TOTAL DUE
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedContractorDetail.amountDue?.toLocaleString()}
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <div className="text-xs text-slate-500 font-semibold mb-2">
                    PAYMENT METHOD
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded ${getPaymentMethodBadge(
                      selectedContractorDetail.paymentMethod
                    )}`}
                  >
                    {selectedContractorDetail.paymentMethod.toUpperCase()}
                  </span>
                </div>

                {selectedContractorDetail.riskFlags &&
                  selectedContractorDetail.riskFlags.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="text-xs font-bold text-red-900 mb-2">
                        ⚠️ ISSUES
                      </div>
                      <ul className="text-xs text-red-800 space-y-1">
                        {selectedContractorDetail.riskFlags.map((flag) => (
                          <li key={flag}>
                            • {flag.replace(/_/g, ' ').toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <button
                onClick={() => setSelectedContractorDetail(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
