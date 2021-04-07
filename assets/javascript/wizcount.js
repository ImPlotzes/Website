const dateOptions = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
};

let chart;
let data;
let record = {count: 0, date: new Date(0)};
let options = {
    colors: ["#00f0f0"],
    legend: {
        position: "in",
        textStyle: {
            color: "lightgray"
        }
    },
    animation: {
        startup: true,
        duration: 1500,
        easing: "out"
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
    explorer: {}
}
function loader() {
    document.getElementById("update").addEventListener("click", updateChartData);

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);    
}

async function drawChart() {
    document.getElementById("update").disabled = true;
    let apiData = await fetch("https://wizcount.plotzes.ml");
    apiData = await apiData.json();
    let formattedData = [];
    apiData.forEach(object => {
        let arr = [];
        arr.push(new Date(object.date));
        arr.push(object.count);
        formattedData.push(arr);
        record = object.count > record.count ? object : record;
    });

    if(apiData.length == 0) {
        document.getElementsByClassName("time")[0].innerHTML = "???";
        document.getElementsByClassName("time")[1].innerHTML = "???";
        document.getElementById("count").innerHTML = "??";
        document.getElementById("record").innerHTML = "??";
    } else {
        document.getElementsByClassName("time")[0].innerHTML = new Date(apiData[apiData.length - 1].date).toLocaleTimeString(undefined, dateOptions);
        document.getElementsByClassName("time")[1].innerHTML = new Date(record.date).toLocaleTimeString(undefined, dateOptions);
        document.getElementById("count").innerHTML = apiData[apiData.length - 1].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("record").innerHTML = record.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    data = new google.visualization.DataTable();
    data.addColumn("datetime", "Time");
    data.addColumn("number", "Player Count");
    data.addRows(formattedData);

    chart = new google.visualization.AreaChart(document.getElementById('chart'));
    var date_formatter = new google.visualization.DateFormat({ 
        pattern: "MMM dd, HH:mm:ss"
    }); 
    date_formatter.format(data, 0);

    chart.draw(data, options);
    document.getElementById("update").disabled = false;
}


function updateChartColor(color) {
    options.colors[0] = "#" + color;
    chart.draw(data, options);
}


async function updateChartData() {
    document.getElementById("update").disabled = true;
    let apiData = await fetch("https://wizcount.plotzes.ml");
    apiData = await apiData.json();
    document.getElementsByClassName("time")[0].innerHTML = new Date(apiData[apiData.length - 1].date).toLocaleTimeString(undefined, dateOptions);
    document.getElementById("count").innerHTML = apiData[apiData.length - 1].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let lastDate = data.getValue(data.getNumberOfRows() - 1, 0);
    let newRows = [];
    apiData.forEach(object => {
        let date = new Date(object.date);
        if(date - lastDate > 0) {
            let arr = [];
            arr.push(date);
            arr.push(object.count);
            newRows.push(arr);
            record = object.count > record.count ? object : record;
        }
    });
    document.getElementsByClassName("time")[1].innerHTML = new Date(record.date).toLocaleTimeString(undefined, dateOptions);
    document.getElementById("record").innerHTML = record.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    data.insertRows(data.getNumberOfRows(), newRows);
    var date_formatter = new google.visualization.DateFormat({ 
        pattern: "MMM dd, HH:mm:ss"
    }); 
    date_formatter.format(data, 0);
    chart.draw(data, options);
    document.getElementById("update").disabled = false;
}

window.addEventListener("load", loader);