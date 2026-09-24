/* ==========================================================================
   YOR Estate - View Router & Page Navigator
   ========================================================================== */

class Router {
  constructor() {
    this.routes = {
      'dashboard': renderDashboardPage,
      'properties': renderPropertiesPage,
      'property-new': renderPropertyNewPage,
      'agents': renderAgentsPage,
      'legal': renderLegalPage,
      'commissions': renderCommissionsPage,
      'rentals': renderRentalsPage,
      'rental-new': renderRentalNewPage,
      'investments': renderInvestmentsPage,
      'sales': renderSalesPage,
      'lead-new': renderLeadNewPage,
      'finance': renderFinancePage,
      'reports': renderReportsPage,
      'outlets': renderOutletsPage,
      'outlet-new': renderOutletNewPage,
      'users': renderUsersPage,
      'user-new': renderUserNewPage,
      'investor': renderInvestorPage,
      'agent': renderAgentPage,
      'customer': renderCustomerPage,
      'settings': renderSettingsPage
    };

    this.currentRoute = 'dashboard';
    this.init();
  }

  init() {
    // Listen to hash changes (e.g. #properties, #sales, #property-new, #user-new)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.routes[hash]) {
        this.navigate(hash, false);
      }
    });
  }

  navigate(routeName, updateHash = true) {
    const fn = this.routes[routeName] || this.routes['dashboard'];
    this.currentRoute = routeName;

    if (updateHash) {
      window.location.hash = routeName;
    }

    const container = document.getElementById('pageContent');
    if (!container) return;

    // Render page content
    container.innerHTML = fn();

    // Update active state on top navigation tabs
    document.querySelectorAll('#navTabs button').forEach(btn => {
      const route = btn.dataset.route;
      const isMatch = route === routeName || 
                      (route === 'properties' && routeName === 'property-new') ||
                      (route === 'rentals' && routeName === 'rental-new') ||
                      (route === 'outlets' && routeName === 'outlet-new') ||
                      (route === 'users' && routeName === 'user-new');
      btn.classList.toggle('on', isMatch);
    });

    // Re-bind interactive in-page route links (e.g. data-route="legal")
    container.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(el.dataset.route);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Re-bind specific module interactions
    this.bindPageInteractions(routeName);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bindPageInteractions(routeName) {
    if (routeName === 'dashboard') {
      const fySelect = document.getElementById('salesFySelect') || document.getElementById('dashFySelect');
      if (fySelect) {
        fySelect.addEventListener('change', (e) => {
          const val = e.target.value;
          window.store.setFinancialYear(val);
          const fyData = window.store.data.fyData[val];
          if (fyData) {
            const dashTotalValue = document.getElementById('dashTotalValue');
            const dashTotalSold = document.getElementById('dashTotalSold');
            const dashMonthSold = document.getElementById('dashMonthSold');
            const dashMonthValue = document.getElementById('dashMonthValue');
            const dashRentals = document.getElementById('dashRentals');
            const chartContainer = document.getElementById('dashChartContainer');

            if (dashTotalValue) dashTotalValue.textContent = fyData.totalValue;
            if (dashTotalSold) dashTotalSold.textContent = fyData.totalSold;
            if (dashMonthSold) dashMonthSold.textContent = fyData.monthSold;
            if (dashMonthValue) dashMonthValue.textContent = fyData.monthValue || '₹12.8 Cr';
            if (dashRentals) dashRentals.textContent = fyData.rentals;
            if (chartContainer) chartContainer.innerHTML = window.charts.renderSalesChart(val);
          }
        });
      }

      // History Filter Pills in Updates Zone
      const filterPills = document.querySelectorAll('#dashHistoryFilterRow .history-filter');
      const feedItems = document.querySelectorAll('#dashHistoryFeed .history-feed-item');
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('on'));
          pill.classList.add('on');
          const filter = pill.dataset.filter;
          feedItems.forEach(item => {
            if (filter === 'all' || item.dataset.type === filter) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    if (routeName === 'user-new') {
      if (window.userWizard) {
        const store = window.store;
        const outlets = (store && store.data && store.data.outlets) || [];
        window.userWizard.initOutletsList(outlets);
        window.userWizard.setupPhotoDragDrop();
        window.userWizard.updatePreview();
        window.userWizard.checkPasswordRules();
      }
    }

    if (routeName === 'legal') {
      const stateSelect = document.getElementById('legalStateSelect');
      if (stateSelect) {
        stateSelect.addEventListener('change', (e) => {
          window.store.setLegalState(e.target.value);
        });
      }

      // Legal checklist step click handler
      document.querySelectorAll('#legalTimeline .step').forEach(stepEl => {
        stepEl.addEventListener('click', () => {
          const stateName = stepEl.dataset.state;
          const stepId = stepEl.dataset.stepId;
          window.store.toggleLegalStep(stateName, stepId);
        });
      });
    }

    if (routeName === 'properties') {
      const outletFilter = document.getElementById('propOutletFilter');
      if (outletFilter) {
        outletFilter.addEventListener('change', (e) => {
          const val = e.target.value;
          const rows = document.querySelectorAll('#propertyTableBody tr');
          rows.forEach(row => {
            if (val === 'all' || row.textContent.includes(val)) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          });
        });
      }
    }

    if (routeName === 'property-new') {
      // Bind live input synchronization
      const form = document.getElementById('propertyWizardForm');
      if (form) {
        form.addEventListener('input', () => {
          window.propertyWizard.syncLivePreview();
        });
        form.addEventListener('change', () => {
          window.propertyWizard.syncLivePreview();
        });
      }

      const btnSaveDraft = document.getElementById('btnSaveDraft');
      if (btnSaveDraft) {
        btnSaveDraft.addEventListener('click', () => {
          window.propertyWizard.saveDraft(false);
        });
      }

      const btnFillDemo = document.getElementById('btnFillDemoData');
      if (btnFillDemo) {
        btnFillDemo.addEventListener('click', () => {
          window.propertyWizard.fillDemoData();
        });
      }

      const btnClearDraft = document.getElementById('btnClearDraft');
      if (btnClearDraft) {
        btnClearDraft.addEventListener('click', () => {
          window.propertyWizard.clearDraft();
        });
      }

      // Publishing mode cards
      document.querySelectorAll('.publish-mode-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.publish-mode-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        });
      });
    }

    if (routeName === 'outlet-new') {
      const form = document.getElementById('outletWizardForm');
      if (form) {
        form.addEventListener('input', () => {
          window.outletWizard.syncLivePreview();
        });
        form.addEventListener('change', () => {
          window.outletWizard.syncLivePreview();
        });
      }

      const btnFillDemo = document.getElementById('btnFillDemoOutlet');
      if (btnFillDemo) {
        btnFillDemo.addEventListener('click', () => {
          window.outletWizard.fillDemoData();
        });
      }

      const btnSaveDraft = document.getElementById('btnSaveOutletDraft');
      if (btnSaveDraft) {
        btnSaveDraft.addEventListener('click', () => {
          window.outletWizard.saveDraft(true);
        });
      }

      const btnClearDraft = document.getElementById('btnClearOutletDraft');
      if (btnClearDraft) {
        btnClearDraft.addEventListener('click', () => {
          window.outletWizard.clearDraft();
        });
      }
    }

    if (routeName === 'settings') {
      // Any specific live input listeners can be bound here
    }
  }
}

// ---------- CUSTOM LUXURY SELECT CONTROLLER ----------
if (!window.customSelect) {
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
      
      const valDisplay = wrap.querySelector('.custom-select-value');
      if (valDisplay) valDisplay.textContent = label;
      
      wrap.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('selected'));
      itemEl.classList.add('selected');
      
      const hiddenInput = wrap.querySelector('input[type="hidden"]');
      if (hiddenInput) {
        hiddenInput.value = val;
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      wrap.classList.remove('open');
      
      if (window.propertyWizard && window.propertyWizard.syncLivePreview) {
        window.propertyWizard.syncLivePreview();
      }
      if (window.outletWizard && window.outletWizard.syncLivePreview) {
        window.outletWizard.syncLivePreview();
      }
    }
  };

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrap')) {
      document.querySelectorAll('.custom-select-wrap.open').forEach(w => w.classList.remove('open'));
    }
  });
}

// ---------- ROUTER INITIALIZATION ----------
window.router = new Router();

