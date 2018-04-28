var NUMBER_OF_TREES = 1000;

var scene = new THREE.Scene();

scene.background = new THREE.Color( 0xf0f0f0 );
scene.add( new THREE.AmbientLight( 0x505050 ) );
// Nebel
scene.fog = new THREE.Fog( scene.background, 1, 250 );

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
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
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

var texture = new THREE.TextureLoader().load("assets/gras.png");
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 400, 400 );

var material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide})

var plane = new THREE.Mesh( geometry, material );


plane.rotation.x = Math.PI / 2;
plane.translateY(-1);
plane.scale.x = 100;
plane.scale.y = 100;
plane.receiveShadow = true;
scene.add( plane );

// Wald
for (var i = 0; i< NUMBER_OF_TREES; i++) {
    geometry = new THREE.CylinderGeometry( 0.8, 1, 10 );
    material = new THREE.MeshLambertMaterial( { color: 0xCC7224, reflectivity: 0.5 } );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.castShadow = true;
    cylinder.position.y=5;

    x = Math.random()*500;
    z = Math.random()*500;
    cylinder.position.x =  x;
    cylinder.position.z = z ;

    geometry = new THREE.SphereGeometry( 5+Math.random(), 1, 10 );
    material = new THREE.MeshLambertMaterial( { color: 0x54F416, reflectivity: 0.5 } );
    var crown = new THREE.Mesh( geometry, material );
    crown.castShadow = true;
    crown.position.y=10;
    crown.position.x = x ;
    crown.position.z = z ;
    scene.add( crown );
    scene.add( cylinder );
}

// camera
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(cylinder.position);
window.addEventListener( 'resize', onWindowResize, false );
var animate = function () {
    requestAnimationFrame( animate );
    controls.update( clock.getDelta() );
    renderer.render(scene, camera);
};

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

animate();