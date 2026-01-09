import { GatewayIntentBits } from "discord.js";
import { env } from "./env";
import { DetectiveClient } from "./lib/client";
import { baseModule } from "./modules/base";
import { funModule } from "./modules/fun";

const client = new DetectiveClient({
  intents: [GatewayIntentBits.GuildMessages],
  modules: [baseModule, funModule],
});

client.login(env.BOT_TOKEN);
