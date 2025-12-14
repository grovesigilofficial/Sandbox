// js/login.js
/* =========================================================
   FILE: /js/login.js
   PURPOSE: Login logic using Supabase
   REQUIREMENTS:
   - Supabase project connected
   - This file is loaded in login.html
========================================================= */

import { supabase } from "./supabaseClient.js";

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

window.loginUser = loginUser;
