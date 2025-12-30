x// js/profile.js
import { supabase } from "./supabaseClient.js";

export async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName || !dob) {
    alert("All fields are required to create an account.");
    return;
  }

  try {
    // Sign up user in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    if (!authData.user) {
      alert("Account creation failed unexpectedly.");
      return;
    }

    // Insert user profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        dob,
      });
    if (profileError) throw profileError;

    alert(
      "🎉 Your account has been successfully created! Please check your email to confirm your account before logging in."
    );

    // Reset signup form if exists
    document.getElementById("signup-container")?.reset?.();
  } catch (err) {
    console.error("Signup error:", err);
    alert(
      err.message ||
        "There was an error creating your account. Please try again or check your input."
    );
  }
}

// Expose globally for onclick
window.signupUser = signupUser;

