// js/login.js
import { supabase } from "./supabaseClient.js";

export async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Please enter both email and password to log in.");
    return;
  }

  try {
    // Sign in user
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) throw loginError;

    if (!loginData.user) {
      alert("Login failed: user not found.");
      return;
    }

    // Check if email is confirmed
    if (!loginData.user.confirmed_at) {
      alert("Please check your email and confirm your account before logging in.");
      return;
    }

    // Fetch profile row
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, username")
      .eq("id", loginData.user.id)
      .single();
    if (profileError) throw profileError;

    alert(
      `Welcome back, ${profile.full_name || profile.username || "User"}! You are successfully logged in.`
    );

    // Redirect to dashboard
    window
