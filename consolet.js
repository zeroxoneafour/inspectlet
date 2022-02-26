// consolet.js

// code stolen from StackOverflow - keeps a console log
console.stdlog = console.log.bind(console);
consolet_consoleLog = [];
console.log = function(){
    consolet_consoleLog.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
};

// the consolet webpage
var consolet_HTML = "<!DOCTYPE html>" +
"<html>" +
"<head>" +
"<title>Consolet</title>" +
"</head>" +
"<body>" +
"<h3>Consolet JS Console</h3>" +
"<div style='display: flex; flex-flow: column; height: 100%; width: 100%;'>" +
"<p id='consoleOutput' style='font-family: monospace; white-space: pre;'></p>" +
"</div>" +
"<input type='text' id='consoleInput' style='font-family: monospace; width: 100%;'></input>" +
"</body>" +
"</html>";

// document reference to the consolet webpage
var consolet_window;

// read the console
function consolet_readConsole() {
	consolet_window.getElementById("consoleOutput").innerHTML = consolet_consoleLog.join('\n');
};

// eval instructions
function consolet_eval() {
	console.log("> " + consolet_window.getElementById("consoleInput").value);
	console.log(eval(consolet_window.getElementById("consoleInput").value));
	consolet_window.getElementById("consoleInput").value = "";
	consolet_readConsole();
};

// create the inspector window
function consolet_createConsole() {
	consolet_window = window.open("about:blank", "consoletWindow", "popup").document;
	consolet_window.open();
	consolet_window.write(consolet_HTML);
	consolet_window.close();
	consolet_readConsole();

	// create listener for input
	consolet_window.getElementById("consoleInput").addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			consolet_eval();
		};
	});
};

consolet_createConsole();
