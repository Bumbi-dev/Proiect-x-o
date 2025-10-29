import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

//TODO change these to environment variables in render
var url = "https://vusnehluabjnecixaoee.supabase.co"
var anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1c25laGx1YWJqbmVjaXhhb2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjQ1OTIsImV4cCI6MjA3NjUwMDU5Mn0.ZJ0rxiMM5CqSvE7WypjJxm-ySeHv7zqKkU2YR6T6xQw'

const supabase = createClient(url, anon)

const getID = () => localStorage.getItem("player_id");

export async function logAll() {
    const { data, error } = await supabase.from('User Data').select('*');

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

export async function updateName(name) {
    const { data, error } = await supabase
        .from('User Data')
        .update({name: name})
        .eq('id', getID())
        .single();

    if (error)
        console.error(error)
}

export async function generateProfile(name, hand) {
    if(!getID()) {
        const { data, error } = await supabase.from('User Data').insert([{ name: name, hand: hand }]).select()
        console.log(getID())
    
        localStorage.setItem("player_id", data[0].id);

        if (error)
            console.error(error)
    }
}

export async function logGameData() {
    const { data, error } = await supabase.from('User Data').select('*')

    console.log(getID())

    if (error)
        console.error(error)
}

export async function updateGameData(AILevel, move) {
    const { data, error } = await supabase.from('User Data').select('*')

    
    if (error)
        console.error(error)
}