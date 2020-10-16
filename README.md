# Style Guide CLI

A CLI to add ESLint + Prettier and enforce a style guide based on `ESLint standard`. This automatize configs of Prettier and ESLint adding specific files for different frameworks/languages (in case of JS or TS).

## Support

| Framework / Language                      | Support? |
| ----------------------------------------- | -------- |
| Angular 2+                                | ✅ Yes    |
| JavaScript (Browser + Node)               | ✅ Yes    |
| React / Next.js                           | ✅ Yes    |
| TypeScript (use Angular template for now) | Roadmap  |

> You can contribute sending a pull request

## Use

Run the command on root of your project. (Same folder of `package.json`)

```bash
$ npx config-styleguide

? What the type of your project?
❯ JavaScript
  Angular 2+
  React / Next.js (TypeScript)
```

> Before execute, do a backup or commit your files!

## Development

To run local exists two strategies:

1. Using directly `NPM`

```bash
# on root folder, run for register CLI on envs
$ npm link

# create any folder to run the CLI
$ mkdir test
$ cd test

# start a Node project to create a package.json
$ npm init -y

# and... run the CLI for apply magic 🚀
$ config styleguide
```

2. Using VSCode automated tasks (`tasks.json` and `launch.json`)

Press F5 key to run or use Ctrl + Shift + D to access run side menu and select "Launch" on context menu to run the all predefined tasks.

On `.vscode/tasks.json` you can change the CLI args in:

```json
...
"args": [
  "--project",
  "javascript" <- here
],
```


