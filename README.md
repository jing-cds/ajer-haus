# Ajer Haus

Astro site for Ajer Haus, a Melbourne scent house (memory, place and scent). This is the second design iteration: Grante logo face, green/turquoise/blue spring palette, plainer sections.

## Run

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Pages

| Route | Source |
|-------|--------|
| `/` | `src/pages/index.astro` (Welcome, Scent Map, Collection rail, Scent Stories, Gifting) |
| `/shop` | `src/pages/shop.astro` |
| `/collection` | `src/pages/collection.astro` (product page, white) |
| `/delivery` | `src/pages/delivery.astro` (delivery, pickup and returns, white) |
| `/events` | `src/pages/events.astro` |
| `/philosophy` | `src/pages/philosophy.astro` |
| `/gifting` | `src/pages/gifting.astro` |
| `/pre-order` | `src/pages/pre-order.astro` |

Each `.astro` page wraps one React island in `src/components/` (`client:only="react"`), which holds the markup and interactions (Scent Map, candle toggle, slideshow, FAQ and Contact pop-ups, pre-order switch). Shared CSS is `src/styles/site.css`.

## Notes

- **Logo font:** Grante is an Adobe Fonts face. Add your kit link in `src/layouts/Base.astro`; until then the pages fall back to Dela Gothic One.
- **Pre-order switch:** the on/off switch in the footer bar is a prototype control. For launch, replace `PREORDER_OPEN` (in each component) with real product data.
- **Placeholders:** copy, prices, dates and the Shopify GIF are placeholders in square brackets.
- **Duplication:** each island carries its own copy of the shared header, footer and illustration data. Extracting these into shared components is the natural next step.
- **Rendering:** islands render in the browser only, so the pages ship little static HTML. Switch to `client:load` and guard `window` use if you need server-rendered markup.
- The silver Collection and Delivery variants are not included.
