export const moods = {
  "lonely": {
    "emoji": "🌧️",
    "bn": "একা",
    "en": "Lonely",
    "count": 7
  },
  "sad": {
    "emoji": "💧",
    "bn": "মন খারাপ",
    "en": "Sad",
    "count": 5
  },
  "anxious": {
    "emoji": "🌫️",
    "bn": "উদ্বিগ্ন",
    "en": "Anxious",
    "count": 5
  },
  "overwhelmed": {
    "emoji": "🌊",
    "bn": "চাপে আছি",
    "en": "Under pressure",
    "count": 5
  },
  "angry": {
    "emoji": "🔥",
    "bn": "রাগান্বিত",
    "en": "Angry",
    "count": 5
  },
  "numb": {
    "emoji": "🪨",
    "bn": "কিছুই অনুভব হচ্ছে না",
    "en": "Feeling numb",
    "count": 5
  },
  "lost": {
    "emoji": "🧭",
    "bn": "দিশেহারা",
    "en": "Lost",
    "count": 5
  },
  "hopeful": {
    "emoji": "🌱",
    "bn": "আশা আছে",
    "en": "Hopeful",
    "count": 5
  },
  "other": {
    "emoji": "✨",
    "bn": "অন্য অনুভূতি",
    "en": "Another feeling",
    "count": 0
  }
};

export const needMeta = {
  listen: { bn: "কেউ শুধু শুনুক", en: "Just listen", icon: "ear" },
  support: { bn: "সহমর্মী মন্তব্য চাই", en: "Kind comments", icon: "message" },
  vent: { bn: "শুধু মনের কথা বলতে চাই", en: "I only want to vent", icon: "wind" },
  ground: { bn: "নিজেকে স্থির করতে চাই", en: "Help me feel steady", icon: "anchor" },
  share: { bn: "একটি ভালো মুহূর্ত ভাগ করতে চাই", en: "Share a good moment", icon: "spark" },
  safety: { bn: "নিরাপদ থাকতে সাহায্য চাই", en: "Help me stay safe", icon: "shield" },
  other: { bn: "অন্য ধরনের সহায়তা", en: "Another kind of support", icon: "spark" }
};

export const topics = {
  all: { bn: "সব", en: "All" },
  life: { bn: "জীবন", en: "Life" },
  relationship: { bn: "রিলেশন", en: "Relationship" },
  postMarriage: { bn: "দাম্পত্য জীবন", en: "Married life" },
  study: { bn: "পড়াশোনা", en: "Study" },
  work: { bn: "কাজ", en: "Work" },
  family: { bn: "পরিবার", en: "Family" },
  self: { bn: "নিজের অনুভূতি", en: "Personal feelings" },
  other: { bn: "অন্যান্য", en: "Other" }
};

export const circles = [
  { id:"late-night", icon:"moon", bn:"রাতজাগা সঙ্গী", en:"Late-night company", members:1842, online:126, description_bn:"রাতে মন ভারী হলে নীরবে পাশে থাকার জায়গা।", description_en:"A quiet circle for nights that feel heavier." },
  { id:"study", icon:"book", bn:"পড়াশোনার চাপ", en:"Study pressure", members:1280, online:83, description_bn:"পরীক্ষা, ভবিষ্যৎ ও প্রত্যাশার চাপ নিয়ে কথা বলুন।", description_en:"Talk about exams, expectations and uncertainty." },
  { id:"jobs-pressure", icon:"briefcase", bn:"চাকরির চাপ", en:"Job pressure", members:964, online:61, description_bn:"চাকরি, কর্মস্থল, দায়িত্ব ও ভবিষ্যৎ নিয়ে চাপ ভাগ করুন।", description_en:"Share pressure around jobs, work, responsibility and the future." },
  { id:"personal-life", icon:"user", bn:"ব্যক্তিগত জীবন", en:"Personal life", members:1370, online:88, description_bn:"নিজের জীবন, আত্মসম্মান, সিদ্ধান্ত ও একান্ত অনুভূতি নিয়ে কথা বলুন।", description_en:"Talk about personal life, self-worth, decisions and private feelings." },
  { id:"family", icon:"home", bn:"পরিবার ও সম্পর্ক", en:"Family & relationships", members:1516, online:94, description_bn:"যে কথাগুলো ঘরের মানুষকে বলা কঠিন।", description_en:"For words that are difficult to say at home." },
  { id:"healing", icon:"leaf", bn:"ধীরে সুস্থ হওয়া", en:"Healing slowly", members:2210, online:142, description_bn:"একদিনে নয়—ছোট ছোট কোমল পদক্ষেপে এগোনো।", description_en:"Gentle progress, one small step at a time." },
  { id:"small-wins", icon:"sun", bn:"আজকের ছোট জয়", en:"Small wins today", members:1134, online:70, description_bn:"আজকের ক্ষুদ্র ভালো মুহূর্তগুলো মনে রাখি।", description_en:"A place to notice the small good moments." }
];

