export interface FieldMappings {
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

export interface ClipboardToBibTeXSettings {
	lastExportPath: string;
	fieldMappings: FieldMappings;
	separator: string;
	noteLocation: string;
}

export const DEFAULT_FIELD_MAPPINGS: FieldMappings = {
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

export const DEFAULT_SETTINGS: ClipboardToBibTeXSettings = {
	lastExportPath: "references.bib",
	fieldMappings: DEFAULT_FIELD_MAPPINGS,
	separator: "\t", // Default to markdown table format
	noteLocation: "/",
};

export interface TableRow {
	[key: string]: string;
}
