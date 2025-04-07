
import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Input
      placeholder="Search customers..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-md"
    />
  );
};

export default SearchBar;
