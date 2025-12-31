// js/auth.js
import { supabase } from "./supabaseClient.js";

// ---------------------- SIGNUP ----------------------
export async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName) {
    alert("All fields are required.");
    return;
  }

  try {
    // 1️⃣ Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw new Error("Auth signup failed: " + authError.message);
    if (!authData.user || !authData.user.id) throw new Error("Failed to create user account.");

    // 2️⃣ Insert profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        dob: dob || null
      });

    if (profileError) throw new Error("Profile creation failed: " + profileError.message);

    alert("Your account was created successfully! Check your email to confirm your account.");

    // Reset form if present
    const form = document.getElementById("signup-container");
    if (form?.reset) form.reset();

  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed. Please try again.");
  }
}

// ---------------------- LOGIN ----------------------
export async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Both email and password are required.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed. Check your credentials.");

    alert(`Welcome back, ${data.user.email}!`);
    // Redirect to profile page after login
    window.location.href = "/profile.html";

  } catch (err) {
    console.error("Login error:", err);
    alert(err.message || "Login failed. Please try again.");
  }
}

// Expose functions to global scope for HTML buttons
window.signupUser = signupUser;
window.loginUser = loginUser;
