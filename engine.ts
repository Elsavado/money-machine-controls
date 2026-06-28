import * as fs from 'fs';

// ============================================================================
// 1. TYPES & DATA STRUCTURES
// ============================================================================

type SystemMode = 'AUTOPILOT' | 'MANUAL_MODE';

interface Contractor {
  id: string;
  name: string;
  email: string;
}

interface InvoiceRequest {
  invoiceId: string;       // Unique token to enforce idempotency
  contractor: Contractor;
  amount: number;
  description: string;
}

interface InvoiceRecord {
  invoiceId: string;
  contractorId: string;
  contractorName: string;
  contractorEmail: string;
  amount: number;
  timestamp: string;
  status: 'PROCESSED_AUTOMATICALLY' | 'PENDING_MANUAL_VALIDATION';
}

// ============================================================================
// 2. THE FINANCE OPERATIONS SYSTEM ENGINE
// ============================================================================

class FinanceOpsEngine {
  private currentMode: SystemMode = 'AUTOPILOT';
  private budgetLimit: number = 5000.00; // Hard cap for the current batch run
  private totalSpent: number = 0.00;

  // In-memory data store simulated for single-file deployment
  private processedInvoiceIds = new Set<string>();
  private masterLedger: InvoiceRecord[] = [];
  
  // Rate limiter storage: tracking timestamps per contractor
  private rateLimitWindowMs = 60000; // 1 Minute Window
  private maxRequestsPerWindow = 3;
  private requestTimestamps = new Map<string, number[]>();

  constructor(initialMode: SystemMode = 'AUTOPILOT', customBudget?: number) {
    this.currentMode = initialMode;
    if (customBudget) this.budgetLimit = customBudget;
    this.logSystemStatus();
  }

  /**
   * Toggle operational cockpit parameter states dynamically
   */
  public setSystemMode(mode: SystemMode) {
    this.currentMode = mode;
    this.logSystemStatus();
  }

  private logSystemStatus() {
    const banner = this.currentMode === 'AUTOPILOT' 
      ? `🚀 [SYSTEM STATUS: RUNNING ON AUTOPILOT] - Full automated execution paths active.`
      : `⚠️ [SYSTEM STATUS: RESTRICTED TO MANUAL_MODE] - Freezing transactions at gateway. Seniors override required.`;
    console.log(`\n======================================================================\n${banner}\n======================================================================`);
  }

  /**
   * Rate Limiter: Protects payment lines from repetitive automated spam
   */
  private checkRateLimit(contractorId: string): boolean {
    const now = Date.now();
    if (!this.requestTimestamps.has(contractorId)) {
      this.requestTimestamps.set(contractorId, []);
    }

    const timestamps = this.requestTimestamps.get(contractorId)!;
    // Filter out timestamps older than the tracking window
    const validTimestamps = timestamps.filter(t => now - t < this.rateLimitWindowMs);
    this.requestTimestamps.set(contractorId, validTimestamps);

    if (validTimestamps.length >= this.maxRequestsPerWindow) {
      return false; // Rate limit breached
    }

    validTimestamps.push(now);
    return true;
  }

  /**
   * Telemetry Exception Routing: Extracts contractor data and routes error metrics to alert streams
   */
  private routeTelemetryError(contractor: Contractor, errorCode: string, errorMessage: string) {
    console.error(`\n🚨 [TELEMETRY ALERT OUTBOUND ROUTE]`);
    console.error(`| Error Code: ${errorCode}`);
    console.error(`| Message:    ${errorMessage}`);
    console.error(`| Contractor: ${contractor.name} (${contractor.email})`);
    console.error(`| Action:     Pushed stack trace context parameter to system operators.\n`);
  }

