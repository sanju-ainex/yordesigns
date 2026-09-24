/* ==========================================================================
   YOR Estate - Agents & Broker Network Module
   Clean, Minimal & Spacious Design
   ========================================================================== */

// Global Filter State for Agents Page
window._agentSearchQuery = window._agentSearchQuery || "";
window._agentOutletFilter = window._agentOutletFilter || "all";
window._agentStatusFilter = window._agentStatusFilter || "all";
window._agentViewMode = window._agentViewMode || "table"; // 'table' | 'grid'

window.agentsController = {
  onSearch(val) {
    window._agentSearchQuery = (val || "");
    const cursorPos = (document.getElementById('agentSearchInput')?.selectionStart) || val.length;
    this.refreshView();
    const input = document.getElementById('agentSearchInput');
    if (input) {
      input.focus();
      input.setSelectionRange(cursorPos, cursorPos);
    }
    const clearBtn = document.getElementById('agentSearchClearBtn');
    if (clearBtn) clearBtn.style.display = window._agentSearchQuery ? 'inline-flex' : 'none';
  },

  clearSearch() {
    window._agentSearchQuery = "";
    this.refreshView();
    const input = document.getElementById('agentSearchInput');
    if (input) {
      input.value = "";
      input.focus();
    }
    const clearBtn = document.getElementById('agentSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
  },

  onOutletFilter(val) {
    window._agentOutletFilter = val;
    this.refreshView();
  },

  onStatusFilter(val) {
    window._agentStatusFilter = val;
    this.refreshView();
  },

  setViewMode(mode) {
    window._agentViewMode = mode;
    this.refreshView();
  },

  clearAllFilters() {
    window._agentSearchQuery = "";
    window._agentOutletFilter = "all";
    window._agentStatusFilter = "all";
    this.refreshView();
  },

  toggleAgentStatus(agentId) {
    if (!window.store) return;
    const agent = window.store.toggleAgentStatus(agentId);
    if (agent) {
      window.modals.showToast(`Broker ${agent.name} status set to ${agent.status}`);
      this.refreshView();
    }
  },

  // Detailed Modal for Agent Profile, Connected Properties & Commissions
  openAgentDrawer(agentId) {
    const store = window.store;
    const agents = (store && store.data && store.data.agents) || [];
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const propsList = agent.propertiesConnected || [];
    const payoutsList = agent.recentPayouts || [];
    const assignedOutlets = Array.isArray(agent.outlets) && agent.outlets.length > 0 ? agent.outlets : [agent.outlet || 'All Outlets'];

    const contentHtml = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${agent.photo}" alt="${agent.name}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:1.5px solid var(--line-2);">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="margin:0; font-size:17px;">${agent.name}</h3>
              <span class="chip ${agent.status === 'Active' ? 'green' : 'gray'} xs">${agent.status}</span>
            </div>
            <div class="muted small" style="margin-top:2px;">
              <b>${agent.agency}</b> · RERA: <span class="font-mono">${agent.reraNo}</span>
            </div>
          </div>
        </div>
        <button class="modal-close" onclick="window.modals.close()">✕</button>
      </div>

      <div style="padding:16px 0; max-height:75vh; overflow-y:auto;">
        <!-- Multi-Outlet Hubs & Regional Coverage Banner -->
        <div style="background:rgba(191,151,62,0.06); border:1px solid rgba(191,151,62,0.22); border-radius:var(--r-sm); padding:10px 14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div class="xs muted" style="font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--accent);">
              Associated Outlets & Regional Coverage (Multi-Outlet Partner)
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
              ${assignedOutlets.map(out => `
                <span class="chip ${out === 'All Outlets' ? 'gold' : 'gray'} xs" style="font-weight:600;">🏢 ${out}</span>
              `).join('')}
            </div>
          </div>
          <div class="xs muted" style="text-align:right;">
            <span>Partner Tier: <b style="color:var(--accent)">${agent.tier || 'Gold'}</b></span><br>
            <span>Commission Split: <b>${agent.commissionRate || '2.5%'}</b></span>
          </div>
        </div>

        <!-- 4 Summary Stats -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:18px;">
          <div style="background:var(--card-2); border:1px solid var(--line); padding:10px 14px; border-radius:var(--r-sm);">
            <div class="xs muted">Connected Properties</div>
            <div style="font-size:17px; font-weight:700; color:var(--ink);">${propsList.length} Listings</div>
          </div>
          <div style="background:var(--card-2); border:1px solid var(--line); padding:10px 14px; border-radius:var(--r-sm);">
            <div class="xs muted">Deals Closed</div>
            <div style="font-size:17px; font-weight:700; color:var(--ink);">${agent.dealsClosed} (${agent.totalSalesVolume})</div>
          </div>
          <div style="background:var(--card-2); border:1px solid var(--line); padding:10px 14px; border-radius:var(--r-sm);">
            <div class="xs muted">Total Commission</div>
            <div style="font-size:17px; font-weight:700; color:var(--green);">${agent.totalCommissionEarned}</div>
          </div>
          <div style="background:var(--card-2); border:1px solid var(--line); padding:10px 14px; border-radius:var(--r-sm);">
            <div class="xs muted">Pending Balance</div>
            <div style="font-size:17px; font-weight:700; color:var(--amber);">${agent.commissionPending}</div>
          </div>
        </div>

        <!-- Section: Connected Properties -->
        <div style="margin-bottom:20px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <h4 style="margin:0; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; color:var(--ink);">
              Connected Properties (${propsList.length})
            </h4>
            <button class="btn sm gold" onclick="window.modals.close(); window.agentsController.openConnectPropertyModal('${agent.id}')">
              + Map Property
            </button>
          </div>

          ${propsList.length === 0 ? `
            <div class="muted small" style="padding:16px; background:var(--card-2); border-radius:var(--r-sm); text-align:center;">
              No properties connected to this broker yet.
            </div>
          ` : `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              ${propsList.map(p => `
                <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:12px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:600; font-size:13px; color:var(--ink);">${p.name}</div>
                    <div class="xs muted" style="margin-top:2px;">
                      Survey No: <b class="font-mono">${p.surveyNo}</b> · ${p.valuation || '₹10.0 Cr'}
                    </div>
                  </div>
                  <button class="btn-action-icon deactivate" style="padding:4px 8px; font-size:11px;" onclick="window.agentsController.unassignProperty('${agent.id}', '${p.id || p.surveyNo}')">
                    Unlink
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Section: Commission Payout Ledger -->
        <div style="margin-bottom:18px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <h4 style="margin:0; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; color:var(--ink);">
              Commission Payout History
            </h4>
            <button class="btn sm green" onclick="window.modals.close(); window.agentsController.openRecordPayoutModal('${agent.id}')">
              + Record Payout
            </button>
          </div>

          <div class="table-responsive" style="border:1px solid var(--line); border-radius:var(--r-sm);">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Property / Ref</th>
                  <th class="r">Amount</th>
                  <th class="r">Status</th>
                </tr>
              </thead>
              <tbody>
                ${payoutsList.length === 0 ? `
                  <tr><td colspan="5" class="c muted">No payouts recorded yet.</td></tr>
                ` : payoutsList.map(pay => `
                  <tr>
                    <td><b class="font-mono text-sm">${pay.id}</b></td>
                    <td><span class="xs muted">${pay.date}</span></td>
                    <td><b>${pay.property}</b></td>
                    <td class="r"><b class="num" style="color:var(--green)">${pay.amount}</b></td>
                    <td class="r"><span class="chip ${pay.status === 'Paid' ? 'green' : 'amber'} xs">${pay.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bank Details -->
        <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:12px; display:flex; justify-content:space-between; font-size:12px;">
          <div><span class="muted">Bank:</span> <b>${agent.bankDetails ? agent.bankDetails.bank : 'HDFC Bank'}</b></div>
          <div><span class="muted">Account:</span> <b class="font-mono">${agent.bankDetails ? agent.bankDetails.acc : '•••• 8821'}</b></div>
          <div><span class="muted">UPI:</span> <b class="font-mono">${agent.bankDetails ? agent.bankDetails.upi : 'agent@upi'}</b></div>
          <div><span class="muted">Phone:</span> <b>${agent.phone}</b></div>
        </div>
      </div>

      <div class="modal-foot" style="padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn sm" onclick="window.modals.close()">Close</button>
        <button class="btn sm dark" onclick="window.modals.close(); window.agentsController.openRecordPayoutModal('${agent.id}')">Release Payout</button>
      </div>
    `;

    window.modals.open(contentHtml, true);
  },

  // Onboard New Agent Modal with Multi-Outlet Support
  openOnboardAgentModal() {
    const store = window.store;
    const outlets = (store && store.data && store.data.outlets) || [];
    const properties = (store && store.data && store.data.properties) || [];

    const contentHtml = `
      <div class="modal-header">
        <div>
          <h3 style="margin:0;">+ Onboard Agent / Broker</h3>
          <p class="muted small" style="margin:2px 0 0 0;">Add a new external channel partner or multi-outlet broker.</p>
        </div>
        <button class="modal-close" onclick="window.modals.close()">✕</button>
      </div>

      <form id="onboardAgentForm" onsubmit="window.agentsController.handleOnboardSubmit(this); return false;" style="padding:16px 0;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="field">
            <label>Agent Name <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="name" placeholder="e.g. Rajesh Nair" required>
            </div>
          </div>

          <div class="field">
            <label>Agency / Brokerage <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="agency" placeholder="e.g. Prime Realty Partners" required>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="field">
            <label>Phone Number <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="tel" name="phone" placeholder="+91 98450 12345" required>
            </div>
          </div>

          <div class="field">
            <label>Commission Rate</label>
            <div class="input-wrap">
              <input type="text" name="commissionRate" value="2.5%" placeholder="2.5%">
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="field">
            <label>Email Address <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="email" name="email" placeholder="agent@brokerage.com" required>
            </div>
          </div>

          <div class="field">
            <label>RERA Registration Number</label>
            <div class="input-wrap">
              <input type="text" name="reraNo" placeholder="e.g. PRM/KA/RERA/1251/2026">
            </div>
          </div>
        </div>

        <!-- Multi-Outlet Hubs Selection (Brokers work across multiple outlets) -->
        <div class="field" style="margin-top:4px;">
          <label style="display:flex; justify-content:space-between; align-items:center;">
            <span>Associated Outlets & Regional Coverage <span class="req">*</span></span>
            <span class="xs muted">Select all branches broker operates with</span>
          </label>
          <div style="display:flex; flex-wrap:wrap; gap:8px; padding:10px; background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-xs);">
            <label style="display:flex; align-items:center; gap:6px; font-size:12.5px; cursor:pointer; margin-right:10px; font-weight:600; color:var(--accent);">
              <input type="checkbox" name="outlets" value="All Outlets" onchange="window.agentsController.toggleAllOutlets(this)"> 🌐 All Outlets (Pan-India)
            </label>
            ${outlets.map(o => `
              <label style="display:flex; align-items:center; gap:6px; font-size:12.5px; cursor:pointer; margin-right:8px;">
                <input type="checkbox" name="outlets" value="${o.name}" class="outlet-checkbox"> 🏢 ${o.name}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="field" style="margin-top:10px;">
          <label>Assign Initial Property (Optional)</label>
          <div class="select-wrap">
            <select name="initialProperty">
              <option value="">-- None --</option>
              ${properties.map(p => `<option value="${p.id}">${p.name} (Survey: ${p.surveyNo} · ${p.valuation})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="modal-foot" style="margin-top:16px; padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn" onclick="window.modals.close()">Cancel</button>
          <button type="submit" class="btn dark gold-glow">+ Onboard Broker</button>
        </div>
      </form>
    `;

    window.modals.open(contentHtml, false);
  },

  toggleAllOutlets(allCb) {
    const form = document.getElementById('onboardAgentForm');
    if (!form) return;
    const checkboxes = form.querySelectorAll('.outlet-checkbox');
    checkboxes.forEach(cb => {
      if (allCb.checked) {
        cb.checked = false;
        cb.disabled = true;
      } else {
        cb.disabled = false;
      }
    });
  },

  handleOnboardSubmit(formEl) {
    const fd = new FormData(formEl);
    const store = window.store;
    const properties = (store && store.data && store.data.properties) || [];

    const initialPropId = fd.get('initialProperty');
    let connectedProps = [];
    if (initialPropId) {
      const prop = properties.find(p => p.id === initialPropId);
      if (prop) {
        connectedProps.push({
          id: prop.id,
          name: prop.name,
          surveyNo: prop.surveyNo,
          valuation: prop.valuation,
          location: prop.location,
          state: prop.state,
          outlet: prop.outlet,
          type: prop.type
        });
      }
    }

    const selectedOutlets = fd.getAll('outlets');
    const assignedOutlets = selectedOutlets.length > 0 ? selectedOutlets : ['All Outlets'];

    const agentData = {
      name: fd.get('name'),
      agency: fd.get('agency'),
      type: 'Channel Partner',
      tier: 'Gold',
      commissionRate: fd.get('commissionRate') || '2.5%',
      reraNo: fd.get('reraNo') || 'RERA Registered Broker',
      email: fd.get('email'),
      phone: fd.get('phone'),
      outlets: assignedOutlets,
      city: 'Bengaluru',
      state: 'Karnataka',
      status: 'Active',
      propertiesConnected: connectedProps
    };

    const created = store.addAgent(agentData);
    window.modals.close();
    window.modals.showToast(`Broker ${created.name} onboarded across ${assignedOutlets.length} outlet(s)!`);
    this.refreshView();
  },

  // Connect Property Modal
  openConnectPropertyModal(agentId) {
    const store = window.store;
    const agents = (store && store.data && store.data.agents) || [];
    const properties = (store && store.data && store.data.properties) || [];
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const connectedIds = (agent.propertiesConnected || []).map(p => p.id || p.surveyNo);
    const availableProps = properties.filter(p => !connectedIds.includes(p.id) && !connectedIds.includes(p.surveyNo));

    const contentHtml = `
      <div class="modal-header">
        <div>
          <h3 style="margin:0;">Connect Property to ${agent.name}</h3>
          <p class="muted small" style="margin:2px 0 0 0;">Assign property listing to this broker.</p>
        </div>
        <button class="modal-close" onclick="window.modals.close()">✕</button>
      </div>

      <div style="padding:16px 0;">
        ${availableProps.length === 0 ? `
          <div class="muted small" style="padding:16px; background:var(--card-2); border-radius:var(--r-sm); text-align:center;">
            All existing properties are already connected to this broker.
          </div>
        ` : `
          <div class="field">
            <label>Select Property <span class="req">*</span></label>
            <div class="select-wrap">
              <select id="mapPropertySelect">
                ${availableProps.map(p => `
                  <option value="${p.id}">
                    ${p.name} (Survey: ${p.surveyNo} · ${p.valuation})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        `}
      </div>

      <div class="modal-foot" style="padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:10px;">
        <button type="button" class="btn" onclick="window.modals.close()">Cancel</button>
        ${availableProps.length > 0 ? `
          <button type="button" class="btn dark gold-glow" onclick="window.agentsController.handleConnectPropertySubmit('${agent.id}')">
            Confirm & Map
          </button>
        ` : ''}
      </div>
    `;

    window.modals.open(contentHtml, false);
  },

  handleConnectPropertySubmit(agentId) {
    const select = document.getElementById('mapPropertySelect');
    if (!select || !select.value) return;

    const store = window.store;
    const properties = (store && store.data && store.data.properties) || [];
    const prop = properties.find(p => p.id === select.value);
    if (!prop) return;

    const res = store.assignPropertyToAgent(agentId, prop);
    window.modals.close();
    if (res && res.success) {
      window.modals.showToast(`Property "${prop.name}" connected!`);
      this.refreshView();
    }
  },

  unassignProperty(agentId, propIdOrSurvey) {
    const store = window.store;
    const res = store.unassignPropertyFromAgent(agentId, propIdOrSurvey);
    if (res && res.success) {
      window.modals.showToast(`Property disconnected.`);
      this.refreshView();
      this.openAgentDrawer(agentId);
    }
  },

  // Record Payout Modal
  openRecordPayoutModal(agentId) {
    const store = window.store;
    const agents = (store && store.data && store.data.agents) || [];
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const contentHtml = `
      <div class="modal-header">
        <div>
          <h3 style="margin:0;">Release Commission Payout</h3>
          <p class="muted small" style="margin:2px 0 0 0;">Record payout settlement for <b>${agent.name}</b></p>
        </div>
        <button class="modal-close" onclick="window.modals.close()">✕</button>
      </div>

      <form id="recordPayoutForm" onsubmit="window.agentsController.handleRecordPayoutSubmit('${agent.id}', this); return false;" style="padding:16px 0;">
        <div class="field">
          <label>Payout Amount (₹) <span class="req">*</span></label>
          <div class="input-wrap">
            <input type="text" name="amount" placeholder="e.g. ₹2,00,000" required>
          </div>
          <div class="xs muted" style="margin-top:4px;">Pending balance: <b style="color:var(--amber)">${agent.commissionPending}</b></div>
        </div>

        <div class="field">
          <label>Payment Method</label>
          <div class="select-wrap">
            <select name="method">
              <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
              <option value="Instant UPI Settlement">Instant UPI Settlement</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div class="modal-foot" style="margin-top:16px; padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn" onclick="window.modals.close()">Cancel</button>
          <button type="submit" class="btn dark green-glow">Confirm Release</button>
        </div>
      </form>
    `;

    window.modals.open(contentHtml, false);
  },

  handleRecordPayoutSubmit(agentId, formEl) {
    const fd = new FormData(formEl);
    const store = window.store;
    const amount = fd.get('amount');
    const method = fd.get('method');

    const payout = store.recordAgentPayout(agentId, amount, "Commission Settlement", method);
    window.modals.close();
    if (payout) {
      window.modals.showToast(`Payout of ${payout.amount} recorded!`);
      this.refreshView();
    }
  },

  refreshView() {
    if (window.router && window.router.currentRoute === 'agents') {
      const container = document.getElementById('pageContent');
      if (container) {
        container.innerHTML = renderAgentsPage();
        window.router.bindPageInteractions('agents');
      }
    }
  }
};

// Main Page Renderer: Clean, Spacious, Uncongested
function renderAgentsPage() {
  const store = window.store;
  const agents = (store && store.data && store.data.agents) || [];
  const outlets = (store && store.data && store.data.outlets) || [];

  // Filter logic with Multi-Outlet support
  const q = (window._agentSearchQuery || "").toLowerCase();
  const outFilter = window._agentOutletFilter || "all";
  const statFilter = window._agentStatusFilter || "all";

  const filteredAgents = agents.filter(a => {
    const matchSearch = !q ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.agency && a.agency.toLowerCase().includes(q)) ||
      (a.outlet && a.outlet.toLowerCase().includes(q)) ||
      (Array.isArray(a.outlets) && a.outlets.some(o => o.toLowerCase().includes(q))) ||
      (a.phone && a.phone.toLowerCase().includes(q)) ||
      (Array.isArray(a.propertiesConnected) && a.propertiesConnected.some(p => p.name?.toLowerCase().includes(q) || p.surveyNo?.toLowerCase().includes(q)));

    const agentOutlets = Array.isArray(a.outlets) && a.outlets.length > 0 ? a.outlets : [a.outlet || 'All Outlets'];
    const matchOutlet = (outFilter === 'all') || 
      agentOutlets.includes('All Outlets') || 
      agentOutlets.includes(outFilter) || 
      (a.outlet === outFilter) ||
      (Array.isArray(a.propertiesConnected) && a.propertiesConnected.some(p => p.outlet === outFilter));

    const matchStatus = (statFilter === 'all') || (a.status === statFilter);

    return matchSearch && matchOutlet && matchStatus;
  });

  // Calculate high-level KPIs
  const activeCount = agents.filter(a => a.status === 'Active').length;
  let totalConnectedProps = 0;
  let totalDeals = 0;
  let totalCommissionsSum = 0;
  let totalPendingSum = 0;

  agents.forEach(a => {
    totalConnectedProps += (a.propertiesConnected || []).length;
    totalDeals += (a.dealsClosed || 0);
    totalCommissionsSum += (a.rawCommissionEarned || 0);
    totalPendingSum += (a.rawCommissionPending || 0);
  });

  const formattedEarned = `₹${(totalCommissionsSum / 10000000).toFixed(2)} Cr`;
  const formattedPending = `₹${(totalPendingSum / 100000).toFixed(2)} L`;

  return `
    <!-- Clean Header -->
    <div class="head">
      <div>
        <h1>Agents & Brokers Network</h1>
        <p>Manage external partners, non-exclusive multi-outlet coverage, connected property listings, and commissions.</p>
      </div>
      <div class="actions">
        <button class="btn dark gold-glow" onclick="window.agentsController.openOnboardAgentModal()">
          + Onboard Broker
        </button>
      </div>
    </div>

    <!-- 4 Clean KPI Cards -->
    <div class="stats" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat">
        <span>Active Brokers</span>
        <b class="num">${activeCount}</b>
        <small class="muted">${agents.length} enrolled</small>
      </div>
      <div class="stat">
        <span>Connected Properties</span>
        <b class="num">${totalConnectedProps}</b>
        <small class="up">Multi-hub listings</small>
      </div>
      <div class="stat">
        <span>Deals Closed</span>
        <b class="num">${totalDeals}</b>
        <small class="up">Completed sales</small>
      </div>
      <div class="stat">
        <span>Commissions Earned</span>
        <b class="num" style="color:var(--green)">${formattedEarned}</b>
        <small class="warn">${formattedPending} pending</small>
      </div>
    </div>

    <!-- Minimal Filter & Search Toolbar -->
    <div class="card" style="padding: 10px 14px; margin-bottom: 16px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:240px;">
          <div class="input-wrap" style="flex:1; position:relative;">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--ink-3);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              id="agentSearchInput"
              placeholder="Search agent, agency, outlet hub, survey no or phone..." 
              value="${window._agentSearchQuery || ''}"
              oninput="window.agentsController.onSearch(this.value)"
              style="padding-left:32px; height:34px; font-size:12.5px;"
            >
            <button 
              id="agentSearchClearBtn" 
              onclick="window.agentsController.clearSearch()"
              style="display:${window._agentSearchQuery ? 'inline-flex' : 'none'}; position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--ink-3);"
            >✕</button>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <!-- Outlet Filter -->
          <div class="select-wrap" style="width:145px;">
            <select onchange="window.agentsController.onOutletFilter(this.value)" style="height:34px; font-size:12px;">
              <option value="all" ${outFilter === 'all' ? 'selected' : ''}>All Outlets</option>
              ${outlets.map(o => `<option value="${o.name}" ${outFilter === o.name ? 'selected' : ''}>${o.name}</option>`).join('')}
            </select>
          </div>

          <!-- Status Filter -->
          <div class="select-wrap" style="width:120px;">
            <select onchange="window.agentsController.onStatusFilter(this.value)" style="height:34px; font-size:12px;">
              <option value="all" ${statFilter === 'all' ? 'selected' : ''}>All Status</option>
              <option value="Active" ${statFilter === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Suspended" ${statFilter === 'Suspended' ? 'selected' : ''}>Suspended</option>
            </select>
          </div>

          <!-- View Switcher -->
          <div style="display:flex; background:var(--card-2); padding:2px; border-radius:var(--r-xs); border:1px solid var(--line);">
            <button 
              class="btn sm ${window._agentViewMode === 'table' ? 'dark' : ''}" 
              onclick="window.agentsController.setViewMode('table')" 
              style="padding:4px 8px;"
              title="Table View"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button 
              class="btn sm ${window._agentViewMode === 'grid' ? 'dark' : ''}" 
              onclick="window.agentsController.setViewMode('grid')" 
              style="padding:4px 8px;"
              title="Cards View"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Full-Width Main Table -->
    ${filteredAgents.length === 0 ? `
      <div class="card" style="padding:40px 20px; text-align:center;">
        <p class="muted" style="margin-bottom:12px;">No brokers match your filter criteria.</p>
        <button class="btn sm gold" onclick="window.agentsController.clearAllFilters()">Reset Filters</button>
      </div>
    ` : window._agentViewMode === 'table' ? `
      <div class="card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Agent / Broker</th>
                <th>Associated Outlets</th>
                <th>Connected Properties</th>
                <th>Deals Closed</th>
                <th class="r">Commission Earned</th>
                <th>Status</th>
                <th class="r">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAgents.map(ag => {
                const props = ag.propertiesConnected || [];
                const outletsList = Array.isArray(ag.outlets) && ag.outlets.length > 0 ? ag.outlets : [ag.outlet || 'All Outlets'];
                const isAllOutlets = outletsList.includes('All Outlets') || ag.outlet?.includes('All Outlets');

                return `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${ag.photo}" alt="${ag.name}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1px solid var(--line-2);">
                        <div>
                          <div style="font-weight:600; color:var(--ink); font-size:13.5px;">${ag.name}</div>
                          <div class="xs muted">${ag.agency} · ${ag.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      ${isAllOutlets ? `
                        <span class="chip gold xs" title="Pan-India Partner (Works with all outlets)">🌐 All Outlets</span>
                      ` : outletsList.length > 1 ? `
                        <div style="display:flex; flex-wrap:wrap; gap:4px;" title="${outletsList.join(', ')}">
                          ${outletsList.slice(0, 2).map(o => `<span class="chip gray xs">${o.replace('YOR ', '')}</span>`).join('')}
                          ${outletsList.length > 2 ? `<span class="chip blue xs">+${outletsList.length - 2} hubs</span>` : ''}
                        </div>
                      ` : `
                        <span class="chip gray xs">${outletsList[0]}</span>
                      `}
                    </td>

                    <td>
                      <span class="chip ${props.length > 0 ? 'gold' : 'gray'} xs font-mono" style="font-weight:600;">
                        ${props.length} ${props.length === 1 ? 'Property' : 'Properties'}
                      </span>
                    </td>

                    <td>
                      <b class="num">${ag.dealsClosed}</b>
                      <span class="xs muted">(${ag.totalSalesVolume})</span>
                    </td>

                    <td class="r">
                      <b class="num" style="color:var(--green); font-size:13.5px;">${ag.totalCommissionEarned}</b>
                      <div class="xs" style="color:var(--amber); font-size:10.5px;">${ag.commissionPending} pending</div>
                    </td>

                    <td>
                      <span class="chip ${ag.status === 'Active' ? 'green' : 'gray'} xs">${ag.status}</span>
                    </td>

                    <td class="r">
                      <button 
                        type="button" 
                        class="btn sm" 
                        style="padding:4px 10px; font-size:11.5px;"
                        onclick="window.agentsController.openAgentDrawer('${ag.id}')"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <!-- Spacious Grid Cards View -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(310px, 1fr)); gap:14px;">
        ${filteredAgents.map(ag => {
          const props = ag.propertiesConnected || [];
          const outletsList = Array.isArray(ag.outlets) && ag.outlets.length > 0 ? ag.outlets : [ag.outlet || 'All Outlets'];
          const isAllOutlets = outletsList.includes('All Outlets') || ag.outlet?.includes('All Outlets');

          return `
            <div class="card" style="padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <img src="${ag.photo}" alt="${ag.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid var(--line-2);">
                  <div>
                    <div style="font-weight:600; font-size:14px; color:var(--ink);">${ag.name}</div>
                    <div class="xs muted">${ag.agency}</div>
                  </div>
                </div>
                <span class="chip ${ag.status === 'Active' ? 'green' : 'gray'} xs">${ag.status}</span>
              </div>

              <!-- Multi-Outlet Badges in Card -->
              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:10px;">
                ${isAllOutlets ? `
                  <span class="chip gold xs">🌐 All Outlets (Pan-India)</span>
                ` : outletsList.map(o => `
                  <span class="chip gray xs">🏢 ${o}</span>
                `).join('')}
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-xs); padding:10px; margin-bottom:12px;">
                <div>
                  <div class="xs muted">Connected</div>
                  <b style="font-size:13px; color:var(--ink);">${props.length} Properties</b>
                </div>
                <div>
                  <div class="xs muted">Deals Closed</div>
                  <b style="font-size:13px; color:var(--ink);">${ag.dealsClosed}</b>
                </div>
                <div>
                  <div class="xs muted">Commission</div>
                  <b style="font-size:13px; color:var(--green);">${ag.totalCommissionEarned}</b>
                </div>
                <div>
                  <div class="xs muted">Pending</div>
                  <b style="font-size:13px; color:var(--amber);">${ag.commissionPending}</b>
                </div>
              </div>

              <button 
                class="btn sm" 
                style="width:100%; justify-content:center; font-size:11.5px;"
                onclick="window.agentsController.openAgentDrawer('${ag.id}')"
              >
                View Details & Connected Properties
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}
