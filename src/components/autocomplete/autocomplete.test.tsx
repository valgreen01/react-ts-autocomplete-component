/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AutoComplete } from './autocomplete';
import { mockFetchItems } from '../../api/mock-api-data';

vi.mock('../../api/mock-api-data');

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
});

describe('AutoComplete Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly', () => {
		expect(AutoComplete).toBeDefined();
	});

	it('renders input field', () => {
		render(<AutoComplete onSelect={vi.fn()} />);
		const inputElement = screen.getByRole('textbox');
		expect(inputElement).toBeInTheDocument();
	});

	it('displays loading indicator while fetching items', async () => {
		// @ts-ignore
		(mockFetchItems as vi.Mock).mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve([]), 500))
		);

		render(<AutoComplete onSelect={vi.fn()} />);
		const inputElement = screen.getByRole('textbox');

		fireEvent.change(inputElement, { target: { value: 'Item' } });

		const loadingMessage = await screen.findByText('Loading...');
		expect(loadingMessage).toBeInTheDocument();
		await waitFor(() => expect(mockFetchItems).toHaveBeenCalled());
	});

	it('fetches and displays items based on input', async () => {
		const items = [
			{ id: 1, name: 'Item 1' },
			{ id: 2, name: 'Item 2' },
		];
		// @ts-ignore
		(mockFetchItems as vi.Mock).mockResolvedValue(items);

		render(<AutoComplete onSelect={vi.fn()} />);
		const inputElement = screen.getByRole('textbox');

		fireEvent.change(inputElement, { target: { value: 'Item' } });

		await waitFor(() => expect(mockFetchItems).toHaveBeenCalledWith('Item'));
		const listItemElements = screen.getAllByRole('option');

		expect(listItemElements).toHaveLength(items.length);
		await waitFor(() => {
			expect(screen.getByTestId('item-1')).toBeInTheDocument();
			expect(screen.getByTestId('item-2')).toBeInTheDocument();
		});
	});

	it('highlights matching text', async () => {
		const items = [{ id: 1, name: 'Item 1' }];
		// @ts-ignore
		(mockFetchItems as vi.Mock).mockResolvedValue(items);
		const onSelectMock = vi.fn();

		render(<AutoComplete onSelect={onSelectMock} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'item' } });

		await waitFor(() => {
			const highlightedText = screen.getByText('Item');
			expect(highlightedText.tagName).toBe('MARK');
		});
	});

	it('calls onSelect when an item is clicked', async () => {
		const items = [{ id: 1, name: 'Item 1' }];
		// @ts-ignore
		(mockFetchItems as vi.Mock).mockResolvedValue(items);
		const onSelectMock = vi.fn();

		render(<AutoComplete onSelect={onSelectMock} />);
		const inputElement = screen.getByRole('textbox');

		fireEvent.change(inputElement, { target: { value: 'Item 1' } });

		await waitFor(() => expect(mockFetchItems).toHaveBeenCalled());
		const listItemElement = screen.getAllByRole('option')[0];
		fireEvent.click(listItemElement);

		expect(onSelectMock).toHaveBeenCalledWith(items[0]);
	});

	it('handles keyboard navigation', async () => {
		const items = [
			{ id: 1, name: 'Item 1' },
			{ id: 2, name: 'Item 2' },
		];
		// @ts-ignore
		(mockFetchItems as vi.Mock).mockResolvedValue(items);
		const onSelectMock = vi.fn();

		render(<AutoComplete onSelect={onSelectMock} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'item' } });

		await waitFor(() => {
			expect(screen.getByTestId('item-1')).toBeInTheDocument();
		});

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(screen.getByTestId('item-1')).toHaveClass(/selected/i);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(screen.getByTestId('item-2')).toHaveClass(/selected/i);

		fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(screen.getByTestId('item-1')).toHaveClass(/selected/i);

		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onSelectMock).toHaveBeenCalledWith(items[0]);
	});

	it('clears input and closes dropdown on Escape key', async () => {
		const items = [{ id: 1, name: 'Item 1' }];
		// @ts-ignore
		(mockFetchItems as vi.Mock).mockResolvedValue(items);
		const onSelectMock = vi.fn();

		render(<AutoComplete onSelect={onSelectMock} />);

		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: 'item' } });

		await waitFor(() => {
			expect(screen.getByTestId('item-1')).toBeInTheDocument();
		});

		fireEvent.keyDown(input, { key: 'Escape' });
		expect(input).toHaveValue('');
		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});
});
