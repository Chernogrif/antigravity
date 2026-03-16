const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fix() {
  const defaultJobs = [
    { id: 1, title: 'Инженер-геодезист', status: 'ОТКРЫТА', desc: 'Требуется специалист с опытом полевых работ (тахеометры, GNSS) и камельной обработки. Командировки по РФ.' },
    { id: 2, title: 'Инженер-геолог', status: 'ОТКРЫТА', desc: 'Описание грунтовых массивов, ведение документации, взаимодействие с лабораторией. Умение работать в специализированном ПО.' }
  ];

  // We don't have ALTER TABLE permissions from anon key. 
  // Let's see what happens if we upsert jobs_json (it might fail if the column doesn't exist).
  // I will just ask the user to run ALTER TABLE if it fails.
  
  const { error } = await supabase
    .from('site_content')
    .update({ jobs_json: JSON.stringify(defaultJobs) })
    .eq('id', 'main_page');
    
  console.log("Migration Result error:", error);
}

fix();
