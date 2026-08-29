const views = {
  home: document.getElementById("homeView"),
  driver: document.getElementById("driverView"),
  mechanic: document.getElementById("mechanicView"),
  projects: document.getElementById("projectsView")
};

function showView(name) {
  Object.entries(views).forEach(([key, el]) => el.hidden = key !== name);
  window.scrollTo({top:0, behavior:"smooth"});
}

document.getElementById("openDriverBtn").addEventListener("click", () => showView("driver"));
document.getElementById("openMechanicBtn").addEventListener("click", () => showView("mechanic"));
document.getElementById("openProjectsBtn").addEventListener("click", () => showView("projects"));
document.querySelectorAll(".back-home").forEach(btn => btn.addEventListener("click", () => showView("home")));

const driverItems = [
  "Lights and reflectors",
  "Tires, wheels and lug nuts",
  "Visible fluid leaks",
  "Mirrors, windshield and wipers",
  "Horn",
  "Steering and obvious looseness",
  "Air pressure / warning system",
  "Brake operation",
  "Air lines and couplers",
  "Suspension and air bags",
  "Fifth wheel / coupling",
  "Mud flaps",
  "Gauges and warning lights",
  "Emergency / safety equipment",
  "Obvious body or equipment damage",
  "Positive air shutdown test"
];


const driverTrailerItems = [
  "Trailer lights and reflectors",
  "Trailer tires, wheels and lug nuts",
  "Trailer brake operation",
  "Trailer air lines and glad hands",
  "Trailer suspension and air bags",
  "Trailer coupling / pintle / fifth wheel connection",
  "Trailer frame and obvious damage",
  "Trailer hub oil / hub condition",
  "Trailer mud flaps"
];

let trailerSelections = {};
let trailerNotes = {};

let driverSelections = {};
let driverNotes = {};
const driverChecklist = document.getElementById("driverChecklist");

