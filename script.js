
let count = 0;

function changeCPU() {
    turnaroundTime = 0; // resetting the variable for each new process.
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
      let totalTurnaroundTime = 0;
  
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