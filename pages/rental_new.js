/* ==========================================================================
   YOR Estate - Dedicated Sliding Rental & Sublease Onboarding Wizard
   Classic Luxury Sliding Drawer Interface
   ========================================================================== */

// Store for uploaded images during wizard session
window._rentalUploadedImages = window._rentalUploadedImages || [
  { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", name: "Penthouse Facade", isCover: true },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", name: "Living Lounge", isCover: false },
  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80", name: "Master Suite", isCover: false }
];

// Dynamic Room & Bed Configuration State for Sublease Flat Leases
window._subleaseWizardRooms = window._subleaseWizardRooms || [
  {
    id: "room_1",
    name: "Room 1: Master Executive Suite",
    type: "Twin Sharing (2 Beds)",
    ac: true,
    attachedBath: true,
    beds: [
      { id: "bed_1a", bedNo: "Bed 1A", rent: 12500, deposit: 25000, status: "Vacant", occupant: "" },
      { id: "bed_1b", bedNo: "Bed 1B", rent: 12500, deposit: 25000, status: "Vacant", occupant: "" }
    ]
  },
  {
    id: "room_2",
    name: "Room 2: Deluxe Corner Wing",
    type: "Triple Sharing (3 Beds)",
    ac: true,
    attachedBath: true,
    beds: [
      { id: "bed_2a", bedNo: "Bed 2A", rent: 9500, deposit: 19000, status: "Vacant", occupant: "" },
      { id: "bed_2b", bedNo: "Bed 2B", rent: 9500, deposit: 19000, status: "Vacant", occupant: "" },
      { id: "bed_2c", bedNo: "Bed 2C", rent: 9500, deposit: 19000, status: "Vacant", occupant: "" }
    ]
  },
  {
    id: "room_3",
    name: "Room 3: Balcony Suite",
    type: "Twin Sharing (2 Beds)",
    ac: true,
    attachedBath: false,
    beds: [
      { id: "bed_3a", bedNo: "Bed 3A", rent: 11000, deposit: 22000, status: "Vacant", occupant: "" },
      { id: "bed_3b", bedNo: "Bed 3B", rent: 11000, deposit: 22000, status: "Vacant", occupant: "" }
    ]
  }
];

function renderRentalNewPage() {
  setTimeout(() => {
    window.router.navigate('rentals', false);
    if (window.rentalWizard && window.rentalWizard.openSlidingPage) {
      window.rentalWizard.openSlidingPage('rental');
    }
  }, 10);
  return renderRentalsPage();
}

// Reusable Form HTML Generator for both Full Page & Sliding Panel
function renderRentalCreationFormHtml(isSlidingDrawer = true) {
  const store = window.store;
  const outlets = (store && store.data && store.data.outlets) || [];
  const currentMode = window._rentalWizardMode || 'rental'; // 'rental' | 'sublease' | 'assign-bed'

  return `
    <!-- Top Header Bar & Stepper inside Dedicated Sticky Wrapper -->
    <div class="drawer-header-sticky-wrap">
      <div class="user-wizard-top">
        <div class="user-wizard-title-wrap">
          <div class="user-wizard-crumbs">
            <a href="#rentals" onclick="window.rentalWizard.closeSlidingPage(); return false;">Rental Portfolio OS</a>
            <span>/</span>
            <span>${currentMode === 'sublease' ? 'Add Sublease Property' : currentMode === 'assign-bed' ? 'Tenant Bed Allocation' : 'Add Rental Property'}</span>
          </div>
          <h1>
            ${currentMode === 'sublease' 
              ? '+ Add Sublease Property & Hostel Hub' 
              : currentMode === 'assign-bed' 
              ? '👤 Onboard Tenant & Allocate Bed Slot' 
              : '+ Add Rental Property'}
          </h1>
          <p>
            ${currentMode === 'sublease'
              ? 'Configure master apartment lease from landlord, setup custom rooms and bed rates, and calculate live profit spread margins.'
              : currentMode === 'assign-bed'
              ? 'Assign verified tenant to specific hostel bed, configure rent advance, and attach KYC proof.'
              : 'Add residential or commercial rental listing with verified specifications, pricing, deposit terms, and visual photo gallery.'}
          </p>
        </div>

        <div class="user-wizard-top-actions">
          <button class="btn sm" id="btnFillRentalDemo" onclick="window.rentalWizard.fillDemoData()" title="Pre-fill with realistic luxury data">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Fill Demo Data
          </button>
          <button class="btn sm" id="btnSaveRentalDraft" onclick="window.rentalWizard.saveDraft()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Draft
          </button>
          <button class="btn" onclick="window.rentalWizard.closeSlidingPage()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
          <button class="btn dark gold-glow" onclick="window.rentalWizard.submitRental()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            ${currentMode === 'sublease' ? 'Save & Add Sublease Property' : currentMode === 'assign-bed' ? 'Confirm Allocation' : 'Save & Add Rental Property'}
          </button>
        </div>
      </div>

      <!-- Mode Selector Pills -->
      <div style="display:flex; gap:10px; margin-top:14px; padding-top:10px; border-top:1px solid var(--line)">
        <button class="rental-tab-btn ${currentMode === 'rental' ? 'active' : ''}" onclick="window.rentalWizard.setMode('rental')">
          🏢 Standard Rental Property (Whole Flat / Villa / Office)
        </button>
        <button class="rental-tab-btn ${currentMode === 'sublease' ? 'active' : ''}" onclick="window.rentalWizard.setMode('sublease')">
          🛏️ Master Flat Lease -> Hostel & Co-Living Sublease Hub
        </button>
      </div>
    </div>

    <!-- Main Wizard Form & Live Interactive Preview Grid -->
    <div class="user-wizard-grid" style="margin-top:20px">
      
      <!-- Left Column: Structured Form Fields -->
      <div class="user-wizard-form-col">
        <form id="rentalWizardForm" onsubmit="event.preventDefault(); window.rentalWizard.submitRental();">
          
          ${currentMode === 'sublease' ? renderSubleaseWizardFields(outlets) : renderStandardRentalWizardFields(outlets)}

        </form>
      </div>

      <!-- Right Column: Sticky Live Interactive Showcase Preview & Spread Calculator -->
      <div class="user-wizard-preview-col">
        <div class="sticky-preview-wrapper" style="position:sticky; top:200px">
          
          ${currentMode === 'sublease' ? renderSubleaseSpreadLivePreview() : renderPropertyShowcaseLivePreview()}

        </div>
      </div>

    </div>
  `;
}

