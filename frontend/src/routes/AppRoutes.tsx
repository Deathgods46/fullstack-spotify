import { FC, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import Header from '../components/Header';
import { Box, Container } from '@mui/material';
import { HEADER_HEIGHT } from '../constants/globalConstants';
const AppRoutes: FC = () => {
	return (
		<BrowserRouter>
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Header />
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						minHeight: `calc(100vh - ${2 * parseInt(HEADER_HEIGHT)}px)`,
						p: 3,
					}}>
					<Routes>
						<Route path="/*" element={<PrivateRoutes />} />
					</Routes>
				</Box>
			</Box>
		</BrowserRouter>
	);
};

export default AppRoutes;
