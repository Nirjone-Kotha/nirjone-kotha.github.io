
import {
  moods, needMeta, topics, circles, posts as seedPosts, momentMoods, seedMoments, quotes,
  supportTemplates, sampleComments, notificationsSeed
} from "./data.js?v=6.1.0";
import { store } from "./storage.js?v=6.1.0";
import { initPlatform } from "./platform.js?v=6.1.0";
import { initPWA } from "./pwa.js?v=6.1.0";
import { containsUrgentRisk, containsPrivateInfo, containsLink, containsProhibitedSensitiveContent, validateCommunityText } from "./safety.js?v=6.1.0";
import {
  AD_PLACEMENTS, createAdSlot, isAdSlotEnabled, renderAdInto, shouldInsertInFeedAd,
  setAdSafeMode, subscribeAdSettings
} from "./ads.js?v=6.1.0";
import { loadSiteConfig, contactOptions, localizedPath, absoluteSiteUrl } from "./config.js?v=6.1.0";
import { getConsent, setConsent } from "./consent.js?v=6.1.0";
import { trackEvent, trackPage } from "./analytics.js?v=6.1.0";
import { islamicTabs, loadQuranItems, loadHadithItems, loadDuaItems, islamicSources } from "./islamic.js?v=6.1.0";
import { CORE_MOODS, VIDEO_FORMATS, generalVideoCatalog, islamicVideoCatalog } from "./video_catalog.js?v=6.1.0";
import { createYouTubeFeedController } from "./youtube_player.js?v=6.1.0";
import { initAdminRuntime, mergeManagedVideos, guardAdminAction, subscribeAdminRuntime, getAdminRuntime } from "../../admin/public/runtime-client.js?v=6.1.0";
import { initUserIdentity, getIdentityState, subscribeIdentity, signInOrCreateWithPassword, loadUserAppData, saveUserAppData, clearUserAppData, signOutUserIdentity } from "./user-identity.js?v=6.1.0";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const siteConfigPromise = loadSiteConfig();
const adminRuntimePromise = initAdminRuntime();
let lastFocusedElement = null;
let directPageReturnView = null;
const FOCUSABLE_SELECTOR = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const ICONS = {
  search:'<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path>',
  sun:'<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path>',
  home:'<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>',
  compass:'<circle cx="12" cy="12" r="9"></circle><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"></path>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4V3Z"></path>',
  sparkles:'<path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"></path><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"></path><path d="m5 14 .7 1.8 1.8.7-1.8.7L5 19l-.7-1.8-1.8-.7 1.8-.7L5 14Z"></path>',
  pen:'<path d="m12 20 9-9-4-4-9 9-1 5 5-1Z"></path><path d="m15 7 4 4"></path>',
  refresh:'<path d="M20 7h-5V2"></path><path d="M4 17h5v5"></path><path d="M5.1 9A8 8 0 0 1 18 5l2 2M18.9 15A8 8 0 0 1 6 19l-2-2"></path>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"></path>',
  plus:'<path d="M12 5v14M5 12h14"></path>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"></path><path d="M1 14h6M9 8h6M17 16h6"></path>',
  'chevron-down':'<path d="m6 9 6 6 6-6"></path>',
  'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"></path>',
  'arrow-right':'<path d="M5 12h14M13 6l6 6-6 6"></path>',
  message:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"></path>',
  share:'<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.7 6.8-4M8.6 13.3l6.8 4"></path>',
  more:'<circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>',
  user:'<path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle>',
  x:'<path d="m6 6 12 12M18 6 6 18"></path>',
  send:'<path d="m22 2-7 20-4-9-9-4 20-7Z"></path><path d="M22 2 11 13"></path>',
  flag:'<path d="M5 22V4"></path><path d="M5 4h11l-1 5 1 5H5"></path>',
  check:'<path d="m5 12 4 4L19 6"></path>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
  ear:'<path d="M6 10a6 6 0 1 1 12 0c0 5-4 5-4 9a3 3 0 0 1-6 0"></path><path d="M9 10a3 3 0 0 1 6 0c0 2-2 3-3 4"></path>',
  wind:'<path d="M3 8h10a3 3 0 1 0-3-3"></path><path d="M4 12h14a3 3 0 1 1-3 3"></path><path d="M3 16h7"></path>',
  anchor:'<circle cx="12" cy="5" r="3"></circle><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"></path>',
  spark:'<path d="m12 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"></path>',
  leaf:'<path d="M20 4c-8 0-14 4-14 10 0 4 3 6 6 6 6 0 8-8 8-16Z"></path><path d="M4 21c3-5 7-8 13-11"></path>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"></path><path d="M8 8h8"></path>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V4h8v3M3 12h18"></path>',
  circleHome:'<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path>',
  arrowleft:'<path d="m15 18-6-6 6-6"></path>',
  download:'<path d="M12 3v12M7 10l5 5 5-5"></path><path d="M5 21h14"></path>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="8.5" cy="9" r="1.5"></circle><path d="m21 15-5-5L5 20"></path>',
  link:'<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"></path>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
  volume:'<path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"></path>',
  volumeOff:'<path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="m22 9-6 6M16 9l6 6"></path>',
  expand:'<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path>',
  minimize:'<path d="M8 8H3V3M16 8h5V3M8 16H3v5M16 16h5v5"></path>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"></path>',
  timer:'<circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l3 2M9 2h6"></path>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
  play:'<path d="m8 5 11 7-11 7V5Z"></path>'
};

