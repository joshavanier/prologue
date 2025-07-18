import ProloguePlugin from "main";
import { ItemView, MarkdownRenderer, TFile, WorkspaceLeaf } from "obsidian";

export const PROLOGUE_VIEW_TYPE = "prologue-new-tab";
const PROLOGUE_CONTAINER_CLASS = "prologue-container";

export class PrologueView extends ItemView {
  constructor(
    leaf: WorkspaceLeaf,
    private plugin: ProloguePlugin,
  ) {
    super(leaf);
  }

  getViewType() {
    return PROLOGUE_VIEW_TYPE;
  }

  getDisplayText() {
    return "New Tab";
  }

  async onOpen() {
    await this.renderQuote();
  }

  async onRefresh() {
    await this.renderQuote();
  }

  private async renderQuote() {
    this.containerEl.empty();

    const quote = await this.loadQuote();

    const preview = this.containerEl.createDiv({
      cls: PROLOGUE_CONTAINER_CLASS,
    });

    await MarkdownRenderer.render(
      this.app,
      quote,
      preview,
      this.plugin.settings.file,
      this,
    );

    this.registerDomEvent(preview, "click", (e) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" &&
        target.classList.contains("internal-link")
      ) {
        e.preventDefault();
        this.app.workspace.openLinkText(
          target.getAttribute("href") ?? "",
          "",
          false,
        );
      }
    });
  }

  private async loadQuote(): Promise<string> {
    const { file } = this.plugin.settings;
    const abstract = this.app.vault.getAbstractFileByPath(file);
    if (!(abstract instanceof TFile)) return this.emptyMessage();

    try {
      const quotes = (await this.app.vault.read(abstract))
        .split(/\n{2,}/)
        .reduce<string[]>((acc, item) => {
          const trimmed = item.trim();
          if (trimmed) acc.push(trimmed);
          return acc;
        }, []);

      return quotes.length
        ? quotes[Math.floor(Math.random() * quotes.length)]
        : this.emptyMessage();
    } catch {
      return `Failed to read **${file}**`;
    }
  }

  private emptyMessage(): string {
    return `Hi! Add quotes or reminders to **${this.plugin.settings.file}**.`;
  }
}
