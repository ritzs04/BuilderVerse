import type { Lesson } from "../types";

export const cLessons: Lesson[] = [
  {
    slug: "c-printf-scanf-variables",
    title: "printf, scanf and variables",
    objectives: [
      "Write a C program that compiles and runs",
      "Explain why statements end with a semicolon",
      "Read and print values with format specifiers",
    ],
    summary:
      "Write your first C program and understand why every statement ends with a semicolon.",
    order: 1,
    minutes: 8,
    xp: 30,
    concept:
      "C statements end with semicolons; the compiler ignores line breaks.",
    explanation: [
      "C programs begin in main(). Every statement ends with a semicolon — C treats the newline like a space, so the semicolon is what actually ends a command.",
      "printf() prints text. Format specifiers like %d (integer) and %s (text) are placeholders you fill in with arguments. scanf() reads input.",
      "scanf needs the address of a variable, so you use the & symbol. Forgetting & is the classic beginner error.",
    ],
    analogy:
      "printf is a template card where you stamp numbers and words into marked slots.",
    example: {
      lang: "c",
      code: `#include <stdio.h>

int main() {
    int age;
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Next year you will be %d\\n", age + 1);
    return 0;
}`,
      caption: "A tiny C program that reads, calculates and prints.",
    },
    sections: [
      {
        heading: "Programs start at main",
        body: [
          "The compiler looks for main() as the entry point.",
          "return 0 tells the shell the program succeeded.",
        ],
      },
      {
        heading: "Format specifiers",
        body: [
          "%d is for int, %f for floating point, %s for text.",
          "Match the specifier to the type you pass in.",
        ],
        code: { lang: "c", code: `printf("Age %d, height %.1f\\n", age, height);` },
      },
    ],
    tryIt: {
      instructions:
        "Read an age and print the age plus one; then read a colour and print a sentence with the colour included.",
      starter: `#include <stdio.h>

int main() {
    int age;
    // read and print a coloured sentence
    return 0;
}`,
      solution: `#include <stdio.h>

int main() {
    int age;
    char colour[30] = "blue";
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Next year you will be %d; favourite colour is %s\\n", age + 1, colour);
    return 0;
}`,
    },
    challenge: {
      task:
        "Add a double height variable and print it with a single decimal after the age.",
      hint: "Use %f and pass height, like printf(\"%.1f\", height).",
      solution: `#include <stdio.h>

int main() {
    double height = 1.65;
    printf("Height: %.1f\\n", height);
    return 0;
}`,
    },
    commonMistakes: [
      {
        mistake: "Missing the semicolon.",
        fix: "Add a semicolon to every C statement.",
      },
      {
        mistake: "Forgetting & before a variable in scanf.",
        fix: "Pass the address with & so scanf can store the value.",
      },
      {
        mistake: "Using the wrong format specifier.",
        fix: "Match %d, %f and %s to the variable types.",
      },
    ],
    quiz: [
      {
        question: "Why does scanf need &age instead of just age?",
        options: [
          "It is a style convention",
          "scanf needs the memory ADDRESS where it should store the value",
          "& converts the number to text",
          "It is only needed in loops",
        ],
        correctIndex: 1,
        explanation:
          "& is the 'address-of' operator. scanf writes directly into the variable's memory, so it must know where that memory is.",
      },
    ],
  },
  {
    slug: "c-conditions-loops",
    title: "Conditions and loops in C",
    objectives: [
      "Write if / else in C",
      "Use && as logical AND",
      "Build a for loop with explicit start, condition and step",
    ],
    summary:
      "Use if/else and for loops, and see how C compares with Python and Java.",
    order: 2,
    minutes: 8,
    xp: 30,
    concept:
      "C uses if/else, == for comparison and && for logical AND.",
    explanation: [
      "C uses the same if/else structure you have seen elsewhere, but comparison uses == and logical AND is written as && rather than the word 'and'.",
      "The for loop in C packs its whole engine into one line: for (int i = 0; i < 5; i++) — start, condition, step.",
      "Because C compiles close to machine code, these loops are fast. Remember braces for the body.",
    ],
    analogy:
      "A for loop is an engine with a starter, a throttle and a brake all in the header.",
    example: {
      lang: "c",
      code: `int marks = 62;

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
      caption: "Branching and counting in C.",
    },
    sections: [
      {
        heading: "Decisions",
        body: [
          "Use == for equal and = for assignment.",
          "Logical AND is &&, logical OR is ||.",
        ],
      },
      {
        heading: "Loops",
        body: [
          "Initialise, test and update in the for header.",
          "Keep the body simple so the header is easy to trust.",
        ],
        code: { lang: "c", code: `for (int i = 0; i < 5; i++) {\n    printf("%d\\n", i);\n}` },
      },
    ],
    tryIt: {
      instructions:
        "Ask for a mark and print Distinction, Pass or Try again. Then print three practice rounds.",
      starter: `int marks = 62;
// write if / else if / else
// write a for loop`,
      solution: `int marks = 62;

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
    },
    challenge: {
      task: "Ask for three marks, then print whether each one passes (>= 50).",
      hint: "Use three calls to scanf and store the marks in variables.",
      solution: `int marks;
for (int round = 0; round < 3; round++) {
    scanf("%d", &marks);
    printf("%s\\n", marks >= 50 ? "Pass" : "Try again");
}`,
    },
    commonMistakes: [
      {
        mistake: "Writing 'and' instead of &&.",
        fix: "C uses && for logical AND.",
      },
      {
        mistake: "Forgetting to increment in the loop.",
        fix: "Put i++ in the for header.",
      },
      {
        mistake: "Comparing with a single =.",
        fix: "Use == in conditions and = for assignment.",
      },
    ],
    quiz: [
      {
        question: "What does && mean in C?",
        options: [
          "A comment",
          "Logical AND — both sides must be true",
          "Logical OR",
          "Pointer arithmetic",
        ],
        correctIndex: 1,
        explanation:
          "C writes logical AND as && and logical OR as ||. Using the word 'and' would be a syntax error.",
      },
    ],
  },
  {
    slug: "c-functions-arrays",
    title: "Functions and arrays in C",
    objectives: [
      "Split a C program with functions",
      "Store values in arrays",
      "Understand that C checks no bounds",
    ],
    summary: "Split programs into functions and process collections with arrays.",
    order: 3,
    minutes: 8,
    xp: 30,
    concept:
      "C functions live at the top level of a file, and arrays reserve consecutive memory slots.",
    explanation: [
      "In C you declare a function with its return type and parameters before you use it. Unlike Java, C does not wrap functions inside classes — they live at the top level of the file.",
      "An array int marks[3] reserves three consecutive slots in memory.",
      "C does not stop you from reading marks[7] — it simply reads whatever exists there. That lack of safety is exactly why C teaches carefulness.",
    ],
    analogy:
      "A function is a tool on a workbench; an array is a numbered row of memory boxes.",
    example: {
      lang: "c",
      code: `#include <stdio.h>

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
      caption: "Functions plus fixed-size arrays.",
    },
    sections: [
      {
        heading: "Functions",
        body: [
          "Declare return type and parameters.",
          "Call them after declaration so the compiler knows them.",
        ],
        code: { lang: "c", code: `int doubleIt(int number) {\n    return number * 2;\n}` },
      },
      {
        heading: "Arrays",
        body: [
          "Arrays are fixed in size and zero-indexed.",
          "Do not read past the end — C will not warn you.",
        ],
        code: { lang: "c", code: `for (int i = 0; i < 3; i++) {\n    total += marks[i];\n}` },
      },
    ],
    tryIt: {
      instructions:
        "Create an array of three marks, calculate the average, then write a function that doubles a number.",
      starter: `#include <stdio.h>

int main() {
    // array and loop here
    return 0;
}`,
      solution: `#include <stdio.h>

int doubleIt(int number) {
    return number * 2;
}

int main() {
    int marks[3] = {70, 85, 92};
    int total = 0;
    for (int i = 0; i < 3; i++) {
        total += marks[i];
    }
    printf("Average: %.1f\\n", (double) total / 3);
    printf("Double 21: %d\\n", doubleIt(21));
    return 0;
}`,
    },
    challenge: {
      task: "Read a third mark into the array and make sure no code reads marks[3].",
      hint: "Use marks[2] because indexes start at 0.",
      solution: `marks[2] = newMark;`,
    },
    commonMistakes: [
      {
        mistake: "Accidentally writing C++ style string objects.",
        fix: "C uses char arrays and format specifiers.",
      },
      {
        mistake: "Reading outside array bounds.",
        fix: "Use the known length in every loop.",
      },
      {
        mistake: "Forgetting the return statement in doubleIt.",
        fix: "Non-void functions need a return.",
      },
    ],
    quiz: [
      {
        question: "What happens in C when you access marks[10] on an array of size 3?",
        options: [
          "C prints a friendly error message",
          "C returns 0 automatically",
          "C reads whatever is at that memory location — undefined behaviour",
          "The program recompiles the array",
        ],
        correctIndex: 2,
        explanation:
          "C does not check array bounds. Out-of-range access reads unrelated memory — the reason buffer bugs are famous.",
      },
    ],
  },
];
