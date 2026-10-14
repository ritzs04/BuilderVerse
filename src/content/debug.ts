import type { DebugChallenge } from "./types";

/**
 * Error Companion puzzles: small, realistic snippets with one subtle bug each.
 * The tone is deliberately supportive — a bug is a puzzle, never a scolding.
 */
export const debugChallenges: DebugChallenge[] = [
  {
    slug: "typo-in-variable",
    title: "The Missing Letter",
    language: "javascript",
    difficulty: "Easy",
    buggyCode: `const user = { name: "Ava", score: 120 };
const greeting = "Hello, " + nam;
console.log(greeting);`,
    symptom:
      "Something isn't working: the console says `nam is not defined`, and the greeting never prints.",
    whatHappened:
      "JavaScript stopped at that line, so nothing after it ran and no greeting appeared in the console.",
    whyItHappened:
      "The variable is called `name`, but the line reads `nam`. JavaScript treats `nam` as a completely different word it has never seen before.",
    guidingQuestion:
      "Look carefully at every letter of the variable inside that line — does JavaScript know a word called `nam`?",
    hints: [
      "Compare the spelling on that line with the spelling on the line directly above it, letter by letter.",
      "One letter is missing from the front of the variable name — the original declaration still has it.",
    ],
    explanation:
      "Typo bugs happen because JavaScript never guesses: a name that differs by even one letter is a brand-new identifier, and the engine has no way to know what you meant. Spell-checkers rarely catch code words, so the reliable defence is letting your editor or linter flag undeclared names, plus re-reading identifier spellings whenever a ReferenceError mentions a word that looks almost right.",
    fixedCode: `const user = { name: "Ava", score: 120 };
const greeting = "Hello, " + name;
console.log(greeting);`,
    fixSummary:
      "Replaced `nam` with `name`, matching the variable declared on the first line.",
    checks: [
      ["name", "nam", "rename"],
      ["typo", "spelling", "letter", "correct"],
    ],
    xp: 30,
  },
  {
    slug: "assignment-in-condition",
    title: "The Condition That Never Stops Agreeing",
    language: "javascript",
    difficulty: "Easy",
    buggyCode: `let score = 40;

if (score = 50) {
  console.log("You pass!");
} else {
  console.log("Try again.");
}

console.log("Score is now:", score);`,
    symptom:
      "Something unexpected happened: the console always says `You pass!` even though the score starts at 40 — and afterwards the score reads 50.",
    whatHappened:
      "The first branch runs every single time, and the score quietly changes to 50 along the way.",
    whyItHappened:
      "A single `=` assigns a value instead of comparing two values. An assignment returns what it stored, and 50 counts as truthy, so the condition is always true.",
    guidingQuestion:
      "In that condition, is JavaScript comparing `score` with 50 — or doing something else entirely with it?",
    hints: [
      "Print `score` after the if block: did the condition change your data?",
      "Comparison uses a different operator — count how many `=` signs it has.",
    ],
    explanation:
      "JavaScript's `=` always writes a value, and conditions accept any value's truthiness, so this mistake throws no error — it silently mutates your data and forces a branch. Using `===` compares without converting types and keeps the condition free of side effects. Linters flag assignments inside conditions precisely because they look almost correct.",
    fixedCode: `let score = 40;

if (score === 50) {
  console.log("You pass!");
} else {
  console.log("Try again.");
}

console.log("Score is now:", score);`,
    fixSummary:
      "Swapped the single `=` for `===` so the line compares instead of assigning.",
    checks: [
      ["==", "===", "equal"],
      ["compare", "comparison", "instead of assign"],
    ],
    xp: 30,
  },
  {
    slug: "string-number-concat",
    title: "The Addition That Glued",
    language: "javascript",
    difficulty: "Easy",
    buggyCode: `const quantity = "3";
const price = 4;
const total = quantity + price;

console.log("Total: " + total);`,
    symptom:
      "Something unexpected happened — the console prints `Total: 34` instead of a number you can calculate with.",
    whatHappened:
      "The two values were joined into the text `34`, so `total` ended up as text rather than the number 7.",
    whyItHappened:
      "`quantity` is written inside quotes, so it is text. When `+` meets text on either side, JavaScript joins the pieces instead of doing arithmetic.",
    guidingQuestion:
      "Look at the very first value — is it written the same way as `price`, and what does `+` do when one side is text?",
    hints: [
      "Compare how `quantity` and `price` are written: which one has quotes around it?",
      "Text always wins in a `+` contest — give that value a different kind and the result changes.",
    ],
    explanation:
      "JavaScript's `+` is overloaded: it adds numbers but concatenates as soon as any operand is a string, and it will not warn you. Values from HTML inputs, URLs and JSON often arrive as strings even when they look numeric, so convert explicitly with `Number(...)` or `parseFloat(...)` first. Checking `typeof` before adding is a cheap way to catch this class of bug early.",
    fixedCode: `const quantity = 3;
const price = 4;
const total = quantity + price;

console.log("Total: " + total);`,
    fixSummary:
      "Removed the quotes so `quantity` is a number, letting `+` do arithmetic instead of joining text.",
    checks: [
      ["number", "numeric", "int", "float"],
      ["quote", "string", "text", "unquoted"],
    ],
    xp: 30,
  },
  {
    slug: "unclosed-html-tag",
    title: "The Tag That Never Said Goodbye",
    language: "html",
    difficulty: "Easy",
    buggyCode: `<article class="post">
  <h2>Ship Small</h2>
  <p>One feature, one evening.</p>

<div class="footer">Posted by Ada</div>`,
    symptom:
      "Something looks off on the page: the footer has picked up the article's card styling, and everything below it sits nested inside the post.",
    whatHappened:
      "The browser never closed the `<article>`, so it kept the element open and pulled the footer (and anything after it) inside it before closing everything at the end of the page.",
    whyItHappened:
      "The opening `<article>` tag has no matching `</article>`, and HTML nesting is decided entirely by those tags — an unclosed one swallows everything that follows.",
    guidingQuestion:
      "Start at the top and tick off each opening tag as you find its partner — does every one of them get a closing tag?",
    hints: [
      "The element opened on the very first line — where does it actually end?",
      "Count the opening tags and the closing tags: one of them appears only once.",
    ],
    explanation:
      "HTML is a tree, and every open tag must be closed or the browser will keep that node open, quietly reparenting later content and dragging its styles along. Browsers recover by auto-closing at `</body>`, which is why the page still renders — just with a different structure than you designed. Pair tags as you type (most editors highlight the matching partner) and run questionable markup through an HTML validator.",
    fixedCode: `<article class="post">
  <h2>Ship Small</h2>
  <p>One feature, one evening.</p>

  <div class="footer">Posted by Ada</div>
</article>`,
    fixSummary:
      "Added the missing `</article>` closing tag so the footer lives outside the post.",
    checks: [
      ["close", "closing", "closed", "end tag"],
      ["article", "tag", "pair"],
    ],
    xp: 30,
  },
  {
    slug: "off-by-one-loop",
    title: "The Loop With One Extra Lap",
    language: "javascript",
    difficulty: "Medium",
    buggyCode: `const scores = [70, 85, 90];
let total = 0;

for (let i = 0; i <= scores.length; i++) {
  total += scores[i];
}

const average = total / scores.length;
console.log(average);`,
    symptom:
      "Something unexpected happened — the console shows `NaN` where the average should be, even though the numbers look fine.",
    whatHappened:
      "The loop made four passes over a three-item list, the last pass added an empty value, and the running total became `NaN` so the average printed as `NaN` too.",
    whyItHappened:
      "The condition uses `<=`, so `i` also reaches `scores.length`. Arrays are numbered from 0, so that position is one past the end and holds no value.",
    guidingQuestion:
      "If the list holds 3 items numbered 0, 1, 2 — what does `scores[3]` return, and what does adding that do to `total`?",
    hints: [
      "Write out every value `i` takes with `<=` — does the last one point at a real item?",
      "The last valid index is always one less than `.length`. What does that say about the comparison symbol?",
    ],
    explanation:
      "Off-by-one errors live at boundaries: with 0-based indexing the valid indexes are 0 to length-1, so any loop that reaches `length` reads `undefined`. Adding `undefined` to a number produces `NaN`, which quietly poisons the rest of the maths instead of throwing an error. Get in the habit of asking what the first and last value of your counter will be, and reach for `i < arr.length` when looping by index.",
    fixedCode: `const scores = [70, 85, 90];
let total = 0;

for (let i = 0; i < scores.length; i++) {
  total += scores[i];
}

const average = total / scores.length;
console.log(average);`,
    fixSummary:
      "Changed `<=` to `<` so the loop stops at the last real index instead of taking one extra lap.",
    checks: [
      ["<", "less than"],
      ["length", "index", "off-by-one", "one less"],
    ],
    xp: 40,
  },
  {
    slug: "const-reassignment",
    title: "The Promise That Won't Bend",
    language: "javascript",
    difficulty: "Medium",
    buggyCode: `let theme = "dark";
const maxThemes = 2;
let picks = 0;

function toggle() {
  theme = theme === "dark" ? "light" : "dark";
  picks = picks + 1;
  if (picks >= maxThemes) {
    maxThemes = 0;
    picks = 0;
  }
}

toggle();`,
    symptom:
      "Something stopped short: the console reports `Assignment to constant variable`, and the theme never changes.",
    whatHappened:
      "The function halted on the moment it tried to overwrite `maxThemes`, so `theme` stayed as it was and nothing after that line ran.",
    whyItHappened:
      "`maxThemes` was declared with `const`, which promises the value will never be reassigned — and the code tries to set it to 0 anyway.",
    guidingQuestion:
      "What does the word `const` promise about the variable declared on line 2, and which line breaks that promise?",
    hints: [
      "Which keyword is for values that change later — and which one is for values that stay put?",
      "`theme` changes too, but look at how `theme` and `maxThemes` are declared differently.",
    ],
    explanation:
      "`const` blocks reassignment (though the contents of an object or array can still change), and the engine enforces that promise the moment you try — the error is a safety net firing, not a random crash. If a value is meant to be updated later, declare it with `let` at the scope where the change happens. Reserving `const` by default makes your intentions readable and lets the engine catch accidental overwrites for you.",
    fixedCode: `let theme = "dark";
let maxThemes = 2;
let picks = 0;

function toggle() {
  theme = theme === "dark" ? "light" : "dark";
  picks = picks + 1;
  if (picks >= maxThemes) {
    maxThemes = 0;
    picks = 0;
  }
}

toggle();`,
    fixSummary:
      "Declared `maxThemes` with `let` so the reset inside the function is allowed.",
    checks: [
      ["let", "var"],
      ["const", "reassign", "reassignment"],
    ],
    xp: 40,
  },
  {
    slug: "nav-link-specificity",
    title: "The Color With More Pull",
    language: "css",
    difficulty: "Medium",
    buggyCode: `/* <nav class="nav"><a class="nav-link" href="/pricing">Pricing</a></nav> */

.nav a {
  color: #6b7280;
  text-decoration: none;
}

.nav-link {
  color: #2563eb;
}`,
    symptom:
      "Something unexpected happened: the nav links stay gray even though `.nav-link` clearly asks for blue — and no error appears anywhere.",
    whatHappened:
      "The gray rule wins silently, so the link renders gray and the blue declaration is never applied to it.",
    whyItHappened:
      "`.nav a` counts as one class plus one element, while `.nav-link` counts as only one class. The higher-ranking selector wins regardless of which rule was written first.",
    guidingQuestion:
      "How many points does CSS give `.nav a` compared with `.nav-link` — and which of the two is really styling that link?",
    hints: [
      "Specificity counts ids, classes and elements separately. Break each selector into its parts and compare.",
      "Order only decides ties — these two selectors are not tied. Which one carries an extra element name?",
    ],
    explanation:
      "CSS resolves conflicts by specificity (ids beat classes, classes beat elements), falling back to source order only when the scores match, so a descendant selector can quietly outrank the class you carefully added. The fix is to raise the intended rule's rank, such as `.nav .nav-link`, or to lower the competing rule rather than stacking more selectors everywhere. Keeping specificity low and flat makes overrides predictable and stops the familiar arms race of adding one more class.",
    fixedCode: `/* <nav class="nav"><a class="nav-link" href="/pricing">Pricing</a></nav> */

.nav a {
  color: #6b7280;
  text-decoration: none;
}

.nav .nav-link {
  color: #2563eb;
}`,
    fixSummary:
      "Gave the blue rule a `.nav .nav-link` ancestor so its specificity outranks the gray descendant rule.",
    xp: 40,
  },
  {
    slug: "missing-await",
    title: "The Result That Arrives Late",
    language: "javascript",
    difficulty: "Hard",
    buggyCode: `async function loadUser(id) {
  const res = await fetch("/api/users/" + id);
  return res.json();
}

async function show() {
  const data = loadUser(7);
  console.log(data.name);
}

show();`,
    symptom:
      "Something unexpected happened — the console prints `undefined` instead of the user's name, even though the request eventually succeeds.",
    whatHappened:
      "`data` was still a pending Promise when `data.name` was read, so the property lookup had nothing to work with and logged `undefined`.",
    whyItHappened:
      "Calling an async function hands back a Promise straight away. Without `await`, the code never pauses, so it reads the value before it has arrived.",
    guidingQuestion:
      "What does `loadUser(7)` hand back the moment you call it — the finished user object, or a Promise that will become it?",
    hints: [
      "Compare how `fetch` is called inside `loadUser` with how `loadUser` is called inside `show()`.",
      "One line in this snippet pauses until a value arrives. Which one is missing that pause?",
    ],
    explanation:
      "An `async` function returns a Promise synchronously — the real value only exists after the awaits inside it settle, and `await` is what unwraps it. Missing an await rarely throws; you simply get a Promise and read properties off it, yielding `undefined` or a confusing downstream error. When a function is `async` or returns a Promise, await it before using the result, and wrap the call in `try`/`catch` so a failed request surfaces as a real error.",
    fixedCode: `async function loadUser(id) {
  const res = await fetch("/api/users/" + id);
  return res.json();
}

async function show() {
  const data = await loadUser(7);
  console.log(data.name);
}

show();`,
    fixSummary:
      "Added `await` before `loadUser(7)` so `data` is the finished user object, not a pending Promise.",
    xp: 55,
  },
  {
    slug: "indentation-outside-loop",
    title: "The Line That Slipped Out",
    language: "python",
    difficulty: "Hard",
    buggyCode: `def countdown(n):
    results = []
    while n > 0:
        results.append(n)
    n = n - 1
    return results


print(countdown(3))`,
    symptom:
      "Something hangs: the program never finishes printing — the console just sits there with the countdown seemingly stuck.",
    whatHappened:
      "`n` never changes inside the loop, so `n > 0` stays true forever, `results` keeps growing and the function never reaches its `return`.",
    whyItHappened:
      "`n = n - 1` sits one indent level to the left, so it belongs to the function body instead of the `while` block. In Python, indentation is the block structure.",
    guidingQuestion:
      "Which lines sit at the exact same indentation as `results.append(n)` — and does `n` ever change inside that block?",
    hints: [
      "Indentation is Python's version of curly braces: a line indented one step less leaves the block entirely.",
      "Trace `n` through the loop — where, if anywhere, does it get smaller?",
    ],
    explanation:
      "Python has no braces to show you where a block begins and ends; whitespace decides, so a single lost indent silently moves a line into the wrong block. Here that leaves the loop condition frozen, producing an infinite loop rather than a helpful error. Turn on indentation guides in your editor, keep tabs and spaces consistent, and when a loop never ends, check whether the value in the condition is actually updated inside it.",
    fixedCode: `def countdown(n):
    results = []
    while n > 0:
        results.append(n)
        n = n - 1
    return results


print(countdown(3))`,
    fixSummary:
      "Indented `n = n - 1` one level deeper so the counter decreases inside the `while` block.",
    xp: 55,
  },
  {
    slug: "shared-default-list",
    title: "The List That Remembers Too Much",
    language: "python",
    difficulty: "Expert",
    buggyCode: `def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags


first = add_tag("intro")
second = add_tag("outro")
print(first)
print(second)`,
    symptom:
      "Something surprising: `first` prints `['intro', 'outro']` — the second call's tag has appeared inside the first result, and both prints show the same list.",
    whatHappened:
      "The default list kept growing across calls, so `first` and `second` ended up pointing at one shared list holding both tags.",
    whyItHappened:
      "The default `[]` is created once, when the function is defined, and every call that omits the argument reuses that very same list.",
    guidingQuestion:
      "Exactly when is that `[]` in the signature created — once at definition time, or freshly on each call?",
    hints: [
      "Default values are evaluated a single time when Python reads the `def`, not each time you call the function.",
      "Are `first` and `second` two separate lists — or could they be two names for the same object?",
    ],
    explanation:
      "Python evaluates default arguments once and stores them on the function itself, so any mutable default (list, dict, set) becomes shared state that leaks between calls — a bug that hides until your data mysteriously accumulates. The standard pattern is to use `None` as a sentinel and build a fresh value inside the function. It is worth remembering for every function you write, because the bug produces valid-looking results rather than an error.",
    fixedCode: `def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags


first = add_tag("intro")
second = add_tag("outro")
print(first)
print(second)`,
    fixSummary:
      "Switched the default to `None` and created a new list inside the function, so each call gets its own list.",
    xp: 70,
  },
];

/** Labels for each puzzle language. */
export const debugLanguageLabels: Record<DebugChallenge["language"], string> = {
  javascript: "JavaScript",
  html: "HTML",
  css: "CSS",
  python: "Python",
};
