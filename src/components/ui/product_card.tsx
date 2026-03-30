import React, { useState, useEffect } from 'react';
import {
  Card,

  CardContent,
  Typography,
  AspectRatio,
  Box,
  Chip,
  IconButton,
  ButtonGroup, Button 
} from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useToast } from '../../utils/toast-context';
import { useAppDispatch, useAppSelector } from '../../types/hooks.types';
import { addToCart, removeFromCart, updateQuantity} from '../../Slices/CartSlice';
import type { ProductCardProps } from '../../interfaces/products.interfaces';
import type { CartItem } from '../../interfaces/cart.interfaces';




const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  discount,
  description,
  status = '',
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const cartItems = useAppSelector((state) => state.cart.items);
 
  
  // Find if product is in cart and get its quantity
  const cartItem = cartItems.find((item:any) => item.id === id.toString());
  const [inCart, setInCart] = useState(!!cartItem);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  
  // Image states
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Update local state when cart changes
  useEffect(() => {
    const currentCartItem = cartItems.find((item:any) => item.id === id.toString());
    setInCart(!!currentCartItem);
    if (currentCartItem) {
      setQuantity(currentCartItem.quantity);
    }
  }, [cartItems, id]);

  // Construct the full image URL
  const getImageUrl = () => {
    if (!image || image === 'products/default.jpg') {
      return '/placeholder-image.jpg';
    }
    
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const cleanPath = image.replace(/^\.\.\/|^\.\/|^\//, '');
    return `${baseUrl}/media/${cleanPath}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', getImageUrl());
    setImageError(true);
    e.currentTarget.src = '/placeholder-image.jpg';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCardClick = () => {
    navigate(`/product-details/${id}`);
  };

  const handleAddToCart = async () => {
    try {
      if (!name || !price) {
        addToast({ message: 'Product information is incomplete', color: 'danger' });
        return;
      }

      const cartItem: CartItem = {
        id: id.toString(),
        name: name,
        price: price,
        quantity: 1,
        discount: discount || 0,
        image: getImageUrl(),
        
      };

      dispatch(addToCart(cartItem));
      addToast({ message: 'Added to cart', color: 'success' });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      addToast({ message: 'Failed to add to cart', color: 'danger' });
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: id.toString(), quantity: newQuantity }));
    addToast({ message: 'Quantity increased', color: 'neutral' });
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
  
      handleRemoveFromCart();
    } else {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(updateQuantity({ id: id.toString(), quantity: newQuantity }));
      addToast({ message: 'Quantity decreased', color: 'warning' });
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(id.toString()));
    setQuantity(1);
    addToast({ message: 'Removed from cart', color: 'neutral' });
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 280,
        minWidth: 150,
        margin: 'auto',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 'lg',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <AspectRatio ratio="1" sx={{ width: '100%' }}>
        <img
          src={imageError ? '/placeholder-image.jpg' : getImageUrl()}
          alt={name || 'Product'}
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
          onClick={handleCardClick}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            opacity: imageLoaded ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        />
        {!imageLoaded && !imageError && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography level="body-sm">Loading...</Typography>
          </Box>
        )}
      </AspectRatio>

  
      {discount?discount > 0 && (
        <Chip
          size="md"
          variant="solid"
          color="danger"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          -{discount}%
        </Chip>
      ): null}
      {status && status !== ''  && (
        <Chip
          size="md"
          variant="soft"
          color= {status=== 'Brand new' ? "success" : "danger"}
          sx={{
            position: 'absolute',
            top: 10,
            left: 8,
            zIndex: 1,
          }}
        >
          {status}
        </Chip>
      )}
     
      {/* Product Info */}
      <CardContent sx={{ 
        bgcolor: 'rgba(0,0,0,0.7)', 
        color: 'white',
         p: 1.5,
        flex: 1,
      }}>
        <Typography level="title-md" textColor="white" noWrap>
          {name || 'Unnamed Product'}
        </Typography>
        
       
        
        {/* Description (truncated) */}
        {description && (
          <Typography 
            level="body-sm" 
            textColor="neutral.300" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              minHeight: '40px',
            }}
          >
            {description}
          </Typography>
        )}
        
        {/* Price */}
        <Typography level="title-lg" textColor="success.300" sx={{ mt: 1 }}>
          UGX {price?.toLocaleString() || 'UGX: 0'}
        </Typography>
      </CardContent>

      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        {inCart ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { md: 'row', xs: 'column' },
            alignItems: 'center', 
            gap: 1,
            justifyContent: 'space-between'
          }}>
            <ButtonGroup 
              size="sm" 
              variant="outlined"
              sx={{ flex: 1 }}
            >
              <Button
                variant='solid'
                color='danger'
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 0}
                sx={{ minWidth: 36 }}
              >
                -
              </Button>
              <Button 
                disabled 
                sx={{ 
                  minWidth: 40,
                  fontWeight: 'bold',
                  bgcolor: 'background.level1'
                }}
              >
                {quantity}
              </Button>
              <Button 
                variant='solid' 
                color='success'
                onClick={handleIncreaseQuantity}
                sx={{ minWidth: 36 }}
              >
                +
              </Button>
            </ButtonGroup>

            <IconButton 
              color="danger" 
              variant="plain"
              onClick={handleRemoveFromCart}
              size="sm"
              sx={{ 
                '&:hover': { 
                  bgcolor: 'danger.softBg',
                  color: 'danger.plainColor'
                }
              }}
            >
              <FaTrash size={16} />
            </IconButton>
          </Box>
        ) : (
          <Button 
            variant='soft' 
            color='success' 
            onClick={handleAddToCart}
            fullWidth
            sx={{
              fontWeight: 'md',
              '&:hover': {
                bgcolor: 'success.softHoverBg',
              }
            }}
          >
            Add to Cart
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;