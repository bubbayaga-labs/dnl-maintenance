const APP_VERSION = "10";

const sections = {
  "ENGINE & FLUIDS": [
    "Drain engine oil",
    "Replace engine oil filter",
    "Fill engine oil to proper level",
    "Check engine oil level after running",
    "Check coolant/antifreeze level",
    "Check coolant/antifreeze condition",
    "Check for engine oil leaks",
    "Check for coolant leaks",
    "Check transmission fluid/oil",
    "Check power steering fluid",
    "Check windshield washer fluid"
  ],
  "GREASING & LUBRICATION": [
    "Grease slack adjusters",
    "Grease brake components/fittings as required",
    "Grease steering components",
    "Grease tie-rod ends",
    "Grease ball joints",
    "Grease driveline U-joints",
    "Grease slip yokes/driveline",
    "Grease fifth wheel",
    "Grease other manufacturer-required grease points"
  ],
  "BRAKES & AIR SYSTEM": [
    "Inspect brake linings/pads",
    "Check brake drums/rotors",
    "Check brake stroke",
    "Check slack adjusters",
    "Inspect air hoses and lines",
    "Check air lines for rubbing/chafing",
    "Check air lines for cracks or damage",
    "Check air fittings for leaks",
    "Check air tanks",
    "Drain moisture from air tanks as required",
    "Check for air leaks"
  ],
  "TIRES, WHEELS & HUBS": [
    "Check all tire pressures",
    "Record/inspect tire tread depth",
    "Inspect tires for cuts, cracks, bulges, or abnormal wear",
    "Check dual tires for proper clearance",
    "Inspect rims/wheels for cracks or damage",
    "Check wheel studs and lug nuts",
    "Inspect wheel/hub mating surfaces",
    "Check hub oil levels",
    "Inspect hubs and wheel seals for leaks",
    "Torque wheel nuts to 500 ft-lbs",
    "Wheel torque completed using proper tightening pattern",
    "Re-torque required after wheel removal/service"
  ],
  "STEERING & SUSPENSION": [
    "Inspect tie-rod ends",
    "Inspect ball joints",
    "Inspect steering linkage",
    "Check steering components for looseness/play",
    "Inspect leaf springs",
    "Inspect spring hangers",
    "Inspect suspension bushings",
    "Inspect torque rods",
    "Inspect shocks",
    "Inspect air bags",
    "Check suspension air lines",
    "Check suspension mounting bolts"
  ],
  "DRIVELINE": [
    "Inspect U-joints",
    "Inspect driveshaft",
    "Check driveline for looseness/play",
    "Inspect carrier/center bearings",
    "Inspect slip joints/yokes",
    "Check for damaged or missing driveline hardware"
  ],
  "GENERAL INSPECTION": [
    "Check frame for cracks or damage",
    "Check for loose or missing bolts",
    "Check for fluid leaks",
    "Check fuel lines and fittings",
    "Inspect exhaust system",
    "Check batteries and connections",
    "Check belts and hoses",
    "Check mud flaps",
    "Check mirrors",
    "Check windshield and wipers",
    "Check all lights",
    "Check turn signals",
    "Check brake lights",
    "Check marker/clearance lights",
    "Check reverse lights"
  ]
};

const equipmentSections = {
  "Semi-Truck": Object.keys(sections),
  "Vac Truck": Object.keys(sections),
  "Pressure Truck": Object.keys(sections),
  "Super B Trailer": [
    "GREASING & LUBRICATION",
    "BRAKES & AIR SYSTEM",
    "TIRES, WHEELS & HUBS",
    "GENERAL INSPECTION"
  ],
  "Tri-Axle Trailer": [
    "GREASING & LUBRICATION",
    "BRAKES & AIR SYSTEM",
    "TIRES, WHEELS & HUBS",
    "GENERAL INSPECTION"
  ],
  "Other": Object.keys(sections)
};

const checklist = document.getElementById("checklist");
const equipmentType = document.getElementById("equipmentType");
const historyPanel = document.getElementById("historyPanel");
const historySearch = document.getElementById("historySearch");
const historyList = document.getElementById("historyList");
const statusEl = document.getElementById("status");

let savedSelections = {};
let savedNotes = {};

function safeText(value) {
  return String(value ?? "");
}

function currentAllowedSections() {
  return equipmentSections[equipmentType.value] || Object.keys(sections);
}

