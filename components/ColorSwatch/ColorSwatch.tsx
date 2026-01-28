import { colors, type ColorToken } from "@/lib/tokens/colors";

type ColorKey = keyof typeof colors;

interface ColorSwatchProps {
  colorKey?: ColorKey;
  color?: ColorToken;
}

export default function ColorSwatch({ colorKey, color }: ColorSwatchProps) {
  const colorData = color || colors[colorKey!];

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg sm:flex-row sm:items-center">
      {/* Color preview square */}
      <div
        className="h-16 w-16 shrink-0 rounded-lg border border-gray-200"
        style={{ backgroundColor: colorData.hex }}
        aria-label={`Color preview for ${colorData.name}`}
      />

      {/* Color information */}
      <div className="flex flex-1 flex-col gap-1">
        {/* Color name */}
        <h3 className="font-bold text-gray-900">{colorData.name}</h3>

        {/* Hex value */}
        <div className="font-mono text-sm text-gray-700">{colorData.hex}</div>

        {/* RGB values */}
        <div className="font-mono text-xs text-gray-600">
          {colorData.hex.length > 7
            ? `R:${colorData.rgb.r} G:${colorData.rgb.g} B:${colorData.rgb.b} A:${(
                parseInt(colorData.hex.substring(7), 16) / 255
              ).toFixed(2)}`
            : `R:${colorData.rgb.r} G:${colorData.rgb.g} B:${colorData.rgb.b}`}
        </div>
      </div>
    </div>
  );
}

