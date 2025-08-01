import ClipboardToBibTeXPlugin from "main";
import { Modal, App, Setting, Notice } from "obsidian";
import { parseBibTeXEntry, sanitizeFilename } from "utils";

export class TableToBibTeXModal extends Modal {
	plugin: ClipboardToBibTeXPlugin;
	tableInput: HTMLTextAreaElement;
	pathInput: HTMLInputElement;

	constructor(app: App, plugin: ClipboardToBibTeXPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl("h2", { text: "Convert Table to BibTeX" });

		// Table input area
		new Setting(contentEl)
			.setName("Paste your table here")
			.setDesc("Paste the markdown table from Obsidian or elsewhere");
		new Setting(contentEl).addTextArea((text) => {
			this.tableInput = text.inputEl;
			text.inputEl.rows = 15;
			text.inputEl.cols = 80;
			text.inputEl.placeholder = `| name | Status | year | citekey | bibtype |
|------|--------|------|---------|---------|
| Ara18 Dynamic Decoupling... | unread | 2018 | Ara18 | book |`;

			// Auto-paste from clipboard if available
			this.tryAutoPaste(text);
		});

		// Output path
		new Setting(contentEl)
			.setName("Export path")
			.setDesc("Where to save the BibTeX file (will overwrite if exists)")
			.addText((text) => {
				this.pathInput = text.inputEl;
				text.setValue(this.plugin.settings.lastExportPath);
				text.inputEl.style.width = "100%";
			});

		// Buttons
		const buttonContainer = contentEl.createDiv({
			cls: "modal-button-container",
		});
		buttonContainer.style.display = "flex";
		buttonContainer.style.gap = "10px";
		buttonContainer.style.justifyContent = "flex-end";
		buttonContainer.style.marginTop = "20px";

		// Convert button
		const convertBtn = buttonContainer.createEl("button", {
			text: "Convert to BibTeX",
			cls: "mod-cta",
		});
		convertBtn.addEventListener("click", async () => {
			const tableText = this.tableInput.value;
			const outputPath = this.pathInput.value;

			if (!tableText.trim()) {
				new Notice("Please paste a table first");
				return;
			}

			if (!outputPath.trim()) {
				new Notice("Please specify an output path");
				return;
			}

			const success = await this.plugin.exportBibTeX(
				tableText,
				outputPath
			);
			if (success) {
				this.close();
			}
		});

		// Cancel button
		const cancelBtn = buttonContainer.createEl("button", {
			text: "Cancel",
		});
		cancelBtn.addEventListener("click", () => {
			this.close();
		});

		// Focus the text area
		setTimeout(() => this.tableInput.focus(), 100);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async tryAutoPaste(textArea: any) {
		try {
			// Request text/plain to get raw tab-separated data
			const text = await navigator.clipboard.readText();
			if (text && text.trim()) {
				textArea.setValue(text);
			}
		} catch (error) {
			console.error("Clipboard access failed:", error);
		}
	}
}

export class BibTeXToNoteModal extends Modal {
	plugin: ClipboardToBibTeXPlugin;
	bibtexInput: HTMLTextAreaElement;
	locationInput: HTMLInputElement;
	filenameInput: HTMLInputElement;

	constructor(app: App, plugin: ClipboardToBibTeXPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl("h2", { text: "Create Note from BibTeX" });

		new Setting(contentEl)
			.setName("Paste your BibTeX snippet here")
			.setDesc("Paste a single BibTeX entry to create a new note.");

		new Setting(contentEl).addTextArea((text) => {
			this.bibtexInput = text.inputEl;
			text.inputEl.rows = 15;
			text.inputEl.cols = 80;
			text.inputEl.placeholder = `@article{...`;

			text.inputEl.addEventListener("input", () => {
				const bibtexText = this.bibtexInput.value;
				const parsedEntry = parseBibTeXEntry(bibtexText);
				if (parsedEntry && parsedEntry["title"]) {
					this.filenameInput.value = sanitizeFilename(
						parsedEntry["title"]
					);
				}
			});

			this.tryAutoPaste(text);
		});

		new Setting(contentEl)
			.setName("Note Location")
			.setDesc("The folder to save the new note in.")
			.addText((text) => {
				this.locationInput = text.inputEl;
				text.setValue(this.plugin.settings.noteLocation);
				text.inputEl.style.width = "100%";
			});

		new Setting(contentEl)
			.setName("Filename")
			.setDesc("The name of the new note file (without .md extension).")
			.addText((text) => {
				this.filenameInput = text.inputEl;
				text.inputEl.style.width = "100%";
			});

		const buttonContainer = contentEl.createDiv({
			cls: "modal-button-container",
		});
		buttonContainer.style.display = "flex";
		buttonContainer.style.gap = "10px";
		buttonContainer.style.justifyContent = "flex-end";
		buttonContainer.style.marginTop = "20px";

		const createBtn = buttonContainer.createEl("button", {
			text: "Create Note",
			cls: "mod-cta",
		});
		createBtn.addEventListener("click", async () => {
			const bibtexText = this.bibtexInput.value;
			const noteLocation = this.locationInput.value;
			const filename = this.filenameInput.value;

			if (!bibtexText.trim()) {
				new Notice("Please paste a BibTeX snippet first");
				return;
			}

			if (!filename.trim()) {
				new Notice("Please enter a filename");
				return;
			}

			const sanitizedFilename = sanitizeFilename(filename);
			if (sanitizedFilename !== filename) {
				new Notice(
					"Filename contains invalid characters. They have been replaced."
				);
				this.filenameInput.value = sanitizedFilename;
				// return;
			}

			this.plugin.settings.noteLocation = noteLocation;
			await this.plugin.saveSettings();

			const parsedEntry = parseBibTeXEntry(bibtexText);

			if (!parsedEntry) {
				new Notice("Could not parse BibTeX entry.");
				return;
			}

			await this.plugin.createNoteFromBibTeX(
				parsedEntry,
				noteLocation,
				sanitizedFilename
			);

			this.close();
		});

		const cancelBtn = buttonContainer.createEl("button", {
			text: "Cancel",
		});
		cancelBtn.addEventListener("click", () => {
			this.close();
		});

		setTimeout(() => this.bibtexInput.focus(), 100);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async tryAutoPaste(textArea: any) {
		try {
			const text = await navigator.clipboard.readText();
			if (text && text.trim()) {
				textArea.setValue(text);
			}
		} catch (error) {
			console.error("Clipboard access failed:", error);
		}
	}
}
