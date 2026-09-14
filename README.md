# stamp&seal — website

A static site for the stamp&seal 2026 catalogue. No build step, no dependencies. Every product,
size and line count comes from the Canva catalogue.

```
index.html              the whole page
assets/css/styles.css   colours, type, layout
assets/js/main.js       stamp preview, catalogue filters
assets/img/             put your product photos here
.nojekyll               tells GitHub Pages to serve the files as-is
```

## Put it on GitHub Pages

1. On github.com, click **New repository**. Name it `stampandseal` (or anything), keep it
   **Public**, and create it without a README.
2. On the empty repo page, click **uploading an existing file**. Drag in `index.html`, the
   `assets` folder and `.nojekyll`, then click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a
   branch**, branch **main**, folder **/ (root)**. Save.
4. Wait about a minute and refresh. The URL appears at the top of that page:
   `https://<your-username>.github.io/stampandseal/`

If you prefer the command line:

```bash
git init
git add .
git commit -m "stamp&seal website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

### Using your own domain

Add a file named `CNAME` containing just your domain (e.g. `stampandseal.ph`), then point an
`A` record at GitHub's IPs, or a `CNAME` record at `<your-username>.github.io`. Set the domain
in Settings → Pages as well.

## Editing the site

**Prices.** There are none on the page on purpose — the catalogue says pricing depends on size
and line count. If you want fixed prices later, add a line inside each `<li class="item">`.

**Products.** Each product is a block in `index.html` that looks like this:

```html
<li class="item">
  <div class="item__pad"><span class="die" style="width:43.4px;height:15.5px"></span></div>
  <h4>KT1028</h4>
  <p class="item__size">10 × 28 mm · 1–2 lines</p>
  <p class="item__note">Small signatures or initials.</p>
</li>
```

The `die` span is the to-scale outline. Width and height are millimetres × 1.55 — so a
13 × 33 mm die is `width:51.2px; height:20.2px` (long side goes in `width`). Round dies use
`class="die die--round"` with equal width and height.

**The stamp preview** reads from the list at the bottom of `index.html`:

```html
<script>window.STAMP_MODELS = [{"id":"KT1028","shape":"rect","w":10,"h":28, ...}]</script>
```

Add a product to that list and it appears in the dropdown. `w` and `h` are in millimetres, even
for the Trodat models whose labels are in inches.

**Colours and fonts** are the CSS variables at the top of `assets/css/styles.css`. Change
`--red` and every accent on the page follows.

**Photos.** The site currently uses drawn size outlines rather than photos, which keeps it fast
and means nothing looks stretched. To add real photos, drop them in `assets/img/` and put an
`<img src="assets/img/kt1028.jpg" alt="KT1028 self-inking stamp">` inside the `item__pad` div.
Square images around 600 × 600 px work best.

## Contact link

Every "message us" button points at
`https://www.facebook.com/profile.php?id=61573312530052`. If you get a page username later,
search and replace that URL across `index.html`.

## The hero carousel

All six slides live in one array at the top of `assets/js/carousel.js`:

```js
{
  eyebrow: 'Trodat stamps',
  title: ['Built for PTRs', 'and licences'],   // two lines
  body:  '...',
  chips: ['4910', '4911'],                     // clicking one loads it in the builder
  accent: '#1F4E79',                           // buttons and hovers
  from: '#5D8FBF', to: '#132F4C',              // background gradient for this slide
  art:  { shape: 'rect', w: 20, h: 56, lines: ['...'] },
  img:  ''                                     // set a photo path to replace the drawn plate
}
```

Add an object to the array and a new slide, dot and background appear on their own.

**Using photos instead of the drawn plates.** Put a cut-out image (transparent PNG works best,
around 900 px on the long side) in `assets/img/` and set `img: 'assets/img/trodat-4913.png'`
on that slide. The plate is only a stand-in until you have product shots.

It swipes by drag on desktop, by touch on mobile, with the arrows, the dots, the thumbnail in
the corner, and with the left and right keys once the deck has focus.
