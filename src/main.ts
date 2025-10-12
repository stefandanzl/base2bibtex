<<<<<<< HEAD:main.ts
import {
	App,
	Plugin,
	Modal,
	Setting,
	Notice,
	TFile,
	BasesView,
} from "obsidian";

interface FieldMappings {
	all: { [bibtexField: string]: string };
	article: { [bibtexField: string]: string };
	book: { [bibtexField: string]: string };
	inproceedings: { [bibtexField: string]: string };
	incollection: { [bibtexField: string]: string };
	inbook: { [bibtexField: string]: string };
	proceedings: { [bibtexField: string]: string };
	manual: { [bibtexField: string]: string };
	techreport: { [bibtexField: string]: string };
	mastersthesis: { [bibtexField: string]: string };
	phdthesis: { [bibtexField: string]: string };
	unpublished: { [bibtexField: string]: string };
	misc: { [bibtexField: string]: string };
	[key: string]: { [bibtexField: string]: string }; // Index signature
}

interface ClipboardToBibTeXSettings {
	lastExportPath: string;
	fieldMappings: FieldMappings;
	separator: string;
}

const DEFAULT_FIELD_MAPPINGS: FieldMappings = {
	// Fields that apply to all entry types
	all: {
		_CITEKEY: "citekey", // Structural: maps to source column for citation key
		_BIBTYPE: "bibtype", // Structural: maps to source column for entry type
		author: "author", // BibTeX field: maps to source column
		title: "title", // BibTeX field: maps to source column (or "name")
		year: "year",
		doi: "doi",
		isbn: "isbn",
		url: "url",
		abstract: "abstract",
		keywords: "keywords",
	},

	// Journal articles
	article: {
		journal: "publication",
		pages: "articlepages",
	},

	// Books
	book: {
		publisher: "publication",
	},

	// Conference papers
	inproceedings: {
		booktitle: "publication",
		pages: "articlepages",
	},

	// Book chapters
	incollection: {
		booktitle: "publication",
		pages: "articlepages",
	},

	// Part of a book
	inbook: {
		publisher: "publication",
		pages: "articlepages",
	},

	// Conference proceedings
	proceedings: {
		publisher: "publication",
	},

	// Technical manual
	manual: {
		organization: "publication",
	},

	// Technical reports
	techreport: {
		institution: "publication",
	},

	// Master's thesis
	mastersthesis: {
		school: "publication",
	},

	// PhD thesis
	phdthesis: {
		school: "publication",
	},

	// Unpublished work
	unpublished: {
		note: "publication",
	},

	// Miscellaneous
	misc: {
		howpublished: "publication",
	},
};

const DEFAULT_SETTINGS: ClipboardToBibTeXSettings = {
	lastExportPath: "references.bib",
	fieldMappings: DEFAULT_FIELD_MAPPINGS,
	separator: "\t", // Default to markdown table format
};

interface TableRow {
	[key: string]: string;
}
=======
import { Plugin, Notice, TFile, normalizePath } from "obsidian";
import { TableToBibTeXModal, BibTeXToNoteModal } from "modals";
import { ClipboardToBibTeXSettings, DEFAULT_SETTINGS, TableRow } from "./const";
import {
	normalizeBibType,
	extractTitle,
	escapeLatex,
	extractAuthor,
	getRequiredFields,
} from "utils";
import { decodeString } from "unicode-tex-character-converter";
>>>>>>> ac300e0d4581653c4b720a874845abc9cfb44278:src/main.ts

export default class ClipboardToBibTeXPlugin extends Plugin {
	settings: ClipboardToBibTeXSettings;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon
		/** this.addRibbonIcon("clipboard", "Convert Table to BibTeX", () => {
			new TableToBibTeXModal(this.app, this).open();
		});*/

		// Add command
		this.addCommand({
			id: "base-to-bibtex",
			name: "Convert Base to BibTeX",
			callback: () => {
				baseToBibTeX(this.app, this);
			},
		});

		// Add command
		this.addCommand({
			id: "table-to-bibtex",
			name: "Convert Table to BibTeX",
			callback: () => {
				new TableToBibTeXModal(this.app, this).open();
			},
		});

