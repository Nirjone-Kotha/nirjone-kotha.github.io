const QURAN_DATA_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";
const HADITH_DATA_BASE = "https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_chapter";
const HADITH_SAMPLE_URL = `${HADITH_DATA_BASE}/the_9_books/bukhari/1.json`;
const DUA_DATA_URL = "https://cdn.jsdelivr.net/gh/Seen-Arabic/Morning-And-Evening-Adhkar-DB@main/ar.json";

const pad3 = value => String(value).padStart(3, "0");
export const quranAudioUrl = (surah, ayah) => `https://everyayah.com/data/Alafasy_128kbps/${pad3(surah)}${pad3(ayah)}.mp3`;

export const islamicTabs = [
  { id: "quran", en: "Qur'an", bn: "কুরআন" },
  { id: "hadith", en: "Hadith", bn: "হাদিস" },
  { id: "dua", en: "Dua", bn: "দোয়া" },
  { id: "islamic-video", en: "Islamic video", bn: "ইসলামিক ভিডিও" }
];

/**
 * Fallback text is intentionally complete rather than excerpt-only. Remote editions
 * are preferred at runtime so Arabic, Bengali and English stay aligned by verse.
 */
const quranSeeds = [
  {
    id:"q-94-5", surah:94, ayah:5, moods:["sad","overwhelmed","lost"],
    arabic:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    bn:"অতএব নিশ্চয়ই কষ্টের সঙ্গে স্বস্তি রয়েছে।",
    en:"For indeed, with hardship comes ease.", source:"Qur'an 94:5"
  },
  {
    id:"q-94-6", surah:94, ayah:6, moods:["sad","overwhelmed","hopeful"],
    arabic:"إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    bn:"নিশ্চয়ই কষ্টের সঙ্গেই স্বস্তি রয়েছে।",
    en:"Indeed, with hardship comes ease.", source:"Qur'an 94:6"
  },
  {
    id:"q-13-28", surah:13, ayah:28, moods:["anxious","numb","lost"],
    arabic:"الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    bn:"যারা ঈমান এনেছে এবং আল্লাহর স্মরণে যাদের অন্তর প্রশান্ত হয়। জেনে রাখুন, আল্লাহর স্মরণেই অন্তরসমূহ প্রশান্ত হয়।",
    en:"Those who believe and whose hearts find comfort in the remembrance of Allah. Surely, in the remembrance of Allah do hearts find comfort.", source:"Qur'an 13:28"
  },
  {
    id:"q-39-53", surah:39, ayah:53, moods:["lost","sad","numb","hopeful"],
    arabic:"قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
    bn:"বলুন, ‘হে আমার বান্দারা, যারা নিজেদের ওপর সীমালঙ্ঘন করেছ, তোমরা আল্লাহর রহমত থেকে নিরাশ হয়ো না। নিশ্চয়ই আল্লাহ সব গুনাহ ক্ষমা করেন। নিশ্চয়ই তিনিই পরম ক্ষমাশীল, পরম দয়ালু।’",
    en:"Say, ‘O My servants who have transgressed against themselves, do not despair of Allah's mercy. Surely Allah forgives all sins. He is truly the Most Forgiving, the Most Merciful.’", source:"Qur'an 39:53"
  },
  {
    id:"q-2-286", surah:2, ayah:286, moods:["overwhelmed","anxious","lost"],
    arabic:"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    bn:"আল্লাহ কোনো প্রাণকে তার সামর্থ্যের বাইরে দায়িত্ব দেন না। সে যা ভালো অর্জন করে তা তারই জন্য, আর যা মন্দ অর্জন করে তা তারই ওপর। হে আমাদের রব, আমরা ভুলে গেলে বা ভুল করলে আমাদের পাকড়াও করবেন না। হে আমাদের রব, আমাদের ওপর এমন বোঝা চাপাবেন না, যেমন আমাদের পূর্ববর্তীদের ওপর চাপিয়েছিলেন। হে আমাদের রব, আমাদের ওপর এমন কিছু চাপাবেন না যা বহন করার শক্তি আমাদের নেই। আমাদের ক্ষমা করুন, আমাদের মাফ করুন এবং আমাদের প্রতি দয়া করুন। আপনিই আমাদের অভিভাবক; অতএব অবিশ্বাসী সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।",
    en:"Allah does not burden any soul beyond its capacity. It will have what it has earned, and it will bear what it has committed. Our Lord, do not punish us if we forget or make a mistake. Our Lord, do not place on us a burden like the one You placed on those before us. Our Lord, do not burden us with what we cannot bear. Pardon us, forgive us, and have mercy on us. You are our Protector, so help us against the disbelieving people.", source:"Qur'an 2:286"
  },
  {
    id:"q-3-139", surah:3, ayah:139, moods:["sad","lost","hopeful"],
    arabic:"وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    bn:"তোমরা দুর্বল হয়ো না এবং দুঃখও করো না; যদি তোমরা মুমিন হও, তবে তোমরাই বিজয়ী হবে।",
    en:"Do not lose heart or grieve, for you will have the upper hand if you are true believers.", source:"Qur'an 3:139"
  },
  {
    id:"q-2-153", surah:2, ayah:153, moods:["overwhelmed","angry","anxious"],
    arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    bn:"হে মুমিনগণ, ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও। নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সঙ্গে আছেন।",
    en:"O believers, seek comfort in patience and prayer. Allah is truly with those who are patient.", source:"Qur'an 2:153"
  },
  {
    id:"q-2-186", surah:2, ayah:186, moods:["lonely","lost","hopeful"],
    arabic:"وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
    bn:"আর আমার বান্দারা যখন আমার সম্পর্কে আপনাকে জিজ্ঞেস করে, তখন আমি তো নিকটেই আছি। আহ্বানকারী যখন আমাকে আহ্বান করে, আমি তার আহ্বানে সাড়া দিই। সুতরাং তারা যেন আমার ডাকে সাড়া দেয় এবং আমার প্রতি ঈমান আনে, যাতে তারা সঠিক পথ পায়।",
    en:"When My servants ask you about Me, I am truly near. I respond to the prayer of the caller when they call upon Me. So let them respond to Me and believe in Me, so that they may be guided.", source:"Qur'an 2:186"
  },
  {
    id:"q-9-40", surah:9, ayah:40, moods:["lonely","anxious","lost"],
    arabic:"إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا ۖ فَأَنزَلَ اللَّهُ سَكِينَتَهُ عَلَيْهِ وَأَيَّدَهُ بِجُنُودٍ لَّمْ تَرَوْهَا وَجَعَلَ كَلِمَةَ الَّذِينَ كَفَرُوا السُّفْلَىٰ ۗ وَكَلِمَةُ اللَّهِ هِيَ الْعُلْيَا ۗ وَاللَّهُ عَزِيزٌ حَكِيمٌ",
    bn:"তোমরা যদি তাঁকে সাহায্য না করো, তবে আল্লাহ তাঁকে সাহায্য করেছিলেন, যখন অবিশ্বাসীরা তাঁকে বের করে দিয়েছিল। তিনি ছিলেন দুজনের একজন; যখন তাঁরা গুহায় ছিলেন এবং তিনি তাঁর সঙ্গীকে বলেছিলেন, ‘দুঃখ করো না, নিশ্চয়ই আল্লাহ আমাদের সঙ্গে আছেন।’ তখন আল্লাহ তাঁর ওপর প্রশান্তি নাজিল করেন, অদৃশ্য বাহিনী দিয়ে তাঁকে শক্তিশালী করেন এবং অবিশ্বাসীদের কথাকে নিচু করে দেন। আর আল্লাহর বাণীই সর্বোচ্চ। আল্লাহ পরাক্রমশালী, প্রজ্ঞাময়।",
    en:"If you do not support him, Allah already supported him when the disbelievers drove him out, as one of two. While they were in the cave, he reassured his companion, ‘Do not worry; Allah is certainly with us.’ Then Allah sent down His serenity upon him, supported him with forces you could not see, and made the word of the disbelievers lowest, while Allah's Word is supreme. Allah is Almighty, All-Wise.", source:"Qur'an 9:40"
  },
  {
    id:"q-12-87", surah:12, ayah:87, moods:["lost","sad","hopeful"],
    arabic:"يَا بَنِيَّ اذْهَبُوا فَتَحَسَّسُوا مِن يُوسُفَ وَأَخِيهِ وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    bn:"হে আমার পুত্ররা, তোমরা যাও এবং ইউসুফ ও তার ভাইয়ের খোঁজ নাও। আল্লাহর অনুগ্রহ থেকে নিরাশ হয়ো না। নিশ্চয়ই অবিশ্বাসী সম্প্রদায় ছাড়া কেউ আল্লাহর অনুগ্রহ থেকে নিরাশ হয় না।",
    en:"O my sons, go and search diligently for Joseph and his brother, and do not lose hope in Allah's mercy. No one loses hope in Allah's mercy except the disbelieving people.", source:"Qur'an 12:87"
  },
  {
    id:"q-20-46", surah:20, ayah:46, moods:["anxious","lonely","overwhelmed"],
    arabic:"قَالَ لَا تَخَافَا ۖ إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَىٰ",
    bn:"তিনি বললেন, ‘তোমরা ভয় করো না। নিশ্চয়ই আমি তোমাদের সঙ্গে আছি; আমি শুনি এবং দেখি।’",
    en:"Allah reassured them, ‘Do not fear. I am with you both, hearing and seeing.’", source:"Qur'an 20:46"
  },
  {
    id:"q-40-60", surah:40, ayah:60, moods:["lonely","lost","hopeful"],
    arabic:"وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ ۚ إِنَّ الَّذِينَ يَسْتَكْبِرُونَ عَنْ عِبَادَتِي سَيَدْخُلُونَ جَهَنَّمَ دَاخِرِينَ",
    bn:"তোমাদের রব বলেছেন, ‘তোমরা আমাকে ডাকো, আমি তোমাদের ডাকে সাড়া দেব। যারা অহংকারবশত আমার ইবাদত থেকে বিমুখ হয়, তারা অবশ্যই লাঞ্ছিত হয়ে জাহান্নামে প্রবেশ করবে।’",
    en:"Your Lord has proclaimed, ‘Call upon Me, and I will respond to you. Surely those who are too proud to worship Me will enter Hell in humiliation.’", source:"Qur'an 40:60"
  },
  {
    id:"q-65-3", surah:65, ayah:3, moods:["anxious","overwhelmed","hopeful"],
    arabic:"وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    bn:"আর তিনি তাকে এমন উৎস থেকে রিজিক দেবেন যা সে কল্পনাও করতে পারে না। যে আল্লাহর ওপর ভরসা করে, তিনিই তার জন্য যথেষ্ট। নিশ্চয়ই আল্লাহ তাঁর উদ্দেশ্য পূর্ণ করেন। আল্লাহ প্রত্যেক কিছুর জন্য একটি নির্ধারিত পরিমাণ রেখেছেন।",
    en:"And He will provide for them from sources they could never imagine. Whoever puts their trust in Allah, He is sufficient for them. Allah will certainly accomplish His purpose. Allah has set a measure for everything.", source:"Qur'an 65:3"
  },
  {
    id:"q-93-3", surah:93, ayah:3, moods:["lonely","sad","numb"],
    arabic:"مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    bn:"আপনার রব আপনাকে ত্যাগ করেননি এবং আপনার প্রতি অসন্তুষ্টও হননি।",
    en:"Your Lord has not abandoned you, nor has He become hateful of you.", source:"Qur'an 93:3"
  },
  {
    id:"q-93-5", surah:93, ayah:5, moods:["sad","lost","hopeful"],
    arabic:"وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    bn:"অচিরেই আপনার রব আপনাকে এত দেবেন যে আপনি সন্তুষ্ট হবেন।",
    en:"And your Lord will certainly give you so much that you will be pleased.", source:"Qur'an 93:5"
  },
  {
    id:"q-1-5", surah:1, ayah:5, moods:["lost","overwhelmed","hopeful"],
    arabic:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    bn:"আমরা শুধু আপনারই ইবাদত করি এবং শুধু আপনারই সাহায্য চাই।",
    en:"You alone we worship, and You alone we ask for help.", source:"Qur'an 1:5"
  }
].map(item=>({...item,audio:quranAudioUrl(item.surah,item.ayah),kind:"quran",likes:0}));