export const momentMoods = [
  {
    "id": "happy-slightly",
    "emoji": "😊",
    "bn": "একটু খুশি",
    "en": "A little happy",
    "group": "hopeful"
  },
  {
    "id": "happy-today",
    "emoji": "😊",
    "bn": "আজ খুশি",
    "en": "Today I feel happy",
    "group": "hopeful"
  },
  {
    "id": "happy-quite",
    "emoji": "😊",
    "bn": "বেশ খুশি",
    "en": "Quite happy",
    "group": "hopeful"
  },
  {
    "id": "happy-very",
    "emoji": "😊",
    "bn": "খুব খুশি",
    "en": "Very happy",
    "group": "hopeful"
  },
  {
    "id": "happy-deeply",
    "emoji": "😊",
    "bn": "গভীরভাবে খুশি",
    "en": "Deeply happy",
    "group": "hopeful"
  },
  {
    "id": "joyful-slightly",
    "emoji": "😄",
    "bn": "একটু আনন্দিত",
    "en": "A little joyful",
    "group": "hopeful"
  },
  {
    "id": "joyful-today",
    "emoji": "😄",
    "bn": "আজ আনন্দিত",
    "en": "Today I feel joyful",
    "group": "hopeful"
  },
  {
    "id": "joyful-quite",
    "emoji": "😄",
    "bn": "বেশ আনন্দিত",
    "en": "Quite joyful",
    "group": "hopeful"
  },
  {
    "id": "joyful-very",
    "emoji": "😄",
    "bn": "খুব আনন্দিত",
    "en": "Very joyful",
    "group": "hopeful"
  },
  {
    "id": "joyful-deeply",
    "emoji": "😄",
    "bn": "গভীরভাবে আনন্দিত",
    "en": "Deeply joyful",
    "group": "hopeful"
  },
  {
    "id": "grateful-slightly",
    "emoji": "🙏",
    "bn": "একটু কৃতজ্ঞ",
    "en": "A little grateful",
    "group": "hopeful"
  },
  {
    "id": "grateful-today",
    "emoji": "🙏",
    "bn": "আজ কৃতজ্ঞ",
    "en": "Today I feel grateful",
    "group": "hopeful"
  },
  {
    "id": "grateful-quite",
    "emoji": "🙏",
    "bn": "বেশ কৃতজ্ঞ",
    "en": "Quite grateful",
    "group": "hopeful"
  },
  {
    "id": "grateful-very",
    "emoji": "🙏",
    "bn": "খুব কৃতজ্ঞ",
    "en": "Very grateful",
    "group": "hopeful"
  },
  {
    "id": "grateful-deeply",
    "emoji": "🙏",
    "bn": "গভীরভাবে কৃতজ্ঞ",
    "en": "Deeply grateful",
    "group": "hopeful"
  },
  {
    "id": "peaceful-slightly",
    "emoji": "😌",
    "bn": "একটু শান্ত",
    "en": "A little peaceful",
    "group": "hopeful"
  },
  {
    "id": "peaceful-today",
    "emoji": "😌",
    "bn": "আজ শান্ত",
    "en": "Today I feel peaceful",
    "group": "hopeful"
  },
  {
    "id": "peaceful-quite",
    "emoji": "😌",
    "bn": "বেশ শান্ত",
    "en": "Quite peaceful",
    "group": "hopeful"
  },
  {
    "id": "peaceful-very",
    "emoji": "😌",
    "bn": "খুব শান্ত",
    "en": "Very peaceful",
    "group": "hopeful"
  },
  {
    "id": "peaceful-deeply",
    "emoji": "😌",
    "bn": "গভীরভাবে শান্ত",
    "en": "Deeply peaceful",
    "group": "hopeful"
  },
  {
    "id": "hopeful-slightly",
    "emoji": "🌱",
    "bn": "একটু আশাবাদী",
    "en": "A little hopeful",
    "group": "hopeful"
  },
  {
    "id": "hopeful-today",
    "emoji": "🌱",
    "bn": "আজ আশাবাদী",
    "en": "Today I feel hopeful",
    "group": "hopeful"
  },
  {
    "id": "hopeful-quite",
    "emoji": "🌱",
    "bn": "বেশ আশাবাদী",
    "en": "Quite hopeful",
    "group": "hopeful"
  },
  {
    "id": "hopeful-very",
    "emoji": "🌱",
    "bn": "খুব আশাবাদী",
    "en": "Very hopeful",
    "group": "hopeful"
  },
  {
    "id": "hopeful-deeply",
    "emoji": "🌱",
    "bn": "গভীরভাবে আশাবাদী",
    "en": "Deeply hopeful",
    "group": "hopeful"
  },
  {
    "id": "relieved-slightly",
    "emoji": "😮‍💨",
    "bn": "একটু স্বস্তি পেয়েছি",
    "en": "A little relieved",
    "group": "hopeful"
  },
  {
    "id": "relieved-today",
    "emoji": "😮‍💨",
    "bn": "আজ স্বস্তি পেয়েছি",
    "en": "Today I feel relieved",
    "group": "hopeful"
  },
  {
    "id": "relieved-quite",
    "emoji": "😮‍💨",
    "bn": "বেশ স্বস্তি পেয়েছি",
    "en": "Quite relieved",
    "group": "hopeful"
  },
  {
    "id": "relieved-very",
    "emoji": "😮‍💨",
    "bn": "খুব স্বস্তি পেয়েছি",
    "en": "Very relieved",
    "group": "hopeful"
  },
  {
    "id": "relieved-deeply",
    "emoji": "😮‍💨",
    "bn": "গভীরভাবে স্বস্তি পেয়েছি",
    "en": "Deeply relieved",
    "group": "hopeful"
  },
  {
    "id": "proud-slightly",
    "emoji": "🌟",
    "bn": "একটু গর্বিত",
    "en": "A little proud",
    "group": "hopeful"
  },
  {
    "id": "proud-today",
    "emoji": "🌟",
    "bn": "আজ গর্বিত",
    "en": "Today I feel proud",
    "group": "hopeful"
  },
  {
    "id": "proud-quite",
    "emoji": "🌟",
    "bn": "বেশ গর্বিত",
    "en": "Quite proud",
    "group": "hopeful"
  },
  {
    "id": "proud-very",
    "emoji": "🌟",
    "bn": "খুব গর্বিত",
    "en": "Very proud",
    "group": "hopeful"
  },
  {
    "id": "proud-deeply",
    "emoji": "🌟",
    "bn": "গভীরভাবে গর্বিত",
    "en": "Deeply proud",
    "group": "hopeful"
  },
  {
    "id": "loved-slightly",
    "emoji": "🥰",
    "bn": "একটু ভালোবাসা অনুভব করছি",
    "en": "A little feeling loved",
    "group": "hopeful"
  },
  {
    "id": "loved-today",
    "emoji": "🥰",
    "bn": "আজ ভালোবাসা অনুভব করছি",
    "en": "Today I feel feeling loved",
    "group": "hopeful"
  },
  {
    "id": "loved-quite",
    "emoji": "🥰",
    "bn": "বেশ ভালোবাসা অনুভব করছি",
    "en": "Quite feeling loved",
    "group": "hopeful"
  },
  {
    "id": "loved-very",
    "emoji": "🥰",
    "bn": "খুব ভালোবাসা অনুভব করছি",
    "en": "Very feeling loved",
    "group": "hopeful"
  },
  {
    "id": "loved-deeply",
    "emoji": "🥰",
    "bn": "গভীরভাবে ভালোবাসা অনুভব করছি",
    "en": "Deeply feeling loved",
    "group": "hopeful"
  },
  {
    "id": "connected-slightly",
    "emoji": "🤝",
    "bn": "একটু কাছের মানুষদের সঙ্গে যুক্ত",
    "en": "A little connected",
    "group": "hopeful"
  },
  {
    "id": "connected-today",
    "emoji": "🤝",
    "bn": "আজ কাছের মানুষদের সঙ্গে যুক্ত",
    "en": "Today I feel connected",
    "group": "hopeful"
  },
  {
    "id": "connected-quite",
    "emoji": "🤝",
    "bn": "বেশ কাছের মানুষদের সঙ্গে যুক্ত",
    "en": "Quite connected",
    "group": "hopeful"
  },
  {
    "id": "connected-very",
    "emoji": "🤝",
    "bn": "খুব কাছের মানুষদের সঙ্গে যুক্ত",
    "en": "Very connected",
    "group": "hopeful"
  },
  {
    "id": "connected-deeply",
    "emoji": "🤝",
    "bn": "গভীরভাবে কাছের মানুষদের সঙ্গে যুক্ত",
    "en": "Deeply connected",
    "group": "hopeful"
  },
  {
    "id": "curious-slightly",
    "emoji": "🤔",
    "bn": "একটু কৌতূহলী",
    "en": "A little curious",
    "group": "hopeful"
  },
  {
    "id": "curious-today",
    "emoji": "🤔",
    "bn": "আজ কৌতূহলী",
    "en": "Today I feel curious",
    "group": "hopeful"
  },
  {
    "id": "curious-quite",
    "emoji": "🤔",
    "bn": "বেশ কৌতূহলী",
    "en": "Quite curious",
    "group": "hopeful"
  },
  {
    "id": "curious-very",
    "emoji": "🤔",
    "bn": "খুব কৌতূহলী",
    "en": "Very curious",
    "group": "hopeful"
  },
  {
    "id": "curious-deeply",
    "emoji": "🤔",
    "bn": "গভীরভাবে কৌতূহলী",
    "en": "Deeply curious",
    "group": "hopeful"
  },
  {
    "id": "energized-slightly",
    "emoji": "⚡",
    "bn": "একটু উদ্যমী",
    "en": "A little energized",
    "group": "hopeful"
  },
  {
    "id": "energized-today",
    "emoji": "⚡",
    "bn": "আজ উদ্যমী",
    "en": "Today I feel energized",
    "group": "hopeful"
  },
  {
    "id": "energized-quite",
    "emoji": "⚡",
    "bn": "বেশ উদ্যমী",
    "en": "Quite energized",
    "group": "hopeful"
  },
  {
    "id": "energized-very",
    "emoji": "⚡",
    "bn": "খুব উদ্যমী",
    "en": "Very energized",
    "group": "hopeful"
  },
  {
    "id": "energized-deeply",
    "emoji": "⚡",
    "bn": "গভীরভাবে উদ্যমী",
    "en": "Deeply energized",
    "group": "hopeful"
  },
  {
    "id": "motivated-slightly",
    "emoji": "🚀",
    "bn": "একটু অনুপ্রাণিত",
    "en": "A little motivated",
    "group": "hopeful"
  },
  {
    "id": "motivated-today",
    "emoji": "🚀",
    "bn": "আজ অনুপ্রাণিত",
    "en": "Today I feel motivated",
    "group": "hopeful"
  },
  {
    "id": "motivated-quite",
    "emoji": "🚀",
    "bn": "বেশ অনুপ্রাণিত",
    "en": "Quite motivated",
    "group": "hopeful"
  },
  {
    "id": "motivated-very",
    "emoji": "🚀",
    "bn": "খুব অনুপ্রাণিত",
    "en": "Very motivated",
    "group": "hopeful"
  },
  {
    "id": "motivated-deeply",
    "emoji": "🚀",
    "bn": "গভীরভাবে অনুপ্রাণিত",
    "en": "Deeply motivated",
    "group": "hopeful"
  },
  {
    "id": "inspired-slightly",
    "emoji": "✨",
    "bn": "একটু প্রেরণা পাচ্ছি",
    "en": "A little inspired",
    "group": "hopeful"
  },
  {
    "id": "inspired-today",
    "emoji": "✨",
    "bn": "আজ প্রেরণা পাচ্ছি",
    "en": "Today I feel inspired",
    "group": "hopeful"
  },
  {
    "id": "inspired-quite",
    "emoji": "✨",
    "bn": "বেশ প্রেরণা পাচ্ছি",
    "en": "Quite inspired",
    "group": "hopeful"
  },
  {
    "id": "inspired-very",
    "emoji": "✨",
    "bn": "খুব প্রেরণা পাচ্ছি",
    "en": "Very inspired",
    "group": "hopeful"
  },
  {
    "id": "inspired-deeply",
    "emoji": "✨",
    "bn": "গভীরভাবে প্রেরণা পাচ্ছি",
    "en": "Deeply inspired",
    "group": "hopeful"
  },
  {
    "id": "playful-slightly",
    "emoji": "😋",
    "bn": "একটু হালকা মজা করতে ইচ্ছে করছে",
    "en": "A little playful",
    "group": "hopeful"
  },
  {
    "id": "playful-today",
    "emoji": "😋",
    "bn": "আজ হালকা মজা করতে ইচ্ছে করছে",
    "en": "Today I feel playful",
    "group": "hopeful"
  },
  {
    "id": "playful-quite",
    "emoji": "😋",
    "bn": "বেশ হালকা মজা করতে ইচ্ছে করছে",
    "en": "Quite playful",
    "group": "hopeful"
  },
  {
    "id": "playful-very",
    "emoji": "😋",
    "bn": "খুব হালকা মজা করতে ইচ্ছে করছে",
    "en": "Very playful",
    "group": "hopeful"
  },
  {
    "id": "playful-deeply",
    "emoji": "😋",
    "bn": "গভীরভাবে হালকা মজা করতে ইচ্ছে করছে",
    "en": "Deeply playful",
    "group": "hopeful"
  },
  {
    "id": "tender-slightly",
    "emoji": "💗",
    "bn": "একটু কোমল অনুভূতি",
    "en": "A little tender",
    "group": "hopeful"
  },
  {
    "id": "tender-today",
    "emoji": "💗",
    "bn": "আজ কোমল অনুভূতি",
    "en": "Today I feel tender",
    "group": "hopeful"
  },
  {
    "id": "tender-quite",
    "emoji": "💗",
    "bn": "বেশ কোমল অনুভূতি",
    "en": "Quite tender",
    "group": "hopeful"
  },
  {
    "id": "tender-very",
    "emoji": "💗",
    "bn": "খুব কোমল অনুভূতি",
    "en": "Very tender",
    "group": "hopeful"
  },
  {
    "id": "tender-deeply",
    "emoji": "💗",
    "bn": "গভীরভাবে কোমল অনুভূতি",
    "en": "Deeply tender",
    "group": "hopeful"
  },
  {
    "id": "lonely-slightly",
    "emoji": "🌧️",
    "bn": "একটু একা লাগছে",
    "en": "A little lonely",
    "group": "lonely"
  },
  {
    "id": "lonely-today",
    "emoji": "🌧️",
    "bn": "আজ একা লাগছে",
    "en": "Today I feel lonely",
    "group": "lonely"
  },
  {
    "id": "lonely-quite",
    "emoji": "🌧️",
    "bn": "বেশ একা লাগছে",
    "en": "Quite lonely",
    "group": "lonely"
  },
  {
    "id": "lonely-very",
    "emoji": "🌧️",
    "bn": "খুব একা লাগছে",
    "en": "Very lonely",
    "group": "lonely"
  },
  {
    "id": "lonely-deeply",
    "emoji": "🌧️",
    "bn": "গভীরভাবে একা লাগছে",
    "en": "Deeply lonely",
    "group": "lonely"
  },
  {
    "id": "sad-slightly",
    "emoji": "😢",
    "bn": "একটু মন খারাপ",
    "en": "A little sad",
    "group": "sad"
  },
  {
    "id": "sad-today",
    "emoji": "😢",
    "bn": "আজ মন খারাপ",
    "en": "Today I feel sad",
    "group": "sad"
  },
  {
    "id": "sad-quite",
    "emoji": "😢",
    "bn": "বেশ মন খারাপ",
    "en": "Quite sad",
    "group": "sad"
  },
  {
    "id": "sad-very",
    "emoji": "😢",
    "bn": "খুব মন খারাপ",
    "en": "Very sad",
    "group": "sad"
  },
  {
    "id": "sad-deeply",
    "emoji": "😢",
    "bn": "গভীরভাবে মন খারাপ",
    "en": "Deeply sad",
    "group": "sad"
  },
  {
    "id": "heavy-slightly",
    "emoji": "🫧",
    "bn": "একটু মন ভারী",
    "en": "A little heavy-hearted",
    "group": "sad"
  },
  {
    "id": "heavy-today",
    "emoji": "🫧",
    "bn": "আজ মন ভারী",
    "en": "Today I feel heavy-hearted",
    "group": "sad"
  },
  {
    "id": "heavy-quite",
    "emoji": "🫧",
    "bn": "বেশ মন ভারী",
    "en": "Quite heavy-hearted",
    "group": "sad"
  },
  {
    "id": "heavy-very",
    "emoji": "🫧",
    "bn": "খুব মন ভারী",
    "en": "Very heavy-hearted",
    "group": "sad"
  },
  {
    "id": "heavy-deeply",
    "emoji": "🫧",
    "bn": "গভীরভাবে মন ভারী",
    "en": "Deeply heavy-hearted",
    "group": "sad"
  },
  {
    "id": "anxious-slightly",
    "emoji": "😟",
    "bn": "একটু উদ্বিগ্ন",
    "en": "A little anxious",
    "group": "anxious"
  },
  {
    "id": "anxious-today",
    "emoji": "😟",
    "bn": "আজ উদ্বিগ্ন",
    "en": "Today I feel anxious",
    "group": "anxious"
  },
  {
    "id": "anxious-quite",
    "emoji": "😟",
    "bn": "বেশ উদ্বিগ্ন",
    "en": "Quite anxious",
    "group": "anxious"
  },
  {
    "id": "anxious-very",
    "emoji": "😟",
    "bn": "খুব উদ্বিগ্ন",
    "en": "Very anxious",
    "group": "anxious"
  },
  {
    "id": "anxious-deeply",
    "emoji": "😟",
    "bn": "গভীরভাবে উদ্বিগ্ন",
    "en": "Deeply anxious",
    "group": "anxious"
  },
  {
    "id": "worried-slightly",
    "emoji": "😰",
    "bn": "একটু চিন্তিত",
    "en": "A little worried",
    "group": "anxious"
  },
  {
    "id": "worried-today",
    "emoji": "😰",
    "bn": "আজ চিন্তিত",
    "en": "Today I feel worried",
    "group": "anxious"
  },
  {
    "id": "worried-quite",
    "emoji": "😰",
    "bn": "বেশ চিন্তিত",
    "en": "Quite worried",
    "group": "anxious"
  },
  {
    "id": "worried-very",
    "emoji": "😰",
    "bn": "খুব চিন্তিত",
    "en": "Very worried",
    "group": "anxious"
  },
  {
    "id": "worried-deeply",
    "emoji": "😰",
    "bn": "গভীরভাবে চিন্তিত",
    "en": "Deeply worried",
    "group": "anxious"
  },
  {
    "id": "overwhelmed-slightly",
    "emoji": "🌊",
    "bn": "একটু চাপে আছি",
    "en": "A little overwhelmed",
    "group": "overwhelmed"
  },
  {
    "id": "overwhelmed-today",
    "emoji": "🌊",
    "bn": "আজ চাপে আছি",
    "en": "Today I feel overwhelmed",
    "group": "overwhelmed"
  },
  {
    "id": "overwhelmed-quite",
    "emoji": "🌊",
    "bn": "বেশ চাপে আছি",
    "en": "Quite overwhelmed",
    "group": "overwhelmed"
  },
  {
    "id": "overwhelmed-very",
    "emoji": "🌊",
    "bn": "খুব চাপে আছি",
    "en": "Very overwhelmed",
    "group": "overwhelmed"
  },
  {
    "id": "overwhelmed-deeply",
    "emoji": "🌊",
    "bn": "গভীরভাবে চাপে আছি",
    "en": "Deeply overwhelmed",
    "group": "overwhelmed"
  },
  {
    "id": "tired-slightly",
    "emoji": "🥱",
    "bn": "একটু ক্লান্ত",
    "en": "A little tired",
    "group": "overwhelmed"
  },
  {
    "id": "tired-today",
    "emoji": "🥱",
    "bn": "আজ ক্লান্ত",
    "en": "Today I feel tired",
    "group": "overwhelmed"
  },
  {
    "id": "tired-quite",
    "emoji": "🥱",
    "bn": "বেশ ক্লান্ত",
    "en": "Quite tired",
    "group": "overwhelmed"
  },
  {
    "id": "tired-very",
    "emoji": "🥱",
    "bn": "খুব ক্লান্ত",
    "en": "Very tired",
    "group": "overwhelmed"
  },
  {
    "id": "tired-deeply",
    "emoji": "🥱",
    "bn": "গভীরভাবে ক্লান্ত",
    "en": "Deeply tired",
    "group": "overwhelmed"
  },
  {
    "id": "burnedout-slightly",
    "emoji": "🪫",
    "bn": "একটু একেবারে নিঃশেষ",
    "en": "A little burned out",
    "group": "overwhelmed"
  },
  {
    "id": "burnedout-today",
    "emoji": "🪫",
    "bn": "আজ একেবারে নিঃশেষ",
    "en": "Today I feel burned out",
    "group": "overwhelmed"
  },
  {
    "id": "burnedout-quite",
    "emoji": "🪫",
    "bn": "বেশ একেবারে নিঃশেষ",
    "en": "Quite burned out",
    "group": "overwhelmed"
  },
  {
    "id": "burnedout-very",
    "emoji": "🪫",
    "bn": "খুব একেবারে নিঃশেষ",
    "en": "Very burned out",
    "group": "overwhelmed"
  },
  {
    "id": "burnedout-deeply",
    "emoji": "🪫",
    "bn": "গভীরভাবে একেবারে নিঃশেষ",
    "en": "Deeply burned out",
    "group": "overwhelmed"
  },
  {
    "id": "angry-slightly",
    "emoji": "😠",
    "bn": "একটু রাগান্বিত",
    "en": "A little angry",
    "group": "angry"
  },
  {
    "id": "angry-today",
    "emoji": "😠",
    "bn": "আজ রাগান্বিত",
    "en": "Today I feel angry",
    "group": "angry"
  },
  {
    "id": "angry-quite",
    "emoji": "😠",
    "bn": "বেশ রাগান্বিত",
    "en": "Quite angry",
    "group": "angry"
  },
  {
    "id": "angry-very",
    "emoji": "😠",
    "bn": "খুব রাগান্বিত",
    "en": "Very angry",
    "group": "angry"
  },
  {
    "id": "angry-deeply",
    "emoji": "😠",
    "bn": "গভীরভাবে রাগান্বিত",
    "en": "Deeply angry",
    "group": "angry"
  },
  {
    "id": "frustrated-slightly",
    "emoji": "😤",
    "bn": "একটু বিরক্ত ও হতাশ",
    "en": "A little frustrated",
    "group": "angry"
  },
  {
    "id": "frustrated-today",
    "emoji": "😤",
    "bn": "আজ বিরক্ত ও হতাশ",
    "en": "Today I feel frustrated",
    "group": "angry"
  },
  {
    "id": "frustrated-quite",
    "emoji": "😤",
    "bn": "বেশ বিরক্ত ও হতাশ",
    "en": "Quite frustrated",
    "group": "angry"
  },
  {
    "id": "frustrated-very",
    "emoji": "😤",
    "bn": "খুব বিরক্ত ও হতাশ",
    "en": "Very frustrated",
    "group": "angry"
  },
  {
    "id": "frustrated-deeply",
    "emoji": "😤",
    "bn": "গভীরভাবে বিরক্ত ও হতাশ",
    "en": "Deeply frustrated",
    "group": "angry"
  },
  {
    "id": "hurt-slightly",
    "emoji": "💔",
    "bn": "একটু আঘাত পেয়েছি",
    "en": "A little hurt",
    "group": "sad"
  },
  {
    "id": "hurt-today",
    "emoji": "💔",
    "bn": "আজ আঘাত পেয়েছি",
    "en": "Today I feel hurt",
    "group": "sad"
  },
  {
    "id": "hurt-quite",
    "emoji": "💔",
    "bn": "বেশ আঘাত পেয়েছি",
    "en": "Quite hurt",
    "group": "sad"
  },
  {
    "id": "hurt-very",
    "emoji": "💔",
    "bn": "খুব আঘাত পেয়েছি",
    "en": "Very hurt",
    "group": "sad"
  },
  {
    "id": "hurt-deeply",
    "emoji": "💔",
    "bn": "গভীরভাবে আঘাত পেয়েছি",
    "en": "Deeply hurt",
    "group": "sad"
  },
  {
    "id": "disappointed-slightly",
    "emoji": "😞",
    "bn": "একটু হতাশ",
    "en": "A little disappointed",
    "group": "sad"
  },
  {
    "id": "disappointed-today",
    "emoji": "😞",
    "bn": "আজ হতাশ",
    "en": "Today I feel disappointed",
    "group": "sad"
  },
  {
    "id": "disappointed-quite",
    "emoji": "😞",
    "bn": "বেশ হতাশ",
    "en": "Quite disappointed",
    "group": "sad"
  },
  {
    "id": "disappointed-very",
    "emoji": "😞",
    "bn": "খুব হতাশ",
    "en": "Very disappointed",
    "group": "sad"
  },
  {
    "id": "disappointed-deeply",
    "emoji": "😞",
    "bn": "গভীরভাবে হতাশ",
    "en": "Deeply disappointed",
    "group": "sad"
  },
  {
    "id": "confused-slightly",
    "emoji": "😵‍💫",
    "bn": "একটু বিভ্রান্ত",
    "en": "A little confused",
    "group": "lost"
  },
  {
    "id": "confused-today",
    "emoji": "😵‍💫",
    "bn": "আজ বিভ্রান্ত",
    "en": "Today I feel confused",
    "group": "lost"
  },
  {
    "id": "confused-quite",
    "emoji": "😵‍💫",
    "bn": "বেশ বিভ্রান্ত",
    "en": "Quite confused",
    "group": "lost"
  },
  {
    "id": "confused-very",
    "emoji": "😵‍💫",
    "bn": "খুব বিভ্রান্ত",
    "en": "Very confused",
    "group": "lost"
  },
  {
    "id": "confused-deeply",
    "emoji": "😵‍💫",
    "bn": "গভীরভাবে বিভ্রান্ত",
    "en": "Deeply confused",
    "group": "lost"
  },
  {
    "id": "lost-slightly",
    "emoji": "🧭",
    "bn": "একটু দিশেহারা",
    "en": "A little lost",
    "group": "lost"
  },
  {
    "id": "lost-today",
    "emoji": "🧭",
    "bn": "আজ দিশেহারা",
    "en": "Today I feel lost",
    "group": "lost"
  },
  {
    "id": "lost-quite",
    "emoji": "🧭",
    "bn": "বেশ দিশেহারা",
    "en": "Quite lost",
    "group": "lost"
  },
  {
    "id": "lost-very",
    "emoji": "🧭",
    "bn": "খুব দিশেহারা",
    "en": "Very lost",
    "group": "lost"
  },
  {
    "id": "lost-deeply",
    "emoji": "🧭",
    "bn": "গভীরভাবে দিশেহারা",
    "en": "Deeply lost",
    "group": "lost"
  },
  {
    "id": "numb-slightly",
    "emoji": "🪨",
    "bn": "একটু কিছু অনুভব হচ্ছে না",
    "en": "A little numb",
    "group": "numb"
  },
  {
    "id": "numb-today",
    "emoji": "🪨",
    "bn": "আজ কিছু অনুভব হচ্ছে না",
    "en": "Today I feel numb",
    "group": "numb"
  },
  {
    "id": "numb-quite",
    "emoji": "🪨",
    "bn": "বেশ কিছু অনুভব হচ্ছে না",
    "en": "Quite numb",
    "group": "numb"
  },
  {
    "id": "numb-very",
    "emoji": "🪨",
    "bn": "খুব কিছু অনুভব হচ্ছে না",
    "en": "Very numb",
    "group": "numb"
  },
  {
    "id": "numb-deeply",
    "emoji": "🪨",
    "bn": "গভীরভাবে কিছু অনুভব হচ্ছে না",
    "en": "Deeply numb",
    "group": "numb"
  },
  {
    "id": "embarrassed-slightly",
    "emoji": "😳",
    "bn": "একটু অস্বস্তি লাগছে",
    "en": "A little embarrassed",
    "group": "anxious"
  },
  {
    "id": "embarrassed-today",
    "emoji": "😳",
    "bn": "আজ অস্বস্তি লাগছে",
    "en": "Today I feel embarrassed",
    "group": "anxious"
  },
  {
    "id": "embarrassed-quite",
    "emoji": "😳",
    "bn": "বেশ অস্বস্তি লাগছে",
    "en": "Quite embarrassed",
    "group": "anxious"
  },
  {
    "id": "embarrassed-very",
    "emoji": "😳",
    "bn": "খুব অস্বস্তি লাগছে",
    "en": "Very embarrassed",
    "group": "anxious"
  },
  {
    "id": "embarrassed-deeply",
    "emoji": "😳",
    "bn": "গভীরভাবে অস্বস্তি লাগছে",
    "en": "Deeply embarrassed",
    "group": "anxious"
  },
  {
    "id": "afraid-slightly",
    "emoji": "😨",
    "bn": "একটু ভয় লাগছে",
    "en": "A little afraid",
    "group": "anxious"
  },
  {
    "id": "afraid-today",
    "emoji": "😨",
    "bn": "আজ ভয় লাগছে",
    "en": "Today I feel afraid",
    "group": "anxious"
  },
  {
    "id": "afraid-quite",
    "emoji": "😨",
    "bn": "বেশ ভয় লাগছে",
    "en": "Quite afraid",
    "group": "anxious"
  },
  {
    "id": "afraid-very",
    "emoji": "😨",
    "bn": "খুব ভয় লাগছে",
    "en": "Very afraid",
    "group": "anxious"
  },
  {
    "id": "afraid-deeply",
    "emoji": "😨",
    "bn": "গভীরভাবে ভয় লাগছে",
    "en": "Deeply afraid",
    "group": "anxious"
  },
  {
    "id": "jealous-slightly",
    "emoji": "🟢",
    "bn": "একটু ঈর্ষা হচ্ছে",
    "en": "A little jealous",
    "group": "angry"
  },
  {
    "id": "jealous-today",
    "emoji": "🟢",
    "bn": "আজ ঈর্ষা হচ্ছে",
    "en": "Today I feel jealous",
    "group": "angry"
  },
  {
    "id": "jealous-quite",
    "emoji": "🟢",
    "bn": "বেশ ঈর্ষা হচ্ছে",
    "en": "Quite jealous",
    "group": "angry"
  },
  {
    "id": "jealous-very",
    "emoji": "🟢",
    "bn": "খুব ঈর্ষা হচ্ছে",
    "en": "Very jealous",
    "group": "angry"
  },
  {
    "id": "jealous-deeply",
    "emoji": "🟢",
    "bn": "গভীরভাবে ঈর্ষা হচ্ছে",
    "en": "Deeply jealous",
    "group": "angry"
  },
  {
    "id": "guilty-slightly",
    "emoji": "😔",
    "bn": "একটু অপরাধবোধ হচ্ছে",
    "en": "A little guilty",
    "group": "sad"
  },
  {
    "id": "guilty-today",
    "emoji": "😔",
    "bn": "আজ অপরাধবোধ হচ্ছে",
    "en": "Today I feel guilty",
    "group": "sad"
  },
  {
    "id": "guilty-quite",
    "emoji": "😔",
    "bn": "বেশ অপরাধবোধ হচ্ছে",
    "en": "Quite guilty",
    "group": "sad"
  },
  {
    "id": "guilty-very",
    "emoji": "😔",
    "bn": "খুব অপরাধবোধ হচ্ছে",
    "en": "Very guilty",
    "group": "sad"
  },
  {
    "id": "guilty-deeply",
    "emoji": "😔",
    "bn": "গভীরভাবে অপরাধবোধ হচ্ছে",
    "en": "Deeply guilty",
    "group": "sad"
  },
  {
    "id": "ignored-slightly",
    "emoji": "🫥",
    "bn": "একটু উপেক্ষিত",
    "en": "A little ignored",
    "group": "lonely"
  },
  {
    "id": "ignored-today",
    "emoji": "🫥",
    "bn": "আজ উপেক্ষিত",
    "en": "Today I feel ignored",
    "group": "lonely"
  },
  {
    "id": "ignored-quite",
    "emoji": "🫥",
    "bn": "বেশ উপেক্ষিত",
    "en": "Quite ignored",
    "group": "lonely"
  },
  {
    "id": "ignored-very",
    "emoji": "🫥",
    "bn": "খুব উপেক্ষিত",
    "en": "Very ignored",
    "group": "lonely"
  },
  {
    "id": "ignored-deeply",
    "emoji": "🫥",
    "bn": "গভীরভাবে উপেক্ষিত",
    "en": "Deeply ignored",
    "group": "lonely"
  },
  {
    "id": "misunderstood-slightly",
    "emoji": "🗯️",
    "bn": "একটু কেউ বুঝছে না",
    "en": "A little misunderstood",
    "group": "lonely"
  },
  {
    "id": "misunderstood-today",
    "emoji": "🗯️",
    "bn": "আজ কেউ বুঝছে না",
    "en": "Today I feel misunderstood",
    "group": "lonely"
  },
  {
    "id": "misunderstood-quite",
    "emoji": "🗯️",
    "bn": "বেশ কেউ বুঝছে না",
    "en": "Quite misunderstood",
    "group": "lonely"
  },
  {
    "id": "misunderstood-very",
    "emoji": "🗯️",
    "bn": "খুব কেউ বুঝছে না",
    "en": "Very misunderstood",
    "group": "lonely"
  },
  {
    "id": "misunderstood-deeply",
    "emoji": "🗯️",
    "bn": "গভীরভাবে কেউ বুঝছে না",
    "en": "Deeply misunderstood",
    "group": "lonely"
  },
  {
    "id": "uncertain-slightly",
    "emoji": "🌫️",
    "bn": "একটু অনিশ্চিত",
    "en": "A little uncertain",
    "group": "anxious"
  },
  {
    "id": "uncertain-today",
    "emoji": "🌫️",
    "bn": "আজ অনিশ্চিত",
    "en": "Today I feel uncertain",
    "group": "anxious"
  },
  {
    "id": "uncertain-quite",
    "emoji": "🌫️",
    "bn": "বেশ অনিশ্চিত",
    "en": "Quite uncertain",
    "group": "anxious"
  },
  {
    "id": "uncertain-very",
    "emoji": "🌫️",
    "bn": "খুব অনিশ্চিত",
    "en": "Very uncertain",
    "group": "anxious"
  },
  {
    "id": "uncertain-deeply",
    "emoji": "🌫️",
    "bn": "গভীরভাবে অনিশ্চিত",
    "en": "Deeply uncertain",
    "group": "anxious"
  },
  {
    "id": "restless-slightly",
    "emoji": "🌀",
    "bn": "একটু অস্থির",
    "en": "A little restless",
    "group": "anxious"
  },
  {
    "id": "restless-today",
    "emoji": "🌀",
    "bn": "আজ অস্থির",
    "en": "Today I feel restless",
    "group": "anxious"
  },
  {
    "id": "restless-quite",
    "emoji": "🌀",
    "bn": "বেশ অস্থির",
    "en": "Quite restless",
    "group": "anxious"
  },
  {
    "id": "restless-very",
    "emoji": "🌀",
    "bn": "খুব অস্থির",
    "en": "Very restless",
    "group": "anxious"
  },
  {
    "id": "restless-deeply",
    "emoji": "🌀",
    "bn": "গভীরভাবে অস্থির",
    "en": "Deeply restless",
    "group": "anxious"
  },
  {
    "id": "calm-slightly",
    "emoji": "🍃",
    "bn": "একটু মন শান্ত",
    "en": "A little calm",
    "group": "hopeful"
  },
  {
    "id": "calm-today",
    "emoji": "🍃",
    "bn": "আজ মন শান্ত",
    "en": "Today I feel calm",
    "group": "hopeful"
  },
  {
    "id": "calm-quite",
    "emoji": "🍃",
    "bn": "বেশ মন শান্ত",
    "en": "Quite calm",
    "group": "hopeful"
  },
  {
    "id": "calm-very",
    "emoji": "🍃",
    "bn": "খুব মন শান্ত",
    "en": "Very calm",
    "group": "hopeful"
  },
  {
    "id": "calm-deeply",
    "emoji": "🍃",
    "bn": "গভীরভাবে মন শান্ত",
    "en": "Deeply calm",
    "group": "hopeful"
  },
  {
    "id": "safe-slightly",
    "emoji": "🛟",
    "bn": "একটু নিরাপদ লাগছে",
    "en": "A little feeling safe",
    "group": "hopeful"
  },
  {
    "id": "safe-today",
    "emoji": "🛟",
    "bn": "আজ নিরাপদ লাগছে",
    "en": "Today I feel feeling safe",
    "group": "hopeful"
  },
  {
    "id": "safe-quite",
    "emoji": "🛟",
    "bn": "বেশ নিরাপদ লাগছে",
    "en": "Quite feeling safe",
    "group": "hopeful"
  },
  {
    "id": "safe-very",
    "emoji": "🛟",
    "bn": "খুব নিরাপদ লাগছে",
    "en": "Very feeling safe",
    "group": "hopeful"
  },
  {
    "id": "safe-deeply",
    "emoji": "🛟",
    "bn": "গভীরভাবে নিরাপদ লাগছে",
    "en": "Deeply feeling safe",
    "group": "hopeful"
  }
];

