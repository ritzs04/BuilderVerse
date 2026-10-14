import type { Lesson } from "../types";

export const javascriptLessons: Lesson[] = [
  {
    slug: "js-values-and-variables",
    title: "Values and variables",
    summary: "Storing information with let and const, and building text with template literals.",
    order: 1,
    minutes: 12,
    xp: 40,
    concept:
      "A variable is a named container for a value, and JavaScript gives you const for values that stay the same and let for values that change.",
    explanation: [
      "Programs are really just juggling information: a user's name, a score, a price. In JavaScript you store that information in variables using the keywords const and let. You give the variable a name, and from then on you can use the name instead of the value.",
      "Use const when the value will not change, and let when it will. This habit pays off quickly: if you try to reassign a const, JavaScript stops you with a clear error instead of letting a value drift somewhere unexpected.",
      "Values come in a few everyday flavours. Text is a string (wrapped in quotes), whole or decimal numbers are numbers, and true/false are booleans. You can join strings and numbers together, and template literals — a backtick string with ${name} placeholders — make that joining readable.",
      "Variable names should describe what they hold: `score`, `userName`, `taxRate`. Names cannot start with a number and cannot contain spaces.",
    ],
    analogy:
      "A variable is a labelled jar in your kitchen. The label is the name, the contents are the value, and const means you taped the lid shut while let means you can swap what is inside.",
    example: {
      lang: "javascript",
      code: `const name = "Asha";
let score = 10;

score = score + 5;

console.log(name + " has " + score + " points");
console.log(\`\${name} has \${score} points\`);`,
      caption: "Same sentence, two ways — the template literal is easier to read.",
    },
    sections: [
      {
        heading: "let vs const",
        body: [
          "`const` is the default. Reach for `let` only when you genuinely need to reassign — counters, totals, values updated inside a loop.",
          "You can still change the *contents* of a const array or object later; const only locks the variable itself.",
        ],
        code: {
          lang: "javascript",
          code: `const appName = "BuilderVerse";
let streak = 3;

streak = streak + 1;
console.log(appName, streak); // BuilderVerse 4

const today = "Tuesday";
console.log(today);
// today = "Wednesday"; // TypeError: Assignment to constant variable.`,
        },
      },
      {
        heading: "Template literals",
        body: [
          "Wrap a message in backticks and drop values in with `${expression}`. Any expression works — a variable, `a + b`, even a function call.",
          "They also keep quotes tidy, because you no longer need a pile of + signs and matching quote marks.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Store your name, your favourite language and how many hours you studied this week, then print one friendly sentence that includes all three using a template literal.",
      starter: `const name = "Asha";
const language = "JavaScript";
let hoursStudied = 4;

// Print one sentence with all three values using backticks
`,
      solution: `const name = "Asha";
const language = "JavaScript";
let hoursStudied = 4;

hoursStudied = hoursStudied + 2;

console.log(\`\${name} is learning \${language} and has studied \${hoursStudied} hours.\`);`,
    },
    challenge: {
      task:
        "Build a tiny receipt. Store two item names and two prices, then log a title, one line per item, and a total line using a template literal.",
      hint:
        "Keep the prices as numbers so you can add them: priceOne + priceTwo works only if both are numbers.",
      solution: `const itemOne = "Notebook";
const priceOne = 120;
const itemTwo = "Pen set";
const priceTwo = 45;

console.log("Receipt");
console.log(\`\${itemOne}: Rs. \${priceOne}\`);
console.log(\`\${itemTwo}: Rs. \${priceTwo}\`);
console.log(\`Total: Rs. \${priceOne + priceTwo}\`);`,
    },
    commonMistakes: [
      {
        mistake: "Using a variable before you have declared it, which throws a ReferenceError.",
        fix: "Declare with const or let at the top of your code before you use the name anywhere below.",
      },
      {
        mistake: "Trying to reassign a const and getting 'Assignment to constant variable'.",
        fix: "If the value really changes, declare it with let from the start.",
      },
      {
        mistake: "Forgetting quotes around text, so JavaScript thinks the word is a variable name.",
        fix: "Text always needs quotes: `\"Asha\"` is a string, `Asha` is a name JavaScript looks up.",
      },
    ],
    quiz: [
      {
        question: "Which keyword declares a value that cannot be reassigned?",
        options: ["let", "var", "const", "static"],
        correctIndex: 2,
        explanation:
          "const locks the variable. Use let only when the value needs to change.",
      },
      {
        question: "What happens when this code runs: const price = 9; price = 10;",
        options: [
          "price becomes 10 quietly",
          "JavaScript throws an error",
          "A second variable is created",
          "It prints 9 forever",
        ],
        correctIndex: 1,
        explanation:
          "Reassigning a const throws a TypeError. Switch the declaration to let if the value should change.",
      },
      {
        question: "What does console.log(name) print if name is \"Asha\"?",
        options: ["name", "Asha", "\"Asha\"", "undefined"],
        correctIndex: 1,
        explanation:
          "Without quotes, JavaScript looks up the variable's value. With quotes like console.log(\"name\") you would see the literal word name.",
      },
    ],
  },
  {
    slug: "js-types-and-operators",
    title: "Types and operators",
    summary: "The main data types, typeof, and how + - * / compare and combine values.",
    order: 2,
    minutes: 14,
    xp: 40,
    concept:
      "Every JavaScript value has a type — string, number, boolean, undefined, null, object — and operators act on those types in specific ways.",
    explanation: [
      "Knowing the type of a value tells you what you can safely do with it. You can add numbers, join strings, and compare almost anything. The typeof operator answers the question for you: typeof 42 is \"number\", typeof \"42\" is \"string\".",
      "Arithmetic works the way you expect: + - * / all do maths, and % (the remainder operator) is a favourite for tasks like 'is this number even?'. Division always produces a decimal, so 7 / 2 is 3.5.",
      "Comparison operators such as >, <, >= and <= produce a boolean — true or false. The tricky one is equality: == compares after converting types, while === compares value *and* type without converting. JavaScript developers almost always use ===.",
      "Types also surprise you with the + operator. If either side of + is a string, JavaScript joins the text instead of adding: \"10\" + 5 gives \"105\". Convert with Number() when you meant to do maths.",
    ],
    analogy:
      "Types are like plug shapes on a charger. A number plug and a phone plug are not interchangeable — typeof tells you which shape you are holding before you try to plug it in.",
    example: {
      lang: "javascript",
      code: `const age = 25;
const name = "Ravi";
const isStudent = true;

console.log(typeof age);       // "number"
console.log(typeof name);      // "string"
console.log(typeof isStudent); // "boolean"

console.log(age + 5);   // 30
console.log(age / 2);   // 12.5
console.log(age % 2);   // 1
console.log("10" + 5);  // "105" — string joining, not maths`,
      caption: "typeof tells you the type; + joins text when a string is involved.",
    },
    sections: [
      {
        heading: "=== vs ==",
        body: [
          "`===` is strict equality: both the value and the type must match. `5 === \"5\"` is false because one is a number and one is a string.",
          "`==` converts types first, so `5 == \"5\"` is true. That conversion hides bugs, so make === your habit.",
        ],
        code: {
          lang: "javascript",
          code: `console.log(5 === 5);   // true
console.log(5 === "5"); // false
console.log(5 == "5");  // true  — surprising!
console.log(5 !== "5"); // true  — strict inequality`,
        },
      },
      {
        heading: "Comparison and maths at a glance",
        body: [
          "Maths: `+ - * / %`. Comparisons: `> < >= <= === !==`.",
          "`%` returns the remainder, so `n % 2 === 0` is a neat test for even numbers.",
        ],
        code: {
          lang: "javascript",
          code: `console.log(7 > 5);        // true
console.log(10 <= 10);     // true
console.log(4 % 2 === 0);  // true
console.log(4 % 3 === 0);  // false`,
        },
      },
    ],
    tryIt: {
      instructions:
        "The code below joins two numbers as text instead of adding them. Fix it so it prints 7, and keep the typeof log so you can see the type is now number.",
      starter: `let items = "5";
let more = 2;

console.log(items + more); // Should print 7
console.log(typeof items); // Should print "number"
`,
      solution: `let items = Number("5");
let more = 2;

console.log(items + more); // 7
console.log(typeof items); // "number"

console.log(items === 7); // true
console.log(items == "7"); // true — but prefer ===`,
    },
    challenge: {
      task:
        "Convert the string \"42\" to a number, add 8 to it, then log the result and a boolean showing whether it is greater than 45.",
      hint:
        "Wrap the string in Number(...) to convert it, use > for the comparison, and remember comparisons always give true or false.",
      solution: `const raw = "42";
const value = Number(raw) + 8;

console.log(value);        // 50
console.log(value > 45);   // true
console.log(typeof value); // "number"`,
    },
    commonMistakes: [
      {
        mistake: "Using == and getting a surprising true, like \"5\" == 5.",
        fix: "Use === and !== so both value and type must match — no silent conversions.",
      },
      {
        mistake: "Adding a number and a string and getting text like \"105\".",
        fix: "Convert first with Number(value) (or parseInt for text that starts with digits), then do the maths.",
      },
      {
        mistake: "Confusing assignment (=) with comparison (===).",
        fix: "= stores a value; === and !== compare values. Read an if condition out loud as 'is equal to'.",
      },
    ],
    quiz: [
      {
        question: "What does typeof null return?",
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctIndex: 1,
        explanation:
          'A famous JavaScript quirk: typeof null is "object". Check for null directly with value === null.',
      },
      {
        question: "Which operator compares both value and type?",
        options: ["==", "=", "===", "!="],
        correctIndex: 2,
        explanation: "=== is strict equality. == converts types first, = assigns a value.",
      },
      {
        question: "What does console.log(\"5\" + 3) print?",
        options: ["8", '"53"', "53", "An error"],
        correctIndex: 1,
        explanation:
          'When either side of + is a string, JavaScript joins text. Convert with Number("5") + 3 if you want 8.',
      },
    ],
  },
  {
    slug: "js-conditions",
    title: "Making decisions with conditions",
    summary: "if / else if / else, the logical operators && || !, and what counts as truthy.",
    order: 3,
    minutes: 14,
    xp: 40,
    concept:
      "Conditions let your program choose a path: if a test is true, run one block of code; otherwise run another.",
    explanation: [
      "Real programs react to data. An if statement runs its block only when the condition inside the parentheses is true. You can add else if for extra cases and a final else for everything else — JavaScript checks them top to bottom and runs the first match.",
      "Conditions become powerful when you combine them. && means both must be true, || means at least one must be true, and ! flips a value: !true is false.",
      "You are not limited to comparisons. JavaScript treats some values as false in a condition — these are called falsy: false, 0, \"\", null, undefined and NaN. Everything else, including \"0\" and [], is truthy.",
      "That is why if (name) asks 'did the user type anything?' — an empty string is falsy. It is a compact, readable check once you know the rule.",
    ],
    analogy:
      "Conditions are like a bouncer at the door reading a guest list: one name matches, you go in; nothing matches, you take the other line. Logical operators are the extra rules — 'VIP pass OR on the list', 'name on the list AND photo ID'.",
    example: {
      lang: "javascript",
      code: `const age = 20;

if (age >= 18) {
  console.log("You can vote");
} else if (age >= 13) {
  console.log("Teen account");
} else {
  console.log("Ask a parent");
}

const hasTicket = true;
const isVip = false;

console.log(hasTicket && isVip); // false
console.log(hasTicket || isVip); // true
console.log(!isVip);             // true`,
      caption: "One branch runs, and the logical operators combine yes/no answers.",
    },
    sections: [
      {
        heading: "Truthy and falsy",
        body: [
          "Falsy values: `false`, `0`, `\"\"`, `null`, `undefined`, `NaN`. Everything else is truthy.",
          "This means `if (count)` is false when count is 0 — often not what you want for a counter. Write `count > 0` instead when zero should still count as 'something happened'.",
        ],
        code: {
          lang: "javascript",
          code: `console.log(Boolean("hello")); // true
console.log(Boolean(""));      // false
console.log(Boolean(0));       // false
console.log(Boolean([]));      // true — arrays are objects`,
        },
      },
      {
        heading: "Reading && and ||",
        body: [
          "`&&` needs both sides true — great for 'this AND that' checks like a username and a password.",
          "`||` needs one side true — great for defaults, like `const name = input || \"guest\"`.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Write a grade checker: log \"A\" for 90 or more, \"B\" for 80+, \"C\" for 70+, otherwise \"Keep going\". Then log a boolean showing whether the student passed with 60 or more.",
      starter: `const score = 85;

// Add your if / else if / else chain here

// Then log whether score >= 60 as a boolean
`,
      solution: `const score = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("Keep going");
}

console.log(score >= 60); // true`,
    },
    challenge: {
      task:
        "Write a login check that prints \"Welcome\" only when the username has at least 1 character AND the password is 8 characters or longer. Otherwise print \"Check your details\".",
      hint: "Strings have a .length property, and an empty string has a length of 0. Combine the two checks with &&.",
      solution: `const username = "asha";
const password = "hunter22";

if (username.length > 0 && password.length >= 8) {
  console.log("Welcome");
} else {
  console.log("Check your details");
}`,
    },
    commonMistakes: [
      {
        mistake: "Writing if (age = 18), which assigns instead of compares.",
        fix: "Use a comparison operator inside if: `age === 18` or `age >= 18`.",
      },
      {
        mistake: "Mixing up && and || so the condition means the opposite of what you intended.",
        fix: 'Read it as words: say "and" or "or" out loud while writing the condition.',
      },
      {
        mistake: "Assuming every value is either true or false, so if (count) surprises you when count is 0.",
        fix: "Compare explicitly when 0 matters — use `count > 0` rather than the bare variable.",
      },
    ],
    quiz: [
      {
        question: "Which of these values is falsy?",
        options: ['"0"', "0", '["0"]', '"false"'],
        correctIndex: 1,
        explanation:
          "The number 0 is falsy. The strings \"0\" and \"false\", and any array, are truthy.",
      },
      {
        question: "What does console.log(5 > 3 && 2 < 1) print?",
        options: ["true", "false", "undefined", "An error"],
        correctIndex: 1,
        explanation:
          "&& needs both sides to be true. 2 < 1 is false, so the whole condition is false.",
      },
      {
        question: "What does console.log(!\"\") print?",
        options: ["true", "false", '""', "An error"],
        correctIndex: 0,
        explanation:
          'An empty string is falsy, and ! flips it to true. That is exactly how you check "did the user type something?".',
      },
    ],
  },
  {
    slug: "js-loops",
    title: "Loops: repeating work",
    summary: "for and while loops, break and continue, and walking through an array.",
    order: 4,
    minutes: 15,
    xp: 40,
    concept:
      "A loop runs the same block of code repeatedly while a condition holds, so you can process many items without copying and pasting.",
    explanation: [
      "Nobody wants to write console.log ten times by hand. A for loop has three parts: a starting value, a condition that keeps it going, and a step that runs after each pass. The classic for (let i = 0; i < 3; i++) runs the body three times with i set to 0, 1, then 2.",
      "When you do not know how many iterations you need, a while loop checks its condition before every pass. It is the right tool for 'keep asking until the user gives a valid answer' style problems.",
      "Two keywords steer a loop from the inside: break exits immediately, and continue skips the rest of the current pass and jumps to the next one.",
      "The most common real-world loop walks through an array: for (const item of items) gives you each element in order, no indexes to get wrong.",
    ],
    analogy:
      "A loop is a washing machine cycle: it repeats the same steps while there is more laundry, and break is the stop button you press when the load is done.",
    example: {
      lang: "javascript",
      code: `for (let i = 1; i <= 3; i++) {
  console.log("Lap " + i);
}

const snacks = ["chips", "popcorn", "nuts"];
for (const snack of snacks) {
  console.log(snack);
}

let n = 3;
while (n > 0) {
  console.log(n + "...");
  n--;
}`,
      caption: "Counted, while, and over-an-array — three loop shapes for three jobs.",
    },
    sections: [
      {
        heading: "The three parts of a for loop",
        body: [
          "`let i = 0` runs once at the start; `i < length` is checked before each pass; `i++` runs after each pass.",
          "Adjust the start, condition or step to change the range: `i = 1` starts at one, `i += 2` steps by twos.",
        ],
        code: {
          lang: "javascript",
          code: `for (let i = 1; i <= 7; i += 2) {
  console.log(i); // 1, 3, 5, 7
}`,
        },
      },
      {
        heading: "break and continue",
        body: [
          "`continue` skips the rest of this pass — useful for ignoring items that do not meet a rule.",
          "`break` stops the whole loop — useful for 'find the first match and stop'.",
        ],
        code: {
          lang: "javascript",
          code: `for (const n of [1, 9, 4, 7]) {
  if (n % 2 === 0) continue; // skip evens
  if (n > 8) break;          // stop at the first big number
  console.log(n);            // 1
}`,
        },
      },
    ],
    tryIt: {
      instructions:
        "Loop over the numbers array and push every even number into the evens array, then log evens. You should see [2, 4, 6, 8, 10].",
      starter: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = [];

// Write a loop that checks each number and pushes it when n % 2 === 0

console.log(evens);
`,
      solution: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = [];

for (const n of numbers) {
  if (n % 2 === 0) {
    evens.push(n);
  }
}

console.log(evens); // [2, 4, 6, 8, 10]`,
    },
    challenge: {
      task:
        "Print a 3-row grid where each row is '# # # ' — one row per console.log. Use a nested loop so the columns are built by code, not typed by hand.",
      hint:
        "Build each row as an empty string, add '# ' once per column inside the inner loop, then log the row after the inner loop finishes.",
      solution: `for (let row = 0; row < 3; row++) {
  let line = "";
  for (let col = 0; col < 3; col++) {
    line += "# ";
  }
  console.log(line);
}`,
    },
    commonMistakes: [
      {
        mistake: "Writing a while loop whose condition never changes, so it runs forever.",
        fix: "Make sure a variable inside the loop moves toward the exit condition, or use break as a safety stop.",
      },
      {
        mistake: "Looping with i <= array.length and getting undefined for the last item.",
        fix: "Indexes run from 0 to length - 1, so the condition should be i < array.length.",
      },
      {
        mistake: "Stepping by the wrong amount, like i += 2, and silently skipping items.",
        fix: "Check your start, condition and increment together — print i on the first pass to see what it actually does.",
      },
    ],
    quiz: [
      {
        question:
          "What does this print: for (let i = 0; i < 3; i++) { console.log(i); }",
        options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"],
        correctIndex: 1,
        explanation:
          "Counting starts at 0 and stops before 3, so you get 0, 1, 2 — three passes.",
      },
      {
        question:
          "Which loop suits a situation where you do not know in advance how many times you must repeat?",
        options: [
          "A for loop with a fixed count",
          "A while loop that checks a condition",
          "A loop with no condition",
          "None — JavaScript cannot repeat",
        ],
        correctIndex: 1,
        explanation:
          "while keeps checking a condition, so it can run an unknown number of times until something changes.",
      },
      {
        question: "What does continue do inside a loop?",
        options: [
          "Ends the loop immediately",
          "Skips the rest of the current pass and goes to the next",
          "Restarts the whole program",
          "Repeats the current pass",
        ],
        correctIndex: 1,
        explanation:
          "continue moves to the next pass; break exits the loop completely.",
      },
    ],
  },
  {
    slug: "js-functions",
    title: "Functions",
    summary: "Wrapping logic into named blocks you can run again and again.",
    order: 5,
    minutes: 14,
    xp: 40,
    concept:
      "A function is a named, reusable block of code that can take inputs, do some work, and hand back a result.",
    explanation: [
      "Once a piece of logic works, you never want to retype it. A function packs it up under a name: you define it once, then call it as many times as you like with functionName(argument).",
      "Parameters are the placeholders in the definition, and arguments are the real values you pass in when you call. Inside the function, the parameters behave like normal variables that only exist while the function runs.",
      "return hands a value back to whoever called the function. Without return, a function gives back undefined — a classic source of bugs for beginners who printed a result but never returned it.",
      "Functions are how programs stay readable. Instead of ten lines of scoring logic spread around your file, you get one clear call like addPoints(10).",
    ],
    analogy:
      "A function is a kitchen appliance with a slot: you push in ingredients (arguments), it does the work, and something comes out the other end (the return value). You do not rebuild the blender every time you make a smoothie.",
    example: {
      lang: "javascript",
      code: `function greet(name) {
  return "Hello, " + name + "!";
}

function add(a, b) {
  return a + b;
}

console.log(greet("Asha")); // "Hello, Asha!"
console.log(add(4, 6));     // 10

const total = add(10, 20);
console.log("Total is " + total); // "Total is 30"`,
      caption: "Define once, call many times — and capture the returned value when you need it.",
    },
    sections: [
      {
        heading: "Printing vs returning",
        body: [
          "console.log shows something to a person; return hands a value back to the code.",
          "A function should usually return its result and let the caller decide whether to print it. That makes the function reusable anywhere.",
        ],
        code: {
          lang: "javascript",
          code: `function doublePrint(n) {
  console.log(n * 2); // shows output, returns nothing
}

function doubleReturn(n) {
  return n * 2;       // no output, but gives a value back
}

const result = doubleReturn(5); // 10 — you can store it
console.log(result);            // 10`,
        },
      },
      {
        heading: "Parameters vs arguments",
        body: [
          "The definition lists parameters (`function add(a, b)`); the call supplies arguments (`add(4, 6)`).",
          "Order matters — the first argument lands in the first parameter. Missing arguments become undefined.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Write a function called celsiusToFahrenheit that converts Celsius to Fahrenheit with (c * 9) / 5 + 32 and returns the answer. Log the results for 0, 30 and 100.",
      starter: `function celsiusToFahrenheit(c) {
  // Calculate and return the Fahrenheit value
}

console.log(celsiusToFahrenheit(0));
console.log(celsiusToFahrenheit(30));
console.log(celsiusToFahrenheit(100));
`,
      solution: `function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

console.log(celsiusToFahrenheit(0));   // 32
console.log(celsiusToFahrenheit(30));  // 86
console.log(celsiusToFahrenheit(100)); // 212`,
    },
    challenge: {
      task:
        "Write a function maxOf(a, b) that returns the larger number, then prove it works by nesting a call: maxOf(maxOf(3, 7), 5).",
      hint: "Use an if: return a when a > b, otherwise return b. Nested calls work because a call is just a value.",
      solution: `function maxOf(a, b) {
  if (a > b) {
    return a;
  }
  return b;
}

console.log(maxOf(3, 7));             // 7
console.log(maxOf(maxOf(3, 7), 5));   // 7
console.log(maxOf(2, 2));             // 2`,
    },
    commonMistakes: [
      {
        mistake: "Forgetting return, so the function hands back undefined.",
        fix: "If you need the result anywhere else, return it — console.log inside the function is not a return.",
      },
      {
        mistake: "Referencing the function without calling it, like const x = greet instead of greet(\"Asha\").",
        fix: "Add parentheses and pass the arguments: greet(\"Asha\"). Without them you are just copying the function itself.",
      },
      {
        mistake: "Calling with the wrong number or order of arguments and getting undefined inside.",
        fix: "Match the definition: first argument to first parameter. Log the parameters at the top of the function to check.",
      },
    ],
    quiz: [
      {
        question: "What does a function return if it has no return statement?",
        options: ["null", "undefined", "0", "An error"],
        correctIndex: 1,
        explanation:
          "No return means the value is undefined — easy to spot with typeof result.",
      },
      {
        question:
          "What is logged: function double(n) { return n * 2; } then console.log(double(5));",
        options: ["5", "10", "double(5)", "undefined"],
        correctIndex: 1,
        explanation: "The function returns 10, and console.log displays that returned value.",
      },
      {
        question: "Which line actually calls a function named play?",
        options: ["function play() {}", "play();", "const play = 5", "play ="],
        correctIndex: 1,
        explanation:
          "Calling a function means writing its name followed by parentheses, like play();.",
      },
    ],
  },
  {
    slug: "js-arrays",
    title: "Arrays: lists of values",
    summary: "Creating lists, reading by index, adding and removing items, and looping over them.",
    order: 6,
    minutes: 14,
    xp: 40,
    concept:
      "An array stores an ordered list of values in one variable, which you read by position (index) and grow or shrink with methods like push and pop.",
    explanation: [
      "Instead of score1, score2, score3, JavaScript gives you one variable holding them all: const scores = [7, 12, 9]. Square brackets create the array, and commas separate the items.",
      "Each item has an index that starts at 0, so scores[0] is the first item and the last one sits at scores.length - 1. Asking for an index that does not exist does not crash — it quietly returns undefined, which trips up a lot of beginners.",
      "Arrays come with useful methods. push adds to the end, pop removes from the end and hands the value back, shift removes from the front, and length tells you how many items are in the list.",
      "To work with every item, loop with for (const item of items). That is how you calculate totals, print reports, or check each value against a rule.",
    ],
    analogy:
      "An array is a numbered shelf. The shelf number is the index starting at 0, push slides a new book onto the end, and pop takes the last book off and shows it to you.",
    example: {
      lang: "javascript",
      code: `const colors = ["red", "green", "blue"];

console.log(colors[0]);     // "red"
console.log(colors.length); // 3

colors.push("yellow");
console.log(colors.length); // 4

const last = colors.pop();
console.log(last);          // "yellow"

for (const color of colors) {
  console.log(color);
}`,
      caption: "Read by index, grow with push, shrink with pop, then walk the whole list.",
    },
    sections: [
      {
        heading: "Indexes start at 0",
        body: [
          "Position 0 is the first item, so a list of 4 items has indexes 0 through 3.",
          "Reading one past the end gives undefined — no error message — which is why looping with i < arr.length matters.",
        ],
        code: {
          lang: "javascript",
          code: `const fruits = ["apple", "banana", "mango"];

console.log(fruits[0]);            // "apple"
console.log(fruits[2]);            // "mango"
console.log(fruits[3]);            // undefined
console.log(fruits[fruits.length - 1]); // "mango"`,
        },
      },
      {
        heading: "push and pop change the array in place",
        body: [
          "Both edit the original array and also give a value back: push returns the new length, pop returns the item you removed.",
          "Do not save the result of push() expecting to get the array — save the array variable itself.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Start with two tasks, add two more with push, remove the last one with pop, then log how many tasks are left and print each on its own line.",
      starter: `const tasks = ["Learn variables", "Practice loops"];

// Push two more tasks, pop the last one, then loop and log each task
console.log("You have " + tasks.length + " tasks:");
`,
      solution: `const tasks = ["Learn variables", "Practice loops"];

tasks.push("Build a mini project");
tasks.push("Review the quiz");
tasks.pop();

console.log("You have " + tasks.length + " tasks:");
for (const task of tasks) {
  console.log("- " + task);
}`,
    },
    challenge: {
      task:
        "Given const scores = [7, 12, 9, 20], calculate and log the total and the average using a loop (not by adding them by hand).",
      hint:
        "Keep a running total with let total = 0 and total += score inside the loop. The average is total / scores.length.",
      solution: `const scores = [7, 12, 9, 20];
let total = 0;

for (const score of scores) {
  total += score;
}

console.log("Total: " + total);                   // Total: 48
console.log("Average: " + total / scores.length); // Average: 12`,
    },
    commonMistakes: [
      {
        mistake: "Asking for arr[arr.length] and getting undefined.",
        fix: "The last index is length - 1. Anything at length or beyond does not exist.",
      },
      {
        mistake: "Assuming the first item is at index 1.",
        fix: "Counting starts at 0 — arr[1] is the second item, not the first.",
      },
      {
        mistake: "Storing the result of push() as if it were the array.",
        fix: "push returns the new length. The array itself already changed, so keep using the array variable.",
      },
    ],
    quiz: [
      {
        question: 'What does this print: const a = ["x", "y"]; console.log(a[1]);',
        options: ['"x"', '"y"', "1", "undefined"],
        correctIndex: 1,
        explanation: "Index 0 is \"x\", index 1 is the second item, \"y\".",
      },
      {
        question: "Which method adds an item to the end of an array?",
        options: ["pop()", "shift()", "push()", "length()"],
        correctIndex: 2,
        explanation:
          "push adds to the end, pop removes from the end, shift removes from the front.",
      },
      {
        question: "What does pop() return?",
        options: [
          "The new array length",
          "The item that was removed",
          "undefined",
          "The whole array",
        ],
        correctIndex: 1,
        explanation:
          "pop removes the last element and hands that value back, so you can use it or log it.",
      },
    ],
  },
  {
    slug: "js-objects",
    title: "Objects: key and value pairs",
    summary: "Grouping related data, reading values two ways, nesting, and listing keys.",
    order: 7,
    minutes: 15,
    xp: 40,
    concept:
      "An object stores related data as labelled key/value pairs, so one variable can describe a whole thing — a user, a product, a settings panel.",
    explanation: [
      "Arrays are great for a list of the same kind of thing, but a person has a name, an age and a city. An object keeps those together: curly braces hold properties, written as key: value, separated by commas.",
      "You read a value with dot notation (student.name) or bracket notation (student[\"name\"]). Dot is shorter and reads better; brackets are required when the key is in a variable or contains spaces.",
      "Objects can nest — an address inside a user — so user.address.city walks down the structure one level at a time. Missing keys do not throw; they return undefined, which is why checking matters.",
      "Object.keys(object) returns an array of the key names, handy when you want to loop over everything or see what shape your data has.",
    ],
    analogy:
      "An object is a form at the doctor's office: each field has a label and a value. Name: Ravi. Age: 21. The label is the key, what is written next to it is the value, and the whole form describes one person.",
    example: {
      lang: "javascript",
      code: `const student = {
  name: "Ravi",
  age: 21,
  grades: [88, 92, 79],
  city: "Pune",
};

console.log(student.name);       // "Ravi"
console.log(student["age"]);     // 21

student.city = "Mumbai";
student.age = 22;

console.log(student.grades[1]);  // 92
console.log(Object.keys(student)); // ["name", "age", "grades", "city"]`,
      caption: "Grouped data, two ways to read it, and Object.keys to see the labels.",
    },
    sections: [
      {
        heading: "Dot vs bracket access",
        body: [
          "Use dot when you know the key: `student.name`.",
          "Use brackets when the key comes from a variable, or has spaces or special characters: `student[\"full name\"]` or `student[fieldName]`.",
        ],
        code: {
          lang: "javascript",
          code: `const profile = { name: "Asha", " favourite colour": "teal" };

console.log(profile.name);
console.log(profile["name"]);

const key = "name";
console.log(profile[key]);              // "Asha"
console.log(profile[" favourite colour"]); // "teal"`,
        },
      },
      {
        heading: "Nesting",
        body: [
          "An object's value can be another object or an array, so you chain access: `user.address.city`, `student.grades[0]`.",
          "If one link is missing you get undefined — log the level you are unsure about before chaining further.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Create a book object with title, author, pages and read (false). Log a one-line description, log whether it is finished, set read to true, log again, then print Object.keys(book).",
      starter: `const book = {
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt",
  pages: 352,
  read: false,
};

// 1. Log a sentence with title, author and pages
// 2. Log "Finished? " plus book.read
// 3. Set book.read to true and log again
// 4. Log Object.keys(book)
`,
      solution: `const book = {
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt",
  pages: 352,
  read: false,
};

console.log(book.title + " by " + book.author + " — " + book.pages + " pages");
console.log("Finished? " + book.read); // Finished? false

book.read = true;
console.log("Finished? " + book.read); // Finished? true
console.log(Object.keys(book));        // ["title", "author", "pages", "read"]`,
    },
    challenge: {
      task:
        "Build a user object with a name and a nested address (city and pincode). Log \"Ravi lives in Pune\" using the object, then log the keys of the address.",
      hint:
        "address is itself an object, so reach inside with user.address.city. Object.keys(user.address) gives you its labels.",
      solution: `const user = {
  name: "Ravi",
  address: { city: "Pune", pincode: "411001" },
};

console.log(user.name + " lives in " + user.address.city);
console.log(Object.keys(user.address)); // ["city", "pincode"]`,
    },
    commonMistakes: [
      {
        mistake: "Using a comma or a missing comma in the wrong place, which breaks the whole file with a SyntaxError.",
        fix: "Every pair is key: value, and pairs are separated by commas — after the last pair, no comma is required.",
      },
      {
        mistake: "Accessing a key that does not exist and getting undefined later in your code.",
        fix: "Log the object first, use Object.keys to see the real key names, and check values before using them.",
      },
      {
        mistake: "Writing obj.variable when the key is inside a variable, like obj[key], but typed as obj.key.",
        fix: "Brackets evaluate what is inside them: obj[key] looks up the value of key and uses it as the label.",
      },
    ],
    quiz: [
      {
        question: 'Which is the bracket version of profile.city?',
        options: ["profile(city)", 'profile["city"]', "profile->city", "[profile].city"],
        correctIndex: 1,
        explanation:
          'Dot and bracket reach the same value — brackets just take the key name as a string or a variable.',
      },
      {
        question: "What does Object.keys(user) return?",
        options: [
          "An array of the values",
          "An array of the key names",
          "The number of keys",
          "A formatted string",
        ],
        correctIndex: 1,
        explanation:
          "Object.keys gives you the labels — for example [\"name\", \"age\"] — which you can loop over.",
      },
      {
        question: "What happens with console.log(user.nickname) when the key is missing?",
        options: ["An error is thrown", "It prints null", "It prints undefined", 'It prints ""'],
        correctIndex: 2,
        explanation:
          "Missing keys return undefined instead of crashing — always check when a value could be missing.",
      },
    ],
  },
  {
    slug: "js-array-string-methods",
    title: "Array and string methods",
    summary: "map, filter, find and reduce, plus join, split, includes — and how to chain them.",
    order: 8,
    minutes: 16,
    xp: 40,
    concept:
      "Array methods let you transform, select and summarise data with small functions, and chaining them lets you express whole data pipelines in a few readable lines.",
    explanation: [
      "Loops do the job, but methods describe the intent. map builds a new array by changing every item, filter keeps only the items that pass a test, find returns the first match, and reduce boils the whole array down to a single value like a total.",
      "Each of these takes a small function — a callback — that decides what happens per item. In (n) => n * 2 the arrow function receives each number and returns its double; you will unpack arrow functions properly in the next lesson.",
      "Strings have handy methods too: join glues an array into one string, split cuts a string into an array, includes answers yes/no about a substring, and toUpperCase shouts.",
      "Because map and filter return new arrays, you can chain them: scores.filter(...).map(...). Read them left to right as steps in a recipe. Remember that methods like push return something else entirely — the length — so chaining after push will not do what you expect.",
    ],
    analogy:
      "A chain of methods is like an assembly line: raw items go in one end, each station (map, filter, reduce) does one clear job, and the finished result comes out the other side.",
    example: {
      lang: "javascript",
      code: `const scores = [4, 8, 15, 16, 23, 42];

const doubled = scores.map((n) => n * 2);
console.log(doubled); // [8, 16, 30, 32, 46, 84]

const big = scores.filter((n) => n >= 15);
console.log(big); // [15, 16, 23, 42]

const firstBig = scores.find((n) => n >= 15);
console.log(firstBig); // 15

const total = scores.reduce((sum, n) => sum + n, 0);
console.log(total); // 108

const words = ["make", "it", "work"];
console.log(words.join(" "));         // "make it work"
console.log("make it work".split(" ")); // ["make", "it", "work"]
console.log(words.includes("it"));    // true

console.log(scores.filter((n) => n > 10).map((n) => n * 10));
// [150, 160, 230, 420]`,
      caption: "Transform, select, summarise — then chain the steps into one expression.",
    },
    sections: [
      {
        heading: "map vs filter",
        body: [
          "`map` keeps the same number of items and changes each one — same length, new values.",
          "`filter` keeps some items and drops others — same values, usually fewer items.",
          "Both return a brand new array and leave the original untouched, so store the result.",
        ],
        code: {
          lang: "javascript",
          code: `const prices = [10, 25, 5];

const withTax = prices.map((p) => p * 1.2);
console.log(prices);   // [10, 25, 5]  — unchanged
console.log(withTax);  // [12, 30, 6]

const affordable = prices.filter((p) => p <= 25);
console.log(affordable); // [10, 25, 5]`,
        },
      },
      {
        heading: "reduce in one line of thought",
        body: [
          "`reduce(callback, start)` carries an accumulator through the array: start with `0`, add each number, finish with the total.",
          "The same shape works for counting, joining text, or finding a maximum — the accumulator is just whatever summary you are building.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "From the names array, use filter to keep only names with 4 or more letters, then map to turn each one into a shout (uppercase plus !). Log the final array.",
      starter: `const names = ["ada", "grace", "linus", "lin"];

const longNames = names.filter(function (name) {
  return name.length >= 4;
});

// Map longNames into shouting strings and log the result
console.log(longNames);
`,
      solution: `const names = ["ada", "grace", "linus", "lin"];

const longNames = names.filter(function (name) {
  return name.length >= 4;
});

const shouts = longNames.map(function (name) {
  return name.toUpperCase() + "!";
});

console.log(shouts); // ["GRACE!", "LINUS!"]`,
    },
    challenge: {
      task:
        "Using reduce, find the highest score in const scores = [72, 45, 91, 68, 84] and log it. Do not use Math.max.",
      hint:
        "Start the accumulator with scores[0], then in each pass return whichever value is bigger: n > top ? n : top.",
      solution: `const scores = [72, 45, 91, 68, 84];

const highest = scores.reduce(function (top, n) {
  return n > top ? n : top;
}, scores[0]);

console.log(highest); // 91`,
    },
    commonMistakes: [
      {
        mistake: "Forgetting return inside a map/filter callback, so you get an array of undefined.",
        fix: "Use a single expression without braces, like (n) => n * 2, or add an explicit return inside braces.",
      },
      {
        mistake: "Expecting map or filter to change the original array.",
        fix: "They return new arrays. Assign the result: const doubled = scores.map(...).",
      },
      {
        mistake: "Chaining .map() onto push(), which returns a number, not an array.",
        fix: "Chain methods that return arrays — map, filter, slice. Keep push for editing the list itself.",
      },
    ],
    quiz: [
      {
        question: "What does filter return?",
        options: [
          "The original array, changed",
          "A new array containing only the items that passed the test",
          "A single matching value",
          "The number of matches",
        ],
        correctIndex: 1,
        explanation:
          "filter selects. For a single value use find; for one transformed array use map.",
      },
      {
        question: 'What does ["a", "b"].join("-") return?',
        options: ['"a-b"', '"a,b"', '["a", "b"]', '"a b"'],
        correctIndex: 0,
        explanation: "join puts the separator between the items: \"a-b\".",
      },
      {
        question: "When is reduce the clearest choice?",
        options: [
          "When you want to change every item",
          "When you want to combine all items into one value",
          "When you want the first match",
          "When you want to sort the array",
        ],
        correctIndex: 1,
        explanation:
          "reduce builds a single summary — a total, a count, a joined string — by carrying an accumulator through the array.",
      },
    ],
  },
  {
    slug: "js-scope-and-arrow-functions",
    title: "Scope and arrow functions",
    summary: "Where variables live, functions as values, and the concise => syntax.",
    order: 9,
    minutes: 15,
    xp: 40,
    concept:
      "Scope decides where a variable can be seen, and functions are values you can store, pass around and define on the spot with arrow syntax.",
    explanation: [
      "Scope is the rulebook for where a variable exists. A const or let declared inside a pair of curly braces — a block — is only visible inside it. Step outside and you get a ReferenceError, which is a feature: names stay small and collisions stay rare.",
      "Functions create their own scope too. Parameters and variables inside a function cannot leak out, so you can reuse names like i or total everywhere without breaking anything.",
      "Because functions are values, you can store them in variables and pass them to other functions. The function you pass is called a callback — that is exactly what map, filter and setTimeout expect.",
      "Arrow functions are the short way to write one: (a, b) => a + b. With a single expression after the => the value is returned automatically, which is why they feel so tidy inside map and filter.",
    ],
    analogy:
      "Scope is like the walls of a room: things on the desk inside are visible to anyone in that room, but walk into the hallway and they are gone. Each function is its own room with its own desk.",
    example: {
      lang: "javascript",
      code: `const message = "Global stuff";

function outer() {
  const inner = "Only here";
  console.log(inner);    // "Only here"
  console.log(message);  // "Global stuff"
}

outer();
// console.log(inner); // ReferenceError: inner is not defined

const double = (n) => n * 2;
const add = (a, b) => a + b;

console.log(double(5)); // 10
console.log(add(2, 3)); // 5

const numbers = [1, 2, 3];
console.log(numbers.map((n) => n * 10)); // [10, 20, 30]`,
      caption: "Block scope keeps names local, and arrow functions make callbacks compact.",
    },
    sections: [
      {
        heading: "Block scope in practice",
        body: [
          "let and const are block-scoped: what happens inside `{ }` stays inside `{ }`.",
          "The old keyword var is function-scoped and ignores blocks, which causes confusing bugs — stick with let and const.",
        ],
        code: {
          lang: "javascript",
          code: `if (true) {
  const scoped = "inside";
  let counter = 1;
}

// console.log(scoped);  // ReferenceError
// console.log(counter); // ReferenceError
console.log("The block ended and nothing leaked");`,
        },
      },
      {
        heading: "Functions as values (callbacks)",
        body: [
          "Because you can pass a function as an argument, higher-order methods like map and filter can do the work while you supply the rule.",
          "Name that rule clearly — a const with an arrow function reads like a sentence: `const isAdult = (person) => person.age >= 18;`",
        ],
        code: {
          lang: "javascript",
          code: `const people = [
  { name: "Asha", age: 22 },
  { name: "Kabir", age: 16 },
];

const isAdult = (person) => person.age >= 18;
console.log(people.filter(isAdult).map((p) => p.name)); // ["Asha"]`,
        },
      },
    ],
    tryIt: {
      instructions:
        "Rewrite the square function as an arrow function stored in a const, then pass it to numbers.map. Log the array of squares.",
      starter: `const numbers = [1, 2, 3, 4, 5];

const square = function (n) {
  return n * n;
};

// Rewrite square using arrow syntax, then log numbers.map(square)
console.log(numbers.map(square));
`,
      solution: `const numbers = [1, 2, 3, 4, 5];

const square = (n) => n * n;

console.log(numbers.map(square)); // [1, 4, 9, 16, 25]`,
    },
    challenge: {
      task:
        "Create makeGreeter(greeting) that returns a new function which greets a name. Store two greeters and call each one.",
      hint:
        "The inner function can still see greeting even after makeGreeter finishes — that is scope at work. Return the inner function itself (no parentheses).",
      solution: `function makeGreeter(greeting) {
  return function (name) {
    return greeting + ", " + name + "!";
  };
}

const hi = makeGreeter("Hi");
const bye = makeGreeter("Bye");

console.log(hi("Asha"));  // "Hi, Asha!"
console.log(bye("Ravi")); // "Bye, Ravi!"`,
    },
    commonMistakes: [
      {
        mistake: "Logging a let or const outside the block where it was declared and hitting a ReferenceError.",
        fix: "Declare it in the outer scope if you need it later, or keep the work inside the block.",
      },
      {
        mistake: "Writing const double = (n) => { n * 2 } and getting undefined back.",
        fix: "Curly braces need an explicit return. Use (n) => n * 2, or add return n * 2 inside the braces.",
      },
      {
        mistake: "Calling a const arrow function before the line that declares it.",
        fix: "Arrow functions stored in const are not hoisted — define them first, then call them below.",
      },
    ],
    quiz: [
      {
        question:
          "A const declared inside an if block — can you read it after the block ends?",
        options: [
          "Yes, always",
          "No, const and let are block-scoped",
          "Yes, if you use var instead",
          "Yes, inside any function",
        ],
        correctIndex: 1,
        explanation:
          "Curly braces create a block, and let/const only live inside it. Outside, the name no longer exists.",
      },
      {
        question: "Which arrow function correctly returns the square of n?",
        options: [
          "(n) => { n * n }",
          "n => n * n",
          "(n) => return n * n",
          "function (n) => n * n",
        ],
        correctIndex: 1,
        explanation:
          "A single expression after => is returned automatically. Braces need an explicit return, and the other two are not valid syntax.",
      },
      {
        question: "What is a callback?",
        options: [
          "A function that calls itself forever",
          "A function passed to another function to run later",
          "A function with no parameters",
          "A function that returns nothing",
        ],
        correctIndex: 1,
        explanation:
          "Callbacks let one function handle the flow while another supplies the rule — exactly how map and filter work.",
      },
    ],
  },
  {
    slug: "js-errors-and-safe-code",
    title: "Errors and safe code",
    summary: "Reading error messages, guarding values with checks, and debugging with console.log.",
    order: 10,
    minutes: 16,
    xp: 40,
    concept:
      "Error messages are clues, not accusations — reading the error name and message tells you exactly what went wrong and where.",
    explanation: [
      "When JavaScript stops, it throws an error with two useful parts: the name, which tells you the kind of problem, and the message, which describes it. ReferenceError means a name does not exist — usually a typo. TypeError means you used a value in a way its type does not allow, like reading .length of undefined. SyntaxError means the code itself is malformed, often a missing brace or quote.",
      "A good debugging habit is simple: read the message, find the line number, then log the values involved right before that line. Printing the variable's value and typeof usually reveals the problem in one step.",
      "You can also plan for problems. try { } catch (error) { } runs risky code and, if it throws, jumps to catch instead of crashing your program. The finally block runs either way.",
      "Defensive checks are the quiet version of the same idea: test a value before you use it, or throw a friendly error from your own functions so failures arrive with a message you wrote yourself.",
    ],
    analogy:
      "An error message is a check-engine light. It does not mean the car is ruined — it tells you which system to look at. Ignoring it and swapping random parts is what makes a small problem expensive.",
    example: {
      lang: "javascript",
      code: `function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // 5
  console.log(divide(5, 0));  // throws, caught below
} catch (error) {
  console.log("Something went wrong: " + error.message);
} finally {
  console.log("Done either way");
}`,
      caption: "Guard first, throw a clear message, and catch it where you can handle it.",
    },
    sections: [
      {
        heading: "Reading an error message",
        body: [
          "Three things matter: the error name, the message, and the line number. Read them in that order.",
          "Common pairs: `ReferenceError: x is not defined` (name does not exist), `TypeError: Cannot read properties of undefined` (you chained off a missing value), `SyntaxError: Unexpected token` (the code is not valid JavaScript yet).",
        ],
        code: {
          lang: "javascript",
          code: `const user = { name: "Asha" };

// console.log(user.email.length);
// TypeError: Cannot read properties of undefined (reading 'length')

console.log(typeof user.email); // "undefined" — there is the clue
console.log(user.email === undefined); // true`,
        },
      },
      {
        heading: "Debugging with console.log",
        body: [
          "Log before the failing line, not after — the code never reaches the line after a throw.",
          "Log the value and its type together: console.log(value, typeof value). Narrow the area by commenting out code until the error disappears, then uncomment until it returns.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "The function below crashes because the user has no email. Add a check so it prints a friendly message instead of throwing.",
      starter: `const user = { name: "Asha" };

function showEmail(person) {
  console.log(person.email.length);
}

showEmail(user);
`,
      solution: `const user = { name: "Asha" };

function showEmail(person) {
  if (person.email === undefined) {
    console.log(person.name + " has no email on file");
    return;
  }
  console.log(person.email.length);
}

showEmail(user); // "Asha has no email on file"`,
    },
    challenge: {
      task:
        "Write readAge(text) that converts text with Number() and throws a friendly Error when the result is NaN. Call it inside try/catch with \"27\" and then \"twenty\".",
      hint:
        "Number(\"twenty\") gives NaN, not an error. Check it yourself with Number.isNaN(age) and throw new Error(...) — the catch block will print error.message.",
      solution: `function readAge(text) {
  const age = Number(text);
  if (Number.isNaN(age)) {
    throw new Error("'" + text + "' is not a number");
  }
  return age;
}

try {
  console.log(readAge("27"));    // 27
  console.log(readAge("twenty")); // throws, caught below
} catch (error) {
  console.log("Oops: " + error.message);
}`,
    },
    commonMistakes: [
      {
        mistake: "Seeing 'Cannot read properties of undefined' and blaming the language instead of the value.",
        fix: "Log the value right before the crash — it is undefined. Then check where the key is missing or misspelled.",
      },
      {
        mistake: "Wrapping everything in try/catch with an empty catch, so real bugs vanish silently.",
        fix: "Catch only where failure is expected, and always log the error: catch (error) { console.log(error.message); }.",
      },
      {
        mistake: "Debugging by rewriting big chunks of code, which hides the actual bug.",
        fix: "Add console.log(value, typeof value) step by step, or comment code out until the error disappears — then you know where it lives.",
      },
    ],
    quiz: [
      {
        question:
          "You log a variable that was never declared. Which error do you get?",
        options: ["TypeError", "ReferenceError", "SyntaxError", "It prints undefined"],
        correctIndex: 1,
        explanation:
          "ReferenceError means the name does not exist — usually a typo or a scope problem.",
      },
      {
        question: "What happens with console.log(undefinedThing.length)?",
        options: [
          "It prints undefined",
          "A TypeError is thrown",
          "It creates an empty property",
          "It prints 0",
        ],
        correctIndex: 1,
        explanation:
          "You cannot read a property of undefined, so JavaScript throws a TypeError. Check the value before chaining.",
      },
      {
        question: "What does a try/catch block do?",
        options: [
          "Prevents all errors in your program forever",
          "Runs code, and if it throws, runs the catch block instead of crashing",
          "Fixes bugs automatically",
          "Only handles syntax errors",
        ],
        correctIndex: 1,
        explanation:
          "try runs the risky code; catch gives you a safe place to respond when something throws.",
      },
    ],
  },
];
