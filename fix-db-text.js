const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fix() {
  const query = `
    ALTER TABLE site_content ADD COLUMN IF NOT EXISTS lab_image text;
    ALTER TABLE site_content ADD COLUMN IF NOT EXISTS lab_title text;
    ALTER TABLE site_content ADD COLUMN IF NOT EXISTS lab_desc text;
    ALTER TABLE site_content ADD COLUMN IF NOT EXISTS lab_list text;
    ALTER TABLE site_content ADD COLUMN IF NOT EXISTS contact_title text;
    ALTER TABLE site_content ADD COLUMN IF NOT EXISTS contact_desc text;
  `;
  console.log("Please run this query in SQL Editor:");
  console.log(query);
}

fix();
