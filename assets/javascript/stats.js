/*
LOAD EVENT OF THE WINDOW
*/
function loadEvents() {
    /*Add event listeners*/
	document.getElementById("search").addEventListener("click", showStats);
    document.getElementById("player").addEventListener("keyup", enterName);
    
    document.querySelectorAll(".collapsible h3").forEach(head => {
        head.addEventListener("click", collapsibleEvent);
    });

    /*Check if page loaded with player in URL*/
    const params = (new URL(document.location)).searchParams;
    const player = params.get("player") || document.location.pathname.replace("/stats", "").replace("/", "");
    document.getElementById("loading").style.display = "none";
	if(player != "" && player) {
        loadPlayer(player);
    } else {
        document.getElementById("search-container").style.display = "inline-block";
    }
}



/*
KEYUP EVENT OF PLAYER INPUT BAR
*/
function enterName(event) {
    /*Simulate a click on the 'search' button if the user presses 'enter'*/
	if(event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("search").click();
	}
}



/*
CLICK EVENT OF SEARCH BUTTON
*/
function showStats() {
    /*Get the player and go to the stats page*/
	let player = document.getElementById("player").value;
	window.location.href = window.location.origin + "/stats/" + player;
}



async function loadPlayer(player) {
    document.getElementById("loadingTemplate").style.display = "flex";

    /*Get the player data and then show it*/
    let data = await fetch("https://api.plotzes.ml/stats?player=" + encodeURIComponent(player));
    data = await data.json();
    let success = showData(data);
    document.getElementById("loadingTemplate").style.display = "none";
    if(success) {
        document.getElementById("main").style.display = "block";
    } else {
        document.getElementById("player").value = player;
        document.getElementById("search-container").style.display = "inline-block";
    }
} 



function showData(json){
    /*Check if the api call was successful, if not then show the message and the error*/
    if(!json.success) {
        let messageDiv = document.querySelector("#search + .card");
        messageDiv.innerHTML = json.message + "<br><br>(" + json.code + ")";
        messageDiv.style.border = "1px solid #c51313";
        return false;
    }

    /*Fill in the player name and the rest of the "profile card at the left"*/
    document.getElementById("playername").innerHTML = json.data.profile.name;
    addStats(json.data.profile.stats, document.getElementById("profile-stats"));
    if(JSON.stringify(json.data.profile.social) == "{}") {
        document.getElementById("profile-social").innerHTML = "<b>No social media connected</b>";
    } else {
        let socials = {};
        for(let [key, value] of Object.entries(json.data.profile.social)) {
            socials[key.charAt(0) + key.slice(1).toLowerCase()] = value;
        }
        addStats(socials, document.getElementById("profile-social"));
    }

    /*Fill the Bow Spleef stats */
    addStats(json.data.bow, document.getElementById("bow-stats"));

    /*Fill the TNT Run stats */
    addStats(json.data.run, document.getElementById("run-stats"));

    /*Fill the PVP Run stats */
    addStats(json.data.pvp, document.getElementById("pvp-stats"));

    /*Fill the TNT Tag stats */
    addStats(json.data.tag, document.getElementById("tag-stats"));
    
    /*Fill the Wizards stats*/
    showWizStats(json.data.wiz);

    /*Fill the TNT Games stats*/
    addStats(json.data.tnt.stats, document.getElementById("tnt-stats"));
    addStats(json.data.tnt.settings, document.getElementById("tnt-settings"));

    /*Fill the MC account stats*/
    showMcStats(json.data.mc);
    return true;
}


function showWizStats(wiz) {
    let wizStats = document.getElementById("wiz-stats");
    addStats(wiz.stats, wizStats);

    document.getElementById("selec-class").innerHTML = "<b>Selected class: </b>" + wiz.selected_class.charAt(0).toUpperCase() + wiz.selected_class.slice(1);
    let classStats = wiz.classes;
    let tableRows = document.querySelectorAll("tbody tr");
    let i = 0;
    tableRows.forEach(row => {
        let cells = row.children;
        for(let j = 1; j <= classStats.length; j++) {
            let value = classStats[i][j - 1].toString();
            if(isNumeric(value)){
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            cells[j].innerHTML = value;
        }
        i++;
    });
}


const dateOptions = {
    weekday: "long",
    day: "numeric",
    year: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short"
};
function showMcStats(mc) {
    addStats(mc.stats, document.getElementById("mc-stats"));
    addStats(mc.skin, document.getElementById("mc-skin"));

    let history = document.getElementById("mc-history");
    history.innerHTML = "";
    let i = 0;
    mc.history.forEach(entry => {
        i++;
        let name = entry.username;
        let since = entry.changed_at;
        if(since) {
            since = new Date(since).toLocaleDateString("en-GB", dateOptions);
        } else {
            since = "Account creation";
        }

        history.innerHTML += "<b>Username: </b>" + name + "<br><b>Since: </b>" + since;
        if(i < mc.history.length) {
            history.innerHTML += "<hr>";
        }
    });
}


function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}


function addStats(stats, parent) {
    parent.innerHTML = "";
    Object.keys(stats).forEach(key => {
        let value = stats[key].toString();
        if(key.startsWith("html-")) {
            parent.innerHTML += value;
        } else {
            key = key.replace(/_/g, " ");
            if(isNumeric(value)){
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if(value.startsWith("http://") || value.startsWith("https://")) {
                parent.innerHTML += "<b>" + key.charAt(0).toUpperCase() + key.slice(1) + ": </b><a href='" + value + "' target='_blank'>Go to page</a><br>"; 
            } else {
                parent.innerHTML += "<b>" + key.charAt(0).toUpperCase() + key.slice(1) + ": </b>" + value + "<br>"
            }
        }
    });
}


/*
CLICK EVENT OF EVERY COLLAPSIBLE HEAD/TITLE
*/
function collapsibleEvent(){
    /*Add the 'active' class for the open and close sign, and for the 'open/close all' button*/
    this.classList.toggle("active");
    
    /*Get the content and change the max-height according to its current state, also update the max-height of its parent element*/
    let content = this.nextElementSibling;
	if(content.style.maxHeight){
		content.style.maxHeight = null;
	} else {
		content.style.maxHeight = (content.scrollHeight + 35) + "px";
	}
}

/*Call the first function to add the listeners once all elements have loaded*/
window.addEventListener("load", loadEvents);