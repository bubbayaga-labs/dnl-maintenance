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

let savedSelections = {};
let savedNotes = {};
function buildChecklist() {

  checklist.innerHTML = "";

  const selectedEquipment = equipmentType.value;

  const allowedSections =
    equipmentSections[selectedEquipment] || Object.keys(sections);

  allowedSections.forEach(sectionTitle => {

    const section = document.createElement("section");
    section.className = "card";

    const heading = document.createElement("h2");
    heading.textContent = sectionTitle;
heading.className = "collapsible-heading";

heading.addEventListener("click", () => {
  const content = section.querySelector(".section-content");

  if (content.style.display === "none") {
    content.style.display = "block";
heading.textContent = "▶ " + sectionTitle;
  } else {
    content.style.display = "none";
    heading.textContent = "▶ " + sectionTitle;
  }
});

heading.textContent = "▶ " + sectionTitle;
    section.appendChild(heading);
const sectionContent = document.createElement("div");
sectionContent.className = "section-content";
sectionContent.style.display = "none";
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

      ["PASS", "FAIL", "FIXED", "N/A"].forEach(status => {

        const label = document.createElement("label");
        label.className = "status-choice";

        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "status_" + item;
        radio.value = status;
        radio.dataset.item = item;

        if (savedSelections[item] === status) {
          radio.checked = true;
        }

radio.addEventListener("change", () => {
  savedSelections[item] = status;

  if (status === "FAIL" || status === "FIXED") {
    noteBox.style.display = "block";
  } else {
    noteBox.style.display = "none";
  }
});


        const text = document.createElement("span");
        text.textContent = status;

        label.appendChild(radio);
        label.appendChild(text);

        choices.appendChild(label);
      });

      row.appendChild(choices);
const noteBox = document.createElement("textarea");

noteBox.className = "defect-note";
noteBox.placeholder = "Describe defect or repair completed...";
noteBox.dataset.item = item;

noteBox.value = savedNotes[item] || "";

noteBox.style.display =
  savedSelections[item] === "FAIL" ||
  savedSelections[item] === "FIXED"
    ? "block"
    : "none";

noteBox.addEventListener("input", () => {
  savedNotes[item] = noteBox.value;
});

row.appendChild(noteBox);
sectionContent.appendChild(row);    });

    checklist.appendChild(section);
  });
}

equipmentType.addEventListener("change", () => {
  buildChecklist();
});

buildChecklist();


const fields = [
  "equipmentType",
  "unitNumber",
  "serviceDate",
  "serviceTime",
  "odometer",
  "engineHours",
  "technician",
  "repairs",
  "confirmComplete"
];


const signaturePad =
  document.getElementById("signaturePad");

const ctx =
  signaturePad.getContext("2d");

ctx.lineWidth = 3;
ctx.lineCap = "round";

let drawing = false;
let hasSignature = false;


function getPoint(e) {

  const rect =
    signaturePad.getBoundingClientRect();

  const scaleX =
    signaturePad.width / rect.width;

  const scaleY =
    signaturePad.height / rect.height;

  const point =
    e.touches ? e.touches[0] : e;

  return {

    x:
      (point.clientX - rect.left) *
      scaleX,

    y:
      (point.clientY - rect.top) *
      scaleY
  };
}


function startDraw(e) {

  e.preventDefault();

  drawing = true;

  const point = getPoint(e);

  ctx.beginPath();

  ctx.moveTo(
    point.x,
    point.y
  );
}


function draw(e) {

  if (!drawing) return;

  e.preventDefault();

  const point = getPoint(e);

  ctx.lineTo(
    point.x,
    point.y
  );

  ctx.stroke();

  hasSignature = true;
}


function endDraw(e) {

  if (e) {
    e.preventDefault();
  }

  drawing = false;
}


["mousedown", "touchstart"].forEach(eventName => {

  signaturePad.addEventListener(
    eventName,
    startDraw,
    {
      passive: false
    }
  );

});