function icon(name, cls = "") {
  return `<svg class="icon-svg ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
}

const translations = {
  "en": {
    "needHelp": "Get help",
    "home": "Home",
    "explore": "Explore",
    "circles": "Support circles",
    "saved": "Saved",
    "calmRoom": "Calm space",
    "shareFeeling": "Write a post",
    "anonymousIdentity": "Your chosen name",
    "changeAlias": "Use a suggested name",
    "demoPrivacy": "Use a password account to restore your profile; guest activity stays only in this browser.",
    "safeSocial": "A calm social space",
    "welcomeTitle": "How are you feeling today?",
    "welcomeCopy": "Share what is on your mind, listen to others, or take a quiet moment for yourself.",
    "moodCheckin": "Choose your mood",
    "yourStory": "Write a post",
    "composerQuestion": "Say the things you have not been able to say.",
    "composerHint": "Share at your own pace—your feelings matter. Your real identity will not be shown.",
    "write": "Your message",
    "forYou": "For you",
    "latest": "Latest",
    "following": "Following",
    "filter": "Filter posts",
    "showMore": "Show more posts",
    "oneMinute": "Takes one minute",
    "todayCheckin": "Choose how you feel",
    "checkinPrompt": "Pick the feeling closest to you. Matching posts will appear first in your feed.",
    "saveFeeling": "Save mood",
    "community": "Community",
    "activeCircles": "Active support groups",
    "anotherThought": "Show another message",
    "careRules": "Keeping this space safe",
    "careRulesCopy": "Be kind. Do not share self-harm methods or ask for private contact details.",
    "readSafety": "Read safety guidance",
    "profile": "Profile",
    "searchPlaceholder": "Search posts, feelings, or topics",
    "postTitle": "Say the things you have not been able to say.",
    "moodLabel": "How are you feeling?",
    "needLabel": "What kind of support would feel helpful?",
    "topicLabel": "What is this post about?",
    "postPlaceholder": "Write in your own language. You do not need to explain everything perfectly.",
    "whisper": "Take your time. One honest sentence is enough.",
    "privacy": "Please do not include phone numbers, email addresses, home addresses, or social media accounts.",
    "postNow": "Publish post",
    "cancel": "Cancel",
    "comments": "Supportive comments",
    "writeReply": "Write a kind comment…",
    "send": "Send",
    "copy": "Copy",
    "report": "Report",
    "reportTitle": "Why are you reporting this?",
    "reportCopy": "Choose a reason. In this local version, the report stays on this device.",
    "harmful": "Contains harmful details or instructions",
    "harassment": "Contains harassment, insults, or judgement",
    "contact": "Asks for private contact details",
    "other": "Another reason",
    "submitReport": "Submit report",
    "notificationTitle": "Notifications",
    "filterTitle": "Filter your feed",
    "allMoods": "Any mood",
    "allTopics": "Any topic",
    "clearFilters": "Reset",
    "apply": "Apply filters",
    "joined": "Joined",
    "join": "Join",
    "online": "Online",
    "members": "members",
    "profileTitle": "Profile and settings",
    "profileCopy": "People see the name you choose. Your posts and comments remain stored only on this device in this test version.",
    "displayNameLabel": "Your display name",
    "displayNameHint": "Use the name or nickname you want people to see. Avoid phone numbers, contact details, or account handles.",
    "displayNamePlaceholder": "Write a name or nickname",
    "saveDisplayName": "Save name",
    "displayNameSaved": "Your display name was saved.",
    "displayNameInvalid": "Write a name between 1 and 32 characters without contact details.",
    "useSuggestedName": "Use a suggested name instead",
    "posts": "Your posts",
    "supportSent": "Support sent",
    "savedCount": "Saved posts",
    "regenerate": "Use a suggested name",
    "circlesTitle": "Support circles",
    "circlesCopy": "Join a circle where people are facing similar feelings or situations.",
    "calmTitle": "Calm space",
    "calmCopy": "Use a simple tool to feel steadier over the next few minutes.",
    "breathing": "Slow breathing",
    "breatheIn": "Breathe in",
    "hold": "Pause",
    "breatheOut": "Breathe out slowly",
    "start": "Start",
    "stop": "Stop",
    "sound": "Calming sounds",
    "rain": "Rain",
    "ocean": "Ocean",
    "tone": "Soft tone",
    "off": "Turn sound off",
    "grounding": "Notice 5–4–3–2–1",
    "next": "Next step",
    "release": "Write it down, then let it go",
    "releaseCopy": "Write the thought that feels heavy. You can then remove it from the screen.",
    "releaseButton": "Remove this thought",
    "safetyTitle": "Your safety matters more than posting.",
    "safetyCopy": "If you have already hurt yourself, may hurt yourself again, are bleeding, or took something harmful, call Bangladesh National Emergency Service 999 and ask someone nearby to stay with you.",
    "call999": "Call 999 now",
    "tellSomeone": "Tell someone near me",
    "safeWithSomeone": "I am safe with someone",
    "safetySteps": "Move away from anything that could hurt you. Unlock the door, do not stay alone, and keep any medicine or packaging for emergency staff.",
    "checkedIn": "Mood saved. Posts matching this mood will now appear first.",
    "posted": "Your post was added to the local feed.",
    "savedPost": "Post saved.",
    "unsavedPost": "Removed from saved posts.",
    "copied": "The text was copied.",
    "supportDelivered": "Your support was sent.",
    "joinedCircle": "You joined this support group.",
    "leftCircle": "You left this support group.",
    "aliasChanged": "Your temporary name was changed.",
    "replyAdded": "Your comment was added.",
    "reportSaved": "The report was saved on this device.",
    "personalInfo": "Remove personal contact details before publishing.",
    "urgentLanguage": "Your words may show immediate risk. Please use the safety help options now.",
    "noResults": "No posts match your choices",
    "noResultsCopy": "Clear the search or choose different filters.",
    "savedEmpty": "You have not saved any posts yet",
    "savedEmptyCopy": "Use the bookmark button on a post to keep it here.",
    "followingEmpty": "You are not following anyone yet",
    "followingEmptyCopy": "Follow a temporary name from the feed to see their posts here.",
    "demoOnly": "This is a test version. No real moderator or counsellor is connected yet.",
    "installApp": "Install app",
    "installed": "App installed",
    "exportData": "Download data from this device",
    "resetData": "Delete data from this device",
    "resetConfirm": "Delete all local app data? This cannot be undone.",
    "updateReady": "A new version of the app is ready.",
    "refreshNow": "Update now",
    "offline": "Offline",
    "localMode": "Saved on this device",
    "shared": "Share options opened",
    "installWhereTitle": "Where would you like to install the app?",
    "installWhereCopy": "The same app works on phones and computers. Install it from the device where you plan to use it.",
    "installPhone": "Phone or tablet",
    "installPhoneCopy": "A simple mobile layout with bottom navigation for smaller screens.",
    "installDesktop": "Laptop or desktop",
    "installDesktopCopy": "A full three-column layout designed for larger screens.",
    "recommended": "Recommended for this device",
    "currentDevice": "Current device",
    "installHere": "Install on this device",
    "useSameLink": "Open the same link on another device",
    "copyLink": "Copy website link",
    "linkCopied": "The website link was copied. Open it on the other device.",
    "phoneGuideTitle": "Install on a phone",
    "desktopGuideTitle": "Install on a computer",
    "openOnDevice": "Open this same website on the device where you want to install it.",
    "continueInstall": "Continue installation",
    "gotIt": "Got it",
    "secureInstallWarning": "HTTPS is required for full installation and offline support.",
    "installLater": "You can try again later from the Install app button.",
    "phoneLayoutReady": "The phone layout is ready.",
    "desktopLayoutReady": "The desktop layout is ready.",
    "thisPhone": "This phone",
    "thisComputer": "This computer",
    "otherDevice": "Another device",
    "copyForOtherDevice": "Copy the link for another device",
    "offlineBanner": "You are offline. Saved parts of the app are still available.",
    "tryAgain": "Try again",
    "close": "Close",
    "moodButtonHint": "See posts that match how you feel first",
    "createPost": "Create an anonymous post",
    "writePost": "Write a post",
    "shareSite": "Share Moner Kotha",
    "shareSiteCopy": "Invite someone with a clear message, a branded card, or the website link.",
    "shareTitle": "Share Moner Kotha",
    "sharePostTitle": "Share this post safely",
    "shareIntro": "Choose how you want to share. The branded image helps people understand what Moner Kotha is before they open it.",
    "nativeShare": "Share to an app",
    "shareWhatsApp": "WhatsApp",
    "shareFacebook": "Facebook",
    "shareX": "X / Twitter",
    "shareEmail": "Email",
    "copyInvite": "Copy message and link",
    "downloadShareCard": "Download share card",
    "shareCardHint": "For apps that do not show link previews, share the image card with the copied message.",
    "shareCaptionCopied": "The message and link were copied.",
    "shareCardReady": "The share image is ready.",
    "downloadStarted": "The share card download started.",
    "shareUnavailable": "Sharing is not available in this browser. The message was copied instead.",
    "moodPriority": "Your mood first",
    "profileShareHint": "Share this safe space with someone who may need it.",
    "contactUs": "Contact us",
    "contactTitle": "Contact Moner Kotha",
    "contactIntro": "Use these channels for platform support, privacy questions or technical problems. This is not an emergency hotline.",
    "comingSoon": "Coming soon",
    "moreMenu": "More",
    "aboutApp": "About the app",
    "publicPages": "Information and policies",
    "cookieSettings": "Cookie settings",
    "cookieSettingsCopy": "Essential storage stays on. Optional analytics and advertising are off by default.",
    "analyticsConsent": "Allow privacy-safe analytics",
    "adsConsent": "Allow future non-personalized ads",
    "saveChoices": "Save choices",
    "choicesSaved": "Your cookie choices were saved.",
    "quickReset": "60-second reset",
    "quickResetCopy": "Follow a quiet countdown and notice your breathing, shoulders and surroundings.",
    "startReset": "Start 60 seconds",
    "resetComplete": "The minute is complete. Notice whether anything feels even slightly different.",
    "bodyScan": "Gentle body check",
    "bodyScanCopy": "Move attention slowly without trying to force any feeling to change.",
    "nextBodyStep": "Next body area",
    "kindnessPrompt": "A kinder sentence",
    "kindnessPromptCopy": "Choose one sentence you would say to a friend in the same moment.",
    "anotherPrompt": "Show another sentence",
    "sensoryRefresh": "Refresh your senses",
    "sensoryRefreshCopy": "Look away from the screen, relax your jaw and notice one colour, one sound and one steady surface.",
    "openCalmFeature": "Open calming tools",
    "appMenuTitle": "Menu and information",
    "openPublicPage": "Open page",
    "ranking": "Top ranked",
    "islamic": "Islamic",
    "video": "Video",
    "quran": "Qur’an",
    "hadith": "Hadith",
    "dua": "Dua",
    "islamicVideo": "Islamic video",
    "love": "Love",
    "listen": "Listen",
    "playVideo": "Play video",
    "largeView": "Large view",
    "exitLargeView": "Exit large view",
    "soundOn": "Sound on",
    "soundOff": "Sound off",
    "videoNoticeShort": "Played directly from YouTube. Moner Kotha does not host or own this video.",
    "videoOwnershipNotice": "YouTube videos play through the official embedded player and belong to their creators and rights holders.",
    "islamicFeedIntro": "Qur’an, hadith, dua and Islamic videos selected to match your current mood.",
    "videoFeedIntro": "Short and regular YouTube videos selected around your mood.",
    "sourceUnavailable": "The live source is unavailable, so a saved reviewed item is shown.",
    "rankingCopy": "Posts with more ‘I hear you’ responses and helpful comments appear first.",
    "skip": "Skip",
    "otherMood": "Another feeling",
    "otherSupport": "Another kind of support",
    "writeYourOwn": "Write your own",
    "customMoodPlaceholder": "Describe your feeling in a few words",
    "customSupportPlaceholder": "What kind of support would help?",
    "customTopicPlaceholder": "Write the subject of this post",
    "linkBlocked": "Links are not allowed in posts, comments, stories, or profile names.",
    "restrictedSensitive": "This community does not accept explicit sexual or addiction/substance content.",
    "editProfile": "Edit profile",
    "yourPostsTitle": "Posts you created",
    "editPost": "Edit post",
    "deletePost": "Delete post",
    "deletePostConfirm": "Delete this post permanently from this device?",
    "postUpdated": "Your post was updated.",
    "postDeleted": "Your post was deleted.",
    "expiresIn": "Automatically deletes in",
    "sixMonths": "6 months",
    "moments": "Stories",
    "addMoment": "Add story",
    "momentTitle": "Create a story",
    "momentCopy": "Share a short line or one mood emoji. It disappears automatically after 48 hours.",
    "momentText": "Short text",
    "momentMood": "Mood emoji",
    "momentPlaceholder": "Write a short story…",
    "findMood": "Search 200 mood expressions",
    "publishMoment": "Post story",
    "momentAdded": "Story published. It will disappear automatically after 48 hours.",
    "momentDeleted": "The expired story was removed.",
    "empathy": "Care",
    "empathySent": "Your empathy was sent.",
    "storyRank": "Popular stories appear first",
    "enableNotifications": "Enable notifications",
    "notificationPermissionCopy": "Allow this installed app to show notifications. Real incoming notifications will work after the final backend and push service are connected.",
    "testNotification": "Send a test notification",
    "notificationEnabled": "Notifications are enabled on this device.",
    "notificationDenied": "Notification permission was not granted.",
    "notificationTestBody": "Moner Kotha can notify you when the final live notification service is connected.",
    "desktopApp": "Desktop app",
    "mobileApp": "Mobile app"
  },
  "bn": {
    "needHelp": "জরুরি সহায়তা",
    "home": "হোম",
    "explore": "পোস্ট খুঁজুন",
    "circles": "গ্রুপ",
    "saved": "সংরক্ষিত পোস্ট",
    "calmRoom": "মন শান্ত করুন",
    "shareFeeling": "পোস্ট লিখুন",
    "anonymousIdentity": "আপনার পছন্দের নাম",
    "changeAlias": "প্রস্তাবিত নাম ব্যবহার করুন",
    "demoPrivacy": "Password account নিলে profile ফিরিয়ে আনা যাবে; Guest data শুধু এই browser-এ থাকবে।",
    "safeSocial": "স্বস্তিকর সামাজিক মাধ্যম",
    "welcomeTitle": "আজ আপনার কেমন লাগছে?",
    "welcomeCopy": "মনের কথা বলুন, অন্যের কথা শুনুন, অথবা কিছুক্ষণ নিজের মতো থাকুন।",
    "moodCheckin": "মুড বেছে নিন",
    "yourStory": "পোস্ট লিখুন",
    "composerQuestion": "না বলতে পারা কথাগুলো প্রাণ খুলে বলুন",
    "composerHint": "নির্ভয়ে লিখুন—আপনার অনুভূতি গুরুত্বপূর্ণ। আপনার আসল পরিচয় দেখানো হবে না।",
    "write": "আপনার লেখা",
    "forYou": "আপনার জন্য",
    "latest": "সর্বশেষ",
    "following": "অনুসরণ করা মানুষ",
    "filter": "পোস্ট বাছাই করুন",
    "showMore": "আরও পোস্ট দেখুন",
    "oneMinute": "এক মিনিটেই হবে",
    "todayCheckin": "আপনার মুড বেছে নিন",
    "checkinPrompt": "এখন যে অনুভূতিটি সবচেয়ে কাছাকাছি, সেটি বেছে নিন। সেই মুডের পোস্ট আগে দেখানো হবে।",
    "saveFeeling": "মুড সংরক্ষণ করুন",
    "community": "কমিউনিটি",
    "activeCircles": "সক্রিয় গ্রুপ",
    "anotherThought": "আরেকটি বার্তা দেখুন",
    "careRules": "জায়গাটি নিরাপদ রাখুন",
    "careRulesCopy": "সহমর্মী হয়ে কথা বলুন। নিজের ক্ষতির পদ্ধতি বা ব্যক্তিগত যোগাযোগের তথ্য শেয়ার করবেন না।",
    "readSafety": "নিরাপত্তার নির্দেশনা দেখুন",
    "profile": "প্রোফাইল",
    "searchPlaceholder": "পোস্ট, অনুভূতি বা বিষয় খুঁজুন",
    "postTitle": "না বলতে পারা কথাগুলো প্রাণ খুলে বলুন",
    "moodLabel": "এখন আপনার কেমন লাগছে?",
    "needLabel": "কী ধরনের সাড়া পেলে ভালো লাগবে?",
    "topicLabel": "পোস্টটি কোন বিষয়ে?",
    "postPlaceholder": "নিজের ভাষায় লিখুন। সবকিছু নিখুঁতভাবে বোঝাতে হবে না।",
    "whisper": "সময় নিন। একটি সত্য বাক্যই যথেষ্ট।",
    "privacy": "ফোন নম্বর, ইমেইল, বাসার ঠিকানা বা সামাজিক যোগাযোগমাধ্যমের আইডি লিখবেন না।",
    "postNow": "পোস্ট প্রকাশ করুন",
    "cancel": "এখন নয়",
    "comments": "সহমর্মী মন্তব্য",
    "writeReply": "সহমর্মী একটি মন্তব্য লিখুন…",
    "send": "পাঠান",
    "copy": "কপি করুন",
    "report": "রিপোর্ট করুন",
    "reportTitle": "কেন রিপোর্ট করছেন?",
    "reportCopy": "একটি কারণ বেছে নিন। এই স্থানীয় সংস্করণে রিপোর্টটি শুধু আপনার ডিভাইসে থাকবে।",
    "harmful": "ক্ষতিকর তথ্য বা পদ্ধতির বর্ণনা আছে",
    "harassment": "অপমান, হয়রানি বা বিচার করা হয়েছে",
    "contact": "ব্যক্তিগত যোগাযোগের তথ্য চাওয়া হয়েছে",
    "other": "অন্য কারণ",
    "submitReport": "রিপোর্ট জমা দিন",
    "notificationTitle": "নোটিফিকেশন",
    "filterTitle": "কোন পোস্ট দেখতে চান?",
    "allMoods": "সব মুড",
    "allTopics": "সব বিষয়",
    "clearFilters": "সব বাছাই মুছুন",
    "apply": "পোস্ট দেখুন",
    "joined": "যোগ দিয়েছেন",
    "join": "যোগ দিন",
    "online": "অনলাইনে",
    "members": "সদস্য",
    "profileTitle": "প্রোফাইল ও সেটিংস",
    "profileCopy": "অন্যরা আপনার পছন্দের নামটি দেখবে। এই পরীক্ষামূলক সংস্করণে পোস্ট ও মন্তব্য শুধু এই ডিভাইসেই থাকবে।",
    "displayNameLabel": "আপনার দেখানো নাম",
    "displayNameHint": "অন্যরা যে নাম বা ডাকনাম দেখবে সেটি লিখুন। ফোন নম্বর, যোগাযোগের তথ্য বা সামাজিক মাধ্যমের আইডি লিখবেন না।",
    "displayNamePlaceholder": "নাম বা ডাকনাম লিখুন",
    "saveDisplayName": "নাম সংরক্ষণ করুন",
    "displayNameSaved": "আপনার নাম সংরক্ষণ করা হয়েছে।",
    "displayNameInvalid": "যোগাযোগের তথ্য ছাড়া ১ থেকে ৩২ অক্ষরের একটি নাম লিখুন।",
    "useSuggestedName": "প্রস্তাবিত একটি নাম ব্যবহার করুন",
    "posts": "আপনার পোস্ট",
    "supportSent": "পাঠানো সহমর্মিতা",
    "savedCount": "সংরক্ষিত পোস্ট",
    "regenerate": "প্রস্তাবিত নাম ব্যবহার করুন",
    "circlesTitle": "গ্রুপ",
    "circlesCopy": "একই ধরনের অনুভূতি বা পরিস্থিতির মানুষদের একটি গ্রুপে যোগ দিন।",
    "calmTitle": "মন শান্ত করুন",
    "calmCopy": "আগামী কয়েক মিনিট একটু স্থির হতে সহজ একটি অনুশীলন বেছে নিন।",
    "breathing": "ধীরে শ্বাস নিন",
    "breatheIn": "শ্বাস নিন",
    "hold": "একটু থামুন",
    "breatheOut": "ধীরে শ্বাস ছাড়ুন",
    "start": "শুরু করুন",
    "stop": "বন্ধ করুন",
    "sound": "শান্ত শব্দ",
    "rain": "বৃষ্টির শব্দ",
    "ocean": "সমুদ্রের শব্দ",
    "tone": "মৃদু সুর",
    "off": "শব্দ বন্ধ করুন",
    "grounding": "৫–৪–৩–২–১ অনুশীলন",
    "next": "পরের ধাপ",
    "release": "লিখে মন হালকা করুন",
    "releaseCopy": "যে ভাবনাটি ভারী লাগছে তা লিখুন। এরপর চাইলে পর্দা থেকে সরিয়ে দিন।",
    "releaseButton": "লেখাটি সরিয়ে দিন",
    "safetyTitle": "পোস্ট করার চেয়ে আপনার নিরাপত্তা বেশি গুরুত্বপূর্ণ।",
    "safetyCopy": "আপনি নিজেকে আঘাত করে থাকলে, আবার আঘাত করার আশঙ্কা থাকলে, রক্তপাত হলে বা ক্ষতিকর কিছু খেয়ে থাকলে বাংলাদেশ জাতীয় জরুরি সেবা ৯৯৯-এ কল করুন এবং কাছের কাউকে পাশে থাকতে বলুন।",
    "call999": "এখনই ৯৯৯-এ কল করুন",
    "tellSomeone": "কাছের কাউকে জানাই",
    "safeWithSomeone": "আমি কারও সঙ্গে নিরাপদে আছি",
    "safetySteps": "ক্ষতি করতে পারে এমন জিনিস থেকে দূরে যান। দরজা খুলে রাখুন, একা থাকবেন না এবং ওষুধ বা প্যাকেট জরুরি কর্মীদের জন্য রেখে দিন।",
    "checkedIn": "মুড সংরক্ষণ হয়েছে। এখন এই মুডের পোস্টগুলো আগে দেখানো হবে।",
    "posted": "আপনার পোস্ট স্থানীয় ফিডে যোগ হয়েছে।",
    "savedPost": "পোস্টটি সংরক্ষণ করা হয়েছে।",
    "unsavedPost": "সংরক্ষিত তালিকা থেকে সরানো হয়েছে।",
    "copied": "লেখাটি কপি হয়েছে।",
    "supportDelivered": "আপনার সহমর্মিতা পাঠানো হয়েছে।",
    "joinedCircle": "আপনি গ্রুপে যোগ দিয়েছেন।",
    "leftCircle": "আপনি গ্রুপ থেকে বের হয়েছেন।",
    "aliasChanged": "আপনার গোপন নাম বদলানো হয়েছে।",
    "replyAdded": "আপনার মন্তব্য যোগ হয়েছে।",
    "reportSaved": "রিপোর্টটি এই ডিভাইসে রাখা হয়েছে।",
    "personalInfo": "প্রকাশ করার আগে ব্যক্তিগত যোগাযোগের তথ্য সরিয়ে দিন।",
    "urgentLanguage": "আপনার লেখায় তাৎক্ষণিক ঝুঁকির ইঙ্গিত আছে। এখন নিরাপত্তা সহায়তার অপশন ব্যবহার করুন।",
    "noResults": "আপনার বাছাই অনুযায়ী কোনো পোস্ট পাওয়া যায়নি",
    "noResultsCopy": "খোঁজ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।",
    "savedEmpty": "এখনো কোনো পোস্ট সংরক্ষণ করেননি",
    "savedEmptyCopy": "যে পোস্টটি রাখতে চান, তার বুকমার্ক চিহ্নে চাপ দিন।",
    "followingEmpty": "এখনো কাউকে অনুসরণ করছেন না",
    "followingEmptyCopy": "ফিড থেকে একটি গোপন নাম অনুসরণ করলে তার পোস্ট এখানে পাবেন।",
    "demoOnly": "এটি পরীক্ষামূলক সংস্করণ। এখনো কোনো বাস্তব মডারেটর বা কাউন্সেলর যুক্ত নেই।",
    "installApp": "অ্যাপ ইনস্টল করুন",
    "installed": "অ্যাপ ইনস্টল হয়েছে",
    "exportData": "এই ডিভাইসের তথ্য ডাউনলোড করুন",
    "resetData": "এই ডিভাইসের তথ্য মুছুন",
    "resetConfirm": "এই অ্যাপের সব স্থানীয় তথ্য মুছে ফেলবেন? পরে ফিরিয়ে আনা যাবে না।",
    "updateReady": "অ্যাপের নতুন সংস্করণ প্রস্তুত।",
    "refreshNow": "এখন আপডেট করুন",
    "offline": "ইন্টারনেট নেই",
    "localMode": "এই ডিভাইসে সংরক্ষিত",
    "shared": "শেয়ার করার অপশন খোলা হয়েছে",
    "installWhereTitle": "কোথায় অ্যাপটি ইনস্টল করবেন?",
    "installWhereCopy": "ফোন ও কম্পিউটারে একই অ্যাপ ব্যবহার হবে। যে ডিভাইসে ব্যবহার করবেন, সেই ডিভাইস থেকেই ইনস্টল করুন।",
    "installPhone": "ফোন বা ট্যাবলেটে",
    "installPhoneCopy": "ছোট পর্দার জন্য সহজ নেভিগেশন ও মোবাইল লেআউট।",
    "installDesktop": "ল্যাপটপ বা ডেস্কটপে",
    "installDesktopCopy": "বড় পর্দার জন্য পূর্ণ তিন-কলামের লেআউট।",
    "recommended": "এই ডিভাইসের জন্য উপযুক্ত",
    "currentDevice": "বর্তমান ডিভাইস",
    "installHere": "এই ডিভাইসে ইনস্টল করুন",
    "useSameLink": "অন্য ডিভাইসে একই লিংক খুলুন",
    "copyLink": "ওয়েবসাইটের লিংক কপি করুন",
    "linkCopied": "ওয়েবসাইটের লিংক কপি হয়েছে। অন্য ডিভাইসে খুলুন।",
    "phoneGuideTitle": "ফোনে ইনস্টল করার নিয়ম",
    "desktopGuideTitle": "কম্পিউটারে ইনস্টল করার নিয়ম",
    "openOnDevice": "যে ডিভাইসে ইনস্টল করবেন, সেখানে এই একই ওয়েবসাইট খুলুন।",
    "continueInstall": "ইনস্টল চালিয়ে যান",
    "gotIt": "ঠিক আছে",
    "secureInstallWarning": "পূর্ণ অ্যাপ ইনস্টল ও অফলাইন সুবিধার জন্য HTTPS দরকার।",
    "installLater": "আপনি পরে আবার “অ্যাপ ইনস্টল করুন” বাটন থেকে চেষ্টা করতে পারবেন।",
    "phoneLayoutReady": "ফোনের জন্য মোবাইল লেআউট প্রস্তুত।",
    "desktopLayoutReady": "কম্পিউটারের জন্য ডেস্কটপ লেআউট প্রস্তুত।",
    "thisPhone": "এই ফোন",
    "thisComputer": "এই কম্পিউটার",
    "otherDevice": "অন্য ডিভাইস",
    "copyForOtherDevice": "অন্য ডিভাইসের জন্য লিংক কপি করুন",
    "offlineBanner": "ইন্টারনেট নেই। আগে খোলা ও সংরক্ষিত অংশগুলো ব্যবহার করতে পারবেন।",
    "tryAgain": "আবার চেষ্টা করুন",
    "close": "বন্ধ করুন",
    "moodButtonHint": "আপনার অনুভূতির পোস্ট আগে দেখুন",
    "createPost": "পরিচয় গোপন রেখে পোস্ট লিখুন",
    "writePost": "পোস্ট লিখুন",
    "shareSite": "মনের কথা শেয়ার করুন",
    "shareSiteCopy": "পরিষ্কার একটি বার্তা, ছবি বা ওয়েবসাইট লিংক দিয়ে অন্য কাউকে আমন্ত্রণ জানান।",
    "shareTitle": "মনের কথা শেয়ার করুন",
    "sharePostTitle": "পোস্টটি নিরাপদভাবে শেয়ার করুন",
    "shareIntro": "কীভাবে শেয়ার করবেন তা বেছে নিন। ছবির কার্ডটি দেখলে লিংক খোলার আগেই মানুষ বুঝতে পারবে মনের কথা কী।",
    "nativeShare": "অন্য অ্যাপে শেয়ার করুন",
    "shareWhatsApp": "হোয়াটসঅ্যাপ",
    "shareFacebook": "ফেসবুক",
    "shareX": "এক্স / টুইটার",
    "shareEmail": "ইমেইল",
    "copyInvite": "বার্তা ও লিংক কপি করুন",
    "downloadShareCard": "শেয়ার করার ছবি ডাউনলোড করুন",
    "shareCardHint": "যে অ্যাপে লিংকের সুন্দর প্রিভিউ আসে না, সেখানে ছবির কার্ডের সঙ্গে কপি করা বার্তাটি পাঠান।",
    "shareCaptionCopied": "বার্তা ও লিংক কপি হয়েছে।",
    "shareCardReady": "শেয়ার করার ছবি প্রস্তুত।",
    "downloadStarted": "শেয়ার কার্ড ডাউনলোড শুরু হয়েছে।",
    "shareUnavailable": "এই ব্রাউজারে সরাসরি শেয়ার করা যাচ্ছে না। বার্তা ও লিংক কপি করা হয়েছে।",
    "moodPriority": "আপনার মুডের পোস্ট আগে",
    "profileShareHint": "যার এই নিরাপদ জায়গাটি প্রয়োজন হতে পারে, তার সঙ্গে শেয়ার করুন।",
    "contactUs": "যোগাযোগ",
    "contactTitle": "মনের কথার সঙ্গে যোগাযোগ",
    "contactIntro": "প্ল্যাটফর্ম সহায়তা, গোপনীয়তা প্রশ্ন বা প্রযুক্তিগত সমস্যায় এই মাধ্যমগুলো ব্যবহার করুন। এটি জরুরি হটলাইন নয়।",
    "comingSoon": "শিগগির যোগ হবে",
    "moreMenu": "আরও",
    "aboutApp": "অ্যাপ সম্পর্কে",
    "publicPages": "তথ্য ও নীতিমালা",
    "cookieSettings": "কুকি সেটিংস",
    "cookieSettingsCopy": "প্রয়োজনীয় স্টোরেজ চালু থাকে। ঐচ্ছিক analytics ও বিজ্ঞাপন defaultভাবে বন্ধ।",
    "analyticsConsent": "গোপনীয়তা-সুরক্ষিত analytics অনুমতি দিন",
    "adsConsent": "ভবিষ্যতের non-personalized বিজ্ঞাপন অনুমতি দিন",
    "saveChoices": "পছন্দ সংরক্ষণ করুন",
    "choicesSaved": "আপনার কুকি পছন্দ সংরক্ষণ হয়েছে।",
    "quickReset": "৬০ সেকেন্ডের রিসেট",
    "quickResetCopy": "শান্ত countdown অনুসরণ করে শ্বাস, কাঁধ ও চারপাশ খেয়াল করুন।",
    "startReset": "৬০ সেকেন্ড শুরু করুন",
    "resetComplete": "এক মিনিট শেষ। খুব সামান্য হলেও কিছু বদলেছে কি না খেয়াল করুন।",
    "bodyScan": "শরীরকে কোমলভাবে খেয়াল করুন",
    "bodyScanCopy": "কিছু বদলাতে জোর না করে ধীরে ধীরে শরীরের বিভিন্ন অংশে মন দিন।",
    "nextBodyStep": "পরের অংশ খেয়াল করুন",
    "kindnessPrompt": "নিজেকে কোমল একটি কথা",
    "kindnessPromptCopy": "একই মুহূর্তে বন্ধুকে যে কথাটি বলতেন, নিজের জন্য একটি বেছে নিন।",
    "anotherPrompt": "আরেকটি কথা দেখুন",
    "sensoryRefresh": "ইন্দ্রিয়কে একটু refresh করুন",
    "sensoryRefreshCopy": "স্ক্রিন থেকে চোখ সরান, চোয়াল ঢিলা করুন এবং একটি রং, একটি শব্দ ও একটি স্থির পৃষ্ঠ খেয়াল করুন।",
    "openCalmFeature": "মন শান্ত করার টুল খুলুন",
    "appMenuTitle": "মেনু ও তথ্য",
    "openPublicPage": "পেজ খুলুন",
    "ranking": "র‍্যাংকিং পোস্ট",
    "islamic": "ইসলামিক",
    "video": "ভিডিও",
    "quran": "কুরআন",
    "hadith": "হাদিস",
    "dua": "দোয়া",
    "islamicVideo": "ইসলামিক ভিডিও",
    "love": "ভালোবাসা",
    "listen": "শুনুন",
    "playVideo": "ভিডিও চালান",
    "largeView": "বড় ভিউ",
    "exitLargeView": "বড় ভিউ বন্ধ করুন",
    "soundOn": "সাউন্ড চালু",
    "soundOff": "সাউন্ড বন্ধ",
    "videoNoticeShort": "ভিডিওটি সরাসরি YouTube থেকে চলছে। এটি Moner Kotha-এর নিজস্ব বা আমাদের সার্ভারে রাখা ভিডিও নয়।",
    "videoOwnershipNotice": "YouTube ভিডিওগুলো official embedded player দিয়ে চলে এবং সংশ্লিষ্ট creator ও rights holder-এর মালিকানাধীন।",
    "islamicFeedIntro": "আপনার বর্তমান মুডের সঙ্গে মিলিয়ে কুরআন, হাদিস, দোয়া ও ইসলামিক ভিডিও দেখুন।",
    "videoFeedIntro": "আপনার মুডের সঙ্গে মিলিয়ে বাছাই করা YouTube Shorts ও সাধারণ ভিডিও দেখুন।",
    "sourceUnavailable": "লাইভ উৎস পাওয়া যায়নি, তাই সংরক্ষিত পর্যালোচিত লেখা দেখানো হচ্ছে।",
    "rankingCopy": "যে পোস্টে বেশি ‘আমি শুনছি’ ও সহমর্মী মন্তব্য আছে, সেগুলো আগে দেখাবে।",
    "skip": "বাদ দিন",
    "otherMood": "অন্য অনুভূতি",
    "otherSupport": "অন্য ধরনের সহায়তা",
    "writeYourOwn": "নিজে লিখুন",
    "customMoodPlaceholder": "কয়েকটি কথায় আপনার অনুভূতি লিখুন",
    "customSupportPlaceholder": "কী ধরনের সহায়তা ভালো লাগবে লিখুন",
    "customTopicPlaceholder": "পোস্টটির বিষয় লিখুন",
    "linkBlocked": "পোস্ট, মন্তব্য, স্টোরি বা প্রোফাইল নামে কোনো লিংক দেওয়া যাবে না।",
    "restrictedSensitive": "এই কমিউনিটিতে স্পষ্ট যৌন বা মাদক/আসক্তি বিষয়ক লেখা গ্রহণ করা হয় না।",
    "editProfile": "প্রোফাইল সম্পাদনা করুন",
    "yourPostsTitle": "আপনার করা পোস্ট",
    "editPost": "পোস্ট সম্পাদনা করুন",
    "deletePost": "পোস্ট মুছুন",
    "deletePostConfirm": "এই ডিভাইস থেকে পোস্টটি স্থায়ীভাবে মুছে ফেলবেন?",
    "postUpdated": "পোস্টটি আপডেট হয়েছে।",
    "postDeleted": "পোস্টটি মুছে দেওয়া হয়েছে।",
    "expiresIn": "স্বয়ংক্রিয়ভাবে মুছবে",
    "sixMonths": "৬ মাসে",
    "moments": "স্টোরি",
    "addMoment": "স্টোরি দিন",
    "momentTitle": "স্টোরি তৈরি করুন",
    "momentCopy": "ছোট লেখা বা একটি মুড ইমোজি দিন। ৪৮ ঘণ্টা পর এটি নিজে থেকেই মুছে যাবে।",
    "momentText": "ছোট লেখা",
    "momentMood": "মুড ইমোজি",
    "momentPlaceholder": "ছোট একটি স্টোরি লিখুন…",
    "findMood": "২০০টি মুডের মধ্যে খুঁজুন",
    "publishMoment": "স্টোরি প্রকাশ করুন",
    "momentAdded": "স্টোরি প্রকাশিত হয়েছে। ৪৮ ঘণ্টা পর এটি স্বয়ংক্রিয়ভাবে সরে যাবে।",
    "momentDeleted": "মেয়াদ শেষ হওয়া স্টোরি সরানো হয়েছে।",
    "empathy": "যত্ন",
    "empathySent": "আপনার সহমর্মিতা পাঠানো হয়েছে।",
    "storyRank": "জনপ্রিয় স্টোরি আগে দেখাবে",
    "enableNotifications": "নোটিফিকেশন চালু করুন",
    "notificationPermissionCopy": "ইনস্টল করা অ্যাপকে নোটিফিকেশন দেখানোর অনুমতি দিন। Final backend ও push service যুক্ত হলে বাস্তব incoming notification কাজ করবে।",
    "testNotification": "টেস্ট নোটিফিকেশন পাঠান",
    "notificationEnabled": "এই ডিভাইসে নোটিফিকেশন চালু হয়েছে।",
    "notificationDenied": "নোটিফিকেশনের অনুমতি দেওয়া হয়নি।",
    "notificationTestBody": "Final live notification service যুক্ত হলে মনের কথা আপনাকে নতুন সাড়া সম্পর্কে জানাতে পারবে।",
    "desktopApp": "ডেস্কটপ অ্যাপ",
    "mobileApp": "মোবাইল অ্যাপ"
  }
};

const moodColors = {
  lonely:["#5f82d7","#eaf0ff"], sad:["#5d91c7","#e9f4ff"], anxious:["#b47a35","#fff2dc"],
  overwhelmed:["#397ea0","#e6f6fb"], angry:["#cc5967","#ffedf0"], numb:["#768097","#eff1f5"],
  lost:["#7b68bd","#f0ecff"], hopeful:["#2f9b76","#e7f8f1"], other:["#5f8f86","#e8f5f2"]
};

const aliasPairs = [
  ["নীরব নদী","Silent River"],["মেঘলা জানালা","Clouded Window"],["অচেনা বন্ধু","Unknown Friend"],
  ["নীল সন্ধ্যা","Blue Evening"],["শান্ত পাখি","Quiet Bird"],["ভোরের আলো","Morning Light"],
  ["লুকানো চিঠি","Hidden Letter"],["নরম বৃষ্টি","Soft Rain"],["দূরের তারা","Distant Star"],
  ["একটু আকাশ","Little Sky"],["চুপচাপ পথিক","Quiet Wanderer"],["কাগজের নৌকা","Paper Boat"]
];

const platform = initPlatform();
const configuredPublicUrl = document.querySelector('meta[name="app-public-url"]')?.content?.trim() || "";
function publicSiteUrl(){
  return configuredPublicUrl
    ? configuredPublicUrl.replace(/\/$/, "")
    : location.origin.replace(/\/$/, "");
}
const BRAND_LOGO_URL = new URL("./assets/brand/logo-mark.png", document.baseURI).href;
const savedTheme = store.has("theme") ? store.getText("theme", "light") : platform.preferredTheme;
const lowPerformance = Boolean(
  matchMedia("(prefers-reduced-motion: reduce)").matches ||
  navigator.connection?.saveData ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
);
document.body.classList.toggle("low-performance", lowPerformance);

const initialLanguage = new URLSearchParams(location.search).get("lang");
const state = {
  lang: ["bn","en"].includes(initialLanguage) ? initialLanguage : store.getText("lang", "en"),
  theme: savedTheme,
  motion: store.getText("motion", lowPerformance ? "off" : "on") !== "off",
  view: "home",
  feedMode: "for-you",
  islamicTab: store.getText("islamic-tab", "quran"),
  islamicLikes: store.get("islamic-likes", {}),
  islamicTranslations: store.get("islamic-translations", {}),
  islamicMoodFilter: store.getText("islamic-mood-filter", "preferred"),
  videoLikes: store.get("video-likes", {}),
  videoFormat: store.get("video-format", {general:"video",islamic:"video"}),
  unavailableVideoIds: new Set(store.get("unavailable-video-ids", [])),
  islamicCache: {},
  islamicItemIndex: new Map(),
  activeVideoId: null,
  videoController: null,
  videoLargeView: false,
  videoLargeScrollTop: 0,
  query: "",
  moodFilter: "all",
  topicFilter: "all",
  shown: 10,
  aliasIndex: store.getNumber("alias-index", 0) % aliasPairs.length,
  displayName: store.getText("display-name", "").trim().slice(0, 32),
  selectedCheckin: store.getText("preferred-mood", "") || null,
  preferredMood: store.getText("preferred-mood", ""),
  quoteIndex: store.getNumber("quote", 0) % quotes.length,
  saved: new Set(store.get("saved", [])),
  following: new Set(store.get("following", [])),
  joined: new Set(store.get("joined", [])),
  reactions: store.get("reactions", {}),
  commentReactions: store.get("comment-reactions", {}),
  userPosts: store.get("user-posts", []),
  userComments: store.get("comments", {}),
  moments: store.get("story-moments", []),
  momentReactions: store.get("story-reactions", {}),
  momentComments: store.get("story-comments", {}),
  checkins: store.get("checkins", []),
  notifications: store.get("notifications", notificationsSeed),
  activePost: null,
  activeCommentKind: "post",
  customSharePayload: null,
  draftMood: "",
  draftNeed: "",
  draftTopic: "life",
  customMood: "",
  customNeed: "",
  customTopic: "",
  editingPostId: null,
  momentMode: "text",
  momentMoodId: "",
  momentSearch: "",
  soundNodes: [],
  audioCtx: null,
  breathing: false,
  breathTimer: null,
  groundingStep: 0,
  bodyScanStep: 0,
  kindnessIndex: 0,
  resetSeconds: 60,
  resetTimer: null,
  draftText: store.getText("draft-text", ""),
  installAvailable: false,
  pwaInstalled: store.get("pwa-installed", false),
  installTarget: store.getText("install-target", platform.isPhone || platform.isTablet ? "phone" : "desktop"),
  updateAction: null
};

const IDENTITY_LOCAL_KEYS=["alias-index","display-name","preferred-mood","saved","following","joined","reactions","comment-reactions","user-posts","comments","story-moments","story-reactions","story-comments","islamic-likes","islamic-translations","islamic-mood-filter","video-likes","video-format","unavailable-video-ids","islamic-tab","checkins","notifications"];
let identitySnapshot=getIdentityState();
let identityHydrating=false;
let identityCanSync=false;
let identitySyncTimer=0;

function identityPayload(){return {
  aliasIndex:state.aliasIndex,displayName:state.displayName,preferredMood:state.preferredMood,
  saved:[...state.saved],following:[...state.following],joined:[...state.joined],reactions:state.reactions,commentReactions:state.commentReactions,
  userPosts:state.userPosts,userComments:state.userComments,moments:state.moments,momentReactions:state.momentReactions,momentComments:state.momentComments,
  islamicLikes:state.islamicLikes,islamicTranslations:state.islamicTranslations,islamicMoodFilter:state.islamicMoodFilter,
  videoLikes:state.videoLikes,videoFormat:state.videoFormat,unavailableVideoIds:[...state.unavailableVideoIds],islamicTab:state.islamicTab,
  checkins:state.checkins,notifications:state.notifications
}}
function scheduleIdentitySync(){if(identityHydrating||!identityCanSync||identitySnapshot.status!=="authenticated")return;clearTimeout(identitySyncTimer);identitySyncTimer=setTimeout(()=>saveUserAppData(identityPayload()).catch(error=>console.warn("Profile sync failed",error)),500)}
function applyIdentityPayload(data){if(!data||typeof data!=="object")return;identityHydrating=true;
  state.aliasIndex=Math.abs(Number(data.aliasIndex)||0)%aliasPairs.length;state.displayName=String(data.displayName||"").trim().slice(0,32);
  state.preferredMood=String(data.preferredMood||"");state.selectedCheckin=state.preferredMood||null;
  state.saved=new Set(Array.isArray(data.saved)?data.saved:[]);state.following=new Set(Array.isArray(data.following)?data.following:[]);state.joined=new Set(Array.isArray(data.joined)?data.joined:[]);
  state.reactions=data.reactions&&typeof data.reactions==="object"?data.reactions:{};state.commentReactions=data.commentReactions&&typeof data.commentReactions==="object"?data.commentReactions:{};
  state.userPosts=Array.isArray(data.userPosts)?data.userPosts:[];state.userComments=data.userComments&&typeof data.userComments==="object"?data.userComments:{};
  state.moments=Array.isArray(data.moments)?data.moments:[];state.momentReactions=data.momentReactions&&typeof data.momentReactions==="object"?data.momentReactions:{};state.momentComments=data.momentComments&&typeof data.momentComments==="object"?data.momentComments:{};
  state.islamicLikes=data.islamicLikes&&typeof data.islamicLikes==="object"?data.islamicLikes:{};state.islamicTranslations=data.islamicTranslations&&typeof data.islamicTranslations==="object"?data.islamicTranslations:{};state.islamicMoodFilter=String(data.islamicMoodFilter||"preferred");
  state.videoLikes=data.videoLikes&&typeof data.videoLikes==="object"?data.videoLikes:{};state.videoFormat=data.videoFormat&&typeof data.videoFormat==="object"?data.videoFormat:{general:"video",islamic:"video"};state.unavailableVideoIds=new Set(Array.isArray(data.unavailableVideoIds)?data.unavailableVideoIds:[]);state.islamicTab=String(data.islamicTab||"quran");
  state.checkins=Array.isArray(data.checkins)?data.checkins:[];state.notifications=Array.isArray(data.notifications)?data.notifications:notificationsSeed;
  store.batch({"alias-index":state.aliasIndex,"display-name":state.displayName,"preferred-mood":state.preferredMood,saved:[...state.saved],following:[...state.following],joined:[...state.joined],reactions:state.reactions,"comment-reactions":state.commentReactions,"user-posts":state.userPosts,comments:state.userComments,"story-moments":state.moments,"story-reactions":state.momentReactions,"story-comments":state.momentComments,"islamic-likes":state.islamicLikes,"islamic-translations":state.islamicTranslations,"islamic-mood-filter":state.islamicMoodFilter,"video-likes":state.videoLikes,"video-format":state.videoFormat,"unavailable-video-ids":[...state.unavailableVideoIds],"islamic-tab":state.islamicTab,checkins:state.checkins,notifications:state.notifications});
  identityHydrating=false;cleanupExpiredLocalContent();localizePage();renderFeed();renderCircleStories();renderCircleList();updateNav();
}
async function hydrateSignedInIdentity(){if(identitySnapshot.status!=="authenticated")return;identityHydrating=true;try{const remote=await loadUserAppData();if(remote)applyIdentityPayload(remote);else await saveUserAppData(identityPayload());identityCanSync=true;store.set("identity-choice","account")}catch(error){console.warn("Unable to restore password profile",error)}finally{identityHydrating=false}}
const identityReadyPromise=initUserIdentity().then(snapshot=>{identitySnapshot=snapshot;return hydrateSignedInIdentity().then(()=>snapshot)});
subscribeIdentity(snapshot=>{identitySnapshot=snapshot;if(snapshot.status!=="authenticated")identityCanSync=false;});

function applyDeviceLayout(){
  // Normal phone browsers and installed phone PWAs share the compact phone-app layout.
  // A phone browser with Desktop site enabled keeps the complete desktop layout.
  const useMobileLayout = platform.layout === "mobile";
  const useTabletLayout = false;
  const useDesktopLayout = !useMobileLayout;
  document.body.classList.toggle("force-mobile-layout", useMobileLayout);
  document.body.classList.toggle("force-tablet-layout", useTabletLayout);
  document.body.classList.toggle("force-desktop-layout", useDesktopLayout);
  document.documentElement.dataset.layout = useMobileLayout ? "mobile" : "desktop";
}
applyDeviceLayout();

function t(key){ return translations[state.lang][key] || key; }
function localText(obj, bnKey="bn", enKey="en"){ return state.lang === "bn" ? obj[bnKey] : obj[enKey]; }
function userContentText(obj){
  // A user's writing is never translated by the interface language switch.
  if(obj?.isUser || obj?.userGenerated) return obj.content ?? obj.bn ?? obj.en ?? "";
  // The built-in sample stories are intentionally shown in Bangla.
  return obj?.bn ?? obj?.en ?? "";
}
function commentContentText(obj){
  // User comments stay exactly as written; built-in sample comments stay in Bangla.
  return obj?.userGenerated ? (obj.content ?? obj.bn ?? obj.en ?? "") : (obj?.bn ?? obj?.en ?? "");
}
function suggestedAlias(){ return state.lang === "bn" ? aliasPairs[state.aliasIndex][0] : aliasPairs[state.aliasIndex][1]; }
function alias(){ return state.displayName || suggestedAlias(); }
function initials(name){
  const clean=String(name||"").trim();
  return clean ? clean.split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase() : "MK";
}
function toBn(n){ return String(n).replace(/\d/g,d=>"০১২৩৪৫৬৭৮৯"[d]); }
function displayNumber(n){ return state.lang === "bn" ? toBn(n) : String(n); }
function formatCompact(n){
  if(state.lang === "bn"){
    const clean=value=>toBn(Number(value).toFixed(1).replace(/\.0$/, ""));
    if(n>=10000000)return `${clean(n/10000000)} কোটি`;
    if(n>=100000)return `${clean(n/100000)} লাখ`;
    if(n>=1000)return `${clean(n/1000)} হাজার`;
    return toBn(n);
  }
  return Intl.NumberFormat("en",{notation:"compact",maximumFractionDigits:1}).format(n);
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}
function saveState(){
  const ok = store.batch({
    saved:[...state.saved], following:[...state.following], joined:[...state.joined],
    reactions:state.reactions, "comment-reactions":state.commentReactions,
    "user-posts":state.userPosts, comments:state.userComments,
    "story-moments":state.moments, "story-reactions":state.momentReactions, "story-comments":state.momentComments,
    "islamic-likes":state.islamicLikes, "islamic-translations":state.islamicTranslations,
    "islamic-mood-filter":state.islamicMoodFilter, "video-likes":state.videoLikes,
    "video-format":state.videoFormat, "unavailable-video-ids":[...state.unavailableVideoIds], "islamic-tab":state.islamicTab,
    checkins:state.checkins, notifications:state.notifications, "display-name":state.displayName
  });
  if(!ok) showToast(state.lang === "bn" ? "এই ডিভাইসে আর তথ্য সংরক্ষণ করা যাচ্ছে না।" : "This device cannot save more app data right now.");
  scheduleIdentitySync();
}
function renderIcons(root=document){
  $$("[data-icon]",root).forEach(el=>{ el.innerHTML = icon(el.dataset.icon); });
}
const POST_TTL_MS=183*24*60*60*1000;
const MOMENT_TTL_MS=48*60*60*1000;

function cleanupExpiredLocalContent(){
  const now=Date.now();
  const beforePosts=state.userPosts.length,beforeMoments=state.moments.length;
  const expiredPostIds=new Set(state.userPosts.filter(post=>(post.expiresAt||((post.created||now)+POST_TTL_MS))<=now).map(post=>String(post.id)));
  const expiredMomentIds=new Set(state.moments.filter(moment=>(moment.expiresAt||((moment.created||now)+MOMENT_TTL_MS))<=now).map(moment=>String(moment.id)));
  state.userPosts=state.userPosts.filter(post=>!expiredPostIds.has(String(post.id)));
  state.moments=state.moments.filter(moment=>!expiredMomentIds.has(String(moment.id)));
  expiredPostIds.forEach(id=>{delete state.userComments[id];state.saved.delete(id);Object.keys(state.reactions).filter(key=>key.startsWith(`${id}:`)).forEach(key=>delete state.reactions[key]);});
  expiredMomentIds.forEach(id=>{delete state.momentReactions[id];delete state.momentComments[id];});
  if(beforePosts!==state.userPosts.length||beforeMoments!==state.moments.length)saveState();
}
function allPosts(){
  cleanupExpiredLocalContent();
  const user = state.userPosts.map(p=>({
    ...p, id:p.id||`user-${p.created}`,
    alias_bn:aliasPairs[p.aliasIndex ?? state.aliasIndex]?.[0] || aliasPairs[0][0],
    alias_en:aliasPairs[p.aliasIndex ?? state.aliasIndex]?.[1] || aliasPairs[0][1],
    displayName:p.displayName||state.displayName,
    time_bn:"আপনার পোস্ট",time_en:"Your post",reactions:p.reactions||{hear:0,with:0,strength:0,same:0},comments:0,
    supportScore:0,isFollowing:false,isUser:true,expiresAt:p.expiresAt||((p.created||Date.now())+POST_TTL_MS)
  }));
  return [...user,...seedPosts];
}

function postAlias(p){
  if(p?.isUser || p?.userGenerated) return state.displayName || (state.lang === "bn" ? p.alias_bn : p.alias_en) || suggestedAlias();
  return p?.alias_bn ?? p?.alias_en ?? "";
}
function postTime(p){
  if(p?.isUser || p?.userGenerated) return localText(p,"time_bn","time_en");
  return p?.time_bn ?? p?.time_en ?? "";
}
function commentAlias(c){
  if(c?.userGenerated) return state.displayName || (state.lang === "bn" ? c.alias_bn : c.alias_en) || suggestedAlias();
  return c?.alias_bn ?? c?.alias_en ?? "";
}
function voiceKey(p){ return p.alias_en || p.alias_bn || String(p.id); }
function moodName(key,custom=""){ if(!key)return "";if(key==="other"&&custom)return custom;const m=moods[key];return m?localText(m):custom||key; }
function topicName(key,custom=""){ if(!key)return "";if(key==="other"&&custom)return custom;const m=topics[key];return m?localText(m):custom||key; }
function needName(key,custom=""){ if(!key)return "";if(key==="other"&&custom)return custom;const m=needMeta[key];return m?localText(m):custom||key; }
function effectivePreferredMood(){
  if(state.preferredMood&&moods[state.preferredMood]&&state.preferredMood!=="other")return state.preferredMood;
  const counts={};
  state.checkins.forEach(item=>{if(item?.mood&&moods[item.mood]&&item.mood!=="other")counts[item.mood]=(counts[item.mood]||0)+1;});
  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||"";
}
function postRankScore(p){
  const comments=(p.comments||0)+(state.userComments[String(p.id)]?.length||0);
  const hear=reactionCount(p,"hear"),total=["hear","with","strength","same"].reduce((sum,key)=>sum+reactionCount(p,key),0);
  const ageHours=p.created?Math.max(0,(Date.now()-p.created)/3600000):72;
  const freshness=Math.max(0,72-ageHours)/12;
  return hear*4+comments*7+total+Number(p.supportScore||0)*.15+freshness;
}
function currentPosts(){
  let list=allPosts();
  if(state.view==="saved") list=list.filter(p=>state.saved.has(String(p.id)));
  if(state.feedMode==="following") list=list.filter(p=>state.following.has(voiceKey(p)) || p.isFollowing);
  if(state.feedMode==="latest") list=[...list].sort((a,b)=>((b.created||0)-(a.created||0))||(Number(b.id)||0)-(Number(a.id)||0));
  if(state.feedMode==="ranking") list=[...list].sort((a,b)=>postRankScore(b)-postRankScore(a));
  if(state.moodFilter!=="all") list=list.filter(p=>p.mood===state.moodFilter);
  if(state.topicFilter!=="all") list=list.filter(p=>p.topic===state.topicFilter);
  if(state.view==="explore" && state.moodFilter==="all" && state.topicFilter==="all") list=[...list].sort((a,b)=>postRankScore(b)-postRankScore(a));
  const q=state.query.toLocaleLowerCase();
  if(q) list=list.filter(p=>[
    p.content,p.bn,p.en,p.alias_bn,p.alias_en,moodName(p.mood,p.customMood),topicName(p.topic,p.customTopic),needName(p.need,p.customNeed)
  ].join(" ").toLocaleLowerCase().includes(q));
  const preferred=effectivePreferredMood();
  if(state.feedMode==="for-you" && state.moodFilter==="all" && preferred){
    const matching=list.filter(p=>p.mood===preferred).sort((a,b)=>postRankScore(b)-postRankScore(a));
    const remaining=list.filter(p=>p.mood!==preferred).sort((a,b)=>postRankScore(b)-postRankScore(a));
    list=[...matching,...remaining];
  }
  return list;
}

function moodStyle(key){
  const [color,soft]=moodColors[key] || moodColors.lonely;
  return `--mood-color:${color};--mood-soft:${soft}`;
}
function reactionCount(p,key){
  const active=state.reactions[`${p.id}:${key}`] ? 1 : 0;
  return (p.reactions?.[key]||0)+active;
}
function showToast(message){
  const el=$("#toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>el.classList.remove("show"),2600);
}
function prepareModalSurface(html,{directPage=false}={}){
  setAdSafeMode(true, "modal");
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const layer=$("#modalLayer"),card=$("#modalCard");
  layer.classList.toggle("direct-page-layer",directPage);
  card.classList.toggle("direct-page-card",directPage);
  card.setAttribute("role",directPage?"region":"dialog");
  card.setAttribute("aria-modal",directPage?"false":"true");
  card.innerHTML=html;
  card.setAttribute("aria-labelledby","activeModalTitle");
  const heading=card.querySelector(".modal-header h2,.safety-hero h2");
  if(heading)heading.id="activeModalTitle";else card.removeAttribute("aria-labelledby");
  layer.hidden=false;
  document.body.style.overflow="hidden";
  renderIcons(card);
  const body=card.querySelector(".modal-body");
  card.scrollTop=0;
  if(body)body.scrollTop=0;
  requestAnimationFrame(()=>{
    card.scrollTop=0;if(body)body.scrollTop=0;
    (card.querySelector('[autofocus]')||card.querySelector(FOCUSABLE_SELECTOR)||card).focus?.();
  });
  platform.setBackVisible(true, closeModal);
}
function setModal(html){prepareModalSurface(html,{directPage:false});}
function setPage(html){prepareModalSurface(html,{directPage:true});}
function closeModal(){
  const layer=$("#modalLayer"),card=$("#modalCard");
  if(layer.hidden)return;
  const wasDirectPage=layer.classList.contains("direct-page-layer");
  layer.hidden=true;
  layer.classList.remove("direct-page-layer");
  card.classList.remove("direct-page-card");
  card.setAttribute("role","dialog");
  card.setAttribute("aria-modal","true");
  card.scrollTop=0;
  card.innerHTML="";
  document.body.style.overflow="";
  stopSounds();
  state.breathing=false;
  clearTimeout(state.breathTimer);
  clearInterval(state.resetTimer);state.resetTimer=null;state.resetSeconds=60;
  setAdSafeMode(false, "modal");
  lastFocusedElement?.focus?.();lastFocusedElement=null;
  if(wasDirectPage&&directPageReturnView!==null){state.view=directPageReturnView;directPageReturnView=null;updateNav();}
  if($("#drawerLayer").hidden)platform.setBackVisible(false, closeModal);
}
function setDrawer(html){
  setAdSafeMode(true, "drawer");
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const drawer=$("#sideDrawer");
  drawer.innerHTML=html;
  drawer.setAttribute("role","dialog");drawer.setAttribute("aria-modal","true");
  $("#drawerLayer").hidden=false;
  document.body.style.overflow="hidden";
  renderIcons(drawer);
  requestAnimationFrame(()=>drawer.querySelector(FOCUSABLE_SELECTOR)?.focus());
  platform.setBackVisible(true, closeDrawer);
}
function closeDrawer(){
  if($("#drawerLayer").hidden)return;
  $("#drawerLayer").hidden=true;
  $("#sideDrawer").innerHTML="";
  document.body.style.overflow="";
  setAdSafeMode(false, "drawer");
  lastFocusedElement?.focus?.();lastFocusedElement=null;
  if($("#modalLayer").hidden)platform.setBackVisible(false, closeDrawer);
}
function modalHeader(title){
  return `<header class="modal-header"><h2>${escapeHtml(title)}</h2><button class="modal-close" data-action="close-modal" aria-label="${escapeHtml(t("close"))}">${icon("x")}</button></header>`;
}
function pageHeader(title,backAction="back-page"){
  const label=escapeHtml(state.lang==="bn"?"পেছনে যান":"Go back");
  const button=backAction==="profile"
    ? `<button class="page-back" data-action="profile" aria-label="${label}">${icon("arrowleft")}</button>`
    : backAction==="circles-page"
      ? `<button class="page-back" data-action="circles-page" aria-label="${label}">${icon("arrowleft")}</button>`
      : `<button class="page-back" data-action="back-page" aria-label="${label}">${icon("arrowleft")}</button>`;
  return `<header class="modal-header direct-page-header">${button}<h2>${escapeHtml(title)}</h2><span class="page-header-spacer" aria-hidden="true"></span></header>`;
}
function drawerHeader(title){
  return `<header class="drawer-header"><h2>${escapeHtml(title)}</h2><button class="modal-close" data-action="close-drawer" aria-label="${escapeHtml(t("close"))}">${icon("x")}</button></header>`;
}
function platformName(){
  if(!platform.standalone)return state.lang==="bn"?"ওয়েবসাইট":"Website";
  return platform.isPhone?t("mobileApp"):t("desktopApp");
}

const publicLinkLabels={
  about:{bn:"পরিচিতি",en:"About"},resources:{bn:"সহায়ক লেখা",en:"Resources"},
  "community-guidelines":{bn:"কমিউনিটি নিয়ম",en:"Guidelines"},safety:{bn:"নিরাপত্তা",en:"Safety"},
  privacy:{bn:"গোপনীয়তা",en:"Privacy"},terms:{bn:"শর্তাবলি",en:"Terms"},contact:{bn:"যোগাযোগ",en:"Contact"}
};
function updatePublicLinks(){
  $$('[data-app-public]').forEach(link=>{
    const page=link.dataset.appPublic;
    link.href=localizedPath(state.lang,page);
    const label=publicLinkLabels[page]?.[state.lang];
    if(label){
      const textNode=link.querySelector("b,[data-public-link-label]");
      if(textNode)textNode.textContent=label;
      else link.textContent=label;
    }
  });
}
function updateAppMetadata(){
  const title="Moner Kotha: Anonymous Social Site";
  const description=state.lang==="bn"?"পরিচয় গোপন রেখে মনের কথা লিখুন, সহমর্মী সাড়া পান এবং মন শান্ত করার সহজ টুল ব্যবহার করুন।":"Share what is on your mind anonymously, receive empathy, and use simple calming tools.";
  document.title=title;
  document.querySelector('meta[name="description"]')?.setAttribute("content",description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content",title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content",description);
}

function localizePage(){
  applyDeviceLayout();
  document.documentElement.lang=state.lang;
  updatePublicLinks();updateAppMetadata();
  document.documentElement.dataset.theme=state.theme;
  document.body.classList.toggle("no-motion",!state.motion);
  $$("[data-t]").forEach(el=>{ const key=el.dataset.t; if(translations[state.lang][key]) el.textContent=t(key); });
  $("#globalSearch").placeholder=t("searchPlaceholder");
  const brandName=$("#brandName");if(brandName)brandName.textContent=state.lang==="bn"?"মনের কথা":"Moner Kotha";
  const brandSlogan=$("#brandSlogan");if(brandSlogan)brandSlogan.textContent="কথা বলুন মন খুলে";
  $(".language-button").textContent=state.lang==="bn"?"English":"বাংলা";
  $(".icon-button[data-action='theme']").innerHTML=icon(state.theme==="dark"?"sun":"moon");
  $("#sideAlias").textContent=alias();
  $$(".compact-avatar,.avatar-button").forEach(el=>el.textContent=initials(alias()));
  $("#welcomeTitle").textContent=t("welcomeTitle");
  const pill=$("#platformPill b");if(pill)pill.textContent=platformName();
  const storageLabel=$("#storageStatus b");if(storageLabel)storageLabel.textContent=t("localMode");
  const networkLabel=$("#networkStatus b");if(networkLabel)networkLabel.textContent=navigator.onLine?t("online"):t("offline");
  $("#themeColorMeta")?.setAttribute("content",state.theme==="dark"?"#101a19":"#f3f8f7");
  renderInstallButton();renderCircleStories();renderMiniMoods();renderCircleList();renderQuote();renderFeed();renderAdPlacements();updateNav();
}

function allMoments(){
  cleanupExpiredLocalContent();
  const now=Date.now();
  const seeds=seedMoments.map(item=>({...item,created:now-item.createdOffset,expiresAt:now-item.createdOffset+MOMENT_TTL_MS,userGenerated:false})).filter(item=>item.expiresAt>now);
  return [...state.moments.map(item=>({...item,userGenerated:true})),...seeds];
}
const MOMENT_REACTIONS=[{id:"like",emoji:"👍",en:"Like",bn:"লাইক"},{id:"love",emoji:"❤️",en:"Love",bn:"ভালোবাসা"},{id:"care",emoji:"🫶",en:"Care",bn:"যত্ন"},{id:"sympathy",emoji:"🫂",en:"Sympathy",bn:"সহমর্মিতা"}];
function momentReactionState(id){
  const key=String(id),value=state.momentReactions[key];
  if(value===true){state.momentReactions[key]={care:true};return state.momentReactions[key]}
  return value&&typeof value==="object"?value:{};
}
function momentReactionCount(item,type){
  const base=Number(item.reactions?.[type]||(type==="sympathy"?item.empathy:0)||0);
  return base+(momentReactionState(item.id)[type]?1:0);
}
function momentCommentsCount(item){return (state.momentComments[String(item.id)]||[]).length;}
function momentScore(item){return MOMENT_REACTIONS.reduce((sum,reaction)=>sum+momentReactionCount(item,reaction.id)*(reaction.id==="like"?1:2),0)+momentCommentsCount(item)*3;}
function momentMood(item){return momentMoods.find(m=>m.id===item.mood)||momentMoods[0];}
function momentText(item){return item.content||item.bn||item.en||"";}
function momentTimeLeft(item){
  const hours=Math.max(0,Math.ceil((item.expiresAt-Date.now())/3600000));
  return state.lang==="bn"?`${toBn(hours)} ঘণ্টা বাকি`:`${hours}h left`;
}
function storyPreviewMarkup(item,mood){
  const text=String(momentText(item)||"").trim();
  if(text){
    const preview=text.length>34?`${text.slice(0,34).trim()}…`:text;
    return `<span class="story-text-preview" aria-hidden="true">${escapeHtml(preview)}</span>`;
  }
  return `<span class="story-emoji-preview" aria-hidden="true">${mood?.emoji||item.emoji||"💬"}</span>`;
}
function storyOwnerName(item){
  if(item.displayName)return item.displayName;
  if(item.userGenerated)return alias();
  const seedName=state.lang==="bn"?item.alias_bn:item.alias_en;
  if(seedName)return seedName;
  return state.lang==="bn"?"অচেনা বন্ধু":"Unknown Friend";
}
function renderCircleStories(){
  const wrap=$("#circleStories");wrap.innerHTML="";
  const preferred=effectivePreferredMood();
  const list=allMoments().sort((a,b)=>{
    const aOwn=a.userGenerated?1:0,bOwn=b.userGenerated?1:0;
    const ag=momentMood(a)?.group===preferred?1:0,bg=momentMood(b)?.group===preferred?1:0;
    return bOwn-aOwn||(aOwn&&bOwn?b.created-a.created:0)||bg-ag||momentScore(b)-momentScore(a)||(b.created-a.created);
  }).slice(0,9);
  list.forEach(item=>{
    const mood=momentMood(item),b=document.createElement("button");
    b.className="story-bubble moment-bubble";b.dataset.moment=String(item.id);
    b.setAttribute("aria-label",`${storyOwnerName(item)}: ${momentText(item)||localText(mood)}`);
    b.innerHTML=`<span class="story-ring">${storyPreviewMarkup(item,mood)}<i>${displayNumber(momentScore(item))}</i></span><b>${escapeHtml(storyOwnerName(item))}</b>`;
    wrap.appendChild(b);
  });
}

function renderMiniMoods(){
  const wrap=$("#miniMoods");wrap.innerHTML="";
  Object.entries(moods).forEach(([key,m])=>{
    const b=document.createElement("button");b.className="mini-mood"+(state.selectedCheckin===key?" active":"");
    b.title=localText(m);b.textContent=m.emoji;b.dataset.checkinMood=key;
    wrap.appendChild(b);
  });
  const save=$("[data-action='save-checkin']");save.disabled=!state.selectedCheckin;
  const history=$("#checkinHistory");history.innerHTML="";
  state.checkins.slice(0,7).forEach(x=>{
    const d=document.createElement("span");d.className="history-dot";d.style.background=moodColors[x.mood]?.[0]||"var(--brand)";
    d.title=moodName(x.mood,x.customMood||"");history.appendChild(d);
  });
}
function renderCircleList(){
  const wrap=$("#circleList");wrap.innerHTML="";
  circles.slice(0,4).forEach(c=>{
    const joined=state.joined.has(c.id);
    const row=document.createElement("div");row.className="circle-row";
    row.innerHTML=`<span class="circle-icon">${icon(c.icon==="home"?"circleHome":c.icon)}</span><span class="circle-copy"><strong>${escapeHtml(localText(c,"bn","en"))}</strong><small>${formatCompact(c.online)} ${t("online")}</small></span><button class="join-button ${joined?"joined":""}" data-join="${c.id}">${joined?t("joined"):t("join")}</button>`;
    wrap.appendChild(row);
  });
}
function renderAdPlacements(){
  const desktop = !document.body.classList.contains("force-mobile-layout");
  const mount = $("#desktopAdSlotMount");
  if (!desktop) {
    if (mount) { mount.hidden = true; mount.replaceChildren(); }
    return;
  }
  renderAdInto(mount, {
    placement: AD_PLACEMENTS.DESKTOP_RIGHT_RAIL,
    slotId: "desktop-right-rail-1",
    context: "feed",
    format: "300x250",
    className: "desktop-display-ad"
  });
}

function renderQuote(){
  const q=quotes[state.quoteIndex%quotes.length];
  $("#dailyQuote").textContent=localText(q);
}
function updateNav(){
  $$(".nav-item,[data-nav].mobile-nav button").forEach(el=>el.classList.toggle("active",el.dataset.nav===state.view));
  $$(".feed-tab").forEach(el=>el.classList.toggle("active",el.dataset.feed===state.feedMode));
  $("#welcomeStrip").hidden=state.view==="saved";
  const preferred=effectivePreferredMood();const hasMoodPriority=state.feedMode==="for-you"&&state.moodFilter==="all"&&Boolean(preferred);
  const specialtyFeed=["islamic","video"].includes(state.feedMode);
  $("#activeFilterBar").hidden=specialtyFeed || (state.moodFilter==="all"&&state.topicFilter==="all"&&!state.query&&!hasMoodPriority);
  if(!$("#activeFilterBar").hidden){
    const parts=[];
    if(hasMoodPriority)parts.push(`${t("moodPriority")}: ${moodName(preferred)}`);
    if(state.moodFilter!=="all")parts.push(moodName(state.moodFilter));
    if(state.topicFilter!=="all")parts.push(topicName(state.topicFilter));
    if(state.query)parts.push(`“${state.query}”`);
    $("#activeFilterBar").textContent=parts.join(" · ");
  }
}

function renderPostCard(p){
  const name=postAlias(p), saved=state.saved.has(String(p.id));
  const followKey=voiceKey(p),following=state.following.has(followKey)||p.isFollowing;
  const m=moods[p.mood]||{emoji:"💬"};
  const article=document.createElement("article");
  article.className="post-card";article.dataset.postId=String(p.id);article.style.cssText=moodStyle(p.mood||"other");
  const commentsCount=(p.comments||0)+(state.userComments[String(p.id)]?.length||0);
  const labels=[];
  if(p.mood)labels.push(`<span class="mood-chip">${m.emoji||"💬"} ${escapeHtml(moodName(p.mood,p.customMood))}</span>`);
  if(p.need)labels.push(`<span class="need-chip">${escapeHtml(needName(p.need,p.customNeed))}</span>`);
  if(p.topic)labels.push(`<span class="topic-chip">#${escapeHtml(topicName(p.topic,p.customTopic))}</span>`);
  const expiry=p.isUser?` · ${t("expiresIn")} ${formatExpiry(p.expiresAt)}`:"";
  article.innerHTML=`
    <header class="post-head">
      <div class="post-person"><span class="post-avatar">${m.emoji||"💬"}</span><span class="post-meta">
        <span class="post-name-row"><strong>${escapeHtml(name)}</strong>${p.isUser?"":`<button class="follow-button" data-follow="${escapeHtml(followKey)}">${following?(state.lang==="bn"?"অনুসরণ করছেন":"Following"):(state.lang==="bn"?"অনুসরণ করুন":"Follow")}</button>`}</span>
        <small>${escapeHtml(postTime(p))} · ${state.lang==="bn"?"আসল পরিচয় গোপন":"real identity hidden"}${expiry}</small>
      </span></div><button class="more-button" data-more="${p.id}" aria-label="More">${icon("more")}</button>
    </header>
    ${labels.length?`<div class="post-labels">${labels.join("")}</div>`:""}
    <p class="post-text">${escapeHtml(userContentText(p))}</p>
    <div class="post-support"><div class="support-cluster"><span class="support-face">🫶</span><span class="support-face">🌱</span><span class="support-face">🫂</span></div><span class="support-summary">${formatCompact(reactionCount(p,"hear")+reactionCount(p,"with")+reactionCount(p,"strength")+reactionCount(p,"same"))} ${state.lang==="bn"?"সহমর্মী সাড়া":"support responses"} · ${displayNumber(commentsCount)} ${state.lang==="bn"?"মন্তব্য":"comments"} · #${displayNumber(Math.round(postRankScore(p)))}</span></div>
    <div class="post-actions">
      <button class="post-action ${state.reactions[`${p.id}:hear`]?"reacted":""}" data-react="${p.id}:hear">${icon("ear")}<span>${state.lang==="bn"?"আমি শুনছি":"I hear you"}</span><i class="count">${displayNumber(reactionCount(p,"hear"))}</i></button>
      <button class="post-action" data-comments="${p.id}">${icon("message")}<span>${state.lang==="bn"?"মন্তব্য":"Comment"}</span><i class="count">${displayNumber(commentsCount)}</i></button>
      <button class="post-action ${saved?"saved":""}" data-save="${p.id}">${icon("bookmark")}<span>${saved?t("saved"):t("savedCount")}</span></button>
      <button class="post-action" data-share="${p.id}">${icon("share")}<span>${state.lang==="bn"?"শেয়ার":"Share"}</span></button>
    </div>`;
  return article;
}
function formatExpiry(expiresAt){
  const days=Math.max(0,Math.ceil(((expiresAt||Date.now())-Date.now())/86400000));
  return state.lang==="bn"?`${toBn(days)} দিনে`:`${days} days`;
}

