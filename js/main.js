var NUMBER_OF_TREES = 200;

var scene = new THREE.Scene();

scene.background = new THREE.Color( 0x606060 );
scene.add( new THREE.AmbientLight( 0x303030 ) );
// Nebel
scene.fog = new THREE.Fog( scene.background, 1, 50 );

// Licht
dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 1, 1, -1 ).normalize();
dirLight.castShadow = true;
dirLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
dirLight.shadow.bias = 0.0001;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add( dirLight );

var clock = new THREE.Clock();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100 );
controls = new THREE.FirstPersonControls(camera);
controls.movementSpeed = 10;
controls.lookSpeed = 0.1;
controls.lookVertical = false;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Boden
var geometry = new THREE.PlaneGeometry( 20, 20, 32 );
//var material = new THREE.MeshLambertMaterial( {color: 0x158116, side: THREE.DoubleSide} );

var texture = new THREE.TextureLoader().load("assets/gras_dark.png");
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 400, 400 );

var material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide})

var plane = new THREE.Mesh( geometry, material );


plane.rotation.x = Math.PI / 2;
plane.translateY(-1);
plane.scale.x = 100;
plane.scale.y = 100;
plane.receiveShadow = true;
scene.add( plane );


//Wood
for (var i = 0; i< NUMBER_OF_TREES; i++) {
    var woodtype = Math.round(Math.random());
    if(woodtype==0){
        geometry = new THREE.CylinderGeometry( 0.8, 1, 10, 100 );

        var texture = new THREE.TextureLoader().load("assets/bark.png");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide})
        texture.repeat.set( 4, 4 );

        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y=5;

        x = Math.random()*500;
        z = Math.random()*500;
        cylinder.position.x =  x;
        cylinder.position.z = z ;
        geometry = new THREE.SphereGeometry( 5+Math.random(), 10, 32 );

        var texture = new THREE.TextureLoader().load("assets/leaves.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide})
        texture.repeat.set( 4, 4 );

        var crown = new THREE.Mesh( geometry, material );
        randomCroneHeight = (Math.random()*10)%3;
        crown.position.y=10+randomCroneHeight;
        crown.position.x = x ;
        crown.position.z = z ;
        scene.add( crown );
        scene.add( cylinder );
    }else if(woodtype==1){
        geometry = new THREE.CylinderGeometry( 0.8, 1, 10, 100 );

        var texture = new THREE.TextureLoader().load("assets/bark.png");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide})
        texture.repeat.set( 4, 4 );

        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.castShadow = true;
        cylinder.position.y=5;

        x = Math.random()*500;
        z = Math.random()*500;
        cylinder.position.x =  x;
        cylinder.position.z = z ;

        geometry = new THREE.ConeGeometry( 5, 20, 6 );

        var texture = new THREE.TextureLoader().load("assets/evergreen.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide})
        texture.repeat.set( 4, 4 );

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

// load a sound and set it as the PositionalAudio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'assets/party-in-the-woods.ogg', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setRefDistance( 50 );
    sound.setRolloffFactor(5)
    sound.play();
});

// instantiate a loader
var loader = new THREE.OBJLoader2();
var speakerModel;
var speakerModelLoaded = false;
var callbackOnLoad = function ( event ) {
    speakerModel = event.detail.loaderRootNode;
    scene.add( speakerModel );
    speakerModel.add( sound );
    speakerModel.position.x=250;
    speakerModel.position.z=250;
    speakerModel.position.y=1;
    speakerModel.scale.x=1.5;
    speakerModel.scale.y=1.5;
    speakerModel.scale.z=1.5;
    console.log( 'Loading complete: ' + event.detail.modelName );
    speakerModelLoaded = true;
};

var onLoadMtl = function ( materials ) {
    loader.setModelName( 'speaker' );
    loader.setMaterials( materials );
    loader.setLogging( true, true );
    loader.load( 'assets/Speaker.obj', callbackOnLoad, null, null, null, false );
};
loader.loadMtl( 'assets/Speaker.mtl', null, onLoadMtl );

var scale = 0, scaleFactor = 0;
var animate = function () {
    requestAnimationFrame( animate );
    controls.update( clock.getDelta() );
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