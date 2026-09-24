/* ==========================================================================
   YOR Estate - Finance Team Module & Legal Verification Audit View
   ========================================================================== */

function renderFinancePage() {
  const store = window.store || { data: { properties: [], financeLedger: [] } };
  const ledger = (store.data && store.data.financeLedger) || [];
  const properties = (store.data && store.data.properties) || [];
  const user = (window.auth && window.auth.currentUser) || { role: (store && store.currentRole) || "Super Admin", name: "Arjun Mehta (Finance Director)" };
  const currentRole = (user && user.role) || (store && store.currentRole) || "Super Admin";

  // Tab for Finance view: 'ledger' | 'legal_properties'
  if (!window.activeFinanceTab) window.activeFinanceTab = "legal_properties";

  // Properties given for legal verification
  const legalProperties = properties.map(p => {
    const rawVal = parseFloat(String(p.valuation || '5').replace(/[^0-9.]/g, '')) || 5.0;
    // Calculate state stamp duty estimate based on state
    let stampDutyRate = 0.07;
    if (p.state === 'Kerala') stampDutyRate = 0.08;
    else if (p.state === 'Tamil Nadu') stampDutyRate = 0.09;
    else if (p.state === 'Maharashtra') stampDutyRate = 0.06;
    else if (p.state === 'Telangana') stampDutyRate = 0.075;

    const stampDutyEst = (rawVal * stampDutyRate).toFixed(2);

    return {
      ...p,
      stampDutyEst: `₹${stampDutyEst} Cr (${Math.round(stampDutyRate * 100)}%)`,
      financeAuditStatus: p.legalStatus === 'Approved' ? 'Financial Escrow Cleared' : p.legalStatus === 'Resubmit' ? 'Audit Hold' : 'Under Legal Review'
    };
  });

  const pendingLegalCount = properties.filter(p => p.legalStatus !== 'Approved').length;
  const approvedLegalCount = properties.filter(p => p.legalStatus === 'Approved').length;

  return `
    <div class="head">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
          <span class="chip gold xs font-mono">FINANCE & ESCROW DESK</span>
          <span class="chip gray xs">Cross-Outlet Treasury</span>
        </div>
        <h1>Finance & Legal Verification Oversight</h1>
        <p>Consolidated treasury ledger, valuation escrow, stamp duty estimation, and real-time audit of properties submitted for legal verification.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openInvoiceModal()">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Generate Invoice
        </button>
        <button class="btn dark" onclick="window.modals.openExportReport()">+ Export Ledger</button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat">
        <span>Properties in Legal Verification</span>
        <b class="num">${pendingLegalCount}</b>
        <small class="warn">Awaiting Statutory Clearance</small>
      </div>
      <div class="stat">
        <span>Legally Cleared & Escrow Approved</span>
        <b class="num">${approvedLegalCount}</b>
        <small class="up">↑ Ready for Settlement</small>
      </div>
      <div class="stat">
        <span>Total Revenue YTD</span>
        <b class="num">₹1.284 Cr</b>
        <small class="up">↑ 12% vs last FY</small>
      </div>
      <div class="stat">
        <span>Total Expenses YTD</span>
        <b class="num">₹68.24 L</b>
        <small class="down">↑ 5% operational cost</small>
      </div>
      <div class="stat">
        <span>Net Position</span>
        <b class="num">₹60.20 L</b>
        <small class="up">↑ 18% net margin</small>
      </div>
    </div>

    <!-- Sub-tab Navigation -->
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); margin-bottom:20px; padding-bottom:8px">
      <div style="display:flex; gap:8px">
        <button class="btn sm ${window.activeFinanceTab === 'legal_properties' ? 'dark' : ''}" onclick="window.activeFinanceTab='legal_properties'; window.router.navigate('finance')">
          Properties Submitted for Legal Verification (${legalProperties.length})
        </button>
        <button class="btn sm ${window.activeFinanceTab === 'ledger' ? 'dark' : ''}" onclick="window.activeFinanceTab='ledger'; window.router.navigate('finance')">
          Cross-Outlet Financial Ledger
        </button>
      </div>
      <div class="xs muted">
        Logged in as: <b>${user.name}</b> (${currentRole})
      </div>
    </div>

    ${window.activeFinanceTab === 'legal_properties' ? `
      <!-- PROPERTIES GIVEN FOR LEGAL VERIFICATION (FINANCE AUDIT TABLE) -->
      <div class="card" style="padding:20px">
        <div class="ch" style="margin-bottom:14px; border-bottom:1px solid var(--line); padding-bottom:10px">
          <div>
            <h3 style="font-size:16px">Properties Submitted for Legal & Statutory Verification</h3>
            <p style="font-size:12px">Real-time status tracking of all intake properties undergoing state legal verification, survey cross-checks, and financial escrow estimation.</p>
          </div>
          <div style="display:flex; gap:8px">
            <span class="chip dark xs">${pendingLegalCount} In Verification</span>
            <span class="chip green xs">${approvedLegalCount} Approved</span>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Property & Location</th>
                <th>State Jurisdiction</th>
                <th>Survey Number</th>
                <th>Estimated Valuation</th>
                <th>Stamp Duty & Reg. Est</th>
                <th>Legal Verification Stage</th>
                <th>Legal Status</th>
                <th class="r">Action</th>
              </tr>
            </thead>
            <tbody>
              ${legalProperties.map(p => {
                const isApproved = p.legalStatus === 'Approved';
                const isRejected = p.legalStatus === 'Rejected' || p.legalStatus === 'Resubmit';

                return `
                  <tr style="background:${isApproved ? '#fbfdfb' : isRejected ? '#fff5f5' : 'transparent'}">
                    <td>
                      <b>${p.name}</b>
                      <div class="xs muted">${p.location} · ${p.outlet}</div>
                    </td>
                    <td>
                      <span class="chip xs font-mono ${p.state === 'Kerala' ? 'blue' : p.state === 'Karnataka' ? 'amber' : p.state === 'Tamil Nadu' ? 'green' : 'gray'}">
                        ${p.state || 'Karnataka'}
                      </span>
                    </td>
                    <td><span class="font-mono xs">${p.surveyNo}</span></td>
                    <td><b class="num">${p.valuation}</b></td>
                    <td><span class="small font-mono">${p.stampDutyEst}</span></td>
                    <td>
                      <span class="small">${p.legalStage || 'Encumbrance verification'}</span>
                    </td>
                    <td>
                      <span class="chip xs ${isApproved ? 'green' : isRejected ? 'red' : 'amber'}">
                        ${p.legalStatus || 'Under Review'}
                      </span>
                    </td>
                    <td class="r">
                      <button class="btn sm gold" style="padding:3px 8px; font-size:11.5px" onclick="window.store.selectLegalProperty('${p.id}'); window.router.navigate('legal')">
                        Inspect Legal File →
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="notice" style="margin-top:16px">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <div>
            <b>Finance Directorate Protocol:</b> Funds escrow and commission disbursement for listings remain locked until the Legal Directorate completes 5-Stage Approval & issues a final HO clear title sign-off.
          </div>
        </div>
      </div>
    ` : `
      <!-- Cross-Outlet Ledger View -->
      <div class="grid-2">
        <!-- Left Column: Cross-Outlet Ledger Table -->
        <div class="card">
          <div class="ch">
            <div>
              <h3>Cross-outlet financial ledger</h3>
              <p>Consolidated multi-branch entries</p>
            </div>
            <div class="select-wrap" style="min-height:34px; padding:0 8px">
              <select class="form-select" style="height:32px; border:0; background:transparent">
                <option value="all">All Outlets</option>
                <option value="YOR Central">YOR Central</option>
                <option value="YOR South">YOR South</option>
                <option value="Head Office">Head Office</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Outlet</th>
                  <th>Type</th>
                  <th class="r">Amount</th>
                  <th class="r">Status</th>
                </tr>
              </thead>
              <tbody>
                ${ledger.map(tx => `
                  <tr>
                    <td class="muted">${tx.date}</td>
                    <td><b>${tx.desc}</b></td>
                    <td><span class="chip gray xs">${tx.outlet}</span></td>
                    <td><span class="chip ${tx.type === 'Income' ? 'green' : 'red'} xs">${tx.type}</span></td>
                    <td class="r"><b class="num ${tx.type === 'Income' ? 'up' : 'down'}">${tx.amount}</b></td>
                    <td class="r"><span class="chip ${tx.status === 'Received' ? 'green' : tx.status === 'Paid' ? 'blue' : 'amber'}">${tx.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center">
            <button class="btn sm gold" onclick="window.modals.openInvoiceModal()">+ Create New Invoice</button>
            <button class="btn sm" onclick="window.modals.showToast('Ledger exported to Excel (.xlsx)')">Export XLSX</button>
          </div>
        </div>

        <!-- Right Column: Expense Category Breakdown & Exportable Financial Reports -->
        <div class="stack">
          <div class="card">
            <div class="ch">
              <div>
                <h3>Expense categorization</h3>
                <p>Operational cost distribution</p>
              </div>
              <span class="chip dark xs">FY 2026-27</span>
            </div>

            ${[
              ['Property maintenance & repairs', '32%'],
              ['Marketing, digital & branding', '24%'],
              ['Staff salaries & branch HR', '18%'],
              ['Operations, compliance & legal', '14%'],
              ['Utilities, software & cloud infrastructure', '8%'],
              ['Miscellaneous & travel', '4%']
            ].map(x => `
              <div class="outlet">
                <div class="outlet-row">
                  <b>${x[0]}</b>
                  <span class="num">${x[1]}</span>
                </div>
                <div class="progress blue"><i style="width:${x[1]}"></i></div>
              </div>
            `).join('')}
          </div>

          <div class="card">
            <div class="ch">
              <div>
                <h3>Exportable financial statements</h3>
                <p>Download certified reports</p>
              </div>
              <a href="#" onclick="window.modals.openExportReport()">All Reports</a>
            </div>
            
            <div class="kpi-line">
              <span>Monthly Financial Overview (Apr 2026)</span>
              <button class="btn sm gold" onclick="window.modals.showToast('Monthly Financial Report PDF generated!')">PDF</button>
            </div>
            <div class="kpi-line">
              <span>Outlet-Wise Performance Audit</span>
              <button class="btn sm gold" onclick="window.modals.showToast('Outlet Performance PDF generated!')">PDF</button>
            </div>
            <div class="kpi-line">
              <span>Profit & Loss Statement (P&L)</span>
              <button class="btn sm" onclick="window.modals.showToast('P&L Statement XLS generated!')">XLS</button>
            </div>
            <div class="kpi-line">
              <span>Consolidated Cash Flow Ledger</span>
              <button class="btn sm" onclick="window.modals.showToast('Cash Flow XLS generated!')">XLS</button>
            </div>
          </div>
        </div>
      </div>
    `}
  `;
}