function buildChecklist() {
  checklist.innerHTML = "";

  currentAllowedSections().forEach(sectionTitle => {
    const section = document.createElement("section");
    section.className = "card";

    const heading = document.createElement("h2");
    heading.className = "collapsible-heading";
    heading.tabIndex = 0;
    heading.setAttribute("role", "button");
    heading.setAttribute("aria-expanded", "false");
    heading.textContent = "▶ " + sectionTitle;

    const sectionContent = document.createElement("div");
    sectionContent.className = "section-content";
    sectionContent.hidden = true;

    const toggleSection = () => {
      const willOpen = sectionContent.hidden;
      sectionContent.hidden = !willOpen;
      heading.setAttribute("aria-expanded", String(willOpen));
      heading.textContent = (willOpen ? "▼ " : "▶ ") + sectionTitle;
    };

    heading.addEventListener("click", toggleSection);
    heading.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSection();
      }
    });

    section.appendChild(heading);
    section.appendChild(sectionContent);

    sections[sectionTitle].forEach(item => {
      const row = document.createElement("div");
      row.className = "inspection-row";

      const itemText = document.createElement("div");
      itemText.className = "inspection-name";
      itemText.textContent = item;
      row.appendChild(itemText);

      const choices = document.createElement("div");
      choices.className = "inspection-choices";

      const noteBox = document.createElement("textarea");
      noteBox.className = "defect-note";
      noteBox.placeholder = "Describe defect or repair completed...";
      noteBox.dataset.item = item;
      noteBox.value = savedNotes[item] || "";
      noteBox.hidden = !["FAIL", "FIXED"].includes(savedSelections[item]);

      ["PASS", "FAIL", "FIXED", "N/A"].forEach(status => {
        const label = document.createElement("label");
        label.className = "status-choice";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "status_" + item;
        radio.value = status;
        radio.dataset.item = item;
        radio.checked = savedSelections[item] === status;

        radio.addEventListener("change", () => {
          savedSelections[item] = status;
          noteBox.hidden = !["FAIL", "FIXED"].includes(status);
        });

        const text = document.createElement("span");
        text.textContent = status;

        label.appendChild(radio);
        label.appendChild(text);
        choices.appendChild(label);
      });

      noteBox.addEventListener("input", () => {
        savedNotes[item] = noteBox.value;
      });

      row.appendChild(choices);
      row.appendChild(noteBox);
      sectionContent.appendChild(row);
    });

    checklist.appendChild(section);
  });
}

equipmentType.addEventListener("change", () => {
  buildChecklist();
});

const signaturePad = document.getElementById("signaturePad");
const ctx = signaturePad.getContext("2d");
ctx.lineWidth = 3;
ctx.lineCap = "round";
let drawing = false;
let hasSignature = false;

function getPoint(e) {
  const rect = signaturePad.getBoundingClientRect();
  const scaleX = signaturePad.width / rect.width;
  const scaleY = signaturePad.height / rect.height;
  const point = e.touches ? e.touches[0] : e;
  return {
    x: (point.clientX - rect.left) * scaleX,
    y: (point.clientY - rect.top) * scaleY
  };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  const point = getPoint(e);
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const point = getPoint(e);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  hasSignature = true;
}

function endDraw(e) {
  if (e) e.preventDefault();
  drawing = false;
}

["mousedown", "touchstart"].forEach(name =>
  signaturePad.addEventListener(name, startDraw, { passive: false })
);
["mousemove", "touchmove"].forEach(name =>
  signaturePad.addEventListener(name, draw, { passive: false })
);
["mouseup", "mouseleave", "touchend"].forEach(name =>
  signaturePad.addEventListener(name, endDraw, { passive: false })
);

document.getElementById("clearSignature").addEventListener("click", () => {
  ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
  hasSignature = false;
});

function visibleItemNames() {
  return currentAllowedSections().flatMap(sectionTitle => sections[sectionTitle]);
}

function collectData() {
  const statuses = {};
  const notes = {};

  visibleItemNames().forEach(item => {
    statuses[item] = savedSelections[item] || "";
    notes[item] = savedNotes[item] || "";
  });

  return {
    appVersion: APP_VERSION,
    equipmentType: equipmentType.value,
    unitNumber: document.getElementById("unitNumber").value.trim(),
    serviceDate: document.getElementById("serviceDate").value,
    serviceTime: document.getElementById("serviceTime").value,
    odometer: document.getElementById("odometer").value,
    engineHours: document.getElementById("engineHours").value,
    technician: document.getElementById("technician").value.trim(),
    repairs: document.getElementById("repairs").value,
    confirmComplete: document.getElementById("confirmComplete").checked,
    statuses,
    notes,
    signature: hasSignature ? signaturePad.toDataURL("image/png") : null,
    savedAt: new Date().toISOString()
  };
}

function applyData(data) {
  equipmentType.value = data.equipmentType || "Semi-Truck";
  document.getElementById("unitNumber").value = data.unitNumber || "";
  document.getElementById("serviceDate").value = data.serviceDate || "";
  document.getElementById("serviceTime").value = data.serviceTime || "";
  document.getElementById("odometer").value = data.odometer || "";
  document.getElementById("engineHours").value = data.engineHours || "";
  document.getElementById("technician").value = data.technician || "";
  document.getElementById("repairs").value = data.repairs || "";
  document.getElementById("confirmComplete").checked = !!data.confirmComplete;

  savedSelections = { ...(data.statuses || {}) };
  savedNotes = { ...(data.notes || {}) };
  buildChecklist();

  ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
  hasSignature = false;

  if (data.signature) {
    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
      ctx.drawImage(image, 0, 0, signaturePad.width, signaturePad.height);
      hasSignature = true;
    };
    image.src = data.signature;
  }
}

