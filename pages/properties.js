/* ==========================================================================
   YOR Estate - Properties Page Module
   Luxury Search & Survey Register with Interactive Spotlight
   ========================================================================== */

// Global Filter & Selection State for Properties Page
window._propSearchQuery = window._propSearchQuery || "";
window._propOutletFilter = window._propOutletFilter || "all";
window._propTypeFilter = window._propTypeFilter || "all";
window._propStatusFilter = window._propStatusFilter || "all";
window._propSelectedId = window._propSelectedId || null;

window.propertyController = {
  onSearch(val) {
    window._propSearchQuery = (val || "").trim();
    this.refreshTable();
  },

  clearSearch() {
    window._propSearchQuery = "";
    const input = document.getElementById('propSearchInput');
    if (input) input.value = "";
    const clearBtn = document.getElementById('propSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    this.refreshTable();
  },

  onOutletFilter(val) {
    window._propOutletFilter = val;
    this.refreshTable();
  },

  onTypeFilter(val) {
    window._propTypeFilter = val;
    this.refreshTable();
  },

  onStatusFilter(val) {
    window._propStatusFilter = val;
    this.refreshTable();
  },

  clearAllFilters() {
    window._propSearchQuery = "";
    window._propOutletFilter = "all";
    window._propTypeFilter = "all";
    window._propStatusFilter = "all";
    if (window.router && window.router.currentRoute === 'properties') {
      window.router.navigate('properties', false);
    }
  },

  selectProperty(surveyNo) {
    window._propSelectedId = surveyNo;
    const store = window.store;
    const properties = (store && store.data && store.data.properties) || [];
    const selectedProp = properties.find(p => p.surveyNo === surveyNo) || properties[0] || {};
    
    // Highlight table row
    document.querySelectorAll('#propertyTableBody tr').forEach(tr => {
      if (tr.getAttribute('data-survey') === surveyNo) {
        tr.classList.add('selected-prop-row');
        tr.style.backgroundColor = 'rgba(191, 151, 62, 0.08)';
      } else {
        tr.classList.remove('selected-prop-row');
        tr.style.backgroundColor = '';
      }
    });

    // Update Right Panel
    const rightPanel = document.getElementById('propSelectedSpotlightPanel');
    if (rightPanel) {
      rightPanel.innerHTML = renderSelectedPropertySpotlightHtml(selectedProp);
    }
  },

  refreshTable() {
    const store = window.store;
    const properties = (store && store.data && store.data.properties) || [];
    
    const q = (window._propSearchQuery || "").toLowerCase();
    const cleanQ = q.replace(/^(sy\.?|survey\s*no\.?|survey)\s*/i, '').trim();
    const strippedQ = cleanQ.replace(/[^a-z0-9]/g, '');

    const out = window._propOutletFilter || "all";
    const typ = window._propTypeFilter || "all";
    const stat = window._propStatusFilter || "all";

    const filtered = properties.filter(p => {
      const cleanSurvey = (p.surveyNo || '').toLowerCase();
      const cleanName = (p.name || '').toLowerCase();
      const cleanLoc = (p.location || '').toLowerCase();
      const cleanArea = (p.area || '').toLowerCase();
      const cleanOutlet = (p.outlet || '').toLowerCase();
      const cleanOwner = (p.firstOwnerInfo?.originalOwner || '').toLowerCase();
      const cleanParentDeed = (p.firstOwnerInfo?.parentDeedNo || '').toLowerCase();
      const inChain = Array.isArray(p.ownershipChain) && p.ownershipChain.some(c => 
        (c.buyer || '').toLowerCase().includes(q) || 
        (c.seller || '').toLowerCase().includes(q) ||
        (c.deedNo || '').toLowerCase().includes(q)
      );

      const matchSearch = !q || 
        cleanSurvey.includes(cleanQ) ||
        (strippedQ && cleanSurvey.replace(/[^a-z0-9]/g, '').includes(strippedQ)) ||
        cleanName.includes(q) ||
        cleanLoc.includes(q) ||
        cleanArea.includes(q) ||
        cleanOutlet.includes(q) ||
        cleanOwner.includes(q) ||
        cleanParentDeed.includes(q) ||
        inChain;
      
      const matchOutlet = (out === 'all') || (p.outlet === out);
      const matchType = (typ === 'all') || (p.type === typ);
      const matchStatus = (stat === 'all') || 
        (p.legalStatus === stat) ||
        (stat === 'Approved' && (p.legalStatus === 'Verified' || p.legalStatus === 'Approved')) ||
        (stat === 'In-Review' && (p.legalStatus === 'In Review' || p.legalStatus === 'In-Review')) ||
        (stat === 'Resubmit' && (p.legalStatus === 'Action' || p.legalStatus === 'Resubmit'));

      return matchSearch && matchOutlet && matchType && matchStatus;
    });

    // Update clear button visibility
    const clearBtn = document.getElementById('propSearchClearBtn');
    if (clearBtn) {
      clearBtn.style.display = q.length > 0 ? 'flex' : 'none';
    }

    // Update count badge
    const countBadge = document.getElementById('propFilterCountBadge');
    if (countBadge) {
      countBadge.textContent = `Showing ${filtered.length} of ${properties.length} properties`;
    }

    // Update Spotlight Panel
    const rightPanel = document.getElementById('propSelectedSpotlightPanel');
    if (rightPanel) {
      if (filtered.length > 0) {
        const isSelectedInFiltered = filtered.some(p => p.surveyNo === window._propSelectedId);
        const targetProp = isSelectedInFiltered ? properties.find(p => p.surveyNo === window._propSelectedId) : filtered[0];
        if (targetProp) {
          window._propSelectedId = targetProp.surveyNo;
          rightPanel.innerHTML = renderSelectedPropertySpotlightHtml(targetProp);
        }
      } else {
        rightPanel.innerHTML = `
          <div class="card" style="padding:40px 20px; text-align:center; color:var(--ink-3);">
            <div style="font-size:32px; margin-bottom:8px;">🔍</div>
            <h4 style="margin:0 0 6px 0; color:var(--ink);">No Property Matches</h4>
            <p class="small muted" style="margin:0 0 16px 0;">Try modifying your search query or reset active filters.</p>
            <button class="btn sm gold" onclick="window.propertyController.clearAllFilters()">Reset Filters</button>
          </div>
        `;
      }
    }

    // Update tbody
    const tbody = document.getElementById('propertyTableBody');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center; padding:36px 16px;">
              <div style="font-size:14px; font-weight:600; color:var(--ink); margin-bottom:4px">No matching properties found</div>
              <p style="font-size:12px; color:var(--ink-2); margin-bottom:12px">Try adjusting your search keywords or active filters.</p>
              <button class="btn sm" onclick="window.propertyController.clearAllFilters()">Reset All Filters</button>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = filtered.map(p => `
          <tr data-survey="${p.surveyNo}" onclick="window.propertyController.selectProperty('${p.surveyNo}')" style="cursor:pointer; ${window._propSelectedId === p.surveyNo ? 'background:rgba(191, 151, 62, 0.08);' : ''}">
            <td>
              <div class="prop">
                <div class="thumb" style="background:url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&auto=format&fit=crop&q=80') center/cover"></div>
                <div>
                  <b>${p.name}</b>
                  <span>${p.outlet} · ${p.area}</span>
                </div>
              </div>
            </td>
            <td><span class="chip gray font-mono"><b>${p.surveyNo}</b></span></td>
            <td>${p.location}</td>
            <td><span class="chip xs ${p.type === 'Commercial' ? 'blue' : 'gray'}">${p.type}</span></td>
            <td>
              <span class="chip ${p.legalStatus === 'Approved' || p.legalStatus === 'Verified' ? 'green' : p.legalStatus === 'Resubmit' || p.legalStatus === 'Action' ? 'red' : 'amber'}">
                ${p.legalStatus}
              </span>
            </td>
            <td class="r"><b class="num">${p.valuation}</b></td>
          </tr>
        `).join('');
      }
    }
  }
};

