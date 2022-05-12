export const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'weatherData',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 5, '#f1f075', 10, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        'circle-opacity':0.5
    }
};

export const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'weatherData',
    filter: ['has', 'point_count'],
    layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
    }
};

export const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'weatherData',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
    }
};