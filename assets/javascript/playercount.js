const dateOptions = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
};

const allColours = ["#ff4242", "#ffff00", "#03ee03", "#00f0f0", "#a06eff", "#ffffff"];
let hiddenColumns = [];
let chart;
let data;
let record = [
    [0, new Date(0)],
    [0, new Date(0)],
    [0, new Date(0)],
    [0, new Date(0)],
    [0, new Date(0)],
    [0, new Date(0)]
];
let options = {
    colors: [...allColours],
    legend: {
        position: "top",
        textStyle: {
            color: "lightgray"
        }
    },
    backgroundColor: "transparent",
    fontName: "Quicksand",
    hAxis: {
        title: "Time (local)",
        titleTextStyle: {
            color: 'lightgray'
        },
        textStyle: {
            color: "gray"
        },
        gridlines: {
            color: "#343536",
            units: {
                days: {format: ["MMM dd"]},
                hours: {format: ["HH:mm"]},
                minutes: {format: ["HH:mm", ":mm"]},
                seconds: {format: ["HH:mm:ss", "ss's'"]}
            }
        },
        minorGridlines: {
            color: "#282a2b",
            units: {
                hours: {format: ["HH:mm:ss", "HH:mm"]},
                minutes: {format: [":mm"]},
                seconds: {format: ["HH:mm:ss", "ss's'"]}
            }
        }
    },
    vAxis: {
        title: "Player Count",
        baseline: 0,
        titleTextStyle: {
            color: 'lightgray'
        },
        textStyle: {
            color: "gray"
        },
        gridlines: {
            color: "none"
        }
    },
    chartArea: {
        width: "90%",
        height: "75%"
    },
    tooltip: {
        isHtml: true,
        showColorCode: true,
        textStyle: {
            color: "lightgray"
        }
    },
    crosshair: {
        orientation: "horizontal",
        color: "gray",
        trigger: "both"
    },
    explorer: {
        maxZoomIn: 0.01
    }
}
function loader() {
    let previousHiddenColumns = JSON.parse(window.localStorage.getItem("hiddenColumns"));
    if(previousHiddenColumns) {
        hiddenColumns = previousHiddenColumns;
        let checkboxes = document.querySelectorAll("input");
        for(let i = 0; i < previousHiddenColumns.length; i++) {
            checkboxes[previousHiddenColumns[i] - 1].checked = false;
        }
    }
    document.getElementById("update").addEventListener("click", updateChartData);

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);    
}