		this.addCommand({
			id: "bibtex-to-note",
			name: "Create Note from BibTeX",
			callback: () => {
				new BibTeXToNoteModal(this.app, this).open();
			},
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	parseTableData(tableText: string): TableRow[] {
		const separator = this.settings.separator;
		const lines = tableText
			.trim()
			.split("\n")
			.filter((line) => line.trim());

		console.log(
			"parseTableData - Input:",
			tableText.substring(0, 200) + "..."
		);
		console.log("parseTableData - Separator:", JSON.stringify(separator));
		console.log("parseTableData - Lines found:", lines.length);

		if (lines.length < 2) {
			console.log("parseTableData - ERROR: Not enough lines");
			return [];
		}

		// Parse header to get expected column count
		const headers = this.parseLineWithSeparator(lines[0], separator)
			.map((h) => h.trim())
			.filter((h) => h !== "");

		const expectedColumns = headers.length;
		console.log(
			"parseTableData - Headers:",
			headers,
			`(${expectedColumns} columns expected)`
		);

		// Check if all lines have consistent column count
		const columnCounts = lines
			.slice(1)
			.map((line, index) => {
				if (
					!line.trim() ||
					(separator === "|" && line.match(/^[|\-\s]+$/))
				) {
					return null; // Skip separator lines
				}
				const values = this.parseLineWithSeparator(line, separator);
				return {
					lineIndex: index + 1,
					count: values.length,
					line: line.trim(),
				};
			})
			.filter((item) => item !== null);

		const inconsistentLines = columnCounts.filter(
			//@ts-ignore
			(item) => item.count !== expectedColumns
		);
		if (inconsistentLines.length > 0) {
			console.log(
				"parseTableData - Column count inconsistencies found:",
				inconsistentLines
			);
			console.log(
				"parseTableData - This may cause data misalignment, but continuing..."
			);
		}

		// Parse data rows (process all rows, handle missing data gracefully)
		const rows: TableRow[] = [];
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line || (separator === "|" && line.match(/^[|\-\s]+$/))) {
				console.log(
					`parseTableData - Skipping empty/separator line ${i}`
				);
				continue;
			}

			const values = this.parseLineWithSeparator(line, separator);

			// Always create a row, fill missing columns with empty strings
			const row: TableRow = {};
			headers.forEach((header, index) => {
				row[header] = values[index]?.trim() || ""; // Empty string if missing
			});
			rows.push(row);

			if (values.length !== expectedColumns) {
				console.log(
					`parseTableData - Line ${i}: Column count mismatch (${values.length} vs ${expectedColumns}) - filled missing with empty strings`
				);
			}
		}

		console.log(
			`parseTableData - Final result: ${rows.length} rows processed`
		);
		return rows;
	}

	parseLineWithSeparator(line: string, separator: string): string[] {
		if (separator === "|") {
			// Handle markdown table format: | col1 | col2 | col3 |
			return line
				.split("|")
				.map((cell) => cell.trim())
				.filter((cell, index, array) => {
					// Remove empty cells from start/end but keep middle ones
					return (
						!(index === 0 && cell === "") &&
						!(index === array.length - 1 && cell === "")
					);
				});
		} else {
			return line.split(separator).map((cell) => cell.trim());
		}
	}

	generateBibTeXFromTable(rows: TableRow[]): string[] {
		const entries: string[] = [];
		const missingFields: { [bibtype: string]: Set<string> } = {};

		for (const row of rows) {
			const entry = this.createBibTeXEntry(row);
			if (entry) {
				entries.push(entry);

				// Check for missing required fields
				const bibtype = normalizeBibType(
					row[this.settings.fieldMappings.all["_BIBTYPE"]] || "misc"
				);
				const requiredFields = getRequiredFields(bibtype);
				const missingForEntry = requiredFields.filter((field) => {
					const sourceColumn =
						this.settings.fieldMappings.all[field] ||
						this.settings.fieldMappings[bibtype]?.[field];
					return (
						!sourceColumn ||
						!row[sourceColumn] ||
						!row[sourceColumn].trim()
					);
				});

				if (missingForEntry.length > 0) {
					if (!missingFields[bibtype]) {
						missingFields[bibtype] = new Set();
					}
					missingForEntry.forEach((field) =>
						missingFields[bibtype].add(field)
					);
				}
			}
		}

		// Show notice for missing required fields
		if (Object.keys(missingFields).length > 0) {
			let message = "Warning: Some required BibTeX fields are missing:\n";
			for (const [bibtype, fields] of Object.entries(missingFields)) {
				message += `• ${bibtype}: ${Array.from(fields).join(", ")}\n`;
			}
			message +=
				"\nEntries were still generated but may not be complete.";
			new Notice(message, 8000);
		}

		return entries;
	}

