import * as DB from '../utils/db_manager.js';

document.getElementById('Submit').addEventListener('click', submit);

var Nume= document.getElementById ("Nume")
var ManaS= document.getElementById ("mana-stanga")
var ManaD= document.getElementById ("mana-dreapta")

function submit() {
    if (Nume.value == "")
        return;//TODO afisare casuta nume cu rosu

    if(ManaS.checked)
        DB.generateProfile(Nume.value, "Stanga")
    if(ManaD.checked)
        DB.generateProfile(Nume.value, "Dreapta")

    location.href="../joc/game.html"
}

const bouncers = [
  {el: document.getElementById('bouncerX'), x: 100, y: 100, dx: 3, dy: 3},
  {el: document.getElementById('bouncerO'), x: 300, y: 200, dx: 2, dy: 2}
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
