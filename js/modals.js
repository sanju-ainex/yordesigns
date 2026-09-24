/* ==========================================================================
   YOR Estate - Interactive Modals & Toast Notification System
   ========================================================================== */

class ModalController {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Inject modal backdrop container
    if (!document.getElementById('modalBackdrop')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'modalBackdrop';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `<div class="modal-box" id="modalBox"></div>`;
      document.body.appendChild(backdrop);
      
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    // Inject toast container
    if (!document.getElementById('toastContainer')) {
      const tc = document.createElement('div');
      tc.id = 'toastContainer';
      tc.className = 'toast-container';
      document.body.appendChild(tc);
    }
  }

  showToast(message, type = 'success') {
    this.init();
    const tc = document.getElementById('toastContainer');
    if (!tc) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${message}</span>
    `;
    tc.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  open(html, isWide = false) {
    this.init();
    const backdrop = document.getElementById('modalBackdrop');
    const box = document.getElementById('modalBox');
    if (!backdrop || !box) return;

    box.className = `modal-box ${isWide ? 'wide' : ''}`;
    box.innerHTML = html;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Bind close button
    const closeBtn = box.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    const cancelBtn = box.querySelector('.modal-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
  }

  close() {
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ---------- MODAL TEMPLATES ----------
  openAddProperty() {
    this.open(`
      <div class="modal-header">
        <h3>+ Add New Property Record</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="addPropertyForm">
        <div class="field">
          <label>Property Name <span class="req">*</span></label>
          <div class="input-wrap"><input name="name" required placeholder="e.g. Royal Palms Luxury Villa"></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Survey Number (Unique ID) <span class="req">*</span></label>
            <div class="input-wrap"><input name="surveyNo" required placeholder="e.g. 144/3B"></div>
          </div>
          <div class="field">
            <label>Property Type</label>
            <div class="select-wrap">
              <select name="type">
                <option value="Residential">Residential</option>
                <option value="Land">Land / Plot</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed use">Mixed Use</option>
              </select>
            </div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Location & State <span class="req">*</span></label>
            <div class="input-wrap"><input name="location" required placeholder="e.g. Whitefield, Bengaluru, KA"></div>
          </div>
          <div class="field">
            <label>State Workflow</label>
            <div class="select-wrap">
              <select name="state">
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Assigned Outlet</label>
            <div class="select-wrap">
              <select name="outlet">
                <option value="YOR Central">YOR Central (Kochi)</option>
                <option value="YOR South">YOR South (Kozhikode)</option>
                <option value="YOR North">YOR North (Kannur)</option>
                <option value="YOR East">YOR East (Kottayam)</option>
                <option value="YOR West">YOR West (Idukki)</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Market Valuation <span class="req">*</span></label>
            <div class="input-wrap"><input name="valuation" required placeholder="e.g. ₹15.8 Cr"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark">+ Save Property</button>
        </div>
      </form>
    `);

    document.getElementById('addPropertyForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const prop = Object.fromEntries(fd.entries());
      window.store.addProperty(prop);
      this.close();
      this.showToast(`Property "${prop.name}" (Survey No: ${prop.surveyNo}) added successfully!`);
    });
  }

  openAddLead() {
    if (window.leadWizard && window.leadWizard.openSlidingPage) {
      window.leadWizard.openSlidingPage();
      return;
    }
  }

  openUploadDocument() {
    this.open(`
      <div class="modal-header">
        <h3>+ Upload Legal Document</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="uploadDocForm">
        <div class="field">
          <label>Select Property & Survey Number <span class="req">*</span></label>
          <div class="select-wrap">
            <select name="property">
              ${window.store.data.properties.map(p => `<option value="${p.name}">${p.name} (Survey No. ${p.surveyNo})</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:12px">
          <div class="field">
            <label>Document Title <span class="req">*</span></label>
            <div class="input-wrap"><input name="name" required placeholder="e.g. Encumbrance Certificate Form 15"></div>
          </div>
          <div class="field">
            <label>Document Version</label>
            <div class="input-wrap"><input name="version" value="v1.0"></div>
          </div>
        </div>
        <div class="field">
          <label>Attach File (PDF, scanned deed, JPG) <span class="req">*</span></label>
          <div class="soft" style="border:2px dashed var(--line); text-align:center; padding:24px; cursor:pointer">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="var(--ink-2)" fill="none" stroke-width="1.8" style="margin:0 auto 8px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <b>Click or drag document to upload</b>
            <div class="small muted" style="margin-top:4px">Linked securely to Survey Number & S3 storage</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark">+ Submit for Review</button>
        </div>
      </form>
    `);

    document.getElementById('uploadDocForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const doc = Object.fromEntries(fd.entries());
      window.store.addDocument(doc);
      this.close();
      this.showToast(`Document "${doc.name}" submitted to Legal Review queue!`);
    });
  }

