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
    let images = document.getElementsByClassName("convert-inline");
    images = Array.from(images);
    for(let i = 0; i < images.length; i++) {
        await convertImage(images[i]);
    }
    Array.from(document.getElementsByClassName("theme-selection")).forEach(element => {
        const color = element.getAttribute("data-color");
        element.style.backgroundColor = "#" + color;
        element.addEventListener("click", changeTheme);
    });
    document.getElementById("collapse-sidebar").addEventListener("click", collapse);
    document.getElementById("custom-color").addEventListener("input", customColor);
}

function customColor() {
    let color = this.value;
    color = color.replace("#", "");
    selectTheme(color);
}

async function loadHeaderSidebar() {
    const response = await fetch("/assets/html/header-sidebar.html");
    if(response.status == 200) {
        let headerSidebar = await response.text();
        headerSidebar = new DOMParser().parseFromString(headerSidebar, "text/html");
        const pagename = document.querySelector('meta[name="pagename"]').content;
        const element = headerSidebar.getElementById("page-" + pagename);
        element.classList.add("sidebar-active");
        if(element.parentElement.classList.contains("sidebar-content")) {
            element.parentElement.parentElement.classList.add("sidebar-collapsible-active");
        }
        document.getElementById("headerSidebar").innerHTML = new XMLSerializer().serializeToString(headerSidebar);
    } else {
        document.getElementById("headerSidebar").innerHTML = "<!-- Couldn't load header and sidebar -->"
    }
}

async function convertImage(image) {
    const id = image.getAttribute("id");
    const style = image.getAttribute("style");
    const src = image.getAttribute("data-image");
    const imageResponse = await fetch(src);
    if(imageResponse.status == 200) {
        const svgText = await imageResponse.text();
        let buffer = document.createElement("div");
        buffer.innerHTML = svgText;
        const svg = buffer.firstElementChild;
        if(id) {
            svg.id = id;
        }
        svg.style = style;
        const parent = image.parentElement;
        parent.replaceChild(svg, image);
    } else {
        console.error("SVG inline loader: " + imageResponse.statusText);
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
    try {
        updateChartColor();
    } catch(e) {}
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
        document.getElementById("root").style.marginLeft = "80px";
        document.getElementById("root")
    } else {
        document.getElementById("root").style.marginLeft = "230px";
    }
    
}
window.addEventListener("load", afterLoad);