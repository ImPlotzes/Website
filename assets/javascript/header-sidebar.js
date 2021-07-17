/*
------------------------------------------
            !!ADD COMMENTS!!
------------------------------------------
*/

function handleError(error) {
    error = error.reason ? error.reason : error;
    let message = `
    <div id="error">
            <div id="error-message">
                <h1>Error</h1>
                <p>
                    An error occurred. If this keeps happening then please contact Plotzes via Discord at <b>Plotzes#8332</b><br>
                    <br>
                    <span style='font-size: 20px'>Would you like to reload the page?</span><br>
                    <br>
                    <pre id="error-text"></pre>
                </p>
                <div id="error-yes">Yes</div>
                <div id="error-no">No</div>
            </div>
        </div>
    `;
    let div = document.getElementById("error-div");
    if(!div) {
        div = document.createElement("div");
        div.innerHTML = message;
        document.body.appendChild(div);
    }
    document.getElementById("error-yes").addEventListener("click", function reloadPage() { window.location.reload(); });
    document.getElementById("error-no").addEventListener("click", function closeError() { document.getElementById("error").style.display = "none"; });
    document.getElementById("error-text").innerHTML = error.message + "\nFile: " + error.filename + "\nLine: " + error.lineno + "\nCollumn: " + error.colno;
    document.getElementById("error").style.display = "block";
}
window.addEventListener("unhandledrejection", handleError);
window.addEventListener("error", handleError);



async function afterLoad() {
    const theme = window.localStorage.getItem("theme");
    if(theme) {
        selectTheme(theme);
    } else {
        selectTheme("00f0f0");
    }
    await loadHeaderSidebar();
    Array.from(document.getElementsByClassName("theme-selection")).forEach(element => {
        const color = element.getAttribute("data-color");
        element.style.backgroundColor = "#" + color;
        element.addEventListener("click", changeTheme);
    });
    let collapseElement = document.getElementById("collapse-sidebar");
    if(collapseElement) {
        collapseElement.addEventListener("click", collapse);
    }
    let colorElement = document.getElementById("custom-color");
    if(colorElement) {
        colorElement.addEventListener("input", customColor);
    }
}


function customColor() {
    let color = this.value;
    color = color.replace("#", "");
    selectTheme(color);
}


async function loadHeaderSidebar() {
    ///*
    let request = await fetch("/assets/html/header-sidebar.html");
    let div = document.createElement("div");
    div.innerHTML = await request.text();
    div.childNodes.forEach(child => {
        document.body.appendChild(child);
    })
    //*/

    let pagename = document.querySelector('meta[name="pagename"]');
    if(!pagename) {
        return;
    }
    pagename = pagename.content;
    const element = document.getElementById("page-" + pagename);
    if(!pagename || !element) {
        return;
    }
    element.classList.add("sidebar-active");
    if(element.parentElement.classList.contains("sidebar-content")) {
        element.parentElement.parentElement.classList.add("sidebar-collapsible-active");
    }
}


function changeTheme() {
    const color = this.getAttribute("data-color");
    selectTheme(color);
}


function selectTheme(color) {
    color += "";
    color = color.toLowerCase();
    if(color.length != 6 || !color.match(/^[0-9a-f]+$/)) {
        console.error("#" + color + " isn't a valid hex color code! Changing it to default theme (hex: #00f0f0)");
        color = "00f0f0";
    }
    window.localStorage.setItem("theme", color)
    const root = document.documentElement;
    root.style.setProperty("--main-color", "#" + color);
    root.style.setProperty("--main-color-rgb", hexToRgb(color));
}


function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b].join(", ");
}


function collapse() {
    let button = document.getElementById("sidebar");
    if(button.classList.toggle("collapsed")) {
        document.getElementById("root").style.marginLeft = "0";
    } else {
        document.getElementById("root").style.marginLeft = "230px";
    }
    setTimeout(() => {
        try {
            options.colors = [...allColours];
            for(let i = 0; i < hiddenColumns.length; i++) {
                let colourIndex = hiddenColumns[i] - 1;
                options.colors.splice(options.colors.indexOf(allColours[colourIndex]), 1);
            }
            let view = new google.visualization.DataView(data);
            view.hideColumns(hiddenColumns);
            chart.draw(view, options);
        } catch(e) {}
    }, 200);
}
window.addEventListener("load", afterLoad);