/* ==========================================================================
   YOR Estate - Commission Engine Module
   ========================================================================== */

function renderCommissionsPage() {
  const store = window.store;
  const rules = store.data.commissionRules;
  const payouts = store.data.payouts;

  return `
    <div class="head">
      <div>
        <h1>Commission engine & agent payouts</h1>
        <p>Configure percentage, tiered and flat commission rules, automate calculations on transaction closure, and manage approval workflows.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">Payout Ledger</button>
        <button class="btn dark" onclick="window.modals.openAddCommissionRule()">+ Commission Rule</button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Commission YTD</span><b class="num">₹28.64 L</b><small class="up">↑ 14% vs last FY</small></div>
      <div class="stat"><span>Pending payouts</span><b class="num">₹4.88 L</b><small class="warn">${payouts.filter(p=>p.status==='Pending').length} records pending approval</small></div>
      <div class="stat"><span>Approved & released</span><b class="num">₹19.82 L</b><small class="up">67 transactions</small></div>
      <div class="stat"><span>Active agents / brokers</span><b class="num">24</b><small class="up">3 onboarded this month</small></div>
      <div class="stat"><span>Exceptions / overrides</span><b class="num">2</b><small class="muted">Manual finance review</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: Commission Rules Builder -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Configured commission rules</h3>
            <p>Percentage, flat and tiered calculation rules</p>
          </div>
          <button class="btn sm gold" onclick="window.modals.openAddCommissionRule()">+ Add Rule</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Applies To</th>
                <th>Calculation Formula</th>
                <th class="r">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rules.map(r => `
                <tr>
                  <td><b>${r.name}</b></td>
                  <td>${r.target}</td>
                  <td><span class="chip gray font-mono">${r.rule}</span></td>
                  <td class="r"><span class="chip ${r.status === 'Active' ? 'green' : 'blue'}">${r.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="notice" style="margin-top:20px">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <div>
            <b>Automatic Calculation:</b> When an outlet sales transaction closes, commissions are computed instantly based on property category, value tiers, and agent tier.
          </div>
        </div>
      </div>

      <!-- Right Column: Recent Payouts & Approval Workflow -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Agent payout ledger</h3>
            <p>Finance approval & release queue</p>
          </div>
          <div class="chip dark xs">Approval Controlled</div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Property</th>
                <th class="r">Amount</th>
                <th class="r">Status / Action</th>
              </tr>
            </thead>
            <tbody>
              ${payouts.map(p => `
                <tr>
                  <td><b>${p.agent}</b></td>
                  <td>${p.property}</td>
                  <td class="r"><b class="num">${p.amount}</b></td>
                  <td class="r">
                    ${p.status === 'Pending' ? `
                      <button class="btn sm gold" onclick="window.store.updatePayoutStatus('${p.id}', 'Approved'); window.modals.showToast('Payout for ${p.agent} approved!');">
                        Approve
                      </button>
                    ` : `
                      <span class="chip ${p.status === 'Paid' ? 'green' : 'blue'}">${p.status}</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--line)">
          <div class="kpi-line"><span>Total Pending Release</span><b class="num" style="color:var(--amber)">₹4,88,000</b></div>
          <div class="kpi-line"><span>Next Payout Cycle</span><b>15 May 2026 (Direct NEFT)</b></div>
        </div>
      </div>
    </div>
  `;
}
