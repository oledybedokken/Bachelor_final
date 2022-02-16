export const heatmapLayer = {
    id: "heatmap",
    maxzoom:12,
    type: "circle",
    'paint': {
        'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            -10,
            '#000137',
            -5,
            '#02198B',
            0,
            '#fff',
            5,
            '#ffffe0',
            10,
            '#FFD580',
            15,
            '#FF8c00',
            30,
            '#7F3121'
        ],
        'circle-opacity': 0.75,
        'circle-radius':20,
    }
}