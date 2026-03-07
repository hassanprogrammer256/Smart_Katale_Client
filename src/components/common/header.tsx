import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Logo from '/images/mini_logo.png';
import { FaBars, FaShoppingCart, FaTimes, FaUser, FaSignOutAlt, FaUserPlus, FaCogs, FaHome } from 'react-icons/fa';
import MenuDropDown from "../ui/menu_dropdown";
import Avatar from "@mui/joy/Avatar";
import { Badge, IconButton, Drawer, Typography, Button } from '@mui/joy'; // Add Button here
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../types/hooks.types';
import { useToast } from '../../utils/toast-context';
import { LogoutThunk } from '../../Slices/userSlice';
import CategoryMenu from '../ui/category_menu';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const Header = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // Auth state
  const { is_authenticated, role, first_name } = useAppSelector((state) => state.user);
   const categoryBrandsMapping = useSelector((state: RootState) => state.products.category_brands_mapping);
  
  // Cart state
  const cartTotalItems = useAppSelector((state) => state.cart?.items.length || 0);
  
  
  // Local state
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const headerTop = document.getElementById('header-top');
      if (headerTop) {
        const rect = headerTop.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    
    try {
      await dispatch(LogoutThunk()).unwrap();
      addToast({ message: 'Logged out successfully', color: 'success' });
      navigate('/accounts');
    } catch (error) {
      addToast({ message: 'Logout failed', color: 'danger' });
    }
  };

  // Prepare auth menu items with actual functions
  const authMenuItems = {
    items: [
      {
        name: location.pathname !== '/my-profile' ||  role === '/admin' ? "My Profile" : 'Home',
        to: location.pathname !== "/" ? '/':'/my-profile',
        icon: location.pathname !== 'my-profile' ? FaUser : FaHome,
      },
      ...(role === 'manager' ? [{
        name: "Admin Dashboard",
        to: "/admin",
        icon: FaCogs,
      }] : [])
    ],
    action_btns: is_authenticated ? [
      {
        title: "Log Out",
        icon: FaSignOutAlt,
        function: handleLogout,
        color: 'danger' as const
      }
    ] : []
  };

  const nonAuthMenuItems = {
    items: [
      {
        name: "Login",
        to: "/accounts/login",
        icon: FaUser,
      },
      {
        name: "Sign Up",
        to: "/accounts/register",
        icon: FaUserPlus,
      },
    ],
  };

  // Animation variants
