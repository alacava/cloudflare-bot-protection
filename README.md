# 🔧 Cloudflare AI Bot Protection Disabler

This script disables (or modifies) the **AI Bot Protection** setting across all Cloudflare zones tied to your API token.  
You can optionally restrict it to a single Cloudflare **Account ID**.

## 🚀 Features

- Disables or configures AI bot protection (`ai_bots_protection`)
- Works across **all zones** or only those under a specific **Account ID**
- Supports `.env`-based configuration
- Uses Cloudflare's undocumented `PUT /zones/:zone_id/bot_management` endpoint

## 📦 Requirements

- Node.js (v16+ recommended)
- Cloudflare API Token with:
  - `Zone` → `Read`
  - `Zone Settings` → `Edit`
  - Access to `Bot Management` (feature must be enabled for your account)

## 📁 Setup

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/cloudflare-disable-aibots.git
   cd cloudflare-disable-aibots
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   CLOUDFLARE_API_TOKEN=your_cloudflare_token
   AI_BOTS_PROTECTION=allow   # Options: allow, challenge, block (depending on your use case)
   ACCOUNT_ID=optional_account_id  # Leave blank to apply to all accessible accounts
   ```

4. Run the script:
   ```bash
   node disable-ai-bots.js
   ```

## 🛠️ Configuration

| Variable              | Description                                                       |
|-----------------------|-------------------------------------------------------------------|
| `CLOUDFLARE_API_TOKEN`| **Required.** Your Cloudflare API token                          |
| `AI_BOTS_PROTECTION`  | `allow`, `challenge`, etc. Default: `allow`                      |
| `ACCOUNT_ID`          | (Optional) Only affect zones under this Account ID               |

## 🧪 Example Output

```bash
🌐 Found 3 zone(s).
✅ Set AI bot protection = "allow" for example.com
✅ Set AI bot protection = "allow" for mydomain.net
✅ Set AI bot protection = "allow" for test.site
```

## 📋 Notes

- The `PUT /zones/:zone_id/bot_management` endpoint may not be officially documented by Cloudflare.
- Requires that AI bot protection is available and enabled for your zones/accounts.
- If no zones are found, double-check your token’s permissions and optional `ACCOUNT_ID`.

## 📄 License

MIT License
