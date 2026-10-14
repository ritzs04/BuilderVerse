import type { Lesson } from "../types";

export const pythonLessons: Lesson[] = [
  {
    slug: "python-variables-print-input",
    title: "Variables, print() and input()",
    objectives: [
      "Create a Python variable and read it later",
      "Print messages and values with print()",
      "Ask the user for input with input()",
    ],
    summary:
      "Store information in variables and talk to the user with print() and input().",
    order: 1,
    minutes: 7,
    xp: 30,
    concept:
      "A variable is a labelled box where a Python program keeps a piece of information.",
    explanation: [
      "In Python you create a variable by naming it and using the = sign — no special keywords are needed.",
      "print() shows information on the screen, and input() pauses the program and asks the user to type something. Together they turn a silent script into a conversation.",
      "input() always returns a string. If you need a number you must convert it yourself with int() or float().",
    ],
    analogy:
      "Think of variables like labelled jars in a kitchen. name = 'Maya' is a jar with a name tag, and you can open it later and use what is inside.",
    example: {
      lang: "python",
      code: `name = input("What is your name? ")
print("Hello,", name)

age = 17
next_year = age + 1
print("Next year you will be", next_year)`,
      caption: "A Python program that asks, thinks and answers.",
    },
    sections: [
      {
        heading: "Variables",
        body: [
          "A variable can hold text, numbers or other values, and its name is written on the left side of =.",
          "Changing a variable means assigning a new value to the same name.",
        ],
        code: { lang: "python", code: `name = "Maya"\nemail = name.lower() + "@example.com"\nprint(email)` },
      },
      {
        heading: "Talking to the user",
        body: [
          "Use print() to show results. Use input() when the program needs information from the user.",
          "Combine the two to build small programs that feel interactive.",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Ask for the user's age, turn it into a number, and print the age they will be next year.",
      starter: `age_text = input("How old are you? ")
age = int(age_text)
# print the age next year`,
      solution: `age_text = input("How old are you? ")
age = int(age_text)
print("Next year you will be", age + 1)`,
    },
    challenge: {
      task:
        "Extend the program to ask for a favourite colour and print a sentence combining name, age and colour.",
      hint: "Store the colour in another variable, then print everything together with commas inside print().",
      solution: `name = input("What is your name? ")
colour = input("Favourite colour? ")
print("Hello", name, "- your favourite colour is", colour)`,
    },
    commonMistakes: [
      {
        mistake: "Treating input() as a number immediately.",
        fix: "input() returns text. Wrap it with int() or float() before doing maths.",
      },
      {
        mistake: "Using = and == as if they mean the same thing.",
        fix: "= stores a value; == compares two values.",
      },
      {
        mistake: "Writing variable names with spaces.",
        fix: "Use underscores, for example user_name instead of user name.",
      },
    ],
    quiz: [
      {
        question: "What does input('Age: ') return in Python 3?",
        options: [
          "A number the user typed",
          "A string (text) the user typed",
          "True if the input is valid",
          "Nothing — it prints directly",
        ],
        correctIndex: 1,
        explanation:
          "input() always returns a string. If you need a number, you must convert it yourself with int() or float().",
      },
    ],
  },
  {
    slug: "python-conditions-loops",
    title: "if / elif / else and for loops",
    objectives: [
      "Make decisions with if, elif and else",
      "Repeat work with a for loop",
      "Understand that Python uses indentation for blocks",
    ],
    summary:
      "Make decisions with conditions and repeat work with loops — using indentation to group blocks.",
    order: 2,
    minutes: 8,
    xp: 30,
    concept:
      "Conditions let a program choose a path; loops repeat work without copying code.",
    explanation: [
      "if checks a question; elif checks a second question only if the first was false; else catches everything remaining.",
      "A for loop runs a block many times. for i in range(3) runs a block three times without copying the code three times.",
      "The Python rule beginners must internalise: indentation IS the block. The spaces tell Python what belongs to the if or the loop.",
    ],
    analogy:
      "A condition is a signpost at a crossroads. A loop is a washing machine that repeats the same wash cycle until the cycle count is finished.",
    example: {
      lang: "python",
      code: `score = 68

if score >= 75:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "Keep going"

print("Grade:", grade)

for i in range(3):
    print("Attempt", i + 1)`,
      caption: "Choosing a direction and repeating an action.",
    },
    sections: [
      {
        heading: "Decisions",
        body: [
          "Compare values with ==, >, <, >= and <=.",
          "Only one branch runs — Python stops at the first true condition.",
        ],
      },
      {
        heading: "Loops",
        body: [
          "range(3) gives 0, 1, 2. Add 1 when you want friendly counting.",
          "Always indent the body of the loop so Python knows what repeats.",
        ],
        code: { lang: "python", code: `for number in range(1, 11):\n    print(number * number)` },
      },
    ],
    tryIt: {
      instructions:
        "Ask for a score and print Distinction, Pass or Retry based on it. Then print the square of 1 to 5.",
      starter: `score = int(input("Score: "))
# if / elif / else here
# for loop here`,
      solution: `score = int(input("Score: "))

if score >= 75:
    print("Distinction")
elif score >= 50:
    print("Pass")
else:
    print("Retry")

for number in range(1, 6):
    print(number * number)`,
    },
    challenge: {
      task:
        "Print every even number from 2 to 10, then try to build the same result with a while loop.",
      hint: "Step the loop by 2 with range(2, 11, 2).",
      solution: `for number in range(2, 11, 2):
    print(number)`,
    },
    commonMistakes: [
      {
        mistake: "Forgetting the colon after if or for.",
        fix: "Every compound statement in Python ends its first line with a colon.",
      },
      {
        mistake: "Mixing tabs and spaces in the same file.",
        fix: "Use spaces consistently — most editors convert tabs to four spaces.",
      },
      {
        mistake: "Using = in a comparison.",
        fix: "if score == 75 tests whether score equals 75.",
      },
    ],
    quiz: [
      {
        question: "In Python, what defines the body of an if statement?",
        options: [
          "Curly braces { }",
          "The keyword begin / end",
          "Indentation (leading spaces)",
          "Semicolons",
        ],
        correctIndex: 2,
        explanation:
          "Python uses indentation to group statements. Consistent spacing is not just style — it is syntax.",
      },
    ],
  },
  {
    slug: "python-functions-lists",
    title: "Functions and lists",
    objectives: [
      "Define and call a function with parameters",
      "Create and edit a list",
      "Loop over a list with a for statement",
    ],
    summary: "Write reusable functions and store lists of values.",
    order: 3,
    minutes: 8,
    xp: 30,
    concept:
      "A function is a named block of reusable code; a list is an ordered collection that can change size.",
    explanation: [
      "def marks the start of a function. Call it later with its name and the arguments it needs.",
      "A Python list stores values in order, starting at index 0.",
      "Use append() to add items and len() to count them. List comprehensions make loops compact.",
    ],
    analogy:
      "A function is a recipe card; a list is a shopping basket you can keep adding things to.",
    example: {
      lang: "python",
      code: `def average(numbers):
    return sum(numbers) / len(numbers)

marks = [70, 85, 92]
print("Average:", average(marks))
marks.append(88)
print("After adding:", marks)`,
      caption: "A reusable function and a growing list.",
    },
    sections: [
      {
        heading: "Functions",
        body: [
          "Return values with return so the caller can use them.",
          "Parameters let you reuse one function with many inputs.",
        ],
        code: { lang: "python", code: `def greet(name="Builder"):\n    print("Hello", name)` },
      },
      {
        heading: "Lists",
        body: [
          "Slicing creates smaller lists without changing the original.",
          "Loop with for mark in marks and keep each iteration simple.",
        ],
        code: { lang: "python", code: `print(marks[1:])  # [85, 92, 88]` },
      },
    ],
    tryIt: {
      instructions:
        "Write a function that prints whether each mark is pass or fail (>= 50).",
      starter: `def check(marks):\n    # loop and print each result\n    pass\n\nprint(check([40, 60, 90]))`,
      solution: `def check(marks):\n    for mark in marks:\n        print("Pass" if mark >= 50 else "Fail")\n\ncheck([40, 60, 90])`,
    },
    challenge: {
      task:
        "Create a list of five numbers, remove the first one with .pop(0), and print the remaining count and average.",
      hint: "Use len() for the count and sum() / len() for the average.",
      solution: `number_list = [4, 8, 12, 16, 20]\nnumber_list.pop(0)\nprint(len(number_list), sum(number_list) / len(number_list))`,
    },
    commonMistakes: [
      {
        mistake: "Treating lists and strings interchangeably.",
        fix: "A string cannot be edited in place; a list can.",
      },
      {
        mistake: "Confusing list index with position.",
        fix: "The third item is at index 2, not 3.",
      },
      {
        mistake: "Forgetting to call a function with ().",
        fix: "Use average(marks), not just average.",
      },
    ],
    quiz: [
      {
        question: "What is the index of the first element in a list?",
        options: ["0", "1", "-1", "It depends on the list size"],
        correctIndex: 0,
        explanation: "Python follows zero-based indexing — the first element is at index 0.",
      },
    ],
  },
];