export const seedMoments = [
  {
    "id": "moment-1",
    "alias_bn": "নীরব নদী",
    "alias_en": "Silent River",
    "emoji": "🌧️",
    "mood": "lonely-slightly",
    "bn": "আজ একটু চুপচাপ থাকতে ইচ্ছে করছে।",
    "en": "I feel like staying quiet today.",
    "createdOffset": 900000,
    "empathy": 38
  },
  {
    "id": "moment-2",
    "alias_bn": "ভোরের আলো",
    "alias_en": "Morning Light",
    "emoji": "🌱",
    "mood": "hopeful-today",
    "bn": "কঠিন হলেও আজ আবার চেষ্টা করছি।",
    "en": "It is difficult, but I am trying again today.",
    "createdOffset": 2160000,
    "empathy": 52
  },
  {
    "id": "moment-3",
    "alias_bn": "শান্ত পাখি",
    "alias_en": "Quiet Bird",
    "emoji": "😮‍💨",
    "mood": "relieved-quite",
    "bn": "একটা দীর্ঘ কাজ শেষ হলো—এখন একটু স্বস্তি।",
    "en": "A long task is finally done. I can breathe a little.",
    "createdOffset": 3720000,
    "empathy": 44
  },
  {
    "id": "moment-4",
    "alias_bn": "মেঘলা জানালা",
    "alias_en": "Clouded Window",
    "emoji": "😟",
    "mood": "anxious-very",
    "bn": "আগামীকাল নিয়ে চিন্তা থামছে না।",
    "en": "I cannot stop worrying about tomorrow.",
    "createdOffset": 7200000,
    "empathy": 63
  },
  {
    "id": "moment-5",
    "alias_bn": "নরম বৃষ্টি",
    "alias_en": "Soft Rain",
    "emoji": "💗",
    "mood": "tender-today",
    "bn": "আজ কারও একটি ছোট কথা মন ছুঁয়ে গেছে।",
    "en": "A small kind sentence touched me today.",
    "createdOffset": 10800000,
    "empathy": 31
  },
  {
    "id": "moment-6",
    "alias_bn": "চুপচাপ পথিক",
    "alias_en": "Quiet Wanderer",
    "emoji": "🪫",
    "mood": "burnedout-deeply",
    "bn": "আজ শক্তি একদম কম। শুধু বিশ্রাম দরকার।",
    "en": "My energy is very low today. I need rest.",
    "createdOffset": 18000000,
    "empathy": 71
  },
  {
    "id": "moment-7",
    "alias_bn": "একটু আকাশ",
    "alias_en": "Little Sky",
    "emoji": "😄",
    "mood": "joyful-quite",
    "bn": "অনেকদিন পর আজ সত্যি করে হেসেছি।",
    "en": "I genuinely laughed today after a long time.",
    "createdOffset": 25200000,
    "empathy": 47
  },
  {
    "id": "moment-8",
    "alias_bn": "দূরের তারা",
    "alias_en": "Distant Star",
    "emoji": "🫥",
    "mood": "ignored-today",
    "bn": "কথার মাঝে বারবার হারিয়ে যাচ্ছি মনে হচ্ছে।",
    "en": "I feel invisible in every conversation today.",
    "createdOffset": 32400000,
    "empathy": 59
  }
];

