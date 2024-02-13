
let count = 0;



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
      let totalTurnaroundTime = 0;


      
      let jobsData = []
      for(let i=0; i < noOfCPUs; i++) {
        jobsData.push([]);
      }
  
      for (let i = 1; i < table.rows.length; i++) {
          const row = table.rows[i];
          const arrivalTime = parseInt(row.cells[1].childNodes[0].value, 10);
          const burstTime = parseInt(row.cells[2].childNodes[0].value, 10);
  
          // Find the first available CPU or the one that will be available the earliest
          const cpuIndex = cpus.indexOf(Math.min(...cpus));
          const startTime = Math.max(cpus[cpuIndex], arrivalTime);
          const endTime = startTime + burstTime;
          const turnaroundTime = endTime - arrivalTime;
  
          // Update table with calculated times
          row.cells[3].innerText = startTime;
          row.cells[4].innerText = endTime;
          row.cells[5].innerText = turnaroundTime;
  
          // Update CPU end time to the end time of the current job
          cpus[cpuIndex] = endTime;
  
          // Accumulate total turnaround time
          totalTurnaroundTime += turnaroundTime;

          
          jobsData[cpuIndex].push({ jobNumber: i, startTime: startTime, endTime: endTime })
          drawGanttChart(jobsData, 'ganttChartCanvas', jobsData);
      }
  
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

            if(tempJob .length > 0 ){
        
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
                drawGanttChart(jobsData, 'ganttChartCanvas', jobsData);
                temp++;
            }
            else {
                const cpuIndex = cpus.indexOf(Math.min(...cpus));
                cpus[cpuIndex]++;
            }
      }
      
    //   for (const job of jobs) {
    //       // Find the first available CPU or the one that will be available the earliest
    //       const cpuIndex = cpus.indexOf(Math.min(...cpus));
    //       const startTime = Math.max(cpus[cpuIndex], job.arrivalTime);
    //       const endTime = startTime + job.burstTime;
    //       const turnaroundTime = endTime - job.arrivalTime;
  
    //       // Update table with calculated times
    //       job.row.cells[3].innerText = startTime;
    //       job.row.cells[4].innerText = endTime;
    //       job.row.cells[5].innerText = turnaroundTime;
  
    //       // Update CPU end time to the end time of the current job
    //       cpus[cpuIndex] = endTime;
  
    //       // Accumulate total turnaround time
    //       totalTurnaroundTime += turnaroundTime;
    // }
  
    // Display total turnaround time
    document.getElementById('totalTurnaroundTime').innerText = totalTurnaroundTime/count;
  }




  function drawGanttChart(jobsData, canvasId, jobsData) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Set the width and height of the canvas
    canvas.width = 500;
    canvas.height = 200;
    
    const cpuHeight = canvas.height / jobsData.length; // Height of each CPU row
    const maxTime = Math.max(...jobsData.map(cpu => Math.max(...cpu.map(job => job.endTime))));
    const timeScale = canvas.width / maxTime; // Scale to fit all jobs in the canvas width
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    
    // Draw the jobs on the canvas
    jobsData.forEach((cpuJobs, cpuIndex) => {
      cpuJobs.forEach(job => {
        const startX = job.startTime * timeScale;
        const jobWidth = (job.endTime - job.startTime) * timeScale;
        
        // Draw the job rectangle
        ctx.beginPath();
        ctx.rect(startX, cpuHeight * cpuIndex, jobWidth, cpuHeight - 5);
        ctx.fillStyle = getRandomColor(); // Get a random color for each job
        ctx.fill();
        ctx.stroke();
        
        // Add text (job name) on the rectangle
        ctx.fillStyle = 'black';
        ctx.fillText(`J${job.jobNumber}`, startX + 5, cpuHeight * cpuIndex + cpuHeight / 2);
      });
    });
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
  
