import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore, Search } from '@mui/icons-material';
import useSpotify from '../../hooks/useSpotify';
import { SongsTypes } from '../../types/songsTypes';
import useDebounceEffect from '../../hooks/useDebounceEffect';
import { usePlaylistsContext } from '../../context/playlistsContext';
import { addSongIdToPlaylists } from '../../services/playlistsService';

const SearchSongs = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { getSongsFromSearchQuery } = useSpotify();
  const { playlists } = usePlaylistsContext();
  const [resultList, setResultList] = useState<SongsTypes[]>([]);
  const [openAddCard, setOpenAddCard] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongsTypes | null>(null);

  const handleOpenAddCard = (songInfo: SongsTypes) => {
    setSelectedSong(songInfo);
    setOpenAddCard(true);
  };

  const handleCloseDialog = () => {
    setOpenAddCard(false);
    setSelectedPlaylists([]);
  };

  const handleAddToPlaylists = async () => {
    await addSongIdToPlaylists({
      songId: selectedSong?.id ?? '',
      playlistsId: selectedPlaylists,
    });
    setOpenAddCard(false);
    setSelectedPlaylists([]);
  };

  const handleCheckboxChange = (playlistId: string) => {
    setSelectedPlaylists((prevSelectedPlaylists) =>
      prevSelectedPlaylists.includes(playlistId)
        ? prevSelectedPlaylists.filter((id) => id !== playlistId)
        : [...prevSelectedPlaylists, playlistId],
    );
  };

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
      {resultList.length > 0 && searchTerm && (
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 2,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <Typography>
                      Artist:
                      {songInfo.artists.map((artist, index) =>
                        index === songInfo.artists.length - 1
                          ? artist.name
                          : artist.name + ', ',
                      )}
                    </Typography>
                    <Typography>Album: {songInfo.album.name}</Typography>
                  </div>
                  <Button
                    variant="contained"
                    sx={{ position: 'relative' }}
                    onClick={() => handleOpenAddCard(songInfo)}
                  >
                    Add To Your Playlist
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}

      <Dialog
        open={openAddCard}
        onClose={handleCloseDialog}
        onBackdropClick={handleCloseDialog}
      >
        <DialogTitle>
          Add <b>{selectedSong?.name}</b> To Your Playlists
        </DialogTitle>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <FormControlLabel
                  key={playlist.id}
                  control={
                    <Checkbox
                      checked={selectedPlaylists.includes(playlist.id)}
                      onChange={() => handleCheckboxChange(playlist.id)}
                    />
                  }
                  label={playlist.playlistName}
                />
              ))
            ) : (
              <Typography>
                You do not have any playlists at the moment!
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          {playlists.length > 0 &&
            <Button onClick={handleAddToPlaylists} color="primary">
              Add
            </Button>
          }
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchSongs;
