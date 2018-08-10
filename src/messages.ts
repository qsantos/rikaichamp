const getMessageType = (e: any): string => {
  return typeof e === 'object' && typeof e.type === 'string' ? e.type : '';
};

interface LoadMessage {
  type: 'load';
  url: string;
}

export const load = (url: string): LoadMessage => ({
  type: 'load',
  url,
});

export function isLoadMessage(e: any): e is LoadMessage {
  return getMessageType(e) === 'load';
}

interface LoadStartedMessage {
  type: 'load-started';
  url: string;
}

export const loadStarted = (url: string): LoadStartedMessage => ({
  type: 'load-started',
  url,
});

interface LoadProgressMessage {
  type: 'load-progress';
  // 'null' means indeterminate
  bytes: number | null;
  total: number | null;
}

export const loadProgress = (
  bytes: number | null,
  total: number | null
): LoadProgressMessage => ({
  type: 'load-progress',
  bytes,
  total,
});

interface LoadErrorMessage {
  type: 'load-error';
  error: any;
}

export const loadError = (error: any): LoadErrorMessage => ({
  type: 'load-error',
  error,
});
