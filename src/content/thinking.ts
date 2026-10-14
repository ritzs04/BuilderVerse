import type { ThinkingCategory, ThinkingChallenge } from "./types";

/**
 * Thinking Gym challenges: puzzles that train the mental habits of programming
 * (decomposition, invariants, edge cases, narrowing a search space) without
 * asking anyone to write a line of code yet.
 *
 * `checks` are groups of alternative keywords. A free-text answer counts as
 * correct only when every group has at least one keyword that appears in the
 * answer (case-insensitive substring match).
 */
export const thinkingChallenges: ThinkingChallenge[] = [
  {
    slug: "three-buttons-one-bulb",
    title: "Three switches, one bulb",
    category: "logic",
    difficulty: "Easy",
    prompt:
      "Three light switches sit downstairs, and one light bulb glows in a sealed room upstairs. You may flip the switches any way you like, but you get to walk into that room exactly once. How do you work out which switch controls the bulb?",
    context:
      "Sometimes you cannot inspect everything at all once, so you design one experiment that squeezes the most information out of a single observation. That habit shows up constantly in debugging: one log line, one screenshot, one reproduction.",
    hints: [
      "You get only one look inside the room, so make every switch do double duty.",
      "Besides glowing, a bulb that has been on for a while gets warm, and it stays warm for a little after you switch it off.",
    ],
    answer:
      "Leave switch 1 on for a few minutes, then turn it off and flip switch 2 before you enter. The glowing bulb belongs to switch 2, the warm-but-dark bulb to switch 1, and the cool dark bulb to switch 3.",
    checks: [
      ["warm", "hot", "heat"],
      ["minutes", "while", "long"],
      ["cool", "cold", "never"],
    ],
    encourage:
      "Nice thinking so far — ask yourself what else a bulb can reveal besides whether it is lit.",
    xp: 25,
  },
  {
    slug: "fencepost-separators",
    title: "The separators between rows",
    category: "loops",
    difficulty: "Easy",
    prompt:
      "A report prints 10 rows of data, and it drops a separator line between each pair of rows. How many separator lines appear in total, and why is the answer not 10?",
    context:
      "This is the classic fencepost problem, and it is the source of countless off-by-one bugs in loops. Counting the gaps instead of the items is a small habit that saves whole debugging sessions.",
    hints: [
      "Separators live between rows, not on every row.",
      "Picture the rows as a line of dots and count the spaces between them, not the dots.",
    ],
    answer:
      "Nine. Ten rows create nine gaps between them, so the loop prints 9 separator lines.",
    checks: [
      ["9", "nine"],
      ["gap", "between", "fencepost"],
    ],
    encourage:
      "Almost there — draw it out as dots and count the spaces between them.",
    xp: 25,
  },
  {
    slug: "test-the-edge-cases",
    title: "Hunt the edge cases",
    category: "debugging",
    difficulty: "Easy",
    prompt:
      "A function takes a list of exam scores and returns the average. It passes every test you have tried so far. Which unusual inputs should you try before you trust it, and what could each one expose?",
    context:
      "Real bugs hide at the edges: empty lists, single items, zeros, negatives, huge values. Testing the boring cases first is how experienced developers find problems before users do.",
    hints: [
      "Think about the smallest lists you could possibly pass in, even smaller than a one-element list.",
      "The average is a division. Ask yourself what the bottom of that division could turn into.",
    ],
    answer:
      "Try an empty list, since there is nothing to divide by and the count is zero, then a single score, all zeros or negatives, and very large numbers. The empty list is the classic one because it breaks the calculation outright.",
    checks: [
      ["empty", "nothing", "length 0"],
      ["divis", "divide", "zero"],
      ["single", "one", "lone"],
    ],
    encourage:
      "Good instincts — keep going and think even smaller about what you could pass in.",
    xp: 25,
  },
  {
    slug: "break-down-the-feature",
    title: "Slice a big feature",
    category: "decomposition",
    difficulty: "Easy",
    prompt:
      "A teammate opens a ticket: add a button that lets users download their profile as a PDF. Before writing a single line of code, list the steps you would break this into. What has to happen, in order, for that button to end up as a file on the user's device?",
    context:
      "Big features are just small steps arranged in order. Decomposing a ticket into testable pieces is the first move a programmer makes, because it turns something scary into a checklist.",
    hints: [
      "Start at the beginning: the button needs some information in hand before there is anything to turn into a PDF.",
      "Think about the finish line too. The file has to travel from your code all the way to the user's downloads folder.",
    ],
    answer:
      "Fetch the profile data, build the PDF from it, then hand the result to the browser as a download, with a clear failure message if any step breaks.",
    checks: [
      ["data", "fetch", "profile"],
      ["creat", "generat", "make"],
      ["download", "save", "deliver"],
    ],
    encourage:
      "You are on the right track — what does the button need in hand before anything can become a file?",
    xp: 25,
  },
  {
    slug: "condition-order-surprise",
    title: "When two checks both fire",
    category: "conditions",
    difficulty: "Medium",
    prompt:
      "A grading program runs two checks one after the other. The first says: if the score is 60 or above, print pass. The second says: if the score is 90 or above, print distinction. A student scores 95 — what does the program print, and how would you change it to print only one line?",
    context:
      "Conditionals do not know about each other. Two separate if statements are both checked every time, which is exactly why real code reaches for else if when the cases are meant to be exclusive.",
    hints: [
      "Neither check knows that the other one already ran.",
      "Ask yourself whether 95 satisfies the first condition, the second one, or both of them.",
    ],
    answer:
      "It prints both lines, because 95 is at least 60 and also at least 90, so both checks pass. Turning the second check into an else if makes the two cases exclusive, so only one line appears.",
    checks: [
      ["both", "two", "twice"],
      ["else", "independent", "separate"],
      ["print", "output", "show"],
    ],
    encourage:
      "Close — trace both checks one at a time and ask whether each one gets its own chance to run.",
    xp: 35,
  },
  {
    slug: "doubling-differences",
    title: "Read the rule in the gaps",
    category: "patterns",
    difficulty: "Medium",
    prompt:
      "A sequence runs: 2, 3, 5, 9, 17, and each number is built from the one before it. What is the next number, and what is the rule behind it?",
    context:
      "Reading a rule from a few examples is the same skill you use when a bug only shows up after the fourth loop iteration. The pattern lives in what changes between neighbours, not in the numbers themselves.",
    hints: [
      "Do not stare at the numbers. Look at the differences between them.",
      "Now compare those differences with each other. What is each one doing to the next?",
    ],
    answer:
      "The next number is 33. The gaps between terms double every time (1, 2, 4, 8, 16), so 17 + 16 = 33.",
    checks: [
      ["33", "thirty"],
      ["doubl", "twice"],
      ["differen", "gap", "subtract"],
    ],
    encourage: "Nice effort — write out what each number is doing to reach the next one.",
    xp: 35,
  },
  {
    slug: "guess-with-halves",
    title: "Guess it in ten questions",
    category: "algorithms",
    difficulty: "Medium",
    prompt:
      "I am thinking of a whole number between 1 and 1000. You may ask yes/no questions until you are sure of it. What strategy guarantees the answer in the fewest questions, and what is the most questions you could need?",
    context:
      "This is how a computer searches a sorted list. Halving the search space at every step, known as binary search, turns a million possibilities into about twenty.",
    hints: [
      "Every answer should rule out as much of the remaining numbers as possible.",
      "Aim at the middle of what is left, then think about how many times you can halve 1000 before one number remains.",
    ],
    answer:
      "Always ask about the middle of the remaining range and throw away half each time. Halving 1000 takes about ten rounds (2^10 = 1024), so ten questions always suffice.",
    checks: [
      ["half", "middle", "midpoint"],
      ["10", "ten"],
      ["range", "remaining", "eliminate"],
    ],
    encourage:
      "Good thinking — one strong question can rule out a lot. How much, exactly?",
    xp: 35,
  },
  {
    slug: "xor-pairs-solo-number",
    title: "The lonely number",
    category: "arrays",
    difficulty: "Hard",
    prompt:
      "An array holds numbers where every value appears exactly twice, except one lonely value that appears only once. Find that value in a single pass using no extra storage. What operation or idea makes this possible?",
    context:
      "Sometimes the trick is not searching harder but picking an operation that makes duplicates cancel themselves. This is a gentle taste of bit-level thinking, and it shows up in real interview questions and checksums alike.",
    hints: [
      "Sorting, counting or copying would all need extra memory, so think about one running value you carry through the array.",
      "XOR has a handy property: the same bit with the same bit gives 0, and anything combined with 0 stays itself. What does that make a number combined with itself?",
    ],
    answer:
      "XOR every element together into one running total. Each pair cancels to zero, so whatever survives at the end is the lone unmatched value.",
    checks: [
      ["xor"],
      ["pair", "cancel", "twice"],
      ["single", "lone", "once"],
    ],
    encourage:
      "Great instinct — keep going and think about an operation that makes duplicates erase themselves.",
    xp: 50,
  },
  {
    slug: "race-condition-counter",
    title: "The counter that loses people",
    category: "real-world",
    difficulty: "Hard",
    prompt:
      "A live counter shows how many people are online. Every time someone joins, a device does three steps: read the number, add 1, write it back. Two people join at the same instant on two different devices — what goes wrong, and how would you fix it?",
    context:
      "This is a race condition, the bug class behind lost updates, double charges and corrupted saves. It is exactly why languages and databases offer locks, atomic operations and transactions.",
    hints: [
      "Walk through those three steps for both devices, assuming they run at the exact same moment.",
      "Both devices can read the same number before either one writes it back. What does the second write do to the first?",
    ],
    answer:
      "Both devices read the same value before either writes, so one update overwrites the other and the counter ends up one too low — a race condition. Fix it by making the read-add-write atomic with a lock, an atomic increment or a transaction.",
    checks: [
      ["race", "overwrit", "lost"],
      ["read", "write", "same"],
      ["lock", "atomic", "serial"],
    ],
    encourage:
      "Solid start — now imagine both devices writing at the exact same instant and see who gets counted.",
    xp: 50,
  },
  {
    slug: "hundred-stones-winning-move",
    title: "Who wins the stone game?",
    category: "logic",
    difficulty: "Expert",
    prompt:
      "Two players take turns removing 1, 2 or 3 stones from a pile of 100. The player who takes the very last stone wins. With perfect play from both sides, who wins, and what is the strategy?",
    context:
      "This is combinatorial game thinking: instead of trying every move, you ask which positions are safe to hand to your opponent. It is the same reasoning behind minimax, dynamic programming and puzzle design.",
    hints: [
      "Work backwards from tiny piles. With 1, 2 or 3 stones left the player to move takes them all and wins. What about a pile of 4?",
      "A losing position is one where every possible move hands your opponent a win. Which pile sizes are losing positions, and how are they spaced?",
    ],
    answer:
      "The second player wins. Multiples of 4 are losing positions, and 100 is a multiple of 4, so the first player starts in one. The second player keeps leaving a multiple of 4 by taking 4 minus whatever the first player just took.",
    checks: [
      ["multiple", "mod", "divisible"],
      ["second", "player two", "los"],
      ["leav", "mirror", "keep"],
    ],
    encourage:
      "Great question to sit with — try the same puzzle with piles of 4, 5, 6 and 7 stones first and watch who wins each one.",
    xp: 70,
  },
];

/** Human-readable labels for each Thinking Gym category. */
export const thinkingCategoryLabels: Record<ThinkingCategory, string> = {
  logic: "Logic & reasoning",
  patterns: "Patterns",
  conditions: "Conditions & edge cases",
  loops: "Loops",
  arrays: "Arrays & strings",
  debugging: "Debugging mindset",
  decomposition: "Decomposition",
  algorithms: "Algorithms",
  "real-world": "Real-world problems",
};
