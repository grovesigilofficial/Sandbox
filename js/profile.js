import { supabase } from "./supabaseClient.js";

const usernameInput = document.getElementById("username");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");

async function loadProfile() {
  const user = supabase.auth.user();
  if (!user) {
    alert("Not logged in");
    window.location.href = "index.html";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username, full_name, email, dob")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error loading profile:", error);
    return alert("Failed to load profile");
  }

  usernameInput.value = data.username || "";
  fullNameInput.value = data.full_name || "";
  emailInput.value = data.email || "";
  dobInput.value = data.dob || "";
}

async function updateProfile() {
  const user = supabase.auth.user();
  if (!user) return alert("Not logged in");

  const updates = {
    username: usernameInput.value.trim(),
    full_name: fullNameInput.value.trim(),
    dob: dobInput.value
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return alert("Failed to update profile");
  }

  alert("Profile updated successfully!");
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Load profile on page load
loadProfile();
