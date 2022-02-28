// inspectlet.js

inspectlet_version = "v0.3.1";
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

// this window is for the document, not the inspector
var inspectlet_docWindow = window;
var inspectlet_document = document;
var inspectlet_scriptName = "inspectletCustomScript";
var inspectlet_cssName = "inspectletCustomCSS";

var inspectlet_helpPage = "<h4>Inspectlet Help</h4>" +
"<p>Inspector</p>" +
"<ul>" +
"<li>Click \"Read Document\" to read the current document.</li>" +
"<li>Edit text in the text box, and click \"Write Document\" to save.</li>" +
"</ul>" +
"<p>Console</p>" +
"<ul>" +
"<li>Enter text into the console and see output above.</li>" +
"</ul>" +
"<p>Scripts</p>" +
"<ul>" +
"<li>Add a script in the text box, and click \"Execute Script\" to run without injecting.</li>" +
"<li>Click \"Inject Script\" to insert your script, and click \"Pull Script\" to read it.</li>" +
"</ul>" +
"<p>CSS</p>" +
"<ul>" +
"<li>Add CSS into the text box, and click \"Write CSS\" to insert it.</li>" +
"<li>Click \"Read CSS\" to read the written CSS.</li>" +
"</ul>" +
"<p>Options</p>" +
"<ul>" +
"<li>Toggle \"Edit Mode\" to switch between editing mode (can edit text) and normal browsing mode.</li>" +
"<li>Toggle \"Use iframe instead of root\" to edit the contents of an iframe inside the root document. Set the number panel below it to the index of the iframe.</li>" +
"<li>Set \"JavaScript Script ID\" to the page ID of the JavaScript script you want to edit. Cannot edit external scripts.</li>" +
"<li>Set \"CSS Sheet ID\" to the sheet ID of the CSS sheet you want to edit. Cannot edit external scripts.</li>" +
"</ul>" +
"<p>Inspectlet</p>" +
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
"<style>html, body { height: 98%; padding: 0 5px; } div { display: flex; flex-direction: column; width: 100%; height: 100%; } div.buttons { display: flex; flex-direction: row; margin: 2px auto; flex: 0; } div.tool { height: 100%; display: none; } textarea { width: 100%; height: 100%; font-family: monospace; } input { margin: 0 2px; } p { margin: 2px; } input.textInput { font-family: monospace; width: 100%; }</style>" +
"<title>Inspectlet - " + document.title + "</title>" +
"</head>" +
"<body>" +
"<div>" +
"<h3>Inspectlet Inspector</h3>" +
"<div class='buttons'>" +
"<input type='button' value='Inspector' id='switchInspector'/>" +
"<input type='button' value='Console' id='switchConsole'/>" +
"<input type='button' value='Scripts' id='switchScripts'/>" +
"<input type='button' value='CSS' id='switchCSS'/>" +
"<input type='button' value='Options' id='switchOptions'/>" +
"<input type='button' value='Help' id='switchHelp'/>" +
"</div>" +
"<div class='tool' id='inspector' style='display: flex'>" +
"<div class='buttons'>" +
"<input type='button' value='Read Document' id='readDocument'/>" +
"<input type='button' value='Write Document' id='writeDocument'/>" +
"</div>" +
"<textarea id='documentEditor'></textarea>" +
"</div>" +
"<div class='tool' id='console'>" +
"<div class='buttons'>" +
"<p id='consoleOutput' style='font-family: monospace; white-space: pre;'></p>" +
"</div>" +
"<input type='text' id='consoleInput' class='textInput'/>" +
"</div>" +
"<div class='tool' id='scripts'>" +
"<div class='buttons'>" +
"<input type='button' value='Execute Script' id='executeScript'/>" +
"<input type='button' value='Pull Script' id='readScript'/>" +
"<input type='button' value='Inject Script' id='writeScript'/>" +
"</div>" +
"<textarea id='scriptEditor'></textarea>" +
"</div>" +
"<div class='tool' id='css'>" +
"<div class='buttons'>" +
"<input type='button' value='Read CSS' id='readCSS'/>" +
"<input type='button' value='Write CSS' id='writeCSS'/>" +
"</div>" +
"<textarea id='cssEditor'></textarea>" +
"</div>" +
"<div class='tool' id='options'>" +
"<div class='buttons'>" +
"<label for='toggleEdit'>Edit Mode</label><input type='checkbox' id='toggleEdit'/>" +
"</div>" +
"<div class='buttons'>" +
"<label for='toggleIframe'>Use iframe instead of root (enter iframe index below)</label><input type='checkbox' id='toggleIframe'/>" +
"</div>" +
"<input type='number' class='textInput' id='iframe'/>" +
"<p>JavaScript Script ID</p>" +
"<input type='text' class='textInput' id='scriptId' value='inspectletCustomScript'/>" +
"<p>CSS Sheet ID</p>" +
"<input type='text' class='textInput' id='cssId' value='inspectletCustomCSS'/>" +
"<input type='button' value='Save Options' id='saveOptions'/>" +
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