  openAddInvestment() {
    this.open(`
      <div class="modal-header">
        <h3>+ Create Group Investment Record</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="addInvForm">
        <div class="field">
          <label>Target Property <span class="req">*</span></label>
          <div class="input-wrap"><input name="property" required placeholder="e.g. Palm Bay Commercial Suites"></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Total Investment Value <span class="req">*</span></label>
            <div class="input-wrap"><input name="invested" required placeholder="e.g. ₹3.50 Cr"></div>
          </div>
          <div class="field">
            <label>Projected ROI (%)</label>
            <div class="input-wrap"><input name="projectedRoi" value="12.5%"></div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Resale-Lock Period</label>
            <div class="select-wrap">
              <select name="lockPeriod">
                <option value="12 months">12 months</option>
                <option value="24 months" selected>24 months</option>
                <option value="36 months">36 months</option>
                <option value="48 months">48 months</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Co-Investors Count (typically 4-5)</label>
            <div class="input-wrap"><input name="investorCount" type="number" value="4"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark">+ Create Investment</button>
        </div>
      </form>
    `);

    document.getElementById('addInvForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const inv = Object.fromEntries(fd.entries());
      window.store.addInvestment(inv);
      this.close();
      this.showToast(`Investment record for "${inv.property}" created successfully!`);
    });
  }

  // ---------- RENTALS & SUBLEASE MODALS ----------
  openAddRental() {
    this.openPublishRentalModal();
  }

  openPublishRentalModal() {
    const outlets = (window.store && window.store.data && window.store.data.outlets) || [];
    this.open(`
      <div class="modal-header">
        <div>
          <h3>+ Add Rental Property</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Configure property specifications, rental price, and upload property photos</p>
        </div>
        <button class="modal-close">✕</button>
      </div>
      <form id="publishRentalForm">
        <div class="field">
          <label>Property Name & Unit <span class="req">*</span></label>
          <div class="input-wrap"><input name="property" required placeholder="e.g. Marina Luxury Tower 1402" value="Emerald Cove Sky Penthouse"></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Outlet / Branch <span class="req">*</span></label>
            <div class="select-wrap">
              <select name="outlet" required>
                ${outlets.map(o => `<option value="${o.name}">${o.name} (${o.location})</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="field">
            <label>Category</label>
            <div class="select-wrap">
              <select name="category">
                <option value="Luxury Apartment">Luxury Apartment</option>
                <option value="Sky Penthouse">Sky Penthouse</option>
                <option value="Garden Villa">Garden Villa</option>
                <option value="Commercial Suite">Commercial Suite</option>
                <option value="Corporate Office">Corporate Office Floor</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label>Location & Micro-Market <span class="req">*</span></label>
          <div class="input-wrap"><input name="location" required placeholder="e.g. Marine Drive, Kochi, Kerala" value="Marine Drive, Kochi"></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px">
          <div class="field">
            <label>Monthly Rent (₹) <span class="req">*</span></label>
            <div class="input-wrap"><input name="rent" required placeholder="e.g. ₹65,000" value="₹70,000"></div>
          </div>
          <div class="field">
            <label>Security Deposit (₹)</label>
            <div class="input-wrap"><input name="deposit" placeholder="e.g. ₹2,50,000" value="₹2,80,000"></div>
          </div>
          <div class="field">
            <label>Furnishing Status</label>
            <div class="select-wrap">
              <select name="furnishing">
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Configuration / Area</label>
            <div class="input-wrap"><input name="bhk" placeholder="e.g. 3 BHK (1,950 sq.ft)" value="3 BHK (2,050 sq.ft)"></div>
          </div>
          <div class="field">
            <label>Current Tenant (or 'Vacant')</label>
            <div class="input-wrap"><input name="tenant" placeholder="e.g. Vacant" value="Vacant (Available for Lease)"></div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Tenant Phone / Contact</label>
            <div class="input-wrap"><input name="tenantPhone" placeholder="+91 98401 22334" value="+91 98401 00000"></div>
          </div>
          <div class="field">
            <label>Lease Expiry Date</label>
            <div class="input-wrap"><input name="leaseEnd" placeholder="e.g. 31 Dec 2027" value="31 Dec 2027"></div>
          </div>
        </div>

        <!-- Pure Image File Upload Dropzone -->
        <div class="field">
          <label>Upload Property Photo</label>
          <div class="property-image-upload-zone" style="padding:14px" onclick="document.getElementById('modal_rental_img_file').click()">
            <input type="file" id="modal_rental_img_file" accept="image/*" style="display:none" onchange="const f = this.files[0]; if(f){ const r=new FileReader(); r.onload=(e)=>{ document.getElementById('modal_rental_img_prev').src=e.target.result; document.getElementById('modal_rental_img_val').value=e.target.result; }; r.readAsDataURL(f); }">
            <div style="display:flex; align-items:center; gap:10px">
              <img id="modal_rental_img_prev" src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" style="width:48px; height:48px; border-radius:6px; object-fit:cover; border:1px solid var(--line)" alt="Preview">
              <div style="text-align:left">
                <b style="font-size:12px; color:var(--ink); display:block">Click to upload photo from device</b>
                <span style="font-size:11px; color:var(--ink-2)">JPG, PNG, WEBP</span>
              </div>
            </div>
            <input type="hidden" id="modal_rental_img_val" name="image" value="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80">
          </div>
        </div>

        <!-- Public Directory Publishing Switch -->
        <div style="background:#FAF8F2; border:1px solid var(--gold-border); border-radius:var(--r-sm); padding:10px 14px; margin:8px 0">
          <label class="check" style="cursor:pointer; display:flex; align-items:center; gap:8px">
            <input type="checkbox" name="appPublished" checked>
            <div>
              <b style="font-size:12.5px; color:var(--ink)">Publish Listing to Public Tenant Directory</b>
              <span style="font-size:11px; color:var(--ink-2); display:block">Immediately make this property discoverable to prospective tenants across all portal channels</span>
            </div>
          </label>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark gold-glow">+ Add Rental Property</button>
        </div>
      </form>
    `);

    document.getElementById('publishRentalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const r = Object.fromEntries(fd.entries());
      r.appPublished = fd.get('appPublished') === 'on';
      window.store.addRental(r);
      this.close();
      this.showToast(`Rental property "${r.property}" added successfully!`);
      if (window.router.currentRoute === 'rentals') {
        window.router.navigate('rentals', false);
      }
    });
  }

  // ---------- CREATE SUBLEASE & HOSTEL MODAL ----------
  openCreateSubleaseModal() {
    const outlets = (window.store && window.store.data && window.store.data.outlets) || [];
    this.open(`
      <div class="modal-header">
        <div>
          <h3>+ Add Sublease Property & Hostel Hub</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Lease whole apartment from landlord and configure individual room/bed subleases</p>
        </div>
        <button class="modal-close">✕</button>
      </div>
      <form id="createSubleaseForm">
        <div class="field">
          <label>Master Flat / Property Name <span class="req">*</span></label>
          <div class="input-wrap"><input name="property" required placeholder="e.g. The Lennox Tower - Flat 501"></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Outlet Branch</label>
            <div class="select-wrap">
              <select name="outlet">
                ${outlets.map(o => `<option value="${o.name}">${o.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="field">
            <label>Location / City</label>
            <div class="input-wrap"><input name="location" required placeholder="e.g. Kozhikode Beach Road"></div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Landlord / Property Owner <span class="req">*</span></label>
            <div class="input-wrap"><input name="landlord" required placeholder="e.g. Dr. K. Varma"></div>
          </div>
          <div class="field">
            <label>Landlord Phone</label>
            <div class="input-wrap"><input name="landlordPhone" placeholder="+91 98409 11223"></div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px">
          <div class="field">
            <label>Master Rent Outflow (₹) <span class="req">*</span></label>
            <div class="input-wrap"><input name="masterRent" required placeholder="e.g. ₹45,000"></div>
          </div>
          <div class="field">
            <label>Master Deposit Paid</label>
            <div class="input-wrap"><input name="masterDeposit" placeholder="e.g. ₹1,50,000"></div>
          </div>
          <div class="field">
            <label>Est. Utility/Ops Cost</label>
            <div class="input-wrap"><input name="utilityExpenseEst" placeholder="e.g. ₹6,000 / mo"></div>
          </div>
        </div>

        <!-- Room Configuration -->
        <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:12px; margin:8px 0">
          <b style="font-size:12.5px; color:var(--ink); display:block; margin-bottom:8px">Room & Bed Configuration (Default 3 Rooms · 7 Beds)</b>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px">
            <div style="background:#FFF; padding:8px; border-radius:6px; border:1px solid var(--line)">
              <span style="font-size:11px; font-weight:600">Room 1 (Master)</span>
              <span style="font-size:10.5px; color:var(--ink-2); display:block">2 Beds @ ₹12,500/mo</span>
            </div>
            <div style="background:#FFF; padding:8px; border-radius:6px; border:1px solid var(--line)">
              <span style="font-size:11px; font-weight:600">Room 2 (Deluxe)</span>
              <span style="font-size:10.5px; color:var(--ink-2); display:block">3 Beds @ ₹9,500/mo</span>
            </div>
            <div style="background:#FFF; padding:8px; border-radius:6px; border:1px solid var(--line)">
              <span style="font-size:11px; font-weight:600">Room 3 (Balcony)</span>
              <span style="font-size:10.5px; color:var(--ink-2); display:block">2 Beds @ ₹11,000/mo</span>
            </div>
          </div>
          <div style="margin-top:8px; font-size:11px; color:var(--green)">
            <b>Projected Sublease Inflow:</b> ₹75,500 / mo → <b>Net Monthly Profit Spread: +₹24,500 / mo</b>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Sublease Permission NOC Ref #</label>
            <div class="input-wrap"><input name="nocDocRef" placeholder="e.g. NOC-VRM-2026-02"></div>
          </div>
          <div class="field">
            <label>Target Audience</label>
            <div class="input-wrap"><input name="targetAudience" value="Working Professionals & Postgrads"></div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark gold-glow">+ Create Sublease Hub</button>
        </div>
      </form>
    `);

    document.getElementById('createSubleaseForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const s = Object.fromEntries(fd.entries());
      
      // Build default 3-room layout
      s.totalBeds = 7;
      s.occupiedBeds = 0;
      s.subleaseRevenue = "₹75,500";
      s.rooms = [
        {
          id: "R-" + Date.now() + "-1",
          name: "Room 1 (Master Suite)",
          type: "Twin Sharing (2 Beds)",
          attachedBath: true,
          ac: true,
          beds: [
            { id: "BED-" + Date.now() + "-1A", bedNo: "Bed 1A", occupant: null, phone: null, rent: "₹12,500", rawRent: 12500, deposit: "₹25,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null },
            { id: "BED-" + Date.now() + "-1B", bedNo: "Bed 1B", occupant: null, phone: null, rent: "₹12,500", rawRent: 12500, deposit: "₹25,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null }
          ]
        },
        {
          id: "R-" + Date.now() + "-2",
          name: "Room 2 (Deluxe Corner)",
          type: "Triple Sharing (3 Beds)",
          attachedBath: true,
          ac: true,
          beds: [
            { id: "BED-" + Date.now() + "-2A", bedNo: "Bed 2A", occupant: null, phone: null, rent: "₹9,500", rawRent: 9500, deposit: "₹20,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null },
            { id: "BED-" + Date.now() + "-2B", bedNo: "Bed 2B", occupant: null, phone: null, rent: "₹9,500", rawRent: 9500, deposit: "₹20,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null },
            { id: "BED-" + Date.now() + "-2C", bedNo: "Bed 2C", occupant: null, phone: null, rent: "₹9,500", rawRent: 9500, deposit: "₹20,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null }
          ]
        },
        {
          id: "R-" + Date.now() + "-3",
          name: "Room 3 (Balcony Suite)",
          type: "Twin Sharing (2 Beds)",
          attachedBath: false,
          ac: true,
          beds: [
            { id: "BED-" + Date.now() + "-3A", bedNo: "Bed 3A", occupant: null, phone: null, rent: "₹11,000", rawRent: 11000, deposit: "₹22,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null },
            { id: "BED-" + Date.now() + "-3B", bedNo: "Bed 3B", occupant: null, phone: null, rent: "₹11,000", rawRent: 11000, deposit: "₹22,000", status: "Vacant", paymentStatus: null, kycVerified: false, checkIn: null, checkOut: null }
          ]
        }
      ];

      window.store.addSubleaseProperty(s);
      this.close();
      this.showToast(`Sublease property for ${s.property} registered with 7 vacant beds!`);
      if (window.router.currentRoute === 'rentals') {
        window._rentalActiveTab = 'subleases';
        window.router.navigate('rentals', false);
      }
    });
  }

  // ---------- ASSIGN BED MODAL ----------
  openAssignBedModal(subleaseId, bedId) {
    const store = window.store;
    const subleases = (store && store.data && store.data.subleasePortfolios) || [];
    const sub = subleases.find(x => x.id === subleaseId);
    let targetBed = null;
    let targetRoom = null;
    if (sub) {
      (sub.rooms || []).forEach(room => {
        (room.beds || []).forEach(bed => {
          if (bed.id === bedId) {
            targetBed = bed;
            targetRoom = room;
          }
        });
      });
    }

    const propName = sub ? sub.property : 'Sublease Property';
    const roomName = targetRoom ? targetRoom.name : 'Room 1';
    const bedNo = targetBed ? targetBed.bedNo : 'Bed Slot';
    const defaultRent = targetBed ? (typeof targetBed.rent === 'number' ? `₹${targetBed.rent.toLocaleString('en-IN')}` : targetBed.rent) : '₹11,500';
    const defaultDeposit = targetBed && targetBed.deposit ? targetBed.deposit : '₹23,000';
    const todayStr = new Date().toISOString().split('T')[0];

    this.open(`
      <div class="modal-header">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px">
            <span class="chip gold xs font-mono">Bed Allocation</span>
            <span class="xs muted">/</span>
            <span class="xs font-mono" style="color:var(--gold-text)">${propName} · ${roomName} (${bedNo})</span>
          </div>
          <h3>Assign Verified Tenant to Bed Slot</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Allocate bed slot, configure monthly rent schedule, and verify KYC onboarding</p>
        </div>
        <button class="modal-close">✕</button>
      </div>

      <form id="assignBedForm" style="padding-top:4px">
        <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <b style="font-size:13px; color:var(--ink); display:block">${propName}</b>
            <span class="xs muted">Space: <b>${roomName} — ${bedNo}</b> · Managing Outlet: <b>${sub ? sub.outlet : 'YOR Central'}</b></span>
          </div>
          <span class="chip green xs">Ready for Allocation</span>
        </div>

        <div class="field">
          <label>Tenant / Occupant Full Name <span class="req">*</span></label>
          <div class="input-wrap">
            <input name="occupant" required placeholder="e.g. Vikram Joshi (Software Engineer)">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Mobile Number <span class="req">*</span></label>
            <div class="input-wrap">
              <input name="phone" type="tel" required placeholder="+91 98401 22334">
            </div>
          </div>
          <div class="field">
            <label>Monthly Bed Rent (₹) <span class="req">*</span></label>
            <div class="input-wrap">
              <input name="rent" value="${defaultRent}" required>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Check-in Date <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="date" name="checkIn" value="${todayStr}" required>
            </div>
          </div>
          <div class="field">
            <label>Check-out / Expiry Date</label>
            <div class="input-wrap">
              <input type="date" name="checkOut" value="2026-12-31">
            </div>
          </div>
        </div>

        <div class="field">
          <label>KYC ID Proof Document</label>
          <div class="select-wrap">
            <select name="kycDoc">
              <option value="Aadhaar Card (UIDAI Verified)">Aadhaar Card (UIDAI Verified)</option>
              <option value="Passport (Republic of India)">Passport (Republic of India)</option>
              <option value="Corporate Employee ID (Tech Park)">Corporate Employee ID (Tech Park)</option>
              <option value="College Student ID Card">College Student ID Card</option>
              <option value="Driving Licence">Driving Licence</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark gold-glow" style="display:inline-flex; align-items:center; gap:6px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            ✓ Confirm Allocation & Check-in
          </button>
        </div>
      </form>
    `, true);

    const form = document.getElementById('assignBedForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        data.paymentStatus = "Paid";
        data.kycVerified = true;

        window.store.updateSubleaseBed(subleaseId, bedId, data);
        this.close();
        this.showToast(`Bed ${bedNo} successfully assigned to ${data.occupant}!`);
        
        if (window.router.currentRoute === 'rentals') {
          window._rentalActiveTab = 'subleases';
          window.router.navigate('rentals', false);
        }
      });
    }
  }

  // ---------- MOBILE APP PHONE SIMULATOR MODAL ----------
  openMobileAppPreviewModal(rentalId) {
    const r = (window.store && window.store.data && window.store.data.rentals.find(x => x.id === rentalId)) || {
      property: "The Lennox Luxury Sky Penthouse",
      location: "Beach Road, Kozhikode",
      rent: "₹68,500",
      deposit: "₹3,00,000",
      bhk: "4 BHK (2,400 sq.ft)",
      furnishing: "Fully Furnished",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description: "Designer 4 BHK sky penthouse featuring 360-degree sea view terrace, double-height ceilings, and private jacuzzi.",
      amenities: ["Private Terrace", "Smart Automation", "Gymnasium", "2 Dedicated EV Slots", "Concierge Service"]
    };

    this.open(`
      <div class="modal-header">
        <div>
          <h3>📱 YOR Mobile App Live Simulator</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Visual preview of how prospective tenants experience this listing on iOS & Android</p>
        </div>
        <button class="modal-close">✕</button>
      </div>

      <div class="mobile-mockup-wrapper">
        <div class="phone-device-frame">
          <div class="phone-notch-bar">
            <span style="font-size:10px; color:#FFF; font-weight:700">9:41</span>
            <span style="width:8px; height:8px; border-radius:50%; background:#10B981"></span>
            <span style="font-size:10px; color:#FFF">5G 🔋</span>
          </div>

          <div class="phone-screen-content">
            <!-- App Bar -->
            <div class="phone-app-header">
              <span style="font-size:13px; font-weight:700; color:#14171A">YOR Estate App</span>
              <span class="chip gold xs font-mono">Verified</span>
            </div>

            <!-- Property Card in App -->
            <div class="phone-property-card">
              <img src="${r.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}" alt="${r.property}">
              <div class="phone-property-card-body">
                <div style="display:flex; justify-content:space-between; align-items:center">
                  <span class="phone-price-badge">${r.rent} <small>/ mo</small></span>
                  <span class="chip green xs">Available</span>
                </div>

                <b style="font-size:14px; color:#111827; line-height:1.3">${r.property}</b>
                <p style="font-size:11px; color:#6B7280; margin:0">📍 ${r.location || 'Marine Drive, Kochi'}</p>

                <!-- Specs row in mobile -->
                <div style="display:flex; gap:6px; margin:4px 0">
                  <span style="background:#F3F4F6; padding:3px 6px; border-radius:4px; font-size:10.5px; font-weight:600">${r.bhk || '3 BHK'}</span>
                  <span style="background:#F3F4F6; padding:3px 6px; border-radius:4px; font-size:10.5px; font-weight:600">${r.furnishing || 'Furnished'}</span>
                </div>

                <p style="font-size:11.5px; color:#4B5563; line-height:1.4; margin:4px 0">${r.description || 'Premium rental property managed by YOR Estate.'}</p>

                <!-- Amenities tags -->
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin:4px 0">
                  ${(r.amenities || ['WiFi', 'Parking', 'Pool', '24/7 Security']).map(a => `
                    <span style="background:#F8F2E2; color:#7A5B18; border:1px solid #EADBBA; border-radius:4px; font-size:10px; padding:2px 6px; font-weight:600">${a}</span>
                  `).join('')}
                </div>

                <!-- Action Button in Mobile App -->
                <button class="phone-cta-btn" onclick="window.modals.showToast('Simulated: Customer initiated booking via Mobile App!')">
                  📅 Book Site Visit / Enquire
                </button>
              </div>
            </div>

            <div style="background:#FFFFFF; border-radius:14px; padding:12px; border:1px solid #E5E7EB; font-size:11px; color:#6B7280; text-align:center">
              Direct Landlord Escrow & Digital Agreement Powered by <b>YOR Estate</b>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn modal-cancel">Close Preview</button>
        <button type="button" class="btn dark gold-glow" onclick="window.modals.showToast('Listing synced with iOS and Android mobile app distribution!')">✓ Sync to App Store</button>
      </div>
    `);
  }

  // ---------- RECORD RENT PAYMENT MODAL ----------
  openRecordRentPaymentModal(prefillArg = null) {
    const store = window.store;
    const rentals = (store && store.data && store.data.rentals) || [];
    const subleases = (store && store.data && store.data.subleasePortfolios) || [];
    const rentRoll = (store && store.data && store.data.rentRoll) || [];

    // Parse prefill arguments (could be rental ID, custom object, or event)
    let prefill = {};
    if (typeof prefillArg === 'string') {
      const foundRental = rentals.find(x => x.id === prefillArg);
      if (foundRental) {
        prefill = {
          category: 'rental',
          rentalId: foundRental.id,
          property: foundRental.property,
          unitOrBed: `${foundRental.bhk || 'Unit'} (${foundRental.category || foundRental.type})`,
          tenantName: foundRental.tenant,
          tenantPhone: foundRental.tenantPhone || '+91 98401 12345',
          amount: foundRental.rent,
          outlet: foundRental.outlet
        };
      }
    } else if (prefillArg && typeof prefillArg === 'object' && !(prefillArg instanceof Event) && !prefillArg.nativeEvent && prefillArg.target === undefined) {
      prefill = prefillArg;
    }

    // Prepare Bed Occupants list from Subleases
    const bedOccupants = [];
    subleases.forEach(sub => {
      (sub.rooms || []).forEach(room => {
        (room.beds || []).forEach(bed => {
          if (bed.status === 'Occupied' || bed.occupant) {
            bedOccupants.push({
              subleaseId: sub.id,
              bedId: bed.id,
              property: sub.property,
              roomName: room.name,
              bedNo: bed.bedNo,
              unitOrBed: `${room.name} — ${bed.bedNo}`,
              tenantName: (bed.occupant || '').split('(')[0].trim(),
              tenantPhone: bed.phone || '+91 98401 00000',
              amount: typeof bed.rent === 'number' ? `₹${bed.rent.toLocaleString('en-IN')}` : (bed.rent || '₹10,000'),
              rawAmount: typeof bed.rawRent === 'number' ? bed.rawRent : parseFloat(String(bed.rent || '0').replace(/[^0-9.]/g, '')) || 10000,
              outlet: sub.outlet
            });
          }
        });
      });
    });

    // Default initial category
    let initialCategory = prefill.category || (prefill.bedId ? 'sublease' : prefill.rentRollId ? 'rentroll' : 'rental');

    // Default selected entity
    let initialProperty = '';
    let initialTenant = '';
    let initialUnit = '';
    let initialAmountRaw = 55000;

    if (initialCategory === 'sublease') {
      const matchedBed = (prefill.bedId ? bedOccupants.find(b => b.bedId === prefill.bedId) : null) || bedOccupants[0] || {};
      initialProperty = prefill.property || matchedBed.property || 'Silver Oak Coliving Hub';
      initialTenant = prefill.tenantName || matchedBed.tenantName || 'Tenant';
      initialUnit = prefill.unitOrBed || matchedBed.unitOrBed || 'Bed Slot';
      initialAmountRaw = prefill.rawAmount || matchedBed.rawAmount || 12500;
    } else if (initialCategory === 'rentroll') {
      const matchedRR = (prefill.rentRollId ? rentRoll.find(r => r.id === prefill.rentRollId) : null) || rentRoll[0] || {};
      initialProperty = prefill.property || matchedRR.property || 'Property';
      initialTenant = prefill.tenantName || matchedRR.tenantName || 'Tenant';
      initialUnit = prefill.unitOrBed || matchedRR.unitOrBed || 'Unit';
      initialAmountRaw = prefill.rawAmount || matchedRR.rawDue || 55000;
    } else {
      const matchedRental = (prefill.rentalId ? rentals.find(r => r.id === prefill.rentalId) : null) || (prefill.property ? rentals.find(r => r.property === prefill.property) : null) || rentals[0] || {};
      initialProperty = prefill.property || matchedRental.property || 'Riverside Tower 1203';
      initialTenant = prefill.tenantName || matchedRental.tenant || 'Ahmed Al Faisal';
      initialUnit = prefill.unitOrBed || matchedRental.bhk || '3 BHK';
      initialAmountRaw = prefill.rawAmount || parseFloat(String(matchedRental.rent || '55000').replace(/[^0-9.]/g, '')) || 55000;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    this.open(`
      <div class="modal-header">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px">
            <span class="chip gold xs font-mono">Rent Roll Accounting</span>
            <span class="xs muted">/</span>
            <span class="xs font-mono" style="color:var(--gold-text)">RCPT-${Date.now().toString().slice(-6)}</span>
          </div>
          <h3>Record Rent Payment & Issue Receipt</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Log verified incoming rent collection across direct leases and hostel bed occupants</p>
        </div>
        <button class="modal-close">✕</button>
      </div>

      <form id="recordPaymentForm" class="rent-collection-shell" style="padding-top:4px">
        
        <!-- Category Selector Nav -->
        <div class="rent-category-nav">
          <button type="button" class="rent-category-btn ${initialCategory === 'rental' ? 'active' : ''}" id="btnCatRental" onclick="window.modals.switchRentCategory('rental')">
            🏠 Direct Unit Lease (${rentals.length})
          </button>
          <button type="button" class="rent-category-btn ${initialCategory === 'sublease' ? 'active' : ''}" id="btnCatSublease" onclick="window.modals.switchRentCategory('sublease')">
            🛏️ Hostel / Sublease Bed (${bedOccupants.length})
          </button>
          <button type="button" class="rent-category-btn ${initialCategory === 'rentroll' ? 'active' : ''}" id="btnCatRentRoll" onclick="window.modals.switchRentCategory('rentroll')">
            📋 Pending Invoices (${rentRoll.filter(r => r.status !== 'Paid').length})
          </button>
        </div>

        <!-- Dynamic Entity Selectors -->
        <div id="rentEntityWrapRental" style="display:${initialCategory === 'rental' ? 'block' : 'none'}">
          <div class="field">
            <label>Select Rental Property & Tenant <span class="req">*</span></label>
            <div class="select-wrap">
              <select id="selectRentalItem" onchange="window.modals.onSelectRentalProperty(this.value)">
                ${rentals.map((r, idx) => `
                  <option value="${r.id}" ${r.property === initialProperty ? 'selected' : ''}>
                    ${r.property} — ${r.tenant} (${r.rent} / mo) [${r.outlet || 'YOR'}]
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <div id="rentEntityWrapSublease" style="display:${initialCategory === 'sublease' ? 'block' : 'none'}">
          <div class="field">
            <label>Select Sublease Hostel Bed & Occupant <span class="req">*</span></label>
            <div class="select-wrap">
              <select id="selectSubleaseItem" onchange="window.modals.onSelectSubleaseBed(this.value)">
                ${bedOccupants.map((b, idx) => `
                  <option value="${b.subleaseId}|${b.bedId}" ${(prefill.bedId === b.bedId || b.tenantName === initialTenant) ? 'selected' : ''}>
                    🛏️ ${b.tenantName} — ${b.property} (${b.unitOrBed}) — ${b.amount} [${b.outlet}]
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <div id="rentEntityWrapRentRoll" style="display:${initialCategory === 'rentroll' ? 'block' : 'none'}">
          <div class="field">
            <label>Select Pending Ledger Invoice <span class="req">*</span></label>
            <div class="select-wrap">
              <select id="selectRentRollItem" onchange="window.modals.onSelectRentRollInvoice(this.value)">
                ${rentRoll.map(rr => `
                  <option value="${rr.id}" ${prefill.rentRollId === rr.id ? 'selected' : ''}>
                    ${rr.receiptNo || rr.id}: ${rr.tenantName} (${rr.property}) — Due: ${rr.dueAmount} [${rr.status}]
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Tenant & Unit Details Grid -->
        <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:12px">
          <div class="field">
            <label>Tenant Name <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="tenantName" id="rentTenantName" value="${initialTenant}" required>
            </div>
          </div>
          <div class="field">
            <label>Property & Unit / Bed</label>
            <div class="input-wrap">
              <input type="text" name="propertyAndUnit" id="rentPropertyUnit" value="${initialProperty} (${initialUnit})" required>
            </div>
          </div>
        </div>

        <input type="hidden" name="property" id="rentPropertyNameHidden" value="${initialProperty}">
        <input type="hidden" name="unitOrBed" id="rentUnitOrBedHidden" value="${initialUnit}">
        <input type="hidden" name="categoryType" id="rentCategoryTypeHidden" value="${initialCategory}">

        <!-- Billing Cycle & Payment Timestamps -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px">
          <div class="field">
            <label>Billing Period / Cycle</label>
            <div class="select-wrap">
              <select name="billingCycle" id="rentBillingCycle">
                <option value="May 2026">May 2026 (Current Cycle)</option>
                <option value="June 2026">June 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="April 2026 (Arrears)">April 2026 (Arrears)</option>
                <option value="Advance (3 Months)">Advance (3 Months)</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label>Payment Received Date <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="date" name="paymentDate" id="rentPaymentDate" value="${todayStr}" required>
            </div>
          </div>

          <div class="field">
            <label>Due Date</label>
            <div class="input-wrap">
              <input type="date" name="dueDate" id="rentDueDate" value="2026-05-05">
            </div>
          </div>
        </div>

        <!-- Financial Breakdown & Total Calculation Card -->
        <div class="rent-breakdown-box">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <span style="font-size:12px; font-weight:700; color:var(--ink); text-transform:uppercase; letter-spacing:0.04em">Payment Breakdown & Charges</span>
            <span class="xs muted">Live calculation</span>
          </div>

          <div class="rent-breakdown-grid">
            <div class="rent-breakdown-item">
              <label>Base Rent (₹) <span class="req">*</span></label>
              <div class="rent-breakdown-input">
                <span>₹</span>
                <input type="number" id="rentBaseAmount" value="${initialAmountRaw}" min="0" step="100" oninput="window.modals.recalcRentTotal()">
              </div>
            </div>

            <div class="rent-breakdown-item">
              <label>Maintenance (₹)</label>
              <div class="rent-breakdown-input">
                <span>₹</span>
                <input type="number" id="rentMaintAmount" value="0" min="0" step="50" oninput="window.modals.recalcRentTotal()">
              </div>
            </div>

            <div class="rent-breakdown-item">
              <label>Utilities / WiFi (₹)</label>
              <div class="rent-breakdown-input">
                <span>₹</span>
                <input type="number" id="rentUtilAmount" value="0" min="0" step="50" oninput="window.modals.recalcRentTotal()">
              </div>
            </div>

            <div class="rent-breakdown-item">
              <label>Late Fee (₹)</label>
              <div class="rent-breakdown-input">
                <span>₹</span>
                <input type="number" id="rentLateFeeAmount" value="0" min="0" step="50" oninput="window.modals.recalcRentTotal()">
              </div>
            </div>

            <div class="rent-breakdown-item">
              <label>Discount / Waiver (₹)</label>
              <div class="rent-breakdown-input">
                <span>-₹</span>
                <input type="number" id="rentDiscountAmount" value="0" min="0" step="50" oninput="window.modals.recalcRentTotal()">
              </div>
            </div>
          </div>

          <!-- Computed Total Paid Display Banner -->
          <div class="rent-total-banner">
            <div>
              <span>Total Rent Collected</span>
              <small style="display:block; font-size:10.5px; color:#9CA3AF">Base + Maintenance + Utilities + Late Fee - Discount</small>
            </div>
            <b id="rentTotalDisplayBadge">₹${initialAmountRaw.toLocaleString('en-IN')}</b>
            <input type="hidden" name="paidAmount" id="rentTotalPaidHidden" value="₹${initialAmountRaw.toLocaleString('en-IN')}">
            <input type="hidden" name="rawPaid" id="rentRawPaidHidden" value="${initialAmountRaw}">
          </div>
        </div>

        <!-- Payment Mode & Bank Routing -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Payment Mode <span class="req">*</span></label>
            <div class="select-wrap">
              <select name="paymentMode" id="rentPaymentMode" onchange="window.modals.onRentModeChange(this.value)">
                <option value="UPI / PhonePe / GPay">📱 UPI / PhonePe / GPay / Paytm</option>
                <option value="NEFT / RTGS Bank Transfer">🏦 NEFT / RTGS / IMPS Bank Transfer</option>
                <option value="Credit / Debit Card">💳 Credit / Debit Card (Point of Sale)</option>
                <option value="Cheque / DD Deposit">📝 Cheque / Demand Draft Deposit</option>
                <option value="Cash Receipt Entry">💵 Cash Entry (Branch Vault)</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label id="rentRefLabel">Bank UTR / Transaction Reference #</label>
            <div class="input-wrap">
              <input type="text" name="utr" id="rentUtrInput" placeholder="e.g. UTR-984019283741" value="UPI-${Date.now().toString().slice(-8)}">
            </div>
          </div>
        </div>

        <div class="field">
          <label>Receiving Bank Account / Vault</label>
          <div class="select-wrap">
            <select name="receivingAccount">
              <option value="HDFC Master Escrow A/c ...4921">HDFC Bank — YOR Estate Master Escrow (A/c ...4921)</option>
              <option value="ICICI Rental Operations A/c ...8810">ICICI Bank — Rental Operations Account (A/c ...8810)</option>
              <option value="Federal Sublease Vault A/c ...2093">Federal Bank — Sublease Property Vault (A/c ...2093)</option>
              <option value="Branch Petty Cash Drawer">Petty Cash Drawer (Branch Desk)</option>
            </select>
          </div>
        </div>

        <!-- Payment Proof Attachment Dropzone -->
        <div class="field">
          <label>Attach Payment Proof / Bank Slip (Optional)</label>
          <div class="rent-proof-zone" onclick="document.getElementById('rentProofFileInput').click()">
            <div style="display:flex; align-items:center; gap:10px">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div>
                <b style="font-size:12px; color:var(--ink); display:block" id="rentProofFilename">Upload Bank Transfer Voucher / UPI Screenshot</b>
                <span class="xs muted">Supports JPG, PNG, PDF receipts (Max 10MB)</span>
              </div>
            </div>
            <button type="button" class="btn xs" style="pointer-events:none">Browse File</button>
            <input type="file" id="rentProofFileInput" accept="image/*,.pdf" style="display:none" onchange="window.modals.handleRentProofUpload(event)">
          </div>
          <div id="rentProofPreviewThumb" style="display:none; margin-top:8px"></div>
        </div>

        <!-- Notification Automations -->
        <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:10px 14px; display:flex; flex-direction:column; gap:6px">
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--ink); cursor:pointer; font-weight:500">
            <input type="checkbox" name="sendWhatsApp" checked style="accent-color:var(--gold); width:15px; height:15px">
            <span>💬 Send digital WhatsApp receipt with instant payment confirmation link</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--ink); cursor:pointer; font-weight:500">
            <input type="checkbox" name="sendEmail" checked style="accent-color:var(--gold); width:15px; height:15px">
            <span>✉️ Email official tax invoice and PDF receipt to tenant</span>
          </label>
        </div>

        <div class="modal-footer" style="margin-top:4px">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark gold-glow" style="display:inline-flex; align-items:center; gap:6px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            ✓ Confirm & Issue Official Receipt
          </button>
        </div>
      </form>
    `, true);

    // Attach listeners and form submission
    document.getElementById('recordPaymentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      const rawPaid = parseFloat(String(document.getElementById('rentRawPaidHidden').value || '0')) || 55000;
      data.rawPaid = rawPaid;
      data.paidAmount = `₹${rawPaid.toLocaleString('en-IN')}`;
      data.dueAmount = data.paidAmount;
      data.rawDue = rawPaid;

      const rec = window.store.recordRentPayment(data);
      this.close();
      this.showToast(`Rent payment of ${data.paidAmount} recorded! Receipt #${rec.receiptNo} generated.`);
      
      // Immediately display the digital official receipt modal
      setTimeout(() => {
        window.modals.openDigitalReceiptModal(rec);
      }, 200);

      if (window.router.currentRoute === 'rentals') {
        window._rentalActiveTab = 'rentroll';
        window.router.navigate('rentals', false);
      }
    });
  }

  // Switch category inside record rent modal
  switchRentCategory(category) {
    document.getElementById('btnCatRental').classList.toggle('active', category === 'rental');
    document.getElementById('btnCatSublease').classList.toggle('active', category === 'sublease');
    document.getElementById('btnCatRentRoll').classList.toggle('active', category === 'rentroll');

    document.getElementById('rentEntityWrapRental').style.display = category === 'rental' ? 'block' : 'none';
    document.getElementById('rentEntityWrapSublease').style.display = category === 'sublease' ? 'block' : 'none';
    document.getElementById('rentEntityWrapRentRoll').style.display = category === 'rentroll' ? 'block' : 'none';

    document.getElementById('rentCategoryTypeHidden').value = category;

    if (category === 'rental') {
      const select = document.getElementById('selectRentalItem');
      if (select) this.onSelectRentalProperty(select.value);
    } else if (category === 'sublease') {
      const select = document.getElementById('selectSubleaseItem');
      if (select) this.onSelectSubleaseBed(select.value);
    } else if (category === 'rentroll') {
      const select = document.getElementById('selectRentRollItem');
      if (select) this.onSelectRentRollInvoice(select.value);
    }
  }

  onSelectRentalProperty(rentalId) {
    const rentals = (window.store && window.store.data && window.store.data.rentals) || [];
    const r = rentals.find(x => x.id === rentalId);
    if (!r) return;

    document.getElementById('rentTenantName').value = r.tenant || '';
    document.getElementById('rentPropertyUnit').value = `${r.property} (${r.bhk || '3 BHK'})`;
    document.getElementById('rentPropertyNameHidden').value = r.property;
    document.getElementById('rentUnitOrBedHidden').value = r.bhk || '3 BHK';

    const raw = parseFloat(String(r.rent || '0').replace(/[^0-9.]/g, '')) || 55000;
    document.getElementById('rentBaseAmount').value = raw;
    this.recalcRentTotal();
  }

  onSelectSubleaseBed(compoundVal) {
    const [subleaseId, bedId] = compoundVal.split('|');
    const subleases = (window.store && window.store.data && window.store.data.subleasePortfolios) || [];
    const sub = subleases.find(s => s.id === subleaseId);
    if (!sub) return;

    let targetBed = null;
    let targetRoom = null;
    (sub.rooms || []).forEach(room => {
      (room.beds || []).forEach(bed => {
        if (bed.id === bedId) {
          targetBed = bed;
          targetRoom = room;
        }
      });
    });

    if (targetBed) {
      document.getElementById('rentTenantName').value = (targetBed.occupant || '').split('(')[0].trim() || 'Hostel Tenant';
      document.getElementById('rentPropertyUnit').value = `${sub.property} (${targetRoom.name} — ${targetBed.bedNo})`;
      document.getElementById('rentPropertyNameHidden').value = sub.property;
      document.getElementById('rentUnitOrBedHidden').value = `${targetRoom.name} — ${targetBed.bedNo}`;

      const raw = typeof targetBed.rawRent === 'number' ? targetBed.rawRent : parseFloat(String(targetBed.rent || '0').replace(/[^0-9.]/g, '')) || 10000;
      document.getElementById('rentBaseAmount').value = raw;
      this.recalcRentTotal();
    }
  }

  onSelectRentRollInvoice(invoiceId) {
    const rentRoll = (window.store && window.store.data && window.store.data.rentRoll) || [];
    const rr = rentRoll.find(x => x.id === invoiceId);
    if (!rr) return;

    document.getElementById('rentTenantName').value = rr.tenantName || '';
    document.getElementById('rentPropertyUnit').value = `${rr.property} (${rr.unitOrBed || 'Unit'})`;
    document.getElementById('rentPropertyNameHidden').value = rr.property;
    document.getElementById('rentUnitOrBedHidden').value = rr.unitOrBed || 'Unit';

    const raw = rr.rawDue || parseFloat(String(rr.dueAmount || '0').replace(/[^0-9.]/g, '')) || 55000;
    document.getElementById('rentBaseAmount').value = raw;
    this.recalcRentTotal();
  }

  recalcRentTotal() {
    const base = parseFloat(document.getElementById('rentBaseAmount').value || '0') || 0;
    const maint = parseFloat(document.getElementById('rentMaintAmount').value || '0') || 0;
    const util = parseFloat(document.getElementById('rentUtilAmount').value || '0') || 0;
    const late = parseFloat(document.getElementById('rentLateFeeAmount').value || '0') || 0;
    const disc = parseFloat(document.getElementById('rentDiscountAmount').value || '0') || 0;

    const total = Math.max(0, base + maint + util + late - disc);
    const formatted = `₹${total.toLocaleString('en-IN')}`;

    const badge = document.getElementById('rentTotalDisplayBadge');
    if (badge) badge.innerText = formatted;

    const hiddenTotal = document.getElementById('rentTotalPaidHidden');
    if (hiddenTotal) hiddenTotal.value = formatted;

    const hiddenRaw = document.getElementById('rentRawPaidHidden');
    if (hiddenRaw) hiddenRaw.value = total;
  }

  onRentModeChange(mode) {
    const label = document.getElementById('rentRefLabel');
    const input = document.getElementById('rentUtrInput');
    if (!label || !input) return;

    if (mode.includes('UPI')) {
      label.innerText = 'UPI Transaction ID / Reference';
      input.placeholder = 'e.g. 984019283741@upi';
    } else if (mode.includes('Cheque')) {
      label.innerText = 'Cheque # & Issuing Bank';
      input.placeholder = 'e.g. CHQ-492019 (HDFC Bank)';
    } else if (mode.includes('NEFT')) {
      label.innerText = 'Bank UTR / IMPS Ref Number';
      input.placeholder = 'e.g. UTR-HDFC984019283741';
    } else if (mode.includes('Cash')) {
      label.innerText = 'Cash Voucher Receipt Ref';
      input.placeholder = 'e.g. CASH-VOUCHER-0842';
    } else {
      label.innerText = 'Transaction Reference / Auth Code';
      input.placeholder = 'e.g. AUTH-849201';
    }
  }

  handleRentProofUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const filenameEl = document.getElementById('rentProofFilename');
    if (filenameEl) filenameEl.innerText = `✓ Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewEl = document.getElementById('rentProofPreviewThumb');
      if (previewEl) {
        previewEl.style.display = 'flex';
        previewEl.innerHTML = `
          <div class="rent-proof-preview">
            <img src="${e.target.result}" alt="Proof Voucher">
            <div style="flex:1">
              <b style="font-size:11.5px; color:var(--ink); display:block">${file.name}</b>
              <span class="xs muted">Ready for digital receipt archive</span>
            </div>
            <button type="button" class="btn xs" onclick="document.getElementById('rentProofPreviewThumb').style.display='none'; document.getElementById('rentProofFilename').innerText='Upload Bank Transfer Voucher / UPI Screenshot';">Remove</button>
          </div>
        `;
      }
    };
    reader.readAsDataURL(file);
  }

  // ---------- DIGITAL RENT RECEIPT MODAL ----------
  openDigitalReceiptModal(receiptData = {}) {
    const r = receiptData;
    const rawPaid = r.rawPaid || (typeof r.paidAmount === 'number' ? r.paidAmount : parseFloat(String(r.paidAmount || '55000').replace(/[^0-9.]/g, ''))) || 55000;
    const receiptNum = r.receiptNo || `RCPT-${Date.now().toString().slice(-6)}`;
    const paymentDate = r.paymentDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const billingCycle = r.billingCycle || 'May 2026';

    this.open(`
      <div class="modal-header">
        <div>
          <h3>Official Digital Rent Receipt</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Verified transaction voucher generated by YOR Estate Accounting System</p>
        </div>
        <button class="modal-close">✕</button>
      </div>

      <div class="digital-receipt-shell" id="printableReceiptContent">
        
        <!-- Receipt Top Header Bar -->
        <div class="receipt-top-bar">
          <div class="receipt-brand">
            <h2>YOR ESTATE</h2>
            <p>Asset Management & Luxury Property Leasing Division</p>
            <span class="xs muted">GSTIN: 32AABCY9941K1Z5 · RERA Ref: K-RERA/PRJ/2026/001</span>
          </div>

          <div class="receipt-meta-block">
            <span class="receipt-num">${receiptNum}</span>
            <span class="xs muted">Issued: ${paymentDate}</span>
            <div style="margin-top:6px">
              <span class="receipt-stamp-badge">✓ PAYMENT VERIFIED</span>
            </div>
          </div>
        </div>

        <!-- Receipt Parties Grid -->
        <div class="receipt-grid-info">
          <div class="receipt-info-col">
            <h4>Tenant / Payee Details</h4>
            <p>${r.tenantName || 'Ahmed Al Faisal'}</p>
            <span>Tenant Contact: ${r.tenantPhone || '+91 98401 12345'}</span>
            <span>Account Status: <b>Good Standing (Active Lease)</b></span>
          </div>

          <div class="receipt-info-col">
            <h4>Leased Property & Unit</h4>
            <p>${r.property || 'Riverside Tower 1203'}</p>
            <span>Unit / Space: <b>${r.unitOrBed || '3 BHK Unit'}</b></span>
            <span>Managing Outlet: <b>${r.outlet || 'YOR South Branch'}</b></span>
          </div>
        </div>

        <!-- Payment Meta Strip -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; padding:12px 0; border-bottom:1px solid var(--line); font-size:12px">
          <div>
            <span class="xs muted uppercase" style="display:block">Billing Cycle</span>
            <b>${billingCycle}</b>
          </div>
          <div>
            <span class="xs muted uppercase" style="display:block">Payment Method</span>
            <b>${r.paymentMode || 'UPI / PhonePe'}</b>
          </div>
          <div>
            <span class="xs muted uppercase" style="display:block">Transaction / UTR #</span>
            <b class="font-mono" style="color:var(--gold-text)">${r.utr || 'UTR-984019283741'}</b>
          </div>
        </div>

        <!-- Itemized Charges Table -->
        <table class="receipt-table">
          <thead>
            <tr>
              <th>Description / Item</th>
              <th>Period</th>
              <th class="r">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Scheduled Residential / Commercial Rent</b></td>
              <td class="muted">${billingCycle}</td>
              <td class="r num">₹${rawPaid.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Maintenance & High-Speed Amenities</td>
              <td class="muted">${billingCycle}</td>
              <td class="r num">Included</td>
            </tr>
            <tr>
              <td>Statutory Escrow Service Charge</td>
              <td class="muted">Nil (0%)</td>
              <td class="r num">₹0</td>
            </tr>
            <tr class="receipt-total-row">
              <td colspan="2">TOTAL AMOUNT RECEIVED & CREDITED</td>
              <td class="r num" style="color:var(--green)">₹${rawPaid.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <!-- Receipt Footer Verification Stamp -->
        <div class="receipt-footer-stamp">
          <div>
            <span>Verified by: <b>Sarah Coleman (Accounts Head)</b></span>
            <span class="xs muted" style="display:block">This is a system-generated cryptographically signed electronic receipt.</span>
          </div>
          <div style="text-align:right">
            <span class="font-mono xs" style="color:var(--gold-text)">HASH: 9A8F-4B2C-E012-771B</span>
          </div>
        </div>

      </div>

      <div class="modal-footer" style="margin-top:14px; display:flex; justify-content:space-between; align-items:center">
        <div style="display:flex; gap:8px">
          <button type="button" class="btn sm" onclick="window.print()" title="Print physical copy">
            🖨️ Print Receipt
          </button>
          <button type="button" class="btn sm" onclick="window.modals.showToast('Official PDF Receipt downloaded to your system!')" title="Download PDF voucher">
            📥 Download PDF
          </button>
          <button type="button" class="btn sm gold" onclick="window.modals.showToast('Digital WhatsApp receipt sent to ${r.tenantName || 'tenant'}!')" title="Send WhatsApp Confirmation">
            💬 WhatsApp Tenant
          </button>
        </div>

        <button type="button" class="btn dark modal-cancel" onclick="if (window.router.currentRoute==='rentals') { window._rentalActiveTab='rentroll'; window.router.navigate('rentals', false); }">
          ✓ Close & View Rent Roll
        </button>
      </div>
    `, true);
  }

  // ---------- SCHEDULE TOUR MODAL ----------
  openScheduleTourModal(inquiryId) {
    const inq = (window.store && window.store.data && window.store.data.rentalInquiries.find(x => x.id === inquiryId)) || {};

    this.open(`
      <div class="modal-header">
        <div>
          <h3>Schedule Property Site Tour</h3>
          <p class="xs muted" style="margin:2px 0 0 0">Book site walkthrough for customer inquiry from Mobile App</p>
        </div>
        <button class="modal-close">✕</button>
      </div>
      <form id="scheduleTourForm">
        <div class="field">
          <label>Customer Name</label>
          <div class="input-wrap"><input value="${inq.customerName || 'Aarav Sharma'}" readonly style="background:var(--card-2)"></div>
        </div>

        <div class="field">
          <label>Requested Property</label>
          <div class="input-wrap"><input value="${inq.requestedProperty || 'The Lennox Tower - Flat 402'}" readonly style="background:var(--card-2)"></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div class="field">
            <label>Tour Date & Time <span class="req">*</span></label>
            <div class="input-wrap"><input name="tourTime" value="Tomorrow, 4:30 PM" required></div>
          </div>
          <div class="field">
            <label>Assigned YOR Agent</label>
            <div class="select-wrap">
              <select name="assignedAgent">
                <option value="Sarah Coleman">Sarah Coleman</option>
                <option value="Arjun Mehta">Arjun Mehta</option>
                <option value="Rahul Nair">Rahul Nair</option>
                <option value="May Lim">May Lim</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label>Tour Format</label>
          <div class="select-wrap">
            <select name="tourFormat">
              <option value="Physical In-Person Walkthrough">Physical In-Person Walkthrough</option>
              <option value="Live Guided Video Tour">Live Guided Video Tour (WhatsApp/Zoom)</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark gold-glow">📅 Confirm Tour Booking</button>
        </div>
      </form>
    `);

    document.getElementById('scheduleTourForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      window.store.updateInquiryStatus(inquiryId, "Tour Scheduled", data);
      this.close();
      this.showToast(`Tour scheduled for ${data.tourTime}! Notification sent to customer.`);
      if (window.router.currentRoute === 'rentals') {
        window.router.navigate('rentals', false);
      }
    });
  }

  openAddCommissionRule() {
    this.open(`
      <div class="modal-header">
        <h3>+ Configure Commission Rule</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="addRuleForm">
        <div class="field">
          <label>Rule Name <span class="req">*</span></label>
          <div class="input-wrap"><input name="name" required placeholder="e.g. Commercial High-Value Tier"></div>
        </div>
        <div class="field">
          <label>Target Property Scope</label>
          <div class="input-wrap"><input name="target" placeholder="e.g. Commercial > ₹10 Cr"></div>
        </div>
        <div class="field">
          <label>Calculation Formula <span class="req">*</span></label>
          <div class="input-wrap"><input name="rule" required placeholder="e.g. 3.0% on transaction closure"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark">+ Save Rule</button>
        </div>
      </form>
    `);

    document.getElementById('addRuleForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const r = Object.fromEntries(fd.entries());
      window.store.addCommissionRule(r);
      this.close();
      this.showToast(`Commission Rule "${r.name}" configured and active!`);
    });
  }

  openAddOutlet() {
    this.close();
    window.router.navigate('outlet-new');
  }

  openInviteUser() {
    this.close();
    if (window.userWizard && window.userWizard.openSlidingPage) {
      window.userWizard.openSlidingPage();
    }
  }

  openInvoiceModal() {
    this.open(`
      <div class="modal-header">
        <h3>Invoice Generation & Preview</h3>
        <button class="modal-close">✕</button>
      </div>
      <div class="soft" style="background:#fff; border:1px solid var(--line-2); padding:24px; font-family:var(--font-sans)">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--line); padding-bottom:18px">
          <div>
            <h2 style="font-size:24px; font-weight:700; color:var(--ink)">YOR ESTATE</h2>
            <div class="small muted">Property Management Pvt. Ltd.</div>
            <div class="xs muted">GSTIN: 32AABCY1234F1Z8 · Kochi, Kerala</div>
          </div>
          <div style="text-align:right">
            <div class="chip green">TAX INVOICE</div>
            <div class="semibold" style="margin-top:6px">INV-2026-0892</div>
            <div class="small muted">Date: 28 Apr 2026</div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:16px 0">
          <div>
            <div class="xs muted uppercase semibold">Billed To</div>
            <div class="semibold">TechNova LLC</div>
            <div class="small muted">Unit 901, YOR Central, Kochi</div>
          </div>
          <div style="text-align:right">
            <div class="xs muted uppercase semibold">Payment Due</div>
            <div class="semibold">05 May 2026</div>
            <div class="small muted">Bank Transfer / NEFT</div>
          </div>
        </div>
        <table style="margin:16px 0">
          <thead>
            <tr><th>Description</th><th>Period</th><th class="r">Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>Commercial Office Lease (Unit 901)</td><td>May 2026</td><td class="r">₹1,12,000</td></tr>
            <tr><td>Property Maintenance & Facility Management</td><td>May 2026</td><td class="r">₹18,000</td></tr>
            <tr><td>GST @ 18%</td><td>-</td><td class="r">₹23,400</td></tr>
          </tbody>
        </table>
        <div style="display:flex; justify-content:space-between; border-top:2px solid var(--ink); padding-top:12px; margin-top:12px">
          <b>Total Payable</b>
          <b style="font-size:18px; color:var(--ink)" class="num">₹1,53,400</b>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn modal-cancel">Close</button>
        <button class="btn gold" onclick="window.print()">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Invoice
        </button>
        <button class="btn dark" onclick="window.modals.showToast('PDF Invoice INV-2026-0892 downloaded!'); window.modals.close()">Download PDF</button>
      </div>
    `, true);
  }

  openExportReport() {
    this.open(`
      <div class="modal-header">
        <h3>Export Platform Reports</h3>
        <button class="modal-close">✕</button>
      </div>
      <div class="field">
        <label>Select Module</label>
        <div class="select-wrap">
          <select id="exportModuleSelect">
            <option value="properties">Property Records & Survey Register (1,248 records)</option>
            <option value="finance">Finance Ledger & Revenue Statements</option>
            <option value="legal">Legal Verification & Compliance Audit Trail</option>
            <option value="commissions">Agent Commissions & Payout History</option>
            <option value="sales">Sales CRM Pipeline & Conversion Funnel</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label>Export Format</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <button class="btn dark" style="height:44px" onclick="window.modals.showToast('CSV export generated!'); window.modals.close()">
            Download CSV (.csv)
          </button>
          <button class="btn gold" style="height:44px" onclick="window.modals.showToast('PDF Summary Report generated!'); window.modals.close()">
            Download PDF Report (.pdf)
          </button>
        </div>
      </div>
    `);
  }

  open(html, isWide = false) {
    this.init();
    const backdrop = document.getElementById('modalBackdrop');
    const box = document.getElementById('modalBox');
    if (!backdrop || !box) return;

    box.className = `modal-box ${isWide === 'extra-wide' ? 'extra-wide' : isWide ? 'wide' : ''}`;
    box.innerHTML = html;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Bind close button
    const closeBtn = box.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    const cancelBtn = box.querySelector('.modal-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
  }

  close() {
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ---------- LEGAL VERIFICATION & STATE WORKFLOW MODALS ----------
  openConfigureStateWorkflowModal(stateName = null) {
    const store = window.store;
    const existingWf = stateName ? (store.data.stateWorkflows[stateName] || {}) : {};
    const defaultDocs = (existingWf && Array.isArray(existingWf.requiredDocs) && existingWf.requiredDocs.length > 0) 
      ? existingWf.requiredDocs 
      : (existingWf && Array.isArray(existingWf.documents) && existingWf.documents.length > 0)
        ? existingWf.documents.map((d, i) => ({
            id: d.id || `doc_${i + 1}`,
            name: d.name || "Statutory Document",
            category: d.category || "Title",
            mandatory: d.mandatory !== false && d.required !== false,
            validityYears: d.validityYears || 20
          }))
        : [
          { id: "parent_deed", name: "20-Year Parent Title Deed Flow", category: "Title", mandatory: true, validityYears: 20 },
          { id: "ec", name: "Encumbrance Certificate (EC Form 15)", category: "Encumbrance", mandatory: true, validityYears: 20 },
          { id: "revenue_record", name: "Revenue Extract / Patta / 7-12 / RTC", category: "Revenue", mandatory: true, validityYears: 1 },
          { id: "mutation", name: "Mutation Certificate & Land Ledger", category: "Revenue", mandatory: true, validityYears: 1 },
          { id: "zoning", name: "Zoning & NA Layout Approval Order", category: "Statutory", mandatory: true, validityYears: 5 },
          { id: "legal_opinion", name: "Senior Advocate Legal Title Opinion", category: "Clearance", mandatory: true, validityYears: 1 }
        ];

    const isEdit = !!stateName;
    const commonStates = [
      "Tamil Nadu", "Kerala", "Karnataka", "Maharashtra", "Telangana",
      "Andhra Pradesh", "Gujarat", "Delhi NCR", "Goa", "Rajasthan",
      "West Bengal", "Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh"
    ];

    const renderDocRow = (doc, idx) => `
      <div class="doc-builder-row" id="docRow_${idx}">
        <div>
          <input type="text" class="doc-input-name" placeholder="Document Name (e.g. Title Deed 20 year)" value="${doc.name || ''}" required>
        </div>
        <div>
          <select class="doc-select-cat">
            <option value="Title" ${doc.category === 'Title' ? 'selected' : ''}>Title Deed</option>
            <option value="Encumbrance" ${doc.category === 'Encumbrance' ? 'selected' : ''}>Encumbrance (EC)</option>
            <option value="Revenue" ${doc.category === 'Revenue' ? 'selected' : ''}>Revenue / Patta / 7-12</option>
            <option value="Survey" ${doc.category === 'Survey' ? 'selected' : ''}>Survey / Sketch / FMB</option>
            <option value="Statutory" ${doc.category === 'Statutory' ? 'selected' : ''}>Statutory / Zoning</option>
            <option value="Clearance" ${doc.category === 'Clearance' ? 'selected' : ''}>Legal Opinion / Clearance</option>
            <option value="Tax" ${doc.category === 'Tax' ? 'selected' : ''}>Tax / Utility Receipt</option>
          </select>
        </div>
        <div>
          <select class="doc-select-years">
            <option value="30" ${doc.validityYears == 30 ? 'selected' : ''}>30 Years</option>
            <option value="20" ${doc.validityYears == 20 || !doc.validityYears ? 'selected' : ''}>20 Years</option>
            <option value="15" ${doc.validityYears == 15 ? 'selected' : ''}>15 Years</option>
            <option value="10" ${doc.validityYears == 10 ? 'selected' : ''}>10 Years</option>
            <option value="5" ${doc.validityYears == 5 ? 'selected' : ''}>5 Years</option>
            <option value="1" ${doc.validityYears == 1 ? 'selected' : ''}>1 Year</option>
          </select>
        </div>
        <div style="display:flex; align-items:center; gap:6px; padding:0 4px">
          <label style="display:flex; align-items:center; gap:4px; font-size:11.5px; cursor:pointer; margin:0; user-select:none">
            <input type="checkbox" class="doc-check-mandatory" ${doc.mandatory !== false ? 'checked' : ''}>
            <span>Mandatory</span>
          </label>
        </div>
        <div>
          <button type="button" class="doc-remove-btn" title="Remove Document" onclick="this.closest('.doc-builder-row').remove()">
            ✕
          </button>
        </div>
      </div>
    `;

    this.open(`
      <div class="modal-header" style="border-bottom:1px solid var(--line); padding-bottom:16px; margin-bottom:20px">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
            <span class="chip gold xs font-mono">STATE WORKFLOW BUILDER</span>
            <span class="chip gray xs">${isEdit ? 'Update Jurisdiction' : 'New State Setup'}</span>
          </div>
          <h3 style="font-size:20px; font-weight:700">${isEdit ? `Configure State Legal Workflow — ${stateName}` : '+ Add State Legal Workflow'}</h3>
          <p style="font-size:12.5px; color:var(--muted); margin:2px 0 0 0">
            Select the State / Union Territory and configure the required statutory document checklist.
          </p>
        </div>
        <button class="modal-close">✕</button>
      </div>

      <form id="stateWorkflowForm" style="display:flex; flex-direction:column; gap:16px">
        
        <!-- STATE SELECTION ONLY -->
        <div class="workflow-group-box" style="margin:0">
          <div class="field" style="margin:0">
            <label style="font-weight:700; font-size:13px; color:var(--ink); margin-bottom:6px; display:block">
              Select State / Union Territory <span class="req">*</span>
            </label>
            ${isEdit ? `
              <div class="input-wrap">
                <input name="stateName" required value="${stateName}" readonly style="background:#f5f5f5; font-weight:700; font-size:15px; color:var(--ink)">
              </div>
            ` : `
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px">
                <div class="select-wrap">
                  <select id="presetStateSelect" onchange="document.getElementById('customStateInput').value = this.value">
                    <option value="">-- Choose Indian State / UT --</option>
                    ${commonStates.map(s => `<option value="${s}">${s}</option>`).join('')}
                  </select>
                </div>
                <div class="input-wrap">
                  <input id="customStateInput" name="stateName" required placeholder="Or type state name (e.g. Tamil Nadu)">
                </div>
              </div>
            `}
          </div>
        </div>

        <!-- STATUTORY DOCUMENT CHECKLIST BUILDER -->
        <div class="workflow-group-box" style="margin:0; padding:16px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--line)">
            <div>
              <b style="font-size:13.5px; color:var(--ink); display:block">Required Statutory Document Checklist</b>
              <span class="xs muted">Add each document required for legal verification in this state (e.g., Title Deed 20 year, EC, Patta).</span>
            </div>
            <button type="button" id="btnAddDocRow" class="btn sm gold" style="padding:5px 14px; font-weight:600">
              + Add Document
            </button>
          </div>

          <div style="display:grid; grid-template-columns: 2fr 1.2fr 1fr auto auto; gap:10px; padding:0 12px 6px; font-size:11px; font-weight:700; text-transform:uppercase; color:var(--ink-3); letter-spacing:0.04em">
            <div>Document Title</div>
            <div>Category</div>
            <div>Validity / Period</div>
            <div>Mandatory</div>
            <div></div>
          </div>

          <div class="doc-builder-container" id="docBuilderContainer">
            ${defaultDocs.map((d, i) => renderDocRow(d, i)).join('')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px dashed var(--line); font-size:12px; color:var(--muted)">
            <span>Need more documents? Click <b>+ Add Document</b> to append items.</span>
            <button type="button" class="text-link" style="font-size:12px; font-weight:600" onclick="document.getElementById('btnAddDocRow').click()">
              + Add Document Item
            </button>
          </div>
        </div>

        <!-- MODAL FOOTER ACTIONS -->
        <div class="modal-footer" style="margin-top:8px; padding-top:16px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center">
          <div class="xs muted">
            Saved workflow documents will automatically apply to all listings in this state.
          </div>
          <div style="display:flex; gap:10px">
            <button type="button" class="btn modal-cancel">Cancel</button>
            <button type="submit" class="btn gold" style="padding:0 24px; font-weight:600">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save State Workflow
            </button>
          </div>
        </div>
      </form>
    `, 'extra-wide');

    // Dynamic row addition listener
    let nextDocIndex = defaultDocs.length;
    const btnAdd = document.getElementById('btnAddDocRow');
    const container = document.getElementById('docBuilderContainer');

    if (btnAdd && container) {
      btnAdd.addEventListener('click', () => {
        const dummyDoc = {
          name: "",
          category: "Title",
          validityYears: 20,
          mandatory: true
        };
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderDocRow(dummyDoc, nextDocIndex++);
        const newRow = tempDiv.firstElementChild;
        container.appendChild(newRow);
        newRow.querySelector('.doc-input-name')?.focus();
      });
    }

    // Form submit listener
    const form = document.getElementById('stateWorkflowForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const sName = fd.get('stateName').trim();
        if (!sName) {
          window.modals.showToast("Please enter a valid State Name.", "error");
          return;
        }

        // Collect all doc rows
        const rows = container.querySelectorAll('.doc-builder-row');
        const parsedDocs = [];
        rows.forEach((row, idx) => {
          const nameInput = row.querySelector('.doc-input-name');
          const catSelect = row.querySelector('.doc-select-cat');
          const yearsSelect = row.querySelector('.doc-select-years');
          const mandCheck = row.querySelector('.doc-check-mandatory');

          const nameVal = nameInput ? nameInput.value.trim() : '';
          if (nameVal) {
            parsedDocs.push({
              id: nameVal.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + (idx + 1),
              name: nameVal,
              category: catSelect ? catSelect.value : "Title",
              validityYears: parseInt(yearsSelect ? yearsSelect.value : '20', 10) || 20,
              mandatory: mandCheck ? mandCheck.checked : true
            });
          }
        });

        if (parsedDocs.length === 0) {
          window.modals.showToast("Please include at least one required checklist document.", "error");
          return;
        }

        const wfData = {
          name: sName,
          requiredDocs: parsedDocs
        };

        window.store.saveStateLegalWorkflow(sName, wfData);
        window.modals.showToast(`State legal workflow for ${sName} saved successfully!`);
        window.modals.close();
        if (window.router) window.router.navigate('legal');
      });
    }
  }

  openVerifyDocumentModal(propId, docId = null) {
    const store = window.store;
    const prop = store.data.properties.find(p => p.id === propId);
    if (!prop) return;
    store.ensurePropertyLegalChecklist(prop);

    const checklist = prop.legalChecklist || [];
    const targetDoc = docId ? checklist.find(d => d.id === docId) : null;
    const user = (window.auth && window.auth.currentUser) || { name: "Adv. Priya Nair" };

    this.open(`
      <div class="modal-header">
        <h3>Verify Statutory Compliance Document</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="verifyDocForm">
        <div style="background:#faf8f5; border:1px solid var(--line-2); padding:12px; border-radius:6px; margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px">
            <span class="chip gold xs font-mono">${prop.state.toUpperCase()} JURISDICTION</span>
            <span class="chip gray xs">${prop.surveyNo}</span>
          </div>
          <b style="font-size:14px; color:var(--ink)">${prop.name}</b>
          <div class="xs muted">${prop.location}</div>
        </div>

        <div class="field">
          <label>Select Document to Verify <span class="req">*</span></label>
          <div class="select-wrap">
            <select name="docId" required ${targetDoc ? 'disabled style="background:#f5f5f5"' : ''}>
              ${checklist.map(d => `
                <option value="${d.id}" ${targetDoc && targetDoc.id === d.id ? 'selected' : ''}>
                  ${d.name} (${d.category || 'Title'} · ${d.status})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="field">
          <label>Verifying Legal Officer / Title Advocate <span class="req">*</span></label>
          <div class="input-wrap">
            <input name="officerName" required value="${user.name || 'Adv. Rajesh Menon'}" placeholder="Officer Full Name & Title">
          </div>
        </div>

        <div class="field">
          <label>Verification Notes & Cross-Check Remarks</label>
          <div class="input-wrap">
            <textarea name="remarks" rows="3" placeholder="e.g. 20-year chain of title verified against Sub-Registrar Volume Book & Online Portal. Nil encumbrance observed."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn gold">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Stamp & Mark Verified
          </button>
        </div>
      </form>
    `);

    const form = document.getElementById('verifyDocForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const selectedDocId = targetDoc ? targetDoc.id : fd.get('docId');
        const officer = fd.get('officerName') || user.name || "Legal Officer";
        const remarks = fd.get('remarks') || "Verified against Sub-Registrar & Revenue records";

        window.store.verifyPropertyDocument(prop.id, selectedDocId, officer, remarks);
        window.modals.showToast(`Document verified and stamped by ${officer}!`);
        window.modals.close();
        if (window.router) window.router.navigate('legal');
      });
    }
  }

  openRejectDocumentModal(propId, docId) {
    const store = window.store;
    const prop = store.data.properties.find(p => p.id === propId);
    if (!prop) return;
    store.ensurePropertyLegalChecklist(prop);

    const doc = prop.legalChecklist.find(d => d.id === docId);
    if (!doc) return;
    const user = (window.auth && window.auth.currentUser) || { name: "Adv. Priya Nair" };

    this.open(`
      <div class="modal-header">
        <h3 style="color:var(--red)">Reject Statutory Document & Request Resubmission</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="rejectDocForm">
        <div style="background:#fff5f5; border:1px solid #fecaca; padding:12px; border-radius:6px; margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px">
            <span class="chip red xs font-mono">REJECTION DESK</span>
            <span class="chip gray xs">${prop.surveyNo}</span>
          </div>
          <b style="font-size:14px; color:var(--ink)">${doc.name}</b>
          <div class="xs muted">Property: ${prop.name} (${prop.state})</div>
        </div>

        <div class="field">
          <label>Reviewing Legal Officer <span class="req">*</span></label>
          <div class="input-wrap">
            <input name="officerName" required value="${user.name || 'Legal Officer'}" placeholder="Officer Name">
          </div>
        </div>

        <div class="field">
          <label>Reason for Rejection / Discrepancy Observed <span class="req">*</span></label>
          <div class="input-wrap">
            <textarea name="reason" required rows="3" placeholder="e.g. Encumbrance entry in year 2018 is not discharged. Please obtain certified nil-encumbrance certificate from SRO."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn" style="background:var(--red); color:#fff; border:none">
            Confirm Rejection & Notify Outlet
          </button>
        </div>
      </form>
    `);

    const form = document.getElementById('rejectDocForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const officer = fd.get('officerName') || user.name || "Legal Officer";
        const reason = fd.get('reason') || "Document discrepancy observed";

        window.store.rejectPropertyDocument(prop.id, doc.id, officer, reason);
        window.modals.showToast(`Document marked as Rejected with remarks. Outlet notified.`);
        window.modals.close();
        if (window.router) window.router.navigate('legal');
      });
    }
  }

  openApprovePropertyLegalModal(propId) {
    const store = window.store;
    const prop = store.data.properties.find(p => p.id === propId);
    if (!prop) return;
    const user = (window.auth && window.auth.currentUser) || { name: "Priya Nair, Chief Legal Officer" };

    this.open(`
      <div class="modal-header">
        <h3>Approve Clear Title & Issue Final HO Clearance</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="approvePropLegalForm">
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:14px; border-radius:6px; margin-bottom:16px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px">
            <span class="chip green xs font-mono">HO STATUTORY CLEARANCE</span>
            <span class="chip gray xs">${prop.state}</span>
          </div>
          <b style="font-size:15px; color:var(--ink)">${prop.name}</b>
          <div class="small muted" style="margin-top:2px">Survey: ${prop.surveyNo} · Valuation: ${prop.valuation} · Outlet: ${prop.outlet}</div>
        </div>

        <div class="field">
          <label>Authorizing Legal Director / HO Signatory <span class="req">*</span></label>
          <div class="input-wrap">
            <input name="officerName" required value="${user.name || 'Priya Nair, Chief Legal Officer'}" placeholder="Director Name">
          </div>
        </div>

        <div class="field">
          <label>Clearance Certificate Notes & Title Opinion</label>
          <div class="input-wrap">
            <textarea name="notes" rows="3" placeholder="e.g. 20-year title deed flow fully established. All 5 stages of statutory verification completed without encumbrance. Cleared for sales and financial escrow."></textarea>
          </div>
        </div>

        <div class="notice" style="margin-bottom:16px">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>
            Approving clear title marks all 5 stepper stages as <b>Completed</b> and unlocks financial escrow and public sales marketing for this listing.
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn dark">Issue Clear Title Certificate</button>
        </div>
      </form>
    `);

    const form = document.getElementById('approvePropLegalForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const officer = fd.get('officerName') || user.name || "Chief Legal Officer";
        const notes = fd.get('notes') || "Full statutory and title deed clearance issued.";

        window.store.approvePropertyLegal(prop.id, officer, notes);
        window.modals.showToast(`Property "${prop.name}" granted full legal clear title!`);
        window.modals.close();
        if (window.router) window.router.navigate('legal');
      });
    }
  }

  openRejectPropertyLegalModal(propId) {
    const store = window.store;
    const prop = store.data.properties.find(p => p.id === propId);
    if (!prop) return;
    const user = (window.auth && window.auth.currentUser) || { name: "Adv. Priya Nair" };

    this.open(`
      <div class="modal-header">
        <h3 style="color:var(--red)">Reject Property Legal Clearance</h3>
        <button class="modal-close">✕</button>
      </div>
      <form id="rejectPropLegalForm">
        <div style="background:#fff5f5; border:1px solid #fecaca; padding:12px; border-radius:6px; margin-bottom:14px">
          <b style="font-size:14px; color:var(--ink)">${prop.name} (Survey: ${prop.surveyNo})</b>
          <div class="xs muted">${prop.location} · ${prop.state}</div>
        </div>

        <div class="field">
          <label>Reviewing Legal Officer <span class="req">*</span></label>
          <div class="input-wrap">
            <input name="officerName" required value="${user.name || 'Legal Officer'}" placeholder="Officer Name">
          </div>
        </div>

        <div class="field">
          <label>Comprehensive Legal Objection & Rejection Reason <span class="req">*</span></label>
          <div class="input-wrap">
            <textarea name="reason" required rows="4" placeholder="Detail the statutory discrepancies, survey number mismatch, or unsatisfied encumbrance preventing clearance."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn modal-cancel">Cancel</button>
          <button type="submit" class="btn" style="background:var(--red); color:#fff; border:none">
            Confirm Rejection & Flag Listing
          </button>
        </div>
      </form>
    `);

    const form = document.getElementById('rejectPropLegalForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const officer = fd.get('officerName') || user.name || "Legal Officer";
        const reason = fd.get('reason') || "Property title rejected due to statutory discrepancies.";

        window.store.rejectPropertyLegal(prop.id, officer, reason);
        window.modals.showToast(`Property "${prop.name}" flagged as Rejected. Outlet notified.`);
        window.modals.close();
        if (window.router) window.router.navigate('legal');
      });
    }
  }

  // ---------- UNIVERSAL SURVEY NUMBER & PROPERTY TITLE CHAIN SEARCH ----------
  openQuickSearch(defaultSurveyQuery = "") {
    const store = window.store;
    const properties = (store && store.data && store.data.properties) || [];
    let activeQuery = (defaultSurveyQuery || "").trim();

    // Default to matching or first property
    let selectedProp = properties[0];
    if (activeQuery) {
      const cleanVal = activeQuery.toLowerCase().replace(/^(sy\.?|survey\s*no\.?|survey)\s*/i, '').trim();
      const strippedVal = cleanVal.replace(/[^a-z0-9]/g, '');
      const match = properties.find(p => {
        const cleanS = (p.surveyNo || '').toLowerCase();
        return cleanS.includes(cleanVal) || 
          (strippedVal && cleanS.replace(/[^a-z0-9]/g, '').includes(strippedVal)) ||
          (p.name && p.name.toLowerCase().includes(cleanVal)) ||
          (p.id && p.id.toLowerCase().includes(cleanVal));
      });
      if (match) selectedProp = match;
    }

    const renderDossierHtml = (prop) => {
      if (!prop) {
        return `
          <div style="padding:40px 20px; text-align:center; color:var(--ink-3);">
            <p>No property matching this survey number found. Try searching for <code>123/2A</code>.</p>
          </div>
        `;
      }

      const firstOwner = prop.firstOwnerInfo || {
        originalOwner: "Government / Ancestral Allottee",
        acquisitionYear: "1994",
        parentDeedNo: "PARENT/DEED/001",
        sroOffice: "Sub-Registrar Office",
        extentArea: prop.area || "Demarcated Extent",
        surveyDemarcation: `Sy. No. ${prop.surveyNo}`,
        khataType: "Bhoomi RTC / Patta / 7/12",
        parentRemarks: "Original registered title flow."
      };

      const chain = prop.ownershipChain || [];

      return `
        <!-- Print-Only Official Legal Header -->
        <div class="print-only-header" style="display:none; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #14171A; padding-bottom:10px; margin-bottom:14px;">
          <div>
            <h2 style="margin:0; font-size:18px; font-weight:800; letter-spacing:0.04em; text-transform:uppercase; color:#14171A;">YOR ESTATE PLATFORM</h2>
            <p style="margin:2px 0 0 0; font-size:10.5px; color:#555;">Official Property Register · Chain of Title & Resale Verification Dossier</p>
          </div>
          <div style="text-align:right; font-size:10.5px; color:#444;">
            <div>Survey Reference: <b style="font-family:monospace; font-size:12.5px; color:#14171A;">${prop.surveyNo}</b></div>
            <div>Verification Date: <b>${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</b></div>
          </div>
        </div>

        <!-- Property Identity Banner -->
        <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r); padding:16px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="chip gold font-mono" style="font-weight:700; font-size:13px; padding:3px 10px;">
                Survey No: ${prop.surveyNo}
              </span>
              <span class="chip ${prop.legalStatus === 'Approved' ? 'green' : prop.legalStatus === 'In-Review' ? 'blue' : 'gray'} xs">
                ${prop.legalStatus || 'Verified'}
              </span>
              <span class="chip dark xs">${prop.type}</span>
            </div>
            <h3 style="margin:8px 0 2px 0; font-size:19px; color:var(--ink);">${prop.name}</h3>
            <div class="xs muted">
              <b>Location:</b> ${prop.location} (${prop.state}) · <b>Area:</b> ${prop.area} · <b>Outlet:</b> ${prop.outlet} · <b>ID:</b> <code>${prop.id}</code>
            </div>
          </div>

          <div style="text-align:right;">
            <div class="xs muted">Current Market Valuation</div>
            <div style="font-size:22px; font-weight:800; color:var(--green); font-family:var(--font-sans);">${prop.valuation}</div>
            <div class="xs muted" style="margin-top:2px;">${chain.length} Historical Transfers Traced</div>
          </div>
        </div>

        <!-- 1. FIRST OWNER & PARENT DEED GENESIS -->
        <div style="background:linear-gradient(135deg, #FBF8F1, #F4EEDF); border:1.5px solid var(--gold-border); border-radius:var(--r); padding:16px 18px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:var(--gold); color:#fff; font-size:11px; font-weight:700; padding:2px 8px; border-radius:var(--r-full); text-transform:uppercase;">
                Parent Title Genesis
              </span>
              <b style="font-size:14px; color:var(--gold-text);">First / Original Landowner Information</b>
            </div>
            <span class="xs font-mono muted">Acquisition Year: <b>${firstOwner.acquisitionYear}</b></span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; font-size:12.5px; margin-bottom:10px;">
            <div>
              <span class="muted xs" style="display:block;">Original Grantee / Landowner:</span>
              <b style="color:var(--ink); font-size:13px;">${firstOwner.originalOwner}</b>
            </div>
            <div>
              <span class="muted xs" style="display:block;">Parent Deed / Grant Order No:</span>
              <b class="font-mono" style="color:var(--ink);">${firstOwner.parentDeedNo}</b>
            </div>
            <div>
              <span class="muted xs" style="display:block;">Sub-Registrar Office (SRO):</span>
              <b style="color:var(--ink);">${firstOwner.sroOffice}</b>
            </div>
            <div>
              <span class="muted xs" style="display:block;">Demarcated Extent:</span>
              <b>${firstOwner.extentArea}</b>
            </div>
            <div>
              <span class="muted xs" style="display:block;">Survey & Boundary Demarcation:</span>
              <b class="font-mono">${firstOwner.surveyDemarcation}</b>
            </div>
            <div>
              <span class="muted xs" style="display:block;">Revenue Khata / Patta Type:</span>
              <b>${firstOwner.khataType}</b>
            </div>
          </div>

          <div class="xs muted" style="border-top:1px dashed var(--gold-border); padding-top:8px; margin-top:6px;">
            <b>Historical Genesis Notes:</b> ${firstOwner.parentRemarks}
          </div>
        </div>

        <!-- 2. COMPLETE OWNERSHIP & RESALE FLOW ("WHO PURCHASED WHEN, AND LATER ON WHAT HAPPENED") -->
        <div style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <h4 style="margin:0; font-size:15px; color:var(--ink);">
                Chain of Title & Transaction Flow (${chain.length} Stages)
              </h4>
              <p class="muted xs" style="margin:2px 0 0 0;">
                Full historical chronology of purchases, acquisitions, developments, and resales through YOR platform.
              </p>
            </div>
            <button class="btn sm gold gold-glow" onclick="window.modals.openRecordResaleModal('${prop.id}')">
              + Record Resale / Transfer
            </button>
          </div>

          <!-- Step Timeline -->
          <div class="survey-chain-timeline" style="display:flex; flex-direction:column; gap:12px; position:relative; padding-left:24px;">
            <div style="position:absolute; left:8px; top:12px; bottom:12px; width:2px; background:var(--gold-border);"></div>

            ${chain.map((step, idx) => {
              const isCurrent = step.status.includes('Current') || idx === chain.length - 1;
              const stepBadgeColor = isCurrent ? 'var(--green)' : 'var(--gold)';
              return `
                <div class="survey-chain-card" style="position:relative; background:var(--card); border:1px solid ${isCurrent ? 'var(--green-border)' : 'var(--line)'}; border-radius:var(--r-sm); padding:14px 16px; box-shadow:var(--shadow-sm);">
                  <!-- Circle node -->
                  <div style="position:absolute; left:-24px; top:16px; width:18px; height:18px; border-radius:50%; background:${stepBadgeColor}; border:3px solid #fff; box-shadow:0 0 0 1.5px ${stepBadgeColor};"></div>

                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                    <div>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="chip ${isCurrent ? 'green' : 'dark'} xs font-mono" style="font-weight:700;">
                          Step ${step.step}: ${step.year}
                        </span>
                        <b style="font-size:14px; color:var(--ink);">${step.type}</b>
                        <span class="chip ${isCurrent ? 'green' : 'gray'} xs">${step.status}</span>
                      </div>
                      <div class="xs muted" style="margin-top:4px;">
                        Executed on <b>${step.date}</b> · Platform: <b>${step.platform || 'YOR Secondary Resale'}</b>
                      </div>
                    </div>

                    <div style="text-align:right;">
                      <div class="xs muted">Transacted Price</div>
                      <b class="num" style="font-size:16px; color:${isCurrent ? 'var(--green)' : 'var(--ink)'};">${step.price}</b>
                    </div>
                  </div>

                  <!-- Parties & SRO Details -->
                  <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-xs); padding:10px 12px; font-size:12px; margin-bottom:8px;">
                    <div>
                      <span class="muted xs" style="display:block;">Transferor / Seller:</span>
                      <b style="color:var(--ink);">${step.seller}</b>
                    </div>
                    <div>
                      <span class="muted xs" style="display:block;">Transferee / Buyer:</span>
                      <b style="color:var(--ink);">${step.buyer}</b>
                    </div>
                    <div>
                      <span class="muted xs" style="display:block;">Broker / Agent:</span>
                      <b>${step.agent || 'Sarah Lim (Apex Realtors)'}</b>
                    </div>
                    <div>
                      <span class="muted xs" style="display:block;">Registered Deed No:</span>
                      <b class="font-mono text-sm">${step.regDocNo}</b>
                    </div>
                    <div>
                      <span class="muted xs" style="display:block;">SRO Jurisdiction:</span>
                      <b>${step.sro}</b>
                    </div>
                    <div>
                      <span class="muted xs" style="display:block;">Compliance Stamp:</span>
                      <span class="chip green xs">Nil-Encumbrance Verified</span>
                    </div>
                  </div>

                  <div class="xs muted">
                    <b>Transaction Record & Notes:</b> ${step.notes}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. STATUTORY COMPLIANCE & LEGAL CLEARANCES -->
        <div style="background:var(--card-2); border:1px solid var(--line); border-radius:var(--r-sm); padding:14px; margin-bottom:18px;">
          <h4 style="margin:0 0 10px 0; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; color:var(--ink-2);">
            Statutory Documents & Revenue Cross-Checks (${prop.docsCount || 6} Records)
          </h4>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; font-size:12px;">
            <div style="background:#fff; border:1px solid var(--line); padding:8px 10px; border-radius:var(--r-xs);">
              <div class="xs muted">30-Year Encumbrance Cert</div>
              <b style="color:var(--green)">✓ Nil EC Verified (1996-2026)</b>
            </div>
            <div style="background:#fff; border:1px solid var(--line); padding:8px 10px; border-radius:var(--r-xs);">
              <div class="xs muted">Revenue Record / RTC Extract</div>
              <b style="color:var(--green)">✓ Bhoomi Khata Matched</b>
            </div>
            <div style="background:#fff; border:1px solid var(--line); padding:8px 10px; border-radius:var(--r-xs);">
              <div class="xs muted">Bank APF Approvals</div>
              <b style="color:var(--green)">✓ SBI & HDFC Pre-Cleared</b>
            </div>
          </div>
        </div>

        <!-- Print-Only Official Footer -->
        <div class="print-only-footer" style="display:none; justify-content:space-between; align-items:center; border-top:1px solid #ccc; padding-top:8px; margin-top:16px; font-size:9pt; color:#666;">
          <span>Official YOR Legal Title Extract · Authenticated via SRO & Revenue Register Records</span>
          <span>Authentication Hash: YOR-SY-${(prop.surveyNo || 'REF').replace(/[^a-zA-Z0-9]/g, '-')}-VERIFIED</span>
        </div>
      `;
    };

    const modalHtml = `
      <div class="modal-header" style="padding-bottom:12px; border-bottom:1px solid var(--line);">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <h3 style="margin:0; font-size:18px;">🔍 Survey Number & Title Chain Dossier</h3>
            <span class="chip dark xs">Universal Property Lookup</span>
          </div>
          <p class="muted small" style="margin:2px 0 0 0;">
            Instant trace of parent deeds, historical acquisitions, and complete YOR resale chains.
          </p>
        </div>
        <button class="modal-close" onclick="window.modals.close()">✕</button>
      </div>

      <div style="padding:16px 0; max-height:80vh; overflow-y:auto;">
        <!-- Search Input Bar (Hidden during Print) -->
        <div class="survey-search-tools" style="margin-bottom:16px;">
          <div class="input-wrap" style="position:relative;">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--gold);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              id="universalSurveySearchInput" 
              placeholder="Search by Survey No (e.g. 123/2A), Property ID (e.g. PROP-001), or Name..."
              value="${activeQuery ? activeQuery : ''}"
              style="padding-left:40px; padding-right:36px; height:42px; font-size:14px; font-weight:600; border:1.5px solid var(--gold-border);"
            >
            <button 
              id="universalSurveyClearBtn"
              type="button"
              onclick="
                const inp = document.getElementById('universalSurveySearchInput');
                if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input')); inp.focus(); }
              "
              style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--ink-3); cursor:pointer; font-size:14px; display:${activeQuery ? 'flex' : 'none'}; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%;"
              title="Clear search"
            >✕</button>
          </div>
        </div>

        <!-- Dynamic Dossier Container -->
        <div id="surveyDossierContent">
          ${renderDossierHtml(selectedProp)}
        </div>
      </div>

      <div class="modal-foot" style="padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
        <div class="xs muted">
          Tip: Press <kbd style="background:var(--card-2); padding:2px 6px; border-radius:4px; border:1px solid var(--line); font-family:var(--font-mono)">Cmd+K</kbd> to open quick survey search from anywhere.
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn sm" onclick="window.modals.printDossier()" title="Print clean official summary dossier">🖨️ Print Dossier</button>
          <button class="btn sm dark" onclick="window.modals.close()">Done</button>
        </div>
      </div>
    `;

    // Internal helper for selecting a property by ID
    this.selectSurveyProp = (propId) => {
      const p = properties.find(x => x.id === propId || x.surveyNo === propId) || properties[0];
      if (!p) return;
      const input = document.getElementById('universalSurveySearchInput');
      const container = document.getElementById('surveyDossierContent');
      const clearBtn = document.getElementById('universalSurveyClearBtn');
      if (input) input.value = p.surveyNo;
      if (clearBtn) clearBtn.style.display = 'flex';
      if (container) container.innerHTML = renderDossierHtml(p);
    };

    this.open(modalHtml, true);

    // Bind real-time input typing & search matching
    setTimeout(() => {
      const input = document.getElementById('universalSurveySearchInput');
      const container = document.getElementById('surveyDossierContent');
      const clearBtn = document.getElementById('universalSurveyClearBtn');

      if (input && container) {
        input.focus();
        if (input.value) {
          input.select();
        }

        input.addEventListener('input', (e) => {
          const rawVal = e.target.value.trim();
          const val = rawVal.toLowerCase().replace(/^(sy\.?|survey\s*no\.?|survey)\s*/i, '').trim();
          const strippedVal = val.replace(/[^a-z0-9]/g, '');

          if (clearBtn) clearBtn.style.display = rawVal.length > 0 ? 'flex' : 'none';

          if (!val) {
            container.innerHTML = renderDossierHtml(properties[0]);
            return;
          }

          const matches = properties.filter(p => {
            const cleanId = (p.id || '').toLowerCase();
            const cleanSurvey = (p.surveyNo || '').toLowerCase();
            const cleanName = (p.name || '').toLowerCase();
            const cleanLoc = (p.location || '').toLowerCase();
            const cleanArea = (p.area || '').toLowerCase();
            const cleanOwner = (p.firstOwnerInfo?.originalOwner || '').toLowerCase();
            const cleanParentDeed = (p.firstOwnerInfo?.parentDeedNo || '').toLowerCase();
            const cleanResales = Array.isArray(p.ownershipChain) ? p.ownershipChain.some(s => (s.buyer || '').toLowerCase().includes(val) || (s.seller || '').toLowerCase().includes(val) || (s.regDocNo || '').toLowerCase().includes(val)) : false;

            return cleanId.includes(val) ||
              cleanSurvey.includes(val) ||
              (strippedVal && cleanSurvey.replace(/[^a-z0-9]/g, '').includes(strippedVal)) ||
              cleanName.includes(val) ||
              cleanLoc.includes(val) ||
              cleanArea.includes(val) ||
              cleanOwner.includes(val) ||
              cleanParentDeed.includes(val) ||
              cleanResales;
          });

          if (matches.length > 0) {
            let matchesHeader = '';
            if (matches.length > 1) {
              matchesHeader = `
                <div style="background:rgba(191,151,62,0.08); border:1px solid var(--gold-border); border-radius:var(--r-sm); padding:8px 12px; margin-bottom:12px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="xs muted" style="font-weight:700;">Matched ${matches.length} Properties:</span>
                  ${matches.map(m => `
                    <button class="chip xs font-mono ${m.id === matches[0].id ? 'gold' : 'gray'}" style="cursor:pointer;" onclick="window.modals.selectSurveyProp('${m.id}')">
                      ${m.id} · Sy. ${m.surveyNo} (${m.name})
                    </button>
                  `).join('')}
                </div>
              `;
            }
            container.innerHTML = matchesHeader + renderDossierHtml(matches[0]);
          } else {
            container.innerHTML = `
              <div style="padding:48px 20px; text-align:center; background:var(--card-2); border:1px dashed var(--line); border-radius:var(--r-sm); margin:12px 0;">
                <div style="font-size:28px; margin-bottom:8px;">🔍</div>
                <h4 style="margin:0 0 6px 0; font-size:16px; color:var(--ink);">No property matching "${rawVal}" found</h4>
                <p class="muted small" style="margin:0 0 16px 0;">Try searching by Property ID (e.g. <code>PROP-001</code>), Survey Number (e.g. <code>123/2A</code>), or Name.</p>
                <div style="display:flex; justify-content:center; gap:8px;">
                  <button class="btn sm gold" onclick="window.modals.selectSurveyProp('PROP-001')">View Default (PROP-001 / Sy. 123/2A)</button>
                </div>
              </div>
            `;
          }
        });
      }
    }, 60);
  }

  printDossier() {
    window.print();
  }

  // ---------- RECORD RESALE / PROPERTY TRANSFER MODAL ----------
  openRecordResaleModal(propIdOrSurvey) {
    const store = window.store;
    const properties = (store && store.data && store.data.properties) || [];
    const prop = properties.find(p => p.id === propIdOrSurvey || p.surveyNo === propIdOrSurvey) || properties[0];
    if (!prop) return;

    const chain = prop.ownershipChain || [];
    const lastStep = chain[chain.length - 1] || {};
    const defaultSeller = lastStep.buyer || prop.firstOwnerInfo?.originalOwner || "Current Registered Owner";

    const modalHtml = `
      <div class="modal-header">
        <div>
          <h3 style="margin:0;">+ Record Resale / Transfer via YOR Platform</h3>
          <p class="muted small" style="margin:2px 0 0 0;">
            Log secondary market resale transaction for <b>${prop.name}</b> (Survey: <code>${prop.surveyNo}</code>)
          </p>
        </div>
        <button class="modal-close" onclick="window.modals.close()">✕</button>
      </div>

      <form id="recordResaleForm" onsubmit="window.modals._handleRecordResaleSubmit('${prop.id}', this); return false;" style="padding:16px 0;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="field">
            <label>Transferor / Current Seller <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="seller" value="${defaultSeller}" required>
            </div>
          </div>

          <div class="field">
            <label>Transferee / New Buyer <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="buyer" placeholder="e.g. Dr. Anand Sharma / Horizon Capital" required>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">
          <div class="field">
            <label>Transaction Value (₹) <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="price" placeholder="e.g. ₹14.50 Cr" value="${prop.valuation}" required>
            </div>
          </div>

          <div class="field">
            <label>Registration Date <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="date" name="date" value="${new Date().toISOString().slice(0, 10)}" required>
            </div>
          </div>

          <div class="field">
            <label>Transfer Type <span class="req">*</span></label>
            <div class="select-wrap">
              <select name="type">
                <option value="Resale via YOR Secondary Desk">Resale via YOR Secondary Desk</option>
                <option value="Private HNW Syndicate Sale">Private HNW Syndicate Sale</option>
                <option value="Direct Title Conveyance">Direct Title Conveyance</option>
                <option value="Family Succession / Partition">Family Succession / Partition</option>
              </select>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="field">
            <label>Registered Sale Deed No. / Token <span class="req">*</span></label>
            <div class="input-wrap">
              <input type="text" name="regDocNo" placeholder="e.g. SRO/DEV/9914/2026" required>
            </div>
          </div>

          <div class="field">
            <label>Sub-Registrar Office (SRO)</label>
            <div class="input-wrap">
              <input type="text" name="sro" value="${prop.location} SRO" placeholder="e.g. Devanahalli SRO">
            </div>
          </div>
        </div>

        <div class="field">
          <label>Facilitating Broker / Agent</label>
          <div class="input-wrap">
            <input type="text" name="agent" value="Sarah Lim (Apex Luxury Realtors)" placeholder="e.g. Sarah Lim">
          </div>
        </div>

        <div class="field">
          <label>Transaction Notes & Encumbrance Clearance</label>
          <div class="input-wrap">
            <textarea name="notes" rows="2" placeholder="Detail mutation status, Kaveri 2.0 EC verification, token advance, or loan settlement."></textarea>
          </div>
        </div>

        <div class="modal-foot" style="margin-top:16px; padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn" onclick="window.modals.close()">Cancel</button>
          <button type="submit" class="btn dark gold-glow">+ Record Title Transfer</button>
        </div>
      </form>
    `;

    this._handleRecordResaleSubmit = (pId, formEl) => {
      const fd = new FormData(formEl);
      const resaleData = {
        seller: fd.get('seller'),
        buyer: fd.get('buyer'),
        price: fd.get('price'),
        date: new Date(fd.get('date')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        year: new Date(fd.get('date')).getFullYear().toString(),
        type: fd.get('type'),
        regDocNo: fd.get('regDocNo'),
        sro: fd.get('sro'),
        agent: fd.get('agent'),
        notes: fd.get('notes') || "Resold through YOR Estate platform."
      };

      const res = window.store.recordPropertyResale(pId, resaleData);
      window.modals.close();
      if (res) {
        window.modals.showToast(`Resale recorded for Survey ${res.property.surveyNo}! Title chain updated.`);
        // Re-open dossier to show updated flow
        setTimeout(() => {
          this.openQuickSearch(res.property.surveyNo);
        }, 200);
      }
    };

    this.open(modalHtml, false);
  }
}

window.modals = new ModalController();


