interface ExtensionViewActionAsyncEvent {
  'async-events': () => string;
}

interface ExtensionViewActionSyncEvent {
  'sync-events': [param: string];
}
