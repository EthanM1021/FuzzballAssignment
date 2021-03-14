/* 
	Comment line 160
	
*/

	
"use strict";

const fuzzballAmount = document.getElementById('amount') // Gets the element for the amount of fuzzballs
let amountOfFuzzballs = 3 // Sets the amount of fuzzballs you have
fuzzballAmount.innerHTML = amountOfFuzzballs + ' fuzzballs left' // gets current amount of fuzzballs and appends a string onto the end
let Userscore = document.getElementById('status')

let vp_width = 920, vp_height = 690; // setting viewports
let world, engine, body; // declaring variables
engine = Matter.Engine.create(); // creates matter engine
world = engine.world;
body = Matter.Body;
let playerScore = 0; // player starts at 0 score until hits objects

let song, bg, crate1, ground, leftwall, rightwall, fuzzball, launcher, elastic_constraint, crates = [], MAX_LENGTH = 4, FUZZBALL_X, FUZZBALL_Y, firstTime = true, reset = true;	
let notinteractable = 0x0001, interactable = 0x0002;
// Declaring a whole bunch of variables


function get_random(min, max) { // gets a random number between min and max values
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); 
}

function preload() { // do everything in this function before showing game
	song = loadSound('./sound/AmbientLoop.mp3'); //Loads sound for the game
}

function score(points) { // function to track users score
	let effectspeed = 60;
	let animatespeed = 500;

	$("#scoreboard").finish();
	// document.getElementById('points').innerHTML = "+" + points;
	$('#scoreboard').removeAttr('style'); //remove any applied styles
	$("#scoreboard").fadeIn(effectspeed, function() {
		$("#scoreboard").animate({
			top: '+=50px',
			opacity: 0
		}, animatespeed);
	});

	playerScore += points;
	document.getElementById('status').innerHTML = "Score: " + playerScore;
}

function setup() {
	bg = loadImage('./img/background.png') // background image file being loaded
	frameRate(60); // the framerate set to 60fps.
	let viewport = createCanvas(vp_width, vp_height); // creates the games 'screen'
	viewport.parent("viewport_container"); // sets up a parent container for the viewport to sit inside

	let vp_mouse = Matter.Mouse.create(viewport.elt); // enable the 'matter' mouse controller and attach it to the viewport object using P5s elt property
	let options = {
		mouse: vp_mouse,
		collisionFilter: {
			mask: interactable // specify the collision category
		}
	}

	elastic_constraint = Matter.MouseConstraint.create(engine, options); // creates the elastic constraint
	Matter.World.add(world, elastic_constraint); // adds the elastic constraint to the world

	positionAssets(); // gets called when reset button gets clicked
	firstTime = false // flag to help with the position assets function


	Matter.Events.on(engine, 'collisionEnd', collisions); // adds the collisions between objects which calls the collisions function
}

function positionAssets() { // gets triggered when reset gets clicked	
	Userscore.innerHTML = 'Score: 0'
	fuzzballAmount.innerHTML = '3 fuzzballs left'
	for (let i = 0; i < MAX_LENGTH; i++) {
		if (firstTime === false) { crates[i].destroy(); } // if any crates are in the world, destroy, loops through again and creates crates
		crates[i] = new c_crate(800, get_random(0, 400), 80, 80);
	}
	if (firstTime === false) {
		console.log('reset button has been pressed')
		fuzzball.remove() // removes the fuzzball from the world
		fuzzball = new c_fuzzball(150, 495, 60);
		launcher = new c_launcher(150, 495, fuzzball.body);
	} else {
		fuzzball = new c_fuzzball(150, 495, 60)
		launcher = new c_launcher(150, 495, fuzzball.body);
	}

	ground = new c_ground(vp_width/2, vp_height-10, vp_width, 96);
	leftwall = new c_ground(0, vp_height/2, 5, vp_height);
	rightwall = new c_ground(vp_width, vp_height/2, 5, vp_height); 
	reset = true
}

function paint_assets() { // shows the crates, launcher and fuzzball aka assets
	for (let i = 0; i < MAX_LENGTH; i++) {
		crates[i].show()
	}
	fuzzball.show();
	launcher.show();
}

function playStopAudio() { //Help to loop the mp3 file
	if (song.isPlaying()) {
		song.stop();
	} song.play() 
}

function draw() { // draws everything into our canvas
	background(bg);
	Matter.Engine.update(engine);
	paint_assets();
	paint_background()

	Matter.Engine.update(engine);

	if(elastic_constraint.body !== null) {
		let pos = elastic_constraint.body.position;	
		ellipse(pos.x, pos.y, 20, 20); //?????????????????????????????????????????????????????????????

		let mouse = elastic_constraint.mouse.position;
		line(pos.x, pos.y, mouse.x, mouse.y); //Connects fuzzball and launcher
	}
}

function collisions(event) {
	//runs as part of the matter engine after the engine update, provides access to a list of all pairs that have ended collision in the current frame (if any)

	event.pairs.forEach((collide) => {
		// console.log(collide.bodyA.label + " - " + collide.bodyB.label);

		if( 
			(collide.bodyA.label == "Fuzzball" && collide.bodyB.label == "Crate") ||
			(collide.bodyA.label == "Crate" && collide.bodyB.label == "Fuzzball")
		) {
			console.log("interesting collision");
			score(100);
		}

	});
}


function paint_background() {// Presents the ground, leftwall and rightwall show functions.
	ground.show();
	leftwall.show();
	rightwall.show();
}	

function turnOver() { //  happens after x amount of seconds to go the users next turn
	reset = true
	setTimeout(() => {
		console.log(reset)
		console.log('turnover func')
		amountOfFuzzballs - 1 // decrements the users fuzzballs by 1 after every turn
		for (let i = 0; i < MAX_LENGTH; i++) {
			if (firstTime === false) { crates[i].destroy(); } // if any crates are in the world, destroy, loops through again and creates crates
			crates[i] = new c_crate(800, get_random(0, 400), 80, 80);
		}
		fuzzball = new c_fuzzball(150, 495, 60)
		launcher = new c_launcher(150, 495, fuzzball.body);
	}, 8000)
}

function mouseReleased() { // gets triggered when the user lifts their mouse button up after clicking
	console.log('mouse released')
	if (reset == true) {
		setTimeout(() => {
			launcher.release();	
			fuzzballAmount.innerHTML = `${amountOfFuzzballs - 1} Fuzzballs left`
			turnOver()
			reset = false
		}, 30);
	}
	if (reset == false) {
		setTimeout(() => {
			positionAssets()
		}, 60)
	}
}