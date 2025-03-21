/*!
 * Copyright (c) Bastiaan de Hart.
 * Licensed under MIT license
 */

document.addEventListener("DOMContentLoaded", () => {
    document.title = chrome.i18n.getMessage("settings_title");

    document.getElementById("settingsTitle").textContent = chrome.i18n.getMessage("settings_title");
    document.getElementById("settingsDescription").textContent = chrome.i18n.getMessage("settings_description");

    document.getElementById("apiKeyLabel").textContent = chrome.i18n.getMessage("api_key_label");

    document.getElementById("statusOnlineLabel").textContent = chrome.i18n.getMessage("status_online_label");
    document.getElementById("statusOfflineLabel").textContent = chrome.i18n.getMessage("status_offline_label");

    document.getElementById("btn_save").textContent = chrome.i18n.getMessage("button_save");
    document.getElementById("btn_token").textContent = chrome.i18n.getMessage("button_token");
    document.getElementById("btn_sourcecode").textContent = chrome.i18n.getMessage("button_source_code");

    chrome.storage.sync.get(["apiKey", "status_online", "status_offline"], (data) => {

            document.getElementById("apiKey").value = data.apiKey || "";
            document.getElementById("status_online").value = data.status_online || "🟢 Online";
            document.getElementById("status_offline").value = data.status_offline || "🔴 Offline";
        }
    );

    document.getElementById("btn_save").addEventListener("click", () => {

        chrome.storage.sync.set({

                apiKey: document.getElementById("apiKey").value,
                status_online: document.getElementById("status_online").value,
                status_offline: document.getElementById("status_offline").value,

            }, () => alert(chrome.i18n.getMessage("api_key_saved"))
        );
    });

    document.getElementById("btn_token").addEventListener("click", () => {
        window.open("https://github.com/settings/personal-access-tokens", "_blank");
    });

    document.getElementById("btn_sourcecode").addEventListener("click", () => {
        window.open("https://github.com/Bastiaantjuhh/gh-online-indicator", "_blank");
    });
});