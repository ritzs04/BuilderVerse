/**
 * Answer-checking helper shared by Thinking Gym and the Error Companion.
 * Case-insensitive: every keyword group must match at least one keyword.
 *
 * Lives in `lib` (not `app/actions`) because files with "use server" may only
 * export async functions.
 */
export function matchesChecks(answer: string, checks: string[][]): boolean {
  const normalized = answer.toLowerCase();
  return checks.every((group) =>
    group.some((keyword) => normalized.includes(keyword.toLowerCase())),
  );
}
