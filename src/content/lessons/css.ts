import type { Lesson } from "../types";

export const cssLessons: Lesson[] = [
  {
    slug: "css-selectors-box-model",
    title: "Selectors and the box model",
    summary:
      "Where CSS lives (inline vs external), how selectors pick elements, which rule wins, and the box every element is made of.",
    order: 1,
    minutes: 15,
    xp: 40,
    concept:
      "CSS rules pair a selector with declarations, and every element renders as a box built from content, padding, border and margin.",
    explanation: [
      "There are three places to write CSS: inline on an element with a style attribute, inside a style block in the page, or — best of all — in a separate .css file linked with a link tag. External files keep all styling in one place, so a single change restyles every page that uses them.",
      "A rule has two parts: a selector that picks elements, and declarations inside curly braces. p { color: navy; } colours every paragraph. .card { padding: 1rem; } targets elements with class=\"card\". #header targets id=\"header\". Classes are the workhorse — you can reuse the same class on as many elements as you like.",
      "When two rules fight over the same element, specificity decides the winner: inline styles beat id selectors, ids beat classes, and classes beat plain element selectors. A tie goes to whichever rule appears later in the file. Keep your selectors simple and you will rarely need to think about it.",
      "Every element is a box: content in the middle, padding around it, then a border, then margin pushing neighbours away. By default the width you set covers only the content, so a 300px box with padding and a border ends up wider than 300px — unless you set box-sizing: border-box, which makes width include padding and border. Most projects switch this on from day one.",
    ],
    analogy:
      "The box model is a gift in a box: the present is your content, the tissue paper is padding, the cardboard is the border, and the wrapping-table space around it is margin. Margin decides how much room each gift gets on the table.",
    example: {
      lang: "html",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Selectors demo</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        padding: 2rem;
      }

      h1 {
        color: #7c3aed;
      }

      .card {
        box-sizing: border-box;
        width: 320px;
        padding: 1.5rem;
        border: 2px solid #7c3aed;
        margin-bottom: 1rem;
        background-color: #f5f3ff;
      }

      #featured {
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <h1>Three selectors at work</h1>
    <div class="card">An element selector styled the heading; a class styled this card.</div>
    <div class="card" id="featured">This card also has an id, so the id rule adds bold text.</div>
  </body>
</html>`,
      caption:
        "Element, class and id selectors on one page, with box-sizing: border-box keeping the width honest.",
    },
    sections: [
      {
        heading: "Three places to write CSS",
        body: [
          "Inline: a style attribute on one element. Handy while debugging, but it overrides everything else and cannot be reused — avoid it in real work.",
          "Internal: a style block in the head. Fine for one small page.",
          "External: a separate .css file linked from every page. This is the default for real projects: one source of truth, and the browser caches it so other pages load faster.",
        ],
        code: {
          lang: "html",
          code: `<!-- index.html -->
<link rel="stylesheet" href="styles.css" />

<p class="note">Styled from styles.css</p>
<p style="color: red">Inline style — one-offs only</p>`,
        },
      },
      {
        heading: "Specificity in one minute",
        body: [
          "Order of power: inline style, then #id, then .class, then a bare element selector.",
          "Equal specificity? The rule written last wins.",
          "Prefer classes over ids for styling — class rules stay reusable and are much easier to override later.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Create styles.css and link it from index.html. Style the heading with a colour, the intro paragraph with a size and line-height, and the card with 1rem padding, a 1px border, 1rem margin and box-sizing: border-box.",
      starter: `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My styled page</title>
    <!-- Link styles.css here -->
  </head>
  <body>
    <h1>Hello CSS</h1>
    <p class="intro">Style me from an external file.</p>
    <div class="card">A card with breathing room.</div>
  </body>
</html>`,
      solution: `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My styled page</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Hello CSS</h1>
    <p class="intro">Style me from an external file.</p>
    <div class="card">A card with breathing room.</div>
  </body>
</html>

/* styles.css */
h1 {
  color: #1d4ed8;
}

.intro {
  font-size: 1.125rem;
  line-height: 1.6;
}

.card {
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  margin-top: 1rem;
}`,
    },
    challenge: {
      task:
        "Two rules target the same element: .note { color: teal; } and #note { color: crimson; }. Which colour wins? Then edit the element so it shows teal using only an inline style.",
      hint: "Check the specificity order — inline style, then id, then class, then element.",
      solution: `<p id="note" class="note" style="color: teal">Teal wins now.</p>

/* The id rule beat the class rule, because ids are more specific.
   An inline style beats both. */`,
    },
    commonMistakes: [
      {
        mistake: "Writing the selector as card instead of .card, so nothing gets styled.",
        fix: "Classes need a leading dot (.card), ids need a hash (#header), and a bare name (p) styles every paragraph of that type.",
      },
      {
        mistake: "Setting a width, then adding padding and border and watching the box overflow.",
        fix: "Set box-sizing: border-box so width includes padding and border — apply it once globally with *, *::before, *::after { box-sizing: border-box; }.",
      },
      {
        mistake: "Pasting style attributes everywhere because they are quick.",
        fix: "Move repeated styles into classes in your external stylesheet, so one edit updates every element at once.",
      },
    ],
    quiz: [
      {
        question: "Which selector targets elements whose class is card?",
        options: ["card", ".card", "#card", "*card"],
        correctIndex: 1,
        explanation:
          "Classes start with a dot, ids with a hash, and a bare word is an element selector.",
      },
      {
        question: "With box-sizing: border-box, what does width: 300px include?",
        options: [
          "Content only",
          "Content and padding, but not the border",
          "Content, padding and border",
          "Only the border",
        ],
        correctIndex: 2,
        explanation:
          "border-box makes the width you set the size you actually see, which stops padded boxes from growing unexpectedly.",
      },
      {
        question:
          "Three rules target the same element — p { color: red; } .note { color: blue; } #tip { color: green; } — which colour wins?",
        options: ["red", "blue", "green", "They blend together"],
        correctIndex: 2,
        explanation:
          "Ids beat classes and classes beat element selectors, so #tip wins outright.",
      },
    ],
  },
  {
    slug: "css-colors-typography",
    title: "Colors, type and spacing",
    summary:
      "Choosing colours that read well, building a small type scale, and using rem so your spacing stays consistent.",
    order: 2,
    minutes: 13,
    xp: 40,
    concept:
      "Colour and typography properties decide what your text looks like and how much room it has to breathe.",
    explanation: [
      "Text colour comes from color, and the surface behind it from background-color. Values can be written as a name like tomato, a hex code like #e11d48, or rgb(225, 29, 72). Hex is what you will see most often in real projects and in any colour picker.",
      "font-family takes a list of fonts called a stack: the browser tries them in order and falls back to the next one. A stack like system-ui, sans-serif gives you a clean, free, fast font on every device without downloading anything.",
      "Sizes work best as a small scale instead of random numbers: 0.875rem, 1rem, 1.125rem, 1.5rem, 2rem. Use rem rather than px so text still respects the reader's own browser font settings. Pair it with a generous unitless line-height around 1.5, which multiplies the font size to give every line room.",
      "Spacing looks intentional when it also comes from a short list — 0.5rem, 1rem, 1.5rem, 2rem — applied with margin for space outside a box and padding for space inside it.",
    ],
    analogy:
      "It is like writing a style guide for a newsletter: one ink colour for headings, one for body text, two typefaces, exactly four sizes, and every margin measured with the same ruler. Consistency, not variety, is what makes it look designed.",
    example: {
      lang: "css",
      code: `body {
  background-color: #fafafa;
  color: #111827;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  padding: 2rem;
}

h1 {
  color: #7c3aed;
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.intro {
  color: #4b5563;
  font-size: 1.125rem;
  max-width: 60ch;
}

.meta {
  color: #6b7280;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}`,
      caption:
        "A tiny type system: three sizes, two text colours and one generous line height.",
    },
    sections: [
      {
        heading: "Colour formats you will see",
        body: [
          "Names like `tomato` are quick but limited to the built-in list.",
          "Hex (`#7c3aed`) is the most common — three pairs of digits for red, green and blue, or three digits as a shorthand like `#fff`.",
          "`rgb()` and `hsl()` are useful when you want to build a colour programmatically, for example by making a shade 10% darker.",
          "`color` paints the text; `background-color` paints the surface behind it. Getting these two mixed up is the most common reason a page \"does not change colour\".",
        ],
      },
      {
        heading: "A spacing scale that looks designed",
        body: [
          "Pick four values and reuse them everywhere: 0.5rem small, 1rem base, 1.5rem medium, 2rem large.",
          "Use margin to separate one element from the next, and padding to give content room inside its own box.",
          "Because these are rem values, every gap scales together if the reader increases their default font size.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Write styles.css for a blog post: a coloured heading, a muted subtitle, body text with line-height 1.6, and a 2rem gap before each new section. Use rem for every size.",
      starter: `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My post</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Learning in public</h1>
    <p class="subtitle">Why I write about what I build.</p>
    <p class="body-text">Start with one paragraph, then style it.</p>
    <p class="body-text">Add a second section with a generous gap.</p>
  </body>
</html>`,
      solution: `/* styles.css */
body {
  background-color: #ffffff;
  color: #111827;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  padding: 2rem;
}

h1 {
  color: #7c3aed;
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.body-text {
  font-size: 1rem;
  max-width: 60ch;
}

.body-text + .body-text {
  margin-top: 2rem;
}`,
    },
    challenge: {
      task:
        "Your caption uses #e5e7eb text on a white background and nobody can read it. Darken the caption colour until the text is comfortably readable.",
      hint: "Pale grey on white has almost no contrast. Aim for a mid grey like #6b7280 or darker — you will learn to measure this properly in the final lesson.",
      solution: `.caption {
  color: #6b7280;
  font-size: 0.875rem;
}`,
    },
    commonMistakes: [
      {
        mistake: "Writing every font size in px, like 14px and 16px.",
        fix: "Use rem instead (1rem, 1.5rem) so text scales with the reader's browser settings instead of being locked in place.",
      },
      {
        mistake: "Setting the text colour on background-color, or the other way round.",
        fix: "color paints the letters; background-color paints the area behind them. Swap the properties, not the values.",
      },
      {
        mistake: "Inventing a new size or spacing value for every element.",
        fix: "Choose a short scale — for example 0.875, 1, 1.125, 1.5 and 2rem — and reuse it. The page instantly looks more designed.",
      },
    ],
    quiz: [
      {
        question: "Which property changes the colour of the text itself?",
        options: ["color", "background-color", "font-color", "text-color"],
        correctIndex: 0,
        explanation:
          "`color` sets the text; `background-color` paints the surface behind it. The other two properties do not exist.",
      },
      {
        question: "What does line-height: 1.5 do?",
        options: [
          "Adds 1.5 pixels between lines",
          "Makes each line 1.5 times the font size tall",
          "Sets the font size to 1.5px",
          "Splits the text into 1.5 columns",
        ],
        correctIndex: 1,
        explanation:
          "A unitless line-height is a multiplier of the font size, so it scales automatically when text gets bigger.",
      },
      {
        question: "Why prefer rem over px for font sizes?",
        options: [
          "rem values are always smaller",
          "rem respects the reader's own browser font settings",
          "px does not work in stylesheets",
          "rem files download faster",
        ],
        correctIndex: 1,
        explanation:
          "rem is relative to the root font size, so a visitor who enlarges text in their browser settings gets a page that still works.",
      },
    ],
  },
  {
    slug: "css-flexbox",
    title: "Flexbox: rows that behave",
    summary:
      "display: flex, the main and cross axes, justify-content, align-items, gap and wrapping.",
    order: 3,
    minutes: 14,
    xp: 40,
    concept:
      "Flexbox lays a group of elements out along one axis, giving you fine control over spacing, alignment and growth.",
    explanation: [
      "Put display: flex on a container and its direct children become flex items, lined up in a row by default. Flex only works one level deep — the children of those items are unaffected unless you make them flex containers too.",
      "Everything in flexbox happens along two axes. The main axis runs in the container's direction (left to right by default; flex-direction: column flips it to top to bottom), and the cross axis is perpendicular to it. justify-content distributes items along the main axis, while align-items lines them up along the cross axis. When something is aligned the wrong way, you are almost always adjusting the wrong axis.",
      "gap: 1rem puts even space between items without fiddly margins on every child, and flex-wrap: wrap lets items spill onto a new line when they run out of room. Give a child flex: 1 and it stretches to share whatever free space is left.",
      "Three patterns you will reuse constantly: a navigation bar with space-between, perfectly centred content with both axes set to center, and a row of cards that wraps gracefully on small screens.",
    ],
    analogy:
      "Think of arranging photo frames on a shelf. justify-content decides whether they hug the left, spread out evenly or sit crammed to the right along the shelf. align-items decides whether they all rest on the same line or float at different heights. gap is the equal spacer you place between each frame.",
    example: {
      lang: "html",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Flexbox demo</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
      }

      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1rem 2rem;
        background-color: #111827;
        color: #ffffff;
      }

      nav a {
        color: #ffffff;
      }

      .cards {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 2rem;
      }

      .card {
        flex: 1 1 200px;
        padding: 1.5rem;
        background-color: #f3f4f6;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <nav>
      <strong>BuilderVerse</strong>
      <a href="#">Paths</a>
    </nav>

    <div class="cards">
      <div class="card">HTML</div>
      <div class="card">CSS</div>
      <div class="card">JavaScript</div>
    </div>
  </body>
</html>`,
      caption:
        "A nav bar with space-between and centred items, plus a card row that grows, shrinks and wraps.",
    },
    sections: [
      {
        heading: "Main axis vs cross axis",
        body: [
          "The main axis follows `flex-direction` — `row` (default) is horizontal, `column` is vertical.",
          "`justify-content` works along that main axis: `flex-start`, `center`, `flex-end`, `space-between`.",
          "`align-items` works along the cross axis: `stretch`, `center`, `flex-start`, `flex-end`.",
        ],
        code: {
          lang: "css",
          code: `.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}`,
        },
      },
      {
        heading: "Making items grow and shrink",
        body: [
          "`flex: 1` means grow 1, shrink 1, basis 0 — the item shares any free space equally with its siblings.",
          "`flex: 1 1 200px` says: aim for 200px, but grow when there is room and shrink when there is not. Combined with `flex-wrap: wrap`, that is a responsive card row with no media query in sight.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Build a header with a logo on the left and two links on the right, then a card row of three boxes that stays in one row on wide screens and wraps onto new lines on narrow ones.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Flex practice</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <span class="logo">MySite</span>
      <nav class="links">
        <a href="#">Home</a>
        <a href="#">About</a>
      </nav>
    </header>

    <div class="cards">
      <div class="card">One</div>
      <div class="card">Two</div>
      <div class="card">Three</div>
    </div>
  </body>
</html>`,
      solution: `/* styles.css */
body {
  font-family: system-ui, sans-serif;
  margin: 0;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #111827;
  color: #ffffff;
}

.links {
  display: flex;
  gap: 1rem;
}

.links a {
  color: #ffffff;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem;
}

.card {
  flex: 1 1 200px;
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-radius: 8px;
}`,
    },
    challenge: {
      task:
        "A save button and its label sit on the same line, but the label is glued to the top of the box and touching the button. Centre them vertically and add 0.5rem of space between them.",
      hint: "You only need two properties on the parent: one to align across the cross axis, one to space the items.",
      solution: `.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}`,
    },
    commonMistakes: [
      {
        mistake: "Putting display: flex on the children instead of the container.",
        fix: "Flex goes on the parent. Its direct children are the ones that become flex items and line up in a row.",
      },
      {
        mistake: "Expecting gap to space out the grandchildren.",
        fix: "Flex arranges direct children only. If you need space inside an item, make that item a flex container too.",
      },
      {
        mistake: "Giving every item a fixed width and fighting overflow on small screens.",
        fix: "Let items breathe with flex: 1 1 200px and add flex-wrap: wrap so they can flow onto a new line.",
      },
    ],
    quiz: [
      {
        question: "Which axis does justify-content control?",
        options: ["The cross axis", "The main axis", "The diagonal axis", "Both axes at once"],
        correctIndex: 1,
        explanation:
          "justify-content works along the main axis (the flex-direction). align-items handles the cross axis.",
      },
      {
        question: "Where does display: flex belong?",
        options: [
          "On each child element",
          "On the container whose children should be laid out",
          "Only on the <body> element",
          "In a style attribute on every element",
        ],
        correctIndex: 1,
        explanation:
          "The container becomes a flex container and its direct children become the items being arranged.",
      },
      {
        question: "Which property is designed to space out flex items?",
        options: ["gap", "text-indent", "line-height", "overflow"],
        correctIndex: 0,
        explanation:
          "`gap` adds even space between items and avoids stacking margins on every child.",
      },
    ],
  },
  {
    slug: "css-grid-responsive",
    title: "Grid and responsive design",
    summary:
      "Two-dimensional layouts with grid, fr units, and media queries that reshape the page for every screen.",
    order: 4,
    minutes: 16,
    xp: 40,
    concept:
      "CSS Grid arranges content in rows and columns at once, while media queries adapt that layout to the screen it is shown on.",
    explanation: [
      "Grid is for two-dimensional layouts — rows and columns at the same time. Set display: grid on a container, then grid-template-columns: repeat(3, 1fr) to carve out three equal columns. The children flow into the cells left to right, top to bottom, and gap works exactly as it does in flexbox.",
      "The fr unit means one share of the free space: 1fr beside 1fr splits the width evenly, while 2fr beside 1fr gives a two-to-one split. minmax(220px, 1fr) adds a floor so a track never becomes uselessly narrow, and repeat(auto-fit, minmax(220px, 1fr)) lets the browser add and remove columns for you — a responsive grid with no media query at all.",
      "Some things cannot reflow on their own. A two-column feature layout still needs to become one column on a phone, so you add a media query: @media (max-width: 640px) { .feature { grid-template-columns: 1fr; } }. That block only applies when the condition is true, so you are overriding one rule on small screens.",
      "Write mobile-first: base styles for the narrowest screen, then @media (min-width: ...) rules to expand on larger ones. Phones get the simplest CSS, and you never accidentally ship a desktop layout that overflows a small screen. Do not forget the viewport meta tag in your head, or phones will pretend to be 980px wide and shrink everything.",
    ],
    analogy:
      "Grid is graph paper for your page: you decide how many columns the drawing gets. A media query is the architect redrawing the same floor plan when the plot of land turns out to be narrow — same rooms, different arrangement.",
    example: {
      lang: "html",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Grid demo</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
        padding: 1.5rem;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .feature {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .card {
        padding: 1.5rem;
        background-color: #f3f4f6;
        border-radius: 8px;
      }

      @media (max-width: 640px) {
        .feature {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="cards">
      <div class="card">HTML</div>
      <div class="card">CSS</div>
      <div class="card">JavaScript</div>
      <div class="card">Accessibility</div>
    </div>

    <div class="feature">
      <div class="card">The main story takes two thirds of the width.</div>
      <div class="card">The sidebar takes the rest.</div>
    </div>
  </body>
</html>`,
      caption:
        "auto-fit cards reflow on their own, while a media query stacks the feature area on small screens.",
    },
    sections: [
      {
        heading: "Reading grid-template-columns",
        body: [
          "`repeat(3, 1fr)` — three equal columns.",
          "`2fr 1fr` — two columns, the first twice as wide as the second.",
          "`minmax(200px, 1fr)` — never narrower than 200px, but take a share of the rest.",
          "`repeat(auto-fit, minmax(220px, 1fr))` — as many 220px-or-wider columns as fit, then stretch them to fill the row.",
        ],
      },
      {
        heading: "A mobile-first recipe",
        body: [
          "Start with one column and your smallest spacing in the base stylesheet.",
          "Add `@media (min-width: 640px)` for a second column, and a wider query like `900px` for a third.",
          "Test with your browser dev tools' device toolbar — and keep the viewport meta tag in your HTML head, or phones ignore your media queries' intent.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Build a photo gallery: one column on phones, two columns from 600px up, and three from 900px up. Write it mobile-first with min-width media queries.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gallery</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="gallery">
      <div class="photo">Photo 1</div>
      <div class="photo">Photo 2</div>
      <div class="photo">Photo 3</div>
      <div class="photo">Photo 4</div>
      <div class="photo">Photo 5</div>
      <div class="photo">Photo 6</div>
    </div>
  </body>
</html>`,
      solution: `/* styles.css */
body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 1.5rem;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.photo {
  padding: 2rem;
  background-color: #e5e7eb;
  border-radius: 8px;
  text-align: center;
}

@media (min-width: 600px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
    },
    challenge: {
      task:
        "Your four-column grid overflows sideways on a 320px phone. Replace the fixed columns so the browser decides how many fit, without writing any media query.",
      hint: "repeat with auto-fit and minmax lets a track be at least a minimum width but grow to share the row.",
      solution: `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}`,
    },
    commonMistakes: [
      {
        mistake: "Forgetting the viewport meta tag, so phones render a desktop page shrunk down.",
        fix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /> in the head — without it, mobile browsers ignore your layout's intent.",
      },
      {
        mistake: "Starting with desktop breakpoints and then fighting to fix small screens.",
        fix: "Go mobile-first: one column in the base styles, then @media (min-width: ...) rules that add columns as the screen grows.",
      },
      {
        mistake: "Giving grid children fixed pixel widths.",
        fix: "Use fr units with minmax() so tracks share the available space and never push the page sideways.",
      },
    ],
    quiz: [
      {
        question: "What does grid-template-columns: repeat(3, 1fr) create?",
        options: ["Three equal columns", "Three rows", "A 3px wide column", "Three separate grids"],
        correctIndex: 0,
        explanation:
          "repeat(3, 1fr) is shorthand for writing 1fr three times — three equal-width columns.",
      },
      {
        question: "What is a media query for?",
        options: [
          "Downloading images faster",
          "Applying different styles at different screen sizes",
          "Embedding a video player",
          "Animating text",
        ],
        correctIndex: 1,
        explanation:
          "A media query only applies its rules when its condition — such as a screen width — is true.",
      },
      {
        question: "In a mobile-first stylesheet, what do the base styles target?",
        options: [
          "Large desktop screens only",
          "Small screens, with min-width queries adding more",
          "Printers and PDFs",
          "Dark mode only",
        ],
        correctIndex: 1,
        explanation:
          "Base styles cover the narrowest screen; each min-width query then adds columns and spacing as room grows.",
      },
    ],
  },
  {
    slug: "css-ui-polish",
    title: "Polish: hover, focus and motion",
    summary:
      "Interactive states, gentle transitions and colour contrast that everyone can read.",
    order: 5,
    minutes: 13,
    xp: 40,
    concept:
      "Small details — hover and focus styles, short transitions and accessible contrast — turn a working page into one that feels finished.",
    explanation: [
      "Interactive elements should react. The :hover pseudo-class styles the moment a pointer is over something, and :focus-visible styles the element the keyboard has reached. Give buttons a darker shade on hover and a clear outline on focus — never delete the focus ring without replacing it, or keyboard users are navigating blind.",
      "transition: background-color 0.2s ease; fades that hover change in instead of letting it snap. Keep transitions short: 150 to 300 milliseconds feels responsive, while anything longer feels laggy. Wrap non-essential motion in @media (prefers-reduced-motion: reduce) so visitors who are sensitive to movement can switch it off.",
      "Contrast decides whether people can read you at all. Aim for at least 4.5:1 between text and background for normal-size text, and 3:1 for large or bold text. Your browser's dev tools show the ratio in the colour picker. And never use colour alone to carry meaning — pair it with words or an icon, because plenty of readers cannot tell your red apart from your green.",
      "Consistency is the final polish: the same hover on every button, the same focus ring on every link, the same timing everywhere. Pick one recipe and reuse it across the whole page.",
    ],
    analogy:
      "A well-run shop reacts to you: lights come on as you approach the door, every aisle is signposted and wide enough for a wheelchair, and the automatic doors open at a calm speed instead of slamming. The shop still works without those details — but only for some visitors.",
    example: {
      lang: "css",
      code: `.button {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 6px;
  background-color: #7c3aed;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #6d28d9;
  transform: translateY(-2px);
}

.button:focus-visible {
  outline: 3px solid #facc15;
  outline-offset: 2px;
}

.button:active {
  transform: translateY(0);
}

.link {
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.link:hover {
  color: #1e40af;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }

  .button:hover {
    transform: none;
  }
}`,
      caption:
        "Hover, focus-visible and reduced-motion rules that make one button feel considered.",
    },
    sections: [
      {
        heading: "States worth styling",
        body: [
          "`:hover` — the pointer is over the element.",
          "`:focus-visible` — the keyboard reached it. Use this rather than `:focus` so mouse clicks do not leave outlines behind.",
          "`:active` — the element is being pressed right now.",
          "Style all three consistently, and your page will feel the same everywhere.",
        ],
      },
      {
        heading: "Checking contrast in thirty seconds",
        body: [
          "Open dev tools, select the text, and click its colour swatch — the panel shows the contrast ratio against the background.",
          "Body text needs 4.5:1 or more; large text (about 24px regular, or 19px bold) can drop to 3:1.",
          "Fix a failing pair by darkening the text or lightening the background — not by shrinking the type.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Style a primary button: a purple background with white text, a darker shade on hover, a visible yellow outline on :focus-visible, and a 0.2s transition. Then add a reduced-motion override.",
      starter: `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Button polish</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <button class="button" type="button">Start learning</button>
    <a class="link" href="#">Or read the guide</a>
  </body>
</html>

/* styles.css — add your rules below */`,
      solution: `/* styles.css */
body {
  font-family: system-ui, sans-serif;
  padding: 2rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 6px;
  background-color: #7c3aed;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #6d28d9;
}

.button:focus-visible {
  outline: 3px solid #facc15;
  outline-offset: 2px;
}

.link {
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}`,
    },
    challenge: {
      task:
        "A card changes background instantly on hover, and people tabbing through the page get no visible focus indicator. Fix both problems.",
      hint: "Add a transition to the base rule so the change animates, and give the card a :focus-visible rule with an outline.",
      solution: `.card {
  background-color: #f3f4f6;
  transition: background-color 0.2s ease;
}

.card:hover {
  background-color: #e5e7eb;
}

.card:focus-visible {
  outline: 3px solid #7c3aed;
  outline-offset: 2px;
}`,
    },
    commonMistakes: [
      {
        mistake: "Deleting the outline on :focus because it looks ugly.",
        fix: "Replace it with a clearly visible :focus-visible style — an outline plus offset. Removing focus indication entirely locks keyboard users out.",
      },
      {
        mistake: "Transitions lasting two or three seconds that make the interface feel slow.",
        fix: "Keep UI transitions around 0.15 to 0.3 seconds. Save longer animation for one deliberate, celebratory moment.",
      },
      {
        mistake: "Choosing pale grey text because it looks minimal.",
        fix: "Measure the contrast ratio against the background and aim for 4.5:1 — usually by darkening the text a couple of steps.",
      },
    ],
    quiz: [
      {
        question: "Why keep a visible :focus-visible style?",
        options: [
          "It improves search ranking",
          "Keyboard users need to see where they are on the page",
          "It makes the page load faster",
          "It is required by the CSS syntax",
        ],
        correctIndex: 1,
        explanation:
          "Anyone navigating by keyboard relies on that indicator to know which link or button they are on.",
      },
      {
        question: "Roughly how long should a typical hover transition last?",
        options: [
          "Two to five seconds",
          "150 to 300 milliseconds",
          "Zero — transitions should never be used",
          "Thirty seconds",
        ],
        correctIndex: 1,
        explanation:
          "Short transitions read as responsive. Much longer and the interface starts to feel like it is moving through syrup.",
      },
      {
        question:
          "What is the minimum contrast ratio recommended for normal body text?",
        options: [
          "4.5:1",
          "1:1",
          "10:1",
          "None, as long as the font is stylish",
        ],
        correctIndex: 0,
        explanation:
          "4.5:1 for normal text, dropping to 3:1 only for large or bold text. Anything lower is a struggle to read.",
      },
    ],
  },
];
