var clickedElement = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedElement = event.target;
    }
}, true);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "updateField") {
        updateField(request.value);
    }
});

function updateField( value ) {

	var modValue = value;

	var regexStr = "\\$\\[([^\\]]+)\\]";

	var regex = new RegExp(regexStr);

	while (modValue.match(regex)) {
		modValue = modValue.replace(regex, function (a,b) {
			return document.getElementById(b).value;
		});
	}

	clickedElement.value = modValue;

}