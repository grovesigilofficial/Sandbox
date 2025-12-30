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
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });
    if (authError) throw authError;

    // Insert user profile into your table
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
      "Account created successfully! ✅ Check your email to confirm your account."
    );
    window.location.href = "index.html";
  } catch (err) {
    console.error("Signup error:", err);
    alert(
      "Something went wrong during signup. If you already tried signing up, check your email."
    );
  }
}

window.signupUser = signupUser;
