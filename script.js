
let count = 0;

function hangeCPU()
{
    console.log("CPU changed")
}
function addRows() { 

    const table = document.getElementById('jobsTable');
    const row = table.insertRow();
    for (let j = 0; j < 6; j++) {
    const cell = row.insertCell();
    if (j === 0) {
        cell.innerText = count + 1; // Job number
        count++;
    } else if (j === 1 || j === 2) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        cell.appendChild(input);
    } else {
        cell.innerText = '0'; // Initialize other cells with '0'
    }
    }
  }

  function removeRows() {
    const table = document.getElementById('jobsTable');
    const lastRow = table.rows[table.rows.length - 1]; // Get the last row
    table.deleteRow(table.rows.length - 1); // Delete the last row
    if (count > 0) {
      count--; // Decrease the job count if there are more than one row
    }
  }
  
  // Common function to calculate the schedule based on the selected method
  function calculateSchedule(method) {
    if (method === 'FCFS') {
      calculateFCFS();
    } else if (method === 'SJF') {
      calculateSJF();
    }
  }
  
  // FCFS Calculation
  function calculateFCFS() {
      const table = document.getElementById('jobsTable');
      const noOfCPUs = parseInt(document.getElementById('noOfCPUs').value, 10);
      let cpus = new Array(noOfCPUs).fill(0); // Track end time for each CPU
      let jobs = [];
      let totalTurnaroundTime = 0;


      
      let jobsData = []
      for(let i=0; i < noOfCPUs; i++) {
        jobsData.push([]);
      }


      // Extract jobs data from the table
      for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const arrivalTime = parseInt(row.cells[1].childNodes[0].value, 10);
        const burstTime = parseInt(row.cells[2].childNodes[0].value, 10);
        jobs.push({ row, arrivalTime, burstTime, startTime: 0, endTime: 0, index:i, isDone: false });
    }

  
    let temp = 0;
    while(temp != count) {
          let cpuMinIndex = cpus.indexOf(Math.min(...cpus));

          let tempJob = [];
          for( let i = 0; i <  jobs.length; i++ ) {
              if(!jobs[i].isDone && jobs[i].arrivalTime <= cpus[cpuMinIndex]) {
                  tempJob.push({ row: jobs[i].row, arrivalTime: jobs[i].arrivalTime, burstTime: jobs[i].burstTime, startTime: jobs[i].startTime, endTime: jobs[i].endTime, index:jobs[i].index+1, isDone: jobs[i].isDone });
              }
          }

          if(tempJob.length > 0 ){
      
              // Sort jobs by burst time
              tempJob.sort((a, b) => a.arrivalTime - b.arrivalTime);
              console.log("tempJob:");
              console.log(tempJob);



              let job1 = tempJob[0];
              console.log("job1");
              console.log(job1);


              const cpuIndex = cpus.indexOf(Math.min(...cpus));
              const startTime = Math.max(cpus[cpuIndex], job1.arrivalTime);
              const endTime = startTime + job1.burstTime;
              const turnaroundTime = endTime - job1.arrivalTime;
      
              // Update table with calculated times
              jobs[job1.index-2].row.cells[3].innerText = startTime;
              jobs[job1.index-2].row.cells[4].innerText = endTime;
              jobs[job1.index-2].row.cells[5].innerText = turnaroundTime;
              
              jobs[job1.index-2].isDone = true;
              // Update CPU end time to the end time of the current job
              console.log("jobs:")
              console.log(jobs);
              cpus[cpuIndex] = endTime;
      
              // Accumulate total turnaround time
              totalTurnaroundTime += turnaroundTime;




              // Adding data to plot chart

              jobsData[cpuIndex].push({ jobNumber: job1.index-1, startTime: startTime, endTime: endTime })
              
              temp++;
          }
          else {
              const cpuIndex = cpus.indexOf(Math.min(...cpus));
              cpus[cpuIndex]++;
          }
    }
    
    drawGanttChart(jobsData, 'ganttChartCanvas', jobsData);
  // Display total turnaround time
  document.getElementById('totalTurnaroundTime').innerText = totalTurnaroundTime/count;
}

  
  // SJF Calculation
  function calculateSJF() {
      const table = document.getElementById('jobsTable');
      const noOfCPUs = parseInt(document.getElementById('noOfCPUs').value, 10);
      let cpus = new Array(noOfCPUs).fill(0); // Track end time for each CPU
      let jobs = [];
      let totalTurnaroundTime = 0;


      let jobsData = []
      for(let i=0; i < noOfCPUs; i++) {
        jobsData.push([]);
      }
    
  
      // Extract jobs data from the table
      for (let i = 1; i < table.rows.length; i++) {
          const row = table.rows[i];
          const arrivalTime = parseInt(row.cells[1].childNodes[0].value, 10);
          const burstTime = parseInt(row.cells[2].childNodes[0].value, 10);
          jobs.push({ row, arrivalTime, burstTime, startTime: 0, endTime: 0, index:i, isDone: false });
      }
  
      
      let temp = 0;
      while(temp != count) {
            let cpuMinIndex = cpus.indexOf(Math.min(...cpus));

            let tempJob = [];
            for( let i = 0; i <  jobs.length; i++ ) {
                if(!jobs[i].isDone && jobs[i].arrivalTime <= cpus[cpuMinIndex]) {
                    tempJob.push({ row: jobs[i].row, arrivalTime: jobs[i].arrivalTime, burstTime: jobs[i].burstTime, startTime: jobs[i].startTime, endTime: jobs[i].endTime, index:jobs[i].index+1, isDone: jobs[i].isDone });
                }
            }

            if(tempJob.length > 0 ){
        
                // Sort jobs by burst time
                tempJob.sort((a, b) => a.burstTime - b.burstTime);
                console.log("tempJob:");
                console.log(tempJob);



                let job1 = tempJob[0];
                console.log("job1");
                console.log(job1);


                const cpuIndex = cpus.indexOf(Math.min(...cpus));
                const startTime = Math.max(cpus[cpuIndex], job1.arrivalTime);
                const endTime = startTime + job1.burstTime;
                const turnaroundTime = endTime - job1.arrivalTime;
        
                // Update table with calculated times
                jobs[job1.index-2].row.cells[3].innerText = startTime;
                jobs[job1.index-2].row.cells[4].innerText = endTime;
                jobs[job1.index-2].row.cells[5].innerText = turnaroundTime;
                
                jobs[job1.index-2].isDone = true;
                // Update CPU end time to the end time of the current job
                console.log("jobs:")
                console.log(jobs);
                cpus[cpuIndex] = endTime;
        
                // Accumulate total turnaround time
                totalTurnaroundTime += turnaroundTime;

                // Adding data to plot chart

                jobsData[cpuIndex].push({ jobNumber: job1.index-1, startTime: startTime, endTime: endTime })
                temp++;
            }
            else {
                const cpuIndex = cpus.indexOf(Math.min(...cpus));
                cpus[cpuIndex]++;
            }
      }

      
      drawGanttChart(jobsData, 'ganttChartCanvas', jobsData);
    // Display total turnaround time
    document.getElementById('totalTurnaroundTime').innerText = totalTurnaroundTime/count;
  }






