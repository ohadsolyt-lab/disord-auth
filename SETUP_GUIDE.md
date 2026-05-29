# Discord OAuth2 Authorization System - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Discord Developer Portal Setup](#discord-developer-portal-setup)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Server](#running-the-server)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **Discord Server** (you must be the owner or have admin rights)
- A **Discord Account**
- A text editor (VS Code recommended)

---

## Discord Developer Portal Setup

### Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** button
3. Enter a name (e.g., "OAuth2 Bot")
4. Click **"Create"**

### Step 2: Get Your Bot Token

1. In your application, go to the **"Bot"** section (left sidebar)
2. Click **"Add Bot"**
3. Under the **TOKEN** section, click **"Copy"**
4. **Save this token** - you'll need it for `.env` file
   - This is your `BOT_TOKEN`

⚠️ **IMPORTANT**: Never share your bot token publicly!

### Step 3: Get Your Client ID and Client Secret

1. Go to **"OAuth2"** section (left sidebar)
2. Go to **"General"** tab
3. Copy the **"Client ID"** - this is your `CLIENT_ID`
4. Click **"Reset Secret"** and copy the new secret - this is your `CLIENT_SECRET`

⚠️ **IMPORTANT**: Never share your client secret publicly!

### Step 4: Set Up OAuth2 Redirect URI

1. In **"OAuth2"** > **"General"** tab
2. Scroll down to **"Redirects"** section
3. Click **"Add Redirect"**
4. Enter your redirect URI:
   - **For local development**: `http://localhost:3000/auth/callback`
   - **For production**: `https://yourdomain.com/auth/callback`
5. Click **"Save"**

### Step 5: Get Your Guild ID (Server ID)

1. Open Discord
2. Enable **Developer Mode**:
   - Go to User Settings > Advanced > Developer Mode (toggle ON)
3. Right-click your server name
4. Click **"Copy Server ID"**
5. This is your `GUILD_ID`

### Step 6: Invite the Bot to Your Server

1. Go back to Discord Developer Portal
2. In your application, go to **"OAuth2"** > **"URL Generator"**
3. Select these scopes:
   - ✅ `identify`
   - ✅ `guilds.join`
4. Select these permissions:
   - ✅ `Manage Members` (to add users to server)
5. Copy the generated URL
6. Open the URL in your browser
7. Select your server and click **"Authorize"**

---

## Installation

### Step 1: Clone or Download the Project

```bash
# Navigate to your desired directory
cd your-projects-folder

# If you have git, clone the repository
git clone <repository-url>

# Or manually download and extract the files
```

### Step 2: Install Dependencies

```bash
# Navigate to the project directory
cd discord-oauth

# Install all required packages
npm install
```

This will install:
- `express` - Web server framework
- `discord.js` - Discord bot library
- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

---

## Configuration

### Step 1: Create .env File

1. In the project root directory, create a file named `.env`
2. Copy the contents from `.env.example`
3. Fill in your values:

```env
# Your bot token from Discord Developer Portal
BOT_TOKEN=your_bot_token_here

# Your client ID from OAuth2 > General
CLIENT_ID=your_client_id_here

# Your client secret from OAuth2 > General
CLIENT_SECRET=your_client_secret_here

# Your server ID (right-click server > Copy Server ID)
GUILD_ID=your_guild_id_here

# Your redirect URI (must match Discord Developer Portal)
REDIRECT_URI=http://localhost:3000/auth/callback

# Server port
PORT=3000

# Environment
NODE_ENV=development
```

### Step 2: Verify File Structure

Your project should look like this:

```
discord-oauth/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                       # Your configuration (DO NOT COMMIT)
├── .env.example              # Example configuration
├── SETUP_GUIDE.md            # This file
├── public/
│   ├── index.html            # Login page
│   ├── success.html          # Success page
│   └── error.html            # Error page
└── data/
    └── authorized_users.json # Database of authorized users (auto-created)
```

---

## Running the Server

### Option 1: Normal Mode

```bash
npm start
```

### Option 2: Development Mode (with auto-restart)

```bash
npm run dev
```

### Expected Output

```
╔════════════════════════════════════════╗
║   Discord OAuth2 Authorization System  ║
╚════════════════════════════════════════╝

🚀 Server running on http://localhost:3000
📍 Login page: http://localhost:3000
🔐 OAuth2 Callback: http://localhost:3000/auth/callback

⚙️  Configuration:
   Client ID: your_client_id
   Guild ID: your_guild_id
   Redirect URI: http://localhost:3000/auth/callback

💾 Authorized users database: /path/to/data/authorized_users.json
```

