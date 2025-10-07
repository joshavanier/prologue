import { Notice, Plugin } from "obsidian";
import {
  PROLOGUE_DEFAULT_FILE,
  PROLOGUE_DEFAULT_SETTINGS,
  PrologueSettingTab,
} from "src/settings";
import { PROLOGUE_VIEW_TYPE, PrologueView } from "src/view";

export default class ProloguePlugin extends Plugin {
  settings = { ...PROLOGUE_DEFAULT_SETTINGS };
  styleID = "prologue-tab-override";

  async onload() {
    Object.assign(this.settings, (await this.loadData()) ?? {});
    this.settings.file ||= PROLOGUE_DEFAULT_SETTINGS.file;

    this.app.workspace.onLayoutReady(() => this.loadSample());

    this.registerView(
      PROLOGUE_VIEW_TYPE,
      (leaf) => new PrologueView(leaf, this),
    );
    this.addSettingTab(new PrologueSettingTab(this.app, this));

    const show = () => this.showPrologue();
    this.registerEvent(this.app.workspace.on("layout-change", show));
    this.app.workspace.onLayoutReady(show);
  }

  onunload() {
    document.getElementById(this.styleID)?.remove();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async loadSample() {
    const file = this.settings.file;
    const existing = this.app.vault.getAbstractFileByPath(file);

    if (existing) return;

    try {
      const samplePath = `${this.manifest.dir}/${PROLOGUE_DEFAULT_FILE}`;
      const sampleContent = await this.app.vault.adapter.read(samplePath);

      await this.app.vault.create(file, sampleContent);
    } catch (error) {
      new Notice(`Prologue failed to create sample file. See console.`);
      console.error(error);
    }
  }

  showPrologue() {
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (leaf?.getViewState().type !== "empty") return;
    leaf.setViewState({ type: PROLOGUE_VIEW_TYPE });
  }
}
