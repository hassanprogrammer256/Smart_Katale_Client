import { Card, Grid, Stack, Typography } from "@mui/joy";
import { useAppSelector } from "../../types/hooks.types";
import { FetchCustomerData, FetchManagerData } from "../../api/auth";
import * as React from 'react';
import type { CustomerDataProp, ManagerDataProp, OverviewData, OverviewProps } from "../../interfaces/users.interfaces";

const formatCurrency = (amount: number): string => {
  return `UGX ${amount.toLocaleString()}`;
};

// Helper function to format percentage
const formatPercentage = (value: number): string => {
  return `${value}%`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const Overview = ({ overview_data, role,showLoading = true }: OverviewProps) => {
  const { id: userId } = useAppSelector((state) => state.user);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<OverviewData[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch real data based on role
  React.useEffect(() => {
    const fetchOverviewData = async () => {
      if (overview_data && overview_data.length > 0) {
        setData(overview_data);
        return;
      }

      if (!role &&  !userId) return;

      setLoading(true);
      setError(null);

      try {
        const effectiveRole = role || (userId ? 'customer' : 'manager');
        const effectiveId = userId 

        if (effectiveRole === 'customer' && effectiveId) {

          const response = await FetchCustomerData(effectiveId) as CustomerDataProp
          if (response?.success) {
            const customerData = response;
            

            const totalOrders = customerData.Orders?.details?.length || 0;
            const pendingOrders = customerData.Orders?.pending_orders || 0;
            const totalSpent = customerData.Orders?.details?.reduce(
              (sum: number, order: any) => sum + (order.total_amount || order.total_price || 0), 
              0
            ) || 0;
            
            const savedAddresses = customerData.Addresses?.count || 0;
            const savedCards = customerData.Cards?.count || 0;
            

            const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

            setData([
     

              { 
                label: 'Pending Orders', 
                value: pendingOrders,
                color: pendingOrders > 0 ? 'warning' : 'neutral'
              },
              { 
                label: 'Total Spent', 
                value: formatCurrency(totalSpent),
                color: 'success'
              },
              { 
                label: 'Avg. Order Value', 
                value: formatCurrency(avgOrderValue),
                color: 'primary'
              },
              { 
                label: 'Saved Addresses', 
                value: savedAddresses,
                color: savedAddresses > 0 ? 'success' : 'neutral'
              },
              { 
                label: 'Payment Methods', 
                value: savedCards,
                color: savedCards > 0 ? 'success' : 'neutral'
              },
    
            ]);
          }
        } else if (effectiveRole === 'manager') {
          // Fetch manager data
          const response = await FetchManagerData() as ManagerDataProp;
          
          if (response?.success) {
            const managerData = response;
            
            // Calculate manager overview metrics
            const totalOrders = managerData?.orders?.order_details?.length || 0;
            const pendingOrders = managerData?.orders?.pending?.count || 0;
            const deliveredOrders = managerData?.orders?.summary?.delivered_orders || 0;
            const totalProducts = managerData?.products?.products?.length || 0;
            
            // Calculate total revenue
            const totalRevenue = managerData.orders?.order_details?.reduce(
              (sum: number, order: any) => sum + (order.total_amount || order.total_price || 0), 
              0
            ) || 0;
            
            // Calculate average order value
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Get sales data if available
            const totalSales = managerData.products?.sales?.total_sales || 0;
            const salesGrowth = managerData.products?.sales?.growth_percentage || 0;

            setData([
              { 
                label: 'Pending Orders', 
                value: pendingOrders,
                color: pendingOrders > 0 ? 'warning' : 'neutral'
              },
              { 
                label: 'Delivered Orders', 
                value: deliveredOrders,
                color: 'success'
              },
              { 
                label: 'Avg. Order Value', 
                value: formatCurrency(avgOrderValue),
                color: 'primary'
              },
              { 
                label: 'Total Products', 
                value: totalProducts,
                color: 'primary'
              },
              { 
                label: 'Total Sales', 
                value: formatCurrency(totalSales),
                color: 'success'
              },
              { 
                label: 'Sales Growth', 
                value: formatPercentage(salesGrowth),
                color: salesGrowth > 0 ? 'success' : salesGrowth < 0 ? 'danger' : 'neutral'
              },
              { 
                label: 'Last Delivery', 
                value: formatDate(managerData.orders?.summary?.last_delivery_date),
                color: 'neutral'
              },
            
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching overview data:', err);
        setError('Failed to load overview data');
        
   
        setData([
          { label: 'Error', value: 'Failed to load data', color: 'danger' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [role,  userId, overview_data]);

  // If loading and showLoading is true
  if (loading && showLoading) {
    return (
      null
    );
  }

  // If error
  if (error) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12}>
          <Card variant="soft" sx={{ bgcolor: 'danger.softBg' }}>
            <Typography level="body-sm" color="danger">
              {error}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Determine which data to display
  const displayData = overview_data || data;

  // If no data to display
  if (!displayData || displayData.length === 0) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12}>
          <Card variant="soft" sx={{ bgcolor: 'background.body' }}>
            <Typography level="body-sm" textAlign="center">
              No overview data available
            </Typography>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Determine grid column size based on number of items
  const getGridSize = (_index: number, totalItems: number) => {
    // For 1 item: full width
    if (totalItems === 1) return 12;
    // For 2 items: half width each
    if (totalItems === 2) return 6;
    // For 3 items: first two half, last full on mobile, but on desktop: 4 each
    if (totalItems === 3) {
      // Make all three equal width on desktop, but stack appropriately on mobile
      return { xs: 12, sm: 6, md: 4 };
    }
    // For 4+ items: 3 per row on desktop, 2 on tablet, 1 on mobile
    return { xs: 12, sm: 6, md: 4, lg: 3 };
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {displayData.map((item, index) => {
        const { label, value, color = 'neutral' } = item;
        const gridSize = getGridSize(index, displayData.length);
        
        // Determine background color based on color prop
        const getBgColor = () => {
          switch (color) {
            case 'primary': return 'primary.softBg';
            case 'success': return 'success.softBg';
            case 'warning': return 'warning.softBg';
            case 'danger': return 'danger.softBg';
            default: return 'background.body';
          }
        };

        // Determine text color based on color prop
        const getTextColor = () => {
          switch (color) {
            case 'primary': return 'primary.700';
            case 'success': return 'success.700';
            case 'warning': return 'warning.700';
            case 'danger': return 'danger.700';
            default: return 'text.primary';
          }
        };

        return (
          <Grid 
            xs={typeof gridSize === 'number' ? gridSize : gridSize.xs} 
            sm={typeof gridSize === 'object' ? gridSize.sm : undefined}
            md={typeof gridSize === 'object' ? gridSize.md : undefined}
            lg={typeof gridSize === 'object' ? gridSize.lg : undefined}
            key={`${label}-${index}`}
          >
            <Card 
              variant="soft" 
              sx={{ 
                bgcolor: getBgColor(),
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <div>
                  <Typography 
                    level="h4" 
                    sx={{ 
                      color: getTextColor(),
                      fontWeight: 'bold',
                      fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}
                  >
                    {typeof value === 'number' && !label.includes('UGX') && !label.includes('%') && !label.includes('Date')
                      ? value.toLocaleString()
                      : value}
                  </Typography>
                  <Typography 
                    level="body-sm" 
                    sx={{ 
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.75rem',
                      fontWeight: 'medium'
                    }}
                  >
                    {label}
                  </Typography>
                </div>
                {item.icon && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: color ? `${color}.softBg` : 'neutral.softBg',
                    color: color ? `${color}.700` : 'neutral.700'
                  }}>
                    {item.icon}
                  </div>
                )}
              </Stack>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

// Pre-configured overviews for specific use cases
export const CustomerOverview = () => {
  return <Overview role="customer" />;
};

export const ManagerOverview = () => {
  return <Overview role="manager" />;
};

