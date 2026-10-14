import type { Lesson } from "../types";

export const domLessons: Lesson[] = [
  {
    slug: "dom-selecting-elements",
    title: "Selecting elements",
    summary:
      "querySelector, querySelectorAll and getElementById — how JavaScript finds the element you want.",
    order: 1,
    minutes: 12,
    xp: 40,
    concept:
      "The browser turns your HTML into a tree of objects called the DOM, and JavaScript works by selecting nodes from that tree.",
    explanation: [
      "When a browser loads your HTML it builds a live tree of objects called the DOM (Document Object Model). Every tag becomes an object your script can hold on to. Before you can change a heading, highlight a button or count the list items, you need a reference to those elements — and you get references by selecting them.",
      "The tool you will use most is document.querySelector(). It accepts any CSS selector you already know — #welcome, .banner, nav a, li:nth-child(2) — and returns the *first* matching element. If nothing matches, it returns null instead of throwing an error.",
      "document.querySelectorAll() works the same way but returns every match as a NodeList, a list you can loop over. When an element already has an id, document.getElementById(\"welcome\") is a fast, readable shortcut that returns exactly that one element.",
      "Selection happens at a single moment in time. Run your script too early and the element does not exist yet, so the selector hands back null — that is why scripts usually go at the end of the body or use the defer attribute.",
    ],
    analogy:
      "It is like dialling a department before you can speak to anyone: the selector is the phone number, and the element it returns is the person on the line who can actually make the change for you.",
    example: {
      lang: "html",
      code: `<p id="welcome" class="banner highlight">Hello!</p>
<p class="banner">Second banner</p>

<script>
  const welcome = document.querySelector("#welcome");
  console.log(welcome.textContent); // "Hello!"

  const banners = document.querySelectorAll(".banner");
  console.log(banners.length); // 2

  const sameOne = document.getElementById("welcome");
  console.log(sameOne === welcome); // true
</script>`,
      caption: "Three ways to reach the same element.",
    },
    sections: [
      {
        heading: "Which selector should I use?",
        body: [
          "Use `querySelector` when you want one element and like CSS syntax. It is the most flexible option because every CSS selector works, not just ids and classes.",
          "Use `querySelectorAll` when you need many, then loop over the result with `forEach` to act on each one.",
          "Use `getElementById` when the element already has an id. It is slightly quicker and reads clearly, but remember ids must be unique across the page.",
        ],
        code: {
          lang: "javascript",
          code: `const items = document.querySelectorAll("li");

items.forEach(function (item, index) {
  console.log(index, item.textContent);
});`,
        },
      },
      {
        heading: "Why am I getting null?",
        body: [
          "A null result means your selector matched nothing. The usual causes are a typo, a class name that changed, or a script that ran before the HTML was parsed.",
          "Guard your code before using the result: `if (el) { ... }` skips the rest when nothing was found, which turns a confusing crash into a quiet, fixable check.",
          "Selectors are also case sensitive. `#Welcome` and `#welcome` are two different ids as far as the browser is concerned.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Create a page with an unordered list of three hobbies. Select the list with querySelector, select every list item with querySelectorAll, and log how many there are.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Selecting elements</title>
  </head>
  <body>
    <ul id="hobbies">
      <li>Drawing</li>
      <li>Cycling</li>
      <li>Cooking</li>
    </ul>

    <script>
      // 1. select #hobbies and log it
      // 2. select every <li> and log the count
      // 3. log each hobby's text with forEach
    </script>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Selecting elements</title>
  </head>
  <body>
    <ul id="hobbies">
      <li>Drawing</li>
      <li>Cycling</li>
      <li>Cooking</li>
    </ul>

    <script>
      const list = document.querySelector("#hobbies");
      console.log(list); // the <ul> element

      const items = document.querySelectorAll("#hobbies li");
      console.log("There are " + items.length + " hobbies");

      items.forEach(function (item) {
        console.log(item.textContent);
      });
    </script>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Select the second hobby and log its text, then log the tag name of the list itself (it should print UL).",
      hint:
        "CSS selectors work inside querySelector too: `#hobbies li:nth-child(2)` targets the second item. Every element has an uppercase `.tagName` property.",
      solution: `const second = document.querySelector("#hobbies li:nth-child(2)");
console.log(second.textContent); // "Cycling"

const list = document.querySelector("#hobbies");
console.log(list.tagName); // "UL"`,
    },
    commonMistakes: [
      {
        mistake:
          "Calling querySelector before the elements exist, so you get null.",
        fix: "Place the script just before the closing body tag (or add the defer attribute) so the HTML is parsed first.",
      },
      {
        mistake: "Assuming querySelectorAll returns a normal array.",
        fix: "It returns a NodeList. forEach works on it directly; for map or filter, convert first with Array.from(items) or [...items].",
      },
      {
        mistake: "A one-character typo in the selector silently returns null.",
        fix: "Check before using: if (el) { ... }. Also double-check the spelling — selectors are case sensitive.",
      },
    ],
    quiz: [
      {
        question: "What does document.querySelector(\".card\") return?",
        options: [
          "The text inside the first card",
          "Every element with class card",
          "The first element with class card, or null if there is none",
          "A number showing how many cards exist",
        ],
        correctIndex: 2,
        explanation:
          "querySelector always returns the first match only. Use querySelectorAll when you want all of them.",
      },
      {
        question:
          "You need to loop over every <li> on the page. Which method should you use?",
        options: [
          "document.querySelector(\"li\")",
          "document.querySelectorAll(\"li\")",
          "document.getElementById(\"li\")",
          "document.location.href",
        ],
        correctIndex: 1,
        explanation:
          "querySelectorAll returns a NodeList of every match, which you can loop over with forEach.",
      },
      {
        question: "When might querySelector return null?",
        options: [
          "Every time — it never returns an element",
          "Only when you use a class selector",
          "When the script ran before the element existed, or the selector matched nothing",
          "Only when the page has more than 100 elements",
        ],
        correctIndex: 2,
        explanation:
          "null means 'nothing matched'. Check for it, and make sure your script runs after the HTML is in place.",
      },
    ],
  },
  {
    slug: "dom-events",
    title: "Listening for events",
    summary:
      "addEventListener, click and input events, the event object, preventDefault and event delegation.",
    order: 2,
    minutes: 14,
    xp: 40,
    concept:
      "Events are the browser telling your code that something happened, and addEventListener is how you sign up to hear about it.",
    explanation: [
      "Pages do not run your code on their own. Something has to happen first: a click, a keystroke, a form submit. JavaScript calls each of these an event, and you attach code to them with element.addEventListener(\"click\", handler).",
      "The handler is a function that runs every time the event fires. It receives an event object packed with useful details: event.target is the element that was actually clicked, event.currentTarget is the element you attached the listener to, and for keyboard events event.key tells you which key was pressed.",
      "You can register as many listeners as you like on a single element — they stack instead of overwriting each other. That is exactly why addEventListener replaced the older onclick style of wiring things up.",
      "Some events come with a default behaviour attached: submitting a form reloads the page, clicking a link navigates away. Calling event.preventDefault() cancels that default so your JavaScript stays in charge of what happens next.",
    ],
    analogy:
      "Think of a doorbell. The doorbell (the element) announces that something happened (the event), and whoever is listening inside (your handler function) decides what to do about it — answer, wave, or ignore.",
    example: {
      lang: "javascript",
      code: `const button = document.querySelector("#counter");
let count = 0;

button.addEventListener("click", function (event) {
  count += 1;
  button.textContent = "Clicked " + count + " times";

  console.log(event.type);   // "click"
  console.log(event.target); // the <button> element
});`,
      caption: "A click listener that updates the button and inspects the event object.",
    },
    sections: [
      {
        heading: "Forms, input and preventDefault",
        body: [
          "The `input` event fires on every keystroke, which is perfect for live search boxes, character counters and instant validation.",
          "The `submit` event fires when the form's button is pressed. Browsers reload the page by default, so call `event.preventDefault()` first — otherwise everything you typed disappears before you can read it.",
        ],
        code: {
          lang: "javascript",
          code: `const form = document.querySelector("#signup");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = form.querySelector("input").value;
  console.log("Thanks! We would save:", email);
});`,
        },
      },
      {
        heading: "Event delegation",
        body: [
          "Instead of attaching a listener to every list item, attach one listener to the parent and work out which child was clicked using event.target.",
          "This trick is called event delegation. Because the parent keeps listening, it works for items you add *later* too — no extra wiring needed.",
          "`event.target.closest(\"li\")` is the tidy version: it climbs up from whatever was clicked until it finds the list item, so clicking inner text still works.",
        ],
        code: {
          lang: "javascript",
          code: `const list = document.querySelector("#tasks");

list.addEventListener("click", function (event) {
  const item = event.target.closest("li");
  if (item) {
    console.log("You clicked:", item.textContent);
  }
});`,
        },
      },
    ],
    tryIt: {
      instructions:
        "Build a form with a text input and a Send button. Stop the page from reloading on submit, read the value, and append it as a new item in the list below the form. Ignore empty submissions.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Events</title>
  </head>
  <body>
    <form id="shout">
      <input type="text" id="shout-input" placeholder="Say something" />
      <button type="submit">Send</button>
    </form>

    <ul id="shout-list"></ul>

    <script>
      // listen for submit on #shout
      // call event.preventDefault()
      // read the input value and add it to the list
    </script>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Events</title>
  </head>
  <body>
    <form id="shout">
      <input type="text" id="shout-input" placeholder="Say something" />
      <button type="submit">Send</button>
    </form>

    <ul id="shout-list"></ul>

    <script>
      const form = document.querySelector("#shout");
      const input = document.querySelector("#shout-input");
      const list = document.querySelector("#shout-list");

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = input.value.trim();
        if (text === "") return;

        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
        input.value = "";
      });
    </script>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Add a paragraph with id=\"count\" right after the input. Make it show 0/50, then update on every keystroke to 12/50 — and switch to the message Too long! once the text passes 50 characters.",
      hint:
        "Listen for the `input` event on the text field. Inside the handler, `event.target.value.length` is the current character count.",
      solution: `<p id="count">0/50</p>

<script>
  const input = document.querySelector("#shout-input");
  const count = document.querySelector("#count");

  input.addEventListener("input", function (event) {
    const length = event.target.value.length;

    count.textContent =
      length > 50 ? "Too long! (" + length + ")" : length + "/50";
  });
</script>`,
    },
    commonMistakes: [
      {
        mistake:
          "Using button.onclick = fn, which quietly overwrites the previous handler.",
        fix: "Use addEventListener instead, so several handlers can live on the same element without fighting.",
      },
      {
        mistake:
          "Forgetting event.preventDefault() on a form submit, so the page reloads and the value vanishes.",
        fix: "Make event.preventDefault() the first line of your submit handler, then read the value.",
      },
      {
        mistake:
          "Attaching a listener to every list item, including the ones added later.",
        fix: "Delegate instead: listen once on the parent and use event.target.closest(\"li\") to find which item was hit.",
      },
    ],
    quiz: [
      {
        question: "What does element.addEventListener(\"click\", fn) do?",
        options: [
          "Removes the element from the page",
          "Runs fn every time that element is clicked",
          "Reloads the page immediately",
          "Changes the element's HTML",
        ],
        correctIndex: 1,
        explanation:
          "addEventListener registers your function as a listener for the named event on that element.",
      },
      {
        question:
          "Why do you usually call event.preventDefault() inside a submit handler?",
        options: [
          "To delete the form after it is sent",
          "To make every future event stop firing",
          "To stop the browser's default action, such as reloading the page",
          "To pause the script for a few seconds",
        ],
        correctIndex: 2,
        explanation:
          "Forms reload the page by default. preventDefault() cancels that so your JavaScript can handle the data first.",
      },
      {
        question: "What is event delegation?",
        options: [
          "Handing your event code to another developer",
          "Listening on a parent element and using event.target to work out which child was clicked",
          "Adding a separate listener to every child element",
          "Waiting five seconds before running your handler",
        ],
        correctIndex: 1,
        explanation:
          "One listener on the container covers every child — including items you add to the page later.",
      },
    ],
  },
  {
    slug: "dom-changing-content",
    title: "Changing content",
    summary:
      "textContent, classList and style — plus creating and removing elements while the page runs.",
    order: 3,
    minutes: 15,
    xp: 40,
    concept:
      "Once an element is selected you can rewrite its text, toggle its classes, adjust its style, or build and remove nodes as data changes.",
    explanation: [
      "The simplest change is text: element.textContent = \"Done\" replaces everything inside that element. Prefer textContent over innerHTML for plain text — textContent shows <b>hi</b> as literal characters instead of parsing it as markup, which keeps you safe from accidental or malicious HTML.",
      "Visual state belongs in CSS, and JavaScript should switch classes: classList.add(\"active\"), classList.remove(...) and classList.toggle(...). Toggle one class and every rule you attached to it — colours, sizes, transitions — updates at once, without a single inline style.",
      "For a quick one-off tweak, element.style.backgroundColor = \"red\" works fine. But inline styles are hard to override later, so reach for a class whenever the change is bigger than a line or two.",
      "Pages also grow and shrink at runtime. document.createElement(\"li\") makes a new node in memory, list.appendChild(node) puts it on the page, and node.remove() takes it away again. Nothing appears until you attach it.",
    ],
    analogy:
      "It is like updating a whiteboard: you can rewrite a line (textContent), stamp a status sticker over it (classList), or wipe a section and write something brand new (remove plus create).",
    example: {
      lang: "javascript",
      code: `const list = document.querySelector("#list");
const addBtn = document.querySelector("#add");

let number = 1;

addBtn.addEventListener("click", function () {
  const item = document.createElement("li");
  item.textContent = "Item " + number;
  item.classList.add("todo");
  list.appendChild(item);
  number += 1;
});

list.addEventListener("click", function (event) {
  const item = event.target.closest("li");
  if (item) item.remove();
});`,
      caption: "Click Add to build list items, then click an item to remove it.",
    },
    sections: [
      {
        heading: "classList: the tidy way to style",
        body: [
          "`classList.add`, `classList.remove` and `classList.toggle` change one class while leaving every other class on the element alone.",
          "`classList.toggle(\"expanded\")` flips it: it adds the class when it is missing and removes it when it is present — exactly what a show/hide panel needs.",
          "`classList.contains(\"expanded\")` asks a yes-or-no question you can use in an if statement.",
        ],
        code: {
          lang: "javascript",
          code: `const card = document.querySelector("#card");

card.classList.toggle("expanded");

if (card.classList.contains("expanded")) {
  console.log("The card is open");
}`,
        },
      },
      {
        heading: "textContent or innerHTML?",
        body: [
          "innerHTML re-parses whatever string you give it as HTML. That is useful for markup you wrote yourself, but risky for text that came from a user or an API.",
          "textContent treats everything as plain text and is also faster. Use it for labels, titles and data — use innerHTML only when you genuinely need to insert tags you control.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Add an input and an Add button to your page. Each click should append a new list item, and clicking an existing item should toggle a done class that strikes it through. Ignore empty input.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Changing content</title>
    <style>
      .done { text-decoration: line-through; color: #888; }
    </style>
  </head>
  <body>
    <input id="new-item" placeholder="New task" />
    <button id="add">Add</button>

    <ul id="tasks"></ul>

    <script>
      // read #new-item, create an <li>, append it to #tasks
      // then delegate a click on #tasks that toggles .done
    </script>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Changing content</title>
    <style>
      .done { text-decoration: line-through; color: #888; }
    </style>
  </head>
  <body>
    <input id="new-item" placeholder="New task" />
    <button id="add">Add</button>

    <ul id="tasks"></ul>

    <script>
      const input = document.querySelector("#new-item");
      const addBtn = document.querySelector("#add");
      const list = document.querySelector("#tasks");

      addBtn.addEventListener("click", function () {
        const text = input.value.trim();
        if (text === "") return;

        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
        input.value = "";
      });

      list.addEventListener("click", function (event) {
        const item = event.target.closest("li");
        if (item) item.classList.toggle("done");
      });
    </script>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Add a Remove last button and a paragraph with id=\"count\" that always shows how many items are on the list (for example 3 items). Update the count after every add and every remove.",
      hint:
        "`list.lastElementChild` is the final list item, and `list.children.length` tells you how many direct children exist. Put the count update in a small function and call it from each handler.",
      solution: `<button id="remove-last">Remove last</button>
<p id="count">0 items</p>

<script>
  const removeBtn = document.querySelector("#remove-last");
  const count = document.querySelector("#count");

  function updateCount() {
    count.textContent = list.children.length + " items";
  }

  removeBtn.addEventListener("click", function () {
    if (list.lastElementChild) list.lastElementChild.remove();
    updateCount();
  });

  // Call updateCount() inside your add handler too,
  // so the number stays fresh after every change.
</script>`,
    },
    commonMistakes: [
      {
        mistake:
          "Setting element.innerHTML = text when the text came from a user.",
        fix: "Use textContent instead — it treats the string as plain text, so markup can never sneak in and run.",
      },
      {
        mistake:
          "Creating an element with createElement but never attaching it, so nothing shows up.",
        fix: "The node only lives in memory until you attach it: list.appendChild(item) puts it on the page.",
      },
      {
        mistake:
          "Editing element.style for every visual change instead of using classes.",
        fix: "Keep the look in CSS under one class and switch it with classList.toggle — one line of JS, all the styles for free.",
      },
    ],
    quiz: [
      {
        question: "What is the main difference between textContent and innerHTML?",
        options: [
          "textContent only works on headings",
          "textContent sets plain text safely; innerHTML parses the string as HTML",
          "innerHTML sets plain text; textContent parses HTML",
          "There is no difference",
        ],
        correctIndex: 1,
        explanation:
          "innerHTML interprets tags, which is handy for trusted markup and dangerous for user data. textContent always treats input as text.",
      },
      {
        question: "What does card.classList.toggle(\"open\") do?",
        options: [
          "Opens a new browser window",
          "Deletes every class on the element",
          "Adds open if it is missing, removes it if it is already there",
          "Refreshes the page",
        ],
        correctIndex: 2,
        explanation:
          "toggle flips the class on and off, which makes it perfect for show/hide behaviour driven by one CSS rule.",
      },
      {
        question:
          "You built a new <li> with createElement but the page looks unchanged. Why?",
        options: [
          "createElement only works with <div>",
          "The element was never attached to the page with appendChild",
          "New elements need a CSS file",
          "You must call querySelector first",
        ],
        correctIndex: 1,
        explanation:
          "createElement creates an orphan node in memory. Append it to an element that is already on the page to see it.",
      },
    ],
  },
];
