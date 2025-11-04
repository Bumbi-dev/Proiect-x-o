import * as DB from '../utils/db_manager.js';

document.getElementById('Submit').addEventListener('click', submit);

var Nume = document.getElementById("Nume")
var ManaS = document.getElementById("mana-stanga")
var ManaD = document.getElementById("mana-dreapta")

async function submit() {
	if (Nume.value == "" || (!ManaD.checked && !ManaS.checked))
		return;//TODO afisare casuta nume cu rosu

	if (ManaS.checked)
		await DB.generateProfile(Nume.value, "Stanga")
	if (ManaD.checked)
		await DB.generateProfile(Nume.value, "Dreapta")

	location.href = "../joc/game.html"
}

document.getElementById("accept").addEventListener("click", onAccept);
document.getElementById("reject").addEventListener("click", onReject);

function onAccept() {
    localStorage.setItem("data_consent", "yes");
	document.getElementById("blur").style.display = "none";
}
function onReject() {
	document.getElementById("blur").style.display = "none";
}

if(localStorage.getItem("data_consent") !== "yes") {
	document.getElementById("blur").style.display = "block";
}

// BOUNCING ANIMATION
const bouncers = [
	{ el: document.getElementById('bouncerX'), x: 100, y: 100, dx: 3, dy: 3 },
	{ el: document.getElementById('bouncerO'), x: 300, y: 200, dx: 2, dy: 2 }
];

function animateBouncers() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	bouncers.forEach(obj => {
		const rect = obj.el.getBoundingClientRect();

		obj.x += obj.dx;
		obj.y += obj.dy;

		const padding = 2;


		if (obj.x + rect.width >= width - padding) {
			obj.x = width - rect.width - padding;
			obj.dx *= -1;
		}
		if (obj.x <= padding) {
			obj.x = padding;
			obj.dx *= -1;
		}


		if (obj.y + rect.height >= height - padding) {
			obj.y = height - rect.height - padding;
			obj.dy *= -1;
		}
		if (obj.y <= padding) {
			obj.y = padding;
			obj.dy *= -1;
		}

		obj.el.style.left = obj.x + 'px';
		obj.el.style.top = obj.y + 'px';
	});

	requestAnimationFrame(animateBouncers);
}

animateBouncers();

window.onload = function () {
	const bg = document.querySelector('.scrolling-bg');
	let x = 0;
	const totalWidth = window.innerWidth;
	const speed = 1;

	function animateBG() {
		x -= speed;
		if (x <= -totalWidth) x = 0;
		bg.style.transform = `translateX(${x}px)`;
		requestAnimationFrame(animateBG);
	}

	animateBG();
};

