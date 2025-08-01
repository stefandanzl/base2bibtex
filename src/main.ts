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

		// let noteContent = "---\n";

		// for (const [bibtexField, sourceColumn] of Object.entries(allFields)) {
		// 	if (bibtexField.startsWith("_")) continue;

		// 	const value = entry[bibtexField.toLowerCase()];

		// 	if (value) {
		// 		noteContent += `${sourceColumn}: ${value}\n`;
		// 	}
		// }

		// noteContent += "---\n";

		const filePath = normalizePath(`${location}/${filename}.md`);

		try {
			const file = await this.app.vault.create(filePath, "");
			this.app.fileManager.processFrontMatter(file, (frontMatter) => {
				for (const [key, value] of Object.entries(allFields)) {
					// if (key.startsWith("_")) continue; // Skip structural fields
					const bibtexField = key.toLowerCase();
					if (entry[bibtexField]) {
						frontMatter[value] = entry[bibtexField];
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
