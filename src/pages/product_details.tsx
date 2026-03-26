import { Box, Button, Card, CardContent, Grid, Typography, Chip, Divider, ButtonGroup, CircularProgress } from '@mui/joy';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../types/hooks.types';
import { useToast } from '../utils/toast-context';
import { FaShoppingCart, FaHeart, FaShare, FaHome } from 'react-icons/fa';
import type { Product } from '../types/product.types';
// import Rating from '@mui/material/Rating';
import ProductCard from '../components/ui/product_card';
import { addToCart, updateQuantity } from '../Slices/CartSlice';
import type { CartItem } from '../interfaces/cart.interfaces';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, _setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const products = useAppSelector((state) => state.products.products);
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Check if product is in cart
  const cartItem = cartItems.find((item:any) => item.id === id);
  const [isInCart, setIsInCart] = useState(!!cartItem);

  useEffect(() => {
    if (products && id) {
      const found = products.find(p => p.id.toString() === id.toString());
      if (found) {
        setProduct(found);

        // Get related products (same category, excluding current)
        const related = products
          .filter(p => p.category === found.category && p.id.toString() !== id.toString())
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
  }, [products, id]);

  // Update isInCart when cart changes
  useEffect(() => {
    setIsInCart(!!cartItem);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem, id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem: CartItem = {
      id: product.id.toString(),
      name: product.name || '',
      price: product.price || 0,
      quantity: quantity,
      discount: product.discount || 0,
      image: product.image_url
    };

    dispatch(addToCart(cartItem));
    addToast({ color: 'neutral', message: 'Product added to cart successfully!' });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (!product) return;
    
    if (newQuantity <= 0) {
      // Remove from cart if quantity becomes 0
      dispatch(updateQuantity({ id: product.id.toString(), quantity: 0 }));
      setQuantity(1);
      addToast({ color: 'neutral', message: 'Product removed from cart' });
    } else {
      dispatch(updateQuantity({ id: product.id.toString(), quantity: newQuantity }));
      setQuantity(newQuantity);
      addToast({ color: 'warning', message: 'Cart updated' });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  // Get image URL helper function
  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath === 'products/default.jpg') {
      return '/placeholder-image.jpg';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const cleanPath = imagePath.replace(/^\.\.\/|^\.\/|^\//, '');
    return `${baseUrl}/media/${cleanPath}`;
  };

  const images = [
    product?.image_url,
    ...(product?.additional_images || [])
  ].filter(Boolean);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography level="h3">Product not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/shop')}>
          Back to Shop
        </Button>
      </Box>
    );
  }

  const discountedPrice:number =  product ? product.price || 0* (1 - (product.discount || 0) / 100) : 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Breadcrumb */}
    <Typography 
  level="body-sm" 
  sx={{ 
    mb: 3,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 0.5,
    '& .breadcrumb-item': {
      cursor: 'pointer',
      color: '#004526',
      display: 'inline-flex',
      alignItems: 'center',
      transition: 'color 0.2s',
      '&:hover': {
        color: '#035A54',
        textDecoration: 'underline',
      }
    },
    '& .separator': {
      color: '#999',
      mx: 0.5,
    },
    '& .current': {
      color: '#666',
      fontWeight: 500,
    }
  }}
>
  <span 
    className="breadcrumb-item" 
    onClick={() => navigate('/')}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
  >
    <FaHome size={14} />
    <span style={{ marginLeft: 2 }}>Home</span>
  </span>
  <span className="separator">/</span>
  
  <span 
    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
    className="breadcrumb-item" 
    onClick={() => navigate('/shop')}
  >
   <FaShoppingCart size={14} /> Shop
  </span>
  <span className="separator">/</span>

 
  
  <span className="current" style={{ 
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block'
  }}>
    {product.name}
  </span>
</Typography>

      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            {/* Main Image */}
            <Box sx={{ 
              width: '100%', 
              height: 400, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1
            }}>
              <img 
                src={images[selectedImage] ? getImageUrl(images[selectedImage]) : '/placeholder-image.jpg'} 
                alt={product.name}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain',
                  padding: '1rem'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Right Column - Details */}
        <Grid xs={12} md={6}>
          <Typography level="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {/* <Rating value={product.rating || 0} readOnly size="small" /> */}
            <Typography level="body-sm" sx={{ color: '#666' }}>
              ({product.reviews_count || 0} reviews)
            </Typography>
            <Chip 
              color={product.stock ? 'success' : 'danger'} 
              size="sm"
              variant="soft"
            >
              {product.stock ? 'In Stock' : 'Out of Stock'}
            </Chip>
          </Box>

          <Box sx={{ mb: 3 }}>
            {product.discount ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography level="h3" sx={{ color: '#004526', fontWeight: 'bold' }}>
                  UGX {discountedPrice.toLocaleString()}
                </Typography>
                <Typography level="body-lg" sx={{ textDecoration: 'line-through', color: '#999' }}>
                  UGX {product.price?.toLocaleString()}
                </Typography>
                <Chip color="danger" size="sm" variant="solid">
                  Save {product.discount}%
                </Chip>
              </Box>
            ) : (
              <Typography level="h3" sx={{ color: '#004526', fontWeight: 'bold' }}>
                UGX {product.price?.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Product Details */}
          <Box sx={{ mb: 3 }}>
            <Typography level="title-md" sx={{ mb: 1, fontWeight: 'bold' }}>
              Description
            </Typography>
            <Typography level="body-md" sx={{ color: '#666', lineHeight: 1.6 }}>
              {product.description}
            </Typography>
          </Box>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography level="title-md" sx={{ mb: 1, fontWeight: 'bold' }}>
                Specifications
              </Typography>
              <Card variant="soft" color="neutral" sx={{ bgcolor: '#f9f9f9' }}>
                <CardContent>
                  {Object.entries(product.specifications).map(([_key, value]) => (
                    <Box key={_key} sx={{ display: 'flex', py: 0.5, borderBottom: '1px solid #eee' }}>
                      <Typography level="body-sm" sx={{ width: 120, fontWeight: 'bold', color: '#333' }}>
                        {_key}:
                      </Typography>
                      <Typography level="body-sm" sx={{ color: '#666' }}>
                        {String(value)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Quantity and Actions */}
          <Box sx={{ mt: 3 }}>
            <Typography level="title-md" sx={{ mb: 1, fontWeight: 'bold' }}>
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              {isInCart ? (
                <ButtonGroup size="lg" variant="outlined">
                  <Button 
                    onClick={() => handleUpdateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    sx={{ minWidth: 50 }}
                  >
                    -
                  </Button>
                  <Button disabled sx={{ minWidth: 60, fontWeight: 'bold' }}>
                    {quantity}
                  </Button>
                  <Button 
                    onClick={() => handleUpdateQuantity(quantity + 1)}
                    disabled={!product.stock}
                    sx={{ minWidth: 50 }}
                  >
                    +
                  </Button>
                </ButtonGroup>
              ) : (
                <ButtonGroup size="lg" variant="outlined">
                  <Button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    sx={{ minWidth: 50 }}
                  >
                    -
                  </Button>
                  <Button disabled sx={{ minWidth: 60, fontWeight: 'bold' }}>
                    {quantity}
                  </Button>
                  <Button 
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={!product.stock}
                    sx={{ minWidth: 50 }}
                  >
                    +
                  </Button>
                </ButtonGroup>
              )}
              <Typography level="body-sm" sx={{ color: '#666' }}>
                {product.stock && `${product.stock || 0} available`}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {isInCart ? (
                <Button
                  size="lg"
                  color="warning"
                  variant="solid"
                  startDecorator={<FaShoppingCart />}
                  onClick={() => navigate('/cart')}
                  disabled={!product.stock}
                  sx={{ flex: 2 }}
                >
                  View in Cart
                </Button>
              ) : (
                <Button
                  size="lg"
                  color="success"
                  variant="solid"
                  startDecorator={<FaShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  sx={{ flex: 2 }}
                >
                  Add to Cart
                </Button>
              )}
              <Button
                size="lg"
                color="neutral"
                variant="outlined"
                onClick={handleBuyNow}
                disabled={!product.stock}
                sx={{ 
                  flex: 1,
                  borderColor: '#004526',
                  color: '#004526',
                  '&:hover': {
                    bgcolor: '#004526',
                    color: 'white',
                  }
                }}
              >
                Buy Now
              </Button>
            </Box>

          </Box>
        </Grid>
      </Grid>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography level="h3" sx={{ mb: 3, textAlign: 'center', textTransform: 'capitalize', fontWeight: 'bold' }}>
            Related Products
          </Typography>
          <Grid container spacing={2}>
            {relatedProducts.map(related => (
              <Grid xs={12} sm={6} md={3} key={related.id}>
                <ProductCard
                  id={related.id}
                  name={related.name}
                  price={related.price}
                  image={related.image_url}
                  discount={related.discount}
                  description={related.description}
                  rating={related.rating}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetails;