// Comprehensive LaTeX-to-Unicode mapping for BibTeX
export const LATEX_TO_UNICODE_MAP: Record<string, string> = {
	// Acute accents (´) - Multiple syntax variations
	"{\\'a}": "á",
	"{\\'A}": "Á",
	"{\\'e}": "é",
	"{\\'E}": "É",
	"{\\'i}": "í",
	"{\\'I}": "Í",
	"{\\'o}": "ó",
	"{\\'O}": "Ó",
	"{\\'u}": "ú",
	"{\\'U}": "Ú",
	"{\\'y}": "ý",
	"{\\'Y}": "Ý",
	"{\\'c}": "ć",
	"{\\'C}": "Ć",
	"{\\'n}": "ń",
	"{\\'N}": "Ń",
	"{\\'s}": "ś",
	"{\\'S}": "Ś",
	"{\\'z}": "ź",
	"{\\'Z}": "Ź",
	// Alternative syntax variations
	"\\'{a}": "á",
	"\\'{A}": "Á",
	"\\'{e}": "é",
	"\\'{E}": "É",
	"\\'e": "é",
	"\\'E": "É",
	"\\'a": "á",
	"\\'A": "Á",
	"\\'{i}": "í",
	"\\'{I}": "Í",
	"\\'{o}": "ó",
	"\\'{O}": "Ó",
	"\\'{u}": "ú",
	"\\'{U}": "Ú",

	// Grave accents (`)
	"{\\`a}": "à",
	"{\\`A}": "À",
	"{\\`e}": "è",
	"{\\`E}": "È",
	"{\\`i}": "ì",
	"{\\`I}": "Ì",
	"{\\`o}": "ò",
	"{\\`O}": "Ò",
	"{\\`u}": "ù",
	"{\\`U}": "Ù",

	// Circumflex (^)
	"{\\^a}": "â",
	"{\\^A}": "Â",
	"{\\^e}": "ê",
	"{\\^E}": "Ê",
	"{\\^i}": "î",
	"{\\^I}": "Î",
	"{\\^o}": "ô",
	"{\\^O}": "Ô",
	"{\\^u}": "û",
	"{\\^U}": "Û",

	// Umlaut/Diaeresis (¨) - Multiple syntax variations
	'{\\"a}': "ä",
	'{\\"A}': "Ä",
	'{\\"e}': "ë",
	'{\\"E}': "Ë",
	'{\\"i}': "ï",
	'{\\"I}': "Ï",
	'{\\"o}': "ö",
	'{\\"O}': "Ö",
	'{\\"u}': "ü",
	'{\\"U}': "Ü",
	// Alternative syntax - braces around letter
	'\\"{a}': "ä",
	'\\"{A}': "Ä",
	'\\"{e}': "ë",
	'\\"{E}': "Ë",
	'\\"{i}': "ï",
	'\\"{I}': "Ï",
	'\\"{o}': "ö",
	'\\"{O}': "Ö",
	'\\"{u}': "ü",
	'\\"{U}': "Ü",
	// Minimal syntax
	'\\"a': "ä",
	'\\"A': "Ä",
	'\\"e': "ë",
	'\\"E': "Ë",
	'\\"i': "ï",
	'\\"I': "Ï",
	'\\"o': "ö",
	'\\"O': "Ö",
	'\\"u': "ü",
	'\\"U': "Ü",

	// Tilde (~)
	"{\\~a}": "ã",
	"{\\~A}": "Ã",
	"{\\~e}": "ẽ",
	"{\\~E}": "Ẽ",
	"{\\~i}": "ĩ",
	"{\\~I}": "Ĩ",
	"{\\~o}": "õ",
	"{\\~O}": "Õ",
	"{\\~u}": "ũ",
	"{\\~U}": "Ũ",
	"{\\~n}": "ñ",
	"{\\~N}": "Ñ",

	// Caron/Háček (ˇ) - very common in Czech/Slovak
	"{\\v{a}}": "ǎ",
	"{\\v{A}}": "Ǎ",
	"{\\v{c}}": "č",
	"{\\v{C}}": "Č",
	"{\\v{d}}": "ď",
	"{\\v{D}}": "Ď",
	"{\\v{e}}": "ě",
	"{\\v{E}}": "Ě",
	"{\\v{g}}": "ǧ",
	"{\\v{G}}": "Ǧ",
	"{\\v{h}}": "ȟ",
	"{\\v{H}}": "Ȟ",
	"{\\v{i}}": "ǐ",
	"{\\v{I}}": "Ǐ",
	"{\\v{j}}": "ǰ",
	"{\\v{J}}": "J̌",
	"{\\v{k}}": "ǩ",
	"{\\v{K}}": "Ǩ",
	"{\\v{l}}": "ľ",
	"{\\v{L}}": "Ľ",
	"{\\v{n}}": "ň",
	"{\\v{N}}": "Ň",
	"{\\v{o}}": "ǒ",
	"{\\v{O}}": "Ǒ",
	"{\\v{r}}": "ř",
	"{\\v{R}}": "Ř",
	"{\\v{s}}": "š",
	"{\\v{S}}": "Š",
	"{\\v{t}}": "ť",
	"{\\v{T}}": "Ť",
	"{\\v{u}}": "ǔ",
	"{\\v{U}}": "Ǔ",
	"{\\v{z}}": "ž",
	"{\\v{Z}}": "Ž",

	// Cedilla (¸)
	"{\\c{c}}": "ç",
	"{\\c{C}}": "Ç",
	"{\\c{g}}": "ģ",
	"{\\c{G}}": "Ģ",
	"{\\c{k}}": "ķ",
	"{\\c{K}}": "Ķ",
	"{\\c{l}}": "ļ",
	"{\\c{L}}": "Ļ",
	"{\\c{n}}": "ņ",
	"{\\c{N}}": "Ņ",
	"{\\c{r}}": "ŗ",
	"{\\c{R}}": "Ŗ",
	"{\\c{s}}": "ş",
	"{\\c{S}}": "Ş",
	"{\\c{t}}": "ţ",
	"{\\c{T}}": "Ţ",

	// Ring above (˚)
	"{\\r{a}}": "å",
	"{\\r{A}}": "Å",
	"{\\r{u}}": "ů",
	"{\\r{U}}": "Ů",

	// Macron (¯)
	"{\\=a}": "ā",
	"{\\=A}": "Ā",
	"{\\=e}": "ē",
	"{\\=E}": "Ē",
	"{\\=i}": "ī",
	"{\\=I}": "Ī",
	"{\\=o}": "ō",
	"{\\=O}": "Ō",
	"{\\=u}": "ū",
	"{\\=U}": "Ū",

	// Breve (˘)
	"{\\u{a}}": "ă",
	"{\\u{A}}": "Ă",
	"{\\u{e}}": "ĕ",
	"{\\u{E}}": "Ĕ",
	"{\\u{g}}": "ğ",
	"{\\u{G}}": "Ğ",
	"{\\u{i}}": "ĭ",
	"{\\u{I}}": "Ĭ",
	"{\\u{o}}": "ŏ",
	"{\\u{O}}": "Ŏ",
	"{\\u{u}}": "ŭ",
	"{\\u{U}}": "Ŭ",

	// Dot above (˙)
	"{\\.c}": "ċ",
	"{\\.C}": "Ċ",
	"{\\.e}": "ė",
	"{\\.E}": "Ė",
	"{\\.g}": "ġ",
	"{\\.G}": "Ġ",
	"{\\.i}": "ı",
	"{\\.I}": "İ",
	"{\\.z}": "ż",
	"{\\.Z}": "Ż",

	// Stroke/Bar
	"{\\l}": "ł",
	"{\\L}": "Ł",
	"{\\o}": "ø",
	"{\\O}": "Ø",
	"{\\d}": "đ",
	"{\\D}": "Đ",

	// Double acute (˝)
	"{\\H{o}}": "ő",
	"{\\H{O}}": "Ő",
	"{\\H{u}}": "ű",
	"{\\H{U}}": "Ű",

	// Ogonek (˛)
	"{\\k{a}}": "ą",
	"{\\k{A}}": "Ą",
	"{\\k{e}}": "ę",
	"{\\k{E}}": "Ę",
	"{\\k{i}}": "į",
	"{\\k{I}}": "Į",
	"{\\k{o}}": "ǫ",
	"{\\k{O}}": "Ǫ",
	"{\\k{u}}": "ų",
	"{\\k{U}}": "Ų",

	// Special characters
	"{\\ae}": "æ",
	"{\\AE}": "Æ",
	"{\\oe}": "œ",
	"{\\OE}": "Œ",
	"{\\ss}": "ß",
	"{\\SS}": "SS",
	"{\\dh}": "ð",
	"{\\DH}": "Ð",
	"{\\th}": "þ",
	"{\\TH}": "Þ",

	// Common symbols
	"{\\&}": "&",
	"{\\$}": "$",
	"{\\%}": "%",
	"{\\#}": "#",
	"{\\_}": "_",
	"{\\{}": "{",
	"{\\}}": "}",
	"\\&": "&",
	"\\$": "$",
	"\\%": "%",
	"\\#": "#",
	"\\_": "_",
};

