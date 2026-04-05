require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscriptions() {
  console.log("Fetching subscription data...\n");

  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    // We can order by created_at ascending
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching subscribers:", error.message);
    // Might be that relation doesn't exist
    if (error.code === '42P01') {
      console.log("It looks like the 'subscribers' table hasn't been created yet!");
    }
    return;
  }

  if (!data || data.length === 0) {
    console.log("No subscriptions found.");
    return;
  }

  // Group by day
  const dailyCounts = {};
  let totalActive = 0;
  let totalInactive = 0;

  data.forEach((sub) => {
    // Check if created_at exists, if not we fallback or skip
    if (!sub.created_at) return;

    // Extract the date part (YYYY-MM-DD)
    const dateStr = new Date(sub.created_at).toISOString().split('T')[0];
    
    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = { new: 0, active: 0, inactive: 0, subscribers: [] };
    }
    
    dailyCounts[dateStr].new += 1;
    dailyCounts[dateStr].subscribers.push(sub);
    
    if (sub.is_active) {
      dailyCounts[dateStr].active += 1;
      totalActive += 1;
    } else {
      dailyCounts[dateStr].inactive += 1;
      totalInactive += 1;
    }
  });

  console.log("=== Daily Subscriptions Summary ===\n");
  
  Object.keys(dailyCounts).sort().forEach(date => {
    const stats = dailyCounts[date];
    console.log(`📅 Date: ${date} (Total: ${stats.new} | Active: ${stats.active} | Inactive: ${stats.inactive})`);
    console.log(`   Detailed List:`);
    
    stats.subscribers.forEach((sub, index) => {
      const email = sub.email || "No Email";
      // The table might not have a 'name' field, we'll try to display it if it exists.
      const name = sub.name ? `[Name: ${sub.name}]` : "";
      const status = sub.is_active ? "🟢 Active" : "🔴 Inactive";
      console.log(`   ${index + 1}. ${email} ${name} - ${status}`);
    });
    console.log("");
  });
  
  console.log("-------------------------------------------------");
  console.log(`Total Active Subscriptions:   ${totalActive}`);
  console.log(`Total Inactive Subscriptions: ${totalInactive}`);
  console.log(`Grand Total:                  ${data.length}\n`);
}

checkSubscriptions();

