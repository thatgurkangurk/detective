/**
 * Module/command system inspiration (and parts of the code) come from github.com/Skekdog/Skekbot, MIT license.
 */
import type { ConsolaInstance } from "consola";
import type {
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type Command = {
  devServerOnly?: boolean;
  data: SlashCommandOptionsOnlyBuilder;
  execute(
    interaction: ChatInputCommandInteraction,
    utils: {
      logger: ConsolaInstance;
    }
  ): Promise<void>;
};
