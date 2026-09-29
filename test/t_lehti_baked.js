// over http the paper comes baked from lehti/lehti.json (not laid out in the browser); the baked pages equal a live layout; a wrong key falls back to the live one
lehtiFetch(); for (let i = 0; i < 100 && !PAPER.pages.length; i++) await new Promise(r => setTimeout(r, 50));
const src = PAPER.src, n = PAPER.pages.length, baked = PAPER.pages.slice(); const live = lhPlan();
const same = live.length === baked.length && live.every((p, i) => p === baked[i]);
PAPER.pages = []; const k0 = lhKey; lhKey = () => 'x'; lehtiFetch(); for (let i = 0; i < 100 && !PAPER.pages.length; i++) await new Promise(r => setTimeout(r, 50)); lhKey = k0;
return { src, pages: n, sameAsLive: same, staleKeySrc: PAPER.src, miniReady: document.getElementById('lehti-mini').classList.contains('ready') };