function selectedIslamicMood(){
  if(state.islamicMoodFilter==="all")return "";
  if(state.islamicMoodFilter==="preferred")return effectivePreferredMood();
  return CORE_MOODS.includes(state.islamicMoodFilter)?state.islamicMoodFilter:"";
}
function preferredContentMood(section=state.feedMode){
  if(section==="islamic")return selectedIslamicMood();
  return state.moodFilter!=="all" ? state.moodFilter : effectivePreferredMood();
}
function contentLikeCount(item,bucket){
  return Number(item.likes||0)+(bucket[String(item.id)]?1:0);
}
function islamicCommentCount(item){return (state.userComments[String(item.id)]||[]).length;}
function islamicRankScore(item){return contentLikeCount(item,state.islamicLikes)*2+islamicCommentCount(item)*3;}
function sortIslamicContent(items){
  const preferred=selectedIslamicMood();
  return [...items].sort((a,b)=>{
    const am=preferred&&a.moods?.includes(preferred)?1:0,bm=preferred&&b.moods?.includes(preferred)?1:0;
    return bm-am||islamicRankScore(b)-islamicRankScore(a)||String(a.id).localeCompare(String(b.id));
  });
}
function sortVideoContent(items){
  const preferred=preferredContentMood(state.feedMode==="islamic"?"islamic":"video");
  return [...items].sort((a,b)=>{
    const am=preferred&&a.moods?.includes(preferred)?1:0,bm=preferred&&b.moods?.includes(preferred)?1:0;
    return bm-am||contentLikeCount(b,state.videoLikes)-contentLikeCount(a,state.videoLikes)||String(a.id).localeCompare(String(b.id));
  });
}
function islamicMoodControls(){
  const options=[
    {id:"preferred",label:state.lang==="bn"?"আমার মুড":"My mood",emoji:"✨"},
    {id:"all",label:state.lang==="bn"?"সব মুড":"All moods",emoji:"🌐"},
    ...CORE_MOODS.map(id=>({id,label:moodName(id),emoji:moods[id]?.emoji||"💬"}))
  ];
  return `<div class="content-mood-filter" role="group" aria-label="${state.lang==="bn"?"মুড অনুযায়ী ইসলামিক কনটেন্ট":"Islamic content by mood"}">${options.map(item=>`<button class="content-mood-chip ${state.islamicMoodFilter===item.id?"active":""}" data-islamic-mood="${item.id}">${item.emoji} ${escapeHtml(item.label)}</button>`).join("")}</div>`;
}
function videoLargeViewControl(){
  return `<button class="video-large-view-control" type="button" data-video-large-view="true">${icon("expand")}<span>${t("largeView")}</span></button>`;
}
function setVideoLargeView(enabled, focusId=""){
  const active=Boolean(enabled);
  if(active===state.videoLargeView){
    if(active&&focusId)requestAnimationFrame(()=>document.querySelector(`.video-card[data-video-id="${CSS.escape(String(focusId))}"]`)?.scrollIntoView({block:"start",behavior:"smooth"}));
    return;
  }
  const feedColumn=$("#mainContent");
  if(active){
    state.videoLargeScrollTop=feedColumn?.scrollTop||window.scrollY||0;
    state.videoLargeView=true;
    document.body.classList.add("video-large-view");
    let exit=$("#videoLargeExit");
    if(!exit){
      exit=document.createElement("button");
      exit.id="videoLargeExit";
      exit.className="video-large-exit";
      exit.type="button";
      exit.dataset.action="close-video-large";
      exit.innerHTML=`${icon("minimize")}<span>${t("exitLargeView")}</span>`;
      document.body.appendChild(exit);
      renderIcons(exit);
    }
    requestAnimationFrame(()=>{
      const card=focusId?document.querySelector(`.video-card[data-video-id="${CSS.escape(String(focusId))}"]`):document.querySelector(".video-card");
      card?.scrollIntoView({block:"start",behavior:"smooth"});
    });
  }else{
    state.videoLargeView=false;
    document.body.classList.remove("video-large-view");
    $("#videoLargeExit")?.remove();
    requestAnimationFrame(()=>{if(feedColumn)feedColumn.scrollTop=state.videoLargeScrollTop;else window.scrollTo({top:state.videoLargeScrollTop});});
  }
}
function videoFormatControls(section){
  const selected=state.videoFormat?.[section]||"video";
  return `<div class="video-format-tabs" role="tablist" aria-label="${state.lang==="bn"?"ভিডিও ধরন":"Video format"}">${VIDEO_FORMATS.map(format=>`<button class="video-format-tab ${selected===format.id?"active":""}" data-video-format="${format.id}" data-video-section="${section}">${escapeHtml(state.lang==="bn"?format.bn:format.en)}</button>`).join("")}</div>`;
}
function islamicSubnav(){
  const isVideo=state.islamicTab==="islamic-video";
  const format=isVideo?videoFormatControls("islamic"):"";
  const large=isVideo?videoLargeViewControl():"";
  return `<section class="special-feed-head surface-card"><div class="special-feed-title-row"><div><span class="eyebrow"><i></i>${t("islamic")}</span><p>${t("islamicFeedIntro")}</p></div>${large}</div><div class="islamic-subtabs" role="tablist">${islamicTabs.map(tab=>`<button class="islamic-subtab ${state.islamicTab===tab.id?"active":""}" data-islamic-tab="${tab.id}">${escapeHtml(state.lang==="bn"?tab.bn:tab.en)}</button>`).join("")}</div>${islamicMoodControls()}${format}</section>`;
}
function renderIslamicTextCard(item){
  const liked=Boolean(state.islamicLikes[String(item.id)]);
  const translationLang=state.islamicTranslations[String(item.id)]||"bn";
  const translation=translationLang==="en"?(item.en||item.bn):(item.bn||item.en);
  const article=document.createElement("article");
  article.className="post-card islamic-card social-content-card";
  article.dataset.islamicId=String(item.id);
  article.innerHTML=`<header class="post-head"><div class="post-person"><span class="post-avatar islamic-avatar">${item.kind==="quran"?"☪":item.kind==="hadith"?"📜":"🤲"}</span><span class="post-meta"><strong>${escapeHtml(item.source||t(item.kind))}</strong><small>${escapeHtml(state.lang==="bn"?"আরবি, বাংলা অর্থ ও উৎসের রেফারেন্স":"Arabic text, translation and source reference")}</small></span></div><button class="translation-toggle" data-islamic-lang="${escapeHtml(String(item.id))}">${translationLang==="bn"?"English":"বাংলা"}</button></header>
  ${item.arabic?`<p class="arabic-text" lang="ar" dir="rtl">${escapeHtml(item.arabic)}</p>`:""}
  <p class="post-text islamic-translation" lang="${translationLang}">${escapeHtml(translation)}</p>
  ${item.audio?`<audio class="quran-audio" controls preload="none" src="${escapeHtml(item.audio)}">${escapeHtml(t("sourceUnavailable"))}</audio>`:`<button class="listen-arabic" data-speak-arabic="${encodeURIComponent(item.arabic||"")}">${icon("volume")} ${t("listen")}</button>`}
  <div class="post-support islamic-rank-summary"><div class="support-cluster"><span class="support-face">❤️</span><span class="support-face">💬</span></div><span class="support-summary">${displayNumber(contentLikeCount(item,state.islamicLikes))} ${state.lang==="bn"?"ভালোবাসা":"likes"} · ${displayNumber(islamicCommentCount(item))} ${state.lang==="bn"?"মন্তব্য":"comments"} · #${displayNumber(islamicRankScore(item))}</span></div>
  <div class="post-actions islamic-actions"><button class="post-action ${liked?"reacted":""}" data-islamic-like="${escapeHtml(String(item.id))}">${icon("heart")}<span>${t("love")}</span><i class="count">${displayNumber(contentLikeCount(item,state.islamicLikes))}</i></button><button class="post-action" data-islamic-comments="${escapeHtml(String(item.id))}">${icon("message")}<span>${state.lang==="bn"?"মন্তব্য":"Comment"}</span><i class="count">${displayNumber(islamicCommentCount(item))}</i></button><button class="post-action" data-islamic-share="${escapeHtml(String(item.id))}">${icon("share")}<span>${state.lang==="bn"?"শেয়ার":"Share"}</span></button></div>`;
  return article;
}
async function renderIslamicFeed(){
  const requestedTab=state.islamicTab;
  if(requestedTab!=="islamic-video"&&state.videoLargeView)setVideoLargeView(false);
  const wrap=$("#feedList");wrap.dataset.feedKind="islamic";
  setAdSafeMode(true,"islamic-section");
  renderAdPlacements();
  $("#desktopAdSlotMount")?.replaceChildren();
  $("#loadMore").hidden=true;
  state.videoController?.destroy?.();state.videoController=null;
  wrap.innerHTML=islamicSubnav()+`<div class="special-feed-loading"><span class="loading-pulse"></span>${state.lang==="bn"?"কনটেন্ট প্রস্তুত হচ্ছে…":"Preparing content…"}</div>`;
  renderIcons(wrap);
  if(state.islamicTab==="islamic-video"){
    const cards=videoItemsForMood(mergeManagedVideos(islamicVideoCatalog,"islamic"),"islamic").map(renderVideoCard);
    wrap.replaceChildren();
    const head=document.createElement("div");head.innerHTML=islamicSubnav();wrap.append(...head.children);
    if(cards.length)wrap.append(...cards);
    else wrap.insertAdjacentHTML("beforeend",`<section class="empty-state surface-card"><span>🎬</span><h3>${state.lang==="bn"?"এই মুড ও ধরনে এখন কোনো ভিডিও নেই":"No video is available for this mood and format"}</h3><p>${state.lang==="bn"?"অন্য মুড বা ভিডিও ধরন বেছে দেখুন।":"Choose another mood or video format."}</p></section>`);
    renderIcons(wrap);if(cards.length)setupVideoAutoplay();return;
  }
  const mood=selectedIslamicMood();
  const key=`${state.islamicTab}:${mood||"all"}`;
  let items=state.islamicCache[key];
  if(!items){
    const loader=state.islamicTab==="quran"?loadQuranItems:state.islamicTab==="hadith"?loadHadithItems:loadDuaItems;
    try{items=await loader(mood,18)}catch{items=[]}
    state.islamicCache[key]=items;
  }
  if(state.feedMode!=="islamic"||state.islamicTab!==requestedTab)return;
  items.forEach(item=>state.islamicItemIndex.set(String(item.id),item));
  const sorted=sortIslamicContent(items);
  wrap.replaceChildren();
  const head=document.createElement("div");head.innerHTML=islamicSubnav();wrap.append(...head.children);
  if(sorted.length)wrap.append(...sorted.map(renderIslamicTextCard));
  else wrap.insertAdjacentHTML("beforeend",`<section class="empty-state surface-card"><span>☪</span><h3>${state.lang==="bn"?"এই মুডে কনটেন্ট পাওয়া যায়নি":"No content was found for this mood"}</h3><p>${state.lang==="bn"?"অন্য মুড বেছে আবার চেষ্টা করুন।":"Choose another mood and try again."}</p></section>`);
  renderIcons(wrap);
}
function videoItemsForMood(catalog,section="general"){
  const preferred=section==="islamic"?selectedIslamicMood():preferredContentMood("video");
  const format=state.videoFormat?.[section]||"video";
  let items=catalog.filter(item=>item.enabled!==false&&!state.unavailableVideoIds.has(item.youtubeId)&&item.contentType===format);
  if(preferred){
    const exact=items.filter(item=>item.moods?.includes(preferred));
    const allMood=items.filter(item=>!item.moods?.length);
    items=[...exact,...allMood];
  }
  const seen=new Set();
  return sortVideoContent(items).filter(item=>{const key=item.youtubeId;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,20);
}
function durationLabel(seconds){
  const value=Math.max(0,Number(seconds||0));const m=Math.floor(value/60),sec=Math.floor(value%60);
  return `${m}:${String(sec).padStart(2,"0")}`;
}
function renderVideoCard(item){
  const liked=Boolean(state.videoLikes[String(item.id)]),portrait=item.aspect==="portrait"||item.contentType==="short";
  const article=document.createElement("article");
  article.className=`post-card video-card social-content-card ${portrait?"video-short":"video-landscape"}`;
  article.dataset.videoId=String(item.id);article.dataset.youtubeId=item.youtubeId;article.dataset.videoCap=String(item.playbackCapSeconds||900);
  article.innerHTML=`<header class="post-head"><div class="post-person"><span class="post-avatar">${item.section==="islamic"?"☪":"▶"}</span><span class="post-meta"><strong>${escapeHtml(state.lang==="bn"?(item.titleBn||item.title):item.title)}</strong><small>${escapeHtml(item.channelTitle||"YouTube")} · ${durationLabel(item.durationSeconds)} · ${item.contentType==="short"?(state.lang==="bn"?"শর্টস":"Shorts"):(state.lang==="bn"?"ভিডিও":"Video")}</small></span></div><button class="video-card-expand" type="button" data-video-large-card="${escapeHtml(String(item.id))}" aria-label="${escapeHtml(t("largeView"))}">${icon("expand")}</button></header>
  <div class="youtube-stage ${portrait?"portrait":"landscape"}" data-video-stage="${escapeHtml(String(item.id))}"><div class="youtube-player-host"><div data-youtube-player-host></div></div><img loading="lazy" decoding="async" width="480" height="270" src="${escapeHtml(item.thumbnailUrl)}" alt="${escapeHtml(item.title)} thumbnail"><button class="video-play-button" data-video-play="${escapeHtml(String(item.id))}" aria-label="${escapeHtml(t("playVideo"))}">${icon("play")||"▶"}<span>${t("playVideo")}</span></button><button class="video-sound-button" type="button" data-video-sound="${escapeHtml(String(item.id))}" data-sound-on-label="${escapeHtml(t("soundOn"))}" data-sound-off-label="${escapeHtml(t("soundOff"))}" aria-label="${escapeHtml(t("soundOff"))}"><span class="video-sound-icon" aria-hidden="true">🔊</span><span class="video-sound-label">${t("soundOff")}</span></button><span class="video-ready-label">${state.lang==="bn"?"পরবর্তী ভিডিও প্রস্তুত":"Ready"}</span></div>
  <div class="post-support"><div class="support-cluster"><span class="support-face">❤️</span></div><span class="support-summary">${displayNumber(contentLikeCount(item,state.videoLikes))} ${state.lang==="bn"?"লাইক":"likes"}</span></div>
  <div class="post-actions video-actions"><button class="post-action ${liked?"reacted":""}" data-video-like="${escapeHtml(String(item.id))}">${icon("heart")}<span>${state.lang==="bn"?"লাইক":"Like"}</span><i class="count">${displayNumber(contentLikeCount(item,state.videoLikes))}</i></button></div>`;
  return article;
}
function renderVideoFeed(){
  const wrap=$("#feedList");wrap.dataset.feedKind="video";
  setAdSafeMode(false,"islamic-section");
  state.videoController?.destroy?.();state.videoController=null;
  const items=videoItemsForMood(mergeManagedVideos(generalVideoCatalog,"general"),"general");
  wrap.replaceChildren();
  const intro=document.createElement("section");intro.className="special-feed-head surface-card";intro.innerHTML=`<div class="special-feed-title-row"><div><span class="eyebrow"><i></i>${t("video")}</span><p>${t("videoFeedIntro")}</p></div>${videoLargeViewControl()}</div>${videoFormatControls("general")}`;wrap.appendChild(intro);
  if(!items.length)wrap.insertAdjacentHTML("beforeend",`<section class="empty-state surface-card"><span>🎬</span><h3>${state.lang==="bn"?"এই মুড ও ধরনে এখন কোনো ভিডিও নেই":"No video is available for this mood and format"}</h3><p>${state.lang==="bn"?"অন্য মুড বা ভিডিও ধরন বেছে দেখুন।":"Choose another mood or video format."}</p></section>`);
  items.forEach((item,index)=>{
    wrap.appendChild(renderVideoCard(item));
    const position=index+1;
    if(shouldInsertInFeedAd(position)&&isAdSlotEnabled({placement:AD_PLACEMENTS.FEED_IN_FEED,slotId:`video-feed-${position}`,context:"video"})){
      const slot=createAdSlot({placement:AD_PLACEMENTS.FEED_IN_FEED,slotId:`video-feed-${position}`,context:"video",position,format:"native-in-feed",className:"feed-ad-slot"});if(slot)wrap.appendChild(slot);
    }
  });
  $("#loadMore").hidden=true;renderAdPlacements();renderIcons(wrap);setupVideoAutoplay();
}
async function reportUnavailableVideo(payload){
  try{
    const config=await siteConfigPromise,endpoint=config?.youtube?.videoReportEndpoint||"";
    if(!endpoint)return;
    await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({...payload,reportedAt:new Date().toISOString()})});
  }catch(error){console.warn("Video availability report could not be sent",error)}
}
async function syncVideoHealth(){
  try{
    const config=await siteConfigPromise,endpoint=config?.youtube?.videoHealthEndpoint||"";
    if(!endpoint)return;
    const response=await fetch(endpoint,{cache:"no-store",credentials:"same-origin"});if(!response.ok)return;
    const data=await response.json();
    const ids=data?.unavailableYoutubeIds||data?.disabledYoutubeIds||data?.youtubeIds||[];
    let changed=false;for(const id of ids){if(id&&!state.unavailableVideoIds.has(id)){state.unavailableVideoIds.add(id);changed=true}}
    if(changed){saveState();if(["video","islamic"].includes(state.feedMode))renderFeed()}
  }catch(error){console.warn("Video health list is not configured or unavailable",error)}
}
function markVideoUnavailable({card,youtubeId,errorCode}){
  if(!youtubeId)return;
  state.unavailableVideoIds.add(youtubeId);saveState();reportUnavailableVideo({youtubeId,errorCode});
  $$(`.video-card[data-youtube-id="${CSS.escape(youtubeId)}"]`).forEach(node=>node.remove());
  showToast(state.lang==="bn"?"ভিডিওটি আর চালানো যাচ্ছে না, তাই তালিকা থেকে সরানো হয়েছে।":"This video is no longer playable and was removed from the catalogue.");
  setTimeout(()=>{if(state.feedMode==="islamic")renderIslamicFeed();else if(state.feedMode==="video")renderVideoFeed();},60);
}
function markVideoTemporaryError({card}){
  if(!card)return;card.classList.add("video-temporary-error");
  const stage=card.querySelector(".youtube-stage");if(stage)stage.classList.remove("playing");
}
function setupVideoAutoplay(){
  state.videoController?.destroy?.();
  state.videoController=createYouTubeFeedController({root:$("#feedList"),onUnavailable:markVideoUnavailable,onTemporaryError:markVideoTemporaryError,onActiveChange:({itemId})=>{state.activeVideoId=itemId;}});
  $$(".video-card").forEach((card,index)=>{
    const image=card.querySelector(".youtube-stage img");
    image?.addEventListener("error",event=>{event.currentTarget.hidden=true;event.currentTarget.parentElement?.classList.add("thumbnail-missing")},{once:true});
    if(index===0&&image)image.fetchPriority="high";
  });
}
function activateVideoCard(card,{muted=false,userInitiated=true}={}){state.videoController?.play?.(card,{muted,userInitiated});}
function toggleVideoSound(card){state.videoController?.toggleSound?.(card);}
function speakArabic(encoded){
  const value=decodeURIComponent(String(encoded||""));
  if(!value||!("speechSynthesis" in window)){showToast(state.lang==="bn"?"এই ডিভাইসে পাঠ শোনানোর সুবিধা নেই।":"Text-to-speech is not available on this device.");return}
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(value);utterance.lang="ar-SA";utterance.rate=.82;speechSynthesis.speak(utterance);
}
function toggleIslamicLike(id){state.islamicLikes[String(id)]=!state.islamicLikes[String(id)];saveState();renderIslamicFeed();}
function toggleIslamicLanguage(id){state.islamicTranslations[String(id)]=(state.islamicTranslations[String(id)]||"bn")==="bn"?"en":"bn";saveState();renderIslamicFeed();}
function toggleVideoLike(id){state.videoLikes[String(id)]=!state.videoLikes[String(id)];saveState();state.feedMode==="islamic"?renderIslamicFeed():renderVideoFeed();}