const hadithSeeds = [
  {id:"h-intention",moods:["lost","hopeful"],arabic:"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",bn:"কাজের মূল্য নিয়তের ওপর নির্ভর করে, আর প্রত্যেক ব্যক্তি তাই পাবে যা সে নিয়ত করেছে।",en:"Actions are judged by intentions, and every person will have what they intended.",source:"Sahih al-Bukhari 1",kind:"hadith"},
  {id:"h-ease",moods:["overwhelmed","anxious"],arabic:"يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا",bn:"সহজ করো, কঠিন করো না; সুসংবাদ দাও, মানুষকে দূরে সরিয়ে দিও না।",en:"Make things easy and do not make them difficult; give glad tidings and do not drive people away.",source:"Sahih al-Bukhari 69",kind:"hadith"},
  {id:"h-mercy",moods:["sad","angry","lonely"],arabic:"الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",bn:"যারা দয়া করে, পরম দয়ালু তাদের প্রতি দয়া করেন। পৃথিবীর মানুষের প্রতি দয়া করো, আকাশের অধিপতি তোমাদের প্রতি দয়া করবেন।",en:"The merciful are shown mercy by the Most Merciful. Be merciful to those on earth, and the One above the heavens will have mercy on you.",source:"Jami` at-Tirmidhi 1924",kind:"hadith"},
  {id:"h-smile",moods:["sad","lonely","hopeful"],arabic:"تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",bn:"আপনার ভাইয়ের মুখে হাসিমুখে তাকানোও আপনার জন্য সদকা।",en:"Your smile in the face of another person is charity for you.",source:"Jami` at-Tirmidhi 1956",kind:"hadith"},
  {id:"h-heart",moods:["numb","lost","hopeful"],arabic:"إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",bn:"আল্লাহ তোমাদের বাহ্যিক রূপ বা সম্পদের দিকে তাকান না; তিনি তোমাদের হৃদয় ও কাজের দিকে তাকান।",en:"Allah does not look at your appearance or wealth; He looks at your hearts and deeds.",source:"Sahih Muslim 2564",kind:"hadith"},
  {id:"h-anger",moods:["angry","overwhelmed"],arabic:"لَا تَغْضَبْ",bn:"রাগের বশবর্তী হয়ো না।",en:"Do not give in to anger.",source:"Sahih al-Bukhari 6116",kind:"hadith"},
  {id:"h-safety",moods:["angry","anxious"],arabic:"الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",bn:"প্রকৃত মুসলিম সে, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।",en:"A Muslim is one from whose tongue and hand other Muslims are safe.",source:"Sahih al-Bukhari 10",kind:"hadith"},
  {id:"h-goodword",moods:["lonely","sad","hopeful"],arabic:"الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",bn:"একটি ভালো কথাও সদকা।",en:"A kind word is charity.",source:"Sahih al-Bukhari 2989",kind:"hadith"},
  {id:"h-patience",moods:["overwhelmed","sad","anxious"],arabic:"وَمَنْ يَتَصَبَّرْ يُصَبِّرْهُ اللَّهُ وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ",bn:"যে ধৈর্য ধারণের চেষ্টা করে, আল্লাহ তাকে ধৈর্য দান করেন। ধৈর্যের চেয়ে উত্তম ও বিস্তৃত দান কাউকে দেওয়া হয়নি।",en:"Whoever strives to be patient, Allah will grant them patience. No one is given a gift better and more encompassing than patience.",source:"Sahih al-Bukhari 1469",kind:"hadith"},
  {id:"h-brother",moods:["lonely","lost"],arabic:"الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",bn:"এক মুমিন অন্য মুমিনের জন্য একটি ভবনের মতো—এক অংশ অন্য অংশকে শক্ত করে।",en:"A believer to another believer is like a building whose parts strengthen one another.",source:"Sahih al-Bukhari 481",kind:"hadith"}
].map(item=>({...item,likes:0}));

