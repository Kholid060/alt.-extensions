import {
  _extension,
  UiIcons,
  UiList,
  UiListItem,
  UiText,
} from '@altdot/extension';
import { useEffect, useState } from 'react';
import { debounce } from './utils/helper';
import convertUnitValue from './utils/convertUnitValue';

_extension.ui.searchPanel.updatePlaceholder('10 kg to g');

function UnitConverter() {
  const [errorMessage, setErrorMessage] = useState('');
  const [convertedValues, setConvertedValues] = useState<UiListItem[]>([]);

  useEffect(
    () =>
      _extension.ui.searchPanel.onChanged.addListener(
        debounce((value) => {
          try {
            if (!value.trim()) {
              setErrorMessage('');
              setConvertedValues([]);
              return;
            }

            const result = convertUnitValue(value);

            const toUnits = result.toUnit
              ? [result.toUnit]
              : result.converter.possibilities();

            const fromUnit = result.converter.describe(result.fromUnit);
            setConvertedValues(
              toUnits.reduce<UiListItem[]>((acc, unit) => {
                if (result.fromUnit === unit) return acc;

                const convertedValue = result.converter.to(unit).toString();

                acc.push({
                  actions: [
                    {
                      onAction() {
                        _extension.clipboard.paste(convertedValue);
                      },
                      type: 'button',
                      value: 'paste',
                      title: 'Paste value',
                      icon: UiIcons.Clipboard,
                    },
                  ],
                  onSelected() {
                    _extension.clipboard
                      .write('text', convertedValue)
                      .then(() => {
                        _extension.ui.showToast({
                          title: 'Copied to clipboard',
                        });
                      });
                  },
                  value: unit,
                  title: `${convertedValue} ${unit}`,
                  icon: <UiList.Icon icon={UiIcons.Ruler} />,
                  description: `${fromUnit.singular} -> ${result.converter.describe(unit).singular}`,
                });

                return acc;
              }, []),
            );
            setErrorMessage('');
          } catch (error) {
            if (error instanceof Error) {
              setErrorMessage(error.message);
            }
            console.error(error);
          }
        }, 500),
      ),
    [],
  );

  if (errorMessage) {
    return (
      <div className="py-4 px-6">
        <UiText color="destructive">An error occured:</UiText>
        <div className="bg-card rounded-md p-2" style={{ minHeight: '6rem' }}>
          <UiText
            variant="code"
            color="muted"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {errorMessage}
          </UiText>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <UiList shouldFilter={false} items={convertedValues} />
    </div>
  );
}

export default UnitConverter;
