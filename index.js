import express from "express";
import { Client } from "revolt.js";

const client = new Client();
const app = express();
const PREFIX = "!";

// 📝 ID قناة اللوج
const LOG_CHANNEL_ID = "01K4T3884S43RW4SRV330H4C8F"; // غير الـ ID بتاع القناة بتاعتك

// --- Revolt bot ---
client.on("ready", async () => {
  console.log(`✅ البوت اشتغل باسم: ${client.user?.username} (${client.user?.id})`);
  sendLog("✅ **البوت اشتغل بنجاح!**", "#00FF00");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


// login داخل IIFE عشان نتعامل مع await
(async () => {
  try {
    await client.loginBot(token);
    console.log("🔐 login success");
  } catch (e) {
    console.error("❌ خطأ في تسجيل الدخول:", e);
    sendLog("❌ خطأ في تسجيل الدخول للبوت!", "#FF0000");
    process.exit(1);
  }
})();

// 📝 دالة إرسال اللوج
async function sendLog(text, colour = "#5865F2") {
  try {
    const channel = client.channels.get(LOG_CHANNEL_ID);
    if (!channel) {
      console.error("❌ مش لاقي قناة اللوج! تأكد من الـ ID.");
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
    console.error("❌ مش قادر أبعت اللوج:", err);
  }
}

// --- الأوامر ---
client.on("messageCreate", async (message) => {
  if (message.author?.bot) return;
  if (!message.content) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // 🏓 ping
  if (command === "ping") {
    await message.channel?.sendMessage("🏓 البوت شغال تمام!");
  }

  // 📜 help
  if (command === "help") {
    await message.channel?.sendMessage({
      embeds: [{
        title: "📜 قائمة الأوامر",
        description:
          "🏓 **!ping** → اختبار البوت\n" +
          "📜 **!help** → عرض قائمة الأوامر\n" +
          "🌐 **!server** → معلومات عن السيرفر\n" +
          "👤 **!userinfo** → معلومات عنك\n" +
          "🗣️ **!say <نص>** → خلي البوت يكرر كلامك\n" +
          "🖼️ **!avatar** → عرض صورتك\n" +
          "⏰ **!time** → عرض الوقت الحالي\n" +
          "🕐 **!uptime** → مدة تشغيل البوت\n" +
          "🆘 **!support** → رابط سيرفر الدعم\n" +
          "🌐 **!developersite** → رابط موقع المطور\n" +
          "💰 **!credits** → عرض رصيدك\n" +
          "🎁 **!daily** → خد مكافأة يومية\n" +
          "😂 **!wr3** → البوت يقول ورع 😂🔥\n" +
          "🔨 **!kick @user** → طرد عضو\n" +
          "🔨 **!ban @user** → حظر عضو\n" +
          "🤖 **!botinfo** → معلومات عن البوت",
        colour: "#5865F2",
        footer: { text: "ArabBot v1.0 | مطور: Hamza177" }
      }]
    });
  }

  // 🌐 server info
  if (command === "server") {
    await message.channel?.sendMessage(
      `🌐 معلومات السيرفر:\nالاسم: ${message.server?.name}\nID: ${message.server?.id}`
    );
  }

  // 👤 userinfo
  if (command === "userinfo") {
    await message.channel?.sendMessage(
      `👤 معلوماتك:\nالاسم: ${message.author?.username}\nID: ${message.author?.id}`
    );
  }

  // 🗣️ say
  if (command === "say") {
    const text = args.join(" ");
    if (!text) {
      await message.channel?.sendMessage("❌ لازم تكتب نص!");
    } else {
      await message.channel?.sendMessage(text);
    }
  }

  // 🖼️ avatar
  if (command === "avatar") {
    const avatar = message.author?.generateAvatarURL?.() || "مفيش صورة";
    await message.channel?.sendMessage(`🖼️ صورتك: ${avatar}`);
  }

  // ⏰ time
  if (command === "time") {
    const now = new Date();
    await message.channel?.sendMessage(`⏰ الوقت الحالي: ${now.toLocaleString("ar-EG")}`);
  }

  // 🕐 uptime
  if (command === "uptime") {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await message.channel?.sendMessage(`🕐 البوت شغال بقاله: ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`);
  }

  // 🆘 support
  if (command === "support") {
    await message.channel?.sendMessage("🆘 سيرفر الدعم: https://hamzalegnd177.github.io/arabgaming1/");
  }

  // 💰 credits
  if (command === "credits") {
    await message.channel?.sendMessage(`💰 ${message.author?.username}، رصيدك هو: 100 كريديت`);
  }

  // 🎁 daily
  if (command === "daily") {
    await message.channel?.sendMessage(`🎁 ${message.author?.username}، أخدت مكافأتك اليومية: 50 كريديت`);
  }

  // 😂 wr3
  if (command === "wr3") {
    await message.channel?.sendMessage("ورع 😂🔥");
  }

  // 🔗 developer site
  if (command === "developersite") {
    await message.channel?.sendMessage("🌐 موقع المطور: https://hamzalegnd177.github.io/hamza177/");
  }

  // 🔨 kick
  if (command === "kick") {
    const userId = message.mentions?.values()?.next().value;
    if (!userId) return message.channel?.sendMessage("❌ لازم تعمل منشن للي عايز تطرده!");
    try {
      await message.server?.kickUser(userId);
      const kickedUser = await client.users.fetch(userId);
      await message.channel?.sendMessage(`✅ ${kickedUser.username} اتطرد من السيرفر.`);
    } catch (err) {
      await message.channel?.sendMessage("❌ مش قادر أطرد العضو، يمكن مفيش صلاحيات!");
    }
  }

  // 🔨 ban
  if (command === "ban") {
    const userId = message.mentions?.values()?.next().value;
    if (!userId) return message.channel?.sendMessage("❌ لازم تعمل منشن للي عايز تحظره!");
    try {
      await message.server?.banUser(userId);
      const bannedUser = await client.users.fetch(userId);
      await message.channel?.sendMessage(`✅ ${bannedUser.username} اتعمله حظر من السيرفر.`);
    } catch (err) {
      await message.channel?.sendMessage("❌ مش قادر أحظر العضو، يمكن مفيش صلاحيات!");
    }
  }

  // 🤖 botinfo
  if (command === "botinfo") {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await message.channel?.sendMessage(
      `🤖 معلومات البوت:\n- الاسم: ${client.user?.username}\n- ID: ${client.user?.id}\n- وقت التشغيل: ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`
    );
  }
});

// --- Web server for uptime ---
app.get("/", (req, res) => {
  res.send("✅ ArabBot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