export const posts = [
  {
    "id": 1,
    "alias_bn": "নীরব নদী",
    "alias_en": "Silent River",
    "mood": "lonely",
    "need": "listen",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "৮ মিনিট আগে",
    "time_en": "8 minutes ago",
    "bn": "সারাদিন অনেক মানুষের সঙ্গে কথা বলি, কিন্তু নিজের কথাটা কাউকে বলা হয় না। বাসায় ফিরলে নীরবতাটা আরও বড় লাগে।",
    "en": "I talk to many people all day, yet never say what is really on my mind. When I return home, the silence feels even bigger.",
    "reactions": {
      "hear": 28,
      "with": 17,
      "strength": 12,
      "same": 19
    },
    "comments": 1,
    "supportScore": 75,
    "isFollowing": false
  },
  {
    "id": 2,
    "alias_bn": "মেঘলা জানালা",
    "alias_en": "Clouded Window",
    "mood": "sad",
    "need": "support",
    "topic": "relationship",
    "circle": "study",
    "time_bn": "১৪ মিনিট আগে",
    "time_en": "14 minutes ago",
    "bn": "যার সঙ্গে কথা বললে সবচেয়ে স্বস্তি লাগত, আজ তার সঙ্গেই ভুল বোঝাবুঝি হয়েছে। কথা বলতে চাই, কিন্তু কোথা থেকে শুরু করব বুঝতে পারছি না।",
    "en": "I had a misunderstanding with the person I felt safest talking to. I want to reach out, but I do not know how to begin.",
    "reactions": {
      "hear": 34,
      "with": 21,
      "strength": 18,
      "same": 25
    },
    "comments": 1,
    "supportScore": 82,
    "isFollowing": false
  },
  {
    "id": 3,
    "alias_bn": "অচেনা বন্ধু",
    "alias_en": "Unknown Friend",
    "mood": "anxious",
    "need": "ground",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "১৯ মিনিট আগে",
    "time_en": "19 minutes ago",
    "bn": "আগামীকাল কী হবে সেটা নিয়েই মাথা থামছে না। সব উত্তর এখনই না পেলেও চলবে—এটা নিজেকে বোঝানোর চেষ্টা করছি।",
    "en": "My mind will not stop worrying about tomorrow. I am trying to remind myself that I do not need every answer tonight.",
    "reactions": {
      "hear": 31,
      "with": 15,
      "strength": 24,
      "same": 29
    },
    "comments": 2,
    "supportScore": 89,
    "isFollowing": true
  },
  {
    "id": 4,
    "alias_bn": "নীল সন্ধ্যা",
    "alias_en": "Blue Evening",
    "mood": "overwhelmed",
    "need": "listen",
    "topic": "family",
    "circle": "family",
    "time_bn": "২৬ মিনিট আগে",
    "time_en": "26 minutes ago",
    "bn": "কাজ, সংসার আর পরিবারের দায়িত্ব সামলাতে সামলাতে আমরা দুজন যেন দূরে সরে যাচ্ছি। ঝগড়া নয়—আবার শান্তভাবে কথা বলতে চাই।",
    "en": "Between work, home and family responsibilities, my spouse and I feel far apart. I do not want another argument; I want a calm conversation.",
    "reactions": {
      "hear": 42,
      "with": 27,
      "strength": 22,
      "same": 33
    },
    "comments": 3,
    "supportScore": 96,
    "isFollowing": false
  },
  {
    "id": 5,
    "alias_bn": "শান্ত পাখি",
    "alias_en": "Quiet Bird",
    "mood": "angry",
    "need": "vent",
    "topic": "family",
    "circle": "healing",
    "time_bn": "৩১ মিনিট আগে",
    "time_en": "31 minutes ago",
    "bn": "আমার কথা না শুনেই সিদ্ধান্ত নেওয়া হয়েছে। রাগের নিচে আসলে একটা গভীর অপমানবোধ কাজ করছে।",
    "en": "A decision was made without listening to me. Under the anger, I think I feel deeply disrespected.",
    "reactions": {
      "hear": 20,
      "with": 12,
      "strength": 16,
      "same": 11
    },
    "comments": 0,
    "supportScore": 78,
    "isFollowing": false
  },
  {
    "id": 6,
    "alias_bn": "ভোরের আলো",
    "alias_en": "Morning Light",
    "mood": "numb",
    "need": "listen",
    "topic": "self",
    "circle": "small-wins",
    "time_bn": "৪০ মিনিট আগে",
    "time_en": "40 minutes ago",
    "bn": "কিছুতেই ভালো বা খারাপ লাগছে না। শুধু দিনগুলো পার করছি। এটাও যে একটা কষ্ট, আগে বুঝিনি।",
    "en": "Nothing feels especially good or bad. I am simply moving through the days. I did not know numbness could hurt too.",
    "reactions": {
      "hear": 39,
      "with": 29,
      "strength": 17,
      "same": 36
    },
    "comments": 1,
    "supportScore": 85,
    "isFollowing": true
  },
  {
    "id": 7,
    "alias_bn": "লুকানো চিঠি",
    "alias_en": "Hidden Letter",
    "mood": "lost",
    "need": "support",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "৫২ মিনিট আগে",
    "time_en": "52 minutes ago",
    "bn": "বন্ধুরা সবাই কোথায় যাবে জানে, আমি এখনো নিজের পথ খুঁজছি। দেরি হয়ে যাচ্ছে—এমন ভয়টা কাটে না।",
    "en": "My friends seem to know where they are going, while I am still finding my path. I cannot shake the fear that I am too late.",
    "reactions": {
      "hear": 45,
      "with": 23,
      "strength": 38,
      "same": 30
    },
    "comments": 2,
    "supportScore": 92,
    "isFollowing": false
  },
  {
    "id": 8,
    "alias_bn": "নরম বৃষ্টি",
    "alias_en": "Soft Rain",
    "mood": "hopeful",
    "need": "share",
    "topic": "relationship",
    "circle": "study",
    "time_bn": "১ ঘণ্টা আগে",
    "time_en": "1 hour ago",
    "bn": "আজ বহুদিন পর জানালা খুলে কিছুক্ষণ বৃষ্টি দেখেছি। সমস্যা শেষ হয়নি, কিন্তু মনটা একটু নরম হয়েছে।",
    "en": "Today, after a long time, I opened the window and watched the rain. Nothing is solved, but my mind feels a little softer.",
    "reactions": {
      "hear": 18,
      "with": 11,
      "strength": 26,
      "same": 14
    },
    "comments": 4,
    "supportScore": 99,
    "isFollowing": false
  },
  {
    "id": 9,
    "alias_bn": "দূরের তারা",
    "alias_en": "Distant Star",
    "mood": "lonely",
    "need": "support",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "১ ঘণ্টা আগে",
    "time_en": "1 hour ago",
    "bn": "মেসেজ পাঠানোর মতো অনেক নাম আছে, কিন্তু সত্যি কথা বলার মতো কাউকে খুঁজে পাই না।",
    "en": "There are many names in my contacts, but I cannot think of one person I can be completely honest with.",
    "reactions": {
      "hear": 53,
      "with": 41,
      "strength": 25,
      "same": 48
    },
    "comments": 0,
    "supportScore": 81,
    "isFollowing": true
  },
  {
    "id": 10,
    "alias_bn": "একটু আকাশ",
    "alias_en": "Little Sky",
    "mood": "sad",
    "need": "listen",
    "topic": "work",
    "circle": "family",
    "time_bn": "২ ঘণ্টা আগে",
    "time_en": "2 hours ago",
    "bn": "পুরোনো একটা ছবি দেখে খুব মন খারাপ হলো। মানুষ বদলে যায়, সময়ও যায়—কিন্তু কিছু স্মৃতি একই থাকে।",
    "en": "An old photo made me deeply sad. People change and time moves on, but some memories stay exactly where they were.",
    "reactions": {
      "hear": 37,
      "with": 21,
      "strength": 13,
      "same": 32
    },
    "comments": 1,
    "supportScore": 88,
    "isFollowing": false
  },
  {
    "id": 11,
    "alias_bn": "চুপচাপ পথিক",
    "alias_en": "Quiet Wanderer",
    "mood": "anxious",
    "need": "ground",
    "topic": "family",
    "circle": "healing",
    "time_bn": "২ ঘণ্টা আগে",
    "time_en": "2 hours ago",
    "bn": "ফোন বাজলেই মনে হয় খারাপ কিছু হয়েছে। শরীরটা সবসময় সতর্ক অবস্থায় থাকে। একটু শান্ত হতে শিখতে চাই।",
    "en": "Whenever my phone rings, I assume something bad has happened. My body stays on alert. I want to learn how to soften that feeling.",
    "reactions": {
      "hear": 29,
      "with": 19,
      "strength": 23,
      "same": 27
    },
    "comments": 2,
    "supportScore": 95,
    "isFollowing": false
  },
  {
    "id": 12,
    "alias_bn": "কাগজের নৌকা",
    "alias_en": "Paper Boat",
    "mood": "overwhelmed",
    "need": "support",
    "topic": "self",
    "circle": "small-wins",
    "time_bn": "৩ ঘণ্টা আগে",
    "time_en": "3 hours ago",
    "bn": "সব কাজই জরুরি মনে হচ্ছে। কোনটা আগে করব বুঝতে না পেরে কিছুই শুরু করতে পারছি না।",
    "en": "Every task feels urgent. I cannot decide where to begin, so I have not started anything at all.",
    "reactions": {
      "hear": 40,
      "with": 16,
      "strength": 31,
      "same": 35
    },
    "comments": 3,
    "supportScore": 77,
    "isFollowing": false
  },
  {
    "id": 13,
    "alias_bn": "শিউলি সকাল",
    "alias_en": "Autumn Morning",
    "mood": "angry",
    "need": "listen",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "৩ ঘণ্টা আগে",
    "time_en": "3 hours ago",
    "bn": "বারবার আমাকে “অতিরিক্ত সংবেদনশীল” বলা হয়। কিন্তু যেটা আমাকে আঘাত করেছে, সেটা তো সত্যিই আঘাত করেছে।",
    "en": "People keep calling me “too sensitive.” But what hurt me still hurt, and that matters.",
    "reactions": {
      "hear": 46,
      "with": 33,
      "strength": 28,
      "same": 39
    },
    "comments": 0,
    "supportScore": 84,
    "isFollowing": false
  },
  {
    "id": 14,
    "alias_bn": "অলিখিত গল্প",
    "alias_en": "Unwritten Story",
    "mood": "numb",
    "need": "ground",
    "topic": "relationship",
    "circle": "study",
    "time_bn": "৪ ঘণ্টা আগে",
    "time_en": "4 hours ago",
    "bn": "অনেকদিন ধরে শুধু রুটিন মেনে চলছি। নিজের পছন্দ কী, সেটাই যেন ভুলে গেছি।",
    "en": "I have been following routines for so long that I have almost forgotten what I actually enjoy.",
    "reactions": {
      "hear": 32,
      "with": 18,
      "strength": 21,
      "same": 30
    },
    "comments": 1,
    "supportScore": 91,
    "isFollowing": false
  },
  {
    "id": 15,
    "alias_bn": "ধূসর বিকেল",
    "alias_en": "Grey Afternoon",
    "mood": "lost",
    "need": "support",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "৫ ঘণ্টা আগে",
    "time_en": "5 hours ago",
    "bn": "একটা সিদ্ধান্ত নিলে অন্যটা হারাব—এই ভয়ে কোনো সিদ্ধান্তই নিতে পারছি না।",
    "en": "I am afraid that choosing one path means losing another, so I keep choosing nothing.",
    "reactions": {
      "hear": 26,
      "with": 15,
      "strength": 29,
      "same": 22
    },
    "comments": 3,
    "supportScore": 98,
    "isFollowing": true
  },
  {
    "id": 16,
    "alias_bn": "জোনাকি মন",
    "alias_en": "Firefly Mind",
    "mood": "hopeful",
    "need": "share",
    "topic": "work",
    "circle": "family",
    "time_bn": "৫ ঘণ্টা আগে",
    "time_en": "5 hours ago",
    "bn": "আজ নিজের জন্য চা বানিয়ে ফোনটা দূরে রেখেছিলাম। দশ মিনিটের সেই বিরতিটা আশ্চর্যরকম ভালো লেগেছে।",
    "en": "I made tea for myself and put my phone away. That ten-minute pause felt surprisingly kind.",
    "reactions": {
      "hear": 15,
      "with": 9,
      "strength": 24,
      "same": 17
    },
    "comments": 3,
    "supportScore": 80,
    "isFollowing": false
  },
  {
    "id": 17,
    "alias_bn": "অপরিচিত কণ্ঠ",
    "alias_en": "Unfamiliar Voice",
    "mood": "lonely",
    "need": "listen",
    "topic": "family",
    "circle": "healing",
    "time_bn": "৬ ঘণ্টা আগে",
    "time_en": "6 hours ago",
    "bn": "নতুন শহরে সবাই ব্যস্ত। আমি কারও ওপর বোঝা হতে চাই না, তাই “ভালো আছি” বলেই যাই।",
    "en": "Everyone is busy in this new city. I do not want to become a burden, so I keep saying I am fine.",
    "reactions": {
      "hear": 44,
      "with": 35,
      "strength": 20,
      "same": 37
    },
    "comments": 0,
    "supportScore": 87,
    "isFollowing": false
  },
  {
    "id": 18,
    "alias_bn": "সবুজ বারান্দা",
    "alias_en": "Green Balcony",
    "mood": "sad",
    "need": "support",
    "topic": "self",
    "circle": "small-wins",
    "time_bn": "৬ ঘণ্টা আগে",
    "time_en": "6 hours ago",
    "bn": "যে সম্পর্কটা বাঁচাতে অনেক চেষ্টা করেছি, সেটাই শেষ হয়ে গেল। এখন নিজের মূল্য নিয়েই প্রশ্ন হচ্ছে।",
    "en": "The relationship I worked so hard to save has ended. Now I find myself questioning my own worth.",
    "reactions": {
      "hear": 62,
      "with": 47,
      "strength": 39,
      "same": 51
    },
    "comments": 1,
    "supportScore": 94,
    "isFollowing": false
  },
  {
    "id": 19,
    "alias_bn": "শান্ত ঢেউ",
    "alias_en": "Gentle Wave",
    "mood": "anxious",
    "need": "ground",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "৭ ঘণ্টা আগে",
    "time_en": "7 hours ago",
    "bn": "একটা ভুলের কথা বারবার মনে পড়ছে। সবাই হয়তো ভুলে গেছে, কিন্তু আমার মাথা ভুলতে দিচ্ছে না।",
    "en": "I keep replaying one mistake. Everyone else may have forgotten it, but my mind will not let it go.",
    "reactions": {
      "hear": 36,
      "with": 22,
      "strength": 25,
      "same": 31
    },
    "comments": 2,
    "supportScore": 76,
    "isFollowing": false
  },
  {
    "id": 20,
    "alias_bn": "রাতজাগা মন",
    "alias_en": "Wakeful Heart",
    "mood": "sad",
    "need": "vent",
    "topic": "relationship",
    "circle": "study",
    "time_bn": "৮ ঘণ্টা আগে",
    "time_en": "8 hours ago",
    "bn": "সম্পর্কে সবসময় শক্ত মানুষ হয়ে থাকতে থাকতে ক্লান্ত হয়ে গেছি। আমিও চাই কেউ আমার কথা না থামিয়ে একটু শুনুক।",
    "en": "I am tired of always being the strong one in this relationship. I wish someone would listen without interrupting me.",
    "reactions": {
      "hear": 58,
      "with": 49,
      "strength": 32,
      "same": 44
    },
    "comments": 3,
    "supportScore": 83,
    "isFollowing": false
  },
  {
    "id": 21,
    "alias_bn": "নীরব নদী",
    "alias_en": "Silent River",
    "mood": "angry",
    "need": "vent",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "৯ ঘণ্টা আগে",
    "time_en": "9 hours ago",
    "bn": "আমার সীমা পরিষ্কার করে বলার পরও সেটা মানা হয়নি। এবার নিজের পক্ষে দাঁড়াতে চাই।",
    "en": "I clearly stated my boundary and it was ignored. This time, I want to stand up for myself.",
    "reactions": {
      "hear": 28,
      "with": 17,
      "strength": 35,
      "same": 19
    },
    "comments": 0,
    "supportScore": 90,
    "isFollowing": false
  },
  {
    "id": 22,
    "alias_bn": "মেঘলা জানালা",
    "alias_en": "Clouded Window",
    "mood": "numb",
    "need": "listen",
    "topic": "work",
    "circle": "family",
    "time_bn": "১০ ঘণ্টা আগে",
    "time_en": "10 hours ago",
    "bn": "কেউ জিজ্ঞেস করলে কী বলব বুঝি না। “কিছু না” বলি, যদিও ভেতরে অনেক কিছু আটকে থাকে।",
    "en": "When someone asks what is wrong, I do not know how to answer. I say “nothing,” although so much is stuck inside.",
    "reactions": {
      "hear": 41,
      "with": 30,
      "strength": 20,
      "same": 38
    },
    "comments": 2,
    "supportScore": 97,
    "isFollowing": false
  },
  {
    "id": 23,
    "alias_bn": "অচেনা বন্ধু",
    "alias_en": "Unknown Friend",
    "mood": "lost",
    "need": "support",
    "topic": "family",
    "circle": "healing",
    "time_bn": "১১ ঘণ্টা আগে",
    "time_en": "11 hours ago",
    "bn": "যে স্বপ্নটা অনেকদিন ধরে ছিল, সেটা এখন আর নিজের মনে হয় না। নতুন করে শুরু করাটা ভয় লাগছে।",
    "en": "The dream I carried for years no longer feels like mine. Starting again feels frightening.",
    "reactions": {
      "hear": 30,
      "with": 19,
      "strength": 34,
      "same": 25
    },
    "comments": 2,
    "supportScore": 79,
    "isFollowing": false
  },
  {
    "id": 24,
    "alias_bn": "নীল সন্ধ্যা",
    "alias_en": "Blue Evening",
    "mood": "hopeful",
    "need": "share",
    "topic": "self",
    "circle": "small-wins",
    "time_bn": "১২ ঘণ্টা আগে",
    "time_en": "12 hours ago",
    "bn": "আজ একজন পুরোনো বন্ধু নিজে থেকে খোঁজ নিয়েছে। ছোট্ট একটা বার্তাও কখনো কখনো দিন বদলে দেয়।",
    "en": "An old friend checked on me today. Sometimes one small message changes the shape of an entire day.",
    "reactions": {
      "hear": 17,
      "with": 12,
      "strength": 28,
      "same": 15
    },
    "comments": 3,
    "supportScore": 86,
    "isFollowing": true
  },
  {
    "id": 25,
    "alias_bn": "শান্ত পাখি",
    "alias_en": "Quiet Bird",
    "mood": "lonely",
    "need": "support",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "গতকাল",
    "time_en": "Yesterday",
    "bn": "উৎসবের ছবিগুলো দেখলে মনে হয় সবাই কোনো না কোনো দলের অংশ, শুধু আমি বাইরে দাঁড়িয়ে আছি।",
    "en": "Celebration photos make it look like everyone belongs somewhere while I am standing outside it all.",
    "reactions": {
      "hear": 50,
      "with": 39,
      "strength": 23,
      "same": 46
    },
    "comments": 0,
    "supportScore": 93,
    "isFollowing": false
  },
  {
    "id": 26,
    "alias_bn": "ভোরের আলো",
    "alias_en": "Morning Light",
    "mood": "sad",
    "need": "listen",
    "topic": "relationship",
    "circle": "study",
    "time_bn": "গতকাল",
    "time_en": "Yesterday",
    "bn": "আমার পোষা প্রাণীটাকে খুব মনে পড়ছে। মানুষ হয়তো বুঝবে না, কিন্তু সে ছিল আমার প্রতিদিনের সঙ্গী।",
    "en": "I miss my pet deeply. Some people may not understand, but that little life was part of every day I had.",
    "reactions": {
      "hear": 55,
      "with": 42,
      "strength": 18,
      "same": 37
    },
    "comments": 1,
    "supportScore": 75,
    "isFollowing": false
  },
  {
    "id": 27,
    "alias_bn": "লুকানো চিঠি",
    "alias_en": "Hidden Letter",
    "mood": "anxious",
    "need": "ground",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "গতকাল",
    "time_en": "Yesterday",
    "bn": "পরীক্ষা সামনে। পড়ছি, তবুও মনে হচ্ছে কিছুই মনে নেই। শরীরটা বিশ্রাম চায়, মাথা অনুমতি দেয় না।",
    "en": "My exam is close. I am studying, yet it feels like I remember nothing. My body wants rest, but my mind refuses.",
    "reactions": {
      "hear": 33,
      "with": 16,
      "strength": 30,
      "same": 29
    },
    "comments": 2,
    "supportScore": 82,
    "isFollowing": false
  },
  {
    "id": 28,
    "alias_bn": "নরম বৃষ্টি",
    "alias_en": "Soft Rain",
    "mood": "overwhelmed",
    "need": "listen",
    "topic": "work",
    "circle": "family",
    "time_bn": "গতকাল",
    "time_en": "Yesterday",
    "bn": "একসাথে পরিবারের সমস্যা আর অফিসের চাপ সামলাতে গিয়ে নিজের যত্নটা কোথায় হারিয়ে ফেলেছি জানি না।",
    "en": "Between family problems and work pressure, I do not know where I lost the habit of caring for myself.",
    "reactions": {
      "hear": 48,
      "with": 31,
      "strength": 27,
      "same": 40
    },
    "comments": 3,
    "supportScore": 89,
    "isFollowing": false
  },
  {
    "id": 29,
    "alias_bn": "দূরের তারা",
    "alias_en": "Distant Star",
    "mood": "overwhelmed",
    "need": "support",
    "topic": "family",
    "circle": "healing",
    "time_bn": "গতকাল",
    "time_en": "Yesterday",
    "bn": "সংসারে শান্তি রাখার জন্য বারবার আমিই চুপ থাকি এবং ক্ষমা চাই। কিন্তু না বলা কষ্টগুলো জমে যাচ্ছে—কীভাবে সম্মানের সঙ্গে কথা বলব বুঝতে চাই।",
    "en": "I often stay quiet and apologize just to keep peace at home. The unspoken hurt is building, and I want to speak with respect.",
    "reactions": {
      "hear": 43,
      "with": 28,
      "strength": 31,
      "same": 36
    },
    "comments": 1,
    "supportScore": 96,
    "isFollowing": false
  },
  {
    "id": 30,
    "alias_bn": "একটু আকাশ",
    "alias_en": "Little Sky",
    "mood": "numb",
    "need": "ground",
    "topic": "self",
    "circle": "small-wins",
    "time_bn": "২ দিন আগে",
    "time_en": "2 days ago",
    "bn": "আগে গান শুনলে ভালো লাগত। এখন প্লেলিস্ট চালাই, কিন্তু কোনো গানই ভেতরে পৌঁছায় না।",
    "en": "Music used to reach me. Now I play my old playlists, but every song seems to stop at the surface.",
    "reactions": {
      "hear": 38,
      "with": 27,
      "strength": 18,
      "same": 34
    },
    "comments": 1,
    "supportScore": 78,
    "isFollowing": false
  },
  {
    "id": 31,
    "alias_bn": "চুপচাপ পথিক",
    "alias_en": "Quiet Wanderer",
    "mood": "lost",
    "need": "support",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "২ দিন আগে",
    "time_en": "2 days ago",
    "bn": "ক্যারিয়ার বদলাতে চাই, কিন্তু এতদিনের পরিশ্রম নষ্ট হয়ে যাবে কি না ভাবছি। নিজের জন্য সঠিক সিদ্ধান্তটা কী?",
    "en": "I want to change careers, but I worry that years of work will be wasted. I do not know what the right choice for me is.",
    "reactions": {
      "hear": 29,
      "with": 16,
      "strength": 37,
      "same": 24
    },
    "comments": 2,
    "supportScore": 85,
    "isFollowing": false
  },
  {
    "id": 32,
    "alias_bn": "কাগজের নৌকা",
    "alias_en": "Paper Boat",
    "mood": "hopeful",
    "need": "share",
    "topic": "relationship",
    "circle": "study",
    "time_bn": "২ দিন আগে",
    "time_en": "2 days ago",
    "bn": "গত সপ্তাহে খুব খারাপ ছিলাম। আজ নিজে থেকে গোসল করে বাইরে একটু হাঁটলাম। ছোট হলেও এটা আমার জয়।",
    "en": "Last week was very hard. Today I showered and took a short walk. It may be small, but it is my win.",
    "reactions": {
      "hear": 21,
      "with": 18,
      "strength": 49,
      "same": 25
    },
    "comments": 3,
    "supportScore": 92,
    "isFollowing": true
  },
  {
    "id": 33,
    "alias_bn": "শিউলি সকাল",
    "alias_en": "Autumn Morning",
    "mood": "lonely",
    "need": "listen",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "৩ দিন আগে",
    "time_en": "3 days ago",
    "bn": "পরিবারের মাঝে থেকেও নিজের মতো হতে পারি না। আমার নীরব সংস্করণটাকেই সবাই চেনে।",
    "en": "Even with family around me, I cannot fully be myself. Everyone knows only the quieter version of me.",
    "reactions": {
      "hear": 47,
      "with": 34,
      "strength": 24,
      "same": 42
    },
    "comments": 0,
    "supportScore": 99,
    "isFollowing": false
  },
  {
    "id": 34,
    "alias_bn": "অলিখিত গল্প",
    "alias_en": "Unwritten Story",
    "mood": "sad",
    "need": "support",
    "topic": "work",
    "circle": "family",
    "time_bn": "৩ দিন আগে",
    "time_en": "3 days ago",
    "bn": "একটা সুযোগ হাতছাড়া হয়েছে। অন্য সুযোগ আসবে জানি, কিন্তু আজকের হতাশাটাও সত্যি।",
    "en": "I missed an opportunity. I know another may come, but today’s disappointment is real too.",
    "reactions": {
      "hear": 26,
      "with": 14,
      "strength": 32,
      "same": 20
    },
    "comments": 1,
    "supportScore": 81,
    "isFollowing": false
  },
  {
    "id": 35,
    "alias_bn": "ধূসর বিকেল",
    "alias_en": "Grey Afternoon",
    "mood": "anxious",
    "need": "ground",
    "topic": "family",
    "circle": "healing",
    "time_bn": "৪ দিন আগে",
    "time_en": "4 days ago",
    "bn": "রাতে শুয়ে দিনের সব কথোপকথন বিশ্লেষণ করি। কে কী ভাবল—এই প্রশ্ন থেকে বের হতে চাই।",
    "en": "At night I analyze every conversation from the day. I want to stop living inside the question of what everyone thought of me.",
    "reactions": {
      "hear": 35,
      "with": 20,
      "strength": 27,
      "same": 33
    },
    "comments": 2,
    "supportScore": 88,
    "isFollowing": false
  },
  {
    "id": 36,
    "alias_bn": "জোনাকি মন",
    "alias_en": "Firefly Mind",
    "mood": "overwhelmed",
    "need": "vent",
    "topic": "self",
    "circle": "small-wins",
    "time_bn": "৪ দিন আগে",
    "time_en": "4 days ago",
    "bn": "অনেকদিন ছুটি নেই। বিশ্রাম নিলেও মাথায় কাজ ঘোরে। আমি সত্যিকারের বিরতি চাই।",
    "en": "I have not had a real break in a long time. Even while resting, work keeps running through my head.",
    "reactions": {
      "hear": 39,
      "with": 24,
      "strength": 29,
      "same": 31
    },
    "comments": 4,
    "supportScore": 95,
    "isFollowing": false
  },
  {
    "id": 37,
    "alias_bn": "অপরিচিত কণ্ঠ",
    "alias_en": "Unfamiliar Voice",
    "mood": "angry",
    "need": "listen",
    "topic": "life",
    "circle": "late-night",
    "time_bn": "৫ দিন আগে",
    "time_en": "5 days ago",
    "bn": "আমাকে নিয়ে রসিকতা করা হয়েছে, পরে বলা হলো “মজা করছিলাম।” আমার অস্বস্তিটা তবুও সত্যি।",
    "en": "Someone joked at my expense and later said they were only having fun. My discomfort is still real.",
    "reactions": {
      "hear": 31,
      "with": 21,
      "strength": 26,
      "same": 28
    },
    "comments": 0,
    "supportScore": 77,
    "isFollowing": false
  },
  {
    "id": 38,
    "alias_bn": "সবুজ বারান্দা",
    "alias_en": "Green Balcony",
    "mood": "overwhelmed",
    "need": "support",
    "topic": "family",
    "circle": "study",
    "time_bn": "৫ দিন আগে",
    "time_en": "5 days ago",
    "bn": "একই ঘরে থাকি, তবুও আমাদের মধ্যে কথা কমে গেছে। দাম্পত্যের এই নীরব দূরত্বটা কীভাবে কমাব বুঝতে পারছি না।",
    "en": "We live in the same home, yet we hardly talk anymore. I do not know how to reduce this quiet distance in our marriage.",
    "reactions": {
      "hear": 40,
      "with": 32,
      "strength": 30,
      "same": 35
    },
    "comments": 1,
    "supportScore": 84,
    "isFollowing": false
  },
  {
    "id": 39,
    "alias_bn": "শান্ত ঢেউ",
    "alias_en": "Gentle Wave",
    "mood": "lost",
    "need": "listen",
    "topic": "study",
    "circle": "jobs-pressure",
    "time_bn": "৬ দিন আগে",
    "time_en": "6 days ago",
    "bn": "নিজের সিদ্ধান্তের বদলে সবসময় অন্যদের খুশি করেছি। এখন নিজের কণ্ঠটা চিনতেই কষ্ট হচ্ছে।",
    "en": "I have spent so long making choices for other people that I barely recognize my own voice anymore.",
    "reactions": {
      "hear": 44,
      "with": 29,
      "strength": 36,
      "same": 38
    },
    "comments": 2,
    "supportScore": 91,
    "isFollowing": false
  },
  {
    "id": 40,
    "alias_bn": "রাতজাগা মন",
    "alias_en": "Wakeful Heart",
    "mood": "hopeful",
    "need": "share",
    "topic": "work",
    "circle": "family",
    "time_bn": "১ সপ্তাহ আগে",
    "time_en": "1 week ago",
    "bn": "আজ প্রথমবার কাউকে বলেছি যে আমি ভালো নেই। উত্তরটা নিখুঁত ছিল না, কিন্তু কথাটা বলা আমাকে হালকা করেছে।",
    "en": "Today I told someone for the first time that I am not okay. Their response was not perfect, but saying it made me lighter.",
    "reactions": {
      "hear": 27,
      "with": 25,
      "strength": 46,
      "same": 32
    },
    "comments": 3,
    "supportScore": 98,
    "isFollowing": false
  }
];

