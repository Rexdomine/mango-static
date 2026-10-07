# Mango Static — Pass the Frequency

A music-first creative experience: choose a mood, setting and energy, make a personal Frequency Card, and pass it on.

## Run locally

No build step or package installation is required:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. Deploy the `dist` directory as a static website; `vercel.json` supplies that configuration for Vercel.

## Features

- Mood, six everyday settings and energy determine card copy, palette and geometry.
- Optional nickname and suggested track remain in the browser and exported image.
- PNG downloads: portrait 1080 × 1350, story 1080 × 1920 and square 1080 × 1080.
- Native image sharing where supported, with save/copy fallback. Device and app behaviour varies.
- Invitation URLs use the current website origin and carry mood, setting and energy. They exclude nickname and suggested track. Earlier rooftop and waterside invitations still work.
- Downloadable Transmission 001 DJ brief.

## Submission status

DJ submissions are **device-only drafts**. They are stored in browser local storage and are never sent to Mango Static or published. Clearing browser data deletes those drafts. Shared collection and editorial featuring are not connected yet; no actual mixes or submissions are implied.

## Assets

The site uses the approved Mango Static wordmarks, signal and M-01 mascot. Supporting fonts are Lato (included with its OFL license) and an installed system monospace fallback. Brand artwork is provided for this website, not licensed here for unrelated reuse.
