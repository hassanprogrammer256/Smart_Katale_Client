export interface ProtectedRouteProps {
  requiredRole?: string | string[];
  redirectTo?: string;
  requiresGuest?: boolean;
  redirectIfManager?: string;
  children?: React.ReactNode;
  
}