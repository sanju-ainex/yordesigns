/* ==========================================================================
   YOR Estate - Platform Settings & Multi-State Legal Workflow Management
   ========================================================================== */

function renderSettingsPage() {
  const store = window.store;
  const user = (window.auth && window.auth.currentUser) || { role: store.currentRole || "Super Admin", name: "Alexander Vance" };
  const currentRole = user.role || store.currentRole || "Super Admin";

  // Check admin-level privileges
  const isAdmin = ["Super Admin", "Head Office Admin", "Manager", "Legal Team"].includes(currentRole);

  if (!isAdmin) {
    return `
      <div class="head">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
            <span class="chip red xs font-mono">ACCESS RESTRICTED</span>
            <span class="chip gray xs">${currentRole}</span>
          </div>
          <h1>System Configuration & Settings</h1>
          <p>Administrative control center for web parameters and statutory legal workflows.</p>
        </div>
      </div>

      <div class="admin-lock-banner" style="background:#fff; border:1px solid var(--line); border-radius:var(--r); padding:48px 24px; text-align:center; max-width:600px; margin:40px auto;">
        <div style="width:64px; height:64px; border-radius:50%; background:rgba(239,68,68,0.1); color:var(--red); display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style="font-size:22px; font-weight:700; margin-bottom:8px">Administrative Privileges Required</h2>
        <p style="color:var(--ink-2); font-size:14px; max-width:480px; margin:0 auto 24px auto; line-height:1.5">
          The Settings Page and Multi-State Legal Workflow Engine are restricted to <b>Super Admin</b>, <b>Head Office Admin</b>, <b>Manager</b>, and <b>Legal Team</b> roles.
        </p>
        <div style="display:flex; justify-content:center; gap:12px">
          <button class="btn gold" style="font-weight:600" onclick="window.store.setRole('Super Admin'); window.router.navigate('settings')">
            Switch to Super Admin Preview
          </button>
          <button class="btn" onclick="window.router.navigate('dashboard')">
            Return to Dashboard
          </button>
        </div>
      </div>
    `;
  }

  // Active settings tab: general | workflows | branding | notifications
  if (!window.activeSettingsTab || ['security', 'maintenance'].includes(window.activeSettingsTab)) {
    window.activeSettingsTab = "general";
  }
  const currentTab = window.activeSettingsTab;

  const generalSettings = store.getGeneralSettings();
  const stateWorkflows = store.getStateWorkflows();
  const states = Object.keys(stateWorkflows);

  // Active state for workflow tab
  if (!window.activeSettingsState || !stateWorkflows[window.activeSettingsState]) {
    window.activeSettingsState = states[0] || "Karnataka";
  }
  const currentWfState = window.activeSettingsState;
  const currentWf = stateWorkflows[currentWfState] || {
    name: currentWfState,
    authority: "State Registration & Stamps Department",
    portal: "State Land Records Portal",
    portalUrl: "https://landrecords.gov.in",
    searchYears: 30,
    reraPrefix: `${currentWfState} RERA`,
    reraPortal: "https://rera.gov.in",
    advocateOpinionRequired: true,
    digitalStampRequired: true,
    rules: "Standard 30-year parent deed chain and statutory clearances.",
    requiredDocs: []
  };

  return `
    <!-- Settings Page Header (Clean, without top KPI blocks) -->
    <div class="head">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
          <span class="chip gold xs font-mono">ENTERPRISE CONTROL</span>
          <span class="chip dark xs">${currentRole} Access</span>
        </div>
        <h1>Platform Settings & State Legal Workflows</h1>
        <p>Manage core web parameters, regional policies, and state-by-state statutory compliance workflows.</p>
      </div>
      <div class="actions">
        <button class="btn dark gold-glow" type="button" onclick="window.settingsPage.saveCurrentActiveTab()">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Changes
        </button>
      </div>
    </div>

    <!-- Navigation Sub-Tabs -->
    <div class="settings-nav-tabs" role="tablist">
      <button class="settings-nav-btn ${currentTab === 'general' ? 'active' : ''}" onclick="window.settingsPage.switchTab('general')">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Basic Web Settings
      </button>

      <button class="settings-nav-btn ${currentTab === 'workflows' ? 'active' : ''}" onclick="window.settingsPage.switchTab('workflows')">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        State Legal Workflows <span class="chip gold xs" style="margin-left:4px; padding:2px 6px;">${states.length}</span>
      </button>

      <button class="settings-nav-btn ${currentTab === 'branding' ? 'active' : ''}" onclick="window.settingsPage.switchTab('branding')">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        Branding & Theme
      </button>

      <button class="settings-nav-btn ${currentTab === 'notifications' ? 'active' : ''}" onclick="window.settingsPage.switchTab('notifications')">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Notifications & Alerts
      </button>
    </div>

    <!-- Active Tab Content Area -->
    <div class="settings-content-body">
      ${currentTab === 'general' ? renderGeneralTab(generalSettings) : ''}
      ${currentTab === 'workflows' ? renderWorkflowsTab(stateWorkflows, states, currentWfState, currentWf) : ''}
      ${currentTab === 'branding' ? renderBrandingTab(generalSettings) : ''}
      ${currentTab === 'notifications' ? renderNotificationsTab(generalSettings) : ''}
    </div>
  `;
}

