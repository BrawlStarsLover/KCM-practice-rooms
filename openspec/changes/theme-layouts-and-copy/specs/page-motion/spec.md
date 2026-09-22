# Spec Delta

## Purpose

Adds motion and feedback built on newer browser features (view transitions, scroll-driven animation and press feedback), with safe fallbacks when a browser lacks them or the visitor has asked for reduced motion.

## ADDED Requirements

### Requirement: Smooth theme, look and day switching
Switching the music theme, switching Light/Dark, or changing the day tab SHALL animate from the old view to the new one (a cross-fade or morph), where the browser supports it. Where it isn't supported, the change SHALL happen instantly as it does now.

#### Scenario: Supported browser
- **WHEN** a visitor on a current Chrome or Safari picks Classical
- **THEN** the page cross-fades from Jazz to Classical instead of jumping

#### Scenario: Unsupported browser
- **WHEN** a visitor's browser has no view transitions and they change the day tab
- **THEN** the new day shows immediately, with no error

### Requirement: Scroll effects
Where supported, schedule rows SHALL fade in as they scroll into view, and the header SHALL stay at the top and shrink to a compact height once the page has scrolled. Rows SHALL always be fully visible and readable when not animating, including in browsers without scroll-driven animation.

#### Scenario: Scrolling down
- **WHEN** a visitor scrolls 200px down the page
- **THEN** the header is compact and still at the top of the screen

### Requirement: Button feedback
Buttons SHALL visibly press in when activated. When a request is sent successfully, the Send request button SHALL briefly show a check-mark before the pop-up closes.

#### Scenario: Request sent
- **WHEN** a visitor sends a valid request
- **THEN** the button shows a check-mark for a moment, then the pop-up closes and the period shows as requested

### Requirement: Reduced motion
When the visitor's device asks for reduced motion, view transitions, scroll-driven fades, the header shrink animation and the spotlight movement SHALL be skipped, and the content SHALL still appear at once.

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and the visitor changes theme
- **THEN** the new theme appears immediately, with no animation
