const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fix() {
  const { error } = await supabase.rpc('query', { query_text: "ALTER TABLE site_content ADD COLUMN IF NOT EXISTS lab_image text;"});
  console.log("Migration Result:", error || "Success");
}

fix();
