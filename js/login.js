/* =========================================================
   FILE: /js/login.js
   PURPOSE: Login logic using Supabase
   REQUIREMENTS:
   - Supabase project connected
   - This file is loaded in login.html
========================================================= */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* =====================
   SUPABASE INIT
===================== */
const supabaseUrl = "https://<YOUR_PROJECT_ID>.supabase.co"; // Replace with your Supabase project URL
const supabaseKey = "<YOUR_PUBLIC_ANON_KEY>"; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseKey);

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login successful");
  window.location.href = "index.html";
}

/* =====================
   EXPORT TO WINDOW
===================== */
window.loginUser = loginUser;
