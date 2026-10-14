# agrosense-logger

CSI 3150 Project 2 (Fall 2026), by August Terrell

## User Journey Funnel

* **Starting State:** The user opens the page and notices a horizontal form panel with several inputs and a clearly marked submit button. Below is another horizontal panel, which may be empty or may contain a number of logs from a previous visit, corresponding to the "Recent Entries" counter in the top right of the page.
* **Action 1 (User Stories 1 & 5):** The user enters data into each form input, activating a red outline and small error message if a value is out of bounds.
* **Action 2 (User Story 1):** The user clicks the "Submit" button. If all fields contain values in the permitted range, said values are sent to a JavaScript function for processing. If not, an error message appears prompting the user to edit their inputs and resubmit.
* **Action 3 (User Stories 2 & 3):** Once inputs are submitted and processed, they are placed in local browser storage. The user then notices a new log card added to the bottom panel, containing the values they entered and a color-coded status tag indicating the state of the greenhouse bay as either "Optimal" (green), "Warning" (yellow), or "Critical Hazard" (red).
* **Action 4 (User Story 4):** The user may either delete an individual log using the "Remove" button at the bottom of its card, or may purge the entire log history using the "Purge Queue" button at the top right of the panel. In both cases, they will be asked to confirm this decision before it is executed, and the deleted information will be removed from local storage.
* **Terminal State:** If there are logs remaining in the output panel, each will have a color-coded card, and the "Recent Entries" counter will show the corresponding number. If no logs remain, the output panel will show its empty-state message, and the counter will be zero. Either way, the UI state will persist in local storage until the next time the user opens the page.
