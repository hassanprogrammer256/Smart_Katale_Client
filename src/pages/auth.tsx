import React, { useState, useEffect } from 'react';
import Logo from '/images/mini_logo.png';
import SmartForm from '../components/common/form';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../types/hooks.types';
import { LoginThunk, RegisterThunk, clearError } from '../Slices/userSlice';
import { useToast } from '../utils/toast-context';
import { CircularProgress } from '@mui/joy';
import { LoginFormFields, RegisterFormFields } from '../configs/form_fields';

interface AuthProps {
  changePage?: () => void;
  onSuccess?: () => void;
}

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const { is_authenticated, role } = useAppSelector((state) => state.user);
  const loading = useAppSelector((state) => state.user.loading);
  const {addToast} = useToast();

 useEffect(() => {
  // Don't redirect while still loading
  if (loading) return;
  
  const path = location.pathname;
  
  // Case 1: User is authenticated
  if (is_authenticated) {
    // If on auth pages (login/register), redirect to appropriate dashboard
    if (path.includes('/accounts')) {
      if (role === 'manager') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/my-profile', { replace: true });
      }
      return;
    }
    
    // Role-based access
    if (role === 'manager') {
      // Managers can access everything except maybe customer-specific pages
      // You can add restrictions here if needed
    } else if (role === 'customer') {
      // Customers cannot access admin pages
      if (path.startsWith('/admin')) {
        navigate('/', { replace: true });
        addToast?.({
          message: 'Access denied. Admin area only.',
          color: 'warning'
        });
      }
    }
  } 
  // Case 2: User is not authenticated (guest)
  else {
    // Protected routes that require authentication
    const protectedPaths = [
      '/my-profile',
      '/admin',
    ];
    
    const isProtectedPath = protectedPaths.some(pp => 
      path === pp || path.startsWith(pp + '/')
    );
    
    if (isProtectedPath) {
      // Save the attempted path to redirect back after login
      navigate('/accounts/login', { 
        replace: true,
        state: { from: path }
      });
      
      addToast?.({
        message: 'Please login to continue',
        color: 'warning'
      });
    }
  }
  
  // Case 3: Handle auth pages when already authenticated (already handled above)
  
}, [is_authenticated, role, location.pathname, loading, navigate, addToast]);

  // Determine which page to show based on URL
  useEffect(() => {
    if (location.pathname === '/accounts/register') {
      setCurrentPage(1);
    } else {
      setCurrentPage(0);
    }
  }, [location.pathname]);

  const pageFlip = () => {
    if (currentPage === 0) {
      navigate('/accounts/register');
    } else {
      navigate('/accounts/login');
    }
  };

  const handleSuccess = () => {
  
      if (role === 'manager') {
        navigate('/admin');
      } else {
        navigate('/');
      
    }
  };

  return (
    <div className="h-screen bg-linear-to-b from-[#035A54] from-50% to-white to-50% flex flex-col items-center justify-center gap-3 px-2">
      {currentPage === 0 ? (
        <LogIn changePage={pageFlip} onSuccess={handleSuccess} />
      ) : (
        <Register changePage={pageFlip} onSuccess={handleSuccess} />
      )}
    </div>
  );
};

