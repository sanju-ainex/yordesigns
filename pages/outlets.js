/* ==========================================================================
   YOR Estate - Multi-Outlet Configuration Module
   ========================================================================== */

function renderOutletsPage() {
  const store = window.store;
  const outlets = store.data.outlets;

  return `
    <div class="head">
      <div>
        <h1>Multi-outlet configuration & branch scoping</h1>
        <p>Onboard new branch outlets, assign branch administrators, configure branch-level data scoping and maintain central oversight.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">Outlet Settings</button>
        <button class="btn dark gold-glow" onclick="window.outletWizard.openSlidingPage()" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16"/><path d="M4 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18"/><path d="M12 22V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"/></svg>
          + Onboard New Branch
        </button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Active outlets</span><b class="num">${outlets.length} Branches</b><small class="up">All operational</small></div>
      <div class="stat"><span>Outlet admins</span><b class="num">14</b><small class="muted">2 shared / HO scoped</small></div>
      <div class="stat"><span>Property records</span><b class="num">1,248</b><small class="muted">Branch scoped</small></div>
      <div class="stat"><span>Users across outlets</span><b class="num">184</b><small class="up">Role governed</small></div>
      <div class="stat"><span>Audit events today</span><b class="num">326</b><small class="up">Zero critical anomalies</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: Outlet Register Table -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Branch outlet register</h3>
            <p>Branch details and assigned administrators</p>
          </div>
          <button class="btn sm gold" onclick="window.outletWizard.openSlidingPage()" style="display:inline-flex; align-items:center; gap:5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16"/><path d="M4 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18"/><path d="M12 22V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"/></svg>
            + Onboard Branch
          </button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Outlet & Identity</th>
                <th>Location & Tel</th>
                <th>Assigned Admin & Mail</th>
                <th>Periodic Target</th>
                <th>Users</th>
                <th class="r">Status</th>
              </tr>
            </thead>
            <tbody>
              ${outlets.map(o => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <img src="${o.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&auto=format&fit=crop&q=80'}" style="width:38px; height:38px; border-radius:6px; object-fit:cover; border:1px solid var(--line); flex-shrink:0;" alt="${o.name}">
                      <div>
                        <b>${o.name}</b>
                        <div style="display:flex; align-items:center; gap:5px; margin-top:2px;">
                          <span class="chip gold xs font-mono" style="font-size:9px; padding:0 5px;">${o.id}</span>
                          <span class="chip dark xs" style="font-size:9px; padding:0 5px;">${o.country || 'India'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-size:12.5px;">${o.location}</span>
                    <div class="xs muted" style="font-family:var(--font-mono); font-size:10.5px;">${o.phone || '+91 80 4912 8800'}</div>
                  </td>
                  <td>
                    <span class="chip gold xs">${o.admin}</span>
                    <div style="font-size:10.5px; color:var(--ink-2); margin-top:2px;">${o.email || 'branch@yorestate.com'}</div>
                  </td>
                  <td>
                    <div style="font-size:11.5px; font-weight:600; color:var(--ink);">${o.salesTarget || '₹ 25 Cr'}</div>
                    <span class="chip xs" style="font-size:9px; padding:0 4px; background:#F0FDF4; color:#166534; border:1px solid #BBF7D0;">${o.targetPeriod || 'Q1 2026'}</span>
                  </td>
                  <td><span class="num">${o.users}</span></td>
                  <td class="r"><span class="chip green">${o.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Branch-Level Scoping & Access Hierarchy -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Branch access scoping model</h3>
            <p>Data access enforced at the API & application layer</p>
          </div>
          <span class="chip dark xs">Security Control</span>
        </div>

        <div class="role-tree">
          <div class="role">
            <div>
              <strong>Main / Super Admin</strong>
              <small>Full platform oversight across all branches & ledgers</small>
            </div>
            <span class="chip dark xs">Global Access</span>
          </div>

          <div class="role level2">
            <div>
              <strong>Head Office Admin</strong>
              <small>Central operations, compliance approvals & sign-offs</small>
            </div>
            <span class="chip blue xs">HO Access</span>
          </div>

          <div class="role level2">
            <div>
              <strong>Outlet Admin</strong>
              <small>Assigned branch properties, agents, and local leads only</small>
            </div>
            <span class="chip gold xs">Branch Scoped</span>
          </div>

          <div class="role level3">
            <div>
              <strong>Sales Team & Operations</strong>
              <small>Only leads & property listings assigned to their branch</small>
            </div>
            <span class="chip green xs">Agent Scoped</span>
          </div>

          <div class="role level3">
            <div>
              <strong>Finance Team</strong>
              <small>Cross-outlet financial ledger & payout release authority</small>
            </div>
            <span class="chip blue xs">Finance Scoped</span>
          </div>
        </div>

        <div class="notice" style="margin-top:20px">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div>
            <b>Scalable Multi-Branch Design:</b> New outlets can be onboarded seamlessly without re-architecture or code modification.
          </div>
        </div>
      </div>
    </div>
  `;
}
