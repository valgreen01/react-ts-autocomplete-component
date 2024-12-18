import { AutoComplete } from './components/autocomplete/autocomplete';
import { Item } from './types';
import './App.css';

function App() {
	const handleSelect = (item: Item) => {
		console.log('Selected item:', item);
	};

	return (
		<>
			<h1>AutoComplete React/TS Component Demo</h1>
			{/* Implementation of AutoComplete component */}
			<AutoComplete onSelect={handleSelect} />
		</>
	);
}

export default App;
