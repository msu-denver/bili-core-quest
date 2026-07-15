# ⚔️📜 The bili-core Quest

A workshop that takes computer science students on a Dungeons-and-Dragons-flavored journey through **[bili-core](https://github.com/msu-denver/bili-core)**, the open-source library that powers the MSU Denver Sustainability Hub. Students leave with a map of the library's architecture, a tour of how a real app is built on it, and a take-home scroll for forking it to build a chatbot of their own.

Built for an audience with fundamental CS knowledge (and no assumed experience with LLM frameworks). Runs about two hours.

**Live deck:** https://msu-denver.github.io/bili-core-quest/

## What's in this repo

| File | What it is |
|---|---|
| `index.html` | The slide deck. A self-contained, zero-dependency reveal-style presentation you open in any browser. |
| `SCRIPT.md` | The full speaker script, slide by slide, with timing, interactive beats, and a break marked. |
| `FORK-YOUR-OWN-CHATBOT.md` | The take-home quest: a beginner-friendly guide to forking bili-core and building a first chatbot. |
| `assets/theme.css` | The candlelit-tavern visual theme (all CSS, no external assets). |
| `assets/deck.js` | The tiny vanilla-JS slide engine. |

## Presenting the deck

1. Open `index.html` in any modern browser.
2. Press **F** for fullscreen.
3. Navigate with **→ / Space** (forward) and **←** (back). Some slides reveal bullet points one at a time.
4. Press **?** any time for the full list of controls.

**Three interactive "skill check" slides** (Arcana, History, Insight) have a golden button. Ask the room to guess *before* you click it, that pause is where the engagement lives.

**Rehearsing?** Keep `SCRIPT.md` open beside you.

## The journey (five acts)

- **Act I - The Map:** folder structure and dependencies
- **Act II - The Three Realms:** IRIS (single-agent), AETHER (multi-agent), AEGIS (security)
- **Act III - Provisions:** what it takes to run
- **Act IV - The Kingdom of the Hub:** how the Sustainability Hub extends bili-core
- **Act V - Your Own Quest:** the take-home fork guide

## Deploying to GitHub Pages

Because the deck is fully self-contained (no build step, no CDN), it deploys to GitHub Pages as-is:

1. Push this repo to GitHub.
2. In the repo's **Settings → Pages**, set the source to your default branch, `/ (root)`.
3. Give it a minute, then visit `https://YOUR-USERNAME.github.io/bili-core-quest/`.

The included `.nojekyll` file tells Pages to serve the files directly without extra processing.

## A note on accuracy

The content is grounded from working knowledge of C3-lab Technical Project Manager, [@chillyssa](https://github.com/chillyssa) and her familiar, Claude's deep read of the actual bili-core and Sustainability Hub Engine codebases.

## Credits

Created for the MSU Denver Sustainability Hub team. [bili-core](https://github.com/msu-denver/bili-core), IRIS, AETHER, and AEGIS are the work of MSU Denver students and researchers.
