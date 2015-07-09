# [NetworkNT](https://github.com/orgs/networknt) - Example Components

This is an example project that uses react components.

## Installing:
After cloning the repository, install dependencies:
```
npm install
```

Building: (Prod configs will be added later)
```
webpack
```

Developing: (live-reload enabled)
```
node server.js
```
- navigate to localhost:3000 in browser.

## Structure
- Primary for the main application (Example) are within the /components folder.
- Primary components can be made up of secondary components, which will be nested in the primary components /components folder.
- If multiple primary components make use of the same secondary components, refractor the secondary to primary.
- All content for primary/secondary components will be self contained in their folder.
- Component style -> ./style
- Component assets -> ./assets

**Reasoning**
- Structuring by file type is not scalable.
- src directory is redundant.