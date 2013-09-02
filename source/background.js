// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.

var tabid = null;

function genericOnClick(info, tab) {

	var regexStr = "%\\[([^%]+)\\]";
	var modValue = allResponses[info.menuItemId];

	var regex = new RegExp(regexStr);

	while (modValue.match(regex)) {
		modValue = modValue.replace(regex, function (a,b) {
			return internalVars[b];
		});
	}

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		tabid = tabs[0].id;
		chrome.tabs.sendMessage(tabid, {"cmd": "updateField", "value": modValue}, function(response) {});
	});


/*
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
*/

}

function settingsOnClick(info, tab) {

}

var allResponses = {};
allResponses['Initial Response'] = "Hello $[customerName],\n\nHow are you? This SR's ID is $[srNumber].\n\nThanks,\n%[NAME]";
allResponses['Idle Warning'] = "Hello $[customerName],\n\nThis SR is idling. This SR's ID is $[srNumber].\n\nThanks,\n%[NAME]";
allResponses['Closure Notification'] = "Hello $[customerName],\n\nClosing this SR. This SR's ID is $[srNumber].\n\nThanks,\n%[NAME]";

var internalVars = {};
internalVars['NAME'] = "Dennis";

chrome.contextMenus.create({"title": "Oracle Support - Canned Responses", "contexts":["editable"], "id": "main"});

for (var title in allResponses) {
	chrome.contextMenus.create({"title": title, "parentId":"main", "id": title, "contexts":["editable"], "onclick": genericOnClick});
}

chrome.contextMenus.create({"type": "separator", "parentId":"main", "contexts":["editable"]});
chrome.contextMenus.create({"title": "Settings...", "parentId":"main", "id": "settings", "contexts":["editable"], "onclick": settingsOnClick});

