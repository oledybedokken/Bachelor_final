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
      "#a7d5ed",
      2,
      "#a7d5ed",
      20,
      "#c23728",
      30,
      "#e14b31",
      40,
      "#de6e56",
      50,
      "#e1a692",
      60,
      "#e2e2e2",
      70,
      "#a7d5ed",
      80,
      "#63bff0",
      90,
      "#22a7f0",
      100,
      "#1984c5"
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
      "#111111",
    ],
    'line-opacity': 0.5,
    'line-width': 0.5
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