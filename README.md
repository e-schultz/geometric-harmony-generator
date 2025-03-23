
# Geometric Harmony Generator

![Geometric Harmony Generator](https://i.imgur.com/TPiemcT.png)

## Description

Geometric Harmony Generator is an interactive visual and audio experience that combines stunning geometric visualizations with synthesized audio. The application features various visualization modes that react to music, a built-in synthesizer for creating sounds, and a visual timer for productivity sessions. It's perfect for focus sessions, meditation, or simply enjoying the harmony between visual patterns and sound.

## Installation Instructions

### Prerequisites
- Node.js (v14.0 or higher)
- npm (v6.0 or higher)

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/geometric-harmony-generator.git
cd geometric-harmony-generator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage Instructions

### Visualization Controls

- **Visualization Type**: Choose between different visualization styles (tunnel, grid, polyhedron, particles, hexGrid) by clicking on the respective icon in the control panel at the bottom left.
- **Controls**: Access more detailed controls by clicking the slider icon in the bottom left corner.
  - Adjust speed, rotation, and perspective parameters
  - Toggle pulse effects
  - Modify line count and opacity

### Timer

- **Toggle Timer**: Show or hide the timer overlay using the button in the top right corner.
- **Set Duration**: Click the "Edit" button next to the timer duration to set your preferred time (1-120 minutes).
- **Timer Controls**: Use the Start/Pause and Reset buttons at the bottom of the screen to control the timer.

### Synthesizer

- **Access Synthesizer**: Click the music note icon on the left side to open the synthesizer panel.
- **Play/Stop Sequence**: Control the playback of the synthesizer pattern.
- **Adjust Parameters**: Modify BPM, frequency, filter settings, and ADSR envelope parameters using the sliders.
- **Pattern Sequencer**: Click on the grid squares to create patterns that will play when the sequencer is active.

## Features

- **Multiple Visualization Types**: Includes tunnel, grid, polyhedron, particles, and hexGrid visualizations.
- **Responsive Design**: Works on desktop and mobile devices with adaptive layouts.
- **Timer System**: Visual timer with customizable duration (1-120 minutes) that integrates with the visualization.
- **Synthesizer**: Built-in audio synthesizer with sequencer, filter controls, and ADSR envelope.
- **Visual Settings**: Extensive controls for customizing the visual experience.
- **Synchronized Audio-Visual Experience**: Visualizations can react to and synchronize with the audio.

## Technologies Used

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library for consistent UI elements
- **Web Audio API**: For synthesizer functionality
- **React Router**: For page routing
- **Canvas API**: For rendering visualizations

## Project Structure

```
/src
  /components          # UI components
    /controls          # Visualization control components
    /ui                # Reusable UI components
  /contexts            # React context providers
  /hooks               # Custom React hooks
  /lib                 # Utility functions and types
    /animations        # Visualization generators
    /waveGenerators    # Audio wave generation utilities
  /pages               # Application pages
  App.tsx              # Main application component
  main.tsx             # Application entry point
```

## Contributing

We welcome contributions to the Geometric Harmony Generator! Here's how you can contribute:

1. **Fork the repository** and create your branch from `main`.
2. **Make your changes** and ensure they follow the project's coding style.
3. **Write tests** for your changes if applicable.
4. **Create a pull request** with a detailed description of your changes.

### Bug Reports and Feature Requests

Please use the GitHub issues section to report bugs or request features. When reporting bugs, include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and operating system information

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Original Prompt

The original prompt that initiated this project:

> "Create a web application that generates geometric visuals that evolve over time, with controls to adjust parameters like speed, complexity, and color schemes. Include a mode where the visuals can react to audio input, and add a simple synthesizer so users can create sounds that the visuals will respond to. Also incorporate a visual timer system for productivity sessions, inspired by the Pomodoro technique but with a unique twist where the remaining time is represented through the geometric patterns."

## Troubleshooting

### Common Issues

1. **Visualizations not appearing**
   - Ensure your browser supports Canvas API
   - Try disabling hardware acceleration in your browser settings
   - Check for console errors and report them as issues

2. **Audio not working**
   - Make sure your browser allows audio autoplay
   - Check if your system volume is on
   - Try clicking anywhere on the page to enable audio context

3. **Performance issues**
   - Reduce the line count in the visualization settings
   - Disable pulse effects
   - Close other resource-intensive applications

### Getting Help

If you encounter issues not covered here, please create an issue on GitHub with a detailed description of your problem.

## Future Improvements

1. **Additional Visualization Types**: Implement more complex geometric patterns and effects.
2. **Audio Analysis**: More sophisticated audio analysis for better audio-visual synchronization.
3. **Preset System**: Allow users to save and share their favorite visualization and synthesizer configurations.
4. **Mobile App**: Develop a native mobile application version.
5. **VR Support**: Add virtual reality support for immersive experiences.
6. **Collaborative Mode**: Allow multiple users to control visualizations simultaneously.
7. **Export Functionality**: Option to export visualizations as videos or GIFs.
8. **Advanced Timer Features**: Add more timer modes, statistics, and productivity tools.

---

Made with ❤️ using [Lovable](https://lovable.dev)
