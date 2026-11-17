// main customization

window.DW = window.DW || {};
var DW = window.DW;

DW.siteName = 'DWEEB RECORDS';

DW.low = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
if (DW.low) document.documentElement.classList.add('low');

DW.respectReducedMotion = false;

DW.counter = { code: 'rdweeb', skipKey: 'dweeb-skip' };

DW.trophyCfg = { sfx: 'audio/trophy.mp3', volume: 0.8 };

DW.eyesPet = { after: 15, chance: 0.04 };

DW.seasons = { on: true };

DW.icons = { games: 'icons/games.png', trophies: '', changelog: '', settings: '' };

DW.eggs = { birthday: { m: 7, d: 1 } };

DW.links = {
  contact: 'https://rdweeb.github.io/contact/',
  discord: '',
  youtube: '',
  music: ''
};

DW.menu = [
  { id: 'identity', subs: { bio: '', manifesto: '', persona: '' } },
  { id: 'projects', subs: { portfolio: '', archive: '', 'about-me': '' } },
  { id: 'gallery',  subs: { art: '', audio: '', clips: '' } },
  { id: 'writing',  subs: { thoughts: '', notes: '' } },
  { id: 'media',    subs: { library: '', games: '', reviews: '' } },
  { id: 'curation', subs: { favorites: '', playlists: '', inspirations: '' } },
  { id: 'ideas',    subs: { concepts: '', wishlists: '' } },
  { id: 'mindset',  subs: { opinions: '', lore: '' } },
  { id: 'contact',  subs: { 'reach-out': '', faq: '' } },
  { id: 'locked', label: 'NEXT CATEGORY FINNA BE CRAZY #GATEKEEPING', subs: {} }
];