function clearForm({ keepDate = true } = {}) {
  const dateValue = keepDate ? new Date().toISOString().slice(0, 10) : "";
  equipmentType.value = "Semi-Truck";
  document.getElementById("unitNumber").value = "";
  document.getElementById("serviceDate").value = dateValue;
  document.getElementById("serviceTime").value = "";
  document.getElementById("odometer").value = "";
  document.getElementById("engineHours").value = "";
  document.getElementById("technician").value = "";
  document.getElementById("repairs").value = "";
  document.getElementById("confirmComplete").checked = false;
  savedSelections = {};
  savedNotes = {};
  ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
  hasSignature = false;
  buildChecklist();
}

function validateRequired() {
  const unit = document.getElementById("unitNumber").value.trim();
  const technician = document.getElementById("technician").value.trim();

  if (!unit || !technician) {
    alert("Please enter both Unit # and Technician.");
    return false;
  }
  return true;
}

document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("dnlMaintenanceDraft", JSON.stringify(collectData()));
  statusEl.textContent = "Draft saved on this device.";
});

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("dnlServiceHistory") || "[]");
  } catch {
    return [];
  }
}

function setHistory(history) {
  localStorage.setItem("dnlServiceHistory", JSON.stringify(history));
}

document.getElementById("completeBtn").addEventListener("click", () => {
  if (!validateRequired()) return;

  if (!document.getElementById("confirmComplete").checked) {
    alert("Please check the service confirmation box before completing the service.");
    return;
  }

  if (!confirm("Are you sure this service is complete?")) return;

  const history = getHistory();
  history.push(collectData());
  setHistory(history);
  localStorage.removeItem("dnlMaintenanceDraft");

  const unit = document.getElementById("unitNumber").value.trim();
  clearForm();
  statusEl.textContent = "Unit " + unit + " completed and saved to service history.";
});

