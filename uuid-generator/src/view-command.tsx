import { useEffect, useRef, useState } from 'react';
import { _extension, UiIcons, UiList, UiListItem } from '@altdot/extension';
import { makeId } from './utils/helper';

_extension.ui.searchPanel.updatePlaceholder(
  'Search or press ctrl+enter to create item',
);

function ViewCommand() {
  const valueRef = useRef('');

  const [items, setItems] = useState<{ id: string; name: string }[]>([
    { id: 'hello-world', name: 'Hello World' },
  ]);

  const listItems: UiListItem[] = items.map((item) => ({
    value: item.id,
    title: item.name,
    actions: [
      {
        type: 'button',
        title: 'Delete',
        value: 'delete',
        color: 'destructive',
        icon: UiIcons.Trash2,
        onAction() {
          setItems((prevValue) =>
            prevValue.filter((value) => value.id !== item.id),
          );
        },
      },
    ],
  }));

  useEffect(() => {
    const offKeydownEvent = _extension.ui.searchPanel.onKeydown.addListener(
      ({ ctrlKey, key }) => {
        if (!ctrlKey || key !== 'Enter') return;

        setItems((prevItems) => [
          ...prevItems,
          { id: makeId(5), name: valueRef.current },
        ]);

        valueRef.current = '';
        _extension.ui.searchPanel.clearValue();
      },
    );
    const offChangedEvent = _extension.ui.searchPanel.onChanged.addListener(
      (value) => {
        valueRef.current = value;
      },
    );

    return () => {
      offChangedEvent();
      offKeydownEvent();
    };
  }, []);

  return (
    <div className="p-2">
      <UiList items={listItems} />
    </div>
  );
}

export default ViewCommand;
