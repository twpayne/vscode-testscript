const vscode = require('vscode');
const cp = require('child_process');

/**
 * Activate the extension.
 *
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Register a formatter for the `testscript` language (txtar files)
    const disposable = vscode.languages.registerDocumentFormattingEditProvider('testscript', {
        provideDocumentFormattingEdits(document, options, token) {
            return formatDocument(document);
        },
    });

    context.subscriptions.push(disposable);
}

/**
 * Deactivate the extension.
 */
function deactivate() {
    // nothing to clean up
}

/**
 * Format a txtar document by running `gofmt` over any embedded Go source files.
 *
 * @param {vscode.TextDocument} document
 * @returns {vscode.TextEdit[]}
 */
function formatDocument(document) {
    const edits = [];

    const text = document.getText();
    const lines = text.split(/\r?\n/);

    // Regex that matches file delimiters like: `-- hello.go --`
    const headerRE = /^--\s+(.+?)\s+--$/;

    let currentFilename = null;
    let blockStart = null; // line index where the file content starts

    /**
     * Flush a block (if any) and append edits.
     * @param {number} endLine - index of the line BEFORE the next header (or EOF)
     */
    function flushBlock(endLine) {
        if (currentFilename && currentFilename.endsWith('.go') && blockStart !== null) {
            const originalRange = new vscode.Range(
                blockStart,
                0,
                endLine,
                lines[endLine] ? lines[endLine].length : 0,
            );
            const originalText = document.getText(originalRange);

            const formattedText = runGofmt(originalText);
            if (formattedText !== null && formattedText !== originalText) {
                // Replace the original block with the formatted version.
                edits.push(vscode.TextEdit.replace(originalRange, formattedText.replace(/\r?\n$/, '\n')));
            }
        }
        // reset state
        currentFilename = null;
        blockStart = null;
    }

    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(headerRE);
        if (m) {
            // When we hit a new header, flush any active block first.
            if (blockStart !== null) {
                flushBlock(i - 1);
            }
            // Start new block
            currentFilename = m[1];
            blockStart = i + 1; // content starts on next line
        }
    }
    // flush the final block to EOF if needed
    if (blockStart !== null) {
        flushBlock(lines.length - 1);
    }

    return edits;
}

/**
 * Run `go fmt` on a Go source string.
 * Returns formatted source, or null on error.
 * @param {string} source
 * @returns {string|null}
 */
function runGofmt(source) {
    try {
        const result = cp.execFileSync('gofmt', [], {
            input: source,
            encoding: 'utf8',
        });
        return result;
    } catch (err) {
        // If gofmt fails (syntax errors, not installed, etc.) ignore formatting.
        console.error('gofmt failed:', err.message || err);
        return null;
    }
}

module.exports = {
    activate,
    deactivate,
}; 