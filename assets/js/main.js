//Function
function mengerSponge(x, y ,z, size, iter){
    var spongeGeo = new THREE.BufferGeometry()
    var geometries = makeGeometries(x, y, z, size, iter)
    geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false)
    var material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF
    })

    return new THREE.Mesh(geometry,material)
}

function makeGeometries(x, y ,z, size, iter){
    sub_cubes = new Array()
    if(iter > 0){
        //Get the coordinates for x, y and z
        var coordinates = [-size/3, 0, size/3]
        for(let new_x of coordinates){
            for(let new_y of coordinates){
                for(let new_z of coordinates){
                    //If not in a line
                    if(!(new_x == 0 && new_y==0) && !(new_x == 0 && new_z==0) && !(new_z == 0 && new_y==0)){
                        // var subCubes = 
                        sub_cubes= sub_cubes.concat(makeGeometries(x + new_x, y + new_y, z + new_z, size/3, iter-1))
                        // console.log(sub_cubes)
                        // console.log(subCubes, cubes)
                    }
                }
            }
        }
    }else{
        var geometry = new THREE.BoxBufferGeometry(size, size, size)
        for(var i = 0; i < geometry.attributes.position.array.length; i+= 3){
            geometry.attributes.position.array[i] += x
            geometry.attributes.position.array[i+1] += y
            geometry.attributes.position.array[i+2] += z
        }
        return [geometry]
    }
    return sub_cubes;
}
//Stats
var stats = new Stats();
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0';
stats.domElement.style.top = '0';

document.body.appendChild( stats.domElement );

//GUI

var gui = new dat.GUI({
	width: 300
});

//Iterations

var iterations_param = {
    iterations: 3
};

gui.add(iterations_param, 'iterations').name('Iterations').min(0).max(4).step(1).onFinishChange(function(){
	scene.remove(sponge)
	sponge = mengerSponge(0, 0, 0, 1, iterations_param.iterations)
	scene.add(sponge)
})

//Rotation

var rotation_x_param = {
    rotation: .005
};

gui.add(rotation_x_param, 'rotation').name('x speed').min(-0.05).max(0.05).step(.001)

var rotation_y_param = {
    rotation: .005
};

gui.add(rotation_y_param, 'rotation').name('y speed').min(-0.05).max(0.05).step(.001)



//Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,1.5)
camera.lookAt(0,0,0)

//renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

document.body.appendChild( stats.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


//light
var ambient = new THREE.AmbientLight( 0xffffff, 0.2 );
scene.add( ambient );

var light = new THREE.PointLight( 0xFFFFFF, 0.4, 10 );
light.position.set( 2, 2, 2 );
scene.add( light );

var light = new THREE.PointLight( 0xFFFFFF, 0.4, 10 );
light.position.set( -2, 2, 2 );
scene.add( light );


//Sponge
var sponge = mengerSponge(0, 0, 0, 1, iterations_param.iterations)
scene.add(sponge)


function animate() {
	// c.rotate()
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	sponge.rotation.x += rotation_x_param.rotation
	sponge.rotation.y += rotation_y_param.rotation
	stats.update();
}
animate();

window.addEventListener('resize', function () {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});