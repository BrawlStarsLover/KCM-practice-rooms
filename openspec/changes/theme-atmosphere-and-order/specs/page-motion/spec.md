# Spec Delta

<!-- page-motion was introduced by theme-layouts-and-copy, which is not archived yet,
     so this is an ADDED requirement on the same capability rather than a MODIFIED one. -->

## ADDED Requirements

### Requirement: Rows fade in without scroll-driven animation
Schedule rows SHALL fade in as they come into view in browsers that lack scroll-driven animation, such as Safari, matching what browsers with it already do. Rows SHALL always end fully visible, SHALL never be left hidden if the fallback cannot run, and SHALL NOT animate when the visitor has asked for reduced motion.

#### Scenario: Safari
- **WHEN** a visitor on a browser without scroll-driven animation scrolls the schedule into view
- **THEN** the rows fade in, and every row that has been on screen stays fully visible

#### Scenario: Reduced motion
- **WHEN** reduced motion is on
- **THEN** rows appear at once, with no fade, in every browser