function buildDriverChecklist() {
  driverChecklist.innerHTML = "";
  const section = document.createElement("section");
  section.className = "card";
  const heading = document.createElement("h2");
  heading.className = "collapsible-heading";
  heading.textContent = "▼ DRIVER CHECKLIST";
  const content = document.createElement("div");
  content.className = "section-content";
  heading.addEventListener("click", () => {
    content.hidden = !content.hidden;
    heading.textContent = (content.hidden ? "▶ " : "▼ ") + "DRIVER CHECKLIST";
  });
  section.appendChild(heading);
  section.appendChild(content);

  driverItems.forEach(item => {
    const row = document.createElement("div");
    row.className = "inspection-row";
    const title = document.createElement("div");
    title.className = "inspection-name";
    title.textContent = item;
    row.appendChild(title);

    const choices = document.createElement("div");
    choices.className = "inspection-choices";

    const note = document.createElement("textarea");
    note.className = "defect-note";
    note.placeholder = item === "Tires, wheels and lug nuts" ? "Tire / axle defect location (example: Drive axle 1 — passenger inner tire)" : "Describe defect...";
    note.value = driverNotes[item] || "";
    note.hidden = driverSelections[item] !== "FAIL";

    ["PASS","FAIL","N/A"].forEach(state => {
      const label = document.createElement("label");
      label.className = "status-choice";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "driver_" + item;
      radio.value = state;
      radio.checked = driverSelections[item] === state;
      radio.addEventListener("change", () => {
        driverSelections[item] = state;
        note.hidden = state !== "FAIL";
        if (!note.hidden) {
          setTimeout(() => {
            note.focus();
            note.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 50);
        }
      });
      const span = document.createElement("span");
      span.textContent = state;
      label.appendChild(radio);
      label.appendChild(span);
      choices.appendChild(label);
    });

    note.addEventListener("input", () => driverNotes[item] = note.value);
    row.appendChild(choices);
    row.appendChild(note);
    content.appendChild(row);
  });
  driverChecklist.appendChild(section);
}


const driverHasTrailer = document.getElementById("driverHasTrailer");
const driverTrailerFields = document.getElementById("driverTrailerFields");
const driverTrailerChecklistCard = document.getElementById("driverTrailerChecklistCard");
const driverTrailerChecklist = document.getElementById("driverTrailerChecklist");
const driverTrailerHeading = document.getElementById("driverTrailerHeading");

function selectedRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function buildDriverTrailerChecklist() {
  driverTrailerChecklist.innerHTML = "";

  driverTrailerItems.forEach(item => {
    const row = document.createElement("div");
    row.className = "inspection-row";

    const title = document.createElement("div");
    title.className = "inspection-name";
    title.textContent = item;
    row.appendChild(title);

    const choices = document.createElement("div");
    choices.className = "inspection-choices driver-choices";

    const note = document.createElement("textarea");
    note.className = "defect-note";
    note.placeholder = item === "Trailer tires, wheels and lug nuts" ? "Tire / axle defect location (example: Trailer axle 2 — driver outer tire)" : "Describe trailer defect...";
    note.value = trailerNotes[item] || "";
    note.hidden = trailerSelections[item] !== "FAIL";

    ["PASS","FAIL","N/A"].forEach(state => {
      const label = document.createElement("label");
      label.className = "status-choice";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "trailer_" + item;
      radio.value = state;
      radio.checked = trailerSelections[item] === state;
      radio.addEventListener("change", () => {
        trailerSelections[item] = state;
        note.hidden = state !== "FAIL";
        if (!note.hidden) {
          setTimeout(() => {
            note.focus();
            note.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 50);
        }
      });

      const span = document.createElement("span");
      span.textContent = state;

      label.appendChild(radio);
      label.appendChild(span);
      choices.appendChild(label);
    });

    note.addEventListener("input", () => trailerNotes[item] = note.value);

    row.appendChild(choices);
    row.appendChild(note);
    driverTrailerChecklist.appendChild(row);
  });
}

function syncTrailerVisibility() {
  const show = driverHasTrailer.checked;
  driverTrailerFields.hidden = !show;
  driverTrailerChecklistCard.hidden = !show;
}

driverHasTrailer.addEventListener("change", syncTrailerVisibility);

driverTrailerHeading.addEventListener("click", () => {
  driverTrailerChecklist.hidden = !driverTrailerChecklist.hidden;
  driverTrailerHeading.textContent =
    (driverTrailerChecklist.hidden ? "▶ " : "▼ ") + "TRAILER CHECKLIST";
});

buildDriverTrailerChecklist();
syncTrailerVisibility();

function getDriverHistory() {
  try { return JSON.parse(localStorage.getItem("dnlDriverHistory") || "[]"); }
  catch { return []; }
}
function setDriverHistory(h) {
  localStorage.setItem("dnlDriverHistory", JSON.stringify(h));
}

document.getElementById("saveDriverBtn").addEventListener("click", () => {
  const unit = document.getElementById("driverUnitNumber").value.trim();
  const driver = document.getElementById("driverName").value.trim();
  if (!unit || !driver) {
    alert("Please enter Unit # and Driver.");
    return;
  }
  const h = getDriverHistory();
  h.push({
    type: document.getElementById("driverInspectionType").value,
    equipment: document.getElementById("driverEquipmentType").value,
    unit,
    fuelStatus: document.getElementById("driverFuelStatus").value,
    hasTrailer: document.getElementById("driverHasTrailer").checked,
    trailerUnit: document.getElementById("driverTrailerUnit").value.trim(),
    trailerType: document.getElementById("driverTrailerType").value,
    trailerSelections: {...trailerSelections},
    trailerNotes: {...trailerNotes},
    h2sMonitorId: document.getElementById("h2sMonitorId").value.trim(),
    h2sBump: selectedRadio("h2sBump"),
    h2sCalibration: selectedRadio("h2sCalibration"),
    date: document.getElementById("driverDate").value,
    time: document.getElementById("driverTime").value,
    driver,
    selections: {...driverSelections},
    notes: {...driverNotes},
    generalNotes: document.getElementById("driverGeneralNotes").value,
    savedAt: new Date().toISOString()
  });
  setDriverHistory(h);
  document.getElementById("driverStatus").textContent = "Driver inspection saved.";
  driverSelections = {};
  driverNotes = {};
  buildDriverChecklist();
});

document.getElementById("clearDriverBtn").addEventListener("click", () => {
  if (!confirm("Clear the current driver inspection?")) return;
  driverSelections = {};
  driverNotes = {};
  trailerSelections = {};
  trailerNotes = {};
  document.getElementById("driverUnitNumber").value = "";
  document.getElementById("driverFuelStatus").value = "Fueled";
  document.getElementById("driverHasTrailer").checked = false;
  document.getElementById("driverTrailerUnit").value = "";
  document.getElementById("h2sMonitorId").value = "";
  document.querySelectorAll('input[name="h2sBump"], input[name="h2sCalibration"]').forEach(r => r.checked = false);
  syncTrailerVisibility();
  buildDriverTrailerChecklist();
  document.getElementById("driverName").value = "";
  document.getElementById("driverGeneralNotes").value = "";
  buildDriverChecklist();
});


function currentDriverData() {
  return {
    type: document.getElementById("driverInspectionType").value,
    equipment: document.getElementById("driverEquipmentType").value,
    unit: document.getElementById("driverUnitNumber").value.trim(),
    fuelStatus: document.getElementById("driverFuelStatus").value,
    hasTrailer: document.getElementById("driverHasTrailer").checked,
    trailerUnit: document.getElementById("driverTrailerUnit").value.trim(),
    trailerType: document.getElementById("driverTrailerType").value,
    trailerSelections: {...trailerSelections},
    trailerNotes: {...trailerNotes},
    h2sMonitorId: document.getElementById("h2sMonitorId").value.trim(),
    h2sBump: selectedRadio("h2sBump"),
    h2sCalibration: selectedRadio("h2sCalibration"),
    date: document.getElementById("driverDate").value,
    time: document.getElementById("driverTime").value,
    driver: document.getElementById("driverName").value.trim(),
    selections: {...driverSelections},
    notes: {...driverNotes},
    generalNotes: document.getElementById("driverGeneralNotes").value
  };
}

async function makeDriverPdf(data) {
  if (!window.jspdf?.jsPDF) throw new Error("PDF library did not load.");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y = 18;

  // New D&L logo
  try {
    const img = await fetch("dnl-logo.png").then(r => r.blob()).then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));
    pdf.addImage(img, "PNG", 18, y, 174, 62);
    y += 68;
  } catch {}

  pdf.setFontSize(16);
  pdf.setFont("helvetica","bold");
  pdf.text(`Driver ${data.type || "Inspection"} Report`, 18, y);
  y += 9;
  pdf.setFontSize(11);
  pdf.setFont("helvetica","normal");

  const lines = [
    `Equipment: ${data.equipment || "-"}`,
    `Truck Unit #: ${data.unit || "-"}`,
    `Truck Fuel Status: ${data.fuelStatus || "-"}`,
    `Trailer Attached: ${data.hasTrailer ? "Yes" : "No"}`,
    ...(data.hasTrailer ? [
      `Trailer Unit #: ${data.trailerUnit || "-"}`,
      `Trailer Type: ${data.trailerType || "-"}`
    ] : []),
    `H2S Monitor ID: ${data.h2sMonitorId || "-"}`,
    `H2S Bump Test: ${data.h2sBump || "NOT MARKED"}`,
    `H2S Calibration: ${data.h2sCalibration || "NOT MARKED"}`,
    `Date: ${data.date || "-"}`,
    `Time: ${data.time || "-"}`,
    `Driver: ${data.driver || "-"}`
  ];
  lines.forEach(t => { pdf.text(t,18,y); y += 6; });
  y += 3;

  pdf.setFont("helvetica","bold");
  pdf.text("INSPECTION",18,y); y += 7;
  pdf.setFont("helvetica","normal");

  driverItems.forEach(item => {
    if (y > 275) { pdf.addPage(); y = 20; }
    const state = data.selections?.[item] || "NOT MARKED";
    const wrapped = pdf.splitTextToSize(`${state} - ${item}`, 174);
    pdf.text(wrapped,18,y);
    y += wrapped.length * 5.5;
    if (data.notes?.[item]) {
      const note = pdf.splitTextToSize(`Defect: ${data.notes[item]}`, 168);
      pdf.text(note,24,y);
      y += note.length * 5.5;
    }
  });


  if (data.hasTrailer) {
    if (y > 245) { pdf.addPage(); y = 20; }
    y += 4;
    pdf.setFont("helvetica","bold");
    pdf.text("TRAILER INSPECTION",18,y); y += 7;
    pdf.setFont("helvetica","normal");

    driverTrailerItems.forEach(item => {
      if (y > 275) { pdf.addPage(); y = 20; }
      const state = data.trailerSelections?.[item] || "NOT MARKED";
      const wrapped = pdf.splitTextToSize(`${state} - ${item}`, 174);
      pdf.text(wrapped,18,y);
      y += wrapped.length * 5.5;
      if (data.trailerNotes?.[item]) {
        const note = pdf.splitTextToSize(`Defect: ${data.trailerNotes[item]}`, 168);
        pdf.text(note,24,y);
        y += note.length * 5.5;
      }
    });
  }

  if (data.generalNotes) {
    if (y > 250) { pdf.addPage(); y = 20; }
    y += 4;
    pdf.setFont("helvetica","bold");
    pdf.text("DRIVER NOTES",18,y); y += 7;
    pdf.setFont("helvetica","normal");
    const note = pdf.splitTextToSize(data.generalNotes,174);
    pdf.text(note,18,y);
  }

  const filename = `DNL_Driver_${(data.type||"Inspection").replace(/\s+/g,"_")}_Unit_${data.unit||"Unknown"}_${data.date||"NoDate"}.pdf`;
  return new File([pdf.output("blob")], filename, {type:"application/pdf"});
}

