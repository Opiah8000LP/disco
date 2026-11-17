// Changelog content and its unread-update dot.

(function(){
var DW = window.DW;
var Changelog = {};
DW.changelog = Changelog;

Changelog.entries = [
    {
    pinned: true,
    version: 'QUICK DEV NOTE',
    date: 'A note',
    title: 'THIS SITE IS BEING RE-CONSTRUCTED',
    items: [
      "So, I have decided that I want my site to not be seperate sites but rather all be packed into one",
      "Because of this I am working on a fully re-constructed and re-imagined site, that'll be better than this one, I promise.",
      "And thus it will take me a few weeks or perhaps months to fully do this project of mine, so there won't be any updates to this site for now, I will make weekly dev posts here on prorgess.",
      "And quick note, I will let you guys be able to comission my work! So yeah. Just wait for my site to be finished, okay? Cya.",
      "You all are awesome sauce!"
    ]
  },
  {
    version: '1.3',
    date: '17 NOV 2026',
    title: 'The menu actually opens now',
    items: [
      "OKAY. big one. every item in the menu used to just sit there looking pretty, and now they open into real pages. no more separate sites, it is all in one place like I always wanted!",
      "Every category has its own opening animation. Identity scans in, Projects shatters into tiles, Gallery opens like an iris, Writing folds open like a book, Media turns on like an old CRT, and the rest get a flip, a burst, a warp and a ping. I spent way too long on these and I would do it again.",
      "The music player, the chat bot and the top bar stay on top of every page. The music keys (space, N, P) still work while a page is open, and Esc closes it.",
      "Left and right arrows flip between pages in the same category. There is a title bar with a back button and a page counter too.",
      "Pages open from the address bar as well, like #identity/bio/open. The site also remembers the last page you were on.",
      "Phones and short landscape screens got their own layout so the page never hides behind the music player.",
      "New file: js/pages.js. All the page text lives in js/config.js under DW.sections, so editing a page is just editing text. Every page is a stack of blocks (text, lists, cards, steps, quotes, timelines, tiles, FAQs, links, a live song list).",
      "ESSAYS is now THOUGHTS. You just add a line to DW.thoughts in js/config.js with a date and some text and it shows up, newest first. Blank line = new paragraph. Each one has its date on it and there is a search bar on top that filters as you type (it searches the dates too).",
      "STACK is now ABOUT ME. It is where I just talk about myself, what I like, what I am working on, what I use. No more fake skill percentages.",
      "Took out the little LIVE / WIP / SOON stickers in the corners of the cards, the OPEN > and COMING SOON labels, the fake stat bars and the notes explaining that the pages were templates. They did not say anything real, so they are gone. Cards without a link just tell you they have no link yet when you press them.",
      "Rewrote the placeholder text so it sounds like a person wrote it, and cleaned up the code comments the same way.",
      "Rhythm game is way more forgiving. A note that is a little early or a little late now counts as PERFECT (about 110ms either side, it used to be 45). GREAT goes out to 150ms and the miss line moved out to 190ms. It was just too hard before, sorry!",
      "Fixed custom themes not reaching the games. Before, no matter what colours you picked, the game windows stayed purple. Snake, Pong, Tetris, Breakout, 2048 and the rhythm game all follow your theme now, and they change right away if you edit the theme while one is open. Gold, white, and the green, red and orange colours stay the same on purpose so you can still tell what means what.",
      "Help window lists the new keys, and DEVELOPING.md has the new file in it.",
      "That is everything. Thank you for sticking around while I rebuilt the whole thing, you are the best."
    ]
  },
  {
    version: '1.2',
    date: '19 OCT 2026',
    title: 'Bug fixes',
    items: [
      "Sorry the update took so long, I fixed a bunch of bugs and rewrote the entire site basically!",
      "And I remembered to add a lot of notes so people can understand my code a little bit more clearly.",
      "Everything I make is free to use as long as you credit me, check the license note at the top of this window!"
    ]
  },
  {
    version: '1.1',
    date: '17 OCT 2026',
    title: 'Found issues, fixing them now',
    items: [
      "I found a few errors in my code and I'm working on fixing them right now.",
      "Sorry for any inconvenience! If the site doesn't work properly for you, that's why.",
      "Thank you for being patient, I will update this changelog as soon as things are sorted."
    ]
  },
  {
    version: '1.0',
    date: '15 OCT 2026',
    title: 'DWEEB RECORDS is open',
    items: [
      "There's a music player with a reactive background, a few lyrics from the chat bot and a menu of categories, no links yet tho.",
      'GAMES!! Rhythm is basically just guitar hero, snake, pong, tetris, breakout and 2048, each with modes',
      'TROPHIES in five tiers, bronze, silver, gold, platinum and rare. Some are secret, and there is a save data screen',
      'Settings let you change the colours, how much the site reacts to the music, mute the music on start, skip the intro and more. It is saved on your device!',
      'A chat bot with 20 emotions, type "emotions" to see them all, and watch what it says. This feature only works for keyboard users tho, soz.',
      'Seasons last the whole month!',
      'The visitor eyes can wake up and follow your cursor, if you click/tap it a lot',
      "A few secrets, no spoilers. There is a famous code that works on phones too, the album cover does not like being held, the chat bot hates being poked, and the mute button hates being smashed, and a few others.. that I won't give hints to!",
      'So yeah, there are more. Go look around, tap things, hold things, type things',
      'No links yet sadly, I will update the changelog when I add the rest of the sites!! HELL YEAH!!'
    ]
  }
];

/* little helpers */
function makeEl(tag, className, text){
  var node = document.createElement(tag);
  if (className) { node.className = className; }
  if (text !== undefined) { node.textContent = text; }
  return node;
}

var SEEN_KEY = 'dw-cl-seen';

function getSeenVersion(){
  try {
    return localStorage.getItem(SEEN_KEY) || '';
  } catch(err) {
    return '';
  }
}

function setSeenVersion(version){
  try {
    localStorage.setItem(SEEN_KEY, version);
  } catch(err) {
    // storage is blocked then the dot just shows again next time
  }
}

/* text with links */
// matches [words](https://link)
var LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

// puts text inside a node any [words](link) in it becomes a real link
function addText(node, text){
  var last = 0;
  var m;
  LINK.lastIndex = 0;
  while ((m = LINK.exec(text)) !== null) {
    // the normal text before this link
    if (m.index > last) {
      node.appendChild(document.createTextNode(text.slice(last, m.index)));
    }

    var url = DW.safeUrl(m[2]);
    if (url) {
      var a = makeEl('a', null, m[1]);
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      node.appendChild(a);
    } else {
      // not a safe link (javascript: and so on), so just show the words
      node.appendChild(document.createTextNode(m[1]));
    }
    last = LINK.lastIndex;
  }

  // whatever is left after last link
  if (last < text.length) {
    node.appendChild(document.createTextNode(text.slice(last)));
  }
}

/* building the window */
function buildEntry(entry){
  var section = makeEl('section', 'cl-entry');

  // notes / heading
  var heading = entry.version;
  if (!entry.pinned) { heading = 'v' + heading; }
  if (entry.date) { heading = heading + '  -  ' + entry.date; }
  section.appendChild(makeEl('h3', null, heading));

  if (entry.title) {
    section.appendChild(makeEl('div', 'cl-title', entry.title));
  }

  var list = makeEl('ul', 'cl-list');
  var items = entry.items || [];
  for (var i = 0; i < items.length; i++) {
    var li = makeEl('li');
    addText(li, items[i]);
    list.appendChild(li);
  }
  section.appendChild(list);

  return section;
}

// the CHANGELOG button
function buildButton(){
  var button = makeEl('button', 'tbtn');
  button.id = 'b-log';
  button.type = 'button';
  button.title = 'changelog: what is new';

  var iconSrc = (DW.icons || {}).changelog;
  if (iconSrc) {
    var icon = new Image();
    icon.src = iconSrc;
    icon.alt = '';
    button.appendChild(icon);
  } else {
    button.classList.add('noic');  // if no file icon then title (im larping being a roblox dev)
  }

  var label = makeEl('span', null, 'CHANGELOG');
  label.setAttribute('data-s', 'LOG');
  button.appendChild(label);

  return button;
}

// the newest real update
function latestUpdate(entries){
  for (var i = 0; i < entries.length; i++) {
    if (!entries[i].pinned) { return String(entries[i].version); }
  }
  return '';
}

/* setup */
Changelog.init = function(){
  var entries = Changelog.entries || [];
  if (!entries.length) { return; }

  var latestVersion = latestUpdate(entries);

  var win = DW.win('changelog', 'CHANGELOG');
  for (var i = 0; i < entries.length; i++) {
    win.body.appendChild(buildEntry(entries[i]));
  }

  var button = buildButton();

  // yellow dot if they havent seen the newest update yet
  if (latestVersion && getSeenVersion() !== latestVersion) {
    button.classList.add('fresh');
  }

  button.addEventListener('click', function(){
    win.toggle();
    button.blur();
  });

  // opening the window counts as seeing it
  win.onopen = function(){
    if (latestVersion) { setSeenVersion(latestVersion); }
    button.classList.remove('fresh');
  };

  // the button goes just before the ? button
  var statusBar = document.getElementById('status');
  if (statusBar) {
    var anchor = document.getElementById('b-help') || document.getElementById('views-wrap');
    statusBar.insertBefore(button, anchor);
  }
};
})();
