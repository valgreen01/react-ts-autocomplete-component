export interface Item {
	id: number;
	name: string;
}

export interface AutoCompleteProps {
	onSelect: (item: Item) => void;
}
