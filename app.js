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

	// Use a random prototype to implement a costum VolumeParser class
	class NumpyParser extends ParsersVolume {
		constructor(data, id) {
			super();
			
		    this._id = id;
		    this._arrayBuffer = data.buffer;
		    this._url = data.url;
		    
		    this._doParse();
		}
	
		_doParse() {
			const base64Data = ab2str(new Uint8Array(this._arrayBuffer));
			const binaryDataString = atob(base64Data);
			this._imageData = NumpyLoader.fromArrayBuffer(str2ab(binaryDataString));
			this._arrayBuffer = null;
			
			test = this._imageData;
		}
		
		extractPixelData(frameIndex = 0) {
			return this._imageData.data.slice(
					this._imageData.shape[1] * this._imageData.shape[2] * frameIndex,
					this._imageData.shape[1] * this._imageData.shape[2] * (frameIndex + 1));
		}
		
		seriesInstanceUID() {
			return this._url;
		}
		
		sopInstanceUID(frameIndex = 0) {
			return frameIndex;
		}
		
		numberOfFrames() {
			return this._imageData.shape[0];
		}

		rows(frameIndex = 0) {
			return this._imageData.shape[1];
		}

		columns(frameIndex = 0) {
			return this._imageData.shape[2];
		}
		
		pixelType(frameIndex = 0) {
			// 0 - int
			// 1 - float
			return ((test.data instanceof Float32Array) || (test.data instanceof Float64Array)) ? 1 : 0;
		}
		
		pixelSpacing(frameIndex = 0) {
			return [1, 1, 1]; // TODO!
		}
		
		imageOrientation(frameIndex = 0) {
			return [1, 0, 0, 0, 1, 0]; // TODO!
		}

		imagePosition(frameIndex = 0) {
			return [-this._imageData.shape[0] / 2, -this._imageData.shape[1] / 2, -this._imageData.shape[2] / 2]; // TODO!
		}
		
		bitsAllocated(frameIndex = 0) {
			if ((test.data instanceof Uint8Array) || (test.data instanceof Int8Array)) {
				return 8;
			}
			if ((test.data instanceof Uint16Array) || (test.data instanceof Int16Array)) {
				return 16;
			}
			if ((test.data instanceof Float32Array) || (test.data instanceof Uint32Array) || (test.data instanceof Int32Array)) {
				return 32;
			}
			if (test.data instanceof Float64Array) {
				return 64;
			}
			return 1;
		}
	}
	
	class NUMPY_VolumeLoader extends AMI.VolumeLoader {
		constructor(container)
		{
			super(container);
		}

		_parser(extension) {
			return NumpyParser;
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
