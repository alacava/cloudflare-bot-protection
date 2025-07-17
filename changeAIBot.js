require('dotenv').config();
const axios = require('axios');

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const AI_BOTS_PROTECTION = process.env.AI_BOTS_PROTECTION || 'allow';
const FILTER_ACCOUNT_ID = process.env.ACCOUNT_ID || null;
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

const headers = {
  Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
  'Content-Type': 'application/json',
};

async function listZones() {
  const zones = [];
  let page = 1;

  while (true) {
    const res = await axios.get(`${CLOUDFLARE_API_BASE}/zones?page=${page}&per_page=50`, { headers });
    const filtered = FILTER_ACCOUNT_ID
      ? res.data.result.filter(z => z.account?.id === FILTER_ACCOUNT_ID)
      : res.data.result;

    zones.push(...filtered);

    if (page >= res.data.result_info.total_pages) break;
    page++;
  }

  return zones;
}

async function updateAIBotSetting(zoneId, zoneName) {
  try {
    const url = `${CLOUDFLARE_API_BASE}/zones/${zoneId}/bot_management`;
    const payload = { ai_bots_protection: AI_BOTS_PROTECTION };

    const res = await axios.put(url, payload, { headers });

    if (res.data.success) {
      console.log(`✅ Set AI bot protection = "${AI_BOTS_PROTECTION}" for ${zoneName}`);
    } else {
      console.error(`❌ Failed for ${zoneName}:`, res.data.errors);
    }
  } catch (err) {
    console.error(`❌ Error for ${zoneName}:`, err.response?.data || err.message);
  }
}

(async () => {
  try {
    const zones = await listZones();

    if (zones.length === 0) {
      console.warn(FILTER_ACCOUNT_ID
        ? `⚠️ No zones found for account ID ${FILTER_ACCOUNT_ID}`
        : `⚠️ No zones found`);
      return;
    }

    console.log(`🌐 Found ${zones.length} zone(s)${FILTER_ACCOUNT_ID ? ` under account ${FILTER_ACCOUNT_ID}` : ''}.`);

    for (const zone of zones) {
      await updateAIBotSetting(zone.id, zone.name);
    }
  } catch (err) {
    console.error('❌ Script failed:', err.message);
  }
})();
