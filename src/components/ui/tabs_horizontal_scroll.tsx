import { Card, TabPanel, Drawer, Divider,  } from "@mui/joy";
import CustomTabs from "./tabs";
import CustomTabList from "./tablist";
import CustomTab from "./tab";
import Profile from "./profile";
import { AnalysisTable } from "./user_view_orders";
import * as React from 'react';
import { FetchCustomerData, FetchManagerData } from "../../api/auth";
import { useAppSelector } from "../../types/hooks.types";
import type { CustomerDataProp, ManagerDataProp } from "../../interfaces/users.interfaces";
import type { ScheduleProps, TabConfig } from "../../interfaces/ui.interfaces";
import Button from '@mui/joy/Button';
import AddIcon from '@mui/icons-material/Add';
import SmartForm from '../common/form';
// import { useAppDispatch } from "../../types/hooks.types";


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
  const [addProductDrawerOpen, setAddProductDrawerOpen] = React.useState(false);
  const { user_role, orderData, productsData } = props;
  // const dispatch = useAppDispatch();
  const { categories, brands } = useAppSelector((state) => state.products);


  const categoryOptions = React.useMemo(() => {
    const options = [{ value: '', label: 'Select a category' }];
    if (categories && categories.length > 0) {
      return [...options, ...categories.map((cat: string) => ({ value: cat, label: cat }))];
    }
    return options;
  }, [categories]);

  const brandOptions = React.useMemo(() => {
    const options = [{ value: '', label: 'Select a brand' }];
    if (brands && brands.length > 0) {
      return [...options, ...brands.map((brand: string) => ({ value: brand, label: brand }))];
    }
    return options;
  }, [brands]);

  const [addProductFormData, setAddProductFormData] = React.useState({
    product_image: undefined,
    product_name: '',
    product_categories: '',
    product_brands: '',
    product_description: '',
    product_price: '',
    product_stock: 0,
    product_discount: 0,
    product_status: ''
  });
  const [isAddingProduct, _setIsAddingProduct] = React.useState(false);

  const AddProductFormFields = [
    {
      name: 'product_image',
      type: 'file',
      placeholder: 'Upload Product Image',
      componentType: "file",
      showLabels: true,
      required: true,
      validation: {
        fileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxSize: 5 * 1024 * 1024,
        message: 'Please upload a valid image file (jpg, png, gif, webp) under 5MB'
      }
    },
    { 
      name: 'product_name', 
      type: 'text', 
      placeholder: 'Product Name',
      componentType: "input",
      required: true,
      showLabels: true, 
      validation: {
        minLength: 3,
        maxLength: 100,
        message: 'Product name must be between 3 and 100 characters'
      } 
    },
    { 
      name: 'product_description', 
      type: 'text', 
      placeholder: 'Product Description',
      componentType: "textarea",
      required: true,
      showLabels: true, 
      validation: {
        minLength: 10,
        maxLength: 500,
        message: 'Product description must be between 10 and 500 characters'
      }
    },
    { 
      name: 'product_price', 
      type: 'number', 
      placeholder: 'Product Price',
      componentType: "number",
      required: true,
      showLabels: true,
      validation: {
        min: 0,
        message: 'Product price cannot be negative'
      }
    },
    { 
      name: 'product_stock', 
      type: 'number', 
      placeholder: 'Stock Quantity',
      componentType: "number",
      required: true,
      showLabels: true,
      validation: {
        min: 0,
        message: 'Stock cannot be negative'
      }
    },
    { 
      name: 'product_categories', 
      type: 'text', 
      placeholder: 'Select Product Category',
      componentType: "select",
      required: true,
      showLabels: true,
      options: categoryOptions
    },
    { 
      name: 'product_brands', 
      type: 'text', 
      placeholder: 'Select Product Brand',
      componentType: "select",
      required: true,
      showLabels: true,
      options: brandOptions
    },
    { 
      name: 'product_discount', 
      type: 'number', 
      placeholder: 'Product Discount (%)',
      componentType: "number",
      showLabels: true,
      validation: {
        min: 0,
        max: 100,
        message: 'Product discount must be between 0 and 100'
      }
    },
    { 
      name: 'product_status', 
      type: 'text', 
      placeholder: 'Select Product Status',
      componentType: "select",
      required: true,
      options: [
        { value: '', label: 'Select status' },
        { value: 'Brand New', label: 'Brand New' },
        { value: 'Uk Used', label: 'Uk Used' }
      ],
      showLabels: true
    }
  ];



  // const handleAddProduct = async () => {
  //   setIsAddingProduct(true);
  //   try {
  //     // const result = await dispatch(CreateProductThunk(addProductFormData)).unwrap();
  //     if (result) {
  //       setAddProductDrawerOpen(false);
  //       setAddProductFormData({
  //         product_image: undefined,
  //         product_name: '',
  //         product_categories: '',
  //         product_brands: '',
  //         product_description: '',
  //         product_price: '',
  //         product_stock: 0,
  //         product_discount: 0,
  //         product_status: ''
  //       });
  //       // Refresh the page or trigger a refresh of the products table
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //   } finally {
  //     setIsAddingProduct(false);
  //   }
  // };

  const getTabsByRole = (): TabConfig[] => {
    const allTabs: TabConfig[] = [
      {
        title: 'Profile',
        value: 0,
        component: (
          <div className="md:grid flex gap-1 flex-col md:grid-cols-[50%_50%] w-full">
            <Profile />
          </div>
        ),
        roles: ['customer', 'manager'],
        order: 1
      }
    ];

    if (user_role === 'customer') {
      if (orderData) {
        allTabs.push({
          title: 'Orders',
          value: 1,
          component: (
            <div className="flex flex-col w-full">
              <AnalysisTable type="orders" />
            </div>
          ),
          roles: ['customer'],
          order: 2
        });
      }
    }

    if (user_role === 'manager') {
      allTabs.push({
        title: `Orders (${orderData?.length || 0})`,
        value: 1,
        component: (
          <div className="flex flex-col w-full">
            <AnalysisTable type="orders" />
          </div>
        ),
        roles: ['manager'],
        order: 2
      });

      allTabs.push({
        title: `Products (${productsData?.length || 0})`,
        value: 2,
        component: (
          <div className="flex flex-col w-full">
            <div className="flex justify-end mb-4">
              <Button
                startDecorator={<AddIcon />}
                onClick={() => setAddProductDrawerOpen(true)}
                variant="solid"
                color="success"
              >
                Add Product
              </Button>
            </div>
            <AnalysisTable type="products" />
          </div>
        ),
        roles: ['manager'],
        order: 3
      });
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
        <>You have {orderData?.length || 0} orders</>
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
    <>
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

      {/* Add Product Drawer */}
      <Drawer
        open={addProductDrawerOpen}
        onClose={() => setAddProductDrawerOpen(false)}
        anchor="right"
        size="md"
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '90%', sm: '500px' },
            maxWidth: '90vw',
          },
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setAddProductDrawerOpen(false)}
            >
              Close
            </Button>
          </div>
          <Divider sx={{ mb: 3 }} />
          <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '8px' }}>
            <SmartForm
              formControls={AddProductFormFields}
              isLoading={isAddingProduct}
              buttonText="Add Product"
              formData={addProductFormData}
              setFormData={setAddProductFormData}
             onSubmit={() => {}}
              variant="solid"
              isBtnDisabled={ isAddingProduct}
              message="Adding Product..."
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default TabsHorizontalScroll;
export const CustomerDashboard = () => <TabsHorizontalScroll />;
export const ManagerDashboard = () => <TabsHorizontalScroll />;