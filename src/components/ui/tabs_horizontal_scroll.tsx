import { Card, TabPanel } from "@mui/joy";
import CustomTabs from "./tabs";
import CustomTabList from "./tablist";
import CustomTab from "./tab";
import AddressCard from "./address_card";
import Address from "./useraddress";
import Profile from "./profile";
import PaymentCardForm from "./card";
import UserPaymentCard from "./payment_card";
import { AnalysisTable } from "./user_view_orders";
import * as React from 'react';
import { FetchCustomerData, FetchManagerData } from "../../api/auth";
import { useAppSelector } from "../../types/hooks.types";
import type { CustomerDataProp, ManagerDataProp } from "../../interfaces/users.interfaces";
import type { ScheduleProps, TabConfig } from "../../interfaces/ui.interfaces";


const TabsHorizontalScroll = () => {
  const { id, role } = useAppSelector((state) => state.user);
  const [customerData, setCustomerData] = React.useState<CustomerDataProp | null>(null);
  const [managerData, setManagerData] = React.useState<ManagerDataProp | null>(null);
  const [_loading, setLoading] = React.useState(true);
  const [_error, setError] = React.useState<string | null>(null);

React.useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (role === 'customer' && id) {
        const response = await FetchCustomerData(id) as CustomerDataProp;
        if (response?.success) {
          // ✅ Use the actual response data
          setCustomerData({
            success: true,
            Cards: response.Cards || { count: 0, details: [] },
            Addresses: response.Addresses || { count: 0, details: [] },
            Orders: response.Orders || { pending_orders: 0, details: [] }
          });
        } else {
          setError('Failed to load customer data');
        }
      } else if (role === 'manager') {
        const response = await FetchManagerData() as ManagerDataProp;
        if (response?.success) {
          setManagerData({
            success: true,
            products: response?.products || { products: [], summary: {}, sales: {} },
            orders: response?.orders || { 
              pending: { count: 0, details: [] }, 
              top_orders: [], 
              order_details: [],
              summary: { delivered_orders: 0, last_delivery_date: '' }
            }
          });
        } else {
          setError('Failed to load manager data');
        }
      }
    } catch (err) {
      setError('Error fetching data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [role, id]);

  const getRoleBasedData = (): ScheduleProps => {
    if (role === 'customer' && customerData) {
      return {
        user_role: 'customer',
        addressData: customerData.Addresses?.details || [],
        paymentData: customerData.Cards?.details || [],
        orderData: customerData.Orders?.details || [],
        productsData: [],
        topOrders: [],
        orderSummary: {}
      };
    } else if (role === 'manager' && managerData) {
      return {
        user_role: 'manager',
        addressData: [],
        paymentData: [],
        orderData: managerData.orders?.order_details || [],
        productsData: managerData.products?.products || [],
        topOrders: managerData.orders?.top_orders || [],
        orderSummary: managerData.orders?.summary || {}
      };
    }
    return {
      user_role: role as 'customer' | 'manager',
      orderData: [],
      addressData: [],
      paymentData: [],
      productsData: [],
      topOrders: [],
      orderSummary: {}
    };
  };

  const roleData = getRoleBasedData();
  return <Schedule {...roleData} />;
};

const HorizontalScrollTabPanel = (props?: any) => {
  const { sx = [], children, ...other } = props;
  return (
    <TabPanel
      {...other}
      sx={[
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: 200,
          overflowY: 'hidden',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        width: '100%',
        margin: '0 auto'
      }}>
        {children}
      </div>
    </TabPanel>
  );
};

const Schedule = (props: ScheduleProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { user_role, addressData, paymentData, orderData, productsData } = props;

  const getTabsByRole = (): TabConfig[] => {
    const allTabs: TabConfig[] = [
      {
        title: 'Profile',
        value: 0,
        component: (
          <div className="md:grid flex gap-1 flex-col md:grid-cols-[50%_50%] w-full">
            <Profile />
            <div className="flex flex-col gap-2">
              {user_role === 'customer' ? (
              <>
                <Address />
                <PaymentCardForm />
              </>
              ) : null}
            </div>
          </div>
        ),
        roles: ['customer', 'manager'],
        order: 1
      }
    ];

    if (user_role === 'customer') {
      if (addressData && addressData.length > 0) {
        allTabs.push({
          title: 'Addresses',
          value: 1,
          component: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {addressData?.map((address: any, index: number) => (
                <AddressCard 
                  key={address.id || index}
                  addressline1={address.address_line1 || address.addressline1 || ''}
                  town={address.town || ''}
                  city={address.city || ''}
                />
              ))}
            </div>
          ),
          roles: ['customer'],
          order: 2
        });
      }

      if (paymentData && paymentData.length > 0) {
        allTabs.push({
          title: 'Payment Methods',
          value: 2,
          component: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {paymentData?.map((card: any, index: number) => (
                <UserPaymentCard
                  key={card.id || index}
                />
              ))}
            </div>
          ),
          roles: ['customer'],
          order: 3
        });
      }

      if (orderData && orderData.length > 0) {
        allTabs.push({
          title: `Orders (${orderData.length})`,
          value: 3,
          component: (
            <div className="flex flex-col w-full">
              <AnalysisTable type="orders" />
            </div>
          ),
          roles: ['customer'],
          order: 4
        });
      }
    }

    if (user_role === 'manager') {
      allTabs.push({
        title: `Orders (${orderData?.length || 0})`,
        value: 3,
        component: (
          <div className="flex flex-col w-full">
            <AnalysisTable type="orders" />
          </div>
        ),
        roles: ['manager'],
        order: 5
      });

      if (productsData && productsData.length > 0) {
        allTabs.push({
          title: `Products`,
          value: 6,
          component: (
            <div className="flex flex-col w-full">
              <AnalysisTable type="products" />
            </div>
          ),
          roles: ['manager'],
          order: 7
        });
      }
    }

    return allTabs
      .filter(tab => tab.roles.includes(user_role))
      .sort((a, b) => a.order - b.order);
  };

  const tabs = getTabsByRole();

  React.useEffect(() => {
    setActiveTab(0);
  }, [user_role]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (tabs.length === 0) {
    return (
      <Card variant="plain">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold">No tabs available for this role</h3>
        </div>
      </Card>
    );
  }

  const getSummaryText = () => {
    if (user_role === 'customer') {
      return (
        <>You have {orderData?.length || 0} orders and {addressData?.length || 0} saved addresses.</>
      );
    } else {
      const totalOrders = orderData?.length || 0;
      const totalProducts = productsData?.length || 0;
      return (
        <>Managing {totalOrders} orders and {totalProducts} products across all customers.</>
      );
    }
  };

  return (
    <Card variant="plain">
      <CustomTabs 
        defaultValue={0} 
        value={activeTab} 
        onChange={handleTabChange}
      >
        <CustomTabList
          sx={{
            overflow: 'auto',
            scrollSnapType: 'x mandatory',
            display: 'flex',
            justifyContent: 'center',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {tabs.map((tab) => (
            <CustomTab
              key={tab.value}
              value={tab.value}
              sx={{ 
                flexGrow: 0, 
                flexShrink: 0, 
                fontSize: 14, 
                scrollSnapAlign: 'start', 
                minWidth: 120,
                '&.Mui-selected': {
                  color: 'primary.500',
                  fontWeight: 'bold'
                }
              }}
            >
              {tab.title}
            </CustomTab>
          ))}
        </CustomTabList>

        {tabs.map((tab) => (
          <HorizontalScrollTabPanel key={tab.value} value={tab.value}>
            {tab.component}
          </HorizontalScrollTabPanel>
        ))}
      </CustomTabs>

      <Card variant="soft" sx={{ mt: 2, p: 2 }}>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Summary:</span>{' '}
          {getSummaryText()}
        </div>
      </Card>
    </Card>
  );
};

export default TabsHorizontalScroll;
export const CustomerDashboard = () => <TabsHorizontalScroll />;
export const ManagerDashboard = () => <TabsHorizontalScroll />;