/**
 * Module/command system inspiration (and parts of the code) come from github.com/Skekdog/Skekbot, MIT license.
 */

import { createConsola } from "consola";
import {
  type ChatInputCommandInteraction,
  Client,
  type ClientOptions,
  Collection,
  Routes,
} from "discord.js";
import type { Command } from "./command";
import type { Module } from "./modules";

export class DetectiveClient extends Client {
  private modules = new Set<Module>();
  private commands = new Collection<string, Command>();
  readonly logger = createConsola();

  private async respondToChatCommand(interaction: ChatInputCommandInteraction) {
    const command = this.commands.get(interaction.commandName);

    if (!command) {
      this.logger.error(
        `tried to execute ${interaction.commandName}, but it doesn't exist.`
      );
      throw new Error(
        `command ${interaction.commandName} could not be found. is it loaded?`
      );
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      this.logger.error(err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content:
            "something went wrong when trying to execute this command. sorry!",
          flags: "Ephemeral",
        });
        return;
      }
      await interaction.reply({
        content:
          "something went wrong when trying to execute this command. sorry!",
        flags: "Ephemeral",
      });
    }
  }

  private async loadCommands() {
    this.on("interactionCreate", async (interaction) => {
      if (interaction.isChatInputCommand()) {
        await this.respondToChatCommand(interaction);
      }
    });

    if (!this.application)
      throw new Error("this bot doesn't seem to have an application");

    try {
      const globalCommands = this.commands
        .filter((command) => !command.devServerOnly)
        .map((command) => command.data);

      this.logger.start(`publishing ${globalCommands.length} global commands`);

      await this.rest.put(Routes.applicationCommands(this.application.id), {
        body: globalCommands,
      });

      this.logger.success(`published ${globalCommands.length} global commands`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  constructor(
    options: ClientOptions & {
      modules: Module[];
    }
  ) {
    super(options);
    for (const module of options.modules) {
      this.modules.add(module);
    }
    this.modules.forEach(async (module) => {
      await module.onLoad(this, {
        loadCommand: (command) => {
          this.commands.set(command.data.name, command);
        },
      });
    });

    this.once("clientReady", async () => {
      if (this.commands.size > 0) await this.loadCommands();
    });
  }
}
