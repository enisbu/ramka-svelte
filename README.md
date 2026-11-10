# ramka for Svelte

Svelte 5 port of [ramka](https://ramka.dev), the lightbox by Artur Bień: view transition morphs, native scroll snap swipe, pull to dismiss, pinch zoom and a scroll linked thumbnail strip.

Docs and examples: [ramka-svelte.enisdev.com](https://ramka-svelte.enisdev.com)

```sh
npm install @ramka/svelte
```

| Path                                 | Content                             |
| ------------------------------------ | ----------------------------------- |
| [`packages/svelte`](packages/svelte) | The `@ramka/svelte` package         |
| [`apps/docs`](apps/docs)             | Docs site with presets and examples |

## Development

```sh
pnpm install
pnpm dev      # package watch build and docs dev server
pnpm test     # unit and browser tests
pnpm check    # svelte-check for all workspaces
pnpm lint     # prettier check
```

Releases run through [Changesets](https://github.com/changesets/changesets): add one with `pnpm changeset`, merge to `main`, then merge the release PR.

## License

MIT
