interface ExtensionViewActionAsyncEvent {
  'vscode:get-db-path': () => string | null;
  'vscode:uninstall-extension': (id: string) => void;
  'vscode:list-extensions': () => import('../src/interfaces/extension.interface').InstalledExtension[];
}

interface ExtensionViewActionSyncEvent {
  'vscode:open-path': [path: string];
}
