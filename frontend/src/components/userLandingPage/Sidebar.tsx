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
import { DASHBOARD_PAGE, MY_PLAYLISTS, SEARCH_SONGS } from '../../routes/routePages';

const drawerWidth = 240;

const CommonListItem = ({
	text,
	urlNavigate,
	Icon,
}: {
	urlNavigate: () => void;
	text: string;
	Icon: JSX.Element;
}) => {
	return (
		<ListItem disablePadding>
			<ListItemButton onClick={urlNavigate}>
				<ListItemIcon>{Icon}</ListItemIcon>
				<ListItemText primary={text} />
			</ListItemButton>
		</ListItem>
	);
};

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
				<CommonListItem text="Home" urlNavigate={() => navigate(DASHBOARD_PAGE)} Icon={<Home />} />
				<CommonListItem
					text="Search Songs"
					urlNavigate={() => navigate(SEARCH_SONGS)}
					Icon={<Search />}
				/>
				<CommonListItem
					text="My Playlists"
					urlNavigate={() => navigate(MY_PLAYLISTS)}
					Icon={<LibraryMusic />}
				/>
			</List>
		</Drawer>
	);
};

export default Sidebar;
