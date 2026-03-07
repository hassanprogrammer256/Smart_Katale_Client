// pages/unauthorized.tsx
import { Box, Typography, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      gap: 3,
      p: 3
    }}>
      <FaLock size={80} color="#d32f2f" />
      <Typography level="h1" color="danger">
        403 - Unauthorized
      </Typography>
      <Typography level="h4" textAlign="center">
        You don't have permission to access this page.
      </Typography>
      <Typography level="body-lg" textColor="text.secondary" textAlign="center">
        Please contact your administrator if you believe this is a mistake.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="solid" 
          color="primary" 
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
        <Button 
          variant="outlined" 
          color="neutral" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default Unauthorized;