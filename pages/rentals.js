/* ==========================================================================
   YOR Estate - Rental Management & Sublease Ecosystem
   Classic Luxury Editorial Interface
   ========================================================================== */

function renderRentalsPage() {
  const store = window.store;
  const rentals = store.data.rentals || [];
  const subleases = store.data.subleasePortfolios || [];
  const inquiries = store.data.rentalInquiries || [];
  const rentRoll = store.data.rentRoll || [];
  const outlets = store.data.outlets || [];

  // Active View Tab & Filters
  const activeTab = window._rentalActiveTab || "properties"; // "properties" | "subleases" | "inquiries" | "rentroll" | "agreements"
  const selectedOutlet = window._rentalOutletFilter || "all";
  const searchQuery = (window._rentalSearchQuery || "").toLowerCase();
  const publishFilter = window._rentalPublishFilter || "all"; // "all" | "published" | "draft"

  // Filter Rentals
  const filteredRentals = rentals.filter(r => {
    const matchOutlet = (selectedOutlet === "all") || (r.outlet === selectedOutlet);
    const matchPublish = (publishFilter === "all") || 
      (publishFilter === "published" && r.appPublished) || 
      (publishFilter === "draft" && !r.appPublished);
    const matchSearch = !searchQuery || 
      (r.property && r.property.toLowerCase().includes(searchQuery)) ||
      (r.tenant && r.tenant.toLowerCase().includes(searchQuery)) ||
      (r.location && r.location.toLowerCase().includes(searchQuery)) ||
      (r.category && r.category.toLowerCase().includes(searchQuery));
    return matchOutlet && matchPublish && matchSearch;
  });

  // Filter Subleases
  const filteredSubleases = subleases.filter(s => {
    const matchOutlet = (selectedOutlet === "all") || (s.outlet === selectedOutlet);
    const matchSearch = !searchQuery ||
      (s.property && s.property.toLowerCase().includes(searchQuery)) ||
      (s.landlord && s.landlord.toLowerCase().includes(searchQuery)) ||
      (s.location && s.location.toLowerCase().includes(searchQuery));
    return matchOutlet && matchSearch;
  });

  // Filter Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchSearch = !searchQuery ||
      (inq.customerName && inq.customerName.toLowerCase().includes(searchQuery)) ||
      (inq.requestedProperty && inq.requestedProperty.toLowerCase().includes(searchQuery)) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery));
    return matchSearch;
  });

  // KPI Calculations
  const totalWholeUnits = rentals.length;
  let totalBedsCount = 0;
  let occupiedBedsCount = 0;
  let totalSubleaseMarginRaw = 0;

  subleases.forEach(s => {
    totalBedsCount += (s.totalBeds || 0);
    occupiedBedsCount += (s.occupiedBeds || 0);
    totalSubleaseMarginRaw += (s.rawMargin || 0);
  });

  const totalUnitsAndBeds = totalWholeUnits + totalBedsCount;
  const overallOccupancyPct = totalUnitsAndBeds > 0 
    ? Math.round(((rentals.filter(r => r.status === 'Active').length + occupiedBedsCount) / totalUnitsAndBeds) * 100) 
    : 88;

  const totalRentRollDue = rentRoll.reduce((acc, r) => acc + (r.rawDue || 0), 0);
  const totalRentRollPaid = rentRoll.reduce((acc, r) => acc + (r.rawPaid || 0), 0);
  const collectionEfficiencyPct = totalRentRollDue > 0 
    ? Math.round((totalRentRollPaid / totalRentRollDue) * 100) 
    : 94;

  const newInquiriesCount = inquiries.filter(i => i.status === 'New' || i.status === 'Tour Scheduled').length;

  return `
    <div class="rental-management-shell">
      
      <!-- Top Title & Global Controls Header -->
      <div class="rental-top-bar">
        <div class="rental-header-title">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="chip gold xs font-mono">Rental Portfolio OS</span>
            <span class="muted xs">/</span>
            <span class="xs muted">Direct Rentals & Sublease Hub</span>
          </div>
          <h1>Rental Management & Sublease Ecosystem</h1>
          <p>Oversee premium residential & commercial rental units, manage master flat lease to hostel/co-living conversions with live spread yields, and track rent roll collections.</p>
        </div>

        <div class="rental-actions-cluster">
          <!-- Outlet Filter Dropdown -->
          <div class="sales-outlet-filter-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A24E" stroke-width="2"><path d="M4 22h16"/><path d="M4 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18"/><path d="M12 22V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"/></svg>
            <select id="rentalOutletSelect" onchange="window.rentalController.setOutletFilter(this.value)">
              <option value="all" ${selectedOutlet === 'all' ? 'selected' : ''}>🌐 All Outlets (Global Portfolio)</option>
              ${outlets.map(o => `
                <option value="${o.name}" ${selectedOutlet === o.name ? 'selected' : ''}>📍 ${o.name} (${o.location || 'Branch'})</option>
              `).join('')}
            </select>
          </div>

          <button class="btn" onclick="window.rentalController.openRecordRent()" title="Record Rent Payment">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Record Rent
          </button>

          <button class="btn" onclick="window.rentalWizard ? window.rentalWizard.openSlidingPage('sublease') : window.modals.openCreateSubleaseModal()" title="Add Entire Flat Master Lease -> Sublease Beds">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            + Add Sublease Property
          </button>

          <button class="btn dark gold-glow" onclick="window.rentalWizard ? window.rentalWizard.openSlidingPage('rental') : window.modals.openPublishRentalModal()" style="display:inline-flex; align-items:center; gap:6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + Add Rental Property
          </button>
        </div>
      </div>

      <!-- Five Luxury KPI Metric Cards -->
      <div class="rental-kpi-row">
        <div class="rental-kpi-card">
          <div class="kpi-label">
            <span>Total Units & Beds</span>
            <span class="chip gray xs">Portfolio</span>
          </div>
          <div class="kpi-val">${totalUnitsAndBeds} <span style="font-size:14px; font-weight:500; color:var(--ink-2)">Units</span></div>
          <div class="kpi-foot muted">
            <span>${totalWholeUnits} Flats & Villas · ${totalBedsCount} Hostel Beds</span>
          </div>
        </div>

        <div class="rental-kpi-card">
          <div class="kpi-label">
            <span>Occupancy Rate</span>
            <span class="chip green xs">Live</span>
          </div>
          <div class="kpi-val" style="color:var(--green)">${overallOccupancyPct}%</div>
          <div class="kpi-foot up">
            <span>${(rentals.filter(r => r.status === 'Active').length + occupiedBedsCount)} Active Leased Units</span>
          </div>
        </div>

        <div class="rental-kpi-card">
          <div class="kpi-label">
            <span>Rent Collected MTD</span>
            <span class="chip blue xs">Cash Flow</span>
          </div>
          <div class="kpi-val">₹${(totalRentRollPaid / 100000).toFixed(2)} L</div>
          <div class="kpi-foot up">
            <span>${collectionEfficiencyPct}% collection efficiency</span>
          </div>
        </div>

        <div class="rental-kpi-card" style="border-color:var(--gold-border); background:#FCFAF5">
          <div class="kpi-label">
            <span style="color:var(--gold-text)">Sublease Spread Margin</span>
            <span class="chip gold xs">Profit</span>
          </div>
          <div class="kpi-val" style="color:var(--gold-text)">+₹${(totalSubleaseMarginRaw / 1000).toFixed(0)}k <span style="font-size:13px; font-weight:600">/mo</span></div>
          <div class="kpi-foot" style="color:var(--gold-text)">
            <span>Master Rent In vs Bed Out Spread</span>
          </div>
        </div>

        <div class="rental-kpi-card">
          <div class="kpi-label">
            <span>Tenant Inquiries & Leads</span>
            <span class="chip amber xs">Inbound</span>
          </div>
          <div class="kpi-val" style="color:var(--ink)">${newInquiriesCount} <span style="font-size:14px; font-weight:500; color:var(--ink-2)">Active</span></div>
          <div class="kpi-foot warn">
            <span>${inquiries.filter(i => i.status === 'Tour Scheduled').length} Site visits booked</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs Bar -->
      <nav class="rental-tabs-nav" style="margin-top: 4px; border-bottom: 1px solid var(--line); padding-bottom: 12px;">
        <button class="rental-tab-btn ${activeTab === 'properties' ? 'active' : ''}" onclick="window.rentalController.setTab('properties')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Rental Property Directory
          <span class="tab-count-badge">${rentals.length}</span>
        </button>

        <button class="rental-tab-btn ${activeTab === 'subleases' ? 'active' : ''}" onclick="window.rentalController.setTab('subleases')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
          Hostel & Sublease Properties
          <span class="tab-count-badge">${subleases.length}</span>
        </button>

        <button class="rental-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}" onclick="window.rentalController.setTab('inquiries')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          Tenant Inquiries & Leads
          <span class="tab-count-badge">${inquiries.length}</span>
        </button>

        <button class="rental-tab-btn ${activeTab === 'rentroll' ? 'active' : ''}" onclick="window.rentalController.setTab('rentroll')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Financials & Rent Roll
          <span class="tab-count-badge">${rentRoll.length}</span>
        </button>

        <button class="rental-tab-btn ${activeTab === 'agreements' ? 'active' : ''}" onclick="window.rentalController.setTab('agreements')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Agreements & NOCs
        </button>
      </nav>

      <!-- Dedicated Luxury Search & Filter Toolbar -->
      <div class="luxury-search-toolbar" style="margin-top: 14px; margin-bottom: 18px;">
        <div class="luxury-search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="rentalSearchInput" class="luxury-search-input" placeholder="Search rental properties, tenants, units, locations, bed #..." value="${window._rentalSearchQuery || ''}" oninput="window.rentalController.setSearchQuery(this.value)">
          <button type="button" class="luxury-search-clear" id="rentalSearchClearBtn" style="display:${window._rentalSearchQuery ? 'flex' : 'none'};" onclick="window.rentalController.clearSearch()" title="Clear search">✕</button>
        </div>

        <div class="luxury-filter-cluster">
          <!-- Managing Outlet Filter -->
          <select class="luxury-filter-select" onchange="window.rentalController.setOutletFilter(this.value)">
            <option value="all" ${selectedOutlet === 'all' ? 'selected' : ''}>All Outlets</option>
            ${outlets.map(o => `<option value="${o.name}" ${selectedOutlet === o.name ? 'selected' : ''}>${o.name}</option>`).join('')}
          </select>

          ${activeTab === 'properties' ? `
            <select class="luxury-filter-select" onchange="window.rentalController.setPublishFilter(this.value)">
              <option value="all" ${publishFilter === 'all' ? 'selected' : ''}>All Listing Statuses</option>
              <option value="published" ${publishFilter === 'published' ? 'selected' : ''}>🌐 Published Listings</option>
              <option value="draft" ${publishFilter === 'draft' ? 'selected' : ''}>🔒 Draft / Internal</option>
            </select>
          ` : ''}

          ${activeTab === 'subleases' ? `
            <select class="luxury-filter-select" id="subleaseToolbarPropertySelect" onchange="window.rentalController.selectSubleaseProperty(this.value)">
              <option value="all" ${window._selectedSubleaseId === 'all' ? 'selected' : ''}>🏢 All Properties (Summary View)</option>
              ${subleases.map(s => `
                <option value="${s.id}" ${window._selectedSubleaseId === s.id ? 'selected' : ''}>🛏️ ${s.property} (${s.occupiedBeds || 0}/${s.totalBeds || 0} Beds)</option>
              `).join('')}
            </select>
          ` : ''}

          <span class="luxury-results-badge">
            ${activeTab === 'properties' ? `Showing ${filteredRentals.length} of ${rentals.length} properties`
              : activeTab === 'subleases' ? `Showing ${filteredSubleases.length} of ${subleases.length} sublease hubs`
              : activeTab === 'inquiries' ? `Showing ${filteredInquiries.length} of ${inquiries.length} inquiries`
              : `Showing ${rentRoll.length} records`}
          </span>

          ${(window._rentalSearchQuery || selectedOutlet !== 'all' || publishFilter !== 'all') ? `
            <button class="btn sm" onclick="window.rentalController.clearAllFilters()" style="padding:6px 10px; font-size:11.5px">Reset Filters</button>
          ` : ''}
        </div>
      </div>

      <!-- MAIN TAB CONTENT VIEWS -->
      ${renderActiveRentalTabView(activeTab, filteredRentals, filteredSubleases, filteredInquiries, rentRoll, outlets)}

    </div>
  `;
}

