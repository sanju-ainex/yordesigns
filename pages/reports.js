/* ==========================================================================
   YOR Estate - Reporting & Analytics Module
   ========================================================================== */

function renderReportsPage() {
  const store = window.store;

  return `
    <div class="head">
      <div>
        <h1>Reporting & operational analytics</h1>
        <p>Performance visibility across branch outlets, sales executives, conversion metrics, revenue trends and exportable compliance reports.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">Saved Reports</button>
        <button class="btn dark" onclick="window.modals.openExportReport()">+ Export Full Analytics</button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Total gross revenue</span><b class="num">₹1.284 Cr</b><small class="up">↑ 12% vs targets</small></div>
      <div class="stat"><span>Closed transactions</span><b class="num">248</b><small class="up">↑ 18% volume</small></div>
      <div class="stat"><span>Lead-to-sale conversion</span><b class="num">24.5%</b><small class="up">↑ 6% efficiency</small></div>
      <div class="stat"><span>Operational outlets</span><b class="num">12 Branches</b><small class="muted">100% active</small></div>
      <div class="stat"><span>Verified properties</span><b class="num">86%</b><small class="up">Clean title register</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: Outlet Performance Chart -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Branch outlet performance comparison</h3>
            <p>Revenue vs Transaction Volume by Branch (Current Quarter)</p>
          </div>
          <span class="chip gold xs">Q1 Performance</span>
        </div>

        <div class="chartbox" style="height:230px">
          ${window.charts.renderOutletPerformanceChart()}
        </div>

        <div class="legend" style="margin-top:14px">
          <span><i style="background:#23406D"></i>Revenue (₹ Cr)</span>
          <span><i style="background:#BF973E"></i>Transactions (Volume)</span>
        </div>
      </div>

      <!-- Right Column: Agent Conversion Ranking & Lead Velocity -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Agent conversion efficiency ranking</h3>
            <p>Closed deals / assigned qualified leads</p>
          </div>
          <a href="#" data-route="agents">View Agents</a>
        </div>

        ${[
          ['James Tan', '43% Conversion', '24 deals closed'],
          ['Sarah Lim', '40% Conversion', '18 deals closed'],
          ['Priya Nair', '39% Conversion', '15 deals closed'],
          ['Daniel Cheong', '38% Conversion', '14 deals closed'],
          ['Michael Wong', '36% Conversion', '12 deals closed']
        ].map(x => `
          <div class="outlet">
            <div class="outlet-row">
              <b>${x[0]}</b>
              <span class="num">${x[1]}</span>
            </div>
            <div class="progress blue"><i style="width:${parseInt(x[1]) * 2.2}%"></i></div>
          </div>
        `).join('')}

        <div style="margin-top:20px; display:flex; justify-content:space-between">
          <button class="btn sm gold" onclick="window.modals.showToast('Commission bonus list downloaded!')">Download Leaderboard</button>
          <button class="btn sm dark" onclick="window.modals.openExportReport()">Export Summary</button>
        </div>
      </div>
    </div>
  `;
}