["mousemove", "touchmove"].forEach(eventName => {

  signaturePad.addEventListener(
    eventName,
    draw,
    {
      passive: false
    }
  );

});


[
  "mouseup",
  "mouseleave",
  "touchend"
].forEach(eventName => {

  signaturePad.addEventListener(
    eventName,
    endDraw,
    {
      passive: false
    }
  );

});


document
  .getElementById("clearSignature")
  .addEventListener("click", () => {

    ctx.clearRect(
      0,
      0,
      signaturePad.width,
      signaturePad.height
    );

    hasSignature = false;
  });


function collectData() {

  const data = {};

  fields.forEach(id => {

    const element =
      document.getElementById(id);

    if (
      element.type === "checkbox"
    ) {

      data[id] =
        element.checked;

    } else {

      data[id] =
        element.value;
    }

  });

  data.statuses =
    savedSelections;
data.notes =
  savedNotes;
  data.signature =
    hasSignature
      ? signaturePad.toDataURL("image/png")
      : null;

  return data;
}


function applyData(data) {

  fields.forEach(id => {

    const element =
      document.getElementById(id);

    if (
      !element ||
      data[id] === undefined
    ) {

      return;
    }

    if (
      element.type === "checkbox"
    ) {

      element.checked =
        data[id];

    } else {

      element.value =
        data[id];
    }

  });

  savedSelections =
    data.statuses || {};
  savedNotes =
  data.notes || {};
  buildChecklist();


  if (data.signature) {

    const image =
      new Image();

    image.onload = () => {

      ctx.clearRect(
        0,
        0,
        signaturePad.width,
        signaturePad.height
      );

      ctx.drawImage(
        image,
        0,
        0,
        signaturePad.width,
        signaturePad.height
      );

      hasSignature = true;
    };

    image.src =
      data.signature;
  }
}

function saveToServiceHistory() {
  const currentRecord = collectData();

  currentRecord.savedAt = new Date().toISOString();

  const history = JSON.parse(
    localStorage.getItem("dnlServiceHistory") || "[]"
  );

  history.push(currentRecord);

  localStorage.setItem(
    "dnlServiceHistory",
    JSON.stringify(history)
  );

  return history.length;
}
document
  .getElementById("saveBtn")
  .addEventListener("click", () => {
const unitNumber =
  document.getElementById("unitNumber").value.trim();

const technician =
  document.getElementById("technician").value.trim();

if (!unitNumber || !technician) {
  alert("Please enter both Unit # and Technician before saving.");
  return;
}
    localStorage.setItem(
      "dnlMaintenanceForm",
      JSON.stringify(
        collectData()
      )
    );
const recordNumber = saveToServiceHistory();
    document
      .getElementById("status")
      .textContent =
"Service saved. History records: " + recordNumber;
  });

