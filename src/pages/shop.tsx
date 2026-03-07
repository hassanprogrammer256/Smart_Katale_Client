import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {motion, type Variants} from 'framer-motion'
import {
  Typography,
  Grid,
  Box,
  Sheet,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/joy'; 

import SearchInput from '../components/common/searchInput';
import ProductCard from '../components/ui/product_card';
import { useAppDispatch, useAppSelector } from '../types/hooks.types';
import {  
  setSearchTerm, 
  setFilters, 
  setSortBy,
  clearFilters,
  applyFiltersAndSort,
  localSearch
} from '../Slices/productSlice';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';

const Shop: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Get state from Redux store
  const { 
    categories, 
    loading,
    searchTerm,
    filters,
    sortBy,
    products,
    filteredProducts
  } = useAppSelector((state) => state.products);

  // Local state for pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [showFilters, setShowFilters] = React.useState(false);

  
   const searchBarVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20 
    } 
  }
};

  // STEP 2: Handle search term from navigation
  useEffect(() => {
    if (location.state) {
      const { searchTerm: initialSearchTerm } = location.state;
      if (initialSearchTerm) {
     
        dispatch(setSearchTerm(initialSearchTerm));
        dispatch(localSearch(initialSearchTerm));
      }
    }
  }, [location.state, dispatch]);

  // STEP 3: Apply filters whenever searchTerm, filters, or sortBy changes
  useEffect(() => {
    if (products) {
      dispatch(applyFiltersAndSort());
    }
  }, [searchTerm, filters, sortBy, products, dispatch]);

  // STEP 4: Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, filteredProducts?.length]);

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current page items for pagination
  const getCurrentPageItems = () => {
    if (!filteredProducts) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Handler functions
  const handleSetSearchTerm = (term: string) => {
    dispatch(setSearchTerm(term));
    dispatch(localSearch(term));
  };

  const handleSetFilters = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const handleSetSortBy = (sort: string) => {
    dispatch(setSortBy(sort));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Get current items to display
  const displayedResults = getCurrentPageItems();
  const totalResults = filteredProducts?.length || 0;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Show loading state
  if (loading && !filteredProducts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
        <CircularProgress size="sm" variant='solid' color='success' />
      </Box>
    );
  }

  return (
    <>
    <AnimatePresence>
                <motion.div
                  variants={searchBarVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ scaleX: 0, opacity: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    originX: 0.5
                  }}
                >
      <Box sx={{ px: 2, pt: 5 , width:'100%'}}>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={handleSetSearchTerm}
          filters={filters}
          setFilters={handleSetFilters}
          sortBy={sortBy}
          setSortBy={handleSetSortBy}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories?.map(cat => cat) || []}
          totalResults={totalResults}
          onClearFilters={handleClearFilters}
          sortOptions={[
            { field: 'name', order: 'asc', label: 'Name (A to Z)' },
            { field: 'name', order: 'desc', label: 'Name (Z to A)' },
            { field: 'price', order: 'asc', label: 'Price (Low to High)' },
            { field: 'price', order: 'desc', label: 'Price (High to Low)' },
            { field: 'date', order: 'desc', label: 'Newest First' },
            { field: 'date', order: 'asc', label: 'Oldest First' },
          ]}
          itemsPerPageOptions={[5, 10, 15, 20, 30, 50,100,200]}
          hideFilters={false}
          status="all"
          onSearch={() => {
           
          }
        }
        />
      </Box>
</motion.div>
</AnimatePresence>
      {displayedResults.length > 0 ? (
        <>
          <Grid 
            container 
            spacing={{ xs: 2, md: 3 }} 
            sx={{ mb: 20, px: { xs: 1, md: 3 } }}
          >
            {displayedResults.map((item) => {
              return (
                <Grid 
                  key={item.id} 
                  xs={6}   
                  md={4}   
                  lg={2.4} 
                >
                  <ProductCard 
                    id={item.id}
                    name={item.name} 
                    price={item.price} 
                    image={item.image_url} 
                    discount={item.discount} 
                    description={item.description} 
                    status={item.status}
                  />
                </Grid>
              );
            })}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2, 
              flexWrap: 'wrap', 
              mt: 4, 
              mb: 4 
            }}>
              {totalPages > 1 && (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 2, 
    flexWrap: 'wrap', 
    mt: 4, 
    mb: 4 
  }}>
    <Typography level="body-sm" textColor="text.secondary">
      Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} items
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={() => handlePageChange(null as any, currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </IconButton>
      
      <Typography level="body-sm">
        Page {currentPage} of {totalPages}
      </Typography>
      
      <IconButton
        size="sm"
        variant="outlined"
        onClick={() => handlePageChange(null as any, currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  </Box>
)}
            </Box>
          )}
        </>
      ) : (
        <Sheet variant="soft" color="neutral" sx={{ p: 4, textAlign: 'center', borderRadius: 'md', mx: 3 }}>
          <Typography level="h4">No products found</Typography>
          <Typography level="body-md">
            {products?.length === 0 
              ? "No products available at the moment. Please check back later."
              : "Try adjusting your search or filter criteria"}
          </Typography>
          {(searchTerm || filters.category || filters.minPrice || filters.maxPrice || filters.status) && (
            <Button 
              variant="solid" 
              color="success" 
              onClick={handleClearFilters}
              sx={{ mt: 2 }}
            >
              Clear All Filters
            </Button>
          )}
        </Sheet>
      )}
    </>
  );
};

export default Shop;