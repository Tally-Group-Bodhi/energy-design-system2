import ColorSwatch from "@/components/ColorSwatch/ColorSwatch";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import {
  colors,
  secondaryColors,
  semanticColors,
  dataVisualizationColors,
} from "@/lib/tokens/colors";

export default function ColourPage() {
  const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
  const secondaryColorKeys = Object.keys(secondaryColors) as Array<
    keyof typeof secondaryColors
  >;
  const semanticColorKeys = Object.keys(semanticColors) as Array<
    keyof typeof semanticColors
  >;
  const dataVizColorKeys = Object.keys(dataVisualizationColors) as Array<
    keyof typeof dataVisualizationColors
  >;

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      {/* Page Banner */}
      <PageBanner title="Colours" />

      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} defaultTab="design" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Description */}
        <div className="mb-12">
          <p className="max-w-3xl text-lg leading-7 text-gray-600">
            Our color system is designed to communicate energy, trust, and
            sustainability. Each color has been carefully selected to support
            clear visual hierarchy, accessibility, and brand consistency across
            all digital experiences.
          </p>
        </div>

        {/* Primary UI Palette Section */}
        <section className="mb-16 border-t border-gray-200 pt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
            Primary UI Palette
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colorKeys.map((colorKey) => (
              <ColorSwatch key={colorKey} colorKey={colorKey} />
            ))}
          </div>
        </section>

        {/* Secondary Colours Section */}
        <section className="mb-16 border-t border-gray-200 pt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
            Secondary Colours
          </h2>
          <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
            The secondary palette is a collection of bespoke, brand specific
            colours. Secondary colours are generally used for bespoke brand
            embellishment: headers, promos, charts, diagrams etc.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondaryColorKeys.map((colorKey) => (
              <ColorSwatch
                key={colorKey}
                color={secondaryColors[colorKey]}
              />
            ))}
          </div>
        </section>

        {/* Semantic Colours Section */}
        <section className="mb-16 border-t border-gray-200 pt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
            Semantic Colours
          </h2>
          <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
            Semantic colours communicate status and context through standardized
            meanings. Reserve these exclusively for alerts and messaging
            components—using them elsewhere dilutes their purpose and weakens
            the interface hierarchy.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {semanticColorKeys.map((colorKey) => (
              <ColorSwatch
                key={colorKey}
                color={semanticColors[colorKey]}
              />
            ))}
          </div>
        </section>

        {/* Data Visualization Colours Section */}
        <section className="mb-16 border-t border-gray-200 pt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
            Data Visualization Colours
          </h2>
          <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
            Categorical palette with solid, tint, and opacity variants. These
            colours are reserved for data visualisation (charts and graphs) only.
            The first 4 colours (A–D) should always be the first choice. The
            last 2 colours (E–F) are backup colours and must only be used as a
            last resort for charts that require more than 4 categories.
          </p>
          <div className="space-y-6">
            {/* Data A */}
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ColorSwatch color={dataVisualizationColors.dataASolid} />
                <ColorSwatch color={dataVisualizationColors.dataATint} />
                <ColorSwatch color={dataVisualizationColors.dataAOpacity} />
              </div>
            </div>

            {/* Data B */}
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ColorSwatch color={dataVisualizationColors.dataBSolid} />
                <ColorSwatch color={dataVisualizationColors.dataBTint} />
                <ColorSwatch color={dataVisualizationColors.dataBOpacity} />
              </div>
            </div>

            {/* Data C */}
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ColorSwatch color={dataVisualizationColors.dataCSolid} />
                <ColorSwatch color={dataVisualizationColors.dataCTint} />
                <ColorSwatch color={dataVisualizationColors.dataCOpacity} />
              </div>
            </div>

            {/* Data D */}
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ColorSwatch color={dataVisualizationColors.dataDSolid} />
                <ColorSwatch color={dataVisualizationColors.dataDTint} />
                <ColorSwatch color={dataVisualizationColors.dataDOpacity} />
              </div>
            </div>

            {/* Data E */}
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ColorSwatch color={dataVisualizationColors.dataESolid} />
                <ColorSwatch color={dataVisualizationColors.dataETint} />
                <ColorSwatch color={dataVisualizationColors.dataEOpacity} />
              </div>
            </div>

            {/* Data F */}
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ColorSwatch color={dataVisualizationColors.dataFSolid} />
                <ColorSwatch color={dataVisualizationColors.dataFTint} />
                <ColorSwatch color={dataVisualizationColors.dataFOpacity} />
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}

