/* ==========================================================================
   YOR Estate - Agent / Broker Scoped Portal Module
   ========================================================================== */

function renderAgentPage() {
  const store = window.store;

  return `
    <div class="head">
      <div>
        <div class="xs" style="margin-bottom:4px;">
          <a href="#" class="text-link" onclick="window.router.navigate('agents'); return false;" style="display:inline-flex; align-items:center; gap:4px; font-weight:600;">
            ← Back to All Agents & Brokers Directory
          </a>
        </div>
        <h1>Agent & Broker Portal Preview</h1>
        <p>Scoped agent view for managing assigned property listings, submitting and tracking leads, viewing commission status and tracking payout history.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.router.navigate('agents')">All Agents</button>
        <button class="btn" onclick="window.modals.openExportReport()">Payout History</button>
        <button class="btn dark" onclick="window.modals.openAddLead()">+ Submit Lead</button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Assigned properties</span><b class="num">28 Listings</b><small class="up">↑ 12% active</small></div>
      <div class="stat"><span>Lead submissions</span><b class="num">36 Leads</b><small class="up">↑ 20% this month</small></div>
      <div class="stat"><span>Active clients</span><b class="num">18 Clients</b><small class="up">In discussion</small></div>
      <div class="stat"><span>Commission YTD</span><b class="num">₹2.86 L</b><small class="up">↑ 15% earned</small></div>
      <div class="stat"><span>Conversion rate</span><b class="num up">39.0%</b><small class="up">Top 10% agent</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: Assigned Properties -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Assigned property listings</h3>
            <p>Only properties mapped to Sarah Lim</p>
          </div>
          <button class="btn sm gold" onclick="window.modals.openAddLead()">+ New Lead</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Property Listing</th>
                <th>Active Leads</th>
                <th>Pipeline Stage</th>
                <th class="r">Listing Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>The Lennox Tower (Unit 2801)</b></td>
                <td><span class="num">12 Leads</span></td>
                <td><span class="chip gold xs">Negotiation</span></td>
                <td class="r"><span class="chip green">Active</span></td>
              </tr>
              <tr>
                <td><b>Maple Residences (Unit B-12)</b></td>
                <td><span class="num">8 Leads</span></td>
                <td><span class="chip blue xs">Followed Up</span></td>
                <td class="r"><span class="chip green">Active</span></td>
              </tr>
              <tr>
                <td><b>Riverside Apartments</b></td>
                <td><span class="num">6 Leads</span></td>
                <td><span class="chip gray xs">New</span></td>
                <td class="r"><span class="chip blue">New Listing</span></td>
              </tr>
              <tr>
                <td><b>Cedar Business Park</b></td>
                <td><span class="num">4 Leads</span></td>
                <td><span class="chip green xs">Converted</span></td>
                <td class="r"><span class="chip green">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Commission Payout Status & Lead Conversion Breakdown -->
      <div class="stack">
        <div class="card">
          <div class="ch">
            <div>
              <h3>Commission ledger & payouts</h3>
              <p>Sarah Lim (Agent ID: AG-084)</p>
            </div>
            <span class="chip green">Verified</span>
          </div>

          <div class="metric">₹2.86 L</div>
          <div class="muted small" style="margin-top:4px">Total commission earned in current FY</div>
          <div class="progress green" style="margin:14px 0"><i style="width:72%"></i></div>

          <div class="kpi-line"><span>Approved & Released</span><b class="num" style="color:var(--green)">₹2.04 L</b></div>
          <div class="kpi-line"><span>Pending Approval</span><b class="num" style="color:var(--amber)">₹82,000</b></div>
        </div>

        <div class="card">
          <div class="ch">
            <div>
              <h3>Lead conversion distribution</h3>
              <p>Current active pipeline breakdown</p>
            </div>
          </div>

          ${[
            ['New inquiries', '40%'],
            ['Contacted / call done', '25%'],
            ['Site viewing scheduled', '20%'],
            ['Final negotiation', '10%'],
            ['Converted & closed', '5%']
          ].map(x => `
            <div class="outlet">
              <div class="outlet-row"><b>${x[0]}</b><span class="num">${x[1]}</span></div>
              <div class="progress blue"><i style="width:${parseInt(x[1]) * 2}%"></i></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
