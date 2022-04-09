export const InntektFill = {
  id: 'InntektFill',
  source: "inntektData",
  type: 'fill',
  filter: ["has", "percentile"],
  paint: {
    'fill-color': [
      "interpolate",
      ["exponential", 1],
      ["get", "percentile"],
      0,
      "hsl(0, 100%, 24%)",
      20,
      "hsl(4, 100%, 40%)",
      40,
      "hsl(11, 91%, 49%)",
      60,
      "hsl(16, 99%, 59%)",
      80,
      "hsl(21, 100%, 67%)",
      100,
      "hsl(29, 100%, 74%)"
    ],
    'fill-opacity': 1,
  }
}
export const InntektLine = {
  id: "lines",
  source: "inntektData",
  type: 'line',
  layout: {
    'line-cap': "butt"
  },
  filter: ["has", "percentile"],
  paint: {
    'line-color': [
      "interpolate",
      ["exponential", 1],
      ["get", "percentile"],
      0,
      "hsl(0, 100%, 17%)",
      1,
      "hsl(4, 100%, 28%)",
      2,
      "hsl(11, 91%, 34%)",
      4,
      "hsl(16, 99%, 41%)",
      6,
      "hsl(21, 100%, 47%)",
      8,
      "hsl(29, 100%, 52%)"
    ],
    'line-opacity': 0.8,
    'line-width': 0.8
  }
} 
export const InntektSymbol = {
  id: "symbol",
  source: "inntektData",
  type: 'symbol',
  filter: ["has", "percentile"],
  layout: {
    "text-field": ["get", "value"],
    "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
    "text-size": 12,
    "text-padding": [
      "interpolate",
      ["linear"],
      ["zoom"],
      1,
      20,
      7,
      40,
      9,
      100
    ]
  },
  paint: {
    "text-color": "hsl(0, 0%, 100%)",
    "text-halo-color": "hsl(0, 0%, 0%)",
    "text-halo-width": 1,
    "text-halo-blur": 0.5
  }
}