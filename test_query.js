require('dotenv').config();
const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  try {
    await client.connect();
    const query = 'SELECT stripe_session_id, pass_id, fulfillment_status, customer_email_status, venue_email_status, team_email_status FROM promo_purchases WHERE stripe_session_id = $1';
    const params = ['cs_test_a1rhARbc88EnpccLet34iie9JnKcO6RI5YVkrUIlXBKEBjaV4xNkGVe3nl'];
    const res = await client.query(query, params);
    if (res.rows.length > 0) {
      console.log(JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log('not found');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
