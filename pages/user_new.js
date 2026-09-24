/* ==========================================================================
   YOR Estate - Dedicated Sliding User Creation Page & Role Provisioning Module
   ========================================================================== */

function renderUserNewPage() {
  setTimeout(() => {
    window.router.navigate('users', false);
    if (window.userWizard && window.userWizard.openSlidingPage) {
      window.userWizard.openSlidingPage();
    }
  }, 10);
  return renderUsersPage();
}

// Reusable Form HTML Generator for both Full Page & Sliding Panel
function renderUserCreationFormHtml(outlets, isSlidingDrawer = false) {
  // Document-defined Roles & Permissions Matrix (All 8 Roles)
  const rolesList = [
    {
      id: "super_admin",
      title: "Main / Super Admin",
      level: "Level 1 · Global",
      badgeClass: "dark",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      desc: "Full administrative privileges across all modules, outlets, financial ledger, security audit logs, team creation and role configuration.",
      defaultScope: "Global platform oversight",
      defaultDept: "Executive Board"
    },
    {
      id: "manager",
      title: "Operations Manager",
      level: "Level 2 · Executive",
      badgeClass: "gold",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      desc: "Executive management access: creates and manages Legal & Finance teams, configures State legal workflows, and oversees property verification.",
      defaultScope: "All operational divisions",
      defaultDept: "Operations & Governance"
    },
    {
      id: "ho_admin",
      title: "Head Office Admin",
      level: "Level 2 · Central HQ",
      badgeClass: "blue",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
      desc: "Central operations, multi-state compliance approval, HO legal sign-off, cross-outlet analytics and quarterly target setting.",
      defaultScope: "Global operations / Head Office",
      defaultDept: "Operations & Strategy"
    },
    {
      id: "outlet_admin",
      title: "Outlet Admin",
      level: "Level 3 · Branch",
      badgeClass: "gold",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 21V7l6-4 6 4v14M9 9h6M9 13h6M9 17h6"/></svg>`,
      desc: "Branch administrative control, local staff roster management, branch listings, client visit assignments and document uploads.",
      defaultScope: "YOR Central (Kochi)",
      defaultDept: "Branch Management"
    },
    {
      id: "sales_team",
      title: "Sales Team / Executive",
      level: "Scoped · Sales CRM",
      badgeClass: "green",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      desc: "Lead submission, client site visits, reservation booking, negotiation notes and individual commission ledger.",
      defaultScope: "YOR Central (Assigned Branch)",
      defaultDept: "Sales & Business Development"
    },
    {
      id: "finance_team",
      title: "Finance Team",
      level: "Scoped · Finance Ledger",
      badgeClass: "blue",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
      desc: "Cross-outlet financial ledger, stamp value verification, transaction recording, commission releases and banking reconciliations.",
      defaultScope: "Cross-outlet financial data",
      defaultDept: "Finance & Accounts"
    },
    {
      id: "legal_compliance",
      title: "Legal & Compliance Officer",
      level: "Scoped · Legal & Title",
      badgeClass: "gold",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>`,
      desc: "Multi-state 70-point title verification, encumbrance certificates (EC), legal heirship checks, RERA reviews and statutory clearance.",
      defaultScope: "7+ State Legal Checklists",
      defaultDept: "Legal & Statutory Compliance"
    },
    {
      id: "investor_portal",
      title: "Investor (External Portal)",
      level: "External · Investor Access",
      badgeClass: "gray",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
      desc: "Read-scoped investor portal for co-investment tracking, ownership percentage, property valuation, yield dividends and lock-in period.",
      defaultScope: "Own investment records & agreements",
      defaultDept: "External Investor Relations"
    },
    {
      id: "agent_broker",
      title: "Agent / Broker (External Portal)",
      level: "External · Broker Access",
      badgeClass: "gray",
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/></svg>`,
      desc: "External broker portal for submitting client leads, viewing assigned property brochures, tracking deal progression and commission payouts.",
      defaultScope: "Assigned properties & broker leads",
      defaultDept: "External Channel Partner Network"
    }
  ];

  return `
    <!-- Top Header Bar inside Sticky Container -->
    <div class="drawer-header-sticky-wrap">
      <div class="user-wizard-top">
        <div class="user-wizard-title-wrap">
          <div class="user-wizard-crumbs">
            <a href="#users" onclick="window.userWizard.closeSlidingPage(); return false;">Users & Roles</a>
            <span>/</span>
            <span>Add New User</span>
          </div>
          <h1>${isSlidingDrawer ? 'Add & Provision Platform User' : 'Add Platform User'}</h1>
          <p>Complete identity profile, outlet branch scoping, role assignment, password rules verification, and access governance.</p>
        </div>

        <div class="user-wizard-top-actions">
          <button class="btn sm" onclick="window.userWizard.fillDemoData()" title="Pre-fill with realistic user data">
            Fill Demo User
          </button>
          <button class="btn" onclick="window.userWizard.closeSlidingPage()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
          <button class="btn dark gold-glow" onclick="window.userWizard.saveUser()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Add User & Provision Role
          </button>
        </div>
      </div>
    </div>

    <!-- Main Sliding Content Layout -->
    <div class="user-wizard-grid">
      
      <!-- Left Column: Comprehensive Data Collection Form -->
      <div class="user-wizard-main">
        
        <!-- SECTION 1: Personal Identity & Photo Upload -->
        <div class="card user-wizard-card">
          <div class="ch">
            <div>
              <h3>1. Personal Identity & Photo</h3>
              <p>Basic personal information and profile photo upload</p>
            </div>
            <span class="chip gold xs">Personal Info</span>
          </div>

          <!-- Photo Upload Component -->
          <div class="user-photo-upload-section" id="userPhotoUploadSection">
            <div class="user-photo-preview-wrap">
              <img id="userPhotoPreview" src="" alt="Avatar" class="user-avatar-lg" style="display:none;">
              <div class="user-avatar-initials-fallback" id="userAvatarFallback" style="display:flex;">NU</div>
            </div>
            
            <div class="user-photo-controls">
              <div style="font-weight:600; font-size:13px; color:var(--ink);">Profile Photo Upload</div>
              <input type="file" id="newUserPhotoInput" accept="image/png, image/jpeg, image/webp, image/jpg" style="display:none;" onchange="window.userWizard.handlePhotoUpload(event)">
              
              <div class="photo-upload-btn-row">
                <button type="button" class="btn sm dark" onclick="document.getElementById('newUserPhotoInput').click()">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Browse & Upload Photo
                </button>
                <button type="button" class="btn sm" id="btnRemoveUserPhoto" style="display:none;" onclick="window.userWizard.removePhoto()">
                  ✕ Remove
                </button>
              </div>
              
              <div id="photoUploadStatus" class="photo-upload-hint">Upload JPG, PNG or WebP format (Max 5MB)</div>
            </div>
          </div>

          <!-- Name & Dates -->
          <div class="form-grid-2" style="margin-top: 18px;">
            <div class="form-group">
              <label class="form-label required">First Name</label>
              <input type="text" class="form-input" id="newUserFirstName" placeholder="e.g. Vikramaditya" value="" required oninput="window.userWizard.updatePreview()">
            </div>

            <div class="form-group">
              <label class="form-label required">Last Name</label>
              <input type="text" class="form-input" id="newUserLastName" placeholder="e.g. Varma" value="" required oninput="window.userWizard.updatePreview()">
            </div>

            <div class="form-group">
              <label class="form-label required">Date of Birth (DOB)</label>
              <input type="date" class="form-input" id="newUserDob" value="1992-06-15" required>
              <div class="form-hint">Used for compliance and statutory verification</div>
            </div>

            <div class="form-group">
              <label class="form-label required">Date of Joining (DOJ)</label>
              <input type="date" class="form-input" id="newUserDoj" value="2026-04-01" required>
              <div class="form-hint">Effective date of operational platform onboarding</div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: Contact & Full Address Details -->
        <div class="card user-wizard-card">
          <div class="ch">
            <div>
              <h3>2. Contact & Address Details</h3>
              <p>Official communication and residential address records</p>
            </div>
            <span class="chip blue xs">Contact & Address</span>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Official Email Address</label>
              <input type="email" class="form-input" id="newUserEmail" placeholder="e.g. vikram@yorestate.com" value="" required oninput="window.userWizard.updatePreview()">
              <div class="form-hint">Primary login ID and notification channel</div>
            </div>

            <div class="form-group">
              <label class="form-label required">Phone Number</label>
              <div class="input-with-prefix">
                <span class="input-prefix">+91</span>
                <input type="tel" class="form-input" id="newUserPhone" placeholder="98412 44556" value="" required>
              </div>
              <div class="form-hint">For account notifications and WhatsApp alerts</div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label class="form-label required">Street / Residential Address</label>
            <textarea class="form-input" id="newUserAddress" style="height: 64px; padding: 8px 12px; resize: vertical;" placeholder="e.g. Flat 4B, Royal Palms Residency, 100ft Road, Indiranagar">Flat 4B, Royal Palms Residency, 100ft Road, Indiranagar</textarea>
          </div>

          <div class="form-grid-3" style="margin-top: 14px;">
            <div class="form-group">
              <label class="form-label required">State</label>
              <select class="form-input" id="newUserState" onchange="window.userWizard.updatePreview()">
                <option value="Karnataka" selected>Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Telangana">Telangana</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Goa">Goa</option>
                <option value="International / Other">International / Other</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label required">Country</label>
              <select class="form-input" id="newUserCountry" onchange="window.userWizard.updatePreview()">
                <option value="India" selected>India (IN)</option>
                <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                <option value="Singapore">Singapore (SG)</option>
                <option value="United Kingdom">United Kingdom (UK)</option>
                <option value="United States">United States (USA)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">PIN / Postal Code</label>
              <input type="text" class="form-input" id="newUserPincode" placeholder="560038" value="560038">
            </div>
          </div>
        </div>

        <!-- SECTION 3: Select Role from Initial Document Specifications -->
        <div class="card user-wizard-card">
          <div class="ch">
            <div>
              <h3>3. Role & Access Level</h3>
              <p>Select role from the system architecture specifications</p>
            </div>
            <span class="chip green xs">Role Matrix</span>
          </div>

          <div class="role-selection-grid" id="roleSelectionGrid">
            ${rolesList.map((r, idx) => `
              <div class="role-select-card ${idx === 2 ? 'selected' : ''}" 
                   data-role-id="${r.id}" 
                   data-role-name="${r.title}" 
                   data-role-scope="${r.defaultScope}"
                   data-role-dept="${r.defaultDept}"
                   onclick="window.userWizard.selectRole('${r.id}')">
                <div class="role-card-header">
                  <div class="role-card-icon ${r.badgeClass}">
                    ${r.icon}
                  </div>
                  <div class="role-card-meta">
                    <span class="chip ${r.badgeClass} xs">${r.level}</span>
                    <div class="role-check-radio">
                      <div class="role-radio-dot"></div>
                    </div>
                  </div>
                </div>

                <div class="role-card-title">${r.title}</div>
                <div class="role-card-desc">${r.desc}</div>

                <div class="role-card-scope-badge">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span>Scope: <b>${r.defaultScope}</b></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 4: Outlet Selection & Branch Scoping (Multi-Select Dropdown) -->
        <div class="card user-wizard-card">
          <div class="ch">
            <div>
              <h3>4. Outlet Selection & Branch Scoping</h3>
              <p>Designate branch jurisdiction, department and cross-outlet visibility</p>
            </div>
            <span class="chip gold xs">Outlet Scope</span>
          </div>

          <div class="form-grid-2">
            <!-- Multi-Select Dropdown Container -->
            <div class="form-group">
              <label class="form-label required">Outlet Selection (Multi-Select)</label>
              <div class="multi-select-container" id="outletMultiSelectContainer">
                <div class="multi-select-trigger" id="outletMultiSelectTrigger" onclick="window.userWizard.toggleOutletDropdown(event)">
                  <div id="outletSelectedTags" style="display:flex; flex-wrap:wrap; gap:4px; align-items:center; flex:1;">
                    <!-- Tags rendered dynamically -->
                  </div>
                  <svg class="multi-select-caret" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                
                <div class="multi-select-menu" id="outletMultiSelectMenu">
                  <div class="multi-select-actions">
                    <span style="font-weight:600; color:var(--ink-2);">Outlets & Branches</span>
                    <div style="display:flex; gap:8px;">
                      <button type="button" onclick="window.userWizard.selectAllOutlets(event)">Select All</button>
                      <span style="color:#CBD5E1;">|</span>
                      <button type="button" onclick="window.userWizard.clearAllOutlets(event)">Clear All</button>
                    </div>
                  </div>
                  <div style="padding:6px 10px; border-bottom:1px solid #F1F5F9;">
                    <input type="text" class="form-input sm" id="outletSearchInput" placeholder="Filter outlet branches..." style="height:28px; font-size:12px; padding:4px 8px;" oninput="window.userWizard.filterOutletOptions(this.value)" onclick="event.stopPropagation()">
                  </div>
                  <div class="multi-select-options-list" id="outletOptionsList">
                    <!-- Options injected dynamically -->
                  </div>
                </div>
              </div>
              <div class="form-hint">Assign one or multiple branch jurisdictions and listings access</div>
            </div>

            <div class="form-group">
              <label class="form-label required">Department / Division</label>
              <select class="form-input" id="newUserDept">
                <option value="Branch Management">Branch Management</option>
                <option value="Executive Board">Executive Board</option>
                <option value="Operations & Strategy">Operations & Strategy</option>
                <option value="Sales & Business Development">Sales & Business Development</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Legal & Statutory Compliance">Legal & Statutory Compliance</option>
                <option value="External Channel Partner Network">External Channel Partner Network</option>
                <option value="External Investor Relations">External Investor Relations</option>
              </select>
              <div class="form-hint">Organizational grouping for task delegations and reports</div>
            </div>

            <div class="form-group">
              <label class="form-label">Designation / Title</label>
              <input type="text" class="form-input" id="newUserDesignation" placeholder="e.g. Senior Branch Operations Director" value="Branch Operations Director">
            </div>

            <div class="form-group">
              <label class="form-label">Employee / Partner ID</label>
              <input type="text" class="form-input" id="newUserEmpId" placeholder="YOR-EMP-2026-089" value="YOR-EMP-2026-089">
            </div>
          </div>
        </div>

        <!-- SECTION 5: Security Credentials, Password & Setup Rules Validation (No 2FA) -->
        <div class="card user-wizard-card">
          <div class="ch">
            <div>
              <h3>5. Security & Credentials Setup</h3>
              <p>Password configuration, security rules validation, and access governance</p>
            </div>
            <span class="chip dark xs">Security & Access</span>
          </div>

          <div class="form-grid-2">
            <!-- Account Status -->
            <div class="form-group">
              <label class="form-label required">Initial Account Status</label>
              <select class="form-input" id="newUserStatus" onchange="window.userWizard.updatePreview()">
                <option value="Active" selected>Active — Full Operational Access</option>
                <option value="Pending Activation">Pending Activation — Verification Required</option>
                <option value="Suspended / Inactive">Suspended / Inactive</option>
              </select>
            </div>

            <!-- Generate Strong Password Action -->
            <div class="form-group" style="display: flex; flex-direction: column; justify-content: flex-end;">
              <button type="button" class="btn dark" style="width: 100%;" onclick="window.userWizard.generateRandomPassword()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                Generate Strong Secure Password
              </button>
            </div>
          </div>

          <!-- Password & Confirm Password Grid -->
          <div class="form-grid-2" style="margin-top: 14px;">
            <div class="form-group">
              <label class="form-label required">Password</label>
              <div class="password-input-group">
                <input type="password" class="form-input" id="newUserPassword" placeholder="Create strong password" value="Yor@Pass2026!" required oninput="window.userWizard.checkPasswordRules()">
                <button type="button" class="password-toggle-btn" onclick="window.userWizard.togglePasswordVisibility('newUserPassword', this)" title="Toggle password visibility">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">Confirm Password</label>
              <div class="password-input-group">
                <input type="password" class="form-input" id="newUserConfirmPassword" placeholder="Re-enter password" value="Yor@Pass2026!" required oninput="window.userWizard.checkPasswordRules()">
                <button type="button" class="password-toggle-btn" onclick="window.userWizard.togglePasswordVisibility('newUserConfirmPassword', this)" title="Toggle password visibility">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div id="passwordMatchMsg" class="password-match-indicator matched">✓ Passwords match</div>
            </div>
          </div>

          <!-- Password Strength Meter & Interactive Rules Checklist -->
          <div class="password-strength-container">
            <div class="password-strength-header">
              <span>Password Security Rules & Strength</span>
              <span id="passwordStrengthLabel" class="chip green xs">Strong</span>
            </div>
            
            <div class="password-strength-bar">
              <div id="passwordStrengthFill" class="password-strength-fill strong" style="width: 100%;"></div>
            </div>

            <div class="password-rules-grid">
              <div class="password-rule-item valid" id="ruleLength">
                <div class="password-rule-icon">✓</div>
                <span>Minimum 8 characters</span>
              </div>
              <div class="password-rule-item valid" id="ruleUpper">
                <div class="password-rule-icon">✓</div>
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div class="password-rule-item valid" id="ruleLower">
                <div class="password-rule-icon">✓</div>
                <span>At least one lowercase letter (a-z)</span>
              </div>
              <div class="password-rule-item valid" id="ruleNumber">
                <div class="password-rule-icon">✓</div>
                <span>At least one number (0-9)</span>
              </div>
              <div class="password-rule-item valid" id="ruleSpecial">
                <div class="password-rule-icon">✓</div>
                <span>At least one special symbol (!@#$%^&*)</span>
              </div>
              <div class="password-rule-item valid" id="ruleMatch">
                <div class="password-rule-icon">✓</div>
                <span>Passwords match</span>
              </div>
            </div>
          </div>

          <!-- Security Policy Options (No 2FA) -->
          <div class="security-toggles-grid" style="margin-top: 16px;">
            <label class="custom-checkbox-label">
              <input type="checkbox" id="sendWelcomeEmail" checked>
              <span class="checkbox-box"></span>
              <span class="checkbox-text">
                <b>Send Welcome Credentials Email</b>
                <small>Dispatches login credentials and onboarding guide directly to the user</small>
              </span>
            </label>
          </div>
        </div>

        <!-- Submit Button Bar -->
        <div class="user-wizard-bottom-bar">
          <button class="btn lg" onclick="window.userWizard.closeSlidingPage()">Cancel</button>
          <button class="btn lg dark gold-glow" onclick="window.userWizard.saveUser()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 8px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Add User & Provision Role
          </button>
        </div>

      </div>

      <!-- Right Column: Live Summary & Permissions Sidebar -->
      <div class="user-wizard-sidebar">
        
        <!-- Live Profile Card -->
        <div class="card user-summary-card">
          <div class="user-summary-header">
            <div style="position:relative; width:48px; height:48px; flex-shrink:0;">
              <img id="previewAvatarImg" src="" class="user-summary-avatar" style="width:48px; height:48px; border-radius:50%; object-fit:cover; display:none; border:2px solid var(--gold);">
              <div id="previewAvatarFallback" style="width:48px; height:48px; border-radius:50%; background:#0F172A; color:#fff; font-size:16px; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid var(--gold);">NU</div>
            </div>
            <div class="user-summary-info">
              <h4 id="previewName">New Team Member</h4>
              <div class="user-summary-email" id="previewEmail">user@yorestate.com</div>
              <div class="user-summary-badge" id="previewRoleBadge">
                <span class="chip gold xs" id="previewRoleText">Outlet Admin</span>
                <span class="chip green xs" id="previewStatusText">Active</span>
              </div>
            </div>
          </div>

          <div class="user-summary-divider"></div>

          <div class="user-summary-stat-row">
            <div class="user-summary-stat">
              <span>Outlet Scope</span>
              <b id="previewScopeText">YOR Central (Kochi)</b>
            </div>
            <div class="user-summary-stat">
              <span>Location</span>
              <b id="previewLocationText">Karnataka, IN</b>
            </div>
          </div>
        </div>

        <!-- Dynamic Permissions Matrix for Selected Role -->
        <div class="card user-permissions-card">
          <div class="ch">
            <div>
              <h3>Effective Module Access</h3>
              <p id="previewRoleSummaryTitle">Permissions for Outlet Admin</p>
            </div>
            <span class="chip dark xs" id="previewLevelPill">Level 3</span>
          </div>

          <div class="permissions-module-list" id="previewModuleList">
            <!-- Dynamically populated based on selected role -->
          </div>

          <div class="audit-security-note">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>All login sessions, data exports and role changes are logged in the <b>YOR Immutable Audit Trail</b>.</span>
          </div>
        </div>

      </div>

    </div>
  `;
}

// Global User Wizard, Sliding Drawer & Security Controller
window.userWizard = {
  selectedRoleId: "outlet_admin",
  uploadedPhotoData: "",
  selectedOutlets: ["YOR Central (Kochi)"],
  allAvailableOutlets: [],

  // Open Sliding Page Drawer over any page
  openSlidingPage() {
    let drawerOverlay = document.getElementById('userSlidingDrawerOverlay');
    if (!drawerOverlay) {
      drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'userSlidingDrawerOverlay';
      drawerOverlay.className = 'user-sliding-drawer-overlay';
      drawerOverlay.innerHTML = `
        <div class="user-sliding-drawer-backdrop" onclick="window.userWizard.closeSlidingPage()"></div>
        <div class="user-sliding-drawer-panel" id="userSlidingDrawerPanel">
          <!-- Dynamic Content Injected Here -->
        </div>
      `;
      document.body.appendChild(drawerOverlay);
    }

    const panel = document.getElementById('userSlidingDrawerPanel');
    const store = window.store;
    const outlets = (store && store.data && store.data.outlets) || [];
    
    // Ensure drawer starts offscreen on the right
    drawerOverlay.classList.remove('open');
    panel.innerHTML = renderUserCreationFormHtml(outlets, true);
    panel.scrollTop = 0;
    panel.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Initialize state, outlets, drag-drop, and password rules
    this.initOutletsList(outlets);
    this.setupPhotoDragDrop();
    this.updatePreview();
    this.checkPasswordRules();

    // Force reflow so browser registers initial translateX(100%)
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

    // Enforce top scroll across initial paint frames
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
    const drawerOverlay = document.getElementById('userSlidingDrawerOverlay');
    if (drawerOverlay && drawerOverlay.classList.contains('open')) {
      drawerOverlay.classList.remove('open');
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 660);
    } else {
      window.router.navigate('users');
    }
  },

  // ==========================================
  // PHOTO UPLOAD & PREVIEW (No URL, Upload Only)
  // ==========================================
  handlePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (window.modals && window.modals.showToast) {
        window.modals.showToast("Photo must be less than 5MB in size", "error");
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedPhotoData = e.target.result;
      
      const imgPreview = document.getElementById('userPhotoPreview');
      const fallback = document.getElementById('userAvatarFallback');
      const removeBtn = document.getElementById('btnRemoveUserPhoto');
      const statusText = document.getElementById('photoUploadStatus');

      if (imgPreview) {
        imgPreview.src = this.uploadedPhotoData;
        imgPreview.style.display = 'block';
      }
      if (fallback) fallback.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'inline-flex';
      if (statusText) {
        statusText.innerHTML = `✓ ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        statusText.className = "photo-upload-file-info";
      }

      this.updatePreview();

      if (window.modals && window.modals.showToast) {
        window.modals.showToast("Photo uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  },

  removePhoto() {
    this.uploadedPhotoData = "";
    const fileInput = document.getElementById('newUserPhotoInput');
    if (fileInput) fileInput.value = "";

    const imgPreview = document.getElementById('userPhotoPreview');
    const fallback = document.getElementById('userAvatarFallback');
    const removeBtn = document.getElementById('btnRemoveUserPhoto');
    const statusText = document.getElementById('photoUploadStatus');

    if (imgPreview) {
      imgPreview.src = "";
      imgPreview.style.display = 'none';
    }
    if (fallback) fallback.style.display = 'flex';
    if (removeBtn) removeBtn.style.display = 'none';
    if (statusText) {
      statusText.textContent = "Upload JPG, PNG or WebP format (Max 5MB)";
      statusText.className = "photo-upload-hint";
    }

    this.updatePreview();
  },

  setupPhotoDragDrop() {
    const dropzone = document.getElementById('userPhotoUploadSection');
    const fileInput = document.getElementById('newUserPhotoInput');
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length) {
        fileInput.files = files;
        this.handlePhotoUpload({ target: { files } });
      }
    }, false);
  },

  // ==========================================
  // OUTLET MULTI-SELECT DROPDOWN
  // ==========================================
  initOutletsList(outlets) {
    // Standard master list of outlets
    const defaultList = [
      { name: "Global / All Outlets & HQ", badge: "Global" },
      { name: "Head Office (HQ Central)", badge: "Central HQ" }
    ];

    const storeOutlets = outlets.map(o => ({
      name: `${o.name} (${o.city || o.state || 'Branch'})`,
      badge: o.city || o.state || 'Branch'
    }));

    // Deduplicate
    const combined = [...defaultList];
    storeOutlets.forEach(so => {
      if (!combined.some(c => c.name === so.name)) {
        combined.push(so);
      }
    });

    this.allAvailableOutlets = combined;
    this.renderOutletDropdownOptions();
    this.renderOutletTags();

    // Close on outside click
    document.addEventListener('click', (e) => {
      const container = document.getElementById('outletMultiSelectContainer');
      const menu = document.getElementById('outletMultiSelectMenu');
      const trigger = document.getElementById('outletMultiSelectTrigger');
      if (container && menu && !container.contains(e.target)) {
        menu.classList.remove('open');
        if (trigger) trigger.classList.remove('active');
      }
    });
  },

  toggleOutletDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('outletMultiSelectMenu');
    const trigger = document.getElementById('outletMultiSelectTrigger');
    if (menu && trigger) {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open', !isOpen);
      trigger.classList.toggle('active', !isOpen);
    }
  },

  renderOutletTags() {
    const container = document.getElementById('outletSelectedTags');
    if (!container) return;

    if (!this.selectedOutlets || this.selectedOutlets.length === 0) {
      container.innerHTML = `<span class="multi-select-placeholder">Select outlet branch(es)...</span>`;
      return;
    }

    container.innerHTML = this.selectedOutlets.map(name => `
      <span class="multi-select-tag">
        <span>${name}</span>
        <span class="multi-select-tag-remove" onclick="window.userWizard.removeOutletTag('${name.replace(/'/g, "\\'")}', event)" title="Remove outlet">×</span>
      </span>
    `).join('');
  },

  renderOutletDropdownOptions(filterText = '') {
    const container = document.getElementById('outletOptionsList');
    if (!container) return;

    const filter = (filterText || '').toLowerCase().trim();
    const filtered = this.allAvailableOutlets.filter(o => 
      !filter || o.name.toLowerCase().includes(filter) || (o.badge && o.badge.toLowerCase().includes(filter))
    );

    if (filtered.length === 0) {
      container.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--ink-2); font-size: 12px;">No outlets match "${filterText}"</div>`;
      return;
    }

    container.innerHTML = filtered.map(o => {
      const isSelected = this.selectedOutlets.includes(o.name);
      return `
        <div class="multi-select-option ${isSelected ? 'selected' : ''}" onclick="window.userWizard.toggleOutletSelection('${o.name.replace(/'/g, "\\'")}', event)">
          <div class="multi-select-checkbox">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="multi-select-option-label">${o.name}</span>
          <span class="multi-select-option-badge">${o.badge}</span>
        </div>
      `;
    }).join('');
  },

  toggleOutletSelection(outletName, e) {
    if (e) e.stopPropagation();

    if (outletName === "Global / All Outlets & HQ") {
      if (this.selectedOutlets.includes(outletName)) {
        this.selectedOutlets = [];
      } else {
        this.selectedOutlets = [outletName];
      }
    } else {
      // If Global was selected, deselect it
      this.selectedOutlets = this.selectedOutlets.filter(n => n !== "Global / All Outlets & HQ");
      
      const idx = this.selectedOutlets.indexOf(outletName);
      if (idx > -1) {
        this.selectedOutlets.splice(idx, 1);
      } else {
        this.selectedOutlets.push(outletName);
      }
    }

    this.renderOutletTags();
    this.renderOutletDropdownOptions(document.getElementById('outletSearchInput') ? document.getElementById('outletSearchInput').value : '');
    this.updatePreview();
  },

  selectAllOutlets(e) {
    if (e) e.stopPropagation();
    this.selectedOutlets = this.allAvailableOutlets.map(o => o.name);
    this.renderOutletTags();
    this.renderOutletDropdownOptions();
    this.updatePreview();
  },

  clearAllOutlets(e) {
    if (e) e.stopPropagation();
    this.selectedOutlets = [];
    this.renderOutletTags();
    this.renderOutletDropdownOptions();
    this.updatePreview();
  },

  removeOutletTag(outletName, e) {
    if (e) e.stopPropagation();
    this.selectedOutlets = this.selectedOutlets.filter(n => n !== outletName);
    this.renderOutletTags();
    this.renderOutletDropdownOptions();
    this.updatePreview();
  },

  filterOutletOptions(query) {
    this.renderOutletDropdownOptions(query);
  },

  // ==========================================
  // ROLE SELECTION & MATRIX
  // ==========================================
  selectRole(roleId) {
    this.selectedRoleId = roleId;
    
    document.querySelectorAll('.role-select-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.roleId === roleId);
    });

    const card = document.querySelector(`.role-select-card[data-role-id="${roleId}"]`);
    if (card) {
      const defaultDept = card.dataset.roleDept;
      const deptSelect = document.getElementById('newUserDept');
      if (deptSelect && defaultDept) {
        for (let i = 0; i < deptSelect.options.length; i++) {
          if (deptSelect.options[i].value === defaultDept) {
            deptSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    this.updatePreview();
  },

  // ==========================================
  // LIVE PREVIEW SYNCHRONIZATION
  // ==========================================
  updatePreview() {
    const firstInput = document.getElementById('newUserFirstName');
    const lastInput = document.getElementById('newUserLastName');
    const emailInput = document.getElementById('newUserEmail');
    const stateSelect = document.getElementById('newUserState');
    const countrySelect = document.getElementById('newUserCountry');
    const statusSelect = document.getElementById('newUserStatus');

    const firstName = (firstInput && firstInput.value.trim()) || "";
    const lastName = (lastInput && lastInput.value.trim()) || "";
    const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : "New Team Member";
    const email = (emailInput && emailInput.value.trim()) || "user@yorestate.com";
    const state = (stateSelect && stateSelect.value) || "Karnataka";
    const country = (countrySelect && countrySelect.value) || "India";
    const status = (statusSelect && statusSelect.value) || "Active";

    // Initials calculation
    const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || "NU";

    // Update avatar elements
    const userFallback = document.getElementById('userAvatarFallback');
    if (userFallback) userFallback.textContent = initials;

    const previewAvatarImg = document.getElementById('previewAvatarImg');
    const previewAvatarFallback = document.getElementById('previewAvatarFallback');

    if (this.uploadedPhotoData) {
      if (previewAvatarImg) {
        previewAvatarImg.src = this.uploadedPhotoData;
        previewAvatarImg.style.display = 'block';
      }
      if (previewAvatarFallback) previewAvatarFallback.style.display = 'none';
    } else {
      if (previewAvatarImg) previewAvatarImg.style.display = 'none';
      if (previewAvatarFallback) {
        previewAvatarFallback.textContent = initials;
        previewAvatarFallback.style.display = 'flex';
      }
    }

    const previewName = document.getElementById('previewName');
    if (previewName) previewName.textContent = fullName;

    const previewEmail = document.getElementById('previewEmail');
    if (previewEmail) previewEmail.textContent = email;

    // Scope / Outlet text in sidebar
    const previewScopeText = document.getElementById('previewScopeText');
    if (previewScopeText) {
      if (this.selectedOutlets.length === 0) {
        previewScopeText.textContent = "None Selected";
      } else if (this.selectedOutlets.length === 1) {
        previewScopeText.textContent = this.selectedOutlets[0].split('—')[0].split('(')[0].trim();
      } else {
        previewScopeText.textContent = `${this.selectedOutlets.length} Outlets Selected`;
        previewScopeText.title = this.selectedOutlets.join(', ');
      }
    }

    const previewLocationText = document.getElementById('previewLocationText');
    if (previewLocationText) previewLocationText.textContent = `${state}, ${country === 'India' ? 'IN' : country.slice(0, 3).toUpperCase()}`;

    const previewStatusText = document.getElementById('previewStatusText');
    if (previewStatusText) {
      previewStatusText.textContent = status;
      previewStatusText.className = `chip ${status === 'Active' ? 'green' : status.includes('Pending') ? 'gold' : 'gray'} xs`;
    }

    const roleCard = document.querySelector(`.role-select-card[data-role-id="${this.selectedRoleId}"]`);
    const roleName = (roleCard && roleCard.dataset.roleName) || "Outlet Admin";

    const previewRoleText = document.getElementById('previewRoleText');
    if (previewRoleText) {
      previewRoleText.textContent = roleName;
      previewRoleText.className = `chip ${roleName.includes('Super') ? 'dark' : roleName.includes('Head') ? 'blue' : roleName.includes('Outlet') ? 'gold' : 'green'} xs`;
    }

    const previewRoleSummaryTitle = document.getElementById('previewRoleSummaryTitle');
    if (previewRoleSummaryTitle) previewRoleSummaryTitle.textContent = `Permissions for ${roleName}`;

    this.renderModuleMatrix();
  },

  renderModuleMatrix() {
    const container = document.getElementById('previewModuleList');
    if (!container) return;

    const matrixMap = {
      super_admin: [
        { mod: "Overview & Analytics", access: "Full Global Access", type: "full" },
        { mod: "Properties Register", access: "All Outlets (Create/Edit/Delete)", type: "full" },
        { mod: "Sales CRM", access: "Central Pipeline & Approvals", type: "full" },
        { mod: "Rentals Management", access: "All Branches Active Leases", type: "full" },
        { mod: "Group Investments", access: "Group Mapping & Capital Calls", type: "full" },
        { mod: "Finance & Accounts", access: "Cross-Outlet Ledger & Payouts", type: "full" },
        { mod: "Legal & Compliance", access: "Multi-State Sign-off Authority", type: "full" },
        { mod: "Users & Security", access: "Directory & Role Tokens", type: "full" }
      ],
      ho_admin: [
        { mod: "Overview & Analytics", access: "Central Head Office Overview", type: "full" },
        { mod: "Properties Register", access: "All Branches Review & Publish", type: "full" },
        { mod: "Sales CRM", access: "Cross-Outlet Performance", type: "scoped" },
        { mod: "Rentals Management", access: "Central Portfolio Oversight", type: "scoped" },
        { mod: "Group Investments", access: "Portfolio Tracking & Allocations", type: "scoped" },
        { mod: "Finance & Accounts", access: "HO Centralized Reporting", type: "scoped" },
        { mod: "Legal & Compliance", access: "7-State Legal Sign-off Authority", type: "full" },
        { mod: "Users & Security", access: "Branch Staff Provisioning", type: "scoped" }
      ],
      outlet_admin: [
        { mod: "Overview & Analytics", access: "Branch Metrics Only", type: "scoped" },
        { mod: "Properties Register", access: "Assigned Outlet Listings", type: "scoped" },
        { mod: "Sales CRM", access: "Branch Lead Pipeline & Visits", type: "scoped" },
        { mod: "Rentals Management", access: "Local Tenancy Agreements", type: "scoped" },
        { mod: "Group Investments", access: "Branch Property Allocations", type: "scoped" },
        { mod: "Finance & Accounts", access: "Local Expense Logging", type: "scoped" },
        { mod: "Legal & Compliance", access: "Document Upload & Checklist", type: "scoped" },
        { mod: "Users & Security", access: "Branch Staff View", type: "scoped" }
      ],
      sales_team: [
        { mod: "Overview & Analytics", access: "Personal Sales Metrics", type: "scoped" },
        { mod: "Properties Register", access: "View Catalog & Availability", type: "view" },
        { mod: "Sales CRM", access: "Own Leads & Client Pipeline", type: "full" },
        { mod: "Rentals Management", access: "Rental Inquiries & Viewings", type: "scoped" },
        { mod: "Group Investments", access: "No Access", type: "none" },
        { mod: "Finance & Accounts", access: "Personal Commission Statement", type: "view" },
        { mod: "Legal & Compliance", access: "Customer KYC Submission", type: "scoped" },
        { mod: "Users & Security", access: "No Access", type: "none" }
      ],
      finance_team: [
        { mod: "Overview & Analytics", access: "Revenue & Cash Flow View", type: "full" },
        { mod: "Properties Register", access: "Financial Values & Stamp Duty", type: "view" },
        { mod: "Sales CRM", access: "Payment Milestones & Token Dues", type: "view" },
        { mod: "Rentals Management", access: "Monthly Rent Collections", type: "scoped" },
        { mod: "Group Investments", access: "Capital Calls & Payout Ledger", type: "full" },
        { mod: "Finance & Accounts", access: "Full Ledger & Disbursal", type: "full" },
        { mod: "Legal & Compliance", access: "Stamp Duty & Registration Receipts", type: "view" },
        { mod: "Users & Security", access: "Payroll & Commission Mapping", type: "scoped" }
      ],
      legal_compliance: [
        { mod: "Overview & Analytics", access: "Compliance Readiness View", type: "scoped" },
        { mod: "Properties Register", access: "Legal Documentation Verification", type: "full" },
        { mod: "Sales CRM", access: "Buyer Due Diligence Scrutiny", type: "scoped" },
        { mod: "Rentals Management", access: "Lease Deed Compliance", type: "scoped" },
        { mod: "Group Investments", access: "Co-Investor Agreement Review", type: "full" },
        { mod: "Finance & Accounts", access: "Statutory Stamp Duty Verification", type: "view" },
        { mod: "Legal & Compliance", access: "Full 70-Point Title Audit & Certification", type: "full" },
        { mod: "Users & Security", access: "No Access", type: "none" }
      ],
      investor_portal: [
        { mod: "Overview & Analytics", access: "Investor Portfolio Summary", type: "view" },
        { mod: "Properties Register", access: "Invested Properties Detail Only", type: "view" },
        { mod: "Sales CRM", access: "No Access", type: "none" },
        { mod: "Rentals Management", access: "Rental Dividend Payouts", type: "view" },
        { mod: "Group Investments", access: "Own Capital & Co-investor Share", type: "view" },
        { mod: "Finance & Accounts", access: "Personal Dividend Statement", type: "view" },
        { mod: "Legal & Compliance", access: "Executed Investment Deeds", type: "view" },
        { mod: "Users & Security", access: "No Access", type: "none" }
      ],
      agent_broker: [
        { mod: "Overview & Analytics", access: "Broker Pipeline Summary", type: "view" },
        { mod: "Properties Register", access: "Authorized Public Catalog", type: "view" },
        { mod: "Sales CRM", access: "Own Submitted Leads Only", type: "scoped" },
        { mod: "Rentals Management", access: "Broker Rental Deals", type: "scoped" },
        { mod: "Group Investments", access: "No Access", type: "none" },
        { mod: "Finance & Accounts", access: "Broker Commission Statements", type: "view" },
        { mod: "Legal & Compliance", access: "Broker Agreement & GST Invoice", type: "view" },
        { mod: "Users & Security", access: "No Access", type: "none" }
      ]
    };

    const currentMatrix = matrixMap[this.selectedRoleId] || matrixMap['outlet_admin'];

    container.innerHTML = currentMatrix.map(item => `
      <div class="permission-item">
        <div class="permission-mod-name">${item.mod}</div>
        <div class="permission-mod-badge ${item.type}">
          ${item.type === 'full' ? '● Full Access' : item.type === 'scoped' ? '◐ Scoped Access' : item.type === 'view' ? '○ View Only' : '✕ No Access'}
        </div>
      </div>
    `).join('');
  },

  // Toggle Password Field Visibility
  togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      btnEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      `;
    } else {
      input.type = 'password';
      btnEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      `;
    }
  },

  // Generate Guaranteed Strong Password
  generateRandomPassword() {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";
    
    let pwd = "";
    pwd += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    pwd += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pwd += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 0; i < 6; i++) {
      pwd += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    const pwdInput = document.getElementById('newUserPassword');
    const confirmInput = document.getElementById('newUserConfirmPassword');
    
    if (pwdInput) pwdInput.value = pwd;
    if (confirmInput) confirmInput.value = pwd;

    this.checkPasswordRules();

    if (window.modals && window.modals.showToast) {
      window.modals.showToast("Secure strong password generated and matched!");
    }
  },

  // Live Password Rules & Strength Meter Checking
  checkPasswordRules() {
    const pwdInput = document.getElementById('newUserPassword');
    const confirmInput = document.getElementById('newUserConfirmPassword');
    const pwd = (pwdInput && pwdInput.value) || "";
    const confirmPwd = (confirmInput && confirmInput.value) || "";

    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    const hasMatch = pwd.length > 0 && pwd === confirmPwd;

    // Update rule checklist icons and classes
    this.setRuleState('ruleLength', hasLength);
    this.setRuleState('ruleUpper', hasUpper);
    this.setRuleState('ruleLower', hasLower);
    this.setRuleState('ruleNumber', hasNumber);
    this.setRuleState('ruleSpecial', hasSpecial);
    this.setRuleState('ruleMatch', hasMatch);

    // Update Match Message under Confirm Password
    const matchMsg = document.getElementById('passwordMatchMsg');
    if (matchMsg) {
      if (!confirmPwd) {
        matchMsg.textContent = "Please confirm password";
        matchMsg.className = "password-match-indicator";
      } else if (hasMatch) {
        matchMsg.textContent = "✓ Passwords match";
        matchMsg.className = "password-match-indicator matched";
      } else {
        matchMsg.textContent = "✕ Passwords do not match";
        matchMsg.className = "password-match-indicator unmatched";
      }
    }

    // Calculate Strength Score (0 to 5)
    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthLabel = document.getElementById('passwordStrengthLabel');

    if (strengthFill && strengthLabel) {
      if (!pwd) {
        strengthFill.style.width = "0%";
        strengthFill.className = "password-strength-fill";
        strengthLabel.textContent = "Required";
        strengthLabel.className = "chip gray xs";
      } else if (score <= 2) {
        strengthFill.style.width = "25%";
        strengthFill.className = "password-strength-fill weak";
        strengthLabel.textContent = "Weak";
        strengthLabel.className = "chip red xs";
      } else if (score === 3) {
        strengthFill.style.width = "50%";
        strengthFill.className = "password-strength-fill fair";
        strengthLabel.textContent = "Fair";
        strengthLabel.className = "chip gold xs";
      } else if (score === 4) {
        strengthFill.style.width = "75%";
        strengthFill.className = "password-strength-fill good";
        strengthLabel.textContent = "Good";
        strengthLabel.className = "chip blue xs";
      } else {
        strengthFill.style.width = "100%";
        strengthFill.className = "password-strength-fill strong";
        strengthLabel.textContent = "Strong";
        strengthLabel.className = "chip green xs";
      }
    }

    return hasLength && hasUpper && hasLower && hasNumber && hasSpecial && hasMatch;
  },

  setRuleState(elementId, isValid) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (isValid) {
      el.classList.add('valid');
      const icon = el.querySelector('.password-rule-icon');
      if (icon) icon.textContent = "✓";
    } else {
      el.classList.remove('valid');
      const icon = el.querySelector('.password-rule-icon');
      if (icon) icon.textContent = "○";
    }
  },

  // ==========================================
  // PASSWORD RESET SLIDING DRAWER / POPUP
  // ==========================================
  openPasswordReset(userId) {
    const store = window.store;
    const user = store.data.users.find(u => u.id === userId || u.email === userId);
    if (!user) {
      if (window.modals && window.modals.showToast) window.modals.showToast("User record not found", "error");
      return;
    }

    let resetOverlay = document.getElementById('userPasswordResetOverlay');
    if (!resetOverlay) {
      resetOverlay = document.createElement('div');
      resetOverlay.id = 'userPasswordResetOverlay';
      resetOverlay.className = 'user-sliding-drawer-overlay';
      document.body.appendChild(resetOverlay);
    }

    resetOverlay.innerHTML = `
      <div class="user-sliding-drawer-backdrop" onclick="window.userWizard.closePasswordReset()"></div>
      <div class="user-sliding-drawer-panel" style="max-width: 600px; padding: 28px 32px;">
        <div class="user-wizard-top" style="margin-bottom: 20px;">
          <div class="user-wizard-title-wrap">
            <div class="user-wizard-crumbs">
              <a href="#users" onclick="window.userWizard.closePasswordReset(); return false;">Users</a>
              <span>/</span>
              <span>Reset Password</span>
            </div>
            <h1 style="font-size: 20px;">Reset User Password</h1>
            <p>Set a new secure password for <b>${user.name}</b></p>
          </div>
          <button class="btn" onclick="window.userWizard.closePasswordReset()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
        </div>

        <div class="card user-wizard-card">
          <div style="display: flex; align-items: center; gap: 14px; padding-bottom: 16px; border-bottom: 1px solid var(--line-2);">
            <img src="${user.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold);">
            <div>
              <h4 style="margin: 0; font-size: 15px; color: var(--ink);">${user.name}</h4>
              <div class="xs muted">${user.email} · <span class="chip gold xs">${user.role}</span></div>
            </div>
          </div>

          <div style="margin-top: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <label class="form-label" style="margin: 0;">New Credentials</label>
              <button type="button" class="btn sm dark" onclick="window.userWizard.generateRandomResetPassword()">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                Generate Password
              </button>
            </div>

            <div class="form-group">
              <label class="form-label required">New Password</label>
              <div class="password-input-group">
                <input type="password" class="form-input" id="resetNewPassword" placeholder="Enter new password" value="Yor@Reset2026#" oninput="window.userWizard.checkResetPasswordRules()">
                <button type="button" class="password-toggle-btn" onclick="window.userWizard.togglePasswordVisibility('resetNewPassword', this)">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group" style="margin-top: 12px;">
              <label class="form-label required">Confirm New Password</label>
              <div class="password-input-group">
                <input type="password" class="form-input" id="resetConfirmPassword" placeholder="Re-enter new password" value="Yor@Reset2026#" oninput="window.userWizard.checkResetPasswordRules()">
                <button type="button" class="password-toggle-btn" onclick="window.userWizard.togglePasswordVisibility('resetConfirmPassword', this)">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div id="resetMatchMsg" class="password-match-indicator matched">✓ Passwords match</div>
            </div>

            <!-- Rules Validation -->
            <div class="password-strength-container" style="margin-top: 14px;">
              <div class="password-strength-header">
                <span>Rules Validation</span>
                <span id="resetStrengthLabel" class="chip green xs">Strong</span>
              </div>
              <div class="password-strength-bar">
                <div id="resetStrengthFill" class="password-strength-fill strong" style="width: 100%;"></div>
              </div>
              <div class="password-rules-grid">
                <div class="password-rule-item valid" id="resetRuleLength"><div class="password-rule-icon">✓</div><span>8+ characters</span></div>
                <div class="password-rule-item valid" id="resetRuleUpper"><div class="password-rule-icon">✓</div><span>Uppercase (A-Z)</span></div>
                <div class="password-rule-item valid" id="resetRuleLower"><div class="password-rule-icon">✓</div><span>Lowercase (a-z)</span></div>
                <div class="password-rule-item valid" id="resetRuleNumber"><div class="password-rule-icon">✓</div><span>Number (0-9)</span></div>
                <div class="password-rule-item valid" id="resetRuleSpecial"><div class="password-rule-icon">✓</div><span>Special char (!@#$)</span></div>
                <div class="password-rule-item valid" id="resetRuleMatch"><div class="password-rule-icon">✓</div><span>Passwords match</span></div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--line-2);">
            <button class="btn" onclick="window.userWizard.closePasswordReset()">Cancel</button>
            <button class="btn dark gold-glow" onclick="window.userWizard.submitPasswordReset('${user.id || user.email}')">
              Save New Password
            </button>
          </div>
        </div>
      </div>
    `;

    resetOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.checkResetPasswordRules();
    }, 50);
  },

  closePasswordReset() {
    const resetOverlay = document.getElementById('userPasswordResetOverlay');
    if (resetOverlay && resetOverlay.classList.contains('open')) {
      resetOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  generateRandomResetPassword() {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";
    
    let pwd = "";
    pwd += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    pwd += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pwd += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 0; i < 6; i++) {
      pwd += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    const pwdInput = document.getElementById('resetNewPassword');
    const confirmInput = document.getElementById('resetConfirmPassword');
    
    if (pwdInput) pwdInput.value = pwd;
    if (confirmInput) confirmInput.value = pwd;

    this.checkResetPasswordRules();
    if (window.modals && window.modals.showToast) {
      window.modals.showToast("Secure password generated!");
    }
  },

  checkResetPasswordRules() {
    const pwdInput = document.getElementById('resetNewPassword');
    const confirmInput = document.getElementById('resetConfirmPassword');
    const pwd = (pwdInput && pwdInput.value) || "";
    const confirmPwd = (confirmInput && confirmInput.value) || "";

    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    const hasMatch = pwd.length > 0 && pwd === confirmPwd;

    this.setRuleState('resetRuleLength', hasLength);
    this.setRuleState('resetRuleUpper', hasUpper);
    this.setRuleState('resetRuleLower', hasLower);
    this.setRuleState('resetRuleNumber', hasNumber);
    this.setRuleState('resetRuleSpecial', hasSpecial);
    this.setRuleState('resetRuleMatch', hasMatch);

    const matchMsg = document.getElementById('resetMatchMsg');
    if (matchMsg) {
      if (!confirmPwd) {
        matchMsg.textContent = "Please confirm password";
        matchMsg.className = "password-match-indicator";
      } else if (hasMatch) {
        matchMsg.textContent = "✓ Passwords match";
        matchMsg.className = "password-match-indicator matched";
      } else {
        matchMsg.textContent = "✕ Passwords do not match";
        matchMsg.className = "password-match-indicator unmatched";
      }
    }

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    const strengthFill = document.getElementById('resetStrengthFill');
    const strengthLabel = document.getElementById('resetStrengthLabel');

    if (strengthFill && strengthLabel) {
      if (!pwd) {
        strengthFill.style.width = "0%";
        strengthFill.className = "password-strength-fill";
        strengthLabel.textContent = "Required";
        strengthLabel.className = "chip gray xs";
      } else if (score <= 2) {
        strengthFill.style.width = "25%";
        strengthFill.className = "password-strength-fill weak";
        strengthLabel.textContent = "Weak";
        strengthLabel.className = "chip red xs";
      } else if (score === 3) {
        strengthFill.style.width = "50%";
        strengthFill.className = "password-strength-fill fair";
        strengthLabel.textContent = "Fair";
        strengthLabel.className = "chip gold xs";
      } else if (score === 4) {
        strengthFill.style.width = "75%";
        strengthFill.className = "password-strength-fill good";
        strengthLabel.textContent = "Good";
        strengthLabel.className = "chip blue xs";
      } else {
        strengthFill.style.width = "100%";
        strengthFill.className = "password-strength-fill strong";
        strengthLabel.textContent = "Strong";
        strengthLabel.className = "chip green xs";
      }
    }

    return hasLength && hasUpper && hasLower && hasNumber && hasSpecial && hasMatch;
  },

  submitPasswordReset(userId) {
    const isValid = this.checkResetPasswordRules();
    if (!isValid) {
      if (window.modals && window.modals.showToast) {
        window.modals.showToast("Password must meet all security rules and match", "error");
      }
      return;
    }

    const pwdInput = document.getElementById('resetNewPassword');
    const newPassword = pwdInput ? pwdInput.value : "";
    
    const updated = window.store.resetUserPassword(userId, newPassword);
    if (updated) {
      this.closePasswordReset();
      if (window.modals && window.modals.showToast) {
        window.modals.showToast(`Password for ${updated.name} reset successfully!`);
      }
      if (window.router.currentRoute === 'users') {
        window.router.navigate('users');
      }
    }
  },

  // ==========================================
  // QUICK ACTIVATE / DEACTIVATE TOGGLE
  // ==========================================
  toggleStatus(userId) {
    const updated = window.store.toggleUserStatus(userId);
    if (updated) {
      const isAct = updated.status === "Active";
      if (window.modals && window.modals.showToast) {
        window.modals.showToast(`User ${updated.name} is now ${isAct ? 'Active' : 'Deactivated / Suspended'}!`);
      }
      if (window.router.currentRoute === 'users') {
        window.router.navigate('users');
      }
    }
  },

  // ==========================================
  // SAVE & PROVISION NEW USER
  // ==========================================
  saveUser() {
    const firstInput = document.getElementById('newUserFirstName');
    const lastInput = document.getElementById('newUserLastName');
    const emailInput = document.getElementById('newUserEmail');
    const phoneInput = document.getElementById('newUserPhone');
    const addressInput = document.getElementById('newUserAddress');
    const stateSelect = document.getElementById('newUserState');
    const countrySelect = document.getElementById('newUserCountry');
    const dobInput = document.getElementById('newUserDob');
    const dojInput = document.getElementById('newUserDoj');
    const desigInput = document.getElementById('newUserDesignation');
    const deptSelect = document.getElementById('newUserDept');
    const statusSelect = document.getElementById('newUserStatus');
    const pwdInput = document.getElementById('newUserPassword');

    const firstName = firstInput ? firstInput.value.trim() : "";
    const lastName = lastInput ? lastInput.value.trim() : "";
    const fullName = `${firstName} ${lastName}`.trim();
    const email = emailInput ? emailInput.value.trim() : "";

    if (!firstName) {
      if (firstInput) firstInput.focus();
      if (window.modals && window.modals.showToast) {
        window.modals.showToast("Please enter the user's First Name", "error");
      }
      return;
    }

    if (!email || !email.includes('@')) {
      if (emailInput) emailInput.focus();
      if (window.modals && window.modals.showToast) {
        window.modals.showToast("Please enter a valid official Email Address", "error");
      }
      return;
    }

    // Check Password Rules Compliance
    const isPasswordValid = this.checkPasswordRules();
    if (!isPasswordValid) {
      if (pwdInput) pwdInput.focus();
      if (window.modals && window.modals.showToast) {
        window.modals.showToast("Password must meet all 6 security rules and match confirm password", "error");
      }
      return;
    }

    const roleCard = document.querySelector(`.role-select-card[data-role-id="${this.selectedRoleId}"]`);
    const roleName = (roleCard && roleCard.dataset.roleName) || "Outlet Admin";
    
    // Outlets multi-select array
    const assignedOutlets = (this.selectedOutlets && this.selectedOutlets.length > 0)
      ? this.selectedOutlets 
      : ["YOR Central (Kochi)"];
    
    const outletString = assignedOutlets.join(', ');
    const primaryScope = assignedOutlets.length > 1 
      ? `${assignedOutlets.length} Branches Assigned`
      : assignedOutlets[0].split('—')[0].split('(')[0].trim();

    const state = stateSelect ? stateSelect.value : "Karnataka";
    const country = countrySelect ? countrySelect.value : "India";
    const address = addressInput ? addressInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const photo = this.uploadedPhotoData || "";
    const dob = dobInput ? dobInput.value : "1992-06-15";
    const doj = dojInput ? dojInput.value : "2026-04-01";
    const dept = deptSelect ? deptSelect.value : "Branch Management";
    const status = statusSelect ? statusSelect.value : "Active";
    const designation = desigInput ? desigInput.value.trim() : roleName;
    const password = pwdInput ? pwdInput.value : "Yor@Pass2026!";

    const newUser = {
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: roleName,
      scope: primaryScope,
      outlet: outletString,
      outlets: assignedOutlets,
      state: state,
      country: country,
      address: address,
      photo: photo,
      dob: dob,
      doj: doj,
      dept: dept,
      designation: designation,
      phone: phone ? `+91 ${phone}` : "+91 98412 00000",
      status: status,
      password: password,
      lastLogin: "Never (Just Created)"
    };

    // Add to persistent state store
    window.store.addUser(newUser);

    if (window.modals && window.modals.showToast) {
      window.modals.showToast(`User ${fullName} successfully added with role ${roleName}!`);
    }

    // Close sliding drawer or redirect
    this.closeSlidingPage();

    // If we were on users page, re-render to show new user immediately
    if (window.router.currentRoute === 'users') {
      window.router.navigate('users');
    }
  }
};
