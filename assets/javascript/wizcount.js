let chart;
function loader() {
    document.getElementById("update").addEventListener("click", updateChart);
    document.getElementById("24hTime").addEventListener("change", timeChange);
    document.getElementById("seconds").addEventListener("change", timeChange);

    var ctx = document.getElementById("graph").getContext("2d");
    Chart.defaults.global.defaultFontColor = "lightgray";
    Chart.defaults.global.defaultFontFamily = "'Quicksand', sans-serif";
    chart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                label: "Player count",
                data: [],
                borderColor: "rgba(" + document.documentElement.style.getPropertyValue('--main-color-rgb') + ", 0.29)",
                backgroundColor: "rgba(" + document.documentElement.style.getPropertyValue('--main-color-rgb') + ", 0.06)",
                pointStyle: "rectRot",
                pointBackgroundColor: document.documentElement.style.getPropertyValue('--main-color')
            }]
        },
        options: {
            title: {
                display: true,
                text: "Loading..."
            },
            maintainAspectRatio: false,
            tooltips: {
                intersect: false
            },
            legend: {
                position: "bottom",
                align: "start"
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "# of players in Wizards"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Time (local)"
                    },
                    type: "time",
                    time: {
                        unit: "minute",
                        displayFormats: { minute: "HH:mm" },
                        tooltipFormat: "MMMM Do, HH:mm"
                    }
                }]
            }
        }
    });
    updateChart();
}

async function updateChart() {
    document.getElementById("update").disabled = true;
    setTimeout(() => {
        document.getElementById("update").disabled = false;
    }, 1000);
    document.getElementById("count").innerHTML = "Loading...";
    let apiHTML = await fetch("https://wizcount.plotzes.ml");
    apiHTML = await apiHTML.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(apiHTML, "text/html");
    const apiData = JSON.parse(doc.getElementsByTagName("pre")[0].innerHTML);
    const datacenter = doc.getElementsByTagName("h1")[0].innerHTML;
    chart.options.title.text = "History from datacenter " + datacenter;
    let newLabels = [];
    let newData = [];
    for(let i = 0; i < apiData.length; i++) {
        const point = apiData[i];
        newLabels.push(point.time);

        const formattedPoint = {
            x: new Date(point.time),
            y: point.count
        };
        newData.push(formattedPoint);
    }

    const diffMs = newData[newData.length - 1].x - newData[0].x;
    const diffMins = Math.floor((diffMs/1000)/60);
    let stepSize;
    if(diffMins < 1 * 60) {
        stepSize = 1;
    } else if(diffMins < 3 * 60) {
        stepSize = 5;
    } else if(diffMins < 8.5 * 60) {
        stepSize = 10;
    } else if(diffMins < 10 * 60) {
        stepSize = 15;
    } else {
        stepSize = 30;
    }

    chart.options.scales.xAxes[0].time.stepSize = stepSize;
    chart.data.labels = newLabels;
    chart.data.datasets[0].data = newData;
    updateTime(document.getElementById("24hTime").checked, document.getElementById("seconds").checked);
}

function timeChange(event) {
    updateTime(document.getElementById("24hTime").checked, document.getElementById("seconds").checked);
}

function updateTime(milTime, seconds) {
    let time = milTime ? "HH:mm" : "hh:mm";
    if(seconds){
        time += ":ss";
    }
    if(!milTime) {
        time += " A";
    }

    chart.options.scales.xAxes[0].time.displayFormats.minute = time.replace(":ss", "");
    chart.options.scales.xAxes[0].time.tooltipFormat = "MMMM Do, " + time;
    const lastCall = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
    const formattedTime = moment(lastCall.x).format(time);
    document.getElementById("count").innerHTML = "Wizards had " + lastCall.y + " players at " + formattedTime;
    chart.update();
}

function updateChartColor() {
    chart.data.datasets[0].borderColor = "rgba(" + document.documentElement.style.getPropertyValue('--main-color-rgb') + ", 0.29)";
    chart.data.datasets[0].backgroundColor = "rgba(" + document.documentElement.style.getPropertyValue('--main-color-rgb') + ", 0.06)";
    chart.data.datasets[0].pointBackgroundColor = document.documentElement.style.getPropertyValue('--main-color');
    chart.update();
}

window.addEventListener("load", loader);