function renderFeed(){
  if(state.feedMode==="islamic"){renderIslamicFeed();return}
  if(state.feedMode==="video"){renderVideoFeed();return}
  if(state.videoLargeView)setVideoLargeView(false);
  setAdSafeMode(false,"islamic-section");
  state.videoController?.destroy?.();state.videoController=null;state.activeVideoId=null;
  const wrap=$("#feedList");
  if(wrap.dataset.feedKind && wrap.dataset.feedKind!=="standard")wrap.replaceChildren();
  wrap.dataset.feedKind="standard";
  const list=currentPosts();
  const visible=list.slice(0,state.shown);
  const hasHighRiskPost=visible.some(post=>containsUrgentRisk(userContentText(post)));
  setAdSafeMode(hasHighRiskPost,"high-risk-feed");

  if(!visible.length){
    wrap.replaceChildren();
    const savedMode=state.view==="saved";
    wrap.innerHTML=`<section class="empty-state"><span>${icon(savedMode?"bookmark":"search")}</span><h3>${savedMode?t("savedEmpty"):t("noResults")}</h3><p>${savedMode?t("savedEmptyCopy"):t("noResultsCopy")}</p></section>`;
    $("#loadMore").hidden=true;
    renderIcons(wrap);
    renderAdPlacements();
    return;
  }

  const descriptors=[];
  visible.forEach((post,index)=>{
    const position=index+1;
    descriptors.push({kind:"post",key:`post:${post.id}`,post,index});
    const slotId=`feed-${position}`;
    if(shouldInsertInFeedAd(position) && isAdSlotEnabled({
      placement:AD_PLACEMENTS.FEED_IN_FEED,
      slotId,
      context:"feed",
      highRisk:hasHighRiskPost
    })){
      descriptors.push({
        kind:"ad",
        key:`ad:${slotId}`,
        position,
        slotId
      });
    }
  });

  const existingByKey=new Map(
    [...wrap.children]
      .filter(node=>node.dataset.feedKey)
      .map(node=>[node.dataset.feedKey,node])
  );
  const desiredKeys=new Set();

  descriptors.forEach((descriptor,index)=>{
    desiredKeys.add(descriptor.key);
    let node;
    if(descriptor.kind==="ad"){
      node=existingByKey.get(descriptor.key) || createAdSlot({
        placement:AD_PLACEMENTS.FEED_IN_FEED,
        slotId:descriptor.slotId,
        context:"feed",
        position:descriptor.position,
        format:"native-in-feed",
        className:"feed-ad-slot"
      });
      if(!node)return;
      node.dataset.feedKey=descriptor.key;
    }else{
      node=renderPostCard(descriptor.post);
      node.dataset.feedKey=descriptor.key;
      node.style.animation=`modalIn .45s var(--ease) ${Math.min(descriptor.index,6)*35}ms both`;
      const previous=existingByKey.get(descriptor.key);
      if(previous)previous.replaceWith(node);
    }

    const current=wrap.children[index];
    if(current!==node)wrap.insertBefore(node,current||null);
  });

  [...wrap.children].forEach(node=>{
    if(node.dataset.feedKey && !desiredKeys.has(node.dataset.feedKey))node.remove();
  });

  $("#loadMore").hidden=visible.length>=list.length;
  renderAdPlacements();
  bindTilt();
}
function bindTilt(){
  if(!state.motion||innerWidth<900||document.body.classList.contains("force-mobile-layout"))return;
  $$(".post-card").forEach(card=>{
    if(card.dataset.tiltBound)return;card.dataset.tiltBound="1";
    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1100px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.8).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave",()=>card.style.transform="");
  });
}

