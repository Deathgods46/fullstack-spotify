import LandingPage from '../components/landingPage/LandingPage';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { DASHBOARD_PAGE, LANDING_PAGE, MY_PLAYLISTS, SEARCH_SONGS } from './routePages';
import UserLandingPage from '../components/userLandingPage/UserLandingPage';
import React, { useEffect } from 'react';
import { useUserContext } from '../context/userContext';
import SearchSongs from '../components/searchSongs/SearchSongs';
import { Typography } from '@mui/material';
import MyPlaylists from '../components/myPlaylists/MyPlaylists';

const PrivateRoutes = () => {
	const { user } = useUserContext();
	const navigate = useNavigate();

	const { pathname } = useLocation();
	useEffect(() => {
		if (!user?.authToken) {
			navigate(LANDING_PAGE);
		} else if (pathname === LANDING_PAGE) {
			navigate(DASHBOARD_PAGE);
		}
	}, [user]);

	return (
		<Routes>
			<Route path={LANDING_PAGE} element={<LandingPage />} />
			<Route path={DASHBOARD_PAGE} element={<UserLandingPage />}>
				<Route path={SEARCH_SONGS} element={<SearchSongs />} />
				<Route path={MY_PLAYLISTS} element={<MyPlaylists />} />
				<Route
					path={DASHBOARD_PAGE}
					element={
						<>
							<Typography sx={{ marginBottom: 2 }}>Welcome to your profile!</Typography>
							<Typography>Start by clicking on the side icons</Typography>
						</>
					}
				/>
				<Route path="*" element={<Navigate to={DASHBOARD_PAGE} replace />} />
			</Route>
		</Routes>
	);
};

export default PrivateRoutes;
