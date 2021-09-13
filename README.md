ocean
=====



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ocean.svg)](https://npmjs.org/package/ocean)
[![Downloads/week](https://img.shields.io/npm/dw/ocean.svg)](https://npmjs.org/package/ocean)
[![License](https://img.shields.io/npm/l/ocean.svg)](https://github.com/ylint/ocean/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ocean
$ ocean COMMAND
running command...
$ ocean (-v|--version|version)
ocean/0.0.0 darwin-x64 node-v14.16.1
$ ocean --help [COMMAND]
USAGE
  $ ocean COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ocean hello [FILE]`](#ocean-hello-file)
* [`ocean help [COMMAND]`](#ocean-help-command)

## `ocean hello [FILE]`

describe the command here

```
USAGE
  $ ocean hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ocean hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/ylint/ocean/blob/v0.0.0/src/commands/hello.ts)_

## `ocean help [COMMAND]`

display help for ocean

```
USAGE
  $ ocean help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
