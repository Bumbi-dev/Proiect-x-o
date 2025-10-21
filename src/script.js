import * as DB from '../utils/db_manager.js';
document.getElementById('btnlogin').addEventListener('click', submit);

var Nume= document.getElementById ("Nume")

var ManaS= document.getElementById ("mana-stanga")

var ManaD= document.getElementById ("mana-dreapta")



function submit() {
    if(ManaS.isChecked)
    {
        DB.sendPersonalData(Nume.value, "Stanga")
    }
    if(ManaD.isChecked)
    {
        DB.sendPersonalData(Nume.value, "Dreapta")
    }

    location.href="../joc/game.html"
    
}
