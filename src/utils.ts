import { BibtexParser } from "bibtex-js-parser";
import { Notice } from "obsidian";
import { decodeString } from "unicode-tex-character-converter";

export function extractTitle(fullTitle: string): string {
	// Remove citekey prefix like "Ara18 " from "Ara18 Dynamic Decoupling of Robot Manipulators"
	const match = fullTitle.match(/^[A-Z]+\d+[-\w]*\s+(.+)$/);
	return match ? match[1] : fullTitle;
}

export function extractAuthor(fullTitle: string, authorField?: string): string {
	if (authorField && authorField.trim()) {
		return authorField.trim();
	}

	// Try to extract author from citekey (e.g., "Ara18" -> "Araujo")
	// This is a basic heuristic - you might want to improve this
	const citekeyMatch = fullTitle.match(/^([A-Z]+)\d+/);
	if (citekeyMatch) {
		const authorCode = citekeyMatch[1];
		// This is a placeholder - in practice you'd need a mapping or better logic
		return `${authorCode} et al.`;
	}

	return "";
}

export function normalizeBibType(type: string): string {
	const normalized = type.toLowerCase();
	switch (normalized) {
		case "paper":
		case "article":
			return "article";
		case "book":
			return "book";
		case "conference":
		case "inproceedings":
			return "inproceedings";
		default:
			return "misc";
	}
}

export function escapeLatex(text: string): string {
	if (!text) return "";
	const map: { [key: string]: string } = {
		"&": "\\&",
		"%": "\\%",
		$: "\\$",
		"#": "\\#",
		_: "\\_",
		"{": "\\{",
		"}": "\\}",
		"~": "\\textasciitilde{}",
		"^": "\\textasciicircum{}",
		"\\": "\\textbackslash{}",
		'"': "\\textquotedbl{}",
	};
	return text.replace(/[&%$#_{}~^"\\]/g, (m) => map[m]);
}

export function sanitizeFilename(filename: string): string {
	// Replace characters that are not allowed in filenames
	return filename.replace(/[/\\?%*:|"<>]/g, "-");
}

export function getRequiredFields(bibtype: string): string[] {
	switch (bibtype.toLowerCase()) {
		case "article":
			return ["author", "journal"];
		case "book":
			return ["author", "publisher"];
		case "inproceedings":
			return ["author", "booktitle"];
		case "incollection":
			return ["author", "booktitle"];
		case "inbook":
			return ["author", "publisher"];
		case "proceedings":
			return ["publisher"];
		case "manual":
			return ["organization"];
		case "techreport":
			return ["author", "institution"];
		case "mastersthesis":
		case "phdthesis":
			return ["author", "school"];
		case "unpublished":
			return ["author", "note"];
		default:
			return ["author"];
	}
}

export function parseBibTeXEntry(
	bibtex: string
): { [key: string]: string } | null {
	try {
		const parsed = BibtexParser.parseToJSON(bibtex);

		console.log(parsed);
		if (parsed.length !== 1) {
			new Notice("Only single BibTeX entries are supported.");
			return null;
		}

		const entry = parsed[0];
		const result: { [key: string]: string } = {};

		for (const [key, value] of Object.entries(entry)) {
			if (key === "id") {
				result["_citekey"] = entry.id;
			} else if (key === "type") {
				result["_bibtype"] = entry.type.toLowerCase();
			} else {
				result[key.toLowerCase()] = String(decodeString(value));
			}
		}

		return result;
	} catch (e) {
		console.error("BibTeX parsing error:", e);
		return null;
	}
}

/*

 if (key === "author") {
				// Normalize author field to "author" for consistency
				result["author"] = String(decodeString(value))
					.split(" and ")
					.map((name) => {
						if (!name.includes(",")) return name.trim();
						let nameSplit = name.split(",");
						nameSplit = nameSplit.map((part) => part.trim());
						if (nameSplit.length === 2) {
							// Format "Last, First" to "First Last"
							return `${nameSplit[1]} ${nameSplit[0]}`;
						} else if (nameSplit.length === 3) {
							// Handle cases like "Last, First Middle"
							return `${nameSplit[1]} ${nameSplit[0]} ${nameSplit[0]}`;
						}
						return name.trim();
					});
			} 


			*/
