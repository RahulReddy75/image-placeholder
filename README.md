# 🖼️ Dynamic Image Placeholder Service

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)

A modern, TypeScript-based image placeholder service similar to dummyimage.com. Generate dynamic placeholder images for your projects with customizable dimensions, colors, text, and styling options.

## ✨ Features

- 🎨 Generate custom-sized placeholder images on-the-fly
- 🌈 Customize background and text colors using HEX codes
- 📝 Add custom text with support for line breaks
- 🔄 Vertical text orientation option
- 🎯 Text styling options (bold, italic)
- 📏 Automatic text scaling to fit image dimensions
- ⚡ Fast image generation using SVG and Sharp
- 🔒 Type-safe with TypeScript
- 🚀 Built with modern Node.js and Express
- ✅ Input validation using Zod
- 💾 Efficient caching headers for performance

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/image-placeholder.git
   cd image-placeholder
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

The service will start at http://localhost:3001

## 📖 Usage

Generate placeholder images using query parameters. All parameters are optional except width and height.

### Basic Examples

1. Basic image with dimensions:

   ```
   http://localhost:3001?width=300&height=200
   ```

2. Custom background color:

   ```
   http://localhost:3001?width=300&height=200&bg=FF0000
   ```

3. Custom text and colors:

   ```
   http://localhost:3001?width=300&height=200&bg=FF0000&fg=FFFFFF&text=Hello
   ```

4. Multi-line text:

   ```
   http://localhost:3001?width=300&height=200&text=Hello\\nWorld
   ```

5. Styled text:
   ```
   http://localhost:3001?width=300&height=200&text=Hello&bold=true&fontSize=40
   ```

6. Different font sizes for lines:
   ```
   http://localhost:3001?width=300&height=300&text=Title\\nSubtitle\\nMore%20Text&fontSize=50&secondFontSize=25
   ```

### 🎨 Advanced Examples

1. Profile Picture Placeholder:

   ```
   http://localhost:3001?width=150&height=150&bg=2196F3&fg=FFFFFF&text=JP&bold=true
   ```

2. Banner Image with Multiple Lines:

   ```
   http://localhost:3001?width=1200&height=300&bg=212121&fg=FFFFFF&text=Welcome\\nto%20my%20website&fontSize=60&bold=true
   ```

3. Vertical Product Label:

   ```
   http://localhost:3001?width=100&height=300&bg=4CAF50&fg=FFFFFF&text=NEW%20ARRIVAL&vertical=true&bold=true
   ```

4. Error Image Placeholder:

   ```
   http://localhost:3001?width=400&height=300&bg=F44336&fg=FFFFFF&text=Image\\nNot\\nFound&bold=true
   ```

5. Card Image Placeholder:
   ```
   http://localhost:3001?width=300&height=200&bg=9C27B0&fg=FFFFFF&text=Card%20Title&italic=true
   ```

### 💡 Common Use Cases

1. **HTML Image Tag**:

   ```html
   <img src="http://localhost:3001?width=300&height=200&text=Product" alt="Product placeholder" />
   ```

2. **CSS Background**:

   ```css
   .hero-banner {
     background-image: url('http://localhost:3001?width=1200&height=400&text=Hero');
   }
   ```

3. **React Component**:

   ```jsx
   function Placeholder({ width, height, text }) {
     return (
       <img src={`http://localhost:3001?width=${width}&height=${height}&text=${text}`} alt={text} />
     );
   }
   ```

4. **Next.js Image Component**:

   ```jsx
   import Image from 'next/image';

   function Placeholder() {
     return (
       <Image
         src="http://localhost:3001?width=300&height=200&text=Next.js"
         width={300}
         height={200}
         alt="Placeholder"
       />
     );
   }
   ```

5. **Markdown Usage**:
   ```markdown
   ![Placeholder](http://localhost:3001?width=600&height=300&text=Blog%20Header)
   ```

### API Parameters

| Parameter      | Type    | Description                           | Default         |
| -------------- | ------- | ------------------------------------- | --------------- |
| width          | number  | Image width in pixels                 | Required        |
| height         | number  | Image height in pixels                | Required        |
| bg             | string  | Background color (HEX without #)      | 000000          |
| fg             | string  | Text color (HEX without #)            | FFFFFF          |
| text           | string  | Custom text (use \\n for line breaks) | width×height    |
| vertical       | boolean | Display text vertically               | false           |
| bold           | boolean | Display text in bold                  | false           |
| italic         | boolean | Display text in italic                | false           |
| fontSize       | number  | Custom font size in pixels            | Auto-calculated |
| secondFontSize | number  | Font size for all lines after the first line | Same as fontSize |

## 🛠️ Development

Available commands:

- \`yarn dev\` - Start development server with hot reload
- \`yarn build\` - Build for production
- \`yarn start\` - Start production server
- \`yarn lint\` - Run ESLint
- \`yarn format\` - Format code with Prettier
- \`yarn test\` - Run tests
- \`yarn clean\` - Clean build directory

## 🏗️ Project Structure

```
src/
├── routes/          # HTTP request handling
│   └── placeholder.routes.ts
├── services/        # Business logic
│   └── placeholder.service.ts
└── index.ts         # App entry point
```

## 🔧 Technical Details

- Built with TypeScript for type safety
- Uses Express.js for routing and request handling
- Sharp for efficient image processing
- SVG-based image generation for crisp results
- Zod for runtime type checking and validation
- Modern ES6+ features and best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [dummyimage.com](https://dummyimage.com)
- Built with [Sharp](https://sharp.pixelplumbing.com/)
- Powered by [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)

## 📚 Keywords

image placeholder, dynamic images, placeholder service, typescript, node.js, express.js, sharp, svg, development tools, placeholder generator, image generation, dummy image, mock image, testing images, placeholder graphics, web development tools

## 🔗 Related Projects

- [Sharp](https://sharp.pixelplumbing.com/) - High performance Node.js image processing
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
