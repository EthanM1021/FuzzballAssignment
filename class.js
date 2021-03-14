"use strict";
	
class c_ground {
	constructor(x, y, width, height, label) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0.20,
			density: 0.99,
			label: 'Ground',
			collisionfilter: {
				category: notinteractable, //Mouse can't interact with the ground.
			}
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);

		Matter.World.add(world, this.body);
		// this.body.isStatic = true;
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body;
	}

	destroy() {
		Matter.World.remove(world, this.body) 
	}

	show() {
		const pos = this.body.position;
		noStroke();
		fill('rgba(200, 54, 54, 0)');
		rectMode(CENTER); //switch centre to be centre rather than left, top
		rect(pos.x, pos.y, this.width, this.height);
	}
}

class c_crate {
	constructor(x, y, width, height, label) {
		let options = {
			restitution: 0.99,
			friction: 0.030,
			density: 0.99,
			frictionAir: 0.032,
			label: 'Crate',
			collisionFilter: {
				category: notinteractable
			}
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.image = loadImage('./img/newcrate.png')
	}

	body() {
		return this.body;
	}

	destroy() {
		Matter.World.remove(world, this.body) 
	}

	show() {
		const pos = this.body.position;
		const angle = this.body.angle;

		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
			noStroke();
			imageMode(CENTER)
			image(this.image, 0, 0, this.width, this.height)
			// rectMode(CENTER); //switch centre to be centre rather than left, top
			// rect(0, 0, this.width, this.height);
		pop();
	}
}



		
class c_fuzzball {
	constructor(x, y, diameter, label) {
		let options = {
			restitution: 0.90,
			friction: 0.005,
			density: 0.95,
			frictionAir: 0.005,
			label: 'Fuzzball',
			collisionFilter: { //used with mouse constraints to allow/not allow iteration
				category: interactable,
			}
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
		this.image = loadImage('./img/fuzzball.png')
	}

	body() {
		return this.body;
	}

	//dont forget bodies are added to the matter world meaning even if not visible the physics engine still manages it
	remove() {
		Matter.World.remove(world, this.body);
	}

	show() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
			fill('#00aa00');
			imageMode(CENTER)
			image(this.image, 0, 0, this.width, this.height)
			// ellipseMode(CENTER); //switch centre to be centre rather than left, top
			// circle(0, 0, this.diameter);
		pop();
	}	
}


class c_launcher {
	constructor(x, y, body) {
		//see docs on https://brm.io/matter-js/docs/classes/Constraint.html#properties
		// console.log(body)
		let options = {
			pointA: {
				x: x,
				y: y
			},
			bodyB: body,
			stiffness: 0.10,
			length: 20,
			collisionFilter: {
				category: notinteractable
			}
		}
		this.image = loadImage('./img/launcher.png')
		//create the contraint 
		// console.log(options.bodyB)
		this.launch = Matter.Constraint.create(options);
		Matter.World.add(world, this.launch); //add to the matter world
	}

	release() {
		//release the constrained body by setting it to null
		this.launch.bodyB = null;
		// Matter.World.remove(world, this.launch)
	}

	attach(body) {
		//attach the specified object as a constrained body
		this.launch.bodyB = body;
	}	

	show() {
		//check to see if there is an active body
		if(this.launch.bodyB) {
			let posA = this.launch.pointA; //create an shortcut alias 
			let posB = this.launch.bodyB.position;
			stroke('rgba(200, 54, 54, 0.6)'); //set a colour
			fill('rgba(254, 0, 0, 0.3)')
			// imageMode(CENTER)
			image(this.image, 50, 450, this.width, this.height)		
			line(posA.x, posA.y, posB.x, posB.y); //draw a line between the two points
		}
	}
}
