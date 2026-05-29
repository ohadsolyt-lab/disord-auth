/**
 * Discord OAuth2 Authorization System
 * Allows users to login with Discord and automatically join a server
 */

const express = require('express');
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ==========================================
// CONFIGURATION
// ==========================================

const app = express();
const PORT = process.env.PORT || 3000;

// Discord OAuth2 Configuration
const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const GUILD_ID = process.env.GUILD_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Database file for tracking authorized users
const AUTHORIZED_USERS_FILE = path.join(__dirname, 'data', 'authorized_users.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// ==========================================
// DISCORD BOT SETUP
// ==========================================

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Bot ready event
discordClient.once('ready', () => {
  console.log(`✅ Discord Bot logged in as: ${discordClient.user.tag}`);
  console.log(`🤖 Bot ID: ${discordClient.user.id}`);
});

// Login the bot
discordClient.login(BOT_TOKEN).catch(err => {
  console.error('❌ Failed to login Discord bot:', err.message);
  process.exit(1);
});

// ==========================================
// EXPRESS MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Load authorized users from JSON file
 */
function loadAuthorizedUsers() {
  try {
    if (fs.existsSync(AUTHORIZED_USERS_FILE)) {
      const data = fs.readFileSync(AUTHORIZED_USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('❌ Error loading authorized users:', err.message);
  }
  return {};
}

/**
 * Save authorized users to JSON file
 */
function saveAuthorizedUsers(users) {
  try {
    fs.writeFileSync(AUTHORIZED_USERS_FILE, JSON.stringify(users, null, 2));
    console.log('💾 Authorized users saved to database');
  } catch (err) {
    console.error('❌ Error saving authorized users:', err.message);
  }
}

/**
 * Check if user is already authorized
 */
function isUserAuthorized(userId) {
  const users = loadAuthorizedUsers();
  return users.hasOwnProperty(userId);
}

/**
 * Add user to authorized list
 */
function authorizeUser(userId, userData) {
  const users = loadAuthorizedUsers();
  users[userId] = {
    ...userData,
    authorizedAt: new Date().toISOString(),
    joinedAt: new Date().toISOString()
  };
  saveAuthorizedUsers(users);
  console.log(`✅ User ${userId} (${userData.username}) authorized and added to database`);
}

/**
 * Exchange OAuth2 code for access token
 */
async function exchangeCodeForToken(code) {
  try {
    console.log('🔄 Exchanging OAuth2 code for access token...');
    
    const response = await axios.post(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      scope: 'identify guilds.join'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('✅ Successfully exchanged code for access token');
    return response.data;
  } catch (err) {
    console.error('❌ Error exchanging code for token:', err.response?.data || err.message);
    throw new Error('Failed to exchange code for token');
  }
}

/**
 * Fetch user information from Discord
 */
async function fetchUserInfo(accessToken) {
  try {
    console.log('🔄 Fetching user information from Discord...');
    
    const response = await axios.get(`${DISCORD_API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log(`✅ User info fetched: ${response.data.username}#${response.data.discriminator}`);
    return response.data;
  } catch (err) {
    console.error('❌ Error fetching user info:', err.response?.data || err.message);
    throw new Error('Failed to fetch user information');
  }
}

/**
 * Add user to Discord server
 */
async function addUserToServer(userId, accessToken) {
  try {
    console.log(`🔄 Adding user ${userId} to server ${GUILD_ID}...`);
    
    const response = await axios.put(
      `${DISCORD_API_ENDPOINT}/guilds/${GUILD_ID}/members/${userId}`,
      {
        access_token: accessToken
      },
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ User ${userId} successfully added to server`);
    return response.data;
  } catch (err) {
    // 204 No Content means user was already in the server
    if (err.response?.status === 204) {
      console.log(`ℹ️ User ${userId} was already in the server`);
      return { alreadyMember: true };
    }
    
    console.error('❌ Error adding user to server:', err.response?.data || err.message);
    throw new Error('Failed to add user to server');
  }
}

/**
 * Send webhook notification
 */
async function sendWebhookNotification(webhookUrl, userData) {
  if (!webhookUrl) return;
  
  try {
    await axios.post(webhookUrl, {
      embeds: [{
        title: '✅ New User Authorized',
        description: `A new user has authorized and joined the server`,
        color: 0x00FF88,
        fields: [
          { name: 'Username', value: userData.username, inline: true },
          { name: 'User ID', value: userData.id, inline: true },
          { name: 'Email', value: userData.email || 'Not provided', inline: false },
          { name: 'Timestamp', value: new Date().toISOString(), inline: false }
        ]
      }]
    });
    console.log('📨 Webhook notification sent');
  } catch (err) {
    console.error('⚠️ Error sending webhook notification:', err.message);
  }
}

// ==========================================
// ROUTES
// ==========================================

/**
 * Home page - Login page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * OAuth2 Login redirect
 * Redirects user to Discord authorization page
 */
app.get('/auth/login', (req, res) => {
  try {
    console.log('🔐 User initiated login');
    
    const authUrl = new URL(`${DISCORD_API_ENDPOINT}/oauth2/authorize`);
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'identify guilds.join');
    authUrl.searchParams.append('prompt', 'consent');

    console.log(`📍 Redirecting to Discord authorization page`);
    res.redirect(authUrl.toString());
  } catch (err) {
    console.error('❌ Error in login route:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * OAuth2 Callback
 * Discord redirects here after user authorizes
 */
app.get('/auth/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    // Check for authorization errors
    if (error) {
      console.error('❌ Authorization error:', error);
      return res.redirect(`/error?message=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('❌ No authorization code received');
      return res.redirect('/error?message=No authorization code received');
    }

    console.log('✅ Authorization code received');
    console.log(`📍 Redirect URI being used: ${REDIRECT_URI}`);

    // Step 1: Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;

    // Step 2: Fetch user information
    const userInfo = await fetchUserInfo(accessToken);
    const userId = userInfo.id;

    // Step 3: Check if user is already authorized
    if (isUserAuthorized(userId)) {
      console.log(`ℹ️ User ${userId} is already authorized`);
      return res.redirect(`/success?username=${encodeURIComponent(userInfo.username)}&alreadyMember=true`);
    }

    // Step 4: Add user to server
    const addResult = await addUserToServer(userId, accessToken);

    // Step 5: Save user to database
    authorizeUser(userId, {
      id: userInfo.id,
      username: userInfo.username,
      discriminator: userInfo.discriminator,
      email: userInfo.email,
      avatar: userInfo.avatar
    });

    // Step 6: Send webhook notification
    await sendWebhookNotification(process.env.WEBHOOK_URL, userInfo);

    console.log(`🎉 User ${userInfo.username} successfully authorized and added to server`);
    res.redirect(`/success?username=${encodeURIComponent(userInfo.username)}`);

  } catch (err) {
    console.error('❌ Error in callback route:', err.message);
    res.redirect(`/error?message=${encodeURIComponent(err.message)}`);
  }
});

/**
 * Success page
 */
app.get('/success', (req, res) => {
  const { username, alreadyMember } = req.query;
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

/**
 * Error page
 */
app.get('/error', (req, res) => {
  const { message } = req.query;
  res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

/**
 * API: Get authorized users count
 */
app.get('/api/stats', (req, res) => {
  try {
    const users = loadAuthorizedUsers();
    const count = Object.keys(users).length;
    res.json({
      authorizedUsers: count,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Error getting stats:', err.message);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

/**
 * API: Get all authorized users (admin only)
 */
app.get('/api/users', (req, res) => {
  try {
    const users = loadAuthorizedUsers();
    res.json(users);
  } catch (err) {
    console.error('❌ Error getting users:', err.message);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// ==========================================
// ERROR HANDLING
// ==========================================

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Discord OAuth2 Authorization System  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Login page: http://localhost:${PORT}`);
  console.log(`🔐 OAuth2 Callback: http://localhost:${PORT}/auth/callback`);
  console.log(`\n⚙️  Configuration:`);
  console.log(`   Client ID: ${CLIENT_ID}`);
  console.log(`   Guild ID: ${GUILD_ID}`);
  console.log(`   Redirect URI: ${REDIRECT_URI}`);
  console.log(`\n💾 Authorized users database: ${AUTHORIZED_USERS_FILE}`);
  console.log('\n');
});
