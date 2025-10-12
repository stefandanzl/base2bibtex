import { BibtexParser } from "bibtex-js-parser"; // macht Fehler bei simplen Transformationen wegen author inhalt
import * as bibtexParse from "@orcid/bibtex-parse-js"  // kein Fehler aber keine korrekte Zeichen transformation
// var bibtexParse = require('@orcid/bibtex-parse-js');
// import { decodeString } from "unicode-tex-character-converter";
import latexToUnicode from "latex-to-unicode"
import { convertLatexToUnicode } from "../src/latex.js";

const bibtexInput = `@book{bajd2013introduction,
  title={Introduction to robotics},
  author={Bajd, Tadej and Mihelj, Matja{\\v{z}} and Munih, Marko},
  year={2013},
  publisher={Springer Science \& Business Media}
}
@inproceedings{ding_dagbase_2020,
	title = {Dagbase: a decentralized database {\\'e} platform {Using} {DAG}-based consensus},
	copyright = {All rights reserved},
	isbn = {1-72817-303-5},
	booktitle = {2020 {IEEE} 44th {Annual} {Computers}, {Software}, and {Applications} {Conference} ({COMPSAC})},
	publisher = {IEEE},
	author = {Ding, Yepeng and Sato, Hiroyuki},
	year = {2020},
	pages = {798--807},
}

@article{ding_formalism-driven_2022,
	title = {Formalism-{Driven} {Development}: {Concepts}, {Taxonomy}, and {Practice}},
	volume = {12},
	copyright = {All rights reserved},
	issn = {2076-3417},
	url = {https://www.mdpi.com/2076-3417/12/7/3415},
	doi = {10.3390/app12073415},
	number = {7},
	journal = {Applied Sciences},
	author = {Ding, Yepeng and Sato, Hiroyuki},
	year = {2022},
}`;

// const bibtexOutput = BibtexParser.parseToJSON(bibtexInput);
const bibtexOutput = bibtexParse.toJSON(bibtexInput);

console.log(bibtexOutput);
// console.log(BibtexParser.parseToJSON(bibtexInput));
for (const citation of bibtexOutput) {
	for (const [key, value] of Object.entries(citation.entryTags)) {
		if (key === "author" || key === "title") {
			// console.log(`${key}: ${value}`);
			console.log(`${key}: ${convertLatexToUnicode(value)}`);
		}
	}
}