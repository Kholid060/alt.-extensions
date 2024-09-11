interface ExtensionViewActionAsyncEvent {
  'process:get-all': () => import('../src/interfaces/process.interface').ProcessItem[];
}

interface ExtensionViewActionSyncEvent {
  'process:kill': [processName: string];
}