/**
 * Convert LaTeX-encoded text to Unicode
 * @param text - Text with LaTeX commands
 * @returns Unicode text
 */
export function convertLatexToUnicode(text: string): string {
	if (!text) return text;

	let result: string = text;

	// Apply all mappings
	for (const [latex, unicode] of Object.entries(LATEX_TO_UNICODE_MAP)) {
		// Use global replacement with regex for compatibility
		const escapedLatex = latex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
		result = result.replace(new RegExp(escapedLatex, "g"), unicode);
	}

	// Remove case-protection braces (but preserve content)
	// This handles {Driven}, {Development} etc.
	result = result.replace(/\{([^\\{}]+)\}/g, "$1");

	// Clean up any remaining double spaces
	result = result.replace(/\s+/g, " ").trim();

	return result;
}

/**
 * Convert Unicode text to LaTeX-encoded text
 * @param text - Text with Unicode characters
 * @returns LaTeX-encoded text
 */
export function convertUnicodeToLatex(text: string): string {
	if (!text) return text;

	// Create reverse mapping from the existing LATEX_TO_UNICODE_MAP
	const UNICODE_TO_LATEX_MAP: Record<string, string> = {};

	for (const [latex, unicode] of Object.entries(LATEX_TO_UNICODE_MAP)) {
		// Only use the first LaTeX form for each Unicode character
		// This avoids conflicts when multiple LaTeX forms map to the same Unicode
		if (!UNICODE_TO_LATEX_MAP[unicode]) {
			UNICODE_TO_LATEX_MAP[unicode] = latex;
		}
	}

	let result: string = text;

	// Apply all mappings (longer strings first to avoid partial replacements)
	const sortedEntries = Object.entries(UNICODE_TO_LATEX_MAP).sort(
		([a], [b]) => b.length - a.length
	);

	for (const [unicode, latex] of sortedEntries) {
		result = result.replace(new RegExp(unicode, "g"), latex);
	}

	return result;
}

