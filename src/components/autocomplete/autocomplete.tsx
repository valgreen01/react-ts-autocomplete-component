import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { mockFetchItems } from '../../api/mock-api-data';
import { Item, AutoCompleteProps } from '../../types';
import styles from './autocomplete.module.css';

export const AutoComplete: React.FC<AutoCompleteProps> = ({ onSelect }) => {
	const [query, setQuery] = useState('');
	const [items, setItems] = useState<Item[]>([]);
	const [isItemSelected, setIsItemSelected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const fetchItems = async () => {
			if (query.trim() === '') {
				setItems([]);
				return;
			}
			setLoading(true);
			try {
				if (!isItemSelected) {
					const results = await mockFetchItems(query);
					setItems(results);
				}
			} catch (error) {
				console.error('Error fetching items:', error);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimer = setTimeout(fetchItems, 500);
		return () => clearTimeout(debounceTimer);
	}, [query, isItemSelected]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		setSelectedIndex(-1);
		if (isItemSelected) {
			setIsItemSelected(false);
		}
	};

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(items[selectedIndex]);
			setSelectedIndex(-1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      setItems([]);
      setSelectedIndex(-1);
    }
  };

	const handleSelect = (item: Item) => {
		setSelectedIndex(-1); // Reset selected index
		setIsItemSelected(true);
		onSelect(item);
		setQuery(item.name);
		setItems([]);
		inputRef.current?.focus();
	};

	const highlightMatch = (text: string, query: string) => {
		if (!query) {
			return text;
		}
		const regex = new RegExp(`(${query})`, 'gi');
		return text
			.split(regex)
			.map((part, index) =>
				regex.test(part) ? <mark key={index}>{part}</mark> : part
			);
	};

	useEffect(() => {
		if (selectedIndex >= 0 && listRef.current) {
			const selectedElement = listRef.current.children[
				selectedIndex
			] as HTMLLIElement;
			selectedElement.scrollIntoView({ block: 'nearest' });
		}
	}, [selectedIndex]);

	return (
		<div className={styles.autocomplete}>
			<input
				ref={inputRef}
				role="textbox"
				type="text"
				value={query}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder="Start searching..."
				aria-label="Search"
				aria-autocomplete="list"
				aria-controls="autocomplete-list"
				aria-activedescendant={
					selectedIndex >= 0 ? `item-${items[selectedIndex].id}` : undefined
				}
			/>
			{loading && <div className={styles.loading}>Loading...</div>}
			{items.length > 0 && (
				<ul id="autocomplete-list" ref={listRef} role="listbox">
					{items.map((item, index) => (
						<li
							key={item.id}
							id={`item-${item.id}`}
							data-testid={`item-${item.id}`}
							role="option"
							aria-selected={index === selectedIndex}
							className={index === selectedIndex ? styles.selected : ''}
							onClick={() => handleSelect(item)}
						>
							{highlightMatch(item.name, query)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
