import { GatewayIntentBits } from "discord.js";
import { env } from "./env";
import { DetectiveClient } from "./lib/client";
import { baseModule } from "./modules/base";

const client = new DetectiveClient({
  intents: [GatewayIntentBits.GuildMessages],
  modules: [baseModule],
});

client.login(env.BOT_TOKEN);
