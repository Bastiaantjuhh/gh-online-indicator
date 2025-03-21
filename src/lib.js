/*!
 * Copyright (c) Bastiaan de Hart.
 * Licensed under MIT license
 */

let lastStatus = null;
let apiKey = "";
let statusOnline = "🟢 Online";
let statusOffline = "🔴 Offline";
let intervalId = null;

// Load settings and (re)start monitoring
function loadSettingsAndStart() {
    chrome.storage.sync.get(
        {
            apiKey: "",
            status_online: "🟢 Online",
            status_offline: "🔴 Offline",
        },
        (data) => {
            apiKey = data.apiKey;
            statusOnline = data.status_online;
            statusOffline = data.status_offline;

            restartMonitoring();
        }
    );
}

// Check itself
function monitorGitHub() {
    chrome.idle.queryState(15, (state) => {
        if (state === "idle" || state === "locked") {

            updateStatus(statusOffline);
        } else {

            chrome.tabs.query({}, (tabs) => {
                const isOpen = tabs.some(
                    (tab) => tab.url && tab.url.includes("github.com")
                );
                updateStatus(isOpen ? statusOnline : statusOffline);
            });
        }
    });
}

// Function to update (POST Req.) status and update icon
function updateStatus(statusMessage) {

    if (statusMessage === lastStatus) return;

    lastStatus = statusMessage;

    let iconPath = "dynamic/icon_default.webp";
    if (statusMessage === statusOnline) iconPath = "dynamic/icon_online.webp";
    if (statusMessage === statusOffline) iconPath = "dynamic/icon_offline.webp";

    chrome.action.setIcon({ path: iconPath });

    if (!apiKey) {

        console.log("API Key not set...");
        return;
    }

    // DOCS: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#update-the-authenticated-user
    fetch("https://api.github.com/user", {
        
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ bio: statusMessage }),
    })
        // .then(data => console.log("Response: ", data))
        .catch((error) => console.error("POST request error: ", error));
}

// Start or restart monitoring
function restartMonitoring() {
    let checkInterval = 10 * 1000;

    if (intervalId) clearInterval(10);
    intervalId = setInterval(monitorGitHub, checkInterval);

    console.log("Monitoring started.");
}