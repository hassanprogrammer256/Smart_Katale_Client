import Footer from '../components/common/footer';
import Header from '../components/common/header';
import { Outlet} from 'react-router-dom';
import HorizontalProductSwiper from '../components/common/product_carousel';
import { Box, CircularProgress, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import { FetchAllProductsThunk } from '../Slices/productSlice';
import { useAppDispatch, useAppSelector } from '../types/hooks.types';
import DynamicBreadcrumb from '../components/ui/bread_crumb';

const TRENDING_TITLES = [
  "Hot Picks 🔥",
  "Best Sellers ⭐",
  "Just For You 🎯",
  "Popular Choices 👍",
  "Customer Favorites ❤️",
  "Top Rated 🏆",
  "New Arrivals 🆕",
  "Limited Offers ⏳",
  "Today's Deals 💰",
  "Recommended ✨",
  "Trending Now 📈",
  "Most Wanted 🎁",
  "Special Collection 🎨",
  "Flash Sale ⚡",
];

const Home = () => {
  const dispatch = useAppDispatch();
  
  const { products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { loading: userLoading } = useAppSelector((state) => state.user);
  const [productRows, setProductRows] = useState<any[]>([]);

  useEffect(() => {
    dispatch(FetchAllProductsThunk(2021));
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      generateRandomRows();
    }
  }, [products]);

  const generateRandomRows = () => {
    if (!products || products.length === 0) {
      console.log('Home: Cannot generate rows - no products');
      return;
    }

    const rows = [];
    const numberOfRows = 7;
    
    // Shuffle products to get random selections
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numberOfRows; i++) {
      // Get random products for this row
      const startIdx = (i * 15) % products.length;
      const rowProducts = [];
      
  
      for (let j = 0; j < 15; j++) {
        const idx = (startIdx + j) % products.length;
        rowProducts.push(shuffledProducts[idx]);
      }

      // Get random title
      const randomTitleIndex = Math.floor(Math.random() * TRENDING_TITLES.length);
      
      rows.push({
        id: `row-${i}-${Date.now()}-${Math.random()}`,
        title: TRENDING_TITLES[randomTitleIndex],
        products: rowProducts,
      });
    }

    setProductRows(rows);
  };

  // Show loading state
  if (productsLoading || userLoading) {
    return (
      <>
        <Header />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          gap: 2
        }}>
          <CircularProgress size="sm" variant="solid" color="success" />
          <Typography level="body-sm" component={'h4'}>
           Loading.....
          </Typography>
        </Box>
        <Footer />
      </>
    );
  }

  if (!products || products.length === 0) {
    return (
      <>
        <Header />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          gap: 2
        }}>
          <Typography level="h3">No Products Available</Typography>
          <Typography level="body-lg">Please check back later or try refreshing the page.</Typography>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ mt: 4, mb: 4 }}><DynamicBreadcrumb />
        <Outlet />
        {/* Product rows */}
        {productRows.length > 0 ? (
          productRows.map((row) => (
            <Box key={row.id} sx={{ mb: 6 }}>
              <HorizontalProductSwiper
                title={row.title}
                products={row.products}
                slidesPerView={5}
                spaceBetween={16}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size="sm" sx={{ mt: 2 }} />
          </Box>
        )}
      </Box>
      
      <Footer />
    </>
  );
};

export default Home;