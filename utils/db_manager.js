import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

var url = "https://vusnehluabjnecixaoee.supabase.co"
var anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1c25laGx1YWJqbmVjaXhhb2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjQ1OTIsImV4cCI6MjA3NjUwMDU5Mn0.ZJ0rxiMM5CqSvE7WypjJxm-ySeHv7zqKkU2YR6T6xQw'

const supabase = createClient(url, anon)

const getID = () => localStorage.getItem("player_id");

const getDataConsent = () => localStorage.getItem("data_consent") === "yes";

export async function generateProfile(name, hand) {
    if (!getDataConsent())
        return;
    //If a profile was already created
    if (getID()) {
        const { data, error } = await supabase
            .from('User Data')
            .select('id')
            .eq('id', getID())
            .maybeSingle();

        if (error) {
            console.error(error);
            return;
        }
        if (data)//If the row already exists
            return;
    }

    const { data, error } = await supabase.from('User Data').insert([{ name: name, hand: hand }]).select()

    localStorage.setItem("player_id", data[0].id);

    if (error)
        console.error(error)
}

let updateQueue = Promise.resolve();

export function queueUpdateGameData(AILevel, move) {
    updateQueue = updateQueue
        .then(() => updateGameData(AILevel, move))
        .catch(err => {
            console.error('Update failed:', err);
        });
    return updateQueue;
}

export async function updateGameData(AILevel, move) {
    if (!getDataConsent())
        return;
    
    let level = `game_${AILevel}`;

    const { data, error } = await supabase
        .from('User Data')
        .select(level)
        .eq('id', getID())
        .single();

    if (error) {
        console.error(error);
        return;
    }

    const newValue = (data[level] || '') + move;

    const { data: updatedData, error: updateError } = await supabase
        .from('User Data')
        .update({ [level]: newValue })
        .eq('id', getID());

    if (updateError)
        console.error(updateError);
}

export async function logGameData(AILevel) {
    let level = `game_${AILevel}`;

    const { data, error } = await supabase
        .from('User Data')
        .select(level)
        .eq('id', getID())
        .single();

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
}

export async function logById(id) {
    const { data, error } = await supabase
        .from('User Data')
        .select('*')
        .eq('id', id)
        .select('*')
        .single();

    if (error)
        console.error(error)

    console.log(data)
}

export async function logAll() {
    const { data, error } = await supabase.from('User Data').select('*');

    console.log(data)
}

export async function logStuff() {
    showStatistics(1, true) 
}

//DATA ANALYSIS FUNCTIONS
export async function getTotalUsers() {
    const { count, error } = await supabase
        .from('User Data')
        .select('*', { count: 'exact', head: true }); // head=true avoids fetching all rows

    if (error) {
        console.error(error);
        return 0;
    }

    return count ?? 0;
}

export async function getData() {
    const { data, error } = await supabase
        .from('User Data')
        .select('*');

    if (error) {
        console.error(error)
        return "";
    }
    
    return data
}

export async function getDataById(id) {
    const { data, error } = await supabase
        .from('User Data')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error)
        return "";
    }
    
    return data
}

export function jocuriJucate(game) {
    let g = String(game)

    return (g.match(/0/g) || []).length
}

export function jocuriCastigate(game) {
    let g = String(game)

    return (g.match(/W/g) || []).length
}
export function jocuriPierdute(game) {
    let g = String(game)

    return (g.match(/L/g) || []).length
}
export function jocuriEgal(game) {
    let g = String(game)

    return (g.match(/E/g) || []).length
}

export function firstMove(game, i) {
    let g = String(game)
    
    return (g.match(new RegExp(`0${i}`, 'g')) || []).length;
}

export function secondMove(game, i) {
    return String(game).split('0').filter(Boolean).filter(g => g.length > 1 && g[2] == i).length;
}

export async function showStatistics(level, rightHanded) {
    let max = 0;    
    let secondMax = 0;
    let maxId;
    let ctHandUsers = 0;
    let totalGames = 0;
    let gamesLost = 0;
    let gamesWon = 0;
    let gamesEqual = 0;
    let firstMovesFrequency = new Array(10).fill(0);
    let secondMovesFrequency = new Array(10).fill(0);

    let totalUsers = await getTotalUsers();
    let data = (await getData());

    for(let i = 0; i < totalUsers; i++) {
        if(data[i].hand == "Dreapta" && rightHanded == false) 
            continue;
        if(data[i].hand == "Stanga" && rightHanded == true)
            continue;
        if(data[i][`game_${level}`] == null)
            continue;

        let joc = data[i][`game_${level}`]
        let games = jocuriJucate(joc);
        gamesWon += jocuriCastigate(joc);
        gamesLost += jocuriPierdute(joc);
        gamesEqual += jocuriEgal(joc);

        for(let j = 1; j <= 9; j++) {
            firstMovesFrequency[j] += firstMove(joc, j)
            secondMovesFrequency[j] += secondMove(joc, j)
        }
        ctHandUsers++;
        totalGames += games;
        
        if (games > max) {
            secondMax = max;
            max = games;
            maxId = i;
        }
        else if (games > secondMax)
            secondMax = games;
    }
    
    if(rightHanded)
        console.log("\n\nSUBIECTI CU MANA DREAPTA - " + ctHandUsers + ", LEVEL - " + level)
    else
        console.log("SUBIECTI CU MANA STANGA - " + ctHandUsers + ", LEVEL - " + level)

    // console.log("MAx + ", data[maxId].name)
    
    console.log("Total Games - " + totalGames)
    console.log("Games Lost - " + gamesLost)
    console.log("Games facut egal - " + gamesEqual)    
    console.log("Games won - " + gamesWon)
    console.log("Max games played - " + max)
    console.log("Second Max games played - " + secondMax)
    
    console.log("FIRST MOVE FREQUENCY")
    for(let i = 1; i <= 9; i++)
        console.log(i + " - " + firstMovesFrequency[i])//to avarage kinda / totalGames * 10)

    console.log("SECOND MOVE FREQUENCY")
    for(let i = 1; i <= 9; i++)
        console.log(i + " - " + secondMovesFrequency[i])//to avarage kinda / totalGames * 10)
}