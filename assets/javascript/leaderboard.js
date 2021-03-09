/*
------------------------------------------
            !!ADD COMMENTS!!
------------------------------------------
*/

let lb;
let lbData = [];
let pages = [];
let pageNumber = 0;
let pageSize = 25;
let currentStat = {
    type: "k",
    displayname: "Total Kills"
}


async function afterLoad() {
    let success = await getLeaderboard();
    if(success) {
        document.getElementById("search").addEventListener("keyup", searchPlayer);
        document.getElementById("length-selector").addEventListener("change", changePageLength);
    }
}


async function getLeaderboard() {
    lb = await fetch("https://leaderboard.plotzes.ml");
    lb = await lb.json();
    lbData = lb.lb_data;
    if(lb.success) {
        showStat("w", "Wins");
        return true;
    } else {
        const container = document.getElementById("tableContainer");
        container.innerHTML = "Something went wrong!<br><br>" + lb.message + " (" + lb.error + ")";
        document.getElementById("loadingScreen").style.display = "none";
        container.style.display = "block";
        return false;
    }
}


function changePageLength() {
    let newLength = this.value;
    pageSize = newLength;
    pageNumber = 0;
    pages = paginateArray(lbData, pageSize);
    syncPagesSelector();

    showPage(pageNumber);
}


function paginateArray(arr, pageSize = 25) {
    let length = Math.ceil(arr.length / pageSize);
    let paginatedArr = []
    let clone = JSON.parse(JSON.stringify(arr));
    for(let i = 0; i < length; i++) {
        let page = clone.splice(0, pageSize);
        paginatedArr.push(page);
    }
    document.getElementById("lb-info").innerHTML = "Total pages: <span style='color: var(--main-color)'>" + paginatedArr.length + "</span><br>Entries: <span style='color: var(--main-color)'>" + arr.length + "</span>";
    return paginatedArr;
}


function pageChange(change) {
    pageNumber += change;
    if(pageNumber < 0 || pageNumber >= pages.length) {
        pageNumber -= change;
        return;
    }
    
    syncPagesSelector();

    showPage(pageNumber);
    if(document.getElementById("scroll-setting").checked) {
        window.scrollTo(0, 0);
    } else {
        window.scrollTo(0, document.body.scrollHeight);
    }
}


function searchPlayer() {
    let input = this.value.toLowerCase();
    if(input.trim().length != 0) {
        lbData = lb.lb_data.filter(player => {
            return player.name.toLowerCase().includes(input);
        });
    } else {
        lbData = lb.lb_data;
    }
    lbData.sort((a, b) => {
        return b[currentStat.type] - a[currentStat.type];
    });
    pages = paginateArray(lbData, pageSize);

    syncPagesSelector();

    order = 1;
    const headers = document.getElementsByTagName("th");
    let header = headers[0];
    header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: lightgray\">&darr;</span>";
    for(let i = 1; i < headers.length; i++) {
        header = headers[i];
        header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: gray\">&#8597;</span>";
    }

    showPage(pageNumber);
}


let order = 1;
function sortTable(method) {
    /* Invert order and sort the data */
    order *= -1;
    lbData.sort((a, b) => {
        if(method == 3) {
            let timeA = new Date(a.time);
            let timeB = new Date(b.time);
            return (timeA - timeB) * order;
        } else {
            let type = "array_id";
            switch (method) {
                case 0:
                    type = "array_id";
                    break;
                case 1:
                    type = "name";
                    break;
                case 2:
                    type = currentStat.type;;
                    break;
                default:
                    break;
            }
            let aType = a[type];
            let bType = b[type];
            if(typeof aType == "string") {
                aType = aType.toLowerCase();
            }
            if(typeof bType == "string") {
                bType = bType.toLowerCase();
            }
            if(aType < bType) {
                return order * -1;
            }
            if(aType > bType) {
                return order;
            }
            return 0;
        }
    });

    /* Update the table header arrows */
    let headers = document.getElementsByTagName("th");
    let headerLength = headers.length;
    for(let i = 0; i < headerLength; i++) {
        let header = headers[i];
        header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: gray\">&#8597;</span>";
    }
    let header = headers[method];
    if(order > 0) {
        header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: lightgray\">&darr;</span>";
    } else {
        header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: lightgray\">&uarr;</span>";
    }

    /* Display the new data */
    pageNumber = 0;
    pages = paginateArray(lbData, pageSize);
    syncPagesSelector();
    showPage(pageNumber);
}


