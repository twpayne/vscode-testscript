# testscript for Visual Studio Code

This VS Code extension provides syntax highlighting support for
[testscript](https://pkg.go.dev/github.com/rogpeppe/go-internal/testscript).

Install it from the [Visual Studio Code
Marketplace](https://marketplace.visualstudio.com/items?itemName=twpayne.vscode-testscript).

## Features

* Syntax highlighting for testscript scripts.
* Syntax highlighting for embdeded supporting files.

## Requirements

None.

## Extension Settings

None.

## Known Issues

* Syntax highlighting of embedded supporting files is fragile and occasionally
  txtar markers are not recognized.

## Release Notes

### 0.0.4

* Syntax highlight embedded Protobuf files.
* Don't syntax highlight `.txt` files.

### 0.0.3

* Syntax highlight `.txtar` files.

### 0.0.2

* Syntax highlight more embedded files.

### 0.0.1

* Initial release.

## License

MIT