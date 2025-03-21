/*!
 * Copyright (c) Bastiaan de Hart.
 * Licensed under MIT license
 */

importScripts("lib.js");

// Start monitoring
loadSettingsAndStart();

// Listeners for changes
chrome.storage.onChanged.addListener(loadSettingsAndStart);
chrome.idle.onStateChanged.addListener(monitorGitHub);