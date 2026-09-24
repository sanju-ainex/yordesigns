/* ==========================================================================
   YOR Estate - Investment Management Module
   ========================================================================== */

function renderInvestmentsPage() {
  const store = window.store;
  const investments = store.data.investments;
  const selectedInv = investments[0] || {};

  return `
    <div class="head">
      <div>
        <h1>Group investment & co-investor mapping</h1>
        <p>Create property investment records, map multi-investor syndicates (4–5 co-investors), track resale-lock periods and monitor projected ROI.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">Investor Register</button>
        <button class="btn dark" onclick="window.modals.openAddInvestment()">+ New Investment</button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Active investments</span><b class="num">${investments.length}</b><small class="up">↑ 20% this quarter</small></div>
      <div class="stat"><span>Total invested value</span><b class="num">₹41.28 Cr</b><small class="muted">Across current syndicates</small></div>
      <div class="stat"><span>Participating investors</span><b class="num">68</b><small class="up">↑ 12% investor growth</small></div>
      <div class="stat"><span>Average projected ROI</span><b class="num">12.4% p.a.</b><small class="up">Consistent yield</small></div>
      <div class="stat"><span>Resale-lock reviews</span><b class="num">5</b><small class="warn">Due this quarter</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: Investments Table -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Group investment register</h3>
            <p>Property syndicates with multi-investor ownership</p>
          </div>
          <button class="btn sm gold" onclick="window.modals.openAddInvestment()">+ Create Syndicate</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Target Property</th>
                <th>Invested Capital</th>
                <th>Co-Investors</th>
                <th>Projected ROI</th>
                <th>Lock Period</th>
                <th class="r">Status</th>
              </tr>
            </thead>
            <tbody>
              ${investments.map(inv => `
                <tr>
                  <td>
                    <div class="prop">
                      <div class="thumb"></div>
                      <div><b>${inv.property}</b><span>${inv.type}</span></div>
                    </div>
                  </td>
                  <td><b class="num">${inv.invested}</b></td>
                  <td><span class="chip blue xs">${inv.investorCount} Co-Investors</span></td>
                  <td class="up"><b>${inv.projectedRoi}</b></td>
                  <td><span class="chip gold xs">${inv.lockRemaining} left</span></td>
                  <td class="r"><span class="chip ${inv.status === 'Active' ? 'green' : 'amber'}">${inv.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Co-Investor Split Progress & Resale Lock Countdown -->
      <div class="stack">
        <div class="card">
          <div class="ch">
            <div>
              <h3>Co-investor equity distribution</h3>
              <p>${selectedInv.property} Syndicate</p>
            </div>
            <b class="num">${selectedInv.invested}</b>
          </div>

          <div style="margin-top:10px">
            ${selectedInv.coInvestors.map(c => `
              <div class="outlet">
                <div class="outlet-row">
                  <b>${c.name}</b>
                  <span class="num">${c.share}% Equity</span>
                </div>
                <div class="progress ${c.share >= 35 ? '' : 'blue'}">
                  <i style="width:${c.share}%"></i>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="ch">
            <div>
              <h3>Resale-lock period status</h3>
              <p>Mandatory lock-in before liquidity window opens</p>
            </div>
            <span class="chip dark xs">Locked</span>
          </div>

          ${investments.map(inv => `
            <div class="kpi-line">
              <div>
                <b>${inv.property}</b>
                <div class="xs muted">Tenure: ${inv.lockPeriod}</div>
              </div>
              <span class="chip gold">${inv.lockRemaining} remaining</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
