/* ==========================================================================
   YOR Estate - Authentication & Role Scoping
   ========================================================================== */

const ROLES = [
  { id: "superadmin", label: "Super Admin", initials: "SA", level: "Global", desc: "Full platform oversight & configuration" },
  { id: "manager", label: "Manager", initials: "MG", level: "Executive", desc: "Operations, team creation & legal workflows" },
  { id: "legal", label: "Legal Team", initials: "LT", level: "Legal", desc: "State-driven property verification & approvals" },
  { id: "finance", label: "Finance Team", initials: "FT", level: "Finance", desc: "Verification intake reviews & ledger audits" },
  { id: "hoadmin", label: "Head Office Admin", initials: "HO", level: "HO", desc: "Central operations & final sign-offs" },
  { id: "outletadmin", label: "Outlet Admin (YOR South)", initials: "OA", level: "Outlet", desc: "Assigned branch only" },
  { id: "sales", label: "Sales Team", initials: "ST", level: "Scoped", desc: "Properties & leads scope" },
  { id: "investor", label: "Investor (Tan Wei Ming)", initials: "TW", level: "External", desc: "Strictly own investments" },
  { id: "agent", label: "Agent / Broker (Sarah Lim)", initials: "SL", level: "External", desc: "Assigned listings & leads" }
];

class AuthController {
  constructor() {
    this.isAuthenticated = localStorage.getItem("YOR_LOGGED_IN") === "true";
  }

  login(email, password) {
    this.isAuthenticated = true;
    localStorage.setItem("YOR_LOGGED_IN", "true");
    
    // Default role based on email or Super Admin
    if (email && email.toLowerCase().includes("legal")) {
      window.store.setRole("Legal Team");
      if (window.router) window.router.navigate("legal");
    } else if (email && email.toLowerCase().includes("finance")) {
      window.store.setRole("Finance Team");
      if (window.router) window.router.navigate("finance");
    } else if (email && email.toLowerCase().includes("manager")) {
      window.store.setRole("Manager");
      if (window.router) window.router.navigate("dashboard");
    } else if (email && email.toLowerCase().includes("investor")) {
      window.store.setRole("Investor (Tan Wei Ming)");
      if (window.router) window.router.navigate("investor");
    } else if (email && email.toLowerCase().includes("agent")) {
      window.store.setRole("Agent / Broker (Sarah Lim)");
      if (window.router) window.router.navigate("agent");
    } else {
      window.store.setRole("Super Admin");
      if (window.router) window.router.navigate("dashboard");
    }
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem("YOR_LOGGED_IN");
  }

  get currentUser() {
    const role = (window.store && window.store.currentRole) || "Super Admin";
    let defaultName = "Alexander Vance";
    if (role === "Legal Team") defaultName = "Adv. Priya Nair (Chief Legal Officer)";
    else if (role === "Finance Team") defaultName = "Arjun Mehta (Finance Director)";
    else if (role === "Manager") defaultName = "Marcus Vance (Operations Director)";
    else if (role.includes("Investor")) defaultName = "Tan Wei Ming";
    else if (role.includes("Agent")) defaultName = "Sarah Lim";
    else if (role.includes("Outlet")) defaultName = "Riyas Ali";
    else if (role.includes("Head Office")) defaultName = "Devika Menon";

    return {
      name: defaultName,
      role: role
    };
  }

  getCurrentRoleInfo() {
    const current = window.store.currentRole;
    return ROLES.find(r => r.label === current) || ROLES[0];
  }

  renderRoleDropdown() {
    const current = this.getCurrentRoleInfo();
    return `
      <div class="dropdown-header">
        <span>Active User Role</span>
        <b>${current.label}</b>
      </div>
      ${ROLES.map(r => `
        <button class="role-option ${r.label === current.label ? 'active' : ''}" data-role="${r.label}">
          <div>
            <div>${r.label}</div>
            <small class="muted">${r.desc}</small>
          </div>
          <span class="chip ${r.level === 'Global' ? 'dark' : r.level === 'Executive' ? 'gold' : r.level === 'Legal' ? 'gold' : r.level === 'Finance' ? 'blue' : r.level === 'HO' ? 'blue' : r.level === 'Outlet' ? 'gold' : 'gray'} xs">${r.level}</span>
        </button>
      `).join('')}
      <div class="dropdown-divider"></div>
      <button class="dropdown-action" id="dropdownLogoutBtn">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    `;
  }
}

window.auth = new AuthController();
