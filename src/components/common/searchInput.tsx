import React, { useState, useEffect } from 'react';
import {
  Box,
  Sheet,
  FormControl,
  FormLabel,
  Select,
  Option,
  Input,
  Button,
  Stack,
  Chip,
  Grid,
  IconButton,
  Typography,
  Autocomplete,
} from '@mui/joy';
import { Search, FilterList, Sort, Close } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import type { FilterState } from '../../types/search';
import { useAppSelector } from '../../types/hooks.types';
import type { SearchInputProps, SearchSuggestion } from '../../interfaces/search.interfaces';

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  itemsPerPage,
  setItemsPerPage,
  showFilters,
  setShowFilters,
  categories,
  totalResults,
  onClearFilters,
  sortOptions,
  itemsPerPageOptions,
  hideFilters = false,
  onSearch
}) => {
  const location = useLocation();
  const isShopPage = location.pathname === '/shop';
  const [loading, setLoading] = React.useState(false);
  
  // Get products from Redux store for autocomplete suggestions
  const { products } = useAppSelector((state) => state.products);
  
  // State for autocomplete suggestions
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [inputValue, setInputValue] = useState(searchTerm);
  const [open, setOpen] = useState(false);

  // Update input value when searchTerm prop changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Generate suggestions based on input value
  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const searchLower = inputValue.toLowerCase();
      const newSuggestions: SearchSuggestion[] = [];

      if (products) {
        // Category suggestions from products
        const categorySet = new Set<string>();
        products.forEach((p: any) => {
          if (p.category && typeof p.category === 'string' && p.category.toLowerCase().includes(searchLower)) {
            categorySet.add(p.category);
          }
        });
        Array.from(categorySet).slice(0, 3).forEach(cat => {
          newSuggestions.push({
            id: `category-${cat}`,
            label: `Category: ${cat}`,
            type: 'category' as const,
            value: cat
          });
        });
        
        // Brand suggestions from products
        const brandSet = new Set<string>();
        products.forEach((p: any) => {
          if (p.brand && typeof p.brand === 'string' && p.brand.toLowerCase().includes(searchLower)) {
            brandSet.add(p.brand);
          }
        });
        Array.from(brandSet).slice(0, 3).forEach(brand => {
          newSuggestions.push({
            id: `brand-${brand}`,
            label: `Brand: ${brand}`,
            type: 'brand' as const,
            value: brand
          });
        });
      }

      // Add category suggestions from categories prop
      categories
        .filter(cat => cat.toLowerCase().includes(searchLower))
        .slice(0, 3)
        .forEach(cat => {
          // Avoid duplicates
          if (!newSuggestions.some(s => s.type === 'category' && s.value === cat)) {
            newSuggestions.push({
              id: `cat-${cat}`,
              label: `Category: ${cat}`,
              type: 'category' as const,
              value: cat
            });
          }
        });

      setSuggestions(newSuggestions.slice(0, 10)); // Limit to 10 suggestions
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [inputValue, products, categories]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters({
      ...filters,
      [key]: value === '' ? '' : typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    });
  };

  // Handle search submission
  const handleSearch = async () => {
    setLoading(true);
    try {
      setSearchTerm(inputValue);
      
      if (onSearch) {
        await onSearch(); // Wait for the search to complete
      } 
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (
    _event: React.SyntheticEvent,
    value: SearchSuggestion | string | null
  ) => {
    if (typeof value === 'string') {
      // Free text input
      setInputValue(value);
      setSearchTerm(value);
    } else if (value) {
      // Selected from suggestions
      setInputValue(value.label.replace(/^(Product:|Category:|Brand:)\s*/, ''));
      setSearchTerm(value.label.replace(/^(Product:|Category:|Brand:)\s*/, ''));
    
      if (value.type === 'category' && isShopPage) {
        handleFilterChange('category', value.value);
      }
      
      // If it's a brand, optionally set the brand filter
      if (value.type === 'brand' && isShopPage) {
        handleFilterChange('brand', value.value);
      }
    }
    setOpen(false);
  };

  // Handle key press (Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
      {/* Search Bar */}
      <Sheet sx={{ p: 0, borderRadius: 'md', width: '100%', marginBottom: 4, backgroundColor: 'transparent' }} variant="plain">
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Autocomplete
              placeholder="Search products, categories, brands..."
              value={inputValue}
              onInputChange={(_, newValue) => setInputValue(newValue)}
              inputValue={inputValue}
              options={suggestions}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option.label;
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof value === 'string') return false;
                return option.id === value?.id;
              }}
              onChange={handleSuggestionSelect}
              onKeyPress={handleKeyPress}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              open={open && suggestions.length > 0}
              loading={loading}
              freeSolo
              autoComplete={false}
              startDecorator={<Search />}
              size="lg"
              sx={{ flex: 1 }}
              renderOption={(props, option) => {
                  const { key, ...otherProps } = props as any; 
                return (
                  <li key={key} {...otherProps}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography level="body-sm">
                        {option.label}
                      </Typography>
                      <Typography level="body-xs" textColor="text.secondary">
                        {option.type === 'product' && 'Product'}
                        {option.type === 'category' && 'Category'}
                        {option.type === 'brand' && 'Brand'}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
              // Fix: Use slots and slotProps instead of renderInput
              slots={{
                input: Input,
              }}
              slotProps={{
                input: {
                  placeholder: "Search products, categories, brands...",
                  startDecorator: <Search />,
                  // size: "lg",
                  sx: { flex: 1 }
                }
              }}
            />
            
            <Button 
              variant="solid" 
              color="success"
              loading={loading}
              onClick={handleSearch}
              startDecorator={<Search />}
              size="lg"
            >
              Search
            </Button>
          </Box>
   
          {isShopPage && !hideFilters && (
            <>
              <Box sx={{ display: 'flex', marginBottom: 3, gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button
                  variant={showFilters ? 'solid' : 'outlined'}
                  color="success"
                  startDecorator={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                
                <FormControl sx={{ minWidth: 200 }}>
                  <FormLabel>Sort By</FormLabel>
                  <Select
                    value={sortBy}
                    onChange={(_, value) => value && setSortBy(value)}
                    startDecorator={<Sort />}
                  >
                    {sortOptions?.map((option, index) => (
                      <Option key={index} value={`${option.field}-${option.order}`}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 120 }}>
                  <FormLabel>Items per page</FormLabel>
                  <Select
                    value={itemsPerPage}
                    onChange={(_, value) => value && setItemsPerPage(value)}
                  >
                    {itemsPerPageOptions?.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </FormControl>
            
                {totalResults > 0 && (
                  <Typography level="body-sm" sx={{ ml: 'auto' }}>
                    {totalResults} items found
                  </Typography>
                )}
              </Box>

              {/* Filters Panel */}
              {showFilters && (
                <Sheet sx={{ p: 2, borderRadius: 'md', bgcolor: 'background.level1' }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography level="title-md">Filter Options</Typography>
                      <IconButton size="sm" onClick={() => setShowFilters(false)}>
                        <Close />
                      </IconButton>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6} md={3}>
                        <FormControl>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={filters.category}
                            onChange={(_, value) => handleFilterChange('category', value || '')}
                          >
                            <Option value="">All Categories</Option>
                            {categories.map(cat => (
                              <Option key={cat} value={cat}>{cat}</Option>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={6} md={3}>
                        <FormControl>
                          <FormLabel>Min Price (UGX)</FormLabel>
                          <Input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            slotProps={{ input: { min: 0 } }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={6} md={3}>
                        <FormControl>
                          <FormLabel>Max Price (UGX)</FormLabel>
                          <Input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            slotProps={{ input: { min: 0 } }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={6} md={3}>
                        <FormControl>
                          <FormLabel>Status</FormLabel>
                          <Select
                            value={filters.status}
                            onChange={(_, value) => handleFilterChange('status', value || '')}
                          >
                            <Option value="">Any</Option>
                            <Option value='Brand new'>Brand New</Option>
                            <Option value='Uk Used'>Uk Used</Option>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="plain" color="neutral" onClick={onClearFilters}>
                        Clear All Filters
                      </Button>
                    </Box>
                  </Stack>
                </Sheet>
              )}

              {/* Active Filters Chips */}
              {(filters.category || filters.minPrice || filters.maxPrice || searchTerm) && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {searchTerm && (
                    <Chip 
                      variant="soft" 
                      color="primary"
                    >
                      Search: "{searchTerm}"
                    </Chip>
                  )}
                  {filters.category && (
                    <Chip 
                      variant="soft" 
                      color="primary"
                    >
                      Category: {filters.category}
                    </Chip>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Chip 
                      variant="soft" 
                      color="primary"
                    >
                      Price: {filters.minPrice && `UGX ${Number(filters.minPrice).toLocaleString()}`} 
                      {filters.minPrice && filters.maxPrice && ' - '} 
                      {filters.maxPrice && `UGX ${Number(filters.maxPrice).toLocaleString()}`}
                    </Chip>
                  )}
                </Box>
              )}
            </>
          )}
        </Stack>
      </Sheet>
    </Box>
  );
};

export default SearchInput;