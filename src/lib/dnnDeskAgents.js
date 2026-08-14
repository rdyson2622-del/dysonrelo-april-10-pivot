/**
 * DNN Desk — lead agent + specialist assistants for morning news production.
 * Source of truth for /admin/dnn/desk-org and coordination surfaces.
 */

export const DNN_SOCIAL_TARGETS = [
  { id: 'linkedin', label: 'LinkedIn', mode: 'api', specialist: 'herald' },
  { id: 'facebook', label: 'Facebook', mode: 'api', specialist: 'herald' },
  { id: 'instagram', label: 'Instagram Reels', mode: 'api', specialist: 'herald' },
  { id: 'youtube', label: 'YouTube', mode: 'download', specialist: 'herald' },
  { id: 'tiktok', label: 'TikTok', mode: 'download', specialist: 'herald' },
  { id: 'x', label: 'X (Twitter)', mode: 'download', specialist: 'herald' },
  { id: 'dnn_news', label: 'DNN News (1dnn.com)', mode: 'in_app', specialist: 'signal' },
];

export const DNN_DESK_LEAD = {
  id: 'conductor',
  name: 'Conductor',
  title: 'DNN Desk Lead',
  role: 'Workflow Orchestrator',
  color: '#FF1493',
  owns: 'End-to-end morning run: research → script → bake MP4 → 7-site distribution',
  surfaces: ['/admin/dnn/desk-org', '/admin/dnn/show-pipeline', '/admin/site-coordination'],
};

export const DNN_DESK_SPECIALISTS = [
  {
    id: 'pulse',
    name: 'Pulse',
    title: 'Market Intelligence',
    stage: '1 · National sources',
    color: '#20B820',
    owns: 'Pull and white-label national real-estate sources into DNN voice',
    surfaces: ['/admin/dnn/news-feed', '/admin/dnn/market-data'],
    functionHint: 'dnnNationalSourcePull',
  },
  {
    id: 'scout',
    name: 'Scout',
    title: 'Story Selection',
    stage: '2 · Select stories',
    color: '#4169E1',
    owns: 'Score and select the morning show stories',
    surfaces: ['/admin/dnn/daily-library', '/admin/dnn/show-pipeline'],
    functionHint: 'dnnSelectBroadcastStories',
  },
  {
    id: 'composer',
    name: 'Composer',
    title: 'Script & CTAs',
    stage: '3 · Parameterised script',
    color: '#20B2AA',
    owns: 'Intro / content / outro scripts, whiteboard bullets, opening & closing CTAs',
    surfaces: ['/admin/dnn/daily-library', '/admin/dnn/script-studio', '/admin/dnn/script-review'],
    functionHint: 'BroadcastTemplate + Daily News Library',
  },
  {
    id: 'charlie',
    name: 'Charlie',
    title: 'On-Air Anchor',
    stage: '4 · Voice (open/close)',
    color: '#B8860B',
    owns: 'Charlie Simmons news-desk voice via Google TTS',
    surfaces: ['/admin/dnn/in-house-creative', '/chat'],
    functionHint: 'charlieSpeak speaker=charlie',
  },
  {
    id: 'signal',
    name: 'Signal',
    title: 'Studio & MP4 Bake',
    stage: '5 · Assemble + bake',
    color: '#FF6347',
    owns: 'Owned studio assembly and usable MP4 (compositedVideoUrl) for social',
    surfaces: ['/admin/dnn/in-house-creative', '/broadcast-show'],
    functionHint: 'bakeInHouseShow → UploadFile',
  },
  {
    id: 'herald',
    name: 'Herald',
    title: 'News & Distribution',
    stage: '6 · Seven sites',
    color: '#22C55E',
    owns: 'Post finished MP4 to LinkedIn/Facebook/Instagram; stage YT/TikTok/X downloads',
    surfaces: ['/admin/social-launch', '/admin/dnn/show-performance'],
    functionHint: 'dnnSocialPostCore / dnnBroadcastSocialPost',
  },
  {
    id: 'emissary',
    name: 'Emissary',
    title: 'Email Intelligence',
    stage: '7 · Subscriber blast',
    color: '#FFB6C1',
    owns: 'Morning email / audience blast after MP4 is ready',
    surfaces: ['/admin/dnn/communications', '/admin/dnn/subscribers'],
    functionHint: 'dnnMorningEmailBlast',
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    title: 'Ops & Failures',
    stage: 'Watchdog',
    color: '#DAA520',
    owns: 'Credits, failed bakes, render alerts — escalate to Conductor',
    surfaces: ['/admin/heygen-credits', '/admin/production-dashboard'],
    functionHint: 'pipelineCreditsMonitor / dnnBroadcastFailAlert',
  },
];

export const DNN_DESK_ROSTER = [DNN_DESK_LEAD, ...DNN_DESK_SPECIALISTS];