document
  .getElementById("printBtn")
  .addEventListener("click", async () => {

    const data = collectData();

    const unit = data.unitNumber || "Unknown";
    const filename =
      "DNL_Unit_" + unit + "_Service_Report.pdf";

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 20;

    function addLine(text, bold = false) {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFont(
        "helvetica",
        bold ? "bold" : "normal"
      );

      const lines =
        pdf.splitTextToSize(
          String(text),
          175
        );

      pdf.text(lines, 18, y);

      y += lines.length * 7;
    }

    pdf.setFontSize(18);
    addLine("D&L Fluid Hauling Ltd.", true);

    pdf.setFontSize(14);
    addLine("Shop Service Report", true);

    y += 4;

    pdf.setFontSize(11);

    addLine(
      "Equipment: " +
      (data.equipmentType || "-")
    );

    addLine(
      "Unit #: " +
      (data.unitNumber || "-")
    );

    addLine(
      "Date: " +
      (data.serviceDate || "-")
    );

    addLine(
      "Time: " +
      (data.serviceTime || "-")
    );

    addLine(
      "Odometer: " +
      (data.odometer || "-") +
      " km"
    );

    addLine(
      "Engine Hours: " +
      (data.engineHours || "-")
    );

    addLine(
      "Technician: " +
      (data.technician || "-")
    );

    y += 5;

    addLine("INSPECTION RESULTS", true);

    Object.entries(
      data.statuses || {}
    ).forEach(([item, status]) => {

      addLine(
        status + " - " + item,
        true
      );

      if (
        data.notes &&
        data.notes[item]
      ) {
        addLine(
          "Note: " +
          data.notes[item]
        );
      }

      y += 2;
    });

    if (data.repairs) {
      y += 4;

      addLine(
        "DEFECTS / REPAIRS FIXED",
        true
      );

      addLine(data.repairs);
    }

    if (data.signature) {
      if (y > 220) {
        pdf.addPage();
        y = 20;
      }

      y += 8;

      addLine(
        "TECHNICIAN SIGNATURE",
        true
      );

      try {
        pdf.addImage(
          data.signature,
          "PNG",
          18,
          y,
          70,
          25
        );

        y += 30;
      } catch (error) {
        addLine(
          "Signature could not be added."
        );
      }
    }

    const pdfBlob =
      pdf.output("blob");

    const pdfFile =
      new File(
        [pdfBlob],
        filename,
        {
          type: "application/pdf"
        }
      );

    try {

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [pdfFile]
        })
      ) {

        await navigator.share({
          title:
            "D&L Service Report - Unit " +
            unit,

          text:
            "D&L Fluid Hauling service report for Unit " +
            unit,

          files: [pdfFile]
        });

      } else {

        const link =
          document.createElement("a");

        link.href =
          URL.createObjectURL(
            pdfBlob
          );

        link.download =
          filename;

        link.click();

        URL.revokeObjectURL(
          link.href
        );

        alert(
          "PDF downloaded. You can attach it to a text or email."
        );
      }

    } catch (error) {

      if (
        error.name !== "AbortError"
      ) {
        console.error(error);

        alert(
          "Could not share the PDF. The report will be downloaded instead."
        );

        pdf.save(filename);
      }
    }
  });
document
  .getElementById("clearBtn")
  .addEventListener("click", () => {

    const confirmClear =
      confirm(
        "Are you sure you want to clear the entire service form?"
      );

    if (!confirmClear) {
      return;
    }

    localStorage.removeItem(
      "dnlMaintenanceForm"
    );

    location.reload();

  });


const savedData =
  localStorage.getItem(
    "dnlMaintenanceForm"
  );


if (savedData) {

  try {

    applyData(
      JSON.parse(savedData)
    );

  } catch (error) {

    console.log(
      "Could not load saved checklist."
    );

  }
}


if (
  !document
    .getElementById("serviceDate")
    .value
) {

  const today =
    new Date();

  document
    .getElementById("serviceDate")
    .value =
    today
      .toISOString()
      .slice(0, 10);
}