async function sharePdfFile(file, title, text) {
  if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
    await navigator.share({title, text, files:[file]});
  } else {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

document.getElementById("shareDriverBtn").addEventListener("click", async () => {
  try {
    const data = currentDriverData();
    if (!data.unit || !data.driver) {
      alert("Please enter Truck Unit # and Driver before sending the PDF.");
      return;
    }
    if (data.hasTrailer && !data.trailerUnit) {
      alert("Please enter the Trailer Unit #.");
      return;
    }
    if (!data.h2sBump || !data.h2sCalibration) {
      alert("Please mark both the H2S bump test and calibration PASS or FAIL.");
      return;
    }
    const file = await makeDriverPdf(data);
    await sharePdfFile(
      file,
      `D&L Driver ${data.type} - Unit ${data.unit}`,
      `Driver ${data.type} report for Unit ${data.unit}. Please review the attached PDF.`
    );
    document.getElementById("driverStatus").textContent = "Driver PDF ready to send to mechanics.";
  } catch (e) {
    if (e?.name !== "AbortError") alert(e?.message || "Could not create driver PDF.");
  }
});

const projectJobTypes = [
  "Oil Change","Fuel Filter","Brakes","Tires","Lights","Hub Bearings",
  "S-Cams","S-Cam Tubes","Brake Pots","Brake Air Lines","Air Bags"
];

const projectJobs = document.getElementById("projectJobs");
const projectTireAxleField = document.getElementById("projectTireAxleField");
const axleRelatedJobs = new Set(["Brakes","Tires","Hub Bearings","S-Cams","S-Cam Tubes","Brake Pots","Brake Air Lines","Air Bags"]);

function syncProjectTireAxleVisibility() {
  const show = selectedProjectJobs().some(job => axleRelatedJobs.has(job));
  projectTireAxleField.hidden = !show;
  if (!show) document.getElementById("projectTireAxle").value = "";
}

function buildProjectJobOptions(selected=[]) {
  projectJobs.innerHTML = "";
  projectJobTypes.forEach(job => {
    const label = document.createElement("label");
    label.className = "job-option";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = job;
    cb.checked = selected.includes(job);
    cb.addEventListener("change", syncProjectTireAxleVisibility);
    const span = document.createElement("span");
    span.textContent = job;
    label.appendChild(cb);
    label.appendChild(span);
    projectJobs.appendChild(label);
  });
  syncProjectTireAxleVisibility();
}

function selectedProjectJobs() {
  return [...projectJobs.querySelectorAll('input[type="checkbox"]:checked')].map(x => x.value);
}

function getProjects() {
  try { return JSON.parse(localStorage.getItem("dnlWorkProjects") || "[]"); }
  catch { return []; }
}
function setProjects(p) {
  localStorage.setItem("dnlWorkProjects", JSON.stringify(p));
}

function clearProjectForm() {
  document.getElementById("projectId").value = "";
  document.getElementById("projectUnit").value = "";
  document.getElementById("projectMechanic").value = "";
  document.getElementById("projectPriority").value = "Normal";
  document.getElementById("projectStatus").value = "Needs Repair";
  document.getElementById("projectOtherRepair").value = "";
  document.getElementById("projectTireAxle").value = "";
  document.getElementById("projectParts").value = "";
  document.getElementById("projectNotes").value = "";
  document.getElementById("projectCompletedDate").value = "";
  buildProjectJobOptions([]);
}

function renderProjects(search="") {
  const list = document.getElementById("projectList");
  const q = search.toLowerCase().trim();
  const projects = getProjects();
  list.innerHTML = "";

  projects
    .map((record,index)=>({record,index}))
    .filter(({record}) => [
      record.unit, record.mechanic, record.status, ...(record.jobs||[]),
      record.otherRepair, record.tireAxle, record.parts
    ].join(" ").toLowerCase().includes(q))
    .forEach(({record,index}) => {
      const card = document.createElement("div");
      card.className = "project-card";
      const title = document.createElement("h3");
      title.textContent = `Unit ${record.unit} — ${record.status}`;
      card.appendChild(title);
      const p = document.createElement("p");
      const jobs = [...(record.jobs||[])];
      if (record.otherRepair) jobs.push(record.otherRepair);
      p.textContent = `Work: ${jobs.join(", ") || "Not specified"} • Mechanic: ${record.mechanic || "-"}`;
      card.appendChild(p);

      if (record.tireAxle) {
        const loc = document.createElement("p");
        loc.textContent = "Tire / Axle: " + record.tireAxle;
        card.appendChild(loc);
      }

      if (record.parts) {
        const parts = document.createElement("p");
        parts.textContent = "Parts Needed: " + record.parts;
        card.appendChild(parts);
      }

      const actions = document.createElement("div");
      actions.className = "project-actions";

      const edit = document.createElement("button");
      edit.className = "secondary";
      edit.textContent = "Open / Edit";
      edit.addEventListener("click", () => {
        document.getElementById("projectId").value = record.id;
        document.getElementById("projectUnit").value = record.unit || "";
        document.getElementById("projectEquipment").value = record.equipment || "Semi-Truck";
        document.getElementById("projectMechanic").value = record.mechanic || "";
        document.getElementById("projectDateStarted").value = record.dateStarted || "";
        document.getElementById("projectPriority").value = record.priority || "Normal";
        document.getElementById("projectStatus").value = record.status || "Needs Repair";
        document.getElementById("projectOtherRepair").value = record.otherRepair || "";
        document.getElementById("projectTireAxle").value = record.tireAxle || "";
        document.getElementById("projectParts").value = record.parts || "";
        document.getElementById("projectNotes").value = record.notes || "";
        document.getElementById("projectCompletedDate").value = record.completedDate || "";
        buildProjectJobOptions(record.jobs || []);
        window.scrollTo({top:0,behavior:"smooth"});
      });

      const del = document.createElement("button");
      del.className = "danger";
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        if (!confirm("Delete this work project?")) return;
        const next = getProjects();
        next.splice(index,1);
        setProjects(next);
        renderProjects(document.getElementById("projectSearch").value);
      });

      actions.appendChild(edit);
      actions.appendChild(del);
      card.appendChild(actions);
      list.appendChild(card);
    });

  if (!list.children.length) list.innerHTML = "<p>No work projects found.</p>";
}

