/* ==========================================================================
   YOR Estate - Main Application Bootstrap
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loginView = document.getElementById('loginView');
  const appView = document.getElementById('appView');
  const loginBtn = document.getElementById('loginBtn');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  const userRoleText = document.getElementById('userRoleText');
  const userAvatar = document.getElementById('userAvatar');

  // ---------- AUTH & VIEW TOGGLE ----------
  function showApp() {
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    
    // Update user display
    updateUserDisplay();

    // Check hash or default to dashboard
    const initialHash = window.location.hash.replace('#', '') || 'dashboard';
    window.router.navigate(initialHash, false);
  }

  function showLogin() {
    appView.classList.add('hidden');
    loginView.classList.remove('hidden');
    window.auth.logout();
    window.scrollTo(0, 0);
  }

  function updateUserDisplay() {
    const roleInfo = window.auth.getCurrentRoleInfo();
    if (userRoleText) userRoleText.textContent = roleInfo.label;
    if (userAvatar) userAvatar.textContent = roleInfo.initials;
    if (userDropdown) userDropdown.innerHTML = window.auth.renderRoleDropdown();
    bindDropdownEvents();
  }

  // Bind Login
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.querySelector('#loginForm input[type="email"], #loginEmailInput');
      const email = emailInput ? emailInput.value : "admin@yorestate.com";
      window.auth.login(email);
      showApp();
    });
  }

  // Bind Nav Tabs
  document.querySelectorAll('#navTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      window.router.navigate(btn.dataset.route);
    });
  });

  // Bind Brand Logo in App Header
  const logoLink = document.querySelector('.top a.logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.router.navigate('dashboard');
    });
  }

  // ---------- ROLE DROPDOWN INTERACTIONS ----------
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userDropdown.classList.remove('open');
      }
    });
  }

  function bindDropdownEvents() {
    if (!userDropdown) return;
    
    // Role selection
    userDropdown.querySelectorAll('.role-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedRole = btn.dataset.role;
        window.store.setRole(selectedRole);
        userDropdown.classList.remove('open');
        updateUserDisplay();
        window.modals.showToast(`Switched view to "${selectedRole}"`);
        // If switching to investor or agent, navigate to respective portal
        if (selectedRole.includes('Investor')) {
          window.router.navigate('investor');
        } else if (selectedRole.includes('Agent')) {
          window.router.navigate('agent');
        } else {
          window.router.navigate(window.router.currentRoute);
        }
      });
    });

    // Dropdown Logout
    const ddLogout = document.getElementById('dropdownLogoutBtn');
    if (ddLogout) {
      ddLogout.addEventListener('click', () => {
        userDropdown.classList.remove('open');
        showLogin();
      });
    }
  }

  // ---------- GLOBAL UNIVERSAL SEARCH CONTROLLER ----------
  function initGlobalSearch() {
    const searchWrap = document.getElementById('topSearchWrap');
    const searchInput = document.getElementById('globalNavSearchInput');
    const searchDropdown = document.getElementById('globalNavSearchDropdown');
    const clearBtn = document.getElementById('globalNavSearchClearBtn');

    if (!searchInput || !searchDropdown) return;

    function renderGlobalSearchResults(query) {
      const q = (query || "").trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.remove('open');
        searchDropdown.innerHTML = '';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
      }

      if (clearBtn) clearBtn.style.display = 'inline-block';

      const store = window.store;
      const properties = (store && store.data && store.data.properties) || [];
      const agents = (store && store.data && store.data.agents) || [];
      const leads = (store && store.data && store.data.leads) || [];

      // Clean query for survey matching
      const cleanQ = q.replace(/^(sy\.?|survey\s*no\.?|survey)\s*/i, '').trim();
      const strippedQ = cleanQ.replace(/[^a-z0-9]/g, '');

      // 1. Matching Properties & Survey Numbers
      const matchedProps = properties.filter(p => {
        const sNo = (p.surveyNo || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pLoc = (p.location || '').toLowerCase();
        const pOwner = (p.firstOwnerInfo?.originalOwner || '').toLowerCase();
        const pDeed = (p.firstOwnerInfo?.parentDeedNo || '').toLowerCase();
        const inChain = Array.isArray(p.ownershipChain) && p.ownershipChain.some(c => 
          (c.buyer || '').toLowerCase().includes(q) || 
          (c.seller || '').toLowerCase().includes(q)
        );

        return sNo.includes(cleanQ) || 
          (strippedQ && sNo.replace(/[^a-z0-9]/g, '').includes(strippedQ)) ||
          pName.includes(q) || 
          pLoc.includes(q) || 
          pOwner.includes(q) || 
          pDeed.includes(q) || 
          inChain;
      }).slice(0, 5);

      // 2. Matching Agents / Brokers
      const matchedAgents = agents.filter(a => {
        const aName = (a.name || '').toLowerCase();
        const aAgency = (a.agency || '').toLowerCase();
        const aPhone = (a.phone || '').toLowerCase();
        const aOutlets = Array.isArray(a.outlets) ? a.outlets.join(' ').toLowerCase() : (a.outlet || '').toLowerCase();
        return aName.includes(q) || aAgency.includes(q) || aPhone.includes(q) || aOutlets.includes(q);
      }).slice(0, 3);

      // 3. Matching Leads
      const matchedLeads = leads.filter(l => {
        const lName = (l.name || '').toLowerCase();
        const lProp = (l.propertyInterest || '').toLowerCase();
        const lAgent = (l.agent || '').toLowerCase();
        return lName.includes(q) || lProp.includes(q) || lAgent.includes(q);
      }).slice(0, 3);

      const hasResults = matchedProps.length > 0 || matchedAgents.length > 0 || matchedLeads.length > 0;

      if (!hasResults) {
        searchDropdown.innerHTML = `
          <div style="padding:20px; text-align:center; color:var(--ink-3);">
            <div style="font-weight:600; font-size:13px; color:var(--ink); margin-bottom:4px;">No direct matches found</div>
            <div style="font-size:11.5px; margin-bottom:12px;">Press Enter to search universal title deed archives for <code>"${query}"</code></div>
            <button class="btn sm gold" style="width:100%; justify-content:center;" onclick="window.modals.openQuickSearch('${query}'); document.getElementById('globalNavSearchDropdown').classList.remove('open');">
              🔍 Open Survey & Title Search
            </button>
          </div>
        `;
        searchDropdown.classList.add('open');
        return;
      }

      let html = '';

      // Survey & Property Matches
      if (matchedProps.length > 0) {
        html += `
          <div class="top-search-group-title">
            <span>Properties & Survey Deeds (${matchedProps.length})</span>
            <span style="font-size:9px; opacity:0.8;">Click to open Dossier</span>
          </div>
        `;
        matchedProps.forEach(p => {
          html += `
            <div class="top-search-item" onclick="window.modals.openQuickSearch('${p.surveyNo}'); document.getElementById('globalNavSearchDropdown').classList.remove('open');">
              <div class="top-search-item-left">
                <span class="chip gold font-mono xs" style="font-weight:700;">Sy. ${p.surveyNo}</span>
                <div>
                  <div class="top-search-item-title">${p.name}</div>
                  <div class="top-search-item-sub">📍 ${p.location} · 👤 1st Owner: <b>${p.firstOwnerInfo?.originalOwner || 'Ancestral'}</b> · ${p.valuation}</div>
                </div>
              </div>
              <span class="chip ${p.legalStatus === 'Approved' ? 'green' : 'gray'} xs">${p.legalStatus || 'Verified'}</span>
            </div>
          `;
        });
      }

      // Broker Matches
      if (matchedAgents.length > 0) {
        html += `
          <div class="top-search-group-title">
            <span>Brokers & Channel Partners (${matchedAgents.length})</span>
            <span style="font-size:9px; opacity:0.8;">Click to view Profile</span>
          </div>
        `;
        matchedAgents.forEach(a => {
          const outletsLabel = Array.isArray(a.outlets) && a.outlets.length > 0 ? a.outlets.join(', ') : (a.outlet || 'All Outlets');
          html += `
            <div class="top-search-item" onclick="window.router.navigate('agents'); setTimeout(() => window.agentsController && window.agentsController.openAgentDrawer('${a.id}'), 100); document.getElementById('globalNavSearchDropdown').classList.remove('open');">
              <div class="top-search-item-left">
                <img src="${a.photo}" style="width:26px; height:26px; border-radius:50%; object-fit:cover;">
                <div>
                  <div class="top-search-item-title">${a.name} <span class="muted font-normal" style="font-size:11px;">(${a.agency})</span></div>
                  <div class="top-search-item-sub">🏢 ${outletsLabel} · 📞 ${a.phone}</div>
                </div>
              </div>
              <span class="chip gold xs">${a.tier || 'Gold'}</span>
            </div>
          `;
        });
      }

      // Sales Leads Matches
      if (matchedLeads.length > 0) {
        html += `
          <div class="top-search-group-title">
            <span>CRM Sales Inquiries (${matchedLeads.length})</span>
          </div>
        `;
        matchedLeads.forEach(l => {
          html += `
            <div class="top-search-item" onclick="window.router.navigate('sales'); document.getElementById('globalNavSearchDropdown').classList.remove('open');">
              <div class="top-search-item-left">
                <span class="chip blue xs">Lead</span>
                <div>
                  <div class="top-search-item-title">${l.name} <span class="muted font-normal" style="font-size:11px;">(Budget: ${l.budget})</span></div>
                  <div class="top-search-item-sub">Interested in: ${l.propertyInterest} · Stage: <b>${l.stage}</b></div>
                </div>
              </div>
              <span class="chip gray xs">${l.outlet || 'Central'}</span>
            </div>
          `;
        });
      }

      // Search Footer
      html += `
        <div class="top-search-footer">
          <span>Press <kbd style="background:#E2E8F0; padding:1px 5px; border-radius:3px; font-family:monospace; font-weight:700;">Enter ↵</kbd> for full Title Dossier</span>
          <button style="border:none; background:none; color:var(--accent); font-weight:600; cursor:pointer; font-size:11px;" onclick="window.modals.openQuickSearch('${query}'); document.getElementById('globalNavSearchDropdown').classList.remove('open');">
            Open Advanced Dossier →
          </button>
        </div>
      `;

      searchDropdown.innerHTML = html;
      searchDropdown.classList.add('open');
    }

    searchInput.addEventListener('input', (e) => {
      renderGlobalSearchResults(e.target.value);
    });

    searchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim().length > 0) {
        renderGlobalSearchResults(e.target.value);
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = searchInput.value.trim();
        searchDropdown.classList.remove('open');
        window.modals.openQuickSearch(val);
      } else if (e.key === 'Escape') {
        searchDropdown.classList.remove('open');
        searchInput.blur();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.value = '';
        renderGlobalSearchResults('');
        searchInput.focus();
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (searchWrap && !searchWrap.contains(e.target)) {
        searchDropdown.classList.remove('open');
      }
    });
  }

  // ---------- REACTIVE STATE STORE SUBSCRIPTION ----------
  window.store.subscribe((event, payload) => {
    console.log(`[Store Event]: ${event}`, payload);

    // Re-render the current view to reflect state mutations
    window.router.navigate(window.router.currentRoute, false);
  });

  // Global Keydown Listeners (Escape for drawers, Cmd+K / Ctrl+K for Survey Search)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (window.outletWizard && document.getElementById('outletSlidingDrawerOverlay')?.classList.contains('open')) {
        window.outletWizard.closeSlidingPage();
      }
      if (window.userWizard && document.getElementById('userSlidingDrawerOverlay')?.classList.contains('open')) {
        window.userWizard.closeSlidingPage();
      }
    }

    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (window.modals && typeof window.modals.openQuickSearch === 'function') {
        window.modals.openQuickSearch();
      }
    }
  });

  // Initial State Check
  initGlobalSearch();
  if (window.auth.isAuthenticated) {
    showApp();
  } else {
    showLogin();
  }
});
