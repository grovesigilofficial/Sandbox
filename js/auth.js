// js/auth.js
import { supabase } from "./supabaseClient.js";

/* =====================
   SIGNUP HANDLER
===================== */
async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName || !dob) {
    alert("All fields are required");
    return;
  }

  try {
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp(
      { email, password },
      { data: { username, full_name: fullName, dob } } // store custom user_metadata
    );
    if (authError) throw authError;

    // Insert profile into "profiles" table
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

    alert("Account created! Check your email to confirm your account.");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed");
  }
}

/* =====================
   LOGIN HANDLER
===================== */
async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    alert("Login successful!");
    window.location.href = "dashboard.html"; // redirect to dashboard
  } catch (err) {
    console.error("Login error:", err);
    alert(err.message || "Login failed");
  }
}

// Expose functions to window
window.signupUser = signupUser;
window.loginUser = loginUser;
