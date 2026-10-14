import type { Lesson } from "../types";

export const htmlLessons: Lesson[] = [
  {
    slug: "html-your-first-page",
    title: "Your first web page",
    summary: "What HTML actually is, and how three tags create a page.",
    order: 1,
    minutes: 12,
    xp: 40,
    concept:
      "HTML is a markup language that describes the structure and meaning of content on a web page.",
    explanation: [
      "Every website you have ever visited is, at its core, a text file. HTML (HyperText Markup Language) is the file format that tells the browser what each piece of content is: this is a heading, this is a paragraph, this is a link.",
      "HTML uses tags — words wrapped in angle brackets like `<p>` — to describe content. Most tags come in pairs: an opening tag `<p>` and a closing tag `</p>` with the content in between. The browser reads these tags and decides how to display the content.",
      "You do not need a special tool to write HTML. A plain text editor and a browser are enough to build your first page today.",
    ],
    analogy:
      "Think of HTML like the labelled boxes in a moving truck. The labels do not decorate the stuff inside — they tell everyone what the stuff is and where it belongs.",
    example: {
      lang: "html",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>I built this page myself.</p>
  </body>
</html>`,
      caption: "The smallest useful HTML document.",
    },
    sections: [
      {
        heading: "The parts of the document",
        body: [
          "`<!DOCTYPE html>` tells the browser this is modern HTML so it renders things correctly.",
          "`<html>` wraps everything on the page. The `lang=\"en\"` attribute helps screen readers and search engines understand the language.",
          "`<head>` holds information *about* the page — the title shown in the browser tab, character encoding, stylesheets.",
          "`<body>` holds everything the visitor can actually see.",
        ],
      },
      {
        heading: "Heading levels",
        body: [
          "There are six headings, `<h1>` to `<h6>`. Use them to show hierarchy, not to make text big. One `<h1>` per page is a good habit — it is usually your main topic.",
        ],
        code: {
          lang: "html",
          code: `<h1>Web Development</h1>
<h2>HTML</h2>
<h3>Links</h3>`,
        },
      },
    ],
    tryIt: {
      instructions:
        "Create an HTML file with a heading, two paragraphs and a list of three things you want to build. Open it in your browser.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My page</title>
  </head>
  <body>
    <!-- Add your heading and paragraphs here -->
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My page</title>
  </head>
  <body>
    <h1>Hi, I'm learning to build</h1>
    <p>I am following the BuilderVerse web path.</p>
    <p>My goal this month is to finish a small project.</p>
    <h2>Things I want to build</h2>
    <ul>
      <li>A calculator</li>
      <li>A weather app</li>
      <li>My own portfolio</li>
    </ul>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Add an ordered (numbered) list of the steps you took to set up your development environment.",
      hint: "Ordered lists start with `<ol>` and use the same `<li>` items as unordered lists.",
      solution: `<ol>
  <li>Installed a code editor</li>
  <li>Created an index.html file</li>
  <li>Opened it in the browser</li>
</ol>`,
    },
    commonMistakes: [
      {
        mistake: "Forgetting the closing tag and the whole page breaks.",
        fix: "Indent as you type so mismatched tags are visually obvious. Your editor's auto-close helps too.",
      },
      {
        mistake: "Using headings like `<h1>` just to make text big.",
        fix: "Headings describe structure. Use CSS for size — you will learn that in the CSS path.",
      },
      {
        mistake: "Saving the file as .txt instead of .html.",
        fix: "Name the file `index.html`. In most editors, make sure 'Save as type' is not restricting you to plain text.",
      },
    ],
    quiz: [
      {
        question: "What is HTML mainly responsible for?",
        options: [
          "Structuring and describing content",
          "Making animations smooth",
          "Storing data on a server",
          "Compiling code into an app",
        ],
        correctIndex: 0,
        explanation:
          "HTML describes what content *is*. Styling is CSS, behaviour is JavaScript.",
      },
      {
        question: "Which tag contains the visible content of a page?",
        options: ["<head>", "<body>", "<title>", "<meta>"],
        correctIndex: 1,
        explanation:
          "The `<head>` is about the page; the `<body>` is what the visitor sees.",
      },
      {
        question: "What does `<h1>` represent?",
        options: [
          "The largest text possible",
          "The main heading of the page",
          "A hidden comment",
          "A horizontal line",
        ],
        correctIndex: 1,
        explanation:
          "`<h1>` is the top-level heading and usually matches the page's main topic.",
      },
    ],
  },
  {
    slug: "html-text-structure",
    title: "Text, lists and structure",
    summary: "Paragraphs, lists, emphasis and line breaks — the everyday tags.",
    order: 2,
    minutes: 14,
    xp: 40,
    concept:
      "Semantic text tags communicate the role of each block of content, which helps browsers, search engines and screen readers.",
    explanation: [
      "Real content needs more than headings. Paragraphs (`<p>`) hold prose, lists hold repeated items, and inline tags like `<strong>` and `<em>` add meaning to individual words.",
      "There are two list types: `<ul>` for unordered (bullet) lists and `<ol>` for ordered (numbered) lists. Both contain `<li>` list items. Lists are not just for bulleted text — navigation menus, footers and sidebars are all built from lists in real websites.",
      "Notice that HTML tags describe *meaning*, not appearance. `<strong>` means 'this is important' — browsers render it bold by default, and screen readers may emphasise it. That distinction matters for accessibility.",
    ],
    analogy:
      "HTML tags are like the formatting marks in a printed newspaper: headline, subheading, body copy, caption. The layout artist (CSS) decides the fonts later — the editor (HTML) decides what each piece *is*.",
    example: {
      lang: "html",
      code: `<article>
  <h2>Why I am learning to code</h2>
  <p>I want to <strong>build things</strong>, not only watch tutorials.</p>
  <p>Small steps, <em>every day</em>.</p>

  <h3>My plan</h3>
  <ol>
    <li>Finish the HTML path</li>
    <li>Style a project with CSS</li>
    <li>Add interactivity with JavaScript</li>
  </ol>

  <ul>
    <li>30 minutes a day</li>
    <li>Build something weekly</li>
  </ul>
</article>`,
      caption: "Meaning-first markup: structure before style.",
    },
    sections: [
      {
        heading: "Inline vs block",
        body: [
          "Block elements (`<p>`, `<h2>`, `<ul>`, `<div>`) take the full width and start on a new line. Inline elements (`<strong>`, `<em>`, `<a>`, `<span>`) sit inside a line of text.",
          "A common beginner bug is putting a `<div>` or `<p>` inside `<strong>` — block content cannot live inside inline content.",
        ],
      },
      {
        heading: "Line breaks and horizontal rules",
        body: [
          "`<br />` forces a line break. Use it sparingly — for poetry or an address — because spacing should normally come from CSS.",
          "`<hr />` creates a thematic break, like a scene change in a story. Visually it is usually a thin line.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Write a short 'About me' section using at least: one `<article>`, two paragraphs, one emphasised word, one important word, and both an ordered and an unordered list.",
      starter: `<article>
  <h2>About me</h2>
  <!-- build your content here -->
</article>`,
      solution: `<article>
  <h2>About me</h2>
  <p>
    I am an MCA student who wants to <strong>actually build</strong>
    projects instead of only following tutorials.
  </p>
  <p>I enjoy learning <em>one concept at a time</em>.</p>
  <h3>This month</h3>
  <ol>
    <li>Finish the HTML and CSS paths</li>
    <li>Build a calculator</li>
    <li>Put it on my portfolio</li>
  </ol>
  <ul>
    <li>Daily practice</li>
    <li>Weekly project</li>
  </ul>
</article>`,
    },
    challenge: {
      task:
        "Convert a plain paragraph of 4 lines about your favourite place into structured content with a heading, a list of reasons and one <em> word.",
      hint: "Break the paragraph into what it is really saying: a title, a description, and a list of reasons.",
      solution: `<h2>My favourite place</h2>
<p>A quiet corner of the city where I go to <em>think</em>.</p>
<ul>
  <li>It is calm in the morning</li>
  <li>Good tea nearby</li>
  <li>Fast Wi-Fi</li>
</ul>`,
    },
    commonMistakes: [
      {
        mistake: "Using <br /> repeatedly to space out content.",
        fix: "Add paragraphs instead. Repeated line breaks are a styling habit — CSS handles spacing later.",
      },
      {
        mistake: "Putting block elements like <div> inside <p> or <strong>.",
        fix: "Inline tags hold short text only. Keep block elements outside them.",
      },
      {
        mistake: "Writing whole pages as one giant paragraph.",
        fix: "If you cannot summarise a block in a few words, split it into two paragraphs or add a subheading.",
      },
    ],
    quiz: [
      {
        question: "What is the difference between <ul> and <ol>?",
        options: [
          "ul is for links, ol is for text",
          "ul creates bullets, ol creates numbers",
          "There is no difference",
          "ol is newer and always better",
        ],
        correctIndex: 1,
        explanation:
          "Both hold `<li>` items. `<ul>` is unordered (bullets), `<ol>` is ordered (numbers).",
      },
      {
        question: "Which tag marks text as especially important?",
        options: ["<em>", "<i>", "<strong>", "<span>"],
        correctIndex: 2,
        explanation:
          "`<strong>` carries real importance. `<em>` carries emphasis; `<i>` and `<span>` are stylistic or neutral.",
      },
      {
        question: "What is a block-level element?",
        options: [
          "An element that starts on a new line and takes full width",
          "An element that cannot be styled",
          "A tag that has no closing version",
          "An element only used in the <head>",
        ],
        correctIndex: 0,
        explanation:
          "Paragraphs, headings and lists are block-level: they stack vertically.",
      },
    ],
  },
  {
    slug: "html-links-images",
    title: "Links and images",
    summary:
      "Anchor tags, relative vs absolute URLs, and images with meaningful alt text.",
    order: 3,
    minutes: 14,
    xp: 40,
    concept:
      "An `<a>` tag navigates between pages using an `href` URL, and an `<img>` tag embeds a picture described by its `alt` text.",
    explanation: [
      "The web is held together by links. An anchor tag turns any text into a link: `<a href=\"about.html\">About me</a>`. The `href` attribute holds a URL — either a full absolute address like `https://developer.mozilla.org` or a relative path that points at a file inside your own project.",
      "Relative paths are what you will use most while building. If `about.html` sits in the same folder as `index.html`, you write `href=\"about.html\"`. If your images live in an `images` folder, you write `src=\"images/cat.jpg\"`. A path that starts with `..` means 'one folder up'. Because these paths depend on structure rather than a fixed location, you can move or share your whole project and every link keeps working.",
      "Images use `<img src=\"...\" alt=\"...\">`. There is no closing tag — `<img>` is a void element. The `alt` attribute is not optional decoration: screen readers read it aloud to visitors who cannot see the image, and browsers display it when the file fails to load.",
      "Two more useful tricks: `target=\"_blank\"` opens a link in a new tab (pair it with `rel=\"noopener\"` for safety), and `href=\"mailto:hello@example.com\"` opens the visitor's email app.",
    ],
    analogy:
      "An `href` works like a street address. An absolute address includes country, city and postcode, so it works from anywhere. A relative address says 'the shop next door' — quick and easy, but only meaningful if you are already standing in the right street.",
    example: {
      lang: "html",
      code: `<nav>
  <a href="index.html">Home</a>
  <a href="https://developer.mozilla.org" target="_blank" rel="noopener">
    MDN (opens in a new tab)
  </a>
  <a href="mailto:hello@example.com">Say hello</a>
</nav>

<p>
  My cat sits on the keyboard
  <img src="images/cat.jpg" alt="A grey cat resting on a laptop keyboard" width="300" />
  almost every evening.
</p>`,
      caption:
        "Three kinds of link — page, external, email — plus an image with descriptive alt text.",
    },
    sections: [
      {
        heading: "Relative vs absolute URLs",
        body: [
          "`about.html` — a file in the same folder.",
          "`pages/about.html` — a file inside a folder called `pages`.",
          "`../index.html` — one folder up, because `..` means the parent directory.",
          "`https://other-site.com/page` — a full absolute URL to somewhere else on the internet.",
        ],
      },
      {
        heading: "Alt text that actually helps",
        body: [
          "Describe what the image *shows*, in a short sentence. Bad: `alt=\"IMG_2043.jpg\"`. Good: `alt=\"Team celebrating after the hackathon\"`.",
          "If an image is purely decorative (a divider, a background flourish), use an empty `alt=\"\"` so screen readers skip it completely.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Build a two-page site: index.html links to about.html and back again. Give each page one image with real alt text, stored in an images/ folder.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Home</title>
  </head>
  <body>
    <h1>Welcome to my site</h1>
    <!-- Add a link to about.html and an image below -->
  </body>
</html>`,
      solution: `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Home</title>
  </head>
  <body>
    <h1>Welcome to my site</h1>
    <p><a href="about.html">Read about me</a></p>
    <img src="images/workspace.jpg" alt="A laptop with a coffee mug beside it" width="400" />
  </body>
</html>

<!-- about.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>About</title>
  </head>
  <body>
    <h1>About me</h1>
    <p>I am learning to build websites, one lesson at a time.</p>
    <img src="images/notebook.jpg" alt="An open notebook filled with handwritten HTML notes" width="400" />
    <p><a href="index.html">Back home</a></p>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Add a navigation bar to both pages: one link to your home page, one to a page inside a pages/ folder, and one to an external site that opens in a new tab.",
      hint: "Use `<a href>` for each destination, write the folder path with forward slashes, and add `target=\"_blank\"` only to the external link.",
      solution: `<nav>
  <a href="index.html">Home</a>
  <a href="pages/gallery.html">Gallery</a>
  <a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN</a>
</nav>`,
    },
    commonMistakes: [
      {
        mistake:
          "Pasting a full local path like C:/Users/me/site/about.html into href.",
        fix: "Use a relative path such as about.html. Local absolute paths break the moment the site moves to a server or another computer.",
      },
      {
        mistake: "Leaving alt out, or writing alt=\"image\" on every picture.",
        fix: "Describe what the picture shows in a short sentence — and use alt=\"\" only when the image is purely decorative.",
      },
      {
        mistake: "Using backslashes or forgetting the folder name in a path.",
        fix: "Write paths with forward slashes and include the folder: images/cat.jpg. Servers treat a backslash as part of the file name.",
      },
    ],
    quiz: [
      {
        question: "A link with href=\"pages/about.html\" goes where?",
        options: [
          "To a file named about.html inside a pages folder",
          "To the home page of a website called pages",
          "To a folder the browser creates automatically",
          "Back to the previous page in history",
        ],
        correctIndex: 0,
        explanation:
          "Paths are read left to right from your file's location: the `pages/` folder, then the file inside it.",
      },
      {
        question: "Why does every meaningful image need alt text?",
        options: [
          "It tells search engines the file size",
          "It describes the image for screen readers and shows if the file is missing",
          "It sets the width of the image",
          "It makes the image load faster",
        ],
        correctIndex: 1,
        explanation:
          "Alt text is the image's spoken description. It is also what the browser shows when the file path is wrong.",
      },
      {
        question: "What is the difference between an absolute and a relative URL?",
        options: [
          "Absolute URLs start with a protocol like https:// and point anywhere; relative URLs point within your project",
          "Absolute URLs are only for images",
          "Relative URLs always load faster",
          "There is no difference",
        ],
        correctIndex: 0,
        explanation:
          "Absolute URLs are complete addresses. Relative URLs are resolved from the current file, which keeps your project portable.",
      },
    ],
  },
  {
    slug: "html-forms",
    title: "Forms: capturing user input",
    summary:
      "The form element, input types, labels, buttons and the required attribute.",
    order: 4,
    minutes: 15,
    xp: 40,
    concept:
      "A `<form>` groups labelled input controls so the browser can collect what a visitor types and hand it over.",
    explanation: [
      "A form is a block of fields wrapped in a `<form>` tag. Each field is usually an `<input>` paired with a `<label>` that says what the field is for. The label's `for` attribute must match the input's `id` — that connection is what makes clicking the label focus the field, and what a screen reader announces before the visitor starts typing.",
      "The `type` attribute changes everything about an input. `text` is a normal line, `email` checks for an @ sign, `password` hides what is typed, `number` opens a numeric keypad and accepts `min` and `max`, while `checkbox` and `radio` let people pick options. Choosing the right type gives you free validation and the right keyboard on phones.",
      "`name` is what gives the value a key when the form is submitted — without it, the data is collected and then thrown away. `placeholder` is only a hint that vanishes the moment someone types; it can never replace a real label.",
      "Finally, `required` tells the browser to refuse submission until a field has a value, and a `<button type=\"submit\">` triggers that submission. This is friendly client-side help — always remember that the real security check happens on the server later on.",
    ],
    analogy:
      "A form is like a paper registration slip at a clinic. Printed labels tell you what belongs in each box, the boxes are your inputs, and the receptionist only accepts a slip where every required field is filled in.",
    example: {
      lang: "html",
      code: `<form>
  <label for="name">Name</label>
  <input id="name" name="name" type="text" placeholder="Ada Lovelace" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" placeholder="you@example.com" required />

  <label for="goal">Daily practice goal (minutes)</label>
  <input id="goal" name="goal" type="number" min="10" max="120" value="30" />

  <label>
    <input type="checkbox" name="updates" />
    Send me weekly practice reminders
  </label>

  <button type="submit">Sign up</button>
</form>`,
      caption:
        "Matching labels, sensible input types, a required check and a real submit button.",
    },
    sections: [
      {
        heading: "Pairing labels with inputs",
        body: [
          "The reliable pattern: `<label for=\"name\">` pointing at `<input id=\"name\">`. The two strings must match exactly, including capital letters.",
          "For checkboxes and radios you can wrap the input inside the label instead — then no `for` or `id` is needed, because clicking anywhere on the label toggles the box.",
        ],
        code: {
          lang: "html",
          code: `<label for="level">Skill level</label>
<input id="level" name="level" type="text" />

<label>
  <input type="radio" name="path" value="web" />
  Web development
</label>`,
        },
      },
      {
        heading: "Input types worth knowing",
        body: [
          "`email`, `url` and `number` come with built-in validation, so the browser checks the value before you ever see it.",
          "`checkbox` lets people pick several options; `radio` groups share one `name` so only one choice in the group can be selected.",
          "`date`, `password`, `tel` and `search` each trigger the most useful keyboard or picker on mobile devices.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Build a 'Join the club' form with a name field, an email field, a password field, a radio group for Beginner or Intermediate, and a submit button. Every field needs its own label.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Join the club</title>
  </head>
  <body>
    <h1>Join the club</h1>
    <form>
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />
      <!-- Add email, password, radio group and submit button -->
    </form>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Join the club</title>
  </head>
  <body>
    <h1>Join the club</h1>
    <form>
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder="you@example.com" required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" minlength="8" required />

      <p>Choose your level:</p>
      <label>
        <input type="radio" name="level" value="beginner" checked />
        Beginner
      </label>
      <label>
        <input type="radio" name="level" value="intermediate" />
        Intermediate
      </label>

      <button type="submit">Create account</button>
    </form>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Make the email field required and add a number input for age with a minimum of 13. Then open the page and try submitting with the fields empty — watch the browser stop you.",
      hint: "`required` goes on the input itself, and `min=\"13\"` only works on an input with `type=\"number\"`.",
      solution: `<label for="email">Email</label>
<input id="email" name="email" type="email" required />

<label for="age">Age</label>
<input id="age" name="age" type="number" min="13" />`,
    },
    commonMistakes: [
      {
        mistake: "Using placeholder text as the only label.",
        fix: "Placeholders disappear while typing. Add a real `<label for>` so the field is always named, for everyone.",
      },
      {
        mistake: "The label's for value does not match the input's id.",
        fix: "Make them identical strings — `<label for=\"email\">` with `<input id=\"email\">` — so clicking the label focuses the field.",
      },
      {
        mistake: "Forgetting the name attribute on an input.",
        fix: "Add `name=\"field\"` to every input; without a name the value never gets a key and is lost on submission.",
      },
    ],
    quiz: [
      {
        question: "How does a label know which input it belongs to?",
        options: [
          "The label's for matches the input's id",
          "Both tags must share the same name attribute",
          "They just have to be on the same line",
          "The input's type decides it automatically",
        ],
        correctIndex: 0,
        explanation:
          "`for` and `id` are a matching pair. That link powers click-to-focus and screen reader announcements.",
      },
      {
        question: "What does the required attribute do?",
        options: [
          "Makes the field's text bold",
          "Sends the form immediately",
          "The browser blocks submission until the field has a value",
          "Marks the field as optional",
        ],
        correctIndex: 2,
        explanation:
          "`required` is a built-in check: submit is refused until every required field contains something.",
      },
      {
        question: "Which input type is best for an email address?",
        options: [
          "type=\"text\"",
          "type=\"email\"",
          "type=\"letter\"",
          "type=\"mail\"",
        ],
        correctIndex: 1,
        explanation:
          "`type=\"email\"` validates for an @ sign and brings up the email keyboard on phones. The other two types do not exist.",
      },
    ],
  },
  {
    slug: "html-semantics",
    title: "Semantic HTML and accessibility",
    summary:
      "header, nav, main, section, article and footer — and why meaningful markup opens your page to everyone.",
    order: 5,
    minutes: 14,
    xp: 40,
    concept:
      "Semantic elements state the role of a block of content, so browsers, search engines and assistive technology can understand your page.",
    explanation: [
      "`<div>` and `<span>` are blank boxes: they group content but say nothing about it. Semantic tags carry meaning in their names. `<header>` holds the top band of a page, `<nav>` holds the main navigation, `<main>` wraps the unique content of this page, `<article>` holds something self-contained, `<section>` groups related content under a heading, and `<footer>` closes the page with credits or secondary links.",
      "Screen reader users navigate by landmarks. With semantic tags they can jump straight to the navigation or the main content; with a wall of divs they must listen to the entire page in order. The same structure helps search engines, reader modes and validators make sense of your work.",
      "Accessibility simply means designing your page so everyone can use it — people with visual, motor or cognitive differences included. Semantic HTML is the cheapest, most durable accessibility there is: no extra libraries, just honest markup that says what each part is.",
      "Aim for one `<main>` per page, a clear heading hierarchy inside it, and landmarks where you would expect them. Ten seconds of honest tagging pays off for years.",
    ],
    analogy:
      "A department store labels its sections — Menswear, Checkout, Customer Service. A store with no signs still contains all the same things, but anyone who cannot see the layout, or is navigating with a map, will never find them.",
    example: {
      lang: "html",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Builder log</title>
  </head>
  <body>
    <header>
      <h1>Builder log</h1>
      <nav>
        <a href="index.html">Home</a>
        <a href="posts.html">Posts</a>
      </nav>
    </header>

    <main>
      <article>
        <h2>Week 1: my first web page</h2>
        <p>I wrote three tags and a browser made a page. That still feels like magic.</p>
      </article>

      <section>
        <h2>Coming up</h2>
        <ul>
          <li>Adding images</li>
          <li>Styling with CSS</li>
        </ul>
      </section>
    </main>

    <footer>
      <p>Built while learning on BuilderVerse.</p>
    </footer>
  </body>
</html>`,
      caption:
        "A page skeleton where every element announces the job it does.",
    },
    sections: [
      {
        heading: "Which tag for which job",
        body: [
          "`<header>` — logo, page title, top-level navigation.",
          "`<nav>` — the main links. Skip it for pages with only one or two.",
          "`<main>` — the unique content of this page, exactly one visible `<main>` per page.",
          "`<article>` — self-contained content that still makes sense on its own: a post, a card, a comment.",
          "`<section>` — a themed group of content, usually with its own heading.",
          "`<footer>` — copyright, contact details, secondary links.",
        ],
      },
      {
        heading: "Why accessibility matters",
        body: [
          "Around one in six people live with some form of disability, and many more browse on a small screen, in bright sunlight, or with a keyboard only.",
          "Landmarks, headings and alt text are the ramp to your building. They take seconds to add and last the life of the project.",
          "Bonus: the same structure improves search ranking and makes your code far easier for a teammate — or future you — to read.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Take the div-based page below and rebuild it using semantic tags: one header, one nav, one main, an article for the post, and a footer.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My blog</title>
  </head>
  <body>
    <div class="top">
      <div class="title">My blog</div>
      <div class="links"><a href="index.html">Home</a></div>
    </div>
    <div class="content">
      <div class="post">
        <div class="post-title">Day one</div>
        <p>Today I learned what semantic HTML means.</p>
      </div>
    </div>
    <div class="bottom">Copyright me</div>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My blog</title>
  </head>
  <body>
    <header>
      <h1>My blog</h1>
      <nav>
        <a href="index.html">Home</a>
      </nav>
    </header>

    <main>
      <article>
        <h2>Day one</h2>
        <p>Today I learned what semantic HTML means.</p>
      </article>
    </main>

    <footer>
      <p>Copyright me</p>
    </footer>
  </body>
</html>`,
    },
    challenge: {
      task:
        "This page has two problems: three `<main>` elements, and a `<section>` with no heading inside it. Fix both so the structure is honest.",
      hint: "A page has exactly one visible `<main>`. If a block has no heading that names it, ask whether it is really a section.",
      solution: `<!-- Keep a single main around the page's unique content -->
<main>
  <article>
    <h2>My first project</h2>
    <p>A small calculator built from scratch.</p>
  </article>

  <!-- Give the section a heading, or turn it into a div if it is only a wrapper -->
  <section>
    <h2>Other projects</h2>
    <p>A weather dashboard and a quiz app.</p>
  </section>
</main>`,
    },
    commonMistakes: [
      {
        mistake: "More than one <main> element on a page, or none at all.",
        fix: "Exactly one visible `<main>` per page — it wraps the content that is unique to that page.",
      },
      {
        mistake: "Wrapping everything in <div> because it always works.",
        fix: "Replace any div whose job you know with header, nav, main, article, section or footer. Keep divs for genuine styling wrappers.",
      },
      {
        mistake: "<section> used as a generic box with no heading.",
        fix: "If a heading names the group, use `<section>`. If the box exists only for CSS, it should be a `<div>`.",
      },
    ],
    quiz: [
      {
        question: "Which element wraps the page's main unique content?",
        options: ["<header>", "<main>", "<section>", "<footer>"],
        correctIndex: 1,
        explanation:
          "`<main>` holds what is unique about this page; `<header>`, `<section>` and `<footer>` are supporting landmarks.",
      },
      {
        question:
          "Why do screen reader users benefit from <nav> and <main>?",
        options: [
          "They make the page load faster",
          "They act as landmarks the user can jump between",
          "They increase the font size automatically",
          "They hide advertisements",
        ],
        correctIndex: 1,
        explanation:
          "Assistive technology lists landmarks so a user can skip straight to navigation or content instead of listening to everything.",
      },
      {
        question: "How many <main> elements should a page have?",
        options: [
          "One per section",
          "As many as you like",
          "Exactly one",
          "None — it is deprecated",
        ],
        correctIndex: 2,
        explanation:
          "Exactly one visible `<main>` per page. Multiple mains confuse both browsers and screen readers.",
      },
    ],
  },
];