/**
 * Parse BibTeX authors into clean array
 * @param authorString - Raw author field from BibTeX
 * @returns Array of cleaned author names
 */
function parseAuthors(authorString: string): string[] {
	if (!authorString) return [];

	// First convert LaTeX to Unicode
	const cleaned: string = convertLatexToUnicode(authorString);

	// Split by 'and' (case-insensitive, handle spacing)
	return cleaned
		.split(/\s+and\s+/i)
		.map((author: string) => author.trim())
		.filter((author: string) => author.length > 0);
}

// Test with your examples and multiple syntax variations
console.log("Testing conversion:");
console.log(convertLatexToUnicode("Matja{\\v{z}}")); // → Matjaž
console.log(convertLatexToUnicode("platform {\\'e}")); // → platform é
console.log(
	convertLatexToUnicode(
		"Formalism-{Driven} {Development}: {Concepts}, {Taxonomy}, and {Practice}"
	)
); // → clean title
console.log(
	parseAuthors("Bajd, Tadej and Mihelj, Matja{\\v{z}} and Munih, Marko")
); // → clean author array

// Test multiple LaTeX syntax variations for the same character
console.log("\\nTesting different syntax for ö:");
console.log(convertLatexToUnicode('{\\"o}')); // → ö (braces around command)
console.log(convertLatexToUnicode('\\"{o}')); // → ö (braces around letter)
console.log(convertLatexToUnicode('\\"o')); // → ö (minimal)

console.log("\\nTesting different syntax for é:");
console.log(convertLatexToUnicode("{\\'e}")); // → é (braces around command)
console.log(convertLatexToUnicode("\\'{e}")); // → é (braces around letter)
console.log(convertLatexToUnicode("\\'e")); // → é (minimal)