function showStat(type, displayname) {
    /* Show loading icon */
    document.getElementById("loadingScreen").style.display = "block";
    document.getElementById("tableContainer").style.display = "none";

    /* Update global variables */
    pageNumber = 0;
    currentStat.type = type;
    currentStat.displayname = displayname;

    /* Filter, sort and id the full leaderboard based on the stat type */
    lbData = lb.lb_data.filter(player => {
        return player[type] != undefined;
    });
    lbData.sort((a, b) => {
        return b[type] - a[type];
    });
    lbData.forEach((value, index) => {
        value.array_id = index + 1;
    })
    pages = paginateArray(lbData, pageSize);
    syncPagesSelector();

    showPage(pageNumber);
    
    /* Update the table header arrows. The table is sorted based on rank place */
    order = 1;
    const headers = document.getElementsByTagName("th");
    let header = headers[0];
    header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: lightgray\">&darr;</span>";
    for(let i = 1; i < headers.length; i++) {
        header = headers[i];
        if(i == 2) {
            header.innerHTML = displayname + " <span style=\"color: gray\">&#8597;</span>";
        } else {
            header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: gray\">&#8597;</span>";
        }
    }

    /* Stop showing loading icon */
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("tableContainer").style.display = "block";
}


function showPage(number) {
    /* Get the page and show it */
    let page = pages[number];
    showCustomPage(page);
}


function showCustomPage(page) {
    /* Clear the current data in the table */
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    if(!page) {
        return;
    }

    /* Go through each player and add a table row */
    for(let i = 0; i < page.length; i++) {
        const player = page[i];
        if(player[currentStat.type] != undefined) {
            const row = document.createElement("tr");
            row.classList.add("bodyRow");
            let updateTime = player.time;
            updateTime = new Date(updateTime);
            let stat = player[currentStat.type];
            if(currentStat.type == "t") {
                if(stat == 0) {
                    stat = "No air time";
                } else {
                    const airTime = Math.round(parseInt(stat) / 20);
                    const h = Math.floor(airTime / 3600);
                    const m = Math.floor(airTime % 3600 / 60);
                    const s = Math.floor(airTime % 3600 % 60);

                    const hDisplay = h + (h == 1 ? " hour, " : " hours, ");
                    const mDisplay = m + (m == 1 ? " minute, " : " minutes, ");
                    const sDisplay = s + (s == 1 ? " second" : " seconds");
                    stat = hDisplay + mDisplay + sDisplay;
                }
            } else {
                stat = stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            const innerRow = `
                <td>${player.array_id}</td>
                <td><a href="/stats/${player.id}">${player.name}</a></td>
                <td>${stat}</td>
                <td>${updateTime.getHours().toString().padStart(2, "0")}:${updateTime.getMinutes().toString().padStart(2, "0")}, ${updateTime.toLocaleDateString()}</td>`;
            row.innerHTML = innerRow;
            tbody.appendChild(row);
        } else {
            page.splice(i, 1);
            i--;
        }
    }
}


function syncPagesSelector() {
    let length = pages.length;
    let buttons = document.getElementById("pagination").children;
    buttons.item(1).innerHTML = pageNumber - 1 <= 0 ? "..." : pageNumber - 1;
    buttons.item(2).innerHTML = pageNumber <= 0 ? "..." : pageNumber;
    buttons.item(3).innerHTML = pageNumber + 1 > length ? "..." : pageNumber + 1;
    buttons.item(4).innerHTML = pageNumber + 2 > length ? "..." : pageNumber + 2;
    buttons.item(5).innerHTML = pageNumber + 3 > length ? "..." : pageNumber + 3;
}
window.addEventListener("load", afterLoad);