if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker.register(
        "service-worker.js"
      );

    }
  );
}
function displayServiceHistory(searchTerm = "") {
  const history = JSON.parse(
    localStorage.getItem("dnlServiceHistory") || "[]"
  );

  const historyList = document.getElementById("historyList");

  historyList.innerHTML = "";

  const filteredHistory = history.filter(record => {
    const unit = String(record.unitNumber || "").toLowerCase();
    return unit.includes(searchTerm.toLowerCase());
  });

  if (filteredHistory.length === 0) {
    historyList.innerHTML = "<p>No service records found.</p>";
    return;
  }

  filteredHistory
    .slice()
    .reverse()
    .forEach((record, index) => {

      const card = document.createElement("div");
      card.className = "history-record";

      const title = document.createElement("h3");
      title.textContent =
        "Unit " + (record.unitNumber || "Not Entered");

      card.appendChild(title);

      const info = document.createElement("p");

      info.innerHTML =
        "<strong>Equipment:</strong> " +
        (record.equipmentType || "-") +
        "<br>" +

        "<strong>Date:</strong> " +
        (record.serviceDate || "-") +
        "<br>" +

        "<strong>Odometer:</strong> " +
        (record.odometer || "-") +
        " km<br>" +

        "<strong>Engine Hours:</strong> " +
        (record.engineHours || "-") +
        "<br>" +

        "<strong>Technician:</strong> " +
        (record.technician || "-");

      card.appendChild(info);


      const problemItems = [];

      if (record.statuses) {
        Object.entries(record.statuses).forEach(
          ([item, status]) => {

            if (
              status === "FAIL" ||
              status === "FIXED"
            ) {
              problemItems.push({
                item: item,
                status: status,
                note:
                  record.notes &&
                  record.notes[item]
                    ? record.notes[item]
                    : ""
              });
            }
          }
        );
      }


      if (problemItems.length > 0) {

        const repairsTitle =
          document.createElement("h4");

        repairsTitle.textContent =
          "Defects / Repairs";

        card.appendChild(repairsTitle);


        problemItems.forEach(problem => {

          const repair =
            document.createElement("p");

          repair.innerHTML =
            "<strong>" +
            problem.status +
            ":</strong> " +
            problem.item +
            (
              problem.note
                ? "<br>Note: " + problem.note
                : ""
            );

          card.appendChild(repair);

        });
      }


      if (record.repairs) {

        const generalRepairs =
          document.createElement("p");

        generalRepairs.innerHTML =
          "<strong>Additional Repairs:</strong><br>" +
          record.repairs;

        card.appendChild(generalRepairs);
      }

const deleteButton = document.createElement("button");

deleteButton.type = "button";
deleteButton.className = "danger";
deleteButton.textContent = "Delete Record";

deleteButton.addEventListener("click", () => {

  const confirmDelete = confirm(
    "Delete this service record? This cannot be undone."
  );

  if (!confirmDelete) return;

  const originalIndex =
    history.indexOf(record);

  if (originalIndex !== -1) {
    history.splice(originalIndex, 1);

    localStorage.setItem(
      "dnlServiceHistory",
      JSON.stringify(history)
    );
  }

  displayServiceHistory(
    document.getElementById("historySearch").value
  );
});
const openButton = document.createElement("button");

openButton.type = "button";
openButton.className = "secondary";
openButton.textContent = "Open Record";

openButton.addEventListener("click", () => {

  applyData(record);

  document.getElementById("historyPanel").style.display = "none";

  document.getElementById("historyBtn").textContent =
    "View Service History";

  document.getElementById("status").textContent =
    "Service record loaded.";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

card.appendChild(openButton);
card.appendChild(deleteButton);
      historyList.appendChild(card);
    });
}


document
  .getElementById("historyBtn")
  .addEventListener("click", () => {

    const panel =
      document.getElementById("historyPanel");

    if (panel.style.display === "none") {

      panel.style.display = "block";

      displayServiceHistory();

      document
        .getElementById("historyBtn")
        .textContent =
        "Hide Service History";

    } else {

      panel.style.display = "none";

      document
        .getElementById("historyBtn")
        .textContent =
        "View Service History";
    }

  });


document
  .getElementById("historySearch")
  .addEventListener("input", event => {

    displayServiceHistory(
      event.target.value
    );

  });


document
  .getElementById("completeBtn")
  .addEventListener("click", () => {

    const unitNumber =
      document.getElementById("unitNumber").value.trim();

    const technician =
      document.getElementById("technician").value.trim();

    if (!unitNumber || !technician) {
      alert(
        "Please enter both Unit # and Technician before completing the service."
      );
      return;
    }

    const confirmed = confirm(
      "Are you sure this service is complete?"
    );

    if (!confirmed) {
      return;
    }

    saveToServiceHistory();

    localStorage.removeItem(
      "dnlMaintenanceForm"
    );

    alert(
      "Service for Unit " +
      unitNumber +
      " has been completed and saved."
    );

    location.reload();
  });
document
  .getElementById("historyBtnTop")
  .addEventListener("click", () => {
    document.getElementById("historyBtn").click();
  });

document
  .getElementById("clearBtnTop")
  .addEventListener("click", () => {
    document.getElementById("clearBtn").click();
  });
