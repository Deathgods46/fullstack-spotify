import LandingPage from '../components/landingPage/LandingPage';
import { Route, Routes } from 'react-router-dom';

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path={'/'} element={<LandingPage />} />
    </Routes>
  );
};

export default PrivateRoutes;
