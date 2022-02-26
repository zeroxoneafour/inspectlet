// launcher.js - Opens a menu to launch inspectlet, consolet, or other utilities

inspectletLauncher_HTML = "<!DOCTYPE html>" +
"<html>" +
"<head>" +
"<title>Inspectlet Launcher</title>" +
"</head>" +
"<body>" +
"<ul>" +
"<li><input type='button' id='inspectlet' value='Launch Inspectlet'></input></li>" +
"<li><input type='button' id='consolet' value='Launch Consolet'></input></li>" +
"</ul>" +
"</body>" +
"</html>";

inspectletLauncher_window = window.open("about:blank", "inspectletLauncher", "popup");
inspectletLauncher_doc = inspectletLauncher_window.document;

function inspectletLauncher_launch(app) {
};

inspectletLauncher_doc.open();
inspectletLauncher_doc.write(inspectletLauncher_HTML);
inspectletLauncher_doc.close();

for(inspectletLauncher_i = 0; inspectletLauncher_i < inspectletLauncher_doc.getElementsByTagName("button").length; inspectletLauncher_i++) {
	inspectletLauncher_current = inspectletLauncher_doc.getElementsByTagName("button")[inspectletLauncher_i];
	inspectletLauncher_current.addEventListener("click", function() {
		fetch('https://www.inspectlet.tk/inspectlet/' + inspectletLauncher_current.id + '.js').then((res) => res.text().then((t) => eval(t))); // idk either
		inspectletLauncher_window.close();
	});
}