// write to inspectlet_document
function inspectlet_writeDocument() {
	inspectlet_document.open();
	inspectlet_document.write(inspectlet_window.getElementById("documentEditor").value);
	inspectlet_document.close();
};

function inspectlet_executeScript() {
	try { inspectlet_docWindow.Function(inspectlet_window.getElementById("scriptEditor").value)(); } catch(inspectlet_err) { console.error(inspectlet_err); };
};

function inspectlet_readScript() {
	if (inspectlet_document.getElementById(inspectlet_scriptName) === null) {
		inspectlet_window.getElementById("scriptEditor").value = "";
	} else {
		inspectlet_window.getElementById("scriptEditor").value = inspectlet_document.getElementById(inspectlet_scriptName).innerHTML;
	};
};

function inspectlet_writeScript() {
	if (!(inspectlet_document.getElementById(inspectlet_scriptName) === null)) {
		inspectlet_document.head.removeChild(inspectlet_document.getElementById(inspectlet_scriptName));
	};
	inspectlet_script = inspectlet_document.createElement("script");
	inspectlet_script.id = inspectlet_scriptName;
	inspectlet_script.innerHTML = inspectlet_window.getElementById("scriptEditor").value;
	inspectlet_document.head.appendChild(inspectlet_script);
};

function inspectlet_readCSS() {
	if (inspectlet_document.getElementById(inspectlet_cssName) === null) {
		inspectlet_window.getElementById("cssEditor").value = "";
	} else {
		inspectlet_window.getElementById("cssEditor").value = inspectlet_document.getElementById(inspectlet_cssName).innerHTML;
	};
};

function inspectlet_writeCSS() {
	if (!(inspectlet_document.getElementById(inspectlet_cssName) === null)) {
		inspectlet_document.head.removeChild(inspectlet_document.getElementById(inspectlet_cssName));
	};
	inspectlet_css = inspectlet_document.createElement("style");
	inspectlet_css.id = inspectlet_cssName;
	inspectlet_css.innerHTML = inspectlet_window.getElementById("cssEditor").value;
	inspectlet_document.head.appendChild(inspectlet_css);
};

function inspectlet_saveOptions() {
	if (inspectlet_window.getElementById("toggleIframe").checked) {
		inspectlet_docWindow = document.getElementsByTagName("iframe")[inspectlet_window.getElementById("iframe").value].contentWindow;
	} else {
		inspectlet_docWindow = window;
	};
	inspectlet_document = inspectlet_docWindow.document;
	if (inspectlet_window.getElementById("toggleEdit").checked) {
		inspectlet_document.body.contentEditable = "true";
		inspectlet_document.body.designMode = "on";
	} else {
		inspectlet_document.body.contentEditable = "false";
		inspectlet_document.body.designMode = "off";
	};
	inspectlet_scriptName = inspectlet_window.getElementById("scriptId").value;
	inspectlet_cssName = inspectlet_window.getElementById("cssId").value;
};

// read the console
function inspectlet_readConsole() {
	void(inspectlet_window.getElementById("consoleOutput").innerHTML = inspectlet_consoleLog.join('\n'));
};

// eval instructions
function inspectlet_eval() {
	console.log("> " + inspectlet_window.getElementById("consoleInput").value);
	try {
		inspectlet_consoleRet = inspectlet_docWindow.Function("return " + (inspectlet_window.getElementById("consoleInput").value)) ();
		console.log(inspectlet_consoleRet);
	} catch (inspectlet_err) {
		console.error(inspectlet_err);
	};
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
	inspectlet_window.getElementById("switchOptions").addEventListener("click", function(){return inspectlet_switch("options");});

	// Connect other functions
	inspectlet_window.getElementById("readDocument").addEventListener("click", inspectlet_readDocument);
	inspectlet_window.getElementById("writeDocument").addEventListener("click", inspectlet_writeDocument);

	inspectlet_window.getElementById("executeScript").addEventListener("click", inspectlet_executeScript);
	inspectlet_window.getElementById("readScript").addEventListener("click", inspectlet_readScript);
	inspectlet_window.getElementById("writeScript").addEventListener("click", inspectlet_writeScript);

	inspectlet_window.getElementById("readCSS").addEventListener("click", inspectlet_readCSS);
	inspectlet_window.getElementById("writeCSS").addEventListener("click", inspectlet_writeCSS);
	
	inspectlet_window.getElementById("saveOptions").addEventListener("click", inspectlet_saveOptions);

	// create listener for input
	inspectlet_window.getElementById("consoleInput").addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			inspectlet_eval();
		};
	});

};

inspectlet_createInspector();
