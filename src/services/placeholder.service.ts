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
  } = params;

  // Calculate optimal font size
  const finalFontSize = calculateFontSize(text, width, height, fontSize);
  const lines = text.split('\\n');
  const lineHeight = finalFontSize * 1.2; // Add some spacing between lines

  // Create tspan elements for each line
  const textElements = lines
    .map(
      (line, index) => `
    <tspan 
      x="50%" 
      dy="${index === 0 ? -((lines.length - 1) * lineHeight) / 2 : lineHeight}px"
      textLength="${width * 0.9}"
      lengthAdjust="spacingAndGlyphs"
    >${line}</tspan>
  `
    )
    .join('');

  // Create SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bg}"/>
      <text
        x="50%"
        y="50%"
        font-family="'Noto Sans', 'Helvetica Neue', Arial, sans-serif"
        font-size="${finalFontSize}px"
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
