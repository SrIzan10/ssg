# ssg - Secret Santa Generator

A simple, no-fuzz Secret Santa participant pairing tool. Generate random pairings and share unique links with each participant to reveal their assignment.

## Features

- **Simple UI**: Clean, monochrome design with no rounded corners
- **Easy Setup**: Add participant names and generate pairings
- **Shareable Links**: Each participant gets a unique link to reveal their Secret Santa assignment
- **No Self-Pairing**: Ensures no one is assigned to themselves
- **Built with**: Nuxt 4, Vue 3, Nuxt UI, Tailwind CSS

## Getting Started

### Setup

Install dependencies:

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:

```bash
bun run build
```

Preview production build:

```bash
bun run preview
```

## How to Use

1. **Add Participants**: Enter the names of everyone participating in Secret Santa
2. **Generate Pairings**: Click "Generate Pairings" to create random assignments
3. **Share Links**: Copy each participant's unique link
4. **Send Links**: Share the link with each participant via email, message, etc.
5. **Reveal**: Participants click their link and reveal their assignment

## Design

- **Color Scheme**: Monochrome (zinc/black/white)
- **Radius**: 0 (no rounded corners)
- **UI Framework**: Nuxt UI