	createBibTeXEntry(row: TableRow): string | null {
		const mappings = this.settings.fieldMappings;

		// Get structural fields using mappings
		const citekeyCol = mappings.all["_CITEKEY"];
		const bibtypeCol = mappings.all["_BIBTYPE"];
		const titleCol = mappings.all["title"] || "name"; // fallback to "name" for your data

		const citekey = row[citekeyCol];
		const bibtype = normalizeBibType(row[bibtypeCol] || "misc");
		const title = extractTitle(row[titleCol] || "");

		// Only require citekey and title - other fields are optional
		if (!citekey || !title) {
			return null;
		}

		let entry = `@${bibtype}{${citekey},\n`;

		// Get combined field mappings for this entry type
		const typeMapping = mappings[bibtype] || {};
		const allFields = { ...mappings.all, ...typeMapping };

		// Process each BibTeX field
		for (const [bibtexField, sourceColumn] of Object.entries(allFields)) {
			// Skip structural fields (they're handled separately)
			if (bibtexField.startsWith("_")) continue;

			const value = row[sourceColumn as string];

			// Skip missing/empty fields silently
			if (!value || !value.trim()) continue;

			const escapedValue = escapeLatex(value.trim());

			// Special handling for certain fields
			if (bibtexField === "pages" && value.includes("-")) {
				const pages = value.replace(/-/g, "--");
				entry += `  ${bibtexField} = {${pages}},\n`;
			} else if (bibtexField === "title") {
				const cleanTitle = extractTitle(value);
				entry += `  ${bibtexField} = {${escapeLatex(cleanTitle)}},\n`;
			} else if (bibtexField === "author") {
				const author = extractAuthor(value, row.author);
				if (author) {
					entry += `  ${bibtexField} = {${escapeLatex(author)}},\n`;
				}
			} else {
				entry += `  ${bibtexField} = {${escapedValue}},\n`;
			}
		}

		// Remove trailing comma and close
		entry = entry.replace(/,\n$/, "\n");
		entry += "}";

		return entry;
	}

	async createNoteFromBibTeX(
		entry: { [key: string]: string },
		location: string,
		filename: string
	) {
		const bibtype = entry["_bibtype"];
		const typeMapping = this.settings.fieldMappings[bibtype] || {};
		const allFields = {
			...this.settings.fieldMappings.all,
			...typeMapping,
		};

		const filePath = normalizePath(`${location}/${filename}.md`);

		try {
			const file = await this.app.vault.create(filePath, "");
			this.app.fileManager.processFrontMatter(file, (frontMatter) => {
				for (const [key, value] of Object.entries(allFields)) {
					// if (key.startsWith("_")) continue; // Skip structural fields
					const bibtexField = key.toLowerCase();

					if (key === "author") {
						frontMatter[value] = String(
							decodeString(entry[bibtexField])
						)
							.split(" and ")
							.map((name) => {
								if (!name.includes(",")) return name.trim();
								let nameSplit = name.split(",");
								nameSplit = nameSplit.map((part) =>
									part.trim()
								);
								if (nameSplit.length === 2) {
									// Format "Last, First" to "First Last"
									return `${nameSplit[1]} ${nameSplit[0]}`;
								} else if (nameSplit.length === 3) {
									// Handle cases like "Last, First Middle"
									return `${nameSplit[1]} ${nameSplit[0]} ${nameSplit[0]}`;
								}
								return name.trim();
							});
					} else {
						if (entry[bibtexField]) {
							frontMatter[value] = entry[bibtexField];
						}
					}
				}
			});
			new Notice(`Successfully created note: ${filePath}`);
		} catch (error) {
			console.error("Error creating note:", error);
			new Notice("Error creating note: " + error.message);
		}
	}

	async exportBibTeX(
		tableText: string,
		outputPath: string
	): Promise<boolean> {
		try {
			const rows = this.parseTableData(tableText);

			if (rows.length === 0) {
				new Notice("No valid table data found");
				return false;
			}

			const bibEntries = this.generateBibTeXFromTable(rows);

			if (bibEntries.length === 0) {
				new Notice("No valid BibTeX entries could be generated");
				return false;
			}

			// Check if file exists and overwrite or create new
			const bibContent = bibEntries.join("\n\n");
			const existingFile =
				this.app.vault.getAbstractFileByPath(outputPath);

			if (existingFile && existingFile instanceof TFile) {
				await this.app.vault.modify(existingFile, bibContent);
			} else {
				await this.app.vault.create(outputPath, bibContent);
			}

			// Remember the export path
			this.settings.lastExportPath = outputPath;
			await this.saveSettings();

			new Notice(
				`Successfully exported ${bibEntries.length} entries to ${outputPath}`
			);
			return true;
		} catch (error) {
			console.error("Table to BibTeX conversion error:", error);
			new Notice("Error converting table: " + error.message);
			return false;
		}
	}
}
<<<<<<< HEAD:main.ts

function baseToBibTeX(app: App, plugin: ClipboardToBibTeXPlugin) {
	const file = app.workspace.getActiveFile();
	console.log(file);
	if (file) {
		console.log("Current file path:", file.path);
		console.log("Current file name:", file.name);

		console.log();

		// const leaf = app.workspace.activeLeaf;
		const leaf = app.workspace.getActiveViewOfType(BasesView);
		// if (leaf && leaf.view instanceof BasesView) {
		if (leaf) {
			const basesView = leaf;
			console.log("Bases view config:", basesView.config);
			console.log("Bases data:", basesView.data);
		}
	} else {
		console.log("No file currently open.");
	}
}

class TableToBibTeXModal extends Modal {
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
=======
>>>>>>> ac300e0d4581653c4b720a874845abc9cfb44278:src/main.ts
