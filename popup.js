
chrome.runtime.sendMessage({ action: 'startTest' });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateStatus') {
    document.getElementById('status').textContent = message.status;
  } else if (message.action === 'updateLoadTime') {
    document.getElementById('loadTime').textContent = parseFloat(message.time).toFixed(2);
  } else if (message.action === 'updateURL') {
    const urlElem = document.getElementById('url');
    urlElem.textContent = message.url;
    urlElem.setAttribute('title', message.url);  // set the title attribute
      } else if (message.action === 'updateProjections') {
    const user_counts = [10000, 25000, 50000, 75000, 100000];
    user_counts.forEach((count, index) => {
      document.getElementById('projection_' + count).textContent = parseFloat(message.projections[index]).toFixed(2);
    });
  }
});
