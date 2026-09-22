# Tasks

## 1. Build

- [x] 1.1 Render the six background images (3 themes × desktop/phone) from the design boards with headless Chrome in an isolated profile, convert them to WebP, and replace the 12 illustration images; verify the sizes (1800×1950 and 780×1688) and a visual contact sheet
- [x] 1.2 Add the Classical and Rock token sets, the new role tokens for Jazz light/dark, and the per-theme headline metrics; verify each theme against its board at 1280 px
- [x] 1.3 Per-theme font loading in `<head>` plus on-demand loading; verify the Cormorant/Anton fonts load when chosen
- [x] 1.4 Theme picker (Jazz / Classical / Rock) replacing the style picker, `pr-genre` persistence, pre-paint `data-genre`, and the per-theme wording table; verify the names in the menu, the wording per theme, and that Rock survives a reload
- [x] 1.5 Light/Dark visible only on Jazz; verify it's hidden on Classical and Rock (desktop segment and phone toggle)
- [x] 1.6 Contrast pass: visitor and admin, all 4 looks, page plus Apply/Manage window; verify 0 failures (1,864 checks)
- [x] 1.7 Phone at 390 px for each theme: no sideways scroll, targets at least 44 px, one header row, correct phone background

## 2. Ship

- [ ] 2.1 Commit, push, open a PR; verify the Vercel preview builds
- [ ] 2.2 With the owner's go-ahead, merge; verify the live site loads each theme
