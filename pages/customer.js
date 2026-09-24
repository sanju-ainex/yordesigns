/* ==========================================================================
   YOR Estate - Customer Mobile App Simulator Module
   ========================================================================== */

function renderCustomerPage() {
  return `
    <div class="head">
      <div>
        <h1>Customer mobile app preview (Flutter)</h1>
        <p>Customer-facing mobile app experience for rental browsing, viewing and managing owned property details, file uploads, inquiry submissions and push notification alerts.</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.modals.showToast('Push Notification simulated to Mobile App!')">
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          Simulate Push Alert
        </button>
        <button class="btn dark" onclick="window.modals.openUploadDocument()">+ Customer Upload</button>
      </div>
    </div>

    <div class="notice" style="margin-bottom:20px">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
      <div>
        <b>Flutter Single Codebase (iOS + Android):</b> The customer app operates without outlet-level admin access, feeding leads into the Sales CRM and uploaded deeds into the Multi-State Legal Verification Engine.
      </div>
    </div>

    <!-- 3-Phone Interactive Simulator Grid -->
    <div class="phone-grid">
      <!-- Screen 1: Rental Browsing & Search -->
      <div class="phone">
        <div class="phone-screen">
          <div class="eyebrow">YOR ESTATE · RENTALS</div>
          <h4>Find your next space</h4>
          <p>Browse individual & corporate rental listings.</p>

          <div class="phone-card" style="display:flex; align-items:center; gap:8px">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="var(--ink-3)" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span class="small muted">Search location, city or type…</span>
          </div>

          <div class="phone-hero" style="margin-top:12px"></div>

          <div class="phone-card">
            <b>Maple Residences (Unit B-12)</b>
            <p>Kochi, Kerala · Residential Rental</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px">
              <span class="chip green xs">₹53,800 / mo</span>
              <button class="btn sm gold" style="height:26px; font-size:10px" onclick="window.modals.showToast('Inquiry submitted from Customer App!')">Inquire</button>
            </div>
          </div>

          <div class="phone-card">
            <b>Riverside Commercial Tower</b>
            <p>Kozhikode, Kerala · Corporate Lease</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px">
              <span class="chip blue xs">₹1,12,000 / mo</span>
              <button class="btn sm gold" style="height:26px; font-size:10px" onclick="window.modals.showToast('Inquiry submitted from Customer App!')">Inquire</button>
            </div>
          </div>

          <div class="phone-nav">
            <span class="active">Explore</span>
            <span>Saved</span>
            <span>My Property</span>
            <span>Profile</span>
          </div>
        </div>
      </div>

      <!-- Screen 2: Customer Property Details & Status -->
      <div class="phone">
        <div class="phone-screen">
          <div class="eyebrow">MY PROPERTY</div>
          <div class="phone-hero" style="margin-top:8px"></div>
          <h4>Green Valley Plot</h4>
          <p>Survey No. 123/2A · Bengaluru, KA</p>

          <div class="phone-card">
            <b>Legal Verification Status</b>
            <p>Synced with Central Legal Engine</p>
            <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center">
              <span class="chip green xs">Sale Deed Verified ✓</span>
              <span class="small muted">v1.2</span>
            </div>
          </div>

          <div class="phone-card">
            <b>Uploaded Documents</b>
            <p>Ownership & Title Deeds (4 files)</p>
            <div style="margin-top:8px; display:flex; gap:6px">
              <span class="chip gray xs">Deed.pdf</span>
              <span class="chip gray xs">EC.pdf</span>
              <span class="chip gray xs">Tax.jpg</span>
            </div>
          </div>

          <div class="phone-card">
            <b>Assigned Branch Support</b>
            <p>YOR South (Kozhikode Branch)</p>
            <button class="btn sm gold" style="width:100%; height:28px; margin-top:8px; font-size:11px" onclick="window.modals.showToast('Connecting with YOR South Manager...')">Contact Branch</button>
          </div>

          <div class="phone-nav">
            <span>Explore</span>
            <span>Saved</span>
            <span class="active">My Property</span>
            <span>Profile</span>
          </div>
        </div>
      </div>

      <!-- Screen 3: Upload & Live Notification Feed -->
      <div class="phone">
        <div class="phone-screen">
          <div class="eyebrow">UPLOADS & ALERTS</div>
          <h4>Stay up to date</h4>
          <p>Upload document updates and get push notices.</p>

          <div class="phone-card" style="border:1.5px dashed var(--line-2); text-align:center; padding:16px; cursor:pointer" onclick="window.modals.openUploadDocument()">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="var(--accent)" fill="none" stroke-width="2" style="margin:0 auto 4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <b style="font-size:11.5px">Upload ownership proof</b>
            <div class="xs muted">PDF, PNG or JPG</div>
          </div>

          <div class="phone-card">
            <div style="display:flex; justify-content:space-between; align-items:center">
              <b>Legal Notice</b>
              <span class="chip blue xs">2m ago</span>
            </div>
            <p style="margin-top:4px">Encumbrance certificate moved to Under Review by Regional Legal.</p>
          </div>

          <div class="phone-card">
            <div style="display:flex; justify-content:space-between; align-items:center">
              <b>Rental Inquiry Reply</b>
              <span class="chip green xs">Today</span>
            </div>
            <p style="margin-top:4px">Response received from YOR South regarding lease terms.</p>
          </div>

          <div class="phone-nav">
            <span>Explore</span>
            <span>Saved</span>
            <span>My Property</span>
            <span class="active">Profile</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
