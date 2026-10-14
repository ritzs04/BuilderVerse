import type { Lesson } from "../types";

export const apiLessons: Lesson[] = [
  {
    slug: "apis-fetch-basics",
    title: "APIs and fetch basics",
    summary:
      "What an API is, how fetch asks for data, and how to turn a JSON response into something you can show.",
    order: 1,
    minutes: 13,
    xp: 45,
    concept:
      "An API gives your program a URL it can request data from, and fetch() is the browser function that makes that request and hands back the response.",
    explanation: [
      "An API (Application Programming Interface) is a URL that other software answers for you. You send a request, and the server replies with data — usually formatted as JSON, which looks exactly like a JavaScript object written as text. Weather numbers, quotes, jokes, random dog pictures: all available from public APIs you can call for free.",
      "fetch(\"https://...\") is built into the browser. It sends the request and immediately returns a Promise — a placeholder for the answer that has not arrived yet. When the server replies, that promise settles and your code can use the response.",
      "The response object is not the data itself. It is an envelope: you open it by calling response.json(), which returns another promise that resolves to the actual JavaScript object. Then data.message or data.value gives you the content you wanted.",
      "Notice that nothing is instant. Your code after the fetch runs before the data arrives, so anything that needs the result must wait inside the promise chain. And when something goes wrong — no internet, a broken URL — the chain needs a .catch so the page does not just freeze silently.",
    ],
    analogy:
      "Ordering from a menu: you send your order (the request), the kitchen takes time to cook, and eventually a tray arrives (the response). You still have to unwrap the tray cover (response.json()) before there is anything you can eat.",
    example: {
      lang: "javascript",
      code: `fetch("https://dog.ceo/api/breeds/image/random")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.message); // a direct link to a random dog photo
  })
  .catch(function (error) {
    console.log("Something went wrong:", error);
  });`,
      caption:
        "Fetch a random dog photo. The next lesson shows a shorter async/await version.",
    },
    sections: [
      {
        heading: "What the response looks like",
        body: [
          "This endpoint replies with JSON shaped like `{ \"message\": \"https://images.dog.ceo/...\", \"status\": \"success\" }`. Once parsed, that becomes a normal object: `data.message` is the image URL and `data.status` tells you the request worked.",
          "Because it is an ordinary object, you can use it like any other data: drop it into an `img.src`, count its characters, or store it in a variable for later.",
        ],
      },
      {
        heading: "Reading the response carefully",
        body: [
          "fetch only rejects — goes to `.catch` — when the network itself fails, like being offline. A 404 or 500 error still resolves, so check `response.ok` (true for status codes 200–299) when you care about success.",
          "A quick pattern: if `!response.ok`, throw a new Error inside the `.then`, and your `.catch` will handle it just like a network problem.",
        ],
        code: {
          lang: "javascript",
          code: `fetch("https://dog.ceo/api/breeds/image/random")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Request failed: " + response.status);
    }
    return response.json();
  })
  .then(function (data) {
    console.log(data.message);
  })
  .catch(function (error) {
    console.error(error.message);
  });`,
        },
      },
    ],
    tryIt: {
      instructions:
        "Fetch a random dog photo and show it on the page. Put the image URL from the response into the src of the img element, and log the URL to the console as well.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Random dog</title>
  </head>
  <body>
    <h1>Random dog</h1>
    <button id="load">Load a dog</button>
    <p><img id="dog" alt="A random dog" width="300" /></p>

    <script>
      const button = document.querySelector("#load");
      const picture = document.querySelector("#dog");

      button.addEventListener("click", function () {
        // fetch the API, then set picture.src to data.message
      });
    </script>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Random dog</title>
  </head>
  <body>
    <h1>Random dog</h1>
    <button id="load">Load a dog</button>
    <p><img id="dog" alt="A random dog" width="300" /></p>

    <script>
      const button = document.querySelector("#load");
      const picture = document.querySelector("#dog");

      button.addEventListener("click", function () {
        fetch("https://dog.ceo/api/breeds/image/random")
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data.message);
            picture.src = data.message;
          })
          .catch(function (error) {
            console.log("Could not load a dog:", error);
          });
      });
    </script>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Fetch a random joke from https://official-joke-api.appspot.com/random_joke and print its setup and punchline in two paragraphs. The JSON looks like { \"setup\": \"...\", \"punchline\": \"...\" }.",
      hint:
        "Same three steps: fetch, then response.json(), then read the object. This time you need `data.setup` and `data.punchline` instead of `data.message`.",
      solution: `const setup = document.querySelector("#setup");
const punchline = document.querySelector("#punchline");

fetch("https://official-joke-api.appspot.com/random_joke")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    setup.textContent = data.setup;
    punchline.textContent = data.punchline;
  })
  .catch(function (error) {
    setup.textContent = "Could not load a joke.";
    console.error(error);
  });`,
    },
    commonMistakes: [
      {
        mistake:
          "Logging the response directly and seeing an empty-looking object.",
        fix: "fetch gives you a Response envelope, not data. Call response.json() (it is a promise too) and use what comes back after it.",
      },
      {
        mistake:
          "Trying to use the data before the request has finished.",
        fix: "Anything that needs the result belongs inside the second .then, or after an await — outside, the data is not there yet.",
      },
      {
        mistake:
          "Expecting a 404 or 500 to trigger the .catch handler.",
        fix: "fetch only rejects when the network fails. Check response.ok yourself and throw an error if the status code is not a success.",
      },
    ],
    quiz: [
      {
        question: "What does fetch(url) return?",
        options: [
          "The JSON data itself, ready to use",
          "A Promise that resolves to a Response object",
          "An HTML string from the server",
          "A boolean saying whether the site is up",
        ],
        correctIndex: 1,
        explanation:
          "fetch answers with a Response envelope. You still have to open it with response.json() to get the data.",
      },
      {
        question: "What does response.json() give you?",
        options: [
          "The HTTP status code",
          "A string of raw HTML",
          "A promise that resolves to the parsed body as a JavaScript object",
          "A promise that reloads the page",
        ],
        correctIndex: 2,
        explanation:
          "The body arrives as text; json() parses it into an object you can read with dot notation like data.message.",
      },
      {
        question: "In simple terms, what is JSON?",
        options: [
          "A text format for structured data that JavaScript can parse into objects",
          "A new version of JavaScript for servers",
          "The browser's caching system",
          "A tool for styling web pages",
        ],
        correctIndex: 0,
        explanation:
          "JSON is plain text shaped like objects and arrays, which is why almost every public API speaks it.",
      },
    ],
  },
  {
    slug: "apis-async-errors",
    title: "Async, loading and error states",
    summary:
      "async/await, try/catch and the loading states that keep a page honest when requests are slow or broken.",
    order: 2,
    minutes: 15,
    xp: 45,
    concept:
      "Network requests take time and can fail, so your UI must run asynchronously and handle loading, success and error states explicitly.",
    explanation: [
      "async/await is the modern way to work with promises. Mark a function async, and you can put await in front of any promise: the function pauses at that line until the answer arrives, while the rest of the page keeps running. It reads like normal, top-to-bottom code.",
      "Waiting means things can go wrong at the exact line you are waiting on. try/catch covers that: put the awaits inside try, and any failure — offline, a blocked URL, a server that returned junk — jumps to catch, where your page can recover instead of breaking.",
      "While the request is in flight, the user sees nothing happening. So set a loading state *before* the await (\"Loading...\", a spinner, a disabled button) and replace it with the real content after. That one line is the difference between an app that feels broken and one that feels fast.",
      "Real networks are slow and servers do go down. A UI that handles failure gracefully — a friendly message, a retry button, details in the console — keeps people trusting your product far more than a blank screen would.",
    ],
    analogy:
      "Ordering food at a restaurant: you tell the waiter you ordered (loading state), the kitchen might burn it (error), and either way the waiter comes back to your table to say what happened — rather than leaving you staring at an empty plate.",
    example: {
      lang: "javascript",
      code: `const status = document.querySelector("#status");
const button = document.querySelector("#load");

button.addEventListener("click", async function () {
  status.textContent = "Loading...";

  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");

    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }

    const data = await response.json();
    status.textContent = "Here is your dog!";
    document.querySelector("#dog").src = data.message;
  } catch (error) {
    status.textContent = "Could not load a dog. Please try again.";
    console.error(error);
  }
});`,
      caption:
        "One button, three honest states: loading, success and failure.",
    },
    sections: [
      {
        heading: "Why loading states matter",
        body: [
          "A request can take 200 ms or 10 seconds. Without a loading message the user assumes your button is broken and clicks it again — starting even more requests.",
          "Update the UI *before* the await, not after: the await line is exactly where your function stops, so anything you write beneath it runs only once the answer (or the error) is already in.",
          "Disabling the button while waiting (`button.disabled = true`) prevents double clicks, and the finally block below is the perfect place to turn it back on.",
        ],
      },
      {
        heading: "Three ways a request fails",
        body: [
          "**No network:** the device is offline or the domain does not exist. fetch rejects and lands directly in catch.",
          "**Bad status:** the server answers 404 or 500. fetch does *not* reject, so you throw your own error after checking `response.ok`.",
          "**Bad body:** the server sent something that is not valid JSON, so `await response.json()` throws and catch handles it.",
          "All three reach the same place, which is why one try/catch can protect the whole flow.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Build a joke loader: a button that shows Loading... while it waits, fills in the setup and punchline on success, and shows a friendly failure message if anything goes wrong. Use async/await and try/catch.",
      starter: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Joke loader</title>
  </head>
  <body>
    <button id="load">Tell me a joke</button>
    <p id="status">Ready when you are.</p>
    <p id="setup"></p>
    <p id="punchline"></p>

    <script>
      const button = document.querySelector("#load");

      button.addEventListener("click", async function () {
        // 1. set #status to "Loading..."
        // 2. try { fetch + await json + fill the two paragraphs }
        // 3. catch { set a friendly message on #status }
      });
    </script>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Joke loader</title>
  </head>
  <body>
    <button id="load">Tell me a joke</button>
    <p id="status">Ready when you are.</p>
    <p id="setup"></p>
    <p id="punchline"></p>

    <script>
      const button = document.querySelector("#load");
      const status = document.querySelector("#status");
      const setup = document.querySelector("#setup");
      const punchline = document.querySelector("#punchline");

      button.addEventListener("click", async function () {
        status.textContent = "Loading...";
        setup.textContent = "";
        punchline.textContent = "";

        try {
          const response = await fetch(
            "https://official-joke-api.appspot.com/random_joke"
          );

          if (!response.ok) {
            throw new Error("Status " + response.status);
          }

          const data = await response.json();
          setup.textContent = data.setup;
          punchline.textContent = data.punchline;
          status.textContent = "Here you go!";
        } catch (error) {
          status.textContent =
            "No joke today - check your connection and try again.";
          console.error(error);
        }
      });
    </script>
  </body>
</html>`,
    },
    challenge: {
      task:
        "Stop double clicks: disable the button while the request is in flight and switch it back on when the request finishes, whether it worked or failed.",
      hint:
        "Set `button.disabled = true` just before the try. A `finally` block runs after try *and* after catch, so it is the one place that always executes.",
      solution: `button.addEventListener("click", async function () {
  button.disabled = true;
  status.textContent = "Loading...";

  try {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );
    if (!response.ok) throw new Error("Status " + response.status);

    const data = await response.json();
    setup.textContent = data.setup;
    punchline.textContent = data.punchline;
    status.textContent = "Here you go!";
  } catch (error) {
    status.textContent = "No joke today - please try again.";
    console.error(error);
  } finally {
    button.disabled = false;
  }
});`,
    },
    commonMistakes: [
      {
        mistake: "Writing await inside a normal function and getting an error.",
        fix: "await only works inside a function marked async: `async function () { ... }` or `async () => { ... }`.",
      },
      {
        mistake: "Showing nothing while the request is in flight.",
        fix: "Set your loading text or spinner before the await line, then swap in the real content afterwards.",
      },
      {
        mistake: "A catch block that only logs, leaving the user with a blank screen.",
        fix: "Write a friendly message into the page *and* log the error for yourself, so users know what happened and you can debug.",
      },
    ],
    quiz: [
      {
        question: "Which keyword pauses an async function until a promise settles?",
        options: ["await", "then", "stop", "yield"],
        correctIndex: 0,
        explanation:
          "await suspends that one function until the promise resolves or rejects; the rest of the page keeps running.",
      },
      {
        question: "Where should you show a loading message?",
        options: [
          "After the await, together with the data",
          "Before the await, so it appears the moment the request starts",
          "Only once the request has failed",
          "Inside a separate page the user opens",
        ],
        correctIndex: 1,
        explanation:
          "The await line is where your function pauses — set the loading state first or the user will see nothing while waiting.",
      },
      {
        question: "What does the catch block do in this flow?",
        options: [
          "Catches every click on the page",
          "Converts JSON into a string",
          "Runs when the awaited request throws, so the page can show a friendly error",
          "Retries the request automatically 100 times",
        ],
        correctIndex: 2,
        explanation:
          "Offline, bad status (if you throw) and broken JSON all land in catch — one place to handle every failure.",
      },
    ],
  },
];
