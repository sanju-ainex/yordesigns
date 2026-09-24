/* ==========================================================================
   YOR Estate - Dedicated Sliding Property Creation & Listing Wizard Module
   ========================================================================== */

// Custom Select Component Controller
window.customSelect = {
  toggle(triggerEl) {
    const wrap = triggerEl.closest('.custom-select-wrap');
    if (!wrap) return;
    const wasOpen = wrap.classList.contains('open');
    document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'));
    if (!wasOpen) {
      wrap.classList.add('open');
    }
  },
  select(itemEl) {
    const wrap = itemEl.closest('.custom-select-wrap');
    if (!wrap) return;
    const val = itemEl.getAttribute('data-value');
    const label = itemEl.querySelector('span')?.textContent || val;
    
    // Update trigger label
    const valDisplay = wrap.querySelector('.custom-select-value');
    if (valDisplay) valDisplay.textContent = label;
    
    // Update active class
    wrap.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('selected'));
    itemEl.classList.add('selected');
    
    // Update hidden input
    const hiddenInput = wrap.querySelector('input[type="hidden"]');
    if (hiddenInput) {
      hiddenInput.value = val;
      hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Close dropdown
    wrap.classList.remove('open');
    
    // Live preview sync
    if (window.propertyWizard && window.propertyWizard.syncLivePreview) {
      window.propertyWizard.syncLivePreview();
    }
  }
};

// Global click-outside listener to close open custom selects
if (!window._customSelectListenerBound) {
  window._customSelectListenerBound = true;
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrap')) {
      document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'));
    }
  });
}

// Helper to render luxury custom dropdown components
function renderCustomSelect(id, name, currentValue, options) {
  const selectedOpt = options.find(o => o.value === currentValue) || options[0] || { value: '', label: '' };
  return `
    <div class="custom-select-wrap" id="${id}_wrap">
      <div class="custom-select-trigger" onclick="window.customSelect.toggle(this)">
        <span class="custom-select-value">${selectedOpt.label}</span>
        <svg class="custom-select-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="custom-select-menu">
        ${options.map(o => `
          <div class="custom-select-item ${o.value === currentValue ? 'selected' : ''}" data-value="${o.value}" onclick="window.customSelect.select(this)">
            <span>${o.label}</span>
          </div>
        `).join('')}
      </div>
      <input type="hidden" id="${id}" name="${name}" value="${currentValue}">
    </div>
  `;
}

function renderPropertyNewPage() {
  setTimeout(() => {
    window.router.navigate('properties', false);
    if (window.propertyWizard && window.propertyWizard.openSlidingPage) {
      window.propertyWizard.openSlidingPage();
    }
  }, 10);
  return renderPropertiesPage();
}

