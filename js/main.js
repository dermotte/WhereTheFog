var NUMBER_OF_TREES = 800;

var firefliesGeometry;

function addFireflies(scene){
    /* DO STUFF! */
    var material = new THREE.PointsMaterial({
        color: 0xFFF66D,

    });

    firefliesGeometry = new THREE.Geometry();
    var x, y, z;
    _.times(500, function(){
        x = THREE.Math.randFloatSpread( 400 );
        y = THREE.Math.randFloatSpread( 400 ) +10;
        z = THREE.Math.randFloatSpread( 400 ) ;

        firefliesGeometry.vertices.push(new THREE.Vector3(x, y, z));

    });
    var pointCloud = new THREE.PointCloud(firefliesGeometry, material);
    scene.add(pointCloud);
}

function animateFireflies() {

    //wiggle wiggle...
    _.forEach(firefliesGeometry.vertices, function(particle){
        var dX, dY, dZ;
        dX = Math.random() * 0.1 - 0.05;
        dY = Math.random() * 0.1 - 0.05;
        dZ = Math.random() * 0.1 - 0.05;

        particle.add(new THREE.Vector3(dX, dY, dZ));
    });
    firefliesGeometry.verticesNeedUpdate = true;
}

var scene = new THREE.Scene();
var goal = new THREE.Vector3(250, 0, 250);
var vecA = new THREE.Vector3(0, 0, 0);
var vecB = new THREE.Vector3(0, 0, 0);

scene.background = new THREE.Color( 0x606060 );
scene.add( new THREE.AmbientLight( 0x303030 ) );
// Nebel
scene.fog = new THREE.Fog( scene.background, 1, 50 );

// Licht
dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 1, 1, -1 ).normalize();
dirLight.castShadow = true;
dirLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 250 ) );
dirLight.shadow.bias = 0.0001;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add( dirLight );

var clock = new THREE.Clock();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 60 );
controls = new THREE.FirstPersonControls(camera);
controls.movementSpeed = 10;
controls.lookSpeed = 0.1;
controls.lookVertical = false;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Boden
var geometry = new THREE.PlaneGeometry( 20, 20, 32 );

var texture = new THREE.TextureLoader().load("assets/gras_dark.jpg");
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 100, 100 );

var material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide})

var plane = new THREE.Mesh( geometry, material );


plane.rotation.x = Math.PI / 2;
plane.scale.x = 100;
plane.scale.y = 100;
plane.receiveShadow = true;
scene.add( plane );

addFireflies(scene);

