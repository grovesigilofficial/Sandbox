// js/auth.js
/* =========================================================
   FILE: /js/auth.js
   PURPOSE: Instagram-style multi-step signup logic
   REQUIREMENTS:
   - Supabase project connected
   - profiles table exists
   - This file is loaded in login.html
========================================================= */

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
    const { data: emailExists } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single()
      .catch(() => null); // Returns null if no row

    if (emailExists) {
      alert("Email already in use");
      return;
    }

    const { data: usernameExists } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .limit(1)
      .single()
      .catch(() => null); // Returns null if no row

    if (usernameExists) {
      alert("Username already taken");
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    const userId = authData.user.id;

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
    window.location.href = "index.html";

  } catch (err) {
    alert(err.message || "Something went wrong");
  }
}

window.signupUser = signupUser;
