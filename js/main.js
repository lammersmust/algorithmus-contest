const createText = value => document.createTextNode(value + "");
const createSpan = countryCode => {
    let span = document.createElement('span');
    span.classList.add('flag-icon');
    span.classList.add('flag-icon-' + countryCode.toLowerCase());
    return span;
};

(function () {
    createPercentileGraphForAllTasks();
    createResultsTable();
}());

function createResultsTable() {
    let maxRowCount = 50;
    let tableRef = document.getElementsByClassName('participants__tbody')[0];
    participants.participants.forEach((entry, rowNumber) => {
        if (rowNumber >= maxRowCount) return;
        let row = tableRef.insertRow();
        createCell(row, +rowNumber + 1, createText);
        createCell(row, entry.name, createText);
        createCell(row, entry.country, createSpan);
        createCell(row, entry.title, createText);
        Object.keys(participants.ceiling).forEach(key => createCell(row, entry[key], createText));
        let score = Object.keys(participants.ceiling).reduce((accumulator, key) => +accumulator + +entry[key], 0);
        createCell(row, score, createText);
    });
}

function createCell(row, value, createNode) {
    let cell = row.insertCell();
    cell.appendChild(createNode(value));
}

function createPercentileGraphForAllTasks() {
    Object.keys(participants.ceiling).forEach(function(entry) {
        createPercentileGraph(entry);
    });
}

function createPercentileGraph(taskName) {
    let maxPoint = participants.ceiling[taskName];
    let dataOfGraph = {};
    dataOfGraph.title = taskName.toUpperCase() + ' Task';
    dataOfGraph.dataTitle = "People count";
    dataOfGraph.labelTitle = "Points";
    dataOfGraph.labels = [];
    dataOfGraph.data = [];
    for (let p = 0; p <= 1; p += 0.1) {
        let par = maxPoint * p;
        let x = (par).toFixed(0) + " (" + (p * 100).toFixed(0) + "%)";
        dataOfGraph.labels.push(x);
        let n = 0;
        participants.participants.forEach(function(entry) {
            if (entry[taskName] <= par) {
                n++;
            }
        });
        dataOfGraph.data.push(n);
    }
    createLineGraph(dataOfGraph, taskName + 'Task');
}

function createLineGraph(chartGraphic, elementId) {
    let ctx = document.getElementById(elementId).getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartGraphic.labels,
            datasets: [{
                label: chartGraphic.title,
                data: chartGraphic.data,
                borderColor: 'rgb(65,73,240)',
                backgroundColor: 'rgb(65,73,240, 0.1)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: chartGraphic.dataTitle
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: chartGraphic.labelTitle
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0
                }
            },
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0
        }
    });
}