export const quotes = [
  {
    "bn": "আজ পুরো জীবন ঠিক করতে হবে না। শুধু পরবর্তী কোমল পদক্ষেপটি নিন।",
    "en": "You do not have to fix your whole life today. Take only the next gentle step."
  },
  {
    "bn": "আপনার অনুভূতিকে প্রমাণ করতে হবে না—অনুভব করাই যথেষ্ট।",
    "en": "You do not have to prove your feelings. Feeling them is enough."
  },
  {
    "bn": "বিশ্রাম কোনো পুরস্কার নয়; এটি মানুষের প্রয়োজন।",
    "en": "Rest is not a reward. It is a human need."
  },
  {
    "bn": "আপনি পিছিয়ে নেই; আপনি আপনার নিজের গতিতে এগোচ্ছেন।",
    "en": "You are not behind. You are moving at the pace your life allows."
  },
  {
    "bn": "একটি নিরাপদ কথোপকথন কখনো কখনো একটি ভারী রাত বদলে দিতে পারে।",
    "en": "One safe conversation can change the shape of a heavy night."
  },
  {
    "bn": "কিছু দিন শুধু টিকে থাকাও বড় সাফল্য।",
    "en": "On some days, simply staying is a meaningful achievement."
  },
  {
    "bn": "আপনার সীমা অন্যকে শাস্তি দেওয়া নয়; নিজেকে রক্ষা করা।",
    "en": "Your boundary is not punishment. It is protection."
  },
  {
    "bn": "কান্না ভেঙে পড়া নয়; চাপের একটি মানবিক মুক্তি।",
    "en": "Tears are not failure. They are a human release of pressure."
  },
  {
    "bn": "আপনার গল্পের এই অধ্যায়টি কঠিন—কিন্তু পুরো গল্প নয়।",
    "en": "This chapter of your story is difficult, but it is not the whole story."
  },
  {
    "bn": "সাহায্য চাওয়া মানে আপনি নিজের পক্ষে দাঁড়াচ্ছেন।",
    "en": "Asking for support means you are choosing to stand beside yourself."
  },
  {
    "bn": "আজকের লক্ষ্য হতে পারে: পানি, শ্বাস, একজন মানুষ।",
    "en": "Today’s plan can be simple: water, breath, one trusted person."
  },
  {
    "bn": "আপনার ভেতরের নীরব অংশটিও শোনার যোগ্য।",
    "en": "Even the quietest part of you deserves to be heard."
  }
];

