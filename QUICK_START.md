# Quick Start - 5 Minutes Setup

## Step 1: Get Your Discord Credentials (2 minutes)

### Get Bot Token
1. Go to https://discord.com/developers/applications
2. Click "New Application" → Name it → Click "Create"
3. Go to "Bot" section → Click "Add Bot"
4. Copy the TOKEN under "TOKEN" section
5. **Save this as `BOT_TOKEN`**

### Get Client ID & Secret
1. Go to "OAuth2" → "General"
2. Copy "Client ID" → **Save as `CLIENT_ID`**
3. Click "Reset Secret" → Copy it → **Save as `CLIENT_SECRET`**

### Get Guild ID
1. Open Discord
2. User Settings → Advanced → Enable "Developer Mode"
3. Right-click your server → "Copy Server ID"
4. **Save as `GUILD_ID`**

### Set Redirect URI
1. In Discord Developer Portal → OAuth2 → General
2. Click "Add Redirect"
3. Enter: `http://localhost:3000/auth/callback`
4. Click "Save"

### Invite Bot to Server
1. OAuth2 → URL Generator
2. Select scopes: `identify`, `guilds.join`
3. Select permissions: `Manage Members`
4. Copy the URL → Open in browser → Select server → Authorize

## Step 2: Setup Project (2 minutes)

```bash
# Navigate to project folder
cd discord-oauth

# Install dependencies
npm install

# Create .env file
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

## Step 3: Configure .env (1 minute)

Open `.env` file and fill in:

```env
BOT_TOKEN=paste_your_bot_token_here
CLIENT_ID=paste_your_client_id_here
CLIENT_SECRET=paste_your_client_secret_here
GUILD_ID=paste_your_guild_id_here
REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
NODE_ENV=development
```

## Step 4: Run Server

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000
```

## Step 5: Test It!

1. Open http://localhost:3000 in your browser
2. Click "Login with Discord"
3. Click "Authorize"
4. You should be added to your server!

---

## ✅ Success Checklist

- [ ] Created Discord Application
- [ ] Got Bot Token
- [ ] Got Client ID & Secret
- [ ] Got Guild ID
- [ ] Set Redirect URI in Discord
- [ ] Invited bot to server
- [ ] Created .env file
- [ ] Filled in all credentials
- [ ] Ran `npm install`
- [ ] Started server with `npm start`
- [ ] Tested login at http://localhost:3000

---

## 🆘 Quick Troubleshooting

**"Cannot find module 'express'"**
```bash
npm install
```

**"Port 3000 already in use"**
- Change PORT in .env to 3001

**"Bot cannot add user"**
- Make sure bot has "Manage Members" permission
- Make sure bot role is above user role

**"Invalid OAuth2 code"**
- Check REDIRECT_URI matches exactly in Discord Developer Portal

---

## 📚 Need More Help?

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

---

**That's it! You're done! 🎉**
