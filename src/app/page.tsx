'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Cpu,
  Terminal,
  Sliders,
  RefreshCw,
  FileSpreadsheet,
  Lock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Database,
  Zap,
  BarChart3,
  Clock,
  Users,
  DollarSign,
} from 'lucide-react';

// ==============================================================================
// CORE DATA TYPES & CONSTANTS
// ==============================================================================

type ExecutionMode = 'AUTOPILOT_SETTLEMENT' | 'MANUAL_INTERCEPT_GATE';
type UserRole = 'Operations Director' | 'Chief Financial Officer (CFO)' | 'FinOps Lead' | 'Global HR Administrator';
type TransactionStatus = 'CLEARED' | 'PENDING_EXCEPTION' | 'SECURITY_BLOCK' | 'IDEMPOTENCY_FAILED' | 'LIQUIDITY_CEILING_BREACH';

interface Transaction {
  id: string;
  recipientId: string;
  routingAccount: string;
  baseRate: number;
  verificationHash: string;
  status: TransactionStatus;
  timestamp: string;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  component: string;
  message: string;
}

// ==============================================================================
// MAIN DASHBOARD COMPONENT
// ==============================================================================

export default function CorporatePaymentDashboard() {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  const [executionMode, setExecutionMode] = useState<ExecutionMode>('AUTOPILOT_SETTLEMENT');
  const [userRole, setUserRole] = useState<UserRole>('Operations Director');
  const [distributedCycleFunds, setDistributedCycleFunds] = useState(0);
  const [settledLedgerEntries, setSettledLedgerEntries] = useState(0);
  const [pendingQueueExceptions, setPendingQueueExceptions] = useState(0);
  const [gatewayAvailability, setGatewayAvailability] = useState(100);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // AUTHORIZATION MATRIX BY ROLE
  // ─────────────────────────────────────────────────────────────────────────

  const rolePermissions = {
    'Operations Director': { canToggleMode: true, canInjectPayloads: true, canExport: true },
    'Chief Financial Officer (CFO)': { canToggleMode: true, canInjectPayloads: false, canExport: true },
    'FinOps Lead': { canToggleMode: false, canInjectPayloads: true, canExport: true },
    'Global HR Administrator': { canToggleMode: false, canInjectPayloads: false, canExport: false },
  };

  const permissions = rolePermissions[userRole];

  // ─────────────────────────────────────────────────────────────────────────
  // TELEMETRY LOG STREAM
  // ─────────────────────────────────────────────────────────────────────────

  const appendLog = (level: LogEntry['level'], component: string, message: string) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      level,
      component,
      message,
    };
    setLogs((prev) => [...prev, entry].slice(-100));
  };

  // Auto-scroll terminal to latest log
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ─────────────────────────────────────────────────────────────────────────
  // PAYMENT ENGINE ORCHESTRATION
  // ─────────────────────────────────────────────────────────────────────────

  const ingestCorporateSettlement = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    appendLog('INFO', 'SETTLEMENT_ROUTER', 'Ingesting corporate settlement request...');

    const settlementAmount = 1250;
    const projectedTotal = distributedCycleFunds + settlementAmount;

    if (projectedTotal > 25000) {
      appendLog(
        'ERROR',
        'LIQUIDITY_CEILING_BREACH_FAILED',
        `Settlement rejected: ${settlementAmount} would exceed hard cap. Current: ${distributedCycleFunds}, Cap: 25000`
      );
      setPendingQueueExceptions((prev) => prev + 1);
      setIsProcessing(false);
      return;
    }

    if (executionMode === 'MANUAL_INTERCEPT_GATE') {
      appendLog('WARN', 'MANUAL_GATE_LOCK', 'Settlement payload frozen: system in MANUAL_INTERCEPT_GATE. Requires override.');
      setPendingQueueExceptions((prev) => prev + 1);
      setIsProcessing(false);
      return;
    }

    // Process settlement
    const txnId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const newTxn: Transaction = {
      id: txnId,
      recipientId: `CONTRACTOR_${Math.floor(Math.random() * 5000)}`,
      routingAccount: `AC-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      baseRate: settlementAmount,
      verificationHash: `SHA256:${Math.random().toString(36).substring(2, 15)}`,
      status: 'CLEARED',
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
    };

    setDistributedCycleFunds(projectedTotal);
    setSettledLedgerEntries((prev) => prev + 1);
    setTransactions((prev) => [newTxn, ...prev].slice(0, 50));

    appendLog('SUCCESS', 'LEDGER_BLOCK_SETTLED', `TXN ${txnId} cleared. Cycle funds: $${projectedTotal}`);
    setGatewayAvailability((prev) => Math.max(85, prev - 2));

    setTimeout(() => {
      setGatewayAvailability((prev) => Math.min(100, prev + 3));
      setIsProcessing(false);
    }, 1500);
  };

  const injectTokenDuplication = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    appendLog('INFO', 'IDEMPOTENCY_VALIDATOR', 'Injecting duplicate token conflict...');

    const duplicateTxnId = `TXN-${Date.now()}-DUP-${Math.random().toString(36).substring(7)}`;

    const failedTxn: Transaction = {
      id: duplicateTxnId,
      recipientId: `CONTRACTOR_${Math.floor(Math.random() * 5000)}`,
      routingAccount: `AC-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      baseRate: 0,
      verificationHash: `SHA256:DUPLICATE_SIG_${Math.random().toString(36).substring(2, 15)}`,
      status: 'IDEMPOTENCY_FAILED',
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
    };

    setTransactions((prev) => [failedTxn, ...prev].slice(0, 50));
    setPendingQueueExceptions((prev) => prev + 1);

    appendLog(
      'ERROR',
      'IDEMPOTENCY_CHECK_FAILED',
      `TXN ${duplicateTxnId} rejected: matching transaction signature detected in ledger. Resubmission blocked.`
    );
    setGatewayAvailability((prev) => Math.max(75, prev - 8));

    setTimeout(() => {
      setGatewayAvailability((prev) => Math.min(100, prev + 2));
      setIsProcessing(false);
    }, 1200);
  };

  const deployCapitalThresholdBreach = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    appendLog('INFO', 'LIQUIDITY_CEILING_ENFORCER', 'Deploying capital threshold over-breach scenario...');

    const breachAmount = 8500;
    const projectedTotal = distributedCycleFunds + breachAmount;
    const breachTxnId = `TXN-${Date.now()}-BREACH-${Math.random().toString(36).substring(7)}`;

    if (projectedTotal > 25000) {
      const rejectedTxn: Transaction = {
        id: breachTxnId,
        recipientId: `CONTRACTOR_${Math.floor(Math.random() * 5000)}`,
        routingAccount: `AC-REJECTED`,
        baseRate: breachAmount,
        verificationHash: `SHA256:REJECTED_${Math.random().toString(36).substring(2, 15)}`,
        status: 'LIQUIDITY_CEILING_BREACH',
        timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      };

      setTransactions((prev) => [rejectedTxn, ...prev].slice(0, 50));
      setPendingQueueExceptions((prev) => prev + 1);

      appendLog(
        'ERROR',
        'LIQUIDITY_CEILING_BREACH_DENIED',
        `TXN ${breachTxnId} REJECTED: payload $${breachAmount} exceeds ceiling. Current: $${distributedCycleFunds}, Requested Total: $${projectedTotal}, Hard Cap: $25000. Authorization denied.`
      );
      setGatewayAvailability((prev) => Math.max(70, prev - 12));

      setTimeout(() => {
        setGatewayAvailability((prev) => Math.min(100, prev + 4));
        setIsProcessing(false);
      }, 1800);
    }
  };

  const triggerManualInterceptPayload = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const interceptTxnId = `TXN-${Date.now()}-INTERCEPT-${Math.random().toString(36).substring(7)}`;

    appendLog('INFO', 'MANUAL_INTERCEPT_TRIGGER', `Testing manual intercept payload: ${interceptTxnId}`);

    if (executionMode === 'MANUAL_INTERCEPT_GATE') {
      const frozenTxn: Transaction = {
        id: interceptTxnId,
        recipientId: `CONTRACTOR_PENDING`,
        routingAccount: `AC-FROZEN`,
        baseRate: 1250,
        verificationHash: `SHA256:PENDING_REVIEW_${Math.random().toString(36).substring(2, 15)}`,
        status: 'PENDING_EXCEPTION',
        timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      };

      setTransactions((prev) => [frozenTxn, ...prev].slice(0, 50));
      setPendingQueueExceptions((prev) => prev + 1);

      appendLog('WARN', 'MANUAL_GATE_FROZEN_STATE', `Payload ${interceptTxnId} frozen pending manual operator review. Requires override authorization.`);
    } else {
      appendLog('INFO', 'AUTOPILOT_BYPASS', 'Manual intercept requested, but AUTOPILOT_SETTLEMENT active. No freeze applied.');
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 800);
  };

  const compileAuditLedger = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    appendLog('INFO', 'AUDIT_COMPILATION_ENGINE', 'Compiling consolidated audit ledger...');

    const csvContent = [
      'Transaction ID,Recipient ID,Routing Account,Base Rate (USD),Verification Hash,Status,Timestamp',
      ...transactions.map(
        (t) =>
          `${t.id},${t.recipientId},${t.routingAccount},${t.baseRate},${t.verificationHash},${t.status},${t.timestamp}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-ledger-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    appendLog('SUCCESS', 'AUDIT_LEDGER_EXPORT', `Consolidated ledger exported. Records: ${transactions.length}. All reconciliation validation passed.`);

    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STYLE DEFINITIONS (INLINE ONLY)
  // ─────────────────────────────────────────────────────────────────────────

  const COLORS = {
    bgPrimary: '#030712',
    bgSecondary: '#0f172a',
    bgTertiary: '#1a202c',
    border: '#1e293b',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    accentEmerald: '#10b981',
    accentAmber: '#f59e0b',
    accentCrimson: '#ef4444',
    accentBlue: '#3b82f6',
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: COLORS.bgPrimary,
    color: COLORS.textPrimary,
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '24px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: COLORS.textSecondary,
    fontWeight: 400,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const controlBarStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
    marginBottom: '32px',
  };

  const selectStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgSecondary,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textPrimary,
    padding: '10px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const metricsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  };

  const metricCardStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgSecondary,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '4px',
    padding: '16px',
  };

  const metricLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    marginBottom: '8px',
  };

  const metricValueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
  };

  const progressBarStyle: React.CSSProperties = {
    height: '2px',
    backgroundColor: COLORS.bgTertiary,
    borderRadius: '1px',
    overflow: 'hidden',
  };

  const progressFillStyle = (percentage: number): React.CSSProperties => ({
    height: '100%',
    backgroundColor: percentage < 70 ? COLORS.accentEmerald : percentage < 90 ? COLORS.accentAmber : COLORS.accentCrimson,
    width: `${Math.min(percentage, 100)}%`,
    transition: 'width 0.3s ease-out',
  });

  const modeToggleContainerStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgSecondary,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '32px',
  };

  const modeToggleLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    marginBottom: '12px',
    display: 'block',
  };

  const modeButtonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const modeButtonStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 12px',
    backgroundColor: isActive ? COLORS.bgTertiary : COLORS.bgSecondary,
    border: `1px solid ${isActive ? COLORS.accentBlue : COLORS.border}`,
    borderRadius: '4px',
    color: isActive ? COLORS.accentBlue : COLORS.textSecondary,
    fontSize: '12px',
    fontWeight: 600,
    cursor: permissions.canToggleMode ? 'pointer' : 'not-allowed',
    opacity: permissions.canToggleMode ? 1 : 0.5,
    transition: 'all 0.2s',
  });

  const actionButtonStyle = (isActive: boolean = true): React.CSSProperties => ({
    flex: '1 1 auto',
    padding: '10px 14px',
    backgroundColor: isActive ? COLORS.bgTertiary : COLORS.bgSecondary,
    border: `1px solid ${isActive ? COLORS.border : COLORS.border}`,
    borderRadius: '4px',
    color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
    fontSize: '12px',
    fontWeight: 600,
    cursor: isActive ? 'pointer' : 'not-allowed',
    opacity: isActive ? 1 : 0.4,
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  });

  const actionGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '32px',
  };

  const terminalStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgTertiary,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '32px',
    fontFamily: '"Courier New", monospace',
    fontSize: '11px',
    height: '300px',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
  };

  const terminalLineStyle = (level: string): React.CSSProperties => {
    let color = COLORS.textSecondary;
    if (level === 'SUCCESS') color = COLORS.accentEmerald;
    if (level === 'ERROR') color = COLORS.accentCrimson;
    if (level === 'WARN') color = COLORS.accentAmber;
    if (level === 'INFO') color = COLORS.accentBlue;

    return {
      color,
      marginBottom: '4px',
      lineHeight: '1.5',
      wordBreak: 'break-word',
    };
  };

  const ledgerTableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '32px',
  };

  const ledgerHeaderStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgSecondary,
    borderBottom: `1px solid ${COLORS.border}`,
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    padding: '10px 12px',
    textAlign: 'left',
  };

  const ledgerRowStyle: React.CSSProperties = {
    borderBottom: `1px solid ${COLORS.border}`,
    fontSize: '12px',
  };

  const ledgerCellStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRight: `1px solid ${COLORS.border}`,
  };

  const statusBadgeStyle = (status: TransactionStatus): React.CSSProperties => {
    let backgroundColor = COLORS.bgSecondary;
    let color = COLORS.textSecondary;

    if (status === 'CLEARED') {
      backgroundColor = `${COLORS.accentEmerald}22`;
      color = COLORS.accentEmerald;
    } else if (status === 'PENDING_EXCEPTION') {
      backgroundColor = `${COLORS.accentAmber}22`;
      color = COLORS.accentAmber;
    } else if (status === 'SECURITY_BLOCK' || status === 'IDEMPOTENCY_FAILED' || status === 'LIQUIDITY_CEILING_BREACH') {
      backgroundColor = `${COLORS.accentCrimson}22`;
      color = COLORS.accentCrimson;
    }

    return {
      display: 'inline-block',
      backgroundColor,
      color,
      padding: '4px 8px',
      borderRadius: '2px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.3px',
    };
  };

  const roleChipStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: `${COLORS.accentBlue}22`,
    color: COLORS.accentBlue,
    padding: '4px 10px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: 600,
    marginLeft: '12px',
  };

  const executionModeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: 600,
    marginLeft: '12px',
    backgroundColor: executionMode === 'AUTOPILOT_SETTLEMENT' ? `${COLORS.accentEmerald}22` : `${COLORS.accentAmber}22`,
    color: executionMode === 'AUTOPILOT_SETTLEMENT' ? COLORS.accentEmerald : COLORS.accentAmber,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const cycleThresholdPercentage = (distributedCycleFunds / 25000) * 100;
  const gatewayStatusColor = gatewayAvailability >= 95 ? COLORS.accentEmerald : gatewayAvailability >= 80 ? COLORS.accentAmber : COLORS.accentCrimson;

  return (
    <div style={containerStyle}>
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color={COLORS.accentBlue} />
            <div style={titleStyle}>Corporate Payment Routing Matrix</div>
          </div>
          <div style={executionModeStyle}>{executionMode}</div>
        </div>
        <div style={subtitleStyle}>IR Transcripts FinOps Infrastructure • Enterprise Settlement & Audit Ledger</div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: COLORS.textSecondary }}>
          Active User:
          <span style={roleChipStyle}>{userRole}</span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* ROLE & MODE CONTROL PANEL */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={controlBarStyle}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: COLORS.textSecondary, display: 'block', marginBottom: '6px' }}>
            System Role
          </label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            style={selectStyle}
          >
            {['Operations Director', 'Chief Financial Officer (CFO)', 'FinOps Lead', 'Global HR Administrator'].map((role) => (
              <option key={role} value={role} style={{ backgroundColor: COLORS.bgSecondary, color: COLORS.textPrimary }}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* EXECUTION MODE TOGGLE */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={modeToggleContainerStyle}>
        <label style={modeToggleLabelStyle}>Execution Mode</label>
        <div style={modeButtonGroupStyle}>
          <button
            style={modeButtonStyle(executionMode === 'AUTOPILOT_SETTLEMENT')}
            onClick={() => permissions.canToggleMode && setExecutionMode('AUTOPILOT_SETTLEMENT')}
            disabled={!permissions.canToggleMode}
          >
            <Zap size={14} />
            Autopilot Settlement
          </button>
          <button
            style={modeButtonStyle(executionMode === 'MANUAL_INTERCEPT_GATE')}
            onClick={() => permissions.canToggleMode && setExecutionMode('MANUAL_INTERCEPT_GATE')}
            disabled={!permissions.canToggleMode}
          >
            <Lock size={14} />
            Manual Intercept Gate
          </button>
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', color: COLORS.textSecondary }}>
          {executionMode === 'AUTOPILOT_SETTLEMENT'
            ? 'Automated settlement execution enabled. Transactions clear immediately upon validation.'
            : 'Manual review mode active. All payloads frozen pending operator authorization.'}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* MULTI-STAGE FINANCIAL METRICS */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <div style={metricLabelStyle}>
            <DollarSign size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
            Distributed Cycle Funds
          </div>
          <div style={metricValueStyle}>${distributedCycleFunds.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
            of $25,000 hard cap
          </div>
          <div style={progressBarStyle}>
            <div style={progressFillStyle(cycleThresholdPercentage)} />
          </div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricLabelStyle}>
            <CheckCircle2 size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
            Settled Ledger Entries
          </div>
          <div style={metricValueStyle}>{settledLedgerEntries}</div>
          <div style={{ fontSize: '11px', color: COLORS.textSecondary }}>transactions cleared</div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricLabelStyle}>
            <AlertCircle size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
            Pending Queue Exceptions
          </div>
          <div style={metricValueStyle} style={{ color: pendingQueueExceptions > 0 ? COLORS.accentAmber : COLORS.textPrimary }}>
            {pendingQueueExceptions}
          </div>
          <div style={{ fontSize: '11px', color: COLORS.textSecondary }}>requiring attention</div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricLabelStyle}>
            <Cpu size={12} style={{ marginRight: '4px', display: 'inline-block' }} />
            Gateway Availability
          </div>
          <div style={{ ...metricValueStyle, color: gatewayStatusColor }}>{gatewayAvailability}%</div>
          <div style={{ fontSize: '11px', color: COLORS.textSecondary }}>system operational</div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* PAYMENT ENGINE ACTION MATRIX */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={actionGridStyle}>
        <button
          style={actionButtonStyle(true)}
          onClick={ingestCorporateSettlement}
          disabled={isProcessing}
        >
          <TrendingUp size={14} />
          Ingest Corporate Settlement
        </button>
        <button
          style={actionButtonStyle(true)}
          onClick={injectTokenDuplication}
          disabled={isProcessing}
        >
          <AlertCircle size={14} />
          Inject Token Duplication Conflict
        </button>
        <button
          style={actionButtonStyle(true)}
          onClick={deployCapitalThresholdBreach}
          disabled={isProcessing}
        >
          <BarChart3 size={14} />
          Deploy Capital Threshold Over-Breach
        </button>
        <button
          style={actionButtonStyle(true)}
          onClick={triggerManualInterceptPayload}
          disabled={isProcessing}
        >
          <Lock size={14} />
          Trigger Manual Intercept Payload
        </button>
        <button
          style={actionButtonStyle(permissions.canExport)}
          onClick={compileAuditLedger}
          disabled={isProcessing || !permissions.canExport}
        >
          <FileSpreadsheet size={14} />
          Compile Audit Ledger CSV
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* REAL-TIME TELEMETRY STREAM TERMINAL */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: COLORS.textSecondary, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Terminal size={12} />
          Real-Time Telemetry Stream
        </div>
      </div>

      <div style={terminalStyle}>
        {logs.length === 0 && (
          <div style={{ color: COLORS.textSecondary, fontSize: '11px' }}>
            • Awaiting transactional events. System ready for payload injection.
          </div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} style={terminalLineStyle(log.level)}>
            <span style={{ color: COLORS.textSecondary }}>
              [{log.timestamp}]
            </span>{' '}
            <span style={{ color: COLORS.textSecondary }}>{log.component}</span> — {log.message}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* RECONCILIATION & AUDIT DATA MATRIX */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: COLORS.textSecondary, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={12} />
          Batch Settlement Reconciliation Ledger
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
        <table style={ledgerTableStyle}>
          <thead>
            <tr>
              <th style={ledgerHeaderStyle}>Transaction ID</th>
              <th style={ledgerHeaderStyle}>Recipient ID</th>
              <th style={ledgerHeaderStyle}>Routing Account</th>
              <th style={ledgerHeaderStyle}>Base Rate (USD)</th>
              <th style={ledgerHeaderStyle}>Verification Hash</th>
              <th style={ledgerHeaderStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...ledgerCellStyle, textAlign: 'center', color: COLORS.textSecondary }}>
                  No transactions yet. Await payload injection.
                </td>
              </tr>
            )}
            {transactions.map((txn) => (
              <tr key={txn.id} style={ledgerRowStyle}>
                <td style={ledgerCellStyle}>
                  <span style={{ fontFamily: '"Courier New", monospace', fontSize: '11px' }}>{txn.id}</span>
                </td>
                <td style={ledgerCellStyle}>{txn.recipientId}</td>
                <td style={ledgerCellStyle}>{txn.routingAccount}</td>
                <td style={ledgerCellStyle}>${txn.baseRate.toLocaleString()}</td>
                <td style={{ ...ledgerCellStyle, fontFamily: '"Courier New", monospace', fontSize: '10px', color: COLORS.textSecondary }}>
                  {txn.verificationHash}
                </td>
                <td style={ledgerCellStyle}>
                  <span style={statusBadgeStyle(txn.status)}>{txn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FOOTER METADATA */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '16px', fontSize: '11px', color: COLORS.textSecondary }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>System Status:</strong> All infrastructure layers operational. Contractor network capacity: ~5,000 active participants.
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Authorization Context:</strong> {userRole} — {permissions.canToggleMode ? 'Mode Toggle Enabled' : 'Mode Toggle Disabled'} | {permissions.canInjectPayloads ? 'Payload Injection Enabled' : 'Payload Injection Disabled'} | {permissions.canExport ? 'Export Enabled' : 'Export Disabled'}
        </div>
        <div>
          <strong>Last Updated:</strong> {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
}