const duaSeeds = [
  {id:"d-anxiety",moods:["anxious","overwhelmed"],arabic:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",bn:"হে আল্লাহ, দুশ্চিন্তা ও দুঃখ থেকে, অক্ষমতা ও অলসতা থেকে, ভীরুতা ও কৃপণতা থেকে এবং ঋণের বোঝা ও মানুষের দমন থেকে আমি আপনার আশ্রয় চাই।",en:"O Allah, I seek refuge in You from anxiety and grief, from weakness and laziness, from cowardice and miserliness, and from the burden of debt and being overpowered by others.",source:"Sahih al-Bukhari 6369",kind:"dua"},
  {id:"d-ease",moods:["overwhelmed","lost"],arabic:"رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",bn:"হে আমার রব, আমার হৃদয় প্রশস্ত করুন, আমার কাজ সহজ করুন এবং আমার জিহ্বার জড়তা দূর করুন, যাতে তারা আমার কথা বুঝতে পারে।",en:"My Lord, expand my chest, make my task easy for me, and untie the knot from my tongue so that they may understand my speech.",source:"Qur'an 20:25–28",kind:"dua"},
  {id:"d-mercy",moods:["sad","lost","hopeful"],arabic:"رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",bn:"হে আমাদের রব, আমরা নিজেদের প্রতি অন্যায় করেছি। আপনি যদি আমাদের ক্ষমা না করেন এবং দয়া না করেন, তবে আমরা অবশ্যই ক্ষতিগ্রস্তদের অন্তর্ভুক্ত হব।",en:"Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will certainly be among the losers.",source:"Qur'an 7:23",kind:"dua"},
  {id:"d-trust",moods:["anxious","lonely"],arabic:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",bn:"আল্লাহই আমাদের জন্য যথেষ্ট; তিনিই সর্বোত্তম কর্মবিধায়ক।",en:"Allah is sufficient for us, and He is the best Disposer of affairs.",source:"Qur'an 3:173",kind:"dua"},
  {id:"d-guidance",moods:["lost","numb"],arabic:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",bn:"আমাদের সরল পথ দেখান।",en:"Guide us to the straight path.",source:"Qur'an 1:6",kind:"dua"},
  {id:"d-good",moods:["hopeful","lost"],arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",bn:"হে আমাদের রব, আমাদের দুনিয়াতে কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আগুনের শাস্তি থেকে রক্ষা করুন।",en:"Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",source:"Qur'an 2:201",kind:"dua"},
  {id:"d-heart",moods:["numb","angry","lost"],arabic:"يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",bn:"হে অন্তরসমূহের পরিবর্তনকারী, আমার হৃদয়কে আপনার দ্বীনের ওপর স্থির রাখুন।",en:"O Turner of hearts, keep my heart firm upon Your religion.",source:"Jami` at-Tirmidhi 2140",kind:"dua"},
  {id:"d-light",moods:["sad","lonely","hopeful"],arabic:"اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا",bn:"হে আল্লাহ, আমার হৃদয়ে আলো দিন, আমার দৃষ্টিতে আলো দিন এবং আমার শ্রবণে আলো দিন।",en:"O Allah, place light in my heart, light in my sight, and light in my hearing.",source:"Sahih Muslim 763",kind:"dua"},
  {id:"d-forgive",moods:["sad","lost"],arabic:"رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",bn:"হে আমার রব, ক্ষমা করুন এবং দয়া করুন; আপনিই সর্বোত্তম দয়ালু।",en:"My Lord, forgive and have mercy, for You are the best of those who show mercy.",source:"Qur'an 23:118",kind:"dua"},
  {id:"d-knowledge",moods:["hopeful","overwhelmed"],arabic:"رَبِّ زِدْنِي عِلْمًا",bn:"হে আমার রব, আমার জ্ঞান বৃদ্ধি করুন।",en:"My Lord, increase me in knowledge.",source:"Qur'an 20:114",kind:"dua"}
].map(item=>({...item,likes:0}));

function moodFirst(items,mood=""){
  if(!mood)return [...items];
  return [...items].sort((a,b)=>Number(b.moods?.includes(mood))-Number(a.moods?.includes(mood)));
}

async function fetchJsonWithTimeout(url, timeout=6000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const response=await fetch(url,{signal:controller.signal,mode:"cors",credentials:"omit"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }finally{clearTimeout(timer)}
}

function editionUrl(edition,surah,ayah){
  return `${QURAN_DATA_BASE}/${edition}/${surah}/${ayah}.min.json`;
}
function editionText(value,fallback=""){
  const text=value?.text ?? value?.verse ?? value?.translation ?? value?.data?.text ?? fallback;
  return String(text||fallback).trim();
}

export async function loadQuranItems(mood="", limit=16){
  const seeds=moodFirst(quranSeeds,mood).slice(0,limit);
  return Promise.all(seeds.map(async seed=>{
    try{
      const [ar,bn,en]=await Promise.all([
        fetchJsonWithTimeout(editionUrl("ara-quranuthmanihaf",seed.surah,seed.ayah)),
        fetchJsonWithTimeout(editionUrl("ben-muhiuddinkhan",seed.surah,seed.ayah)),
        fetchJsonWithTimeout(editionUrl("eng-sahihinternational",seed.surah,seed.ayah))
      ]);
      return {
        ...seed,
        arabic:editionText(ar,seed.arabic),
        bn:editionText(bn,seed.bn),
        en:editionText(en,seed.en),
        fullVerse:true,
        apiLoaded:true
      };
    }catch{
      return {...seed,fullVerse:true,apiLoaded:false};
    }
  }));
}

function normalizeArabic(value=""){
  return String(value).normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[إأآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\u0600-\u06FF]/g,"");
}
function flattenRemote(value){
  if(Array.isArray(value))return value;
  if(value&&typeof value==="object")return Object.values(value).flatMap(flattenRemote);
  return [];
}

export async function loadHadithItems(mood="", limit=12){
  const local=moodFirst(hadithSeeds,mood).slice(0,limit);
  try{
    const remote=flattenRemote(await fetchJsonWithTimeout(HADITH_SAMPLE_URL));
    return local.map(seed=>{
      const key=normalizeArabic(seed.arabic);
      const match=remote.find(item=>{
        const remoteArabic=normalizeArabic(item?.arabic);
        return key&&remoteArabic&&(remoteArabic.includes(key)||key.includes(remoteArabic));
      });
      return match?{...seed,arabic:match.arabic||seed.arabic,en:match.english?.text||seed.en,apiLoaded:true}:seed;
    });
  }catch{return local}
}

export async function loadDuaItems(mood="", limit=12){
  const local=moodFirst(duaSeeds,mood).slice(0,limit);
  try{
    const remote=flattenRemote(await fetchJsonWithTimeout(DUA_DATA_URL));
    return local.map(seed=>{
      const key=normalizeArabic(seed.arabic);
      const match=remote.find(item=>{
        const content=normalizeArabic(item?.content||item?.arabic);
        return key&&content&&(content.includes(key)||key.includes(content));
      });
      return match?{...seed,arabic:match.content||seed.arabic,audio:match.audio||seed.audio,remoteSource:match.source||seed.source,apiLoaded:true}:seed;
    });
  }catch{return local}
}

export const islamicSources = {
  quran: { base: QURAN_DATA_BASE, arabicEdition:"ara-quranuthmanihaf", bengaliEdition:"ben-muhiuddinkhan", englishEdition:"eng-sahihinternational", license:"Open Quran dataset" },
  hadith: { base:HADITH_DATA_BASE, source:"AhmedBaset/hadith-json v1.2.0" },
  dua: { base:DUA_DATA_URL, source:"Seen-Arabic/Morning-And-Evening-Adhkar-DB (MIT) with reviewed Bengali fallback" }
};
