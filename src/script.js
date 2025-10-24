import * as DB from '../utils/db_manager.js';

document.getElementById('Submit').addEventListener('click', submit);

var Nume= document.getElementById ("Nume")
var ManaS= document.getElementById ("mana-stanga")
var ManaD= document.getElementById ("mana-dreapta")

function submit() {
    if (Nume.value == "")
        return;

    if(ManaS.checked)
        DB.sendPersonalData(Nume.value, "Stanga")
    if(ManaD.checked)
        DB.sendPersonalData(Nume.value, "Dreapta")

    location.href="../joc/game.html"
}
