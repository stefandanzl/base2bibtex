# base2bibtex

Convert table data to BibTeX format directly from your clipboard in Obsidian.

## Features

- **Copy & Paste**: Copy table data from anywhere, paste into the plugin, get BibTeX output
- **Smart Parsing**: Automatically handles tab-separated, pipe-separated, or custom delimiter data
- **Field Mapping**: Customizable mapping between your table columns and BibTeX fields
- **Multiple Entry Types**: Supports all standard BibTeX entry types (article, book, inproceedings, etc.)
- **Validation**: Warns about missing required fields while still generating entries
- **Persistent Settings**: Remembers your last export path and field mappings

## Quick Start

1. **Install the plugin** in Obsidian
2. **Copy table data** from your source (Obsidian table, Excel, etc.)
3. **Run command**: "Convert Table to BibTeX" or click the clipboard icon
4. **Paste data** in the modal (auto-pastes from clipboard)
5. **Click Convert** → BibTeX file generated!

## Example Usage

**Input Table:**
```
name	year	citekey	bibtype
Smith 2023 Important Research	2023	smith23	article
Jones 2022 Great Book	2022	jones22	book
```

**Output BibTeX:**
```bibtex
@article{smith23,
  title = {Important Research},
  year = {2023}
}

@book{jones22,
  title = {Great Book},
  year = {2022}
}
```

## Configuration

The plugin stores settings in your Obsidian data folder. You can customize:

- **Field Mappings**: Map your column names to BibTeX fields
- **Separator**: Default is tab (`\t`), change to `|`, `,`, `;` etc.
- **Export Path**: Where to save BibTeX files

### Default Field Mappings

```json
{
  "all": {
    "_CITEKEY": "citekey",
    "_BIBTYPE": "bibtype", 
    "title": "name",
    "author": "author",
    "year": "year",
    "doi": "doi",
    "url": "url",
    "abstract": "abstract",
    "keywords": "keywords"
  },
  "article": {
    "journal": "publication",
    "pages": "articlepages"
  },
  "book": {
    "publisher": "publication"
  }
}
```

## Supported Entry Types

- `article` - Journal articles
- `book` - Books  
- `inproceedings` - Conference papers
- `incollection` - Book chapters
- `techreport` - Technical reports
- `mastersthesis` / `phdthesis` - Theses
- `misc` - Miscellaneous (default)

## Tips

- **Required fields**: The plugin will warn you about missing required fields (like `author`, `journal` for articles)
- **Column order**: Doesn't matter - field mapping handles any order
- **Missing data**: Empty cells are fine, those fields will be skipped
- **Multiple formats**: Works with data from Excel, Google Sheets, Obsidian tables, etc.

## License

MIT