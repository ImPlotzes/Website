/*
LOAD EVENT OF THE WINDOW
*/
function loadEvents() {
    /*Add event listeners*/
	document.getElementById("toggle").addEventListener("click", toggleCollapse);
	document.getElementById("search").addEventListener("click", showStats);
	document.getElementById("player").addEventListener("keyup", enterName);
	

    /*Check if page loaded with player in URL*/
    const params = (new URL(document.location)).searchParams;
    const player = params.get("player");
	if(player) {
        document.getElementById("player").value = player;
        loadPlayer(player);
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
function showStats(){
    /*Get the player and show the stats*/
	let player = document.getElementById("player").value;
	loadPlayer(player);
}



async function loadPlayer(player) {
    /*Show loading SVG and empty current stats*/
    let main = document.getElementById("main");
    main.style.display = "none";
    document.getElementById("loading").style.display = "block";
    main.innerHTML = "";

    /*Change the URL in the browser without needing a reload*/
    const url = new URL(window.location);
    url.searchParams.set("player", player);
    window.history.pushState({"html":undefined}, "", url);

    /*Get the player data and then show it*/
    let data = await fetch("https://stats.plotzes.ml?user=" + player);
    data = await data.json();
    showData(data, main);
    document.getElementById("loading").style.display = "none";
    main.style.display = "block";
} 



function showData(json, parent){
    /*Loop through each key of the JSON Object*/
    Object.keys(json).forEach(key => {
        const value = json[key];
        key = key.replace(/_/g, " ");

        /*Check if the value of the key is another JSON Object*/
        if(typeof value == "object" && value) {

            /*If the value is an array then it's the username history, so show that the right way*/
            if(Array.isArray(value)) {
                let contentString = "";
                for(let i = 0; i < value.length; i++) {
                    let object = value[i];
                    contentString += "<div><b>Username</b>: " + object.username + "</div>";
                    contentString += "<div><b>Since</b>: " + (object.changed_at ? new Date(object.changed_at).toLocaleString() : "----") + "</div>";
                    if(i < value.length - 1) {
                        contentString += "<hr>";
                    }
                }
                addCollapsible(key, contentString, parent)
            } else {
                /*The value was an Object but not an array so recursively call this function with the value as the JSON Object and a new collapsible as the parrent*/
                showData(value, addCollapsible(key, "", parent));
            }
        } else {
            /*The value isn't an Object so just add a div with the key and value to the parent*/
            let div = document.createElement("div");
            div.innerHTML = "<b>" + key + "</b>: " + value;
            parent.appendChild(div);
        }
    });
}


/*Add a collapsible, with a title, content and a parent element to append the collapsible to as a child*/
function addCollapsible(title, content, parent){
    /*Create the title div*/
	let titleBar = document.createElement("div");
	titleBar.classList.add("collapsible");
    titleBar.innerHTML = title;
    titleBar.addEventListener("click", collapsibleEvent);

    /*Create the content div*/
	let contentDiv = document.createElement("div");
    contentDiv.classList.add("content");
    contentDiv.innerHTML = content;
    
    /*Firstly add the title div and then the content div*/
	parent.appendChild(titleBar);
    parent.appendChild(contentDiv);
    
    /*Return the content div element, for if you want to add a nested collapsible into the one that was just created*/
	return contentDiv;
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
        updateParentHeight(content, ((content.scrollHeight + 15) * -1));
		content.style.maxHeight = null;
	} else {
        updateParentHeight(content, (content.scrollHeight + 15));
		content.style.maxHeight = (content.scrollHeight + 15) + "px";
	}
}

/*
CLICK EVENT OF THE 'OPEN/CLOSE ALL' BUTTON
*/
function toggleCollapse(){
	let toggle = document.getElementById("toggle");
	let close = toggle.innerHTML == "Close All" ? true : false;
	let collapsibles = document.getElementsByClassName("collapsible");
	if(close){
        /*Get all the collapsibles which are open and close them*/
		for(let i = 0; i < collapsibles.length; i++){
			let collapsible = collapsibles[i];
			if(collapsible.classList.contains("active")){
				collapsible.classList.remove("active");
				let content = collapsible.nextElementSibling;
				content.style.maxHeight = null;
			}
		}
	} else {
        /*Get all the collapsibles which are closed and open them*/
		for(let i = 0; i < collapsibles.length; i++){
			let collapsible = collapsibles[i];
			if(!collapsible.classList.contains("active")){
				collapsible.classList.add("active");
                let content = collapsible.nextElementSibling;
                updateParentHeight(content, (content.scrollHeight + 15));
				content.style.maxHeight = (content.scrollHeight + 15) + "px";
			}
		}
    }
    
    /*Change the text of the button*/
	if(close){
		toggle.innerHTML = "Open All";
	} else {
		toggle.innerHTML = "Close All";
	}
}

/*Change the max-height property of the parent of a content div. Used when opening or closing a collapsible*/
function updateParentHeight(content, height) {
    let parent = content.parentElement;

    /*Do nothing if its parent element has the id 'main', doesn't have any classes or isn't a content div from a collapsible*/
    if(parent.id == "main" || !parent.classList || !parent.classList.contains("content")) {
        return;
    }

    /*Update the max-height of a parent by the given amount and recursively update the parent of the current parent*/
    parent.style.maxHeight = (parseInt(parent.style.maxHeight.replace("px", "")) + height) + "px";
    updateParentHeight(parent, height);
}

/*Call the first function to add the listeners once all elements have loaded*/
window.addEventListener("load", loadEvents);