import type { Awaitable } from "discord.js";
import type { DetectiveClient } from "./client";

export type Module = {
  onLoad: (client: DetectiveClient) => Awaitable<void>;
};
