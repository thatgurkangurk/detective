import { createConsola } from "consola";
import { Client, type ClientOptions } from "discord.js";
import type { Module } from "./modules";

export class DetectiveClient extends Client {
  private modules = new Set<Module>();
  readonly logger = createConsola();

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
      await module.onLoad(this);
    });
  }
}