document.getElementById("saveProjectBtn").addEventListener("click", () => {
  const unit = document.getElementById("projectUnit").value.trim();
  const jobs = selectedProjectJobs();
  const otherRepair = document.getElementById("projectOtherRepair").value.trim();
  if (!unit) { alert("Please enter a Unit #."); return; }
  if (!jobs.length && !otherRepair) { alert("Select a repair or enter Other Repair."); return; }

  const rec = {
    id: document.getElementById("projectId").value || String(Date.now()),
    unit,
    equipment: document.getElementById("projectEquipment").value,
    mechanic: document.getElementById("projectMechanic").value.trim(),
    dateStarted: document.getElementById("projectDateStarted").value,
    priority: document.getElementById("projectPriority").value,
    status: document.getElementById("projectStatus").value,
    jobs,
    otherRepair,
    tireAxle: document.getElementById("projectTireAxle").value.trim(),
    parts: document.getElementById("projectParts").value,
    notes: document.getElementById("projectNotes").value,
    completedDate: document.getElementById("projectCompletedDate").value,
    updatedAt: new Date().toISOString()
  };

  const projects = getProjects();
  const i = projects.findIndex(p => p.id === rec.id);
  if (i >= 0) projects[i] = rec; else projects.push(rec);
  setProjects(projects);
  document.getElementById("projectFormStatus").textContent = "Project saved.";
  renderProjects(document.getElementById("projectSearch").value);
  clearProjectForm();
});


