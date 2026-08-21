# ChoreStars

The house manager app — organize chores for the whole family (cooking,
cleaning, dog care, and more), and reward them with stars they can redeem
for real perks. Add kids, or add yourself — anyone in the house can have
their own chores tracked here.

## Features

- **Today** — the daily manager view: each kid's chores for today, grouped
  by kid, with a running star balance. Tap a chore to mark it done and
  award the stars instantly.
- **Chores** — create chore templates: pick a category, how many stars
  it's worth, whether it's every day or specific weekdays, and which
  kid(s) it applies to.
- **Kids** — add a profile per kid (name, age, avatar, color) and see
  their current star balance.
- **Rewards** — a catalog of rewards with a star cost; tap "Give to
  [kid]" to redeem one, right when they cash in their stars.
- **History** — a combined activity feed of chores completed and rewards
  redeemed, plus a this-week leaderboard.

All data is stored locally in the browser (`localStorage`) — no account or
backend required. It's a standalone installable app (its own icon, its own
offline support) even though it's built and deployed from the same
repository as Sparkagain.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

Built with React, TypeScript, Vite, Tailwind CSS, and Zustand.
