import { supabase } from "./supabaseClient.js";

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const feedEl = document.getElementById("feed");

let currentUser = null;

// INIT
(async function init() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  currentUser = session.user;

  loadProfile();
  loadPosts();
})();

// LOAD PROFILE
async function loadProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("username,email")
    .eq("id", currentUser.id)
    .single();

  if (data) {
    usernameEl.textContent = data.username;
    emailEl.textContent = data.email;
  }
}

// CREATE POST
window.createPost = async function () {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return;

  await supabase.from("posts").insert({
    user_id: currentUser.id,
    content
  });

  document.getElementById("postContent").value = "";
  loadPosts();
};

// LOAD POSTS
async function loadPosts() {
  feedEl.innerHTML = "";

  const { data } = await supabase
    .from("posts")
    .select("content, created_at, profiles(username)")
    .order("created_at", { ascending:false });

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="post-user">${post.profiles.username}</div>
      <div>${post.content}</div>
      <div class="post-time">${new Date(post.created_at).toLocaleString()}</div>
    `;
    feedEl.appendChild(div);
  });
}

// LOGOUT
window.logout = async function () {
  await supabase.auth.signOut();
  window.location.href = "index.html";
};
