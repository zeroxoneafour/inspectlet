// payload.js - The payload dropped in by inject.js

// code stolen from StackOverflow - keeps a console log
console.stdlog = console.log.bind(console);
inspectlet_consoleLog = [];
console.log = function(){
    inspectlet_consoleLog.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
}

var inspectlet_inspectorHTML = `<!DOCTYPE html>
<html>
	<head>
		<title>Inspectlet Inspector</title>
	</head>
	<body>
		<h3>Inspectlet Inspector</h3>
		<div>
			<button onclick="inspectlet_switchTabs('inspector')">Inspector</button>
			<button onclick="inspectlet_switchTabs('console')">Console</button>
		</div>
		<div id="inspector" class="tab">
			<textarea id="inspectorTextArea"></textarea>
			<div>
				<button onclick="inspectlet_readDocument()">Read Document</button>
				<button onclick="inspectlet_writeDocument()">Write Document</button>
			</div>
		</div>
		<div id="console" class="tab" style="display: none;">
			<div>
				<p id="consoleOutput"></p>
			</div>
			<input type="text" id="consoleInput"></input>
		</div>
	</body>
</html>
`;

var inspectlet_window;

function inspectlet_test() {
	return true;
}

function inspectlet_readDocument() {
	inspectlet_window.document.getElementById("inspectorTextArea").value = new XMLSerializer().serializeToString(document);
}

function inspectlet_writeDocument() {
	document.open();
	document.write(inspectlet_window.document.getElementById("inspectorTextArea").value);
	document.close();
}

function inspectlet_switchTabs(tab) {
	tabs = inspectlet_window.document.getElementsByClassName("tab");
	for (i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";
	}
	inspectlet_window.document.getElementById(tab).style.display = "block";
}

function inspectlet_readConsole() {
	inspectlet_window.document.getElementById("consoleOutput").text = inspectlet_consoleLog.join('\n');
}

function inspectlet_eval() {
	console.log("> " + inspectlet_window.document.getElementById("consoleInput").value);
	console.log(eval(command));
	inspectlet_window.document.getElementById("consoleInput").value = "";
	inspectlet_readConsole();
}

function inspectlet_createInspector() {
	inspectlet_window = window.open("about:blank", "inspectletWindow", "popup");
	inspectlet_window.document.open();
	inspectlet_window.document.write(inspectlet_inspectorHTML);
	inspectlet_window.document.close();
	inspectlet_readDocument();
	inspectlet_readConsole();

	// create listener for input
	document.getElementById("consoleInput").addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			inspectlet_eval();
		}
	});
}
