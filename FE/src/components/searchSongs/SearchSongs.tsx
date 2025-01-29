import { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore, Search } from '@mui/icons-material';
import useSpotify from '../../hooks/useSpotify';
import { SongsTypes } from '../../types/songsTypes';
import useDebounceEffect from '../../hooks/useDebounceEffect';

const SearchSongs = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { getSongsFromSearchQuery } = useSpotify();
  const [resultList, setResultList] = useState<SongsTypes[]>([]);

  useDebounceEffect(
    () => {
      if (searchTerm.trim() !== '') {
        getSongsFromSearchQuery(searchTerm).then((data) => {
          setResultList(data);
        });
      }
    },
    [searchTerm],
    500,
  );

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
      {resultList.length > 0 && (
        <Paper>
          {resultList.map((songInfo) => (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={songInfo.album.images[0].url}
                    alt="Album Image"
                    width={60}
                    height={60}
                  />
                  <Typography>{songInfo.name}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Artist: {songInfo.artists.map((artist) => artist.name)}
                </Typography>
                <Typography>Album: {songInfo.album.name}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default SearchSongs;
