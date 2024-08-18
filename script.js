document.addEventListener('DOMContentLoaded', () => {
  const updateDateButton = document.getElementById('updateDateButton');
  const checkStatusButton = document.getElementById('checkStatusButton');
  const viewDatesButton = document.getElementById('viewDatesButton');
  const statusElement = document.getElementById('status');
  const dateList = document.getElementById('dateList');
  
  let dates = JSON.parse(localStorage.getItem('msUpdateDates')) || [];

  updateDateButton.addEventListener('click', () => {
    const currentDate = new Date();
    
    if (dates.length === 0) {
      addDate(currentDate);
    } else {
      const latestDate = new Date(dates[dates.length - 1]);
      const diffTime = Math.abs(currentDate - latestDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let canUpdate = false;
      
      if (dates.length >= 15 && diffDays > 90) {
        canUpdate = true;
      } else if (dates.length >= 10 && diffDays > 60) {
        canUpdate = true;
      } else if (dates.length >= 5 && diffDays > 30) {
        canUpdate = true;
      } else if (diffDays >= 5) {
        canUpdate = true;
      }
      
      if (canUpdate) {
        addDate(currentDate);
      } else {
        alert("You cannot ms update at this time.");
      }
    }

    updateChart();
    checkStatus();
    
    const audio = new Audio('Sound2.mp3');
    audio.play();
  });

  function addDate(date) {
    dates.push(date);
    localStorage.setItem('msUpdateDates', JSON.stringify(dates));
    alert(`Date updated to: ${date.toLocaleString()}`);
  }

  function checkStatus() {
    if (dates.length === 0) {
      statusElement.textContent = 'You not ms';
      updateChart();
      return;
    }

    const latestDate = new Date(dates[dates.length - 1]);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - latestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let message = '';
    if (dates.length >= 15) {
      message = diffDays > 90 ? 'You can ms <br> after ms you will update ms' : 'You cannot ms after 90 days';
    } else if (dates.length >= 10) {
      message = diffDays > 60 ? 'You can ms <br> after ms you will update ms' : 'You cannot ms after 60 days';
    } else if (dates.length >= 5) {
      message = diffDays > 30 ? 'You can ms <br> after ms you will update ms' : 'You cannot ms after 30 days';
    } else if (diffDays < 5) {
      message = `Sorry, you cannot ms after ${5-diffDays} days.`;
    } else {
      message = 'You can ms <br> after ms you will update ms';
    }

    statusElement.innerHTML = `${message}<br>Days since last update: ${diffDays}`;
  }

  checkStatusButton.addEventListener('click', checkStatus);

  viewDatesButton.addEventListener('click', () => {
    dateList.innerHTML = '';

    dates.forEach((date, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = new Date(date).toLocaleString();
      listItem.classList.add('fade-in');
      setTimeout(() => {
        dateList.appendChild(listItem);
      }, index * 100);
    });

    const audio = new Audio('Sounds.mp3');
    audio.play();
  });

  const ctx = document.getElementById('numberChart').getContext('2d');
  const numberChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Show Line Graph',
        data: [],
        borderColor: 'red',
        borderWidth: 2,
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });

  function updateChart() {
    let chartData = [];
    let count = 0;
    
    for (let i = 0; i < dates.length; i++) {
      count++;
      chartData.push(count);
      
      if (i < dates.length - 1) {
        const currentDate = new Date(dates[i]);
        const nextDate = new Date(dates[i + 1]);
        const diffDays = Math.ceil((nextDate - currentDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          for (let j = 0; j < diffDays - 1; j++) {
            count = Math.max(0, count - 10);
            chartData.push(count);
          }
        }
      }
    }

    numberChart.data.labels = chartData.map((_, index) => index + 1);
    numberChart.data.datasets[0].data = chartData;
    numberChart.update();
  }

  updateChart();
});
//request
document.addEventListener('DOMContentLoaded', () => {
  const requestViewButton = document.getElementById('request-view');
  const requestDownloadButton = document.getElementById('request-download');
  const statusElement = document.getElementById('status');
  const dateList = document.getElementById('dateList');
  
  // Create a new button for displaying request history
  const showRequestHistoryButton = document.getElementById('request-history');
  showRequestHistoryButton.textContent = 'Show Request History';
  document.querySelector('.container').appendChild(showRequestHistoryButton);

  requestViewButton.addEventListener('click', () => {
    const dates = JSON.parse(localStorage.getItem('msUpdateDates')) || [];
    
    if (dates.length === 0) {
      statusElement.textContent = 'No MS updates recorded.';
      return;
    }

    const latestDate = new Date(dates[dates.length - 1]);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - latestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let viewTime = 0;
    let message = '';

    if (diffDays > 12) {
      viewTime = 10;
      message = 'Your request is accepted. You can view for 10 minutes.';
    } else if (diffDays > 8) {
      viewTime = 20;
      message = 'Your request is accepted. You can view for 20 minutes.';
    } else {
      statusElement.textContent = `You cannot view at this time. ${10 - diffDays} days remaining.`;
      return;
    }

    statusElement.textContent = message;
    showDates(dates);
    setTimeout(() => {
      statusElement.textContent = 'View time expired.';
      dateList.innerHTML = '';
    }, viewTime * 60000); // Convert minutes to milliseconds

    // Store the accepted request
    storeAcceptedRequest(currentDate, viewTime);
  });

  requestDownloadButton.addEventListener('click', () => {
    const dates = JSON.parse(localStorage.getItem('msUpdateDates')) || [];
    
    if (dates.length === 0) {
      statusElement.textContent = 'No MS updates recorded.';
      return;
    }

    const latestDate = new Date(dates[dates.length - 1]);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - latestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 2) {
      statusElement.textContent = 'Your request is accepted. You can download.';
      downloadDates(dates);
    } else {
      statusElement.textContent = `You cannot download at this time. ${2 - diffDays} days remaining.`;
    }
  });

  showRequestHistoryButton.addEventListener('click', () => {
    displayRequestHistory();
  });

  function showDates(dates) {
    dateList.innerHTML = '';
    dates.forEach((date, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = new Date(date).toLocaleString();
      dateList.appendChild(listItem);
    });
  }

  function downloadDates(dates) {
    const content = dates.map(date => new Date(date).toLocaleString()).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ms_update_dates.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function storeAcceptedRequest(date, viewTime) {
    const requests = JSON.parse(localStorage.getItem('acceptedRequests')) || [];
    requests.push({ date: date.toISOString(), viewTime });
    localStorage.setItem('acceptedRequests', JSON.stringify(requests));
  }

  function displayRequestHistory() {
    const requests = JSON.parse(localStorage.getItem('acceptedRequests')) || [];
    dateList.innerHTML = '';
    if (requests.length === 0) {
      statusElement.textContent = 'No accepted requests found.';
      return;
    }
    requests.forEach((request, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Request ${index + 1}: ${new Date(request.date).toLocaleString()} - View time: ${request.viewTime} minutes`;
      dateList.appendChild(listItem);
    });
    statusElement.textContent = 'Displaying request history';
  }
});

//script button
const fountain = document.getElementById('fountain');
const sprayButton = document.getElementById('sprayButton');
const statusDisplay = document.getElementById('status');
const sprayCount = 40;
let isAnimating = false;

function createSpray() {
    const spray = document.createElement('div');
    spray.classList.add('spray');
    
    const angle = Math.random() * Math.PI;
    const velocity = 100 + Math.random() * 100;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * -velocity;

    spray.style.setProperty('--tx', `${tx}px`);
    spray.style.setProperty('--ty', `${ty}px`);
    spray.style.animation = `spray ${1 + Math.random()}s linear forwards`;

    fountain.appendChild(spray);

    setTimeout(() => spray.remove(), 1000);
}

function startSpray() {
    for (let i = 0; i < sprayCount; i++) {
        setTimeout(createSpray, Math.random() * 200);
    }
}

function updateStatus(message) {
    statusDisplay.textContent = message;
}

async function sprayPattern() {
    if (isAnimating) return;
    isAnimating = true;
    sprayButton.disabled = true;

    // Initial spray for 1 second
   // updateStatus("Spraying for 0.5 second");
    let interval = setInterval(startSpray, 100);
    await new Promise(resolve => setTimeout(resolve, 500));
    clearInterval(interval);

   // updateStatus("Pausing for 1 second");
    await new Promise(resolve => setTimeout(resolve, 500));

    // Second spray pattern for 1 second
   // updateStatus("Spraying for 1 second");
    interval = setInterval(startSpray, 20);
    await new Promise(resolve => setTimeout(resolve, 1000));
    clearInterval(interval);

   // updateStatus("Pausing for 1 second");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Spray on high for 3 seconds
    //updateStatus("Spraying for 1 second");
    interval = setInterval(startSpray, 400);
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(interval);

    //updateStatus("Spray pattern complete");
    isAnimating = false;
    sprayButton.disabled = false;
}

sprayButton.addEventListener('click', sprayPattern);
