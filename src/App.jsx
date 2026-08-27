import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

import DiscoverPage from './pages/customer/DiscoverPage.jsx'
import ProviderDetailPage from './pages/customer/ProviderDetailPage.jsx'
import CheckoutPage from './pages/customer/CheckoutPage.jsx'
import OrdersPage from './pages/customer/OrdersPage.jsx'
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx'
import ProfilePage from './pages/customer/ProfilePage.jsx'

import DashboardPage from './pages/provider/DashboardPage.jsx'
import MenuManagementPage from './pages/provider/MenuManagementPage.jsx'
import ProviderOrdersPage from './pages/provider/OrdersPage.jsx'
import PlansSetupPage from './pages/provider/PlansSetupPage.jsx'
import HolidayCalendarPage from './pages/provider/HolidayCalendarPage.jsx'
import VerificationPage from './pages/provider/VerificationPage.jsx'
import ProviderReviewsPage from './pages/provider/ReviewsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/providers/:id" element={<ProviderDetailPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/track"
          element={
            <ProtectedRoute role="customer">
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute role="provider">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/menu"
          element={
            <ProtectedRoute role="provider">
              <MenuManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/orders"
          element={
            <ProtectedRoute role="provider">
              <ProviderOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/plans"
          element={
            <ProtectedRoute role="provider">
              <PlansSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/holidays"
          element={
            <ProtectedRoute role="provider">
              <HolidayCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/verification"
          element={
            <ProtectedRoute role="provider">
              <VerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute role="provider">
              <ProviderReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  )
}
