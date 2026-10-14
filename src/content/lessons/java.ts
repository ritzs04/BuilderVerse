import type { Lesson } from "../types";

export const javaLessons: Lesson[] = [
  {
    slug: "java-classes-main-types",
    title: "Classes, main() and types",
    objectives: [
      "Understand why every Java program lives inside a class",
      "Explain how main() begins execution",
      "Declare typed variables in Java",
    ],
    summary:
      "Understand why every Java program lives inside a class and how declared types work.",
    order: 1,
    minutes: 8,
    xp: 30,
    concept:
      "A Java class is a blueprint, and main() is the front door of the program.",
    explanation: [
      "Every Java program starts inside a class, and execution begins at public static void main(String[] args).",
      "Unlike Python, Java makes you declare the type of every variable: int age = 17 means age is a box that only holds whole numbers.",
      "This strictness feels heavy at first, but it catches mistakes before the program runs.",
    ],
    analogy:
      "Python is a sketchbook; Java is an engineering drawing — every measurement must be written down.",
    example: {
      lang: "java",
      code: `public class FirstProgram {
    public static void main(String[] args) {
        int age = 17;
        double height = 1.65;
        String name = "Maya";

        System.out.println("Hello, " + name);
        System.out.println("Next year: " + (age + 1));
    }
}`,
      caption: "A typed Java program with a clear entry point.",
    },
    sections: [
      {
        heading: "Entry point",
        body: [
          "The JVM looks for public static void main(String[] args) to start running.",
          "Without that method, the class will compile but not run.",
        ],
      },
      {
        heading: "Primitive types",
        body: [
          "int stores whole numbers, double stores decimals, String stores text.",
          "Choose a type deliberately — changing it later means changing the variable too.",
        ],
        code: { lang: "java", code: `int marks = 92;\nString grade = "A";` },
      },
    ],
    tryIt: {
      instructions:
        "Write a class that prints your name, age and the age you will be next year.",
      starter: `public class FirstProgram {
    public static void main(String[] args) {
        // declare variables and print here
    }
}`,
      solution: `public class FirstProgram {
    public static void main(String[] args) {
        String name = "Builder";
        int age = 17;
        System.out.println("Hello, " + name);
        System.out.println("Next year: " + (age + 1));
    }
}`,
    },
    challenge: {
      task:
        "Add height as a double, print it, and explain why Java wants types before running.",
      hint: "Declare double height = 1.65; then print with System.out.println.",
      solution: `double height = 1.65;
System.out.println("Height: " + height);`,
    },
    commonMistakes: [
      {
        mistake: "Naming the class differently from the file.",
        fix: "Match the public class name to the file name.",
      },
      {
        mistake: "Missing the semicolon at the end of a statement.",
        fix: "Every Java statement ends with a semicolon.",
      },
      {
        mistake: "Confusing assignment and comparison.",
        fix: "= assigns; == compares.",
      },
    ],
    quiz: [
      {
        question: "Where does a Java program begin executing?",
        options: [
          "At the first line of the .java file",
          "In the main method of a class",
          "In the constructor of the first object",
          "Java runs top to bottom automatically",
        ],
        correctIndex: 1,
        explanation:
          "The JVM looks for public static void main(String[] args) as the entry point.",
      },
    ],
  },
  {
    slug: "java-conditions-loops",
    title: "Conditions and loops in Java",
    objectives: [
      "Use if, else if and else in Java",
      "Write for and while loops",
      "Distinguish assignment from comparison",
    ],
    summary:
      "Use if/else, for and while with Java's comparison operators.",
    order: 2,
    minutes: 8,
    xp: 30,
    concept:
      "Java conditions branch paths, and for loops pack their whole engine into one line.",
    explanation: [
      "Java conditions work like the ones you know from other languages, but the comparison operator is a double equals == — a single = is assignment. Mixing them up is a common beginner bug.",
      "for (int i = 0; i < 5; i++) runs five times: start at 0, keep going while i is less than 5, add 1 each round.",
      "The three parts in that line are the loop's start, condition and step. Use braces to group the body clearly.",
    ],
    analogy:
      "A for loop is like a conveyor belt with a counter, a stop button and a pusher — all in one control panel.",
    example: {
      lang: "java",
      code: `int marks = 62;

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
      caption: "Branching and repeating with clear Java syntax.",
    },
    sections: [
      {
        heading: "Decisions",
        body: [
          "Test comparisons with >=, <=, == and !=.",
          "Only one branch runs — Java stops at the first true condition.",
        ],
      },
      {
        heading: "Loops",
        body: [
          "A while loop suits repeated decisions; a for loop suits known counts.",
          "Always remember the braces so the body stays clear.",
        ],
        code: { lang: "java", code: `for (int i = 1; i <= 3; i++) {\n    System.out.println(i);\n}` },
      },
    ],
    tryIt: {
      instructions:
        "Ask for a mark and print Distinction, Pass or Try again, then print three practice rounds.",
      starter: `int marks = 62;
// use if / else if / else
// use for`,
      solution: `int marks = 62;

if (marks >= 75) {
    System.out.println("Distinction");
} else if (marks >= 50) {
    System.out.println("Pass");
} else {
    System.out.println("Try again");
}

for (int i = 1; i <= 3; i++) {
    System.out.println("Practice round " + i);
}`,
    },
    challenge: {
      task: "Write a while loop that counts down from 5 to 1.",
      hint: "Start at 5 and decrement with --.",
      solution: `int i = 5;
while (i >= 1) {
    System.out.println(i);
    i--;
}`,
    },
    commonMistakes: [
      {
        mistake: "Using = in an if condition.",
        fix: "Use == to compare values.",
      },
      {
        mistake: "Off-by-one in a for loop.",
        fix: "Check that the condition stops at the right boundary.",
      },
      {
        mistake: "Forgetting the closing brace.",
        fix: "Indent paired lines as you type.",
      },
    ],
    quiz: [
      {
        question: "What is the difference between = and == in Java?",
        options: [
          "They are interchangeable",
          "= assigns a value; == compares two values",
          "== assigns; = compares",
          "= works only inside loops",
        ],
        correctIndex: 1,
        explanation:
          "= stores a value in a variable, while == tests whether two values are equal in a condition.",
      },
    ],
  },
  {
    slug: "java-methods-arrays",
    title: "Methods and arrays",
    objectives: [
      "Write a reusable method with a return type",
      "Create and iterate over an array",
      "Understand zero-based indexing",
    ],
    summary: "Write reusable methods and store collections of data in arrays.",
    order: 3,
    minutes: 8,
    xp: 30,
    concept:
      "A method is Java's version of a function; an array holds a fixed number of values of one type.",
    explanation: [
      "A method has a return type (void if it returns nothing), a name and parameters. Methods keep logic reusable and readable.",
      "An array holds a fixed number of values of the same type. int[] marks = new int[3] creates three slots, all starting at 0.",
      "Like Python lists, Java arrays begin at index 0.",
    ],
    analogy:
      "A method is a labelled tool in a toolbox; an array is a row of numbered boxes on a shelf.",
    example: {
      lang: "java",
      code: `public class Marks {
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
      caption: "A method and an array working together.",
    },
    sections: [
      {
        heading: "Methods",
        body: [
          "Use return to hand a value back to the caller.",
          "Use void when the method only performs an action.",
        ],
        code: { lang: "java", code: `static int sum(int a, int b) {\n    return a + b;\n}` },
      },
      {
        heading: "Arrays",
        body: [
          "Use .length to avoid counting slots by hand.",
          "Images and records often use separate arrays with shared indexes.",
        ],
        code: { lang: "java", code: `for (int mark : marks) {\n    total += mark;\n}` },
      },
    ],
    tryIt: {
      instructions:
        "Create an array of five marks, calculate the average, and write a method that doubles a number.",
      starter: `class Marks {
    // add array and method here
}`,
      solution: `class Marks {
    static int doubleIt(int number) {
        return number * 2;
    }

    public static void main(String[] args) {
        int[] marks = {60, 70, 80, 90, 100};
        int total = 0;
        for (int mark : marks) {
            total += mark;
        }
        System.out.println("Average: " + (double) total / marks.length);
        System.out.println(doubleIt(21));
    }
}`,
    },
    challenge: {
      task: "Print each mark with its 1-based position next to it.",
      hint: "Print the loop index + 1, then marks[index].",
      solution: `for (int i = 0; i < marks.length; i++) {
    System.out.println((i + 1) + ": " + marks[i]);
}`,
    },
    commonMistakes: [
      {
        mistake: "Assuming the first array item is at position 1.",
        fix: "The first item is at index 0.",
      },
      {
        mistake: "Confusing int[] with List.",
        fix: "Arrays have a fixed size; lists can grow.",
      },
      {
        mistake: "Forgetting to return from a non-void method.",
        fix: "Every path through a non-void method must return a value.",
      },
    ],
    quiz: [
      {
        question: "What is the index of the FIRST element in a Java array?",
        options: ["1", "0", "-1", "It depends on the array size"],
        correctIndex: 1,
        explanation: "Java arrays are zero-indexed: the first element lives at index 0.",
      },
    ],
  },
];
