import React from 'react';
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Typography,
	Box,
} from '@mui/material';
import { Search, LibraryMusic, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import { HEADER_HEIGHT } from '../../constants/globalConstants';
import { DASHBOARD_PAGE, SEARCH_SONGS } from '../../routes/routePages';

const drawerWidth = 240;

const Sidebar = () => {
	const navigate = useNavigate();
	const { user } = useUserContext();

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box',
					marginTop: `${HEADER_HEIGHT}px`,
				},
			}}>
			<Box sx={{ p: 2, textAlign: 'center' }}>
				<Typography variant="h6">{user?.username}</Typography>
			</Box>

			<Divider />

			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate(DASHBOARD_PAGE)}>
						<ListItemIcon>
							<Home />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate(SEARCH_SONGS)}>
						<ListItemIcon>
							<Search />
						</ListItemIcon>
						<ListItemText primary="Search Songs" />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate('/my-playlists')}>
						<ListItemIcon>
							<LibraryMusic />
						</ListItemIcon>
						<ListItemText primary="My Playlists" />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
};

export default Sidebar;