/* ==========================================================================
   TAB 1: BASIC WEB SETTINGS
   ========================================================================== */
function renderGeneralTab(s) {
  return `
    <form id="generalSettingsForm" onsubmit="event.preventDefault(); window.settingsPage.saveGeneralSettings();">
      <div class="settings-section-card">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Enterprise Identity & Regional Preferences
        </div>
        <div class="settings-section-subtitle">Core platform identity, display terminology, base currency, and national search depth.</div>

        <div class="settings-form-grid">
          <div class="settings-field">
            <label>Company Legal Name <span class="req">*</span></label>
            <input type="text" name="companyLegalName" class="settings-input" value="${s.companyLegalName || 'YOR Estate and Property Management Pvt. Ltd.'}" required>
          </div>

          <div class="settings-field">
            <label>Platform Display Name <span class="req">*</span></label>
            <input type="text" name="platformName" class="settings-input" value="${s.platformName || 'YOR Estate'}" required>
          </div>

          <div class="settings-field">
            <label>Official Support Email</label>
            <input type="email" name="supportEmail" class="settings-input" value="${s.supportEmail || 'support@yorestate.com'}">
          </div>

          <div class="settings-field">
            <label>Support Phone Hotline</label>
            <input type="text" name="supportPhone" class="settings-input" value="${s.supportPhone || '+91 80 4920 1800'}">
          </div>

          <div class="settings-field">
            <label>Base Currency</label>
            <select name="defaultCurrency" class="settings-select" onchange="window.settingsPage.onCurrencyChange(this.value)">
              <option value="INR" ${s.defaultCurrency === 'INR' ? 'selected' : ''}>INR (₹ - Indian Rupee)</option>
              <option value="USD" ${s.defaultCurrency === 'USD' ? 'selected' : ''}>USD ($ - US Dollar)</option>
              <option value="AED" ${s.defaultCurrency === 'AED' ? 'selected' : ''}>AED (د.إ - UAE Dirham)</option>
              <option value="EUR" ${s.defaultCurrency === 'EUR' ? 'selected' : ''}>EUR (€ - Euro)</option>
              <option value="SGD" ${s.defaultCurrency === 'SGD' ? 'selected' : ''}>SGD ($ - Singapore Dollar)</option>
            </select>
          </div>

          <div class="settings-field">
            <label>Number System & Currency Notation</label>
            <select name="numberFormat" class="settings-select">
              <option value="indian" ${s.numberFormat !== 'international' ? 'selected' : ''}>Indian System (Lakhs & Crores · ₹12.5 Cr)</option>
              <option value="international" ${s.numberFormat === 'international' ? 'selected' : ''}>International (Millions · $125.0 M)</option>
            </select>
          </div>

          <div class="settings-field">
            <label>Default Title Search Depth</label>
            <select name="searchYears" class="settings-select">
              <option value="30" ${s.searchYears == 30 ? 'selected' : ''}>30 Years (National Standard)</option>
              <option value="20" ${s.searchYears == 20 ? 'selected' : ''}>20 Years (Urban Fast-Track)</option>
              <option value="40" ${s.searchYears == 40 ? 'selected' : ''}>40 Years (Ancestral / Agricultural)</option>
            </select>
          </div>

          <div class="settings-field">
            <label>System Date Display Format</label>
            <select name="dateFormat" class="settings-select">
              <option value="DD/MM/YYYY" ${s.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY (e.g. 24/09/2026)</option>
              <option value="MM/DD/YYYY" ${s.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
              <option value="YYYY-MM-DD" ${s.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD (ISO)</option>
            </select>
          </div>

          <div class="settings-field" style="grid-column: 1 / -1;">
            <label>Registered Head Office Address</label>
            <input type="text" name="headOfficeAddress" class="settings-input" value="${s.headOfficeAddress || 'Tower B, Level 14, Prestige Trade Tower, Palace Road, Bengaluru, Karnataka 560001'}">
          </div>
        </div>

        <div style="margin-top:24px; padding-top:18px; border-top:1px solid var(--line); display:flex; flex-wrap:wrap; gap:24px;">
          <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <input type="checkbox" name="alertOnHoSignoff" ${s.alertOnHoSignoff !== false ? 'checked' : ''}>
            <span>Mandatory Head Office Sign-Off before Property Clearance</span>
          </label>
          <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <input type="checkbox" name="enforce2FAForAdmins" ${s.enforce2FAForAdmins !== false ? 'checked' : ''}>
            <span>Enforce Two-Factor Authentication (2FA) for Admin Logins</span>
          </label>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn" type="button" onclick="window.settingsPage.resetDefaults()">Reset to Defaults</button>
          <button class="btn dark gold-glow" type="submit">Save Web Settings</button>
        </div>
      </div>
    </form>
  `;
}

