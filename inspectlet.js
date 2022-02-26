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
"<title>Inspectlet</title>" +
"</head>" +
"<body>" +
"<h3>Inspectlet Inspector</h3>" +
"<div>" +
"<input type='button' value='Inspector' id='switchInspector'></input>" +
"<input type='button' value='Console' id='switchConsole'></input>" +
"<div class='tool' id='inspector' style='display: box'>" +
"<div style='display: flex; flex-direction: row; margin: 0 auto; width: 100%;'>" +
"<input type='button' value='Read Document' id='read'></input>" +
"<input type='button' value='Write Document' id='write'></input>" +
"</div>" +
"<textarea id='textArea' style='width: 100%; height: 100%; font-family: monospace;'></textarea>" +
"</div>" +
"<div class='tool' id='console' style='display: hidden'>" +
"<div style='display: flex; flex-flow: column; height: 100%; width: 100%;'>" +
"<p id='consoleOutput' style='font-family: monospace; white-space: pre;'></p>" +
"</div>" +
"<input type='text' id='consoleInput' style='font-family: monospace; width: 100%;'></input>" +
"</div>" +
"</body>" +
"</html>";

// window
var inspectlet_window;

// read root document
function inspectlet_readDocument() {
	inspectlet_window.getElementById("textArea").value = new XMLSerializer().serializeToString(document);
};

// write to root document
function inspectlet_writeDocument() {
	document.open();
	document.write(inspectlet_window.getElementById("textArea").value);
	document.close();
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
	for ( const inspectlet_tab in inspectlet_window.getElementsByClassName("tool") ) {
		inspectlet_tab.style.display = "none";
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
	inspectlet_window.getElementById("switchInspector").addEventListener("click", inspectlet_switch("inspector"));
	inspectlet_window.getElementById("switchConsole").addEventListener("click", inspectlet_switch("console"));

	// Connect other functions
	inspectlet_window.getElementById("read").addEventListener("click", inspectlet_readDocument);
	inspectlet_window.getElementById("write").addEventListener("click", inspectlet_writeDocument);

	// create listener for input
	inspectlet_window.getElementById("consoleInput").addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			inspectlet_eval();
		};
	});

};

inspectlet_createInspector();
