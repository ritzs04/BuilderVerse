import type { GuidedProject } from "./types";

/**
 * Guided projects: short, buildable projects that pull together a path's
 * skills. Every project has exactly nine stages and a ten-item checklist,
 * and no stage contains a finished solution.
 */
export const guidedProjects: GuidedProject[] = [
  {
    slug: "calculator",
    title: "Calculator",
    tagline: "The classic first app, done properly",
    difficulty: "Beginner",
    minutes: 60,
    icon: "calculator",
    color: "violet",
    tech: ["HTML", "CSS", "JavaScript"],
    overview:
      "You are going to build a calculator that really works: a clear display, a tidy grid of buttons, and JavaScript that keeps track of every number you press. It looks simple, but it quietly combines layout, events, variables, conditions and functions in one small project you can finish in a single sitting.",
    youWillLearn: [
      "Laying out a button grid with CSS Grid",
      "Listening for clicks and reading which button was pressed",
      "Keeping track of state with a few well-named variables",
      "Writing small functions for add, subtract, multiply and divide",
      "Testing edge cases like decimals, negatives and divide by zero",
    ],
    requirements: [
      "Comfort creating a page with HTML and styling it with CSS",
      "Basic JavaScript: variables, if statements and functions",
      "A code editor and a browser with dev tools open",
      "The DOM path up to events is helpful but not required",
    ],
    checklist: [
      "Create the project folder and index.html",
      "Build the display and button grid in HTML",
      "Style the calculator with CSS Grid",
      "Select the display and buttons from JavaScript",
      "Show each pressed digit on the display",
      "Write the four arithmetic functions",
      "Wire up equals, clear and backspace",
      "Test with real calculations and fix what breaks",
      "Make the layout work on a phone",
      "Deploy it and add it to your portfolio",
    ],
    stages: [
      {
        title: "Project Overview",
        body: [
          "You will build a calculator that runs entirely in the browser: a display at the top, a grid of buttons below, and JavaScript that remembers what has been typed so far.",
          "It is the perfect first project because it is small enough to finish today, yet it touches almost every beginner skill: layout, events, variables, conditions and functions.",
        ],
        tip: "Work through the nine stages in order. Each one ends with something you can see on screen, which is the fastest way to stay motivated.",
      },
      {
        title: "What you will learn",
        body: [
          "When you are done you will know how to build a button grid, listen for clicks, update the page from JavaScript, and organise a small program into clear functions.",
          "Just as importantly, you will practise the skill that separates builders from watchers: reading what your code actually did, noticing something wrong, and tracing back to the cause.",
        ],
      },
      {
        title: "Requirements",
        body: [
          "You should be able to create a page with HTML, style it with CSS, and write basic JavaScript: variables, if statements and functions. If you can write a function that takes two numbers and returns their sum, you are ready.",
          "Bring a code editor and a browser with the console open. Nothing else is needed for this project.",
        ],
      },
      {
        title: "Step 1",
        body: [
          "Before any code, decide what the thing looks like. Digits 0 to 9, the four operators, equals, clear, and maybe a decimal point and backspace. Scribble it on paper if that helps you see it.",
          "Now build the HTML: one container, a display element, and the buttons. Give each button an easy way to tell JavaScript its value, such as a data attribute or a clear class name. Keep the markup boring on purpose, because styling comes next and behaviour comes after that.",
        ],
        tip: "Number the buttons in the order you write them and rearrange them with CSS later. You will thank yourself when you are reading the JavaScript.",
      },
      {
        title: "Step 2",
        body: [
          "Style the container so it looks like a real device: rounded corners, comfortable padding, and a display that is large and right-aligned so long results stay readable.",
          "The button area is what CSS Grid was made for. One rule can define a fixed number of columns and let every button fall into place. Play with the gap and the button proportions until the keys feel big enough to tap without aiming.",
        ],
      },
      {
        title: "Step 3",
        body: [
          "Now make it respond. Select the display and the buttons, then add a click listener. A digit press should append that digit to the display, and an operator press should be remembered for later.",
          "Before writing more, name the state your calculator holds: the number currently on screen, the pending operator, and the first number waiting to be combined. Three variables cover a basic calculator. Write their names down and sketch what each one holds after the sequence 12 then plus then 5.",
        ],
        tip: "Log your three variables to the console after every click. Watching state change live makes the logic click faster than re-reading the code.",
      },
      {
        title: "Build",
        body: [
          "Write four tiny functions that each take two numbers and return the result of one operation. Keeping them separate lets you test each one on its own before the rest of the app exists.",
          "Then wire up equals: take the stored number, the pending operator, and what is on screen, run the matching function, and show the answer. Clear should reset all three variables to their starting values.",
          "Ask yourself what should happen when someone divides by zero, presses an operator twice, or hits equals three times in a row, and decide on a rule for each. Your rules do not have to be clever, they just have to be consistent.",
        ],
      },
      {
        title: "Test",
        body: [
          "Run real calculations, not just 2 + 2. Try 12 times 3, 100 divided by 7, 0.1 + 0.2, a result with a long decimal tail, and a string of presses ending in equals three times.",
          "Also try the failure paths: divide by zero, an operator with nothing before it, and equals before any number is entered. Keep a short list of everything that misbehaves.",
        ],
        tip: "Test like a person who wants to break your calculator, not like the person who built it. Every item on your list is a bug you already know how to fix.",
      },
      {
        title: "Debug & Complete",
        body: [
          "Work down your bug list one at a time. Reproduce the problem, read the console, find the line where the value first goes wrong, and change one thing before testing again.",
          "Then polish: make it usable at phone width, tidy the spacing, and choose colours you are happy with. When your checklist is complete, deploy it and put the link in your portfolio. A calculator people can actually open beats a dozen projects that only ever existed in your head.",
        ],
        tip: "Done is a decision, not a feeling. Tick the last box, ship it, and start the next project while the momentum is warm.",
      },
    ],
  },
  {
    slug: "weather-app",
    title: "Weather App",
    tagline: "Fetch real data from a real API",
    difficulty: "Beginner",
    minutes: 90,
    icon: "cloud",
    color: "blue",
    tech: ["HTML", "CSS", "JavaScript", "fetch", "Open-Meteo API"],
    overview:
      "You will build a weather app: type a city, press search, and see the current conditions and a short forecast pulled live from a public weather API. This is the project where web development stops feeling local, because your page will reach out to another server, ask a question and use the answer it gets back.",
    youWillLearn: [
      "Sending HTTP requests with fetch and async/await",
      "Reading a JSON response and picking out the fields you need",
      "Updating the DOM with data that arrives after the click",
      "Handling the unhappy paths: bad cities, offline, slow responses",
      "Building loading, empty and error states that feel finished",
    ],
    requirements: [
      "Comfort with HTML forms, CSS layout and JavaScript functions",
      "Confidence selecting elements and handling events with the DOM",
      "A free weather API: Open-Meteo needs no key, OpenWeatherMap needs a quick signup",
      "A browser with dev tools, so you can watch the network tab",
    ],
    checklist: [
      "Create the project folder and index.html",
      "Build the search form and results layout",
      "Style the loading, error and results states",
      "Read the API docs and get your first response",
      "Fetch the weather for one hard-coded city",
      "Connect the search box to the fetch call",
      "Render temperature, conditions and a 3-day forecast",
      "Handle bad city names and network failures",
      "Make the layout work on a phone",
      "Deploy it and add it to your portfolio",
    ],
    stages: [
      {
        title: "Project Overview",
        body: [
          "You are going to build a weather app that takes any city the learner types and shows the current temperature, conditions and a short forecast, all fetched live from a public API.",
          "Once you have done this, you will see the same pattern everywhere on the web: ask for something, wait, then show it or explain why it failed.",
        ],
        tip: "This is the project where beginners usually stop feeling like beginners. Give it the full ninety minutes.",
      },
      {
        title: "What you will learn",
        body: [
          "You will learn to send a request with fetch, read a JSON response, and update the page with data that arrives after the click that asked for it.",
          "You will also learn the part most tutorials skip: what to show when the city does not exist, the network is down, or the API is having a bad day. Friendly errors are what separate demos from products.",
        ],
      },
      {
        title: "Requirements",
        body: [
          "You should be comfortable with HTML forms, CSS layout and JavaScript functions, plus selecting elements and handling events. If the DOM path feels familiar, you are ready.",
          "You will also need a free weather API. Read enough of the documentation to answer one question: what does a response actually look like?",
        ],
      },
      {
        title: "Step 1",
        body: [
          "Sketch the page first: a search box with a button at the top, a big current-weather card, and a row of forecast days below it.",
          "Build that structure in HTML, including the parts nobody sees at first: a loading message shown while the request runs, and an error area for when something goes wrong. Designing those states now is far easier than bolting them on later.",
        ],
        tip: "Give every region of the page a class you can confidently select later, such as loading, results and error.",
      },
      {
        title: "Step 2",
        body: [
          "Style the app around three states: idle with nothing searched yet, loading while the request runs, and results with data on screen. Decide how each one looks before you wire anything up.",
          "Make the temperature the biggest thing on the card, keep the forecast row simple, and pick colours that read clearly at phone size. A subtle shadow or gradient is enough, because the data is the star.",
        ],
      },
      {
        title: "Step 3",
        body: [
          "Time for your first request. Pick one city, hard-code it, and fetch its weather when the page loads. Log the whole response to the console before you try to display anything.",
          "Read what comes back. Find where the temperature lives, where the condition description lives, and what the forecast list looks like. You cannot render data you have not located.",
        ],
        tip: "Always log a fresh API response first. Guessing at field names is how beginners lose an afternoon.",
      },
      {
        title: "Build",
        body: [
          "Now connect the real flow: on submit, read the city from the input, build the request, wait for the response, then render what you found. Use async and await so the code reads in order.",
          "The page should stay usable while it waits, which is what your loading state is for. When the data arrives, update the card and forecast, then clear the loading message.",
          "Ask yourself what happens if the user submits an empty box, presses search five times quickly, or types a name your API does not recognise.",
        ],
      },
      {
        title: "Test",
        body: [
          "Search for real places: a big city, a small town you know, and a deliberately misspelled name. Try a city with a space in it, and try searching with the input empty.",
          "Turn off your network in dev tools and search again. If your app shows a clear message instead of a spinner that never stops, you have built something genuinely finished.",
        ],
        tip: "Write down every input that produced a confusing result. That list is your remaining work, already sorted by what matters.",
      },
      {
        title: "Debug & Complete",
        body: [
          "Fix your list one item at a time: reproduce, read the console, locate the line, change one thing, test again.",
          "Then make it responsive, choose colours you are proud of, and deploy it. Weather gets checked on phones more than anything else, so look at the phone layout one last time before you call it done.",
        ],
        tip: "A working app with an honest error message feels more professional than a perfect app that breaks silently. Ship the version that fails gracefully.",
      },
    ],
  },
  {
    slug: "password-manager",
    title: "Password Manager",
    tagline: "A local vault you actually control",
    difficulty: "Intermediate",
    minutes: 120,
    icon: "shield",
    color: "emerald",
    tech: ["HTML", "CSS", "JavaScript", "localStorage"],
    overview:
      "You will build a password vault that lives entirely in your browser: save a site, username and password, search your entries, generate a strong password and copy it with one click. There is no server, so you can focus on the parts that make a vault feel trustworthy: tidy data, careful validation and honest feedback.",
    youWillLearn: [
      "Storing and syncing structured data with localStorage",
      "Designing a small data model and performing CRUD operations",
      "Generating passwords from character sets and randomness",
      "Validating input and showing clear, friendly feedback",
      "Masking secrets and using the clipboard API safely",
    ],
    requirements: [
      "Solid JavaScript: objects, arrays, map and filter, and functions",
      "Confident DOM manipulation and form handling",
      "Willingness to read the localStorage page on MDN",
      "HTML forms and CSS layout skills from earlier projects",
    ],
    checklist: [
      "Create the project folder and index.html",
      "Sketch the vault layout and build it in HTML",
      "Style the list, form and detail panels",
      "Define the shape of one saved entry",
      "Save and load entries from localStorage",
      "Build the add-entry form with validation",
      "Add edit and delete for saved entries",
      "Write the password generator",
      "Add search, reveal and copy to clipboard",
      "Test stale data, deploy it and note the security limits",
    ],
    stages: [
      {
        title: "Project Overview",
        body: [
          "You are going to build a local password vault: add credentials, browse them, search the list, reveal or copy a password, and generate a strong one when you need it.",
          "This is the first project where your data model matters as much as your interface, because everything you show on screen is a view over a list you are responsible for keeping tidy.",
        ],
        tip: "This project takes about two hours. The checklist will hold your place if you need to stop mid-way.",
      },
      {
        title: "What you will learn",
        body: [
          "You will learn to shape and persist structured data, keep the screen in sync with storage, and build the edit loop that every real app needs.",
          "You will also practise password generation, input validation and masking secrets, plus writing an honest note about what browser storage can and cannot protect.",
        ],
      },
      {
        title: "Requirements",
        body: [
          "You should be confident with objects and arrays, array methods like map and filter, and writing functions that transform data. DOM manipulation and form handling should feel routine.",
          "Skim the localStorage documentation before you start, and think for a minute about how developers talk about secrets. Both will make the later stages much smoother.",
        ],
      },
      {
        title: "Step 1",
        body: [
          "Start with the data, not the layout. Write down what one saved entry contains: a name for the site, a username, the password itself, and maybe a note and the date it was saved.",
          "Decide how a list of those records will live in storage. One question worth answering now: what happens when two entries use the same site name? Having a rule before you build prevents a redesign later.",
        ],
        tip: "Sketch one entry as a plain object on paper first. If you cannot describe the record in a single sentence, the data model is not ready yet.",
      },
      {
        title: "Step 2",
        body: [
          "Now build the interface: a search box, a list of saved entries, and a form for adding a new one. Decide whether editing happens inside the form or in a detail panel.",
          "Style it to feel calm and trustworthy: clear spacing, strong contrast, and a deliberate colour for anything that reveals a secret. Nothing flashy, because people will open this with real credentials in front of them.",
        ],
      },
      {
        title: "Step 3",
        body: [
          "Make the vault remember. On load, read the saved entries from storage, and when there is nothing there yet, start with an empty list rather than an error.",
          "Every time an entry is added, edited or deleted, write the updated list back and then re-render, so the screen always matches the data. That loop, read, change, save, render, is the heart of this project.",
        ],
        tip: "Refresh the page after every change while you develop. If your data disappears or duplicates, the save loop has a gap worth finding right now.",
      },
      {
        title: "Build",
        body: [
          "Fill in the real behaviour: the add form with validation for empty sites and missing passwords, edit and delete on each entry, and a search box that filters the list as you type.",
          "Then write the password generator. Choose a character set, choose a length, and combine random picks until you have one. Think about what happens when someone clears the site name and hits save, or pastes a 500-character note.",
          "Finish with the small touches that make a vault usable: a reveal button that shows a password for a moment, and a copy button that puts it on the clipboard.",
        ],
      },
      {
        title: "Test",
        body: [
          "Refresh, close the tab and come back. Your entries should still be there. Now test the awkward cases: duplicate sites, very long passwords, quotes and emoji in the notes, and clearing browser storage entirely.",
          "Try loading the page with a corrupted value already in storage. Your app should survive it and start fresh instead of showing a blank screen.",
        ],
        tip: "Add a few realistic test entries, then browse them in a narrow window. Two minutes of testing here catches layout bugs that would embarrass you later.",
      },
      {
        title: "Debug & Complete",
        body: [
          "Fix your list in order: reproduce, read the console, find the state that went wrong, change one thing, then retest.",
          "Then deploy it and write three honest lines about its limits: browser storage is not encrypted, there is no master password, and this is a learning project rather than a place for real credentials. Being straight about that reads as maturity, not weakness.",
        ],
        tip: "Knowing and stating what your app does not do is a senior habit. Practise it now while the stakes are low.",
      },
    ],
  },
  {
    slug: "chat-application",
    title: "Chat Application",
    tagline: "Message bubbles, typing indicators, live feel",
    difficulty: "Intermediate",
    minutes: 150,
    icon: "message",
    color: "amber",
    tech: ["HTML", "CSS", "JavaScript"],
    overview:
      "You will build a chat interface that feels like the real thing: message bubbles, timestamps, a composer, a typing indicator, and a conversation that is still there when you come back. Without a server you will talk to a scripted partner, which is enough to learn every skill the front half of a real chat app needs.",
    youWillLearn: [
      "Growing a message list dynamically on every send",
      "Formatting timestamps and auto-scrolling to the newest message",
      "Handling form submission without reloading the page",
      "Simulating async replies with timers and typing indicators",
      "Persisting a conversation and restoring it on load",
    ],
    requirements: [
      "Comfort with DOM events, creating elements and form submission",
      "Template literals, arrays and objects should feel natural",
      "CSS skills for a scrollable container and two-sided layout",
      "A code editor and a browser with dev tools open",
    ],
    checklist: [
      "Create the project folder and index.html",
      "Build the message list and composer layout",
      "Style bubbles for both sides of the conversation",
      "Send a message on submit and render it",
      "Add timestamps and auto-scroll to the newest message",
      "Write the reply logic for your chat partner",
      "Add a typing indicator with a short delay",
      "Save the conversation and restore it on load",
      "Test empty input, long messages and rapid sends",
      "Polish for mobile, deploy it and share the link",
    ],
    stages: [
      {
        title: "Project Overview",
        body: [
          "You are going to build a complete chat screen: a scrolling conversation, a composer at the bottom, and a partner that answers with a short delay and a typing indicator.",
          "Since there is no backend yet, the partner is scripted by you. That is not a shortcut, it is the point, because swapping your reply function for a live connection later is a small step once the interface is solid.",
        ],
        tip: "Fifteen minutes of chatting in your own unfinished app is the most motivating kind of testing. Use it as your reward between stages.",
      },
      {
        title: "What you will learn",
        body: [
          "You will learn to build a list that grows on every send, keep the view scrolled to the newest message, and lay out bubbles that sit on opposite sides.",
          "You will also simulate another person with timers, persist a conversation, and think about what happens when messages arrive faster than the user can read them.",
        ],
      },
      {
        title: "Requirements",
        body: [
          "You should be comfortable with DOM events, creating elements from JavaScript, and handling form submission. If you have built a card layout in CSS before, you have the layout skills you need.",
          "Nothing else. The trickiest part of this project is ordering the details, not the syntax.",
        ],
      },
      {
        title: "Step 1",
        body: [
          "Design the conversation screen: a scrolling message area that fills most of the page, and a composer pinned to the bottom with a text input and a send button.",
          "Build the HTML for that, including an empty state for when there are no messages yet. Then style the two sides, one for you and one for your partner, and make sure long messages wrap instead of stretching across the screen.",
        ],
        tip: "Give the message area a fixed height with scrolling. Getting this right now prevents the classic bug where the composer disappears off-screen.",
      },
      {
        title: "Step 2",
        body: [
          "Make sending work. On submit, read the input, create a message element with your text and the current time, add it to the list, clear the input, then scroll to the bottom.",
          "Decide the small rules before you code them: is an empty message allowed, does the text survive a failed send, and does pressing Enter submit? Rules written down first keep the logic simple.",
        ],
      },
      {
        title: "Step 3",
        body: [
          "Now give your partner a voice. Write a reply function that takes the last message and decides what to say back. A rule-based picker is plenty: match a keyword, or choose from a list at random.",
          "Wrap the reply in a short delay and show a typing indicator while the partner is thinking. That tiny pause is what makes a chat feel like another person is there.",
        ],
        tip: "Log each reply decision in the console at first. Seeing why the partner chose a reply makes the rules easy to tune.",
      },
      {
        title: "Build",
        body: [
          "Fill in the rest of the experience: timestamps on each message, auto-scroll that only fires when you are already near the bottom, and a friendly bubble entrance.",
          "Then persist the conversation so a refresh does not wipe it, and restore the history when the page loads. Think about the edges: what if storage holds 500 messages, what if a message is twice the width of the screen, and what if someone sends the same sentence five times?",
        ],
      },
      {
        title: "Test",
        body: [
          "Send fast, send long, send nothing, and send a line with emoji and line breaks. Reload mid-conversation and check that the history returns exactly as it was.",
          "Open the app at phone width. The composer should stay reachable, the bubbles should wrap, and there should be no horizontal scrollbar anywhere.",
        ],
        tip: "Race your own app: hit send repeatedly while a reply is still pending. Whatever breaks first is the bug worth fixing before anything else.",
      },
      {
        title: "Debug & Complete",
        body: [
          "Take your bug list one item at a time, changing one thing per test and keeping the console visible while you do it.",
          "Then polish the details that sell the illusion: avatar placeholders, a subtle colour difference between sides, smoother scrolling. Deploy it, send the link to a friend, and watch where they hesitate, because that is your next improvement list.",
        ],
        tip: "Users will show you where your interface is unclear without meaning to. Their first hesitation is worth more than the feature you were planning to add.",
      },
    ],
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio",
    tagline: "One link that carries your work everywhere",
    difficulty: "Beginner",
    minutes: 90,
    icon: "user",
    color: "rose",
    tech: ["HTML", "CSS"],
    overview:
      "You will build a one-page portfolio that introduces you, shows what you have made, and gives anyone a way to reach you. It is HTML and CSS only, so every decision on screen is one you fully understand. It is also the highest-leverage beginner project there is, because one link turns scattered class exercises into something a person can actually look at.",
    youWillLearn: [
      "Planning a page as sections: hero, about, projects, contact",
      "Building semantic HTML that reads well without styling",
      "Creating a small design system of colour, type and spacing",
      "Responsive layout with Flexbox and Grid",
      "Checking contrast, links and copy like a reviewer",
    ],
    requirements: [
      "Headings, lists, links, images and sections in HTML",
      "Selectors, classes and the box model in CSS",
      "Two or three projects to show, even small or unfinished ones",
      "A browser and, optionally, a free place to deploy",
    ],
    checklist: [
      "Create the project folder and index.html",
      "Sketch the section order on paper",
      "Write semantic HTML for every section",
      "Choose a palette, font and spacing scale",
      "Style the hero and typography",
      "Build project cards with real screenshots",
      "Add contact and social links",
      "Make every section work on a phone",
      "Check contrast, links and typos",
      "Deploy it and put the link on your resume",
    ],
    stages: [
      {
        title: "Project Overview",
        body: [
          "You are going to build a single page that answers three questions fast: who are you, what have you made, and how does someone reach you.",
          "Because it uses only HTML and CSS, nothing is hidden behind a framework. When something looks wrong you can open dev tools and see exactly which rule did it, which makes this the best place to sharpen your eye.",
        ],
        tip: "Build the ugly version first and make it good afterwards. A finished plain page beats a beautiful page you never complete.",
      },
      {
        title: "What you will learn",
        body: [
          "You will learn to plan a page as a sequence of sections, write semantic markup, and build a tiny design system of colours, sizes and spacing that keeps everything consistent.",
          "You will also practise responsive layout and the details that make pages feel professional: hierarchy, comfortable line lengths, and images that are not 4000 pixels wide.",
        ],
      },
      {
        title: "Requirements",
        body: [
          "You should know headings, lists, links, images and sections in HTML, plus selectors, classes and the box model in CSS. Flexbox or Grid experience helps, but you will get plenty of practice here.",
          "You also need material to show: two or three projects, however small, and a way to be contacted. If a project is unfinished, show it anyway and say so honestly.",
        ],
      },
      {
        title: "Step 1",
        body: [
          "Start with content, not colours. Write a plain list of what the page must say: who you are in one sentence, what you are learning, the things you have built, and how to reach you.",
          "Then order the sections. A reliable sequence is hero, about, projects, contact. Sketch each one as a box on paper with a one-line note about what goes inside it.",
        ],
        tip: "Write the hero sentence first and make it specific. A concrete line about what you are building beats a generic claim about passion every time.",
      },
      {
        title: "Step 2",
        body: [
          "Build the whole page in HTML with no styling at all. Use headings in the right order, real lists for your projects, and meaningful alt text on every image.",
          "Check that the page makes sense unstyled, because it should. If someone can read it as a plain document, screen readers and search engines will handle it well too.",
        ],
        tip: "Link every project card somewhere real, even if it is a repository with three commits. A dead link costs more trust than no link at all.",
      },
      {
        title: "Step 3",
        body: [
          "Now create your design system: one background, one text colour, one accent, and two or three font sizes that do most of the work. Write them down before you style anything.",
          "Apply them section by section, starting with the hero. Give it generous space above and below, keep line lengths comfortable, and let one element per section be the loudest thing on screen.",
        ],
      },
      {
        title: "Build",
        body: [
          "Build the projects section as repeated cards: screenshot, title, one-line description and links. Keep the cards identical, because repetition is what makes a page look designed rather than decorated.",
          "Then add the contact area with your email and the profiles you actually use, and check every link. After that, walk the page at phone width, one section at a time, until nothing overflows or feels cramped.",
        ],
      },
      {
        title: "Test",
        body: [
          "Read the whole page out loud and fix every typo and awkward sentence. Then test the boring things: each link, each image, keyboard tab order, and what happens when an image fails to load.",
          "Ask one person to look at the page for thirty seconds and tell you what you do. If they cannot answer, your hero section needs to be clearer.",
        ],
        tip: "Typos on a portfolio cost more credibility than missing features. One slow read-through is the cheapest quality check you will ever run.",
      },
      {
        title: "Debug & Complete",
        body: [
          "Work through your list of contrast, spacing and wording issues, then do one more pass at phone width and one at desktop width.",
          "Deploy it somewhere free, put the link on your resume and in your profiles, and set a reminder to revisit it after your next project. A portfolio is a living page, not a finish line.",
        ],
        tip: "Ship with two projects rather than waiting for five. You can add the rest as you build them, and the link is already working.",
      },
    ],
  },
];
