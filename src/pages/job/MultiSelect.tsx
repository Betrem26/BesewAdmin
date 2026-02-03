import React, { useState, useEffect } from 'react';

type Props = {
  items: string[];
  onSelect: (selected: string[]) => void;
  currentSelected?: string[];
  disableAdd?: boolean;
  label?: string;
};

const MultiSelect: React.FC<Props> = ({
  items,
  onSelect,
  currentSelected = [],
  disableAdd = false,
  label,
}) => {
  const [selected, setSelected] = useState<string[]>(currentSelected);
  const [itemsList, setItemsList] = useState<string[]>(items);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    setSelected(currentSelected);
  }, [currentSelected]);

  const toggleSelect = (item: string) => {
    setSelected(prevSelected => {
      const isSelected = prevSelected.includes(item);
      const newSelected = isSelected
        ? prevSelected.filter(i => i !== item)
        : [...prevSelected, item];

      onSelect(newSelected);
      return newSelected;
    });
  };

  const addItem = () => {
    if (newItem && !itemsList.includes(newItem)) {
      const updatedItems = [...itemsList, newItem];
      setItemsList(updatedItems);
      setNewItem('');
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-gray-700 capitalize">{label}</label>}

      <div className="flex flex-wrap gap-2 border p-4 rounded-xl border-gray-300">
        {itemsList.map((item, index) => (
          <button
            key={index}
            onClick={() => toggleSelect(item)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selected.includes(item)
                ? 'bg-blue-500 text-white border-transparent'
                : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'
            }`}
          >
            {item}
          </button>
        ))}

        {!disableAdd && (
          <div className="flex items-center gap-2">
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              placeholder="Add item"
              className="border px-3 py-1.5 rounded-full text-sm"
            />
            <button
              onClick={addItem}
              className="text-sm bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
