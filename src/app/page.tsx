'use client';

import React, { useState } from 'react';
import { Play, ShieldAlert, CheckCircle, AlertTriangle, FileSpreadsheet, Radio, DollarSign, Layers } from 'lucide-react';

export default function OperationalDashboard() {
  const [systemMode, setSystemMode] = useState<'AUTOPILOT' | 'MANUAL_MODE'>('AUTOPILOT');
  const [logs, setLogs] = useState<string[]>([
    '[INIT 13:49:00] Master operational engine parameters mounted successfully.',
    '[AUDIT 13:49:02] Core system validation checks completed: IDEMPOTENCY check active.',
    '[AUDIT 13:49:05] Rate-limiting tokens instantiated. Batch financial limits pinned to hard threshold of $2,500.00.'
  ]);
  const [totalSpent, setTotalSpent] = useState<number>(450);
  const [invoiceCount, setInvoiceCount] = useState<number>(1);
  const [processedIds] = useState<Set<string>>(new Set(['INV-2026-001']));

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[SYSTEM ${timestamp}] ${message}`, ...prev]);
  };

  const processInvoice = (id: string, contractor: string, email: string, amount: number) => {
    addLog(`START: Initiating lifecycle telemetry boundary evaluation for Invoice: ${id}...`);

    // 1. Idempotency Check
    if (processedIds.has(id)) {
      addLog(`🚨 TELEMETRY CRITICAL EXCEPTION: DUPLICATE_INVOICE_REJECTED | Attempted re-submission of processed invoice hash: ${id}. Contractor: ${contractor} (${email}). Pushed trace packet to alert streams.`);
      return;
    }

    // 2. Budget Gate Check
    if (totalSpent + amount > 2500) {
      addLog(`🚨 TELEMETRY CRITICAL EXCEPTION: BUDGET_CAP_EXCEEDED | Inbound amount ($${amount}) pushes totals past authorized batch limit ($2,500.00). Contractor: ${contractor} (${email}). Execution hard-blocked.`);
      return;
    }

    // 3. Operational State Check (Autopilot vs Manual Interception)
    if (systemMode === 'MANUAL_MODE') {
      addLog(`⚠️ INTERCEPT: Cockpit configured to MANUAL_MODE. Invoice ID ${id} ($${amount}) frozen in staging pipeline. Diverted execution path to senior supervisor approval queue.`);
      return;
    }

    // Standard Ingestion Path (Autopilot Clear)
    processedIds.add(id);
    setTotalSpent((prev) => prev + amount);
    setInvoiceCount((prev) => prev + 1);
    addLog(`🚀 SUCCESS: Autopilot cleared execution parameters for Invoice ${id}. Distributed $${amount}.00 to ${contractor}. Transaction ledger committed.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono selection:bg-emerald-500 selection:text-slate-950">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Radio className="text-emerald-400 animate-pulse shrink-0" size={24} />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase">IR Transcripts // FinOps Guardrail Cockpit</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-sans">Core transaction processing infrastructure engine v1.4.2 // Monitoring active.</p>
        </div>

        {/* FLIGHT CONTROL STATE TOGGLES */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl w-full xl:w-auto">
          <button 
            onClick={() => { setSystemMode('AUTOPILOT'); addLog('COCKPIT PARAMETER CONFIGURATION RE-WRITTEN: Switching engine state to full AUTOPILOT.'); }}
            className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${systemMode === 'AUTOPILOT' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Play size={14} className="fill-current" /> Autopilot
          </button>
          <button 
            onClick={() => { setSystemMode('MANUAL_MODE'); addLog('COCKPIT PARAMETER CONFIGURATION RE-WRITTEN: Restricting engine execution to MANUAL_MODE.'); }}
            className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${systemMode === 'MANUAL_MODE' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <AlertTriangle size={14} /> Manual Mode
          </button>
        </div>
      </div>

      {/* METRICS METERS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Layers size={12}/> Boundary Control State</p>
          <div className="text-sm font-bold mt-3">
            {systemMode === 'AUTOPILOT' ? (
              <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-md flex items-center w-fit gap-1.5"><CheckCircle size={14}/> RUNNING_ON_AUTOPILOT</span>
            ) : (
              <span className="text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2.5 py-1 rounded-md flex items-center w-fit gap-1.5"><ShieldAlert size={14}/> RESTRICTED_BY_OPERATORS</span>
            )}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><DollarSign size={12}/> Dispatched Batch Capital</p>
          <div className="text-2xl font-black text-white mt-2">
            ${totalSpent.toLocaleString()}.00 <span className="text-[10px] font-normal text-slate-500 font-sans">/ $2,500 Max Cap</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><CheckCircle size={12}/> Settled Transactions Ledger</p>
          <div className="text-2xl font-black text-white mt-2">
            0{invoiceCount} <span className="text-[10px] font-normal text-slate-500 font-sans">records compiled</span>
          </div>
        </div>
      </div>

      {/* SANDBOX CONTROLS & LOGGER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RUNTIME PAYLOAD TRIGGERS */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-4 pb-2 border-b border-slate-800">Sandbox Pipeline Inputs</h2>
          <div className="space-y-3.5">
            <button 
              onClick={() => processInvoice(`INV-2026-00${Math.floor(Math.random() * 900) + 100}`, 'Alex Analyst', 'alex@irtranscripts.com', 450)}
              className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left p-3.5 rounded-xl transition text-xs flex flex-col gap-1 group"
            >
              <div className="flex justify-between w-full font-bold group-hover:text-emerald-400">
                <span>⚡ Fire Standard Request</span>
                <span>+$450.00</span>
              </div>
              <span className="text-[10px] text-slate-500">Target: Alex Analyst (alex@irtranscripts.com)</span>
            </button>

            <button 
              onClick={() => processInvoice('INV-2026-001', 'Alex Analyst', 'alex@irtranscripts.com', 450)}
              className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left p-3.5 rounded-xl transition text-xs flex flex-col gap-1 group"
            >
              <div className="flex justify-between w-full font-bold group-hover:text-rose-400">
                <span>💥 Trigger Idempotency Breaker</span>
                <span className="text-slate-500">Duplicate Token</span>
              </div>
              <span className="text-[10px] text-slate-500">Forces duplicate hit parameter using processed hash 'INV-2026-001'</span>
            </button>

            <button 
              onClick={() => processInvoice(`INV-2026-ERR`, 'Grace Agent', 'grace@irtranscripts.com', 3000)}
              className="w-full bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/50 text-left p-3.5 rounded-xl transition text-xs flex flex-col gap-1 group"
            >
              <div className="flex justify-between w-full font-bold text-rose-300">
                <span>🛑 Trigger Budget Break Payload</span>
                <span>+$3,000.00</span>
              </div>
              <span className="text-[10px] text-rose-500/70">Injects an override execution sum breaching cap pools.</span>
            </button>

            <button 
              onClick={() => addLog('COMPILATION SUCCESS: Export worker complete. Stored local ledger bundle to stream format: ./master_invoices.csv')}
              className="w-full mt-6 bg-slate-100 hover:bg-white text-slate-950 font-black text-xs uppercase py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <FileSpreadsheet size={14} /> Export Consolidated Audit CSV
            </button>
          </div>
        </div>

        {/* LOG STREAM DISPLAY */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[460px]">
          <h2 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-4 pb-2 border-b border-slate-800">System Telemetry Stream Terminal</h2>
          <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-[11px] overflow-y-auto space-y-3 shadow-inner font-mono leading-relaxed">
            {logs.map((log, index) => {
              let textStyle = 'text-slate-400 border-slate-800';
              if (log.includes('SUCCESS')) textStyle = 'text-emerald-400 border-emerald-900/50 bg-emerald-950/10 font-bold';
              if (log.includes('CRITICAL')) textStyle = 'text-rose-400 border-rose-900/50 bg-rose-950/20 font-bold';
              if (log.includes('INTERCEPT')) textStyle = 'text-amber-400 border-amber-900/50 bg-amber-950/10 font-bold';
              return (
                <div key={index} className={`border-l-2 pl-3 py-1 ${textStyle}`}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