// Reusable Form HTML Generator for both Full Page & Sliding Panel
function renderPropertyCreationFormHtml(isSlidingDrawer = false) {
  const store = window.store;
  const draft = (store && store.getPropertyDraft && store.getPropertyDraft()) || {};
  const currentStep = window._propertyWizardStep || 1;

  // Default / Draft Initial State
  const prop = {
    name: draft.name || "",
    surveyNo: draft.surveyNo || "",
    type: draft.type || "Residential",
    category: draft.category || "Luxury Residential Villa",
    location: draft.location || "Bengaluru, KA",
    state: draft.state || "Karnataka",
    district: draft.district || "Bengaluru Urban",
    area: draft.area || "Indiranagar",
    address: draft.address || "",
    pincode: draft.pincode || "560038",
    lat: draft.lat || "12.9716",
    lng: draft.lng || "77.5946",
    outlet: draft.outlet || "YOR Central",
    agent: draft.agent || "Sarah Coleman",
    listingSource: draft.listingSource || "Direct · No broker",

    // Step 2 Specs
    beds: draft.beds || "4 Bed",
    baths: draft.baths || "4 Bath",
    balconies: draft.balconies || "3 Balconies",
    carpetArea: draft.carpetArea || "2,850",
    superArea: draft.superArea || "3,400",
    plotArea: draft.plotArea || "1,240",
    facing: draft.facing || "East Facing",
    vastu: draft.vastu !== undefined ? draft.vastu : true,
    furnishing: draft.furnishing || "Fully Furnished",
    possession: draft.possession || "Ready to Move",
    possessionDate: draft.possessionDate || "Immediate",
    amenities: draft.amenities || ["Infinity Pool", "Smart Home Automation", "Private Elevator", "24/7 Security", "Solar Powered"],

    // Step 3 Financials
    valuationCr: draft.valuationCr || "4.85",
    maintenancePerMonth: draft.maintenancePerMonth || "18,500",
    expectedRental: draft.expectedRental || "2.40",
    rentalYield: draft.rentalYield || "6.8%",
    commissionPct: draft.commissionPct || "2.0%",
    preLoanBanks: draft.preLoanBanks || ["State Bank of India (SBI)", "HDFC Bank", "ICICI Bank"],

    // Step 4 Docs & Media
    docsUploaded: draft.docsUploaded || [
      { name: "Sale Deed & Title Flow (30 yrs)", size: "4.2 MB", status: "Verified" },
      { name: "Encumbrance Certificate (EC Form 15)", size: "2.1 MB", status: "Verified" },
      { name: "Khata Certificate / Patta Extract", size: "1.8 MB", status: "Verified" }
    ],
    imagesUploaded: draft.imagesUploaded || 4,
    floorPlanUploaded: draft.floorPlanUploaded || true,
    virtualTourUrl: draft.virtualTourUrl || "https://matterport.com/discover/space/sample-yor-estate",

    // Review & Publishing
    legalStatus: draft.legalStatus || "Verified",
    savedAt: draft.savedAt || null
  };

  // Pre-calculate derived metrics
  const valNum = parseFloat(prop.valuationCr) || 4.85;
  const areaNum = parseFloat(String(prop.carpetArea).replace(/,/g, '')) || 2850;
  const pricePerSqFt = areaNum > 0 ? Math.round((valNum * 10000000) / areaNum) : 17017;
  const stampDuty = (valNum * 5.6).toFixed(1);

  return `
    <!-- Top Header Bar & Stepper inside Dedicated Sticky Wrapper -->
    <div class="drawer-header-sticky-wrap">
      <div class="user-wizard-top">
        <div class="user-wizard-title-wrap">
          <div class="user-wizard-crumbs">
            <a href="#properties" onclick="window.propertyWizard.closeSlidingPage(); return false;">Properties & Survey Register</a>
            <span>/</span>
            <span>${isSlidingDrawer ? 'Add Property Record' : 'New Property Wizard'}</span>
          </div>
          <h1>${isSlidingDrawer ? '+ Onboard New Property Record' : '+ Add New Property Record'}</h1>
          <p>Comprehensive step-by-step luxury property onboarding with real-time auto-saving and bank pre-approval verification.</p>
        </div>

        <div class="user-wizard-top-actions">
          <button class="btn sm" id="btnFillDemoData" onclick="window.propertyWizard.fillDemoData()" title="Pre-fill with realistic luxury property data">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Fill Demo Data
          </button>
          <button class="btn sm" id="btnSaveDraft" onclick="window.propertyWizard.saveDraft(false)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Draft
          </button>
          <button class="btn" onclick="window.propertyWizard.closeSlidingPage()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
          <button class="btn dark gold-glow" onclick="window.propertyWizard.submitProperty()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Publish Property
          </button>
        </div>
      </div>

      <!-- Stepper Navigation Bar -->
      <div class="card wizard-stepper-card" style="padding: 12px 18px;">
        <div class="wizard-stepper">
          
          <div class="wizard-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}" data-step="1" onclick="window.propertyWizard.goToStep(1)">
            <div class="step-badge">${currentStep > 1 ? '✓' : '1'}</div>
            <div class="step-meta">
              <span class="step-num">Step 1</span>
              <b class="step-title">Identity & Location</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 1 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}" data-step="2" onclick="window.propertyWizard.goToStep(2)">
            <div class="step-badge">${currentStep > 2 ? '✓' : '2'}</div>
            <div class="step-meta">
              <span class="step-num">Step 2</span>
              <b class="step-title">Specs & Architecture</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 2 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}" data-step="3" onclick="window.propertyWizard.goToStep(3)">
            <div class="step-badge">${currentStep > 3 ? '✓' : '3'}</div>
            <div class="step-meta">
              <span class="step-num">Step 3</span>
              <b class="step-title">Pricing & Pre-Loan</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 3 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}" data-step="4" onclick="window.propertyWizard.goToStep(4)">
            <div class="step-badge">${currentStep > 4 ? '✓' : '4'}</div>
            <div class="step-meta">
              <span class="step-num">Step 4</span>
              <b class="step-title">Legal & Media</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 4 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 5 ? 'active' : ''}" data-step="5" onclick="window.propertyWizard.goToStep(5)">
            <div class="step-badge">5</div>
            <div class="step-meta">
              <span class="step-num">Step 5</span>
              <b class="step-title">Review & Publish</b>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Main Wizard 2-Column Grid: Form on Left (68%), Sticky Live Preview on Right (32%) -->
    <div class="grid-wizard">
      
      <!-- LEFT: Multi-Step Interactive Form -->
      <div class="stack">
        <form id="propertyWizardForm" onsubmit="return false;">

          <!-- STEP 1: IDENTITY & LOCATION -->
          <div class="card wizard-panel ${currentStep === 1 ? 'active' : ''}" id="stepPanel1" style="padding:22px;">
            <div class="ch" style="margin-bottom:18px;">
              <div>
                <h3 style="font-size:16px; font-weight:600;">1. Property Identity & Location Coordinates</h3>
                <p style="font-size:12.5px; color:var(--ink-2);">Assign immutable Survey Number, micro-market address, and branch ownership.</p>
              </div>
              <span class="chip blue xs">Survey Identification</span>
            </div>

            <div class="wizard-form-body">
              <div class="field">
                <label>Property Marketing Name <span class="req">*</span></label>
                <div class="input-wrap">
                  <input type="text" id="wiz_name" name="name" required value="${prop.name}" placeholder="e.g. Forest Ridge Luxury Residence" oninput="window.propertyWizard.syncLivePreview()">
                </div>
                <small class="muted">Descriptive public marketing title for investor portals & client brochures.</small>
              </div>

              <div class="grid-2" style="gap: 14px;">
                <div class="field">
                  <label>Survey Number (Immutable Unique ID) <span class="req">*</span></label>
                  <div class="input-wrap">
                    <input type="text" id="wiz_surveyNo" name="surveyNo" required value="${prop.surveyNo}" placeholder="e.g. Survey 456/38" class="font-mono" oninput="window.propertyWizard.syncLivePreview()">
                  </div>
                  <small class="muted">Official revenue land survey record identifier.</small>
                </div>

                <div class="field">
                  <label>Property Category</label>
                  ${renderCustomSelect("wiz_category", "category", prop.category, [
                    { value: "Luxury Residential Villa", label: "Luxury Residential Villa" },
                    { value: "Sky Penthouse & High-Rise", label: "Sky Penthouse & High-Rise" },
                    { value: "Waterfront Estate", label: "Waterfront Estate" },
                    { value: "Gated Plot & Land", label: "Gated Plot & Land" },
                    { value: "Commercial Complex", label: "Commercial Complex" },
                    { value: "Coffee Plantation & Estate", label: "Coffee Plantation & Estate" }
                  ])}
                </div>
              </div>

              <div class="grid-3" style="gap: 14px;">
                <div class="field">
                  <label>State Workflow Jurisdiction</label>
                  ${renderCustomSelect("wiz_state", "state", prop.state, [
                    { value: "Karnataka", label: "Karnataka" },
                    { value: "Maharashtra", label: "Maharashtra" },
                    { value: "Tamil Nadu", label: "Tamil Nadu" },
                    { value: "Kerala", label: "Kerala" },
                    { value: "Telangana", label: "Telangana" },
                    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                    { value: "Delhi NCR", label: "Delhi NCR" }
                  ])}
                </div>

                <div class="field">
                  <label>City / District</label>
                  <div class="input-wrap">
                    <input type="text" id="wiz_district" name="district" value="${prop.district}" placeholder="e.g. Bengaluru Urban" oninput="window.propertyWizard.syncLivePreview()">
                  </div>
                </div>

                <div class="field">
                  <label>Micro-Market / Neighborhood</label>
                  <div class="input-wrap">
                    <input type="text" id="wiz_area" name="area" value="${prop.area}" placeholder="e.g. Indiranagar" oninput="window.propertyWizard.syncLivePreview()">
                  </div>
                </div>
              </div>

              <div class="field">
                <label>Full Property Street Address</label>
                <div class="input-wrap">
                  <input type="text" id="wiz_address" name="address" value="${prop.address}" placeholder="Plot 18, 12th Main Rd, HAL 2nd Stage, Indiranagar" oninput="window.propertyWizard.syncLivePreview()">
                </div>
              </div>

              <div class="grid-2" style="gap: 14px;">
                <div class="field">
                  <label>Assigned Branch Outlet</label>
                  ${renderCustomSelect("wiz_outlet", "outlet", prop.outlet, [
                    { value: "YOR Central", label: "YOR Central (Kochi - HQ)" },
                    { value: "YOR South", label: "YOR South (Kozhikode)" },
                    { value: "YOR North", label: "YOR North (Kannur)" },
                    { value: "YOR West", label: "YOR West (Idukki)" }
                  ])}
                </div>

                <div class="field">
                  <label>Lead Relationship Manager</label>
                  ${renderCustomSelect("wiz_agent", "agent", prop.agent, [
                    { value: "Sarah Coleman", label: "Sarah Coleman (Senior Portfolio Mgr)" },
                    { value: "Riyas Ali", label: "Riyas Ali (Luxury Specialist)" },
                    { value: "Priya Nair", label: "Priya Nair (Principal Consultant)" },
                    { value: "Arjun Rao", label: "Arjun Rao (Commercial Lead)" }
                  ])}
                </div>
              </div>
            </div>

            <div class="wizard-actions">
              <span class="muted xs font-mono" id="wiz_draftMsg">${prop.savedAt ? 'Draft saved ' + new Date(prop.savedAt).toLocaleTimeString() : 'Auto-save active'}</span>
              <button class="btn dark" type="button" onclick="window.propertyWizard.nextStep(1)">
                Continue to Specs & Architecture →
              </button>
            </div>
          </div>

          <!-- STEP 2: SPECS & ARCHITECTURE -->
          <div class="card wizard-panel ${currentStep === 2 ? 'active' : ''}" id="stepPanel2" style="padding:22px;">
            <div class="ch" style="margin-bottom:18px;">
              <div>
                <h3 style="font-size:16px; font-weight:600;">2. Architecture, Layout & Specifications</h3>
                <p style="font-size:12.5px; color:var(--ink-2);">Define floor configurations, area measurements, facing, and luxury amenities.</p>
              </div>
              <span class="chip gold xs">Spatial Profile</span>
            </div>

            <div class="wizard-form-body">
              <div class="grid-3" style="gap: 14px;">
                <div class="field">
                  <label>Bedrooms Layout</label>
                  ${renderCustomSelect("wiz_beds", "beds", prop.beds, [
                    { value: "3 Bed", label: "3 Bedrooms (3 BHK)" },
                    { value: "4 Bed", label: "4 Bedrooms (4 BHK)" },
                    { value: "5 Bed", label: "5 Bedrooms (5 BHK)" },
                    { value: "6 Bed", label: "6+ Bedrooms Luxury Estate" },
                    { value: "Plot / Land", label: "N/A (Plot / Land)" }
                  ])}
                </div>

                <div class="field">
                  <label>Bathrooms</label>
                  ${renderCustomSelect("wiz_baths", "baths", prop.baths, [
                    { value: "3 Bath", label: "3 Bathrooms" },
                    { value: "4 Bath", label: "4 Bathrooms" },
                    { value: "5 Bath", label: "5 Bathrooms + Powder Rm" },
                    { value: "6 Bath", label: "6+ En-suite Baths" }
                  ])}
                </div>

                <div class="field">
                  <label>Balconies / Decks</label>
                  ${renderCustomSelect("wiz_balconies", "balconies", prop.balconies, [
                    { value: "2 Balconies", label: "2 Balconies" },
                    { value: "3 Balconies", label: "3 Balconies" },
                    { value: "Wrap-around Terrace", label: "Wrap-around Terrace" }
                  ])}
                </div>
              </div>

              <div class="grid-3" style="gap: 14px;">
                <div class="field">
                  <label>Carpet Area (sq.ft) <span class="req">*</span></label>
                  <div class="input-wrap">
                    <input type="number" id="wiz_carpetArea" name="carpetArea" value="${prop.carpetArea}" placeholder="2850" oninput="window.propertyWizard.syncLivePreview()">
                  </div>
                  <small class="muted">Net usable internal floor area.</small>
                </div>

                <div class="field">
                  <label>Super Built-Up Area (sq.ft)</label>
                  <div class="input-wrap">
                    <input type="number" id="wiz_superArea" name="superArea" value="${prop.superArea}" placeholder="3400">
                  </div>
                  <small class="muted">Includes common areas & walls.</small>
                </div>

                <div class="field">
                  <label>Plot / Land Area (sqm / cents)</label>
                  <div class="input-wrap">
                    <input type="text" id="wiz_plotArea" name="plotArea" value="${prop.plotArea}" placeholder="e.g. 1,240 sqm">
                  </div>
                </div>
              </div>

              <div class="grid-3" style="gap: 14px;">
                <div class="field">
                  <label>Facing Direction</label>
                  ${renderCustomSelect("wiz_facing", "facing", prop.facing, [
                    { value: "East Facing", label: "East Facing" },
                    { value: "North Facing", label: "North Facing" },
                    { value: "North-East Facing", label: "North-East (Ishan)" },
                    { value: "West Facing", label: "West Facing" },
                    { value: "South Facing", label: "South Facing" }
                  ])}
                </div>

                <div class="field">
                  <label>Furnishing Status</label>
                  ${renderCustomSelect("wiz_furnishing", "furnishing", prop.furnishing, [
                    { value: "Fully Furnished", label: "Fully Furnished (Designer)" },
                    { value: "Semi-Furnished", label: "Semi-Furnished" },
                    { value: "Bare Shell", label: "Bare Shell / Raw" }
                  ])}
                </div>

                <div class="field">
                  <label>Possession Timeline</label>
                  ${renderCustomSelect("wiz_possession", "possession", prop.possession, [
                    { value: "Ready to Move", label: "Ready to Move" },
                    { value: "Under Construction (30d)", label: "Under Construction (30d)" },
                    { value: "Under Construction (90d)", label: "Under Construction (90d)" },
                    { value: "New Launch", label: "New Launch" }
                  ])}
                </div>
              </div>

              <!-- Luxury Amenities Selector -->
              <div class="field">
                <label>Signature Amenities & Highlights</label>
                <div class="amenities-picker-grid">
                  ${[
                    "Infinity Pool",
                    "Smart Home Automation",
                    "Private Elevator",
                    "24/7 Security & Concierge",
                    "Solar Powered & Green Rated",
                    "EV Charging Bay",
                    "Italian Marble Flooring",
                    "Private Rooftop Deck",
                    "Clubhouse & Gym Access",
                    "Dedicated Staff Quarters",
                    "Imported Modular Kitchen",
                    "Centralized VRV Air Conditioning"
                  ].map(amenity => {
                    const isChecked = prop.amenities.includes(amenity);
                    return `
                      <label class="amenity-chip ${isChecked ? 'selected' : ''}">
                        <input type="checkbox" name="amenity" value="${amenity}" ${isChecked ? 'checked' : ''} onchange="window.propertyWizard.toggleAmenity(this)">
                        <span>${amenity}</span>
                      </label>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <div class="wizard-actions">
              <button class="btn" type="button" onclick="window.propertyWizard.prevStep(2)">
                ← Back to Location
              </button>
              <button class="btn dark" type="button" onclick="window.propertyWizard.nextStep(2)">
                Continue to Pricing & Pre-Loan →
              </button>
            </div>
          </div>

          <!-- STEP 3: PRICING & BANK PRE-APPROVALS -->
          <div class="card wizard-panel ${currentStep === 3 ? 'active' : ''}" id="stepPanel3" style="padding:22px;">
            <div class="ch" style="margin-bottom:18px;">
              <div>
                <h3 style="font-size:16px; font-weight:600;">3. Valuation, Pricing & Pre-Loan Bank Approvals</h3>
                <p style="font-size:12.5px; color:var(--ink-2);">Set asset valuation, calculate ₹/sq.ft metrics, and attach pre-approved bank loans.</p>
              </div>
              <span class="chip green xs">Financial Clearance</span>
            </div>

            <div class="wizard-form-body">
              <div class="grid-2" style="gap: 16px;">
                <div class="field">
                  <label>Asking Valuation / Price (₹ Crores) <span class="req">*</span></label>
                  <div class="input-wrap">
                    <span style="padding-left:12px; font-weight:600; color:var(--ink)">₹</span>
                    <input type="number" step="0.01" id="wiz_valuationCr" name="valuationCr" value="${prop.valuationCr}" placeholder="4.85" style="padding-left:4px" oninput="window.propertyWizard.syncLivePreview()">
                    <span style="padding-right:12px; font-size:12px; color:var(--ink-2)">Cr</span>
                  </div>
                  <small class="muted">Total asset transaction value.</small>
                </div>

                <div class="field">
                  <label>Estimated ₹ / sq.ft (Auto-computed)</label>
                  <div class="input-wrap disabled" style="background:#F7F7F5">
                    <input type="text" id="wiz_pricePerSqFtDisplay" readonly value="₹ ${pricePerSqFt.toLocaleString()} / sq.ft" class="font-mono">
                  </div>
                  <small class="muted">Based on ₹${prop.valuationCr} Cr and ${prop.carpetArea} sq.ft carpet area.</small>
                </div>
              </div>

              <div class="grid-3" style="gap: 14px;">
                <div class="field">
                  <label>Expected Rental Inflow (₹ L/mo)</label>
                  <div class="input-wrap">
                    <input type="number" step="0.05" id="wiz_expectedRental" name="expectedRental" value="${prop.expectedRental}" placeholder="2.40" oninput="window.propertyWizard.syncLivePreview()">
                    <span style="padding-right:12px; font-size:11px; color:var(--ink-2)">L / mo</span>
                  </div>
                </div>

                <div class="field">
                  <label>Net Rental Yield (%)</label>
                  <div class="input-wrap">
                    <input type="text" id="wiz_rentalYield" name="rentalYield" value="${prop.rentalYield}" placeholder="6.8%" oninput="window.propertyWizard.syncLivePreview()">
                  </div>
                </div>

                <div class="field">
                  <label>Monthly Maintenance (₹)</label>
                  <div class="input-wrap">
                    <input type="text" id="wiz_maintenance" name="maintenance" value="${prop.maintenancePerMonth}" placeholder="18,500">
                  </div>
                </div>
              </div>

              <!-- PRE-LOAN BANK APPROVAL MATRIX -->
              <div class="field" style="margin-top: 10px;">
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
                  <label style="margin:0;">Pre-Loan Approved Banks (APF Sanctions)</label>
                  <span class="chip green xs">Pre-Screened</span>
                </div>
                <p style="font-size:11.5px; color:var(--ink-2); margin-bottom:10px;">Select financial institutions that have pre-cleared this property's title and sanctioned home loan disbursement eligibility.</p>
                
                <div class="bank-picker-grid">
                  ${[
                    { name: "State Bank of India (SBI)", code: "SBI-APF-2026", rate: "8.40%" },
                    { name: "HDFC Bank", code: "HDFC-PRE-891", rate: "8.50%" },
                    { name: "ICICI Bank", code: "ICICI-HOM-402", rate: "8.55%" },
                    { name: "Axis Bank", code: "AXIS-APF-119", rate: "8.65%" },
                    { name: "Kotak Mahindra Bank", code: "KOTAK-PR-334", rate: "8.60%" },
                    { name: "Bank of Baroda", code: "BOB-HL-882", rate: "8.45%" }
                  ].map(bank => {
                    const isSelected = prop.preLoanBanks.includes(bank.name);
                    return `
                      <div class="bank-card-pill ${isSelected ? 'selected' : ''}" onclick="window.propertyWizard.toggleBank('${bank.name}', this)">
                        <div style="display:flex; align-items:center; gap:8px;">
                          <div class="bank-check-dot">${isSelected ? '✓' : ''}</div>
                          <div>
                            <b>${bank.name}</b>
                            <span>Code: ${bank.code} · From ${bank.rate}</span>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <div class="wizard-actions">
              <button class="btn" type="button" onclick="window.propertyWizard.prevStep(3)">
                ← Back to Specs
              </button>
              <button class="btn dark" type="button" onclick="window.propertyWizard.nextStep(3)">
                Continue to Legal & Media →
              </button>
            </div>
          </div>

          <!-- STEP 4: LEGAL DEEDS & MEDIA ASSETS -->
          <div class="card wizard-panel ${currentStep === 4 ? 'active' : ''}" id="stepPanel4" style="padding:22px;">
            <div class="ch" style="margin-bottom:18px;">
              <div>
                <h3 style="font-size:16px; font-weight:600;">4. Legal Documentation, Deeds & Media Assets</h3>
                <p style="font-size:12.5px; color:var(--ink-2);">Upload property title deeds, 30-year EC search reports, and visual photo galleries.</p>
              </div>
              <span class="chip blue xs">Deed Vault</span>
            </div>

            <div class="wizard-form-body">
              <div class="field">
                <label>Mandatory Title Deeds & Search Records</label>
                <div class="doc-upload-dropzone" onclick="window.propertyWizard.simulateDocUpload()">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div style="text-align:center;">
                    <b>Click to Upload Title Deeds & Encumbrance Certificates</b>
                    <span>Supports PDF, DOCX, scanned 7/12 & Patta extracts (Up to 25MB each)</span>
                  </div>
                </div>

                <div class="uploaded-docs-list" id="wiz_docList" style="margin-top:12px;">
                  ${prop.docsUploaded.map((doc, idx) => `
                    <div class="uploaded-doc-item">
                      <div style="display:flex; align-items:center; gap:10px;">
                        <span class="chip gray xs font-mono">PDF</span>
                        <div>
                          <b>${doc.name}</b>
                          <span>${doc.size} · Legal Verification Passed</span>
                        </div>
                      </div>
                      <span class="chip green xs">Verified ✓</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Visual Photo Gallery -->
              <div class="field" style="margin-top: 18px;">
                <label>Property Photo Gallery (Hero & Interior Shots)</label>
                <div class="gallery-preview-grid">
                  <div class="gallery-slot hero">
                    <div class="gallery-slot-tag">Hero Facade</div>
                  </div>
                  <div class="gallery-slot living">
                    <div class="gallery-slot-tag">Living Lounge</div>
                  </div>
                  <div class="gallery-slot master">
                    <div class="gallery-slot-tag">Master Suite</div>
                  </div>
                  <div class="gallery-slot add-photo" onclick="window.propertyWizard.simulatePhotoUpload()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>+ Add Photo</span>
                  </div>
                </div>
              </div>

              <div class="field">
                <label>360° Virtual Tour / Matterport Walkthrough Link</label>
                <div class="input-wrap">
                  <input type="url" id="wiz_virtualTourUrl" name="virtualTourUrl" value="${prop.virtualTourUrl}" placeholder="https://matterport.com/discover/space/...">
                </div>
              </div>
            </div>

            <div class="wizard-actions">
              <button class="btn" type="button" onclick="window.propertyWizard.prevStep(4)">
                ← Back to Pricing
              </button>
              <button class="btn dark" type="button" onclick="window.propertyWizard.nextStep(4)">
                Review & Publish Listing →
              </button>
            </div>
          </div>

          <!-- STEP 5: REVIEW & PUBLISH -->
          <div class="card wizard-panel ${currentStep === 5 ? 'active' : ''}" id="stepPanel5" style="padding:22px;">
            <div class="ch" style="margin-bottom:18px;">
              <div>
                <h3 style="font-size:16px; font-weight:600;">5. Final Verification & Publishing</h3>
                <p style="font-size:12.5px; color:var(--ink-2);">Confirm listing specs, review compliance readiness, and publish to active portfolio.</p>
              </div>
              <span class="chip green xs">Ready to Publish</span>
            </div>

            <div class="wizard-form-body">
              <!-- Completeness Score Strip -->
              <div class="completeness-banner">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="score-circle">96%</div>
                    <div>
                      <b>Data Completeness Score: Excellent</b>
                      <span>All required survey records, legal deeds & bank approvals attached.</span>
                    </div>
                  </div>
                  <span class="chip green">Ready for Market</span>
                </div>
                <div class="progress green" style="height:6px;"><i style="width:96%"></i></div>
              </div>

              <!-- Verification Checklist Summary -->
              <div class="review-check-list" style="margin:16px 0;">
                <div class="review-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F734C" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <b>Revenue Survey Number: ${prop.surveyNo || 'Survey 456/38'}</b>
                    <span>Matched with regional land registry database.</span>
                  </div>
                </div>

                <div class="review-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F734C" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <b>Pre-Loan Bank Clearances Attached</b>
                    <span>Pre-approved by ${prop.preLoanBanks.join(', ')}.</span>
                  </div>
                </div>

                <div class="review-check-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F734C" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <b>Legal Deeds & Title Flow</b>
                    <span>${prop.docsUploaded.length} verified documents stored in audit vault.</span>
                  </div>
                </div>
              </div>

              <!-- Publishing Options -->
              <div class="field" style="margin-top:16px;">
                <label>Select Publishing Mode</label>
                <div class="grid-3" style="gap:12px;">
                  <label class="publish-mode-card selected">
                    <input type="radio" name="pubMode" value="active" checked>
                    <b>Publish Active Listing</b>
                    <span>Immediately available across Super Admin, Sales CRM & Investor Portal.</span>
                  </label>
                  <label class="publish-mode-card">
                    <input type="radio" name="pubMode" value="review">
                    <b>Submit for HO Sign-Off</b>
                    <span>Place in Head Office Legal queue for final approval stamp.</span>
                  </label>
                  <label class="publish-mode-card">
                    <input type="radio" name="pubMode" value="draft">
                    <b>Keep as Internal Draft</b>
                    <span>Save property record in internal outlet staging.</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="wizard-actions">
              <button class="btn" type="button" onclick="window.propertyWizard.prevStep(5)">
                ← Back to Legal
              </button>
              <button class="btn dark gold-glow" type="button" id="btnPublishFinal" onclick="window.propertyWizard.submitProperty()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Complete & Publish Property
              </button>
            </div>
          </div>

        </form>
      </div>

      <!-- RIGHT: Sticky Real-time Luxury Preview Card & Financial Summary -->
      <div class="wizard-sidebar">
        
        <!-- Live Property Card -->
        <div class="card luxury-preview-card">
          <div class="preview-hero-img">
            <div class="preview-tag-row">
              <span class="chip gold xs" id="prev_surveyNo">${prop.surveyNo || 'Survey 456/38'}</span>
              <span class="chip green xs" id="prev_legalStatus">Deal-Ready ✓</span>
            </div>
            <div class="preview-outlet-chip" id="prev_outlet">${prop.outlet || 'YOR Central'}</div>
          </div>

          <div class="preview-body">
            <div class="preview-category" id="prev_category">${prop.category}</div>
            <h3 class="preview-title" id="prev_name">${prop.name || 'Forest Ridge Luxury Residence'}</h3>
            <p class="preview-location" id="prev_location">${prop.area}, ${prop.district} · ${prop.state}</p>

            <div class="preview-spec-row">
              <span id="prev_beds">${prop.beds}</span>
              <span id="prev_baths">${prop.baths}</span>
              <span id="prev_carpetArea">${prop.carpetArea} sq.ft</span>
            </div>

            <div class="preview-price-strip">
              <div>
                <span class="preview-price-label">Valuation</span>
                <div class="preview-price-val" id="prev_valuation">₹ ${prop.valuationCr} Cr</div>
              </div>
              <div style="text-align:right">
                <span class="preview-price-label">Est. ₹ / sq.ft</span>
                <div class="preview-rate-val" id="prev_rate">₹ ${pricePerSqFt.toLocaleString()}</div>
              </div>
            </div>

            <!-- Pre-Loan Bank Pills in Preview -->
            <div class="preview-banks-section">
              <span class="preview-banks-label">Pre-Loan Approved By:</span>
              <div class="preview-bank-tags" id="prev_banks">
                ${prop.preLoanBanks.map(b => `<span class="chip gray xs">${b.split(' ')[0]}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Valuation Breakdown Card -->
        <div class="card" style="padding: 16px;">
          <div class="ch" style="margin-bottom: 12px;">
            <div>
              <b style="font-size: 13px;">Financial Breakdown</b>
              <p style="font-size: 11px;">Estimated acquisition metrics</p>
            </div>
          </div>

          <div class="preview-breakdown-list">
            <div class="breakdown-row">
              <span>Base Asking Valuation</span>
              <b id="prev_breakdown_base">₹ ${prop.valuationCr} Cr</b>
            </div>
            <div class="breakdown-row">
              <span>Est. Stamp Duty & Reg (5.6%)</span>
              <b id="prev_breakdown_stamp">₹ ${stampDuty} L</b>
            </div>
            <div class="breakdown-row">
              <span>Monthly Rental Cashflow</span>
              <b id="prev_breakdown_rent" style="color:var(--green)">₹ ${prop.expectedRental} L / mo</b>
            </div>
            <div class="breakdown-row total">
              <span>Net Annual Yield</span>
              <b id="prev_breakdown_yield" style="color:var(--accent)">${prop.rentalYield} p.a.</b>
            </div>
          </div>
        </div>

        <!-- Relationship Manager Card -->
        <div class="card" style="padding: 14px 16px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="rm-avatar" id="prev_rm_avatar">SC</div>
            <div>
              <span style="font-size:10px; color:var(--ink-3); text-transform:uppercase; letter-spacing:0.04em;">Assigned Manager</span>
              <b style="display:block; font-size:13px;" id="prev_rm_name">${prop.agent}</b>
              <span style="font-size:11px; color:var(--ink-2);" id="prev_rm_outlet">${prop.outlet} Branch</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// Global Property Onboarding & Sliding Drawer Controller
window.propertyWizard = {
  // Open Sliding Page Drawer
  openSlidingPage() {
    let drawerOverlay = document.getElementById('propertySlidingDrawerOverlay');
    if (!drawerOverlay) {
      drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'propertySlidingDrawerOverlay';
      drawerOverlay.className = 'property-sliding-drawer-overlay';
      drawerOverlay.innerHTML = `
        <div class="property-sliding-drawer-backdrop" onclick="window.propertyWizard.closeSlidingPage()"></div>
        <div class="property-sliding-drawer-panel" id="propertySlidingDrawerPanel">
          <!-- Dynamic Content Injected Here -->
        </div>
      `;
      document.body.appendChild(drawerOverlay);
    }

    const panel = document.getElementById('propertySlidingDrawerPanel');
    drawerOverlay.classList.remove('open');
    panel.innerHTML = renderPropertyCreationFormHtml(true);
    panel.scrollTop = 0;
    panel.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Initialize state, steps, and live preview without scrolling
    window._propertyWizardStep = 1;
    for (let i = 1; i <= 5; i++) {
      const p = document.getElementById(`stepPanel${i}`);
      if (p) p.classList.toggle('active', i === 1);
    }
    this.syncLivePreview();

    // Force reflow so browser registers off-screen translateX(100%) initial state
    void drawerOverlay.offsetWidth;
    void panel.offsetWidth;

    // Trigger smooth, luxurious Right-to-Left slide
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drawerOverlay.classList.add('open');
        panel.scrollTop = 0;
        panel.scrollTo(0, 0);
      });
    });

    // Enforce top position across layout paint cycles
    setTimeout(() => {
      if (panel) {
        panel.scrollTop = 0;
        panel.scrollTo(0, 0);
      }
    }, 50);
    setTimeout(() => {
      if (panel) {
        panel.scrollTop = 0;
        panel.scrollTo(0, 0);
      }
    }, 150);
  },

  closeSlidingPage() {
    const drawerOverlay = document.getElementById('propertySlidingDrawerOverlay');
    if (drawerOverlay && drawerOverlay.classList.contains('open')) {
      drawerOverlay.classList.remove('open');
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 660);
    } else {
      window.router.navigate('properties');
    }
  },

  getFormData() {
    const name = document.getElementById('wiz_name')?.value || '';
    const surveyNo = document.getElementById('wiz_surveyNo')?.value || '';
    const category = document.getElementById('wiz_category')?.value || 'Luxury Residential Villa';
    const state = document.getElementById('wiz_state')?.value || 'Karnataka';
    const district = document.getElementById('wiz_district')?.value || 'Bengaluru Urban';
    const area = document.getElementById('wiz_area')?.value || 'Indiranagar';
    const address = document.getElementById('wiz_address')?.value || '';
    const outlet = document.getElementById('wiz_outlet')?.value || 'YOR Central';
    const agent = document.getElementById('wiz_agent')?.value || 'Sarah Coleman';
    const beds = document.getElementById('wiz_beds')?.value || '4 Bed';
    const baths = document.getElementById('wiz_baths')?.value || '4 Bath';
    const balconies = document.getElementById('wiz_balconies')?.value || '3 Balconies';
    const carpetArea = document.getElementById('wiz_carpetArea')?.value || '2850';
    const superArea = document.getElementById('wiz_superArea')?.value || '3400';
    const plotArea = document.getElementById('wiz_plotArea')?.value || '1,240 sqm';
    const facing = document.getElementById('wiz_facing')?.value || 'East Facing';
    const furnishing = document.getElementById('wiz_furnishing')?.value || 'Fully Furnished';
    const possession = document.getElementById('wiz_possession')?.value || 'Ready to Move';

    // Checked amenities
    const checkedAmenities = [];
    document.querySelectorAll('#stepPanel2 input[name="amenity"]:checked').forEach(cb => {
      checkedAmenities.push(cb.value);
    });

    const valuationCr = document.getElementById('wiz_valuationCr')?.value || '4.85';
    const expectedRental = document.getElementById('wiz_expectedRental')?.value || '2.40';
    const rentalYield = document.getElementById('wiz_rentalYield')?.value || '6.8%';
    const maintenance = document.getElementById('wiz_maintenance')?.value || '18,500';

    // Selected banks
    const selectedBanks = [];
    document.querySelectorAll('.bank-card-pill.selected b').forEach(el => {
      selectedBanks.push(el.textContent.trim());
    });

    const virtualTourUrl = document.getElementById('wiz_virtualTourUrl')?.value || '';

    return {
      name, surveyNo, category, state, district, area, address, outlet, agent,
      beds, baths, balconies, carpetArea, superArea, plotArea, facing, furnishing, possession,
      amenities: checkedAmenities.length > 0 ? checkedAmenities : ["Infinity Pool", "Smart Home Automation", "Private Elevator", "24/7 Security"],
      valuationCr, expectedRental, rentalYield, maintenance,
      preLoanBanks: selectedBanks.length > 0 ? selectedBanks : ['State Bank of India (SBI)', 'HDFC Bank', 'ICICI Bank'],
      virtualTourUrl,
      valuation: `₹ ${valuationCr} Cr`,
      location: `${area}, ${state === 'Karnataka' ? 'KA' : state === 'Maharashtra' ? 'MH' : state === 'Kerala' ? 'KL' : state === 'Tamil Nadu' ? 'TN' : 'IND'}`
    };
  },

  syncLivePreview() {
    const d = this.getFormData();
    
    const prevName = document.getElementById('prev_name');
    if (prevName) prevName.textContent = d.name || 'Forest Ridge Luxury Residence';
    
    const prevSurvey = document.getElementById('prev_surveyNo');
    if (prevSurvey) prevSurvey.textContent = d.surveyNo || 'Survey 456/38';

    const prevCategory = document.getElementById('prev_category');
    if (prevCategory) prevCategory.textContent = d.category;

    const prevLocation = document.getElementById('prev_location');
    if (prevLocation) prevLocation.textContent = `${d.area || 'Indiranagar'}, ${d.district || 'Bengaluru'} · ${d.state || 'Karnataka'}`;

    const prevBeds = document.getElementById('prev_beds');
    if (prevBeds) prevBeds.textContent = d.beds;

    const prevBaths = document.getElementById('prev_baths');
    if (prevBaths) prevBaths.textContent = d.baths;

    const prevCarpet = document.getElementById('prev_carpetArea');
    if (prevCarpet) prevCarpet.textContent = `${d.carpetArea || '2,850'} sq.ft`;

    const prevVal = document.getElementById('prev_valuation');
    if (prevVal) prevVal.textContent = `₹ ${d.valuationCr || '4.85'} Cr`;

    const valNum = parseFloat(d.valuationCr) || 4.85;
    const areaNum = parseFloat(String(d.carpetArea).replace(/,/g, '')) || 2850;
    const rate = areaNum > 0 ? Math.round((valNum * 10000000) / areaNum) : 17017;
    
    const prevRate = document.getElementById('prev_rate');
    if (prevRate) prevRate.textContent = `₹ ${rate.toLocaleString()}`;

    const wizRateDisplay = document.getElementById('wiz_pricePerSqFtDisplay');
    if (wizRateDisplay) wizRateDisplay.value = `₹ ${rate.toLocaleString()} / sq.ft`;

    const prevOutlet = document.getElementById('prev_outlet');
    if (prevOutlet) prevOutlet.textContent = d.outlet;

    const prevBanks = document.getElementById('prev_banks');
    if (prevBanks) {
      prevBanks.innerHTML = d.preLoanBanks.map(b => `<span class="chip gray xs">${b.split(' ')[0]}</span>`).join('');
    }

    const prevBase = document.getElementById('prev_breakdown_base');
    if (prevBase) prevBase.textContent = `₹ ${d.valuationCr || '4.85'} Cr`;

    const prevStamp = document.getElementById('prev_breakdown_stamp');
    if (prevStamp) prevStamp.textContent = `₹ ${(valNum * 5.6).toFixed(1)} L`;

    const prevRent = document.getElementById('prev_breakdown_rent');
    if (prevRent) prevRent.textContent = `₹ ${d.expectedRental || '2.40'} L / mo`;

    const prevYield = document.getElementById('prev_breakdown_yield');
    if (prevYield) prevYield.textContent = `${d.rentalYield || '6.8%'} p.a.`;

    const prevRmName = document.getElementById('prev_rm_name');
    if (prevRmName) prevRmName.textContent = d.agent;

    const prevRmOutlet = document.getElementById('prev_rm_outlet');
    if (prevRmOutlet) prevRmOutlet.textContent = `${d.outlet} Branch`;

    const prevRmAvatar = document.getElementById('prev_rm_avatar');
    if (prevRmAvatar) {
      const parts = d.agent.split(' ');
      prevRmAvatar.textContent = (parts[0]?.[0] || 'S') + (parts[1]?.[0] || 'C');
    }
  },

  goToStep(step) {
    window._propertyWizardStep = step;
    
    for (let i = 1; i <= 5; i++) {
      const p = document.getElementById(`stepPanel${i}`);
      if (p) p.classList.toggle('active', i === step);
    }

    document.querySelectorAll('.wizard-stepper-card .wizard-step').forEach(ws => {
      const s = parseInt(ws.dataset.step, 10);
      ws.classList.toggle('active', s === step);
      ws.classList.toggle('completed', s < step);
      const badge = ws.querySelector('.step-badge');
      if (badge && s < 5) {
        badge.textContent = s < step ? '✓' : String(s);
      }
    });

    document.querySelectorAll('.wizard-stepper-card .wizard-step-line').forEach((line, idx) => {
      line.classList.toggle('done', (idx + 1) < step);
    });

    const panel = document.getElementById('propertySlidingDrawerPanel');
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.saveDraft(true);
  },

  nextStep(current) {
    if (current === 1) {
      const name = document.getElementById('wiz_name')?.value;
      const surveyNo = document.getElementById('wiz_surveyNo')?.value;
      if (!name || !surveyNo) {
        if (window.modals && window.modals.showToast) {
          window.modals.showToast('Please enter Property Name and Survey Number to proceed', 'error');
        }
        return;
      }
    }
    this.goToStep(current + 1);
  },

  prevStep(current) {
    this.goToStep(Math.max(1, current - 1));
  },

  toggleAmenity(cb) {
    const parent = cb.closest('.amenity-chip');
    if (parent) parent.classList.toggle('selected', cb.checked);
    this.syncLivePreview();
    this.saveDraft(true);
  },

  toggleBank(bankName, el) {
    el.classList.toggle('selected');
    const dot = el.querySelector('.bank-check-dot');
    if (dot) dot.textContent = el.classList.contains('selected') ? '✓' : '';
    this.syncLivePreview();
    this.saveDraft(true);
  },

  saveDraft(silent = false) {
    const data = this.getFormData();
    window.store.savePropertyDraft(data);
    const msg = document.getElementById('wiz_draftMsg');
    if (msg) msg.textContent = 'Draft auto-saved ' + new Date().toLocaleTimeString();
    if (!silent && window.modals && window.modals.showToast) {
      window.modals.showToast('Property draft saved locally!');
    }
  },

  clearDraft() {
    window.store.clearPropertyDraft();
    window._propertyWizardStep = 1;
    const panel = document.getElementById('propertySlidingDrawerPanel');
    if (panel) {
      panel.innerHTML = renderPropertyCreationFormHtml(true);
      setTimeout(() => {
        this.goToStep(1);
        this.syncLivePreview();
      }, 50);
    } else {
      window.router.navigate('properties');
    }
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Property draft discarded');
    }
  },

  fillDemoData() {
    window.store.savePropertyDraft({
      name: "The Imperial Azure Sky Penthouse",
      surveyNo: "Survey 782/4C",
      type: "Residential",
      category: "Sky Penthouse & High-Rise",
      location: "Bengaluru, KA",
      state: "Karnataka",
      district: "Bengaluru Urban",
      area: "Lavelle Road",
      address: "Tower A, 24th Floor, Imperial Residences, Lavelle Road",
      pincode: "560001",
      outlet: "YOR Central",
      agent: "Sarah Coleman",
      beds: "5 Bed",
      baths: "5 Bath",
      balconies: "Wrap-around Terrace",
      carpetArea: "4200",
      superArea: "5100",
      plotArea: "N/A (Penthouse)",
      facing: "North-East Facing",
      furnishing: "Fully Furnished",
      possession: "Ready to Move",
      amenities: ["Infinity Pool", "Smart Home Automation", "Private Elevator", "24/7 Security & Concierge", "Solar Powered & Green Rated", "EV Charging Bay", "Italian Marble Flooring", "Private Rooftop Deck"],
      valuationCr: "8.75",
      maintenancePerMonth: "32,000",
      expectedRental: "4.20",
      rentalYield: "7.2%",
      preLoanBanks: ["State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank"],
      docsUploaded: [
        { name: "Parent Conveyance Deed (30 yrs)", size: "5.4 MB", status: "Verified" },
        { name: "Kaveri EC Form 15 Non-Encumbrance", size: "3.1 MB", status: "Verified" },
        { name: "BDA Sanction Plan & Khata Extract A", size: "4.8 MB", status: "Verified" },
        { name: "Pre-Loan APF Certificate (SBI / HDFC)", size: "1.2 MB", status: "Verified" }
      ],
      legalStatus: "Verified"
    });
    window._propertyWizardStep = 1;
    const panel = document.getElementById('propertySlidingDrawerPanel');
    if (panel) {
      panel.innerHTML = renderPropertyCreationFormHtml(true);
      setTimeout(() => {
        this.goToStep(1);
        this.syncLivePreview();
      }, 50);
    } else {
      window.router.navigate('properties');
    }
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Demo luxury penthouse data loaded into wizard!');
    }
  },

  simulateDocUpload() {
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Document uploaded: "Pre-Loan Sanction APF.pdf" (2.4 MB)');
    }
  },

  simulatePhotoUpload() {
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('High-resolution photo added to listing gallery');
    }
  },

  submitProperty() {
    const data = this.getFormData();
    if (!data.name || !data.surveyNo) {
      if (window.modals && window.modals.showToast) {
        window.modals.showToast('Please enter Property Name and Survey Number', 'error');
      }
      this.goToStep(1);
      return;
    }

    const pubMode = document.querySelector('input[name="pubMode"]:checked')?.value || 'active';
    const newProp = window.store.addProperty({
      ...data,
      legalStatus: pubMode === 'review' ? 'In Review' : 'Verified'
    });

    window._propertyWizardStep = 1;
    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Property "${newProp.name}" created and published successfully!`);
    }

    this.closeSlidingPage();

    if (window.router.currentRoute === 'properties') {
      window.router.navigate('properties');
    }
  }
};
