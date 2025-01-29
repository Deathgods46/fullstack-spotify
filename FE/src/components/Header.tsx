import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { HEADER_HEIGHT } from '../constants/globalConstants';
import { useUserContext } from '../context/userContext';
import { useState } from 'react';

const Header = () => {
  const { user, logOutUser } = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ height: `${HEADER_HEIGHT}px` }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        {user ? (
          <IconButton
            sx={{
              ml: 2, // Adds left margin for padding
              padding: 1,
            }}
            edge="end"
            color="inherit"
            aria-label="user-icon"
            onClick={handleClick}
          >
            <Avatar sx={{ width: 30, height: 30 }}>
              {user.username[0].toUpperCase()}
            </Avatar>
          </IconButton>
        ) : null}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logOutUser();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
