import { GatewayIntentBits } from "discord.js";
import { env } from "./env";
import { DetectiveClient } from "./lib/client";
import { baseModule } from "./modules/base";
import { funModule } from "./modules/fun";
import { moderationModule } from "./modules/moderation";

export const client = new DetectiveClient({
  intents: [GatewayIntentBits.GuildMessages],
  modules: [baseModule, funModule, moderationModule],
});

client.login(env.BOT_TOKEN);
