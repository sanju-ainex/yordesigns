/* ==========================================================================
   YOR Estate - Users & Role Management Module
   ========================================================================== */

function renderUsersPage() {
  const store = window.store;
  const users = store.data.users;

  return `
    <div class="head">
      <div>
        <h1>Users & role-based access control</h1>
        <p>Centralized authentication, role hierarchy management, permission matrix and security audit log.</p>
      </div>
      <div class="actions">
        <button class="btn dark gold-glow" onclick="window.userWizard.openSlidingPage()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          + Add User
        </button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Active platform users</span><b class="num">${users.length}</b><small class="muted">Across all roles</small></div>
      <div class="stat"><span>Administrative users</span><b class="num">26</b><small class="muted">Main / HO / Outlet</small></div>
      <div class="stat"><span>Sales team users</span><b class="num">92</b><small class="up">Outlet scoped</small></div>
      <div class="stat"><span>External portal users</span><b class="num">312</b><small class="up">Investor & agent accounts</small></div>
      <div class="stat"><span>Security alerts</span><b class="num">0</b><small class="up">No critical events</small></div>
    </div>

    <div class="grid-2">
      <!-- Left Column: User Directory Table -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>User directory</h3>
            <p>Role assignments, outlet scoping, and security administration</p>
          </div>
          <button class="btn sm gold" onclick="window.userWizard.openSlidingPage()">+ Add User</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role & Access</th>
                <th>Outlet Scope</th>
                <th>Status</th>
                <th class="r">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                const isAct = u.status === 'Active';
                const roleChipClass = u.role.includes('Super') ? 'dark' : 
                                      u.role.includes('Head') ? 'blue' : 
                                      u.role.includes('Outlet') ? 'gold' : 
                                      u.role.includes('Sales') ? 'green' : 
                                      u.role.includes('Finance') ? 'blue' : 
                                      u.role.includes('Legal') ? 'gold' : 'gray';
                const avatarSrc = u.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
                const initials = (u.name || 'User').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const locationStr = u.state ? `${u.state}, ${u.country || 'India'}` : (u.outlet || 'Central');
                const userKey = u.id || u.email;
                return `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${avatarSrc}" alt="${u.name}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--line-2);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="display: none; width: 36px; height: 36px; border-radius: 50%; background: #0F172A; color: #fff; font-size: 11px; font-weight: 700; align-items: center; justify-content: center;">${initials}</div>
                        <div>
                          <div style="font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 6px;">
                            ${u.name}
                            ${!isAct ? '<span class="chip red xs" style="font-size: 10px; padding: 1px 6px;">Deactivated</span>' : ''}
                          </div>
                          <div class="xs muted">${u.email} ${u.phone ? `· ${u.phone}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="chip ${roleChipClass} xs">${u.role}</span></td>
                    <td>
                      <div style="font-size: 12px; font-weight: 500;">${u.scope || u.outlet || 'Global'}</div>
                      <div class="xs muted">${locationStr}</div>
                    </td>
                    <td>
                      <span class="chip ${isAct ? 'green' : 'gray'} xs">${u.status || 'Active'}</span>
                    </td>
                    <td class="r">
                      <div class="user-row-actions">
                        <button type="button" class="btn-action-icon reset-pw" onclick="window.userWizard.openPasswordReset('${userKey}')" title="Reset user password">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                          Reset PW
                        </button>
                        <button type="button" class="btn-action-icon ${isAct ? 'deactivate' : 'activate'}" onclick="window.userWizard.toggleStatus('${userKey}')" title="${isAct ? 'Deactivate user' : 'Activate user'}">
                          ${isAct ? '✕ Deactivate' : '✓ Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Role Hierarchy & Security Controls -->
      <div class="stack">
        <div class="card">
          <div class="ch">
            <div>
              <h3>Role hierarchy breakdown</h3>
              <p>JWT role token validation</p>
            </div>
            <span class="chip dark xs">Enforced</span>
          </div>

          <div class="role-tree">
            <div class="role">
              <div>
                <strong>Main / Super Admin</strong>
                <small>Full administrative privileges across all modules</small>
              </div>
              <span class="chip dark xs">Level 1</span>
            </div>

            <div class="role level2">
              <div>
                <strong>Head Office Admin</strong>
                <small>Central oversight, compliance approval & legal sign-off</small>
              </div>
              <span class="chip blue xs">Level 2</span>
            </div>

            <div class="role level3">
              <div>
                <strong>Outlet Admin</strong>
                <small>Branch listings, local team and document uploads</small>
              </div>
              <span class="chip gold xs">Level 3</span>
            </div>

            <div class="role level3">
              <div>
                <strong>Sales & Finance Teams</strong>
                <small>Scoped to branch leads or cross-outlet ledger respectively</small>
              </div>
              <span class="chip green xs">Scoped</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="ch">
            <div>
              <h3>Security audit & compliance controls</h3>
              <p>Active platform security measures</p>
            </div>
            <span class="chip green xs">Active</span>
          </div>

          <div class="kpi-line"><span>JWT Token Expiry & Automatic Refresh</span><span class="chip green">Enabled</span></div>
          <div class="kpi-line"><span>Sensitive-Action Audit Logging</span><span class="chip green">Enabled</span></div>
          <div class="kpi-line"><span>Role-Change & Privilege Tracking</span><span class="chip green">Enabled</span></div>
          <div class="kpi-line"><span>Data Export & Download Audit</span><span class="chip green">Enabled</span></div>
        </div>
      </div>
    </div>
  `;
}
