import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  status: "auctioning" | "completed";
}

export const useMainPageViewModel = () => {
  const [auctioningItems, setAuctioningItems] = useState<Item[]>([]);
  const [completedItems, setCompletedItems] = useState<Item[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // In a real app, you'd trigger a search here, possibly debounced
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    if (searchTerm.trim() !== '' && !recentSearches.includes(searchTerm.trim())) {
      setRecentSearches(prevSearches => [searchTerm.trim(), ...prevSearches].slice(0, 5)); // Keep last 5 searches
    }
    // In a real app, you'd perform the actual search here
    console.log('Searching for:', searchTerm);
  };

  const handleDeleteRecentSearch = (termToDelete: string) => {
    setRecentSearches(prevSearches => prevSearches.filter(term => term !== termToDelete));
  };

  useEffect(() => {
    fetch('/dummy.json')
      .then(response => response.json())
      .then((data: Item[]) => {
        setAuctioningItems(data.filter(item => item.status === 'auctioning'));
        setCompletedItems(data.filter(item => item.status === 'completed'));
      })
      .catch(error => console.error('Error fetching dummy data:', error));
  }, []);

  return {
    auctioningItems,
    completedItems,
    searchTerm,
    recentSearches,
    handleSearchChange,
    handleSearchSubmit,
    handleDeleteRecentSearch,
  };
};