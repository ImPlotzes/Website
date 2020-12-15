/*
------------------------------------------
            !!ADD COMMENTS!!
------------------------------------------
*/

let lb;
async function afterLoad() {
    await getLeaderboard();
    document.getElementById("search").addEventListener("keyup", searchPlayer);
}

async function getLeaderboard() {
    lb = await fetch("https://leaderboard.plotzes.ml");
    lb = await lb.json();
    if(lb.success) {
        showStat("k", "Total Kills");
    }
}

function searchPlayer() {
    const input = this.value.toLowerCase();
    const rows = document.getElementsByTagName("tr");
    const rowLength = rows.length;
    for(let i = 1; i < rowLength; i++) {
        const playerCell = rows[i].getElementsByTagName("a")[0];
        const playerName = playerCell.textContent || playerCell.innerText;
        if(playerName.toLowerCase().includes(input)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

let order = 1;
function sortTable(method, visualChange = method, arrowInverse = false) {
    order *= -1;
    const headers = document.getElementsByTagName("th");
    for(let i = 0; i < headers.length; i++) {
        const header = headers[i];
        header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: gray\">&#8597;</span>";
        if(i == visualChange) {
            if(arrowInverse) {
                order *= -1;
            }
            if(order > 0) {
                header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: lightgray\">&darr;</span>";
            } else {
                header.innerHTML = header.textContent.substring(0, header.textContent.length - 1) + "<span style=\"color: lightgray\">&uarr;</span>";
            }
            if(arrowInverse) {
                order *= -1;
            }
        }
    }
    const table = document.getElementsByTagName("tbody")[0];
    let rows = table.rows;
    rows = Array.from(rows);
    rows.sort((a, b) => {
        const columnA = a.getElementsByTagName("td")[method].textContent;
        const columnB = b.getElementsByTagName("td")[method].textContent;
        if(method == 3) {
            const playerA = a.getElementsByTagName("td")[1].textContent;
            const playerB = b.getElementsByTagName("td")[1].textContent;
            const timeA = new Date(lb.lb_data.filter(obj => { return obj.name == playerA })[0].last_update);
            const timeB = new Date(lb.lb_data.filter(obj => { return obj.name == playerB })[0].last_update);
            return (timeA - timeB) * order;
        }
        const decision = (columnA - columnB) * order;
        if(isNaN(decision)) {
            if(columnA < columnB) {
                return -1 * order;
            } else {
                return 1 * order;
            }
        } else {
            return decision;
        }
    });
    table.innerHTML = "";
    const rowLength = rows.length;
    for(let i = 0; i < rowLength; i++) {
        table.appendChild(rows[i]);
    }
}

function showStat(type, displayname) {
    document.getElementById("loadingScreen").style.display = "block";
    document.getElementById("tableContainer").style.display = "none";
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    let lbData = lb.lb_data;
    lbData = lbData.filter(player => {
        return player[type] != null;
    });
    lbData.sort((a, b) => {
        return b[type] - a[type];
    });
    document.getElementById("stat-column").innerHTML = displayname + " <span style=\"color: gray\">&#8597;</span>"
    for(let i = 0; i < lbData.length; i++) {
        const player = lbData[i];
        if(typeof player[type] !== "undefined") {
            const row = document.createElement("tr");
            row.classList.add("bodyRow")
            const updateTime = new Date(player.last_update);
            const innerRow = `
            <td>${i + 1}</td>
            <td><a href="/stats.html?player=${player.name}">${player.name}</a></td>
            <td>${player[type]}</td>
            <td>${updateTime.getHours().toString().padStart(2, "0")}:${updateTime.getMinutes().toString().padStart(2, "0")}, ${new Date(player.last_update).toLocaleDateString()}</td>`;
            row.innerHTML = innerRow;
            tbody.appendChild(row);
        } else {
            lbData.splice(i, 1);
            i--;
        }
    }
    order = 1;
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("tableContainer").style.display = "block";
}
window.addEventListener("load", afterLoad);