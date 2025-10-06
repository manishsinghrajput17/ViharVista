// src/api/destinations.js
import { supabase } from "../supabaseClient";

export async function fetchDestinations() {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
  return data;
}

export async function fetchDestinationById(id) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching destination:", error);
    return null;
  }
  return data;
}

// Admin functions (optional)
export async function createDestination(payload) {
  const { data, error } = await supabase.from("destinations").insert([payload]).select().single();
  if (error) throw error;
  return data;
} 