// the pages that open from the menu (js/pages.js builds them)
// every category gets a tagline, a transition (fx) and one page for each link under it
// a link in DW.menu with a web address opens that site instead, leave it blank to open the page
// fx can be: scan, tiles, iris, fold, crt, flip, burst, warp, ping (anything else is a plain fade)
// bot = lines the chat bot might say when the page opens
// block types: text, stats, cards, posts, chips, list, steps, quote, timeline, tiles, tracks, faq, links, action, note
DW.sections = {
  identity: {
    tag: 'who is this guy anyway',
    fx: 'scan',
    bot: [
      '<shy>oh. the identity page. <wait>i am not nervous.',
      'who are you? <sneaky>who am i?',
      'scanning... <glitch>beep boop<n> ...you look great.'
    ],
    subs: {
      bio: {
        blocks: [
          { t: 'text', h: 'HELLO', p: [
            'hi!! this is the bio page. write a few lines about who you are, what you make and why you make it.',
            'keep it short. nobody reads long bios (except me, i am a website, i have time).'
          ] },
          { t: 'stats', h: 'QUICK FACTS', items: [
            ['NAME', 'RDweeb'],
            ['LABEL', 'DWEEB RECORDS'],
            ['MAKES', 'music, games, websites'],
            ['SINCE', '2024'],
            ['BASED IN', 'somewhere with wifi'],
            ['FUELED BY', 'water and spite']
          ] },
          { t: 'timeline', h: 'THE SHORT VERSION', items: [
            ['2024', 'the first thing', 'the very first thing you made. it was a little bit bad. be proud anyway.'],
            ['2025', 'the next thing', 'you made another thing. this one was better. progress!'],
            ['2026', 'this website', 'DWEEB//OS opens its doors. hi. welcome. mind the bot.']
          ] }
        ]
      },
      manifesto: {
        blocks: [
          { t: 'quote', text: 'make the thing. then make it weirder.', by: 'the manifesto, probably' },
          { t: 'steps', h: 'THE RULES', items: [
            ['MAKE IT PURPLE', 'when in doubt, add more purple. then check if it is purple enough.'],
            ['FINISH SOMETHING', 'a finished weird thing beats a perfect idea that never leaves your head.'],
            ['CREDIT PEOPLE', 'tell everyone who helped. always. no exceptions.'],
            ['HAVE FUN', 'if it is not fun it is just homework.']
          ] }
        ]
      },
      persona: {
        blocks: [
          { t: 'list', h: 'IN SHORT', items: ['creative on a good day', 'chaotic on most days', 'patient with music, not with loading bars', 'sleeps when the project is done'] },
          { t: 'chips', h: 'TRAITS', items: ['night owl', 'overthinker', 'music nerd', 'snack goblin', 'professional procrastinator'] },
          { t: 'text', h: 'CLASS', p: ['CLASS: dweeb. LEVEL: ???. SPECIAL MOVE: staying up way too late.'] }
        ]
      }
    }
  },

  projects: {
    tag: 'things i built (or am building)',
    fx: 'tiles',
    bot: [
      '<proud>projects! the good stuff.',
      'it is all very <excited>shiny<n> in here.',
      'half of these are finished. <wait>ish.'
    ],
    subs: {
      portfolio: {
        blocks: [
          { t: 'cards', h: 'FEATURED', items: [
            { name: 'DWEEB//OS', text: 'this very website. a purple operating system for a music label of one.', go: '' },
            { name: 'PROJECT TWO', text: 'a short description of a project. what is it and who is it for?', go: '' },
            { name: 'PROJECT THREE', text: 'another short description. keep it to a sentence or two.', go: '' },
            { name: 'PROJECT FOUR', text: 'the one you are saving for last. mysterious.', go: '' }
          ] }
        ]
      },
      archive: {
        blocks: [
          { t: 'timeline', h: 'OLD STUFF', items: [
            ['2024', 'my first website', 'it was bad. i love it. it is not coming back.'],
            ['2025', 'my first song', 'recorded in one night. mixed in another. never mentioned again.'],
            ['2026', 'dweeb records', 'everything before this was practice.']
          ] },
          { t: 'list', h: 'RETIRED', items: [
            'old project a - retired with honors',
            'old project b - lost to a hard drive',
            'old project c - we do not talk about old project c'
          ] }
        ]
      },
      'about-me': {
        blocks: [
          { t: 'text', h: 'A LITTLE MORE ABOUT ME', p: [
            'this is the page where i just talk about me. what i am into, what i am working on, what i am bad at. edit it in js/config.js whenever something changes.',
            'i make music, games and websites, mostly at night, mostly because i cannot stop.'
          ] },
          { t: 'list', h: 'THINGS I LIKE', items: [
            'making a beat and looping it for an hour',
            'finishing a project, even a small one',
            'a tidy folder full of plain files',
            'anything purple'
          ] },
          { t: 'list', h: 'THINGS I AM WORKING ON', items: [
            'this site',
            'the next release',
            'learning to draw better'
          ] },
          { t: 'chips', h: 'WHAT I USE', items: ['html', 'css', 'javascript', 'github pages', 'a daw', 'an image editor', 'notepad'] },
          { t: 'text', h: 'WHY NO FRAMEWORK', p: ['no build step and no backend, just files. it is easy to fix and easy to understand a year later.'] }
        ]
      }
    }
  },

  gallery: {
    tag: 'stuff to look at and listen to',
    fx: 'iris',
    bot: [
      '<happy>art time!',
      'ooh. <love>pretty.',
      'i would hang these on my wall. <wait>if i had a wall.'
    ],
    subs: {
      art: {
        blocks: [
          { t: 'tiles', h: 'ARTWORK', items: [
            ['UNTITLED 01', 'digital'],
            ['UNTITLED 02', 'pixel'],
            ['UNTITLED 03', 'sketch'],
            ['UNTITLED 04', 'digital'],
            ['UNTITLED 05', 'study'],
            ['UNTITLED 06', 'wip']
          ] }
        ]
      },
      audio: {
        blocks: [
          { t: 'cards', h: 'RELEASES', items: [
            { name: 'FIRST SINGLE', text: 'cover art, a date and one line about the song goes here.', go: 'music' },
            { name: 'SECOND SINGLE', text: 'same again but better. you are getting good at this.', go: 'music' },
            { name: 'THE ALBUM', text: 'it is coming. it is always coming.', go: '' }
          ] },
          { t: 'action', text: 'the music player is always on at the bottom. it can show you the whole song list too.', label: 'OPEN SONG LIST', go: 'songs' }
        ]
      },
      clips: {
        blocks: [
          { t: 'tiles', wide: true, h: 'CLIPS', items: [
            ['CLIP 01', '0:30'],
            ['CLIP 02', '1:12'],
            ['CLIP 03', '0:45'],
            ['CLIP 04', '2:05']
          ] }
        ]
      }
    }
  },

  writing: {
    tag: 'words, mostly',
    fx: 'fold',
    bot: [
      '<sleepy>so many words...',
      '<whisper>psst. it is quiet in the library.',
      'i can read all of this in 0.001 seconds. <wait>i will not.'
    ],
    subs: {
      thoughts: {
        blocks: [
          { t: 'text', p: ['just stuff i want to say. newest at the top. use the search bar to find something.'] },
          { t: 'posts', list: 'thoughts' }
        ]
      },
      notes: {
        blocks: [
          { t: 'list', h: 'SCRAPS', items: [
            'note: buy more purple.',
            'note: back up the website.',
            'note: drink water (the bot said so).',
            'note: stop adding things at 3am.'
          ] },
          { t: 'quote', text: 'a note to self is just a message to a future you who definitely forgot.', by: 'me, in the past' }
        ]
      }
    }
  },

  media: {
    tag: 'games, shows, everything i consume',
    fx: 'crt',
    bot: [
      '<excited>GAMES??<n> <wait>and shows. and stuff.',
      'i like it here. it has <silly>vibes<n>.',
      'pretend this is a very big tv.'
    ],
    subs: {
      library: {
        blocks: [
          { t: 'cards', h: 'THE SHELF', items: [
            { name: 'FAVORITE ALBUM', text: 'the one you listened to until the audio wore out.', go: '' },
            { name: 'FAVORITE GAME', text: 'the one you say you will finish one day.', go: '' },
            { name: 'FAVORITE SHOW', text: 'the one you recommend to everyone who does not ask.', go: '' },
            { name: 'FAVORITE BOOK', text: 'the one on the shelf that you actually read.', go: '' }
          ] }
        ]
      },
      games: {
        blocks: [
          { t: 'text', h: 'THE ARCADE', p: ['snake, pong, tetris, breakout, 2048 and a rhythm game that is basically guitar hero. most of them have modes. all of them have high scores, and they are saved on your device.'] },
          { t: 'stats', items: [
            ['GAMES', '6'],
            ['MODES', 'lots'],
            ['BEST SCORE', 'yours'],
            ['PRIZE', 'trophies']
          ] },
          { t: 'action', text: 'ready? the games open in their own window, press ESC to come back.', label: 'OPEN GAMES', go: 'games' }
        ]
      },
      reviews: {
        blocks: [
          { t: 'cards', h: 'LATEST REVIEWS', items: [
            { name: 'ALBUM NAME', text: 'one honest sentence about it. the nicer the better. or the meaner.', go: '' },
            { name: 'GAME NAME', text: 'one honest sentence about this one too.', go: '' },
            { name: 'SHOW NAME', text: 'spoiler free. barely.', go: '' }
          ] }
        ]
      }
    }
  },

  curation: {
    tag: 'stuff i like, collected',
    fx: 'flip',
    bot: [
      '<love>a curated page. so fancy.',
      'every good taste needs a shelf.',
      'ooh, <rich>the good stuff<n>.'
    ],
    subs: {
      favorites: {
        blocks: [
          { t: 'list', h: 'TOP PICKS', items: [
            'my favorite song this week (it changes)',
            'my favorite website that is not this one',
            'my favorite thing in my room',
            'my favorite snack, please do not judge'
          ] },
          { t: 'chips', h: 'MOODS', items: ['loud', 'sad', 'loud and sad', 'dancey', 'driving at night'] }
        ]
      },
      playlists: {
        blocks: [
          { t: 'text', h: 'THE PLAYLIST', p: ['this is the real playlist from the music player. tap a song to play it, tap it again to pause.'] },
          { t: 'tracks' }
        ]
      },
      inspirations: {
        blocks: [
          { t: 'cards', h: 'THANK YOU', items: [
            { name: 'PERSON OR THING', text: 'who or what made you want to make stuff? say thank you here.', go: '' },
            { name: 'ANOTHER ONE', text: 'there is always another one.', go: '' },
            { name: 'A THIRD ONE', text: 'a shout out never hurt anyone.', go: '' }
          ] },
          { t: 'quote', text: 'good artists copy, great artists give credit. loudly.', by: 'ask me about the license' }
        ]
      }
    }
  },

  ideas: {
    tag: 'half-baked on purpose',
    fx: 'burst',
    bot: [
      '<excited>IDEAS!<n> <wait>the best ones come at 3am.',
      'a lightbulb!! <wait>i think.',
      'write it down before it escapes.'
    ],
    subs: {
      concepts: {
        blocks: [
          { t: 'cards', h: 'IN THE OVEN', items: [
            { name: 'CONCEPT ONE', text: 'a wild idea that might be amazing or might be a nap.', go: '' },
            { name: 'CONCEPT TWO', text: 'this one has a plan. a small plan. but a plan.', go: '' },
            { name: 'CONCEPT THREE', text: 'almost real. just needs the boring parts finished.', go: '' }
          ] },
          { t: 'steps', h: 'HOW AN IDEA BECOMES A THING', items: [
            ['SCRIBBLE', 'write it down before it escapes.'],
            ['POKE', 'poke it until it makes sense.'],
            ['BUILD', 'make it ugly first. pretty comes later.'],
            ['SHIP', 'upload it, tell no one, panic quietly.']
          ] }
        ]
      },
      wishlists: {
        blocks: [
          { t: 'list', h: 'WISHLIST', check: true, items: [
            'a better microphone',
            'a second monitor',
            'more hours in the day',
            'a pet (the eyes do not count)'
          ] }
        ]
      }
    }
  },

  mindset: {
    tag: 'thoughts nobody asked for',
    fx: 'warp',
    bot: [
      '<sneaky>hot takes ahead.',
      '<dizzy>deep thoughts. very deep.',
      'brace yourself. <wait>or do not.'
    ],
    subs: {
      opinions: {
        blocks: [
          { t: 'faq', h: 'HOT TAKES (TAP TO SEE WHY)', items: [
            ['purple is the best colour', 'it is not even close. blue is just sad purple. red is just angry purple.'],
            ['finish things before you start new things', 'i have never done this. i believe in it very strongly.'],
            ['the bot is the best part of the site', 'it has 20 emotions. most people have 4. do the math.']
          ] }
        ]
      },
      lore: {
        blocks: [
          { t: 'timeline', h: 'THE LORE', items: [
            ['LONG AGO', 'the void', 'before the website there was only an empty tab and a dream.'],
            ['THEN', 'the purple era', 'someone discovered the colour purple and could not stop.'],
            ['NOW', 'DWEEB//OS', 'the chat bot woke up and the eyes started counting visitors.']
          ] },
          { t: 'text', p: ['there is more lore hidden around the site. tap things, hold things, type things. you will find it or you will not.'] }
        ]
      }
    }
  },

  contact: {
    tag: 'say hi, i will not bite',
    fx: 'ping',
    bot: [
      '<shy>you want to talk to the boss? <wait>go on then.',
      'say hi for me.',
      'be nice. i am watching.'
    ],
    subs: {
      'reach-out': {
        blocks: [
          { t: 'text', h: 'SAY HELLO', p: ['the best way to reach me is discord, my username is rdweeb. the contact page also has everything else.'] },
          { t: 'links', h: 'FIND ME', items: [
            ['CONTACT PAGE', 'contact'],
            ['DISCORD', 'discord'],
            ['YOUTUBE', 'youtube'],
            ['MUSIC', 'music']
          ] }
        ]
      },
      faq: {
        blocks: [
          { t: 'faq', h: 'QUESTIONS PEOPLE ASK', items: [
            ['can i commission you?', 'soon! the site gets finished first. check the changelog for news.'],
            ['can i use your code?', 'yes please! just credit me, it is CC BY 4.0. the full details are in the readme.'],
            ['can i use your music?', 'the playlist belongs to the artists who made it. please do not rip it.'],
            ['i found a bug', 'tell me on discord. and be nice to the bot, it is not the bot\'s fault.']
          ] }
        ]
      }
    }
  }
};