function openComposer(postId=null){
  const editing=postId?allPosts().find(p=>String(p.id)===String(postId)&&p.isUser):null;
  state.editingPostId=editing?String(editing.id):null;
  if(editing){state.draftMood=editing.mood||"";state.draftNeed=editing.need||"";state.draftTopic=editing.topic||"life";state.customMood=editing.customMood||"";state.customNeed=editing.customNeed||"";state.customTopic=editing.customTopic||"";state.draftText=editing.content||"";}
  const moodButtons=[`<button class="choice-chip ${!state.draftMood?"active":""}" data-draft-mood="__skip__">${t("skip")}</button>`,...Object.entries(moods).map(([k,m])=>`<button class="choice-chip ${state.draftMood===k?"active":""}" data-draft-mood="${k}">${m.emoji} ${escapeHtml(localText(m))}</button>`)].join("");
  const needButtons=[`<button class="choice-chip ${!state.draftNeed?"active":""}" data-draft-need="__skip__">${t("skip")}</button>`,...Object.entries(needMeta).map(([k,n])=>`<button class="choice-chip ${state.draftNeed===k?"active":""}" data-draft-need="${k}">${escapeHtml(localText(n))}</button>`)].join("");
  setModal(`${modalHeader(editing?t("editPost"):t("postTitle"))}<div class="modal-body">
    <div class="compose-profile"><span class="profile-orbit">${initials(alias())}</span><div><strong>${escapeHtml(alias())}</strong><small>${icon("lock")} ${state.lang==="bn"?"শুধু আপনার পছন্দের নামটি দেখানো হবে":"Only your chosen display name will be shown"}</small></div></div>
    <label class="control-label">${t("moodLabel")} <small>${state.lang==="bn"?"(ইচ্ছা করলে বাদ দিতে পারেন)":"(optional)"}</small></label><div class="choice-grid" id="composeMoods">${moodButtons}</div>
    <input class="custom-choice-input" id="customMoodInput" maxlength="60" value="${escapeHtml(state.customMood)}" placeholder="${escapeHtml(t("customMoodPlaceholder"))}" ${state.draftMood==="other"?"":"hidden"} />
    <label class="control-label">${t("needLabel")} <small>${state.lang==="bn"?"(ইচ্ছা করলে বাদ দিতে পারেন)":"(optional)"}</small></label><div class="choice-grid" id="composeNeeds">${needButtons}</div>
    <input class="custom-choice-input" id="customNeedInput" maxlength="80" value="${escapeHtml(state.customNeed)}" placeholder="${escapeHtml(t("customSupportPlaceholder"))}" ${state.draftNeed==="other"?"":"hidden"} />
    <label class="control-label">${t("topicLabel")}</label><div class="choice-grid" id="composeTopics">${Object.entries(topics).filter(([k])=>k!=="all").map(([k,n])=>`<button class="choice-chip ${state.draftTopic===k?"active":""}" data-draft-topic="${k}">#${escapeHtml(localText(n))}</button>`).join("")}</div>
    <input class="custom-choice-input" id="customTopicInput" maxlength="60" value="${escapeHtml(state.customTopic)}" placeholder="${escapeHtml(t("customTopicPlaceholder"))}" ${state.draftTopic==="other"?"":"hidden"} />
    <label class="control-label" for="composeText">${t("write")}</label><textarea class="compose-textarea" id="composeText" maxlength="4000" placeholder="${escapeHtml(t("postPlaceholder"))}">${escapeHtml(state.draftText)}</textarea>
    <p class="compose-whisper" id="composeWhisper">${escapeHtml(t("whisper"))}</p><div class="privacy-alert" id="privacyAlert" hidden>${icon("shield")} ${escapeHtml(t("privacy"))}</div>
    <div class="compose-footer"><span class="char-count"><b id="composeCount">${displayNumber(state.draftText.length)}</b>/4000</span><div><button class="secondary-button" data-action="close-modal">${t("cancel")}</button> <button class="primary-button" data-action="submit-post">${icon("send")} ${editing?t("editPost"):t("postNow")}</button></div></div>
  </div>`);setTimeout(()=>$("#composeText")?.focus(),80);
}
function communityValidationMessage(result){
  if(result.reason==="link")return t("linkBlocked");
  if(result.reason==="restricted-sensitive")return t("restrictedSensitive");
  if(result.reason==="private-info")return t("personalInfo");
  return t("urgentLanguage");
}
function submitPost(){
  const text=$("#composeText").value.trim();if(!text){showToast(state.lang==="bn"?"প্রকাশ করার আগে কিছু লিখুন।":"Write something before publishing.");return}
  if(text.length>4000){showToast(state.lang==="bn"?"পোস্ট সর্বোচ্চ ৪,০০০ অক্ষরের হতে পারে।":"A post can contain up to 4,000 characters.");return}
  const customMood=String($("#customMoodInput")?.value||"").trim(),customNeed=String($("#customNeedInput")?.value||"").trim(),customTopic=String($("#customTopicInput")?.value||"").trim();
  const combined=[text,customMood,customNeed,customTopic].join(" "),validation=validateCommunityText(combined);
  if(!validation.ok){if(validation.reason==="urgent-risk"){closeModal();openSafety(true);return}showToast(communityValidationMessage(validation));return}
  const now=Date.now();
  if(state.editingPostId){
    const index=state.userPosts.findIndex(p=>String(p.id)===String(state.editingPostId));
    if(index>=0)state.userPosts[index]={...state.userPosts[index],mood:state.draftMood,need:state.draftNeed,topic:state.draftTopic,customMood,customNeed,customTopic,content:text,editedAt:now,displayName:state.displayName};
  }else state.userPosts.unshift({id:`user-${globalThis.crypto?.randomUUID?.()||now}`,created:now,expiresAt:now+POST_TTL_MS,aliasIndex:state.aliasIndex,displayName:state.displayName,mood:state.draftMood,need:state.draftNeed,topic:state.draftTopic,customMood,customNeed,customTopic,circle:"healing",content:text,contentLang:"auto"});
  const edited=Boolean(state.editingPostId);state.editingPostId=null;state.draftText="";state.customMood="";state.customNeed="";state.customTopic="";store.remove("draft-text");saveState();platform.notify("success");closeModal();state.view="home";state.feedMode=edited?"latest":"latest";state.shown=10;renderFeed();updateNav();showToast(edited?t("postUpdated"):t("posted"));
}

function commentRank(c){return Number(c.empathy||0)+(state.commentReactions[String(c.id)]?1:0);}
function commentBucket(kind,id){
  if(kind==="moment")return state.momentComments[String(id)]||[];
  return state.userComments[String(id)]||[];
}
function resolveCommentSubject(id,kind="post"){
  if(kind==="islamic"){
    const item=state.islamicItemIndex.get(String(id));if(!item)return null;
    return {id:String(id),avatar:item.kind==="quran"?"☪":item.kind==="hadith"?"📜":"🤲",name:item.source||t(item.kind),time:state.lang==="bn"?"ইসলামিক কনটেন্ট":"Islamic content",text:item.bn||item.en||"",mood:"other"};
  }
  if(kind==="moment"){
    const item=allMoments().find(x=>String(x.id)===String(id));if(!item)return null;
    const mm=momentMood(item);
    return {id:String(id),avatar:mm?.emoji||item.emoji||"💬",name:item.displayName||alias(),time:momentTimeLeft(item),text:momentText(item)||localText(mm),mood:mm?.group||"other"};
  }
  const p=allPosts().find(x=>String(x.id)===String(id));if(!p)return null;
  return {id:String(id),avatar:moods[p.mood]?.emoji||"💬",name:postAlias(p),time:postTime(p),text:userContentText(p),mood:p.mood||"other",post:p};
}
function openComments(id,kind="post"){
  const subject=resolveCommentSubject(id,kind);if(!subject)return;
  state.activePost=String(id);state.activeCommentKind=kind;
  const base=kind==="post"?sampleComments.slice(0,Math.min(3,subject.post?.comments||1)).map((c,i)=>({...c,id:`sample-${id}-${i}`,empathy:Math.max(2,(subject.post?.comments||1)*4-i*2)})):[];
  const own=commentBucket(kind,id).map((c,i)=>({...c,id:c.id||`own-${id}-${i}`,userGenerated:true,empathy:c.empathy||0}));
  const comments=[...base,...own].sort((a,b)=>commentRank(b)-commentRank(a));
  setModal(`${modalHeader(t("comments"))}<div class="modal-body"><div class="detail-post" style="${moodStyle(subject.mood||"other")}"><div class="post-person"><span class="post-avatar">${subject.avatar}</span><span class="post-meta"><strong>${escapeHtml(subject.name)}</strong><small>${escapeHtml(subject.time)}</small></span></div><p class="post-text">${escapeHtml(subject.text)}</p></div>
    ${kind==="post"?`<div class="quick-replies">${supportTemplates.slice(0,4).map((q,i)=>`<button class="quick-reply" data-quick-reply="${i}">${escapeHtml(localText(q))}</button>`).join("")}</div>`:""}
    <div class="comment-list">${comments.length?comments.map(c=>`<article class="comment-item"><span class="comment-avatar">${initials(commentAlias(c))}</span><div class="comment-bubble"><strong>${escapeHtml(commentAlias(c))}</strong><p>${escapeHtml(commentContentText(c))}</p><button class="comment-empathy ${state.commentReactions[String(c.id)]?"active":""}" data-comment-react="${escapeHtml(String(c.id))}">🫶 ${t("empathy")} · ${displayNumber(commentRank(c))}</button></div></article>`).join(""):`<p class="profile-empty">${state.lang==="bn"?"এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি লিখুন।":"No comments yet. Start the conversation."}</p>`}</div>
    <div class="comment-compose"><textarea class="comment-textarea" id="commentText" maxlength="400" placeholder="${escapeHtml(t("writeReply"))}"></textarea><button class="primary-button" data-action="submit-comment">${icon("send")}</button></div><div class="gentle-alert">${state.lang==="bn"?"সম্মানজনক ভাষায় লিখুন। লিংক, স্পষ্ট যৌন বা মাদক/আসক্তির বিষয় লেখা যাবে না।":"Be respectful. Links, explicit sexual content, and addiction/substance content are not allowed."}</div></div>`);
}
function submitComment(){
  const el=$("#commentText"),text=el.value.trim();if(!text)return;const validation=validateCommunityText(text);
  if(!validation.ok){if(validation.reason==="urgent-risk"){showToast(state.lang==="bn"?"মন্তব্যটি আরও নিরাপদ ভাষায় লিখুন।":"Please rewrite the comment using safer language.");return}showToast(communityValidationMessage(validation));return}
  const key=state.activePost;
  const record={id:`comment-${globalThis.crypto?.randomUUID?.()||Date.now()}`,created:Date.now(),alias_bn:aliasPairs[state.aliasIndex][0],alias_en:aliasPairs[state.aliasIndex][1],displayName:state.displayName,content:text,contentLang:"auto",userGenerated:true,empathy:0};
  if(state.activeCommentKind==="moment"){
    state.momentComments[key]=state.momentComments[key]||[];state.momentComments[key].push(record);
  }else{
    state.userComments[key]=state.userComments[key]||[];state.userComments[key].push(record);
  }
  saveState();openComments(key,state.activeCommentKind);renderFeed();renderCircleStories();showToast(t("replyAdded"));
}
function toggleCommentReaction(id){state.commentReactions[String(id)]=!state.commentReactions[String(id)];saveState();openComments(state.activePost,state.activeCommentKind);if(state.commentReactions[String(id)])showToast(t("empathySent"));}

function openPostMenu(id){
  const p=allPosts().find(x=>String(x.id)===String(id));if(!p)return;
  setDrawer(`${drawerHeader(state.lang==="bn"?"পোস্টের অপশন":"Post options")}<div class="drawer-body">
    ${p.isUser?`<button class="secondary-button" style="width:100%;margin-bottom:9px" data-edit-post="${p.id}">${icon("pen")} ${t("editPost")}</button><button class="danger-button" style="width:100%;margin-bottom:9px" data-delete-post="${p.id}">${icon("flag")} ${t("deletePost")}</button>`:""}
    <button class="secondary-button" style="width:100%;margin-bottom:9px" data-comments="${p.id}">${icon("message")} ${t("comments")}</button>
    <button class="secondary-button" style="width:100%;margin-bottom:9px" data-save="${p.id}">${icon("bookmark")} ${state.saved.has(String(p.id))?t("unsavedPost"):t("savedPost")}</button>
    <button class="secondary-button" style="width:100%;margin-bottom:9px" data-share="${p.id}">${icon("share")} ${state.lang==="bn"?"লেখা কপি করুন":"Copy text"}</button>
    <button class="danger-button" style="width:100%" data-report="${p.id}">${icon("flag")} ${t("report")}</button>
  </div>`);
}
function openReport(id){
  closeDrawer();
  setModal(`${modalHeader(t("reportTitle"))}<div class="modal-body"><p style="color:var(--muted);font-size:12px">${t("reportCopy")}</p>
  <div class="choice-grid" id="reportReasons">
    <button class="choice-chip active" data-reason="harmful">${t("harmful")}</button>
    <button class="choice-chip" data-reason="harassment">${t("harassment")}</button>
    <button class="choice-chip" data-reason="contact">${t("contact")}</button>
    <button class="choice-chip" data-reason="other">${t("other")}</button>
  </div><div class="compose-footer"><span></span><button class="danger-button" data-action="submit-report">${icon("flag")} ${t("submitReport")}</button></div></div>`);
}
function openNotifications(){
  setDrawer(`${drawerHeader(t("notificationTitle"))}<div class="drawer-body">${state.notifications.map(n=>`<article class="notification-item"><span class="notification-icon">${icon(n.kind==="reaction"?"heart":n.kind==="comment"?"message":n.kind==="circle"?"users":"sparkles")}</span><div><p>${escapeHtml(localText(n))}</p><small>${escapeHtml(localText(n,"time_bn","time_en"))}</small></div></article>`).join("")}</div>`);
  $(".notification-dot").style.display="none";
}
function openFilters(){
  setDrawer(`${drawerHeader(t("filterTitle"))}<div class="drawer-body">
    <section class="filter-section"><h3>${t("ranking")}</h3><p class="filter-help">${t("rankingCopy")}</p><div class="filter-options"><button class="choice-chip ${state.feedMode==="ranking"?"active":""}" data-filter-feed="ranking">${t("ranking")}</button><button class="choice-chip ${state.feedMode!=="ranking"?"active":""}" data-filter-feed="for-you">${t("forYou")}</button></div></section>
    <section class="filter-section"><h3>${t("allMoods")}</h3><div class="filter-options" id="filterMoods"><button class="choice-chip ${state.moodFilter==="all"?"active":""}" data-filter-mood="all">${t("allMoods")}</button>${Object.entries(moods).map(([k,m])=>`<button class="choice-chip ${state.moodFilter===k?"active":""}" data-filter-mood="${k}">${m.emoji} ${escapeHtml(localText(m))}</button>`).join("")}</div></section>
    <section class="filter-section"><h3>${t("allTopics")}</h3><div class="filter-options" id="filterTopics">${Object.entries(topics).map(([k,v])=>`<button class="choice-chip ${state.topicFilter===k?"active":""}" data-filter-topic="${k}">${escapeHtml(localText(v))}</button>`).join("")}</div></section>
    <button class="secondary-button" data-action="clear-filters">${t("clearFilters")}</button>
    <button class="primary-button" style="float:right" data-action="apply-filters">${t("apply")}</button>
  </div>`);
}

function identityStatusMarkup(){const signed=identitySnapshot.status==="authenticated";const actionAttr=signed?'data-action="identity-signout"':'data-action="identity-open"';return `<section class="identity-account-card ${signed?"connected":"guest"}"><span class="identity-account-icon">${icon(signed?"lock":"user")}</span><div><strong>${state.lang==="bn"?(signed?"Password profile সংযুক্ত":"Guest হিসেবে ব্যবহার করছেন"):(signed?"Password profile connected":"Using as guest")}</strong><small>${state.lang==="bn"?(signed?"Profile ও আপনার activity private Firebase account-এ sync হচ্ছে।":"ফোন বা email নেওয়া হচ্ছে না। Password দিলে অন্য device-এ profile ফিরবে।"):(signed?"Your profile and activity are syncing to a private Firebase account.":"No phone or email is collected. A password lets you restore this profile on another device.")}</small></div><button class="secondary-button" ${actionAttr}>${state.lang==="bn"?(signed?"Sign out":"Password দিন"):(signed?"Sign out":"Use password")}</button></section>`}
function openIdentityGate(force=false){
  if(identitySnapshot.status==="loading"){identityReadyPromise.then(()=>openIdentityGate(force));return}
  if(identitySnapshot.status==="authenticated"){if(force){closeModal();openProfile()}return}
  if(!force&&store.getText("identity-choice","")==="guest")return;
  if(identitySnapshot.status==="unavailable"||identitySnapshot.configured===false){if(force)setModal(`${modalHeader(state.lang==="bn"?"Password profile":"Password profile")}<div class="modal-body"><div class="identity-privacy-note"><strong>${state.lang==="bn"?"Firebase setup সম্পূর্ণ হয়নি":"Firebase setup is incomplete"}</strong><p>${state.lang==="bn"?"config/firebase-config.js-এ Firebase Web App config বসানোর পর password profile চালু হবে।":"Add the Firebase Web App configuration in config/firebase-config.js to enable password profiles."}</p></div><button class="secondary-button" style="width:100%" data-action="close-modal">${t("close")}</button></div>`);return}
  setModal(`${modalHeader(state.lang==="bn"?"আপনার profile কীভাবে রাখবেন?":"How should your profile be saved?")}<div class="modal-body identity-gate"><div class="identity-privacy-note">${icon("shield")}<div><strong>${state.lang==="bn"?"Phone number বা email লাগবে না":"No phone number or email"}</strong><p>${state.lang==="bn"?"আপনার দেওয়া password-টিই private ID ও access key। একই password জানলে একই profile খুলবে। এটি মনে রাখুন—recovery নেই, এবং অন্য কোথাও ব্যবহার করা password এখানে দেবেন না।":"Your password becomes the private ID and access key. Anyone using the same password can open the same profile. Remember it—there is no recovery, and do not reuse another service’s password."}</p></div></div><label class="identity-password-label" for="identityPassword">${state.lang==="bn"?"একটি ইউনিক password দিন":"Enter a unique password"}<span class="identity-password-row"><input id="identityPassword" type="password" minlength="8" maxlength="128" autocomplete="current-password" placeholder="${state.lang==="bn"?"কমপক্ষে ৮ অক্ষর":"At least 8 characters"}"><button type="button" class="icon-button" data-action="identity-toggle-password" aria-label="Show password">${icon("eye")}</button></span></label><div class="identity-error" id="identityError" hidden></div><button class="primary-button" id="identityContinueButton" style="width:100%" data-action="identity-continue">${state.lang==="bn"?"Password দিয়ে চালিয়ে যান":"Continue with password"}</button><button class="secondary-button" style="width:100%;margin-top:9px" data-action="identity-skip">${state.lang==="bn"?"এখন Skip করুন":"Skip for now"}</button><p class="identity-skip-copy">${state.lang==="bn"?"Skip করলে post ও comment এই browser-এ স্বাভাবিকভাবে থাকবে; browser data মুছে গেলে বা অন্য device-এ গেলে আগের profile ফিরে পাওয়া যাবে না।":"If you skip, posts and comments continue normally in this browser, but the profile cannot be restored after browser data is cleared or on another device."}</p></div>`);
}
async function handleIdentityContinue(){const input=$("#identityPassword"),button=$("#identityContinueButton"),errorNode=$("#identityError"),password=String(input?.value||"");if(!input)return;button.disabled=true;button.textContent=state.lang==="bn"?"সংযুক্ত হচ্ছে…":"Connecting…";errorNode.hidden=true;try{const result=await signInOrCreateWithPassword(password);identitySnapshot=getIdentityState();identityHydrating=true;if(result.created)await saveUserAppData(identityPayload());else{const remote=await loadUserAppData();if(remote)applyIdentityPayload(remote);else await saveUserAppData(identityPayload())}identityCanSync=true;identityHydrating=false;store.set("identity-choice","account");closeModal();localizePage();showToast(state.lang==="bn"?(result.created?"নতুন private profile তৈরি হয়েছে।":"আগের profile ফিরে এসেছে।"):(result.created?"Your private profile was created.":"Your previous profile was restored."))}catch(error){identityHydrating=false;errorNode.textContent=error.message;errorNode.hidden=false;input.focus()}finally{button.disabled=false;button.textContent=state.lang==="bn"?"Password দিয়ে চালিয়ে যান":"Continue with password"}}
function clearIdentityLocalData(){IDENTITY_LOCAL_KEYS.forEach(key=>store.remove(key));}
async function handleIdentitySignOut(){if(!confirm(state.lang==="bn"?"এই device থেকে password profile sign out করবেন? Firebase-এ সংরক্ষিত data মুছবে না।":"Sign out of the password profile on this device? Synced Firebase data will not be deleted."))return;try{clearIdentityLocalData();store.set("identity-choice","guest");await signOutUserIdentity()}finally{location.reload()}}

function openProfile(){
  const supportCount=Object.values(state.reactions).filter(Boolean).length;
  setPage(`${pageHeader(t("profileTitle"))}<div class="modal-body"><section class="profile-hero"><div class="profile-large">${initials(alias())}</div><h2>${escapeHtml(alias())}</h2><p>${t("profileCopy")}</p></section>
    ${identityStatusMarkup()}
    <section class="profile-name-editor"><label for="displayNameInput">${t("displayNameLabel")}</label><div class="profile-name-row"><input id="displayNameInput" type="text" maxlength="32" autocomplete="nickname" value="${escapeHtml(state.displayName)}" placeholder="${escapeHtml(t("displayNamePlaceholder"))}" /><button class="primary-button" data-action="save-display-name">${t("saveDisplayName")}</button></div><small>${t("displayNameHint")}</small></section>
    <div class="profile-stats"><button class="stat-box stat-button" data-action="profile-posts"><strong>${displayNumber(state.userPosts.length)}</strong><small>${t("posts")}</small><em>${state.lang==="bn"?"দেখুন ও পরিচালনা করুন":"View and manage"}</em></button><div class="stat-box"><strong>${displayNumber(supportCount)}</strong><small>${t("supportSent")}</small></div><div class="stat-box"><strong>${displayNumber(state.saved.size)}</strong><small>${t("savedCount")}</small></div></div>
    <section class="notification-settings-card"><span>${icon("bell")}</span><div><strong>${t("enableNotifications")}</strong><small>${t("notificationPermissionCopy")}</small></div><button class="secondary-button" data-action="enable-notifications">${t("enableNotifications")}</button><button class="quiet-link" data-action="test-notification">${t("testNotification")}</button></section>
    <section class="profile-share-card"><span>${icon("share")}</span><div><strong>${t("shareSite")}</strong><small>${t("profileShareHint")}</small></div><button class="primary-button" data-action="share-site">${t("shareSite")}</button></section>
    <button class="secondary-button" style="width:100%" data-action="new-alias">${icon("refresh")} ${t("useSuggestedName")}</button><button class="secondary-button" style="width:100%;margin-top:9px" data-action="language">${state.lang==="en"?"বাংলায় ব্যবহার করুন":"Use in English"}</button><button class="secondary-button" style="width:100%;margin-top:9px" data-action="toggle-motion">${state.motion?(state.lang==="bn"?"অ্যানিমেশন কমান":"Reduce animation"):(state.lang==="bn"?"অ্যানিমেশন চালু করুন":"Enable animation")}</button><button class="secondary-button" style="width:100%;margin-top:9px" data-action="contact-us">${icon("mail")} ${t("contactUs")}</button><button class="secondary-button" style="width:100%;margin-top:9px" data-action="cookie-settings">${icon("sliders")} ${t("cookieSettings")}</button><p class="profile-video-notice">${icon("play")} ${t("videoOwnershipNotice")}</p><a class="secondary-button profile-public-link" href="${localizedPath(state.lang,"about")}">${icon("book")} ${t("aboutApp")}</a><div class="data-actions"><button class="secondary-button" data-action="export-data">${icon("download")} ${t("exportData")}</button><button class="danger-button" data-action="reset-data">${t("resetData")}</button></div><p style="margin:14px 0 0;color:var(--muted);font-size:10px;text-align:center">${t("demoPrivacy")} · ${escapeHtml(platformName())}</p>
  </div>`);
}
function openProfilePosts(){
  const ownPosts=state.userPosts.map(post=>({...post,isUser:true})).sort((a,b)=>(b.created||0)-(a.created||0));
  const postRows=ownPosts.length?ownPosts.map(post=>`<article class="profile-post-row"><button class="profile-post-preview" data-edit-post="${post.id}"><strong>${escapeHtml((post.content||"").slice(0,150))}${(post.content||"").length>150?"…":""}</strong><small>${t("expiresIn")} ${formatExpiry(post.expiresAt)}</small></button><span><button class="icon-quiet" data-edit-post="${post.id}" aria-label="${t("editPost")}">${icon("pen")}</button><button class="icon-quiet danger-icon" data-delete-post="${post.id}" aria-label="${t("deletePost")}">${icon("x")}</button></span></article>`).join(""):`<p class="profile-empty">${state.lang==="bn"?"এখনো কোনো পোস্ট করেননি।":"You have not created a post yet."}</p>`;
  setPage(`${pageHeader(t("yourPostsTitle"),"profile")}<div class="modal-body"><section class="profile-owned-posts standalone"><div class="section-heading"><p>${state.lang==="bn"?"আপনার পোস্টগুলো এখান থেকে সম্পাদনা বা মুছে ফেলুন।":"Edit or delete your posts here."}</p><button class="quiet-link" data-action="compose">${icon("plus")} ${t("writePost")}</button></div>${postRows}</section></div>`);
}

function editUserPost(id){closeDrawer();closeModal();openComposer(id);}
function deleteUserPost(id){
  if(!confirm(t("deletePostConfirm")))return;state.userPosts=state.userPosts.filter(post=>String(post.id)!==String(id));delete state.userComments[String(id)];state.saved.delete(String(id));saveState();closeDrawer();renderFeed();showToast(t("postDeleted"));openProfilePosts();
}
async function enableNotifications(){
  const result=await pwa.requestNotifications();
  if(result.permission!=="granted"){showToast(t("notificationDenied"));return;}
  store.set("notifications-enabled",true);
  try{
    const config=await siteConfigPromise,settings=config?.notifications||{};
    if(settings.enabled&&settings.pushPublicKey){
      const push=await pwa.subscribePush({publicKey:settings.pushPublicKey});
      if(push.available&&settings.subscriptionEndpoint){
        await fetch(settings.subscriptionEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(push.subscription),credentials:"same-origin"});
      }
    }
  }catch(error){console.warn("Push subscription setup is not active yet",error);}
  showToast(t("notificationEnabled"));
}
async function testNotification(){const ok=await pwa.showNotification("Moner Kotha",{body:t("notificationTestBody"),data:{url:"./?view=home"}});showToast(ok?t("notificationEnabled"):t("notificationDenied"));}

function openCircles(){
  state.view="circles";updateNav();
  setPage(`${pageHeader(t("circlesTitle"))}<div class="modal-body"><p class="modal-intro">${t("circlesCopy")}</p><div class="circles-grid">${circles.map(c=>`<article class="circle-card"><span class="circle-icon">${icon(c.icon==="home"?"circleHome":c.icon)}</span><h3>${escapeHtml(localText(c,"bn","en"))}</h3><p>${escapeHtml(localText(c,"description_bn","description_en"))}</p><div class="circle-card-footer"><small>${formatCompact(c.members)} ${t("members")} · ${formatCompact(c.online)} ${t("online")}</small><button class="join-button ${state.joined.has(c.id)?"joined":""}" data-join="${c.id}">${state.joined.has(c.id)?t("joined"):t("join")}</button></div></article>`).join("")}</div></div>`);
}
function openCircle(id){
  const c=circles.find(x=>x.id===id);if(!c)return;
  state.topicFilter="all";state.moodFilter="all";state.query="";state.view="home";
  const relevant=allPosts().filter(p=>p.circle===id);
  setPage(`${pageHeader(localText(c,"bn","en"),"circles-page")}<div class="modal-body"><p style="color:var(--muted);font-size:12px">${escapeHtml(localText(c,"description_bn","description_en"))}</p><button class="primary-button" data-join="${c.id}">${state.joined.has(c.id)?t("joined"):t("join")}</button><div style="height:14px"></div>${relevant.slice(0,3).map(p=>`<article class="circle-card" style="margin-bottom:8px"><strong>${escapeHtml(postAlias(p))}</strong><p>${escapeHtml(userContentText(p))}</p><button class="quiet-link" data-comments="${p.id}">${icon("message")} ${t("comments")}</button></article>`).join("")}</div>`);
}

function openCalm(){
  state.view="calm";updateNav();state.groundingStep=0;state.bodyScanStep=0;state.resetSeconds=60;
  const bodyStep=bodyScanText(0);
  const kindness=kindnessText(state.kindnessIndex);
  setPage(`${pageHeader(t("calmTitle"))}<div class="modal-body"><p class="modal-intro">${t("calmCopy")}</p>
    <div class="calm-layout">
      <section class="calm-panel calm-featured"><h3>${t("breathing")}</h3><p>${state.lang==="bn"?"চার গুনে শ্বাস নিন, একটু থামুন, তারপর ধীরে ছাড়ুন।":"Breathe in for four counts, pause briefly, then breathe out slowly."}</p><div class="breath-orb" id="breathOrb"><span id="breathLabel">${t("breatheIn")}</span></div><button class="primary-button" data-action="toggle-breath">${t("start")}</button></section>
      <section class="calm-panel"><h3>${t("quickReset")}</h3><p>${t("quickResetCopy")}</p><div class="reset-clock" id="resetClock" aria-live="polite">01:00</div><button class="secondary-button" style="width:100%" data-action="start-reset">${t("startReset")}</button></section>
      <section class="calm-panel"><h3>${t("sound")}</h3><div class="sound-buttons"><button class="sound-button" data-sound="rain">${t("rain")}</button><button class="sound-button" data-sound="ocean">${t("ocean")}</button><button class="sound-button" data-sound="tone">${t("tone")}</button><button class="sound-button" data-sound="off">${t("off")}</button></div></section>
      <section class="calm-panel"><h3>${t("grounding")}</h3><div class="ground-step" id="groundStep">${groundingText(0)}</div><button class="secondary-button" style="width:100%;margin-top:10px" data-action="next-ground">${t("next")}</button></section>
      <section class="calm-panel"><h3>${t("bodyScan")}</h3><p>${t("bodyScanCopy")}</p><div class="ground-step" id="bodyScanStep">${bodyStep}</div><button class="secondary-button" style="width:100%;margin-top:10px" data-action="next-body-scan">${t("nextBodyStep")}</button></section>
      <section class="calm-panel"><h3>${t("kindnessPrompt")}</h3><p>${t("kindnessPromptCopy")}</p><blockquote class="kindness-card" id="kindnessPrompt">${kindness}</blockquote><button class="secondary-button" style="width:100%" data-action="next-kindness">${t("anotherPrompt")}</button></section>
      <section class="calm-panel sensory-panel"><h3>${t("sensoryRefresh")}</h3><p>${t("sensoryRefreshCopy")}</p><div class="sensory-dots" aria-hidden="true"><i></i><i></i><i></i></div></section>
      <section class="calm-panel"><h3>${t("release")}</h3><p>${t("releaseCopy")}</p><textarea class="release-textarea" id="releaseText" maxlength="400" style="margin-top:10px;min-height:90px"></textarea><button class="secondary-button" style="width:100%;margin-top:8px" data-action="release-thought">${t("releaseButton")}</button></section>
    </div>
  </div>`);
}
function bodyScanText(i){
  const bn=["কপাল ও চোখের চারপাশ ঢিলা করতে পারেন কি না খেয়াল করুন।","চোয়াল ও জিহ্বা শক্ত হয়ে আছে কি না খেয়াল করুন।","কাঁধ নামিয়ে হাত দুটোকে ভারী হতে দিন।","বুক ও পেটের স্বাভাবিক ওঠানামা দেখুন।","পা মেঝে বা বিছানায় কোথায় স্পর্শ করছে খেয়াল করুন।","পুরো শরীরকে একসঙ্গে অনুভব করে একটি স্বাভাবিক শ্বাস নিন।"];
  const en=["Notice whether your forehead and the space around your eyes can soften.","Notice whether your jaw or tongue is holding tension.","Let your shoulders lower and allow your arms to feel heavy.","Notice the natural movement of your chest and abdomen.","Notice where your feet or legs meet a steady surface.","Feel your body as a whole and take one ordinary breath."];
  return (state.lang==="bn"?bn:en)[i%bn.length];
}
function kindnessText(i){
  const bn=["এই মুহূর্তটি কঠিন—তবু আমাকে সবকিছু একসঙ্গে সমাধান করতে হবে না।","আমি ধীরে চলতে পারি; ছোট একটি নিরাপদ পদক্ষেপও গুরুত্বপূর্ণ।","যেভাবে বন্ধুকে শুনতাম, সেভাবেই নিজের অনুভূতিটিও শুনতে পারি।","আজ আমার সক্ষমতা কম হলে সেটিও বাস্তব এবং গ্রহণযোগ্য।","সহায়তা চাওয়া দুর্বলতা নয়; এটি নিজের যত্নের একটি অংশ।"];
  const en=["This moment is difficult, and I do not have to solve everything at once.","I can move slowly; one small safe step still matters.","I can listen to my own feelings with the care I would offer a friend.","It is real and acceptable if my capacity is lower today.","Asking for support is not weakness; it is part of caring for myself."];
  return (state.lang==="bn"?bn:en)[i%bn.length];
}
function groundingText(i){
  const bn=["দেখতে পাচ্ছেন এমন ৫টি জিনিসের নাম বলুন।","ছুঁতে পারছেন এমন ৪টি জিনিস খেয়াল করুন।","শুনতে পাচ্ছেন এমন ৩টি শব্দ শুনুন।","গন্ধ পাচ্ছেন এমন ২টি জিনিস খুঁজুন।","স্বাদ পাচ্ছেন এমন ১টি জিনিস খেয়াল করুন।"];
  const en=["Name 5 things you can see.","Notice 4 things you can feel.","Listen for 3 things you can hear.","Find 2 things you can smell.","Notice 1 thing you can taste."];
  return (state.lang==="bn"?bn:en)[i];
}
function toggleBreath(){
  state.breathing=!state.breathing;
  $("#breathOrb")?.classList.toggle("running",state.breathing);
  $("[data-action='toggle-breath']").textContent=state.breathing?t("stop"):t("start");
  clearInterval(state.breathTimer);
  if(!state.breathing){$("#breathLabel").textContent=t("breatheIn");return}
  let phase=0;const phases=[[t("breatheIn"),4000],[t("hold"),2000],[t("breatheOut"),4000]];
  const cycle=()=>{$("#breathLabel").textContent=phases[phase][0];const duration=phases[phase][1];phase=(phase+1)%3;state.breathTimer=setTimeout(cycle,duration)};
  cycle();
}
function stopSounds(){
  state.soundNodes.forEach(n=>{try{n.stop()}catch{}try{n.disconnect()}catch{}});state.soundNodes=[];
}
function playSound(type){
  stopSounds();$$(".sound-button").forEach(b=>b.classList.toggle("active",b.dataset.sound===type));
  if(type==="off")return;
  const C=window.AudioContext||window.webkitAudioContext;if(!C){showToast("Audio not supported");return}
  state.audioCtx=state.audioCtx||new C();const ctx=state.audioCtx,master=ctx.createGain();master.gain.value=.028;master.connect(ctx.destination);
  if(type==="tone"){
    [174,261.6].forEach(f=>{const o=ctx.createOscillator();o.type="sine";o.frequency.value=f;o.connect(master);o.start();state.soundNodes.push(o)});
  }else{
    const size=ctx.sampleRate*2,buffer=ctx.createBuffer(1,size,ctx.sampleRate),arr=buffer.getChannelData(0);let last=0;
    for(let i=0;i<size;i++){const white=Math.random()*2-1;last=(last+.02*white)/1.02;arr[i]=type==="rain"?white*.5:last*3}
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter();source.buffer=buffer;source.loop=true;filter.type="lowpass";filter.frequency.value=type==="rain"?1800:520;source.connect(filter).connect(master);source.start();state.soundNodes.push(source);
  }
}

function relatedMomentMoods(query=""){
  const preferred=effectivePreferredMood();const q=query.trim().toLocaleLowerCase();
  return [...momentMoods].filter(item=>!q||`${item.bn} ${item.en} ${item.emoji}`.toLocaleLowerCase().includes(q)).sort((a,b)=>Number(b.group===preferred)-Number(a.group===preferred)||a.bn.localeCompare(b.bn,"bn"));
}
function updateMomentPublishButton(){
  const button=$("#momentPublishButton");if(!button)return;
  const text=String($("#momentTextInput")?.value||"").trim();
  const ready=state.momentMode==="mood"?Boolean(state.momentMoodId):Boolean(text);
  button.hidden=!ready;button.disabled=!ready;
  const preview=$("#momentSelectedPreview");
  if(preview){const mood=momentMoods.find(item=>item.id===state.momentMoodId);preview.hidden=!mood;preview.innerHTML=mood?`<span>${mood.emoji}</span><strong>${escapeHtml(localText(mood))}</strong>`:"";}
}
function renderMomentMoodChoices(){
  const wrap=$("#momentMoodChoices");if(!wrap)return;wrap.innerHTML=relatedMomentMoods(state.momentSearch).slice(0,200).map(item=>`<button class="moment-mood-choice ${state.momentMoodId===item.id?"active":""}" data-moment-mood="${item.id}"><span>${item.emoji}</span><small>${escapeHtml(localText(item))}</small></button>`).join("");updateMomentPublishButton();
}
function openMomentComposer(){
  state.momentMode="text";state.momentMoodId="";state.momentSearch="";
  setModal(`${modalHeader(t("momentTitle"))}<div class="modal-body story-composer"><p class="modal-intro">${t("momentCopy")}</p><div class="moment-mode-tabs"><button class="choice-chip active" data-moment-mode="text">${t("momentText")}</button><button class="choice-chip" data-moment-mode="mood">${t("momentMood")}</button></div><section id="momentTextPane"><textarea id="momentTextInput" class="compose-textarea" maxlength="280" placeholder="${escapeHtml(t("momentPlaceholder"))}"></textarea></section><section id="momentMoodPane" hidden><input id="momentMoodSearch" class="custom-choice-input" type="search" placeholder="${escapeHtml(t("findMood"))}"><div id="momentSelectedPreview" class="moment-selected-preview" hidden></div><div id="momentMoodChoices" class="moment-mood-grid"></div></section><button id="momentPublishButton" class="primary-button story-publish-button" style="width:100%;margin-top:16px" data-action="submit-moment" hidden disabled>${t("publishMoment")}</button><small class="moment-disclaimer">${t("storyRank")} · ${state.lang==="bn"?"স্টোরিটি ৪৮ ঘণ্টা পর স্বয়ংক্রিয়ভাবে সরে যাবে। লিংক ও নিষিদ্ধ সংবেদনশীল বিষয় লেখা যাবে না।":"The story disappears automatically after 48 hours. Links and restricted sensitive content are not allowed."}</small></div>`);renderMomentMoodChoices();
}
function submitMoment(){
  const text=String($("#momentTextInput")?.value||"").trim(),mood=momentMoods.find(item=>item.id===state.momentMoodId);const content=state.momentMode==="text"?text:"";
  if(state.momentMode==="text"&&!content){showToast(state.lang==="bn"?"একটি ছোট লেখা লিখুন।":"Write a short story.");return}
  if(state.momentMode==="mood"&&!mood){showToast(state.lang==="bn"?"একটি মুড বেছে নিন।":"Choose a mood.");return}
  if(content){const validation=validateCommunityText(content);if(!validation.ok){if(validation.reason==="urgent-risk"){closeModal();openSafety(true);return}showToast(communityValidationMessage(validation));return}}
  const now=Date.now(),id=`moment-${globalThis.crypto?.randomUUID?.()||now}`;
  state.moments.unshift({id,created:now,expiresAt:now+MOMENT_TTL_MS,mood:mood?.id||"",emoji:mood?.emoji||"💬",content,displayName:alias(),reactions:{like:0,love:0,care:0,sympathy:0},empathy:0});
  saveState();closeModal();renderCircleStories();showToast(t("momentAdded"));
  requestAnimationFrame(()=>{
    const bubble=[...document.querySelectorAll("[data-moment]")].find(node=>String(node.dataset.moment)===String(id));
    bubble?.scrollIntoView?.({behavior:state.motion?"smooth":"auto",block:"nearest",inline:"center"});
    bubble?.classList.add("story-new");
    setTimeout(()=>bubble?.classList.remove("story-new"),1800);
  });
}
function momentReactionSummary(item){
  const active=MOMENT_REACTIONS.filter(reaction=>momentReactionCount(item,reaction.id)>0);
  const icons=active.slice(0,3).map(reaction=>`<span>${reaction.emoji}</span>`).join("")||"<span>💬</span>";
  const total=MOMENT_REACTIONS.reduce((sum,reaction)=>sum+momentReactionCount(item,reaction.id),0);
  return `<div class="story-reaction-summary"><div>${icons}</div><span>${displayNumber(total)} ${state.lang==="bn"?"প্রতিক্রিয়া":"reactions"} · ${displayNumber(momentCommentsCount(item))} ${state.lang==="bn"?"মন্তব্য":"comments"} · #${displayNumber(momentScore(item))}</span></div>`;
}
function openMoment(id){
  const item=allMoments().find(moment=>String(moment.id)===String(id));if(!item)return;const mood=momentMood(item),text=momentText(item),selected=momentReactionState(item.id);
  setModal(`${modalHeader(t("moments"))}<div class="modal-body moment-view facebook-story-card"><header class="story-card-head"><span class="post-avatar">${mood?.emoji||item.emoji||"💬"}</span><div><strong>${escapeHtml(storyOwnerName(item))}</strong><small>${momentTimeLeft(item)}</small></div></header><div class="moment-big-emoji">${mood?.emoji||item.emoji||"💬"}</div>${text?`<p>${escapeHtml(text)}</p>`:`<h3>${escapeHtml(localText(mood))}</h3>`}${momentReactionSummary(item)}<div class="story-action-bar">${MOMENT_REACTIONS.map(reaction=>`<button class="story-reaction-button ${selected[reaction.id]?"active":""}" data-moment-react="${item.id}" data-moment-reaction-type="${reaction.id}"><span>${reaction.emoji}</span><small>${escapeHtml(state.lang==="bn"?reaction.bn:reaction.en)}</small></button>`).join("")}<button class="story-reaction-button" data-moment-comments="${item.id}">${icon("message")}<small>${state.lang==="bn"?"মন্তব্য":"Comment"}</small></button></div></div>`);
}
function toggleMomentReaction(id,type="care"){
  const current=momentReactionState(id),wasSelected=Boolean(current[type]);
  const next={};MOMENT_REACTIONS.forEach(reaction=>next[reaction.id]=false);if(!wasSelected)next[type]=true;
  state.momentReactions[String(id)]=next;saveState();renderCircleStories();openMoment(id);if(!wasSelected)showToast(state.lang==="bn"?"প্রতিক্রিয়া যোগ হয়েছে।":"Reaction added.");
}

async function openContact(){
  const config=await siteConfigPromise;
  const runtimeSite=getAdminRuntime()?.settings?.site||{};
  const runtimeConfig={...config,contact:{...config.contact,
    facebookPageUrl:runtimeSite.facebookUrl||config.contact?.facebookPageUrl||"",
    supportEmail:runtimeSite.supportEmail||config.contact?.supportEmail||"",
    whatsappNumber:runtimeSite.whatsappNumber||config.contact?.whatsappNumber||""
  }};
  const options=contactOptions(runtimeConfig,state.lang);
  const cards=options.map(option=>{
    const content=`<span class="contact-option-icon">${option.id==="facebook"?"f":option.id==="email"?"@":"⌁"}</span><span><strong>${escapeHtml(option.label)}</strong><small>${escapeHtml(option.description)}</small></span><em>${option.enabled?"↗":t("comingSoon")}</em>`;
    if(!option.enabled)return `<div class="contact-option disabled" aria-disabled="true">${content}</div>`;
    return `<a class="contact-option" href="${escapeHtml(option.href)}" ${option.external?'target="_blank" rel="noopener noreferrer"':''} aria-label="${escapeHtml(option.label)}">${content}</a>`;
  }).join("");
  setPage(`${pageHeader(t("contactTitle"))}<div class="modal-body"><p class="modal-intro">${t("contactIntro")}</p><div class="contact-options">${cards}</div><a class="secondary-button public-info-link" href="${localizedPath(state.lang,"contact")}">${t("openPublicPage")}</a></div>`);
}
function openCookieSettings(){
  const consent=getConsent();
  setPage(`${pageHeader(t("cookieSettings"))}<div class="modal-body"><p class="modal-intro">${t("cookieSettingsCopy")}</p><label class="settings-toggle"><span><strong>${t("analyticsConsent")}</strong><small>${state.lang==="bn"?"Page ও performance-এর সাধারণ তথ্য; পোস্ট, মুড বা সার্চ নয়।":"Generic page and performance data; never posts, mood or searches."}</small></span><input id="analyticsConsentInput" type="checkbox" ${consent.analytics?"checked":""}></label><label class="settings-toggle"><span><strong>${t("adsConsent")}</strong><small>${state.lang==="bn"?"বর্তমানে কোনো ad provider চালু নেই।":"No ad provider is currently active."}</small></span><input id="adsConsentInput" type="checkbox" ${consent.advertising?"checked":""}></label><button class="primary-button" style="width:100%;margin-top:14px" data-action="save-cookie-settings">${t("saveChoices")}</button><a class="quiet-link public-info-link" href="${localizedPath(state.lang,"cookie-policy")}">${t("openPublicPage")}</a></div>`);
}
function saveCookieSettings(){
  setConsent({analytics:Boolean($("#analyticsConsentInput")?.checked),advertising:Boolean($("#adsConsentInput")?.checked)});
  closeModal();showToast(t("choicesSaved"));
}
function openAppMenu(){
  const links=[
    ["about",t("aboutApp"),"book"],["contact",t("contactUs"),"mail"],["community-guidelines",state.lang==="bn"?"কমিউনিটি নির্দেশিকা":"Community guidelines","shield"],["safety",state.lang==="bn"?"নিরাপত্তা তথ্য":"Safety information","shield"],["privacy",state.lang==="bn"?"গোপনীয়তা":"Privacy","lock"],["resources",state.lang==="bn"?"রিসোর্স":"Resources","sparkles"]
  ];
  setDrawer(`${drawerHeader(t("appMenuTitle"))}<div class="drawer-body app-info-menu"><button class="menu-action-card" data-action="contact-us">${icon("mail")}<span><strong>${t("contactUs")}</strong><small>${t("contactIntro")}</small></span></button><button class="menu-action-card" data-action="cookie-settings">${icon("sliders")}<span><strong>${t("cookieSettings")}</strong><small>${t("cookieSettingsCopy")}</small></span></button><nav aria-label="${t("publicPages")}">${links.map(([path,label,ico])=>`<a class="menu-action-card" href="${localizedPath(state.lang,path)}">${icon(ico)}<span><strong>${escapeHtml(label)}</strong><small>${t("openPublicPage")}</small></span></a>`).join("")}</nav></div>`);
}
function startResetTimer(){
  clearInterval(state.resetTimer);state.resetSeconds=60;
  const button=$("[data-action='start-reset']");if(button)button.disabled=true;
  const tick=()=>{
    const clock=$("#resetClock");
    if(clock){const m=String(Math.floor(state.resetSeconds/60)).padStart(2,"0"),sec=String(state.resetSeconds%60).padStart(2,"0");clock.textContent=`${m}:${sec}`;}
    if(state.resetSeconds<=0){clearInterval(state.resetTimer);state.resetTimer=null;if(button)button.disabled=false;showToast(t("resetComplete"));return;}
    state.resetSeconds-=1;
  };tick();state.resetTimer=setInterval(tick,1000);
}
function openSafety(fromRisk=false){
  setPage(`${pageHeader(t("safetyTitle"))}<div class="safety-hero direct-safety-hero"><div class="safety-symbol">${icon("shield")}</div><p>${t("safetyCopy")}</p></div>
  <div class="modal-body"><div class="safety-actions"><a class="danger-button" href="tel:999" style="text-decoration:none">${icon("shield")} ${t("call999")}</a><button class="secondary-button" data-action="copy-safety-message">${icon("message")} ${t("tellSomeone")}</button><button class="secondary-button" data-action="close-modal">${icon("check")} ${t("safeWithSomeone")}</button></div><ul class="safety-list"><li>${t("safetySteps")}</li><li>${t("demoOnly")}</li></ul></div>`);
}
function openCheckin(){
  setModal(`${modalHeader(t("todayCheckin"))}<div class="modal-body"><p style="color:var(--muted);font-size:12px">${t("checkinPrompt")}</p><div class="choice-grid"><button class="choice-chip ${!state.selectedCheckin?"active":""}" data-checkin-modal="__skip__">${t("skip")}</button>${Object.entries(moods).map(([k,m])=>`<button class="choice-chip ${state.selectedCheckin===k?"active":""}" data-checkin-modal="${k}">${m.emoji} ${escapeHtml(localText(m))}</button>`).join("")}</div><input class="custom-choice-input" id="checkinCustomMood" maxlength="60" placeholder="${escapeHtml(t("customMoodPlaceholder"))}" ${state.selectedCheckin==="other"?"":"hidden"}><button class="primary-button" style="width:100%;margin-top:16px" data-action="save-checkin-modal">${t("saveFeeling")}</button></div>`);
}

function saveDisplayName(){
  const input=$("#displayNameInput");
  const name=String(input?.value||"").replace(/\s+/g," ").trim();
  if(!name || name.length>32 || containsPrivateInfo(name) || containsLink(name) || containsProhibitedSensitiveContent(name)){
    showToast(t("displayNameInvalid"));
    input?.focus();
    return;
  }
  state.displayName=name;
  store.set("display-name",name);
  saveState();
  closeModal();
  localizePage();
  showToast(t("displayNameSaved"));
}
function changeAlias(){
  state.displayName="";
  store.remove("display-name");
  state.aliasIndex=(state.aliasIndex+1)%aliasPairs.length;
  store.set("alias-index",state.aliasIndex);scheduleIdentitySync();
  closeModal();localizePage();showToast(t("aliasChanged"));
}
function toggleSave(id){
  const key=String(id);if(state.saved.has(key)){state.saved.delete(key);showToast(t("unsavedPost"))}else{state.saved.add(key);showToast(t("savedPost"))}
  saveState();renderFeed();
}
function toggleFollow(name){
  if(state.following.has(name))state.following.delete(name);else state.following.add(name);
  saveState();renderFeed();
}
function toggleJoin(id){
  const on=state.joined.has(id);if(on){state.joined.delete(id);showToast(t("leftCircle"))}else{state.joined.add(id);showToast(t("joinedCircle"))}
  saveState();renderCircleList();
  $$(`[data-join="${CSS.escape(id)}"]`).forEach(b=>{b.classList.toggle("joined",!on);b.textContent=!on?t("joined"):t("join")});
}
function toggleReaction(value){
  state.reactions[value]=!state.reactions[value];saveState();renderFeed();if(state.reactions[value]){platform.haptic("light");showToast(t("supportDelivered"));}
}
function siteShareText(){
  return state.lang==="bn"
    ? "মনের কথা—পরিচয় গোপন রেখে নিজের অনুভূতি বলার, অন্যের কথা শোনার এবং মন শান্ত করার একটি নিরাপদ সামাজিক জায়গা।"
    : "Moner Kotha is a calm anonymous social space to share feelings, feel heard, and use simple calming tools.";
}
function sharePayload(id=null){
  if(id==="__custom__"&&state.customSharePayload)return state.customSharePayload;
  const post=id?allPosts().find(x=>String(x.id)===String(id)):null;
  const url=publicSiteUrl();
  if(post){
    const content=userContentText(post).trim();
    return {post,title:t("sharePostTitle"),text:`${content}\n\n${siteShareText()}`,url,previewText:content};
  }
  return {post:null,title:"Moner Kotha",text:siteShareText(),url,previewText:siteShareText()};
}
function shareCaption(payload){
  return `${payload.text}\n\n${payload.url}`;
}
function loadImage(src){
  return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
}
function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight,maxLines=6){
  const words=String(text).replace(/\s+/g," ").trim().split(" ");
  let line="",lines=[];
  for(const word of words){
    const test=line?`${line} ${word}`:word;
    if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;if(lines.length===maxLines-1)break}else line=test;
  }
  if(line&&lines.length<maxLines)lines.push(line);
  if(words.length&&lines.length===maxLines){
    while(ctx.measureText(`${lines[maxLines-1]}…`).width>maxWidth&&lines[maxLines-1].length>1)lines[maxLines-1]=lines[maxLines-1].slice(0,-1);
    lines[maxLines-1]+="…";
  }
  lines.forEach((row,i)=>ctx.fillText(row,x,y+i*lineHeight));
  return y+lines.length*lineHeight;
}
async function createShareCard(payload){
  const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=630;
  const ctx=canvas.getContext("2d");
  const gradient=ctx.createLinearGradient(0,0,1200,630);gradient.addColorStop(0,"#eff8f6");gradient.addColorStop(1,"#f8f7f2");ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,630);
  ctx.fillStyle="#d9eee9";ctx.beginPath();ctx.arc(100,80,250,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#edf1ec";ctx.beginPath();ctx.arc(1110,40,220,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#ffffff";ctx.strokeStyle="#d4e5e1";ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(50,50,1100,530,45);ctx.fill();ctx.stroke();
  try{const logo=await loadImage(BRAND_LOGO_URL);ctx.drawImage(logo,82,92,180,180)}catch{}
  ctx.fillStyle="#0d5752";ctx.font='800 56px system-ui, "Noto Sans Bengali", sans-serif';ctx.fillText("Moner Kotha",300,135);
  ctx.fillStyle="#536562";ctx.font='500 25px system-ui, "Noto Sans Bengali", sans-serif';ctx.fillText(state.lang==="bn"?"বলুন। কেউ শুনছে।":"Speak. Someone is listening.",302,178);
  if(payload.post){
    const mood=moods[payload.post.mood];
    ctx.fillStyle="#e5f2ef";ctx.beginPath();ctx.roundRect(300,210,285,50,25);ctx.fill();
    ctx.fillStyle="#0d5752";ctx.font='700 23px system-ui, "Noto Sans Bengali", sans-serif';ctx.fillText(payload.badge||`${mood?.emoji||"💬"} ${moodName(payload.post.mood)||"Moner Kotha"}`,325,243);
    ctx.fillStyle="#1d2d2a";ctx.font='600 34px system-ui, "Noto Sans Bengali", sans-serif';
    wrapCanvasText(ctx,payload.previewText||userContentText(payload.post),300,315,780,49,4);
  }else{
    ctx.fillStyle="#1d2d2a";ctx.font='700 39px system-ui, "Noto Sans Bengali", sans-serif';
    const heading=state.lang==="bn"?"পরিচয় গোপন রেখে মনের কথা বলুন":"A calm anonymous social space";
    wrapCanvasText(ctx,heading,300,285,790,52,2);
    ctx.fillStyle="#5c6c69";ctx.font='500 28px system-ui, "Noto Sans Bengali", sans-serif';
    const body=state.lang==="bn"?"নিজের অনুভূতি শেয়ার করুন, অন্যের কথা শুনুন এবং মন শান্ত করার সহজ উপায় ব্যবহার করুন।":"Share feelings, feel heard, and use simple tools for a calmer moment.";
    wrapCanvasText(ctx,body,300,400,790,40,3);
  }
  ctx.fillStyle="#0d5752";ctx.font='700 22px system-ui, sans-serif';ctx.fillText(new URL(payload.url).host,83,535);
  ctx.fillStyle="#667572";ctx.font='500 19px system-ui, "Noto Sans Bengali", sans-serif';ctx.textAlign="right";ctx.fillText(state.lang==="bn"?"ওয়েবসাইট ও ইনস্টলযোগ্য অ্যাপ":"Website and installable app",1105,535);ctx.textAlign="left";
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Could not create share card")),"image/png",0.94));
}
function sharePreviewMarkup(payload){
  const previewText=payload.previewText||(payload.post?userContentText(payload.post):siteShareText());
  return `<section class="share-preview"><img src="./assets/brand/share-cover.png" alt="Moner Kotha share card"><div><strong>${escapeHtml(payload.title)}</strong><p>${escapeHtml(previewText)}</p><small>${escapeHtml(payload.url)}</small></div></section>`;
}
function openShareCenter(id=null,customPayload=null){
  if(customPayload){state.customSharePayload=customPayload;state.shareContext="__custom__";}else{state.customSharePayload=null;state.shareContext=id?String(id):"site";}
  const payload=customPayload||sharePayload(id);
  setModal(`${modalHeader(payload.post?t("sharePostTitle"):t("shareTitle"))}<div class="modal-body share-center">
    <p class="share-intro">${t("shareIntro")}</p>${sharePreviewMarkup(payload)}
    <div class="share-platform-grid">
      <button class="share-platform native" data-action="share-native">${icon("share")}<span><strong>${t("nativeShare")}</strong><small>${state.lang==="bn"?"ফোনের শেয়ার মেনু খুলবে":"Opens your device share menu"}</small></span></button>
      <button class="share-platform" data-action="share-whatsapp"><b>WA</b><span><strong>${t("shareWhatsApp")}</strong><small>${state.lang==="bn"?"এক চাপেই বার্তা তৈরি হবে":"Creates a ready-to-send message"}</small></span></button>
      <button class="share-platform" data-action="share-facebook"><b>f</b><span><strong>${t("shareFacebook")}</strong><small>${state.lang==="bn"?"শেয়ার উইন্ডো খুলবে":"Opens the Facebook share window"}</small></span></button>
      <button class="share-platform" data-action="share-x"><b>𝕏</b><span><strong>${t("shareX")}</strong><small>${state.lang==="bn"?"পোস্ট তৈরি হবে":"Creates a new post"}</small></span></button>
      <button class="share-platform" data-action="share-email">${icon("mail")}<span><strong>${t("shareEmail")}</strong><small>${state.lang==="bn"?"ইমেইল খসড়া খুলবে":"Opens an email draft"}</small></span></button>
      <button class="share-platform" data-action="copy-share-caption">${icon("copy")}<span><strong>${t("copyInvite")}</strong><small>${state.lang==="bn"?"যেকোনো জায়গায় পেস্ট করুন":"Paste it anywhere"}</small></span></button>
    </div>
    <button class="share-card-download" data-action="download-share-card">${icon("image")}<span><strong>${t("downloadShareCard")}</strong><small>${t("shareCardHint")}</small></span></button>
  </div>`);
}
function currentSharePayload(){return sharePayload(state.shareContext&&state.shareContext!=="site"?state.shareContext:null)}
async function copyText(value){
  if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(value);
  const input=document.createElement("textarea");input.value=value;input.style.position="fixed";input.style.opacity="0";document.body.appendChild(input);input.select();document.execCommand("copy");input.remove();
}
function openShareWindow(url){
  const popup=window.open(url,"_blank","noopener,noreferrer,width=720,height=680");
  if(!popup)location.href=url;
}
async function nativeShareCurrent(){
  const payload=currentSharePayload();
  try{
    const blob=await createShareCard(payload);const file=new File([blob],"moner-kotha-share.png",{type:"image/png"});
    const withFile={title:payload.title,text:payload.text,url:payload.url,files:[file]};
    if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share(withFile);showToast(t("shared"));return}
    if(navigator.share){await navigator.share({title:payload.title,text:payload.text,url:payload.url});showToast(t("shared"));return}
    await copyText(shareCaption(payload));showToast(t("shareUnavailable"));
  }catch(error){if(error?.name!=="AbortError"){await copyText(shareCaption(payload)).catch(()=>{});showToast(t("shareUnavailable"));}}
}
async function copyShareCaption(){const payload=currentSharePayload();await copyText(shareCaption(payload));showToast(t("shareCaptionCopied"));}
async function downloadShareCard(){
  const payload=currentSharePayload();
  try{const blob=await createShareCard(payload);const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=payload.post?`moner-kotha-post-${payload.post.id}.png`:"moner-kotha-share-card.png";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);showToast(t("downloadStarted"));}
  catch{showToast(state.lang==="bn"?"ছবিটি তৈরি করা যায়নি।":"Could not create the image.")}
}
function directShare(platformName){
  const payload=currentSharePayload(),caption=shareCaption(payload),url=encodeURIComponent(payload.url),text=encodeURIComponent(caption);
  if(platformName==="whatsapp")openShareWindow(`https://wa.me/?text=${text}`);
  else if(platformName==="facebook")openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(payload.text)}`);
  else if(platformName==="x")openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.text)}&url=${url}`);
  else if(platformName==="email")location.href=`mailto:?subject=${encodeURIComponent(payload.title)}&body=${text}`;
}
function shareIslamicContent(id){
  const item=state.islamicItemIndex.get(String(id));if(!item)return;
  const language=state.islamicTranslations[String(id)]||"bn";
  const translation=language==="en"?(item.en||item.bn):(item.bn||item.en);
  const content=[item.arabic,translation,`— ${item.source||""}`].filter(Boolean).join("\n\n");
  const post={id:`islamic-${item.id}`,mood:"other",content,isUser:true};
  openShareCenter(null,{post,title:item.source||"Moner Kotha Islamic",text:`${content}\n\n${siteShareText()}`,url:publicSiteUrl(),previewText:translation,badge:item.kind==="quran"?"☪ Qur'an":item.kind==="hadith"?"📜 Hadith":"🤲 Dua"});
}
function sharePost(id){openShareCenter(id)}
function selectPreferredMood(mood,{reopen=false}={}){
  if(mood==="__skip__"){state.selectedCheckin=null;state.preferredMood="";store.remove("preferred-mood");scheduleIdentitySync();renderMiniMoods();renderFeed();updateNav();if(reopen)openCheckin();return;}
  if(!moods[mood])return;
  state.selectedCheckin=mood;state.preferredMood=mood;state.feedMode="for-you";state.moodFilter="all";state.shown=10;
  store.set("preferred-mood",mood);scheduleIdentitySync();renderMiniMoods();renderFeed();updateNav();
  if(reopen)openCheckin();
}
function saveCheckin(close=false){
  if(!state.selectedCheckin){if(close)closeModal();return;}
  const customMood=String($("#checkinCustomMood")?.value||"").trim();
  if(state.selectedCheckin==="other"){
    const validation=validateCommunityText(customMood);
    if(!customMood){showToast(t("customMoodPlaceholder"));return;}
    if(!validation.ok){showToast(communityValidationMessage(validation));return;}
  }
  state.preferredMood=state.selectedCheckin;store.set("preferred-mood",state.preferredMood);
  state.checkins.unshift({mood:state.selectedCheckin,customMood,at:Date.now()});state.checkins=state.checkins.slice(0,14);saveState();renderMiniMoods();renderFeed();updateNav();showToast(t("checkedIn"));if(close)closeModal();
}
function navigate(view){
  if(view==="circles"){directPageReturnView=state.view;openCircles();return}
  if(view==="calm"){directPageReturnView=state.view;openCalm();return}
  state.view=view;state.shown=10;
  if(view==="explore"){state.feedMode="for-you";state.moodFilter="all";state.topicFilter="all"}
  renderFeed();updateNav();scrollTo({top:0,behavior:state.motion?"smooth":"auto"});
}
function toggleTheme(){
  state.theme=state.theme==="light"?"dark":"light";store.set("theme",state.theme);localizePage();
}
function toggleLanguage(){
  state.lang=state.lang==="bn"?"en":"bn";
  store.set("lang",state.lang);
  closeModal();closeDrawer();localizePage();
  showToast(state.lang==="bn"?"অ্যাপের ভাষা বাংলা করা হয়েছে।":"The app language is now English.");
}