  /**
   * Primary Invoice Execution Pipeline Gateway
   */
  public async processInvoice(request: InvoiceRequest): Promise<{ success: boolean; message: string }> {
    const { invoiceId, contractor, amount, description } = request;
    
    console.log(`[AUDIT LOG] [START] Initiating lifecycle telemetry check for Invoice ID: ${invoiceId}...`);

    // Guardrail 1: Rate Limiting Verification
    if (!this.checkRateLimit(contractor.id)) {
      this.routeTelemetryError(contractor, 'RATE_LIMIT_EXCEEDED', `Contractor issued excessive pipeline requests in window.`);
      return { success: false, message: 'Rate limit exceeded. Request throttled for safety.' };
    }

    // Guardrail 2: Idempotency Validation Check (Zero tolerance for duplicate invoice hits)
    if (this.processedInvoiceIds.has(invoiceId)) {
      this.routeTelemetryError(contractor, 'DUPLICATE_INVOICE_REJECTED', `Attempted re-submission of processed invoice hash: ${invoiceId}`);
      return { success: false, message: `Rejected. Invoice ID ${invoiceId} has already been registered inside the system database.` };
    }

    // Guardrail 3: Programmatic Hard Budget Gates
    if (this.totalSpent + amount > this.budgetLimit) {
      this.routeTelemetryError(contractor, 'BUDGET_CAP_EXCEEDED', `Invoice amount ($${amount}) pushes total spent ($${this.totalSpent + amount}) past hard authorized budget limit ($${this.budgetLimit})`);
      return { success: false, message: 'Rejected. Transaction exceeds planned budget parameter thresholds.' };
    }

    // Guardrail 4: Split Path Processing Framework based on Cockpit Mode
    if (this.currentMode === 'MANUAL_MODE') {
      console.log(`[AUDIT LOG] [INTERCEPT] System configured to MANUAL. Freezing payment processing loop for Invoice ID: ${invoiceId}. Diverting execution path to senior validation stack.`);
      
      this.storeRecord({
        invoiceId,
        contractorId: contractor.id,
        contractorName: contractor.name,
        contractorEmail: contractor.email,
        amount,
        timestamp: new Date().toISOString(),
        status: 'PENDING_MANUAL_VALIDATION'
      });

      return { success: true, message: 'Invoice intercepted successfully. Placed into senior supervisor approval queue.' };
    }

    // Autopilot Mode Execution Branch
    console.log(`[AUDIT LOG] [EXECUTION] Autopilot clearing Invoice ID: ${invoiceId} for $${amount}. Resolving core ledger update...`);
    
    this.processedInvoiceIds.add(invoiceId);
    this.totalSpent += amount;

    this.storeRecord({
      invoiceId,
      contractorId: contractor.id,
      contractorName: contractor.name,
      contractorEmail: contractor.email,
      amount,
      timestamp: new Date().toISOString(),
      status: 'PROCESSED_AUTOMATICALLY'
    });

    console.log(`[AUDIT LOG] [SUCCESS] Invoice ${invoiceId} finalized. Operational cycle complete.`);
    return { success: true, message: 'Invoice processed dynamically and added to master records automatically.' };
  }

  private storeRecord(record: InvoiceRecord) {
    this.masterLedger.push(record);
  }

  /**
   * Human-In-The-Loop Senior Manual Override Intercept Actions
   */
  public manualStatusOverride(invoiceId: string, action: 'APPROVE' | 'REJECT') {
    console.log(`\n[OVERRIDE TRIGGERED] Senior Analyst performing explicit override override action: [${action}] on Invoice ID: ${invoiceId}`);
    
    const recordIndex = this.masterLedger.findIndex(r => r.invoiceId === invoiceId && r.status === 'PENDING_MANUAL_VALIDATION');
    
    if (recordIndex === -1) {
      console.log(`[ERROR LOG] No records matching ID ${invoiceId} were found sitting inside the manual verification pending stack.`);
      return;
    }

    const record = this.masterLedger[recordIndex];

    if (action === 'APPROVE') {
      // Re-verify budget gates during manual override
      if (this.totalSpent + record.amount > this.budgetLimit) {
        console.error(`[OVERRIDE BLOCKED] Manual override failed: Core budget cap constraints violated.`);
        return;
      }
      
      this.processedInvoiceIds.add(invoiceId);
      this.totalSpent += record.amount;
      record.status = 'PROCESSED_AUTOMATICALLY';
      console.log(`[AUDIT LOG] [MANUAL SUCCESS] Senior validation approved. Payment released.`);
    } else {
      this.masterLedger.splice(recordIndex, 1);
      console.log(`[AUDIT LOG] [MANUAL DROP] Invoice completely cleared from staging database logs by supervisor command.`);
    }
  }

