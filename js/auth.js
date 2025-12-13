/* ================================
   FILE: /js/auth.js
   PURPOSE: Signup logic (Instagram-style)
   ================================ */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ---------- SUPABASE SETUP ---------- */
/* Replace these with your actual values */
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------- SIGNUP FUNCTION ---------- */
/* Called when user finishes multi-step signup */
async function signupUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value.trim();
  const full_name = document.getElementById("full-name").value.trim();
  const dob = document.getElementById("dob").value;

  if (!email || !password || !username || !full_name || !dob) {
    alert("All fields are required");
    return;
  }

  /* 1. Check if email already exists */
  const { data: emailExists, error: emailError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (emailError) {
    alert(emailError.message);
    return;
  }

  if (emailExists.length > 0) {
    alert("Email already in use");
    return;
  }

  /* 2. Check if username already exists */
  const { data: usernameExists, error: usernameError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (usernameError) {
    alert(usernameError.message);
    return;
  }

  if (usernameExists.length > 0) {
    alert("Username already taken");
    return;
  }

  /* 3. Create Supabase Auth user */
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email,
      password
    });

  if (authError) {
    alert(authError.message);
    return;
  }

  /* 4. Insert into profiles table
     IMPORTANT: id MUST equal auth user id */
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: authData.user.id,
      email,
      username,
      full_name,
      dob
    });

  if (profileError) {
    alert(profileError.message);
    return;
  }

  alert("Signup successful");
  window.location.href = "index.html";
}

/* ---------- EXPORT (OPTIONAL) ---------- */
/* Only needed if you use modules elsewhere */
window.signupUser = signupUser;
