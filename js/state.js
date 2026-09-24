/* ==========================================================================
   YOR Estate - State Management & LocalStorage Store
   ========================================================================== */

class StateStore {
  constructor() {
    this.STORAGE_KEY = "YOR_ESTATE_STORE_V2";
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.data = JSON.parse(saved);
        // Ensure stateWorkflows, properties, etc. are merged if new properties were added
        this.data = { ...INITIAL_DATA, ...this.data };
      } else {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.saveState();
      }
    } catch (e) {
      console.warn("Could not load from localStorage, initializing fresh data", e);
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    }

    // State Workflows normalization & sanitization (no undefined fields)
    if (!this.data.stateWorkflows || typeof this.data.stateWorkflows !== 'object') {
      this.data.stateWorkflows = JSON.parse(JSON.stringify(INITIAL_DATA.stateWorkflows || {}));
    }
    Object.keys(this.data.stateWorkflows).forEach(stateKey => {
      const wf = this.data.stateWorkflows[stateKey];
      const initialWf = (INITIAL_DATA.stateWorkflows && INITIAL_DATA.stateWorkflows[stateKey]) || {};
      if (wf) {
        wf.name = wf.name || wf.state || stateKey;
        wf.authority = wf.authority || initialWf.authority || "State Registration & Stamps Department";
        wf.portal = wf.portal || initialWf.portal || "State Land Records Portal";
        wf.portalUrl = wf.portalUrl || initialWf.portalUrl || "https://landrecords.gov.in";
        wf.searchYears = wf.searchYears || initialWf.searchYears || 30;
        wf.reraPrefix = wf.reraPrefix || initialWf.reraPrefix || `${stateKey} RERA`;
        wf.reraPortal = wf.reraPortal || initialWf.reraPortal || "https://rera.gov.in";
        wf.advocateOpinionRequired = typeof wf.advocateOpinionRequired === 'boolean' ? wf.advocateOpinionRequired : true;
        wf.digitalStampRequired = typeof wf.digitalStampRequired === 'boolean' ? wf.digitalStampRequired : true;
        wf.rules = wf.rules || initialWf.rules || "Standard 30-year parent title deed chain and statutory clearance verification.";

        // Normalize documents into requiredDocs
        if (!Array.isArray(wf.requiredDocs) || wf.requiredDocs.length === 0) {
          if (Array.isArray(wf.documents) && wf.documents.length > 0) {
            wf.requiredDocs = wf.documents.map((d, idx) => ({
              id: d.id || `${stateKey.toLowerCase().replace(/[^a-z0-9]/g, '_')}_doc_${idx + 1}`,
              name: d.name || "Statutory Document",
              category: d.category || "Title",
              mandatory: d.mandatory !== false && d.required !== false,
              validityYears: d.validityYears || 20
            }));
          } else if (initialWf.requiredDocs) {
            wf.requiredDocs = JSON.parse(JSON.stringify(initialWf.requiredDocs));
          } else {
            wf.requiredDocs = [
              { id: "title_deed", name: "30-Year Parent Title Deed Flow", category: "Title", mandatory: true, validityYears: 30 },
              { id: "ec_form", name: "Encumbrance Certificate (EC Form 15)", category: "Encumbrance", mandatory: true, validityYears: 30 },
              { id: "revenue_tax", name: "Revenue Tax & Ownership Extract", category: "Revenue", mandatory: true, validityYears: 1 }
            ];
          }
        }
      }
    });

    // General Web & Platform Settings normalization
    if (!this.data.generalSettings || typeof this.data.generalSettings !== 'object') {
      this.data.generalSettings = JSON.parse(JSON.stringify(INITIAL_DATA.generalSettings || {}));
    } else {
      this.data.generalSettings = { ...INITIAL_DATA.generalSettings, ...this.data.generalSettings };
    }

    // Lead data schema normalization & sanitization
    if (Array.isArray(this.data.leads)) {
      const defaultOutlets = ["YOR Central", "YOR South", "YOR North", "YOR East", "YOR West"];
      const defaultAgents = ["Sarah Coleman", "Arjun Mehta", "Rahul Nair", "Siti Rahman", "Riyas Ali", "May Lim"];
      this.data.leads.forEach((l, idx) => {
        if (!l.outlet || l.outlet === "undefined") {
          l.outlet = defaultOutlets[idx % defaultOutlets.length];
        }
        if (!l.priority || l.priority === "undefined") {
          l.priority = idx % 3 === 0 ? "High" : idx % 3 === 1 ? "Medium" : "Low";
        }
        if (!l.assigned || l.assigned === "undefined") {
          l.assigned = defaultAgents[idx % defaultAgents.length];
        }
        if (!l.property || l.property === "undefined") {
          l.property = "The Imperial Azure Sky Penthouse";
        }
        if (!l.rawBudget) {
          l.rawBudget = parseFloat(String(l.budget || '2.5').replace(/[^0-9.]/g, '')) || 2.5;
        }
        if (!l.budget || l.budget === "undefined") {
          l.budget = `₹ ${l.rawBudget} Cr`;
        }
        if (!l.nextTask || typeof l.nextTask !== 'object') {
          l.nextTask = {
            id: `T-${idx + 1}`,
            title: "Private walkthrough & layout presentation",
            due: "Tomorrow, 4:00 PM",
            type: "Site Visit",
            done: false
          };
        }
      });
      this.saveState();
    }

    // Rentals, Subleases, Inquiries & Rent Roll dataset normalization
    if (!Array.isArray(this.data.subleasePortfolios) || this.data.subleasePortfolios.length === 0) {
      this.data.subleasePortfolios = JSON.parse(JSON.stringify(INITIAL_DATA.subleasePortfolios || []));
    }
    if (!Array.isArray(this.data.rentalInquiries) || this.data.rentalInquiries.length === 0) {
      this.data.rentalInquiries = JSON.parse(JSON.stringify(INITIAL_DATA.rentalInquiries || []));
    }
    if (!Array.isArray(this.data.rentRoll) || this.data.rentRoll.length === 0) {
      this.data.rentRoll = JSON.parse(JSON.stringify(INITIAL_DATA.rentRoll || []));
    }
    if (Array.isArray(this.data.rentals)) {
      // Check if existing rentals have appPublished field
      this.data.rentals.forEach((r, idx) => {
        if (typeof r.appPublished === 'undefined') {
          r.appPublished = idx % 2 === 0;
        }
        if (!r.location) r.location = "Marine Drive, Kochi, Kerala";
        if (!r.category) r.category = r.type === 'Corporate' ? 'Commercial Suite' : 'Luxury Apartment';
        if (!r.bhk) r.bhk = "3 BHK (1,850 sq.ft)";
        if (!r.deposit) r.deposit = "₹2,50,000";
        if (!r.furnishing) r.furnishing = "Fully Furnished";
        if (!r.appViews) r.appViews = 240 + idx * 75;
        if (!r.appInquiries) r.appInquiries = 5 + idx * 3;
        if (!r.amenities) r.amenities = ["High-speed WiFi", "Covered Parking", "24/7 Security", "Power Backup"];
        if (!r.image) r.image = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
      });
    }
    // Properties Chain of Title & Ownership History normalization
    if (Array.isArray(this.data.properties)) {
      this.data.properties.forEach(p => {
        const initialProp = (INITIAL_DATA.properties && INITIAL_DATA.properties.find(ip => ip.id === p.id || ip.surveyNo === p.surveyNo)) || {};
        if (!p.firstOwnerInfo || typeof p.firstOwnerInfo !== 'object') {
          p.firstOwnerInfo = initialProp.firstOwnerInfo || {
            originalOwner: "Government / Ancestral Allottee",
            acquisitionYear: "1998",
            parentDeedNo: "PARENT/DEED/001/1998",
            sroOffice: "Sub-Registrar Office",
            extentArea: p.area || "Demarcated Extent",
            surveyDemarcation: `Survey No. ${p.surveyNo}`,
            khataType: "Statutory Revenue Extract",
            parentRemarks: "Original registered title deed and parent acquisition flow."
          };
        }
        if (!Array.isArray(p.ownershipChain) || p.ownershipChain.length === 0) {
          p.ownershipChain = JSON.parse(JSON.stringify(initialProp.ownershipChain || [
            {
              step: 1,
              date: "10 Jan 2005",
              year: "2005",
              type: "Parent Acquisition Deed",
              seller: "Original Landholder",
              buyer: "Developer / First Owner",
              price: "₹1.50 Cr",
              regDocNo: `DOC/${p.surveyNo}/2005`,
              sro: "Local SRO",
              platform: "Pre-Platform Acquisition",
              status: "Archived Parent Deed",
              notes: "Parent title deed registration with clean revenue demarcations."
            },
            {
              step: 2,
              date: p.submittedDate || "12 May 2026",
              year: "2026",
              type: "Current Listing on YOR Platform",
              seller: "Current Verified Owner",
              buyer: "Active Listing / Open for Acquisition",
              price: p.valuation || "₹10.0 Cr",
              regDocNo: `YOR-TITLE-${p.surveyNo}`,
              sro: "Local SRO",
              platform: "YOR Estate Verified Listing",
              status: "Active Current Title",
              notes: "Current market valuation with multi-state legal checklist clearance."
            }
          ]));
        }
      });
    }

    // Agents & Brokers Network dataset normalization (Multi-Outlet Support)
    if (!Array.isArray(this.data.agents) || this.data.agents.length === 0) {
      this.data.agents = JSON.parse(JSON.stringify(INITIAL_DATA.agents || []));
    } else {
      this.data.agents.forEach((ag, idx) => {
        if (!ag.id) ag.id = `AG-${101 + idx}`;
        if (!ag.tier) ag.tier = idx % 3 === 0 ? "Platinum" : idx % 2 === 0 ? "Gold" : "Silver";
        if (!ag.type) ag.type = "Channel Partner";
        if (!ag.status) ag.status = "Active";
        if (!ag.commissionRate) ag.commissionRate = "2.5%";
        
        const initAg = (INITIAL_DATA.agents && INITIAL_DATA.agents.find(ia => ia.id === ag.id || ia.name === ag.name)) || {};
        if (!Array.isArray(ag.outlets) || ag.outlets.length === 0) {
          ag.outlets = Array.isArray(initAg.outlets) ? initAg.outlets : (ag.outlet ? [ag.outlet] : ["All Outlets"]);
        }
        if (!ag.outlet || ag.outlet === "undefined") {
          ag.outlet = initAg.outlet || (ag.outlets.length > 1 ? `Multi-Hub (${ag.outlets.length} Hubs)` : (ag.outlets[0] || "All Outlets"));
        }

        if (!Array.isArray(ag.propertiesConnected)) ag.propertiesConnected = [];
        if (!Array.isArray(ag.recentPayouts)) ag.recentPayouts = [];
        if (!ag.bankDetails) ag.bankDetails = { bank: "HDFC Bank", acc: "•••• •••• 8821", ifsc: "HDFC0001234", upi: `${ag.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi` };
      });
    }

    this.saveState();
    this.currentRole = localStorage.getItem("YOR_CURRENT_ROLE") || "Super Admin";
    this.currentOutletScope = "All Outlets";
    this.currentFy = "2026-27";
    this.activeLegalState = "Karnataka";
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error("State listener error:", err);
      }
    });
  }

  // ---------- ROLE & SCOPE MUTATIONS ----------
  setRole(role) {
    this.currentRole = role;
    localStorage.setItem("YOR_CURRENT_ROLE", role);
    this.notify("ROLE_CHANGED", role);
  }

  setOutletScope(outlet) {
    this.currentOutletScope = outlet;
    this.notify("OUTLET_CHANGED", outlet);
  }

  setFinancialYear(fy) {
    this.currentFy = fy;
    this.notify("FY_CHANGED", fy);
  }

  setLegalState(state) {
    this.activeLegalState = state;
    this.notify("LEGAL_STATE_CHANGED", state);
  }

  // ---------- PROPERTY DRAFT & CRUD ----------
  savePropertyDraft(draftData) {
    try {
      localStorage.setItem("YOR_PROPERTY_DRAFT", JSON.stringify({
        ...draftData,
        savedAt: new Date().toISOString()
      }));
      this.notify("PROPERTY_DRAFT_SAVED", draftData);
      return true;
    } catch (e) {
      console.error("Failed to save property draft", e);
      return false;
    }
  }

  getPropertyDraft() {
    try {
      const saved = localStorage.getItem("YOR_PROPERTY_DRAFT");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  clearPropertyDraft() {
    try {
      localStorage.removeItem("YOR_PROPERTY_DRAFT");
      this.notify("PROPERTY_DRAFT_CLEARED", null);
      return true;
    } catch (e) {
      return false;
    }
  }

  addProperty(prop) {
    const newProp = {
      id: "PROP-" + String(this.data.properties.length + 1).padStart(3, "0"),
      name: prop.name || "Untitled Property",
      surveyNo: prop.surveyNo || "N/A",
      location: prop.location || "Bengaluru, KA",
      state: prop.state || "Karnataka",
      type: prop.type || "Residential",
      category: prop.category || "Luxury Residential Villa",
      area: prop.area || "2,500 sq.ft",
      carpetArea: prop.carpetArea || "2,100 sq.ft",
      superArea: prop.superArea || "2,850 sq.ft",
      plotArea: prop.plotArea || "1,240 sqm",
      beds: prop.beds || "4 Bed",
      baths: prop.baths || "4 Bath",
      outlet: prop.outlet || "YOR Central",
      agent: prop.agent || "Sarah Coleman",
      listingSource: prop.listingSource || "Direct · No broker",
      legalStatus: prop.legalStatus || "Verified",
      valuation: prop.valuation || "₹5.0 Cr",
      valuationHistory: [4.0, 4.3, 4.7, parseFloat(String(prop.valuation || '5').replace(/[^0-9.]/g, '')) || 5.0],
      preLoanApproved: prop.preLoanApproved || ["SBI", "HDFC Bank", "ICICI Bank"],
      expectedRental: prop.expectedRental || "₹2.2 L / mo",
      rentalYield: prop.rentalYield || "6.8%",
      amenities: prop.amenities || ["Infinity Pool", "Smart Home Automation", "Private Elevator", "24/7 Security"],
      images: 4,
      docsCount: 3,
      active: true,
      createdAt: new Date().toISOString()
    };
    this.data.properties.unshift(newProp);
    this.saveState();
    this.clearPropertyDraft();
    this.notify("PROPERTY_ADDED", newProp);
    return newProp;
  }

  // ---------- LEGAL WORKFLOW STEP TOGGLE ----------
  toggleLegalStep(stateName, stepId) {
    const steps = this.data.stateWorkflows[stateName];
    if (!steps) return;
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    if (step.status === "pending") step.status = "review";
    else if (step.status === "review") step.status = "done";
    else step.status = "pending";

    this.saveState();
    this.notify("LEGAL_STEP_UPDATED", { stateName, step });
  }

  // ---------- DOCUMENT UPLOAD ----------
  addDocument(doc) {
    const newDoc = {
      id: "DOC-" + String(this.data.documents.length + 101),
      surveyNo: doc.surveyNo || "123/2A",
      property: doc.property || "Green Valley Plot",
      name: doc.name || "Legal Clearance Certificate",
      version: doc.version || "v1.0",
      uploader: this.currentRole || "Outlet Admin",
      status: "Under review",
      date: "Today"
    };
    this.data.documents.unshift(newDoc);
    this.saveState();
    this.notify("DOCUMENT_ADDED", newDoc);
    return newDoc;
  }

  // ---------- SALES CRM LEADS & PIPELINE ----------
  saveLeadDraft(draftData) {
    try {
      localStorage.setItem("YOR_LEAD_DRAFT", JSON.stringify({
        ...draftData,
        savedAt: new Date().toISOString()
      }));
      this.notify("LEAD_DRAFT_SAVED", draftData);
      return true;
    } catch (e) {
      console.error("Failed to save lead draft", e);
      return false;
    }
  }

  getLeadDraft() {
    try {
      const saved = localStorage.getItem("YOR_LEAD_DRAFT");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  clearLeadDraft() {
    try {
      localStorage.removeItem("YOR_LEAD_DRAFT");
      this.notify("LEAD_DRAFT_CLEARED", null);
      return true;
    } catch (e) {
      return false;
    }
  }

  addLead(lead) {
    const rawB = parseFloat(String(lead.budget || '1.0').replace(/[^0-9.]/g, '')) || 1.0;
    const newLead = {
      id: "L-" + (this.data.leads.length + 1),
      name: lead.name || "New Inbound Inquiry",
      property: lead.property || "Forest Ridge Luxury Villa",
      outlet: lead.outlet || "YOR Central",
      stage: lead.stage || "New",
      budget: lead.budget ? (lead.budget.startsWith('₹') ? lead.budget : `₹ ${lead.budget} Cr`) : "₹ 1.5 Cr",
      rawBudget: rawB,
      phone: lead.phone || "+91 98400 00000",
      email: lead.email || (lead.name ? lead.name.toLowerCase().replace(/[^a-z]/g, '') + "@gmail.com" : "client@gmail.com"),
      assigned: lead.assigned || "Sarah Coleman",
      priority: lead.priority || "High",
      source: lead.source || "Website Direct",
      notes: lead.notes || "Lead registered via sales intake desk.",
      nextTask: lead.nextTask || {
        id: `T-${Date.now()}`,
        title: lead.taskTitle || "Introductory call and brochure sharing",
        due: lead.taskDue || "Tomorrow, 11:00 AM",
        type: lead.taskType || "Call",
        done: false
      },
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.leads.unshift(newLead);
    this.saveState();
    this.clearLeadDraft();
    this.notify("LEAD_ADDED", newLead);
    return newLead;
  }

  updateLeadStage(leadId, newStage) {
    const lead = this.data.leads.find(l => l.id === leadId);
    if (lead) {
      lead.stage = newStage;
      this.saveState();
      this.notify("LEAD_STAGE_UPDATED", lead);
    }
  }

  toggleLeadTask(leadId) {
    const lead = this.data.leads.find(l => l.id === leadId);
    if (lead && lead.nextTask) {
      lead.nextTask.done = !lead.nextTask.done;
      this.saveState();
      this.notify("LEAD_TASK_TOGGLED", lead);
    }
  }

  deleteLead(leadId) {
    this.data.leads = this.data.leads.filter(l => l.id !== leadId);
    this.saveState();
    this.notify("LEAD_DELETED", leadId);
  }

  // ---------- COMMISSION RULES & PAYOUTS ----------
  addCommissionRule(rule) {
    const newRule = {
      id: "CR-" + (this.data.commissionRules.length + 1),
      name: rule.name || "Custom Rule",
      target: rule.target || "All Properties",
      rule: rule.rule || "2.0% of net value",
      status: "Active"
    };
    this.data.commissionRules.unshift(newRule);
    this.saveState();
    this.notify("COMMISSION_RULE_ADDED", newRule);
    return newRule;
  }

  updatePayoutStatus(payoutId, status) {
    const payout = this.data.payouts.find(p => p.id === payoutId);
    if (payout) {
      payout.status = status;
      this.saveState();
      this.notify("PAYOUT_UPDATED", payout);
    }
  }

  // ---------- RENTALS & MOBILE PUBLISHING ----------
  addRental(rental) {
    const rawRent = parseFloat(String(rental.rent || '45000').replace(/[^0-9.]/g, '')) || 45000;
    const rawDeposit = parseFloat(String(rental.deposit || '200000').replace(/[^0-9.]/g, '')) || 200000;
    const newRental = {
      id: "RNT-" + (this.data.rentals.length + 101),
      property: rental.property || "The Lennox Tower 1402",
      outlet: rental.outlet || "YOR Central",
      location: rental.location || "Marine Drive, Kochi, Kerala",
      type: rental.type || "Individual",
      category: rental.category || "Luxury Apartment",
      tenant: rental.tenant || "Pending Tenant",
      tenantPhone: rental.tenantPhone || "+91 98400 00000",
      tenantEmail: rental.tenantEmail || "tenant@yorestate.com",
      landlord: rental.landlord || "Property Owner",
      rent: rental.rent && String(rental.rent).includes("₹") ? rental.rent : `₹${rawRent.toLocaleString('en-IN')}`,
      rawRent: rawRent,
      deposit: rental.deposit && String(rental.deposit).includes("₹") ? rental.deposit : `₹${rawDeposit.toLocaleString('en-IN')}`,
      rawDeposit: rawDeposit,
      maintenance: rental.maintenance || "₹4,000 / mo",
      furnishing: rental.furnishing || "Fully Furnished",
      bhk: rental.bhk || "3 BHK (1,800 sq.ft)",
      leaseStart: rental.leaseStart || "01 May 2026",
      leaseEnd: rental.leaseEnd || "30 Apr 2028",
      status: rental.status || "Active",
      appPublished: rental.appPublished !== false,
      appViews: 1,
      appInquiries: 0,
      amenities: rental.amenities || ["High-speed WiFi", "Covered Parking", "24/7 Security", "Power Backup"],
      image: rental.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      description: rental.description || "Premium property managed by YOR Estate."
    };
    this.data.rentals.unshift(newRental);
    this.saveState();
    this.notify("RENTAL_ADDED", newRental);
    return newRental;
  }

  updateRental(id, patch) {
    const r = this.data.rentals.find(x => x.id === id);
    if (r) {
      Object.assign(r, patch);
      this.saveState();
      this.notify("RENTAL_UPDATED", r);
    }
  }

  toggleAppPublish(id) {
    const r = this.data.rentals.find(x => x.id === id);
    if (r) {
      r.appPublished = !r.appPublished;
      this.saveState();
      this.notify("RENTAL_PUBLISH_TOGGLED", r);
      return r.appPublished;
    }
    return false;
  }

  deleteRental(id) {
    this.data.rentals = this.data.rentals.filter(x => x.id !== id);
    this.saveState();
    this.notify("RENTAL_DELETED", id);
  }

  // ---------- SUBLEASE & HOSTEL CO-LIVING ----------
  addSubleaseProperty(sublease) {
    const rawMasterRent = parseFloat(String(sublease.masterRent || '40000').replace(/[^0-9.]/g, '')) || 40000;
    const rawRevenue = parseFloat(String(sublease.subleaseRevenue || '70000').replace(/[^0-9.]/g, '')) || 70000;
    const rawUtil = parseFloat(String(sublease.utilityExpenseEst || '5000').replace(/[^0-9.]/g, '')) || 5000;
    const rawMargin = rawRevenue - rawMasterRent - rawUtil;

    const newSub = {
      id: "SUB-" + String(this.data.subleasePortfolios.length + 1).padStart(3, "0"),
      property: sublease.property || "The Lennox Tower - Flat 501",
      outlet: sublease.outlet || "YOR South",
      location: sublease.location || "Kozhikode, Kerala",
      type: "Hostel / Co-Living Sublease",
      landlord: sublease.landlord || "Landlord Owner",
      landlordPhone: sublease.landlordPhone || "+91 98409 00000",
      landlordEmail: sublease.landlordEmail || "owner@estate.com",
      masterRent: `₹${rawMasterRent.toLocaleString('en-IN')}`,
      rawMasterRent: rawMasterRent,
      masterDeposit: sublease.masterDeposit || "₹1,50,000",
      masterLeaseStart: sublease.masterLeaseStart || "01 May 2026",
      masterLeaseEnd: sublease.masterLeaseEnd || "30 Apr 2028",
      subleaseNocVerified: sublease.subleaseNocVerified !== false,
      nocDocRef: sublease.nocDocRef || `NOC-${Date.now().toString().slice(-6)}`,
      utilityExpenseEst: `₹${rawUtil.toLocaleString('en-IN')} / mo`,
      rawUtility: rawUtil,
      bhk: sublease.bhk || "3 BHK — 6 Beds",
      totalBeds: sublease.totalBeds || 6,
      occupiedBeds: sublease.occupiedBeds || 0,
      vacantBeds: (sublease.totalBeds || 6) - (sublease.occupiedBeds || 0),
      subleaseRevenue: `₹${rawRevenue.toLocaleString('en-IN')}`,
      rawSubleaseRevenue: rawRevenue,
      netMonthlyMargin: `₹${rawMargin.toLocaleString('en-IN')}`,
      rawMargin: rawMargin,
      marginRoi: `${Math.round((rawMargin / rawMasterRent) * 100)}%`,
      appPublished: sublease.appPublished !== false,
      targetAudience: sublease.targetAudience || "Working Professionals & Students",
      amenities: sublease.amenities || ["High-speed WiFi", "Daily Housekeeping", "RO Water", "Power Backup", "Biometric Access"],
      image: sublease.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      rooms: sublease.rooms || [
        {
          id: "R-NEW1",
          name: "Room 1 (Twin Sharing)",
          type: "Twin Sharing (2 Beds)",
          attachedBath: true,
          ac: true,
          beds: [
            { id: `BED-${Date.now()}-1`, bedNo: "Bed 1A", occupant: null, phone: null, rent: "₹12,000", rawRent: 12000, deposit: "₹24,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null },
            { id: `BED-${Date.now()}-2`, bedNo: "Bed 1B", occupant: null, phone: null, rent: "₹12,000", rawRent: 12000, deposit: "₹24,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null }
          ]
        }
      ]
    };
    this.data.subleasePortfolios.unshift(newSub);
    this.saveState();
    this.notify("SUBLEASE_ADDED", newSub);
    return newSub;
  }

  toggleSubleaseAppPublish(subleaseId) {
    const s = this.data.subleasePortfolios.find(x => x.id === subleaseId);
    if (s) {
      s.appPublished = !s.appPublished;
      this.saveState();
      this.notify("SUBLEASE_PUBLISH_TOGGLED", s);
      return s.appPublished;
    }
    return false;
  }

  updateSubleaseBed(subleaseId, bedId, occupantData) {
    const s = this.data.subleasePortfolios.find(x => x.id === subleaseId);
    if (!s) return false;

    let targetBed = null;
    s.rooms.forEach(room => {
      const b = room.beds.find(bed => bed.id === bedId);
      if (b) targetBed = b;
    });

    if (targetBed) {
      if (occupantData.action === "vacate") {
        targetBed.occupant = null;
        targetBed.phone = null;
        targetBed.status = "Vacant";
        targetBed.paymentStatus = null;
        targetBed.kycVerified = false;
        targetBed.checkIn = null;
        targetBed.checkOut = null;
      } else {
        targetBed.occupant = occupantData.occupant || targetBed.occupant;
        targetBed.phone = occupantData.phone || targetBed.phone;
        targetBed.status = "Occupied";
        targetBed.paymentStatus = occupantData.paymentStatus || "Paid";
        targetBed.kycVerified = occupantData.kycVerified !== false;
        targetBed.checkIn = occupantData.checkIn || "Today";
        targetBed.checkOut = occupantData.checkOut || "31 Dec 2026";
        if (occupantData.rent) targetBed.rent = occupantData.rent;
      }

      // Recalculate bed counts & revenue
      let totalB = 0;
      let occB = 0;
      let rev = 0;
      s.rooms.forEach(room => {
        room.beds.forEach(bed => {
          totalB++;
          if (bed.status === "Occupied") {
            occB++;
            rev += (bed.rawRent || parseFloat(String(bed.rent || '0').replace(/[^0-9.]/g, '')) || 0);
          }
        });
      });
      s.totalBeds = totalB;
      s.occupiedBeds = occB;
      s.vacantBeds = totalB - occB;
      s.rawSubleaseRevenue = rev;
      s.subleaseRevenue = `₹${rev.toLocaleString('en-IN')}`;
      s.rawMargin = rev - (s.rawMasterRent || 40000) - (s.rawUtility || 5000);
      s.netMonthlyMargin = `₹${s.rawMargin.toLocaleString('en-IN')}`;
      s.marginRoi = `${Math.round((s.rawMargin / (s.rawMasterRent || 40000)) * 100)}%`;

      this.saveState();
      this.notify("BED_UPDATED", { sublease: s, bed: targetBed });
      return true;
    }
    return false;
  }

  // ---------- MOBILE APP INQUIRIES ----------
  addRentalInquiry(inquiry) {
    const newInq = {
      id: "INQ-" + (this.data.rentalInquiries.length + 201),
      customerName: inquiry.customerName || "Mobile User",
      phone: inquiry.phone || "+91 98400 00000",
      email: inquiry.email || "user@mobileapp.com",
      requestedProperty: inquiry.requestedProperty || "Riverside Tower 1203",
      requestedUnitType: inquiry.requestedUnitType || "Whole 3 BHK Apartment",
      budget: inquiry.budget || "₹50,000 / mo",
      moveInDate: inquiry.moveInDate || "Immediate",
      source: inquiry.source || "iOS Mobile App",
      status: "New",
      message: inquiry.message || "Inquiry submitted from YOR Mobile App.",
      assignedAgent: inquiry.assignedAgent || "Sarah Coleman",
      createdAt: "Just now"
    };
    this.data.rentalInquiries.unshift(newInq);
    this.saveState();
    this.notify("INQUIRY_ADDED", newInq);
    return newInq;
  }

  updateInquiryStatus(id, newStatus, extraData = {}) {
    const inq = this.data.rentalInquiries.find(x => x.id === id);
    if (inq) {
      inq.status = newStatus;
      if (extraData.tourTime) inq.tourTime = extraData.tourTime;
      if (extraData.assignedAgent) inq.assignedAgent = extraData.assignedAgent;
      this.saveState();
      this.notify("INQUIRY_STATUS_UPDATED", inq);
      return inq;
    }
    return null;
  }

  // ---------- RENT ROLL & PAYMENTS ----------
  recordRentPayment(paymentData) {
    const rawPaid = parseFloat(String(paymentData.paidAmount || '0').replace(/[^0-9.]/g, '')) || 0;
    const newRecord = {
      id: "RR-" + (this.data.rentRoll.length + 501),
      tenantName: paymentData.tenantName || "Tenant",
      property: paymentData.property || "Rental Property",
      unitOrBed: paymentData.unitOrBed || "Unit 1",
      type: paymentData.type || "Rental Payment",
      dueAmount: paymentData.dueAmount || `₹${rawPaid.toLocaleString('en-IN')}`,
      rawDue: rawPaid,
      dueDate: paymentData.dueDate || "05 May 2026",
      paidAmount: `₹${rawPaid.toLocaleString('en-IN')}`,
      rawPaid: rawPaid,
      paymentDate: paymentData.paymentDate || "Today",
      paymentMode: paymentData.paymentMode || "UPI / PhonePe",
      receiptNo: `RCPT-${Date.now().toString().slice(-6)}`,
      status: "Paid"
    };
    this.data.rentRoll.unshift(newRecord);
    this.saveState();
    this.notify("RENT_PAYMENT_RECORDED", newRecord);
    return newRecord;
  }

  // ---------- INVESTMENTS ----------
  addInvestment(inv) {
    const newInv = {
      id: "INV-" + String(this.data.investments.length + 1).padStart(3, "0"),
      property: inv.property || "Palm Vista Commercial",
      type: inv.type || "Commercial",
      invested: inv.invested || "₹2.00 Cr",
      investorCount: inv.investorCount || 4,
      projectedRoi: inv.projectedRoi || "12.5%",
      lockPeriod: inv.lockPeriod || "24 months",
      lockRemaining: inv.lockPeriod || "24 months",
      status: "Active",
      coInvestors: [
        { name: "Lead Investor (You)", share: 40 },
        { name: "Co-Investor 1", share: 30 },
        { name: "Co-Investor 2", share: 30 }
      ]
    };
    this.data.investments.unshift(newInv);
    this.saveState();
    this.notify("INVESTMENT_ADDED", newInv);
    return newInv;
  }

  // ---------- OUTLET DRAFT & CRUD ----------
  saveOutletDraft(draftData) {
    try {
      localStorage.setItem("YOR_OUTLET_DRAFT", JSON.stringify({
        ...draftData,
        savedAt: new Date().toISOString()
      }));
      this.notify("OUTLET_DRAFT_SAVED", draftData);
      return true;
    } catch (e) {
      console.error("Failed to save outlet draft", e);
      return false;
    }
  }

  getOutletDraft() {
    try {
      const saved = localStorage.getItem("YOR_OUTLET_DRAFT");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  clearOutletDraft() {
    try {
      localStorage.removeItem("YOR_OUTLET_DRAFT");
      this.notify("OUTLET_DRAFT_CLEARED", null);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------- OUTLETS ----------
  addOutlet(outlet, managers = []) {
    const outletId = outlet.code || ("OUT-" + (this.data.outlets.length + 1));
    const primaryAdmin = managers.length > 0 ? managers[0].name : (outlet.admin || "New Branch Director");
    
    const newOutlet = {
      id: outletId,
      name: outlet.name || "YOR Bengaluru Central",
      location: outlet.location || `${outlet.district || 'Bengaluru'}, ${outlet.state || 'Karnataka'}, ${outlet.country || 'India'}`,
      country: outlet.country || "India",
      currency: outlet.currency || "INR (₹) - Indian Rupee",
      image: outlet.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
      email: outlet.email || "branch@yorestate.com",
      phone: outlet.phone || "+91 80 4912 8800",
      targetPeriod: outlet.targetPeriod || "Q1 2026 (Apr - Jun)",
      targetNotes: outlet.targetNotes || "",
      targetHistory: outlet.targetHistory || [
        { id: `TGT-${Date.now()}`, period: outlet.targetPeriod || "Q1 2026", salesTarget: outlet.salesTarget || "₹ 25.0 Cr", rentalTarget: outlet.rentalTarget || "₹ 40.0 L", setAt: new Date().toISOString().split('T')[0], setBy: "Super Admin", remarks: "Initial benchmark" }
      ],
      state: outlet.state || "Karnataka",
      district: outlet.district || "Bengaluru Urban",
      address: outlet.address || "100ft Road, Indiranagar",
      tier: outlet.tier || "Tier 1 Flagship Experience Centre",
      admin: primaryAdmin,
      users: Math.max(managers.length, outlet.users || 6),
      properties: outlet.properties || 0,
      salesTarget: outlet.salesTarget || "₹ 25.0 Cr / mo",
      rentalTarget: outlet.rentalTarget || "₹ 40.0 L / mo",
      bankAccount: outlet.bankAccount || "HDFC Bank · Operating A/C",
      gstin: outlet.gstin || "29AABCU9603R1ZM",
      status: outlet.status || "Active",
      managers: managers
    };

    // Auto-provision user records in central user directory
    if (Array.isArray(managers) && managers.length > 0) {
      managers.forEach(mgr => {
        const cleanName = mgr.name || "Branch Staff";
        const emailSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.');
        const userRole = mgr.role || mgr.designation || "Sales Executive";
        const newUser = {
          id: mgr.empId || ("U-" + (this.data.users.length + 1)),
          name: cleanName,
          email: mgr.email || `${emailSlug}@yorestate.com`,
          role: userRole,
          scope: `${newOutlet.name} (${userRole})`,
          phone: mgr.phone || "+91 98450 00000",
          lastLogin: "Never (Just Provisioned)",
          status: "Active"
        };
        // Avoid duplicate user emails
        if (!this.data.users.find(u => u.email === newUser.email)) {
          this.data.users.unshift(newUser);
        }
      });
    }

    this.data.outlets.unshift(newOutlet);
    this.clearOutletDraft();
    this.saveState();
    this.notify("OUTLET_ADDED", newOutlet);
    return newOutlet;
  }

  // ---------- USERS ----------
  addUser(user) {
    const newUser = {
      id: "U-" + (this.data.users.length + 1),
      name: user.name || "New Team Member",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "user@yorestate.com",
      phone: user.phone || "+91 98412 00000",
      role: user.role || "Sales Team",
      scope: user.scope || "Assigned branch",
      outlet: user.outlet || "YOR Central",
      address: user.address || "",
      state: user.state || "Karnataka",
      country: user.country || "India",
      photo: user.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      dob: user.dob || "1992-06-15",
      doj: user.doj || "2026-04-01",
      dept: user.dept || "Branch Management",
      designation: user.designation || user.role || "Executive",
      lastLogin: user.lastLogin || "Never (Just Created)",
      status: user.status || "Active",
      password: user.password || "YOR@Pass2026!",
      requirePasswordChange: false
    };
    this.data.users.unshift(newUser);
    this.saveState();
    this.notify("USER_ADDED", newUser);
    return newUser;
  }

  toggleUserStatus(userId) {
    const user = this.data.users.find(u => u.id === userId || u.email === userId);
    if (user) {
      user.status = (user.status === "Active") ? "Suspended / Inactive" : "Active";
      this.saveState();
      this.notify("USER_STATUS_TOGGLED", user);
      return user;
    }
    return null;
  }

  resetUserPassword(userId, newPassword) {
    const user = this.data.users.find(u => u.id === userId || u.email === userId);
    if (user) {
      user.password = newPassword;
      user.requirePasswordChange = false;
      user.passwordResetAt = new Date().toISOString();
      this.saveState();
      this.notify("USER_PASSWORD_RESET", user);
      return user;
    }
    return null;
  }

  // ---------- FINANCE TRANSACTIONS ----------
  addTransaction(tx) {
    const newTx = {
      id: "TX-" + (this.data.financeLedger.length + 901),
      date: "Today",
      desc: tx.desc || "Operational Entry",
      outlet: tx.outlet || "YOR Central",
      type: tx.type || "Income",
      amount: tx.amount || "₹1.50 L",
      rawAmount: tx.type === "Expense" ? -150000 : 150000,
      status: "Received"
    };
    this.data.financeLedger.unshift(newTx);
    this.saveState();
    this.notify("TRANSACTION_ADDED", newTx);
    return newTx;
  }

  // ---------- LEGAL VERIFICATION ENGINE & STATE WORKFLOWS ----------
  selectLegalProperty(propId) {
    this.activeLegalPropId = propId;
    this.notify("LEGAL_PROPERTY_SELECTED", propId);
  }

  ensurePropertyLegalChecklist(prop) {
    if (!prop) return;
    if (!prop.state) prop.state = "Karnataka";
    const wf = this.data.stateWorkflows[prop.state] || this.data.stateWorkflows["Karnataka"];
    if (!wf) return;

    if (!Array.isArray(prop.legalChecklist) || prop.legalChecklist.length === 0) {
      prop.legalChecklist = (wf.requiredDocs || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        category: doc.category || "Title",
        authority: doc.authority || wf.authority,
        portal: doc.portal || wf.portal,
        mandatory: doc.mandatory !== false,
        validityYears: doc.validityYears || wf.searchYears || 20,
        status: "Pending", // Pending, Verified, Rejected, Resubmit
        verifiedBy: null,
        verifiedDate: null,
        remarks: null,
        docRef: `DOC-${Math.floor(1000 + Math.random() * 9000)}`
      }));
    }

    if (!prop.stages) {
      prop.stages = {
        intake: { title: "Document upload & intake", role: "Outlet Admin", status: "Completed", date: "24 Apr 2026", verifiedBy: "Outlet Admin", remarks: "All intake scans submitted" },
        survey: { title: "Survey number cross-check", role: "Outlet Admin", status: prop.legalStatus === 'Approved' ? "Completed" : "In-Review", date: "26 Apr 2026", verifiedBy: "Outlet Admin", remarks: "Survey coordinates matched with revenue sketch" },
        encumbrance: { title: "Encumbrance verification", role: "Outlet Admin", status: prop.legalStatus === 'Approved' ? "Completed" : "Pending", date: null, verifiedBy: null, remarks: "" },
        ho_signoff: { title: "HO sign-off", role: "HO Admin", status: prop.legalStatus === 'Approved' ? "Completed" : "Pending", date: null, verifiedBy: null, remarks: "" },
        final_reg: { title: "Final registration entry", role: "HO Admin", status: prop.legalStatus === 'Approved' ? "Completed" : "Pending", date: null, verifiedBy: null, remarks: "" }
      };
    }
  }

  verifyPropertyDocument(propId, docId, officerName, remarks) {
    const prop = this.data.properties.find(p => p.id === propId);
    if (!prop) return false;
    this.ensurePropertyLegalChecklist(prop);

    const doc = prop.legalChecklist.find(d => d.id === docId);
    if (doc) {
      doc.status = "Verified";
      doc.verifiedBy = officerName || this.currentRole || "Legal Team";
      doc.verifiedDate = new Date().toLocaleDateString('en-GB');
      doc.remarks = remarks || "Verified against Sub-Registrar online record";
      
      // Check if all mandatory docs are verified
      const allMandatoryDone = prop.legalChecklist.filter(d => d.mandatory).every(d => d.status === "Verified");
      if (allMandatoryDone && prop.legalStatus !== "Approved") {
        prop.legalStage = "HO sign-off";
        if (prop.stages && prop.stages.encumbrance) {
          prop.stages.encumbrance.status = "Completed";
          prop.stages.encumbrance.verifiedBy = officerName || "Outlet Admin";
          prop.stages.encumbrance.date = new Date().toLocaleDateString('en-GB');
        }
      }

      this.saveState();
      this.notify("PROPERTY_LEGAL_DOC_VERIFIED", { prop, doc });
      return true;
    }
    return false;
  }

  rejectPropertyDocument(propId, docId, officerName, reason) {
    const prop = this.data.properties.find(p => p.id === propId);
    if (!prop) return false;
    this.ensurePropertyLegalChecklist(prop);

    const doc = prop.legalChecklist.find(d => d.id === docId);
    if (doc) {
      doc.status = "Rejected";
      doc.rejectedBy = officerName || this.currentRole || "Legal Team";
      doc.rejectedDate = new Date().toLocaleDateString('en-GB');
      doc.remarks = reason || "Incomplete or discrepancy observed in document stream";
      
      prop.legalStatus = "Resubmit";
      prop.legalRemarks = `Document rejected (${doc.name}): ${reason}`;

      this.saveState();
      this.notify("PROPERTY_LEGAL_DOC_REJECTED", { prop, doc });
      return true;
    }
    return false;
  }

  updatePropertyLegalStage(propId, stageKey, status, officerName, remarks) {
    const prop = this.data.properties.find(p => p.id === propId);
    if (!prop) return false;
    this.ensurePropertyLegalChecklist(prop);

    if (prop.stages && prop.stages[stageKey]) {
      prop.stages[stageKey].status = status;
      prop.stages[stageKey].verifiedBy = officerName || this.currentRole || "Admin";
      prop.stages[stageKey].date = new Date().toLocaleDateString('en-GB');
      if (remarks) prop.stages[stageKey].remarks = remarks;

      // Update current overall legalStage
      const stageKeys = ['intake', 'survey', 'encumbrance', 'ho_signoff', 'final_reg'];
      const curIdx = stageKeys.indexOf(stageKey);
      if (status === 'Completed' && curIdx < stageKeys.length - 1) {
        const nextKey = stageKeys[curIdx + 1];
        prop.legalStage = prop.stages[nextKey].title;
      }

      this.saveState();
      this.notify("PROPERTY_LEGAL_STAGE_UPDATED", { prop, stageKey, status });
      return true;
    }
    return false;
  }

  approvePropertyLegal(propId, officerName, notes) {
    const prop = this.data.properties.find(p => p.id === propId);
    if (!prop) return false;
    this.ensurePropertyLegalChecklist(prop);

    prop.legalStatus = "Approved";
    prop.legalStage = "Final registration entry";
    prop.legalApprovedBy = officerName || this.currentRole || "Chief Legal Officer";
    prop.legalApprovedDate = new Date().toLocaleDateString('en-GB');
    prop.legalRemarks = notes || "All statutory clearances & 20/30-yr title deeds verified. Full clear title.";

    if (prop.legalChecklist) {
      prop.legalChecklist.forEach(d => {
        if (d.status !== "Rejected") {
          d.status = "Verified";
          d.verifiedBy = d.verifiedBy || officerName || "Legal Team";
          d.verifiedDate = d.verifiedDate || new Date().toLocaleDateString('en-GB');
        }
      });
    }

    if (prop.stages) {
      Object.keys(prop.stages).forEach(k => {
        prop.stages[k].status = "Completed";
        prop.stages[k].date = prop.stages[k].date || new Date().toLocaleDateString('en-GB');
        prop.stages[k].verifiedBy = prop.stages[k].verifiedBy || officerName || "Admin";
      });
    }

    this.saveState();
    this.notify("PROPERTY_LEGAL_APPROVED", prop);
    return true;
  }

  rejectPropertyLegal(propId, officerName, reason) {
    const prop = this.data.properties.find(p => p.id === propId);
    if (!prop) return false;
    this.ensurePropertyLegalChecklist(prop);

    prop.legalStatus = "Rejected";
    prop.legalStage = "Resubmit";
    prop.rejectedBy = officerName || this.currentRole || "Legal Team";
    prop.rejectedDate = new Date().toLocaleDateString('en-GB');
    prop.legalRemarks = reason || "Title verification rejected. Outstanding encumbrance or survey conflict.";

    this.saveState();
    this.notify("PROPERTY_LEGAL_REJECTED", prop);
    return true;
  }

  // ---------- WEB SETTINGS & STATE WORKFLOW ENGINES ----------
  getGeneralSettings() {
    return this.data.generalSettings || INITIAL_DATA.generalSettings;
  }

  saveGeneralSettings(settings) {
    this.data.generalSettings = {
      ...(this.data.generalSettings || INITIAL_DATA.generalSettings),
      ...settings
    };
    this.saveState();
    this.notify("GENERAL_SETTINGS_UPDATED", this.data.generalSettings);
    return this.data.generalSettings;
  }

  getStateWorkflows() {
    return this.data.stateWorkflows || {};
  }

  getStateLegalWorkflow(stateName) {
    if (!stateName || !this.data.stateWorkflows) return null;
    return this.data.stateWorkflows[stateName] || null;
  }

  saveStateLegalWorkflow(stateName, wfData) {
    if (!stateName) return null;
    if (!this.data.stateWorkflows) this.data.stateWorkflows = {};

    const existing = this.data.stateWorkflows[stateName] || {};
    this.data.stateWorkflows[stateName] = {
      name: stateName,
      authority: wfData.authority || existing.authority || "State Registration & Stamps Department",
      portal: wfData.portal || existing.portal || "State Land Records Portal",
      portalUrl: wfData.portalUrl || existing.portalUrl || "https://landrecords.gov.in",
      searchYears: parseInt(wfData.searchYears, 10) || existing.searchYears || 30,
      reraPrefix: wfData.reraPrefix || existing.reraPrefix || `${stateName} RERA`,
      reraPortal: wfData.reraPortal || existing.reraPortal || "https://rera.gov.in",
      advocateOpinionRequired: wfData.advocateOpinionRequired !== undefined ? !!wfData.advocateOpinionRequired : true,
      digitalStampRequired: wfData.digitalStampRequired !== undefined ? !!wfData.digitalStampRequired : true,
      rules: wfData.rules || existing.rules || "Standard 30-year parent title deed chain and statutory clearance verification.",
      requiredDocs: Array.isArray(wfData.requiredDocs) ? wfData.requiredDocs : (existing.requiredDocs || [])
    };

    this.saveState();
    this.notify("STATE_WORKFLOW_SAVED", { stateName, workflow: this.data.stateWorkflows[stateName] });
    return this.data.stateWorkflows[stateName];
  }

  deleteStateLegalWorkflow(stateName) {
    if (!this.data.stateWorkflows || !this.data.stateWorkflows[stateName]) return false;
    delete this.data.stateWorkflows[stateName];
    this.saveState();
    this.notify("STATE_WORKFLOW_DELETED", { stateName });
    return true;
  }

  duplicateStateLegalWorkflow(sourceState, targetState) {
    if (!sourceState || !targetState || !this.data.stateWorkflows || !this.data.stateWorkflows[sourceState]) {
      return false;
    }
    const source = JSON.parse(JSON.stringify(this.data.stateWorkflows[sourceState]));
    source.name = targetState;
    // Generate new unique document IDs
    if (Array.isArray(source.requiredDocs)) {
      const prefix = targetState.toLowerCase().replace(/[^a-z0-9]/g, '_');
      source.requiredDocs = source.requiredDocs.map((doc, idx) => ({
        ...doc,
        id: `${prefix}_doc_${idx + 1}`
      }));
    }
    this.data.stateWorkflows[targetState] = source;
    this.saveState();
    this.notify("STATE_WORKFLOW_SAVED", { stateName: targetState, workflow: this.data.stateWorkflows[targetState] });
    return true;
  }

  resetSettingsToDefault() {
    this.data.generalSettings = JSON.parse(JSON.stringify(INITIAL_DATA.generalSettings));
    this.data.stateWorkflows = JSON.parse(JSON.stringify(INITIAL_DATA.stateWorkflows));
    this.saveState();
    this.notify("SETTINGS_RESET_TO_DEFAULT", {
      generalSettings: this.data.generalSettings,
      stateWorkflows: this.data.stateWorkflows
    });
    return true;
  }

  exportConfigJson() {
    const exportPayload = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      exportedBy: this.currentRole || "Super Admin",
      generalSettings: this.data.generalSettings || INITIAL_DATA.generalSettings,
      stateWorkflows: this.data.stateWorkflows || INITIAL_DATA.stateWorkflows
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `YOR_Settings_Workflow_Config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  }

  importConfigJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.generalSettings && typeof parsed.generalSettings === 'object') {
        this.data.generalSettings = { ...INITIAL_DATA.generalSettings, ...parsed.generalSettings };
      }
      if (parsed.stateWorkflows && typeof parsed.stateWorkflows === 'object') {
        this.data.stateWorkflows = parsed.stateWorkflows;
      }
      this.saveState();
      this.notify("CONFIG_IMPORTED", {
        generalSettings: this.data.generalSettings,
        stateWorkflows: this.data.stateWorkflows
      });
      return { success: true };
    } catch (err) {
      console.error("Failed to import configuration JSON:", err);
      return { success: false, error: err.message };
    }
  }

  // ---------- AGENTS & BROKERS NETWORK METHODS ----------
  saveAgentDraft(draftData) {
    try {
      localStorage.setItem("YOR_AGENT_DRAFT", JSON.stringify(draftData));
      return true;
    } catch (e) {
      console.warn("Could not save agent draft", e);
      return false;
    }
  }

  getAgentDraft() {
    try {
      const saved = localStorage.getItem("YOR_AGENT_DRAFT");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  clearAgentDraft() {
    localStorage.removeItem("YOR_AGENT_DRAFT");
  }

  addAgent(agentData) {
    if (!Array.isArray(this.data.agents)) {
      this.data.agents = [];
    }

    const nextIndex = this.data.agents.length + 1;
    const assignedOutlets = Array.isArray(agentData.outlets) && agentData.outlets.length > 0 
      ? agentData.outlets 
      : (agentData.outlet ? [agentData.outlet] : ["All Outlets"]);

    const outletLabel = assignedOutlets.includes("All Outlets")
      ? "Pan-India (All Outlets)"
      : assignedOutlets.length > 1
        ? `Multi-Hub (${assignedOutlets.length} Hubs)`
        : (assignedOutlets[0] || "All Outlets");

    const newAgent = {
      id: agentData.id || `AG-${100 + nextIndex}`,
      name: agentData.name || "New Partner",
      agency: agentData.agency || "Independent Brokerage",
      type: agentData.type || "Channel Partner",
      tier: agentData.tier || "Gold",
      reraNo: agentData.reraNo || `RERA/AG/${Math.floor(1000 + Math.random() * 9000)}/2026`,
      outlets: assignedOutlets,
      outlet: agentData.outlet && !agentData.outlets ? agentData.outlet : outletLabel,
      city: agentData.city || "Bengaluru",
      state: agentData.state || "Karnataka",
      phone: agentData.phone || "+91 98450 00000",
      email: agentData.email || "partner@yorestate.com",
      photo: agentData.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: agentData.status || "Active",
      specialization: agentData.specialization || "Luxury Residential & Commercial",
      commissionRate: agentData.commissionRate || "2.5%",
      propertiesConnected: agentData.propertiesConnected || [],
      activeLeads: parseInt(agentData.activeLeads) || 0,
      dealsClosed: parseInt(agentData.dealsClosed) || 0,
      totalSalesVolume: agentData.totalSalesVolume || "₹0.0 Cr",
      rawSalesVolume: agentData.rawSalesVolume || 0,
      totalCommissionEarned: agentData.totalCommissionEarned || "₹0.00",
      rawCommissionEarned: agentData.rawCommissionEarned || 0,
      commissionPaid: agentData.commissionPaid || "₹0.00",
      rawCommissionPaid: agentData.rawCommissionPaid || 0,
      commissionPending: agentData.commissionPending || "₹0.00",
      rawCommissionPending: agentData.rawCommissionPending || 0,
      rating: parseFloat(agentData.rating) || 4.8,
      joinedDate: agentData.joinedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      bankDetails: agentData.bankDetails || {
        bank: agentData.bankName || "HDFC Bank",
        acc: agentData.accountNo || "•••• •••• 9988",
        ifsc: agentData.ifsc || "HDFC0001234",
        upi: agentData.upi || `${(agentData.name || 'agent').toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`
      },
      recentPayouts: []
    };

    this.data.agents.unshift(newAgent);
    this.saveState();
    this.clearAgentDraft();
    this.notify("AGENT_ADDED", newAgent);
    return newAgent;
  }

  updateAgent(agentId, patchData) {
    if (!Array.isArray(this.data.agents)) return null;
    const index = this.data.agents.findIndex(a => a.id === agentId);
    if (index === -1) return null;

    this.data.agents[index] = {
      ...this.data.agents[index],
      ...patchData
    };

    this.saveState();
    this.notify("AGENT_UPDATED", this.data.agents[index]);
    return this.data.agents[index];
  }

  toggleAgentStatus(agentId) {
    if (!Array.isArray(this.data.agents)) return null;
    const agent = this.data.agents.find(a => a.id === agentId);
    if (!agent) return null;

    agent.status = agent.status === "Active" ? "Suspended" : "Active";
    this.saveState();
    this.notify("AGENT_STATUS_TOGGLED", agent);
    return agent;
  }

  deleteAgent(agentId) {
    if (!Array.isArray(this.data.agents)) return false;
    const idx = this.data.agents.findIndex(a => a.id === agentId);
    if (idx === -1) return false;

    const removed = this.data.agents.splice(idx, 1)[0];
    this.saveState();
    this.notify("AGENT_DELETED", removed);
    return true;
  }

  assignPropertyToAgent(agentId, propertyObj) {
    if (!Array.isArray(this.data.agents)) return false;
    const agent = this.data.agents.find(a => a.id === agentId);
    if (!agent) return false;

    if (!Array.isArray(agent.propertiesConnected)) {
      agent.propertiesConnected = [];
    }

    const propId = propertyObj.id || propertyObj.surveyNo;
    const alreadyConnected = agent.propertiesConnected.some(p => p.id === propId || p.surveyNo === propertyObj.surveyNo);
    if (alreadyConnected) {
      return { success: false, message: "Property already assigned to this agent." };
    }

    agent.propertiesConnected.push({
      id: propertyObj.id || `PROP-${Math.floor(100 + Math.random() * 900)}`,
      name: propertyObj.name,
      surveyNo: propertyObj.surveyNo,
      valuation: propertyObj.valuation || "₹10.0 Cr",
      location: propertyObj.location || "Bengaluru",
      state: propertyObj.state || "Karnataka",
      type: propertyObj.type || "Residential"
    });

    this.saveState();
    this.notify("AGENT_PROPERTY_ASSIGNED", { agent, property: propertyObj });
    return { success: true, agent };
  }

  unassignPropertyFromAgent(agentId, propertyIdOrSurveyNo) {
    if (!Array.isArray(this.data.agents)) return false;
    const agent = this.data.agents.find(a => a.id === agentId);
    if (!agent || !Array.isArray(agent.propertiesConnected)) return false;

    const idx = agent.propertiesConnected.findIndex(p => p.id === propertyIdOrSurveyNo || p.surveyNo === propertyIdOrSurveyNo);
    if (idx === -1) return false;

    const removed = agent.propertiesConnected.splice(idx, 1)[0];
    this.saveState();
    this.notify("AGENT_PROPERTY_UNASSIGNED", { agent, property: removed });
    return { success: true, removed };
  }

  recordAgentPayout(agentId, amountStr, propertyName, paymentMethod = "Bank Transfer (NEFT)", notes = "") {
    if (!Array.isArray(this.data.agents)) return false;
    const agent = this.data.agents.find(a => a.id === agentId);
    if (!agent) return false;

    const rawAmt = parseFloat(String(amountStr).replace(/[^0-9.]/g, '')) * 100000 || 100000;
    const displayAmt = amountStr.startsWith('₹') ? amountStr : `₹${amountStr}`;

    const payoutRecord = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      agent: agent.name,
      agentId: agent.id,
      property: propertyName || "Connected Property",
      amount: displayAmt,
      rawAmount: rawAmt,
      method: paymentMethod,
      notes: notes || "Commission release processed by Finance",
      status: "Paid",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Add to global payouts
    if (Array.isArray(this.data.payouts)) {
      this.data.payouts.unshift(payoutRecord);
    }

    // Add to agent's ledger
    if (!Array.isArray(agent.recentPayouts)) {
      agent.recentPayouts = [];
    }
    agent.recentPayouts.unshift(payoutRecord);

    // Update paid and pending totals
    agent.rawCommissionPaid = (agent.rawCommissionPaid || 0) + rawAmt;
    agent.commissionPaid = `₹${(agent.rawCommissionPaid / 100000).toFixed(2)} L`;
    if (agent.rawCommissionPending && agent.rawCommissionPending >= rawAmt) {
      agent.rawCommissionPending -= rawAmt;
      agent.commissionPending = `₹${(agent.rawCommissionPending / 100000).toFixed(2)} L`;
    }

    this.saveState();
    this.notify("AGENT_PAYOUT_RECORDED", { agent, payout: payoutRecord });
    return payoutRecord;
  }

  // ---------- SURVEY NUMBER TITLE CHAIN & RESALE FLOW METHODS ----------
  searchPropertyBySurveyNo(queryStr) {
    if (!queryStr || !Array.isArray(this.data.properties)) return [];
    const q = queryStr.trim().toLowerCase();

    return this.data.properties.filter(p => {
      const matchSurvey = p.surveyNo && p.surveyNo.toLowerCase().includes(q);
      const matchName = p.name && p.name.toLowerCase().includes(q);
      const matchLoc = p.location && p.location.toLowerCase().includes(q);
      const matchId = p.id && p.id.toLowerCase().includes(q);
      const matchFirstOwner = p.firstOwnerInfo && p.firstOwnerInfo.originalOwner && p.firstOwnerInfo.originalOwner.toLowerCase().includes(q);
      const matchChain = Array.isArray(p.ownershipChain) && p.ownershipChain.some(step => 
        (step.buyer && step.buyer.toLowerCase().includes(q)) ||
        (step.seller && step.seller.toLowerCase().includes(q)) ||
        (step.regDocNo && step.regDocNo.toLowerCase().includes(q))
      );

      return matchSurvey || matchName || matchLoc || matchId || matchFirstOwner || matchChain;
    });
  }

  recordPropertyResale(propertyIdOrSurvey, resaleData) {
    if (!Array.isArray(this.data.properties)) return null;
    const prop = this.data.properties.find(p => p.id === propertyIdOrSurvey || p.surveyNo === propertyIdOrSurvey);
    if (!prop) return null;

    if (!Array.isArray(prop.ownershipChain)) {
      prop.ownershipChain = [];
    }

    const nextStepNum = prop.ownershipChain.length + 1;
    const newStep = {
      step: nextStepNum,
      date: resaleData.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      year: resaleData.year || new Date().getFullYear().toString(),
      type: resaleData.type || `Resale #${nextStepNum - 1} via YOR Estate`,
      seller: resaleData.seller || "Previous Registered Owner",
      buyer: resaleData.buyer || "New Transferee / Acquirer",
      price: resaleData.price || prop.valuation,
      rawPrice: parseFloat(String(resaleData.price || prop.rawValuation).replace(/[^0-9.]/g, '')) * 10000000 || prop.rawValuation,
      regDocNo: resaleData.regDocNo || `SRO/${prop.surveyNo.replace(/[^a-zA-Z0-9]/g, '')}/${Math.floor(1000 + Math.random() * 9000)}/${new Date().getFullYear()}`,
      sro: resaleData.sro || `${prop.location} Sub-Registrar Office`,
      platform: "YOR Secondary Marketplace / Resale Hub",
      agent: resaleData.agent || "Sarah Lim (Apex Luxury Realtors)",
      status: "Active Current Title",
      notes: resaleData.notes || "Resold through YOR Estate platform. Encumbrance Certificate & Khata updated."
    };

    // Mark previous steps as Completed
    prop.ownershipChain.forEach(s => {
      if (s.status === "Active Current Title") {
        s.status = "Completed & Transferred";
      }
    });

    prop.ownershipChain.push(newStep);

    // Update current valuation if specified
    if (resaleData.price) {
      prop.valuation = resaleData.price;
      const rawVal = parseFloat(String(resaleData.price).replace(/[^0-9.]/g, ''));
      if (rawVal && Array.isArray(prop.valuationHistory)) {
        prop.valuationHistory.push(rawVal);
      }
    }

    this.saveState();
    this.notify("PROPERTY_RESALE_RECORDED", { property: prop, step: newStep });
    return { property: prop, step: newStep };
  }
}

// Global Single Instance
window.store = new StateStore();

