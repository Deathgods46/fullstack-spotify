import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylistsContext } from '../../context/playlistsContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MY_PLAYLISTS } from '../../routes/routePages';
import { useUserContext } from '../../context/userContext';
import { SongsTypes } from '../../types/songsTypes';
import useSpotify from '../../hooks/useSpotify';
import { useSpotifyContext } from '../../context/spotifyContext';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { songDurationFormatter } from '../../helpers/helpers';
import {
  addSongIdToPlaylists,
  handleDeletePlaylist,
  removeSongFromCurrentPlaylist,
} from '../../services/playlistsService';
import { toast } from 'react-hot-toast';

const tableHeaders = [
  'S No.',
  'Track Name',
  'Track Artist',
  'Album',
  'Duration',
  'Actions',
];

const PlaylistData = () => {
  const { playlistId } = useParams();
  const { playlists, loadingPlaylistsData, fetchLatestPlaylists } =
    usePlaylistsContext();
  const navigate = useNavigate();
  const { getPlaylistTracksInformation } = useSpotify();
  const { token } = useSpotifyContext();
  const { user, localStorageAuthToken } = useUserContext();
  const [songsInformation, setSongsInformation] = useState<SongsTypes[]>([]);
  const [openAddCard, setOpenAddCard] = useState(false);
  const [openDeleteCard, setOpenDeleteCard] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongsTypes | null>(null);

  const handleAddToAnotherPlaylist = (songInfo: SongsTypes) => {
    setSelectedSong(songInfo);
    setOpenAddCard(true);
  };

  const otherPlaylistsThanCurrent = useMemo(() => {
    return playlists.filter((playlist) => playlist.id !== playlistId)
  }, [playlistId])

  const handleCloseDialog = () => {
    setOpenAddCard(false);
    setOpenDeleteCard(false);
    setSelectedPlaylists([]);
  };

  const handleCheckboxChange = (playlistId: string) => {
    setSelectedPlaylists((prevSelectedPlaylists) =>
      prevSelectedPlaylists.includes(playlistId)
        ? prevSelectedPlaylists.filter((id) => id !== playlistId)
        : [...prevSelectedPlaylists, playlistId],
    );
  };

  const handlePlaylistDeletion = async (playlistId: string) => {
    handleDeletePlaylist({
      playlistId: currentSelectedPlaylistData?.id || '',
    }).then(() => {
      navigate(MY_PLAYLISTS);
    });
  };

  const currentSelectedPlaylistData = useMemo(() => {
    return playlists.find((playlist) => playlist.id === playlistId);
  }, [playlists]);

  useEffect(() => {
    if (
      !user?.authToken ||
      !localStorageAuthToken ||
      loadingPlaylistsData ||
      !playlists.length ||
      !token
    ) {
      return;
    }
    if (!playlists.length) {
      navigate(MY_PLAYLISTS);
      return;
    }
    if (currentSelectedPlaylistData) {
      const songIds = currentSelectedPlaylistData!.songs.map(
        (song) => song.songId,
      );
      if (songIds.length) {
        getPlaylistTracksInformation(songIds).then((response) => {
          setSongsInformation(response);
        });
      } else {
        setSongsInformation([]);
      }
    } else {
      toast.error('Your playlist does not exist!');
      navigate(MY_PLAYLISTS);
    }
  }, [
    playlists,
    user,
    localStorageAuthToken,
    currentSelectedPlaylistData,
    token,
    loadingPlaylistsData,
  ]);

  const handleDeleteSongFromPlaylist = useCallback(async (songId: string) => {
    await removeSongFromCurrentPlaylist({
      playlistId: playlistId!,
      songId,
    }).then(() => fetchLatestPlaylists());
  }, []);

  const handleAddToPlaylists = async () => {
    await addSongIdToPlaylists({
      songId: selectedSong?.id ?? '',
      playlistsId: selectedPlaylists,
    });
    setOpenAddCard(false);
    setSelectedPlaylists([]);
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{currentSelectedPlaylistData?.playlistName}</Typography>
        <Button
          variant={'contained'}
          sx={{ backgroundColor: 'red' }}
          onClick={() => setOpenDeleteCard(true)}
        >
          Delete This Playlist
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index}>
                  <TableSortLabel>{header}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {songsInformation.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.artists.map((artist, index) =>
                    index === row.artists.length - 1
                      ? artist.name
                      : artist.name + ', ',
                  )}
                </TableCell>
                <TableCell>{row.album.name}</TableCell>
                <TableCell>{songDurationFormatter(row.duration_ms)}</TableCell>
                <TableCell sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant={'contained'}
                    sx={{ backgroundColor: 'red' }}
                    onClick={() => handleDeleteSongFromPlaylist(row.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant={'outlined'}
                    onClick={() => handleAddToAnotherPlaylist(row)}
                  >
                    Add to Another Playlist
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openAddCard}
        onClose={handleCloseDialog}
        onBackdropClick={handleCloseDialog}
      >
        <DialogTitle>
          Add <b>{selectedSong?.name}</b> To Your Playlists
        </DialogTitle>
        <DialogContent>
          <Box>
            {otherPlaylistsThanCurrent.length > 0 ? (
              otherPlaylistsThanCurrent.map((playlist) =>
                <FormControlLabel
                  key={playlist?.id}
                  control={
                    <Checkbox
                      checked={selectedPlaylists.includes(playlist?.id ?? '')}
                      onChange={() => handleCheckboxChange(playlist?.id ?? '')}
                    />
                  }
                  label={playlist?.playlistName}
                />
              )
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
          {otherPlaylistsThanCurrent.length > 0 &&
            <Button onClick={handleAddToPlaylists} color="primary">
              Add
            </Button>
          }
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteCard}
        onClose={handleCloseDialog}
        onBackdropClick={handleCloseDialog}
      >
        <DialogTitle>
          Delete <b>{currentSelectedPlaylistData?.playlistName}</b>?
        </DialogTitle>
        <DialogContent>Once done, this action can not be undone.</DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handlePlaylistDeletion(currentSelectedPlaylistData?.id || '')
            }
            color="warning"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlaylistData;
