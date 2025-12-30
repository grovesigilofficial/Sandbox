import { supabase } from "./supabaseClient.js";

const feedContainer = document.getElementById("feed");
const postContent = document.getElementById("post-content");

async function loadPosts() {
  feedContainer.innerHTML = "Loading…";

  const { data, error } = await supabase
    .from("newsfeed")
    .select(`
      id,
      content,
      created_at,
      profiles(username)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading posts:", error);
    feedContainer.innerHTML = "Failed to load posts.";
    return;
  }

  feedContainer.innerHTML = "";
  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="author">${post.profiles.username}</div>
      <div class="content">${post.content}</div>
      <div class="time" style="opacity:0.7;font-size:0.8rem;">${new Date(post.created_at).toLocaleString()}</div>
    `;
    feedContainer.appendChild(div);
  });
}

async function createPost() {
  const content = postContent.value.trim();
  if (!content) return alert("Post cannot be empty");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Not logged in");

  const { error } = await supabase
    .from("newsfeed")
    .insert({ user_id: user.id, content });
  if (error) {
    console.error("Error creating post:", error);
    return alert("Failed to post");
  }

  postContent.value = "";
  loadPosts();
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

loadPosts();

supabase
  .from("newsfeed")
  .on("INSERT", payload => loadPosts())
  .subscribe();

window.createPost = createPost;
window.logout = logout;
