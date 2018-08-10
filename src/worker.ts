declare var self: DedicatedWorkerGlobalScope;

import * as messages from './messages';

onmessage = (e: MessageEvent) => {
  if (messages.isLoadMessage(e.data)) {
    load(e.data.url);
  }
};

async function load(url: string) {
  self.postMessage(messages.loadStarted(url));

  try {
    const response = await fetch(url);

    const contentLength = response.headers.get('content-length');
    const total: number | null = contentLength
      ? parseInt(contentLength, 10)
      : null;

    if (!response.body) {
      // No ReadableStream support -- let the caller know not to expect any
      // useful progress indication
      self.postMessage(messages.loadProgress(null, total));

      const text = await response.text();
    } else {
      // Let the caller know the total response size.
      self.postMessage(messages.loadProgress(0, total));

      consume(response.body.getReader());
    }
  } catch (e) {
    self.postMessage(messages.loadError(e));
  }
}

function consume(reader: ReadableStreamReader) {
  let total: number = 0;
  return pump();

  async function pump(): Promise<void> {
    const { done, value } = await reader.read();
    if (done) {
      return;
    }

    total += value.byteLength;
    return pump();
  }
}
