# Spin Wheel

An interactive spin wheel web application built as a single HTML page. This app allows users to
create customizable spinning wheels for random selection and decision making.

## About

This is a simple, lightweight spin wheel application that runs entirely in the browser. Perfect for
making random selections, choosing winners, or making decisions in a fun and interactive way.
Vibe coding a Spin Wheel app into existence with the assistance of Gemini 3 Pro...

Screenshot:

![ss](images/SCR-20251121-bnsa.png)

## Features

- ✨ Core Features
  - **Interactive Spin Wheel**: Click to spin and randomly select an option.
  - **Customizable Options**: Add, edit, or remove wheel segments.
  - **Easy to Use**: Simple and intuitive interface.
  - **Single Page Application**: No server required, runs entirely in your browser.
  - **Lightweight**: Built with vanilla HTML, CSS, and JavaScript.
  - **Physics-Based Wheel**: Realistic deceleration with a Damped Harmonic Oscillator physics.
  - **Weighted Probabilities**: Support for weighted items using `Item:Weight` syntax
    (e.g., `Pizza:10`) to increase winning chances.
  - **Interactive Pins**: 30 physical "pins" on the wheel edge that interact with the pointer
    (visual snapping and audio ticks).
  - **List Management**: Create, rename, delete, and auto save multiple distinct lists
    (e.g., "Lunch Options", "Daily Standup", "Movie Night").
  - **Progress**: Track your XP progress and level up. Earn points for every spin!
- 🎨 Visuals & UI
  - **3D Confetti**: Physics-based confetti engine with wind resistance, tumbling, and
    semi-transparent paper effects.
  - **Theme System**: Toggle between Auto (System), Light, and Dark modes.
  - **Responsive Design**: Fully optimized for mobile and desktop, with a "Single Page App" feel
    (no scrolling on desktop).
  - **Mystery Mode**: Toggle to hide item labels on the wheel ("?") for suspense.
  - **Interactive Power Meter**:
    - Tap-to-Spin: a quick click triggers an instant full-power spin.
    - Hold-to-Charge: Holding the button charges a power meter. Release to spin with the selected
      strength.
    - Visual Feedback: An animated ring fills up, changing color from blue to purple to red as power
      increases. The button shakes intensely at max power.
    - Overheating FX: Continuing to hold the button after full charge triggers an "Overheating"
      sequence.
  - **Wheel Color Editor**: Switch between default rainbow palette or define your own custom theme.
- 🤖 AI Integration (Gemini)
  - **AI List Generator**: Generate creative lists (e.g., "Dinner ideas") using the Sparkle button.
  - **AI Voice Announcer**: Optional Text-to-Speech announcement of the winner using Gemini's
    high-quality voices.
  - **Secure Settings**: Dedicated UI for managing and persisting the Gemini API Key.
- 🛠️ Utilities
  - **Persistence**: All settings (Inputs, History, Theme, API Key, Audio) are saved automatically
    to localStorage.
  - **History Tracking**: Logs winners with relative timestamps (e.g., "2 minutes ago") and exact
    ISO tooltips.
  - **PWA Support**: Installable as a standalone app on iOS and Android with custom icons and splash
    screen configuration.
  - **Share Functionality**: Export current lists via a shareable URL (Base64 encoded).

## Usage

1. Open the `index.html` file in your web browser
2. Add your custom options to the wheel
3. Click the spin button to make a random selection
4. The wheel will spin and land on one of your options

### Weighted Items

You can customize the probability of each item winning by assigning a weight.

- Format: `Item Name:Weight`
- Higher number = Larger slice on the wheel.
- If no number is specified, it defaults to 1.

Example:

```text
Pizza:5
Burger :1
Sushi:  1
Salad  :  1
```

- Total Weight: `5 + 1 + 1 + 1 = 8`
- Pizza: Has 5/8 of the total wheel (approx 62% chance).
- Others: Each have 1/8 of the total wheel (approx 12.5% chance).
- If the user doesn't type a number (e.g., just "Ramen"), the system defaults that item's weight to 1.

### AI features

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/api-keys).

## How It Works

The spin wheel uses HTML5 Canvas or CSS animations to create a smooth spinning effect.
Each segment of the wheel represents a different option, and the selection is made using a
randomization algorithm for fair results.

## Customization

You can customize:

- Theme (auto, light-mode, or dark-mode)
- Sound effects (on or off)
- Spin duration (quick 5s, normal 10s, or long 20s)
- Spin labels visibility (set it to hidden for a little bit of a "mystery" spin)

## Inspiration

This project is inspired by popular picker wheel websites like [PickerWheel.com](https://pickerwheel.com/),
bringing the same functionality in a simple, self-contained format.

## Getting Started

Simply clone this repository and open the HTML file in any modern web browser.
No installation or build process required.

```bash
git clone https://github.com/samuelkripto/spinwheel.git
cd spinwheel
```

Serve locally using python3:

```bash
python3 -m http.server
```

## License

This project is open source and available for personal and educational use.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you
want to contribute.
