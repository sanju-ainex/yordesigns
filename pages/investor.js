/* ==========================================================================
   YOR Estate - Investor Scoped Portal Module
   ========================================================================== */

function renderInvestorPage() {
  const store = window.store;

  return `
    <div class="head">
      <div>
        <h1>Investor portal preview</h1>
        <p>Read-scoped investor portal for viewing personal investments, co-investment equity share, valuation/ROI growth, agreements and resale-lock status.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">Download Portfolio</button>
        <button class="btn dark" onclick="window.modals.openAddInvestment()">+ Inquire New Syndicate</button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Total invested capital</span><b class="num">₹2.50 Cr</b><small class="muted">Across 3 properties</small></div>
      <div class="stat"><span>Current portfolio value</span><b class="num">₹3.12 Cr</b><small class="up">↑ +24.8% growth</small></div>
      <div class="stat"><span>Cumulative ROI</span><b class="num up">+25.0%</b><small class="up">Annualized 12.5%</small></div>
      <div class="stat"><span>Active syndicates</span><b class="num">3 Properties</b><small class="muted">All verified</small></div>
      <div class="stat"><span>Agreement documents</span><b class="num">8 Files</b><small class="up">Signed & verified</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: My Investments -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>My investment portfolio</h3>
            <p>Strictly scoped — investor views only their linked syndicate records</p>
          </div>
          <span class="chip gold xs">Investor View</span>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Property Syndicate</th>
                <th>Invested Amount</th>
                <th>Current Value</th>
                <th>ROI Growth</th>
                <th class="r">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="prop">
                    <div class="thumb"></div>
                    <div><b>Riverside Tower</b><span>Commercial Suite · 35% Share</span></div>
                  </div>
                </td>
                <td><b class="num">₹1.25 Cr</b></td>
                <td><b class="num">₹1.56 Cr</b></td>
                <td class="up"><b>+25.0%</b></td>
                <td class="r"><span class="chip green">Active</span></td>
              </tr>
              <tr>
                <td>
                  <div class="prop">
                    <div class="thumb"></div>
                    <div><b>Maple Residences</b><span>Residential · 40% Share</span></div>
                  </div>
                </td>
                <td><b class="num">₹1.20 Cr</b></td>
                <td><b class="num">₹1.51 Cr</b></td>
                <td class="up"><b>+26.0%</b></td>
                <td class="r"><span class="chip green">Active</span></td>
              </tr>
              <tr>
                <td>
                  <div class="prop">
                    <div class="thumb"></div>
                    <div><b>Cedar Business Park</b><span>Mixed Use · 20% Share</span></div>
                  </div>
                </td>
                <td><b class="num">₹5.00 L</b></td>
                <td><b class="num">₹5.50 L</b></td>
                <td class="up"><b>+10.0%</b></td>
                <td class="r"><span class="chip green">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Investment Agreements & Resale-Lock Status -->
      <div class="stack">
        <div class="card">
          <div class="ch">
            <div>
              <h3>Investment agreement & KYC</h3>
              <p>Riverside Tower Syndicate (INV-2026-041)</p>
            </div>
            <span class="chip green">Signed</span>
          </div>

          <div class="kpi-line"><span>KYC Verification Status</span><span class="chip green">Verified ✓</span></div>
          <div class="kpi-line"><span>Resale-Lock Period</span><b>18 months remaining</b></div>
          <div class="progress" style="margin:10px 0"><i style="width:25%"></i></div>
          <div class="kpi-line"><span>Digital Deed Copy</span><button class="btn sm gold" onclick="window.modals.showToast('Agreement INV-2026-041 downloaded!')">Download PDF</button></div>
        </div>

        <div class="card">
          <div class="ch">
            <div>
              <h3>Co-investor syndicate equity split</h3>
              <p>Riverside Tower (Total ₹2.50 Cr)</p>
            </div>
          </div>
          
          <div class="outlet">
            <div class="outlet-row"><b>You (Tan Wei Ming)</b><span class="num">35% (₹87.5 L)</span></div>
            <div class="progress"><i style="width:35%"></i></div>
          </div>
          <div class="outlet">
            <div class="outlet-row"><b>Ayesha Capital</b><span class="num">25% (₹62.5 L)</span></div>
            <div class="progress blue"><i style="width:25%"></i></div>
          </div>
          <div class="outlet">
            <div class="outlet-row"><b>Family Office Trust</b><span class="num">20% (₹50.0 L)</span></div>
            <div class="progress blue"><i style="width:20%"></i></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
