// js/profile.js
import { supabase } from "./supabaseClient.js";

export async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName || !dob) {
    alert("All fields are required.");
    return;
  }

  try {
    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password
      });

    if (authError) {
      alert(authError.message);
      return;
    }

    if (!authData?.user?.id) {
      alert("User was not created.");
      return;
    }

    // Insert profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        dob
      });

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert(
      "Account created successfully. Please check your email to confirm your account."
    );

    const form = document.getElementById("signup-container");
    if (form?.reset) form.reset();

  } catch (err) {
    alert(err.message || "Signup failed.");
  }
}

window.signupUser = signupUser;
