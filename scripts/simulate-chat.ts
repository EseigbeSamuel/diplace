import axios, { AxiosError } from "axios";

// Bypass Node typings inside the React Native / Expo compilation scope
declare const require: (moduleName: string) => any;
declare const process: {
  stdin: any;
  stdout: any;
};

const readline = require("readline");
const BASE_URL = "https://diplace.api.elsoft.ng/api/v1";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface UserResponse {
  public_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Participant {
  public_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

interface Conversation {
  public_id: string;
  last_message_preview?: string;
  participants?: Participant[];
}

interface ConversationListResponse {
  conversations: Conversation[];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function run() {
  console.log("\n=======================================================");
  console.log("   💬 DiPlace Real-Time Chat Simulator (TypeScript) 💬   ");
  console.log("=======================================================\n");
  console.log("Use this tool to log in as a second user and send messages");
  console.log("to your main account to test the real-time WebSocket flow!\n");

  let accessToken = "";
  let loggedInUser: UserResponse | null = null;

  // 1. Authenticate
  while (!accessToken) {
    const email = await askQuestion("📧 Enter User B Email / Phone: ");
    const password = await askQuestion("🔑 Enter User B Password: ");

    if (!email || !password) {
      console.log("❌ Email and password cannot be empty. Please try again.\n");
      continue;
    }

    console.log("\n🔄 Logging in...");
    try {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", email);
      body.append("password", password);
      body.append("scope", "");
      body.append("client_id", "string");
      body.append("client_secret", "string");

      const loginRes = await axios.post<LoginResponse>(
        `${BASE_URL}/auth/login`,
        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      accessToken = loginRes.data.access_token;
      console.log("✅ Login successful!");

      // Get current user info
      const userRes = await axios.get<UserResponse>(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      loggedInUser = userRes.data;
      console.log(
        `👤 Logged in as: ${loggedInUser.first_name} ${loggedInUser.last_name} (${loggedInUser.email})`
      );
    } catch (err: unknown) {
      console.error("\n❌ Login failed!");
      const axiosErr = err as AxiosError<{ detail?: string; message?: string }>;
      if (axiosErr.response && axiosErr.response.data) {
        console.error(
          "Reason:",
          axiosErr.response.data.detail ||
            axiosErr.response.data.message ||
            "Invalid credentials"
        );
      } else {
        console.error("Reason:", axiosErr.message);
      }
      console.log("Please try again.\n");
    }
  }

  // 2. Fetch active conversations
  console.log("\n🔄 Fetching active conversations...");
  let conversations: Conversation[] = [];
  try {
    const convRes = await axios.get<ConversationListResponse>(
      `${BASE_URL}/chats/conversations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    conversations = convRes.data.conversations || [];
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    console.error("❌ Failed to load conversations:", axiosErr.message);
    rl.close();
    return;
  }

  if (conversations.length === 0) {
    console.log("⚠️ You have no active conversations on this account.");
    console.log(
      "💡 Tip: Search for this user (User B) from your main app (User A) and send a message first to start a conversation!"
    );
    rl.close();
    return;
  }

  console.log("\n=======================================================");
  console.log("               Active Conversations                   ");
  console.log("=======================================================");
  conversations.forEach((c, index) => {
    const participant: Participant = c.participants?.[0] || {
      public_id: "",
      email: "Unknown",
      first_name: "Unknown",
      last_name: "",
    };
    const name =
      `${participant.first_name || ""} ${participant.last_name || ""}`.trim() ||
      participant.email ||
      "Unknown";
    console.log(`[${index + 1}] Chat with: ${name}`);
    console.log(
      `    Last message: "${c.last_message_preview || "No messages yet"}"`
    );
    console.log(`    Conversation ID: ${c.public_id}\n`);
  });

  let selectedConv: Conversation | null = null;
  while (!selectedConv) {
    const selection = await askQuestion(
      `👉 Select chat number (1-${conversations.length}): `
    );
    const idx = parseInt(selection, 10) - 1;

    if (idx >= 0 && idx < conversations.length) {
      selectedConv = conversations[idx];
    } else {
      console.log("❌ Invalid selection. Please enter a valid number.\n");
    }
  }

  const otherParticipant: Participant = selectedConv.participants?.[0] || {
    public_id: "",
    email: "User A",
    first_name: "User",
    last_name: "A",
  };
  const chatPartnerName =
    `${otherParticipant.first_name || ""} ${
      otherParticipant.last_name || ""
    }`.trim() ||
    otherParticipant.email ||
    "User A";

  console.log(`\n=======================================================`);
  console.log(`💬 Connected to chat with: ${chatPartnerName}`);
  console.log(`🔑 Conversation ID: ${selectedConv.public_id}`);
  console.log(`⌨️  Type your message below and press Enter to send.`);
  console.log(`🚪 Type 'exit' or press Ctrl+C to close.`);
  console.log(`=======================================================\n`);

  // 3. REPL loop for sending messages
  while (true) {
    const messageContent = await askQuestion("> ");
    if (messageContent.trim().toLowerCase() === "exit") {
      console.log("\n👋 Exiting chat simulator...");
      break;
    }

    if (!messageContent.trim()) {
      continue;
    }

    try {
      await axios.post(
        `${BASE_URL}/chats/messages`,
        {
          conversation_id: selectedConv.public_id,
          content: messageContent.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`🚀 Sent: "${messageContent.trim()}"`);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error("❌ Failed to send message:");
      if (axiosErr.response && axiosErr.response.data) {
        console.error("Error details:", axiosErr.response.data);
      } else {
        console.error(axiosErr.message);
      }
    }
  }

  rl.close();
}

run().catch((err) => {
  console.error("Fatal Error:", err);
  rl.close();
});