const headerVariants: Variants = {
  hidden: { 
    y: -100, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.25,
      duration: 0.5,
      delay: 0.1
    }
  }
};

  return (
    <motion.div
      id="header-top"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: isSticky ? 'rgba(255, 255, 255, 0.95)' : 'white',
        backdropFilter: isSticky ? 'blur(10px)' : 'none',
        boxShadow: isSticky ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
        width: '100%',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: 1
      }}>
        {/* Top bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 1
        }}>
          {/* Left side - Logo and Menu */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Mobile menu toggle */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
              variant="plain"
              color="neutral"
            >
              <FaBars size={20} />
            </IconButton>
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                position: 'relative'
              }}
              onMouseEnter={() => {setCategoryMenuOpen(true)}}
              onMouseLeave={() => {
                setCategoryMenuOpen(false);
                setHoveredCategory(null);
                setHoveredBrand(null);
              }}
            >
              <Button
                variant="soft"
                color="success"
                startDecorator={<FaBars />}
                sx={{
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                Categories
              </Button>
              
              {/* Category Menu Dropdown */}
              <AnimatePresence>
                {categoryMenuOpen && (
                  <CategoryMenu
                    hoveredCategory={hoveredCategory}
                    setHoveredCategory={setHoveredCategory}
                    hoveredBrand={hoveredBrand}
                    setHoveredBrand={setHoveredBrand}
                    onClose={() => setCategoryMenuOpen(false)}
                  />
                )}
              </AnimatePresence>
            </Box>

            {/* Logo */}
            <motion.a 
              href={role !== 'manager' ? '/' : '/admin'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={Logo}
                alt="Minify Gadgets"
                style={{
                  width: '60px',
                  cursor: 'pointer'
                }}
              />
            </motion.a>
          </Box>
          
          {/* Right side - Account and Cart */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* User Menu */}
            <MenuDropDown
              component={
                is_authenticated ? (
                  <Avatar 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    {first_name?.[0] || <FaUser />}
                  </Avatar>
                ) : (
                  <Avatar 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  />
                )
              }
              menu_items={is_authenticated ? authMenuItems.items : nonAuthMenuItems.items}
              action_button={is_authenticated ? authMenuItems.action_btns : []}
            />

            {/* Cart Icon */}
            {role !== 'manager' && <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box 
                sx={{ 
                  position: 'relative', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => navigate('/cart')}
              >
                <FaShoppingCart size={24} color="#035A54" />
                <AnimatePresence>
                  {cartTotalItems > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                      }}
                    >
                      <Badge 
                        badgeContent={cartTotalItems} 
                        color="success"
                        size="sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>}
          </Box>
        </Box>
      </Box>

      {/* Mobile Menu Drawer */}
      {role !== 'manager' && <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        anchor="left"
        size="md"
        sx={{
          '--Drawer-horizontalSize': '300px',
          '--Drawer-transitionDuration': '0.3s',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography level="h4">Menu</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <FaTimes />
            </IconButton>
          </Box>
          
 
<Typography level="title-lg" sx={{ mb: 1, color: '#035A54' }}>
  Categories
</Typography>
<Box sx={{ mb: 3 }}>
  {categoryBrandsMapping?.map((category: {cat: string, brands: string[]}, index: number) => (
    <Box key={index} sx={{ mb: 2 }}>
      <Typography 
        level="title-md" 
        sx={{ 
          cursor: 'pointer',
          fontWeight: 600,
          '&:hover': { color: '#035A54' }
        }}
        onClick={() => {
          navigate(`/shop?category=${encodeURIComponent(category.cat)}`);
          setMobileMenuOpen(false);
        }}
      >
        {category.cat}
      </Typography>
      <Box sx={{ pl: 2, mt: 1 }}>
        {category.brands.map((brand: string, brandIndex: number) => (
          <Typography
            key={`${brand}-${brandIndex}`}
            level="body-md"
            sx={{ 
              cursor: 'pointer',
              py: 0.5,
              '&:hover': { color: '#035A54' }
            }}
            onClick={() => {
              navigate(`/shop?brand=${encodeURIComponent(brand)}`);
              setMobileMenuOpen(false);
            }}
          >
            {brand}
          </Typography>
        ))}
      </Box>
    </Box>
  ))}
</Box>
          {/* Mobile Auth Links */}
          <Typography level="title-lg" sx={{ mb: 1, color: '#035A54' }}>
            Account
          </Typography>
          {is_authenticated ? (
            <>
              <Typography 
                level="body-md"
                sx={{ 
                  cursor: 'pointer',
                  py: 1,
                  '&:hover': { color: '#035A54' }
                }}
                onClick={() => {
                  navigate('/my-profile');
                  setMobileMenuOpen(false);
                }}
              >
                My Profile
              </Typography>
              {role === 'manager' && (
                <Typography 
                  level="body-md"
                  sx={{ 
                    cursor: 'pointer',
                    py: 1,
                    '&:hover': { color: '#035A54' }
                  }}
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  Admin Dashboard
                </Typography>
              )}
              <Typography 
                level="body-md"
                sx={{ 
                  cursor: 'pointer',
                  py: 1,
                  color: 'danger',
                  '&:hover': { color: '#d32f2f' }
                }}
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Typography>
            </>
          ) : (
            <>
              <Typography 
                level="body-md"
                sx={{ 
                  cursor: 'pointer',
                  py: 1,
                  '&:hover': { color: '#035A54' }
                }}
                onClick={() => {
                  navigate('/accounts/login');
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </Typography>
              <Typography 
                level="body-md"
                sx={{ 
                  cursor: 'pointer',
                  py: 1,
                  '&:hover': { color: '#035A54' }
                }}
                onClick={() => {
                  navigate('/accounts/register');
                  setMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Typography>
            </>
          )}
        </Box>
      </Drawer>}
    </motion.div>
  );
};

export default Header;