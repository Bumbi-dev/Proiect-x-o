//TODO encode cells ticked to an int ex 0102012 or 1020120, 0 delimiteaza numarul 
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

var url = "https://vusnehluabjnecixaoee.supabase.co"
var anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1c25laGx1YWJqbmVjaXhhb2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjQ1OTIsImV4cCI6MjA3NjUwMDU5Mn0.ZJ0rxiMM5CqSvE7WypjJxm-ySeHv7zqKkU2YR6T6xQw'

const supabase = createClient(url, anon)

var id;//unique key

export async function logAll() {
    const { data, error } = await supabase.from('User Data').select('*');

    console.log(data)
}

export async function logById(id) {
    const { data, error } = await supabase
        .from('User Data')
        .eq('id', 1)
        .select('*')
        .single();

    if (error)
        console.error(error)

    console.log(data)
}

export async function updateNameById(id, name) {
    const { data, error } = await supabase
        .from('User Data')
        .update({name: name})
        .eq('id', 1)
        .single();

    if (error)
        console.error(error)
}

export async function sendPersonalData(name, hand) {
    const { data, error } = await supabase.from('User Data').insert([{ name: name, hand: hand }]).select()

    if (error)
        console.error(error)

    id = data.id;
}

//TODO update the entry using id
export async function updateGameData(name, hand) {
    const { data, error } = await supabase.from('User Data').select('*')

    if (error)
        console.error(error)
}