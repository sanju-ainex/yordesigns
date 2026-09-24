/* ==========================================================================
   YOR Estate - Multi-State Legal Verification & Compliance Directorate
   ========================================================================== */

function renderLegalPage() {
  const store = window.store || { data: { properties: [], stateWorkflows: {} } };
  const user = (window.auth && window.auth.currentUser) || { role: (store && store.currentRole) || "Super Admin", name: "Adv. Priya Nair" };
  const currentRole = (user && user.role) || (store && store.currentRole) || "Super Admin";

  const properties = store.data.properties || [];
  const stateWorkflows = store.data.stateWorkflows || {};
  const documents = store.data.documents || [];

  // Default active tab in legal module
  if (!window.activeLegalTab) window.activeLegalTab = "queue"; // queue | approved | rejected | workflows

  // Filter queues
  const pendingProps = properties.filter(p => p.legalStatus !== "Approved" && p.legalStatus !== "Rejected");
  const approvedProps = properties.filter(p => p.legalStatus === "Approved");
  const rejectedProps = properties.filter(p => p.legalStatus === "Rejected" || p.legalStatus === "Resubmit");

  // Selected Property for Legal Verification Workspace
  let selectedProp = null;
  if (store.activeLegalPropId) {
    selectedProp = properties.find(p => p.id === store.activeLegalPropId);
  }
  if (!selectedProp && properties.length > 0) {
    selectedProp = pendingProps[0] || properties[0];
    store.activeLegalPropId = selectedProp.id;
  }

  // Ensure selected property has state and checklist initialized
  if (selectedProp) {
    store.ensurePropertyLegalChecklist(selectedProp);
  }

  const activeState = selectedProp ? selectedProp.state : (store.activeLegalState || "Karnataka");
  const stateWf = stateWorkflows[activeState] || stateWorkflows["Karnataka"] || {
    name: activeState,
    requiredDocs: []
  };

  const checklist = selectedProp && selectedProp.legalChecklist ? selectedProp.legalChecklist : [];
  const verifiedCount = checklist.filter(d => d.status === "Verified").length;
  const totalCount = checklist.length;
  const checklistPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  // 5-Stage Stepper data
  const stages = selectedProp && selectedProp.stages ? selectedProp.stages : {
    intake: { title: "Document upload & intake", role: "Outlet Admin", status: "Completed", date: "24 Apr 2026", verifiedBy: "Outlet Admin", remarks: "All scans intake recorded" },
    survey: { title: "Survey number cross-check", role: "Outlet Admin", status: "Completed", date: "26 Apr 2026", verifiedBy: "Outlet Admin", remarks: "Survey coordinates verified" },
    encumbrance: { title: "Encumbrance verification", role: "Outlet Admin", status: "In-Review", date: null, verifiedBy: null, remarks: "" },
    ho_signoff: { title: "HO sign-off", role: "HO Admin", status: "Pending", date: null, verifiedBy: null, remarks: "" },
    final_reg: { title: "Final registration entry", role: "HO Admin", status: "Pending", date: null, verifiedBy: null, remarks: "" }
  };

  const canConfigureWorkflow = ["Super Admin", "Manager", "Legal Team"].includes(currentRole);
  const isEditingStages = window.editingLegalStages === true;

  return `
    <div class="head">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
          <span class="chip gold xs font-mono">LEGAL DIRECTORATE</span>
          <span class="chip gray xs">State Jurisdiction Engine</span>
        </div>
        <h1>Legal Verification & State Compliance Engine</h1>
        <p>State-aware legal verification, document checklists, 5-stage approval stepper, and custom workflow builder.</p>
      </div>
      <div class="actions">
        ${canConfigureWorkflow ? `
          <button class="btn gold" onclick="window.modals.openConfigureStateWorkflowModal('${activeState}')">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Configure ${activeState} Workflow
          </button>
        ` : ''}
        <button class="btn" onclick="window.modals.openExportReport()">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Audit Trail
        </button>
      </div>
    </div>

    <!-- KPI Metric Summary Cards -->
    <div class="stats">
      <div class="stat">
        <span>Verification Queue</span>
        <b class="num">${pendingProps.length}</b>
        <small class="warn">Submitted for Legal Check</small>
      </div>
      <div class="stat">
        <span>Approved Clear Titles</span>
        <b class="num">${approvedProps.length}</b>
        <small class="up">↑ Fully Cleared</small>
      </div>
      <div class="stat">
        <span>Action / Resubmission</span>
        <b class="num">${rejectedProps.length}</b>
        <small class="down">Discrepancy / Remarks</small>
      </div>
      <div class="stat">
        <span>Configured States</span>
        <b class="num">${Object.keys(stateWorkflows).length}</b>
        <small class="up">Configured Workflows</small>
      </div>
      <div class="stat">
        <span>HO Sign-offs Pending</span>
        <b class="num">${properties.filter(p => p.legalStage === 'HO sign-off' || p.legalStage === 'HO Sign-off').length || 2}</b>
        <small class="muted">Awaiting Head Office</small>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); margin-bottom:20px; padding-bottom:8px">
      <div style="display:flex; gap:8px">
        <button class="btn sm ${window.activeLegalTab === 'queue' ? 'dark' : ''}" onclick="window.activeLegalTab='queue'; window.router.navigate('legal')">
          Verification Queue (${pendingProps.length})
        </button>
        <button class="btn sm ${window.activeLegalTab === 'approved' ? 'dark' : ''}" onclick="window.activeLegalTab='approved'; window.router.navigate('legal')">
          Approved Properties (${approvedProps.length})
        </button>
        <button class="btn sm ${window.activeLegalTab === 'rejected' ? 'dark' : ''}" onclick="window.activeLegalTab='rejected'; window.router.navigate('legal')">
          Resubmission / Discrepancies (${rejectedProps.length})
        </button>
        <button class="btn sm ${window.activeLegalTab === 'workflows' ? 'dark' : ''}" onclick="window.activeLegalTab='workflows'; window.router.navigate('legal')">
          State Workflow Builder (${Object.keys(stateWorkflows).length} States)
        </button>
      </div>
      <div class="xs muted">
        Logged in as: <b>${user.name}</b> (${currentRole})
      </div>
    </div>

    ${window.activeLegalTab === 'workflows' ? renderStateWorkflowsManager(stateWorkflows, canConfigureWorkflow) : `
      <!-- Main Two-Column Layout: Left Queue & Right Verification Workspace -->
      <div class="grid-2" style="grid-template-columns: 340px 1fr; gap:20px; align-items:start">
        
        <!-- Left Column: Property Queue Selector -->
        <div class="card" style="padding:16px">
          <div class="ch" style="margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--line)">
            <div>
              <h3 style="font-size:15px">
                ${window.activeLegalTab === 'approved' ? 'Approved Properties' : window.activeLegalTab === 'rejected' ? 'Action Required' : 'Properties For Verification'}
              </h3>
              <p style="font-size:12px">Select a property to inspect state legal workflow</p>
            </div>
            <span class="chip gray xs">
              ${window.activeLegalTab === 'approved' ? approvedProps.length : window.activeLegalTab === 'rejected' ? rejectedProps.length : pendingProps.length} total
            </span>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; max-height:680px; overflow-y:auto; padding-right:4px">
            ${(window.activeLegalTab === 'approved' ? approvedProps : window.activeLegalTab === 'rejected' ? rejectedProps : pendingProps).map(p => {
              const isSelected = selectedProp && selectedProp.id === p.id;
              const pChecklist = p.legalChecklist || [];
              const pVerified = pChecklist.filter(d => d.status === "Verified").length;
              const pTotal = pChecklist.length || 6;

              return `
                <div class="card" style="padding:12px; cursor:pointer; border:1px solid ${isSelected ? 'var(--gold)' : 'var(--line-2)'}; background:${isSelected ? '#faf8f5' : '#fff'}; transition:all 0.15s ease" onclick="window.store.selectLegalProperty('${p.id}'); window.router.navigate('legal')">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px">
                    <span class="chip xs font-mono ${p.state === 'Kerala' ? 'blue' : p.state === 'Karnataka' ? 'amber' : p.state === 'Tamil Nadu' ? 'green' : 'gray'}">
                      ${p.state || 'Karnataka'}
                    </span>
                    <span class="chip xs ${p.legalStatus === 'Approved' ? 'green' : p.legalStatus === 'Rejected' || p.legalStatus === 'Resubmit' ? 'red' : 'amber'}">
                      ${p.legalStatus || 'Under Review'}
                    </span>
                  </div>

                  <b style="font-size:13.5px; color:var(--ink); display:block; margin-bottom:2px">${p.name}</b>
                  <div class="xs muted" style="margin-bottom:6px">
                    Survey: <b>${p.surveyNo || 'N/A'}</b> · ${p.location || ''}
                  </div>

                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--muted)">
                    <span>Stage: <b style="color:var(--ink)">${p.legalStage || 'Encumbrance verification'}</b></span>
                    <span class="num">${pVerified}/${pTotal} docs</span>
                  </div>
                </div>
              `;
            }).join('')}

            ${(window.activeLegalTab === 'approved' ? approvedProps : window.activeLegalTab === 'rejected' ? rejectedProps : pendingProps).length === 0 ? `
              <div style="text-align:center; padding:32px 16px; color:var(--muted)">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="1.5" style="margin-bottom:8px; opacity:0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                <div class="small">No properties found in this category.</div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right Column: Interactive State Legal Verification Workspace -->
        ${selectedProp ? `
          <div class="stack" style="gap:16px">
            
            <!-- Property Legal Profile Header & State Resolution -->
            <div class="card" style="padding:20px; border-left:4px solid var(--gold)">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:12px">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
                    <span class="chip gold font-mono xs">STATE: ${(selectedProp.state || 'KARNATAKA').toUpperCase()}</span>
                    <span class="chip gray xs">${selectedProp.outlet || 'Branch'}</span>
                    <span class="chip xs ${selectedProp.legalStatus === 'Approved' ? 'green' : selectedProp.legalStatus === 'Resubmit' ? 'red' : 'amber'}">
                      ${selectedProp.legalStatus || 'Under Review'}
                    </span>
                  </div>
                  <h2 style="font-size:20px; margin:0 0 4px 0">${selectedProp.name}</h2>
                  <div class="small muted">
                    Survey No: <b style="color:var(--ink)">${selectedProp.surveyNo || 'N/A'}</b> · Location: <b style="color:var(--ink)">${selectedProp.location || ''}</b> · Valuation: <b class="num" style="color:var(--gold)">${selectedProp.valuation || ''}</b>
                  </div>
                </div>

                <div style="display:flex; gap:8px">
                  <button class="btn sm" onclick="window.modals.openVerifyDocumentModal('${selectedProp.id}', null)">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    Bulk Verify
                  </button>
                  <button class="btn sm dark" onclick="window.modals.openUploadDocument()">+ Upload Doc Scan</button>
                </div>
              </div>

              <!-- State Law Notice -->
              <div style="background:var(--sand); border:1px solid var(--line); border-radius:6px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
                <div>
                  <b style="font-size:12.5px; color:var(--ink)">State Jurisdiction & Checklist:</b>
                  <div class="xs muted" style="margin-top:2px">
                    State: <b style="color:var(--ink)">${selectedProp.state || 'Karnataka'}</b> · <b style="color:var(--ink)">${checklist.length} Statutory Documents Required</b>
                  </div>
                </div>
                <div style="text-align:right">
                  <div class="xs muted">Checklist Clearance</div>
                  <b class="num" style="font-size:15px; color:${checklistPct === 100 ? 'var(--green)' : 'var(--ink)'}">${checklistPct}% (${verifiedCount}/${totalCount})</b>
                </div>
              </div>
            </div>

            <!-- 5-STAGE APPROVAL STEPPER WITH EDIT SUPPORT -->
            <div class="card" style="padding:20px">
              <div class="ch" style="margin-bottom:16px">
                <div>
                  <h3 style="font-size:16px">5-Stage Statutory & Head Office Clearance Stepper</h3>
                  <p style="font-size:12px">Formal multi-tier sign-off progression from outlet survey intake to HO registration entry.</p>
                </div>
                <div>
                  <button class="btn sm ${isEditingStages ? 'gold' : ''}" onclick="window.editingLegalStages = !window.editingLegalStages; window.router.navigate('legal')">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    ${isEditingStages ? 'Done Editing' : 'Edit Stepper'}
                  </button>
                </div>
              </div>

              <!-- Stepper Container -->
              <div class="legal-stepper">
                ${[
                  { key: 'intake', title: 'Document upload & intake', role: 'Outlet Admin' },
                  { key: 'survey', title: 'Survey number cross-check', role: 'Outlet Admin' },
                  { key: 'encumbrance', title: 'Encumbrance verification', role: 'Outlet Admin' },
                  { key: 'ho_signoff', title: 'HO sign-off', role: 'HO Admin' },
                  { key: 'final_reg', title: 'Final registration entry', role: 'HO Admin' }
                ].map((s, idx) => {
                  const stageData = stages[s.key] || { status: 'Pending', role: s.role, title: s.title };
                  const isDone = stageData.status === 'Completed';
                  const isInReview = stageData.status === 'In-Review';
                  const isHold = stageData.status === 'Hold';

                  return `
                    <div class="stepper-step ${isDone ? 'completed' : isInReview ? 'active' : isHold ? 'hold' : ''}">
                      <div class="step-badge">
                        ${isDone ? '✓' : idx + 1}
                      </div>
                      <div class="step-info">
                        <b class="step-title">${stageData.title || s.title}</b>
                        <span class="step-role">${stageData.role || s.role}</span>
                        ${stageData.date ? `<span class="step-date">${stageData.date}</span>` : ''}
                      </div>

                      ${isEditingStages ? `
                        <div class="step-actions" style="margin-top:8px">
                          <select class="form-select sm" style="font-size:11px; padding:2px 6px; height:24px" onchange="window.store.updatePropertyLegalStage('${selectedProp.id}', '${s.key}', this.value, '${user.name}'); window.router.navigate('legal')">
                            <option value="Pending" ${stageData.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="In-Review" ${stageData.status === 'In-Review' ? 'selected' : ''}>In-Review</option>
                            <option value="Completed" ${stageData.status === 'Completed' ? 'selected' : ''}>Completed ✓</option>
                            <option value="Hold" ${stageData.status === 'Hold' ? 'selected' : ''}>Hold / Flag</option>
                          </select>
                        </div>
                      ` : `
                        <div style="margin-top:6px">
                          <span class="chip xs ${isDone ? 'green' : isInReview ? 'blue' : isHold ? 'red' : 'gray'}">
                            ${isDone ? 'Completed ✓' : isInReview ? 'In-Review' : isHold ? 'On Hold' : 'Pending'}
                          </span>
                        </div>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>

              ${selectedProp.legalRemarks ? `
                <div style="margin-top:14px; padding:10px 14px; background:#fffdf5; border:1px solid #f0e6c8; border-radius:6px; font-size:12.5px">
                  <b style="color:#b45309">Legal Officer Remarks / Rejection Notes:</b>
                  <div style="color:var(--ink); margin-top:2px">${selectedProp.legalRemarks}</div>
                  ${selectedProp.rejectedBy ? `<div class="xs muted" style="margin-top:4px">Logged by: ${selectedProp.rejectedBy} on ${selectedProp.rejectedDate || 'Recently'}</div>` : ''}
                </div>
              ` : ''}
            </div>

            <!-- STATE-SPECIFIC REQUIRED DOCUMENTS VERIFICATION CHECKLIST -->
            <div class="card" style="padding:20px">
              <div class="ch" style="margin-bottom:14px">
                <div>
                  <h3 style="font-size:16px">${selectedProp.state || 'State'} Statutory Document Verification Register</h3>
                  <p style="font-size:12px">Check & verify each required document against land records or reject with officer remarks.</p>
                </div>
                <div style="display:flex; gap:8px">
                  <span class="chip dark xs">${checklist.length} Documents Required</span>
                </div>
              </div>

              <div class="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Required Statutory Document</th>
                      <th>Category</th>
                      <th>Status & Officer Stamp</th>
                      <th class="r">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${checklist.map(doc => {
                      const isVerified = doc.status === "Verified";
                      const isRejected = doc.status === "Rejected";

                      return `
                        <tr style="background:${isRejected ? '#fff5f5' : isVerified ? '#fbfdfb' : 'transparent'}">
                          <td>
                            <div style="display:flex; align-items:center; gap:6px">
                              <b>${doc.name}</b>
                              ${doc.mandatory ? `<span class="chip red xs" style="font-size:10px; padding:1px 4px">Mandatory</span>` : ''}
                            </div>
                          </td>
                          <td>
                            <span class="chip gray xs font-mono">${doc.category || 'Title'}</span>
                          </td>
                          <td>
                            <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px">
                              <span class="chip xs ${isVerified ? 'green' : isRejected ? 'red' : 'amber'}">
                                ${doc.status || 'Pending'}
                              </span>
                            </div>
                            ${doc.verifiedBy ? `
                              <div class="xs muted">By: <b>${doc.verifiedBy}</b> (${doc.verifiedDate || 'Recent'})</div>
                              ${doc.remarks ? `<div class="xs muted" style="color:${isRejected ? 'var(--red)' : 'inherit'}; font-style:italic">"${doc.remarks}"</div>` : ''}
                            ` : `
                              <div class="xs muted">Awaiting verification</div>
                            `}
                          </td>
                          <td class="r">
                            <div style="display:inline-flex; gap:6px">
                              <button class="btn sm gold" style="padding:3px 8px; font-size:11.5px" onclick="window.modals.openVerifyDocumentModal('${selectedProp.id}', '${doc.id}')" title="Verify Document">
                                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                Verify
                              </button>
                              <button class="btn sm" style="padding:3px 8px; font-size:11.5px; color:var(--red); border-color:#fca5a5" onclick="window.modals.openRejectDocumentModal('${selectedProp.id}', '${doc.id}')" title="Reject with remarks">
                                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Overall Clearance / Rejection Final Actions -->
              <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
                <div class="small muted">
                  <b>Final Legal Decision:</b> Clearing this property will grant statutory clearance for financial escrow, sublease, and sales marketing.
                </div>
                <div style="display:flex; gap:10px">
                  <button class="btn" style="color:var(--red); border-color:#fca5a5" onclick="window.modals.openRejectPropertyLegalModal('${selectedProp.id}')">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Reject Overall Title
                  </button>
                  <button class="btn dark" onclick="window.modals.openApprovePropertyLegalModal('${selectedProp.id}')">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Approve Full Clear Title (HO Clearance)
                  </button>
                </div>
              </div>
            </div>

          </div>
        ` : `
          <div class="card" style="padding:48px; text-align:center; color:var(--muted)">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1.5" style="margin-bottom:12px; opacity:0.6"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <h3>No Property Selected</h3>
            <p>Select a property from the left queue to review and verify its legal workflow.</p>
          </div>
        `}
      </div>
    `}
  `;
}

// Sub-component: State Workflow Builder & Registry
function renderStateWorkflowsManager(stateWorkflows, canConfigure) {
  const states = Object.keys(stateWorkflows);

  return `
    <div class="card" style="padding:28px">
      <div class="ch" style="margin-bottom:24px; border-bottom:1px solid var(--line); padding-bottom:16px; flex-wrap:wrap; gap:16px">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
            <span class="chip gold xs font-mono">STATE WORKFLOWS</span>
            <span class="chip dark xs">${states.length} States Configured</span>
          </div>
          <h2 style="font-size:22px; font-weight:700">State Legal Workflows & Compliance Checklists</h2>
          <p style="color:var(--muted); font-size:13px; margin:4px 0 0 0">
            Super Admins, Managers, and Legal Directorate can create and customize statutory document verification checklists for each state.
          </p>
        </div>
        ${canConfigure ? `
          <button class="btn gold" style="padding:10px 20px; font-weight:600" onclick="window.modals.openConfigureStateWorkflowModal(null)">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + Add State Legal Workflow
          </button>
        ` : ''}
      </div>

      <div class="grid-2" style="gap:24px">
        ${states.map(stateName => {
          const wf = stateWorkflows[stateName] || {};
          const docs = wf.requiredDocs || [];

          return `
            <div class="state-workflow-card">
              <div>
                <div class="state-card-header">
                  <div>
                    <span class="chip xs font-mono ${stateName === 'Kerala' ? 'blue' : stateName === 'Tamil Nadu' ? 'green' : stateName === 'Karnataka' ? 'amber' : 'dark'}" style="margin-bottom:4px">
                      ${stateName.toUpperCase()}
                    </span>
                    <h3 style="font-size:18px; font-weight:700; color:var(--ink); margin:2px 0 0 0">${stateName}</h3>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px">
                    <span class="chip gray xs font-mono">${docs.length} Documents</span>
                    ${canConfigure ? `
                      <button class="btn sm gold" style="padding:4px 12px; font-size:12px" onclick="window.modals.openConfigureStateWorkflowModal('${stateName}')">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        Edit Workflow
                      </button>
                    ` : ''}
                  </div>
                </div>

                <!-- Simple, Clean Document Checklist -->
                <div style="display:flex; flex-direction:column; gap:6px; margin-top:12px">
                  ${docs.map((d, i) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:12.5px; padding:7px 10px; background:var(--sand); border:1px solid var(--line); border-radius:6px">
                      <div style="display:flex; align-items:center; gap:6px">
                        <span class="num xs muted" style="min-width:14px">${i + 1}.</span>
                        <span style="font-weight:600; color:var(--ink)">${d.name}</span>
                        ${d.mandatory !== false ? `<span class="chip red xs" style="font-size:9.5px; padding:1px 5px">Mandatory</span>` : ''}
                      </div>
                      <span class="chip gray xs font-mono">${d.category || 'Title'}</span>
                    </div>
                  `).join('')}
                  ${docs.length === 0 ? `
                    <div class="xs muted" style="padding:12px; text-align:center">No documents configured yet.</div>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

