/* ==========================================================================
   YOR Estate - Sales CRM & Multi-Outlet Lead Management System
   ========================================================================== */

function renderSalesPage() {
  const store = window.store;
  const allLeads = store.data.leads || [];
  const outlets = store.data.outlets || [];
  
  // Active Filters & View Modes
  const selectedOutlet = window._salesOutletFilter || "all";
  const activeViewTab = window._salesViewTab || "kanban"; // "kanban" | "outlets" | "table"
  const searchQuery = (window._salesSearchQuery || "").toLowerCase();

  // Filter Leads by Outlet & Search
  let filteredLeads = allLeads.filter(lead => {
    const leadOutlet = lead.outlet || "YOR Central";
    const matchOutlet = (selectedOutlet === "all") || (leadOutlet === selectedOutlet);
    const matchSearch = !searchQuery || 
      (lead.name && lead.name.toLowerCase().includes(searchQuery)) ||
      (lead.property && lead.property.toLowerCase().includes(searchQuery)) ||
      (lead.assigned && lead.assigned.toLowerCase().includes(searchQuery)) ||
      (lead.phone && lead.phone.includes(searchQuery));
    return matchOutlet && matchSearch;
  });

  // KPI Calculations based on filtered leads
  const newLeadsCount = filteredLeads.filter(l => l.stage === 'New').length;
  const followUpCount = filteredLeads.filter(l => l.stage === 'Followed Up').length;
  const negCount = filteredLeads.filter(l => l.stage === 'Negotiation').length;
  const convertedCount = filteredLeads.filter(l => l.stage === 'Converted').length;
  const droppedCount = filteredLeads.filter(l => l.stage === 'Dropped').length;

  // Pipeline total value calculation
  const totalPipelineValueCr = filteredLeads.reduce((acc, l) => {
    const val = l.rawBudget || parseFloat(String(l.budget || '0').replace(/[^0-9.]/g, '')) || 0;
    return acc + val;
  }, 0).toFixed(1);

  // 5 Pipeline Stages
  const stages = [
    { key: "New", name: "New Inbound", color: "blue", count: newLeadsCount, items: filteredLeads.filter(l => l.stage === 'New') },
    { key: "Followed Up", name: "Contacted & Visit", color: "gold", count: followUpCount, items: filteredLeads.filter(l => l.stage === 'Followed Up') },
    { key: "Negotiation", name: "Negotiation & Token", color: "amber", count: negCount, items: filteredLeads.filter(l => l.stage === 'Negotiation') },
    { key: "Converted", name: "Won & Registered", color: "green", count: convertedCount, items: filteredLeads.filter(l => l.stage === 'Converted') },
    { key: "Dropped", name: "Dropped / Inactive", color: "gray", count: droppedCount, items: filteredLeads.filter(l => l.stage === 'Dropped') }
  ];

  // Group Leads by Outlet
  const outletGroups = outlets.map(o => {
    const outletLeads = allLeads.filter(l => (l.outlet || 'YOR Central') === o.name);
    const outletVal = outletLeads.reduce((acc, l) => acc + (l.rawBudget || parseFloat(String(l.budget || '0').replace(/[^0-9.]/g, '')) || 0), 0).toFixed(1);
    return {
      outlet: o,
      leads: outletLeads,
      totalVal: outletVal,
      activeCount: outletLeads.filter(l => l.stage !== 'Dropped').length,
      wonCount: outletLeads.filter(l => l.stage === 'Converted').length
    };
  });

  return `
    <div class="sales-crm-shell">
      
      <!-- Top Title & Global Controls Header -->
      <div class="sales-top-control-bar">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="chip gold xs font-mono">Lead Intelligence CRM</span>
            <span class="muted xs">/</span>
            <span class="xs muted">Territorial Outlet Governance</span>
          </div>
          <h1 style="font-size:24px; font-weight:700; color:var(--ink); margin:0;">Sales CRM & Lead Management System</h1>
          <p style="font-size:13px; color:var(--ink-2); margin:3px 0 0 0;">Omnichannel buyer acquisition, branch territory mapping, Kanban drag & drop progression, and scheduled task follow-ups.</p>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <!-- Outlet Filter Dropdown for Super Admin & Multi-Branch Oversight -->
          <div class="sales-outlet-filter-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A24E" stroke-width="2"><path d="M4 22h16"/><path d="M4 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18"/><path d="M12 22V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"/></svg>
            <select id="salesOutletFilterSelect" onchange="window.salesCRM.setOutletFilter(this.value)">
              <option value="all" ${selectedOutlet === 'all' ? 'selected' : ''}>🌐 All Outlets (Global Portfolio)</option>
              ${outlets.map(o => `
                <option value="${o.name}" ${selectedOutlet === o.name ? 'selected' : ''}>📍 ${o.name} (${o.location || 'Branch'})</option>
              `).join('')}
            </select>
          </div>

          <button class="btn" onclick="window.modals.openExportReport()" title="Export Sales Register">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>

          <button class="btn dark gold-glow" onclick="window.salesCRM.onAddLeadClick()" style="display:inline-flex; align-items:center; gap:6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + Add Lead
          </button>
        </div>
      </div>

      <!-- 5-Metric KPI Row (Live Filtered by Outlet) -->
      <div class="sales-stats-row">
        <div class="sales-kpi-tile kpi-blue">
          <span class="sales-kpi-label">Active Pipeline</span>
          <div class="sales-kpi-value">₹ ${totalPipelineValueCr} Cr</div>
          <span class="sales-kpi-sub">${filteredLeads.length} total active prospects</span>
        </div>
        <div class="sales-kpi-tile kpi-gold">
          <span class="sales-kpi-label">New Inbound</span>
          <div class="sales-kpi-value">${newLeadsCount} Leads</div>
          <span class="sales-kpi-sub">↑ Needs first outreach</span>
        </div>
        <div class="sales-kpi-tile kpi-amber">
          <span class="sales-kpi-label">Contacted & Visits</span>
          <div class="sales-kpi-value">${followUpCount} Active</div>
          <span class="sales-kpi-sub">Site walkthroughs booked</span>
        </div>
        <div class="sales-kpi-tile kpi-green">
          <span class="sales-kpi-label">Negotiation & Token</span>
          <div class="sales-kpi-value">${negCount} Deals</div>
          <span class="sales-kpi-sub">High closing intent</span>
        </div>
        <div class="sales-kpi-tile kpi-gray">
          <span class="sales-kpi-label">Won & Registered</span>
          <div class="sales-kpi-value">${convertedCount} Closed</div>
          <span class="sales-kpi-sub">100% Commission ready</span>
        </div>
      </div>

      <!-- Main CRM View Tabs & Search Filter Bar -->
      <div class="sales-tabs-card">
        <div class="sales-tabs-toolbar">
          
          <!-- View Mode Switcher: Pipeline Kanban | Grouped by Outlet | Table Register -->
          <div class="sales-seg-nav" id="salesViewTabs">
            <button class="sales-seg-btn ${activeViewTab === 'kanban' ? 'on' : ''}" onclick="window.salesCRM.setViewTab('kanban')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="10" rx="1"/></svg>
              Pipeline Kanban
            </button>
            <button class="sales-seg-btn ${activeViewTab === 'outlets' ? 'on' : ''}" onclick="window.salesCRM.setViewTab('outlets')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16"/><path d="M4 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18"/><path d="M12 22V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"/></svg>
              Grouped by Outlet (${outletGroups.length})
            </button>
            <button class="sales-seg-btn ${activeViewTab === 'table' ? 'on' : ''}" onclick="window.salesCRM.setViewTab('table')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Lead Register Table (${filteredLeads.length})
            </button>
          </div>

          <!-- Search Bar -->
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="sales-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="salesSearchInput" value="${searchQuery}" placeholder="Search client, property, agent..." oninput="window.salesCRM.onSearch(this.value)">
              ${searchQuery ? `<button onclick="window.salesCRM.clearSearch()" style="border:none; background:transparent; cursor:pointer; font-size:12px; color:var(--ink-3);">✕</button>` : ''}
            </div>
            <button class="btn sm gold" onclick="window.salesCRM.onAddLeadClick()">
              + Log Lead
            </button>
          </div>

        </div>
      </div>

      <!-- DYNAMIC CONTENT CONTAINER (SWITCHES VIEWS INSTANTLY WITHOUT SCROLL JUMP) -->
      <div id="salesDynamicContent">
        ${renderSalesActiveViewHtml(activeViewTab, filteredLeads, stages, outletGroups, selectedOutlet)}
      </div>

      <!-- Follow-Up Activity & Scheduled Reminders Grid -->
      <div class="grid-2" style="margin-top:4px;">
        <div class="card" style="padding:20px;">
          <div class="ch" style="margin-bottom:14px;">
            <div>
              <h3 style="font-size:16px; font-weight:700;">Scheduled Follow-Up Reminders & Action Queue</h3>
              <p style="font-size:12.5px; color:var(--ink-2);">Immediate priority actions for site visits, calls, and deed reviews</p>
            </div>
            <span class="chip red xs">${filteredLeads.filter(l => l.nextTask && !l.nextTask.done).length} Pending</span>
          </div>

          <ul class="queue" style="display:flex; flex-direction:column; gap:10px;">
            ${filteredLeads.filter(l => l.nextTask).slice(0, 5).map(lead => `
              <li style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <input type="checkbox" ${lead.nextTask.done ? 'checked' : ''} onchange="window.salesCRM.toggleTask('${lead.id}')" style="accent-color:#16A34A; width:16px; height:16px; cursor:pointer;" title="Mark Task as Done">
                  <div>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <b style="font-size:13px; color:var(--ink); ${lead.nextTask.done ? 'text-decoration:line-through; color:var(--ink-3);' : ''}">${lead.name}</b>
                      <span class="kanban-card-outlet-badge">📍 ${lead.outlet || 'YOR Central'}</span>
                    </div>
                    <span style="font-size:11.5px; color:var(--ink-2); display:block; margin-top:2px;">
                      ${lead.nextTask.title} · <b style="color:#C9A24E;">${lead.nextTask.due}</b>
                    </span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="crm-btn-group">
                    <button class="crm-icon-btn note-btn" onclick="window.salesCRM.openNotesModal('${lead.id}')" data-tooltip="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" title="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" aria-label="Notes">
                      ${lead.notes ? '<span class="has-indicator-dot"></span>' : ''}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </button>
                    <button class="crm-icon-btn task-btn" onclick="window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" title="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" aria-label="Task">
                      ${lead.nextTask ? '<span class="has-indicator-dot"></span>' : ''}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                    </button>
                  </div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card" style="padding:20px;">
          <div class="ch" style="margin-bottom:14px;">
            <div>
              <h3 style="font-size:16px; font-weight:700;">Branch Territory Pipeline Distribution</h3>
              <p style="font-size:12.5px; color:var(--ink-2);">Real-time opportunity volume across regional outlet networks</p>
            </div>
            <span class="chip gold xs">Live Ledger</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            ${outletGroups.map(og => `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:34px; height:34px; border-radius:8px; background:linear-gradient(135deg, #1E293B 0%, #0F172A 100%); color:#C9A24E; display:grid; place-items:center; font-weight:700; font-size:12.5px;">
                    ${og.outlet.name.split(' ')[1]?.[0] || 'O'}
                  </div>
                  <div>
                    <b style="font-size:13px; color:var(--ink);">📍 ${og.outlet.name}</b>
                    <span style="display:block; font-size:11.5px; color:var(--ink-2);">${og.leads.length} leads assigned · ${og.wonCount} closed</span>
                  </div>
                </div>
                <div style="text-align:right;">
                  <b class="num" style="font-size:13.5px; color:var(--ink);">₹ ${og.totalVal} Cr</b>
                  <span class="xs up" style="display:block; font-weight:600;">${og.activeCount} active in pipe</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
}

// Sub-Renderer for the 3 Dynamic Views
function renderSalesActiveViewHtml(activeViewTab, filteredLeads, stages, outletGroups, selectedOutlet) {
  
  // VIEW 1: PIPELINE KANBAN BOARD WITH NATIVE HTML5 DRAG AND DROP
  if (activeViewTab === 'kanban') {
    return `
      <div class="kanban-board-wrapper">
        <div class="ch" style="margin-bottom: 16px;">
          <div>
            <h3 style="font-size:16px; font-weight:700; color:var(--ink);">Opportunity Pipeline Kanban (Drag & Drop Active)</h3>
            <p style="font-size:12.5px; color:var(--ink-2);">Drag and drop prospect cards between columns to transition sales stages, or click 'Advance' for confirmed step forward.</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="xs muted">Territory: <b>${selectedOutlet === 'all' ? 'All Outlets' : selectedOutlet}</b></span>
            <span class="chip gold xs font-mono">⚡ HTML5 Drag & Drop</span>
          </div>
        </div>

        <div class="kanban-board-grid">
          ${stages.map(stage => {
            const stageVal = stage.items.reduce((acc, l) => acc + (l.rawBudget || parseFloat(String(l.budget || '0').replace(/[^0-9.]/g, '')) || 0), 0).toFixed(1);
            return `
              <div class="kanban-stage-col" data-stage="${stage.key}" 
                ondragover="window.salesCRM.onStageDragOver(event)" 
                ondragleave="window.salesCRM.onStageDragLeave(event)" 
                ondrop="window.salesCRM.onStageDrop(event, '${stage.key}')">
                
                <div class="kanban-stage-header">
                  <div class="kanban-stage-title-wrap">
                    <span class="chip ${stage.color} xs">${stage.count}</span>
                    <h4 class="kanban-stage-title">${stage.name}</h4>
                  </div>
                  <span class="kanban-stage-total-val">₹ ${stageVal} Cr</span>
                </div>

                <div class="kanban-cards-stack">
                  ${stage.items.length === 0 ? `
                    <div class="kanban-empty-dropzone">
                      Drag leads here to move to ${stage.name}
                    </div>
                  ` : stage.items.map(lead => `
                    <div class="kanban-lead-card" id="leadCard_${lead.id}" draggable="true"
                      ondragstart="window.salesCRM.onLeadDragStart(event, '${lead.id}')"
                      ondragend="window.salesCRM.onLeadDragEnd(event)">
                      
                      <div class="kanban-card-top-row">
                        <span class="kanban-card-name">${lead.name}</span>
                        <span class="chip ${lead.priority === 'High' ? 'red' : lead.priority === 'Medium' ? 'gold' : 'gray'} xs">${lead.priority || 'Medium'}</span>
                      </div>

                      <div class="kanban-card-property" title="${lead.property || 'Luxury Villa'}">
                        ${lead.property || 'The Imperial Azure Sky Penthouse'}
                      </div>

                      <div class="kanban-card-val-outlet">
                        <span class="kanban-card-budget">${lead.budget || '₹ 2.5 Cr'}</span>
                        <span class="kanban-card-outlet-badge">📍 ${lead.outlet || 'YOR Central'}</span>
                      </div>

                      <!-- Next Task Preview & Interactive Checkbox -->
                      ${lead.nextTask ? `
                        <div class="kanban-card-task-box ${lead.nextTask.done ? 'done' : ''}" onclick="event.stopPropagation(); window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Task: ${lead.nextTask.title} (${lead.nextTask.due})" title="Task: ${lead.nextTask.title} (${lead.nextTask.due})">
                          <div class="kanban-card-task-left">
                            <input type="checkbox" ${lead.nextTask.done ? 'checked' : ''} onclick="event.stopPropagation(); window.salesCRM.toggleTask('${lead.id}')">
                            <span class="kanban-card-task-title ${lead.nextTask.done ? 'crossed' : ''}">${lead.nextTask.title}</span>
                          </div>
                          <span class="xs muted font-mono" style="font-size:9.5px;">${lead.nextTask.due.split(',')[0]}</span>
                        </div>
                      ` : ''}

                      <!-- Footer Agent & Icon-Only Action Buttons with Tooltips -->
                      <div class="kanban-card-footer">
                        <span class="kanban-card-agent-tag">
                          <span style="width:18px; height:18px; border-radius:50%; background:#E2E8F0; font-size:9.5px; font-weight:700; display:grid; place-items:center; color:#334155;">
                            ${(lead.assigned || 'SC').split(' ')[0][0]}${(lead.assigned || 'SC').split(' ')[1] ? (lead.assigned || 'SC').split(' ')[1][0] : ''}
                          </span>
                          ${(lead.assigned || 'Sarah Coleman').split(' ')[0]}
                        </span>
                        
                        <div class="crm-btn-group">
                          <!-- Notes Icon Button -->
                          <button class="crm-icon-btn note-btn" onclick="window.salesCRM.openNotesModal('${lead.id}')" data-tooltip="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" title="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" aria-label="Notes">
                            ${lead.notes ? '<span class="has-indicator-dot"></span>' : ''}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                          </button>

                          <!-- Task Icon Button -->
                          <button class="crm-icon-btn task-btn" onclick="window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" title="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" aria-label="Task">
                            ${lead.nextTask ? '<span class="has-indicator-dot"></span>' : ''}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                              <path d="m9 16 2 2 4-4"></path>
                            </svg>
                          </button>

                          <!-- Advance Stage Icon Button -->
                          <button class="crm-icon-btn advance-btn" data-tooltip-pos="left" onclick="window.salesCRM.promptAdvanceLeadStage('${lead.id}', '${lead.stage}')" data-tooltip="Advance Stage" title="Advance Stage" aria-label="Advance">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  `).join('')}
                </div>

              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // VIEW 2: GROUPED UNDER OUTLET VIEW
  if (activeViewTab === 'outlets') {
    return `
      <div class="outlet-grouped-crm-container" style="display:flex; flex-direction:column; gap:20px;">
        ${outletGroups.map(og => `
          <div class="outlet-group-card">
            <div class="outlet-group-header">
              <div class="outlet-group-brand">
                <div class="outlet-group-icon">
                  ${og.outlet.name.split(' ')[1]?.[0] || 'O'}
                </div>
                <div class="outlet-group-meta">
                  <h3>📍 ${og.outlet.name}</h3>
                  <p>Location: <b>${og.outlet.location || 'Regional Territory'}</b> · Branch Lead: <b>${og.outlet.admin || 'Branch Director'}</b></p>
                </div>
              </div>

              <div class="outlet-group-stats-right">
                <div class="outlet-group-stat-pill">
                  <span class="outlet-group-stat-label">Branch Pipeline</span>
                  <div class="outlet-group-stat-val">₹ ${og.totalVal} Cr</div>
                </div>
                <div class="outlet-group-stat-pill">
                  <span class="outlet-group-stat-label">Mapped Leads</span>
                  <div class="outlet-group-stat-val" style="color:#C9A24E;">${og.leads.length} Leads</div>
                </div>
                <!-- Add Lead Pre-scoped to this Outlet -->
                <button class="btn sm gold" onclick="window.leadWizard.openSlidingPage('${og.outlet.name}')" title="Add new lead directly under ${og.outlet.name}">
                  + Add Lead to ${og.outlet.name}
                </button>
              </div>
            </div>

            <!-- Leads under this Outlet Table -->
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr style="background:#F8FAFC;">
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3);">Client & Phone</th>
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3);">Interested Property</th>
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3);">Budget</th>
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3);">Sales Stage</th>
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3);">Assigned Agent</th>
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3);">Next Scheduled Task</th>
                    <th style="font-size:11px; text-transform:uppercase; color:var(--ink-3); text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${og.leads.length === 0 ? `
                    <tr>
                      <td colspan="7" style="text-align:center; padding:28px; color:var(--ink-3); font-size:13px;">
                        No leads currently mapped under this branch. Click <b>"+ Add Lead to ${og.outlet.name}"</b> above to assign one.
                      </td>
                    </tr>
                  ` : og.leads.map(lead => `
                    <tr>
                      <td>
                        <b style="display:block; font-size:13px; color:var(--ink);">${lead.name}</b>
                        <span class="font-mono xs muted">${lead.phone}</span>
                      </td>
                      <td>
                        <span style="font-size:12.5px; color:var(--ink); font-weight:500;">${lead.property || 'Luxury Penthouse'}</span>
                        <small style="display:block; font-size:10.5px; color:var(--ink-3);">${lead.source || 'Direct'}</small>
                      </td>
                      <td><b class="num" style="font-size:13px; color:#0F172A;">${lead.budget || '₹ 2.5 Cr'}</b></td>
                      <td>
                        <select onchange="window.store.updateLeadStage('${lead.id}', this.value); window.modals.showToast('Lead stage updated to ' + this.value); window.salesCRM.refreshViews();"
                          style="font-size:11.5px; font-weight:600; padding:4px 8px; border:1px solid #CBD5E1; border-radius:6px; background:#FFFFFF; cursor:pointer;">
                          <option value="New" ${lead.stage === 'New' ? 'selected' : ''}>New</option>
                          <option value="Followed Up" ${lead.stage === 'Followed Up' ? 'selected' : ''}>Followed Up</option>
                          <option value="Negotiation" ${lead.stage === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
                          <option value="Converted" ${lead.stage === 'Converted' ? 'selected' : ''}>Converted</option>
                          <option value="Dropped" ${lead.stage === 'Dropped' ? 'selected' : ''}>Dropped</option>
                        </select>
                      </td>
                      <td>
                        <span style="font-size:12px; font-weight:500;">${lead.assigned || 'Sarah Coleman'}</span>
                      </td>
                      <td>
                        ${lead.nextTask ? `
                          <div style="display:flex; align-items:center; gap:6px;">
                            <input type="checkbox" ${lead.nextTask.done ? 'checked' : ''} onchange="window.salesCRM.toggleTask('${lead.id}')" style="accent-color:#16A34A; cursor:pointer;" data-tooltip="Mark Task Done" title="Mark Task Done">
                            <span style="font-size:12px; ${lead.nextTask.done ? 'text-decoration:line-through; color:var(--ink-3);' : 'color:var(--ink);'}">${lead.nextTask.title}</span>
                          </div>
                        ` : `<button class="crm-icon-btn task-btn" onclick="window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Schedule Task" title="Schedule Task" aria-label="Task"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>`}
                      </td>
                      <td style="text-align:right;">
                        <div class="crm-btn-group" style="justify-content:flex-end;">
                          <!-- Notes Icon Button -->
                          <button class="crm-icon-btn note-btn" onclick="window.salesCRM.openNotesModal('${lead.id}')" data-tooltip="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" title="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" aria-label="Notes">
                            ${lead.notes ? '<span class="has-indicator-dot"></span>' : ''}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                          </button>

                          <!-- Task Icon Button -->
                          <button class="crm-icon-btn task-btn" onclick="window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" title="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" aria-label="Task">
                            ${lead.nextTask ? '<span class="has-indicator-dot"></span>' : ''}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                              <path d="m9 16 2 2 4-4"></path>
                            </svg>
                          </button>

                          <!-- Advance Stage Icon Button -->
                          <button class="crm-icon-btn advance-btn" onclick="window.salesCRM.promptAdvanceLeadStage('${lead.id}', '${lead.stage}')" data-tooltip="Advance Stage" title="Advance Stage" aria-label="Advance">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>

                          <!-- Delete Lead Icon Button -->
                          <button class="crm-icon-btn delete-btn" data-tooltip-pos="left" onclick="window.salesCRM.deleteLead('${lead.id}')" data-tooltip="Delete Lead" title="Delete Lead" aria-label="Delete">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // VIEW 3: FULL MASTER REGISTER TABLE
  if (activeViewTab === 'table') {
    return `
      <div class="card" style="padding:20px;">
        <div class="ch" style="margin-bottom:16px;">
          <div>
            <h3 style="font-size:16px; font-weight:700;">Complete Master Lead Register</h3>
            <p style="font-size:12.5px; color:var(--ink-2);">Centralized omnichannel prospect ledger with branch assignment and scheduled task records</p>
          </div>
          <span class="xs muted">Showing <b>${filteredLeads.length}</b> records</span>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr style="background:#F8FAFC;">
                <th>Lead & Contact</th>
                <th>Branch Outlet</th>
                <th>Target Listing</th>
                <th>Budget</th>
                <th>Priority</th>
                <th>Sales Stage</th>
                <th>Assigned Agent</th>
                <th>Next Scheduled Task</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLeads.map(lead => `
                <tr>
                  <td>
                    <b style="display:block; font-size:13px; color:var(--ink);">${lead.name}</b>
                    <span class="font-mono xs muted">${lead.phone} · ${lead.email || ''}</span>
                  </td>
                  <td>
                    <span class="kanban-card-outlet-badge">📍 ${lead.outlet || 'YOR Central'}</span>
                  </td>
                  <td>
                    <span style="font-size:12.5px; color:var(--ink);">${lead.property || 'The Imperial Azure Sky Penthouse'}</span>
                  </td>
                  <td><b class="num" style="font-size:13px; color:#0F172A;">${lead.budget || '₹ 2.5 Cr'}</b></td>
                  <td>
                    <span class="chip ${lead.priority === 'High' ? 'red' : lead.priority === 'Medium' ? 'gold' : 'gray'} xs">${lead.priority || 'Medium'}</span>
                  </td>
                  <td>
                    <select onchange="window.store.updateLeadStage('${lead.id}', this.value); window.modals.showToast('Lead stage updated to ' + this.value); window.salesCRM.refreshViews();" 
                      style="font-size:11.5px; font-weight:600; padding:4px 8px; border:1px solid #CBD5E1; border-radius:6px; background:#FFFFFF; cursor:pointer;">
                      <option value="New" ${lead.stage === 'New' ? 'selected' : ''}>New</option>
                      <option value="Followed Up" ${lead.stage === 'Followed Up' ? 'selected' : ''}>Followed Up</option>
                      <option value="Negotiation" ${lead.stage === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
                      <option value="Converted" ${lead.stage === 'Converted' ? 'selected' : ''}>Converted</option>
                      <option value="Dropped" ${lead.stage === 'Dropped' ? 'selected' : ''}>Dropped</option>
                    </select>
                  </td>
                  <td>
                    <span style="font-size:12px; font-weight:500;">${lead.assigned || 'Sarah Coleman'}</span>
                  </td>
                  <td>
                    ${lead.nextTask ? `
                      <div style="display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${lead.nextTask.done ? 'checked' : ''} onchange="window.salesCRM.toggleTask('${lead.id}')" style="accent-color:#16A34A; cursor:pointer;" data-tooltip="Mark Task Done" title="Mark Task Done">
                        <span style="font-size:11.5px; ${lead.nextTask.done ? 'text-decoration:line-through; color:var(--ink-3);' : ''}">${lead.nextTask.title}</span>
                      </div>
                    ` : `<button class="crm-icon-btn task-btn" onclick="window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Schedule Task" title="Schedule Task" aria-label="Task"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>`}
                  </td>
                  <td style="text-align:right;">
                    <div class="crm-btn-group" style="justify-content:flex-end;">
                      <!-- Notes Icon Button -->
                      <button class="crm-icon-btn note-btn" onclick="window.salesCRM.openNotesModal('${lead.id}')" data-tooltip="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" title="${lead.notes ? 'Notes: Logged notes available' : 'Notes: Add note'}" aria-label="Notes">
                        ${lead.notes ? '<span class="has-indicator-dot"></span>' : ''}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                      </button>

                      <!-- Task Icon Button -->
                      <button class="crm-icon-btn task-btn" onclick="window.salesCRM.openQuickTaskModal('${lead.id}')" data-tooltip="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" title="Task: ${lead.nextTask ? lead.nextTask.title : 'Schedule task'}" aria-label="Task">
                        ${lead.nextTask ? '<span class="has-indicator-dot"></span>' : ''}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                          <path d="m9 16 2 2 4-4"></path>
                        </svg>
                      </button>

                      <!-- Advance Stage Icon Button -->
                      <button class="crm-icon-btn advance-btn" onclick="window.salesCRM.promptAdvanceLeadStage('${lead.id}', '${lead.stage}')" data-tooltip="Advance Stage" title="Advance Stage" aria-label="Advance">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>

                      <!-- Delete Lead Icon Button -->
                      <button class="crm-icon-btn delete-btn" data-tooltip-pos="left" onclick="window.salesCRM.deleteLead('${lead.id}')" data-tooltip="Delete Lead" title="Delete Lead" aria-label="Delete">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return '';
}

// Global Sales CRM Interactive Controller
window.salesCRM = {
  
  onAddLeadClick() {
    const currentOutlet = window._salesOutletFilter !== 'all' ? window._salesOutletFilter : null;
    if (window.leadWizard && window.leadWizard.openSlidingPage) {
      window.leadWizard.openSlidingPage(currentOutlet);
    }
  },

  setOutletFilter(outlet) {
    window._salesOutletFilter = outlet;
    this.refreshViews();
    if (window.modals && window.modals.showToast) {
      window.modals.showToast(outlet === 'all' ? 'Showing leads across all outlets' : `Filtered to ${outlet} leads`);
    }
  },

  setViewTab(tab) {
    window._salesViewTab = tab;
    
    // Update button visual state in the tab bar immediately
    const tabButtons = document.querySelectorAll('.sales-seg-btn');
    tabButtons.forEach(btn => {
      const match = btn.textContent.toLowerCase().includes(tab);
      btn.classList.toggle('on', match);
    });

    // Update dynamic content without full page reload or scroll jump
    const container = document.getElementById('salesDynamicContent');
    if (container) {
      const store = window.store;
      const allLeads = store.data.leads || [];
      const outlets = store.data.outlets || [];
      const selectedOutlet = window._salesOutletFilter || "all";
      const searchQuery = (window._salesSearchQuery || "").toLowerCase();

      const filteredLeads = allLeads.filter(lead => {
        const leadOutlet = lead.outlet || "YOR Central";
        const matchOutlet = (selectedOutlet === "all") || (leadOutlet === selectedOutlet);
        const matchSearch = !searchQuery || 
          (lead.name && lead.name.toLowerCase().includes(searchQuery)) ||
          (lead.property && lead.property.toLowerCase().includes(searchQuery)) ||
          (lead.assigned && lead.assigned.toLowerCase().includes(searchQuery)) ||
          (lead.phone && lead.phone.includes(searchQuery));
        return matchOutlet && matchSearch;
      });

      const newLeadsCount = filteredLeads.filter(l => l.stage === 'New').length;
      const followUpCount = filteredLeads.filter(l => l.stage === 'Followed Up').length;
      const negCount = filteredLeads.filter(l => l.stage === 'Negotiation').length;
      const convertedCount = filteredLeads.filter(l => l.stage === 'Converted').length;
      const droppedCount = filteredLeads.filter(l => l.stage === 'Dropped').length;

      const stages = [
        { key: "New", name: "New Inbound", color: "blue", count: newLeadsCount, items: filteredLeads.filter(l => l.stage === 'New') },
        { key: "Followed Up", name: "Contacted & Visit", color: "gold", count: followUpCount, items: filteredLeads.filter(l => l.stage === 'Followed Up') },
        { key: "Negotiation", name: "Negotiation & Token", color: "amber", count: negCount, items: filteredLeads.filter(l => l.stage === 'Negotiation') },
        { key: "Converted", name: "Won & Registered", color: "green", count: convertedCount, items: filteredLeads.filter(l => l.stage === 'Converted') },
        { key: "Dropped", name: "Dropped / Inactive", color: "gray", count: droppedCount, items: filteredLeads.filter(l => l.stage === 'Dropped') }
      ];

      const outletGroups = outlets.map(o => {
        const outletLeads = allLeads.filter(l => (l.outlet || 'YOR Central') === o.name);
        const outletVal = outletLeads.reduce((acc, l) => acc + (l.rawBudget || parseFloat(String(l.budget || '0').replace(/[^0-9.]/g, '')) || 0), 0).toFixed(1);
        return {
          outlet: o,
          leads: outletLeads,
          totalVal: outletVal,
          activeCount: outletLeads.filter(l => l.stage !== 'Dropped').length,
          wonCount: outletLeads.filter(l => l.stage === 'Converted').length
        };
      });

      container.innerHTML = renderSalesActiveViewHtml(tab, filteredLeads, stages, outletGroups, selectedOutlet);
    }
  },

  onSearch(query) {
    window._salesSearchQuery = query;
    this.refreshViews();
  },

  clearSearch() {
    window._salesSearchQuery = '';
    const input = document.getElementById('salesSearchInput');
    if (input) input.value = '';
    this.refreshViews();
  },

  // ---------- KANBAN HTML5 DRAG & DROP HANDLERS ----------
  onLeadDragStart(e, leadId) {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    window._draggedLeadId = leadId;
    const card = document.getElementById(`leadCard_${leadId}`);
    if (card) card.classList.add('dragging');
  },

  onLeadDragEnd(e) {
    window._draggedLeadId = null;
    document.querySelectorAll('.kanban-lead-card.dragging').forEach(c => c.classList.remove('dragging'));
    document.querySelectorAll('.kanban-stage-col.drag-over').forEach(c => c.classList.remove('drag-over'));
  },

  onStageDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const col = e.currentTarget;
    if (col && !col.classList.contains('drag-over')) {
      col.classList.add('drag-over');
    }
  },

  onStageDragLeave(e) {
    const col = e.currentTarget;
    if (col && !col.contains(e.relatedTarget)) {
      col.classList.remove('drag-over');
    }
  },

  onStageDrop(e, targetStage) {
    e.preventDefault();
    const col = e.currentTarget;
    if (col) col.classList.remove('drag-over');

    const leadId = e.dataTransfer.getData('text/plain') || window._draggedLeadId;
    if (!leadId) return;

    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    if (lead.stage !== targetStage) {
      this.promptAdvanceLeadStage(leadId, lead.stage, targetStage);
    }
  },

  // ---------- ADVANCE STAGE WITH CONFIRMATION MODAL ----------
  promptAdvanceLeadStage(leadId, currentStage, directTargetStage = null) {
    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    const nextStages = {
      'New': 'Followed Up',
      'Followed Up': 'Negotiation',
      'Negotiation': 'Converted',
      'Converted': 'New',
      'Dropped': 'New'
    };
    const targetStage = directTargetStage || nextStages[currentStage] || 'Followed Up';

    const stageDescriptions = {
      'New': 'Inbound Lead (Awaiting Contact)',
      'Followed Up': 'Contacted & Site Visit Booked',
      'Negotiation': 'Price Negotiation & Token Advance Stage',
      'Converted': 'Deal Won & Registered Property Handover',
      'Dropped': 'Dropped / Stalled Inactive Lead'
    };

    let modalOverlay = document.getElementById('salesAdvanceModal');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'salesAdvanceModal';
      modalOverlay.className = 'sales-quick-modal-backdrop';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="sales-quick-modal-box" style="max-width: 480px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <span class="chip gold xs font-mono">Stage Transition Confirmation</span>
            <h3 style="font-size:18px; font-weight:700; color:var(--ink); margin:4px 0 0 0;">Confirm Opportunity Stage Advance</h3>
          </div>
          <button onclick="document.getElementById('salesAdvanceModal').remove()" style="border:none; background:transparent; font-size:18px; cursor:pointer; color:var(--ink-3);">✕</button>
        </div>

        <!-- Stage Migration Visual Card -->
        <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:10px; padding:16px; margin-bottom:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="flex:1; text-align:center; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:10px;">
              <span style="font-size:10.5px; text-transform:uppercase; color:#64748B; font-weight:600; display:block;">Current Stage</span>
              <b style="font-size:13px; color:#0F172A; display:block; margin-top:2px;">${currentStage}</b>
            </div>
            
            <div style="font-size:20px; color:#C9A24E; font-weight:700;">➔</div>
            
            <div style="flex:1; text-align:center; background:#FEF9C3; border:1px solid #FDE047; border-radius:8px; padding:10px;">
              <span style="font-size:10.5px; text-transform:uppercase; color:#854D0E; font-weight:600; display:block;">New Stage</span>
              <b style="font-size:13px; color:#854D0E; display:block; margin-top:2px;">${targetStage}</b>
            </div>
          </div>
          <p style="font-size:11.5px; color:#64748B; text-align:center; margin:10px 0 0 0;">
            ${stageDescriptions[targetStage] || 'Advance opportunity in sales funnel'}
          </p>
        </div>

        <!-- Lead Summary -->
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px; margin-bottom:16px; font-size:12.5px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#64748B;">Client Name:</span>
            <b style="color:#0F172A;">${lead.name}</b>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#64748B;">Property Listing:</span>
            <span style="color:#0F172A; font-weight:500;">${lead.property || 'The Imperial Azure Sky Penthouse'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#64748B;">Target Budget:</span>
            <b style="color:#C9A24E;">${lead.budget || '₹ 2.5 Cr'}</b>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#64748B;">Branch Territory:</span>
            <span class="kanban-card-outlet-badge">📍 ${lead.outlet || 'YOR Central'}</span>
          </div>
        </div>

        <div style="margin-bottom:18px;">
          <label style="font-size:12.5px; font-weight:600; color:var(--ink); margin-bottom:6px; display:block;">Stage Transition Remark (Optional)</label>
          <input type="text" id="advanceStage_remark" placeholder="e.g. Site visit conducted, client requested token agreement" 
            style="width:100%; box-sizing:border-box; height:38px; border:1px solid #CBD5E1; border-radius:7px; padding:0 12px; font-family:inherit; font-size:13px; color:var(--ink); background:#FFFFFF; outline:none; transition:border-color 0.15s, box-shadow 0.15s;"
            onfocus="this.style.borderColor='#C9A24E'; this.style.boxShadow='0 0 0 3px rgba(201,162,78,0.15)';" 
            onblur="this.style.borderColor='#CBD5E1'; this.style.boxShadow='none';">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn" onclick="document.getElementById('salesAdvanceModal').remove()">Cancel</button>
          <button type="button" class="btn dark gold-glow" onclick="window.salesCRM.confirmAdvance('${lead.id}', '${targetStage}')">
            Confirm Stage Advance →
          </button>
        </div>
      </div>
    `;
  },

  confirmAdvance(leadId, targetStage) {
    const remark = document.getElementById('advanceStage_remark')?.value;
    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    window.store.updateLeadStage(leadId, targetStage);

    if (remark) {
      const noteEntry = `[Stage ➔ ${targetStage}] ${remark} (${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short' })})`;
      lead.notes = lead.notes ? `${lead.notes}\n• ${noteEntry}` : `• ${noteEntry}`;
      window.store.saveState();
    }

    const modal = document.getElementById('salesAdvanceModal');
    if (modal) modal.remove();

    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Lead "${lead.name}" successfully moved to "${targetStage}"!`);
    }

    this.refreshViews();
  },

  // ---------- LEAD NOTES & ACTIVITY LOG MODAL ----------
  openNotesModal(leadId) {
    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    let modalOverlay = document.getElementById('salesNotesModal');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'salesNotesModal';
      modalOverlay.className = 'sales-quick-modal-backdrop';
      document.body.appendChild(modalOverlay);
    }

    const currentNotes = lead.notes || "No previous interaction notes recorded.";

    modalOverlay.innerHTML = `
      <div class="sales-quick-modal-box" style="max-width: 520px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <span class="chip gold xs font-mono">Lead Activity & Interaction Log</span>
            <h3 style="font-size:18px; font-weight:700; color:var(--ink); margin:4px 0 0 0;">Notes for ${lead.name}</h3>
            <p style="font-size:12px; color:var(--ink-2); margin:2px 0 0 0;">${lead.property || 'Property Inquiry'} · 📍 ${lead.outlet || 'Branch'} · Assigned: ${lead.assigned || 'Sales Team'}</p>
          </div>
          <button onclick="document.getElementById('salesNotesModal').remove()" style="border:none; background:transparent; font-size:18px; cursor:pointer; color:var(--ink-3);">✕</button>
        </div>

        <!-- Existing Notes Log Display -->
        <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:12px 14px; max-height:160px; overflow-y:auto; margin-bottom:14px;">
          <span style="font-size:10.5px; text-transform:uppercase; color:#64748B; font-weight:700; display:block; margin-bottom:6px;">Historical Notes & Audit Log:</span>
          <div style="font-size:12.5px; color:#334155; line-height:1.5; white-space:pre-wrap;">${currentNotes}</div>
        </div>

        <!-- Add New Note Form -->
        <form id="addLeadNoteForm" onsubmit="window.salesCRM.saveLeadNote('${lead.id}'); return false;">
          <div style="margin-bottom:16px;">
            <label style="font-size:12.5px; font-weight:600; color:var(--ink); margin-bottom:6px; display:block;">
              Add New Interaction Note <span class="req" style="color:var(--red);">*</span>
            </label>
            <textarea id="newLeadNoteInput" required rows="4" 
              style="width:100%; box-sizing:border-box; min-height:90px; border:1px solid #CBD5E1; border-radius:8px; padding:10px 12px; font-family:inherit; font-size:13px; color:var(--ink); background:#FFFFFF; line-height:1.5; resize:vertical; outline:none; transition:border-color 0.15s, box-shadow 0.15s;" 
              onfocus="this.style.borderColor='#C9A24E'; this.style.boxShadow='0 0 0 3px rgba(201,162,78,0.15)';" 
              onblur="this.style.borderColor='#CBD5E1'; this.style.boxShadow='none';" 
              placeholder="Log phone conversation details, site visit feedback, customized pricing requests, or lawyer remarks..."></textarea>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="xs muted">Saved to central branch ledger</span>
            <div style="display:flex; gap:10px;">
              <button type="button" class="btn" onclick="document.getElementById('salesNotesModal').remove()">Close</button>
              <button type="submit" class="btn dark gold-glow">
                💾 Save Note
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  saveLeadNote(leadId) {
    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    const newNote = document.getElementById('newLeadNoteInput')?.value.trim();
    if (!newNote) return;

    const timestamp = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
    const noteEntry = `• [${timestamp}] ${newNote}`;

    lead.notes = lead.notes ? `${lead.notes}\n${noteEntry}` : noteEntry;
    window.store.saveState();

    const modal = document.getElementById('salesNotesModal');
    if (modal) modal.remove();

    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`New note added to ${lead.name}'s log!`);
    }

    this.refreshViews();
  },

  // ---------- QUICK TASK SCHEDULER MODAL ----------
  openQuickTaskModal(leadId) {
    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    const currentTask = lead.nextTask || {
      title: "Follow up call with client",
      due: "Tomorrow, 4:00 PM",
      type: "Call"
    };

    let modalOverlay = document.getElementById('salesQuickTaskModal');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'salesQuickTaskModal';
      modalOverlay.className = 'sales-quick-modal-backdrop';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="sales-quick-modal-box">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <span class="chip gold xs font-mono">Lead Task Scheduler</span>
            <h3 style="font-size:18px; font-weight:700; color:var(--ink); margin:4px 0 0 0;">Action Task for ${lead.name}</h3>
            <p style="font-size:12px; color:var(--ink-2); margin:2px 0 0 0;">Mapped Property: <b>${lead.property || 'Listing'}</b> (📍 ${lead.outlet || 'Branch'})</p>
          </div>
          <button onclick="document.getElementById('salesQuickTaskModal').remove()" style="border:none; background:transparent; font-size:18px; cursor:pointer; color:var(--ink-3);">✕</button>
        </div>

        <form id="quickTaskForm" onsubmit="window.salesCRM.saveQuickTask('${lead.id}'); return false;">
          <div style="margin-bottom:14px;">
            <label style="font-size:12.5px; font-weight:600; color:var(--ink); margin-bottom:6px; display:block;">Task Action Type</label>
            <select id="quickTask_type" style="width:100%; box-sizing:border-box; height:38px; border:1px solid #CBD5E1; border-radius:7px; padding:0 10px; font-family:inherit; font-size:13px; color:var(--ink); background:#FFFFFF; outline:none; transition:border-color 0.15s, box-shadow 0.15s;"
              onfocus="this.style.borderColor='#C9A24E'; this.style.boxShadow='0 0 0 3px rgba(201,162,78,0.15)';" 
              onblur="this.style.borderColor='#CBD5E1'; this.style.boxShadow='none';">
              <option value="Site Visit" ${currentTask.type === 'Site Visit' ? 'selected' : ''}>📍 On-Site Property Walkthrough</option>
              <option value="Call" ${currentTask.type === 'Call' ? 'selected' : ''}>📞 Phone Call / Discussion</option>
              <option value="Meeting" ${currentTask.type === 'Meeting' ? 'selected' : ''}>🤝 In-Person Branch / HQ Meeting</option>
              <option value="Email" ${currentTask.type === 'Email' ? 'selected' : ''}>📧 Send Legal Title Deed & Brochure</option>
              <option value="Task" ${currentTask.type === 'Task' ? 'selected' : ''}>📝 General Follow-up Task</option>
            </select>
          </div>

          <div style="margin-bottom:14px;">
            <label style="font-size:12.5px; font-weight:600; color:var(--ink); margin-bottom:6px; display:block;">Task Title & Purpose <span class="req" style="color:var(--red);">*</span></label>
            <input type="text" id="quickTask_title" required value="${currentTask.title}" placeholder="e.g. Schedule private penthouse walkthrough with family" 
              style="width:100%; box-sizing:border-box; height:38px; border:1px solid #CBD5E1; border-radius:7px; padding:0 12px; font-family:inherit; font-size:13px; color:var(--ink); background:#FFFFFF; outline:none; transition:border-color 0.15s, box-shadow 0.15s;"
              onfocus="this.style.borderColor='#C9A24E'; this.style.boxShadow='0 0 0 3px rgba(201,162,78,0.15)';" 
              onblur="this.style.borderColor='#CBD5E1'; this.style.boxShadow='none';">
          </div>

          <div style="margin-bottom:20px;">
            <label style="font-size:12.5px; font-weight:600; color:var(--ink); margin-bottom:6px; display:block;">Scheduled Due Date & Time</label>
            <input type="text" id="quickTask_due" value="${currentTask.due}" placeholder="e.g. Tomorrow, 4:00 PM or May 3, 11:00 AM" 
              style="width:100%; box-sizing:border-box; height:38px; border:1px solid #CBD5E1; border-radius:7px; padding:0 12px; font-family:inherit; font-size:13px; color:var(--ink); background:#FFFFFF; outline:none; transition:border-color 0.15s, box-shadow 0.15s;"
              onfocus="this.style.borderColor='#C9A24E'; this.style.boxShadow='0 0 0 3px rgba(201,162,78,0.15)';" 
              onblur="this.style.borderColor='#CBD5E1'; this.style.boxShadow='none';">
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn" onclick="document.getElementById('salesQuickTaskModal').remove()">Cancel</button>
            <button type="submit" class="btn dark gold-glow">Save Scheduled Task</button>
          </div>
        </form>
      </div>
    `;
  },

  saveQuickTask(leadId) {
    const lead = window.store.data.leads.find(l => l.id === leadId);
    if (!lead) return;

    const type = document.getElementById('quickTask_type')?.value || 'Call';
    const title = document.getElementById('quickTask_title')?.value || 'Follow-up consultation';
    const due = document.getElementById('quickTask_due')?.value || 'Tomorrow, 4:00 PM';

    lead.nextTask = {
      id: `T-${Date.now()}`,
      type,
      title,
      due,
      done: false
    };

    window.store.saveState();
    const modal = document.getElementById('salesQuickTaskModal');
    if (modal) modal.remove();

    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Task scheduled for ${lead.name}!`);
    }

    this.refreshViews();
  },

  toggleTask(leadId) {
    window.store.toggleLeadTask(leadId);
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Follow-up task status updated!');
    }
    this.refreshViews();
  },

  deleteLead(leadId) {
    if (confirm('Are you sure you want to remove this lead record?')) {
      window.store.deleteLead(leadId);
      if (window.modals && window.modals.showToast) {
        window.modals.showToast('Lead record removed');
      }
      this.refreshViews();
    }
  },

  // Refresh dynamic content and stats across CRM
  refreshViews() {
    const activeTab = window._salesViewTab || 'kanban';
    this.setViewTab(activeTab);
  }
};
