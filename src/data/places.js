// The seven places of The Place Collection.
// status: 'preorder' (open now) | 'soon' (foreshadowed, not yet poured)
// x / y: position on the 1600 x 1200 map plane.
export const PREORDER_URL = '/pre-order';
export const PLACES = [
  {
    id: 'shrine', name: 'Shrine of Remembrance', status: 'preorder', price: 26,
    x: 860, y: 650, bg: '#2C187A', fg: '#FAD7CA', lx: 1010, ly: 870, short: 'Shrine of Remembrance', leaf: '#D95A25', wash: '#DAD5F2',
    place: 'The Shrine, St Kilda Rd, Melbourne',
    memory: 'A quiet hour on the steps, with something sweet on the air.',
    notes: 'Native frangipani · oud · sweet · woody', sub: 'with sandalwood & cedar',
    items: ['frangipani', 'oud', 'sandalwood', 'cedar'],
  },
  {
    id: 'hosier', name: 'Love Affair at Hosier', status: 'soon',
    x: 920, y: 285, bg: '#D61C55', fg: '#FFD310', lx: 930, ly: 385, short: 'The laneway', leaf: '#5A1A12', wash: '#F4CDD8',
    place: 'Hosier Lane, Melbourne CBD',
    memory: 'A lane, a late night, smoke still in your jacket.',
    teaser: 'Something is smouldering in the laneways.',
    notes: 'Woodsmoke · tobacco · ashy · mature', sub: 'with aged whiskey',
    items: ['woodsmoke', 'tobacco', 'whiskey'],
  },
  {
    id: 'morning', name: 'Melbourne Morning', status: 'soon',
    x: 1150, y: 225, bg: '#901B0B', fg: '#FAD7CA', lx: 560, ly: 250, short: 'The market', leaf: '#D95A25', wash: '#EBC9C0',
    place: '[Place to confirm]',
    memory: 'Wattleseed warmth before the city wakes up.',
    teaser: 'First tram, first light. Almost ready.',
    notes: 'Wattleseed · warmth · nutty', sub: '',
    items: ['wattle', 'seedpod', 'sun'],
  },
  {
    id: 'ocean', name: 'The Great Ocean Road', status: 'soon',
    x: 170, y: 930, bg: '#3A6E67', fg: '#FFA59F', lx: 190, ly: 930, short: 'The coast', leaf: '#D95A25', wash: '#CFE0DB',
    place: 'Great Ocean Road, Victoria',
    memory: 'Windows down, salt on everything.',
    teaser: 'A long drive west, and salt in the air.',
    notes: 'Sea salt · sage · breezy', sub: 'with jasmine & eucalyptus',
    items: ['salt', 'sage', 'eucalyptus', 'jasmine'],
  },
  {
    id: 'fed', name: 'Night Out at Fed Square', status: 'soon',
    x: 680, y: 415, bg: '#C3AFF3', fg: '#FAEDB0', lx: 1100, ly: 525, short: 'The square', leaf: '#5A1A12', wash: '#E4DBF7',
    place: 'Federation Square, Melbourne CBD',
    memory: 'Lime in the glass and the square still humming.',
    teaser: 'The square is still humming. Something zesty is brewing.',
    notes: 'Lime · coconut · zesty · creamy', sub: '',
    items: ['lime', 'coconut'],
  },
  {
    id: 'rain', name: "It's About to Rain", status: 'soon',
    x: 1230, y: 870, bg: '#6199C4', fg: '#C5DF00', lx: 1290, ly: 890, short: 'The gardens', leaf: '#5A1A12', wash: '#D3E3F2',
    place: '[Place to confirm]',
    memory: 'That earthy breath of air just before the sky breaks.',
    teaser: 'The sky is about to break. Not long now.',
    notes: 'Lemon · sandalwood · earthy · deep', sub: '',
    items: ['lemon', 'sandalwood', 'raindrops'],
  },
  {
    id: 'yarra', name: 'Yarra at Dusk', status: 'soon',
    x: 1320, y: 425, bg: '#EDBA4C', fg: '#E45417', lx: 1420, ly: 535, short: 'The river', leaf: '#5A1A12', wash: '#F6E1B6',
    place: 'The Yarra, Melbourne',
    memory: 'Eucalyptus on the breeze as the river goes gold.',
    teaser: 'The river is going gold. A gum tree is waiting.',
    notes: 'Eucalyptus · fern · fresh · crisp', sub: 'with herbs & sweet wildflower',
    items: ['eucalyptus', 'fern', 'wildflower'],
  },
];
