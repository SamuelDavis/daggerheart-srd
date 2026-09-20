# Daggerheart SRD

**Implemented by Claude with human oversight** forgive the slop.

This is a Deno CLI meant to parse the
[Daggerheart SRD 2.0 Markdown](https://github.com/matthttam/daggerheart-srd-2.0)
into normalized JSON. It also provides a variety of manually-curated JavaScript
constants and TypeScript types.

## Usage

### Installation

Because this project is built in Deno, it necessarily compiles and commits the
assets to the dist/ branch.

```shell
npm install github:SamuelDavis/daggerheart-srd#dist
# or a specific tag
npm install github:SamuelDavis/daggerheart-srd#v1.2.0
```

### Publishing a new version

```shell
deno task publish /path/to/srd-markdown --push
```
