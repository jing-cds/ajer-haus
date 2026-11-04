// Events and social links. Edit here; the Home and Events pages read from this file.
export const SOCIAL = {
  instagram: 'https://instagram.com/ajerhaus',
  tiktok: 'https://tiktok.com/@ajerhaus',
};

// Set to an object to switch the "next event" state on, e.g.
// { name: 'Scent Story: Book 2', when: 'Sunday 14 February', where: 'Melbourne CBD', price: '$45', url: 'https://...' }
export const NEXT_EVENT = null;

export const HUMANITIX_URL = 'https://events.humanitix.com/ajerhaus-the-scent-stories';

// The first story, told in two chapters. Each chapter is its own event card.
export const STORY = {
  title: 'Scent Story: The Place',
  book: 'Book 1',
  when: 'Sunday 20 September 2026',
  where: 'Assembly Hall at Boyd Community Hub, 207 City Rd, Southbank',
  intro: 'The first Ajer Haus Scent Story. A free scent party where we explored how scent connects us to places, memories and each other. Two 40-minute chapters of smelling, solving scent ciphers and, at the end, making a personalised scent ball to take home.',
  facts: ['Free event', 'Limited spots', 'Registration required', 'No experience needed'],
  url: HUMANITIX_URL,
};

// Which candle belongs to which story (candle id -> story). CONFIRM: assumed Shrine of Remembrance.
export const STORY_FOR_CANDLE = { shrine: 'the-place' };
STORY.id = 'the-place';
STORY.candle = 'shrine';

export const PAST_EVENTS = [
  {
    id: 'chill',
    name: 'The Chill Chapter',
    time: '7:30 – 8:20pm',
    tag: 'A slower, more relaxed exploration of scent.',
    body: 'Conversations, sensory prompts and a little scent experimentation, exploring the memories and places certain smells bring to mind. You finish by creating a personalised mini scent ball to take home as a small souvenir.',
    poster: '/events/chill-poster.jpg',
    alt: 'Scent Story poster in blue watercolour lettering: a scent party, Sunday September 20, 2026, Assembly Hall at Boyd Community Hub',
    accent: '#6199C4',
  },
  {
    id: 'intense',
    name: 'The Intense Chapter',
    time: '8:45 – 9:35pm',
    tag: 'For those who like a little mystery.',
    body: 'A fast-paced, gamified scent experience: decode clues, test your nose and crack the scent code to make your way through the story. At the end, you also create a personalised mini scent ball to take home.',
    poster: '/events/intense-poster.jpg',
    alt: 'Scent Story poster: join us for the first Ajer Haus Scent Story on Sunday September 20th, plum circle on lilac floral pattern',
    accent: '#2C187A',
  },
];

// Photos from past stories. Drop images into /public/events/gallery/ and list them here
// ({ src, alt }). Keep it to the best 6 to 9; the rest can live on Instagram and TikTok.
export const GALLERY = [];

// Upcoming events (Scent Stories and, later, candle-making workshops). Empty = nothing on sale.
// { type: 'story' | 'workshop', name, line, date: '2027-02-14', time, where, price, spots, url }
export const UPCOMING = [];

// Layout preview for the events page. Placeholder content only; hide with SHOW_PREVIEW = false.
export const SHOW_PREVIEW = true;
export const PREVIEW = {
  type: 'workshop',
  name: '[Candle-making workshop name]',
  line: '[One line on what you make and the place it is inspired by.]',
  month: '[MON]',
  day: '[00]',
  time: '[Time]',
  where: '[Venue, Melbourne]',
  price: '[Price]',
  spots: '[Spots]',
};

export const FORMATS = [
  {
    id: 'stories',
    name: 'Scent Stories',
    line: 'Evenings where a place, a memory and a scent meet in the room.',
    body: 'Free scent parties told in chapters: smell, solve scent ciphers and take home a scent ball.',
    status: 'None live',
    facts: [['Format', 'Evening, in chapters'], ['Price', 'Free so far'], ['Take home', 'A personalised scent ball']],
    cta: { label: 'See past stories', href: '#past' },
  },
  {
    id: 'workshops',
    name: 'Candle-making workshops',
    line: 'Pour your own candle, in a small group, with us.',
    body: 'Hands-on evenings where you make a candle and learn the craft behind The Place Collection. Details are still being planned.',
    status: 'In planning',
    facts: [['Length', '[To be confirmed]'], ['Group size', '[To be confirmed]'], ['Take home', 'Your own candle [to confirm]'], ['Price', '[To be confirmed]']],
    form: true,
  },
];
