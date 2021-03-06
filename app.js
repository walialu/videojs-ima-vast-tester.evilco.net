var player = videojs('content_video');

var locSearch = window.location.search
var queryParamString = ''
var queryParams = {}
var vastURL = 'https://vh.adscale.de/vah?sid=1d67e909-c4a9-4b70-9dd9-0942545a8067&ref=https://www.t-online.de/nachrichten/panorama/id_89591604/wetter-hier-schneit-es-am-wochenende-wieder-kraeftig.html&gdpr=1&gdpr_consent=CPAy22zPAy22zAGABBENBLCoAP_AAEfAAAYgHDld5D7NTWFCUfx5SttgGYgV1tQUA2QCCACBAyAFAAGQ8IQCg2ASsASAhAACAQIAohIBAABEHAEEAAAAAAAEAAAAAAUEgAAIIAIEABEBAAIQAAoKAAAAAAAAgEAACAQAmECQAubmBGAAAIAwAAAAAAAACBwQFYAqTQ1BQlHYaUhpQAiIAFaQFABgAggQgQIgBAABEOCEAhNAErAEAIAAAgECAKISAQAAQAAJBAAAAAAARAAAIAAFAIAACAACBBARAQAAEAAIAgAAAAAAAAAAAQAEAJAAEAEGZgBgAAAAIAAAAAAAAQEREAkAFQAXABDAD8AQ2Ai8BOwCkQF0BIAQARQGnBQC4ABgAFQAnACgAFgAMgAhQBGAEcAKQAVwBFgDRAHAAPIAhABJgCVgFZAM4Af0BCQCQQEtAMZCAAQAWhoBYAKgAuACGAH4AWkBDYCLwE7AKRAXQAxgMABANkMgEgAqACGAEwALgAjoB9gH4ARwBMQC8xgAIA2QCThUAsAFQAQwAmABcAEcAPwAjgBaQEggJiAXmOgBgBFAGGA04eAZAAMAAqAE4AUAAsABlAEYARwAmgBSACuAIsAUgA4AB5AEmAJXAS0BLgCcAFZAM4Af0BCQCSAEtAMZgY4Bjo4ACAC0hABAH2RAGAAsACaAFcARYApABwAErAJcATgArIBnAEtEwCgABoATgBQACwAIQARwAmgBSACoAFcAN4ApACVgEtAKyAX4AzgCEgEggL2AYyUgBAAiACKVALQAnACgAFgAMgAfABCgCMAI4ATQAqABXADeAHcARYApACVgEtAKyAZwBCQCSAEtAMZAZAAA.YAAAAAAAAAAA&bust=9386624044'

if (locSearch.length > 0) {
	queryParamString = locSearch.substring(1)
}

queryParamString.split("&").forEach(function (keyvalPairString) {
	var keyvalPair = keyvalPairString.split('=')
	if (keyvalPair[0].length) {
		queryParams[keyvalPair[0]] = decodeURIComponent(keyvalPair[1])
	}
})

if (queryParams.vasturl) {
	document.getElementById('input_vasturl').value = queryParams.vasturl
	document.querySelector('h1 a').href = '/?vasturl=' + encodeURIComponent(queryParams.vasturl)
	vastURL = queryParams.vasturl
}

var adsManagerLoadedCallback = function () {
	var keys = Object.keys(google.ima.AdEvent.Type)
	var eventNames = []
	keys.forEach(function(k) {
		var eventName = google.ima.AdEvent.Type[k]
		eventNames.push(eventName)
		player.ima.addEventListener(eventName, function(evt) {
			console.log(eventName, evt)
		})
	})
	keys = Object.keys(google.ima.AdError.Type)
	keys.forEach(function(k) {
		var eventName = google.ima.AdError.Type[k]
		eventNames.push(eventName)
		player.ima.addEventListener(eventName, function(evt) {
			console.log(eventName, evt)
		})
	})
	console.log('Registered IMA Events', eventNames)
}

var options = {
	id: 'content_video',
	adsManagerLoadedCallback: adsManagerLoadedCallback
};

player.ima(options)

// Remove controls from the player on iPad to stop native controls from stealing
// our click
var contentPlayer =  document.getElementById('content_video_html5_api');
if ((navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) && contentPlayer.hasAttribute('controls')) {
	contentPlayer.removeAttribute('controls')
}

// Initialize the ad container when the video player is clicked, but only the
// first time it's clicked.
var startEvent = 'click';
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) {
	startEvent = 'touchend'
}

player.one(startEvent, function() {
	player.ima.initializeAdDisplayContainer()
	player.ima.setContentWithAdTag(null, vastURL, false);
	player.ima.requestAds()
	player.play()
});

document.getElementById('reload_btn').addEventListener('click', function (evt) {
	evt.preventDefault()
	window.location.reload()
})
