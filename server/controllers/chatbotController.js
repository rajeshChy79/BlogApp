// controllers/chatbotController.js
export const chatbotReply = async (req, res) => {
  try {
    const { message = "" } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ reply: "⚠️ Please type a message." });
    }

    const lowerMsg = message.toLowerCase();

    // ✅ Expanded response list
    const responses = [
      // Greetings
      { keywords: ["hello", "hi", "hey"], reply: "👋 Hello! I'm your assistant. How can I help you today?" },
      { keywords: ["good morning"], reply: "☀️ Good morning! Hope you have a productive day." },
      { keywords: ["good night"], reply: "🌙 Good night! Rest well." },

      // Blog related
      { keywords: ["blog", "blogs", "posts", "articles"], reply: "📝 You can view all blogs in the Blog section." },
      { keywords: ["create post", "new blog", "write"], reply: "✍️ Go to 'Create Post' to write your own blog." },
      { keywords: ["search", "find", "filter"], reply: "🔍 Use the search bar in the navbar to find blogs easily." },
      { keywords: ["my blogs", "my posts"], reply: "📂 Visit your Profile to see blogs you’ve written." },
      { keywords: ["trending", "popular"], reply: "🔥 Check the home page for trending and popular blogs." },

      // Auth related
      { keywords: ["login", "signin"], reply: "🔑 Click on Login from the top-right corner to sign in." },
      { keywords: ["register", "signup", "join"], reply: "🆕 Go to Register to create a new account." },
      { keywords: ["profile", "account"], reply: "👤 You can view and edit your profile in the Profile section." },
      { keywords: ["password", "reset", "forgot"], reply: "🔐 You can change your password from Profile settings." },
      { keywords: ["logout", "signout"], reply: "🚪 Click on Logout in the menu to sign out safely." },

      // Interaction
      { keywords: ["like", "heart"], reply: "❤️ You can like blogs and comments to support authors." },
      { keywords: ["bookmark", "save"], reply: "🔖 Bookmark blogs to read them later!" },
      { keywords: ["comment", "reply"], reply: "💬 Share your thoughts by commenting on any blog." },
      { keywords: ["share"], reply: "📤 You can share blogs with your friends via links." },

      // Notifications
      { keywords: ["notification", "alerts"], reply: "🔔 You will get notifications when someone interacts with your blog." },

      // Help & Info
      { keywords: ["help", "support"], reply: "ℹ️ You can ask me about blogs, login, profile, or account settings." },
      { keywords: ["about"], reply: "🤖 I’m your chatbot assistant here to guide you through the app." },
      { keywords: ["contact", "admin", "support team"], reply: "📧 Reach out to our support team via the Contact page." },
      { keywords: ["faq", "questions"], reply: "📖 Check our FAQ section for common questions." },

      // Farewell
      { keywords: ["bye", "goodbye", "see you"], reply: "👋 Goodbye! Have a great day." },
      { keywords: ["thanks", "thank you"], reply: "🙏 You're welcome! Always happy to help." },
    ];

    let reply = "❓ Sorry, I didn’t understand that. Try asking about blogs, login, profile, or help. 🤖";

    // ✅ Find matching response
    for (const item of responses) {
      if (item.keywords.some((kw) => lowerMsg.includes(kw))) {
        reply = item.reply;
        break;
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot Error:", error.message);
    res.status(500).json({ reply: "⚠️ Something went wrong with chatbot." });
  }
};