/* --------------------------------------------------------------------------
   STANDARD RENTAL WIZARD FORM FIELDS
   -------------------------------------------------------------------------- */
function renderStandardRentalWizardFields(outlets) {
  const images = window._rentalUploadedImages || [];

  return `
    <!-- Section 1: Property Identity -->
    <div class="card" style="margin-bottom:16px; padding:20px">
      <div class="ch" style="margin-bottom:14px">
        <div>
          <h3>1. Property Identity & Location</h3>
          <p>Key property identifiers, branch mapping, and micro-market location</p>
        </div>
        <span class="chip gold xs font-mono">Step 1</span>
      </div>

      <div class="field">
        <label>Property Name & Unit Number <span class="req">*</span></label>
        <div class="input-wrap">
          <input type="text" id="rw_property" name="property" required placeholder="e.g. Marina Heights Tower - Unit 1402" value="The Imperial Azure Penthouse 2401" oninput="window.rentalWizard.syncLivePreview()">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
        <div class="field">
          <label>Outlet / Managing Branch <span class="req">*</span></label>
          <div class="select-wrap">
            <select id="rw_outlet" name="outlet" onchange="window.rentalWizard.syncLivePreview()">
              ${outlets.map(o => `<option value="${o.name}">${o.name} (${o.location || 'Branch'})</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Category</label>
          <div class="select-wrap">
            <select id="rw_category" name="category" onchange="window.rentalWizard.syncLivePreview()">
              <option value="Sky Penthouse">Sky Penthouse</option>
              <option value="Luxury Apartment">Luxury Apartment</option>
              <option value="Standalone Garden Villa">Standalone Garden Villa</option>
              <option value="Commercial Suite">Commercial Suite</option>
              <option value="Corporate Office Floor">Corporate Office Floor</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label>Location & Micro-Market Address <span class="req">*</span></label>
        <div class="input-wrap">
          <input type="text" id="rw_location" name="location" required placeholder="e.g. Marine Drive, Kochi, Kerala" value="Marine Drive Waterfront, Kochi" oninput="window.rentalWizard.syncLivePreview()">
        </div>
      </div>
    </div>

    <!-- Section 2: Pricing, Deposit & Lease Term -->
    <div class="card" style="margin-bottom:16px; padding:20px">
      <div class="ch" style="margin-bottom:14px">
        <div>
          <h3>2. Financial Terms & Lease Period</h3>
          <p>Monthly rent target, advance security deposit, and tenancy dates</p>
        </div>
        <span class="chip gold xs font-mono">Step 2</span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px">
        <div class="field">
          <label>Monthly Rent (₹) <span class="req">*</span></label>
          <div class="input-wrap">
            <input type="text" id="rw_rent" name="rent" required placeholder="e.g. ₹75,000" value="₹75,000" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
        <div class="field">
          <label>Security Deposit (₹)</label>
          <div class="input-wrap">
            <input type="text" id="rw_deposit" name="deposit" placeholder="e.g. ₹3,00,000" value="₹3,00,000" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
        <div class="field">
          <label>Maintenance Fee</label>
          <div class="input-wrap">
            <input type="text" id="rw_maintenance" name="maintenance" value="₹5,500 / mo" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px">
        <div class="field">
          <label>Configuration / Area</label>
          <div class="input-wrap">
            <input type="text" id="rw_bhk" name="bhk" value="3 BHK (2,100 sq.ft)" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
        <div class="field">
          <label>Furnishing Status</label>
          <div class="select-wrap">
            <select id="rw_furnishing" name="furnishing" onchange="window.rentalWizard.syncLivePreview()">
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Lease Term Expiry <span class="req">*</span></label>
          <div class="input-wrap">
            <input type="date" id="rw_leaseEnd" name="leaseEnd" value="2027-12-31" style="font-family:var(--font-sans); font-size:12.5px;">
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Property Photo Gallery (Pure Upload - No Link Setup) -->
    <div class="card" style="margin-bottom:16px; padding:20px">
      <div class="ch" style="margin-bottom:14px">
        <div>
          <h3>3. Property Photo Gallery & Visual Media</h3>
          <p>Upload high-resolution property photos from your device</p>
        </div>
        <span class="chip green xs font-mono">Upload Photos</span>
      </div>

      <!-- Pure Drag & Drop Photo Upload Zone -->
      <div class="field">
        <label>Upload Property Images <span class="req">*</span></label>
        <div class="property-image-upload-zone" id="rwImageDropzone" onclick="document.getElementById('rwImageFileInput').click()">
          <input type="file" id="rwImageFileInput" accept="image/*" multiple style="display:none" onchange="window.rentalWizard.handleImageUpload(event)">
          <div class="upload-icon-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <b style="font-size:13.5px; color:var(--ink)">Click to upload property images or drag & drop files here</b>
          <span style="font-size:12px; color:var(--ink-2)">Supports JPG, PNG, WEBP — select multiple interior and exterior photos</span>
          <button type="button" class="btn sm" style="margin-top:4px; pointer-events:none">Browse Local Files</button>
        </div>

        <!-- Uploaded Images Gallery -->
        <div id="rwUploadedGalleryContainer">
          ${renderUploadedImagesGallery(images)}
        </div>
      </div>

      <div class="field" style="margin-top:14px">
        <label>Verified Amenities & Features</label>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:6px">
          ${['High-speed WiFi (300 Mbps)', 'Covered EV Parking', 'Swimming Pool', '24/7 Security & CCTV', 'Full Power Backup', 'Private Balcony Deck'].map(a => `
            <label class="check" style="font-size:11.5px; background:var(--card-2); padding:6px 10px; border-radius:6px; border:1px solid var(--line)">
              <input type="checkbox" name="amenities" value="${a}" checked onchange="window.rentalWizard.syncLivePreview()">
              <span>${a}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderUploadedImagesGallery(images) {
  if (!images || images.length === 0) {
    return ``;
  }
  return `
    <div class="property-uploaded-gallery">
      ${images.map((img, idx) => `
        <div class="property-uploaded-item">
          <img src="${img.url}" alt="${img.name}">
          ${img.isCover ? `<span class="cover-badge">★ Cover Photo</span>` : `
            <button type="button" class="btn xs" style="position:absolute; bottom:6px; left:6px; right:6px; font-size:10px; padding:2px; background:rgba(0,0,0,0.75); color:#FFF; border:0" onclick="window.rentalWizard.setCoverImage(${idx})">Set as Cover</button>
          `}
          <button type="button" class="delete-btn" onclick="window.rentalWizard.removeUploadedImage(${idx})" title="Remove photo">✕</button>
        </div>
      `).join('')}
    </div>
  `;
}

/* --------------------------------------------------------------------------
   SUBLEASE & HOSTEL WIZARD: DYNAMIC ROOMS & BED ALLOCATION BUILDER
   -------------------------------------------------------------------------- */
function renderSubleaseWizardFields(outlets) {
  const rooms = window._subleaseWizardRooms || [];

  return `
    <!-- Section 1: Master Lease Details -->
    <div class="card" style="margin-bottom:16px; padding:20px">
      <div class="ch" style="margin-bottom:14px">
        <div>
          <h3>1. Master Apartment Lease from Landlord</h3>
          <p>Lease agreement with property owner, Sublease NOC compliance, and master rent outflow</p>
        </div>
        <span class="chip gold xs font-mono">Master Lease</span>
      </div>

      <div class="field">
        <label>Master Apartment / Property Name <span class="req">*</span></label>
        <div class="input-wrap">
          <input type="text" id="sw_property" name="property" required placeholder="e.g. The Lennox Tower - Flat 501" value="The Lennox Tower - Flat 501" oninput="window.rentalWizard.syncLivePreview()">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
        <div class="field">
          <label>Outlet Branch</label>
          <div class="select-wrap">
            <select id="sw_outlet" name="outlet">
              ${outlets.map(o => `<option value="${o.name}">${o.name} (${o.location || 'Branch'})</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Location & City</label>
          <div class="input-wrap">
            <input type="text" id="sw_location" name="location" value="Beach Road, Kozhikode, Kerala" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
        <div class="field">
          <label>Landlord / Property Owner <span class="req">*</span></label>
          <div class="input-wrap">
            <input type="text" id="sw_landlord" name="landlord" value="Dr. K. Varma (Landlord)" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
        <div class="field">
          <label>Landlord Phone / WhatsApp</label>
          <div class="input-wrap">
            <input type="text" id="sw_landlordPhone" name="landlordPhone" value="+91 98409 11223">
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px">
        <div class="field">
          <label>Master Rent Outflow (₹/mo) <span class="req">*</span></label>
          <div class="input-wrap">
            <input type="text" id="sw_masterRent" name="masterRent" value="₹45,000" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
        <div class="field">
          <label>Master Advance Deposit (₹)</label>
          <div class="input-wrap">
            <input type="text" id="sw_masterDeposit" name="masterDeposit" value="₹1,50,000">
          </div>
        </div>
        <div class="field">
          <label>Est. Utilities Overhead (₹/mo)</label>
          <div class="input-wrap">
            <input type="text" id="sw_utility" name="utilityExpenseEst" value="₹6,000" oninput="window.rentalWizard.syncLivePreview()">
          </div>
        </div>
      </div>

      <div class="field">
        <label>Landlord Sublease NOC Certificate Reference #</label>
        <div class="input-wrap">
          <input type="text" id="sw_nocDocRef" name="nocDocRef" value="NOC-VRM-2026-05">
        </div>
      </div>
    </div>

    <!-- Section 2: Dynamic Room & Bed Sublease Allocator Studio -->
    <div class="card" style="margin-bottom:16px; padding:20px">
      <div class="ch" style="margin-bottom:14px">
        <div>
          <h3>2. Room Configuration & Bed Sublease Allocator</h3>
          <p>Configure room types, add/remove beds, and set individual monthly rent rates & security deposits</p>
        </div>
        <span class="chip blue xs font-mono">Dynamic Studio</span>
      </div>

      <!-- Dynamic Rooms List -->
      <div class="sublease-room-builder-list" id="subleaseRoomBuilderList">
        ${renderRoomBuilderCards(rooms)}
      </div>

      <!-- Add New Room Button -->
      <div class="add-room-btn-banner" onclick="window.rentalWizard.addRoom()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        + Add Another Room to Flat Lease
      </div>
    </div>
  `;
}

function renderRoomBuilderCards(rooms) {
  if (!rooms || rooms.length === 0) {
    return `
      <div style="text-align:center; padding:24px; background:var(--card-2); border-radius:var(--r-sm)">
        <p class="muted">No rooms configured yet. Click below to add your first room.</p>
      </div>
    `;
  }

  return rooms.map((room, rIdx) => `
    <div class="room-builder-card" id="room_card_${room.id}">
      
      <!-- Room Header & Controls -->
      <div class="room-builder-head">
        <div class="room-builder-title-group">
          <span class="chip dark xs font-mono">Room ${rIdx + 1}</span>
          <input type="text" class="room-builder-title-input" value="${room.name}" placeholder="e.g. Master Executive Suite" oninput="window.rentalWizard.updateRoomName('${room.id}', this.value)">
        </div>

        <div class="room-builder-controls">
          <!-- Sharing Type Dropdown -->
          <div class="select-wrap" style="min-height:30px">
            <select style="height:30px; font-size:11.5px; border:0; background:transparent" onchange="window.rentalWizard.changeRoomSharingType('${room.id}', this.value)">
              <option value="Single Private (1 Bed)" ${room.type.includes('Single') ? 'selected' : ''}>Single Private (1 Bed)</option>
              <option value="Twin Sharing (2 Beds)" ${room.type.includes('Twin') ? 'selected' : ''}>Twin Sharing (2 Beds)</option>
              <option value="Triple Sharing (3 Beds)" ${room.type.includes('Triple') ? 'selected' : ''}>Triple Sharing (3 Beds)</option>
              <option value="Four Sharing (4 Beds)" ${room.type.includes('Four') ? 'selected' : ''}>Four Sharing (4 Beds)</option>
            </select>
          </div>

          <label class="check" style="font-size:11px; margin:0">
            <input type="checkbox" ${room.ac ? 'checked' : ''} onchange="window.rentalWizard.toggleRoomFeature('${room.id}', 'ac', this.checked)">
            <span>AC</span>
          </label>

          <label class="check" style="font-size:11px; margin:0">
            <input type="checkbox" ${room.attachedBath ? 'checked' : ''} onchange="window.rentalWizard.toggleRoomFeature('${room.id}', 'attachedBath', this.checked)">
            <span>Attached Bath</span>
          </label>

          <button type="button" class="btn xs" style="color:var(--red); padding:3px 8px" onclick="window.rentalWizard.removeRoom('${room.id}')" title="Delete Room">✕ Delete</button>
        </div>
      </div>

      <!-- Beds Configuration Grid -->
      <div class="bed-builder-grid">
        ${(room.beds || []).map((bed, bIdx) => `
          <div class="bed-builder-card">
            <div class="bed-builder-head">
              <span class="bed-builder-label">${bed.bedNo}</span>
              <button type="button" style="background:none; border:0; color:var(--ink-3); cursor:pointer; font-size:11px" onclick="window.rentalWizard.removeBed('${room.id}', '${bed.id}')" title="Remove Bed">✕</button>
            </div>

            <!-- Monthly Rent Input -->
            <div>
              <label style="font-size:10.5px; color:var(--ink-2); display:block; margin-bottom:2px">Monthly Rent (₹)</label>
              <div class="bed-rate-input-wrap">
                <span style="font-size:11.5px; font-weight:700; color:var(--ink-2); margin-right:4px">₹</span>
                <input type="number" step="500" value="${bed.rent}" placeholder="10000" oninput="window.rentalWizard.updateBedRate('${room.id}', '${bed.id}', 'rent', this.value)">
                <span style="font-size:10.5px; color:var(--ink-3); margin-left:4px">/mo</span>
              </div>
            </div>

            <!-- Security Deposit Input -->
            <div>
              <label style="font-size:10.5px; color:var(--ink-2); display:block; margin-bottom:2px">Deposit Advance (₹)</label>
              <div class="bed-rate-input-wrap">
                <span style="font-size:11.5px; font-weight:700; color:var(--ink-2); margin-right:4px">₹</span>
                <input type="number" step="1000" value="${bed.deposit}" placeholder="20000" oninput="window.rentalWizard.updateBedRate('${room.id}', '${bed.id}', 'deposit', this.value)">
              </div>
            </div>

            <!-- Initial Occupancy Status -->
            <div style="margin-top:2px">
              <select style="width:100%; height:26px; font-size:11px; border:1px solid var(--line); border-radius:4px; background:#FFF" onchange="window.rentalWizard.updateBedStatus('${room.id}', '${bed.id}', this.value)">
                <option value="Vacant" ${bed.status === 'Vacant' ? 'selected' : ''}>🟢 Vacant (Ready to List)</option>
                <option value="Occupied" ${bed.status === 'Occupied' ? 'selected' : ''}>👤 Occupied</option>
              </select>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Add Bed inside this Room -->
      <div style="margin-top:10px; display:flex; justify-content:flex-end">
        <button type="button" class="btn xs gold" id="btn_add_bed_${room.id}" onclick="window.rentalWizard.addBedToRoom('${room.id}')" style="font-size:11px">+ Add Bed to ${room.name}</button>
      </div>

    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   RIGHT COLUMN: LIVE PROPERTY SHOWCASE PREVIEW
   -------------------------------------------------------------------------- */
function renderPropertyShowcaseLivePreview() {
  const images = window._rentalUploadedImages || [];
  const coverImg = images.find(img => img.isCover) || images[0] || { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" };

  return `
    <div class="card" style="padding:18px; border-color:var(--gold-border); background:#FCFAF5">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
        <span class="xs font-mono" style="color:var(--gold-text)">✨ Property Showcase Preview</span>
        <span class="chip green xs">Live Preview</span>
      </div>

      <div class="phone-property-card" style="box-shadow:var(--shadow)">
        <img id="prev_image" src="${coverImg.url}" alt="Preview" style="height:160px">
        <div class="phone-property-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <span class="phone-price-badge" id="prev_rent">₹75,000 <small>/ mo</small></span>
            <span class="chip green xs" id="prev_pub_badge">Published</span>
          </div>

          <b style="font-size:13.5px; color:#111827; line-height:1.3" id="prev_title">The Imperial Azure Penthouse 2401</b>
          <p style="font-size:11px; color:#6B7280; margin:0" id="prev_location">📍 Marine Drive Waterfront, Kochi</p>

          <div style="display:flex; gap:6px; margin:4px 0">
            <span style="background:#F3F4F6; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600" id="prev_bhk">3 BHK (2,100 sq.ft)</span>
            <span style="background:#F3F4F6; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600" id="prev_furnishing">Fully Furnished</span>
          </div>

          <button class="phone-cta-btn" style="padding:8px; font-size:12px; margin-top:6px">
            📅 Schedule Property Walkthrough
          </button>
        </div>
      </div>

      <div style="margin-top:12px; font-size:11px; color:var(--ink-2); text-align:center">
        This preview reflects the public listing showcase rendered for prospective clients and tenant portals.
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   RIGHT COLUMN: DYNAMIC SUBLEASE SPREAD PROFIT PREVIEW
   -------------------------------------------------------------------------- */
function renderSubleaseSpreadLivePreview() {
  const rooms = window._subleaseWizardRooms || [];
  
  let totalBeds = 0;
  let totalInflow = 0;
  rooms.forEach(r => {
    (r.beds || []).forEach(b => {
      totalBeds++;
      totalInflow += (parseInt(b.rent, 10) || 0);
    });
  });

  const masterRentInput = document.getElementById('sw_masterRent');
  const utilityInput = document.getElementById('sw_utility');

  const masterRentNum = masterRentInput ? parseCurrencyInput(masterRentInput.value) : 45000;
  const utilityNum = utilityInput ? parseCurrencyInput(utilityInput.value) : 6000;

  const netSpread = totalInflow - masterRentNum - utilityNum;
  const totalCost = masterRentNum + utilityNum;
  const yieldPct = totalCost > 0 ? Math.round((netSpread / totalCost) * 100) : 0;

  return `
    <div class="card" style="padding:18px; border-color:var(--gold-border); background:#14171A; color:#FFFFFF">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
        <span class="xs font-mono" style="color:var(--gold)">📈 Profit Spread Engine</span>
        <span class="chip gold xs">Live Model</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px">
        
        <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid #2E363E">
          <span style="font-size:12px; color:#9CA3AF">Master Rent to Landlord</span>
          <b style="font-size:13px; color:#EF4444" id="prev_sub_master">-₹${masterRentNum.toLocaleString()} / mo</b>
        </div>

        <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid #2E363E">
          <span style="font-size:12px; color:#9CA3AF">Est. Utilities & Overhead</span>
          <b style="font-size:13px; color:#EF4444" id="prev_sub_util">-₹${utilityNum.toLocaleString()} / mo</b>
        </div>

        <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid #2E363E">
          <span style="font-size:12px; color:#9CA3AF">Sublease Inflow (${totalBeds} Beds)</span>
          <b style="font-size:13px; color:#60A5FA" id="prev_sub_inflow">+₹${totalInflow.toLocaleString()} / mo</b>
        </div>

        <div style="background:rgba(34, 197, 94, 0.15); border:1px solid rgba(34, 197, 94, 0.3); border-radius:8px; padding:12px; margin-top:4px">
          <span style="font-size:11px; color:#86EFAC; text-transform:uppercase; font-weight:700">Net Monthly Spread Profit</span>
          <b style="font-size:22px; color:#4ADE80; display:block; margin-top:2px" id="prev_sub_net">${netSpread >= 0 ? '+' : ''}₹${netSpread.toLocaleString()} <small style="font-size:12px">/ mo</small></b>
          <span style="font-size:11px; color:#BBF7D0" id="prev_sub_roi">Return on Master Outflow: <b>${yieldPct >= 0 ? '+' : ''}${yieldPct}% Net Yield</b></span>
        </div>

      </div>

      <div style="margin-top:14px; font-size:11px; color:#9CA3AF; text-align:center">
        Landlord NOC clause automatically attached for full legal compliance.
      </div>
    </div>
  `;
}

function parseCurrencyInput(val) {
  if (!val) return 0;
  const clean = String(val).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/* ==========================================================================
   RENTAL WIZARD SLIDING CONTROLLER
   ========================================================================== */

window.rentalWizard = {
  openSlidingPage(mode = 'rental') {
    window._rentalWizardMode = mode;
    let drawerOverlay = document.getElementById('rentalSlidingDrawerOverlay');
    if (!drawerOverlay) {
      drawerOverlay = document.createElement('div');
      drawerOverlay.id = 'rentalSlidingDrawerOverlay';
      drawerOverlay.className = 'rental-sliding-drawer-overlay';
      drawerOverlay.innerHTML = `
        <div class="rental-sliding-drawer-backdrop" onclick="window.rentalWizard.closeSlidingPage()"></div>
        <div class="rental-sliding-drawer-panel" id="rentalSlidingDrawerPanel"></div>
      `;
      document.body.appendChild(drawerOverlay);
    }

    const panel = document.getElementById('rentalSlidingDrawerPanel');
    drawerOverlay.classList.remove('open');
    panel.innerHTML = renderRentalCreationFormHtml(true);
    panel.scrollTop = 0;
    panel.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    this.bindDragDrop();
    this.syncLivePreview();

    // Trigger smooth slide in
    void drawerOverlay.offsetWidth;
    void panel.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drawerOverlay.classList.add('open');
        panel.scrollTop = 0;
      });
    });
  },

  closeSlidingPage() {
    const drawerOverlay = document.getElementById('rentalSlidingDrawerOverlay');
    if (drawerOverlay && drawerOverlay.classList.contains('open')) {
      drawerOverlay.classList.remove('open');
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 660);
    }
  },

  setMode(mode) {
    window._rentalWizardMode = mode;
    const panel = document.getElementById('rentalSlidingDrawerPanel');
    if (panel) {
      panel.innerHTML = renderRentalCreationFormHtml(true);
      panel.scrollTop = 0;
      this.bindDragDrop();
      this.syncLivePreview();
    }
  },

  bindDragDrop() {
    const dropzone = document.getElementById('rwImageDropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        this.processFiles(files);
      }
    }, false);
  },

  handleImageUpload(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  },

  processFiles(files) {
    const images = window._rentalUploadedImages || [];
    let processed = 0;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const isFirst = images.length === 0;
        images.push({
          url: dataUrl,
          name: file.name,
          isCover: isFirst
        });
        processed++;
        if (processed >= files.length) {
          this.refreshGallery();
          this.syncLivePreview();
          window.modals.showToast(`${processed} property photo(s) uploaded!`);
        }
      };
      reader.readAsDataURL(file);
    });
  },

  refreshGallery() {
    const container = document.getElementById('rwUploadedGalleryContainer');
    if (container) {
      container.innerHTML = renderUploadedImagesGallery(window._rentalUploadedImages);
    }
  },

  removeUploadedImage(index) {
    const images = window._rentalUploadedImages || [];
    if (index >= 0 && index < images.length) {
      const removed = images.splice(index, 1);
      if (removed[0]?.isCover && images.length > 0) {
        images[0].isCover = true;
      }
      this.refreshGallery();
      this.syncLivePreview();
      window.modals.showToast("Photo removed.");
    }
  },

  setCoverImage(index) {
    const images = window._rentalUploadedImages || [];
    images.forEach((img, i) => {
      img.isCover = (i === index);
    });
    this.refreshGallery();
    this.syncLivePreview();
    window.modals.showToast("Set as primary cover photo!");
  },

  /* ---------- DYNAMIC SUBLEASE ROOM & BED STUDIO CONTROLLER ---------- */
  addRoom() {
    const rooms = window._subleaseWizardRooms || [];
    const rNum = rooms.length + 1;
    const newRoomId = `room_${Date.now()}`;
    
    rooms.push({
      id: newRoomId,
      name: `Room ${rNum}: Executive Bedroom`,
      type: "Twin Sharing (2 Beds)",
      ac: true,
      attachedBath: true,
      beds: [
        { id: `bed_${Date.now()}_1`, bedNo: `Bed ${rNum}A`, rent: 11000, deposit: 22000, status: "Vacant", occupant: "" },
        { id: `bed_${Date.now()}_2`, bedNo: `Bed ${rNum}B`, rent: 11000, deposit: 22000, status: "Vacant", occupant: "" }
      ]
    });

    this.refreshRoomBuilder();
    this.syncLivePreview();
    window.modals.showToast(`Added Room ${rNum} with 2 bed slots!`);
  },

  removeRoom(roomId) {
    const rooms = window._subleaseWizardRooms || [];
    const idx = rooms.findIndex(r => r.id === roomId);
    if (idx >= 0) {
      rooms.splice(idx, 1);
      this.refreshRoomBuilder();
      this.syncLivePreview();
      window.modals.showToast("Room removed from flat lease.");
    }
  },

  updateRoomName(roomId, name) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room.name = name;
      const btn = document.getElementById(`btn_add_bed_${roomId}`);
      if (btn) {
        btn.textContent = `+ Add Bed to ${name.trim() || 'Room'}`;
      }
    }
  },

  toggleRoomFeature(roomId, feature, value) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room[feature] = value;
    }
  },

  changeRoomSharingType(roomId, sharingType) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    room.type = sharingType;
    let targetCount = 2;
    if (sharingType.includes('Single')) targetCount = 1;
    else if (sharingType.includes('Triple')) targetCount = 3;
    else if (sharingType.includes('Four')) targetCount = 4;

    const rIdx = rooms.indexOf(room) + 1;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    // Adjust beds array
    if (room.beds.length < targetCount) {
      while (room.beds.length < targetCount) {
        const nextLetter = letters[room.beds.length] || String(room.beds.length + 1);
        room.beds.push({
          id: `bed_${Date.now()}_${room.beds.length}`,
          bedNo: `Bed ${rIdx}${nextLetter}`,
          rent: 10000,
          deposit: 20000,
          status: "Vacant",
          occupant: ""
        });
      }
    } else if (room.beds.length > targetCount) {
      room.beds = room.beds.slice(0, targetCount);
    }

    this.refreshRoomBuilder();
    this.syncLivePreview();
    window.modals.showToast(`Updated to ${sharingType}`);
  },

  addBedToRoom(roomId) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const rIdx = rooms.indexOf(room) + 1;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const nextLetter = letters[room.beds.length] || String(room.beds.length + 1);

    room.beds.push({
      id: `bed_${Date.now()}_${room.beds.length}`,
      bedNo: `Bed ${rIdx}${nextLetter}`,
      rent: 10000,
      deposit: 20000,
      status: "Vacant",
      occupant: ""
    });

    this.refreshRoomBuilder();
    this.syncLivePreview();
    window.modals.showToast(`Bed added to ${room.name}`);
  },

  removeBed(roomId, bedId) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    room.beds = room.beds.filter(b => b.id !== bedId);
    this.refreshRoomBuilder();
    this.syncLivePreview();
  },

  updateBedRate(roomId, bedId, field, value) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    const bed = room.beds.find(b => b.id === bedId);
    if (bed) {
      bed[field] = parseInt(value, 10) || 0;
      this.syncLivePreview();
    }
  },

  updateBedStatus(roomId, bedId, status) {
    const rooms = window._subleaseWizardRooms || [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    const bed = room.beds.find(b => b.id === bedId);
    if (bed) {
      bed.status = status;
      this.syncLivePreview();
    }
  },

  refreshRoomBuilder() {
    const container = document.getElementById('subleaseRoomBuilderList');
    if (container) {
      container.innerHTML = renderRoomBuilderCards(window._subleaseWizardRooms);
    }
  },

  syncLivePreview() {
    const mode = window._rentalWizardMode || 'rental';
    if (mode === 'rental') {
      const propInput = document.getElementById('rw_property');
      const rentInput = document.getElementById('rw_rent');
      const locInput = document.getElementById('rw_location');
      const bhkInput = document.getElementById('rw_bhk');
      const furnSelect = document.getElementById('rw_furnishing');

      const pTitle = document.getElementById('prev_title');
      const pRent = document.getElementById('prev_rent');
      const pLoc = document.getElementById('prev_location');
      const pBhk = document.getElementById('prev_bhk');
      const pFurn = document.getElementById('prev_furnishing');
      const pImg = document.getElementById('prev_image');

      if (pTitle && propInput) pTitle.textContent = propInput.value || "Luxury Property Listing";
      if (pRent && rentInput) pRent.innerHTML = `${rentInput.value || '₹65,000'} <small>/ mo</small>`;
      if (pLoc && locInput) pLoc.textContent = `📍 ${locInput.value || 'Kochi, Kerala'}`;
      if (pBhk && bhkInput) pBhk.textContent = bhkInput.value || '3 BHK';
      if (pFurn && furnSelect) pFurn.textContent = furnSelect.value || 'Furnished';
      
      const images = window._rentalUploadedImages || [];
      const cover = images.find(img => img.isCover) || images[0];
      if (pImg && cover) pImg.src = cover.url;
    } else {
      // Recompute Sublease Profit Spread Preview
      const stickyPreview = document.querySelector('.sticky-preview-wrapper');
      if (stickyPreview) {
        stickyPreview.innerHTML = renderSubleaseSpreadLivePreview();
      }
    }
  },

  fillDemoData() {
    const mode = window._rentalWizardMode || 'rental';
    if (mode === 'rental') {
      const propInput = document.getElementById('rw_property');
      const rentInput = document.getElementById('rw_rent');
      const depInput = document.getElementById('rw_deposit');
      const locInput = document.getElementById('rw_location');
      const bhkInput = document.getElementById('rw_bhk');

      if (propInput) propInput.value = "The Lennox Azure Sky Penthouse 2801";
      if (rentInput) rentInput.value = "₹85,000";
      if (depInput) depInput.value = "₹3,50,000";
      if (locInput) locInput.value = "Beach Road Waterfront, Kozhikode";
      if (bhkInput) bhkInput.value = "4 BHK Sky Duplex (2,800 sq.ft)";

      this.syncLivePreview();
      window.modals.showToast("Realistic luxury rental demo data filled!");
    } else {
      const propInput = document.getElementById('sw_property');
      const rentInput = document.getElementById('sw_masterRent');
      const landlordInput = document.getElementById('sw_landlord');

      if (propInput) propInput.value = "Hilltop Co-Living Villa Suite";
      if (rentInput) rentInput.value = "₹48,000";
      if (landlordInput) landlordInput.value = "Dr. George Matthew (Landlord)";

      this.syncLivePreview();
      window.modals.showToast("Realistic sublease hostel demo data filled!");
    }
  },

  saveDraft() {
    window.modals.showToast("Rental listing draft saved to local workspace!");
  },

  submitRental() {
    const mode = window._rentalWizardMode || 'rental';
    if (mode === 'rental') {
      const prop = document.getElementById('rw_property')?.value || "Marina Heights 1402";
      const rent = document.getElementById('rw_rent')?.value || "₹65,000";
      const deposit = document.getElementById('rw_deposit')?.value || "₹2,50,000";
      const location = document.getElementById('rw_location')?.value || "Marine Drive, Kochi";
      const outlet = document.getElementById('rw_outlet')?.value || "YOR Central";
      const category = document.getElementById('rw_category')?.value || "Luxury Apartment";
      const bhk = document.getElementById('rw_bhk')?.value || "3 BHK (1,850 sq.ft)";
      const furnishing = document.getElementById('rw_furnishing')?.value || "Fully Furnished";
      const leaseEnd = document.getElementById('rw_leaseEnd')?.value || "2027-12-31";
      
      const images = window._rentalUploadedImages || [];
      const cover = images.find(img => img.isCover) || images[0] || { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" };

      const newListing = window.store.addRental({
        property: prop,
        rent: rent,
        deposit: deposit,
        location: location,
        outlet: outlet,
        category: category,
        bhk: bhk,
        furnishing: furnishing,
        image: cover.url,
        gallery: images.map(i => i.url),
        appPublished: true,
        status: "Active",
        tenant: "Vacant (Available for Lease)",
        tenantPhone: "+91 98401 00000",
        leaseEnd: leaseEnd
      });

      this.closeSlidingPage();
      window.modals.showToast(`Property "${newListing.property}" added to directory!`);
      if (window.router.currentRoute === 'rentals') {
        window._rentalActiveTab = 'properties';
        window.router.navigate('rentals', false);
      }
    } else {
      const prop = document.getElementById('sw_property')?.value || "The Lennox Tower - Flat 501";
      const outlet = document.getElementById('sw_outlet')?.value || "YOR South";
      const location = document.getElementById('sw_location')?.value || "Kozhikode Beach Road";
      const landlord = document.getElementById('sw_landlord')?.value || "Dr. K. Varma";
      const masterRent = document.getElementById('sw_masterRent')?.value || "₹45,000";
      const masterDeposit = document.getElementById('sw_masterDeposit')?.value || "₹1,50,000";
      const utility = document.getElementById('sw_utility')?.value || "₹6,000";
      const nocDocRef = document.getElementById('sw_nocDocRef')?.value || "NOC-VRM-2026-05";

      const rooms = window._subleaseWizardRooms || [];
      let totalBeds = 0;
      let occupiedBeds = 0;
      let totalRevenue = 0;

      rooms.forEach(r => {
        (r.beds || []).forEach(b => {
          totalBeds++;
          if (b.status === 'Occupied') occupiedBeds++;
          totalRevenue += (parseInt(b.rent, 10) || 0);
        });
      });

      const masterRentNum = parseCurrencyInput(masterRent);
      const utilityNum = parseCurrencyInput(utility);
      const netSpread = totalRevenue - masterRentNum - utilityNum;
      const totalCost = masterRentNum + utilityNum;
      const yieldPct = totalCost > 0 ? Math.round((netSpread / totalCost) * 100) : 0;

      const newSub = window.store.addSubleaseProperty({
        property: prop,
        outlet: outlet,
        location: location,
        landlord: landlord,
        masterRent: masterRent,
        masterDeposit: masterDeposit,
        utilityExpenseEst: utility,
        nocDocRef: nocDocRef,
        subleaseNocVerified: true,
        totalBeds: totalBeds,
        occupiedBeds: occupiedBeds,
        subleaseRevenue: `₹${totalRevenue.toLocaleString()}`,
        netMonthlyMargin: `+₹${netSpread.toLocaleString()}`,
        marginRoi: `+${yieldPct}%`,
        rawMargin: netSpread,
        appPublished: true,
        rooms: JSON.parse(JSON.stringify(rooms))
      });

      this.closeSlidingPage();
      window.modals.showToast(`Sublease property "${newSub.property}" configured with ${totalBeds} beds!`);
      if (window.router.currentRoute === 'rentals') {
        window._rentalActiveTab = 'subleases';
        window.router.navigate('rentals', false);
      }
    }
  }
};