//Wood
for (var i = 0; i< NUMBER_OF_TREES; i++) {
    var woodtype = Math.round(Math.random());
    if(woodtype==0){
    //create standard tree
        geometry = new THREE.CylinderGeometry( 0.8, 1, 10, 10 );

        var texture = new THREE.TextureLoader().load("assets/bark.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshPhongMaterial({map: texture})
        texture.repeat.set( 2, 2 );

        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y=5;

        x = (Math.random()-0.5)*1000;
        z = (Math.random()-0.5)*1000;
        cylinder.position.x =  x;
        cylinder.position.z = z ;
        geometry = new THREE.SphereGeometry( 5+Math.random(), 10, 32 );

        var texture = new THREE.TextureLoader().load("assets/leaves.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture})

        var crown = new THREE.Mesh( geometry, material );
        randomCroneHeight = (Math.random()*10)%3;
        crown.position.y=10+randomCroneHeight;
        crown.position.x = x ;
        crown.position.z = z ;
        scene.add( crown );
        scene.add( cylinder );
    }else if(woodtype==1){
    //Create "nadelbaum"
        geometry = new THREE.CylinderGeometry( 0.8, 1, 10, 10 );

        var texture = new THREE.TextureLoader().load("assets/bark.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture})
        texture.repeat.set( 2, 2 );

        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.castShadow = true;
        cylinder.position.y=5;

        x = (Math.random()-0.5)*1000;
        z = (Math.random()-0.5)*1000;
        cylinder.position.x =  x;
        cylinder.position.z = z ;

        geometry = new THREE.ConeGeometry( 5, 20, 6 );

        var texture = new THREE.TextureLoader().load("assets/evergreen.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture})

        var crown = new THREE.Mesh( geometry, material );
        randomCroneHeight = (Math.random()*10)%3;
        crown.position.y=11+randomCroneHeight;
        crown.position.x = x ;
        crown.position.z = z ;
        scene.add( crown );
        scene.add( cylinder );
    }
}


// camera
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(cylinder.position);
window.addEventListener( 'resize', onWindowResize, false );

// ------ positional audio -----
// create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();
camera.add( listener );

// create the PositionalAudio object (passing in the listener)
var sound = new THREE.PositionalAudio( listener );
var filter

// load a sound and set it as the PositionalAudio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'assets/party-in-the-woods.ogg', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setRefDistance( 300 );
    sound.setRolloffFactor(5);
    sound.setLoop(true);
    filter = sound.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, sound.context.currentTime);
    // sound is at (250, 0, 250);
    // filter.gain.setValueAtTime(1, sound.context.currentTime);
    sound.setFilter(filter);
});

// instantiate a loader
var loader = new THREE.OBJLoader2();
var speakerModel;
var speakerModelLoaded = false;
var spotLight;
var callbackOnLoad = function ( event ) {
    speakerModel = event.detail.loaderRootNode;
    scene.add( speakerModel );
    speakerModel.add( sound );
    speakerModel.position.x=250;
    speakerModel.position.z=250;
    speakerModel.position.y=0;
    speakerModel.scale.x=1.5;
    speakerModel.scale.y=1.5;
    speakerModel.scale.z=1.5;
    console.log( 'Loading complete: ' + event.detail.modelName );
    speakerModelLoaded = true;

    //Dancefloor at speaker
    var geometry = new THREE.CircleGeometry(30,32);
    var texture = new THREE.TextureLoader().load("assets/tile.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide})
    texture.repeat.set( 4, 4 );
    var dancefloor = new THREE.Mesh( geometry, material );
    dancefloor.rotation.x = Math.PI / 2;
    dancefloor.translateY(-1);
    dancefloor.receiveShadow = true;
    dancefloor.position.set(250,0.01,250);
    scene.add( dancefloor );


    //spotlights
    spotLight = new THREE.SpotLight( 0xff0000, 2);
    spotLight.position.set(260,20,260);
    spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0;
	spotLight.decay = 1;
	spotLight.distance = 200;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add( spotLight );
    spotLight.target = speakerModel;
    spotLight.target.updateMatrixWorld();
    scene.add( spotLight.target);

	//lightHelper = new THREE.SpotLightHelper( spotLight );
	//scene.add( lightHelper );

    spotLight2 = new THREE.SpotLight( 0xff0f, 2);
    spotLight2.position.set(240,20,240);
    spotLight2.angle = Math.PI / 4;
	spotLight2.penumbra = 0;
	spotLight2.decay = 1;
	spotLight2.distance = 200;

    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
    spotLight2.shadow.mapSize.height = 1024;

    spotLight2.shadow.camera.near = 500;
    spotLight2.shadow.camera.far = 4000;
    spotLight2.shadow.camera.fov = 30;
    scene.add( spotLight2 );
    spotLight2.target = speakerModel;
    spotLight2.target.updateMatrixWorld();
    scene.add( spotLight2.target);

	//lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
	//scene.add( lightHelper2 );

    spotLight3 = new THREE.SpotLight( 0xefff00, 2);
    spotLight3.position.set(240,20,260);
    spotLight3.angle = Math.PI / 4;
	spotLight3.penumbra = 0;
	spotLight3.decay = 1;
	spotLight3.distance = 200;

    spotLight3.castShadow = true;
    spotLight3.shadow.mapSize.width = 1024;
    spotLight3.shadow.mapSize.height = 1024;

    spotLight3.shadow.camera.near = 500;
    spotLight3.shadow.camera.far = 4000;
    spotLight3.shadow.camera.fov = 30;
    scene.add( spotLight3 );
    spotLight3.target = speakerModel;
    spotLight3.target.updateMatrixWorld();
    scene.add( spotLight3.target);

	//lightHelper3 = new THREE.SpotLightHelper( spotLight3 );
	//scene.add( lightHelper3 );

    spotLight4 = new THREE.SpotLight( 0x2c00ff, 2);
    spotLight4.position.set(260,20,240);
    spotLight4.angle = Math.PI / 4;
	spotLight4.penumbra = 0;
	spotLight4.decay = 1;
	spotLight4.distance = 200;

    spotLight4.castShadow = true;
    spotLight4.shadow.mapSize.width = 1024;
    spotLight4.shadow.mapSize.height = 1024;

    spotLight4.shadow.camera.near = 500;
    spotLight4.shadow.camera.far = 4000;
    spotLight4.shadow.camera.fov = 30;
    scene.add( spotLight4 );
    spotLight4.target = speakerModel;
    spotLight4.target.updateMatrixWorld();
    scene.add( spotLight4.target);

	//lightHelper4 = new THREE.SpotLightHelper( spotLight4 );
	//scene.add( lightHelper4 );

};

var onLoadMtl = function ( materials ) {
    loader.setModelName( 'speaker' );
    loader.setMaterials( materials );
    loader.setLogging( true, true );
    loader.load( 'assets/Speaker.obj', callbackOnLoad, null, null, null, false );
};
loader.loadMtl( 'assets/Speaker.mtl', null, onLoadMtl );


var loaderCredits = new THREE.OBJLoader2();
var credModel;
var callbackOnLoadCredits = function ( event ) {
    credModel = event.detail.loaderRootNode;
    scene.add(credModel);
    credModel.add(sound);
    credModel.position.x = 250;
    credModel.position.z = 250;
    credModel.position.y = 5;
    credModel.scale.x = 1.5;
    credModel.scale.y = 1.5;
    credModel.scale.z = 1.5;
    console.log('Loading complete: ' + event.detail.modelName);
}
var onLoadMtlCredits = function ( materials ) {
    loaderCredits.setModelName( 'credits' );
    loaderCredits.setMaterials( materials );
    loaderCredits.setLogging( true, true );
    loaderCredits.load( 'assets/credits.obj', callbackOnLoadCredits, null, null, null, false );
};
loaderCredits.loadMtl( 'assets/credits.mtl', null, onLoadMtlCredits );

var scale = 0, scaleFactor = 0;
var animate = function () {
    requestAnimationFrame( animate );
    controls.update( clock.getDelta() );
    animateFireflies();
    // update filter settings based on the angle ... a low pass filter for when people are looking away :)
    vecA.subVectors(camera.position, controls.target);
    vecB.subVectors(camera.position, goal);
    if (vecA.angleTo(vecB)<Math.PI/2) {
        filter.frequency.setValueAtTime(22500, sound.context.currentTime);
    } else {
        freq = (vecA.angleTo(vecB) - Math.PI/2) / (Math.PI/2);
        filter.frequency.setValueAtTime(50 + 450*(1-freq), sound.context.currentTime);
    }

    if(credModel != undefined) credModel.rotation.y += 0.01;
    renderer.render(scene, camera);
    // if (speakerModelLoaded) {
    //     scale += clock.getDelta();
    //     if (scale % 2 > 1)
    //         scaleFactor = 1 - scale % 1;
    //     else
    //         scaleFactor = scale % 1;
    //     speakerModel.scale.x = 1 + 2 * EasingFunctions.easeInOutQuad(scaleFactor);
    //     speakerModel.scale.y = 1 + 2 * EasingFunctions.easeInOutQuad(scaleFactor);
    //     speakerModel.scale.z = 1 + 2 * EasingFunctions.easeInOutQuad(scaleFactor);
    //     console.log(scaleFactor)
    // }
};

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight);
}



animate();