function renderInstallButton(){
  const button=$("#installButton");
  if(!button)return;
  button.hidden=platform.standalone;
  button.classList.toggle("install-ready",state.installAvailable);
  button.classList.remove("install-recorded");
  const label=button.querySelector("[data-t='installApp']");
  if(label)label.textContent=t("installApp");
  button.setAttribute("aria-label",t("installApp"));
}
function installEnvironment(){
  const ua=navigator.userAgent||"";
  return {
    ios:/iphone|ipad|ipod/i.test(ua),
    android:/android/i.test(ua),
    secure:isSecureContext||["localhost","127.0.0.1"].includes(location.hostname),
    handheld:platform.isPhone||platform.isTablet||(platform.hasTouch&&window.innerWidth<1200)
  };
}
function installationUrl(){
  return `${location.origin}${location.pathname}`;
}
function openInstallChooser(){
  const env=installEnvironment();
  const recommended=env.handheld?"phone":"desktop";
  const deviceLabel=env.handheld?t("thisPhone"):t("thisComputer");
  setModal(`${modalHeader(t("installWhereTitle"))}<div class="modal-body install-guide">
    <p class="install-lead">${t("installWhereCopy")}</p>
    <div class="install-destination-grid">
      <button class="install-destination ${recommended==="phone"?"recommended":""}" data-action="install-phone">
        <span class="install-device-icon">${icon("download")}</span>
        <span><strong>${t("installPhone")}</strong><small>${t("installPhoneCopy")}</small></span>
        ${recommended==="phone"?`<em>${t("recommended")} · ${deviceLabel}</em>`:""}
      </button>
      <button class="install-destination ${recommended==="desktop"?"recommended":""}" data-action="install-desktop">
        <span class="install-device-icon desktop-device">${icon("briefcase")}</span>
        <span><strong>${t("installDesktop")}</strong><small>${t("installDesktopCopy")}</small></span>
        ${recommended==="desktop"?`<em>${t("recommended")} · ${deviceLabel}</em>`:""}
      </button>
    </div>
    <p class="install-note">${t("openOnDevice")}</p>
  </div>`);
}
function openInstallGuide(target,{remote=false}={}){
  const env=installEnvironment();
  const isPhoneTarget=target==="phone";
  const title=isPhoneTarget?t("phoneGuideTitle"):t("desktopGuideTitle");
  const secureWarning=env.secure?"":`<div class="install-warning">${t("secureInstallWarning")}</div>`;
  let steps=[];
  if(remote){
    steps=isPhoneTarget
      ? (state.lang==="bn"?["ফোনের Chrome বা Safari-তে নিচের লিংকটি খুলুন।","ওয়েবসাইটে ‘অ্যাপ ইনস্টল করুন’ চাপুন।","‘ফোন বা ট্যাবলেটে’ বেছে নিন।"]:["Open the link below in Chrome or Safari on the phone.","Tap the website's Install app button.","Choose Phone or tablet."])
      : (state.lang==="bn"?["ল্যাপটপ বা ডেস্কটপের Chrome অথবা Edge-এ নিচের লিংকটি খুলুন।","ওয়েবসাইটে ‘অ্যাপ ইনস্টল করুন’ চাপুন।","‘ল্যাপটপ বা ডেস্কটপে’ বেছে নিন।"]:["Open the link below in Chrome or Edge on the computer.","Click the website's Install app button.","Choose Laptop or desktop."]);
  }else if(isPhoneTarget&&env.ios){
    steps=state.lang==="bn"?["Safari-তে ওয়েবসাইটটি খুলুন।","শেয়ার (Share) বাটন চাপুন।","হোম স্ক্রিনে যোগ করুন (Add to Home Screen) বেছে নিন।"]:["Open the website in Safari.","Tap Share.","Choose Add to Home Screen."];
  }else if(isPhoneTarget){
    steps=state.lang==="bn"?["Chrome-এর উপরের ⋮ মেনু খুলুন।","Install app অথবা Add to Home screen চাপুন।","ইনস্টল শেষ হলে ফোনের হোম স্ক্রিন থেকে অ্যাপটি খুলুন।"]:["Open Chrome's ⋮ menu.","Tap Install app or Add to Home screen.","When installation finishes, open the app from the home screen."];
  }else{
    steps=state.lang==="bn"?["Chrome বা Edge-এর ঠিকানার ঘরে ইনস্টল চিহ্নটি দেখুন।","চিহ্নটি না থাকলে ব্রাউজারের মেনু খুলুন।","Install Moner Kotha বেছে নিন।"]:["Look for the install icon in the Chrome or Edge address bar.","If it is not visible, open the browser menu.","Choose Install Moner Kotha."];
  }
  const remoteBlock=remote?`<div class="install-link-box"><code>${escapeHtml(installationUrl())}</code><button class="secondary-button" data-action="copy-install-link">${icon("copy")} ${t("copyLink")}</button></div>`:"";
  setModal(`${modalHeader(title)}<div class="modal-body install-guide">${secureWarning}
    <div class="install-app-preview"><span class="brand-logo-wrap"><img class="brand-logo" src="./assets/brand/logo-mark.png" alt="" /></span><div><strong>Moner Kotha</strong><small>${isPhoneTarget?t("installPhoneCopy"):t("installDesktopCopy")}</small></div></div>
    ${remoteBlock}<ol>${steps.map(step=>`<li>${escapeHtml(step)}</li>`).join("")}</ol>
    <button class="primary-button" style="width:100%" data-action="close-modal">${t("gotIt")}</button>
  </div>`);
}
async function chooseInstallTarget(target){
  if(platform.standalone){showToast(t("installed"));return}
  const env=installEnvironment();
  const matchesCurrentDevice=target==="phone"?env.handheld:!env.handheld;
  if(!matchesCurrentDevice){openInstallGuide(target,{remote:true});return}
  state.installTarget=target;
  store.set("install-target",target);
  applyDeviceLayout();
  closeModal();
  showToast(target==="phone"?t("phoneLayoutReady"):t("desktopLayoutReady"));
  const result=await pwa.promptInstall();
  if(!result.available){openInstallGuide(target);return}
  if(result.outcome==="dismissed")showToast(t("installLater"));
}
async function copyInstallLink(){
  const value=installationUrl();
  try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(value);
    else{
      const input=document.createElement("textarea");input.value=value;input.style.position="fixed";input.style.opacity="0";document.body.appendChild(input);input.select();document.execCommand("copy");input.remove();
    }
    showToast(t("linkCopied"));
  }catch{showToast(value)}
}
function handleInstall(){
  if(platform.standalone){showToast(t("installed"));return}
  openInstallChooser();
}

