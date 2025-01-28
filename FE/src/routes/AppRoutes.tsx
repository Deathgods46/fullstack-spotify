import { FC } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

const AppRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
