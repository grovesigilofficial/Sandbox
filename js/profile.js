// js/profile.js
import { supabase } from "./supabaseClient.js";

const usernameInput = document.getElementById("username");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");

async function loadProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username, full_name, email, dob")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return;

  usernameInput.value = data.username || "";
  fullNameInput.value = data.full_name || "";
  emailInput.value = data.email || "";
  dobInput.value = data.dob || "";
}

async function updateProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const updates = {
    username: usernameInput.value.trim(),
    full_name: fullNameInput.value.trim(),
    dob: dobInput.value || null,
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profile updated");
}

window.updateProfile = updateProfile;

loadProfile();
