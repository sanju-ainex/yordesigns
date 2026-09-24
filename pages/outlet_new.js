/* ==========================================================================
   YOR Estate - Dedicated Sliding Outlet Creation & Branch Wizard Module
   ========================================================================== */

function renderCustomSelectOutlet(id, name, currentValue, options) {
  const currentOption = options.find(o => o.value === currentValue) || options[0] || { value: '', label: 'Select...' };
  return `
    <div class="custom-select-wrap" id="wrap_${id}">
      <div class="custom-select-trigger" onclick="window.customSelect ? window.customSelect.toggle(this) : null">
        <span class="custom-select-value">${currentOption.label}</span>
        <svg class="custom-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <input type="hidden" id="${id}" name="${name}" value="${currentOption.value}">
      <div class="custom-select-menu">
        ${options.map(opt => `
          <div class="custom-select-item ${opt.value === currentOption.value ? 'selected' : ''}" data-value="${opt.value}" onclick="window.customSelect ? window.customSelect.select(this) : null">
            <span>${opt.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderOutletNewPage() {
  setTimeout(() => {
    window.router.navigate('outlets', false);
    if (window.outletWizard && window.outletWizard.openSlidingPage) {
      window.outletWizard.openSlidingPage();
    }
  }, 10);
  return renderOutletsPage();
}

// Reusable Form HTML Generator for both Full Page & Sliding Panel
function renderOutletCreationFormHtml(isSlidingDrawer = false) {
  const store = window.store;
  const draft = (store && store.getOutletDraft && store.getOutletDraft()) || {};
  const currentStep = window._outletWizardStep || 1;

  // Company Directory of Available Personnel across branches and HQ
  const availableCompanyStaff = (window.outletWizard && window.outletWizard.companyStaffDirectory) || [
    { id: "staff_asha", name: "Asha Menon", designation: "Outlet Admin", dept: "Head Office", email: "asha@yorestate.com", phone: "+91 98401 11021", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80", initials: "AM", bgColor: "#E0E7FF", color: "#3730A3" },
    { id: "staff_rahul", name: "Rahul Nair", designation: "Branch Manager", dept: "YOR South", email: "rahul@yorestate.com", phone: "+91 98402 33445", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", initials: "RN", bgColor: "#FEF3C7", color: "#92400E" },
    { id: "staff_sarah", name: "Sarah Coleman", designation: "Sales Lead", dept: "YOR Central", email: "sarah@yorestate.com", phone: "+91 98403 55667", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80", initials: "SC", bgColor: "#D1FAE5", color: "#065F46" },
    { id: "staff_arjun", name: "Arjun Mehta", designation: "Sales Executive", dept: "YOR Central", email: "arjun@yorestate.com", phone: "+91 98404 77889", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", initials: "AM", bgColor: "#FCE7F3", color: "#9D174D" },
    { id: "staff_priya", name: "Priya Das", designation: "Finance & Accounts Lead", dept: "Head Office", email: "priya@yorestate.com", phone: "+91 98405 99001", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", initials: "PD", bgColor: "#DBEAFE", color: "#1E40AF" }
  ];

  // Default initial outlet data
  const outlet = {
    name: draft.name || "",
    code: draft.code || "",
    country: draft.country || "India",
    currency: draft.currency || "INR (₹) - Indian Rupee",
    tier: draft.tier || "Tier 1 Flagship Experience Centre",
    state: draft.state || "Karnataka",
    district: draft.district || "Bengaluru Urban",
    status: draft.status || "Active Operational",
    image: draft.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    
    targetPeriod: draft.targetPeriod || "Q1 2026 (Apr - Jun)",
    salesTargetCr: draft.salesTargetCr || "25.0",
    rentalTargetL: draft.rentalTargetL || "45.0",
    targetNotes: draft.targetNotes || "Initial branch launch target baseline set by HQ Strategy Board",
    targetHistory: draft.targetHistory || [
      { id: "TGT-01", period: "Q1 2026 (Apr - Jun)", salesTarget: "25.0", rentalTarget: "45.0", setAt: "2026-04-01", setBy: "Super Admin", remarks: "Q1 baseline benchmark" }
    ],
    
    address: draft.address || "",
    landmark: draft.landmark || "Near Indiranagar Metro Station",
    pincode: draft.pincode || "560038",
    carpetArea: draft.carpetArea || "5,200",
    email: draft.email || "blr.flagship@yorestate.com",
    phone: draft.phone || "+91 80 4912 8800",
    operatingBank: draft.operatingBank || "HDFC Bank Commercial Branch A/C",
    gstin: draft.gstin || "29AABCU9603R1ZM",

    managers: draft.managers || [
      { id: "mgr_1", name: "Vikramaditya Varma", designation: "Outlet Admin", email: "vikram@yorestate.com", phone: "+91 98412 44556" },
      { id: "mgr_2", name: "Ananya Deshmukh", designation: "Operations Manager", email: "ananya@yorestate.com", phone: "+91 98413 66778" },
      { id: "mgr_3", name: "Karthik Subramanian", designation: "Sales Lead", email: "karthik@yorestate.com", phone: "+91 98414 88990" },
      { id: "mgr_4", name: "Sneha Kurian", designation: "Finance & Accounts Lead", email: "sneha@yorestate.com", phone: "+91 98415 00112" }
    ],

    savedAt: draft.savedAt || null
  };

  return `
    <!-- Top Header Bar & Stepper inside Sticky Container -->
    <div class="drawer-header-sticky-wrap">
      <div class="user-wizard-top">
        <div class="user-wizard-title-wrap">
          <div class="user-wizard-crumbs">
            <a href="#outlets" onclick="window.outletWizard.closeSlidingPage(); return false;">Outlets & Branches</a>
            <span>/</span>
            <span>${isSlidingDrawer ? 'Onboard Branch' : 'New Branch Wizard'}</span>
          </div>
          <h1>${isSlidingDrawer ? 'Onboard Regional Branch Outlet' : 'Onboard New Regional Branch Outlet'}</h1>
          <p>Define branch identifiers, physical premises, commercial accounts, periodic targets, and personnel roster.</p>
        </div>

        <div class="user-wizard-top-actions">
          <button class="btn sm" id="btnFillDemoOutlet" onclick="window.outletWizard.fillDemoData()" title="Pre-fill with realistic luxury flagship outlet data">
            Fill Demo Branch
          </button>
          <button class="btn sm" id="btnSaveOutletDraft" onclick="window.outletWizard.saveDraft(true)">
            Save Draft
          </button>
          <button class="btn" onclick="window.outletWizard.closeSlidingPage()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
          <button class="btn dark gold-glow" onclick="window.outletWizard.submitOutlet()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Deploy Branch
          </button>
        </div>
      </div>

      <!-- Stepper Navigation Bar -->
      <div class="card wizard-stepper-card" style="padding: 12px 18px;">
        <div class="wizard-stepper">
          
          <div class="wizard-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}" data-step="1" onclick="window.outletWizard.goToStep(1)">
            <div class="step-badge">${currentStep > 1 ? '✓' : '1'}</div>
            <div class="step-meta">
              <span class="step-num">Step 1</span>
              <b class="step-title">Identity & Classification</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 1 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}" data-step="2" onclick="window.outletWizard.goToStep(2)">
            <div class="step-badge">${currentStep > 2 ? '✓' : '2'}</div>
            <div class="step-meta">
              <span class="step-num">Step 2</span>
              <b class="step-title">Premises & Banking</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 2 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 3 ? 'active' : ''}" data-step="3" onclick="window.outletWizard.goToStep(3)">
            <div class="step-badge">3</div>
            <div class="step-meta">
              <span class="step-num">Step 3</span>
              <b class="step-title">Staff & Designation</b>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Main Wizard 2-Column Grid (68% Form Panels, 32% Live Preview Sidebar) -->
    <div class="grid-wizard">
      
      <!-- LEFT: Step-by-Step Panels -->
      <div class="stack" style="gap: 20px;">
        <form id="outletWizardForm" onsubmit="return false;">

          <!-- STEP 1 PANEL: BRANCH IDENTITY & OPERATIONAL CLASSIFICATION -->
          <div class="card wizard-panel ${currentStep === 1 ? 'active' : ''}" id="outletStepPanel1" style="padding: 22px;">
            <div class="ch" style="margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600;">1. Branch Identity & Operational Classification</h3>
                <p style="font-size: 12.5px; color: var(--ink-2);">Define immutable branch identifiers, operating country, currency, jurisdiction, and regional targets.</p>
              </div>
              <span class="chip gold xs">Step 1 of 3</span>
            </div>

            <!-- Row 1: Name & Code -->
            <div class="grid-2" style="gap: 16px;">
              <div class="field">
                <label>Branch Outlet Name <span class="req">*</span></label>
                <div class="input-wrap">
                  <input type="text" id="out_name" name="name" required value="${outlet.name}" placeholder="e.g. YOR Bengaluru Central Flagship" oninput="window.outletWizard.syncLivePreview()">
                </div>
                <small class="muted">Public marketing title for regional operations and client documentation.</small>
              </div>

              <div class="field">
                <label>Branch Code (Unique Identifier) <span class="req">*</span></label>
                <div class="input-wrap">
                  <input type="text" id="out_code" name="code" required value="${outlet.code || 'OUT-06-BLR'}" placeholder="e.g. OUT-06-BLR" class="font-mono" oninput="window.outletWizard.syncLivePreview()">
                </div>
                <small class="muted">Used for ledger tags, employee scoping, and database access.</small>
              </div>
            </div>

            <!-- Row 2: Country & Base Currency -->
            <div class="grid-2" style="gap: 16px; margin-top: 14px;">
              <div class="field">
                <label>Operating Country <span class="req">*</span></label>
                ${renderCustomSelectOutlet("out_country", "country", outlet.country, [
                  { value: "India", label: "🇮🇳 India" },
                  { value: "United Arab Emirates", label: "🇦🇪 United Arab Emirates (UAE)" },
                  { value: "Singapore", label: "🇸🇬 Singapore" },
                  { value: "Saudi Arabia", label: "🇸🇦 Saudi Arabia" },
                  { value: "United Kingdom", label: "🇬🇧 United Kingdom (UK)" },
                  { value: "United States", label: "🇺🇸 United States (USA)" },
                  { value: "Qatar", label: "🇶🇦 Qatar" },
                  { value: "Oman", label: "🇴🇲 Oman" },
                  { value: "Malaysia", label: "🇲🇾 Malaysia" },
                  { value: "Australia", label: "🇦🇺 Australia" }
                ])}
              </div>

              <div class="field">
                <label>Base Operating Currency <span class="req">*</span></label>
                ${renderCustomSelectOutlet("out_currency", "currency", outlet.currency, [
                  { value: "INR (₹) - Indian Rupee", label: "INR (₹) - Indian Rupee" },
                  { value: "AED (د.إ) - UAE Dirham", label: "AED (د.إ) - UAE Dirham" },
                  { value: "USD ($) - US Dollar", label: "USD ($) - US Dollar" },
                  { value: "SGD (S$) - Singapore Dollar", label: "SGD (S$) - Singapore Dollar" },
                  { value: "SAR (﷼) - Saudi Riyal", label: "SAR (﷼) - Saudi Riyal" },
                  { value: "GBP (£) - British Pound", label: "GBP (£) - British Pound" },
                  { value: "EUR (€) - Euro", label: "EUR (€) - Euro" },
                  { value: "QAR (﷼) - Qatari Riyal", label: "QAR (﷼) - Qatari Riyal" }
                ])}
              </div>
            </div>

            <!-- Row 3: Tier, State, Status -->
            <div class="grid-3" style="gap: 16px; margin-top: 14px;">
              <div class="field">
                <label>Operational Tier</label>
                ${renderCustomSelectOutlet("out_tier", "tier", outlet.tier, [
                  { value: "Tier 1 Flagship Experience Centre", label: "Tier 1 Flagship Experience Centre" },
                  { value: "Tier 2 Regional Office", label: "Tier 2 Regional Office" },
                  { value: "Tier 3 Advisory Lounge", label: "Tier 3 Advisory Lounge" },
                  { value: "Special Project Hub", label: "Special Project Hub" }
                ])}
              </div>

              <div class="field">
                <label>State / Province Jurisdiction <span class="req">*</span></label>
                ${renderCustomSelectOutlet("out_state", "state", outlet.state, [
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Maharashtra", label: "Maharashtra" },
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Kerala", label: "Kerala" },
                  { value: "Telangana", label: "Telangana" },
                  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                  { value: "Delhi NCR", label: "Delhi NCR" },
                  { value: "Dubai", label: "Dubai" },
                  { value: "Abu Dhabi", label: "Abu Dhabi" },
                  { value: "Central Region", label: "Central Region" }
                ])}
              </div>

              <div class="field">
                <label>Operational Status</label>
                ${renderCustomSelectOutlet("out_status", "status", outlet.status, [
                  { value: "Active Operational", label: "Active Operational" },
                  { value: "Pre-Launch Staging", label: "Pre-Launch Staging" },
                  { value: "Premises Fit-out", label: "Premises Fit-out" },
                  { value: "Under Compliance Review", label: "Under Compliance Review" }
                ])}
              </div>
            </div>

            <!-- Row 4: District / City -->
            <div style="margin-top: 14px;">
              <div class="field" style="margin:0;">
                <label>Revenue District / City Municipality <span class="req">*</span></label>
                <div class="input-wrap">
                  <input type="text" id="out_district" name="district" value="${outlet.district}" placeholder="e.g. Bengaluru Urban" oninput="window.outletWizard.syncLivePreview()">
                </div>
                <small class="muted">Key revenue territory for regional real estate registration and property scoping.</small>
              </div>
            </div>

            <!-- Periodic Target Calibration & Historical Record Matrix -->
            <div class="target-calibration-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                <div>
                  <b style="font-size:13px; color:var(--ink); display:flex; align-items:center; gap:6px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Periodic Target Calibration & Audit History
                  </b>
                  <span style="font-size:11.5px; color:var(--ink-2);">Targets change periodically (quarterly / fiscal cycles). All revisions are logged with timestamped audit history.</span>
                </div>
                <span class="chip gold xs font-mono">Periodic Audit Log</span>
              </div>

              <div class="grid-3" style="gap: 14px;">
                <div class="field" style="margin:0;">
                  <label>Target Assessment Period <span class="req">*</span></label>
                  ${renderCustomSelectOutlet("out_targetPeriod", "targetPeriod", outlet.targetPeriod || "Q1 2026 (Apr - Jun)", [
                    { value: "Q1 2026 (Apr - Jun)", label: "Q1 2026 (Apr - Jun)" },
                    { value: "Q2 2026 (Jul - Sep)", label: "Q2 2026 (Jul - Sep)" },
                    { value: "Q3 2026 (Oct - Dec)", label: "Q3 2026 (Oct - Dec)" },
                    { value: "Q4 2026 (Jan - Mar)", label: "Q4 2026 (Jan - Mar)" },
                    { value: "FY 2026-27 (Annual)", label: "FY 2026-27 (Annual Target)" },
                    { value: "Monthly Rolling Target", label: "Monthly Rolling Target" }
                  ])}
                </div>

                <div class="field" style="margin:0;">
                  <label id="lbl_out_salesTarget">Target Sales for Period</label>
                  <div class="input-wrap">
                    <input type="text" id="out_salesTargetCr" name="salesTargetCr" value="${outlet.salesTargetCr}" placeholder="25.0" oninput="window.outletWizard.syncLivePreview()">
                  </div>
                </div>

                <div class="field" style="margin:0;">
                  <label id="lbl_out_rentalTarget">Target Rental for Period</label>
                  <div class="input-wrap">
                    <input type="text" id="out_rentalTargetL" name="rentalTargetL" value="${outlet.rentalTargetL}" placeholder="45.0" oninput="window.outletWizard.syncLivePreview()">
                  </div>
                </div>
              </div>

              <div class="field" style="margin-top: 12px; margin-bottom: 0;">
                <label>Target Calibration Rationale / Revision Notes</label>
                <div class="input-wrap">
                  <input type="text" id="out_targetNotes" name="targetNotes" value="${outlet.targetNotes || 'Initial branch launch target baseline set by HQ Strategy Board'}" placeholder="e.g. Q1 expansion baseline calibrated for 18 scoped sales agents" oninput="window.outletWizard.syncLivePreview()">
                </div>
              </div>

              <!-- Target History Timeline Log -->
              <div class="target-history-strip" id="targetHistoryStrip">
                <div class="target-history-card">
                  <div class="target-history-period">
                    <span id="hist_period_badge">${outlet.targetPeriod || 'Q1 2026'}</span>
                    <span class="chip green xs" style="font-size:9px; padding:1px 5px;">Active</span>
                  </div>
                  <div class="target-history-metrics" id="hist_curr_metrics">
                    Sales: ₹ ${outlet.salesTargetCr} Cr · Rent: ₹ ${outlet.rentalTargetL} L
                  </div>
                  <small class="muted" style="font-size:10px;">Logged today by HQ Super Admin</small>
                </div>

                <div class="target-history-card" style="opacity: 0.75; background:#FAFAFA;">
                  <div class="target-history-period">
                    <span>Q4 2025 (Prior)</span>
                    <span class="chip dark xs" style="font-size:9px; padding:1px 5px;">Archived</span>
                  </div>
                  <div class="target-history-metrics">
                    Sales: ₹ 18.0 Cr · Rent: ₹ 32.0 L
                  </div>
                  <small class="muted" style="font-size:10px;">Archived baseline audit record</small>
                </div>
              </div>
            </div>

            <div class="wizard-actions" style="margin-top: 24px; display: flex; justify-content: flex-end;">
              <button class="btn dark" type="button" onclick="window.outletWizard.nextStep(1)">
                Next: Premises & Banking →
              </button>
            </div>
          </div>

          <!-- STEP 2 PANEL: PHYSICAL PREMISES, COMMUNICATIONS & OPERATING BANKING -->
          <div class="card wizard-panel ${currentStep === 2 ? 'active' : ''}" id="outletStepPanel2" style="padding: 22px;">
            <div class="ch" style="margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600;">2. Physical Premises, Communications & Banking</h3>
                <p style="font-size: 12.5px; color: var(--ink-2);">Physical branch location coordinates, official contacts, and designated commercial operating accounts.</p>
              </div>
              <span class="chip blue xs">Step 2 of 3</span>
            </div>

            <!-- Branch Outlet Facade & Experience Centre Imagery -->
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--ink-3); margin-bottom: 10px; letter-spacing: 0.05em;">
                Branch Outlet Facade & Experience Centre Imagery:
              </div>

              <div class="outlet-image-uploader">
                <div class="outlet-image-preview-frame">
                  <img id="outletImgPreview" src="${outlet.image}" class="outlet-image-preview-img" alt="Outlet Facade Preview" onerror="this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'">
                </div>

                <div class="outlet-image-controls">
                  <div style="display:flex; gap:10px; align-items:center;">
                    <input type="text" id="out_image" name="image" value="${outlet.image}" placeholder="Paste Image URL or select luxury preset below..." class="input" style="height:36px; font-size:12px; flex:1;" oninput="window.outletWizard.onOutletImageUrlInput(this.value)">
                    
                    <label class="btn sm" style="height:36px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; margin:0; white-space:nowrap;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Upload File
                      <input type="file" id="outletFileInput" accept="image/*" style="display:none;" onchange="window.outletWizard.handleOutletFileUpload(event)">
                    </label>
                  </div>

                  <div style="font-size:11px; color:var(--ink-3); margin-top:2px;">Quick Select Luxury Facade Presets:</div>
                  
                  <div class="outlet-preset-grid">
                    <div class="outlet-preset-item active" onclick="window.outletWizard.selectImagePreset('https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80', this)">
                      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&auto=format&fit=crop&q=80" class="outlet-preset-thumb" alt="Glass Flagship">
                      <span>Glass Flagship</span>
                    </div>

                    <div class="outlet-preset-item" onclick="window.outletWizard.selectImagePreset('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80', this)">
                      <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80" class="outlet-preset-thumb" alt="Skyscraper Hub">
                      <span>Skyscraper Hub</span>
                    </div>

                    <div class="outlet-preset-item" onclick="window.outletWizard.selectImagePreset('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80', this)">
                      <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80" class="outlet-preset-thumb" alt="Executive Suite">
                      <span>Executive Suite</span>
                    </div>

                    <div class="outlet-preset-item" onclick="window.outletWizard.selectImagePreset('https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80', this)">
                      <img src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80" class="outlet-preset-thumb" alt="Waterfront Hub">
                      <span>Waterfront Hub</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="field">
              <label>Full Physical Street Address <span class="req">*</span></label>
              <div class="input-wrap">
                <input type="text" id="out_address" name="address" value="${outlet.address || '842, 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru'}" placeholder="Street, Building, Suite No." oninput="window.outletWizard.syncLivePreview()">
              </div>
            </div>

            <div class="grid-3" style="gap: 16px; margin-top: 14px;">
              <div class="field">
                <label>Landmark / Vicinity</label>
                <div class="input-wrap">
                  <input type="text" id="out_landmark" name="landmark" value="${outlet.landmark}" placeholder="e.g. Near Indiranagar Metro Station" oninput="window.outletWizard.syncLivePreview()">
                </div>
              </div>

              <div class="field">
                <label>Postal Pincode / Zip</label>
                <div class="input-wrap">
                  <input type="text" id="out_pincode" name="pincode" value="${outlet.pincode}" placeholder="560038" class="font-mono">
                </div>
              </div>

              <div class="field">
                <label>Carpet Floor Space (sq.ft)</label>
                <div class="input-wrap">
                  <input type="text" id="out_carpetArea" name="carpetArea" value="${outlet.carpetArea}" placeholder="5,200">
                </div>
              </div>
            </div>

            <!-- Branch Communications: Official Email & Tel -->
            <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--line);">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--ink-3); margin-bottom: 12px; letter-spacing: 0.05em;">
                Branch Official Communication Channels:
              </div>
              <div class="grid-2" style="gap: 16px;">
                <div class="field" style="margin:0;">
                  <label>Branch Official Email <span class="req">*</span></label>
                  <div class="input-wrap">
                    <input type="email" id="out_email" name="email" value="${outlet.email || 'blr.flagship@yorestate.com'}" placeholder="e.g. blr.flagship@yorestate.com" oninput="window.outletWizard.syncLivePreview()">
                  </div>
                  <small class="muted">Central mailbox for client enquiries, legal notices & billing.</small>
                </div>

                <div class="field" style="margin:0;">
                  <label>Branch Official Tel / Phone <span class="req">*</span></label>
                  <div class="input-wrap">
                    <input type="tel" id="out_phone" name="phone" value="${outlet.phone || '+91 80 4912 8800'}" placeholder="e.g. +91 80 4912 8800" class="font-mono" oninput="window.outletWizard.syncLivePreview()">
                  </div>
                  <small class="muted">Main switchboard / reception contact for client walk-ins.</small>
                </div>
              </div>
            </div>

            <!-- Commercial Banking (2 columns) -->
            <div class="grid-2" style="gap: 16px; margin-top: 18px;">
              <div class="field" style="margin:0;">
                <label>Primary Operating Bank Partner</label>
                ${renderCustomSelectOutlet("out_operatingBank", "operatingBank", outlet.operatingBank, [
                  { value: "HDFC Bank Commercial Branch A/C", label: "HDFC Bank Commercial Branch A/C" },
                  { value: "ICICI Bank Operations Current A/C", label: "ICICI Bank Operations Current A/C" },
                  { value: "State Bank of India (SBI) Branch A/C", label: "State Bank of India (SBI) Branch A/C" },
                  { value: "Kotak Mahindra Commercial A/C", label: "Kotak Mahindra Commercial A/C" },
                  { value: "Emirates NBD Corporate Account", label: "Emirates NBD Corporate Account" },
                  { value: "DBS Bank Commercial Branch A/C", label: "DBS Bank Commercial Branch A/C" }
                ])}
              </div>

              <div class="field" style="margin:0;">
                <label>State GSTIN / Tax ID</label>
                <div class="input-wrap">
                  <input type="text" id="out_gstin" name="gstin" value="${outlet.gstin}" placeholder="29AABCU9603R1ZM" class="font-mono">
                </div>
              </div>
            </div>

            <div class="wizard-actions" style="margin-top: 24px; display: flex; justify-content: space-between;">
              <button class="btn" type="button" onclick="window.outletWizard.prevStep(2)">
                ← Previous Step
              </button>
              <button class="btn dark" type="button" onclick="window.outletWizard.nextStep(2)">
                Next: Staff & Designation →
              </button>
            </div>
          </div>

          <!-- STEP 3 PANEL: BRANCH STAFF & DESIGNATION -->
          <div class="card wizard-panel ${currentStep === 3 ? 'active' : ''}" id="outletStepPanel3" style="padding: 22px;">
            <div class="ch" style="margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600;">3. Branch Staff & Designation</h3>
                <p style="font-size: 12.5px; color: var(--ink-2);">Search personnel by name to view photo and designation, select to add, and manage team roster below.</p>
              </div>
              <span class="chip gold xs">Step 3 of 3</span>
            </div>

            <!-- Search & Add Personnel Component -->
            <div class="staff-search-container" style="background: #F8FAF9; border: 1px solid #DCE3EA; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                <label style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--ink-3); letter-spacing: 0.05em; margin: 0;">
                  Search & Add Personnel
                </label>
                <span class="xs muted">Search by name to view photo & designation dropdown</span>
              </div>

              <div class="staff-search-wrapper" id="staffSearchWrapper">
                <div class="staff-search-input-box">
                  <div class="staff-search-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  <input type="text" id="staffSearchInput" class="staff-search-input" placeholder="Search person by name (e.g. Rahul Nair, Asha Menon, Sarah Coleman)..." autocomplete="off" oninput="window.outletWizard.onStaffSearchInput(this.value)" onfocus="window.outletWizard.openStaffDropdown()" onkeydown="window.outletWizard.onStaffSearchKeydown(event)">
                  <button type="button" class="staff-search-clear-btn" id="btnStaffSearchClear" onclick="window.outletWizard.clearStaffSearch()" style="display:none;" title="Clear">✕</button>
                </div>

                <!-- Dropdown with photo, designation and + Add button -->
                <div id="staffSearchDropdown" class="staff-search-dropdown-menu" style="display:none;">
                  <!-- Dynamically populated by window.outletWizard.renderStaffDropdown() -->
                </div>
              </div>
            </div>

            <!-- Normal Table Style Roster List with Delete Button -->
            <div style="margin-bottom: 8px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--ink-3);">
                Assigned Outlet Personnel Table:
              </span>
              <span class="xs muted">Designations are fixed from company directory and governed centrally</span>
            </div>
            
            <div class="table-wrap" style="border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: #fff;">
              <table class="table" style="margin: 0; width: 100%;">
                <thead>
                  <tr style="background: #F6F8FA; border-bottom: 1px solid var(--line);">
                    <th style="width: 50px; text-align: center; font-size: 11px; text-transform: uppercase; color: var(--ink-3); padding: 10px 12px;">#</th>
                    <th style="font-size: 11px; text-transform: uppercase; color: var(--ink-3); padding: 10px 12px;">Person Name</th>
                    <th style="width: 200px; font-size: 11px; text-transform: uppercase; color: var(--ink-3); padding: 10px 12px;">Designation</th>
                    <th style="width: 230px; font-size: 11px; text-transform: uppercase; color: var(--ink-3); padding: 10px 12px;">Phone & Email</th>
                    <th style="width: 80px; text-align: center; font-size: 11px; text-transform: uppercase; color: var(--ink-3); padding: 10px 12px;">Action</th>
                  </tr>
                </thead>
                <tbody id="managerRosterTableBody">
                  ${outlet.managers.length === 0 ? `
                    <tr id="noStaffRow">
                      <td colspan="5" style="text-align: center; padding: 28px; color: var(--ink-3); font-size: 12.5px;">
                        No personnel assigned yet. Search and select above to add team members.
                      </td>
                    </tr>
                  ` : outlet.managers.map((mgr, idx) => {
                    const matchedStaff = availableCompanyStaff.find(s => s.name.toLowerCase() === mgr.name.toLowerCase());
                    const avatarUrl = mgr.avatar || matchedStaff?.avatar || '';
                    const initials = mgr.name ? mgr.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'ST';
                    const bgColor = matchedStaff?.bgColor || '#E2E8F0';
                    const textColor = matchedStaff?.color || '#334155';
                    const phone = mgr.phone || matchedStaff?.phone || '+91 98401 22334';
                    const email = mgr.email || matchedStaff?.email || (mgr.name.toLowerCase().replace(/[^a-z]/g, '') + '@yorestate.com');
                    const designation = mgr.designation || matchedStaff?.designation || 'Sales Executive';

                    return `
                      <tr class="staff-table-row" data-manager-id="${mgr.id}" style="border-bottom: 1px solid var(--line);">
                        <td class="row-index" style="text-align: center; padding: 10px 12px; font-weight: 600; color: var(--ink-3); font-size: 12px;">
                          ${idx + 1}
                        </td>
                        <td style="padding: 10px 12px;">
                          <div class="staff-cell-user">
                            ${avatarUrl ? `
                              <img src="${avatarUrl}" class="staff-cell-avatar" alt="${mgr.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                              <div class="staff-cell-initials" style="background:${bgColor}; color:${textColor}; display:none;">${initials}</div>
                            ` : `
                              <div class="staff-cell-initials" style="background:${bgColor}; color:${textColor};">${initials}</div>
                            `}
                            <b class="mgr-table-name" style="font-size: 13px; color: var(--ink);">${mgr.name}</b>
                          </div>
                        </td>
                        <td style="padding: 10px 12px;">
                          <span class="chip gold xs font-mono mgr-table-role-label" style="font-size: 11px; font-weight: 600; padding: 4px 9px; display: inline-block;">
                            ${designation}
                          </span>
                          <input type="hidden" class="mgr-table-role" value="${designation}">
                        </td>
                        <td style="padding: 10px 12px;">
                          <div style="display:flex; flex-direction:column; gap:2px;">
                            <span class="mgr-table-phone" style="font-size: 12px; font-weight:600; color: var(--ink); font-family: var(--font-mono); display:flex; align-items:center; gap:5px;">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color:var(--ink-3);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              ${phone}
                            </span>
                            <span class="mgr-table-email xs muted" style="font-size: 11px; display:flex; align-items:center; gap:5px;">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color:var(--ink-3);"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                              ${email}
                            </span>
                          </div>
                        </td>
                        <td style="text-align: center; padding: 10px 12px;">
                          <button class="btn xs red" type="button" onclick="window.outletWizard.removeManagerRow('${mgr.id}')" title="Delete">
                            Delete
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <div class="wizard-actions" style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
              <button class="btn" type="button" onclick="window.outletWizard.prevStep(3)">
                ← Previous Step
              </button>
              <button class="btn dark gold-glow" type="button" id="btnDeployOutlet" onclick="window.outletWizard.submitOutlet()" style="height:46px; font-size:13.5px; padding: 0 24px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Deploy Branch & Provision User Logins
              </button>
            </div>
          </div>


        </form>
      </div>

      <!-- RIGHT COLUMN: Sticky Real-time Outlet Preview & Hierarchy Visualizer -->
      <div class="wizard-sidebar">
        
        <!-- Live Outlet Card -->
        <div class="card luxury-preview-card" style="padding: 0; overflow: hidden;">
          <div class="preview-hero-img" id="prev_hero_bg" style="height: 136px; background: linear-gradient(180deg, rgba(20,23,26,0.4) 0%, rgba(20,23,26,0.92) 100%), url('${outlet.image}') center/cover no-repeat; display:flex; flex-direction:column; justify-content:space-between; padding: 14px; position:relative;">
            <div class="preview-tag-row" style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="chip gold xs font-mono" id="prev_out_code">${outlet.code || 'OUT-06-BLR'}</span>
                <span class="chip dark xs" id="prev_out_country_badge" style="font-size:9.5px;">${outlet.country || 'India'}</span>
              </div>
              <span class="chip green xs" id="prev_out_status">Operational ✓</span>
            </div>
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                <div style="font-size: 10px; color: #D5AF56; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700;" id="prev_out_tier">${outlet.tier}</div>
                <span class="chip gold xs" id="prev_out_period" style="font-size:9px; padding:1px 6px;">${outlet.targetPeriod || 'Q1 2026'}</span>
              </div>
              <h3 style="color: #FFFFFF; font-size: 16px; font-weight: 700; margin: 0;" id="prev_out_name">${outlet.name || 'YOR Bengaluru Central'}</h3>
            </div>
          </div>

          <div class="preview-body" style="padding: 16px;">
            <p class="preview-location" id="prev_out_location" style="font-size: 12px; color: var(--ink-2); margin-bottom: 8px;">${outlet.district} · ${outlet.state} · ${outlet.country || 'India'}</p>

            <!-- Branch Contact Preview Bar -->
            <div style="background:var(--canvas-subtle); padding:6px 10px; border-radius:6px; margin-bottom:12px; display:flex; flex-direction:column; gap:3px; font-size:11px;">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="color:var(--ink-3);">Tel:</span>
                <b id="prev_out_phone" style="font-family:var(--font-mono); color:var(--ink);">${outlet.phone || '+91 80 4912 8800'}</b>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="color:var(--ink-3);">Email:</span>
                <span id="prev_out_email" style="color:var(--ink-2); font-size:10.5px;">${outlet.email || 'blr.flagship@yorestate.com'}</span>
              </div>
            </div>

            <div class="preview-price-strip" style="margin-bottom: 14px;">
              <div>
                <span class="preview-price-label">Periodic Target (<span id="prev_currency_label">INR</span>)</span>
                <div class="preview-price-val" id="prev_out_target" style="font-size: 15px;">₹ ${outlet.salesTargetCr} Cr</div>
              </div>
              <div style="text-align:right">
                <span class="preview-price-label">Rental Quota</span>
                <div class="preview-rate-val" id="prev_out_rentaltarget" style="font-size: 15px; color: var(--green);">₹ ${outlet.rentalTargetL} L / mo</div>
              </div>
            </div>

            <!-- Assigned Leadership Preview -->
            <div style="margin-top: 14px; border-top: 1px solid var(--line); padding-top: 12px;">
              <span class="preview-banks-label" style="display:block; margin-bottom:8px; font-size:11px; text-transform:uppercase; color:var(--ink-3); font-weight:600;">Assigned Staff (<span id="prev_mgr_count">${outlet.managers.length}</span>):</span>
              <div id="prev_mgr_list" style="display:flex; flex-direction:column; gap:6px;">
                ${outlet.managers.map(m => `
                  <div style="display:flex; align-items:center; justify-content:space-between; background:var(--canvas-subtle); padding:6px 10px; border-radius:6px;">
                    <b style="font-size:12px;">${m.name}</b>
                    <span class="chip gold xs" style="font-size:9.5px;">${m.designation || 'Staff'}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Organizational Hierarchy Tree Visualizer Card -->
        <div class="card" style="padding: 16px;">
          <div class="ch" style="margin-bottom: 12px;">
            <div>
              <b style="font-size: 13px;">Branch Hierarchy Matrix</b>
              <p style="font-size: 11px;">Reporting and governance chain</p>
            </div>
            <span class="chip dark xs">Governance</span>
          </div>

          <div class="hierarchy-tree-visual">
            <div class="tree-node ho">
              <span class="tree-badge">HQ</span>
              <div>
                <b>Head Office (Central Super Admin)</b>
                <small>Global Oversight & Financial Ledgers</small>
              </div>
            </div>

            <div class="tree-connector"></div>

            <div class="tree-node branch">
              <span class="tree-badge gold">DIR</span>
              <div>
                <b id="tree_branch_director">${outlet.managers[0]?.name || 'Branch Leader'}</b>
                <small id="tree_branch_name">${outlet.name || 'YOR Bengaluru Central'}</small>
              </div>
            </div>

            <div class="tree-connector"></div>

            <div class="tree-subgrid">
              <div class="tree-subnode">
                <b>Operations</b>
                <span id="tree_ops_mgr">${outlet.managers[1]?.name || 'Ananya Deshmukh'}</span>
              </div>
              <div class="tree-subnode">
                <b>Sales Lead</b>
                <span id="tree_sales_mgr">${outlet.managers[2]?.name || 'Karthik Subramanian'}</span>
              </div>
              <div class="tree-subnode">
                <b>Accounts</b>
                <span id="tree_rent_mgr">${outlet.managers[3]?.name || 'Sneha Kurian'}</span>
              </div>
            </div>

            <div class="tree-connector"></div>

            <div class="tree-node staff">
              <span class="tree-badge green">TEAM</span>
              <div>
                <b>Regional Field Agents (18+ Scoped)</b>
                <small>Lead Conversion & Buyer Showings</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Compliance Trust Badge -->
        <div class="card" style="padding: 14px 16px; background: #F8FAF8; border: 1px solid #DCE8DE;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#1F734C; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">✓</div>
            <div>
              <b style="font-size:12.5px; color:#1F734C; display:block;">Authorized Branch Operating Node</b>
              <span style="font-size:11px; color:var(--ink-2);">Integrated with Regional Property Register.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// Global Outlet Onboarding & Sliding Drawer Controller
window.outletWizard = {
  companyStaffDirectory: [
    { id: "staff_asha", name: "Asha Menon", designation: "Outlet Admin", dept: "Head Office", email: "asha@yorestate.com", phone: "+91 98401 11021", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80", initials: "AM", bgColor: "#E0E7FF", color: "#3730A3" },
    { id: "staff_rahul", name: "Rahul Nair", designation: "Branch Manager", dept: "YOR South", email: "rahul@yorestate.com", phone: "+91 98402 33445", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", initials: "RN", bgColor: "#FEF3C7", color: "#92400E" },
    { id: "staff_sarah", name: "Sarah Coleman", designation: "Sales Lead", dept: "YOR Central", email: "sarah@yorestate.com", phone: "+91 98403 55667", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80", initials: "SC", bgColor: "#D1FAE5", color: "#065F46" },
    { id: "staff_arjun", name: "Arjun Mehta", designation: "Sales Executive", dept: "YOR Central", email: "arjun@yorestate.com", phone: "+91 98404 77889", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", initials: "AM", bgColor: "#FCE7F3", color: "#9D174D" },
    { id: "staff_priya", name: "Priya Das", designation: "Finance & Accounts Lead", dept: "Head Office", email: "priya@yorestate.com", phone: "+91 98405 99001", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", initials: "PD", bgColor: "#DBEAFE", color: "#1E40AF" },
    { id: "staff_riyas", name: "Riyas Ali", designation: "Sales Executive", dept: "YOR South", email: "riyas@yorestate.com", phone: "+91 98406 11223", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80", initials: "RA", bgColor: "#EDE9FE", color: "#5B21B6" },
    { id: "staff_siti", name: "Siti Rahman", designation: "Operations Manager", dept: "YOR North", email: "siti@yorestate.com", phone: "+91 98407 33445", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", initials: "SR", bgColor: "#CCFBF1", color: "#115E59" },
    { id: "staff_may", name: "May Lim", designation: "Finance & Accounts Lead", dept: "YOR East", email: "may@yorestate.com", phone: "+91 98408 55667", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&auto=format&fit=crop&q=80", initials: "ML", bgColor: "#FEE2E2", color: "#991B1B" },
    { id: "staff_kevin", name: "Kevin Rao", designation: "Sales Executive", dept: "YOR North", email: "kevin@yorestate.com", phone: "+91 98409 77889", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80", initials: "KR", bgColor: "#FEF9C3", color: "#854D0E" },
    { id: "staff_daniel", name: "Daniel Lee", designation: "Operations Manager", dept: "YOR West", email: "daniel@yorestate.com", phone: "+91 98410 99001", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80", initials: "DL", bgColor: "#E0E7FF", color: "#3730A3" },
    { id: "staff_kavita", name: "Kavita Sundaram", designation: "Legal Officer", dept: "Head Office", email: "kavita@yorestate.com", phone: "+91 98411 22334", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80", initials: "KS", bgColor: "#F1F5F9", color: "#334155" },
    { id: "staff_vikram", name: "Vikramaditya Varma", designation: "Outlet Admin", dept: "Head Office", email: "vikram@yorestate.com", phone: "+91 98412 44556", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80", initials: "VV", bgColor: "#FEF3C7", color: "#78350F" },
    { id: "staff_ananya", name: "Ananya Deshmukh", designation: "Operations Manager", dept: "Direct Hire", email: "ananya@yorestate.com", phone: "+91 98413 66778", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", initials: "AD", bgColor: "#D1FAE5", color: "#065F46" },
    { id: "staff_karthik", name: "Karthik Subramanian", designation: "Sales Lead", dept: "YOR Central", email: "karthik@yorestate.com", phone: "+91 98414 88990", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80", initials: "KS", bgColor: "#FCE7F3", color: "#831843" },
    { id: "staff_sneha", name: "Sneha Kurian", designation: "Finance & Accounts Lead", dept: "YOR South", email: "sneha@yorestate.com", phone: "+91 98415 00112", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80", initials: "SK", bgColor: "#EDE9FE", color: "#4C1D95" }
  ],

  // Open Sliding Page Drawer
  openSlidingPage() {
    let drawerOverlay = document.getElementById('outletSlidingDrawerOverlay');
    if (!drawerOverlay) {
      drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'outletSlidingDrawerOverlay';
      drawerOverlay.className = 'outlet-sliding-drawer-overlay';
      drawerOverlay.innerHTML = `
        <div class="outlet-sliding-drawer-backdrop" onclick="window.outletWizard.closeSlidingPage()"></div>
        <div class="outlet-sliding-drawer-panel" id="outletSlidingDrawerPanel">
          <!-- Dynamic Content Injected Here -->
        </div>
      `;
      document.body.appendChild(drawerOverlay);
    }

    const panel = document.getElementById('outletSlidingDrawerPanel');
    drawerOverlay.classList.remove('open');
    panel.innerHTML = renderOutletCreationFormHtml(true);
    panel.scrollTop = 0;
    panel.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Initialize state, steps, and live preview without scrolling
    window._outletWizardStep = 1;
    for (let i = 1; i <= 3; i++) {
      const p = document.getElementById(`outletStepPanel${i}`);
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
    const drawerOverlay = document.getElementById('outletSlidingDrawerOverlay');
    if (drawerOverlay && drawerOverlay.classList.contains('open')) {
      drawerOverlay.classList.remove('open');
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 660);
    } else {
      window.router.navigate('outlets');
    }
  },

  goToStep(step) {
    window._outletWizardStep = step;
    
    for (let i = 1; i <= 3; i++) {
      const p = document.getElementById(`outletStepPanel${i}`);
      if (p) p.classList.toggle('active', i === step);
    }

    document.querySelectorAll('.wizard-stepper-card .wizard-step').forEach(ws => {
      const s = parseInt(ws.dataset.step, 10);
      ws.classList.toggle('active', s === step);
      ws.classList.toggle('completed', s < step);
      const badge = ws.querySelector('.step-badge');
      if (badge && s < 3) {
        badge.textContent = s < step ? '✓' : String(s);
      }
    });

    document.querySelectorAll('.wizard-stepper-card .wizard-step-line').forEach((line, idx) => {
      line.classList.toggle('done', (idx + 1) < step);
    });

    const panel = document.getElementById('outletSlidingDrawerPanel');
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.saveDraft(false);
  },

  nextStep(current) {
    if (current === 1) {
      const name = document.getElementById('out_name')?.value;
      const code = document.getElementById('out_code')?.value;
      if (!name || !code) {
        if (window.modals && window.modals.showToast) {
          window.modals.showToast('Please enter Branch Name and Branch Code to proceed', 'error');
        }
        return;
      }
    }
    if (current === 2) {
      const address = document.getElementById('out_address')?.value;
      if (!address) {
        if (window.modals && window.modals.showToast) {
          window.modals.showToast('Please enter Physical Street Address', 'error');
        }
        return;
      }
    }
    this.goToStep(current + 1);
  },

  prevStep(current) {
    this.goToStep(Math.max(1, current - 1));
  },

  // ---------- STAFF SEARCH AUTO-SUGGEST DROPDOWN LOGIC ----------
  onStaffSearchInput(query) {
    const clearBtn = document.getElementById('btnStaffSearchClear');
    if (clearBtn) {
      clearBtn.style.display = query ? 'flex' : 'none';
    }
    this.renderStaffDropdown(query);
  },

  openStaffDropdown() {
    const input = document.getElementById('staffSearchInput');
    const query = input ? input.value : '';
    this.renderStaffDropdown(query);

    // Attach click outside listener
    setTimeout(() => {
      document.addEventListener('click', this._handleOutsideStaffClick);
    }, 10);
  },

  closeStaffDropdown() {
    const dropdown = document.getElementById('staffSearchDropdown');
    if (dropdown) dropdown.style.display = 'none';
    document.removeEventListener('click', this._handleOutsideStaffClick);
  },

  _handleOutsideStaffClick(e) {
    const wrapper = document.getElementById('staffSearchWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      window.outletWizard.closeStaffDropdown();
    }
  },

  clearStaffSearch() {
    const input = document.getElementById('staffSearchInput');
    if (input) {
      input.value = '';
      input.focus();
    }
    const clearBtn = document.getElementById('btnStaffSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';
    this.renderStaffDropdown('');
  },

  onStaffSearchKeydown(event) {
    if (event.key === 'Escape') {
      this.closeStaffDropdown();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const input = document.getElementById('staffSearchInput');
      const val = input ? input.value.trim() : '';
      if (!val) return;

      const q = val.toLowerCase();
      const matched = this.companyStaffDirectory.find(s => s.name.toLowerCase().includes(q));
      if (matched) {
        this.addStaffDirect(matched.name, matched.designation, matched.email, matched.phone, matched.avatar);
      } else {
        const genEmail = val.toLowerCase().replace(/[^a-z]/g, '') + '@yorestate.com';
        const genPhone = '+91 984' + Math.floor(1000000 + Math.random() * 9000000).toString().slice(0, 7);
        this.addStaffDirect(val, 'Sales Executive', genEmail, genPhone, '');
      }
    }
  },

  renderStaffDropdown(query = '') {
    const dropdown = document.getElementById('staffSearchDropdown');
    if (!dropdown) return;

    const q = query.trim().toLowerCase();
    
    // Get list of currently added names to show badge
    const existingNames = Array.from(document.querySelectorAll('#managerRosterTableBody .mgr-table-name'))
      .map(el => el.textContent.trim().toLowerCase());

    // Filter directory
    let filtered = this.companyStaffDirectory;
    if (q) {
      filtered = this.companyStaffDirectory.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.designation.toLowerCase().includes(q) || 
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q)) ||
        s.dept.toLowerCase().includes(q)
      );
    }

    let html = `
      <div class="staff-dropdown-header">
        <span>Company Personnel Directory (${filtered.length} found)</span>
        <span>Click to add</span>
      </div>
    `;

    if (filtered.length === 0) {
      html += `
        <div style="padding: 12px 10px; font-size: 12px; color: var(--ink-2); text-align: center;">
          No matching company personnel for "<b>${query}</b>"
        </div>
      `;
    } else {
      html += filtered.map(s => {
        const isAdded = existingNames.includes(s.name.toLowerCase());
        const initials = s.initials || s.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

        return `
          <div class="staff-search-item ${isAdded ? 'already-added' : ''}" onclick="window.outletWizard.addStaffDirect('${s.name}', '${s.designation}', '${s.email}', '${s.phone}', '${s.avatar}')">
            <div class="staff-search-item-left">
              ${s.avatar ? `
                <img src="${s.avatar}" class="staff-avatar-photo" alt="${s.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="staff-avatar-initials" style="background:${s.bgColor || '#E2E8F0'}; color:${s.color || '#334155'}; display:none;">${initials}</div>
              ` : `
                <div class="staff-avatar-initials" style="background:${s.bgColor || '#E2E8F0'}; color:${s.color || '#334155'};">${initials}</div>
              `}
              <div class="staff-item-info">
                <div class="staff-item-name">${s.name}</div>
                <div class="staff-item-meta">
                  <span class="chip xs gold font-mono" style="font-size:9.5px; padding:1px 6px;">${s.designation}</span>
                  <span style="font-family:var(--font-mono); font-size:10.5px;">${s.phone}</span>
                </div>
              </div>
            </div>

            <div>
              ${isAdded ? `
                <span class="chip xs green" style="font-size: 10px; font-weight: 600;">✓ Added</span>
              ` : `
                <button class="staff-item-add-btn" type="button">+ Add</button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    // Direct hire custom addition
    const exactMatch = this.companyStaffDirectory.some(s => s.name.toLowerCase() === q);
    if (q && !exactMatch) {
      const cleanName = query.trim();
      const genEmail = cleanName.toLowerCase().replace(/[^a-z]/g, '') + '@yorestate.com';
      const genPhone = '+91 984' + Math.floor(1000000 + Math.random() * 9000000).toString().slice(0, 7);

      html += `
        <div class="staff-search-custom-add" onclick="window.outletWizard.addStaffDirect('${cleanName}', 'Sales Executive', '${genEmail}', '${genPhone}', '')">
          <div style="width:28px; height:28px; border-radius:50%; background:var(--gold-soft); color:var(--gold-text); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">+</div>
          <div>
            <b>+ Add "${cleanName}" as New Direct Hire</b>
            <div style="font-size:10.5px; color:var(--ink-2); font-weight:normal;">Role: Sales Executive · ${genEmail}</div>
          </div>
        </div>
      `;
    }

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  },

  addStaffDirect(name, designation = 'Sales Executive', email = '', phone = '', avatar = '') {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();

    const existingNames = Array.from(document.querySelectorAll('#managerRosterTableBody .mgr-table-name'))
      .map(el => el.textContent.trim().toLowerCase());
    
    if (existingNames.includes(cleanName.toLowerCase())) {
      if (window.modals && window.modals.showToast) {
        window.modals.showToast(`${cleanName} is already assigned to this outlet`, 'info');
      }
      this.closeStaffDropdown();
      return;
    }

    const tableBody = document.getElementById('managerRosterTableBody');
    if (!tableBody) return;

    const emptyRow = document.getElementById('noStaffRow');
    if (emptyRow) emptyRow.remove();

    const matchedStaff = this.companyStaffDirectory.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
    const finalAvatar = avatar || matchedStaff?.avatar || '';
    const initials = cleanName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'ST';
    const bgColor = matchedStaff?.bgColor || '#E2E8F0';
    const textColor = matchedStaff?.color || '#334155';
    const finalDesig = designation || matchedStaff?.designation || 'Sales Executive';
    const finalPhone = phone || matchedStaff?.phone || '+91 98401 22334';
    const finalEmail = email || matchedStaff?.email || (cleanName.toLowerCase().replace(/[^a-z]/g, '') + '@yorestate.com');

    const newId = `mgr_${Date.now()}`;
    const rowCount = tableBody.querySelectorAll('tr.staff-table-row').length + 1;

    const tr = document.createElement('tr');
    tr.className = 'staff-table-row';
    tr.setAttribute('data-manager-id', newId);
    tr.style.borderBottom = '1px solid var(--line)';
    tr.innerHTML = `
      <td class="row-index" style="text-align: center; padding: 10px 12px; font-weight: 600; color: var(--ink-3); font-size: 12px;">
        ${rowCount}
      </td>
      <td style="padding: 10px 12px;">
        <div class="staff-cell-user">
          ${finalAvatar ? `
            <img src="${finalAvatar}" class="staff-cell-avatar" alt="${cleanName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="staff-cell-initials" style="background:${bgColor}; color:${textColor}; display:none;">${initials}</div>
          ` : `
            <div class="staff-cell-initials" style="background:${bgColor}; color:${textColor};">${initials}</div>
          `}
          <b class="mgr-table-name" style="font-size: 13px; color: var(--ink);">${cleanName}</b>
        </div>
      </td>
      <td style="padding: 10px 12px;">
        <span class="chip gold xs font-mono mgr-table-role-label" style="font-size: 11px; font-weight: 600; padding: 4px 9px; display: inline-block;">
          ${finalDesig}
        </span>
        <input type="hidden" class="mgr-table-role" value="${finalDesig}">
      </td>
      <td style="padding: 10px 12px;">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span class="mgr-table-phone" style="font-size: 12px; font-weight:600; color: var(--ink); font-family: var(--font-mono); display:flex; align-items:center; gap:5px;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color:var(--ink-3);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${finalPhone}
          </span>
          <span class="mgr-table-email xs muted" style="font-size: 11px; display:flex; align-items:center; gap:5px;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color:var(--ink-3);"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            ${finalEmail}
          </span>
        </div>
      </td>
      <td style="text-align: center; padding: 10px 12px;">
        <button class="btn xs red" type="button" onclick="window.outletWizard.removeManagerRow('${newId}')" title="Delete">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
    
    const input = document.getElementById('staffSearchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('btnStaffSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';
    this.closeStaffDropdown();

    this.reindexTableRows();
    this.syncLivePreview();
    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Added ${cleanName} as ${finalDesig}`);
    }
  },

  updateTableRole(selectEl) {
    this.syncLivePreview();
    const row = selectEl.closest('tr.staff-table-row');
    const name = row?.querySelector('.mgr-table-name')?.textContent || 'Staff member';
    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Updated ${name}'s designation to ${selectEl.value}`);
    }
  },

  removeManagerRow(id) {
    const row = document.querySelector(`tr.staff-table-row[data-manager-id="${id}"]`);
    if (row) {
      const name = row.querySelector('.mgr-table-name')?.textContent || 'Staff member';
      row.remove();
      this.reindexTableRows();
      this.checkEmptyTable();
      this.syncLivePreview();
      if (window.modals && window.modals.showToast) {
        window.modals.showToast(`Removed ${name} from outlet roster`);
      }
    }
  },

  reindexTableRows() {
    const rows = document.querySelectorAll('#managerRosterTableBody tr.staff-table-row');
    rows.forEach((r, idx) => {
      const idxCell = r.querySelector('.row-index');
      if (idxCell) idxCell.textContent = idx + 1;
    });
  },

  checkEmptyTable() {
    const tableBody = document.getElementById('managerRosterTableBody');
    if (!tableBody) return;
    const rows = tableBody.querySelectorAll('tr.staff-table-row');
    if (rows.length === 0) {
      tableBody.innerHTML = `
        <tr id="noStaffRow">
          <td colspan="5" style="text-align: center; padding: 28px; color: var(--ink-3); font-size: 12.5px;">
            No personnel assigned yet. Use the search bar above to select and add staff.
          </td>
        </tr>
      `;
    }
  },

  // ---------- OUTLET IMAGE UPLOAD & PRESET SELECTION ----------
  onOutletImageUrlInput(url) {
    const previewImg = document.getElementById('outletImgPreview');
    if (previewImg) {
      previewImg.src = url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80';
    }
    document.querySelectorAll('.outlet-preset-item').forEach(el => el.classList.remove('active'));
    this.syncLivePreview();
  },

  handleOutletFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const urlInput = document.getElementById('out_image');
      if (urlInput) urlInput.value = dataUrl;
      const previewImg = document.getElementById('outletImgPreview');
      if (previewImg) previewImg.src = dataUrl;
      
      document.querySelectorAll('.outlet-preset-item').forEach(el => el.classList.remove('active'));
      this.syncLivePreview();
      if (window.modals && window.modals.showToast) {
        window.modals.showToast('Branch facade photo uploaded!');
      }
    };
    reader.readAsDataURL(file);
  },

  selectImagePreset(url, el) {
    const urlInput = document.getElementById('out_image');
    if (urlInput) urlInput.value = url;
    const previewImg = document.getElementById('outletImgPreview');
    if (previewImg) previewImg.src = url;

    document.querySelectorAll('.outlet-preset-item').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');
    
    this.syncLivePreview();
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Selected facade preset');
    }
  },

  getFormData() {
    const name = document.getElementById('out_name')?.value || '';
    const code = document.getElementById('out_code')?.value || '';
    const country = document.getElementById('out_country')?.value || 'India';
    const currency = document.getElementById('out_currency')?.value || 'INR (₹) - Indian Rupee';
    const tier = document.getElementById('out_tier')?.value || 'Tier 1 Flagship Experience Centre';
    const state = document.getElementById('out_state')?.value || 'Karnataka';
    const district = document.getElementById('out_district')?.value || 'Bengaluru Urban';
    const status = document.getElementById('out_status')?.value || 'Active Operational';
    
    const targetPeriod = document.getElementById('out_targetPeriod')?.value || 'Q1 2026 (Apr - Jun)';
    const salesTargetCr = document.getElementById('out_salesTargetCr')?.value || '25.0';
    const rentalTargetL = document.getElementById('out_rentalTargetL')?.value || '45.0';
    const targetNotes = document.getElementById('out_targetNotes')?.value || 'Initial branch launch target baseline set by HQ Strategy Board';
    
    const image = document.getElementById('out_image')?.value || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80';
    const address = document.getElementById('out_address')?.value || '';
    const landmark = document.getElementById('out_landmark')?.value || '';
    const pincode = document.getElementById('out_pincode')?.value || '';
    const carpetArea = document.getElementById('out_carpetArea')?.value || '';
    const email = document.getElementById('out_email')?.value || 'blr.flagship@yorestate.com';
    const phone = document.getElementById('out_phone')?.value || '+91 80 4912 8800';
    const operatingBank = document.getElementById('out_operatingBank')?.value || 'HDFC Bank Commercial Branch A/C';
    const gstin = document.getElementById('out_gstin')?.value || '';

    const managers = [];
    document.querySelectorAll('#managerRosterTableBody tr.staff-table-row').forEach((row, idx) => {
      const id = row.getAttribute('data-manager-id') || `mgr_${idx+1}`;
      const nameVal = row.querySelector('.mgr-table-name')?.textContent?.trim() || `Staff ${idx+1}`;
      const desigVal = row.querySelector('.mgr-table-role')?.value || 'Sales Executive';
      const phoneVal = row.querySelector('.mgr-table-phone')?.textContent?.trim() || '+91 98401 22334';
      const emailVal = row.querySelector('.mgr-table-email')?.textContent?.trim() || `${nameVal.toLowerCase().replace(/[^a-z]/g, '')}@yorestate.com`;
      const avatarImg = row.querySelector('.staff-cell-avatar')?.getAttribute('src') || '';

      managers.push({
        id,
        name: nameVal,
        designation: desigVal,
        role: desigVal,
        email: emailVal,
        phone: phoneVal,
        avatar: avatarImg,
        department: desigVal.includes('Sales') ? 'Sales' : desigVal.includes('Finance') ? 'Finance' : desigVal.includes('Legal') ? 'Legal' : 'Management'
      });
    });

    return {
      name, code, country, currency, tier, state, district, status,
      targetPeriod, salesTargetCr, rentalTargetL, targetNotes,
      image, address, landmark, pincode, carpetArea, email, phone, operatingBank, gstin,
      managers: managers.length > 0 ? managers : [
        { id: "mgr_1", name: "Vikramaditya Varma", designation: "Outlet Admin", role: "Outlet Admin", email: "vikram@yorestate.com", phone: "+91 98412 44556" }
      ]
    };
  },

  syncLivePreview() {
    const d = this.getFormData();
    
    let currSymbol = '₹';
    let currCode = 'INR';
    if (d.currency) {
      if (d.currency.includes('AED') || d.currency.includes('د.إ')) { currSymbol = 'AED '; currCode = 'AED'; }
      else if (d.currency.includes('USD') || d.currency.includes('$')) { currSymbol = '$'; currCode = 'USD'; }
      else if (d.currency.includes('SGD') || d.currency.includes('S$')) { currSymbol = 'S$'; currCode = 'SGD'; }
      else if (d.currency.includes('SAR') || d.currency.includes('﷼')) { currSymbol = 'SAR '; currCode = 'SAR'; }
      else if (d.currency.includes('GBP') || d.currency.includes('£')) { currSymbol = '£'; currCode = 'GBP'; }
      else if (d.currency.includes('EUR') || d.currency.includes('€')) { currSymbol = '€'; currCode = 'EUR'; }
      else if (d.currency.includes('QAR')) { currSymbol = 'QAR '; currCode = 'QAR'; }
    }

    const prevName = document.getElementById('prev_out_name');
    if (prevName) prevName.textContent = d.name || 'YOR Bengaluru Central Flagship';
    
    const prevCode = document.getElementById('prev_out_code');
    if (prevCode) prevCode.textContent = d.code || 'OUT-06-BLR';

    const prevCountryBadge = document.getElementById('prev_out_country_badge');
    if (prevCountryBadge) prevCountryBadge.textContent = d.country || 'India';
    
    const prevTier = document.getElementById('prev_out_tier');
    if (prevTier) prevTier.textContent = d.tier;

    const prevHeroBg = document.getElementById('prev_hero_bg');
    if (prevHeroBg && d.image) {
      prevHeroBg.style.background = `linear-gradient(180deg, rgba(20,23,26,0.4) 0%, rgba(20,23,26,0.92) 100%), url('${d.image}') center/cover no-repeat`;
    }

    const prevPeriod = document.getElementById('prev_out_period');
    if (prevPeriod) prevPeriod.textContent = d.targetPeriod || 'Q1 2026';

    const histPeriodBadge = document.getElementById('hist_period_badge');
    if (histPeriodBadge) histPeriodBadge.textContent = d.targetPeriod || 'Q1 2026';

    const histMetrics = document.getElementById('hist_curr_metrics');
    if (histMetrics) histMetrics.textContent = `Sales: ${currSymbol} ${d.salesTargetCr} Cr · Rent: ${currSymbol} ${d.rentalTargetL} L`;
    
    const prevLoc = document.getElementById('prev_out_location');
    if (prevLoc) prevLoc.textContent = `${d.district || 'Bengaluru Urban'} · ${d.state || 'Karnataka'} · ${d.country || 'India'}`;
    
    const prevPhone = document.getElementById('prev_out_phone');
    if (prevPhone) prevPhone.textContent = d.phone || '+91 80 4912 8800';

    const prevEmail = document.getElementById('prev_out_email');
    if (prevEmail) prevEmail.textContent = d.email || 'blr.flagship@yorestate.com';

    const prevCurrLabel = document.getElementById('prev_currency_label');
    if (prevCurrLabel) prevCurrLabel.textContent = currCode;

    const prevTarget = document.getElementById('prev_out_target');
    if (prevTarget) prevTarget.textContent = `${currSymbol} ${d.salesTargetCr} Cr`;
    
    const prevRental = document.getElementById('prev_out_rentaltarget');
    if (prevRental) prevRental.textContent = `${currSymbol} ${d.rentalTargetL} L / mo`;

    const treeDirector = document.getElementById('tree_branch_director');
    if (treeDirector) treeDirector.textContent = d.managers[0]?.name || 'Branch Leader';

    const treeBranchName = document.getElementById('tree_branch_name');
    if (treeBranchName) treeBranchName.textContent = d.name || 'YOR Bengaluru Central';

    const treeOps = document.getElementById('tree_ops_mgr');
    if (treeOps) treeOps.textContent = d.managers[1]?.name || 'Operations Lead';

    const treeSales = document.getElementById('tree_sales_mgr');
    if (treeSales) treeSales.textContent = d.managers[2]?.name || 'Sales Lead';

    const treeRent = document.getElementById('tree_rent_mgr');
    if (treeRent) treeRent.textContent = d.managers[3]?.name || 'Accounts Lead';

    const prevMgrCount = document.getElementById('prev_mgr_count');
    if (prevMgrCount) prevMgrCount.textContent = d.managers.length;

    const prevMgrList = document.getElementById('prev_mgr_list');
    if (prevMgrList) {
      prevMgrList.innerHTML = d.managers.map(m => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--canvas-subtle); padding:6px 10px; border-radius:6px;">
          <b style="font-size:12px;">${m.name}</b>
          <span class="chip gold xs" style="font-size:9.5px;">${m.designation || 'Staff'}</span>
        </div>
      `).join('');
    }
  },

  fillDemoData() {
    window.store.saveOutletDraft({
      name: "YOR Bengaluru Central Flagship",
      code: "OUT-06-BLR",
      country: "India",
      currency: "INR (₹) - Indian Rupee",
      tier: "Tier 1 Flagship Experience Centre",
      state: "Karnataka",
      district: "Bengaluru Urban",
      status: "Active Operational",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
      targetPeriod: "Q1 2026 (Apr - Jun)",
      salesTargetCr: "35.0",
      rentalTargetL: "60.0",
      targetNotes: "Q1 luxury expansion target baseline approved by Board",
      targetHistory: [
        { id: "TGT-01", period: "Q1 2026 (Apr - Jun)", salesTarget: "35.0", rentalTarget: "60.0", setAt: "2026-04-01", setBy: "Super Admin", remarks: "Q1 Flagship baseline target" }
      ],
      address: "842, 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru",
      landmark: "Near Indiranagar Metro Station",
      pincode: "560038",
      carpetArea: "6,800",
      email: "blr.flagship@yorestate.com",
      phone: "+91 80 4912 8800",
      operatingBank: "HDFC Bank Commercial Branch A/C",
      gstin: "29AABCU9603R1ZM",
      managers: [
        { id: "mgr_1", name: "Vikramaditya Varma", designation: "Outlet Admin", email: "vikram@yorestate.com", phone: "+91 98412 44556", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" },
        { id: "mgr_2", name: "Ananya Deshmukh", designation: "Operations Manager", email: "ananya@yorestate.com", phone: "+91 98413 66778", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
        { id: "mgr_3", name: "Karthik Subramanian", designation: "Sales Lead", email: "karthik@yorestate.com", phone: "+91 98414 88990", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" },
        { id: "mgr_4", name: "Sneha Kurian", designation: "Finance & Accounts Lead", email: "sneha@yorestate.com", phone: "+91 98415 00112", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80" }
      ]
    });
    window._outletWizardStep = 1;
    
    // If sliding panel is open, re-render panel
    const panel = document.getElementById('outletSlidingDrawerPanel');
    if (panel) {
      panel.innerHTML = renderOutletCreationFormHtml(true);
      setTimeout(() => {
        this.goToStep(1);
        this.syncLivePreview();
      }, 50);
    } else {
      window.router.navigate('outlet-new');
    }
    
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Flagship branch data, facade photo, and periodic targets loaded!');
    }
  },

  saveDraft(showToast = true) {
    const data = this.getFormData();
    window.store.saveOutletDraft(data);
    if (showToast && window.modals && window.modals.showToast) {
      window.modals.showToast('Outlet configuration draft saved locally!');
    }
  },

  clearDraft() {
    window.store.clearOutletDraft();
    window._outletWizardStep = 1;
    
    const panel = document.getElementById('outletSlidingDrawerPanel');
    if (panel) {
      panel.innerHTML = renderOutletCreationFormHtml(true);
      setTimeout(() => {
        this.goToStep(1);
        this.syncLivePreview();
      }, 50);
    } else {
      window.router.navigate('outlet-new');
    }
    
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Outlet draft discarded');
    }
  },

  submitOutlet() {
    const data = this.getFormData();
    if (!data.name || !data.code) {
      if (window.modals && window.modals.showToast) {
        window.modals.showToast('Please specify Branch Name and Branch Code', 'error');
      }
      this.goToStep(1);
      return;
    }

    let currSymbol = '₹';
    if (data.currency) {
      if (data.currency.includes('AED') || data.currency.includes('د.إ')) currSymbol = 'AED ';
      else if (data.currency.includes('USD') || data.currency.includes('$')) currSymbol = '$';
      else if (data.currency.includes('SGD') || data.currency.includes('S$')) currSymbol = 'S$';
      else if (data.currency.includes('SAR') || data.currency.includes('﷼')) currSymbol = 'SAR ';
      else if (data.currency.includes('GBP') || data.currency.includes('£')) currSymbol = '£';
      else if (data.currency.includes('EUR') || data.currency.includes('€')) currSymbol = '€';
      else if (data.currency.includes('QAR')) currSymbol = 'QAR ';
    }

    const targetRecord = {
      id: `TGT-${Date.now()}`,
      period: data.targetPeriod || "Q1 2026",
      salesTarget: `${currSymbol} ${data.salesTargetCr} Cr`,
      rentalTarget: `${currSymbol} ${data.rentalTargetL} L / mo`,
      setAt: new Date().toISOString().split('T')[0],
      setBy: window.store?.currentRole || "Outlet Admin",
      remarks: data.targetNotes || "Initial launch target baseline"
    };

    const newOutlet = window.store.addOutlet({
      name: data.name,
      code: data.code,
      country: data.country,
      currency: data.currency,
      image: data.image,
      email: data.email,
      phone: data.phone,
      targetPeriod: data.targetPeriod,
      targetNotes: data.targetNotes,
      targetHistory: [targetRecord],
      location: `${data.district || 'Bengaluru'}, ${data.state || 'Karnataka'}, ${data.country || 'India'}`,
      state: data.state,
      district: data.district,
      address: data.address,
      tier: data.tier,
      salesTarget: `${currSymbol} ${data.salesTargetCr} Cr / mo`,
      rentalTarget: `${currSymbol} ${data.rentalTargetL} L / mo`,
      bankAccount: data.operatingBank,
      gstin: data.gstin,
      status: data.status,
      users: data.managers.length + 8
    }, data.managers);

    window._outletWizardStep = 1;
    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Branch "${newOutlet.name}" & ${data.managers.length} staff members provisioned!`);
    }
    
    this.closeSlidingPage();

    if (window.router.currentRoute === 'outlets') {
      window.router.navigate('outlets');
    }
  }
};