/* ==========================================================================
   TAB 2: STATE LEGAL WORKFLOWS (Statewise setup & statutory rules builder)
   ========================================================================== */
function renderWorkflowsTab(stateWorkflows, states, currentWfState, currentWf) {
  const docs = Array.isArray(currentWf.requiredDocs) ? currentWf.requiredDocs : [];

  return `
    <!-- Top Workflow Bar: State Switcher & + Add State Workflow Button -->
    <div style="background:#fff; border:1px solid var(--line); border-radius:var(--r); padding:16px 20px; margin-bottom:20px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <span style="font-weight:700; font-size:13.5px; color:var(--ink);">Active State Jurisdiction:</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${states.map(st => `
            <button class="btn xs ${st === currentWfState ? 'gold' : ''}" style="font-weight:600;" onclick="window.settingsPage.switchState('${st}')">
              ${st}
            </button>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:10px;">
        <button class="btn xs dark gold-glow" onclick="window.settingsPage.openAddStateModal()">
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Add State Legal Workflow
        </button>
      </div>
    </div>

    <!-- State Legal Workflow Configuration Form -->
    <form id="stateWorkflowForm" onsubmit="event.preventDefault(); window.settingsPage.saveWorkflow('${currentWfState}');">
      <div class="settings-section-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <div class="settings-section-title">
              <span class="chip gold xs font-mono">${currentWfState.toUpperCase()} JURISDICTION</span>
              ${currentWfState} Statutory Legal Workflow
            </div>
            <div class="settings-section-subtitle">Configure the regulatory authority, land portal API, search requirements, and required checklist.</div>
          </div>
          ${states.length > 1 ? `
            <button type="button" class="btn xs" style="color:var(--red); border-color:rgba(239,68,68,0.3);" onclick="window.settingsPage.deleteWorkflow('${currentWfState}')">
              Delete State Workflow
            </button>
          ` : ''}
        </div>

        <div class="settings-form-grid">
          <div class="settings-field">
            <label>Registration & Stamps Authority <span class="req">*</span></label>
            <input type="text" name="authority" class="settings-input" value="${currentWf.authority || 'Department of Stamps & Registration'}" required>
          </div>

          <div class="settings-field">
            <label>Official Land Records Portal Name</label>
            <input type="text" name="portal" class="settings-input" value="${currentWf.portal || 'State Land Records Portal'}">
          </div>

          <div class="settings-field">
            <label>Portal URL (Revenue / EC Search)</label>
            <div style="display:flex; gap:6px;">
              <input type="url" name="portalUrl" class="settings-input" value="${currentWf.portalUrl || 'https://landrecords.gov.in'}" style="flex:1;">
              <a href="${currentWf.portalUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn xs" style="display:flex; align-items:center;" title="Open portal link">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>

          <div class="settings-field">
            <label>Mandatory Title Search Depth</label>
            <select name="searchYears" class="settings-select">
              <option value="30" ${currentWf.searchYears == 30 ? 'selected' : ''}>30 Years (Parent Title Flow)</option>
              <option value="20" ${currentWf.searchYears == 20 ? 'selected' : ''}>20 Years (Urban Fast-Track)</option>
              <option value="15" ${currentWf.searchYears == 15 ? 'selected' : ''}>15 Years</option>
              <option value="40" ${currentWf.searchYears == 40 ? 'selected' : ''}>40 Years (Agricultural / Ancestral)</option>
            </select>
          </div>

          <div class="settings-field">
            <label>State Real Estate Regulatory Authority (RERA)</label>
            <input type="text" name="reraPrefix" class="settings-input" value="${currentWf.reraPrefix || `${currentWfState} RERA`}">
          </div>

          <div class="settings-field">
            <label>RERA Verification Portal URL</label>
            <div style="display:flex; gap:6px;">
              <input type="url" name="reraPortal" class="settings-input" value="${currentWf.reraPortal || 'https://rera.gov.in'}" style="flex:1;">
              <a href="${currentWf.reraPortal || '#'}" target="_blank" rel="noopener noreferrer" class="btn xs" style="display:flex; align-items:center;">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>

          <div class="settings-field" style="grid-column: 1 / -1;">
            <label>Statutory Legal Guidelines & Title Verification Rules</label>
            <textarea name="rules" class="settings-input" rows="3" style="resize:vertical; font-family:var(--font-sans);">${currentWf.rules || 'Standard 30-year parent title deed chain and statutory clearance verification.'}</textarea>
          </div>
        </div>

        <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--line); display:flex; flex-wrap:wrap; gap:24px;">
          <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <input type="checkbox" name="advocateOpinionRequired" ${currentWf.advocateOpinionRequired !== false ? 'checked' : ''}>
            <span>Mandatory Senior Advocate Written Legal Opinion</span>
          </label>
          <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <input type="checkbox" name="digitalStampRequired" ${currentWf.digitalStampRequired !== false ? 'checked' : ''}>
            <span>Digital E-Stamping Certificate Validation Required</span>
          </label>
        </div>

        <!-- Statutory Document Verification Checklist Builder -->
        <div style="margin-top:28px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--line);">
            <div>
              <b style="font-size:14px; color:var(--ink);">Required Statutory Document Checklist (${docs.length} Documents)</b>
              <p style="font-size:12px; color:var(--ink-2); margin:2px 0 0 0;">These documents will be automatically enforced for every property onboarded in ${currentWfState}.</p>
            </div>
            <button type="button" class="btn xs gold" onclick="window.settingsPage.addDocumentRow()">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Add Document
            </button>
          </div>

          <div id="settingsDocBuilderList" style="display:flex; flex-direction:column; gap:10px;">
            ${docs.map((doc, idx) => `
              <div class="doc-builder-row" id="docRow_${idx}" style="display:grid; grid-template-columns: 2fr 1.2fr 1fr 110px 40px; gap:10px; align-items:center; background:#fafafa; border:1px solid var(--line); border-radius:var(--r-sm); padding:8px 12px;">
                <div>
                  <input type="text" class="doc-input-name settings-input" placeholder="Document Name (e.g. 30-Year Parent Deed Flow)" value="${doc.name || ''}" required style="padding:6px 10px; font-size:13px;">
                </div>
                <div>
                  <select class="doc-select-cat settings-select" style="padding:6px 10px; font-size:13px;">
                    <option value="Title" ${doc.category === 'Title' ? 'selected' : ''}>Title Deed</option>
                    <option value="Encumbrance" ${doc.category === 'Encumbrance' ? 'selected' : ''}>Encumbrance (EC)</option>
                    <option value="Revenue" ${doc.category === 'Revenue' ? 'selected' : ''}>Revenue / Patta / 7-12</option>
                    <option value="Survey" ${doc.category === 'Survey' ? 'selected' : ''}>Survey / Sketch / FMB</option>
                    <option value="Statutory" ${doc.category === 'Statutory' ? 'selected' : ''}>Statutory / Zoning</option>
                    <option value="Clearance" ${doc.category === 'Clearance' ? 'selected' : ''}>Legal Clearance</option>
                    <option value="Tax" ${doc.category === 'Tax' ? 'selected' : ''}>Tax Receipt</option>
                  </select>
                </div>
                <div>
                  <select class="doc-select-years settings-select" style="padding:6px 10px; font-size:13px;">
                    <option value="30" ${doc.validityYears == 30 ? 'selected' : ''}>30 Years</option>
                    <option value="20" ${doc.validityYears == 20 || !doc.validityYears ? 'selected' : ''}>20 Years</option>
                    <option value="15" ${doc.validityYears == 15 ? 'selected' : ''}>15 Years</option>
                    <option value="10" ${doc.validityYears == 10 ? 'selected' : ''}>10 Years</option>
                    <option value="5" ${doc.validityYears == 5 ? 'selected' : ''}>5 Years</option>
                    <option value="1" ${doc.validityYears == 1 ? 'selected' : ''}>1 Year</option>
                  </select>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:12px; margin:0;">
                    <input type="checkbox" class="doc-check-mandatory" ${doc.mandatory !== false ? 'checked' : ''}>
                    <span>Mandatory</span>
                  </label>
                </div>
                <div>
                  <button type="button" class="btn xs" style="color:var(--red); padding:4px 8px;" title="Remove document" onclick="this.closest('.doc-builder-row').remove()">
                    ✕
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn dark gold-glow" type="submit">
            Save ${currentWfState} Legal Workflow
          </button>
        </div>
      </div>
    </form>
  `;
}

/* ==========================================================================
   TAB 3: BRANDING & THEME
   ========================================================================== */
function renderBrandingTab(s) {
  return `
    <div class="settings-section-card">
      <div class="settings-section-title">Visual Identity & UI Customization</div>
      <div class="settings-section-subtitle">Customize theme colors, logo assets, dark mode preferences, and report header banners.</div>

      <div class="settings-form-grid">
        <div class="settings-field">
          <label>Brand Accent Color</label>
          <div style="display:flex; gap:10px; align-items:center;">
            <input type="color" value="#C5A059" style="width:44px; height:38px; border:1px solid var(--line); border-radius:var(--r-sm); cursor:pointer; padding:2px;">
            <input type="text" class="settings-input" value="#C5A059" style="flex:1;" readonly>
          </div>
        </div>

        <div class="settings-field">
          <label>Default Interface Theme</label>
          <select class="settings-select">
            <option value="luxury-light" selected>Luxury Light (Modern Gold & Charcoal)</option>
            <option value="midnight-dark">Midnight Dark (Executive Slate)</option>
            <option value="system">Follow Operating System</option>
          </select>
        </div>

        <div class="settings-field">
          <label>Logo File URL</label>
          <input type="text" class="settings-input" value="assets/images/logo.png">
        </div>

        <div class="settings-field">
          <label>Favicon Icon</label>
          <input type="text" class="settings-input" value="assets/images/logo.png">
        </div>
      </div>

      <div style="margin-top:20px; display:flex; justify-content:flex-end;">
        <button class="btn dark gold-glow" onclick="window.modals.showToast('Branding preferences saved.')">Save Theme Settings</button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   TAB 4: NOTIFICATIONS & ALERTS
   ========================================================================== */
function renderNotificationsTab(s) {
  return `
    <div class="settings-section-card">
      <div class="settings-section-title">Automated Alerts & Dispatch Channels</div>
      <div class="settings-section-subtitle">Select which operational events trigger email notifications and in-app alert badges.</div>

      <div style="display:flex; flex-direction:column; gap:14px;">
        <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:10px;">
          <input type="checkbox" checked>
          <span><b>Head Office Legal Sign-Off Alerts:</b> Notify when a property completes 5 stages of statutory verification.</span>
        </label>

        <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:10px;">
          <input type="checkbox" checked>
          <span><b>Title Rejection & Discrepancy Warnings:</b> Instantly alert listing manager if legal team flags encumbrances.</span>
        </label>

        <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:10px;">
          <input type="checkbox" checked>
          <span><b>Milestone Escrow Payout Releases:</b> Notify finance desk when escrow conditions are fulfilled.</span>
        </label>

        <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:10px;">
          <input type="checkbox" checked>
          <span><b>High-Priority Sales Leads:</b> Dispatch notifications for inquiries exceeding ₹ 5.0 Cr budget.</span>
        </label>
      </div>

      <div style="margin-top:24px; display:flex; justify-content:flex-end;">
        <button class="btn dark gold-glow" onclick="window.modals.showToast('Notification triggers saved.')">Save Notification Settings</button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   GLOBAL CONTROLLER FOR SETTINGS & STATE WORKFLOWS
   ========================================================================== */
window.settingsPage = {
  switchTab(tabKey) {
    window.activeSettingsTab = tabKey;
    if (window.router && window.router.currentRoute === 'settings') {
      window.router.navigate('settings', false);
    }
  },

  switchState(stateName) {
    window.activeSettingsState = stateName;
    if (window.router && window.router.currentRoute === 'settings') {
      window.router.navigate('settings', false);
    }
  },

  onCurrencyChange(val) {
    const symbolMap = { INR: "₹", USD: "$", AED: "د.إ", EUR: "€", SGD: "$" };
    window.store.data.generalSettings = {
      ...(window.store.data.generalSettings || {}),
      defaultCurrency: val,
      currencySymbol: symbolMap[val] || "₹"
    };
  },

  saveCurrentActiveTab() {
    const tab = window.activeSettingsTab || 'general';
    if (tab === 'general') {
      this.saveGeneralSettings();
    } else if (tab === 'workflows') {
      this.saveWorkflow(window.activeSettingsState || 'Karnataka');
    } else {
      window.modals.showToast('Settings saved successfully!');
    }
  },

  saveGeneralSettings() {
    const form = document.getElementById('generalSettingsForm');
    if (!form) return;

    const formData = new FormData(form);
    const curr = formData.get('defaultCurrency') || 'INR';
    const symbolMap = { INR: "₹", USD: "$", AED: "د.إ", EUR: "€", SGD: "$" };

    const updatedSettings = {
      platformName: (formData.get('platformName') || '').trim(),
      companyLegalName: (formData.get('companyLegalName') || '').trim(),
      supportEmail: (formData.get('supportEmail') || '').trim(),
      supportPhone: (formData.get('supportPhone') || '').trim(),
      headOfficeAddress: (formData.get('headOfficeAddress') || '').trim(),
      defaultCurrency: curr,
      currencySymbol: symbolMap[curr] || '₹',
      numberFormat: formData.get('numberFormat') || 'indian',
      dateFormat: formData.get('dateFormat') || 'DD/MM/YYYY',
      searchYears: parseInt(formData.get('searchYears'), 10) || 30,
      alertOnHoSignoff: form.querySelector('input[name="alertOnHoSignoff"]')?.checked ?? true,
      enforce2FAForAdmins: form.querySelector('input[name="enforce2FAForAdmins"]')?.checked ?? true
    };

    window.store.saveGeneralSettings(updatedSettings);

    if (window.modals && typeof window.modals.showToast === 'function') {
      window.modals.showToast('Basic Web Settings saved successfully!');
    }

    if (window.router && window.router.currentRoute === 'settings') {
      window.router.navigate('settings', false);
    }
  },

  addDocumentRow() {
    const list = document.getElementById('settingsDocBuilderList');
    if (!list) return;

    const idx = Date.now();
    const newRow = document.createElement('div');
    newRow.className = 'doc-builder-row';
    newRow.id = `docRow_${idx}`;
    newRow.style.cssText = 'display:grid; grid-template-columns: 2fr 1.2fr 1fr 110px 40px; gap:10px; align-items:center; background:#fafafa; border:1px solid var(--line); border-radius:var(--r-sm); padding:8px 12px;';

    newRow.innerHTML = `
      <div>
        <input type="text" class="doc-input-name settings-input" placeholder="Document Name (e.g. Non-Agricultural NA Order)" required style="padding:6px 10px; font-size:13px;">
      </div>
      <div>
        <select class="doc-select-cat settings-select" style="padding:6px 10px; font-size:13px;">
          <option value="Title">Title Deed</option>
          <option value="Encumbrance">Encumbrance (EC)</option>
          <option value="Revenue">Revenue / Patta / 7-12</option>
          <option value="Survey">Survey / Sketch / FMB</option>
          <option value="Statutory" selected>Statutory / Zoning</option>
          <option value="Clearance">Legal Clearance</option>
          <option value="Tax">Tax Receipt</option>
        </select>
      </div>
      <div>
        <select class="doc-select-years settings-select" style="padding:6px 10px; font-size:13px;">
          <option value="30">30 Years</option>
          <option value="20">20 Years</option>
          <option value="15">15 Years</option>
          <option value="10">10 Years</option>
          <option value="5" selected>5 Years</option>
          <option value="1">1 Year</option>
        </select>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:12px; margin:0;">
          <input type="checkbox" class="doc-check-mandatory" checked>
          <span>Mandatory</span>
        </label>
      </div>
      <div>
        <button type="button" class="btn xs" style="color:var(--red); padding:4px 8px;" title="Remove document" onclick="this.closest('.doc-builder-row').remove()">
          ✕
        </button>
      </div>
    `;

    list.appendChild(newRow);
    const input = newRow.querySelector('.doc-input-name');
    if (input) input.focus();
  },

  saveWorkflow(stateName) {
    const form = document.getElementById('stateWorkflowForm');
    if (!form || !stateName) return;

    const formData = new FormData(form);
    const list = document.getElementById('settingsDocBuilderList');
    const docRows = list ? list.querySelectorAll('.doc-builder-row') : [];

    const prefix = stateName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const requiredDocs = [];

    docRows.forEach((row, i) => {
      const nameInput = row.querySelector('.doc-input-name');
      const catSelect = row.querySelector('.doc-select-cat');
      const yearsSelect = row.querySelector('.doc-select-years');
      const mandCheck = row.querySelector('.doc-check-mandatory');

      const name = nameInput ? nameInput.value.trim() : '';
      if (name) {
        requiredDocs.push({
          id: `${prefix}_doc_${i + 1}`,
          name: name,
          category: catSelect ? catSelect.value : 'Title',
          validityYears: yearsSelect ? parseInt(yearsSelect.value, 10) : 20,
          mandatory: mandCheck ? mandCheck.checked : true
        });
      }
    });

    const wfData = {
      authority: (formData.get('authority') || '').trim() || 'State Registration & Stamps Department',
      portal: (formData.get('portal') || '').trim() || 'State Land Records Portal',
      portalUrl: (formData.get('portalUrl') || '').trim() || 'https://landrecords.gov.in',
      searchYears: parseInt(formData.get('searchYears'), 10) || 30,
      reraPrefix: (formData.get('reraPrefix') || '').trim() || `${stateName} RERA`,
      reraPortal: (formData.get('reraPortal') || '').trim() || 'https://rera.gov.in',
      rules: (formData.get('rules') || '').trim(),
      advocateOpinionRequired: form.querySelector('input[name="advocateOpinionRequired"]')?.checked ?? true,
      digitalStampRequired: form.querySelector('input[name="digitalStampRequired"]')?.checked ?? true,
      requiredDocs: requiredDocs
    };

    window.store.saveStateLegalWorkflow(stateName, wfData);

    if (window.modals && typeof window.modals.showToast === 'function') {
      window.modals.showToast(`Legal workflow for ${stateName} saved (${requiredDocs.length} statutory documents)!`);
    }

    if (window.router && window.router.currentRoute === 'settings') {
      window.router.navigate('settings', false);
    }
  },

  openAddStateModal() {
    if (window.modals && typeof window.modals.openConfigureStateWorkflowModal === 'function') {
      window.modals.openConfigureStateWorkflowModal(null);
    } else {
      const newState = prompt("Enter Indian State / UT Name for new Legal Workflow (e.g. Rajasthan, Gujarat, Goa):");
      if (newState && newState.trim()) {
        const cleanState = newState.trim();
        window.store.saveStateLegalWorkflow(cleanState, {
          authority: `${cleanState} Stamps & Registration Department`,
          portal: `${cleanState} Land Records Portal`,
          portalUrl: "https://landrecords.gov.in",
          searchYears: 30,
          reraPrefix: `${cleanState} RERA`,
          reraPortal: "https://rera.gov.in",
          advocateOpinionRequired: true,
          digitalStampRequired: true,
          rules: `Mandatory 30-year parent title deed search and revenue extraction for ${cleanState}.`,
          requiredDocs: [
            { id: `${cleanState.toLowerCase()}_deed`, name: "30-Year Parent Title Deed Flow", category: "Title", mandatory: true, validityYears: 30 },
            { id: `${cleanState.toLowerCase()}_ec`, name: "Encumbrance Certificate (EC)", category: "Encumbrance", mandatory: true, validityYears: 30 },
            { id: `${cleanState.toLowerCase()}_revenue`, name: "Revenue / Mutation Record Extract", category: "Revenue", mandatory: true, validityYears: 1 }
          ]
        });
        window.activeSettingsState = cleanState;
        window.activeSettingsTab = 'workflows';
        window.router.navigate('settings', false);
        window.modals.showToast(`Added new legal workflow for ${cleanState}!`);
      }
    }
  },

  duplicateWorkflow(sourceState) {
    const targetState = prompt(`Duplicate ${sourceState} workflow to which new State / UT? (e.g. Goa, Punjab, Rajasthan)`);
    if (targetState && targetState.trim()) {
      const cleanTarget = targetState.trim();
      window.store.duplicateStateLegalWorkflow(sourceState, cleanTarget);
      window.activeSettingsState = cleanTarget;
      window.activeSettingsTab = 'workflows';
      window.router.navigate('settings', false);
      if (window.modals && typeof window.modals.showToast === 'function') {
        window.modals.showToast(`Duplicated ${sourceState} workflow to ${cleanTarget}!`);
      }
    }
  },

  deleteWorkflow(stateName) {
    if (confirm(`Are you sure you want to delete the statutory legal workflow for ${stateName}?`)) {
      window.store.deleteStateLegalWorkflow(stateName);
      const remaining = Object.keys(window.store.getStateWorkflows());
      window.activeSettingsState = remaining[0] || 'Karnataka';
      window.router.navigate('settings', false);
      if (window.modals && typeof window.modals.showToast === 'function') {
        window.modals.showToast(`Deleted ${stateName} legal workflow.`);
      }
    }
  },

  resetDefaults() {
    if (confirm("Reset all platform settings and restore default state legal workflows?")) {
      window.store.resetSettingsToDefault();
      if (window.modals && typeof window.modals.showToast === 'function') {
        window.modals.showToast('Platform settings reset to defaults.');
      }
      if (window.router && window.router.currentRoute === 'settings') {
        window.router.navigate('settings', false);
      }
    }
  },

  onFileImport(evt) {
    const file = evt.target.files && evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const res = window.store.importConfigJson(content);
      if (res.success) {
        if (window.modals && typeof window.modals.showToast === 'function') {
          window.modals.showToast('Configuration snapshot imported successfully!');
        }
        if (window.router && window.router.currentRoute === 'settings') {
          window.router.navigate('settings', false);
        }
      } else {
        alert("Failed to import configuration JSON: " + (res.error || "Invalid format"));
      }
    };
    reader.readAsText(file);
  }
};

window.renderSettingsPage = renderSettingsPage;