function displayServiceHistory(searchTerm = "") {
  const history = getHistory();
  historyList.innerHTML = "";
  const term = searchTerm.toLowerCase().trim();

  const filtered = history
    .map((record, originalIndex) => ({ record, originalIndex }))
    .filter(({ record }) =>
      safeText(record.unitNumber).toLowerCase().includes(term)
    )
    .reverse();

  if (!filtered.length) {
    historyList.innerHTML = "<p>No service records found.</p>";
    return;
  }

  filtered.forEach(({ record, originalIndex }) => {
    const card = document.createElement("div");
    card.className = "history-record";

    const title = document.createElement("h3");
    title.textContent = "Unit " + (record.unitNumber || "Not Entered");
    card.appendChild(title);

    const info = document.createElement("p");
    info.textContent =
      `${record.equipmentType || "-"} • ${record.serviceDate || "-"} • ` +
      `${record.odometer || "-"} km • ${record.engineHours || "-"} hrs • ` +
      `${record.technician || "-"}`;
    card.appendChild(info);

    const defects = Object.entries(record.statuses || {})
      .filter(([, state]) => state === "FAIL" || state === "FIXED");

    if (defects.length) {
      const defectTitle = document.createElement("h4");
      defectTitle.textContent = "Defects / Repairs";
      card.appendChild(defectTitle);

      defects.forEach(([item, state]) => {
        const p = document.createElement("p");
        const note = record.notes?.[item] ? ` — ${record.notes[item]}` : "";
        p.textContent = `${state}: ${item}${note}`;
        card.appendChild(p);
      });
    }

    if (record.repairs) {
      const p = document.createElement("p");
      p.textContent = "Additional Repairs: " + record.repairs;
      card.appendChild(p);
    }

    const actions = document.createElement("div");
    actions.className = "history-actions";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "secondary";
    openButton.textContent = "Open Record";
    openButton.addEventListener("click", () => {
      applyData(record);
      historyPanel.hidden = true;
      document.getElementById("historyBtnTop").textContent = "View Service History";
      statusEl.textContent = "Service record loaded.";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete Record";
    deleteButton.addEventListener("click", () => {
      if (!confirm("Delete this service record? This cannot be undone.")) return;
      const next = getHistory();
      next.splice(originalIndex, 1);
      setHistory(next);
      displayServiceHistory(historySearch.value);
    });

    actions.appendChild(openButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
    historyList.appendChild(card);
  });
}

function setHistoryOpen(open) {
  historyPanel.hidden = !open;
  document.getElementById("historyBtnTop").textContent =
    open ? "Hide Service History" : "View Service History";
  if (open) displayServiceHistory(historySearch.value);
}

document.getElementById("historyBtnTop").addEventListener("click", () => {
  setHistoryOpen(historyPanel.hidden);
});

document.getElementById("closeHistoryBtn").addEventListener("click", () => {
  setHistoryOpen(false);
});

historySearch.addEventListener("input", event => {
  displayServiceHistory(event.target.value);
});

document.getElementById("clearBtnTop").addEventListener("click", () => {
  if (!confirm("Clear the entire current form?")) return;
  localStorage.removeItem("dnlMaintenanceDraft");
  clearForm();
  statusEl.textContent = "Form cleared.";
});

function addPdfLine(pdf, state, text, options = {}) {
  const { bold = false, indent = 0, extraGap = 0 } = options;
  if (state.y > 275) {
    pdf.addPage();
    state.y = 20;
  }
  pdf.setFont("helvetica", bold ? "bold" : "normal");
  const lines = pdf.splitTextToSize(String(text), 175 - indent);
  pdf.text(lines, 18 + indent, state.y);
  state.y += lines.length * 6 + extraGap;
}

async function buildPdfFile(data) {
  if (!window.jspdf?.jsPDF) {
    throw new Error("PDF library did not load. Check the internet connection and try again.");
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const state = { y: 20 };

  pdf.setFontSize(18);
  addPdfLine(pdf, state, "D&L Fluid Hauling Ltd.", { bold: true, extraGap: 1 });
  pdf.setFontSize(14);
  addPdfLine(pdf, state, "Shop Service Report", { bold: true, extraGap: 4 });

  pdf.setFontSize(11);
  addPdfLine(pdf, state, `Equipment: ${data.equipmentType || "-"}`);
  addPdfLine(pdf, state, `Unit #: ${data.unitNumber || "-"}`);
  addPdfLine(pdf, state, `Date: ${data.serviceDate || "-"}`);
  addPdfLine(pdf, state, `Time: ${data.serviceTime || "-"}`);
  addPdfLine(pdf, state, `Odometer: ${data.odometer || "-"} km`);
  addPdfLine(pdf, state, `Engine Hours: ${data.engineHours || "-"}`);
  addPdfLine(pdf, state, `Technician: ${data.technician || "-"}`, { extraGap: 4 });

  addPdfLine(pdf, state, "INSPECTION RESULTS", { bold: true, extraGap: 2 });

  visibleItemNames().forEach(item => {
    const status = data.statuses?.[item] || "NOT MARKED";
    addPdfLine(pdf, state, `${status} - ${item}`, { bold: true });
    const note = data.notes?.[item];
    if (note) addPdfLine(pdf, state, `Note: ${note}`, { indent: 5 });
    state.y += 1;
  });

  addPdfLine(pdf, state, "DEFECTS / REPAIRS FIXED", { bold: true, extraGap: 1 });
  addPdfLine(pdf, state, data.repairs || "None recorded.", { extraGap: 4 });

  if (data.signature) {
    if (state.y > 235) {
      pdf.addPage();
      state.y = 20;
    }
    addPdfLine(pdf, state, "TECHNICIAN SIGNATURE", { bold: true });
    try {
      pdf.addImage(data.signature, "PNG", 18, state.y, 70, 25);
      state.y += 30;
    } catch {
      addPdfLine(pdf, state, "Signature could not be added.");
    }
  }

  const filename = `DNL_Unit_${data.unitNumber || "Unknown"}_Service_Report.pdf`;
  const blob = pdf.output("blob");
  return new File([blob], filename, { type: "application/pdf" });
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById("printBtn").addEventListener("click", async () => {
  try {
    const data = collectData();
    const file = await buildPdfFile(data);

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: `D&L Service Report - Unit ${data.unitNumber || "Unknown"}`,
        text: `D&L Fluid Hauling service report for Unit ${data.unitNumber || "Unknown"}`,
        files: [file]
      });
      statusEl.textContent = "PDF shared.";
    } else {
      downloadFile(file);
      statusEl.textContent = "PDF downloaded. Attach it to a text or email.";
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    alert(error?.message || "Could not create the PDF.");
  }
});

if (!document.getElementById("serviceDate").value) {
  document.getElementById("serviceDate").value = new Date().toISOString().slice(0, 10);
}

const savedDraft = localStorage.getItem("dnlMaintenanceDraft");
if (savedDraft) {
  try {
    applyData(JSON.parse(savedDraft));
  } catch {
    buildChecklist();
  }
} else {
  buildChecklist();
}

/* Keep the app installable, but use a network-first service worker so updates
   don't get trapped behind stale cached JavaScript. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "service-worker.js?v=10",
        { updateViaCache: "none" }
      );
      registration.update();
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}
