import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("days")
    .update({ value: body.value })
    .eq("id", body.id);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return Response.json({ success: true, data });
}
