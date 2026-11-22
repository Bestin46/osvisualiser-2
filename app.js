// DISK SCHEDULING

let diskResult = null;
let diskIndex = 0;
let diskTimer = null;

let cpuResult = null;
let cpuIndex = 0;
let cpuTimer = null;

let seekChart = null;
let compareChart = null;

const $ = id => document.getElementById(id);

// Disk scheduling algorithms

function calculateDisk(algorithm, size, head, requests, direction) {

    let path = [head];
    let service = [];

    function add(x) {
        path.push(x);
        service.push(x);
    }

    let left = requests.filter(x => x < head).sort((a,b) => a-b);
    let right = requests.filter(x => x >= head).sort((a,b) => a-b);

    if (algorithm === "FCFS") {
        requests.forEach(add);
    }

    else if (algorithm === "SSTF") {
        let remaining = [...requests];
        let current = head;

        while (remaining.length) {
            let index = 0;

            for (let i = 1; i < remaining.length; i++) {
                if (Math.abs(remaining[i] - current) <
                    Math.abs(remaining[index] - current)) {
                    index = i;
                }
            }

            current = remaining.splice(index, 1)[0];
            add(current);
        }
    }

    else if (algorithm === "SCAN") {
        if (direction === "Right") {
            right.forEach(add);

            if (path[path.length - 1] !== size - 1)
                path.push(size - 1);

            left.reverse().forEach(add);
        } else {
            left.reverse().forEach(add);

            if (path[path.length - 1] !== 0)
                path.push(0);

            right.forEach(add);
        }
    }

    else if (algorithm === "C-SCAN") {
        if (direction === "Right") {
            right.forEach(add);

            if (path[path.length - 1] !== size - 1)
                path.push(size - 1);

            path.push(0);
            left.forEach(add);
        } else {
            left.reverse().forEach(add);

            if (path[path.length - 1] !== 0)
                path.push(0);

            path.push(size - 1);
            right.reverse().forEach(add);
        }
    }

    else if (algorithm === "LOOK") {
        if (direction === "Right") {
            right.forEach(add);
            left.reverse().forEach(add);
        } else {
            left.reverse().forEach(add);
            right.forEach(add);
        }
    }

    let total = 0;

    for (let i = 1; i < path.length; i++) {
        total += Math.abs(path[i] - path[i - 1]);
    }

    return {path, service, total};
}

// Get disk input

function getDiskInput() {

    let size = Number($("diskSize").value);
    let head = Number($("head").value);

    let requests = $("requests").value
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
        .map(Number);

    if (!Number.isInteger(size) || size < 2)
        throw Error("Invalid disk size.");

    if (!Number.isInteger(head) || head < 0 || head >= size)
        throw Error("Invalid head position.");

    if (!requests.length ||
        requests.some(x => !Number.isInteger(x) || x < 0 || x >= size))
        throw Error("Enter valid disk requests.");

    return {size, head, requests};
}

// Run disk scheduling

function runDisk() {

    $("diskError").textContent = "";

    try {
        let input = getDiskInput();

        let result = calculateDisk(
            $("diskAlgorithm").value,
            input.size,
            input.head,
            input.requests,
            $("direction").value
        );

        diskResult = {
            ...result,
            size: input.size,
            algorithm: $("diskAlgorithm").value
        };

        diskIndex = 0;

        $("diskStatAlgorithm").textContent = diskResult.algorithm;
        $("diskTotal").textContent = result.total;
        $("diskCount").textContent = result.service.length;
        $("serviceSequence").textContent = result.service.join(" → ");

        renderDisk();

    } catch (e) {
        $("diskError").textContent = e.message;
    }
}

// Display disk seek graph

function renderDisk() {

    if (!diskResult) return;

    let shown = diskResult.path.slice(0, diskIndex + 1);

    $("diskStep").textContent =
        `Step ${diskIndex} / ${diskResult.path.length - 1}`;

    if (seekChart) seekChart.destroy();

    seekChart = new Chart($("diskChart"), {
        type: "line",

        data: {
            labels: shown.map((x, i) => i),

            datasets: [{
                label: "Head Position",
                data: shown,
                borderColor: "#6657d9",
                backgroundColor: "#6657d9",
                tension: 0,
                fill: false
            }]
        },

        options: {
            responsive: true,
            animation: false,

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Movement Step"
                    }
                },

                y: {
                    min: 0,
                    max: diskResult.size - 1,
                    title: {
                        display: true,
                        text: "Cylinder Number"
                    }
                }
            }
        }
    });
}

// Compare disk algorithms

