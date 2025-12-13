/* =========================================================
   FILE: /js/auth.js
   PURPOSE: Instagram-style multi-step signup logic
   REQUIREMENTS:
   - Supabase project connected
   - profiles table exists
   - This file is loaded in login.html
========================================================= */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* =====================
   SUPABASE INIT
===================== */
/* REPLACE THESE WITH YOUR ACTUAL VALUES */
const supabaseUrl = "https://YOUR_SUPABASE_PROJECT_URL.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

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
    /* =====================
       CHECK EMAIL
    ===================== */
    const { data: emailExists, error: emailError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailError) throw emailError;
    if (emailExists) {
      alert("Email already in use");
      return;
    }

    /* =====================
       CHECK USERNAME
    ===================== */
    const { data: usernameExists, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (usernameError) throw usernameError;
    if (usernameExists) {
      alert("Username already taken");
      return;
    }

    /* =====================
       CREATE AUTH USER
    ===================== */
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    /* =====================
       INSERT PROFILE
    ===================== */
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        username,
        full_name: fullName,
        dob,
      });

    if (profileError) throw profileError;

    alert("Account created successfully");
    // redirect to homepage or login page
    window.location.href = "index.html";

  } catch (err) {
    alert(err.message || "Something went wrong");
  }
}

/* =====================
   EXPORT TO WINDOW
===================== */
window.signupUser = signupUser;