function exportLocalData(){
  const payload=store.exportData();
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=`moner-kotha-local-${new Date().toISOString().slice(0,10)}.json`;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function resetLocalData(){
  if(!confirm(t("resetConfirm")))return;
  try{
    identityCanSync=false;
    if(identitySnapshot.status==="authenticated")await clearUserAppData();
    store.clearAppData();
    location.reload();
  }catch(error){
    identityCanSync=identitySnapshot.status==="authenticated";
    showToast(state.lang==="bn"?"Cloud data মুছতে সমস্যা হয়েছে। আবার চেষ্টা করুন।":"Cloud data could not be cleared. Please try again.");
    console.warn("Profile reset failed",error);
  }
}
function setNetworkStatus(offline){
  document.body.classList.toggle("offline-mode",offline);
  const banner=$("#offlineBanner");if(banner)banner.hidden=!offline;
  const row=$("#networkStatus");row?.classList.toggle("offline",offline);
  const label=$("#networkStatus b");if(label)label.textContent=offline?t("offline"):t("online");
}
function showUpdateReady(apply){
  state.updateAction=apply;
  const banner=$("#updateBanner");if(banner){banner.hidden=false;banner.querySelector("span").textContent=t("updateReady");banner.querySelector("button").textContent=t("refreshNow");}
  showToast(t("updateReady"));
}
function openOnboarding(){
  if(store.get("onboarding-complete",false))return;
  setModal(`${modalHeader(state.lang==="bn"?"মনের কথায় স্বাগতম":"Welcome to Moner Kotha")}<div class="modal-body">
    <p style="color:var(--muted);font-size:12px">${state.lang==="bn"?"এই সেবাটি website বা app হিসেবে ব্যবহার করতে পারবেন। পরের ধাপে ব্যক্তিগত তথ্য ছাড়াই password profile অথবা guest mode বেছে নিতে পারবেন।":"Use this service as a website or app. Next, choose a password profile without personal details or continue as a guest."}</p>
    <div class="onboarding-list">
      <div class="onboarding-item"><span>${icon("lock")}</span><div><strong>${state.lang==="bn"?"আসল পরিচয় গোপন":"Your real identity stays private"}</strong><small>${state.lang==="bn"?"আসল নাম, ছবি বা যোগাযোগের তথ্য প্রকাশ করবেন না।":"Do not share real names, photos, or contact details."}</small></div></div>
      <div class="onboarding-item"><span>${icon("heart")}</span><div><strong>${state.lang==="bn"?"আগে শুনুন, পরে পরামর্শ":"Listen before giving advice"}</strong><small>${state.lang==="bn"?"বিচার বা চাপ দেবেন না—সহমর্মিতার সঙ্গে শুনুন।":"Do not judge or pressure anyone—listen with care."}</small></div></div>
      <div class="onboarding-item"><span>${icon("shield")}</span><div><strong>${state.lang==="bn"?"জরুরি অবস্থায় সরাসরি সাহায্য নিন":"This is not an emergency service"}</strong><small>${state.lang==="bn"?"তাৎক্ষণিক বিপদে ৯৯৯-এ কল করুন এবং কাছের কাউকে জানান।":"In immediate danger, call 999 and tell someone nearby."}</small></div></div>
    </div>
    <button class="primary-button" style="width:100%" data-action="finish-onboarding">${state.lang==="bn"?"বুঝেছি, শুরু করি":"I understand, continue"}</button>
  </div>`);
}

subscribeAdSettings(()=>{
  renderFeed();
  renderAdPlacements();
});
window.addEventListener("mk:ad-renderer-changed",()=>{
  renderFeed();
  renderAdPlacements();
});
subscribeAdminRuntime(current=>{
  const preferred=current?.settings?.site?.defaultLanguage;
  if(!store.has("lang")&&!["bn","en"].includes(new URLSearchParams(location.search).get("lang"))&&["bn","en"].includes(preferred)&&state.lang!==preferred){
    state.lang=preferred;store.set("lang",preferred);localizePage();return;
  }
  if(["video","islamic"].includes(state.feedMode)) renderFeed();
  renderAdPlacements();
});
window.addEventListener("mk:feature-blocked",()=>{});
adminRuntimePromise.catch(error=>console.warn("Admin runtime initialization failed",error));

const pwa=initPWA({
  onInstallAvailable:available=>{state.installAvailable=available;renderInstallButton();},
  onInstalled:()=>{state.pwaInstalled=true;store.set("pwa-installed",true);renderInstallButton();showToast(t("installed"));},
  onOfflineChange:setNetworkStatus,
  onUpdateReady:showUpdateReady,
  onError:error=>console.warn("PWA registration failed",error)
});

document.addEventListener("click",e=>{
  const target=e.target.closest("button,a,[data-action],[data-nav]");if(!target)return;
  if(!guardAdminAction(target)){e.preventDefault();showToast(state.lang==="bn"?"এই সুবিধাটি বর্তমানে বন্ধ আছে।":"This feature is currently unavailable.");return}
  const action=target.dataset.action;
  if(target.dataset.nav){e.preventDefault();navigate(target.dataset.nav);return}
  if(target.dataset.feed){state.feedMode=target.dataset.feed;state.shown=10;renderFeed();updateNav();return}
  if(target.dataset.islamicTab){state.islamicTab=target.dataset.islamicTab;store.set("islamic-tab",state.islamicTab);renderIslamicFeed();return}
  if(target.dataset.islamicMood){state.islamicMoodFilter=target.dataset.islamicMood;store.set("islamic-mood-filter",state.islamicMoodFilter);renderIslamicFeed();return}
  if(target.dataset.islamicLike){toggleIslamicLike(target.dataset.islamicLike);return}
  if(target.dataset.islamicLang){toggleIslamicLanguage(target.dataset.islamicLang);return}
  if(target.dataset.islamicComments){openComments(target.dataset.islamicComments,"islamic");return}
  if(target.dataset.islamicShare){shareIslamicContent(target.dataset.islamicShare);return}
  if(target.dataset.videoFormat){const section=target.dataset.videoSection==="islamic"?"islamic":"general";state.videoFormat[section]=target.dataset.videoFormat==="short"?"short":"video";store.set("video-format",state.videoFormat);section==="islamic"?renderIslamicFeed():renderVideoFeed();return}
  if(target.dataset.videoLike){toggleVideoLike(target.dataset.videoLike);return}
  if(target.dataset.videoPlay){const card=target.closest(".video-card");activateVideoCard(card,{muted:false,userInitiated:true});return}
  if(target.dataset.videoSound){const card=target.closest(".video-card");toggleVideoSound(card);return}
  if(target.dataset.videoLargeView){setVideoLargeView(true,state.activeVideoId||"");return}
  if(target.dataset.videoLargeCard){setVideoLargeView(true,target.dataset.videoLargeCard);return}
  if(target.dataset.speakArabic){speakArabic(target.dataset.speakArabic);return}
  if(target.dataset.checkinMood){selectPreferredMood(target.dataset.checkinMood);return}
  if(target.dataset.checkinModal){selectPreferredMood(target.dataset.checkinModal,{reopen:true});return}
  if(target.dataset.draftMood!==undefined){state.draftMood=target.dataset.draftMood==="__skip__"?"":target.dataset.draftMood;$$("[data-draft-mood]").forEach(x=>x.classList.toggle("active",x===target));const input=$("#customMoodInput");if(input)input.hidden=state.draftMood!=="other";return}
  if(target.dataset.draftNeed!==undefined){state.draftNeed=target.dataset.draftNeed==="__skip__"?"":target.dataset.draftNeed;$$("[data-draft-need]").forEach(x=>x.classList.toggle("active",x===target));const input=$("#customNeedInput");if(input)input.hidden=state.draftNeed!=="other";if(state.draftNeed==="safety"){closeModal();openSafety(true)}return}
  if(target.dataset.draftTopic){state.draftTopic=target.dataset.draftTopic;$$("[data-draft-topic]").forEach(x=>x.classList.toggle("active",x===target));const input=$("#customTopicInput");if(input)input.hidden=state.draftTopic!=="other";return}
  if(target.dataset.moment){openMoment(target.dataset.moment);return}
  if(target.dataset.momentMood){state.momentMoodId=target.dataset.momentMood;renderMomentMoodChoices();return}
  if(target.dataset.momentMode){state.momentMode=target.dataset.momentMode;$$(`[data-moment-mode]`).forEach(x=>x.classList.toggle("active",x===target));$("#momentTextPane").hidden=state.momentMode!=="text";$("#momentMoodPane").hidden=state.momentMode!=="mood";updateMomentPublishButton();return}
  if(target.dataset.momentReact){toggleMomentReaction(target.dataset.momentReact,target.dataset.momentReactionType||"care");return}
  if(target.dataset.momentComments){openComments(target.dataset.momentComments,"moment");return}
  if(target.dataset.commentReact){toggleCommentReaction(target.dataset.commentReact);return}
  if(target.dataset.editPost){editUserPost(target.dataset.editPost);return}
  if(target.dataset.deletePost){deleteUserPost(target.dataset.deletePost);return}
  if(target.dataset.filterFeed){state.feedMode=target.dataset.filterFeed;$$(`[data-filter-feed]`).forEach(x=>x.classList.toggle("active",x===target));return}
  if(target.dataset.react){toggleReaction(target.dataset.react);return}
  if(target.dataset.comments){closeDrawer();openComments(target.dataset.comments);return}
  if(target.dataset.save){toggleSave(target.dataset.save);return}
  if(target.dataset.share){sharePost(target.dataset.share);return}
  if(target.dataset.more){openPostMenu(target.dataset.more);return}
  if(target.dataset.report){openReport(target.dataset.report);return}
  if(target.dataset.follow){toggleFollow(target.dataset.follow);return}
  if(target.dataset.join){toggleJoin(target.dataset.join);return}
  if(target.dataset.quickReply!==undefined){$("#commentText").value=localText(supportTemplates[Number(target.dataset.quickReply)]);$("#commentText").focus();return}
  if(target.dataset.filterMood){state.moodFilter=target.dataset.filterMood;$$("[data-filter-mood]").forEach(x=>x.classList.toggle("active",x===target));return}
  if(target.dataset.filterTopic){state.topicFilter=target.dataset.filterTopic;$$("[data-filter-topic]").forEach(x=>x.classList.toggle("active",x===target));return}
  if(target.dataset.sound){playSound(target.dataset.sound);return}
  switch(action){
    case"close-video-large":setVideoLargeView(false);break;
    case"compose":openComposer();break;
    case"compose-moment":openMomentComposer();break;
    case"install":handleInstall();break;
    case"install-phone":chooseInstallTarget("phone");break;
    case"install-desktop":chooseInstallTarget("desktop");break;
    case"copy-install-link":copyInstallLink();break;
    case"retry-online":location.reload();break;
    case"apply-update":state.updateAction?.();break;
    case"export-data":exportLocalData();break;
    case"reset-data":resetLocalData();break;
    case"finish-onboarding":store.set("onboarding-complete",true);closeModal();setTimeout(()=>openIdentityGate(),80);break;
    case"notifications":openNotifications();break;
    case"enable-notifications":enableNotifications();break;
    case"test-notification":testNotification();break;
    case"theme":toggleTheme();break;
    case"language":toggleLanguage();break;
    case"profile":openProfile();break;
    case"identity-open":openIdentityGate(true);break;
    case"identity-continue":handleIdentityContinue();break;
    case"identity-skip":store.set("identity-choice","guest");closeModal();showToast(state.lang==="bn"?"Guest mode চালু আছে।":"Guest mode is active.");break;
    case"identity-toggle-password":{const input=$("#identityPassword");if(input)input.type=input.type==="password"?"text":"password";break;}
    case"identity-signout":handleIdentitySignOut();break;
    case"profile-posts":openProfilePosts();break;
    case"circles-page":openCircles();break;
    case"back-page":closeModal();break;
    case"app-menu":openAppMenu();break;
    case"contact-us":closeDrawer();openContact();break;
    case"cookie-settings":closeDrawer();openCookieSettings();break;
    case"save-cookie-settings":saveCookieSettings();break;
    case"share-site":openShareCenter();break;
    case"share-native":nativeShareCurrent();break;
    case"share-whatsapp":directShare("whatsapp");break;
    case"share-facebook":directShare("facebook");break;
    case"share-x":directShare("x");break;
    case"share-email":directShare("email");break;
    case"copy-share-caption":copyShareCaption();break;
    case"download-share-card":downloadShareCard();break;
    case"safety":openSafety();break;
    case"checkin":openCheckin();break;
    case"save-checkin":saveCheckin();break;
    case"save-checkin-modal":saveCheckin(true);break;
    case"next-quote":state.quoteIndex=(state.quoteIndex+1)%quotes.length;store.set("quote",state.quoteIndex);renderQuote();break;
    case"new-alias":changeAlias();break;
    case"save-display-name":saveDisplayName();break;
    case"focus-search":{const search=$("#globalSearch");search.style.display="flex";search.focus();break;}
    case"filter":openFilters();break;
    case"close-modal":closeModal();break;
    case"close-drawer":closeDrawer();break;
    case"submit-post":submitPost();break;
    case"submit-moment":submitMoment();break;
    case"submit-comment":submitComment();break;
    case"submit-report":closeModal();showToast(t("reportSaved"));break;
    case"apply-filters":closeDrawer();state.shown=10;renderFeed();updateNav();break;
    case"clear-filters":state.moodFilter="all";state.topicFilter="all";closeDrawer();renderFeed();updateNav();break;
    case"toggle-motion":state.motion=!state.motion;store.set("motion",state.motion?"on":"off");closeModal();localizePage();break;
    case"toggle-breath":toggleBreath();break;
    case"next-ground":state.groundingStep=(state.groundingStep+1)%5;$("#groundStep").textContent=groundingText(state.groundingStep);break;
    case"start-reset":startResetTimer();break;
    case"next-body-scan":state.bodyScanStep=(state.bodyScanStep+1)%6;$("#bodyScanStep").textContent=bodyScanText(state.bodyScanStep);break;
    case"next-kindness":state.kindnessIndex=(state.kindnessIndex+1)%5;$("#kindnessPrompt").textContent=kindnessText(state.kindnessIndex);break;
    case"release-thought":{
      const el=$("#releaseText"),text=el.value.trim();if(!text)return;if(containsUrgentRisk(text)){closeModal();openSafety(true);return}
      el.style.transition="transform .8s var(--ease),opacity .8s";el.style.transform="translateY(-24px) rotate(-2deg) scale(.95)";el.style.opacity="0";
      setTimeout(()=>{el.value="";el.style.transform="";el.style.opacity="1";showToast(state.lang==="bn"?"লেখাটি পর্দা থেকে সরিয়ে দেওয়া হয়েছে।":"The thought was removed from the screen.")},850);break;
    }
    case"copy-safety-message":{
      const msg=state.lang==="bn"?"আমি এখন নিরাপদ বোধ করছি না। দয়া করে আমার কাছে আসুন, আমার সঙ্গে থাকুন এবং প্রয়োজন হলে ৯৯৯-এ কল করতে সাহায্য করুন।":"I do not feel safe right now. Please come stay with me and help me call emergency services if needed.";
      navigator.clipboard?.writeText(msg);showToast(state.lang==="bn"?"কাছের কাউকে পাঠানোর বার্তাটি কপি হয়েছে।":"A message for someone nearby was copied.");break;
    }
  }
});

document.addEventListener("input",e=>{
  if(e.target.id==="momentMoodSearch"){state.momentSearch=e.target.value;renderMomentMoodChoices();}
  if(e.target.id==="momentTextInput")updateMomentPublishButton();
  if(e.target.id==="globalSearch"){
    state.query=e.target.value.trim();state.shown=10;clearTimeout(state.searchTimer);
    state.searchTimer=setTimeout(()=>{renderFeed();updateNav()},120);
  }
  if(e.target.id==="composeText"){
    state.draftText=e.target.value;clearTimeout(state.draftTimer);state.draftTimer=setTimeout(()=>store.set("draft-text",state.draftText),250);
    $("#composeCount").textContent=displayNumber(e.target.value.length);
    $("#privacyAlert").hidden=!containsPrivateInfo(e.target.value);
    const whispers=state.lang==="bn"?["সময় নিন।","আপনার অনুভূতি গুরুত্বপূর্ণ।","সবকিছু নিখুঁত করে বলতে হবে না।","একটি সত্য বাক্যই যথেষ্ট।"]:["Take your time.","Your feelings matter.","It does not need to be perfectly explained.","One honest sentence is enough."];
    $("#composeWhisper").textContent=whispers[Math.floor(e.target.value.length/35)%whispers.length];
  }
});

document.addEventListener("keydown",e=>{
  if(e.key==="Enter" && e.target?.id==="identityPassword"){e.preventDefault();handleIdentityContinue();return}
  if(e.key==="Enter" && e.target?.id==="displayNameInput"){e.preventDefault();saveDisplayName();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#globalSearch")?.focus()}
  const activeLayer=!$("#modalLayer").hidden?$("#modalCard"):!$("#drawerLayer").hidden?$("#sideDrawer"):null;
  if(e.key==="Tab"&&activeLayer){
    const focusable=$$(FOCUSABLE_SELECTOR,activeLayer).filter(el=>el.offsetParent!==null);
    if(focusable.length){const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  }
  if(e.key==="Escape"){if(state.videoLargeView)setVideoLargeView(false);else if(!$("#modalLayer").hidden)closeModal();else if(!$("#drawerLayer").hidden)closeDrawer()}
});

$("#loadMore").addEventListener("click",()=>{state.shown+=10;renderFeed()});
function completeAppStartup(){
  if(window.__MK_APP_READY__)return;
  window.__MK_APP_READY__=true;
  window.__MK_HIDE_SPLASH__?.();
  const startupError=$("#startupError");if(startupError)startupError.hidden=true;
  const startWelcomeFlow=()=>setTimeout(()=>{if(store.get("onboarding-complete",false))openIdentityGate();else openOnboarding()},420);
  if(document.readyState==="complete")startWelcomeFlow();
  else window.addEventListener("load",startWelcomeFlow,{once:true});
}
window.addEventListener("mk:storage-error",()=>showToast(state.lang==="bn"?"এই ডিভাইসে তথ্য সংরক্ষণ করা যাচ্ছে না।":"Unable to save app data on this device."));
store.subscribe(message=>{if(message?.type==="reset")location.reload()});
window.addEventListener("error",event=>console.error("Application error",event.error||event.message));
window.addEventListener("unhandledrejection",event=>console.error("Unhandled promise",event.reason));

cleanupExpiredLocalContent();setInterval(()=>{cleanupExpiredLocalContent();renderCircleStories();renderFeed();},5*60*1000);

const launchParams=new URLSearchParams(location.search);
const requestedView=launchParams.get("view");
const requestedPost=launchParams.get("post");
const sharedText=[launchParams.get("title"),launchParams.get("text"),launchParams.get("url")].filter(Boolean).join("\n").slice(0,4000);
if(sharedText){state.draftText=sharedText;setTimeout(openComposer,650)}
else if(requestedPost)setTimeout(()=>openComments(requestedPost),700);
else if(requestedView==="compose")setTimeout(openComposer,650);
else if(["saved","explore"].includes(requestedView))state.view=requestedView;
else if(requestedView==="calm")setTimeout(openCalm,650);

renderIcons();
localizePage();
completeAppStartup();
setNetworkStatus(!navigator.onLine);
trackPage(location.href,"app");
syncVideoHealth();