---

## Testing

### Step 1: Open the Login Page

1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the login page

### Step 2: Test the OAuth2 Flow

1. Click **"Login with Discord"**
2. You'll be redirected to Discord authorization page
3. Click **"Authorize"**
4. You should be redirected to the success page
5. Check your Discord server - you should be added!

### Step 3: Verify User Database

1. Open `data/authorized_users.json`
2. You should see your user information:

```json
{
  "your_user_id": {
    "id": "your_user_id",
    "username": "your_username",
    "discriminator": "0000",
    "email": "your_email@example.com",
    "avatar": "avatar_hash",
    "authorizedAt": "2024-01-01T12:00:00.000Z",
    "joinedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Step 4: Check API Endpoints

```bash
# Get statistics
curl http://localhost:3000/api/stats

# Get all authorized users
curl http://localhost:3000/api/users
```

---

## Deployment

### Option 1: Deploy to Heroku

1. Install Heroku CLI
2. Create a Heroku account
3. Run:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set BOT_TOKEN=your_token
   heroku config:set CLIENT_ID=your_id
   heroku config:set CLIENT_SECRET=your_secret
   heroku config:set GUILD_ID=your_guild_id
   heroku config:set REDIRECT_URI=https://your-app-name.herokuapp.com/auth/callback
   git push heroku main
   ```

### Option 2: Deploy to Replit

1. Create a Replit account
2. Import this repository
3. Set environment variables in Replit secrets
4. Run the server

### Option 3: Deploy to Your Own Server

1. Upload files to your server
2. Install Node.js on your server
3. Run `npm install`
4. Set environment variables
5. Use a process manager like `pm2`:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   ```

### Update Discord Redirect URI

After deployment, update your redirect URI in Discord Developer Portal:
1. Go to OAuth2 > General
2. Update the redirect URI to your production URL
3. Example: `https://yourdomain.com/auth/callback`

---

## Troubleshooting

### Issue: "Invalid OAuth2 code"

**Solution:**
- Make sure your `REDIRECT_URI` in `.env` matches exactly what you set in Discord Developer Portal
- Check for trailing slashes or typos

### Issue: "Bot cannot add user to server"

**Solution:**
- Make sure the bot has **"Manage Members"** permission
- Make sure the bot role is **above** the user's role in the server
- Check that `GUILD_ID` is correct

### Issue: "Client secret is invalid"

**Solution:**
- Go to Discord Developer Portal
- Click "Reset Secret" and copy the new one
- Update your `.env` file

### Issue: "User not found" or "Invalid token"

**Solution:**
- Make sure your `BOT_TOKEN` is correct
- Make sure your `CLIENT_ID` and `CLIENT_SECRET` are correct
- Try resetting them in Discord Developer Portal

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
# Make sure you're in the project directory
cd discord-oauth

# Reinstall dependencies
npm install
```

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Change the port in .env
PORT=3001

# Or kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Issue: "ENOENT: no such file or directory"

**Solution:**
- Make sure you're running the server from the project root directory
- Check that all files are in the correct locations

---

## File Explanations

### `server.js`
Main server file containing:
- Express server setup
- Discord bot initialization
- OAuth2 flow implementation
- User database management
- API endpoints

### `public/index.html`
Login page with:
- Modern, responsive design
- Discord login button
- Feature highlights

### `public/success.html`
Success page showing:
- Confirmation message
- User information
- Links to Discord

### `public/error.html`
Error page with:
- Error message display
- Troubleshooting tips
- Retry button

### `.env`
Configuration file containing:
- Bot token
- OAuth2 credentials
- Server settings

### `data/authorized_users.json`
Database file storing:
- Authorized user information
- Authorization timestamps
- User metadata

---

## Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Keep tokens secret** - Don't share them in public
3. **Use HTTPS in production** - Always use secure connections
4. **Validate user input** - Sanitize all incoming data
5. **Rate limiting** - Implement rate limiting for API endpoints
6. **CORS** - Configure CORS properly for your domain

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review console logs for error messages
3. Verify all configuration values
4. Check Discord Developer Portal settings
5. Make sure bot has correct permissions

---

## License

This project is open source and available under the MIT License.

---

**Last Updated:** January 2024
**Version:** 1.0.0
