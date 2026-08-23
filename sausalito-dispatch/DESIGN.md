# Design System

## Direction

Mediterranean Day Ticket: a perforated Riviera ferry ticket rebuilt as a live mobile coordinator.

## Color

- Cobalt: `oklch(42% 0.19 258)`
- Deep cobalt: `oklch(29% 0.13 258)`
- Ticket ivory: `oklch(96% 0.025 88)`
- Paper shadow: `oklch(83% 0.035 88)`
- Signal coral: `oklch(54% 0.20 29)`
- Lemon: `oklch(86% 0.17 93)`
- Pine ink: `oklch(33% 0.08 158)`

## Typography

- Display and timings: Barlow Condensed, 600 to 800
- Body and controls: Libre Franklin, 400 to 700
- Human note: Kalam, 400 to 700

## Layout

A single continuous ticket sits in a cobalt field. Its perforated spine is the route. On mobile, the ticket is one vertical journey; on wider screens, dispatch and route become two coordinated columns without losing sequence.

## Components

- Live departure board with tabular time
- Segmented wait selector with custom numeric input
- Ticket stops connected by a continuous route line
- Punched circular sequence markers
- Solid map-action buttons with explicit destinations
- Compact status strip for six-person split

## Motion

State only. The departure time crossfades and shifts a few pixels when recalculated. Buttons depress on tap. Reduced-motion users receive immediate changes.
