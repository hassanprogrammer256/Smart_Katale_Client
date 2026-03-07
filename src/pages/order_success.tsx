import { Box, Typography, Button, Card, Divider } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, orderNumber, totalAmount } = location.state || {};

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, textAlign: 'center' }}>
      <Card variant="outlined" sx={{ p: 4 }}>
        <FaCheckCircle 
          size={80} 
          color="#4caf50" 
          style={{ margin: '0 auto 20px' }} 
        />
        
        <Typography level="h2" sx={{ mb: 2, color: '#4caf50' }}>
          Order Placed Successfully!
        </Typography>
        
        <Typography level="body-lg" sx={{ mb: 3 }}>
          Thank you for your purchase. Your order has been received and is being processed.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography level="title-md" sx={{ mb: 2 }}>
            Order Details:
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography level="body-sm" color="neutral">Order Number:</Typography>
            <Typography level="body-sm" fontWeight="bold">{orderNumber || 'N/A'}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography level="body-sm" color="neutral">Order ID:</Typography>
            <Typography level="body-sm">{orderId || 'N/A'}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography level="body-sm" color="neutral">Total Amount:</Typography>
            <Typography level="body-sm" fontWeight="bold" color="success">
              UGX {totalAmount?.toLocaleString() || '0'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography level="body-sm" sx={{ mb: 3, color: 'neutral' }}>
          A confirmation email has been sent to your email address.
          You will receive updates about your order status.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="solid"
            color="success"
            startDecorator={<FaShoppingBag />}
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </Button>
          
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<FaHome />}
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default OrderSuccess;