async function drawChart() {
    document.getElementById("update").disabled = true;
    let apiData = await fetch("https://playercount.plotzes.ml");
    apiData = await apiData.json();
    let formattedData = [];
    apiData.forEach(object => {
        let arr = [];
        let date = new Date(object.date);
        arr.push(date);
        arr.push(object.bow);
        arr.push(object.run);
        arr.push(object.pvp);
        arr.push(object.tag);
        arr.push(object.wiz);
        arr.push(object.total);
        formattedData.push(arr);
        for(let i = 1; i < arr.length; i++) {
            if(record[i - 1][0] < arr[i]) {
                record[i - 1][0] = arr[i];
                record[i - 1][1] = date;
            }
        }
    });

    if(apiData.length == 0) {
        document.getElementById("time").innerHTML = "???";
        document.getElementsByClassName("time").forEach(element => {
            element.innerHTML = "???";
        });
        document.getElementsByClassName("count").forEach(element => {
            element.innerHTML = "??";
        });
        document.getElementsByClassName("record").forEach(element => {
            element.innerHTML = "??";
        });
    } else {
        document.getElementById("time").innerHTML = new Date(apiData[apiData.length - 1].date).toLocaleTimeString(undefined, dateOptions);

        let recordCounts = document.getElementsByClassName("record");
        for(let i = 0; i < recordCounts.length; i++) {
            recordCounts[i].innerHTML = record[i][0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        let recordTimes = document.getElementsByClassName("time");
        for(let i = 0; i < recordTimes.length; i++) {
            recordTimes[i].innerHTML = new Date(record[i][1]).toLocaleTimeString(undefined, dateOptions);
        }

        let playercounts = document.getElementsByClassName("count");
        let lastData = formattedData[formattedData.length - 1];
        for(let i = 0; i < lastData.length - 1; i++) {
            if(lastData[i + 1]) {
                playercounts[i].innerHTML = lastData[i + 1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                playercounts[i].innerHTML = "<span style='color: gray'>Unknown</span>";
            }
        }
    }
    data = new google.visualization.DataTable();
    data.addColumn("datetime", "Time");
    data.addColumn("number", "Bowspleef");
    data.addColumn("number", "TNT Run");
    data.addColumn("number", "PVP Run");
    data.addColumn("number", "TNT Tag");
    data.addColumn("number", "Wizards");
    data.addColumn("number", "Total");
    data.addRows(formattedData);

    chart = new google.visualization.AreaChart(document.getElementById('chart'));
    var date_formatter = new google.visualization.DateFormat({ 
        pattern: "MMM dd, HH:mm:ss"
    }); 
    date_formatter.format(data, 0);

    options.colors = [...allColours];
    for(let i = 0; i < hiddenColumns.length; i++) {
        let colourIndex = hiddenColumns[i] - 1;
        options.colors.splice(options.colors.indexOf(allColours[colourIndex]), 1);
    }
    let view = new google.visualization.DataView(data);
    view.hideColumns(hiddenColumns);
    chart.draw(view, options);
    document.getElementById("update").disabled = false;
}


async function updateChartData() {
    document.getElementById("update").disabled = true;
    let apiData = await fetch("https://playercount.plotzes.ml");
    apiData = await apiData.json();
    let lastDate = data.getValue(data.getNumberOfRows() - 1, 0);
    let newRows = [];
    apiData.forEach(object => {
        let date = new Date(object.date);
        if(date - lastDate > 0) {
            let arr = [];
            arr.push(date);
            arr.push(object.bow);
            arr.push(object.run);
            arr.push(object.pvp);
            arr.push(object.tag);
            arr.push(object.wiz);
            arr.push(object.total);
            newRows.push(arr);
            for(let i = 1; i < arr.length; i++) {
                if(record[i - 1][0] < arr[i]) {
                    record[i - 1][0] = arr[i];
                    record[i - 1][1] = date;
                }
            }
        }
    });


    document.getElementById("time").innerHTML = new Date(apiData[apiData.length - 1].date).toLocaleTimeString(undefined, dateOptions);

    let recordCounts = document.getElementsByClassName("record");
    for(let i = 0; i < recordCounts.length; i++) {
        recordCounts[i].innerHTML = record[i][0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let recordTimes = document.getElementsByClassName("time");
    for(let i = 0; i < recordTimes.length; i++) {
        recordTimes[i].innerHTML = new Date(record[i][1]).toLocaleTimeString(undefined, dateOptions);
    }

    let playercounts = document.getElementsByClassName("count");
    let lastData = newRows[newRows.length - 1];
    for(let i = 0; i < lastData.length - 1; i++) {
        if(lastData[i + 1]) {
            playercounts[i].innerHTML = lastData[i + 1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            playercounts[i].innerHTML = "<span style='color: gray'>Unknown</span>";
        }
    }


    data.insertRows(data.getNumberOfRows(), newRows);
    var date_formatter = new google.visualization.DateFormat({ 
        pattern: "MMM dd, HH:mm:ss"
    });
    date_formatter.format(data, 0);

    options.colors = [...allColours];
    for(let i = 0; i < hiddenColumns.length; i++) {
        let colourIndex = hiddenColumns[i] - 1;
        options.colors.splice(options.colors.indexOf(allColours[colourIndex]), 1);
    }
    let view = new google.visualization.DataView(data);
    view.hideColumns(hiddenColumns);
    chart.draw(view, options);
    document.getElementById("update").disabled = false;
}


function toggleColumn(index) {
    let inputs = document.querySelectorAll("input");
    let checkbox = inputs[index - 1];
    if(checkbox.checked) {
        hiddenColumns.splice(hiddenColumns.indexOf(index), 1);
    } else if(hiddenColumns.length + 1 < allColours.length){
        hiddenColumns.push(index);
    } else {
        checkbox.checked = true;
        return;
    }
    window.localStorage.setItem("hiddenColumns", JSON.stringify(hiddenColumns));
    options.colors = [...allColours];
    for(let i = 0; i < hiddenColumns.length; i++) {
        let colourIndex = hiddenColumns[i] - 1;
        options.colors.splice(options.colors.indexOf(allColours[colourIndex]), 1);
    }
    try {
        let view = new google.visualization.DataView(data);
        view.hideColumns(hiddenColumns);
        chart.draw(view, options);
    } catch(e) {}
}

window.addEventListener("load", loader);
