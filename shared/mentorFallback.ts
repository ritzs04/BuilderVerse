/**
 * Shared educational fallback generator for the Sprout AI mentor.
 * Used by the local dev server (server.ts) AND the Vercel serverless
 * function (api/ai/mentor.ts) so both environments give identical,
 * encouraging answers when the Gemini API is unavailable.
 */
export function generateEducationalFallback(prompt: string, code?: string, errorText?: string, mode?: string, context?: string): string {
  const text = (prompt + ' ' + (code || '') + ' ' + (errorText || '') + ' ' + (context || '')).toLowerCase();

  if (text.includes('undefined') || text.includes('not defined') || text.includes('referenceerror')) {
    return `**Take a deep breath — this happens to every single developer! 🌷**

**What is happening:**
A \`ReferenceError\` means JavaScript looked everywhere in its memory for a variable name, but nobody ever introduced it with \`const\`, \`let\`, or \`var\`.

**What to check right now:**
1. **Letter-by-letter spelling:** Did you type \`nam\` instead of \`name\`? Even 1 letter difference makes a brand-new identifier.
2. **Scope check:** If you declared the variable inside a function or an \`if\` block with \`let\`, it cannot be seen outside that block.
3. **Order of execution:** Make sure you create the variable *before* you try to read it.

*You've got this! Fix the spelling and run it again. 🌸*`;
  }

  if (text.includes('promise') || text.includes('async') || text.includes('await') || text.includes('fetch')) {
    return `**Async is like ordering tea at a café! 🍵**

**The Analogy:**
When you call \`fetch()\`, you don't instantly get your drink — you get an order buzzer (a **Promise**). If you try to drink from the buzzer immediately, you get \`undefined\`!

**The Golden Rules:**
1. Mark your function as \`async\`: \`async function loadData() { ... }\`
2. Put \`await\` in front of \`fetch()\`: \`const response = await fetch(url);\`
3. Put \`await\` in front of \`.json()\`: \`const data = await response.json();\`
4. Always check if the café was open: \`if (!response.ok) throw new Error("Oops!");\`

*Now your code will politely wait for the network before reading the data. ✨*`;
  }

  if (text.includes('flex') || text.includes('grid') || text.includes('center') || text.includes('css')) {
    return `**CSS Layouts made friendly! 🌸**

**Flexbox vs Grid in 10 seconds:**
- **Flexbox is for a single line (row or column):** Think of beads on a necklace.
  \`display: flex; justify-content: center; align-items: center;\` perfectly centers anything!
- **Grid is for a 2D sheet (rows AND columns):** Think of a checkerboard or photo album.
  \`display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\`

**Remember the Box Model:**
Set \`box-sizing: border-box;\` on all elements so padding doesn't push items unexpectedly outside their container! 🌷`;
  }

  if (text.includes('hint') || mode === 'hint' || text.includes('switch') || text.includes('bulb')) {
    return `**Socratic Hint from Sprout AI 🧠**

Notice that a standard light switch only gives you **two** visual signals:
- Light is ON
- Light is OFF

*Ask yourself:* Can a light bulb do something else besides glow? What happens when a bulb stays on for 10 minutes?
It gets **warm to the touch!**

Now you have **three distinct states**:
1. ON (glowing)
2. OFF and COLD
3. OFF and HOT

*Does that help you isolate which switch is which? Give it a try downstairs! 🌷*`;
  }

  return `**Sprout AI is here with you! 🌷**

**Remember our golden principle:**
*"You do not have to be a perfect student to become a capable builder."*

When you feel stuck:
1. **Break it in half:** What is the very first line of code that runs?
2. **Inspect with console.log:** Print your variables before and after the tricky line.
3. **Explain it out loud:** Talk to your Builder Avatar like a friend!

Keep going — every confusion you work through turns into long-lasting engineering intuition. 🌸`;
}