  /**
   * Data Aggregation & Compilation Worker: Bundles processed ledger into streamable audit CSV
   */
  public generateMasterInvoiceCSV(filePath: string = './master_invoices.csv') {
    console.log(`\n[DATA WORKER] Consolidating pipeline records into single streamable ledger...`);
    
    const headers = 'InvoiceID,ContractorID,ContractorName,ContractorEmail,Amount,Timestamp,ProcessingStatus\n';
    const rows = this.masterLedger.map(r => 
      `"${r.invoiceId}","${r.contractorId}","${r.contractorName}","${r.contractorEmail}",${r.amount},"${r.timestamp}","${r.status}"`
    ).join('\n');

    fs.writeFileSync(filePath, headers + rows);
    console.log(`[DATA WORKER] Master CSV file successfully generated at path: ${filePath}`);
  }
}

// ============================================================================
// 3. PRODUCTION SIMULATION TEST SUITE RUN
// ============================================================================

async function runSimulation() {
  const engine = new FinanceOpsEngine('AUTOPILOT', 2500.00); // System Instantiated with $2500 Batch Budget Cap

  const userA: Contractor = { id: 'c_01', name: 'Alex Analyst', email: 'alex@irtranscripts.com' };
  const userB: Contractor = { id: 'c_02', name: 'Grace Agent', email: 'grace@irtranscripts.com' };

  // --- Scenario A: Flawless Autopilot Processing ---
  await engine.processInvoice({
    invoiceId: 'INV-2026-001',
    contractor: userA,
    amount: 450.00,
    description: 'Q1 Earnings Call Processing Run'
  });

  // --- Scenario B: Zero Tolerance for Duplicate Invoices (Idempotency Trap) ---
  await engine.processInvoice({
    invoiceId: 'INV-2026-001', // Exact same ID token hit
    contractor: userA,
    amount: 450.00,
    description: 'Q1 Earnings Call Processing Run Duplicate'
  });

  // --- Scenario C: Rate Limiter Attack Defense ---
  console.log(`\n[SIMULATION] Executing concurrent payload runs to simulate spam behavior...`);
  await engine.processInvoice({ invoiceId: 'INV-2026-002', contractor: userB, amount: 100, description: 'Batch 1' });
  await engine.processInvoice({ invoiceId: 'INV-2026-003', contractor: userB, amount: 100, description: 'Batch 2' });
  await engine.processInvoice({ invoiceId: 'INV-2026-004', contractor: userB, amount: 100, description: 'Batch 3' }); // 4th call within window triggers limiter
  
  // --- Scenario D: Hard Programmatic Budget Protection ---
  await engine.processInvoice({
    invoiceId: 'INV-2026-005',
    contractor: userA,
    amount: 3000.00, // This exceeds remaining batch allocation capacity
    description: 'Massive Platform Transform Scaling Run'
  });

  // --- Scenario E: Shift to Manual Override Mode ---
  engine.setSystemMode('MANUAL_MODE');

  await engine.processInvoice({
    invoiceId: 'INV-2026-006',
    contractor: userA,
    amount: 500.00,
    description: 'Analyst Dashboard Overtime Compilation Tracking'
  });

  // Senior Supervisor validates the holding queue and signs off on execution parameter
  engine.manualStatusOverride('INV-2026-006', 'APPROVE');

  // --- Scenario F: CSV Generation ---
  engine.generateMasterInvoiceCSV();
}

runSimulation();