/* ==========================================================================
   SUB-VIEW ROUTER & RENDERING LOGIC
   ========================================================================== */

function renderActiveRentalTabView(tab, rentals, subleases, inquiries, rentRoll, outlets) {
  if (tab === 'properties') {
    return renderRentalDirectoryView(rentals);
  }
  if (tab === 'subleases') {
    return renderHostelSubleaseView(subleases);
  }
  if (tab === 'inquiries') {
    return renderMobileInquiriesView(inquiries);
  }
  if (tab === 'rentroll') {
    return renderRentRollView(rentRoll);
  }
  if (tab === 'agreements') {
    return renderAgreementsView(rentals, subleases);
  }
  return renderRentalDirectoryView(rentals);
}

/* --------------------------------------------------------------------------
   TAB 1: RENTAL DIRECTORY & PROPERTY LISTINGS
   -------------------------------------------------------------------------- */
function renderRentalDirectoryView(rentals) {
  if (rentals.length === 0) {
    return `
      <div class="card" style="padding:48px; text-align:center;">
        <div style="font-size:36px; margin-bottom:12px">🏢</div>
        <h3>No rental listings found</h3>
        <p class="muted" style="margin-bottom:18px">No listings match your search or filter criteria. Create and add a new rental listing.</p>
        <button class="btn dark gold-glow" onclick="window.rentalWizard ? window.rentalWizard.openSlidingPage('rental') : window.modals.openPublishRentalModal()">+ Add Rental Property</button>
      </div>
    `;
  }

  return `
    <div class="rental-card-grid">
      ${rentals.map(r => `
        <div class="rental-property-card">
          
          <!-- Card Media Top -->
          <div class="rental-card-media">
            <img src="${r.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}" alt="${r.property}" loading="lazy">
            <div class="rental-media-overlay">
              <div class="rental-media-top">
                <span class="chip dark xs">${r.outlet || 'YOR South'}</span>
                
                <!-- Instant Publish Toggle Switch -->
                <button class="rental-publish-toggle ${r.appPublished ? 'published' : 'draft'}" onclick="window.rentalController.togglePublish('${r.id}')" title="Click to toggle public listing status">
                  <span class="status-dot"></span>
                  <span>${r.appPublished ? 'Published Listing' : 'Draft / Hidden'}</span>
                </button>
              </div>

              <div class="rental-media-bottom">
                <div class="rental-rent-tag">
                  <span class="rent-num">${r.rent}</span>
                  <span class="rent-cycle">/ month</span>
                </div>
                <span class="chip ${r.type === 'Corporate' ? 'blue' : 'gray'} xs">${r.category || r.type}</span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="rental-card-body">
            <div class="rental-card-title-row">
              <div>
                <h3>${r.property}</h3>
                <p>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${r.location || 'Marine Drive, Kochi'}
                </p>
              </div>
              <span class="chip ${r.status === 'Active' ? 'green' : 'amber'} xs">${r.status}</span>
            </div>

            <!-- Specs Strip -->
            <div class="rental-specs-strip">
              <div class="rental-spec-item">
                <span>Configuration</span>
                <b>${r.bhk || '3 BHK'}</b>
              </div>
              <div class="rental-spec-item">
                <span>Furnishing</span>
                <b>${r.furnishing || 'Furnished'}</b>
              </div>
              <div class="rental-spec-item">
                <span>Deposit Advance</span>
                <b>${r.deposit || '₹2.50 L'}</b>
              </div>
            </div>

            <!-- Active Tenant Box -->
            <div class="rental-tenant-box">
              <div class="rental-tenant-info">
                <div class="rental-tenant-avatar">${(r.tenant || 'T').charAt(0)}</div>
                <div>
                  <b style="font-size:12px; color:var(--ink); display:block">${r.tenant}</b>
                  <span style="font-size:11px; color:var(--ink-2)">${r.tenantPhone || 'Verified Tenant'}</span>
                </div>
              </div>
              <div style="text-align:right">
                <span style="font-size:10px; color:var(--ink-3); display:block; text-transform:uppercase">Lease Expiry</span>
                <b style="font-size:11.5px; color:var(--ink)">${r.leaseEnd}</b>
              </div>
            </div>

            <!-- Portal Engagement Stats -->
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--ink-2); padding:0 2px">
              <span>👁️ Portal Views: <b style="color:var(--ink)">${r.appViews || 280}</b></span>
              <span>💬 Inquiries: <b style="color:var(--gold-text)">${r.appInquiries || 6}</b></span>
              <span>Owner: <b style="color:var(--ink)">${r.landlord || 'Managed Asset'}</b></span>
            </div>
          </div>

          <div class="rental-card-footer" style="justify-content:flex-end">
            <div style="display:flex; gap:6px">
              <button class="btn sm" onclick="window.modals.openInvoiceModal()" title="View / Generate Lease Agreement">Agreements</button>
              <button class="btn sm gold" onclick="window.rentalController.collectRentalRent('${r.id}')">Collect Rent</button>
            </div>
          </div>

        </div>
      `).join('')}
    </div>
  `;
}

