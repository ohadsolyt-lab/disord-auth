# Discord OAuth2 Authorization System

A complete, production-ready Discord OAuth2 authorization system that automatically adds users to your Discord server after they authorize with their Discord account.

## ✨ Features

- ✅ **Discord OAuth2 Login** - Secure login with Discord
- ✅ **Automatic Server Join** - Users automatically added to your server
- ✅ **User Database** - Track all authorized users
- ✅ **Duplicate Prevention** - Prevent users from joining twice
- ✅ **Modern UI** - Beautiful, responsive login page
- ✅ **Error Handling** - Comprehensive error pages
- ✅ **Console Logging** - Detailed logs for debugging
- ✅ **API Endpoints** - Get stats and user information
- ✅ **Environment Variables** - Secure configuration
- ✅ **Fully Commented** - Easy to understand and modify

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your Discord credentials
# See SETUP_GUIDE.md for detailed instructions
```

### 3. Run the Server
```bash
npm start
```

### 4. Open in Browser
```
http://localhost:3000
```

## 📋 Requirements

- Node.js v14+
- npm or yarn
- Discord Server (you must be owner/admin)
- Discord Developer Application

## 🔧 Configuration

All configuration is done through the `.env` file:

```env
BOT_TOKEN=your_bot_token
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
GUILD_ID=your_guild_id
REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
```

**See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.**

## 📁 Project Structure

```
discord-oauth/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                       # Configuration (not in repo)
├── .env.example              # Example configuration
├── SETUP_GUIDE.md            # Detailed setup guide
├── README.md                 # This file
├── public/
│   ├── index.html            # Login page
│   ├── success.html          # Success page
│   └── error.html            # Error page
└── data/
    └── authorized_users.json # User database (auto-created)
```

## 🔐 OAuth2 Flow

1. User clicks "Login with Discord"
2. Redirected to Discord authorization page
3. User clicks "Authorize"
4. Discord redirects back with authorization code
5. Server exchanges code for access token
6. Server fetches user information
7. Server adds user to Discord server
8. User is shown success page

## 📊 API Endpoints

### Get Statistics
```bash
GET /api/stats
```

Response:
```json
{
  "authorizedUsers": 42,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Get All Authorized Users
```bash
GET /api/users
```

Response:
```json
{
  "user_id": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "authorizedAt": "2024-01-01T12:00:00.000Z",
    "joinedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## 🎨 Pages

### Login Page (`/`)
- Modern, responsive design
- Discord login button
- Feature highlights
- Information box

### Success Page (`/success`)
- Confirmation message
- User information
- Links to Discord
- Status indicators

### Error Page (`/error`)
- Error message display
- Error code
- Troubleshooting tips
- Retry button

## 📝 Console Logs

The server provides detailed console logs:

```
✅ Discord Bot logged in as: BotName#0000
🔐 User initiated login
🔄 Exchanging OAuth2 code for access token...
✅ Successfully exchanged code for access token
🔄 Fetching user information from Discord...
✅ User info fetched: username#0000
🔄 Adding user to server...
✅ User successfully added to server
💾 Authorized users saved to database
🎉 User successfully authorized and added to server
```

## 🛠️ Development

### Run with Auto-Restart
```bash
npm run dev
```

### View Authorized Users
```bash
cat data/authorized_users.json
```

### Clear User Database
```bash
rm data/authorized_users.json
```

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set BOT_TOKEN=your_token
heroku config:set CLIENT_ID=your_id
heroku config:set CLIENT_SECRET=your_secret
heroku config:set GUILD_ID=your_guild_id
heroku config:set REDIRECT_URI=https://your-app-name.herokuapp.com/auth/callback
git push heroku main
```

### Other Platforms
See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for deployment instructions.

## ⚠️ Security

- Never commit `.env` file
- Keep bot token secret
- Use HTTPS in production
- Validate all user input
- Implement rate limiting
- Configure CORS properly

## 🐛 Troubleshooting

### "Invalid OAuth2 code"
- Check `REDIRECT_URI` matches Discord Developer Portal exactly

### "Bot cannot add user"
- Verify bot has "Manage Members" permission
- Check bot role is above user role

### "Port already in use"
- Change `PORT` in `.env` or kill the process

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

## 📚 Dependencies

- **express** - Web server framework
- **discord.js** - Discord bot library
- **axios** - HTTP client
- **dotenv** - Environment variables

## 📄 License

MIT License - Feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

---

**Made with ❤️ for Discord developers**
