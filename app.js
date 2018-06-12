"use strict";

var container = document.getElementById("example");

var renderer = new THREE.WebGLRenderer({
    antialias: true
});

function NUMPY_VolumeLoader(container) {
	AMI.VolumeLoader.call(this, container);
}
NUMPY_VolumeLoader.prototype = Object.create(AMI.VolumeLoader);
NUMPY_VolumeLoader.prototype.parse = function(response) {
	return new Promise((resolve, reject) => {
		console.log("PARSE PARTYYYYYYYYYYYYY");
		resolve(response);
	});
}

var loader = new AMI.VolumeLoader(container);




console.log("--- script finished --");