// Login Page
export const LogIn = ({ changePage }: AuthProps) => {
  const dispatch = useAppDispatch();

  const { loading} = useAppSelector((state) => state.user);
  
  const userData: { email: string; password: string } = {
    email: '',
    password: ''
  };
  
  const [formData, setFormData] = React.useState<{ [key: string]: string }>(userData);
  const { addToast } = useToast();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isFormValid = () => {
    return Object.entries(formData).every(([_key, value]) => value.trim() !== "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const result = await dispatch(LoginThunk(formData)).unwrap();
      
      addToast({ message: result.message || 'Login successful', color: 'success' });
      
    } catch (error) {
      addToast({ 
        message: typeof error === 'string' ? error : 'Login failed', 
        color: 'danger' 
      });
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, rotateY: 100, x: -50, y: -10 }}
        animate={{ opacity: 1, rotateY: 0, x: 0, y: 0 }}
        exit={{ opacity: 0, rotateY: -100, x: -50, y: -10 }}
        transition={{ type: 'tween', duration: 0.5 }}
        className="flex flex-col items-center shadow-lg shadow-black px-4 py-2 bg-white rounded"
      >
        <img src={Logo} alt="Logo" className='w-[60%]' />
        <h1 className="text-center text-black font-black text-xs md:text-lg">
          MINIFY GADGETS LOGIN PAGE
        </h1>
      </motion.div>

      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.05, duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-3 items-center w-full md:w-[50%] p-4 bg-white border border-green-500 rounded-lg"
      >
        <div className="flex justify-around items-center gap-1 flex-col">
          <FaUser size={50} color='black' fontWeight={900} />
          <h1 className='text-black font-bold my-auto font-poppins text-xl'>LOG IN</h1>
        </div>

        <div className='w-full'>
          <SmartForm
            formControls={LoginFormFields}
            isLoading={loading}
            buttonText={"LOG IN"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            variant='solid'
            isBtnDisabled={!isFormValid() || loading}
            message='Logging In......'
          />
        </div>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
   
          <Typography component='h3' className='font-medium font-mono truncate'>
            Don't Have An Account?  
            <Button 
              variant='soft' 
              color='neutral' 
              className='cursor-pointer transition-all ml-2' 
              onClick={changePage}
              disabled={loading}
            >
              Sign Up
            </Button>
          </Typography>

  <Typography component='a' href='/' className='font-medium font-mono truncate text-center underline hover:text-green-600 transition-all cursor-pointer ' > 
            Proceed to Home
          </Typography>

        
        </Box>
      </motion.div>
    </>
  );
};

// Register Page
export const Register = ({ changePage }: AuthProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.user);
  
  const userData: { 
    first_name: string; 
    last_name: string; 
    phone_number: string; 
    email: string; 
    password: string; 
  } = {
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: ''
  };
  
  const [formData, setFormData] = React.useState<{ [key: string]: string }>(userData);
  const { addToast } = useToast();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const isFormValid = () => {
    return Object.entries(formData).every(([_key, value]) => value.trim() !== "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      await dispatch(RegisterThunk(formData)).unwrap();
      
      addToast({ message: 'Registered Successfully! Please login.', color: 'success' });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/accounts/login');
      }, 1500);
      
    } catch (error) {
      addToast({ 
        message: typeof error === 'string' ? error : 'Registration failed', 
        color: 'danger' 
      });
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, rotateY: 100, x: -50, y: -10 }}
        animate={{ opacity: 1, rotateY: 0, x: 0, y: 0 }}
        exit={{ opacity: 0, rotateY: -100, x: -50, y: -10 }}
        transition={{ type: 'tween', duration: 0.5 }}
        className="flex flex-col items-center shadow-lg shadow-black px-4 py-2 bg-white rounded"
      >
        <img src={Logo} alt="Logo" className='w-[60%]' />
        <h1 className="text-center text-black font-black text-xs md:text-lg">
          MINIFY GADGETS REGISTER PAGE
        </h1>
      </motion.div>

      <motion.div
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.05, duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-3 items-center w-full md:w-[50%] p-4 bg-white border border-green-500 rounded-lg"
      >
        <div className="flex justify-around items-center gap-1 flex-col">
          <FaUser size={50} color='black' fontWeight={900} />
          <h1 className='text-black font-bold my-auto font-poppins text-xl'>SIGN UP</h1>
        </div>

        <div className='w-full'>
          <SmartForm
            formControls={RegisterFormFields}
            isLoading={loading}
            buttonText={"SIGN UP"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            variant='solid'
            isBtnDisabled={!isFormValid() || loading}
            message='Signing Up......'
          />
        </div>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography component='h3' className='font-medium font-mono truncate'>
            Already Have An Account?  
            <Button 
              variant='soft' 
              color='neutral' 
              className='cursor-pointer transition-all ml-2' 
              onClick={changePage}
              disabled={loading}
            >
              Log In
            </Button>
          </Typography>
  <Typography component='a' href='/' className='font-medium font-mono truncate text-center underline hover:text-green-600 transition-all cursor-pointer ' > 
            Proceed to Home
          </Typography>

        </Box>
      </motion.div>







      
    </>
  );
};

export default Auth;