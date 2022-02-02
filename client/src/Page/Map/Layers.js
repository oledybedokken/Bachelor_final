//Hvergang vi skal ha 2 eller flere baller
export const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'stasjoner',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 500, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      
    }
  };
  //Dette er tallene som er inne i ballene
  export const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'stasjoner',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    }
  };
  
  //Per punkt
  export const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'stasjoner',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius':  10,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    }
  };
  