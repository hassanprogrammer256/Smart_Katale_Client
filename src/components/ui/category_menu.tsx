// components/ui/category_menu.tsx
import React from 'react';
import { Box, Typography } from '@mui/joy';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import type { CategoryMenuProps } from '../../interfaces/ui.interfaces';



const CategoryMenu: React.FC<CategoryMenuProps> = ({
  hoveredCategory,
  setHoveredCategory,
  hoveredBrand,
  setHoveredBrand,
  onClose
}) => {
  const navigate = useNavigate();

  // Get the category brands mapping from Redux
  const categoryBrandsMapping = useSelector((state: RootState) => state.products.category_brands_mapping);

  // Create a lookup object for O(1) brand access
  const brandsByCategory = React.useMemo(() => {
    if (!categoryBrandsMapping) {
      return {};
    }
    
    return categoryBrandsMapping.reduce((acc: Record<string, string[]>, item:any) => {
      acc[item.cat] = item.brands;
      return acc;
    }, {});
  }, [categoryBrandsMapping]);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
    onClose();
  };

  const handleBrandClick = (brandName: string) => {
    navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
    onClose();
  };

  // Don't render if no categories
  if (!categoryBrandsMapping || categoryBrandsMapping.length === 0) {
    return null;
  }

  // Simplified menu animation
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -5,
      transition: { duration: 0.15 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.02
      }
    },
    exit: { 
      opacity: 0, 
      y: -5,
      transition: { duration: 0.1 }
    }
  };

  // Simple fade-in for items
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.15 }
    }
  };

  // Simplified submenu animation
  const submenuVariants = {
    hidden: { 
      opacity: 0, 
      x: -5
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      x: 5,
      transition: { duration: 0.15 }
    }
  };

  // Brand item with subtle hover animation
  const brandItemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.1 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 1000,
        minWidth: '560px',
        marginTop: '8px',
      }}
      // FIX: Keep menu open when hovering over it
      onMouseEnter={() => {
        // Keep the current hovered category active
        // This prevents closing when moving from category to brands
      }}
      onMouseLeave={() => {
        // Close the menu when mouse leaves the entire menu
        setHoveredCategory(null);
        setHoveredBrand(null);
        onClose();
      }}
    >
      <Box
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', minHeight: '450px' }}>
          {/* Categories Column */}
          <Box sx={{ 
            width: '280px', 
            borderRight: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: '#fafafa'
          }}>
            {categoryBrandsMapping.map((category: {cat: string, brands: string[]}) => (
              <motion.div
                key={category.cat}
                variants={itemVariants}
                onHoverStart={() => setHoveredCategory(category.cat)}
                onHoverEnd={() => {
                  // Only clear if we're not hovering over the brands submenu
                  // This is handled by the parent's onMouseLeave
                }}
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  backgroundColor: hoveredCategory === category.cat ? '#f0f7f6' : 'transparent',
                  borderLeft: hoveredCategory === category.cat ? '3px solid #035A54' : '3px solid transparent',
                  transition: 'background-color 0.2s ease, border-left 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => handleCategoryClick(category.cat)}
              >
                <Typography 
                  level="body-md"
                  sx={{ 
                    fontWeight: hoveredCategory === category.cat ? 600 : 400,
                    color: hoveredCategory === category.cat ? '#035A54' : 'inherit',
                    transition: 'color 0.2s ease, font-weight 0.2s ease'
                  }}
                >
                  {category.cat}
                </Typography>
                {category.brands?.length > 0 && (
                  <motion.div
                    animate={{ 
                      x: hoveredCategory === category.cat ? 3 : 0,
                      color: hoveredCategory === category.cat ? '#035A54' : '#999'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronRight size={12} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </Box>

          {/* Brands Submenu */}
          <AnimatePresence>
            {hoveredCategory && brandsByCategory[hoveredCategory]?.length > 0 && (
              <motion.div
                variants={submenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  width: '280px',
                  backgroundColor: 'white',
                  padding: '16px',
                  overflowY: 'auto',
                  maxHeight: '450px',
                }}
                // FIX: Keep hoveredCategory active when hovering over brands
                onMouseEnter={() => {
                  // Ensure the category remains active
                  setHoveredCategory(hoveredCategory);
                }}
              >
                <Typography 
                  level="title-sm" 
                  sx={{ 
                    mb: 2, 
                    color: '#035A54',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {hoveredCategory}
                </Typography>
                
                {/* Brands container with staggered children */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.02,
                        delayChildren: 0.05
                      }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {brandsByCategory[hoveredCategory].map((brand: string, index: number) => (
                      <motion.div
                        key={`${brand}-${index}`}
                        variants={brandItemVariants}
                        whileHover="hover"
                        onHoverStart={() => setHoveredBrand(brand)}
                        onHoverEnd={() => setHoveredBrand(null)}
                        style={{
                          cursor: 'pointer',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: hoveredBrand === brand ? '#f0f7f6' : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                        onClick={() => handleBrandClick(brand)}
                      >
                        <Typography 
                          level="body-sm"
                          sx={{ 
                            fontWeight: hoveredBrand === brand ? 500 : 400,
                            color: hoveredBrand === brand ? '#035A54' : 'inherit',
                            transition: 'color 0.2s ease, font-weight 0.2s ease'
                          }}
                        >
                          {brand}
                        </Typography>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </motion.div>
  );
};

export default CategoryMenu;