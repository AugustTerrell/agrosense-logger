(function () {
    "use strict";
    
    const STORAGE_KEY = "greenhouse_status_records_v1";

    // Imported DOM elements
    const queueCount = document.getElementById("queue-count");
    const inputForm = document.getElementById("input-form");
    const errorBanner = document.getElementById("form-error-banner");
    const btnPurgeQueue = document.getElementById("purge-queue");
    const emptyState = document.getElementById("empty-state");
    const cardsList = document.getElementById("cardsList");

    // Form input fields
    const inputStaffName = document.getElementById("staff-name");
    const inputBayID = document.getElementById("bay-id");
    const inputPH = document.getElementById("ph");
    const inputConductivity = document.getElementById("conductivity");
    const inputAirTemp = document.getElementById("air-temp");
    const inputHumidity = document.getElementById("humidity");

    // Initial state
    let records = loadRecords();

    // Initial UI call/render
    render();

    // Storage read operation
    function loadRecords() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load records from data store", error);
            return [];
        }
    }

    // Storage write operation
    function saveRecords() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error("Failed to write to the data store", error);
        }
    }

    // DOM render function
    function render() {
        queueCount.textContent = records.length;

        if (records.length === 0) {
            emptyState.classList.remove("hidden");
            cardsList.innerHTML = "";
            return;
        }

        emptyState.classList.add("hidden");
        const fragment = document.createDocumentFragment();

        // Create and fill HTML elements for each record
        records.forEach(function (rec) {
            const li = document.createElement("li");
            li.className = "log-card status-" + rec.status.level;

            li.innerHTML = `<div class="card-header">
                    <div>
                        <div class="bay-id-text">${escapeHTML(rec.bayID)}</div>
                        <div class="staff-name-text">Logged by: ${escapeHTML(rec.staffName)}</div>
                        <span class="risk-badge ${escapeHTML(rec.status.label)}"></span>
                    </div>
                </div>

                <div class="bay-stats">
                    <p class="stat-item">
                        Soil pH: ${escapeHTML(rec.ph)}
                    </p>

                    <p class="stat-item">
                        Electrical Conductivity: ${escapeHTML(rec.conductivity)}
                        <span>(mS/cm)</span>
                    </p>

                    <p class="stat-item">
                        Air Temperature: ${escapeHTML(rec.airTemp)}
                        <span>(&deg;F)</span>
                    </p>

                    <p class="stat-item">
                        Relative Humidity: ${escapeHTML(rec.humidity)}
                        <span>(%)</span>
                    </p>
                </div>

                <div>
                    <button id="purge-card" class="btn btn-outline-danger btn-block">Delete Record</button>
                </div>`;
        });

        // Prevent HTML injection via form inputs
    }
})();