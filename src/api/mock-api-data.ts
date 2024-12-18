import { Item } from '../types';

export const mockItems: Item[] = [
	{ id: 1, name: 'A Perfect Circle' },
	{ id: 2, name: 'Incubus' },
	{ id: 3, name: 'Led Zeppelin' },
	{ id: 4, name: 'Metallica' },
	{ id: 5, name: 'Ministry' },
	{ id: 6, name: 'Nine Inch Nails' },
	{ id: 7, name: 'Pink Floyd' },
	{ id: 8, name: 'Primus' },
	{ id: 9, name: 'Red Hot Chili Peppers' },
	{ id: 10, name: 'Tool' },
];

export const mockFetchItems = async (query: string): Promise<Item[]> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return mockItems.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase())
	);
};
