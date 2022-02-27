// inspectlet.js

// code stolen from StackOverflow - keeps a console log
console.stdlog = console.log.bind(console);
inspectlet_consoleLog = [];
console.log = function(){
    inspectlet_consoleLog.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
};

// html inspect page
var inspectlet_HTML = "<!DOCTYPE html>" +
"<html>" +
"<head>" +
"<meta name='viewport' content='width=device-width, initial-scale=1'>" +
"<title>Inspectlet</title>" +
"</head>" +
"<body>" +
"<h3>Inspectlet Inspector</h3>" +
"<div>" +
"<input type='button' value='Inspector' id='switchInspector'></input>" +
"<input type='button' value='Console' id='switchConsole'></input>" +
"<input type='button' value='Scripts' id='switchScripts'></input>" +
"<input type='button' value='CSS' id='switchCSS'></input>" +
"<input type='button' value='Toggle Edit' id='switchEdit'></input>" +
"<div class='tool' id='inspector' style='display: box'>" +
"<div style='display: flex; flex-direction: row; margin: 0 auto; width: 100%;'>" +
"<input type='button' value='Read Document' id='readDocument'></input>" +
"<input type='button' value='Write Document' id='writeDocument'></input>" +
"</div>" +
"<textarea id='documentEditor' style='width: 100%; height: 100%; font-family: monospace;'></textarea>" +
"</div>" +
"<div class='tool' id='console' style='display: none'>" +
"<div style='display: flex; flex-flow: column; height: 100%; width: 100%;'>" +
"<p id='consoleOutput' style='font-family: monospace; white-space: pre;'></p>" +
"</div>" +
"<input type='text' id='consoleInput' style='font-family: monospace; width: 100%;'></input>" +
"</div>" +
"<div class='tool' id='scripts' style='display: none'>" +
"<div style='display: flex; flex-direction: row; margin: 0 auto; width: 100%;'>" +
"<input type='button' value='Execute Script' id='executeScript'></input>" +
"<input type='button' value='Pull Script' id='readScript'></input>" +
"<input type='button' value='Inject Script' id='writeScript'></input>" +
"</div>" +
"<textarea id='scriptEditor' style='width: 100%; height: 100%; font-family: monospace;'></textarea>" +
"</div>" +
"<div class='tool' id='css' style='display: none'>" +
"<div style='display: flex; flex-direction: row; margin: 0 auto; width: 100%;'>" +
"<input type='button' value='Read CSS' id='readCSS'></input>" +
"<input type='button' value='Write CSS' id='writeCSS'></input>" +
"</div>" +
"<textarea id='cssEditor' style='width: 100%; height: 100%; font-family: monospace;'></textarea>" +
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
	try { Function(inspectlet_window.getElementById("scriptEditor").value)(); } catch(inspectletErr) { console.log(inspectletErr); };
};

function inspectlet_readScript() {
	if (document.getElementById("inspectletCustomScript") === null) {
		inspectlet_window.getElementById("scriptEditor").value = "";
	} else {
		inspectlet_window.getElementById("scriptEditor").value = document.getElementById("inspectletCustomScript").innerHTML;
	};
};

function inspectlet_writeScript() {
	if (document.getElementById("inspectletCustomScript") === null) {
		inspectlet_script = document.createElement("script");
		inspectlet_script.innerHTML = inspectlet_window.getElementById("scriptEditor").value;
		document.head.appendChild(inspectlet_script);
	} else {
		document.getElementById("inspectletCustomScript").innerHTML = inspectlet_window.getElementById("scriptEditor").value;
	};
};

function inspectlet_readCSS() {
	if (document.getElementById("inspectletCustomCSS") === null) {
		inspectlet_window.getElementById("cssEditor").value = "";
	} else {
		inspectlet_window.getElementById("cssEditor").value = document.getElementById("inspectletCustomCSS").innerHTML;
	};
};

function inspectlet_writeCSS() {
	if (document.getElementById("inspectletCustomCSS") === null) {
		inspectlet_css = document.createElement("style");
		inspectlet_css.innerHTML = inspectlet_window.getElementById("cssEditor").value;
		document.head.appendChild(inspectlet_css);
	} else {
		document.getElementById("inspectletCustomCSS").innerHTML = inspectlet_window.getElementById("cssEditor").value;
	};
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
	inspectlet_window.getElementById("consoleOutput").innerHTML = inspectlet_consoleLog.join('\n');
};

// eval instructions
function inspectlet_eval() {
	console.log("> " + inspectlet_window.getElementById("consoleInput").value);
	console.log(Function("return " + (inspectlet_window.getElementById("consoleInput").value)) ());
	inspectlet_window.getElementById("consoleInput").value = "";
	inspectlet_readConsole();
};

function inspectlet_switch(tab) {
	for ( var inspectlet_tab = 0; inspectlet_tab < inspectlet_window.getElementsByClassName("tool").length; inspectlet_tab++ ) {
		inspectlet_window.getElementsByClassName("tool")[inspectlet_tab].style.display = "none";
	};
	inspectlet_window.getElementById(tab).style.display = "block";
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

	// Connect other functions
	inspectlet_window.getElementById("readDocument").addEventListener("click", inspectlet_readDocument);
	inspectlet_window.getElementById("writeDocument").addEventListener("click", inspectlet_writeDocument);

	inspectlet_window.getElementById("executeScript").addEventListener("click", inspectlet_executeScript);
	inspectlet_window.getElementById("readScript").addEventListener("click", inspectlet_readScript);
	inspectlet_window.getElementById("writeScript").addEventListener("click", inspectlet_writeScript);

	inspectlet_window.getElementById("readCSS").addEventListener("click", inspectlet_readCSS);
	inspectlet_window.getElementById("writeCSS").addEventListener("click", inspectlet_executeScript);

	inspectlet_window.getElementById("switchEdit").addEventListener("click", inspectlet_switchEdit);

	// create listener for input
	inspectlet_window.getElementById("consoleInput").addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			inspectlet_eval();
		};
	});

};

inspectlet_createInspector();
