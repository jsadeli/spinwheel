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

- **Interactive Spin Wheel**: Click to spin and randomly select an option
- **Customizable Options**: Add, edit, or remove wheel segments
- **Single Page Application**: No server required, runs entirely in your browser
- **Easy to Use**: Simple and intuitive interface
- **Lightweight**: Built with vanilla HTML, CSS, and JavaScript

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
Pizza: 5
Burger: 1
Sushi: 1
Salad: 1
```

- Total Weight: `5 + 1 + 1 + 1 = 8`
- Pizza: Has 5/8 of the total wheel (approx 62% chance).
- Others: Each have 1/8 of the total wheel (approx 12.5% chance).
- If the user doesn't type a number (e.g., just "Ramen"), the system defaults that item's weight to 1.

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
git clone https://github.com/samuelkripto/spin-wheel.git
cd spin-wheel
# Open index.html in your browser
```

## License

This project is open source and available for personal and educational use.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you
want to contribute.
