// api/updateDay.js
import { createClient } from '@supabase/supabase-js';

const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { newDay } = req.body;
    if (typeof newDay !== 'number') {
      return res.status(400).json({ error: 'newDay must be number' });
    }

    const { data, error } = await client
      .from('uberman_counter')
      .update({ day: newDay })
      .limit(1)
      .select();

    if (error) {
      console.error('updateDay server error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ updated: true, day: data?.[0]?.day ?? null });
  } catch (e) {
    console.error('updateDay exception:', e);
    return res.status(500).json({ error: 'internal' });
  }
}
