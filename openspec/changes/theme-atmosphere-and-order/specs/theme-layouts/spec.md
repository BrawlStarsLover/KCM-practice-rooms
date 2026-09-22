# Spec Delta

<!-- theme-layouts was introduced by theme-layouts-and-copy, which is not archived yet,
     so these are ADDED requirements on the same capability rather than MODIFIED ones. -->

## ADDED Requirements

### Requirement: Section order per theme
The order of the page's sections SHALL follow the theme: Rock SHALL place the house rules above the schedule; Classical SHALL place the date line for the visible days at the foot of the page, below the rules, like a programme's footer; Jazz SHALL keep the hero, schedule and rules order. The date line SHALL appear once, wherever the theme puts it.

#### Scenario: Rock order
- **WHEN** Rock is active
- **THEN** the house rules appear above the schedule

#### Scenario: Classical footer
- **WHEN** Classical is active
- **THEN** "Tue Sep 22 – Thu Sep 24" appears once, at the foot of the page below the rules, and not in the hero

### Requirement: Theme button while its menu is open
While the theme menu is open, its button SHALL keep a filled background with a contrasting symbol at every screen width, and the symbol SHALL stay visible.

#### Scenario: Open on a phone
- **WHEN** a visitor on a 375px-wide phone opens the theme menu in any theme and look
- **THEN** the button shows a filled background with its theme symbol still visible against it, at 3:1 or better

### Requirement: Rule numbers sit on their first line
In the house rules, each number SHALL line up with the first line of its rule text, in every theme.

#### Scenario: Rock rules
- **WHEN** Rock's rules are shown
- **THEN** the top of each number is no higher than the top of the first line of its text, and their baselines line up
