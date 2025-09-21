import express from "express";
import { Client } from "revolt.js";

// 🎮 Revolt bot client
const client = new Client();
const PREFIX = "!";

// 📝 Log channel ID (غيره بالـ ID بتاعك)
const LOG_CHANNEL_ID = "01K4T3884S43RW4SRV330H4C8F";

// 🔑 Token من Environment Variables
const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  console.error("❌ مفيش TOKEN متسجل في الـ Environment Variables!");
  process.exit(1);
}

// --- Bot Ready ---
client.on("ready", async () => {
  console.log(`✅ Bot is online as: ${client.user?.username} (${client.user?.id})`);
  sendLog("✅ **Bot started successfully!**", "#00FF00");
});

// --- Login ---
(async () => {
  try {
    await client.loginBot(TOKEN);
    console.log("🔐 Login success");
  } catch (e) {
    console.error("❌ Error while logging in:", e);
    sendLog("❌ Failed to login!", "#FF0000");
    process.exit(1);
  }
})();

// --- Send log function ---
async function sendLog(text, colour = "#5865F2") {
  try {
    const channel = client.channels.get(LOG_CHANNEL_ID);
    if (!channel) {
      console.error("❌ Log channel not found, check the ID!");
      return;
    }
    await channel.sendMessage({
      embeds: [{
        title: "📌 Log",
        description: text,
        colour,
        footer: { text: `ArabBot v1.0 | ${new Date().toLocaleString("ar-EG")}` }
      }]
    });
  } catch (err) {
    console.error("❌ Failed to send log:", err);
  }
}

// --- Commands ---
client.on("messageCreate", async (message) => {
  if (message.author?.bot) return;
  if (!message.content) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // 🏓 ping
  if (command === "ping") {
    await message.channel?.sendMessage("🏓 Bot is working fine!");
  }

  // 📜 help
  if (command === "help") {
    await message.channel?.sendMessage({
      embeds: [{
        title: "📜 Commands List",
        description:
          "🏓 **!ping** → Test bot\n" +
          "📜 **!help** → Show commands\n" +
          "🌐 **!server** → Server info\n" +
          "👤 **!userinfo** → Your info\n" +
          "🗣️ **!say <text>** → Repeat your text\n" +
          "🖼️ **!avatar** → Show your avatar\n" +
          "⏰ **!time** → Current time\n" +
          "🕐 **!uptime** → Bot uptime\n" +
          "🆘 **!support** → Support server link\n" +
          "🌐 **!developersite** → Developer website\n" +
          "💰 **!credits** → Show credits\n" +
          "🎁 **!daily** → Daily reward\n" +
          "😂 **!wr3** → Bot says wr3 😂🔥\n" +
          "🔨 **!kick @user** → Kick member\n" +
          "🔨 **!ban @user** → Ban member\n" +
          "🤖 **!botinfo** → Bot info",
        colour: "#5865F2",
        footer: { text: "ArabBot v1.0 | Dev: Hamza177" }
      }]
    });
  }

  // 🌐 server info
  if (command === "server") {
    await message.channel?.sendMessage(
      `🌐 Server Info:\nName: ${message.server?.name}\nID: ${message.server?.id}`
    );
  }

  // 👤 userinfo
  if (command === "userinfo") {
    await message.channel?.sendMessage(
      `👤 Your Info:\nUsername: ${message.author?.username}\nID: ${message.author?.id}`
    );
  }

  // 🗣️ say
  if (command === "say") {
    const text = args.join(" ");
    if (!text) {
      await message.channel?.sendMessage("❌ You must type some text!");
    } else {
      await message.channel?.sendMessage(text);
    }
  }

  // 🖼️ avatar
  if (command === "avatar") {
    const avatar = message.author?.generateAvatarURL?.() || "No avatar found";
    await message.channel?.sendMessage(`🖼️ Your avatar: ${avatar}`);
  }

  // ⏰ time
  if (command === "time") {
    const now = new Date();
    await message.channel?.sendMessage(`⏰ Current time: ${now.toLocaleString("en-US")}`);
  }

  // 🕐 uptime
  if (command === "uptime") {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await message.channel?.sendMessage(`🕐 Bot uptime: ${hours}h ${minutes}m ${seconds}s`);
  }

  // 🆘 support
  if (command === "support") {
    await message.channel?.sendMessage("🆘 Support Server: https://hamzalegnd177.github.io/arabgaming1/");
  }

  // 💰 credits
  if (command === "credits") {
    await message.channel?.sendMessage(`💰 ${message.author?.username}, your balance is: 100 credits`);
  }

  // 🎁 daily
  if (command === "daily") {
    await message.channel?.sendMessage(`🎁 ${message.author?.username}, you got your daily reward: 50 credits`);
  }

  // 😂 wr3
  if (command === "wr3") {
    await message.channel?.sendMessage("wr3 😂🔥");
  }

  // 🔗 developer site
  if (command === "developersite") {
    await message.channel?.sendMessage("🌐 Developer site: https://hamzalegnd177.github.io/hamza177/");
  }

  // 🔨 kick
  if (command === "kick") {
    const userId = message.mentions?.values()?.next().value;
    if (!userId) return message.channel?.sendMessage("❌ Mention a user to kick!");
    try {
      await message.server?.kickUser(userId);
      const kickedUser = await client.users.fetch(userId);
      await message.channel?.sendMessage(`✅ ${kickedUser.username} was kicked.`);
    } catch (err) {
      await message.channel?.sendMessage("❌ Can't kick this user, missing permissions!");
    }
  }

  // 🔨 ban
  if (command === "ban") {
    const userId = message.mentions?.values()?.next().value;
    if (!userId) return message.channel?.sendMessage("❌ Mention a user to ban!");
    try {
      await message.server?.banUser(userId);
      const bannedUser = await client.users.fetch(userId);
      await message.channel?.sendMessage(`✅ ${bannedUser.username} was banned.`);
    } catch (err) {
      await message.channel?.sendMessage("❌ Can't ban this user, missing permissions!");
    }
  }

  // 🤖 botinfo
  if (command === "botinfo") {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await message.channel?.sendMessage(
      `🤖 Bot Info:\n- Name: ${client.user?.username}\n- ID: ${client.user?.id}\n- Uptime: ${hours}h ${minutes}m ${seconds}s`
    );
  }
});

// --- Web server (keepalive for Koyeb) ---
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ ArabBot is running 24/7 on Koyeb!");
});
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
