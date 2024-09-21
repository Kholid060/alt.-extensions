import { useEffect, useRef, useState } from 'react';
import { debounce } from './utils/helper';
import {
  _extension,
  UiIcons,
  UiList,
  UiListItem,
  UiText,
} from '@altdot/extension';
import Mexp from 'math-expression-evaluator';

const mexp = new Mexp();

_extension.ui.searchPanel.updatePlaceholder('Math expression...');

function Calculator() {
  const emptyValue = useRef(true);

  const [result, setResult] = useState<{ value: string; isError: boolean }>({
    value: '',
    isError: false,
  });

  useEffect(
    () =>
      _extension.ui.searchPanel.onChanged.addListener(
        debounce((value) => {
          if (!value.trim()) {
            emptyValue.current = true;
            setResult({ isError: false, value: '' });
            return;
          }

          emptyValue.current = false;

          try {
            setResult({
              isError: false,
              value: mexp.eval(value, []).toString(),
            });
          } catch (error) {
            if (error instanceof Error) {
              setResult({ isError: true, value: error.message });
            }
            console.error(error);
          }
        }, 500),
      ),
    [],
  );

  if (result.isError) {
    return (
      <div className="py-4 px-6">
        <UiText color="destructive">Invalid Math Expression:</UiText>
        <div className="bg-card rounded-md p-2" style={{ minHeight: '6rem' }}>
          <UiText variant="code" color="muted">
            {result.value}
          </UiText>
        </div>
      </div>
    );
  }

  if (!result.value && emptyValue.current) {
    return (
      <div className="px-6 py-4 text-center">
        <p>Write Math expression</p>
        <UiText color="muted" variant="body-small">
          For example: 2*25/10
        </UiText>
      </div>
    );
  }

  const resultItems: UiListItem[] = [
    {
      icon: <UiList.Icon icon={UiIcons.Calculator} />,
      title: result.value,
      value: 'result',
      onSelected() {
        _extension.clipboard.write('text', result.value).then(() => {
          _extension.ui.showToast({
            title: 'Copied to clipboard',
          });
        });
      },
      description: 'Copy to clipboard',
      actions: [
        {
          type: 'button',
          value: 'paste',
          title: 'Paste result',
          icon: UiIcons.Clipboard,
          onAction() {
            _extension.clipboard.paste(result.value);
          },
        },
      ],
    },
    {
      title: 'See Supported Symbols',
      onSelected() {
        _extension.shell.openURL(
          'https://github.com/bugwheels94/math-expression-evaluator/?tab=readme-ov-file#supported-symbols',
        );
      },
      icon: <UiList.Icon icon={UiIcons.Link} />,
      value: 'symbols',
    },
  ];

  return (
    <div className="p-2">
      <UiList shouldFilter={false} items={resultItems} />
    </div>
  );
}

export default Calculator;
