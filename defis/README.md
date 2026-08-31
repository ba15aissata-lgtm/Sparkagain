# Défis

A personal challenge tracker — daily rules, streaks, and a real financial
penalty (paid into a "coffre"/vault) when a day is missed, which resets the
streak back to Day 1.

Unlike a single hardcoded challenge, this app lets you create any number of
challenges (your own rules, duration, currency, and penalty range), so a
"pt2" or "pt3" later is just a new challenge added here — no rebuild needed.

## Features

- **Aujourd'hui** — each active challenge's daily checklist. Check every
  rule and validate the day to advance the streak, or declare a failure to
  log a penalty and reset to Day 1.
- **Défis** — create/edit challenges: name, duration, currency, penalty
  range, and a free-form list of rules (wrap a phrase in `**bold**` for
  emphasis).
- **Historique** — every day logged, success or failure, with the amount
  and optional reason for a failure.

All data is stored locally in the browser (`localStorage`) — no account or
backend required. It's a standalone installable app (its own icon, its own
offline support) even though it's built and deployed from the same
repository as Sparkagain and ChoreStars.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

Built with React, TypeScript, Vite, Tailwind CSS, and Zustand.
