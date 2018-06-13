/* global THREE: false */
/* global AMI: false */

var test = null;

window.onload = function() {
	"use strict";

	// Adapted from:
	//   https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String 
	function ab2str(buf) {
		return String.fromCharCode.apply(null, new Uint16Array(buf));
	}
	function str2ab(str) {
		var buf = new ArrayBuffer(str.length);
		var bufView = new Uint8Array(buf);
		for (var i=0, strLen=str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}

	
	var container = document.getElementById("example");

	var renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	class NUMPY_VolumeLoader extends AMI.VolumeLoader {
		constructor(container)
		{
			super(container);
		}

		parse(response) {
			return new Promise((resolve, reject) => {
				console.log("PARSE PARTYYYYYYYYYYYYY");
				console.log(this);
				
				console.log(response);
				test = response;
				
				const base64Data = ab2str(new Uint8Array(response.buffer));
				const binaryDataString = atob(base64Data);
				const imageData = NumpyLoader.fromArrayBuffer(str2ab(binaryDataString));
				
				
				resolve(response);
			});
		}
	}


	var loader = new NUMPY_VolumeLoader(container);

	var scene = new THREE.Scene();

	var camera = new AMI.OrthographicCamera(
			container.clientWidth / -2,
			container.clientWidth / 2,
			container.clientHeight / 2,
			container.clientHeight / -2,
			0.1,
			1000
	);
	var controls = new AMI.TrackballOrthoControl(camera, container);
	camera.controls = controls;

	function update_view() {
		controls.update();
		renderer.render(scene, camera);
	}
	update_view();
	
	loader 
		.load(["/numpy/something"])
		.then(function () {
			console.log("Everything was loaded!");
		});

	console.log("--- script finished --");
};
