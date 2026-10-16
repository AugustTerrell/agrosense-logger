(function () {
    "use strict";

    
    
    const STORAGE_KEY = "greenhouse_status_records_v1";

    // Imported DOM elements
    const queueCount = document.getElementById("queue-count");
    const inputForm = document.getElementById("input-form");
    const errorBanner = document.getElementById("form-error-banner");
    const btnClearHistory = document.getElementById("clear-history");
    const emptyState = document.getElementById("empty-state");
    const cardsList = document.getElementById("cards-list");

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

    // Status classification logic
    function findStatus(ph, conductivity, airTemp, humidity) {
        if ((ph < 5.0 || ph > 7.5) && (airTemp < 55.0 || airTemp > 95.0) && (conductivity < 0.2 || conductivity > 4.5) && (humidity < 30 || humidity > 90)) {
            return {level: 'critical', label: 'Critical'};
        } else if ((ph >= 5.5 && ph <=6.5) && (airTemp >= 64.4 && airTemp <= 71.6) && (conductivity >= 1.0 && conductivity <= 2.0) && (humidity >= 50 && humidity <= 70)) {
            return {level: 'optimal', label: 'Optimal'};
        } else {
            return {level: 'warning', label: 'Warning'};
        }
    }

    // Input form validation
    function validateInput(dataObject) {
        const errors = [];

        if (!dataObject.bayID.trim()) {
            errors.push('Bay ID Number is a required field');
        }

        if (!dataObject.staffName.trim()) {
            errors.push('Staff Member Name is a required field');
        }

        if (isNaN(dataObject.ph) || dataObject.ph < 0.0 || dataObject.ph > 14.0) {
            errors.push('Soil pH must be a number between 0.0 and 14.0');
        }

        if (isNaN(dataObject.conductivity) || dataObject.conductivity < 0.0 || dataObject.conductivity > 10.0) {
            errors.push('Electrical Conductivity must be a number between 0.0 and 10.0');
        }

        if (isNaN(dataObject.airTemp) || dataObject.airTemp < 0.0 || dataObject.airTemp > 110.0) {
            errors.push('Air Temperature must be a number between 0.0 and 110.0');
        }

        if (isNaN(dataObject.humidity) || dataObject.humidity < 10 || dataObject.humidity > 100) {
            errors.push('Soil pH must be a number between 10 and 100');
        }

        return errors;
    }

    // Event handler for input form submit button
    inputForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            id: crypto.randomUUID(),
            bayID: inputBayID.value,
            staffName: inputStaffName.value,
            ph: parseFloat(inputPH.value, 10),
            conductivity: parseFloat(inputConductivity.value, 10),
            airTemp: parseFloat(inputAirTemp.value, 10),
            humidity: parseInt(inputHumidity.value, 10),
        };

        const errors = validateInput(formData);
        if (errors.length > 0) {
            showError(errors.join(' '));
            return;
        }

        hideError();

        formData.status = findStatus(formData.ph, formData.conductivity, formData.airTemp, formData.humidity);

        records.unshift(formData);
        saveRecords();

        inputForm.reset();
        inputStaffName.focus();

        render();
    });

    // Event handler for the Clear Log History button
    btnClearHistory.addEventListener('click', (event) => {
        if (records.length === 0) {
            return;
        } else if (confirm('Are you sure you want to clear the entire log history?')) {
            records = [];
            saveRecords();
            render();
        }
    });

    // Event handler for the individual Delete Record buttons
    cardsList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('btn-discharge')) {
            if (confirm("Are you sure you want to delete this record?")) {
                const recordID = target.dataset.id;
                records = records.filter(function (record) {
                    return record.id !== recordID;
                });

                saveRecords();
                render();
            }
        }
    });

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

            li.innerHTML = `<div>
                    <div class="card-header">
                        <div class="card-header-text">
                            <div class="bay-id-text">${escapeHTML(rec.bayID)}</div>
                            <div class="staff-name-text">${escapeHTML(rec.staffName)}</div>
                        </div>
                        <span class="risk-badge ${rec.status.level}">${rec.status.label}</span>
                    </div>

                <div class="bay-stats">
                    <div class="stat-item">
                        <span class="stat-title">Soil pH</span>
                        <div class="stat-num">${rec.ph}</div>
                    </div>

                    <div class="stat-item">
                        <span class="stat-title">Electrical Conductivity</span>
                        <div class="stat-num">${rec.conductivity} <span>mS/cm</span></div>
                    </div>

                    <div class="stat-item">
                        <span class="stat-title">Air Temperature</span>
                        <div class="stat-num">${rec.airTemp}<span>&deg;F</span></div>
                    </div>

                    <div class="stat-item">
                        <span class="stat-title">Relative Humidity</span>
                        <div class="stat-num">${rec.humidity}<span>%</span></div>
                    </div>
                </div>

                <button data-id="${rec.id}" class="btn btn-outline-danger btn-sm btn-block btn-discharge">Delete Record</button>
            </div>`;

            fragment.appendChild(li);
        });

        cardsList.innerHTML = "";
        cardsList.appendChild(fragment);
    }

    // Dynamically show error message
    function showError(message) {
        errorBanner.textContent = message;
        errorBanner.classList.remove('hidden');
    }

    // Dynamically hide error message
    function hideError() {
        errorBanner.textContent = "";
        errorBanner.classList.add('hidden');
    }

    // Sanitize user inputs to prevent code injection through the form
    function escapeHTML(input) {
        return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
})();