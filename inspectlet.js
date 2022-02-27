// inspectlet.js

inspectlet_version = "v0.1.0";
// code stolen from StackOverflow - keeps a console log
inspectlet_consoleLog = [];

console.stdlog = console.log.bind(console);
console.log = function(){
    inspectlet_consoleLog.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
	inspectlet_readConsole();
};

console.stdinfo = console.info.bind(console);
console.log = function(){
    inspectlet_consoleLog.push(Array.from(arguments));
    console.stdinfo.apply(console, arguments);
	inspectlet_readConsole();
};

console.stderror = console.error.bind(console);
console.error = function(){
    inspectlet_consoleLog.push(Array.from(arguments));
    console.stderror.apply(console, arguments);
	inspectlet_readConsole();
};

var inspectlet_helpPage = "<h4>Inspectlet Help</h4>" +
"<h5>Inspector</h5>" +
"<ul>" +
"<li>Click \"Read Document\" to read the current document.</li>" +
"<li>Edit text in the text box, and click \"Write Document\" to save.</li>" +
"</ul>" +
"<h5>Console</h5>" +
"<ul>" +
"<li>Enter text into the console and see output above.</li>" +
"</ul>" +
"<h5>Scripts</h5>" +
"<ul>" +
"<li>Add a script in the text box, and click \"Execute Script\" to run without injecting.</li>" +
"<li>Click \"Inject Script\" to insert your script, and click \"Pull Script\" to read it.</li>" +
"</ul>" +
"<h5>CSS</h5>" +
"<ul>" +
"<li>Add CSS into the text box, and click \"Write CSS\" to insert it.</li>" +
"<li>Click \"Read CSS\" to read the written CSS.</li>" +
"</ul>" +
"<h5>Toggle Edit</h5>" +
"<ul>" +
"<li>Click \"Toggle Edit\" to switch between editing mode (can edit text) and normal browsing mode.</li>" +
"</ul>" +
"<h5>Inspectlet</h5>" +
"<ul>" +
"<li>Version " + inspectlet_version + "</li>" +
"<li>Made by Vaughan Milliman</li>" +
"<li>Licensed under the <a href='https://inspectlet.tk/inspectlet/license.txt'>MIT License</a></li>" +
"<li><a href='https://inspectlet.tk'>Website</a></li>" +
"<li><a href='https://github.com/zeroxoneafour/inspectlet'>GitHub</a></li>" +
"</ul>";

// html inspect page
var inspectlet_HTML = "<!DOCTYPE html>" +
"<html>" +
"<head>" +
"<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>" +
"<style>html, body { height: 98%; padding: 0 5px; } div { display: flex; flex-direction: column; width: 100%; height: 100%; } div.buttons { display: flex; flex-direction: row; margin: 2px auto; flex: 0; } div.tool { height: 100%; display: none; } textarea { width: 100%; height: 100%; font-family: monospace; } input { margin: 0 2px; } h3 { margin: 2px; }</style>" +
"<title>Inspectlet</title>" +
"</head>" +
"<body>" +
"<div>" +
"<h3>Inspectlet Inspector</h3>" +
"<div class='buttons'>" +
"<input type='button' value='Inspector' id='switchInspector'></input>" +
"<input type='button' value='Console' id='switchConsole'></input>" +
"<input type='button' value='Scripts' id='switchScripts'></input>" +
"<input type='button' value='CSS' id='switchCSS'></input>" +
"<input type='button' value='Toggle Edit' id='switchEdit'></input>" +
"<input type='button' value='Help' id='switchHelp'></input>" +
"</div>" +
"<div class='tool' id='inspector' style='display: flex'>" +
"<div class='buttons'>" +
"<input type='button' value='Read Document' id='readDocument'></input>" +
"<input type='button' value='Write Document' id='writeDocument'></input>" +
"</div>" +
"<textarea id='documentEditor'></textarea>" +
"</div>" +
"<div class='tool' id='console'>" +
"<div class='buttons'>" +
"<p id='consoleOutput' style='font-family: monospace; white-space: pre;'></p>" +
"</div>" +
"<input type='text' id='consoleInput' style='font-family: monospace; width: 100%;'></input>" +
"</div>" +
"<div class='tool' id='scripts'>" +
"<div class='buttons'>" +
"<input type='button' value='Execute Script' id='executeScript'></input>" +
"<input type='button' value='Pull Script' id='readScript'></input>" +
"<input type='button' value='Inject Script' id='writeScript'></input>" +
"</div>" +
"<textarea id='scriptEditor'></textarea>" +
"</div>" +
"<div class='tool' id='css'>" +
"<div class='buttons'>" +
"<input type='button' value='Read CSS' id='readCSS'></input>" +
"<input type='button' value='Write CSS' id='writeCSS'></input>" +
"</div>" +
"<textarea id='cssEditor'></textarea>" +
"</div>" +
"<div class='tool' id='help'>" +
inspectlet_helpPage +
"</div>" +
"</body>" +
"</html>";

// window
var inspectlet_window;

