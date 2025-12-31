// js/profile.js
import { supabase } from "./supabaseClient.js";

// Load the current user's profile when the page loads
async function loadProfile() {
  try {
    const user = supabase.auth.getUser(); // gets the current session user
    const { data: { user: currentUser }, error: userError } = await user;

    if (userError) throw new Error(userError.message);
    if (!currentUser) {
      alert("No logged-in user found. Please log in.");
      window.location.href = "/login.html";
      return;
    }

    // Fetch profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    // Populate fields
    document.getElementById("username").value = profileData.username || "";
    document.getElementById("full-name").value = profileData.full_name || "";
    document.getElementById("email").value = profileData.email || "";
    document.getElementById("dob").value = profileData.dob || "";

  } catch (err) {
    console.error("Error loading profile:", err);
    alert(err.message || "Failed to load profile.");
  }
}

// Update the logged-in user's profile
export async function updateProfile() {
  try {
    const user = supabase.auth.getUser();
    const { data: { user: currentUser }, error: userError } = await user;

    if (userError) throw new Error(userError.message);
    if (!currentUser) {
      alert("No logged-in user found. Please log in.");
      window.location.href = "/login.html";
      return;
    }

    const username = document.getElementById("username")?.value.trim();
    const fullName = document.getElementById("full-name")?.value.trim();
    const dob = document.getElementById("dob")?.value;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        full_name: fullName,
        dob: dob || null
      })
      .eq("id", currentUser.id);

    if (updateError) throw new Error(updateError.message);

    alert("Profile updated successfully!");

  } catch (err) {
    console.error("Profile update error:", err);
    alert(err.message || "Failed to update profile.");
  }
}

// Log out the user
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    window.location.href = "/login.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert(err.message || "Failed to log out.");
  }
}

// Expose to global scope for HTML buttons
window.updateProfile = updateProfile;
window.logout = logout;

// Load profile on page load
window.addEventListener("DOMContentLoaded", loadProfile);
