import { useCallback, useEffect, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import * as _ from 'lodash';

const SearchSongs = () => {
	const [searchTerm, setSearchTerm] = useState<string>('');

	const debouncedSearch = useCallback(
		_.debounce((query) => {
			// onSearch(query);
			console.log(query);
		}, 500), // 500ms delay
		[],
	);

	useEffect(() => {
		if (searchTerm.trim() !== '') {
			debouncedSearch(searchTerm);
		}
	}, [searchTerm, debouncedSearch]);

	return (
		<Box>
			<Typography mb={2}>Search Songs</Typography>
			<TextField
				variant="outlined"
				placeholder="Search songs..."
				fullWidth
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					),
				}}
			/>
		</Box>
	);
};

export default SearchSongs;