// read root document
function inspectlet_readDocument() {
	inspectlet_window.getElementById("documentEditor").value = new XMLSerializer().serializeToString(document);
};

// write to root document
function inspectlet_writeDocument() {
	document.open();
	document.write(inspectlet_window.getElementById("documentEditor").value);
	document.close();
};

function inspectlet_executeScript() {
	try { Function(inspectlet_window.getElementById("scriptEditor").value)(); } catch(inspectlet_err) { console.error(inspectlet_err); };
};

function inspectlet_readScript() {
	if (document.getElementById("inspectletCustomScript") === null) {
		inspectlet_window.getElementById("scriptEditor").value = "";
	} else {
		inspectlet_window.getElementById("scriptEditor").value = document.getElementById("inspectletCustomScript").innerHTML;
	};
};

function inspectlet_writeScript() {
	if (!(document.getElementById("inspectletCustomScript") === null)) {
		document.head.removeChild(document.getElementById("inspectletCustomScript"));
	};
	inspectlet_script = document.createElement("script");
	inspectlet_script.id = "inspectletCustomScript";
	inspectlet_script.innerHTML = inspectlet_window.getElementById("scriptEditor").value;
	document.head.appendChild(inspectlet_script);
};

function inspectlet_readCSS() {
	if (document.getElementById("inspectletCustomCSS") === null) {
		inspectlet_window.getElementById("cssEditor").value = "";
	} else {
		inspectlet_window.getElementById("cssEditor").value = document.getElementById("inspectletCustomCSS").innerHTML;
	};
};

function inspectlet_writeCSS() {
	if (!(document.getElementById("inspectletCustomCSS") === null)) {
		document.head.removeChild(document.getElementById("inspectletCustomCSS"));
	};
	inspectlet_css = document.createElement("style");
	inspectlet_css.id = "inspectletCustomCSS";
	inspectlet_css.innerHTML = inspectlet_window.getElementById("cssEditor").value;
	document.head.appendChild(inspectlet_css);
};

function inspectlet_switchEdit() {
	if (document.body.contentEditable != "true") {
		document.body.contentEditable = "true";
		document.body.designMode = "on";
	} else {
		document.body.contentEditable = "false";
		document.body.designMode = "off";
	};
};

// read the console
function inspectlet_readConsole() {
	void(inspectlet_window.getElementById("consoleOutput").innerHTML = inspectlet_consoleLog.join('\n'));
};

// eval instructions
function inspectlet_eval() {
	console.log("> " + inspectlet_window.getElementById("consoleInput").value);
	try {
		inspectlet_consoleRet = Function("return " + (inspectlet_window.getElementById("consoleInput").value)) ();
		console.log(inspectlet_consoleRet);
	} catch (inspectlet_err) {
		console.error(inspectlet_err);
	}
	inspectlet_window.getElementById("consoleInput").value = "";
};

function inspectlet_switch(tab) {
	for ( var inspectlet_tab = 0; inspectlet_tab < inspectlet_window.getElementsByClassName("tool").length; inspectlet_tab++ ) {
		inspectlet_window.getElementsByClassName("tool")[inspectlet_tab].style.display = "none";
	};
	inspectlet_window.getElementById(tab).style.display = "flex";
};

// create the inspector
function inspectlet_createInspector() {
	inspectlet_window = window.open("about:blank", "inspectletWindow", "popup").document;

	inspectlet_window.open();
	inspectlet_window.write(inspectlet_HTML);
	inspectlet_window.close();

	// stuff for the tab switching
	inspectlet_window.getElementById("switchInspector").addEventListener("click", function(){return inspectlet_switch("inspector");});
	inspectlet_window.getElementById("switchConsole").addEventListener("click", function(){return inspectlet_switch("console");});
	inspectlet_window.getElementById("switchScripts").addEventListener("click", function(){return inspectlet_switch("scripts");});
	inspectlet_window.getElementById("switchCSS").addEventListener("click", function(){return inspectlet_switch("css");});
	inspectlet_window.getElementById("switchHelp").addEventListener("click", function(){return inspectlet_switch("help");});

	// Connect other functions
	inspectlet_window.getElementById("readDocument").addEventListener("click", inspectlet_readDocument);
	inspectlet_window.getElementById("writeDocument").addEventListener("click", inspectlet_writeDocument);

	inspectlet_window.getElementById("executeScript").addEventListener("click", inspectlet_executeScript);
	inspectlet_window.getElementById("readScript").addEventListener("click", inspectlet_readScript);
	inspectlet_window.getElementById("writeScript").addEventListener("click", inspectlet_writeScript);

	inspectlet_window.getElementById("readCSS").addEventListener("click", inspectlet_readCSS);
	inspectlet_window.getElementById("writeCSS").addEventListener("click", inspectlet_writeCSS);

	inspectlet_window.getElementById("switchEdit").addEventListener("click", inspectlet_switchEdit);

	// create listener for input
	inspectlet_window.getElementById("consoleInput").addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			inspectlet_eval();
		};
	});

};

inspectlet_createInspector();