function renderPropertiesPage() {
  const store = window.store;
  const properties = (store && store.data && store.data.properties) || [];
  
  if (!window._propSelectedId && properties.length > 0) {
    window._propSelectedId = properties[0].surveyNo;
  }
  
  const selectedProp = properties.find(p => p.surveyNo === window._propSelectedId) || properties[0] || {};
  const outlets = (store && store.data && store.data.outlets) || [];

  // Filter properties
  const q = (window._propSearchQuery || "").toLowerCase();
  const cleanQ = q.replace(/^(sy\.?|survey\s*no\.?|survey)\s*/i, '').trim();
  const strippedQ = cleanQ.replace(/[^a-z0-9]/g, '');

  const out = window._propOutletFilter || "all";
  const typ = window._propTypeFilter || "all";
  const stat = window._propStatusFilter || "all";

  const filtered = properties.filter(p => {
    const cleanSurvey = (p.surveyNo || '').toLowerCase();
    const cleanName = (p.name || '').toLowerCase();
    const cleanLoc = (p.location || '').toLowerCase();
    const cleanArea = (p.area || '').toLowerCase();
    const cleanOutlet = (p.outlet || '').toLowerCase();
    const cleanOwner = (p.firstOwnerInfo?.originalOwner || '').toLowerCase();
    const cleanParentDeed = (p.firstOwnerInfo?.parentDeedNo || '').toLowerCase();
    const inChain = Array.isArray(p.ownershipChain) && p.ownershipChain.some(c => 
      (c.buyer || '').toLowerCase().includes(q) || 
      (c.seller || '').toLowerCase().includes(q) ||
      (c.deedNo || '').toLowerCase().includes(q)
    );

    const matchSearch = !q || 
      cleanSurvey.includes(cleanQ) ||
      (strippedQ && cleanSurvey.replace(/[^a-z0-9]/g, '').includes(strippedQ)) ||
      cleanName.includes(q) ||
      cleanLoc.includes(q) ||
      cleanArea.includes(q) ||
      cleanOutlet.includes(q) ||
      cleanOwner.includes(q) ||
      cleanParentDeed.includes(q) ||
      inChain;
    
    const matchOutlet = (out === 'all') || (p.outlet === out);
    const matchType = (typ === 'all') || (p.type === typ);
    const matchStatus = (stat === 'all') || 
      (p.legalStatus === stat) ||
      (stat === 'Approved' && (p.legalStatus === 'Verified' || p.legalStatus === 'Approved')) ||
      (stat === 'In-Review' && (p.legalStatus === 'In Review' || p.legalStatus === 'In-Review')) ||
      (stat === 'Resubmit' && (p.legalStatus === 'Action' || p.legalStatus === 'Resubmit'));

    return matchSearch && matchOutlet && matchType && matchStatus;
  });

  return `
    <div class="head">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <span class="chip gold xs font-mono">Survey Identification</span>
          <span class="muted xs">/</span>
          <span class="xs muted">Registry OS</span>
        </div>
        <h1>Properties & Survey Register</h1>
        <p>Manage verified property records, immutable Survey Number registry, micro-market valuation trajectories, legal deed vaults, and outlet ownership.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.openExportReport()">
          <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Register
        </button>
        <button class="btn dark gold-glow" onclick="window.propertyWizard.openSlidingPage()" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Add Property
        </button>
      </div>
    </div>

    <!-- Five KPI Row -->
    <div class="stats">
      <div class="stat"><span>Total Properties</span><b class="num">${properties.length.toLocaleString()}</b><small class="muted">Across all outlets</small></div>
      <div class="stat"><span>Active Listings</span><b class="num">${Math.floor(properties.length * 0.72)}</b><small class="up">↑ 6% this month</small></div>
      <div class="stat"><span>Under Legal Review</span><b class="num">${properties.filter(p => p.legalStatus === 'In-Review' || p.legalStatus === 'In Review' || p.legalStatus === 'Resubmit' || p.legalStatus === 'Pending').length}</b><small class="warn">Review active</small></div>
      <div class="stat"><span>Valuation Updated</span><b class="num">88%</b><small class="up">Within last 12 mos</small></div>
      <div class="stat"><span>Documents Verified</span><b class="num">${properties.filter(p => p.legalStatus === 'Approved' || p.legalStatus === 'Verified').length}</b><small class="up">Clear title deeds</small></div>
    </div>

    <!-- Dedicated Luxury Search & Filter Toolbar -->
    <div class="luxury-search-toolbar" style="margin-bottom: 16px;">
      <div class="luxury-search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="propSearchInput" class="luxury-search-input" placeholder="Search property by name, survey number, location, outlet, owner..." value="${window._propSearchQuery || ''}" oninput="window.propertyController.onSearch(this.value)">
        <button type="button" class="luxury-search-clear" id="propSearchClearBtn" style="display:${window._propSearchQuery ? 'flex' : 'none'};" onclick="window.propertyController.clearSearch()" title="Clear search">✕</button>
      </div>

      <div class="luxury-filter-cluster">
        <!-- Managing Outlet Filter -->
        <select class="luxury-filter-select" onchange="window.propertyController.onOutletFilter(this.value)">
          <option value="all" ${out === 'all' ? 'selected' : ''}>All Outlets</option>
          ${outlets.map(o => `<option value="${o.name}" ${out === o.name ? 'selected' : ''}>${o.name}</option>`).join('')}
        </select>

        <!-- Property Type Filter -->
        <select class="luxury-filter-select" onchange="window.propertyController.onTypeFilter(this.value)">
          <option value="all" ${typ === 'all' ? 'selected' : ''}>All Property Types</option>
          <option value="Residential" ${typ === 'Residential' ? 'selected' : ''}>Residential</option>
          <option value="Commercial" ${typ === 'Commercial' ? 'selected' : ''}>Commercial</option>
          <option value="Agricultural" ${typ === 'Agricultural' ? 'selected' : ''}>Agricultural / Estate</option>
          <option value="Industrial" ${typ === 'Industrial' ? 'selected' : ''}>Industrial</option>
        </select>

        <!-- Legal Status Filter -->
        <select class="luxury-filter-select" onchange="window.propertyController.onStatusFilter(this.value)">
          <option value="all" ${stat === 'all' ? 'selected' : ''}>All Legal Statuses</option>
          <option value="Approved" ${stat === 'Approved' ? 'selected' : ''}>Verified Clear Title (Approved)</option>
          <option value="In-Review" ${stat === 'In-Review' ? 'selected' : ''}>Under Legal Review (In-Review)</option>
          <option value="Resubmit" ${stat === 'Resubmit' ? 'selected' : ''}>Resubmit / Action Required</option>
          <option value="Pending" ${stat === 'Pending' ? 'selected' : ''}>Pending Statutory Review</option>
        </select>

        <span class="luxury-results-badge" id="propFilterCountBadge">Showing ${filtered.length} of ${properties.length} properties</span>
      </div>
    </div>

    <!-- Grid: Table on Left, Selected Property Details & Valuation on Right -->
    <div class="grid-2">
      <div class="card">
        <div class="ch">
          <div>
            <h3>Survey register & inventory</h3>
            <p>Click any property to inspect deed details, valuation trajectory, and compliance health.</p>
          </div>
          <span class="chip gray xs">Live Register</span>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Survey No.</th>
                <th>Location</th>
                <th>Type</th>
                <th>Legal Status</th>
                <th class="r">Valuation</th>
              </tr>
            </thead>
            <tbody id="propertyTableBody">
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center; padding:36px 16px;">
                    <div style="font-size:14px; font-weight:600; color:var(--ink); margin-bottom:4px">No matching properties found</div>
                    <p style="font-size:12px; color:var(--ink-2); margin-bottom:12px">Try adjusting your search keywords or active filters.</p>
                    <button class="btn sm" onclick="window.propertyController.clearAllFilters()">Reset All Filters</button>
                  </td>
                </tr>
              ` : filtered.map(p => `
                <tr data-survey="${p.surveyNo}" onclick="window.propertyController.selectProperty('${p.surveyNo}')" style="cursor:pointer; ${window._propSelectedId === p.surveyNo ? 'background:rgba(191, 151, 62, 0.08);' : ''}">
                  <td>
                    <div class="prop">
                      <div class="thumb" style="background:url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&auto=format&fit=crop&q=80') center/cover"></div>
                      <div>
                        <b>${p.name}</b>
                        <span>${p.outlet} · ${p.area}</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="chip gray font-mono"><b>${p.surveyNo}</b></span></td>
                  <td>${p.location}</td>
                  <td><span class="chip xs ${p.type === 'Commercial' ? 'blue' : 'gray'}">${p.type}</span></td>
                  <td>
                    <span class="chip ${p.legalStatus === 'Verified' ? 'green' : p.legalStatus === 'Action' ? 'red' : 'amber'}">
                      ${p.legalStatus}
                    </span>
                  </td>
                  <td class="r"><b class="num">${p.valuation}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Selected Property Spotlight & Valuation History -->
      <div class="stack" id="propSelectedSpotlightPanel">
        ${renderSelectedPropertySpotlightHtml(selectedProp)}
      </div>
    </div>
  `;
}

function renderSelectedPropertySpotlightHtml(selectedProp) {
  return `
    <div class="card">
      <div class="ch">
        <div>
          <h3 style="font-size:15px; font-weight:600">${selectedProp.name || 'Property Profile'}</h3>
          <p style="font-size:12px; color:var(--ink-2)">Survey No. ${selectedProp.surveyNo || '123/2A'}</p>
        </div>
        <span class="chip ${selectedProp.legalStatus === 'Verified' ? 'green' : 'amber'}">${selectedProp.legalStatus || 'Verified'}</span>
      </div>
      
      <div class="soft" style="min-height:140px; background:linear-gradient(135deg, #DDD2BE, #697784); position:relative; overflow:hidden; border-radius:var(--r-sm)">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80" alt="Spotlight" style="width:100%; height:140px; object-fit:cover; opacity:0.85">
        <div style="position:absolute; left:0; right:0; bottom:0; height:84px; background:linear-gradient(to top, rgba(20,23,26,0.85), transparent); display:flex; align-items:flex-end; padding:12px">
          <span style="color:#FFF; font-size:12px; font-weight:600">${selectedProp.location || 'Prime Location'}</span>
        </div>
      </div>

      <div style="margin-top:14px">
        <div class="kpi-line"><span>Property Name</span><b>${selectedProp.name}</b></div>
        <div class="kpi-line"><span>Survey Number</span><b class="font-mono">${selectedProp.surveyNo}</b></div>
        <div class="kpi-line"><span>Property Type</span><b>${selectedProp.type}</b></div>
        <div class="kpi-line"><span>Registered Area</span><b>${selectedProp.area}</b></div>
        <div class="kpi-line"><span>State / Jurisdiction</span><b>${selectedProp.state}</b></div>
        <div class="kpi-line"><span>Assigned Outlet</span><b>${selectedProp.outlet}</b></div>
        <div class="kpi-line"><span>Current Valuation</span><b class="num" style="color:var(--accent); font-size:15px">${selectedProp.valuation}</b></div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px">
        <button class="btn" style="width:100%; background:linear-gradient(135deg, rgba(191,151,62,0.12), rgba(191,151,62,0.04)); border:1px solid var(--accent); color:var(--accent); font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 14px; border-radius:var(--r-sm)" onclick="window.modals.openQuickSearch('${selectedProp.surveyNo}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Survey Title History & Resale Flow
        </button>
        <div style="display:flex; gap:10px">
          <button class="btn gold" style="flex:1" onclick="window.modals.openUploadDocument()">+ Legal Doc</button>
          <button class="btn dark" style="flex:1" onclick="window.router.navigate('legal')">Workflow</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="ch">
        <div>
          <h3>Valuation trajectory</h3>
          <p>Historical trend over 12 months</p>
        </div>
        <span class="chip green">↑ +22.5%</span>
      </div>
      <div class="chartbox" style="height:170px">
        ${window.charts ? window.charts.renderValuationHistoryChart(selectedProp.valuationHistory) : ''}
      </div>
    </div>
  `;
}
