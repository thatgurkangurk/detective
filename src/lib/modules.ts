/**
 * Module/command system inspiration (and parts of the code) come from github.com/Skekdog/Skekbot, MIT license.
 */

import type { Awaitable } from "discord.js";
import type { DetectiveClient } from "./client";
import type { Command } from "./command";

type ModuleUtilFunctions = {
  loadCommand: (command: Command) => void;
};

export type Module = {
  onLoad: (
    client: DetectiveClient,
    utils: ModuleUtilFunctions
  ) => Awaitable<void>;
};
