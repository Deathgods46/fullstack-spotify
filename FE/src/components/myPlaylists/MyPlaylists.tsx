import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylistsContext } from '../../context/playlistsContext';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { LibraryMusic, Add } from '@mui/icons-material';
import { getPlaylistPageFromId } from '../../routes/routePages';
import { handleCreatePlaylist } from '../../services/playlistsService';

const MyPlaylists = () => {
  const { fetchLatestPlaylists, playlists } = usePlaylistsContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();

  const handleCreateNewPlaylist = () => {
    handleCreatePlaylist({ playlistName: newPlaylistName }).then(() => {
      fetchLatestPlaylists();
      setIsDialogOpen(false);
      setNewPlaylistName('');
    });
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    fetchLatestPlaylists();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Create New Playlist
        </Button>
      </Box>
      {playlists.length > 0 ? (
        playlists.map((playlist) => {
          return (
            <List
              key={playlist.id}
              onClick={() => navigate(getPlaylistPageFromId(playlist.id))}
            >
              <ListItem
                sx={{
                  boxShadow: 2,
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <ListItemIcon>
                  <LibraryMusic />
                </ListItemIcon>
                <ListItemText
                  primary={playlist.playlistName}
                  secondary={playlist.songs.length + ' Songs'}
                />
              </ListItem>
            </List>
          );
        })
      ) : (
        <Typography>You do not have any playlists</Typography>
      )}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onBackdropClick={handleCloseDialog}
      >
        <DialogTitle>Create New playlist</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Enter your new playlist name below
          </Typography>
          <TextField
            label="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewPlaylist}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPlaylists;
