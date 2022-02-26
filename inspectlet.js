// inspectlet.js

// html inspect page
var inspectlet_HTML = "<!DOCTYPE html>" +
"<html>" +
"<head>" +
"<title>Inspectlet</title>" +
"</head>" +
"<body>" +
"<h3>Inspectlet Inspector</h3>" +
"<div style='display: flex; flex-direction: row; margin: 0 auto; width: 100%;'>" +
"<input type='button' value='Read Document' id='read'></input>" +
"<input type='button' value='Write Document' id='write'></input>" +
"</div>" +
"<textarea id='textArea' style='display: box; width: 100%; height: 100%; font-family: monospace;'></textarea>" +
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

// create the inspector
function inspectlet_createInspector() {
	inspectlet_window = window.open("about:blank", "inspectletWindow", "popup").document;
	inspectlet_window.open();
	inspectlet_window.write(inspectlet_HTML);
	inspectlet_window.close();

	// Connect functions
	inspectlet_window.getElementById("read").addEventListener("click", inspectlet_readDocument);
	inspectlet_window.getElementById("write").addEventListener("click", inspectlet_writeDocument);
};

inspectlet_createInspector();