/* --------------------------------------------------------------------------
   TAB 2: HOSTEL & SUBLEASE PROPERTIES (Master Lease -> Bed Subleasing Model)
   -------------------------------------------------------------------------- */
function renderHostelSubleaseView(subleases) {
  if (subleases.length === 0) {
    return `
      <div class="card" style="padding:48px; text-align:center;">
        <div style="font-size:36px; margin-bottom:12px">🛏️</div>
        <h3>No hostel / sublease properties found</h3>
        <p class="muted" style="margin-bottom:18px">No properties match your active search or filters. Create and configure a new sublease property.</p>
        <button class="btn dark gold-glow" onclick="window.rentalWizard ? window.rentalWizard.openSlidingPage('sublease') : window.modals.openCreateSubleaseModal()">+ Add Sublease Property</button>
      </div>
    `;
  }

  // Active Selected Sublease ID: either 'all' or a specific sublease ID (defaults to first sublease)
  const currentSelection = window._selectedSubleaseId !== undefined ? window._selectedSubleaseId : subleases[0].id;
  const isAllView = currentSelection === 'all';
  
  // Find currently active property if in single-property inspection mode
  let sub = subleases.find(s => s.id === currentSelection);
  if (!isAllView && !sub) {
    sub = subleases[0];
    window._selectedSubleaseId = sub.id;
  }

  // Calculate current property index for prev/next buttons
  const currentIndex = sub ? subleases.findIndex(s => s.id === sub.id) : 0;
  const prevPropertyId = currentIndex > 0 ? subleases[currentIndex - 1].id : null;
  const nextPropertyId = currentIndex < subleases.length - 1 ? subleases[currentIndex + 1].id : null;

  return `
    <div>
      <!-- Informational Explainer Banner -->
      <div class="card" style="background:#FAF8F2; border-color:var(--gold-border); margin-bottom:16px; padding:12px 18px">
        <div style="display:flex; align-items:center; gap:12px; justify-content:space-between; flex-wrap:wrap">
          <div style="display:flex; align-items:center; gap:10px">
            <div style="width:30px; height:30px; border-radius:50%; background:var(--gold); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px">★</div>
            <div>
              <b style="color:var(--ink); font-size:13px">Master Flat Lease & Co-Living Sublease Hub</b>
              <p style="font-size:11.5px; color:var(--ink-2); margin:1px 0 0 0">
                Filter by specific property below to inspect room floor plans, individual bed occupancies, and live profit spread yields without excessive page length.
              </p>
            </div>
          </div>
          <button class="btn sm gold" onclick="window.rentalWizard ? window.rentalWizard.openSlidingPage('sublease') : window.modals.openCreateSubleaseModal()">+ Add Sublease Property</button>
        </div>
      </div>

      <!-- Sublease Property Selection Filter Strip -->
      <div class="sublease-picker-bar">
        <div class="sublease-picker-head">
          <div style="display:flex; align-items:center; gap:8px">
            <span style="font-size:12.5px; font-weight:700; color:var(--ink)">Property Filter:</span>
            <span class="chip gold xs font-mono">${subleases.length} Portfolios</span>
          </div>
          
          <div style="display:flex; align-items:center; gap:8px">
            <span class="xs muted">Quick Switch:</span>
            <select class="luxury-filter-select" style="padding:4px 8px; font-size:11.5px;" onchange="window.rentalController.selectSubleaseProperty(this.value)">
              <option value="all" ${isAllView ? 'selected' : ''}>🏢 All Properties Summary (${subleases.length})</option>
              ${subleases.map(s => `
                <option value="${s.id}" ${(!isAllView && sub && sub.id === s.id) ? 'selected' : ''}>🛏️ ${s.property} (${s.occupiedBeds || 0}/${s.totalBeds || 0} Beds)</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="sublease-picker-grid">
          <!-- All Properties Overview Pill -->
          <div class="sublease-picker-item ${isAllView ? 'active' : ''}" onclick="window.rentalController.selectSubleaseProperty('all')">
            <div class="sublease-picker-item-top">
              <span class="chip ${isAllView ? 'dark' : 'gray'} xs font-mono">Overview</span>
              <span class="chip gold xs font-mono">${subleases.length} Hubs</span>
            </div>
            <b>🏢 All Sublease Properties</b>
            <div class="sublease-picker-item-foot">
              <span>View high-level summary</span>
              <b style="color:var(--gold-text)">Compact Grid</b>
            </div>
          </div>

          <!-- Individual Property Selection Cards -->
          ${subleases.map(s => {
            const isCardActive = !isAllView && sub && sub.id === s.id;
            return `
              <div class="sublease-picker-item ${isCardActive ? 'active' : ''}" onclick="window.rentalController.selectSubleaseProperty('${s.id}')">
                <div class="sublease-picker-item-top">
                  <span class="chip ${isCardActive ? 'dark' : 'gray'} xs font-mono">${s.outlet}</span>
                  <span class="chip ${s.occupiedBeds === s.totalBeds ? 'green' : 'amber'} xs font-mono">${s.occupiedBeds || 0}/${s.totalBeds || 0} Beds</span>
                </div>
                <b title="${s.property}">${s.property}</b>
                <div class="sublease-picker-item-foot">
                  <span>📍 ${(s.location || '').split(',')[0]}</span>
                  <b style="color:var(--green)">${s.netMonthlyMargin || '+₹24.5k'} spread</b>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- VIEW MODE 1: ALL PROPERTIES COMPACT SUMMARY GRID -->
      ${isAllView ? `
        <div class="sublease-summary-grid">
          ${subleases.map(s => {
            const occPct = (s.totalBeds && s.totalBeds > 0) ? Math.round(((s.occupiedBeds || 0) / s.totalBeds) * 100) : 0;
            return `
              <div class="sublease-summary-card">
                <div class="sublease-summary-media">
                  <img src="${s.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}" alt="${s.property}" loading="lazy">
                  <div class="sublease-summary-overlay">
                    <div style="display:flex; justify-content:space-between; align-items:center">
                      <span class="chip dark xs">${s.outlet}</span>
                      <span class="chip ${s.subleaseNocVerified ? 'green' : 'amber'} xs">${s.subleaseNocVerified ? '✓ NOC Verified' : '⚠ NOC Pending'}</span>
                    </div>
                    <div>
                      <span class="chip gold xs" style="background:rgba(191,151,62,0.9); color:#FFF">${s.type}</span>
                    </div>
                  </div>
                </div>

                <div class="sublease-summary-body">
                  <div>
                    <h3 style="font-size:15px; font-weight:700; color:var(--ink); margin:0 0 2px 0">${s.property}</h3>
                    <p style="font-size:11.5px; color:var(--ink-2); margin:0">📍 ${s.location}</p>
                  </div>

                  <!-- Occupancy Progress -->
                  <div class="sublease-progress-wrap">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--ink-2)">
                      <span>Occupancy Rate</span>
                      <b style="color:var(--ink)">${s.occupiedBeds || 0}/${s.totalBeds || 0} Beds (${occPct}%)</b>
                    </div>
                    <div class="sublease-progress-bar">
                      <div class="sublease-progress-fill" style="width:${occPct}%;"></div>
                    </div>
                  </div>

                  <!-- Master Rent vs Sublease Revenue -->
                  <div class="sublease-metrics-strip">
                    <div class="sublease-metric-item">
                      <span>Master Outflow</span>
                      <b>${s.masterRent} <small style="font-size:10px; color:var(--ink-3); font-weight:400">/mo</small></b>
                    </div>
                    <div class="sublease-metric-item">
                      <span>Sublease Inflow</span>
                      <b style="color:var(--blue)">${s.subleaseRevenue} <small style="font-size:10px; color:var(--ink-3); font-weight:400">/mo</small></b>
                    </div>
                  </div>

                  <!-- Net Spread Yield -->
                  <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:var(--r-sm); padding:8px 12px; display:flex; justify-content:space-between; align-items:center">
                    <span style="font-size:11px; color:#166534; font-weight:600">Net Monthly Spread:</span>
                    <b style="font-size:14px; color:#15803D">${s.netMonthlyMargin || '+₹27,000'} <small style="font-size:10.5px">(${s.marginRoi || '+35%'})</small></b>
                  </div>
                </div>

                <div class="sublease-summary-footer">
                  <span class="xs muted">Owner: <b>${(s.landlord || '').split('(')[0]}</b></span>
                  <div style="display:flex; gap:6px">
                    <button class="btn sm dark gold-glow" onclick="window.rentalController.selectSubleaseProperty('${s.id}')" style="display:inline-flex; align-items:center; gap:5px; font-size:11.5px">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                      Inspect Room Matrix
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- VIEW MODE 2: SINGLE SELECTED PROPERTY COMPREHENSIVE MATRIX -->
        <div class="sublease-card">
          
          <!-- Sublease Card Header with Quick Property Navigation -->
          <div class="sublease-card-head">
            <div>
              <div class="sublease-badge-cluster">
                <span class="chip dark xs">${sub.outlet || 'YOR South'}</span>
                <span class="chip gold xs">Hostel / Co-Living Hub</span>
                <span class="chip ${sub.subleaseNocVerified ? 'green' : 'amber'} xs">
                  ${sub.subleaseNocVerified ? '✓ Landlord NOC Verified (' + (sub.nocDocRef || 'NOC-VERIFIED') + ')' : '⚠ NOC Pending'}
                </span>
                <span class="chip gray xs font-mono">Property ${currentIndex + 1} of ${subleases.length}</span>
              </div>
              <h2 style="font-size:18px; font-weight:700; color:var(--ink); margin:2px 0 0 0">${sub.property}</h2>
              <p style="font-size:12px; color:var(--ink-2); margin:2px 0 0 0">
                📍 ${sub.location} · <b>Landlord:</b> ${sub.landlord} (${sub.landlordPhone || '+91 98409 11223'}) · <b>Audience:</b> ${sub.targetAudience || 'Corporate Executives'}
              </p>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
              <!-- Property Switch Buttons (Prev / Next) -->
              <div style="display:flex; gap:4px">
                <button class="btn sm" ${!prevPropertyId ? 'disabled style="opacity:0.4; cursor:not-allowed"' : `onclick="window.rentalController.selectSubleaseProperty('${prevPropertyId}')"`} title="Previous Property">
                  ← Prev
                </button>
                <button class="btn sm" ${!nextPropertyId ? 'disabled style="opacity:0.4; cursor:not-allowed"' : `onclick="window.rentalController.selectSubleaseProperty('${nextPropertyId}')"`} title="Next Property">
                  Next →
                </button>
              </div>

              <button class="rental-publish-toggle ${sub.appPublished ? 'published' : 'draft'}" onclick="window.rentalController.toggleSubleasePublish('${sub.id}')" title="Toggle public directory visibility">
                <span class="status-dot"></span>
                <span>${sub.appPublished ? 'Published Listing' : 'Internal Only'}</span>
              </button>
              <button class="btn sm" onclick="window.modals.openInvoiceModal()" title="Sublease Agreement Generator">Agreements</button>
            </div>
          </div>

          <!-- Master Lease vs Sublease Profit Spread Banner -->
          <div class="sublease-spread-banner">
            <div class="spread-col">
              <span>Master Lease Outflow (To Landlord)</span>
              <b>${sub.masterRent} <small style="font-size:11px; color:#D1D5DB; font-weight:400">/ mo</small></b>
              <small style="font-size:10.5px; color:#9CA3AF">Advance: ${sub.masterDeposit || '₹1,50,000'}</small>
            </div>

            <div class="spread-col">
              <span>Estimated Utilities & Ops</span>
              <b>${sub.utilityExpenseEst || '₹6,000'}</b>
              <small style="font-size:10.5px; color:#9CA3AF">WiFi, Housekeeping, Power</small>
            </div>

            <div class="spread-col">
              <span>Total Sublease Inflow (From Beds)</span>
              <b style="color:#60A5FA">${sub.subleaseRevenue} <small style="font-size:11px; color:#93C5FD; font-weight:400">/ mo</small></b>
              <small style="font-size:10.5px; color:#9CA3AF">${sub.occupiedBeds || 0}/${sub.totalBeds || 0} Beds Occupied</small>
            </div>

            <div class="spread-col spread-profit">
              <span style="color:#86EFAC">Net Monthly Spread Profit</span>
              <b>${sub.netMonthlyMargin || '+₹24,500'} <small style="font-size:11px; font-weight:600; color:#86EFAC">(${sub.marginRoi || '+34.5%'})</small></b>
              <small style="font-size:10.5px; color:#BBF7D0">Pure Monthly Net Spread Yield</small>
            </div>
          </div>

          <!-- Interactive Visual Room & Bed Matrix for Selected Property ONLY -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
              <h3 style="font-size:14px; font-weight:700; color:var(--ink); margin:0">Visual Room & Bed Allocation Matrix (${sub.property})</h3>
              <span class="xs muted">Click on any vacant bed slot to allocate a tenant</span>
            </div>

            <div class="sublease-rooms-layout">
              ${(sub.rooms || []).map(room => `
                <div class="room-matrix-box">
                  <div class="room-matrix-header">
                    <h4>${room.name}</h4>
                    <span class="chip ${room.ac ? 'blue' : 'gray'} xs">${room.type}</span>
                  </div>

                  <div class="beds-grid">
                    ${(room.beds || []).map(bed => `
                      <div class="bed-unit-slot ${bed.status === 'Occupied' ? 'occupied' : 'vacant'}">
                        
                        <div class="bed-slot-head">
                          <b>${bed.bedNo}</b>
                          <span class="chip ${bed.status === 'Occupied' ? 'green' : 'gray'} xs">${bed.status}</span>
                        </div>

                        ${bed.status === 'Occupied' ? `
                          <div class="bed-slot-occupant">
                            ${bed.occupant}
                            <small>${bed.phone || '+91 98401 00000'}</small>
                          </div>
                          <div class="bed-slot-foot">
                            <b class="num" style="color:var(--green)">₹${(bed.rent || 10000).toLocaleString ? bed.rent.toLocaleString() : bed.rent}</b>
                            <div style="display:flex; gap:4px">
                              <button class="btn xs gold" style="padding:2px 6px; font-size:10px" onclick="window.rentalController.collectBedRent('${sub.id}', '${bed.id}')" title="Record rent payment for this bed">Collect</button>
                              <button class="btn xs" style="padding:2px 6px; font-size:10px" onclick="window.rentalController.vacateBed('${sub.id}', '${bed.id}')" title="Check out / Vacate Bed">Vacate</button>
                            </div>
                          </div>
                        ` : `
                          <div style="text-align:center; padding:6px 0">
                            <span style="font-size:11px; color:var(--gold-text); font-weight:600; display:block">Vacant Slot</span>
                            <span style="font-size:11.5px; font-weight:700; color:var(--ink)">₹${(bed.rent || 10000).toLocaleString ? bed.rent.toLocaleString() : bed.rent} / mo</span>
                          </div>
                          <div class="bed-slot-foot" style="justify-content:center">
                            <button class="btn xs gold" style="width:100%; font-size:10.5px" onclick="window.rentalController.openAssignBed('${sub.id}', '${bed.id}')">+ Assign Tenant</button>
                          </div>
                        `}

                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      `}
    </div>
  `;
}

/* --------------------------------------------------------------------------
   TAB 3: TENANT INQUIRIES & LEADS PIPELINE
   -------------------------------------------------------------------------- */
function renderMobileInquiriesView(inquiries) {
  if (inquiries.length === 0) {
    return `
      <div class="card" style="padding:48px; text-align:center;">
        <div style="font-size:36px; margin-bottom:12px">💬</div>
        <h3>No customer inquiries received yet</h3>
        <p class="muted">Inbound inquiries from interested prospective tenants will appear here in real-time.</p>
      </div>
    `;
  }

  return `
    <div class="inquiries-shell">
      <div class="card" style="padding:14px 18px; display:flex; justify-content:space-between; align-items:center; background:var(--card-2)">
        <div>
          <b style="font-size:13.5px; color:var(--ink)">Tenant Inquiries & Site Visit Scheduler</b>
          <p style="font-size:12px; color:var(--ink-2); margin:2px 0 0 0">Streamlined booking requests submitted by verified prospective tenants across all portal channels.</p>
        </div>
        <span class="chip gold">${inquiries.length} Active Leads</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(400px, 1fr)); gap:14px">
        ${inquiries.map(inq => `
          <div class="inquiry-card">
            
            <div class="inquiry-card-head">
              <div class="inquiry-client-meta">
                <div style="display:flex; align-items:center; gap:8px">
                  <h4>${inq.customerName}</h4>
                  <span class="chip ${inq.source.includes('iOS') ? 'dark' : 'blue'} xs">${inq.source}</span>
                </div>
                <p>📞 ${inq.phone} · ✉️ ${inq.email}</p>
              </div>
              <span class="chip ${inq.status === 'New' ? 'amber' : inq.status === 'Tour Scheduled' ? 'blue' : inq.status === 'Converted' ? 'green' : 'gray'} xs">
                ${inq.status}
              </span>
            </div>

            <!-- Requested Property Specs -->
            <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:8px 12px; display:flex; justify-content:space-between; align-items:center">
              <div>
                <span style="font-size:10.5px; color:var(--ink-3); text-transform:uppercase; font-weight:600">Interested In</span>
                <b style="font-size:12.5px; color:var(--ink); display:block">${inq.requestedProperty}</b>
                <span style="font-size:11px; color:var(--gold-text)">${inq.requestedUnitType}</span>
              </div>
              <div style="text-align:right">
                <span style="font-size:10.5px; color:var(--ink-3); text-transform:uppercase; font-weight:600">Target Budget</span>
                <b style="font-size:13px; color:var(--green); display:block">${inq.budget}</b>
                <span style="font-size:11px; color:var(--ink-2)">Move-in: ${inq.moveInDate}</span>
              </div>
            </div>

            <!-- Message Bubble -->
            <div class="inquiry-message-bubble">
              <b>Message:</b> "${inq.message}"
            </div>

            ${inq.tourTime ? `
              <div style="background:#EBF3FF; border:1px solid #BFDBFE; border-radius:var(--r-sm); padding:6px 12px; font-size:11.5px; color:#1E40AF; display:flex; align-items:center; gap:6px">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Site Tour Scheduled: <b>${inq.tourTime}</b> (Assigned to ${inq.assignedAgent || 'Sarah'})
              </div>
            ` : ''}

            <!-- Card Actions Footer -->
            <div class="inquiry-card-footer">
              <span class="xs muted">Received: ${inq.createdAt}</span>
              <div style="display:flex; gap:6px">
                <button class="btn sm" onclick="window.rentalController.scheduleTour('${inq.id}')">📅 Schedule Tour</button>
                <button class="btn sm gold" onclick="window.rentalController.convertInquiryToLease('${inq.id}')">✓ Convert to Lease</button>
              </div>
            </div>

          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   TAB 4: FINANCIALS & RENT ROLL
   -------------------------------------------------------------------------- */
function renderRentRollView(rentRoll) {
  const totalPaid = rentRoll.reduce((acc, r) => acc + (r.rawPaid || 0), 0);
  const totalDue = rentRoll.reduce((acc, r) => acc + (r.rawDue || 0), 0);
  const overdueCount = rentRoll.filter(r => r.status === 'Overdue').length;

  return `
    <div style="display:flex; flex-direction:column; gap:16px">
      
      <!-- Financial Overview Banner -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px">
        <div class="card" style="padding:14px">
          <span class="xs muted uppercase font-mono">Gross Scheduled Rent</span>
          <b style="font-size:20px; color:var(--ink); display:block; margin-top:4px">₹${(totalDue / 100000).toFixed(2)} L</b>
          <span class="xs muted">May 2026 Cycle</span>
        </div>
        <div class="card" style="padding:14px">
          <span class="xs muted uppercase font-mono">Total Collected</span>
          <b style="font-size:20px; color:var(--green); display:block; margin-top:4px">₹${(totalPaid / 100000).toFixed(2)} L</b>
          <span class="xs up">Verified in Bank</span>
        </div>
        <div class="card" style="padding:14px">
          <span class="xs muted uppercase font-mono">Pending / Overdue</span>
          <b style="font-size:20px; color:var(--red); display:block; margin-top:4px">₹${((totalDue - totalPaid) / 100000).toFixed(2)} L</b>
          <span class="xs warn">${overdueCount} Overdue Invoices</span>
        </div>
        <div class="card" style="padding:14px; background:#FAF8F2; border-color:var(--gold-border)">
          <span class="xs font-mono" style="color:var(--gold-text)">Security Deposits Vault</span>
          <b style="font-size:20px; color:var(--gold-text); display:block; margin-top:4px">₹21.40 L</b>
          <span class="xs" style="color:var(--gold-text)">Held in Escrow Reserves</span>
        </div>
      </div>

      <!-- Rent Roll Register Table -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Rent roll collection ledger</h3>
            <p>Real-time tracking of monthly rental collections and receipt generation</p>
          </div>
          <button class="btn sm gold" onclick="window.rentalController.openRecordRent()">+ Record Payment</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Tenant Name</th>
                <th>Property & Unit/Bed</th>
                <th>Category</th>
                <th>Due Amount</th>
                <th>Due Date</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th class="r">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rentRoll.map(r => `
                <tr>
                  <td class="font-mono" style="font-size:11px; color:var(--gold-text)"><b>${r.receiptNo || 'RCPT-PEND'}</b></td>
                  <td><b>${r.tenantName}</b></td>
                  <td>${r.property} <br><small class="muted">${r.unitOrBed}</small></td>
                  <td><span class="chip gray xs">${r.type}</span></td>
                  <td><b class="num">${r.dueAmount}</b></td>
                  <td class="muted">${r.dueDate}</td>
                  <td><span class="chip xs ${r.status === 'Paid' ? 'blue' : 'gray'}">${r.paymentMode}</span></td>
                  <td>
                    <span class="chip ${r.status === 'Paid' ? 'green' : r.status === 'Overdue' ? 'red' : 'amber'} xs">
                      ${r.status}
                    </span>
                  </td>
                  <td class="r">
                    ${r.status === 'Paid' ? `
                      <button class="btn xs" onclick="window.rentalController.viewReceipt('${r.receiptNo}', '${r.tenantName}', '${r.paidAmount || r.dueAmount}', '${r.property}')">Receipt</button>
                    ` : `
                      <div style="display:inline-flex; gap:4px">
                        <button class="btn xs gold" onclick="window.rentalController.collectRentRoll('${r.id}')" title="Record rent collection for this invoice">Collect</button>
                        <button class="btn xs" onclick="window.rentalController.sendWhatsAppReminder('${r.tenantName}', '${r.property}', '${r.dueAmount}')" title="Send WhatsApp Payment Reminder">Reminder</button>
                      </div>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

/* --------------------------------------------------------------------------
   TAB 5: LEASE AGREEMENTS & LEGAL COMPLIANCE
   -------------------------------------------------------------------------- */
function renderAgreementsView(rentals, subleases) {
  return `
    <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:16px">
      
      <!-- Agreements Table -->
      <div class="card">
        <div class="ch">
          <div>
            <h3>Active lease contracts & digital agreements</h3>
            <p>Executed standard leases and tripartite sublease agreements</p>
          </div>
          <button class="btn sm dark" onclick="window.modals.openInvoiceModal()">+ Generate New Agreement</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Property / Unit</th>
                <th>Tenant / Entity</th>
                <th>Type</th>
                <th>Term</th>
                <th>Expiry</th>
                <th class="r">Document</th>
              </tr>
            </thead>
            <tbody>
              ${rentals.map(r => `
                <tr>
                  <td><b>${r.property}</b></td>
                  <td>${r.tenant}</td>
                  <td><span class="chip gray xs">${r.type}</span></td>
                  <td>24 Months</td>
                  <td class="muted">${r.leaseEnd}</td>
                  <td class="r">
                    <button class="btn xs" onclick="window.modals.showToast('Downloading Agreement for ${r.property} (PDF)...')">PDF</button>
                  </td>
                </tr>
              `).join('')}
              ${subleases.map(s => `
                <tr>
                  <td><b>${s.property} (Sublease)</b></td>
                  <td>${s.landlord} & Sub-tenants</td>
                  <td><span class="chip gold xs">Tripartite PG</span></td>
                  <td>24 Months</td>
                  <td class="muted">${s.masterLeaseEnd}</td>
                  <td class="r">
                    <button class="btn xs gold" onclick="window.modals.showToast('Downloading Tripartite Sublease Contract for ${s.property}...')">PDF</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Legal Compliance & NOC Checklist -->
      <div class="stack">
        <div class="card">
          <div class="ch">
            <div>
              <h3>Landlord Sublease NOC tracker</h3>
              <p>Compliance verification for multi-tenant subleasing</p>
            </div>
            <span class="chip green xs">All Compliant</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px">
            <div style="background:#F4FAF6; border:1px solid #BCE2CD; border-radius:var(--r-sm); padding:10px 12px">
              <b style="font-size:12.5px; color:#1F734C">✓ The Lennox Tower Flat 402</b>
              <p style="font-size:11.5px; color:var(--ink-2); margin:2px 0 0 0">Landlord Dr. K. Varma signed NOC clause allowing 7-bed hostel sublease. Ref: NOC-VRM-2026-01.</p>
            </div>

            <div style="background:#F4FAF6; border:1px solid #BCE2CD; border-radius:var(--r-sm); padding:10px 12px">
              <b style="font-size:12.5px; color:#1F734C">✓ TechHub Executive Residency</b>
              <p style="font-size:11.5px; color:var(--ink-2); margin:2px 0 0 0">Landlord Mrs. Preetha Nair verified NOC with residential society permission. Ref: NOC-PTR-2025-09.</p>
            </div>

            <div style="background:#F4FAF6; border:1px solid #BCE2CD; border-radius:var(--r-sm); padding:10px 12px">
              <b style="font-size:12.5px; color:#1F734C">✓ Greenway Luxury Villa Suite</b>
              <p style="font-size:11.5px; color:var(--ink-2); margin:2px 0 0 0">Owner Mr. Roy Chacko approved remote co-living sublease structure. Ref: NOC-RC-2026-03.</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="ch">
            <div>
              <h3>Standard clause templates</h3>
              <p>Download certified legal formats</p>
            </div>
          </div>
          <ul class="queue">
            <li>
              <div class="qicon">DOC</div>
              <div>
                <b>Residential Tenancy Agreement (Kerala / RERA Model)</b>
                <span>Includes 11-month lock-in and security deposit refund clauses</span>
              </div>
              <button class="btn xs" onclick="window.modals.showToast('Downloaded Residential Lease Template')">Download</button>
            </li>
            <li>
              <div class="qicon" style="background:var(--gold-soft); color:var(--gold-text)">NOC</div>
              <div>
                <b>Landlord Sublease Permission NOC Template</b>
                <span>Statutory indemnity and rent escrow protection</span>
              </div>
              <button class="btn xs gold" onclick="window.modals.showToast('Downloaded Landlord Sublease NOC Template')">Download</button>
            </li>
          </ul>
        </div>
      </div>

    </div>
  `;
}

/* ==========================================================================
   RENTAL PAGE CONTROLLER & INTERACTION HANDLERS
   ========================================================================== */

window.rentalController = {
  setTab(tab) {
    window._rentalActiveTab = tab;
    window.router.navigate('rentals', false);
  },

  selectSubleaseProperty(id) {
    window._selectedSubleaseId = id;
    window.router.navigate('rentals', false);
  },

  setOutletFilter(outlet) {
    window._rentalOutletFilter = outlet;
    window.router.navigate('rentals', false);
  },

  setSearchQuery(query) {
    window._rentalSearchQuery = query;
    window.router.navigate('rentals', false);
    // Keep focus in search input
    setTimeout(() => {
      const input = document.getElementById('rentalSearchInput');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 10);
  },

  clearSearch() {
    window._rentalSearchQuery = "";
    window.router.navigate('rentals', false);
  },

  clearAllFilters() {
    window._rentalSearchQuery = "";
    window._rentalOutletFilter = "all";
    window._rentalPublishFilter = "all";
    window.router.navigate('rentals', false);
  },

  setPublishFilter(filter) {
    window._rentalPublishFilter = filter;
    window.router.navigate('rentals', false);
  },

  togglePublish(rentalId) {
    const isPub = window.store.toggleAppPublish(rentalId);
    window.modals.showToast(isPub 
      ? `Listing published! It is now live in public tenant directories.` 
      : `Listing unpublished and moved to draft.`
    );
    window.router.navigate('rentals', false);
  },

  toggleSubleasePublish(subleaseId) {
    const isPub = window.store.toggleSubleaseAppPublish(subleaseId);
    window.modals.showToast(isPub 
      ? `Hostel beds published! They are now discoverable in tenant directories.` 
      : `Hostel beds hidden from public listing.`
    );
    window.router.navigate('rentals', false);
  },

  openMobilePreview(rentalId) {
    window.modals.openMobileAppPreviewModal(rentalId);
  },

  openRecordRent() {
    window.modals.openRecordRentPaymentModal();
  },

  collectRentalRent(rentalId) {
    window.modals.openRecordRentPaymentModal(rentalId);
  },

  collectBedRent(subleaseId, bedId) {
    const sub = (window.store && window.store.data && window.store.data.subleasePortfolios || []).find(s => s.id === subleaseId);
    let targetBed = null;
    let targetRoom = null;
    if (sub) {
      (sub.rooms || []).forEach(room => {
        (room.beds || []).forEach(b => {
          if (b.id === bedId) {
            targetBed = b;
            targetRoom = room;
          }
        });
      });
    }
    if (targetBed && sub) {
      window.modals.openRecordRentPaymentModal({
        category: 'sublease',
        subleaseId: sub.id,
        bedId: targetBed.id,
        property: sub.property,
        unitOrBed: `${targetRoom ? targetRoom.name : 'Room'} — ${targetBed.bedNo}`,
        tenantName: (targetBed.occupant || '').split('(')[0].trim(),
        tenantPhone: targetBed.phone || '+91 98401 00000',
        amount: targetBed.rent,
        rawAmount: targetBed.rawRent,
        outlet: sub.outlet
      });
    } else {
      window.modals.openRecordRentPaymentModal();
    }
  },

  collectRentRoll(rentRollId) {
    const rr = (window.store && window.store.data && window.store.data.rentRoll || []).find(r => r.id === rentRollId);
    if (rr) {
      window.modals.openRecordRentPaymentModal({
        category: 'rentroll',
        rentRollId: rr.id,
        property: rr.property,
        unitOrBed: rr.unitOrBed,
        tenantName: rr.tenantName,
        amount: rr.dueAmount || rr.paidAmount,
        rawAmount: rr.rawDue || rr.rawPaid,
        outlet: rr.outlet
      });
    } else {
      window.modals.openRecordRentPaymentModal();
    }
  },

  openAssignBed(subleaseId, bedId) {
    window.modals.openAssignBedModal(subleaseId, bedId);
  },

  vacateBed(subleaseId, bedId) {
    if (confirm("Are you sure you want to check out the occupant and mark this bed as Vacant?")) {
      window.store.updateSubleaseBed(subleaseId, bedId, { action: "vacate" });
      window.modals.showToast("Occupant checked out. Bed is now vacant and ready for new tenant.");
      window._rentalActiveTab = 'subleases';
      window.router.navigate('rentals', false);
    }
  },

  scheduleTour(inquiryId) {
    window.modals.openScheduleTourModal(inquiryId);
  },

  convertInquiryToLease(inquiryId) {
    const inq = window.store.data.rentalInquiries.find(i => i.id === inquiryId);
    if (!inq) return;

    window.store.updateInquiryStatus(inquiryId, "Converted");
    window.modals.showToast(`Inquiry for ${inq.customerName} converted to Active Lease! Standard agreement drafted.`);
    window.router.navigate('rentals', false);
  },

  sendWhatsAppReminder(tenantName, property, amount) {
    window.modals.showToast(`WhatsApp rent reminder with UPI payment link sent to ${tenantName} for ${amount}!`);
  },

  viewReceipt(receiptNo, tenantName, amount, property) {
    const rentRoll = (window.store && window.store.data && window.store.data.rentRoll) || [];
    const item = rentRoll.find(r => r.receiptNo === receiptNo) || {
      receiptNo,
      tenantName: tenantName || 'Ahmed Al Faisal',
      paidAmount: amount || '₹55,200',
      property: property || 'Riverside Tower 1203',
      unitOrBed: 'Unit 1203 (3 BHK)',
      paymentMode: 'UPI / PhonePe',
      billingCycle: 'May 2026'
    };
    window.modals.openDigitalReceiptModal(item);
  }
};
