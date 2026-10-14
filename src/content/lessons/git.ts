import type { Lesson } from "../types";

export const gitLessons: Lesson[] = [
  {
    slug: "git-commits-basics",
    title: "Your first commits",
    summary:
      "What version control is, and how init, add and commit give you a safety net for every change.",
    order: 1,
    minutes: 12,
    xp: 40,
    concept:
      "Git is version control: it saves named snapshots of your project so you can inspect history and undo mistakes.",
    explanation: [
      "Without version control, your only backup is copy-pasting folders called final, final2 and final-real. Git solves that by keeping a history of your project inside a hidden .git folder. Each snapshot you take is called a commit, complete with a message and an author.",
      "Git keeps three areas in mind: your files on disk (the working directory), a waiting room called the staging area, and the repository where committed history lives. You stage the changes you want with git add, then record them permanently with git commit -m \"your message\".",
      "Commit often and small. A commit that does one thing is easy to understand, easy to review and easy to undo. Aim for a habit: finish a feature, run git status, stage it, commit it.",
      "Two commands keep you oriented: git status tells you what has changed right now and what is staged, and git log --oneline shows your history, newest first. When in doubt, run git status — it answers almost every beginner question.",
    ],
    analogy:
      "It works like saving a game. git add picks the progress you want to keep, and git commit writes the save file. If a later level goes badly, you can reload an earlier save instead of starting over.",
    example: {
      lang: "bash",
      code: `git init
git add .
git commit -m "Add my first portfolio page"
git status
git log --oneline`,
      caption: "Start a repository, stage everything, commit it, then look around.",
    },
    sections: [
      {
        heading: "The three areas of Git",
        body: [
          "**Working directory:** the files you are editing. Nothing here is saved to history yet.",
          "**Staging area:** the changes you have chosen for the next commit, via `git add`. Think of it as packing a box before sealing it.",
          "**Repository:** the committed snapshots. `git commit` closes the box and files it away; `git log` reads the labels on the shelf.",
          "`git status` always shows you which area each file is in — Untracked, Staged, or modified but not staged.",
        ],
      },
      {
        heading: "Commit messages people can read",
        body: [
          "Write the summary in the imperative mood, as if finishing the sentence: \"Add contact form\", \"Fix mobile menu overlap\". Keep it under about 50 characters so it fits on one line of `git log --oneline`.",
          "Messages like \"update\", \"stuff\" or \"final\" save you ten seconds now and cost you ten minutes later when you try to find the commit that broke something.",
          "A good test: if a teammate read only your message, would they know *what* changed without opening the diff?",
        ],
      },
    ],
    tryIt: {
      instructions:
        "Make a folder for a tiny project, start a repository in it, create an index.html file, then stage and commit it. Finish by viewing your history with git log --oneline. Run git status after each step to watch files move between areas.",
      starter: `mkdir my-first-repo
cd my-first-repo
git init

# create an index.html file with any content, then:
git status
# stage it
# commit it with a clear message
git log --oneline`,
      solution: `mkdir my-first-repo
cd my-first-repo
git init

# (create index.html in this folder)

git status
git add index.html
git commit -m "Add landing page skeleton"
git status
git log --oneline`,
    },
    challenge: {
      task:
        "Make a second file called about.html, then stage *only* that file and commit it. Your history should now show two separate commits.",
      hint:
        "git add works on paths, not just dots: `git add about.html` stages one file. Check `git log --oneline` afterwards to confirm.",
      solution: `# create about.html, then:
git status
git add about.html
git commit -m "Add about page"
git log --oneline`,
    },
    commonMistakes: [
      {
        mistake:
          "Running git commit before git add, and Git tells you there is nothing to commit.",
        fix: "Stage first: git add <file> (or git add . for everything). Always glance at git status to see what is staged.",
      },
      {
        mistake: "Vague messages like \"updates\" or \"fixed stuff\".",
        fix: "Describe the change in the imperative: \"Fix login button on mobile\". Your future self, and anyone reviewing your code, will thank you.",
      },
      {
        mistake:
          "Committing node_modules, build output or a .env file full of secrets by accident.",
        fix: "Add a .gitignore file listing those paths, and run git status before every commit to check what is about to be recorded.",
      },
    ],
    quiz: [
      {
        question: "What does git add actually do?",
        options: [
          "Uploads your project to GitHub",
          "Moves changed files into the staging area for the next commit",
          "Deletes the file from disk",
          "Shows your commit history",
        ],
        correctIndex: 1,
        explanation:
          "add prepares a snapshot; it does not save anything permanent until you run git commit.",
      },
      {
        question: "Which command shows your project's saved history?",
        options: [
          "git log",
          "git status",
          "git add",
          "git init",
        ],
        correctIndex: 0,
        explanation:
          "git log lists commits newest first. Add --oneline for a compact one-line-per-commit view.",
      },
      {
        question: "What is a commit, in plain terms?",
        options: [
          "A folder Git creates for every file",
          "The file you are currently editing",
          "A saved snapshot of the project with a message and author",
          "A command that runs your code",
        ],
        correctIndex: 2,
        explanation:
          "Each commit is a permanent checkpoint in history that you can read later and return to if needed.",
      },
    ],
  },
  {
    slug: "git-github-remotes",
    title: "Remotes, push, pull and branches",
    summary:
      "GitHub as your project's second copy: cloning, pushing, pulling, and branches as a safety net.",
    order: 2,
    minutes: 14,
    xp: 40,
    concept:
      "A remote is a copy of your repository hosted elsewhere (usually GitHub), and push, pull and clone are how your local copy and that remote stay in sync.",
    explanation: [
      "Your laptop's repository is only one copy. A remote is a named URL pointing at another copy — almost always GitHub. The conventional name for the main one is origin. Once you connect it, git push sends your committed history up, and git pull brings other people's commits (or your own from another machine) back down.",
      "Push means upload your local commits; pull means download remote commits and merge them into your working branch. A healthy rhythm is simple: pull before you start work, push when you finish a chunk. Mixing those two up is the most common remote mistake.",
      "git clone url does the opposite of starting fresh: it copies an existing repository — code and full history — onto your machine, ready to run. That is how you begin work on any project you did not create.",
      "Branches are where Git becomes a safety net. A branch is just a movable label on a commit, so creating one costs nothing. You can build on a feature branch, break it freely, and leave your main branch untouched — then merge it back when it works, or open a pull request on GitHub so someone else can review it first.",
    ],
    analogy:
      "Think of the GitHub repository as a shared cloud drive for your project. git push is uploading your finished work, git pull is downloading the latest from everyone else, and a branch is your own private scratch copy of the drive — you can experiment as much as you like and only share it when it is ready.",
    example: {
      lang: "bash",
      code: `git remote add origin https://github.com/your-name/portfolio.git
git push -u origin main

git pull origin main
git push origin main`,
      caption: "Connect a local repository to GitHub, then sync in both directions.",
    },
    sections: [
      {
        heading: "Cloning: starting from an existing repo",
        body: [
          "`git clone https://github.com/someone/project.git` creates a folder called project with the code *and* its entire history inside it. You can run git log immediately and see every commit the team has made.",
          "After cloning, `origin` already points at that URL, so plain `git push` and `git pull` know where to go — no setup needed.",
          "If the repository is yours and brand new, GitHub offers the two lines you need after `git init`: `git remote add origin <url>` followed by `git push -u origin main`.",
        ],
      },
      {
        heading: "Branches as a safety net",
        body: [
          "`git switch -c feature-about` creates a branch and moves you onto it. Every commit from here on only advances that label — main stays exactly where it was.",
          "When the work is good, `git switch main` then `git merge feature-about` folds it back. If it turns out badly, switching back to main is the entire undo.",
          "On GitHub, push the branch and open a pull request: a proposal to merge your branch, where teammates can comment before anything lands on main.",
        ],
        code: {
          lang: "bash",
          code: `git switch -c feature-about
# ...make changes, add, commit...
git switch main
git merge feature-about
git push origin main`,
        },
      },
    ],
    tryIt: {
      instructions:
        "Create an empty repository on GitHub, then connect your existing local project to it and push your first commit. Afterwards, clone one public repository (any small project you like) into a new folder and run git log inside it.",
      starter: `# in your local project, after at least one commit:
git remote add origin <your-repo-url>
git status

# now push your main branch
# then clone something to explore:
git clone https://github.com/octocat/Hello-World.git`,
      solution: `# in your local project, after at least one commit:
git remote add origin https://github.com/your-name/my-project.git
git status
git push -u origin main

# confirm it worked:
git remote -v
git log --oneline

# then clone something to explore:
git clone https://github.com/octocat/Hello-World.git
cd Hello-World
git log --oneline`,
    },
    challenge: {
      task:
        "Create a branch called feature-about, commit a change to about.html on it, then switch back to main and merge the branch. Push main to GitHub when you are done.",
      hint:
        "The order is: `git switch -c feature-about`, make and commit your change, `git switch main`, `git merge feature-about`, `git push origin main`.",
      solution: `git switch -c feature-about
# edit about.html, then:
git add about.html
git commit -m "Add about page content"

git switch main
git merge feature-about
git push origin main

# tidy up the label once merged (safe: the work lives on main now)
git branch -d feature-about`,
    },
    commonMistakes: [
      {
        mistake: "Mixing up push and pull, so your work goes the wrong way.",
        fix: "Push = send your commits up to GitHub. Pull = bring commits down from GitHub. Say it out loud before you type it.",
      },
      {
        mistake:
          "Panicking when git pull reports a merge conflict on shared files.",
        fix: "Open the flagged file, look for the <<<<<<< and >>>>>>> markers, keep the version you want, then git add the file and git commit to finish the merge.",
      },
      {
        mistake: "Running git push before you have made any commits.",
        fix: "A remote only accepts commits it does not already have. Make your first commit locally, check git log, then push.",
      },
    ],
    quiz: [
      {
        question: "What does git clone <url> do?",
        options: [
          "Uploads your project to GitHub",
          "Copies an existing repository, including its history, onto your machine",
          "Deletes a remote repository",
          "Creates an empty repository with no history",
        ],
        correctIndex: 1,
        explanation:
          "Clone is how you start work on a project someone else already created — code plus full history in one command.",
      },
      {
        question: "You just finished a feature locally. Which command shares it?",
        options: [
          "git pull",
          "git clone",
          "git push",
          "git status",
        ],
        correctIndex: 2,
        explanation:
          "Push uploads your local commits to the remote. Pull is the opposite direction, used before you start work.",
      },
      {
        question: "What is the main benefit of working on a branch?",
        options: [
          "You can experiment freely without risking your main branch",
          "Your code runs twice as fast",
          "It removes the need to write commit messages",
          "It automatically fixes merge conflicts",
        ],
        correctIndex: 0,
        explanation:
          "A branch is a cheap label, so you can break things, commit often, and merge back only when the work is ready — or discard it entirely.",
      },
    ],
  },
];
