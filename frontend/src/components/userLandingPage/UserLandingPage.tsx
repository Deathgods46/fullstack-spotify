import React from 'react';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const UserLandingPage = () => {
	return (
		<>
			<div>
				<Sidebar />
				<Box sx={{ marginLeft: '240px' }}>
					<Outlet />
				</Box>
			</div>
		</>
	);
};

export default UserLandingPage;
