# ramka-svelte

Svelte-5-Port von [ramka](https://ramka.dev) (React, MIT, Artur Bień): ungestylte, zugängliche Lightbox-Bausteine. Gleiche Compound-API, gleiche Gesten-Konstanten und Morph-Timings, rund 1.400 statt 19.500 Zeilen.

## Anatomie

```svelte
<script>
  import * as Lightbox from 'ramka-svelte/lightbox';
</script>

<Lightbox.Root bind:open bind:index>
  {#each photos as photo, i (photo.id)}
    <Lightbox.Trigger index={i}>
      <img src={photo.thumb} alt="" />
    </Lightbox.Trigger>
  {/each}

  <Lightbox.Portal>
    <Lightbox.Backdrop />
    <Lightbox.Content aria-label="Galerie">
      <Lightbox.Slides preload={1}>
        {#each photos as photo, i (photo.id)}
          <Lightbox.Slide>
            <Lightbox.Item index={i} caption={photo.caption}>
              <Lightbox.Zoom>
                <Lightbox.Media width={photo.w} height={photo.h}>
                  <img src={photo.src} alt={photo.alt} />
                </Lightbox.Media>
              </Lightbox.Zoom>
            </Lightbox.Item>
          </Lightbox.Slide>
        {/each}
      </Lightbox.Slides>
      <Lightbox.Counter />
      <Lightbox.Caption />
      <Lightbox.ZoomOut aria-label="Herauszoomen" />
      <Lightbox.ZoomIn aria-label="Hineinzoomen" />
      <Lightbox.Close aria-label="Schließen" />
      <Lightbox.Previous aria-label="Vorheriges" />
      <Lightbox.Next aria-label="Nächstes" />
      <Lightbox.Thumbnail index={0}>…</Lightbox.Thumbnail>
    </Lightbox.Content>
  </Lightbox.Portal>
</Lightbox.Root>
```

Vollständiges Beispiel mit Skin: `src/routes/+page.svelte`.

## Verhalten

- **Morph**: View Transitions API zwischen Trigger-Bild und `Media`. Fallback auf Fade bei fehlendem Support oder `prefers-reduced-motion`. `Root` `viewTransition`: `true | false | 'default' | 'snappy' | 'relaxed' | 'spring'`. `morphTo`: `'active' | 'origin' | 'closest'`. `Trigger` `crossfade`: `'open' | 'close' | 'both'`.
- **Slides**: natives Scroll-Snap-Karussell, Index folgt dem Wischen live.
- **Pull-to-dismiss**: Touch-Drag und Trackpad-Wheel, gedämpft wie im Original (100 px oder 400 px/s schließen, sonst Feder zurück).
- **Zoom**: Pinch, Pan mit Rubberband und Schwung, Doppeltipp, Doppelklick, Ctrl/Cmd+Wheel.
- **Tastatur**: Esc, Pfeile (blättern, gezoomt: verschieben), Home/End, `+` `-` `0`. Fokusfalle, Fokus zurück an den Auslöser, Scroll-Lock.
- **Programmatisch**: `bind:open`, `bind:index`, oder `bind:this` auf `Root` und `show(i)` / `close()` (mit Morph).
- **Zurück-Taste schließt** (SvelteKit-Shallow-Routing): `Root` meldet jedes Öffnen und Schließen über `onOpenChange`. Die Demo legt damit per `goto('', { shallow: true, state })` einen History-Eintrag an und schließt bei `page.state`-Verlust mit Morph, siehe `src/routes/+page.svelte`. Die Library selbst bleibt routerfrei.

## Styling-Vertrag

Data-Attribute: `data-open`, `data-closed`, `data-pulling`, `data-pull-dismissing`, `data-zoomed`, `data-active`, `data-scrolling`, `data-locked`.
CSS-Variablen: `--lightbox-vt-duration`, `--lightbox-vt-easing` (auf dem Portal), `--lightbox-pull-progress`, `--lightbox-pull-snap-duration`, `--lightbox-pull-snap-easing` (auf dem Portal während Pull).
Strukturelle Defaults liegen in `:where()` mit Spezifität 0 und lassen sich ohne `!important` überschreiben.

## Nicht portiert

ThumbnailStrip mit Scroll-Kopplung (`Thumbnail` reicht für Leisten), `Stage`, RTL, CSP-Nonce, Low-End-Erkennung, Haptik, Lazy-Loading der Engines, React-Kompatibilitätsschicht.

## Entwicklung

```sh
pnpm dev      # Demo
pnpm check    # svelte-check
pnpm build    # Paket nach dist/, publint
```
