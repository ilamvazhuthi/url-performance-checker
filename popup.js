
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

document.getElementById('clearCacheBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'clearCache' });
});

// Function to convert data to CSV format and initiate download
function downloadCSV() {
  const url = document.getElementById('url').textContent;
  const loadTime = document.getElementById('loadTime').textContent;
  const user_counts = [10000, 25000, 50000, 75000, 100000];
  let csvContent = "URL,Load Time\n";
  csvContent += `${url},${loadTime} ms\n`;

  user_counts.forEach((count) => {
    const projection = document.getElementById('projection_' + count).textContent;
    csvContent += `Projected for ${count} users,${projection} ms\n`;
  });

  // Create a blob and initiate download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const urlBlob = URL.createObjectURL(blob);
  link.setAttribute('href', urlBlob);
  link.setAttribute('download', 'performance_data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add event listener for the "Export to CSV" button
document.getElementById('exportCsvBtn').addEventListener('click', downloadCSV);
