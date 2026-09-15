import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { theme } from '@/constants/theme';

// Layout route guards
import ProtectedRoutes from '@/components/global/ProtectedRoutes';
import GlobalLogic from '@/components/global/GlobalLogic';
import MainCommonWrap from '@/components/global/MainCommonWrap';

// Pages
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Verification from '@/pages/Verification';
import Dashboard from '@/pages/Dashboard';
import Campaigns from '@/pages/Campaigns';
import CampaignDetail from '@/pages/CampaignDetail';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verification" element={<Verification />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route element={<GlobalLogic />}>
                <Route element={<MainCommonWrap />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/:id" element={<CampaignDetail />} />
                  <Route path="/workshop" element={<Dashboard />} />
                  <Route path="/settings" element={<Dashboard />} />
                </Route>
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}
