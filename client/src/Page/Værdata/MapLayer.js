export const WeatherLayer = {
    id: "heatmap",
    maxzoom:12,
    type: "circle",
    'paint': {
        'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'percentile'],
            -3,
            '#000137',
            -2,
            '#02198B',
            0,
            '#fff',
            1,
            '#ffffe0',
            2,
            '#FFD580',
            3,
            '#FF8c00',
            5,
            '#7F3121'
        ],
        'circle-opacity': 0.75,
        'circle-radius':20,
    }
}