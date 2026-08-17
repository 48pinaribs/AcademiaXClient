import React, { useState } from 'react';
import '../styles/theme.css';

const SearchInput = ({ onSearch, placeholder = 'Ara…' }) => {
    const [searchText, setSearchText] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        onSearch?.(value);
    };

    return (
        <div className="ax-search-input">
            <span aria-hidden="true">🔍</span>
            <input type="text" placeholder={placeholder} value={searchText} onChange={handleChange} />
        </div>
    );
};

export default SearchInput;
