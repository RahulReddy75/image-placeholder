import sharp from 'sharp';
import { z } from 'zod';

// Validation schema for query parameters
const QuerySchema = z.object({
  width: z.string().regex(/^\d+$/).transform(Number),
  height: z.string().regex(/^\d+$/).transform(Number),
  bg: z
    .string()
    .regex(/^[0-9A-Fa-f]{6}$/)
    .optional(),
  fg: z
    .string()
    .regex(/^[0-9A-Fa-f]{6}$/)
    .optional(),
  text: z.string().optional(),
  vertical: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  bold: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  italic: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  fontSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  secondFontSize: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export interface PlaceholderParams {
  width: number;
  height: number;
  bg?: string;
  fg?: string;
  text?: string;
  vertical?: boolean;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  secondFontSize?: number;
}

function calculateFontSize(
  text: string,
  width: number,
  height: number,
  userFontSize?: number
): number {
  if (userFontSize) return userFontSize;

  const lines = text.split('\\n');
  const maxLineLength = Math.max(...lines.map((line) => line.length));

  // Calculate available space
  const availableWidth = width * 0.9; // Use 90% of width
  const availableHeight = height * 0.9; // Use 90% of height

  // Estimate font size based on space and text length
  const estimatedFontSizeByWidth = availableWidth / (maxLineLength * 0.6); // 0.6 is an approximation for character width
  const estimatedFontSizeByHeight = availableHeight / (lines.length * 1.2); // 1.2 for line height

  // Use the smaller of the two estimates to ensure text fits both dimensions
  return Math.min(
    estimatedFontSizeByWidth,
    estimatedFontSizeByHeight,
    Math.min(width, height) / 5 // Cap at 20% of smallest dimension
  );
}

export async function generatePlaceholderImage(params: PlaceholderParams): Promise<Buffer> {
  const {
    width,
    height,
    bg = '000000',
    fg = 'FFFFFF',
    text = `${width}×${height}`,
    vertical = false,
    bold = false,
    italic = false,
    fontSize,
    secondFontSize,
  } = params;

  // Calculate optimal font size
  const finalFontSize = calculateFontSize(text, width, height, fontSize);
  const lines = text.split('\\n');

  // Calculate the heights of each line
  const lineHeights = lines.map((_, index) => {
    const size = index > 0 && secondFontSize ? secondFontSize : finalFontSize;
    // Using a smaller multiplier for line height
    return size * (index === 0 ? 1.0 : 0.8); // Reduced spacing, especially for second line
  });

  // Create tspan elements for each line
  const textElements = lines
    .map((line, index) => {
      // Use secondFontSize for any line after the first (index > 0) if provided
      const lineSize = index > 0 && secondFontSize ? secondFontSize : finalFontSize;

      // Calculate the dy attribute for vertical positioning
      let dy;
      if (index === 0) {
        // First line: Position at 10% from the top
        dy = `${height * 0.10}px`;
      } else {
        // Calculate spacing dynamically based on font size difference
        const sizeDifference = finalFontSize / (secondFontSize || finalFontSize);
        // Find a more balanced spacing - moderate gap that's not too large or small
        const spacingFactor = sizeDifference > 4 ? 0.3 : 0.4;
        dy = `${lineHeights[index - 1] * spacingFactor}px`;
      }

      return `
    <tspan 
      x="50%" 
      dy="${dy}"
      textLength="${width * 0.9}"
      lengthAdjust="spacingAndGlyphs"
      font-size="${lineSize}px"
    >${line}</tspan>
  `;
    })
    .join('');

  // Create SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bg}"/>
      <text
        x="50%"
        y="50%"
        font-family="'Noto Sans', 'Helvetica Neue', Arial, sans-serif"
        fill="#${fg}"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(${vertical ? 90 : 0}, ${width / 2}, ${height / 2})"
        font-weight="${bold ? 'bold' : 'normal'}"
        font-style="${italic ? 'italic' : 'normal'}"
      >
        ${textElements}
      </text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

export function validateParams(query: unknown): PlaceholderParams {
  return QuerySchema.parse(query);
}