async function makeProjectPdf(data) {
  if (!window.jspdf?.jsPDF) throw new Error("PDF library did not load.");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y = 18;

  try {
    const img = await fetch("dnl-logo.png").then(r => r.blob()).then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));
    pdf.addImage(img, "PNG", 18, y, 174, 62);
    y += 68;
  } catch {}

  pdf.setFontSize(16);
  pdf.setFont("helvetica","bold");
  pdf.text("Completed Work Project",18,y); y += 9;
  pdf.setFontSize(11);
  pdf.setFont("helvetica","normal");

  const jobs = [...(data.jobs || [])];
  if (data.otherRepair) jobs.push(data.otherRepair);

  const fields = [
    `Unit #: ${data.unit || "-"}`,
    `Equipment: ${data.equipment || "-"}`,
    `Mechanic: ${data.mechanic || "-"}`,
    `Date Started: ${data.dateStarted || "-"}`,
    `Completion Date: ${data.completedDate || "-"}`,
    `Priority: ${data.priority || "-"}`,
    `Status: ${data.status || "-"}`
  ];
  fields.forEach(t => { pdf.text(t,18,y); y += 6; });

  y += 4;
  pdf.setFont("helvetica","bold"); pdf.text("WORK COMPLETED",18,y); y += 7;
  pdf.setFont("helvetica","normal");
  const work = pdf.splitTextToSize(jobs.join(", ") || "Not specified",174);
  pdf.text(work,18,y); y += work.length*5.5 + 4;

  if (data.tireAxle) {
    pdf.setFont("helvetica","bold"); pdf.text("TIRE / AXLE WORKED ON",18,y); y += 7;
    pdf.setFont("helvetica","normal");
    const tireAxle = pdf.splitTextToSize(data.tireAxle,174);
    pdf.text(tireAxle,18,y); y += tireAxle.length*5.5 + 4;
  }

  pdf.setFont("helvetica","bold"); pdf.text("PARTS",18,y); y += 7;
  pdf.setFont("helvetica","normal");
  const parts = pdf.splitTextToSize(data.parts || "None recorded.",174);
  pdf.text(parts,18,y); y += parts.length*5.5 + 4;

  pdf.setFont("helvetica","bold"); pdf.text("WORK NOTES",18,y); y += 7;
  pdf.setFont("helvetica","normal");
  const notes = pdf.splitTextToSize(data.notes || "None recorded.",174);
  pdf.text(notes,18,y);

  const filename = `DNL_Completed_Work_Unit_${data.unit||"Unknown"}_${data.completedDate||"NoDate"}.pdf`;
  return new File([pdf.output("blob")], filename, {type:"application/pdf"});
}