function drawGanttChart(jobsData, canvasId, jobsData) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 300;
    
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    const cpuHeight = chartHeight / jobsData.length; // Height of each CPU row
    
    const maxTime = Math.max(...jobsData.flatMap(cpu => cpu.map(job => job.endTime)));
    const timeScale = chartWidth / maxTime; // Pixels per time unit
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the x and y axes
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.stroke();
  
    // Draw the jobs on the canvas
    jobsData.forEach((cpuJobs, cpuIndex) => {
      cpuJobs.forEach(job => {
        const startX = margin.left + job.startTime * timeScale;
        const jobWidth = (job.endTime - job.startTime) * timeScale;
  
        // Draw the job rectangle
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(startX, margin.top + cpuHeight * cpuIndex, jobWidth, cpuHeight - 5);
  
        // Add text (job name) on the rectangle
        ctx.fillStyle = 'black';
        ctx.fillText(`J${job.jobNumber}`, startX + 5, margin.top + cpuHeight * cpuIndex + cpuHeight / 2);
      });
    });
  
    // Draw labels on axes
    ctx.textAlign = 'center';

    // console.log(maxTime);


    if( maxTime > 0) {
        for (let i = 0; i <= maxTime; i += Math.round(maxTime / 10)) {
            const x = margin.left + i * timeScale;
            const y = canvas.height - margin.bottom + 15;
            ctx.fillText(i, x, y);
          }
    }
    

    
    // console.log(jobsData);
    // return;
  
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < jobsData.length; i++) {
      const x = margin.left - 10;
      const y = margin.top + cpuHeight * i + cpuHeight / 2;
      ctx.fillText(`CPU-${i + 1}`, x, y);
    }


    
  }
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  function getRandomColor() {
    // Random color for the job rectangles
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Example usage:
  // Assuming jobsData is an array of arrays, with each sub-array representing jobs scheduled on one CPU
  // Each job object has jobNumber, startTime, and endTime properties
  const jobsData = [
    [{ jobNumber: 2, startTime: 0, endTime: 10 } ],
    [{ jobNumber: 3, startTime: 0, endTime: 20 }],
    [{ jobNumber: 1, startTime: 0, endTime: 30 }]
  ];
  
  // Call this function after the page has loaded, or after the jobs data is ready
  drawGanttChart(jobsData, 'ganttChartCanvas', jobsData);
  
