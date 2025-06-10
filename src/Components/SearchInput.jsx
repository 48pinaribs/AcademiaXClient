import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (value === '') {
            onSearch(''); // temizlendiğinde hemen tetikle
        }
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                sx={{ width: 250, backgroundColor: 'white', borderRadius: 1 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch} edge="end">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
};

export default SearchInput;
