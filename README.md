
# OS Scheduling Visualizer

## Project Description
The OS Scheduling Visualizer is a web-based application designed to demonstrate and compare different disk scheduling and CPU scheduling algorithms. It helps students understand how operating systems manage disk requests and CPU processes through graphical visualizations.

## Features

### Disk Scheduling
The application supports the following disk scheduling algorithms:
- FCFS (First Come First Serve)
- SSTF (Shortest Seek Time First)
- SCAN
- C-SCAN
- LOOK

Disk scheduling features:
- Enter disk size, initial head position, and request queue.
- Select the direction for SCAN and LOOK algorithms.
- View the disk head movement graph.
- Display the service sequence.
- Calculate total head movement.
- Compare algorithms using a bar chart.

### CPU Scheduling
The application supports:
- FCFS (First Come First Serve)
- Round Robin

CPU scheduling features:
- Enter process ID, arrival time, burst time, and time quantum.
- Display the Gantt chart.
- Calculate completion time.
- Calculate waiting time.
- Calculate turnaround time.
- Display average waiting and turnaround times.

### Additional Features
- Previous and Next buttons to navigate visualizations.
- Autoplay option to animate scheduling steps.
- Stop button to stop the animation.
- Input validation.
- Responsive user interface.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Chart.js

## Project Structure

    OS_Scheduling_Visualizer/
    │
    ├── index.html
    ├── styles.css
    ├── app.js
    └── README.md

## How to Run the Project

1. Download or clone the project.
2. Open the project folder.
3. Make sure all files are in the same folder.
4. Open `index.html` in a web browser.
5. Enter the required inputs.
6. Select a scheduling algorithm.
7. Click the Run or Visualize button to view the results.

**Note:** An internet connection is required to load Chart.js from its CDN.

## Sample Disk Scheduling Input

- Disk Size: 200
- Initial Head Position: 50
- Request Queue: 82, 170, 43, 140, 24, 16, 190

## Expected Sample Results

- FCFS Total Head Movement: 642
- SSTF Total Head Movement: 208

## CPU Scheduling Algorithms

The project implements FCFS and Round Robin CPU scheduling algorithms.

## Conclusion

The OS Scheduling Visualizer provides an interactive way to understand disk scheduling and CPU scheduling algorithms. It displays scheduling sequences, graphical representations, and performance metrics to help compare different algorithms.
