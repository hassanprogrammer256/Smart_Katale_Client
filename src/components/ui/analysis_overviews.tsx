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
  return `${value.toFixed(1)}%`;
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

export const Overview = ({ overview_data, role, showLoading = true }: OverviewProps) => {
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

      if (!role && !userId) return;

      setLoading(true);
      setError(null);

      try {
        const effectiveRole = role || (userId ? 'customer' : 'manager');
        const effectiveId = userId;

        if (effectiveRole === 'customer' && effectiveId) {
          const response = await FetchCustomerData(effectiveId) as CustomerDataProp;
          
          if (response?.success) {
           
            const customerData = response;
             console.log({customerData})
            // Calculate order metrics
            const orders = customerData.Orders?.details || [];
            const totalOrders = orders.length;
            const pendingOrders = customerData.Orders?.pending_orders || 0;
            
            // Calculate delivered orders only
            const deliveredOrders = orders.filter(order => 
              order.status?.toLowerCase() === 'delivered'
            );
            const deliveredOrdersCount = deliveredOrders.length;
            
            // Calculate total spent from delivered orders only
            const totalSpent = deliveredOrders.reduce(
              (sum: number, order: any) => sum + (order.total_amount || order.total_price || 0), 
              0
            );
            
            // Find highest and lowest order amounts from all orders
            const orderAmounts = orders.map(order => order.total_amount || order.total_price || 0);
            const highestOrder = orderAmounts.length > 0 ? Math.max(...orderAmounts) : 0;
            const lowestOrder = orderAmounts.length > 0 ? Math.min(...orderAmounts) : 0;
            
            // Calculate average order value from delivered orders only
            const avgOrderValue = deliveredOrdersCount > 0 ? totalSpent / deliveredOrdersCount : 0;
            
            // Get last order date
            const lastOrderDate = orders.length > 0 && orders[0]?.created_at 
              ? formatDate(orders[0].created_at) 
              : 'No orders yet';
            
            // Calculate completion rate (delivered orders / total orders)
            const completionRate = totalOrders > 0 
              ? (deliveredOrdersCount / totalOrders) * 100 
              : 0;

            setData([
              { 
                label: 'Total Orders', 
                value: totalOrders.toString(),
                color: totalOrders > 0 ? 'primary' : 'neutral',
                icon: '📦'
              },
              { 
                label: 'Pending Orders', 
                value: pendingOrders.toString(),
                color: pendingOrders > 0 ? 'warning' : 'neutral',
                icon: '⏳'
              },
              { 
                label: 'Delivered Orders', 
                value: deliveredOrdersCount.toString(),
                color: deliveredOrdersCount > 0 ? 'success' : 'neutral',
                icon: '✅'
              },
              { 
                label: 'Total Spent', 
                value: formatCurrency(totalSpent),
                color: totalSpent > 0 ? 'success' : 'neutral',
                icon: '💰'
              },
              { 
                label: 'Avg. Order Value', 
                value: formatCurrency(avgOrderValue),
                color: avgOrderValue > 0 ? 'primary' : 'neutral',
                icon: '📊'
              },
              { 
                label: 'Highest Order', 
                value: highestOrder > 0 ? formatCurrency(highestOrder) : 'UGX 0',
                color: highestOrder > 0 ? 'success' : 'neutral',
                icon: '⬆️'
              },
              { 
                label: 'Lowest Order', 
                value: lowestOrder > 0 ? formatCurrency(lowestOrder) : 'UGX 0',
                color: lowestOrder > 0 ? 'warning' : 'neutral',
                icon: '⬇️'
              },
              { 
                label: 'Completion Rate', 
                value: formatPercentage(completionRate),
                color: completionRate > 70 ? 'success' : completionRate > 40 ? 'warning' : 'danger',
                icon: '📈'
              },
              { 
                label: 'Last Order Date', 
                value: lastOrderDate,
                color: orders.length > 0 ? 'primary' : 'neutral',
                icon: '📅'
              }
            ]);
          } else {
            setError('Failed to load customer data');
          }
        } else if (effectiveRole === 'manager') {
          const response = await FetchManagerData() as ManagerDataProp;
          
          if (response?.success) {
            const managerData = response;
            
            // Get orders data
            const orders = managerData.orders?.order_details || [];
            const totalOrders = orders.length;
            const pendingOrders = managerData.orders?.pending?.count || 0;
            
            // Calculate delivered orders only
            const deliveredOrders = orders.filter(order => 
              order.status?.toLowerCase() === 'delivered'
            );
            const deliveredOrdersCount = deliveredOrders.length;
            
            // Calculate total revenue from delivered orders only
            const totalRevenue = deliveredOrders.reduce(
              (sum: number, order: any) => sum + (order.total_amount || order.total_price || 0), 
              0
            );
            
            // Get products data
            const products = managerData.products?.products || [];
            const totalProducts = products.length;
            const outOfStock = products.filter(p => 
              p.status?.toLowerCase() === 'out_of_stock' || p.stock === 0
            ).length;
            
            // Calculate average order value from delivered orders only
            const avgOrderValue = deliveredOrdersCount > 0 ? totalRevenue / deliveredOrdersCount : 0;
            
            // Get unique customers
            const uniqueCustomers = new Set(orders.map(order => 
              order.customer_email || order.email || order.customer?.email
            )).size;
            
            // Calculate completion rate
            const completionRate = totalOrders > 0 
              ? (deliveredOrdersCount / totalOrders) * 100 
              : 0;
            
            // Get recent orders (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentOrders = orders.filter(order => 
              new Date(order.created_at || order.order_date) >= thirtyDaysAgo
            ).length;
            
            // Calculate revenue growth from delivered orders (compare last 30 days to previous 30 days)
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
            const recentRevenue = deliveredOrders
              .filter(order => new Date(order.created_at || order.order_date) >= thirtyDaysAgo)
              .reduce((sum, order) => sum + (order.total_amount || order.total_price || 0), 0);
            const previousRevenue = deliveredOrders
              .filter(order => {
                const orderDate = new Date(order.created_at || order.order_date);
                return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
              })
              .reduce((sum, order) => sum + (order.total_amount || order.total_price || 0), 0);
            const revenueGrowth = previousRevenue > 0 
              ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
              : recentRevenue > 0 ? 100 : 0;
            
            setData([
              { 
                label: 'Total Orders', 
                value: totalOrders.toString(),
                color: 'primary',
                icon: '📦'
              },
              { 
                label: 'Pending Orders', 
                value: pendingOrders.toString(),
                color: pendingOrders > 0 ? 'warning' : 'neutral',
                icon: '⏳'
              },
              { 
                label: 'Delivered Orders', 
                value: deliveredOrdersCount.toString(),
                color: deliveredOrdersCount > 0 ? 'success' : 'neutral',
                icon: '✅'
              },
              { 
                label: 'Total Revenue', 
                value: formatCurrency(totalRevenue),
                color: totalRevenue > 0 ? 'success' : 'neutral',
                icon: '💰'
              },
              { 
                label: 'Avg. Order Value', 
                value: formatCurrency(avgOrderValue),
                color: avgOrderValue > 0 ? 'primary' : 'neutral',
                icon: '📊'
              },
              { 
                label: 'Total Products', 
                value: totalProducts.toString(),
                color: 'primary',
                icon: '🛍️'
              },
              { 
                label: 'Out of Stock', 
                value: outOfStock.toString(),
                color: outOfStock > 0 ? 'danger' : 'success',
                icon: '⚠️'
              },
              { 
                label: 'Active Customers', 
                value: uniqueCustomers.toString(),
                color: uniqueCustomers > 0 ? 'success' : 'neutral',
                icon: '👥'
              },
              { 
                label: 'Recent Orders (30d)', 
                value: recentOrders.toString(),
                color: recentOrders > 0 ? 'primary' : 'neutral',
                icon: '📅'
              },
              { 
                label: 'Completion Rate', 
                value: formatPercentage(completionRate),
                color: completionRate > 70 ? 'success' : completionRate > 40 ? 'warning' : 'danger',
                icon: '📈'
              },
              { 
                label: 'Revenue Growth', 
                value: revenueGrowth > 0 ? `+${formatPercentage(revenueGrowth)}` : formatPercentage(revenueGrowth),
                color: revenueGrowth > 0 ? 'success' : revenueGrowth < 0 ? 'danger' : 'neutral',
                icon: '📈'
              }
            ]);
          } else {
            setError('Failed to load manager data');
          }
        }
      } catch (err) {
        console.error('Error fetching overview data:', err);
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [role, userId, overview_data]);

  if (loading && showLoading) {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} xs={12} sm={6} md={3}>
            <Card variant="soft" sx={{ p: 2, minHeight: 100 }}>
              <Typography level="body-sm">Loading...</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Card variant="soft" color="danger" sx={{ p: 2, m: 2 }}>
        <Typography level="body-md">{error}</Typography>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card variant="soft" sx={{ p: 2, m: 2 }}>
        <Typography level="body-md">No data available</Typography>
      </Card>
    );
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {data.map((item, index) => (
        <Grid key={index} xs={12} sm={6} md={4} lg={3}>
          <Card 
            variant="soft" 
            color={item.color as any}
            sx={{ 
              p: 2, 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {item.icon && (
                  <Typography level="h3" fontSize="1.5rem">
                    {item.icon}
                  </Typography>
                )}
                <Typography level="body-sm" textColor="text.secondary">
                  {item.label}
                </Typography>
              </Stack>
              <Typography level="h2" fontWeight="bold">
                {item.value}
              </Typography>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const CustomerOverview = () => {
  return <Overview role="customer" />;
};

export const ManagerOverview = () => {
  return <Overview role="manager" />;
};