export const supportTemplates = [
  {
    "bn": "আমি আপনার কথা পড়েছি। আপনার অনুভূতিকে ছোট করে দেখছি না।",
    "en": "I read your words. I am not minimizing what you feel."
  },
  {
    "bn": "আপনাকে এখনই সব সমাধান করতে হবে না। আমি কিছুক্ষণ আপনার পাশে আছি।",
    "en": "You do not have to solve everything right now. I am staying with you for a moment."
  },
  {
    "bn": "এটা শেয়ার করতে সাহস লেগেছে। বলার জন্য ধন্যবাদ।",
    "en": "It took courage to share this. Thank you for saying it."
  },
  {
    "bn": "আপনার কষ্টের পেছনে একটি কারণ আছে, এমনকি এখন ভাষা খুঁজে না পেলেও।",
    "en": "There is a reason this hurts, even when words are hard to find."
  },
  {
    "bn": "আজ নিজের জন্য একটি ছোট কোমল কাজ বেছে নিন—পানি, বিশ্রাম বা একজন মানুষের কাছে থাকা।",
    "en": "Choose one gentle thing for yourself today: water, rest, or staying near someone."
  },
  {
    "bn": "আপনি একা নন। একই ধরনের অনুভূতির ভেতর দিয়ে আরও মানুষ যাচ্ছে।",
    "en": "You are not alone. Other people are moving through feelings like these too."
  }
];

