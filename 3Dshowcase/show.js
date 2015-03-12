var scene,camera,renderer;
var planes = [];
var circles = [];
var keys = [];

/////////////////////////////////

var once = true;
var beginShowcase = false;
var index = 60;
var randomTunnel = -1;
var move150 = 0;
var stay = -1
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = canvas.height = 400;

var jsonobj = JSON.parse(content);
/////////////////////////////////

document.addEventListener("keydown",function(e) {keys[e.keyCode]=true});
document.addEventListener("keyup",function(e) {keys[e.keyCode]=false});
window.addEventListener("resize",windowResize);

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,2100);
	scene.add(camera);
	//camera.position.y = -450;
    camera.position.z = 400;
    //camera.rotation.x = 90 * (Math.PI / 180);
	
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0x000000,1);
	document.body.appendChild(renderer.domElement);
}

function createPlanes() {
	for(var k=0;k<=8;k++) {
		for(var i=-5;i<=5;i++) {
			for(var j=-5;j<=5;j++) {
				plane(i*300,j*300,k*200,60);
			}
		}
	}
}

function createCircle() {
	circle(0,0,4000);
}

function plane(x,y,z,num) {
	if(once == true) {
		once = false;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "#ff0000";
    	ctx.fillRect(0,0,canvas.width,canvas.height);
	    ctx.fillStyle = "#000000";
		ctx.font = 40+"px serif";
		var a = ctx.measureText(jsonobj.people[num].name).width;
		ctx.fillText(jsonobj.people[num].name,(400-a)/2,100);
		ctx.fillStyle = "#ffffff";
	    ctx.font = 30+"px serif";
		var b = "\""+jsonobj.people[num].about+"\"";
		for(var h=170,i=0,j=0;j<=b.length;j++) {
			if(ctx.measureText(b.slice(i,j)).width >= 350) {
				while(b[--j]!=' ');
				ctx.fillText(b.slice(i,j),(400-ctx.measureText(b.slice(i,j)).width)/2,h);
				h+=40;
				i=j+1;
				j=i+1;
			} else if(j>=b.length) {
				ctx.fillText(b.slice(i,j),(400-ctx.measureText(b.slice(i,j)).width)/2,h);
			}
		}
	}
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

	var materials = [new THREE.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:0.4,side:THREE.BackSide}),new THREE.MeshBasicMaterial({map:texture,side:THREE.FrontSide})];

	var geometry = new THREE.PlaneGeometry(100,100);
	for(var i=0, len=geometry.faces.length; i<len; i++) {
    	var face = geometry.faces[i].clone();
    	face.materialIndex = 1;
    	geometry.faces.push(face);
    	geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i].slice(0));
	}

	var plane = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

	plane.position.x += x;
	plane.position.y += y;
	plane.rotation.y += Math.PI;
	plane.position.z -= z;
   	//plane.ash = jsonobj.people[num].name; 
	plane.material.side = THREE.DoubleSide;	
	plane.overdraw = true;
	scene.add(plane);
	planes.push(plane);
}

function circle(x,y,z) {
	var geometry = new THREE.CircleGeometry(20,8);
	THREE.ImageUtils.crossOrigin = '';
	var texture = THREE.ImageUtils.loadTexture(jsonobj.people[60].url);
	var material = new THREE.MeshBasicMaterial({map:texture});
	var circle = new THREE.Mesh(geometry,material);
	circle.position.x += x;
	circle.position.y += y;
	circle.position.z -= z-1;

	circle.overdraw = true;
	scene.add(circle);
	//circles = [];
	circles.push(circle);
}

function interactCam() {
	if(keys[37]) {
		camera.position.x -= 10;
	}
	if(keys[38]) {
        camera.position.z -= 10;
    }
	if(keys[39]) {
        camera.position.x += 10;
    }
	if(keys[40]) {
        camera.position.z += 10;
    }
}

