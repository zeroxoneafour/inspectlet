// inject.js - A one-liner to inject the payload. Stolen from Stack. Put this in a bookmarklet that starts with javascript: (ex. javascript:inspectlet...)
inspectlet_payload = document.createElement("script"); inspectlet_payload.type = 'text/javascript'; inspectlet_payload.src = "https://raw.githubusercontent.com/zeroxoneafour/inspectlet/master/payload.js"; document.getElementsByTagName("head")[0].appendChild(inspectlet_payload); try {inspectlet_test(); alert("injection successful");} catch {alert("injection failed :(");};
