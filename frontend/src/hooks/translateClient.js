import apiClient from "./apiClient";

/**
 * Database translation requests, batched.
 *
 * Every translatable string on a page used to be its own POST to
 * /api/translate. A single home page renders around forty of them, which is
 * most of the endpoint's fifteen-minute budget spent on one page view, and it
 * left later pages untranslated.
 *
 * Three things happen here instead:
 *
 *  - Requests raised in the same tick are collected into one call. The upstream
 *    translator accepts an array, so forty strings cost one request.
 *  - Results are cached per string, so revisiting a page costs nothing.
 *  - Failures are cached too. They used to retry forever: the effect depended on
 *    the translated value, so a failed request reset the state, which re-ran the
 *    effect, which requested again. A page that could not be translated once
 *    stays quiet instead of hammering the endpoint until the rate limit shut.
 */

const results = new Map();
const pending = new Map();
let queue = [];
let flushHandle = null;

// Collecting across a frame is enough to gather every card on the page, while
// still letting a single string resolve without waiting on the timer.
const FLUSH_DELAY_MS = 16;

const flush = () => {
  flushHandle = null;
  if (queue.length === 0) return;

  const batch = queue;
  queue = [];

  // The upstream translator applies one format per request, so group by it.
  const groups = new Map();
  for (const item of batch) {
    const list = groups.get(item.format) || [];
    list.push(item);
    groups.set(item.format, list);
  }

  for (const [format, items] of groups) {
    const unique = [];
    const seen = new Set();
    for (const item of items) {
      if (!seen.has(item.text)) {
        seen.add(item.text);
        unique.push(item);
      }
    }

    apiClient
      .post("/api/translate", {
        texts: unique.map((item) => item.text),
        target: items[0].target,
        source: "id",
        format,
      })
      .then((response) => {
        const translated = response.data.translatedTexts || [];
        unique.forEach((item, index) => {
          // An empty result means the translator had nothing to give. Fall back
          // to the original rather than leaving the string undefined.
          const value = translated[index] || item.text;
          results.set(item.key, value);
          for (const resolve of pending.get(item.key) || []) resolve(value);
          pending.delete(item.key);
        });
      })
      .catch((error) => {
        console.error("Translation API error:", error);
        for (const item of unique) {
          // Cache the fallback so this string is not requested again this
          // session. Without it the failure retries indefinitely.
          results.set(item.key, item.text);
          for (const resolve of pending.get(item.key) || []) resolve(item.text);
          pending.delete(item.key);
        }
      });
  }
};

const schedule = () => {
  if (flushHandle !== null) return;
  flushHandle = setTimeout(flush, FLUSH_DELAY_MS);
};

const requestTranslation = (text, target, isHTML) => {
  const format = isHTML ? "html" : "text";
  const key = `${text}|${target}|${format}`;

  if (results.has(key)) {
    return Promise.resolve(results.get(key));
  }

  const alreadyWaiting = pending.get(key);
  if (alreadyWaiting) {
    return new Promise((resolve) => alreadyWaiting.push(resolve));
  }

  const waiters = [];
  pending.set(key, waiters);

  queue.push({ key, text, target, format });
  schedule();

  return new Promise((resolve) => waiters.push(resolve));
};

export default requestTranslation;
