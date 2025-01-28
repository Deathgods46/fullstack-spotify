import { FC } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

const AppRoutes: FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<PrivateRoutes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