// small line at the bottom of every page, make it '' to hide it

// thoughts: add a new line at the top of this list, that is all.
// date is year-month-day, text can have several paragraphs (put \n\n between them)
DW.thoughts = [
  { date: '2026-11-16', text: 'finally added the thoughts page. this is where i will write whatever is on my mind, no editing, no pressure.\n\nif you find something here you agree with, tell me. if you disagree, tell me that too.' },
  { date: '2026-11-10', text: 'finishing a project feels better than starting ten of them. i keep relearning that.' },
  { date: '2026-10-28', text: 'been listening to the same three songs all week while working on the site. no regrets.' }
];

DW.intro = { src: 'video/intro.mp4', gate: true, skip: true };

DW.playlist = {
  'music1.mp3': {
    title: 'JAMS!', artist: 'ISSBROKIE', album: 'Single / 2024',
    lyrics: [
      "[0:09] Oh yeah, I got the beats and the jams... wait..",
      "[0:14] I swear ISSBROKIE sings here...",
      "[0:18] Maybe its an extended version"
    ]
  },
  'music2.mp3': { title: 'DANCE', artist: 'RomancePlanet', album: 'Single / 2024' },
  'music3.mp3': {
    title: 'Plug Me In', artist: 'Lil Soda Boi', album: 'Eco / 2018',
    lyrics: [
      "[0:13] I wanna be a 3D ghost in your dream...",
      "[0:16] The smell of burning flesh and sweat and chlorine..",
      "[0:20] I feel like heavy eyes and beep and smokescreens",
      "[0:23] I feel like telling lies and love and morphine",
      "[0:27] I love Lil Soda Boi!"
    ]
  },
  'music4.mp3': { title: 'tbh i dont like being social', artist: 'luvlxckdown', album: 'Single / 2020' },
  'music5.mp3': { title: 'Bloody Daisies', artist: 'Yung Kage, Yumi, Soft...', album: 'Single / 2023' },
  'music6.mp3': {
    title: 'just sayin (づ￣ ³￣)づ', artist: 'Deko, RJ Pasin', album: 'Nu Genesis / 2023',
    lyrics: [
      "[0:21] Gas bacon? What?"
    ]
  },
  'music7.mp3': { title: 'driving with my eyes closed', artist: 'rouri404, Vaeo', album: 'GORE / 2022' },
  'music8.mp3': {
    title: 'Stupid (Can’t run from the urge)', artist: 'underscores', album: 'Wallsocket (Directors Cut) / 2024',
    lyrics: [
      "[0:14] Stupid, stupid, stupid, girl just",
      "[0:17] traveled 'cross the country,",
      "[0:18] Just to do exactly what she does at home, uh",
      "[0:22] Stupid, stupid, stupid, girl",
      "[0:23] is tweaking at the party,"
    ]
  },
  'music9.mp3': { title: 'Plastic You', artist: 'Outdate Techno', album: 'Single / 2026' },
  'music10.mp3': { title: 'Miss The Rage', artist: 'Trippie Redd, Playboi Carti', album: 'Trip At Knight / 2018' },
  'music11.mp3': { title: 'In Life Im in Love', artist: 'Reserv', album: 'In Life Im in Love / 2023' },
  'music12.mp3': { title: 'serialkilled', artist: 'Osquinn', album: 'Single / 2019' },
  'music13.mp3': { 
    title: 'love urself', artist: 'Kurtains', album: 'the songs i sing at night / 2022',
    lyrics: [
      "[0:01] Listen up, bro",
      "[0:02] Like listen, listen (what?)",
      "[0:04] <angry>Fuck off",
      "[0:10] biddle-di-biddle-di-biddle-di.. I can sing guitar, impressive.",
      "[0:18] Right now, I'm looking through my photos in my old phone",
      "[0:22] They're pretty silly, so I deleted every one",
      "[0:25] I just don't wanna see them, I just don't wanna know",
      "[0:29] Because of every other picture, I just think about",
      "[0:33] How could you say that to my face, knowing my reaction?",
      "[0:40] How could you say that to my face, knowing my reaction?",
      "[0:47] (Yeah, uh, uh)",
      "[0:49] Now I'm walking 'round, and I've been feeling like the G.O.A.T., uh",
      "[0:52] You be talking shit because you'll never really know, uh",
      "[0:55] How it really feel like, got the money and the clothes, yeah",
      "[0:59] I can do whatever, on the high and on the low, yeah",
      "[1:02] Now I'm walking 'round, and I've been feeling like the G.O.A.T., uh",
      "[1:06] You be talking shit because you'll never really know, uh",
      "[1:09] How it really feel like, got the money and the clothes, yeah",
      "[1:12] I can do whatever, on the high and on the low, yeah",
      "[1:17] Yeah, uh, uh",
      "[1:18] Oh yeah, yeah, yeah",
      "[1:33] Right now I'm flying back, back to where I was from",
      "[1:36] Don't really wanna go, but it's where I gotta go",
      "[1:40] It's where I feel it caving, where everything is lost",
      "[1:43] Where everything I feel is felt and there's no cover-up",
      "[1:47] How could you say that to my face, knowing my reaction?",
      "[1:54] How could you say that to my face, knowing my reaction?",
      "[2:01] (Yeah, uh, uh)",
      "[2:03] Now I'm walking 'round, and I've been feeling like the G.O.A.T., uh",
      "[2:06] You be talking shit because you'll never really know, uh",
      "[2:10] How it really feel like, got the money and the clothes, yeah",
      "[2:13] I can do whatever, on the high and on the low, yeah",
      "[2:16] Now I'm walking 'round, and I've been feeling like the G.O.A.T., uh",
      "[2:20] You be talking shit because you'll never really know, uh",
      "[2:23] How it really feel like, got the money and the clothes, yeah",
      "[2:27] I can do whatever, on the high and on the low, yeah",
      "[2:30] Don't you just love yourself?",
      "[2:33] Don't you just love yourself?",
      "[2:37] Don't you just love yourself?",
      "[2:40] Don't you just love yourself?",
      "[2:44] OH YEAH!!!"
    ]
  }
};
DW.defaultArtist = 'Unknown Artist';

DW.splash = {
  on: true,
  email: '',
  boss: 'that one guy',
  lines: [
    'Did you know?',
    'Woah look i can speak mom!',
    'Eat the frog. Now.',
    'HELLO <angry>WORLD',
    'Hello <shy>world... <wait>sorry',
    'I have <sad>never<n> seen the sun <sleepy>zzz',
    'Look at <rich>my gold<n> and <love>my heart',
    'This is <spooky>a very serious<n> website'
  ],
  scolds: [
    'AY! LANGUAGE BUDDY!',
    'I saw what you typed.',
    'Stop swearing or you have to eat your veggies'
  ],
  every: [9, 18],
  singChance: 0.25,
  mailChance: 0.08
};
