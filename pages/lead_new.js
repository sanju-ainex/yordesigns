/* ==========================================================================
   YOR Estate - Dedicated Sliding Lead Creation & Sales CRM Intake Module
   ========================================================================== */

function renderCustomSelectLead(id, name, currentValue, options) {
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
          <div class="custom-select-item ${opt.value === currentOption.value ? 'selected' : ''}" data-value="${opt.value}" onclick="window.customSelect ? window.customSelect.select(this) : null; window.leadWizard && window.leadWizard.syncLivePreview();">
            <span>${opt.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLeadNewPage() {
  setTimeout(() => {
    window.router.navigate('sales', false);
    if (window.leadWizard && window.leadWizard.openSlidingPage) {
      window.leadWizard.openSlidingPage();
    }
  }, 10);
  return renderSalesPage();
}

// Reusable Form HTML Generator for both Full Page & Sliding Panel
function renderLeadCreationFormHtml(isSlidingDrawer = false, defaultOutlet = null) {
  const store = window.store;
  const draft = (store && store.getLeadDraft && store.getLeadDraft()) || {};
  const currentStep = window._leadWizardStep || 1;
  const outlets = (store && store.data && store.data.outlets) || [];
  const properties = (store && store.data && store.data.properties) || [];

  const initialOutlet = defaultOutlet || draft.outlet || (outlets[0]?.name || "YOR Central");

  const lead = {
    name: draft.name || "",
    phone: draft.phone || "",
    email: draft.email || "",
    city: draft.city || "Bengaluru",
    budget: draft.budget || "4.85",
    horizon: draft.horizon || "Immediate (0-15 days)",
    outlet: initialOutlet,
    priority: draft.priority || "High",
    source: draft.source || "Website Direct",
    assigned: draft.assigned || "Sarah Coleman",
    property: draft.property || (properties[0]?.name || "The Imperial Azure Sky Penthouse"),
    category: draft.category || "Luxury Residential Villa",
    intent: draft.intent || "Self-Use Primary Residence",
    notes: draft.notes || "Client expressed keen interest in 4 BHK premium villa with private pool and clear Kaveri title deeds.",
    taskType: draft.taskType || "Site Visit",
    taskTitle: draft.taskTitle || "Private on-site walkthrough & survey layout presentation",
    taskDue: draft.taskDue || "Tomorrow, 4:00 PM"
  };

  return `
    <!-- Top Header Bar & Stepper inside Dedicated Sticky Wrapper -->
    <div class="drawer-header-sticky-wrap">
      <div class="user-wizard-top">
        <div class="user-wizard-title-wrap">
          <div class="user-wizard-crumbs">
            <a href="#sales" onclick="window.leadWizard.closeSlidingPage(); return false;">Sales CRM & Pipeline</a>
            <span>/</span>
            <span>${isSlidingDrawer ? 'Onboard Sales Lead' : 'New Lead Intake'}</span>
          </div>
          <h1>${isSlidingDrawer ? 'Add & Qualify Sales Lead' : '+ Add New Sales Lead'}</h1>
          <p>Capture prospective buyer inquiries, assign branch outlet ownership, map property preferences, and schedule first follow-up action.</p>
        </div>

        <div class="user-wizard-top-actions">
          <button class="btn sm" id="btnFillDemoLead" onclick="window.leadWizard.fillDemoData()" title="Pre-fill with realistic luxury buyer lead data">
            ⚡ Fill Demo Lead
          </button>
          <button class="btn sm" id="btnSaveLeadDraft" onclick="window.leadWizard.saveDraft(true)">
            💾 Save Draft
          </button>
          <button class="btn" onclick="window.leadWizard.closeSlidingPage()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
          <button class="btn dark gold-glow" onclick="window.leadWizard.submitLead()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Create & Assign Lead
          </button>
        </div>
      </div>

      <!-- Stepper Navigation Bar -->
      <div class="card wizard-stepper-card" style="padding: 12px 18px;">
        <div class="wizard-stepper">
          
          <div class="wizard-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}" data-step="1" onclick="window.leadWizard.goToStep(1)">
            <div class="step-badge">${currentStep > 1 ? '✓' : '1'}</div>
            <div class="step-meta">
              <span class="step-num">Step 1</span>
              <b class="step-title">Client Identity & Budget</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 1 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}" data-step="2" onclick="window.leadWizard.goToStep(2)">
            <div class="step-badge">${currentStep > 2 ? '✓' : '2'}</div>
            <div class="step-meta">
              <span class="step-num">Step 2</span>
              <b class="step-title">Outlet & Sales Agent</b>
            </div>
          </div>

          <div class="wizard-step-line ${currentStep > 2 ? 'done' : ''}"></div>

          <div class="wizard-step ${currentStep === 3 ? 'active' : ''}" data-step="3" onclick="window.leadWizard.goToStep(3)">
            <div class="step-badge">3</div>
            <div class="step-meta">
              <span class="step-num">Step 3</span>
              <b class="step-title">Property Interest & Task</b>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Main Wizard 2-Column Grid (68% Form Panels, 32% Live Preview Sidebar) -->
    <div class="grid-wizard">
      
      <!-- LEFT: Step-by-Step Panels -->
      <div class="stack" style="gap: 20px;">
        <form id="leadWizardForm" onsubmit="return false;">

          <!-- STEP 1: CLIENT IDENTITY & BUDGET -->
          <div class="card wizard-panel ${currentStep === 1 ? 'active' : ''}" id="leadStepPanel1" style="padding: 22px;">
            <div class="ch" style="margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600;">1. Client Identity & Investment Budget</h3>
                <p style="font-size: 12.5px; color: var(--ink-2);">Enter prospect contact coordinates, residential location, and allocated acquisition budget.</p>
              </div>
              <span class="chip blue xs">Step 1 of 3</span>
            </div>

            <div class="wizard-form-body">
              <div class="grid-2" style="gap: 16px;">
                <div class="field">
                  <label>Client Full Name <span class="req">*</span></label>
                  <div class="input-wrap">
                    <input type="text" id="lead_name" name="name" required value="${lead.name}" placeholder="e.g. Vikramaditya Singhania" oninput="window.leadWizard.syncLivePreview()">
                  </div>
                  <small class="muted">Primary buyer or authorized investment representative.</small>
                </div>

                <div class="field">
                  <label>Phone Number (WhatsApp Verified) <span class="req">*</span></label>
                  <div class="input-wrap">
                    <input type="tel" id="lead_phone" name="phone" required value="${lead.phone}" placeholder="e.g. +91 98401 55667" oninput="window.leadWizard.syncLivePreview()">
                  </div>
                  <small class="muted">Used for immediate call-logs and site visit alerts.</small>
                </div>
              </div>

              <div class="grid-2" style="gap: 16px; margin-top: 14px;">
                <div class="field">
                  <label>Email Address</label>
                  <div class="input-wrap">
                    <input type="email" id="lead_email" name="email" value="${lead.email}" placeholder="e.g. vikram@singhaniaholdings.in" oninput="window.leadWizard.syncLivePreview()">
                  </div>
                  <small class="muted">For automated legal brochure and title deed delivery.</small>
                </div>

                <div class="field">
                  <label>Resident City / Location</label>
                  <div class="input-wrap">
                    <input type="text" id="lead_city" name="city" value="${lead.city}" placeholder="e.g. Bengaluru / Dubai / Singapore" oninput="window.leadWizard.syncLivePreview()">
                  </div>
                </div>
              </div>

              <div class="grid-2" style="gap: 16px; margin-top: 14px;">
                <div class="field">
                  <label>Target Acquisition Budget (₹ Crores) <span class="req">*</span></label>
                  <div class="input-wrap">
                    <span style="padding-left:12px; font-weight:600; color:var(--ink)">₹</span>
                    <input type="number" step="0.1" id="lead_budget" name="budget" required value="${lead.budget}" placeholder="4.85" style="padding-left:4px" oninput="window.leadWizard.syncLivePreview()">
                    <span style="padding-right:12px; font-size:12px; color:var(--ink-2)">Cr</span>
                  </div>
                  <small class="muted">Maximum financial allocation for property purchase.</small>
                </div>

                <div class="field">
                  <label>Purchase Horizon & Readiness</label>
                  ${renderCustomSelectLead("lead_horizon", "horizon", lead.horizon, [
                    { value: "Immediate (0-15 days)", label: "⚡ Immediate (0 - 15 Days · Ready Funds)" },
                    { value: "Within 30 Days", label: "🗓️ Within 30 Days (Active Buyer)" },
                    { value: "1-3 Months", label: "⏳ 1 - 3 Months (Evaluating Options)" },
                    { value: "Exploring / Long Term", label: "🌱 Exploring / Long Term Investor" }
                  ])}
                </div>
              </div>
            </div>

            <div class="wizard-actions" style="margin-top: 24px;">
              <span class="muted xs font-mono" id="lead_draftMsg">Auto-save active</span>
              <button class="btn dark" type="button" onclick="window.leadWizard.nextStep(1)">
                Next: Outlet & Sales Agent →
              </button>
            </div>
          </div>

          <!-- STEP 2: OUTLET SCOPING & SALES AGENT -->
          <div class="card wizard-panel ${currentStep === 2 ? 'active' : ''}" id="leadStepPanel2" style="padding: 22px;">
            <div class="ch" style="margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600;">2. Outlet Branch Scoping & Assigned Sales Agent</h3>
                <p style="font-size: 12.5px; color: var(--ink-2);">Assign lead under a regional branch outlet for local territory governance and sales tracking.</p>
              </div>
              <span class="chip gold xs">Step 2 of 3</span>
            </div>

            <div class="wizard-form-body">
              <div class="grid-2" style="gap: 16px;">
                <div class="field">
                  <label>Assigned Branch Outlet <span class="req">*</span></label>
                  ${renderCustomSelectLead("lead_outlet", "outlet", lead.outlet, outlets.map(o => ({
                    value: o.name,
                    label: `📍 ${o.name} (${o.location || 'Branch'})`
                  })))}
                  <small class="muted">Lead will be grouped under this outlet and scoped to branch executives.</small>
                </div>

                <div class="field">
                  <label>Assigned Relationship Manager / Agent <span class="req">*</span></label>
                  ${renderCustomSelectLead("lead_assigned", "assigned", lead.assigned, [
                    { value: "Sarah Coleman", label: "Sarah Coleman (Senior Portfolio Mgr)" },
                    { value: "Arjun Mehta", label: "Arjun Mehta (Luxury Sales Specialist)" },
                    { value: "Rahul Nair", label: "Rahul Nair (Branch Manager - South)" },
                    { value: "Siti Rahman", label: "Siti Rahman (Operations Lead - North)" },
                    { value: "Riyas Ali", label: "Riyas Ali (Commercial Sales)" },
                    { value: "May Lim", label: "May Lim (East Branch Executive)" },
                    { value: "Kevin Rao", label: "Kevin Rao (Senior Consultant)" },
                    { value: "Daniel Lee", label: "Daniel Lee (West Branch Mgr)" }
                  ])}
                  <small class="muted">Responsible for following up, site visits, and deal conversion.</small>
                </div>
              </div>

              <div class="grid-2" style="gap: 16px; margin-top: 14px;">
                <div class="field">
                  <label>Lead Priority Level</label>
                  ${renderCustomSelectLead("lead_priority", "priority", lead.priority, [
                    { value: "High", label: "🔥 High Priority (Hot Deal · Immediate Action)" },
                    { value: "Medium", label: "✨ Medium Priority (Warm Prospect)" },
                    { value: "Low", label: "❄️ Low Priority (Nurturing Stage)" }
                  ])}
                </div>

                <div class="field">
                  <label>Lead Inflow Source</label>
                  ${renderCustomSelectLead("lead_source", "source", lead.source, [
                    { value: "Website Direct", label: "🌐 Website Direct Luxury Portal" },
                    { value: "Walk-in Branch", label: "🏢 Walk-in Branch Experience Centre" },
                    { value: "Referral", label: "🤝 Referral from Client / Existing Investor" },
                    { value: "Channel Partner / Agent", label: "💼 Channel Partner / Broker Network" },
                    { value: "Instagram / Ad Campaign", label: "📱 Instagram / Social Media Campaign" },
                    { value: "Private HNW Event", label: "🍸 Private HNW Investor Showcase" }
                  ])}
                </div>
              </div>
            </div>

            <div class="wizard-actions" style="margin-top: 24px;">
              <button class="btn" type="button" onclick="window.leadWizard.prevStep(2)">
                ← Back to Client Identity
              </button>
              <button class="btn dark" type="button" onclick="window.leadWizard.nextStep(2)">
                Next: Property Interest & Tasks →
              </button>
            </div>
          </div>

          <!-- STEP 3: PROPERTY INTEREST & FOLLOW-UP TASK -->
          <div class="card wizard-panel ${currentStep === 3 ? 'active' : ''}" id="leadStepPanel3" style="padding: 22px;">
            <div class="ch" style="margin-bottom: 18px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600;">3. Property Preference & First Follow-Up Task</h3>
                <p style="font-size: 12.5px; color: var(--ink-2);">Map specific property listing, buyer intent, and set an actionable scheduled reminder task.</p>
              </div>
              <span class="chip green xs">Step 3 of 3</span>
            </div>

            <div class="wizard-form-body">
              <div class="grid-2" style="gap: 16px;">
                <div class="field">
                  <label>Target Specific Property Listing</label>
                  ${renderCustomSelectLead("lead_property", "property", lead.property, [
                    { value: "The Imperial Azure Sky Penthouse", label: "The Imperial Azure Sky Penthouse (Lavelle Rd)" },
                    { value: "Forest Ridge Luxury Villa", label: "Forest Ridge Luxury Villa (Indiranagar)" },
                    { value: "Palm Villa Jumeirah", label: "Palm Villa Jumeirah (Waterfront)" },
                    { value: "Commercial Complex Hub", label: "Commercial Complex Hub (Grade-A Office)" },
                    { value: "The Lennox Tower", label: "The Lennox Tower (3 BHK High-Rise)" },
                    { value: "Riverside Tower Penthouse", label: "Riverside Tower Penthouse" },
                    { value: "General Portfolio Inquiry", label: "General Portfolio Inquiry (Multiple Properties)" }
                  ])}
                </div>

                <div class="field">
                  <label>Primary Acquisition Intent</label>
                  ${renderCustomSelectLead("lead_intent", "intent", lead.intent, [
                    { value: "Self-Use Primary Residence", label: "🏡 Self-Use Primary Luxury Residence" },
                    { value: "High Rental Yield Investment", label: "📈 High Rental Yield Investment (6-8% p.a.)" },
                    { value: "Capital Appreciation / Flip", label: "💎 Capital Appreciation / Long Term Hold" },
                    { value: "Vacation / Holiday Home", label: "🌴 Vacation Villa / Weekend Estate" }
                  ])}
                </div>
              </div>

              <!-- Initial Client Note -->
              <div class="field" style="margin-top: 14px;">
                <label>Initial Client Interaction Notes</label>
                <div class="input-wrap">
                  <textarea id="lead_notes" name="notes" rows="3" style="width:100%; border:none; background:transparent; font-family:inherit; font-size:13px; resize:vertical; padding:10px;" placeholder="Document initial phone conversation points, specific amenities requested, and financing plans..." oninput="window.leadWizard.syncLivePreview()">${lead.notes}</textarea>
                </div>
              </div>

              <!-- Scheduled Action Task Box -->
              <div style="background:#F8FAF9; border:1px solid #DCE3EA; border-radius:10px; padding:16px 18px; margin-top:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <b style="font-size:13px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink);">Scheduled First Action Task:</b>
                  <span class="chip green xs">Actionable Task</span>
                </div>

                <div class="grid-3" style="gap: 14px;">
                  <div class="field" style="margin:0;">
                    <label>Task Action Type</label>
                    ${renderCustomSelectLead("lead_taskType", "taskType", lead.taskType, [
                      { value: "Site Visit", label: "📍 On-Site Property Visit" },
                      { value: "Call", label: "📞 Phone Call / Discussion" },
                      { value: "Meeting", label: "🤝 Branch / HQ In-Person Meeting" },
                      { value: "Email", label: "📧 Send Documents & Title Deed" }
                    ])}
                  </div>

                  <div class="field" style="margin:0;">
                    <label>Task Due Date & Time</label>
                    <div class="input-wrap">
                      <input type="text" id="lead_taskDue" name="taskDue" value="${lead.taskDue}" placeholder="e.g. Tomorrow, 4:00 PM" oninput="window.leadWizard.syncLivePreview()">
                    </div>
                  </div>

                  <div class="field" style="margin:0;">
                    <label>Task Description</label>
                    <div class="input-wrap">
                      <input type="text" id="lead_taskTitle" name="taskTitle" value="${lead.taskTitle}" placeholder="e.g. Private walkthrough presentation" oninput="window.leadWizard.syncLivePreview()">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="wizard-actions" style="margin-top: 24px;">
              <button class="btn" type="button" onclick="window.leadWizard.prevStep(3)">
                ← Back to Outlet & Agent
              </button>
              <button class="btn dark gold-glow" type="button" onclick="window.leadWizard.submitLead()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Confirm & Create Lead Record
              </button>
            </div>
          </div>

        </form>
      </div>

      <!-- RIGHT: Sticky Real-time Luxury Preview Card -->
      <div class="wizard-sidebar">
        
        <!-- Live Lead Summary Card -->
        <div class="card luxury-preview-card">
          <div class="preview-hero-img" style="height: 120px; background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); display:flex; flex-direction:column; justify-content:space-between; padding:16px;">
            <div class="preview-tag-row">
              <span class="chip gold xs" id="prev_lead_priority">${lead.priority} Priority</span>
              <span class="chip green xs" id="prev_lead_stage">New Lead</span>
            </div>
            <div class="preview-outlet-chip" id="prev_lead_outlet">📍 ${lead.outlet}</div>
          </div>

          <div class="preview-body">
            <div class="preview-category" id="prev_lead_source">${lead.source}</div>
            <h3 class="preview-title" id="prev_lead_name">${lead.name || 'Vikramaditya Singhania'}</h3>
            <p class="preview-location" id="prev_lead_contact">${lead.phone || '+91 98401 55667'} · ${lead.city || 'Bengaluru'}</p>

            <div class="preview-price-strip">
              <div>
                <span class="preview-price-label">Allocated Budget</span>
                <div class="preview-price-val" id="prev_lead_budget">₹ ${lead.budget} Cr</div>
              </div>
              <div style="text-align:right">
                <span class="preview-price-label">Readiness</span>
                <div class="preview-rate-val" id="prev_lead_horizon" style="font-size:12px; color:var(--gold); font-weight:600;">${lead.horizon.split(' ')[0]}</div>
              </div>
            </div>

            <!-- Interested Property Strip -->
            <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--line);">
              <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink-3); font-weight:600;">Target Property:</span>
              <b style="display:block; font-size:13px; color:var(--ink); margin-top:2px;" id="prev_lead_property">${lead.property}</b>
            </div>

            <!-- Scheduled Next Action -->
            <div style="margin-top:14px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size:10.5px; font-weight:700; color:var(--ink-2); text-transform:uppercase;" id="prev_lead_taskType">Next: ${lead.taskType}</span>
                <span class="chip gold xs" id="prev_lead_taskDue">${lead.taskDue}</span>
              </div>
              <p style="font-size:12px; color:var(--ink); margin:0;" id="prev_lead_taskTitle">${lead.taskTitle}</p>
            </div>
          </div>
        </div>

        <!-- Assigned Sales Agent Card -->
        <div class="card" style="padding: 14px 16px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="rm-avatar" id="prev_lead_agent_avatar">SC</div>
            <div>
              <span style="font-size:10px; color:var(--ink-3); text-transform:uppercase; letter-spacing:0.04em;">Assigned Sales Agent</span>
              <b style="display:block; font-size:13px;" id="prev_lead_agent_name">${lead.assigned}</b>
              <span style="font-size:11px; color:var(--ink-2);" id="prev_lead_agent_outlet">${lead.outlet} Branch</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// Global Lead Creation & Sliding Drawer Controller
window.leadWizard = {
  openSlidingPage(defaultOutlet = null) {
    let drawerOverlay = document.getElementById('leadSlidingDrawerOverlay');
    if (!drawerOverlay) {
      drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'leadSlidingDrawerOverlay';
      drawerOverlay.className = 'lead-sliding-drawer-overlay';
      drawerOverlay.innerHTML = `
        <div class="lead-sliding-drawer-backdrop" onclick="window.leadWizard.closeSlidingPage()"></div>
        <div class="lead-sliding-drawer-panel" id="leadSlidingDrawerPanel">
          <!-- Dynamic Content Injected Here -->
        </div>
      `;
      document.body.appendChild(drawerOverlay);
    }

    const panel = document.getElementById('leadSlidingDrawerPanel');
    drawerOverlay.classList.remove('open');
    panel.innerHTML = renderLeadCreationFormHtml(true, defaultOutlet);
    panel.scrollTop = 0;
    panel.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Initialize state, steps, and live preview without scrolling
    window._leadWizardStep = 1;
    for (let i = 1; i <= 3; i++) {
      const p = document.getElementById(`leadStepPanel${i}`);
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
    const drawerOverlay = document.getElementById('leadSlidingDrawerOverlay');
    if (drawerOverlay && drawerOverlay.classList.contains('open')) {
      drawerOverlay.classList.remove('open');
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 660);
    } else {
      window.router.navigate('sales');
    }
  },

  getFormData() {
    const name = document.getElementById('lead_name')?.value || '';
    const phone = document.getElementById('lead_phone')?.value || '';
    const email = document.getElementById('lead_email')?.value || '';
    const city = document.getElementById('lead_city')?.value || 'Bengaluru';
    const budget = document.getElementById('lead_budget')?.value || '4.85';
    const horizon = document.getElementById('lead_horizon')?.value || 'Immediate (0-15 days)';
    const outlet = document.getElementById('lead_outlet')?.value || 'YOR Central';
    const assigned = document.getElementById('lead_assigned')?.value || 'Sarah Coleman';
    const priority = document.getElementById('lead_priority')?.value || 'High';
    const source = document.getElementById('lead_source')?.value || 'Website Direct';
    const property = document.getElementById('lead_property')?.value || 'The Imperial Azure Sky Penthouse';
    const intent = document.getElementById('lead_intent')?.value || 'Self-Use Primary Residence';
    const notes = document.getElementById('lead_notes')?.value || '';
    const taskType = document.getElementById('lead_taskType')?.value || 'Site Visit';
    const taskDue = document.getElementById('lead_taskDue')?.value || 'Tomorrow, 4:00 PM';
    const taskTitle = document.getElementById('lead_taskTitle')?.value || 'Private walkthrough presentation';

    return {
      name, phone, email, city, budget: `₹ ${budget} Cr`, rawBudget: parseFloat(budget) || 4.85,
      horizon, outlet, assigned, priority, source, property, intent, notes,
      taskType, taskDue, taskTitle,
      stage: "New"
    };
  },

  syncLivePreview() {
    const d = this.getFormData();
    
    const prevName = document.getElementById('prev_lead_name');
    if (prevName) prevName.textContent = d.name || 'Vikramaditya Singhania';

    const prevContact = document.getElementById('prev_lead_contact');
    if (prevContact) prevContact.textContent = `${d.phone || '+91 98401 55667'} · ${d.city || 'Bengaluru'}`;

    const prevBudget = document.getElementById('prev_lead_budget');
    if (prevBudget) prevBudget.textContent = d.budget;

    const prevHorizon = document.getElementById('prev_lead_horizon');
    if (prevHorizon) prevHorizon.textContent = d.horizon.split(' ')[0];

    const prevPriority = document.getElementById('prev_lead_priority');
    if (prevPriority) prevPriority.textContent = `${d.priority} Priority`;

    const prevSource = document.getElementById('prev_lead_source');
    if (prevSource) prevSource.textContent = d.source;

    const prevOutlet = document.getElementById('prev_lead_outlet');
    if (prevOutlet) prevOutlet.textContent = `📍 ${d.outlet}`;

    const prevProperty = document.getElementById('prev_lead_property');
    if (prevProperty) prevProperty.textContent = d.property;

    const prevTaskType = document.getElementById('prev_lead_taskType');
    if (prevTaskType) prevTaskType.textContent = `Next: ${d.taskType}`;

    const prevTaskDue = document.getElementById('prev_lead_taskDue');
    if (prevTaskDue) prevTaskDue.textContent = d.taskDue;

    const prevTaskTitle = document.getElementById('prev_lead_taskTitle');
    if (prevTaskTitle) prevTaskTitle.textContent = d.taskTitle;

    const prevAgentName = document.getElementById('prev_lead_agent_name');
    if (prevAgentName) prevAgentName.textContent = d.assigned;

    const prevAgentOutlet = document.getElementById('prev_lead_agent_outlet');
    if (prevAgentOutlet) prevAgentOutlet.textContent = `${d.outlet} Branch`;

    const prevAgentAvatar = document.getElementById('prev_lead_agent_avatar');
    if (prevAgentAvatar) {
      const parts = d.assigned.split(' ');
      prevAgentAvatar.textContent = (parts[0]?.[0] || 'S') + (parts[1]?.[0] || 'C');
    }
  },

  goToStep(step) {
    window._leadWizardStep = step;
    
    for (let i = 1; i <= 3; i++) {
      const p = document.getElementById(`leadStepPanel${i}`);
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

    const panel = document.getElementById('leadSlidingDrawerPanel');
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.saveDraft(false);
  },

  nextStep(current) {
    if (current === 1) {
      const name = document.getElementById('lead_name')?.value;
      const phone = document.getElementById('lead_phone')?.value;
      if (!name || !phone) {
        if (window.modals && window.modals.showToast) {
          window.modals.showToast('Please enter Client Name and Phone Number to proceed', 'error');
        }
        return;
      }
    }
    this.goToStep(current + 1);
  },

  prevStep(current) {
    this.goToStep(Math.max(1, current - 1));
  },

  saveDraft(showToast = true) {
    const data = this.getFormData();
    window.store.saveLeadDraft(data);
    const msg = document.getElementById('lead_draftMsg');
    if (msg) msg.textContent = 'Draft auto-saved ' + new Date().toLocaleTimeString();
    if (showToast && window.modals && window.modals.showToast) {
      window.modals.showToast('Lead intake draft saved locally!');
    }
  },

  fillDemoData() {
    window.store.saveLeadDraft({
      name: "Vikramaditya Singhania",
      phone: "+91 98401 55667",
      email: "vikram@singhaniaholdings.in",
      city: "Bengaluru Urban",
      budget: "6.50",
      horizon: "Immediate (0-15 days)",
      outlet: "YOR Central",
      priority: "High",
      source: "Private HNW Event",
      assigned: "Sarah Coleman",
      property: "The Imperial Azure Sky Penthouse",
      intent: "Self-Use Primary Residence",
      notes: "Met at the luxury property showcase. Client has approved budget of ₹6.5 Cr and requested immediate site visit with family.",
      taskType: "Site Visit",
      taskTitle: "Private VIP penthouse walkthrough & title deed presentation",
      taskDue: "Tomorrow, 4:00 PM"
    });
    window._leadWizardStep = 1;
    const panel = document.getElementById('leadSlidingDrawerPanel');
    if (panel) {
      panel.innerHTML = renderLeadCreationFormHtml(true);
      setTimeout(() => {
        this.goToStep(1);
        this.syncLivePreview();
      }, 50);
    } else {
      window.router.navigate('sales');
    }
    if (window.modals && window.modals.showToast) {
      window.modals.showToast('Demo luxury HNW buyer lead data loaded!');
    }
  },

  submitLead() {
    const data = this.getFormData();
    if (!data.name || !data.phone) {
      if (window.modals && window.modals.showToast) {
        window.modals.showToast('Please specify Client Name and Phone Number', 'error');
      }
      this.goToStep(1);
      return;
    }

    const newLead = window.store.addLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      property: data.property,
      outlet: data.outlet,
      budget: data.budget,
      assigned: data.assigned,
      priority: data.priority,
      source: data.source,
      notes: data.notes,
      stage: "New",
      nextTask: {
        id: `T-${Date.now()}`,
        title: data.taskTitle || "Introductory consultation",
        due: data.taskDue || "Tomorrow",
        type: data.taskType || "Call",
        done: false
      }
    });

    window._leadWizardStep = 1;
    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`Lead "${newLead.name}" created under ${newLead.outlet} and assigned to ${newLead.assigned}!`);
    }

    this.closeSlidingPage();

    if (window.salesCRM && window.salesCRM.refreshViews) {
      window.salesCRM.refreshViews();
    } else if (window.router.currentRoute === 'sales') {
      window.router.navigate('sales');
    }
  }
};
