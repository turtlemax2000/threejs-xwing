import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'




let camera, scene, renderer, controls, grid, stats;

const container = document.querySelector( 'body' );

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene()
    scene.add(new THREE.AxesHelper(5))

    scene.background = new THREE.Color( 0x0e181c );
    scene.fog = new THREE.Fog( 0x0e181c, 1, 4 );

    grid = new THREE.GridHelper( 20, 40, 0xffffff, 0xffffff );
    grid.material.opacity = 0.2;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    grid.scale.setScalar = .5;
    grid.position.set(0,-.5,0)
    scene.add( grid );

    //camera
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 15 );
    camera.position.set( .3, .05, .2 );
    // Ground
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry( 8, 8 ),
        new THREE.MeshPhongMaterial( { color: 0x111111, specular: 0x101010 } )
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    plane.scale.setScalar = 100;
    scene.add( plane );

    // Lights
    const hemiLight = new THREE.HemisphereLight( 0x7b7f8c, 0x495766 );
    scene.add( hemiLight );

    const spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 8;
    spotLight.penumbra = 0.5;
    spotLight.intensity = .55;
    spotLight.castShadow = false;
    //spotLight.castShadow = true;
    spotLight.position.set( - .75, .75, .775 );
    scene.add( spotLight );
      
    const loader = new STLLoader()
    loader.load(
        'Xwing.stl',
        function (geometry) {
            const material = new THREE.MeshStandardMaterial( { color: 0xa5a5a5 } );
            const mesh = new THREE.Mesh( geometry, material );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.scale.set(.02,.02,.02);
            mesh.rotateX(1.55);
            mesh.position.set(0,0.00,0);
            scene.add( mesh );
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional
    controls.autoRotate = true;
    controls.autoRotateSpeed = .5;    
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = .3;
    controls.maxDistance = 2.25;

    controls.maxPolarAngle = Math.PI / 1.5;

    window.addEventListener( 'resize', onWindowResize );

    stats = new Stats()
    document.body.appendChild(stats.dom)

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
    stats.update()

} function render() {

    const time = - performance.now() / 1000;
    grid.position.z = - ( time ) % 1;

    renderer.render(scene, camera)
}


// Renderer



/*const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
}) */


