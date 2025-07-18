import { App, PluginSettingTab, Setting } from "obsidian";
import ProloguePlugin from "../main";

export const PROLOGUE_DEFAULT_FILE = "collection.md";

export const PROLOGUE_DEFAULT_SETTINGS: { file: string } = {
  file: PROLOGUE_DEFAULT_FILE,
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
      .setName("Collection file")
      .setDesc("Path to the note containing your quotes or reminders")
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