function compareDisk() {

    $("diskError").textContent = "";

    try {
        let input = getDiskInput();

        let names = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK"];

        let values = names.map(name =>
            calculateDisk(
                name,
                input.size,
                input.head,
                input.requests,
                $("direction").value
            ).total
        );

        if (compareChart) compareChart.destroy();

        compareChart = new Chart($("compareChart"), {
            type: "bar",

            data: {
                labels: names,

                datasets: [{
                    label: "Total Head Movement",
                    data: values,
                    backgroundColor: [
                        "#8c83e8",
                        "#5c4ecb",
                        "#a69ff0",
                        "#7367db",
                        "#c1bcf7"
                    ]
                }]
            },

            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        $("comparisonValues").innerHTML = names.map(
            (name, i) => `<span>${name}: ${values[i]}</span>`
        ).join("");

    } catch (e) {
        $("diskError").textContent = e.message;
    }
}

// Disk navigation

function diskMove(step) {

    if (!diskResult) return;

    stopDisk();

    diskIndex = Math.max(
        0,
        Math.min(diskResult.path.length - 1, diskIndex + step)
    );

    renderDisk();
}

// Disk autoplay

function playDisk() {

    if (!diskResult) runDisk();
    if (!diskResult) return;

    stopDisk();

    diskTimer = setInterval(() => {

        if (diskIndex >= diskResult.path.length - 1) {
            stopDisk();
            return;
        }

        diskIndex++;
        renderDisk();

    }, 700);
}

// Stop disk animation

function stopDisk() {

    clearInterval(diskTimer);
    diskTimer = null;
}

// CPU SCHEDULING

// Read process details

function readProcesses() {

    let lines = $("processes").value.trim().split("\n");

    let list = [];
    let ids = new Set();

    lines.forEach(line => {

        let p = line.split(",").map(x => x.trim());

        if (p.length !== 4)
            throw Error("Enter PID, Arrival, Burst and Priority.");

        let [pid, a, b, pr] = p;

        let arrival = Number(a);
        let burst = Number(b);
        let priority = Number(pr);

        if (!pid || ids.has(pid))
            throw Error("Process IDs must be unique.");

        if (
            !Number.isInteger(arrival) ||
            arrival < 0 ||
            !Number.isInteger(burst) ||
            burst <= 0 ||
            !Number.isInteger(priority)
        )
            throw Error("Enter valid process values.");

        ids.add(pid);

        list.push({
            pid,
            arrival,
            burst,
            priority
        });
    });

    if (!list.length)
        throw Error("Enter at least one process.");

    return list;
}

// FCFS CPU scheduling

function scheduleFCFS(processes) {

    let sorted = [...processes].sort(
        (a, b) => a.arrival - b.arrival
    );

    let time = 0;
    let segments = [];
    let metrics = {};

    sorted.forEach(p => {

        if (time < p.arrival) {
            segments.push({
                pid: "Idle",
                start: time,
                end: p.arrival
            });

            time = p.arrival;
        }

        let start = time;
        let finish = start + p.burst;

        segments.push({
            pid: p.pid,
            start,
            end: finish
        });

        metrics[p.pid] = {
            ...p,
            completion: finish,
            turnaround: finish - p.arrival,
            waiting: start - p.arrival
        };

        time = finish;
    });

    return {segments, metrics};
}

// Round Robin CPU scheduling

function scheduleRR(processes, quantum) {

    let sorted = [...processes].sort(
        (a, b) => a.arrival - b.arrival
    );

    let remaining = {};

    sorted.forEach(p => {
        remaining[p.pid] = p.burst;
    });

    let queue = [];
    let segments = [];
    let metrics = {};

    let time = 0;
    let i = 0;

    while (i < sorted.length || queue.length) {

        if (
            queue.length === 0 &&
            i < sorted.length &&
            time < sorted[i].arrival
        ) {
            segments.push({
                pid: "Idle",
                start: time,
                end: sorted[i].arrival
            });

            time = sorted[i].arrival;
        }

        while (
            i < sorted.length &&
            sorted[i].arrival <= time
        ) {
            queue.push(sorted[i].pid);
            i++;
        }

        if (queue.length === 0) continue;

        let pid = queue.shift();

        let p = sorted.find(x => x.pid === pid);

        let run = Math.min(quantum, remaining[pid]);

        let start = time;

        time += run;
        remaining[pid] -= run;

        segments.push({
            pid,
            start,
            end: time
        });

        while (
            i < sorted.length &&
            sorted[i].arrival <= time
        ) {
            queue.push(sorted[i].pid);
            i++;
        }

        if (remaining[pid] > 0) {
            queue.push(pid);
        } else {

            metrics[pid] = {
                ...p,
                completion: time,
                turnaround: time - p.arrival,
                waiting: time - p.arrival - p.burst
            };
        }
    }

    return {segments, metrics};
}

// Run CPU scheduling

function runCpu() {

    $("cpuError").textContent = "";

    try {

        let processes = readProcesses();

        let algorithm = $("cpuAlgorithm").value;
        let quantum = Number($("quantum").value);

        if (
            algorithm === "Round Robin" &&
            (!Number.isInteger(quantum) || quantum <= 0)
        ) {
            throw Error("Enter a valid time quantum.");
        }

        cpuResult = algorithm === "FCFS"
            ? scheduleFCFS(processes)
            : scheduleRR(processes, quantum);

        cpuIndex = 0;

        let rows = Object.values(cpuResult.metrics);

        let avgW = rows.reduce(
            (s, p) => s + p.waiting, 0
        ) / rows.length;

        let avgT = rows.reduce(
            (s, p) => s + p.turnaround, 0
        ) / rows.length;

        $("avgWaiting").textContent = avgW.toFixed(2);
        $("avgTurnaround").textContent = avgT.toFixed(2);
        $("processCount").textContent = rows.length;

        $("metricsBody").innerHTML = rows.map(p => `
            <tr>
                <td>${escapeHTML(p.pid)}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td>${p.completion}</td>
                <td>${p.waiting}</td>
                <td>${p.turnaround}</td>
            </tr>
        `).join("");

        renderCpu();

    } catch (e) {
        $("cpuError").textContent = e.message;
    }
}

// Escape process ID text

function escapeHTML(s) {

    return s.replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

// Display Gantt chart

function renderCpu() {

    if (!cpuResult) return;

    $("cpuStep").textContent =
        `Step ${cpuIndex + 1} / ${cpuResult.segments.length}`;

    $("gantt").innerHTML =
        cpuResult.segments.slice(0, cpuIndex + 1).map(
            (s, i) => `
                <div class="gantt-block
                    ${s.pid === "Idle" ? "idle" : ""}
                    ${i === cpuIndex ? "current" : ""}"
                    style="flex:${Math.max(1, s.end - s.start)}">

                    <b>${escapeHTML(s.pid)}</b>
                    <small>${s.start} - ${s.end}</small>
                </div>
            `
        ).join("");
}

// CPU navigation

function cpuMove(step) {

    if (!cpuResult) return;

    stopCpu();

    cpuIndex = Math.max(
        0,
        Math.min(
            cpuResult.segments.length - 1,
            cpuIndex + step
        )
    );

    renderCpu();
}

// CPU autoplay

function playCpu() {

    if (!cpuResult) runCpu();
    if (!cpuResult) return;

    stopCpu();

    cpuTimer = setInterval(() => {

        if (cpuIndex >= cpuResult.segments.length - 1) {
            stopCpu();
            return;
        }

        cpuIndex++;
        renderCpu();

    }, 700);
}

// Stop CPU animation

function stopCpu() {

    clearInterval(cpuTimer);
    cpuTimer = null;
}

// NAVIGATION AND EVENT LISTENERS

// Switch tabs

document.querySelectorAll(".tab").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll(".tab").forEach(b =>
            b.classList.toggle("active", b === btn)
        );

        $("disk-section").classList.toggle(
            "hidden",
            btn.dataset.tab !== "disk"
        );

        $("cpu-section").classList.toggle(
            "hidden",
            btn.dataset.tab !== "cpu"
        );
    });
});

// Disk buttons

$("runDisk").addEventListener("click", runDisk);
$("compareDisk").addEventListener("click", compareDisk);

$("sampleDisk").addEventListener("click", () => {

    $("diskSize").value = 200;
    $("head").value = 50;

    $("requests").value =
        "82, 170, 43, 140, 24, 16, 190";

    $("direction").value = "Right";
    $("diskAlgorithm").value = "FCFS";

    runDisk();
});

$("diskPrev").addEventListener(
    "click", () => diskMove(-1)
);

$("diskNext").addEventListener(
    "click", () => diskMove(1)
);

$("diskPlay").addEventListener("click", playDisk);
$("diskStop").addEventListener("click", stopDisk);

// CPU buttons

$("runCpu").addEventListener("click", runCpu);

$("cpuPrev").addEventListener(
    "click", () => cpuMove(-1)
);

$("cpuNext").addEventListener(
    "click", () => cpuMove(1)
);

$("cpuPlay").addEventListener("click", playCpu);
$("cpuStop").addEventListener("click", stopCpu);

// Initial disk result

runDisk();