export const sampleComments = [
  { alias_bn:"নরম আলো", alias_en:"Soft Light", bn:"আপনার কথাটা ধীরে ধীরে পড়েছি। আজ সব উত্তর না পেলেও আপনি একা নন।", en:"I read your words slowly. You may not have every answer today, but you are not alone." },
  { alias_bn:"অচেনা সাথী", alias_en:"Unknown Companion", bn:"সমাধান দিতে আসিনি—শুধু জানাতে চাই, আপনার অনুভূতিটা গুরুত্বহীন নয়।", en:"I am not here to fix it. I only want you to know your feelings are not insignificant." },
  { alias_bn:"শান্ত সকাল", alias_en:"Quiet Morning", bn:"এতটুকু শেয়ার করাও সাহসের কাজ। নিজের প্রতি আজ একটু কোমল থাকবেন।", en:"Sharing even this much takes courage. Please be a little gentle with yourself today." },
  { alias_bn:"নীল বারান্দা", alias_en:"Blue Balcony", bn:"এই অনুভূতিটা আমারও পরিচিত। কিছুক্ষণ আপনার পাশে বসে আছি।", en:"This feeling is familiar to me too. I am sitting beside you for a moment." },
  { alias_bn:"দূরের বন্ধু", alias_en:"Distant Friend", bn:"আপনাকে প্রমাণ করতে হবে না যে কষ্টটা সত্যি। আমি শুনছি।", en:"You do not need to prove that your pain is real. I am listening." }
];

export const notificationsSeed = [
  { id:1, kind:"reaction", time_bn:"২ মিনিট আগে", time_en:"2 minutes ago", bn:"শান্ত ঢেউ আপনার পোস্টে ‘আমি শুনছি’ পাঠিয়েছেন।", en:"Gentle Wave sent ‘I hear you’ to your post." },
  { id:2, kind:"comment", time_bn:"১৮ মিনিট আগে", time_en:"18 minutes ago", bn:"নরম আলো আপনার কথার নিচে একটি সহমর্মী উত্তর দিয়েছেন।", en:"Soft Light left a supportive reply under your post." },
  { id:3, kind:"circle", time_bn:"১ ঘণ্টা আগে", time_en:"1 hour ago", bn:"‘আজকের ছোট জয়’ সার্কেলে নতুন ১২টি গল্প এসেছে।", en:"12 new stories were shared in Small wins today." },
  { id:4, kind:"checkin", time_bn:"আজ সকাল", time_en:"This morning", bn:"আজকের এক মিনিটের অনুভূতি জানানোর কাজটি এখনো বাকি আছে।", en:"Your one-minute mood check-in is still waiting." }
];
