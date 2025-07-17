import { App, PluginSettingTab, Setting } from "obsidian";
import ProloguePlugin from "../main";

export const PROLOGUE_DEFAULT_FILE = "collection.md";

export interface ProloguePluginSettings {
  file: string;
}

export const PROLOGUE_DEFAULT_SETTINGS: ProloguePluginSettings = {
  file: "collection.md",
};

export class PrologueSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private plugin: ProloguePlugin,
  ) {
    super(app, plugin);
  }

  display() {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Prologue Settings" });

    new Setting(this.containerEl)
      .setName("Prologue file")
      .setDesc(
        "Path to the file that houses your collection of quotes, reminders, notes to self, etc.",
      )
      .addText((text) => {
        text
          .setPlaceholder(PROLOGUE_DEFAULT_SETTINGS.file)
          .setValue(this.plugin.settings.file)
          .onChange((value) => this.updateFile(value));
      });
  }

  private async updateFile(value: string) {
    this.plugin.settings.file = value.trim() || PROLOGUE_DEFAULT_SETTINGS.file;
    await this.plugin.saveSettings();
    this.plugin.showPrologue();
  }
}