function addNewTextures(num) {
	//circle
	//num = num%jsonobj.people.length;
	var texture = THREE.ImageUtils.loadTexture(jsonobj.people[num].url);
	circles[0].material.map = texture;
	texture.needsUpdate = true;

	//planes
	ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = 40+"px serif";
    var a = ctx.measureText(jsonobj.people[num].name).width;
    ctx.fillText(jsonobj.people[num].name,(400-a)/2,100);
    ctx.fillStyle = "#ffffff";
    ctx.font = 30+"px serif";
    var b = "\""+jsonobj.people[num].about+"\"";
    for(var h=170,i=0,j=0;j<=b.length;j++) {
        if(ctx.measureText(b.slice(i,j)).width >= 350) {
            while(b[--j]!=' ');
            ctx.fillText(b.slice(i,j),(400-ctx.measureText(b.slice(i,j)).width)/2,h);
            h+=40;
            i=j+1;
            j=i+1;
        } else if(j>=b.length) {
            ctx.fillText(b.slice(i,j),(400-ctx.measureText(b.slice(i,j)).width)/2,h);
        }
    }
    var texture = new THREE.Texture(canvas);
	planes[num].material.materials[1].map = texture;
	texture.needsUpdate = true;
}

function spyCamRandomSelect() {
	index = parseInt(Math.random() * planes.length);
	randomTunnel = parseInt(Math.random() * 2);
	move150 = 150;
	addNewTextures(index);
	//createCircle(index);
}

function spyCamAnimate() {
	
	var x = Math.round(planes[index].position.x);
	var y = Math.round(planes[index].position.y);
	var z = Math.round(planes[index].position.z);
	var cx = Math.round(camera.position.x);
	var cy = Math.round(camera.position.y);
	var cz = Math.round(camera.position.z);
	
	if(move150>10) {
		move150 -= 10;
		if(randomTunnel==0) {
			cx -= 10;
		} else if(randomTunnel==1) {
			cx += 10;
		}
	} else if(move150!=0) {
        if(randomTunnel==0) {
            cx -= move150;
        } else if(randomTunnel==1) {
            cx += move150;
        }
		move150 = 0;
    } else if(cz-z>160) {
		cz -= 10;
	} else if(cz-z<140) {
		cz += 10;
	} else if(cz!=z+150) {
		cz = z+150;
	} else if(cy-y>10) {
        cy -= 10;
    } else if(y-cy>10) {
        cy += 10;
    } else if(y!=cy) {
        cy = y;
    } else if(cx-x>10) {
        cx -= 10;
    } else if(x-cx>10) {
        cx += 10;
    } else if(x!=cx) {
        cx = x;
    } else if(planes[index].rotation.y > 0.05 && stay==-1) {
		planes[index].rotation.y -= 0.05;
	} else if(planes[index].rotation.y != 0 && stay==-1) {
		planes[index].rotation.y = 0;
		stay = 0;
		circles[0].position.z = z-1;
		circles[0].position.y = y;
		circles[0].position.x = x;
	} else if(circles[0].position.y < y+50 && stay==0) {
		circles[0].position.y += 5;
	} else if(circles[0].position.y != y+60 && stay==0) {
		circles[0].position.y = y+60;
		circles[0].position.z = z+1;
	} else if(stay != 100) {
		stay++;
	} else if(circles[0].position.y > y) {
		circles[0].position.z = z-1;
        circles[0].position.y -= 5;
    } else if(circles[0].position.z != 4000) {
        circles[0].position.z = 4000;
    } else if(planes[index].rotation.y < (Math.PI-0.05)) {
		planes[index].rotation.y += 0.05;
	} else if(planes[index].rotation.y != Math.PI) {
		planes[index].rotation.y = Math.PI;
		spyCamRandomSelect();
        stay = -1;
	}
	
	camera.position.x = cx;
	camera.position.y = cy;
	camera.position.z = cz;
}

function render() {
	requestAnimationFrame(render);
	//plane.rotation.z += 0.01;
	//interactCam();
	if(beginShowcase == true) {
		spyCamAnimate();
	}
	//for(var i=0;i<planes.length;i++) {
		//planes[i].rotation.y += 0.05;
	//}
	renderer.render(scene,camera);
}

function windowResize() {
	renderer.setSize(window.innerWidth,window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
}

init();
createPlanes();
createCircle();
spyCamRandomSelect();
render();
//setTimeout(function() {console.log("1"); beginShowcase = true;},1000);
