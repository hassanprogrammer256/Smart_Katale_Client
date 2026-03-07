import { Button, Card, Typography, ButtonGroup, Box, IconButton } from '@mui/joy';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { CartProductProps } from '../../interfaces/orders.interfaces';


export default function CartProduct({ item, onQuantityChange, onRemove }: CartProductProps) {
  const navigate = useNavigate();
  const discountedPrice = item.price * (1 - item.discount / 100);
  const itemTotal = discountedPrice * item.quantity;

  const handleProductClick = () => {
    navigate(`/product-details/${item.id}`);
  };

  // Function to truncate product name
  const truncateName = (name: string, maxLength: number = 50) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <Card
      variant="outlined"
      sx={{
        my: 1,
        p: { xs: 1.5, sm: 2 },
        transition: 'all 0.2s',
        '&:hover': {
          transform: { md: 'translateY(-2px)' },
          boxShadow: { md: 'md' },
        },
      }}
    >
      {/* Mobile Layout (xs to sm) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {/* Top Row: Image and Name */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Product Image */}
          <Box 
            sx={{ 
              width: 70, 
              height: 70, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #eee',
              borderRadius: 1,
              p: 1,
              flexShrink: 0,
              bgcolor: '#fafafa'
            }}
     
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
             
            />
          </Box>

          {/* Product Name and Price */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              level="title-md" 
              sx={{ 
                cursor: 'pointer',
                fontSize: '0.95rem',
                lineHeight: 1.3,
                mb: 0.5,
                '&:hover': { color: '#004526' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              onClick={handleProductClick}
              title={item.name} // Show full name on hover
            >
              {truncateName(item.name, 40)}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography level="body-sm" fontWeight="bold" sx={{ color: '#004526' }}>
                UGX {discountedPrice.toFixed(0)}
              </Typography>
              {item.discount > 0 && (
                <Typography level="body-xs" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                  UGX {item.price.toFixed(0)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Bottom Row: Quantity Controls and Total */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ButtonGroup size="sm" variant="outlined">
              <Button 
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                sx={{ minWidth: 32 }}
              >
                -
              </Button>
              <Button disabled sx={{ minWidth: 40, fontWeight: 'bold' }}>
                {item.quantity}
              </Button>
              <Button 
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                sx={{ minWidth: 32 }}
              >
                +
              </Button>
            </ButtonGroup>

            <Typography level="body-sm" fontWeight="bold" sx={{ color: '#004526' }}>
              UGX {itemTotal.toFixed(0)}
            </Typography>
          </Box>

          <IconButton 
            color="danger" 
            variant="plain"
            onClick={() => onRemove(item.id)}
            size="sm"
            sx={{ 
              '&:hover': { 
                bgcolor: 'danger.softBg',
              }
            }}
          >
            <FaTrash size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Desktop Layout (md and above) */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
        {/* Product Image */}
        <Box 
          sx={{ 
            width: 100, 
            height: 100, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #eee',
            borderRadius: 1,
            p: 1,
            flexShrink: 0,
            bgcolor: '#fafafa',
            transition: 'border-color 0.2s',
            '&:hover': {
              borderColor: '#004526',
            }
          }}
          onClick={handleProductClick}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            level="title-md" 
            sx={{ 
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { color: '#004526' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}

            title={item.name}
          >
            {truncateName(item.name, 60)}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            <Typography level="body-sm" fontWeight="bold" sx={{ color: '#004526' }}>
              UGX {discountedPrice.toFixed(0)}
            </Typography>
            {item.discount > 0 && (
              <Typography level="body-xs" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                UGX {item.price.toFixed(0)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Quantity Controls and Total */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexShrink: 0,
        }}>
          <ButtonGroup size="sm" variant="outlined">
            <Button 
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              sx={{ minWidth: 36 }}
            >
              -
            </Button>
            <Button disabled sx={{ minWidth: 40, fontWeight: 'bold' }}>
              {item.quantity}
            </Button>
            <Button 
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              sx={{ minWidth: 36 }}
            >
              +
            </Button>
          </ButtonGroup>

          <Typography level="body-sm" fontWeight="bold" sx={{ minWidth: 90, textAlign: 'right', color: '#004526' }}>
            UGX {itemTotal.toFixed(0)}
          </Typography>

          <IconButton 
            color="danger" 
            variant="plain"
            onClick={() => onRemove(item.id)}
            size="sm"
            sx={{ 
              '&:hover': { 
                bgcolor: 'danger.softBg',
              }
            }}
          >
            <FaTrash size={18} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}