document.getElementById("shareProjectBtn").addEventListener("click", async () => {
  try {
    const unit = document.getElementById("projectUnit").value.trim();
    const status = document.getElementById("projectStatus").value;
    if (!unit) { alert("Please enter a Unit #."); return; }
    if (status !== "Completed") {
      alert("Mark the project Completed before sending it to the bookkeeper.");
      return;
    }
    const data = {
      unit,
      equipment: document.getElementById("projectEquipment").value,
      mechanic: document.getElementById("projectMechanic").value.trim(),
      dateStarted: document.getElementById("projectDateStarted").value,
      priority: document.getElementById("projectPriority").value,
      status,
      jobs: selectedProjectJobs(),
      otherRepair: document.getElementById("projectOtherRepair").value.trim(),
      tireAxle: document.getElementById("projectTireAxle").value.trim(),
      parts: document.getElementById("projectParts").value,
      notes: document.getElementById("projectNotes").value,
      completedDate: document.getElementById("projectCompletedDate").value
    };
    const file = await makeProjectPdf(data);
    await sharePdfFile(
      file,
      `D&L Completed Work - Unit ${unit}`,
      `Completed work record for Unit ${unit}. Attached for file storage.`
    );
    document.getElementById("projectFormStatus").textContent = "Completed work PDF ready to send to bookkeeper.";
  } catch (e) {
    if (e?.name !== "AbortError") alert(e?.message || "Could not create completed work PDF.");
  }
});

