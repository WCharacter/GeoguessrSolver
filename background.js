url = "";

chrome.webRequest.onCompleted.addListener(
    function(details) {    
		if(details.url.includes("GeoPhotoService.GetMetadata") && details.initiator == "https://www.geoguessr.com"){
			fetch(details.url)
				.then(response => response.text())
				.then(text => {
					matches = [...text.matchAll(/null,null,-?\d{1,3}\.\d{11,14},-?\d{1,3}\.\d{11,14}/g)]
					if(matches.length !== 0){
						coordinates = matches[0][0].substring(10);	
						url = `http://maps.google.com/?q=${coordinates}`;
						console.log(url);
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
							chrome.tabs.sendMessage(tabs[0].id, {action: "setUrl", url: url});
						});
					}
				});								
		}
	},    
    {
		urls: [
			"*://maps.googleapis.com/*"
	]}
);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.action === "getUrl"){
			sendResponse({url: url});
	  	}
	}
); 