
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
