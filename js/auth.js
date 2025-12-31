// js/auth.js
import { supabase } from "./supabaseClient.js";

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
    // ✅ Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: fullName } // Pass metadata for trigger
      }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Failed to create user account.");

    // ✅ Success alert
    alert("Your account was created successfully! Check your email to confirm it.");

    // Reset form
    const form = document.getElementById("signup-container");
    if (form?.reset) form.reset();

  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed. Please try again.");
  }
}

window.signupUser = signupUser;
