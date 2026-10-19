// Runs after every successful deploy and tells IndexNow (Bing, Yandex, Seznam,
// Naver, Yep…) which pages are new, changed or removed, so they recrawl them
// within minutes instead of waiting for their next scheduled crawl.
//
// How it decides what to send: it reads the live sitemap, compares each URL's
// <lastmod> with the copy it saved after the last successful submission
// (Netlify Blobs store "indexnow"), and submits only the differences.
// <lastmod> comes from git history (tools/sitemap-lastmod.mjs), so a deploy
// that only touches, say, the FAQ submits just /faq.
//
// Logs: Netlify → Logs → Functions → indexnow.

import type { DeploySucceededEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { INDEXNOW_KEY, SITE, KEY_LOCATION, INDEXNOW_ENDPOINT } from '../../indexnow.config.mjs';
import {
  readSitemap,
  diffSitemaps,
  recentlyModified,
  keyFileIsLive,
  submit,
} from '../lib/indexnow-core.mjs';

const SNAPSHOT_KEY = 'sitemap-snapshot';

async function openStore() {
  try {
    return getStore({ name: 'indexnow', consistency: 'strong' });
  } catch (err) {
    console.warn(`IndexNow: Blobs unavailable (${(err as Error).message}); using lastmod window instead.`);
    return null;
  }
}

export default {
  async deploySucceeded(event: DeploySucceededEvent) {
    const { deploy } = event;

    // Only production is public. Deploy previews and branch deploys live on
    // other hostnames, which IndexNow would reject anyway.
    if (deploy.context !== 'production') {
      console.log(`IndexNow: skipped (${deploy.context} deploy)`);
      return;
    }

    const current = await readSitemap(SITE, { cacheBust: deploy.id });
    const store = await openStore();
    let previous: Record<string, string | null> | null = null;
    if (store) {
      try {
        previous = (await store.get(SNAPSHOT_KEY, { type: 'json' })) ?? null;
      } catch (err) {
        console.warn(`IndexNow: couldn't read snapshot (${(err as Error).message})`);
      }
    }

    let urls: string[];
    if (store) {
      const { changed, removed, firstRun } = diffSitemaps(current, previous);
      urls = [...changed, ...removed];
      console.log(
        `IndexNow: ${firstRun ? 'first run, submitting all' : `${changed.length} new/changed, ${removed.length} removed`}`,
      );
    } else {
      urls = recentlyModified(current, 48);
    }

    if (!urls.length) {
      console.log('IndexNow: nothing new or changed');
      return;
    }

    if (!(await keyFileIsLive({ keyLocation: KEY_LOCATION, key: INDEXNOW_KEY }))) {
      console.error(`IndexNow: ${KEY_LOCATION} isn't serving the key; not submitting.`);
      return;
    }

    const { ok } = await submit({
      endpoint: INDEXNOW_ENDPOINT,
      site: SITE,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urls,
    });
    console.log('IndexNow URLs:', urls);

    // Save the snapshot only when every batch was accepted, so a failed run is
    // retried in full on the next deploy.
    if (ok && store) await store.setJSON(SNAPSHOT_KEY, current);
  },
};