document.getElementById("newProjectBtn").addEventListener("click", clearProjectForm);
document.getElementById("projectSearch").addEventListener("input", e => renderProjects(e.target.value));

const APP_VERSION = "24";

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
          if (!noteBox.hidden) {
            setTimeout(() => {
              noteBox.focus();
              noteBox.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
          }
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

  try {
    const logo = await fetch("dnl-logo.png").then(r => r.blob()).then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));
    pdf.addImage(logo, "PNG", 18, state.y, 174, 62);
    state.y += 68;
  } catch {}

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


const todayV2 = new Date().toISOString().slice(0,10);
document.getElementById("driverDate").value = todayV2;
document.getElementById("projectDateStarted").value = todayV2;

buildDriverChecklist();
buildProjectJobOptions();
renderProjects();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register(
        "service-worker.js?v=24",
        { updateViaCache: "none" }
      );
      reg.update();
    } catch (e) {
      console.warn("Service worker registration failed:", e);
    }
  });
}


/* ---------------- PHONE DICTATION HELPERS ----------------
   Uses the phone's built-in keyboard dictation instead of browser speech APIs.
   Works with Android and iPhone/iPad keyboards.
----------------------------------------------------------- */

function addDictationHint(textarea) {
  if (!(textarea instanceof HTMLTextAreaElement)) return;
  if (textarea.dataset.dictationReady === "true") return;

  textarea.dataset.dictationReady = "true";

  const hint = document.createElement("div");
  hint.className = "dictation-hint";
  hint.textContent = "🎙️ Tap this box, then use your phone keyboard microphone to dictate.";
  textarea.insertAdjacentElement("afterend", hint);
}

function installDictationHints(root = document) {
  root.querySelectorAll("textarea").forEach(addDictationHint);
}

const dictationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches?.("textarea")) addDictationHint(node);
      installDictationHints(node);
    });
  });
});

dictationObserver.observe(document.body, {
  childList: true,
  subtree: true
});

installDictationHints();
