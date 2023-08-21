
let startTimes = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTest') {
    startTimes = {};
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tab = tabs[0];
      startTimes[tab.id] = Date.now();
      chrome.runtime.sendMessage({ action: 'updateURL', url: tab.url });
      chrome.tabs.reload(tab.id);
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && startTimes[tabId]) {
    const actualLoadTime = parseFloat((Date.now() - startTimes[tabId]).toFixed(2));
    delete startTimes[tabId];
    
    // Simple linear degradation model for projections
    // These factors are placeholders and can be adjusted based on real-world data
    const user_counts = [10000, 25000, 50000, 75000, 100000];
    const projectedLoadTimes = user_counts.map(count => actualLoadTime * (1 + count / 100000));

    chrome.runtime.sendMessage({ action: 'updateLoadTime', time: actualLoadTime });
    chrome.runtime.sendMessage({ action: 'updateProjections', projections: projectedLoadTimes });
    chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Load time calculated.' });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'clearCache') {
    chrome.browsingData.remove({}, { cache: true }, () => {
      chrome.runtime.sendMessage({ action: 'updateStatus', status: 'Cache cleared.' });
    });
  }
});

const DUMMY_FILE_URL = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const DUMMY_FILE_SIZE_MB = 0.015;  // An estimation of the file size in MB

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'testInternetSpeed') {
    const startTime = Date.now();
    fetch(DUMMY_FILE_URL)
      .then(response => response.blob())
      .then(data => {
        const endTime = Date.now();
        const durationSeconds = (endTime - startTime) / 1000;
        const speedMbps = (DUMMY_FILE_SIZE_MB / durationSeconds).toFixed(2);
        chrome.runtime.sendMessage({ action: 'updateSpeedResult', speed: speedMbps });
      });
  }
});
