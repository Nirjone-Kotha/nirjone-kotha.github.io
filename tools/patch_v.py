import re

FILE = r'D:\Project\Sad Mood\nirjone-kotha\assets\js\app.js'

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

print(f'File: {len(content)} bytes')

# 1. Remove moodPriority from updateNav
idx_start = content.find('const preferred=effectivePreferredMood();const hasMoodPriority=')
idx_end = content.find('\n  }', content.find('if(hasMoodPriority)parts.push')) + 4

old_block = content[idx_start:idx_end]
new_block = (
    'const specialtyFeed=["islamic","video"].includes(state.feedMode);\n'
    '  $("#activeFilterBar").hidden=specialtyFeed || (state.moodFilter==="all"&&state.topicFilter==="all"&&!state.query);\n'
    '  if(!$("#activeFilterBar").hidden){\n'
    '    const parts=[];\n'
    '    if(state.moodFilter!=="all")parts.push(moodName(state.moodFilter));\n'
    '    if(state.topicFilter!=="all")parts.push(topicName(state.topicFilter));\n'
    '    if(state.query)parts.push(`\u201c${state.query}\u201d`);\n'
    '    $("#activeFilterBar").textContent=parts.join(" \u00b7 ");\n'
    '  }'
)
content = content[:idx_start] + new_block + content[idx_end:]
print('OK 1: Removed Your mood first banner')

# 2. Fix video comments - allow fallback when video not found
old_resolve = '    const item=allVideos.find(x=>String(x.id)===String(id));if(!item)return null;'
new_resolve = '    const item=allVideos.find(x=>String(x.id)===String(id));if(!item)return {id:String(id),avatar:"\U0001f3a8",name:"Video",time:"YouTube",text:"Video",mood:"other"};'
if old_resolve in content:
    content = content.replace(old_resolve, new_resolve, 1)
    print('OK 2: Fixed video comment fallback')
else:
    print('FAIL 2: resolveCommentSubject block not found')

# 3. Replace renderVideoCard with compact modern version (no emojis in Python string - use escaped)
rvc_pattern = r'function renderVideoCard\(item\)\{[\s\S]*?return article;\n\}'
m = re.search(rvc_pattern, content)
if m:
    # Build the new renderVideoCard carefully - use chr() for special chars
    sound_icon = '\U0001f50a'  # speaker emoji
    play_icon = '\u25b6'  # play triangle
    shor = '\u09b6\u09b0\u09cd\u099f\u09b8'  # Shorts in Bengali
    vid = '\u09ad\u09bf\u09a1\u09bf\u0993'  # Video in Bengali
    ready = '\u09aa\u09cd\u09b0\u09b8\u09cd\u09a4\u09c1\u09a4'  # Ready in Bengali
    like_bn = '\u09b2\u09be\u0987\u0995'  # Like in Bengali
    sym_bn = '\u09b8\u09b9\u09ae\u09b0\u09cd\u09ae\u09bf\u09a4\u09be'  # Sympathy in Bengali
    
    new_rvc = (
        'function renderVideoCard(item){\n'
        '  const liked=Boolean(state.videoLikes[String(item.id)]),portrait=item.aspect==="portrait"||item.contentType==="short";\n'
        '  const commentCount=commentBucket("video",item.id).length;\n'
        '  const likeCount=contentLikeCount(item,state.videoLikes);\n'
        '  const article=document.createElement("article");\n'
        '  article.className=`post-card video-card social-content-card ${portrait?"video-short":"video-landscape"}`;\n'
        '  article.dataset.videoId=String(item.id);article.dataset.youtubeId=item.youtubeId;article.dataset.videoCap=String(item.playbackCapSeconds||900);\n'
        '  const titleText=escapeHtml(state.lang==="bn"?(item.titleBn||item.title):item.title);\n'
        f'  const metaText=`${{escapeHtml(item.channelTitle||"YouTube")}} \u00b7 ${{durationLabel(item.durationSeconds)}} \u00b7 ${{item.contentType==="short"?(state.lang==="bn"?"{shor}":"Shorts"):(state.lang==="bn"?"{vid}":"Video")}}`;\n'
        '  article.innerHTML=`<div class="youtube-stage ${portrait?"portrait":"landscape"}" data-video-stage="${escapeHtml(String(item.id))}"><div class="youtube-player-host"><div data-youtube-player-host></div></div>'
        '<img loading="lazy" decoding="async" width="480" height="270" src="${escapeHtml(item.thumbnailUrl)}" alt="${escapeHtml(item.title)} thumbnail">'
        '<button class="video-play-button" data-video-play="${escapeHtml(String(item.id))}" aria-label="${escapeHtml(t(\\"playVideo\\"))}">${icon("play")||"' + play_icon + '"}<span>${t("playVideo")}</span></button>'
        '<button class="video-sound-button" type="button" data-video-sound="${escapeHtml(String(item.id))}" data-sound-on-label="${escapeHtml(t(\\"soundOn\\"))}" data-sound-off-label="${escapeHtml(t(\\"soundOff\\"))}" aria-label="${escapeHtml(t(\\"soundOff\\""))}">'
        f'<span class="video-sound-icon" aria-hidden="true">{sound_icon}</span><span class="video-sound-label">${{t("soundOff")}}</span></button>'
        f'<span class="video-ready-label">${{state.lang==="bn"?"{ready}":"Ready"}}</span>'
        '<div class="video-overlay-info"><div class="video-overlay-meta">${metaText}</div><div class="video-overlay-title">${titleText}</div></div></div>'
        f'<div class="video-compact-bar"><button class="video-compact-action ${{liked?"reacted":""}}" data-video-like="${{escapeHtml(String(item.id))}}" title="${{state.lang==="bn"?"{like_bn}":"Like"}}">${{icon("heart")}}<span>${{displayNumber(likeCount)}}</span></button>'
        f'<button class="video-compact-action" data-video-comment="${{escapeHtml(String(item.id))}}" title="${{state.lang==="bn"?"{sym_bn}":"Sympathy"}}">${{icon("comment")}}<span>${{commentCount>0?displayNumber(commentCount):""}}</span></button>'
        '<span class="video-compact-spacer"></span>'
        '<button class="video-compact-expand" type="button" data-video-large-card="${escapeHtml(String(item.id))}" aria-label="${escapeHtml(t(\\"largeView\\"))}">${icon("expand")}</button></div>`;\n'
        '  return article;\n'
        '}'
    )
    content = content[:m.start()] + new_rvc + content[m.end():]
    print('OK 3: Replaced renderVideoCard with compact modern version')
else:
    print('FAIL 3: renderVideoCard not found')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)
print('DONE!')
