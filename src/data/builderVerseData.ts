export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xp: number;
  summary: string;
  content: string;
  codeSnippet: string;
  /** Beginner-friendly enrichment (all optional so existing lessons keep working). */
  whyUseful?: string;
  analogy?: string;
  lineNotes?: { line: string; note: string }[];
  expectedOutput?: string;
  thinkQuestion?: string;
  practiceActivity?: string;
  realWorldApp?: string;
  takeaway?: string;
  objectives?: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** Distinguishes real programming languages from frameworks / tools / interfaces. */
  kind?: 'language' | 'framework' | 'tool' | 'interface' | 'concept';
  kindLabel?: string;
  icon: 'code' | 'layout' | 'sparkles' | 'mouse-pointer' | 'globe' | 'git-branch';
  badgeColor: string;
  lessonCount: number;
  xpReward: number;
  lessons: Lesson[];
}

export interface ThinkingPuzzle {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  question: string;
  context: string;
  interactiveType: 'switches' | 'fencepost' | 'edge-cases';
  solutionExplanation: string;
}

export interface DebugPuzzle {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium';
  xp: number;
  bugType: string;
  buggyCode: string;
  fixedCodeSnippet: string;
  consoleError: string;
  hint: string;
  companionLesson: string;
}

export interface GuidedProject {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tagline: string;
  description: string;
  estimatedTime: string;
  xp: number;
  bulletSummary: string[];
  checklist: string[];
  skillsGained: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtXp?: number;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'html',
    slug: 'html',
    title: 'HTML',
    kind: 'language',
    kindLabel: 'Markup language',
    tagline: 'Give your pages structure',
    description: 'HTML is the friendly skeleton of every website. Learn how to build meaningful pages with headings, text, images, links, forms and semantic structure.',
    icon: 'layout',
    badgeColor: '#A65F79',
    lessonCount: 3,
    xpReward: 120,
    lessons: [
      {
        id: 'html-semantics',
        title: 'Semantic HTML & Page Architecture',
        duration: '7 min',
        xp: 25,
        summary: 'Why semantic tags like <article>, <section>, and <main> make your pages accessible and clean.',
        content: `HTML isn't just about throwing <div> tags everywhere. Semantic tags tell both browsers and assistive technologies (like screen readers) what each part of the document actually represents.

When you use <main>, <header>, <nav>, and <article>, search engines understand your content structure instantly, and visitors with accessibility tools can jump straight to what matters.`,
        codeSnippet: `<header>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/projects">Projects</a>
  </nav>
</header>
<main>
  <article>
    <h1>Building Accessible Web Apps</h1>
    <p>Semantic tags make your code future-proof and welcoming to everyone.</p>
  </article>
</main>`,
        quiz: {
          question: 'Which element should encapsulate the dominant, unique content of an HTML document?',
          options: ['<section>', '<main>', '<div>', '<body>'],
          correctIndex: 1,
          explanation: '<main> represents the dominant content of the <body> of a document that is directly related to or expands upon the central topic.'
        }
      },
      {
        id: 'html-forms',
        title: 'Bulletproof Forms & Inputs',
        duration: '8 min',
        xp: 25,
        summary: 'Craft accessible input forms with validation attributes and clear labels.',
        content: `Forms are how your users interact with your database. Always pair every <input> with a visible <label for="..."> attribute. This increases the clickable target area and allows screen readers to announce inputs clearly.`,
        codeSnippet: `<form action="/signup" method="POST">
  <label for="user-email">Email Address</label>
  <input 
    type="email" 
    id="user-email" 
    name="email" 
    required 
    placeholder="you@domain.com"
  />
  <button type="submit">Join the Verse</button>
</form>`,
        quiz: {
          question: 'What connects an <input> to its corresponding <label>?',
          options: [
            'The name attribute on both elements',
            'The label’s "for" attribute matching the input’s "id"',
            'Placing them in the same CSS class',
            'The autocomplete attribute'
          ],
          correctIndex: 1,
          explanation: 'The label "for" attribute binds directly to the input with matching id, ensuring accessibility compliance and tap targeting.'
        }
      },
      {
        id: 'html-document-meta',
        title: 'Document Head & Metadata Architecture',
        duration: '6 min',
        xp: 25,
        summary: 'Master viewport scaling, character sets, page titles, and Open Graph share cards.',
        content: `The <head> element contains crucial machine-readable information. Setting <meta name="viewport" content="width=device-width, initial-scale=1.0"> is mandatory for responsive mobile design.`,
        codeSnippet: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BuilderVerse — Learn by Building</title>
  <meta property="og:title" content="BuilderVerse" />
</head>`,
        quiz: {
          question: 'Why is the viewport meta tag critical for modern web development?',
          options: [
            'It enables JavaScript in older browsers',
            'It tells mobile browsers to match screen width without fake desktop zooming',
            'It encrypts web traffic',
            'It links Google Fonts automatically'
          ],
          correctIndex: 1,
          explanation: 'Without width=device-width, mobile browsers assume desktop layouts and render pages zoomed out.'
        }
      }
    ]
  },
  {
    id: 'css',
    slug: 'css',
    title: 'CSS',
    kind: 'language',
    kindLabel: 'Stylesheet language',
    tagline: 'Make it look intentional',
    description: 'CSS turns a plain document into a designed interface. Learn the box model, flexbox, grid, responsive design and how to style with confidence.',
    icon: 'code',
    badgeColor: '#A65F79',
    lessonCount: 3,
    xpReward: 120,
    lessons: [
      {
        id: 'css-box-model',
        title: 'Mastering the Box Model',
        duration: '6 min',
        xp: 25,
        summary: 'Understand content-box vs border-box and never battle unexpected spacing again.',
        content: `Every element on your page is a box. The Box Model consists of:
1. Content: where text and images live
2. Padding: clear space around content, inside the border
3. Border: border line enclosing padding
4. Margin: transparent space outside the border separating elements

Always set "box-sizing: border-box;" globally so padding doesn't inflate element width.`,
        codeSnippet: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #EBD5DD;
  /* Total rendered width remains exactly 320px! */
}`,
        quiz: {
          question: 'What happens to element width when box-sizing is set to border-box and you add 20px padding?',
          options: [
            'The element expands by 40px',
            'The content area contracts so total width stays constant',
            'The margin automatically reduces',
            'The border disappears'
          ],
          correctIndex: 1,
          explanation: 'With border-box, padding and borders are absorbed inside the specified width, preserving layout geometry.'
        }
      },
      {
        id: 'css-flexbox-align',
        title: 'Flexbox Layouts & Centering Magic',
        duration: '8 min',
        xp: 25,
        summary: 'Master main-axis (justify-content) and cross-axis (align-items) without guessing.',
        content: `Flexbox is built for one-dimensional layouts. "display: flex" establishes a flex context. Use "justify-content" to control alignment along the main axis and "align-items" along the cross axis.`,
        codeSnippet: `.hero-banner {
  display: flex;
  justify-content: center; /* Center along main axis */
  align-items: center;     /* Center along cross axis */
  gap: 16px;
}`,
        quiz: {
          question: 'In a standard row flex container, which property centers items vertically?',
          options: ['justify-content', 'align-items', 'text-align', 'vertical-align'],
          correctIndex: 1,
          explanation: 'In flex-direction: row, the cross axis is vertical, so align-items: center handles vertical centering.'
        }
      },
      {
        id: 'css-responsive-grid',
        title: 'CSS Grid & Responsive Layouts',
        duration: '7 min',
        xp: 30,
        summary: 'Create fluid multi-column grids that wrap automatically with repeat() and minmax().',
        content: `CSS Grid excels at 2-dimensional layouts. With "repeat(auto-fit, minmax(280px, 1fr))", cards wrap automatically onto new lines without writing dozens of brittle media queries!`,
        codeSnippet: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}`,
        quiz: {
          question: 'What does "minmax(280px, 1fr)" accomplish inside a grid template?',
          options: [
            'Sets a minimum height of 280px',
            'Ensures columns are at least 280px wide but can grow to share leftover space equally',
            'Hides elements under 280px',
            'Forces exactly 280 columns'
          ],
          correctIndex: 1,
          explanation: 'minmax defines a size range: the item never shrinks below 280px and expands with 1 fractional unit of free space.'
        }
      }
    ]
  },
  {
    id: 'javascript',
    slug: 'javascript',
    title: 'JavaScript',
    kind: 'language',
    kindLabel: 'Programming language',
    tagline: 'Make it interactive',
    description: 'JavaScript is where pages come alive. Start with variables and conditions, then work up to functions, arrays, objects and the DOM.',
    icon: 'sparkles',
    badgeColor: '#A65F79',
    lessonCount: 3,
    xpReward: 130,
    lessons: [
      {
        id: 'js-objects-arrays',
        title: 'Data Modeling with Objects and Arrays',
        duration: '8 min',
        xp: 30,
        summary: 'Store structured application state, filter records, and map data into UI.',
        content: `Modern web development revolves around managing arrays of objects. Functions like .map(), .filter(), and .reduce() let you transform data declaratively without clunky loops.`,
        codeSnippet: `const builders = [
  { name: 'Alex', xp: 450, streak: 5 },
  { name: 'Jordan', xp: 120, streak: 1 },
  { name: 'Sam', xp: 890, streak: 14 }
];

// Find builders on a streak of at least 3 days
const activeBuilders = builders
  .filter(b => b.streak >= 3)
  .map(b => b.name);

console.log(activeBuilders); // ['Alex', 'Sam']`,
        quiz: {
          question: 'Which array method transforms every item in an array and returns a new array of the same length?',
          options: ['.filter()', '.map()', '.reduce()', '.forEach()'],
          correctIndex: 1,
          explanation: '.map() calls a provided callback function once for each element in an array and constructs a new array from the results.'
        }
      },
      {
        id: 'js-functions-scope',
        title: 'Functions, Scope & Arrow Syntax',
        duration: '7 min',
        xp: 25,
        summary: 'Understand block scope, lexical this, default arguments, and pure functions.',
        content: `const and let are block-scoped, preventing accidental leakage. Arrow functions provide concise syntax and inherit lexical "this" from their enclosing context.`,
        codeSnippet: `const calculateXpBonus = (baseXp, multiplier = 1.2) => {
  const bonus = Math.round(baseXp * multiplier);
  return bonus;
};

console.log(calculateXpBonus(100)); // 120`,
        quiz: {
          question: 'What scope do variables declared with "const" and "let" have in JavaScript?',
          options: ['Global only', 'Function only', 'Block scope (enclosed by {})', 'Module scope only'],
          correctIndex: 2,
          explanation: 'Variables declared with let and const are confined to the block statement or expression in which they are defined.'
        }
      },
      {
        id: 'js-async-promises',
        title: 'Promises & Asynchronous Execution',
        duration: '8 min',
        xp: 30,
        summary: 'How JavaScript handles background work with the event loop and Promises.',
        content: `JavaScript is single-threaded. When non-blocking I/O or network requests occur, Promises represent a value that may not be available yet. Using async/await gives synchronous clarity to asynchronous operations.`,
        codeSnippet: `const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runCountdown() {
  console.log('Ready...');
  await sleep(1000);
  console.log('Launch!');
}`,
        quiz: {
          question: 'What does an async function always return in JavaScript?',
          options: ['A boolean', 'A Promise', 'undefined', 'A callback'],
          correctIndex: 1,
          explanation: 'Async functions always wrap return values in a resolved Promise.'
        }
      }
    ]
  },
  {
    id: 'dom',
    slug: 'dom',
    title: 'DOM',
    kind: 'concept',
    kindLabel: 'Web concept',
    tagline: 'Control the page with code',
    description: 'The DOM is how JavaScript reaches into your page. Select elements, listen for events, create content dynamically and build real interactions.',
    icon: 'mouse-pointer',
    badgeColor: '#A65F79',
    lessonCount: 2,
    xpReward: 110,
    lessons: [
      {
        id: 'dom-event-delegation',
        title: 'Event Handling & Delegation',
        duration: '7 min',
        xp: 25,
        summary: 'Handle clicks efficiently without attaching hundreds of redundant event listeners.',
        content: `Instead of adding an event listener to every single button inside a long list, attach a single listener to the parent container. Use "event.target.closest('button')" to handle events via event bubbling!`,
        codeSnippet: `const list = document.querySelector('#tasks');

list.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.btn-delete');
  if (!deleteBtn) return;
  
  const item = deleteBtn.closest('li');
  item.remove();
});`,
        quiz: {
          question: 'What DOM mechanism enables event delegation by letting events bubble up the hierarchy?',
          options: ['Event Bubbling', 'Event Hoisting', 'Garbage Collection', 'Shadow DOM'],
          correctIndex: 0,
          explanation: 'Event bubbling propagates events from the target element up through its ancestors, allowing parent nodes to listen.'
        }
      },
      {
        id: 'dom-dynamic-creation',
        title: 'Dynamic Element Creation & Mutation',
        duration: '6 min',
        xp: 25,
        summary: 'Safely build UI nodes with document.createElement and classList methods.',
        content: `Direct innerHTML injection can expose users to XSS vulnerabilities. Using document.createElement(), textContent, and element.classList provides safer and faster DOM updates.`,
        codeSnippet: `function createBadge(label) {
  const badge = document.createElement('span');
  badge.className = 'badge-tag';
  badge.textContent = label;
  return badge;
}`,
        quiz: {
          question: 'Why is textContent preferred over innerHTML when inserting user-provided strings?',
          options: [
            'textContent prevents XSS attacks by escaping HTML tags',
            'innerHTML is deprecated in modern browsers',
            'textContent runs faster on every browser',
            'innerHTML cannot display numbers'
          ],
          correctIndex: 0,
          explanation: 'textContent treats all input as plain text without parsing HTML tags, blocking malicious scripts.'
        }
      }
    ]
  },
  {
    id: 'apis',
    slug: 'apis',
    title: 'APIs',
    kind: 'interface',
    kindLabel: 'Interface & protocol',
    tagline: 'Talk to the outside world',
    description: 'Learn how web apps fetch data from servers with fetch, JSON, async/await and how to handle the unhappy paths that every real app faces.',
    icon: 'globe',
    badgeColor: '#A65F79',
    lessonCount: 2,
    xpReward: 120,
    lessons: [
      {
        id: 'api-async-await',
        title: 'Robust Async/Await with Error Resilience',
        duration: '9 min',
        xp: 30,
        summary: 'Fetch network data safely with try/catch, response.ok checks, and fallback states.',
        content: `Never assume network requests succeed. Always inspect "response.ok" before calling "response.json()", and wrap the entire call in a try/catch block to catch network dropouts or timeouts.`,
        codeSnippet: `async function fetchCurrentWeather(city) {
  try {
    const res = await fetch(\`https://api.example.com/weather?q=\${encodeURIComponent(city)}\`);
    if (!res.ok) {
      throw new Error(\`Server returned status \${res.status}\`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Fetch failed:', err.message);
    return { success: false, error: err.message };
  }
}`,
        quiz: {
          question: 'Why does fetch() not reject when a server responds with a 404 or 500 HTTP error code?',
          options: [
            'It is a bug in JavaScript',
            'fetch only rejects on actual network failure or blocked requests; HTTP errors still complete the HTTP cycle',
            'HTTP 404 is considered successful by browsers',
            'You must pass { strict: true } to fetch'
          ],
          correctIndex: 1,
          explanation: 'A fetch() promise only rejects when a network error is encountered. For HTTP 4xx or 5xx, response.ok is false, but the promise resolves.'
        }
      },
      {
        id: 'api-crud-methods',
        title: 'HTTP Methods & RESTful Architecture',
        duration: '7 min',
        xp: 25,
        summary: 'Understand GET, POST, PUT, and DELETE with request headers and JSON payloads.',
        content: `When transmitting data to a REST API, declare the HTTP method and specify "Content-Type: application/json" in the request headers so the backend knows how to deserialize the payload.`,
        codeSnippet: `const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Complete daily goal', done: false })
});`,
        quiz: {
          question: 'Which HTTP method should be used when creating a brand-new resource on a REST API?',
          options: ['GET', 'POST', 'PATCH', 'OPTIONS'],
          correctIndex: 1,
          explanation: 'POST is the standard REST method for submitting data to create a new resource on the server.'
        }
      }
    ]
  },
  {
    id: 'git',
    slug: 'git',
    title: 'Git & GitHub',
    kind: 'tool',
    kindLabel: 'Tool & platform',
    tagline: 'Save, share, collaborate',
    description: 'Version control is a builder\'s safety net. Learn commits, branches, pushing to GitHub and recovering gracefully when things go wrong.',
    icon: 'git-branch',
    badgeColor: '#A65F79',
    lessonCount: 2,
    xpReward: 100,
    lessons: [
      {
        id: 'git-workflows',
        title: 'Branching, Stashing & Pull Requests',
        duration: '6 min',
        xp: 25,
        summary: 'Work on isolated features safely and maintain a clean commit history.',
        content: `Never commit unfinished experiments straight to the main branch. Create a feature branch:
"git checkout -b feature/dark-mode"
Make your changes, commit them with meaningful messages, and merge via pull request.`,
        codeSnippet: `# Create and switch to new branch
git checkout -b feat/user-dashboard

# Check what changed
git status -s

# Stage and commit with intention
git add src/Dashboard.tsx
git commit -m "feat: add interactive XP progress ring"

# Push to remote
git push -u origin feat/user-dashboard`,
        quiz: {
          question: 'Which Git command creates a new branch and immediately switches your working directory to it?',
          options: ['git branch new-feature', 'git checkout -b new-feature', 'git merge new-feature', 'git init new-feature'],
          correctIndex: 1,
          explanation: 'git checkout -b <name> (or git switch -c <name>) creates the branch and checks it out in a single step.'
        }
      },
      {
        id: 'git-merge-conflicts',
        title: 'Resolving Merge Conflicts Confidently',
        duration: '7 min',
        xp: 25,
        summary: 'Understand Git conflict markers (<<<<<<< HEAD) and how to resolve overlapping edits.',
        content: `Merge conflicts happen when two branches change the same lines in a file. Git pauses the merge and inserts markers: <<<<<<< HEAD (your changes) and >>>>>>> incoming-branch (their changes). You simply choose what to keep and commit!`,
        codeSnippet: `<<<<<<< HEAD
const theme = 'blush-pink';
=======
const theme = 'rose-gold';
>>>>>>> feature-theme`,
        quiz: {
          question: 'What does the "<<<<<<< HEAD" marker denote in a Git conflict file?',
          options: [
            'Code from the incoming branch being merged',
            'Code from your current active branch before the merge began',
            'Corrupted files that must be deleted',
            'A Git syntax error'
          ],
          correctIndex: 1,
          explanation: 'HEAD points to the commit/branch you were on when the merge command was executed.'
        }
      }
    ]
  },
  {
    id: 'python',
    slug: 'python',
    title: 'Python',
    kind: 'language',
    kindLabel: 'Programming language',
    tagline: 'Think in plain English, run real programs',
    description: 'Python reads almost like English, which makes it the kindest first programming language. Learn variables, conditions, loops and functions by building small programs that actually do something.',
    icon: 'code',
    badgeColor: '#A65F79',
    lessonCount: 3,
    xpReward: 120,
    lessons: [
      {
        id: 'python-basics',
        title: 'Variables, print() and input()',
        duration: '7 min',
        xp: 25,
        summary: 'Store information in variables and talk to the user with print() and input().',
        content: `A variable is a labelled box where your program keeps a piece of information. In Python you create one just by naming it and using the = sign — no special keywords needed.

print() shows information on the screen, and input() pauses the program and asks the user to type something. Together, they turn a silent script into a conversation.

Real-world analogy: think of variables as labelled jars in a kitchen. "name = 'Maya'" is a jar with a name tag. You can open it later and use what's inside.`,
        codeSnippet: `name = input("What is your name? ")
print("Hello,", name)

age = 17
next_year = age + 1
print("Next year you will be", next_year)`,
        whyUseful: 'Variables plus input and output turn a silent script into an interactive program.',
        analogy: 'A variable is a labelled jar you can reopen and reuse later.',
        thinkQuestion: 'What happens to next_year if you change age after computing it?',
        practiceActivity: 'Ask for a favourite food, store it, and print a sentence using it.',
        takeaway: 'Variables store values; print() shows them and input() reads text.',
        objectives: ['Create variables with =', 'Use print() for output', 'Read text with input()'],
        quiz: {
          question: 'What does input("Age: ") return in Python 3?',
          options: [
            'A number the user typed',
            'A string (text) the user typed',
            'True if the input is valid',
            'Nothing — it prints directly'
          ],
          correctIndex: 1,
          explanation: 'input() always returns a string. If you need a number, you must convert it yourself with int() or float().'
        }
      },
      {
        id: 'python-conditions-loops',
        title: 'if / elif / else and for loops',
        duration: '8 min',
        xp: 25,
        summary: 'Make decisions with conditions and repeat work with loops — using indentation to group blocks.',
        content: `Conditions let your program choose a path, like a signpost at a crossroads. if checks a question; elif checks a second question only if the first was false; else catches everything remaining.

Loops repeat work. for i in range(3) runs a block three times without copying the code three times.

The one Python rule beginners must internalize: indentation IS the block. There are no braces — the spaces tell Python what belongs to the if or the loop. Mixing tabs and spaces is a classic bug.`,
        codeSnippet: `score = 68

if score >= 75:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "Keep going"

print("Grade:", grade)

for i in range(3):
    print("Attempt", i + 1)`,
        quiz: {
          question: 'In Python, what defines the body of an if statement?',
          options: [
            'Curly braces { }',
            'The keyword begin / end',
            'Indentation (leading spaces)',
            'Semicolons'
          ],
          correctIndex: 2,
          explanation: 'Python uses indentation to group statements. That is why consistent spacing is not just style — it is syntax.'
        }
      },
      {
        id: 'python-functions-lists',
        title: 'Functions and lists',
        duration: '8 min',
        xp: 25,
        summary: 'Bundle logic into reusable functions and hold many values in a list.',
        content: `A function is a named recipe: you define it once with def, then call it whenever you need it. Functions are how builders stop copying the same code everywhere.

A list holds many values in one variable, in order. You can loop over a list, add to it, and pick items by position (index), which starts at 0 — the classic off-by-one trap.

Analogy: a function is a sandwich maker — bread in, sandwich out. A list is a lunchbox with numbered compartments.`,
        codeSnippet: `def greet(name):
    return "Hello, " + name

print(greet("Maya"))

scores = [70, 85, 92]
total = 0
for score in scores:
    total = total + score

print("Average:", total / len(scores))
print("First score:", scores[0])`,
        quiz: {
          question: 'What does scores[0] refer to in the list [70, 85, 92]?',
          options: ['70', '85', '92', 'An error — indexes start at 1'],
          correctIndex: 0,
          explanation: 'Python lists are zero-indexed, so scores[0] is the first item, 70.'
        }
      }
    ]
  },
  {
    id: 'java',
    slug: 'java',
    title: 'Java',
    kind: 'language',
    kindLabel: 'Programming language',
    tagline: 'Strong typing, real engineering habits',
    description: 'Java powers Android apps, banking systems and millions of servers. Its strict rules feel heavy at first, but they teach you the discipline that larger teams rely on.',
    icon: 'code',
    badgeColor: '#A65F79',
    lessonCount: 3,
    xpReward: 120,
    lessons: [
      {
        id: 'java-main-types',
        title: 'Classes, main() and types',
        duration: '8 min',
        xp: 25,
        summary: 'Understand why every Java program lives inside a class and how declared types work.',
        content: `Every Java program starts inside a class, and execution begins at public static void main(String[] args). Think of a class as a blueprint, and main() as the front door of the building.

Unlike Python, Java makes you declare the type of every variable: int age = 17; means "age is a box that only holds whole numbers." This feels strict, but it catches mistakes before you run the program.

Analogy: Python is a sketchbook; Java is an engineering drawing — every measurement must be written down.`,
        codeSnippet: `public class FirstProgram {
    public static void main(String[] args) {
        int age = 17;
        double height = 1.65;
        String name = "Maya";

        System.out.println("Hello, " + name);
        System.out.println("Next year: " + (age + 1));
    }
}`,
        quiz: {
          question: 'Where does a Java program begin executing?',
          options: [
            'At the first line of the .java file',
            'In the main method of a class',
            'In the constructor of the first object',
            'Java runs top-to-bottom automatically'
          ],
          correctIndex: 1,
          explanation: 'The JVM looks for public static void main(String[] args) as the entry point of the program.'
        }
      },
      {
        id: 'java-conditions-loops',
        title: 'Conditions and loops in Java',
        duration: '8 min',
        xp: 25,
        summary: 'Use if/else, for and while with Java\'s comparison operators.',
        content: `Java conditions work like the ones you know from other languages, but the comparison operator is a double equals == — a single = is assignment, and mixing them up is one of the most common beginner bugs (in C/C++ it even compiles silently).

for (int i = 0; i < 5; i++) runs five times: start at 0, keep going while i is less than 5, add 1 each round. The three parts in that one line are the loop's engine.`,
        codeSnippet: `int marks = 62;

if (marks >= 75) {
    System.out.println("Distinction");
} else if (marks >= 50) {
    System.out.println("Pass");
} else {
    System.out.println("Try again");
}

for (int i = 0; i < 3; i++) {
    System.out.println("Practice round " + (i + 1));
}`,
        quiz: {
          question: 'What is the difference between = and == in Java?',
          options: [
            'They are interchangeable',
            '= assigns a value; == compares two values',
            '== assigns; = compares',
            '= works only inside loops'
          ],
          correctIndex: 1,
          explanation: 'The = operator stores a value in a variable, while == tests whether two values are equal inside an if or loop condition.'
        }
      },
      {
        id: 'java-methods-arrays',
        title: 'Methods and arrays',
        duration: '8 min',
        xp: 25,
        summary: 'Write reusable methods and store collections of data in arrays.',
        content: `A method is Java's version of a function: it has a return type (void if it returns nothing), a name, and parameters. Methods keep logic reusable and readable.

An array holds a fixed number of values of the same type. int[] marks = new int[3] creates three slots, all starting at 0. Like lists in Python, indexes begin at 0.`,
        codeSnippet: `public class Marks {
    static int doubleIt(int number) {
        return number * 2;
    }

    public static void main(String[] args) {
        int[] marks = {70, 85, 92};
        int total = 0;

        for (int i = 0; i < marks.length; i++) {
            total = total + marks[i];
        }

        System.out.println("Average: " + (double) total / marks.length);
        System.out.println("Double 21: " + doubleIt(21));
    }
}`,
        quiz: {
          question: 'What is the index of the FIRST element in a Java array?',
          options: ['1', '0', '-1', 'It depends on the array size'],
          correctIndex: 1,
          explanation: 'Java arrays are zero-indexed: the first element lives at index 0.'
        }
      }
    ]
  },
  {
    id: 'c',
    slug: 'c',
    title: 'C',
    kind: 'language',
    kindLabel: 'Programming language',
    tagline: 'Close to the machine, clear about memory',
    description: 'C has powered operating systems for over fifty years. Learning it teaches you what other languages quietly do for you — and makes every language you learn afterwards easier to understand.',
    icon: 'code',
    badgeColor: '#A65F79',
    lessonCount: 3,
    xpReward: 120,
    lessons: [
      {
        id: 'c-basics',
        title: 'printf, scanf and variables',
        duration: '8 min',
        xp: 25,
        summary: 'Write your first C program and understand why every statement ends with a semicolon.',
        content: `C programs begin in main(), and every statement ends with a semicolon — C treats the newline like a space, so the semicolon is what actually ends a command. Forget it and the compiler complains.

printf() prints text; format specifiers like %d (integer) and %s (text) are placeholders you fill in with arguments. scanf() reads input, and you must give it the ADDRESS of a variable using the & symbol — forgetting & is the classic beginner error.

Analogy: printf is a template card where you stamp numbers and words into marked slots.`,
        codeSnippet: `#include <stdio.h>

int main() {
    int age;
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Next year you will be %d\\n", age + 1);
    return 0;
}`,
        quiz: {
          question: 'Why does scanf need &age instead of just age?',
          options: [
            'It is a style convention',
            'scanf needs the memory ADDRESS where it should store the value',
            '& converts the number to text',
            'It is only needed in loops'
          ],
          correctIndex: 1,
          explanation: '& is the "address-of" operator. scanf writes directly into the variable\'s memory, so it must know where that memory is.'
        }
      },
      {
        id: 'c-conditions-loops',
        title: 'Conditions and loops in C',
        duration: '8 min',
        xp: 25,
        summary: 'Use if/else and for loops, and see how C compares with Python and Java.',
        content: `C uses the same if / else structure you have seen elsewhere, but remember: comparison uses == and logical AND is written as && (not the word "and").

The for loop in C packs its whole engine into one line: for (int i = 0; i < 5; i++) — start, condition, step. Because C compiles close to machine code, these loops are extremely fast.`,
        codeSnippet: `int marks = 62;

if (marks >= 75) {
    printf("Distinction\\n");
} else if (marks >= 50) {
    printf("Pass\\n");
} else {
    printf("Try again\\n");
}

for (int i = 1; i <= 3; i++) {
    printf("Practice round %d\\n", i);
}`,
        quiz: {
          question: 'What does && mean in C?',
          options: [
            'A comment',
            'Logical AND — both sides must be true',
            'Logical OR',
            'Pointer arithmetic'
          ],
          correctIndex: 1,
          explanation: 'C writes logical AND as && and logical OR as ||. Using the word "and" would be a syntax error.'
        }
      },
      {
        id: 'c-functions-arrays',
        title: 'Functions and arrays in C',
        duration: '8 min',
        xp: 25,
        summary: 'Split programs into functions and process collections with arrays.',
        content: `In C you declare a function with its return type and parameters before you use it (or place it above main). Unlike Java, C does not wrap functions inside classes — they live at the top level of the file.

An array int marks[3] reserves three consecutive slots in memory. C will NOT stop you from reading marks[7] — it will simply read whatever memory lives there. This "no safety net" is exactly why C teaches you to be careful, and why C bugs so often become security holes.`,
        codeSnippet: `#include <stdio.h>

int doubleIt(int number) {
    return number * 2;
}

int main() {
    int marks[3] = {70, 85, 92};
    int total = 0;

    for (int i = 0; i < 3; i++) {
        total = total + marks[i];
    }

    printf("Average: %.1f\\n", (double) total / 3);
    printf("Double 21: %d\\n", doubleIt(21));
    return 0;
}`,
        whyUseful: 'Functions stop copy-paste; arrays hold collections every program needs.',
        analogy: 'A function is a kitchen gadget you build once and reuse; an array is a row of numbered jars.',
        expectedOutput: `Average: 82.3\nDouble 21: 42`,
        thinkQuestion: 'Why does the loop use i < 3 instead of i <= 3 for an array of size 3?',
        practiceActivity: 'Add a function biggest(marks, size) returning the largest mark, and print it.',
        realWorldApp: 'Sensor drivers read arrays of readings and average them with functions like these.',
        takeaway: 'Declare functions before use; C arrays never check bounds — your loop condition is the safety net.',
        objectives: ['Write a C function', 'Loop over an array safely', 'Explain undefined behaviour'],
        quiz: {
          question: 'What happens in C when you access marks[10] on an array of size 3?',
          options: [
            'C prints a friendly error message',
            'C returns 0 automatically',
            'C reads whatever is at that memory location — undefined behaviour',
            'The program recompiles the array'
          ],
          correctIndex: 2,
          explanation: 'C does not check array bounds. Out-of-range access reads unrelated memory (undefined behaviour) — the reason buffer bugs are so famous.'
        }
      }
    ]
  },
  {
    id: 'sql',
    slug: 'sql',
    title: 'SQL',
    kind: 'language',
    kindLabel: 'Query language',
    tagline: 'Ask questions of your data',
    description: 'SQL is how applications store and retrieve data. Learn to create tables, insert records, filter with WHERE and combine tables with JOIN — the backbone of almost every app.',
    icon: 'globe',
    badgeColor: '#A65F79',
    lessonCount: 2,
    xpReward: 110,
    lessons: [
      {
        id: 'sql-select-where',
        title: 'SELECT & WHERE: ask for data',
        duration: '7 min',
        xp: 25,
        summary: 'Read rows from a table and filter them with WHERE conditions.',
        content: `A database table is a spreadsheet with strict columns: every row in builders has the same fields. SELECT chooses the columns, FROM chooses the table, and WHERE filters the rows.`,
        codeSnippet: `SELECT name, xp FROM builders
WHERE xp >= 100
ORDER BY xp DESC;`,
        whyUseful: 'Every app list screen — leaderboards, feeds, search — is a SELECT with a WHERE underneath.',
        analogy: 'SELECT points at columns; WHERE holds a filter funnel over the rows.',
        expectedOutput: `Maya | 150`,
        thinkQuestion: 'What comes back if you forget the WHERE line?',
        practiceActivity: 'Write a query returning names of builders with xp under 100.',
        realWorldApp: 'The leaderboard is exactly this query: top XP, best first.',
        takeaway: 'SELECT columns FROM table WHERE condition ORDER BY column.',
        objectives: ['SELECT columns', 'Filter with WHERE', 'Sort results'],
        quiz: {
          question: 'What does WHERE xp >= 100 do?',
          options: ['Adds 100 XP to every row', 'Keeps only rows with xp of 100+', 'Sorts rows by xp', 'Deletes rows below 100'],
          correctIndex: 1,
          explanation: 'WHERE filters rows: only rows satisfying the condition are returned.'
        }
      },
      {
        id: 'sql-joins',
        title: 'JOINs: combine two tables',
        duration: '9 min',
        xp: 30,
        summary: 'Link builders to their projects with INNER JOIN on a shared key.',
        content: `Real databases split data: builders in one table, projects in another, linked by builder_id. JOIN reassembles them. INNER JOIN keeps only rows with a match on both sides.`,
        codeSnippet: `SELECT builders.name, projects.title
FROM builders
INNER JOIN projects
  ON projects.builder_id = builders.id;`,
        whyUseful: 'Portfolios and dashboards are JOINs: users + their content in one query.',
        analogy: 'Two phone books stapled together wherever IDs match.',
        expectedOutput: `Maya | Habit Bloom`,
        thinkQuestion: 'Does a builder with zero projects appear in an INNER JOIN?',
        practiceActivity: 'Sketch a certificates table and JOIN it to builders.',
        realWorldApp: 'My Showcase joins your profile to published projects.',
        takeaway: 'JOIN ... ON links tables; INNER keeps matches only.',
        objectives: ['Explain foreign keys', 'Write an INNER JOIN'],
        quiz: {
          question: 'What does ON projects.builder_id = builders.id do?',
          options: ['Filters to published projects', 'Declares how rows are matched', 'Sorts results', 'Creates a table'],
          correctIndex: 1,
          explanation: 'ON defines the matching rule between the two tables.'
        }
      }
    ]
  },
  {
    id: 'cpp',
    slug: 'cpp',
    title: 'C++',
    kind: 'language',
    kindLabel: 'Programming language',
    tagline: 'C with superpowers: objects and vectors',
    description: 'C++ builds on C with classes and growable vectors. It powers games and browsers — and teaches how objects work under the hood.',
    icon: 'code',
    badgeColor: '#A65F79',
    lessonCount: 2,
    xpReward: 110,
    lessons: [
      {
        id: 'cpp-vector',
        title: 'cout and growable vectors',
        duration: '8 min',
        xp: 25,
        summary: 'Print with cout and store flexible lists with std::vector.',
        content: `C++ keeps C's speed but adds friendlier tools: cout << sends text to the screen, and std::vector is an array that grows itself with push_back().`,
        codeSnippet: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> marks = {70, 85};\n    marks.push_back(92);\n    cout << "Count: " << marks.size() << endl;\n    return 0;\n}`,
        whyUseful: 'Vectors remove fixed-size pain while keeping C speed.',
        analogy: 'A C array is a fixed egg carton; a vector stretches.',
        expectedOutput: `Count: 3`,
        thinkQuestion: 'Why is marks.size() better than hard-coding 3?',
        practiceActivity: 'Add another push_back and print each mark with a loop.',
        realWorldApp: 'Games store enemies and bullets in vectors that grow every frame.',
        takeaway: 'cout prints; vector grows with push_back and reports size().',
        objectives: ['Use cout', 'Grow a vector'],
        quiz: {
          question: 'What does marks.push_back(92) do?',
          options: ['Overwrites the first element', 'Appends 92 and grows by one', 'Sorts the vector', 'Deletes the last element'],
          correctIndex: 1,
          explanation: 'push_back appends one element at the end.'
        }
      },
      {
        id: 'cpp-class',
        title: 'Your first class',
        duration: '8 min',
        xp: 25,
        summary: 'Bundle data and behaviour with classes.',
        content: `A class bundles data with the actions on it. A constructor (same name as the class) runs automatically when you create an object.`,
        codeSnippet: `class Student {\npublic:\n    string name;\n    int marks;\n    Student(string n, int m) { name = n; marks = m; }\n    bool passed() { return marks >= 50; }\n};`,
        whyUseful: 'Classes bridge C procedures to Java-style OOP.',
        analogy: 'A class is a cookie cutter; objects are the cookies.',
        expectedOutput: `Maya passed`,
        thinkQuestion: 'What breaks if passed() reads an undeclared variable?',
        practiceActivity: 'Add a grade() function returning A/B/C.',
        realWorldApp: 'Game characters and bank accounts are class objects.',
        takeaway: 'class bundles data + functions; constructor initializes objects.',
        objectives: ['Define a class', 'Write a constructor'],
        quiz: {
          question: 'When does a constructor run?',
          options: ['Only when called by name', 'Automatically on object creation', 'At program end', 'Only for inherited classes'],
          correctIndex: 1,
          explanation: 'The constructor runs automatically to set up each new object.'
        }
      }
    ]
  },
  {
    id: 'typescript',
    slug: 'typescript',
    title: 'TypeScript',
    kind: 'language',
    kindLabel: 'Programming language',
    tagline: 'JavaScript with types',
    description: 'TypeScript adds types to JavaScript to catch bugs early.',
    icon: 'code',
    badgeColor: '#A65F79',
    lessonCount: 1,
    xpReward: 30,
    lessons: [
      {
        id: 'ts-basics',
        title: 'Types and interfaces',
        duration: '7 min',
        xp: 25,
        summary: 'Add string, number and interface types to plain JavaScript.',
        content: `TypeScript lets you label what type each variable holds. An interface describes the shape of an object so mistakes are caught before the code runs.`,
        codeSnippet: `let xp: number = 25;\ninterface Builder { name: string; xp: number; }`,
        quiz: {
          question: 'What does `: number` do in `let xp: number`?',
          options: ['Sets xp to number', 'Declares xp must hold a number', 'Converts xp to text', 'Makes xp optional'],
          correctIndex: 1,
          explanation: 'Type annotations declare the expected type for type-checking.'
        }
      }
    ]
  },
  {
    id: 'react',
    slug: 'react',
    title: 'React',
    kind: 'framework',
    kindLabel: 'UI framework',
    tagline: 'Build interactive UIs',
    description: 'React builds reusable components that update with your data.',
    icon: 'sparkles',
    badgeColor: '#A65F79',
    lessonCount: 1,
    xpReward: 30,
    lessons: [
      {
        id: 'react-basics',
        title: 'Components and props',
        duration: '7 min',
        xp: 25,
        summary: 'Render reusable components that receive data via props.',
        content: `A React component is a function that returns UI. Props pass data into it, so one component can render many different builders.`,
        codeSnippet: `function Hello({ name }) {\n  return <h1>Hello, {name}</h1>;\n}`,
        quiz: {
          question: 'What are props in React?',
          options: ['CSS styles', 'Inputs passed into a component', 'Build settings', 'Database rows'],
          correctIndex: 1,
          explanation: 'Props are read-only inputs a parent passes to a child component.'
        }
      }
    ]
  }
];

export const THINKING_PUZZLES: ThinkingPuzzle[] = [
  {
    id: 'three-buttons-one-bulb',
    title: 'Three switches, one bulb',
    difficulty: 'Easy',
    xp: 35,
    question: 'Three light switches sit downstairs, and one light bulb glows in a sealed room upstairs. You may flip the switches any way you like, but you get to walk into that room exactly once. How do you work out which switch controls the bulb?',
    context: 'Decomposition: a scary problem becomes small doable steps. Explaining out loud — the number one interview skill.',
    interactiveType: 'switches',
    solutionExplanation: `Turn switch 1 ON and wait 5-10 minutes so the filament heats up. 
Then turn switch 1 OFF, and turn switch 2 ON. Leave switch 3 OFF.
Now walk upstairs:
• If the light is ON: Switch 2 controls it.
• If the light is OFF but the bulb is WARM to the touch: Switch 1 controls it.
• If the light is OFF and the bulb is COLD: Switch 3 controls it.
You turned a binary state (on/off) into a ternary state (on, off-warm, off-cold)!`
  },
  {
    id: 'fencepost-separators',
    title: 'The separators between rows',
    difficulty: 'Easy',
    xp: 30,
    question: 'A report prints 10 rows of data, and it drops a separator line between each pair of rows. How many separator lines appear in total, and why is the answer not 10?',
    context: 'Edge cases & off-by-one errors: the bugs that break production loops and array indexes.',
    interactiveType: 'fencepost',
    solutionExplanation: `For N posts, there are always (N - 1) sections of fence between them. 
With 10 rows, there are exactly 9 separators. 
If an algorithm printed a separator after every row, the last row would have a trailing divider—a classic fencepost error that causes UI bugs or trailing commas in JSON serialization.`
  },
  {
    id: 'test-the-edge-cases',
    title: 'Hunt the edge cases',
    difficulty: 'Easy',
    xp: 40,
    question: 'A function takes a list of exam scores and returns the average. It passes every test you have tried so far with normal numbers. Which unusual inputs should you try before you trust it, and what could each one expose?',
    context: 'Edge cases: the inputs everyone forgets until real users enter them.',
    interactiveType: 'edge-cases',
    solutionExplanation: `The critical edge cases to check:
1. Empty array []: Causes division by zero (0 / 0 = NaN in JavaScript).
2. Single item [95]: Ensures it doesn't assume multiple values.
3. All zeroes [0, 0, 0]: Ensures falsy 0 values are not filtered out by bad checks like if (score).
4. Negative numbers or out-of-range (>100): Tests validation constraints.
5. Non-numbers or strings ['80', null, undefined]: Tests type coercion (e.g. '80' + '20' = '8020').`
  }
];

export const DEBUG_PUZZLES: DebugPuzzle[] = [
  {
    id: 'bug-1',
    title: 'Bug 1: ReferenceError Typo',
    difficulty: 'Easy',
    xp: 30,
    bugType: 'ReferenceError',
    buggyCode: `const user = { name: "Ava" };
const greeting = "Hello, " + nam;
console.log(greeting);`,
    fixedCodeSnippet: `const user = { name: "Ava" };
const greeting = "Hello, " + user.name;
console.log(greeting);`,
    consoleError: 'Uncaught ReferenceError: nam is not defined at line 2',
    hint: 'Look closely at variable spelling. Is "nam" defined, or did you mean "user.name"?',
    companionLesson: 'Typo bugs happen because JavaScript never guesses: a name that differs by even one letter is a brand-new identifier. Use editor linters and double check identifier spelling whenever a ReferenceError strikes.'
  },
  {
    id: 'bug-2',
    title: 'Bug 2: Array Index Off-by-One',
    difficulty: 'Easy',
    xp: 35,
    bugType: 'TypeError: Cannot read properties of undefined',
    buggyCode: `const frameworks = ["React", "Vue", "Svelte"];
for (let i = 0; i <= frameworks.length; i++) {
  console.log(frameworks[i].toUpperCase());
}`,
    fixedCodeSnippet: `const frameworks = ["React", "Vue", "Svelte"];
for (let i = 0; i < frameworks.length; i++) {
  console.log(frameworks[i].toUpperCase());
}`,
    consoleError: 'TypeError: Cannot read properties of undefined (reading \'toUpperCase\') at index 3',
    hint: 'Arrays are 0-indexed. What index does the loop reach when using "<=" instead of "<"?',
    companionLesson: 'A 3-item array has indices 0, 1, and 2. Checking "i <= frameworks.length" evaluates frameworks[3], which is undefined. Calling a method on undefined causes a crash.'
  },
  {
    id: 'bug-3',
    title: 'Bug 3: Asynchronous State Mutation',
    difficulty: 'Medium',
    xp: 45,
    bugType: 'Logic & Race Condition',
    buggyCode: `function calculateTotal(price, taxRate) {
  let total;
  setTimeout(() => {
    total = price + (price * taxRate);
  }, 100);
  return total; // returns undefined!
}`,
    fixedCodeSnippet: `function calculateTotal(price, taxRate) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(price + (price * taxRate));
    }, 100);
  });
}`,
    consoleError: 'Output was undefined. Async operations do not halt synchronous returns.',
    hint: 'setTimeout finishes in the future, but the function returns immediately. Use Promises or async/await!',
    companionLesson: 'Synchronous code will never wait for an asynchronous timer or network call unless wrapped in a Promise and awaited.'
  }
];

export const GUIDED_PROJECTS: GuidedProject[] = [
  {
    id: 'calculator',
    slug: 'calculator',
    title: 'Calculator',
    difficulty: 'Beginner',
    tagline: 'The classic first app, done properly',
    description: 'Laying out a button grid with CSS Grid, listening for clicks, handling floating point precision, and formatting results cleanly.',
    estimatedTime: '2 hours',
    xp: 150,
    bulletSummary: [
      'Laying out a responsive button grid with CSS Grid',
      'Listening for clicks and reading operator buttons cleanly',
      'Preventing math bugs like multiple decimal points'
    ],
    checklist: [
      'Create 4x4 responsive CSS grid layout',
      'State machine tracking currentOperand, previousOperand & operation',
      'Safe calculation logic supporting +, -, ×, ÷',
      'Clear (AC) and Delete button operations',
      'Keyboard support for number keys and Enter'
    ],
    skillsGained: ['CSS Grid', 'Event Delegation', 'State Machine Basics', 'Floating Point Math']
  },
  {
    id: 'weather-app',
    slug: 'weather-app',
    title: 'Weather App',
    difficulty: 'Beginner',
    tagline: 'Fetch real data from a real API',
    description: 'Sending HTTP requests with fetch and async/await, reading a JSON response, picking out the fields you need, and gracefully handling missing cities.',
    estimatedTime: '3 hours',
    xp: 180,
    bulletSummary: [
      'Sending HTTP requests with fetch and async/await',
      'Handling loading states and 404 city errors smoothly',
      'Displaying dynamic weather condition icons'
    ],
    checklist: [
      'Search input with debounce or submit listener',
      'Async fetch with status checks and error boundaries',
      'Temperature metric / imperial switcher',
      '5-day forecast cards with dynamic humidity and wind speed'
    ],
    skillsGained: ['REST APIs', 'Async/Await', 'JSON Parsing', 'Error States']
  },
  {
    id: 'password-manager',
    slug: 'password-manager',
    title: 'Password Manager',
    difficulty: 'Intermediate',
    tagline: 'A local vault you actually control',
    description: 'Storing and syncing structured data with localStorage, designing a small data model, performing CRUD operations, and generating cryptographically strong keys.',
    estimatedTime: '4 hours',
    xp: 220,
    bulletSummary: [
      'Storing and syncing encrypted data in browser localStorage',
      'Cryptographically secure random password generator',
      'Filtering and searching saved vault entries with copy to clipboard'
    ],
    checklist: [
      'Configurable generator (length, symbols, numbers, uppercase)',
      'Strength estimator with colored security feedback',
      'CRUD vault manager with instant one-click copy',
      'Master password session lock'
    ],
    skillsGained: ['LocalStorage API', 'Web Crypto API', 'CRUD State Management', 'Security Patterns']
  },
  {
    id: 'chat-application',
    slug: 'chat-application',
    title: 'Chat Application',
    difficulty: 'Intermediate',
    tagline: 'Message bubbles, typing indicators, live feel',
    description: 'Growing a message list dynamically on every send, formatting timestamps, auto-scrolling to the newest message, and handling simulated bot replies.',
    estimatedTime: '4.5 hours',
    xp: 250,
    bulletSummary: [
      'Growing a message list dynamically on every send',
      'Formatting relative timestamps (e.g., "just now", "2m ago")',
      'Smooth auto-scrolling with scrollIntoView and typing indicators'
    ],
    checklist: [
      'Chat layout with persistent bottom composer',
      'Realistic simulated interlocutor with simulated latency',
      'Support for text messages and code snippet formatting',
      'Sound effects and unread counter badges'
    ],
    skillsGained: ['DOM Scroll Manipulation', 'Timestamps & Formatting', 'Simulated WebSockets', 'Input UX']
  },
  {
    id: 'personal-portfolio',
    slug: 'personal-portfolio',
    title: 'Personal Portfolio',
    difficulty: 'Beginner',
    tagline: 'One link that carries your work everywhere',
    description: 'Planning a page as sections: hero, about, projects, contact. Building semantic HTML that reads well without styling, then applying modern polish.',
    estimatedTime: '3.5 hours',
    xp: 200,
    bulletSummary: [
      'Planning a page as sections: hero, about, projects, contact',
      'Building semantic HTML that works beautifully on mobile',
      'Custom contact modal and showcase project cards'
    ],
    checklist: [
      'Hero section with strong value proposition and social links',
      'Project showcase cards with live demo & github repository links',
      'Skill tags and bio summary',
      'Working contact form with validation'
    ],
    skillsGained: ['Responsive Design', 'Semantic Markup', 'Personal Branding', 'CSS Flexbox']
  },
  {
    id: 'kanban-board',
    slug: 'kanban-board',
    title: 'Kanban Task Board Engine',
    difficulty: 'Advanced',
    tagline: 'Multi-column state machines & workflow pipelines',
    description: 'Managing complex hierarchical state across drag-and-drop columns, handling item reordering, immutable updates, column transitions, and localStorage sync.',
    estimatedTime: '5.5 hours',
    xp: 300,
    bulletSummary: [
      'Architecting multi-column state pipelines (To Do, In Progress, Review, Done)',
      'Immutable state transitions when moving cards between columns',
      'Task priority scoring, tag filtering, and instant keyboard shortcuts'
    ],
    checklist: [
      'Interactive column board with To Do, In Progress, and Done pipelines',
      'Task creation modal with priority tag and assignee selection',
      'State transition handlers to advance or move back tasks cleanly',
      'Filter tasks by text query and priority severity',
      'Full state persistence with localStorage fallback'
    ],
    skillsGained: ['Complex State Machines', 'Workflow Pipelines', 'Immutable Data Patterns', 'LocalStorage Sync']
  },
  {
    id: 'algorithm-visualizer',
    slug: 'algorithm-visualizer',
    title: 'Algorithm & Sorting Visualizer',
    difficulty: 'Advanced',
    tagline: 'Dynamic sorting steps & computational visualizer',
    description: 'Build an interactive sorting algorithm visualizer with adjustable animation speed, visual comparisons, state tracking, and step-by-step playback.',
    estimatedTime: '5 hours',
    xp: 280,
    bulletSummary: [
      'Visualizing BubbleSort, SelectionSort, and QuickSort with bar heights',
      'Controlling asynchronous animation playback with pause and speed sliders',
      'Comparing time and space complexities with live counter metrics'
    ],
    checklist: [
      'Dynamic bar chart rendering heights corresponding to array values',
      'Shuffle generator and size slider',
      'Asynchronous generator/delay loop animating active comparison pairs',
      'Swap counter and step inspection metrics',
      'Speed adjustment slider (slow, normal, fast)'
    ],
    skillsGained: ['Asynchronous Timing Loops', 'Algorithm Complexity', 'Visual State Machine', 'Performance Profiling']
  }
];

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Completed your first interactive lesson or quiz.',
    icon: '🌸',
    unlockedAtXp: 25
  },
  {
    id: 'puzzle-solver',
    title: 'Logic Star',
    description: 'Exercised your mind in the Thinking Gym.',
    icon: '🧠',
    unlockedAtXp: 60
  },
  {
    id: 'bug-detective',
    title: 'Bug Detective',
    description: 'Found clues and resolved an error in the Error Companion.',
    icon: '🐛',
    unlockedAtXp: 90
  },
  {
    id: 'three-day-streak',
    title: 'Three-Day Streak',
    description: 'Returned 3 days to keep your learning garden growing.',
    icon: '🔥',
    unlockedAtXp: 120
  },
  {
    id: 'problem-solver',
    title: 'Problem Solver',
    description: 'Earned 150+ XP across multiple disciplines.',
    icon: '⚡',
    unlockedAtXp: 150
  },
  {
    id: 'builder-pro',
    title: 'First Project Complete',
    description: 'Verified all milestones on a real guided build.',
    icon: '🏆',
    unlockedAtXp: 250
  },
  {
    id: 'curious-explorer',
    title: 'Curious Explorer',
    description: 'Reached 400+ XP in your creative coding journey.',
    icon: '✨',
    unlockedAtXp: 400
  }
];
