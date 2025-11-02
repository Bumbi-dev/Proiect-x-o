import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

//TODO change these to environment variables in render
var url = "db_url"
var anon = "anon_key"

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