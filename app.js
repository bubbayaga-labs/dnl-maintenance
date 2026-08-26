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

    section.appendChild(heading);

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
      section.appendChild(row);
    });

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
  .addEventListener("click", () => {

    const data = collectData();

    const reportWindow = window.open("", "_blank");

    const statusRows = Object.entries(data.statuses || {})
      .map(([item, status]) => {
        const note =
          data.notes && data.notes[item]
            ? data.notes[item]
            : "";

        return `
          <tr>
            <td>${item}</td>
            <td>${status}</td>
            <td>${note}</td>
          </tr>
        `;
      })
      .join("");

    reportWindow.document.write(`
      <!doctype html>
      <html>
      <head>
        <title>D&L Service Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #111;
          }

          h1 {
            text-align: center;
            margin-bottom: 4px;
          }

          h2 {
            text-align: center;
            margin-top: 0;
            font-size: 18px;
          }

          .info {
            margin: 25px 0;
            line-height: 1.7;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th,
          td {
            border: 1px solid #999;
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }

          th {
            background: #eee;
          }

          .repairs {
            margin-top: 25px;
          }

          .signature {
            margin-top: 35px;
          }

          .signature img {
            max-width: 350px;
            border-bottom: 1px solid #333;
          }

          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>

      <body>

        <h1>D&L Fluid Hauling Ltd.</h1>
        <h2>Shop Service Report</h2>

        <div class="info">
          <strong>Equipment:</strong>
          ${data.equipmentType || "-"}
          <br>

          <strong>Unit #:</strong>
          ${data.unitNumber || "-"}
          <br>

          <strong>Date:</strong>
          ${data.serviceDate || "-"}
          <br>

          <strong>Time:</strong>
          ${data.serviceTime || "-"}
          <br>

          <strong>Odometer:</strong>
          ${data.odometer || "-"} km
          <br>

          <strong>Engine Hours:</strong>
          ${data.engineHours || "-"}
          <br>

          <strong>Technician:</strong>
          ${data.technician || "-"}
        </div>

        <table>
          <thead>
            <tr>
              <th>Inspection Item</th>
              <th>Status</th>
              <th>Defect / Repair Note</th>
            </tr>
          </thead>

          <tbody>
            ${statusRows}
          </tbody>
        </table>

        <div class="repairs">
          <h3>Additional Defects / Repairs Fixed</h3>
          <p>
            ${data.repairs || "None recorded."}
          </p>
        </div>

        <div class="signature">
          <h3>Technician Signature</h3>

          ${
            data.signature
              ? `<img src="${data.signature}" alt="Technician Signature">`
              : "<p>No signature recorded.</p>"
          }
        </div>

        <br>

        <button onclick="window.print()">
          Print / Save PDF
        </button>

      </body>
      </html>
    `);

    reportWindow.document.close();
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
