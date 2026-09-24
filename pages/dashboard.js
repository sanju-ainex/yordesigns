/* ==========================================================================
   YOR Estate - Dashboard Page Module
   Faithfully matching exact blocks & components from yordashboard.html
   with luxury aesthetics & interactive functionality
   ========================================================================== */

function renderDashboardPage() {
  const store = window.store;
  const fy = store.currentFy || "2026-27";
  const fyData = store.data.fyData[fy] || store.data.fyData["2026-27"];

  return `
    <div class="head">
      <div>
        <h1>Portfolio & operations overview</h1>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">
          <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download overview
        </button>
        <button class="btn dark gold-glow" onclick="window.propertyWizard.openSlidingPage()" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Add Property
        </button>
      </div>
    </div>

    <!-- Five KPI Stats Row -->
    <div class="stats">
      <div class="stat">
        <span>Total properties</span>
        <b class="num">1,248</b>
        <small class="muted">Across all outlets</small>
      </div>
      <div class="stat">
        <span>Under legal review</span>
        <b class="num">156</b>
        <small class="down">38 require action</small>
      </div>
      <div class="stat">
        <span>Active rentals</span>
        <b class="num">892</b>
        <small class="up">↑ 78% occupied</small>
      </div>
      <div class="stat">
        <span>Active investments</span>
        <b class="num">24</b>
        <small class="up">68 participating investors</small>
      </div>
      <div class="stat">
        <span>Open sales leads</span>
        <b class="num">428</b>
        <small class="up">62 in negotiation</small>
      </div>
    </div>

    <!-- Dashboard Main Grid (3 Columns) -->
    <div class="dashboard-main">
      <!-- 1. Module Directory -->
      <div class="card module-directory">
        <div class="ch">
          <div>
            <h3>More modules</h3>
            <p>Quick access to operational tools</p>
          </div>
          <span class="module-count">6</span>
        </div>

        <div class="module-grid">
          <button class="module-tile gold" data-route="legal">
            <span class="micon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
            <span><strong>Legal & Compliance</strong><small>Multi-state checklists & approvals</small></span>
          </button>

          <button class="module-tile" data-route="commissions">
            <span class="micon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9 9.5c.7-1 1.8-1.5 3-1.5 1.8 0 3 1 3 2.3 0 3.2-6 1.3-6 4.4 0 1.3 1.2 2.3 3 2.3 1.3 0 2.5-.5 3.2-1.5"/><path d="M12 6v12"/></svg></span>
            <span><strong>Commission Engine</strong><small>Rules, approvals & payouts</small></span>
          </button>

          <button class="module-tile gold" data-route="outlets">
            <span class="micon"><svg viewBox="0 0 24 24"><path d="M4 20V8h7v12"/><path d="M13 20V4h7v16"/><path d="M2 20h20"/></svg></span>
            <span><strong>Outlets</strong><small>Branches & access scope</small></span>
          </button>

          <button class="module-tile" data-route="users">
            <span class="micon"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6"/><path d="M16 8h5"/><path d="M18.5 5.5v5"/></svg></span>
            <span><strong>Users & Roles</strong><small>Permissions & security</small></span>
          </button>

          <button class="module-tile" data-route="investor">
            <span class="micon"><svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M6 17l4-5 3 3 5-8"/></svg></span>
            <span><strong>Investor Portal</strong><small>Investment & document access</small></span>
          </button>

          <button class="module-tile gold" data-route="agents">
            <span class="micon"><svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-4 2-6 6-6 3.5 0 5.5 1.5 6 4"/><path d="M14 15c3.5-.5 6 1 6 5"/></svg></span>
            <span><strong>Agents & Brokers</strong><small>Leads, properties & commissions</small></span>
          </button>
        </div>

        <div class="module-quick">
          <div class="module-quick-title"><span>Quick actions</span><span>Super Admin</span></div>
          <div class="module-quick-grid">
            <button onclick="window.propertyWizard.openSlidingPage()">+ Add property</button>
            <button onclick="window.modals.openAddLead()">+ Create lead</button>
            <button onclick="window.outletWizard.openSlidingPage()">+ Add outlet</button>
            <button onclick="window.userWizard.openSlidingPage()">+ Add user</button>
          </div>
        </div>
      </div>

      <!-- 2. Property Sales Performance Card -->
      <div class="card rev sales-performance">
        <div class="ch">
          <div>
            <h3>Property sales performance</h3>
            <p>Based on Stamp Value / Property Value recorded when a property is marked sold</p>
          </div>
          <select class="fy-select" id="salesFySelect" aria-label="Select financial year">
            <option value="2026-27" ${fy === '2026-27' ? 'selected' : ''}>FY 2026–27</option>
            <option value="2025-26" ${fy === '2025-26' ? 'selected' : ''}>FY 2025–26</option>
            <option value="2024-25" ${fy === '2024-25' ? 'selected' : ''}>FY 2024–25</option>
          </select>
        </div>

        <div class="big">
          <b class="num" id="dashTotalValue">${fyData.totalValue}</b>
          <span>total recorded value of all sold properties</span>
        </div>

        <div class="segs">
          <div class="seg recog">
            <div class="l">Total properties sold</div>
            <b class="num" id="dashTotalSold">${fyData.totalSold}</b>
          </div>
          <div class="seg contr">
            <div class="l">Sold this month</div>
            <b class="num" id="dashMonthSold">${fyData.monthSold}</b>
          </div>
          <div class="seg pipe">
            <div class="l">This month value</div>
            <b class="num month-value" id="dashMonthValue">${fyData.monthValue || '₹12.8 Cr'}</b>
          </div>
          <div class="seg pipe">
            <div class="l">Total rentals</div>
            <b class="num" id="dashRentals">${fyData.rentals}</b>
          </div>
        </div>

        <div class="chart-caption">
          <b>Properties sold by month</b>
          <span>Count of properties moved to Sold status</span>
        </div>

        <div class="chart" id="dashChartContainer">
          ${window.charts.renderSalesChart(fy)}
        </div>
      </div>

      <!-- 3. Top Performing Outlets -->
      <div class="card outlet-premium">
        <div class="ch">
          <div>
            <h3>Top performing outlets</h3>
            <p>Performance across people, property and sales</p>
          </div>
          <a href="#" data-route="outlets">View all</a>
        </div>

        <div class="top-outlet-list uniform">
          <!-- 1st Rank Top Performer -->
          <div class="top-outlet-card top-one">
            <div class="top-outlet-head">
              <div class="top-outlet-name">
                <div class="top-outlet-rank" title="Top performer">
                  <svg viewBox="0 0 24 24"><path d="M7 4h10l-1 5a4 4 0 0 1-8 0z"/><path d="M9 16h6"/><path d="M12 13v3"/><path d="M8 20h8"/><path d="M5 5H3v2a4 4 0 0 0 4 4"/><path d="M19 5h2v2a4 4 0 0 1-4 4"/></svg>
                </div>
                <div>
                  <b>YOR Central</b>
                  <small>Kochi</small>
                  <div class="outlet-card-label">
                    <svg viewBox="0 0 24 24"><path d="M12 3l2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.5 5-.7z"/></svg>
                    Top performer
                  </div>
                </div>
              </div>
              <div class="top-outlet-eff">92%<small>efficiency</small></div>
            </div>
            <div class="outlet-metrics">
              <div class="outlet-metric"><b>28</b><span>Total users</span></div>
              <div class="outlet-metric"><b>34</b><span>New properties</span></div>
              <div class="outlet-metric"><b>18</b><span>Sold properties</span></div>
            </div>
          </div>

          <!-- 2nd Rank -->
          <div class="top-outlet-card">
            <div class="top-outlet-head">
              <div class="top-outlet-name">
                <div class="top-outlet-rank">2</div>
                <div>
                  <b>YOR North</b>
                  <small>Kannur</small>
                </div>
              </div>
              <div class="top-outlet-eff">86%<small>efficiency</small></div>
            </div>
            <div class="outlet-metrics">
              <div class="outlet-metric"><b>18</b><span>Total users</span></div>
              <div class="outlet-metric"><b>26</b><span>New properties</span></div>
              <div class="outlet-metric"><b>14</b><span>Sold properties</span></div>
            </div>
          </div>

          <!-- 3rd Rank -->
          <div class="top-outlet-card">
            <div class="top-outlet-head">
              <div class="top-outlet-name">
                <div class="top-outlet-rank">3</div>
                <div>
                  <b>YOR South</b>
                  <small>Kozhikode</small>
                </div>
              </div>
              <div class="top-outlet-eff">81%<small>efficiency</small></div>
            </div>
            <div class="outlet-metrics">
              <div class="outlet-metric"><b>16</b><span>Total users</span></div>
              <div class="outlet-metric"><b>21</b><span>New properties</span></div>
              <div class="outlet-metric"><b>11</b><span>Sold properties</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Bottom Grid (3 Columns) - Minimal, Ultra-Clean & Spacious -->
    <div class="dashboard-bottom">
      
      <!-- 1. Rental Occupancy -->
      <div class="card mini-ops-card">
        <div class="ch">
          <div>
            <h3>Rental occupancy</h3>
            <p>Active leases & billing cycles</p>
          </div>
          <a href="#" data-route="rentals" class="link">Rentals →</a>
        </div>

        <div class="mini-ops-hero">
          <div class="mini-ops-num">94%</div>
          <span class="chip green" style="font-size: 10px; padding: 2px 7px;">↑ 4% this month</span>
        </div>
        <div class="mini-ops-sub">838 of 892 units active · ₹1.84 Cr / mo</div>

        <div class="progress green" style="margin: 10px 0 12px; height: 6px;"><i style="width: 94%"></i></div>

        <div class="mini-stat-grid">
          <div class="mini-stat-box">
            <b>838 active</b>
            <span>Rental customers</span>
          </div>
          <div class="mini-stat-box delayed" onclick="window.router.navigate('rentals')" title="Click to view overdue rentals">
            <b style="color: #D9822B;">14 delayed</b>
            <span>₹6.2L overdue (30d)</span>
          </div>
          <div class="mini-stat-box">
            <b>12 leases</b>
            <span>Expiring by 30 Sep</span>
          </div>
          <div class="mini-stat-box">
            <b>54 units</b>
            <span>Vacant · Listed today</span>
          </div>
        </div>

        <div class="mini-visit-footer" style="margin-top: 12px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Next auto-invoicing cycle: 01 Oct 2026</span>
        </div>
      </div>

      <!-- 2. Today's Schedule -->
      <div class="card mini-ops-card">
        <div class="ch">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3>Today's schedule</h3>
              <span class="chip gold" style="font-size: 10px; padding: 2px 7px;">3 visits</span>
            </div>
            <p>Scheduled client property visits</p>
          </div>
          <a href="#" data-route="sales" class="link">Sales CRM →</a>
        </div>

        <div class="mini-visits-list">
          <div class="mini-visit-item">
            <div class="mini-visit-time">11:30 <span>AM</span></div>
            <div class="mini-visit-info">
              <b>Dr. Rajesh Varma</b>
              <span>Forest Ridge · Sarah Coleman</span>
            </div>
            <button class="btn-micro primary" onclick="window.modals.showToast('WhatsApp confirmation sent to Dr. Rajesh Varma')">WhatsApp</button>
          </div>

          <div class="mini-visit-item">
            <div class="mini-visit-time">02:15 <span>PM</span></div>
            <div class="mini-visit-info">
              <b>Ananya Deshmukh</b>
              <span>Palm Court · Riyas Ali</span>
            </div>
            <button class="btn-micro" onclick="window.modals.showToast('Calling Ananya Deshmukh (+91 99801 44321)...')">Call</button>
          </div>

          <div class="mini-visit-item">
            <div class="mini-visit-time">04:30 <span>PM</span></div>
            <div class="mini-visit-info">
              <b>Vikramaditya Rao</b>
              <span>Skyline Penthouse · Priya Nair</span>
            </div>
            <button class="btn-micro" onclick="window.modals.showToast('Virtual tour link sent to Vikramaditya Rao')">Meet</button>
          </div>
        </div>

        <div class="mini-visit-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Synced with Google Calendar & Agent CRM</span>
        </div>
      </div>

      <!-- 3. Deal Compliance -->
      <div class="card mini-ops-card">
        <div class="ch">
          <div>
            <h3>Deal compliance</h3>
            <p>Title clearance & bank approvals</p>
          </div>
          <a href="#" data-route="legal" class="link">Audit →</a>
        </div>

        <div class="mini-ops-hero">
          <div class="mini-ops-num">86%</div>
          <span class="chip blue" style="font-size: 10px; padding: 2px 7px;">Deal-Ready</span>
        </div>
        <div class="mini-ops-sub">1,074 of 1,248 properties legally cleared</div>

        <div class="multi-progress-bar" style="margin: 10px 0 12px; height: 6px;">
          <span class="seg-fill green" style="width: 86%;"></span>
          <span class="seg-fill amber" style="width: 12.5%;"></span>
          <span class="seg-fill red" style="width: 1.5%;"></span>
        </div>

        <div class="mini-stat-grid">
          <div class="mini-stat-box">
            <b>1,074 cleared</b>
            <span>Title deeds verified</span>
          </div>
          <div class="mini-stat-box">
            <b>156 review</b>
            <span>Under legal audit</span>
          </div>
          <div class="mini-stat-box blocked" onclick="window.router.navigate('legal')">
            <b style="color: #BA1A1A;">18 blocked</b>
            <span>Action required →</span>
          </div>
          <div class="mini-stat-box">
            <b>942 units</b>
            <span>Pre-loan approved</span>
          </div>
        </div>

        <div class="mini-visit-footer" style="margin-top: 12px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Pre-loan approved by SBI · HDFC · ICICI</span>
        </div>
      </div>

    </div>

    <!-- Updates Zone: Recently Updated Properties & Recent Action History Feed -->
    <div class="updates-zone">

      <!-- Left Side: Recently Updated Properties List -->
      <div class="recent-updates-wrap">
        <div class="recent-updates-head">
          <div>
            <h3>Recently updated properties</h3>
            <p>Review project details, listing source, assigned team, documents, images and tracking status in one place.</p>
          </div>
          <a href="#" data-route="properties" class="link">View all properties →</a>
        </div>

        <div class="recent-updates-layout alt-list">
          <div class="property-activity-list">

            <!-- Property Activity Row 1: Forest Ridge Residence -->
            <div class="property-activity-row">
              <div class="property-activity-photo" style="background: linear-gradient(135deg, #1C242E, #2E3B4B); border: 1px solid rgba(255,255,255,0.08);">
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.18;">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14M9 9h1M9 13h1M9 17h1M17 9h1M17 13h1M17 17h1"/></svg>
                </div>
                <span class="property-photo-tag">YOR Central</span>
              </div>

              <div class="property-activity-main">
                <div class="property-activity-head">
                  <div class="property-activity-title">
                    <b>Forest Ridge Residence</b>
                    <span>Blue Mountains, NSW · Survey FR-221/08</span>
                  </div>
                  <div class="property-status-stack">
                    <span class="chip green">Legal Verified</span>
                    <span class="last-updated">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>
                      22 mins ago
                    </span>
                  </div>
                </div>

                <div class="property-spec-line">
                  <span class="property-spec"><b>5 Bed</b> / 6 Bath</span>
                  <span class="property-spec"><b>1,240 sqm</b> land</span>
                  <span class="property-spec"><b>7,850 sqft</b> house</span>
                </div>

                <div class="property-team-line">
                  <div><span>Added by outlet</span><b>YOR Central</b></div>
                  <div><span>Agent</span><b>Sarah Coleman</b></div>
                  <div><span>Listing source</span><b>Direct · No broker</b></div>
                </div>

                <div class="activity-tag">
                  <svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V7z"/><path d="M9 12l2 2 4-5"/></svg>
                  Latest action: Title and ownership documents approved
                </div>
              </div>

              <div class="property-activity-side">
                <div class="quick-access-label">Quick access</div>
                <div class="property-action-grid">
                  <div class="property-action files" onclick="window.modals.openUploadDocument()">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>
                    </span>
                    <div><b>Files</b><span>6 docs</span></div>
                  </div>
                  <div class="property-action images" onclick="window.modals.showToast('Forest Ridge: 12 high-res architectural photos available')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 15l-4-4-5 5-3-3-6 6"/></svg>
                    </span>
                    <div><b>Images</b><span>12 photos</span></div>
                  </div>
                  <div class="property-action history" onclick="window.router.navigate('legal')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>
                    </span>
                    <div><b>History</b><span>14 actions</span></div>
                  </div>
                  <div class="property-action tracking" onclick="window.router.navigate('legal')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><path d="M5 12h4l2-5 3 10 2-5h3"/></svg>
                    </span>
                    <div><b>Tracking</b><span>On track</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Property Activity Row 2: Palm Court Villa -->
            <div class="property-activity-row">
              <div class="property-activity-photo" style="background: linear-gradient(135deg, #18231E, #2A3F35); border: 1px solid rgba(255,255,255,0.08);">
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.18;">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <span class="property-photo-tag">YOR South</span>
              </div>

              <div class="property-activity-main">
                <div class="property-activity-head">
                  <div class="property-activity-title">
                    <b>Palm Court Villa</b>
                    <span>Kochi, Kerala · Survey PC-174/12</span>
                  </div>
                  <div class="property-status-stack">
                    <span class="chip blue">New Property</span>
                    <span class="last-updated">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>
                      Today, 10:42 AM
                    </span>
                  </div>
                </div>

                <div class="property-spec-line">
                  <span class="property-spec"><b>4 Bed</b> / 5 Bath</span>
                  <span class="property-spec"><b>420 sqm</b> land</span>
                  <span class="property-spec"><b>4,320 sqft</b> house</span>
                </div>

                <div class="property-team-line">
                  <div><span>Added by outlet</span><b>YOR South</b></div>
                  <div><span>Agent</span><b>Riyas Ali</b></div>
                  <div><span>Listing source</span><b>Broker · Apex Realty</b></div>
                </div>

                <div class="activity-tag">
                  <svg viewBox="0 0 24 24"><path d="M4 12h16"/><path d="M12 4v16"/><circle cx="12" cy="12" r="9"/></svg>
                  Latest action: Property onboarding checklist started
                </div>
              </div>

              <div class="property-activity-side">
                <div class="quick-access-label">Quick access</div>
                <div class="property-action-grid">
                  <div class="property-action files" onclick="window.modals.openUploadDocument()">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>
                    </span>
                    <div><b>Files</b><span>4 docs</span></div>
                  </div>
                  <div class="property-action images" onclick="window.modals.showToast('Palm Court Villa: 8 interior and exterior photos available')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 15l-4-4-5 5-3-3-6 6"/></svg>
                    </span>
                    <div><b>Images</b><span>8 photos</span></div>
                  </div>
                  <div class="property-action history" onclick="window.router.navigate('legal')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>
                    </span>
                    <div><b>History</b><span>6 actions</span></div>
                  </div>
                  <div class="property-action tracking" onclick="window.router.navigate('legal')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><path d="M5 12h4l2-5 3 10 2-5h3"/></svg>
                    </span>
                    <div><b>Tracking</b><span>Onboarding</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Property Activity Row 3: Rainforest Edge House -->
            <div class="property-activity-row">
              <div class="property-activity-photo" style="background: linear-gradient(135deg, #241D1A, #443229); border: 1px solid rgba(255,255,255,0.08);">
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.18;">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1"><path d="M4 20V8h7v12"/><path d="M13 20V4h7v16"/><path d="M2 20h20"/></svg>
                </div>
                <span class="property-photo-tag">YOR North</span>
              </div>

              <div class="property-activity-main">
                <div class="property-activity-head">
                  <div class="property-activity-title">
                    <b>Rainforest Edge House</b>
                    <span>Wayanad, Kerala · Survey RE-318/06</span>
                  </div>
                  <div class="property-status-stack">
                    <span class="chip amber">Under Review</span>
                    <span class="last-updated">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>
                      1 hour ago
                    </span>
                  </div>
                </div>

                <div class="property-spec-line">
                  <span class="property-spec"><b>6 Bed</b> / 7 Bath</span>
                  <span class="property-spec"><b>960 sqm</b> land</span>
                  <span class="property-spec"><b>6,980 sqft</b> house</span>
                </div>

                <div class="property-team-line">
                  <div><span>Added by outlet</span><b>YOR North</b></div>
                  <div><span>Agent</span><b>Nihal Joseph</b></div>
                  <div><span>Listing source</span><b>Broker · Prime Habitat</b></div>
                </div>

                <div class="activity-tag">
                  <svg viewBox="0 0 24 24"><path d="M8 6h11"/><path d="M8 12h11"/><path d="M8 18h11"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>
                  Latest action: Ownership files uploaded for legal review
                </div>
              </div>

              <div class="property-activity-side">
                <div class="quick-access-label">Quick access</div>
                <div class="property-action-grid">
                  <div class="property-action files" onclick="window.modals.openUploadDocument()">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>
                    </span>
                    <div><b>Files</b><span>9 docs</span></div>
                  </div>
                  <div class="property-action images" onclick="window.modals.showToast('Rainforest Edge: 16 architectural photos available')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 15l-4-4-5 5-3-3-6 6"/></svg>
                    </span>
                    <div><b>Images</b><span>16 photos</span></div>
                  </div>
                  <div class="property-action history" onclick="window.router.navigate('legal')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>
                    </span>
                    <div><b>History</b><span>11 actions</span></div>
                  </div>
                  <div class="property-action tracking" onclick="window.router.navigate('legal')">
                    <span class="action-icon">
                      <svg viewBox="0 0 24 24"><path d="M5 12h4l2-5 3 10 2-5h3"/></svg>
                    </span>
                    <div><b>Tracking</b><span>Legal review</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Right Side: Recent Action History Standalone Feed -->
      <aside class="history-standalone">
        <div class="history-head">
          <div>
            <h3>Recent action history</h3>
            <p>Platform activity across properties, brokers, files, legal and status changes.</p>
          </div>
        </div>

        <div class="history-filter-row" id="dashHistoryFilterRow">
          <span class="history-filter on" data-filter="all">All activity</span>
          <span class="history-filter" data-filter="verify">Legal</span>
          <span class="history-filter" data-filter="file">Documents</span>
          <span class="history-filter" data-filter="broker">Listings</span>
        </div>

        <ul class="history-feed" id="dashHistoryFeed">
          <li class="history-feed-item verify" data-type="verify">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V7z"/><path d="M9 12l2 2 4-5"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>Forest Ridge Residence verified</b><time>22m</time></div>
              <p>Ownership and title certificate approved by Head Office Legal.</p>
              <div class="history-feed-meta"><span>Property: <strong>FR-221/08</strong></span><span>By: <strong>Priya Nair</strong></span></div>
            </div>
          </li>

          <li class="history-feed-item broker" data-type="broker">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-4 2-6 6-6"/><path d="M14 15c3.5-.5 6 1 6 5"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>Palm Court Villa added by broker</b><time>48m</time></div>
              <p>Apex Realty submitted the listing and YOR South assigned Riyas Ali.</p>
              <div class="history-feed-meta"><span>Broker: <strong>Apex Realty</strong></span><span>Outlet: <strong>YOR South</strong></span></div>
            </div>
          </li>

          <li class="history-feed-item file" data-type="file">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>Rainforest Edge files updated</b><time>1h</time></div>
              <p>Revised floor plan and ownership records uploaded for legal review.</p>
              <div class="history-feed-meta"><span>Files: <strong>2 new</strong></span><span>Agent: <strong>Nihal Joseph</strong></span></div>
            </div>
          </li>

          <li class="history-feed-item edit" data-type="edit">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16z"/><path d="M13 7l4 4"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>Property dimensions updated</b><time>1h 40m</time></div>
              <p>Land area and house area confirmed against supporting documentation.</p>
              <div class="history-feed-meta"><span>Updated by: <strong>Outlet Admin</strong></span><span>Fields: <strong>2</strong></span></div>
            </div>
          </li>

          <li class="history-feed-item status" data-type="status">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><path d="M5 12h4l2-5 3 10 2-5h3"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>Listing status changed</b><time>3h</time></div>
              <p>One listing moved to Legal Verified and another moved to Under Review.</p>
              <div class="history-feed-meta"><span>Module: <strong>Properties</strong></span><span>Changes: <strong>2</strong></span></div>
            </div>
          </li>

          <li class="history-feed-item finance" data-type="finance">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M6 3h12v18H6z"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>Valuation record revised</b><time>4h</time></div>
              <p>Updated property valuation saved and reflected in the portfolio register.</p>
              <div class="history-feed-meta"><span>Property: <strong>Green Valley Plot</strong></span><span>Value: <strong>₹12.5 Cr</strong></span></div>
            </div>
          </li>

          <li class="history-feed-item file" data-type="file">
            <div class="history-feed-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 15l-4-4-5 5-3-3-6 6"/></svg>
            </div>
            <div class="history-feed-body">
              <div class="activity-title"><b>New property images uploaded</b><time>5h</time></div>
              <p>Eight new interior and exterior photos were added to Palm Court Villa.</p>
              <div class="history-feed-meta"><span>Images: <strong>8 new</strong></span><span>By: <strong>Riyas Ali</strong></span></div>
            </div>
          </li>
        </ul>

        <div class="history-footer-link">
          <span>Showing latest 7 of 18 actions today</span>
          <a href="#" data-route="legal">View full activity →</a>
        </div>
      </aside>

    </div>
  `;
}

// Global filter handler for Today's Site Visits & VIP Leads
window.filterVisits = function(filter, btn) {
  document.querySelectorAll('#visitsFilterTabs .visits-tab').forEach(t => t.classList.remove('on'));
  if (btn) btn.classList.add('on');
  const items = document.querySelectorAll('#dashboardVisitsList .visit-card');
  items.forEach(item => {
    if (filter === 'all' || item.getAttribute('data-type') === filter) {
      item.style.display = 'grid';
    } else {
      item.style.display = 'none';
    }
  });
};

