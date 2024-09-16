import { _extension } from '@altdot/extension';
import { ExtensionConfig } from '../interface/extension.interface';

const action: Record<
  ExtensionConfig['fileAction'],
  (url: string) => void | Promise<void>
> = {
  async 'copy-clipboard'(url) {
    await _extension.clipboard.write('text', url);
    _extension.ui.showToast({
      title: 'URL copied to the clipboard',
    });
  },
  async 'open-in-browser'(url) {
    await _extension.shell.openURL(url);
  },
  async 'copy-open-in-browser'(url) {
    await this['copy-clipboard'](url);
    await this['open-in-browser'](url);
  },
};

export default async function fileAction(url: string) {
  const config =
    await _extension.runtime.config.getValues<ExtensionConfig>('extension');
  action[config.fileAction ?? 'copy-clipboard'](url);
}
