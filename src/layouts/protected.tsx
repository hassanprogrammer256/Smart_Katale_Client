// layouts/protected.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../types/hooks.types';
import { CircularProgress, Box, Typography } from '@mui/joy';
import { useToast } from '../utils/toast-context';
import { useEffect } from 'react';
import type { ProtectedRouteProps } from '../interfaces/routes.interfaces';


const ProtectedRoute = (props: ProtectedRouteProps) => {

  
  const { 
    requiredRole, 
    redirectTo = '/accounts/login',
    requiresGuest = false,
    redirectIfManager,
    children 
  } = props;
  
  const { is_authenticated, role, loading } = useAppSelector((state) => state.user);
  const location = useLocation();
  const { addToast } = useToast();


  // Handle redirects with toasts using useEffect
  useEffect(() => {
    // Handle unauthenticated access (except when redirectIfManager is set)
    if (!loading && !is_authenticated && !redirectIfManager && !requiresGuest) {
      addToast?.({
        message: 'Please login to access this page...',
        color: 'warning'
      });
    }

    // Handle role-based access
    if (!loading && requiredRole) {
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!is_authenticated) {
        addToast?.({
          message: 'Please login to access this page',
          color: 'warning'
        });
      } else if (role && !requiredRoles.includes(role)) {
        addToast?.({
          message: 'You do not have permission to access this page',
          color: 'danger'
        });
      }
    }
  }, [loading, is_authenticated, redirectIfManager, requiresGuest, requiredRole, role, addToast]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '10vh',
        backgroundColor: '#0e0d0d7c',
        gap: 2
      }}>
        <CircularProgress size="sm" color="success" />
        <Typography level="body-sm">Authenticating...</Typography>
      </Box>
    );
  }

  // Handle manager redirect
  if (redirectIfManager && is_authenticated && role === 'manager') {
    return <Navigate to={redirectIfManager} replace />;
  }

  // Handle guest routes
  if (requiresGuest) {
    if (is_authenticated) {
      const destination = role === 'manager' ? '/admin' : '/my-profile';
      return <Navigate to={destination} state={{ from: location }} replace />;
    }
    return children ? <>{children}</> : <Outlet />;
  }

  // Handle unauthenticated redirect
  if (!is_authenticated && !redirectIfManager) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Handle role-based redirect
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!is_authenticated) {
      return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
    }
    
    if (!role || !requiredRoles.includes(role)) {
      if (role === 'manager') {
        return <Navigate to="/admin" replace />;
      } else if (role === 'customer') {
        return <Navigate to="/my-profile" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Allow access
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;