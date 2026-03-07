import * as React from 'react';
import type { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import CircularProgress from '@mui/joy/CircularProgress';
import Snackbar from '@mui/joy/Snackbar';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useMediaQuery } from '@mui/material';
import Tooltip from '@mui/joy/Tooltip';
import { FetchCustomerData, FetchManagerData } from '../../api/auth';
import { useAppSelector } from '../../types/hooks.types';
import { Edit } from '@mui/icons-material';
import SmartForm from '../common/form';
import type { AnalysisTableProps } from '../../interfaces/analysis.interfaces';
import type { Order } from '../../types/orders.types';
import { ProductFormFields } from '../../configs/form_fields';
import type { CustomerDataProp, ManagerDataProp } from '../../interfaces/users.interfaces';

// Define types for data items
interface ProductItem {
  id: string | number;
  name?: string;
  categories?: string[];
  category?: string;
  price?: number;
  stock?: number;
  stock_quantity?: number;
  status?: string;
  image_url?: string;
  image?: string;
  discount?: number;
  description?: string;
  brands?: string[];
  brand?: string;
  sales_count?: number;
  created_at?: string;
}

interface OrderItem {
  id: string | number;
  order_number?: string;
  created_at?: string;
  order_date?: string;
  status?: string;
  total_amount?: number;
  total_price?: number;
  total_items?: number;
  items?: any[];
  customer_name?: string;
  customer?: any;
  customer_email?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  city?: string;
  shipping_address?: any;
  town?: string;
  payment_method?: string;
}

interface CustomerDerived {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  city?: string;
  town?: string;
}

const getStatusColor = (status: string): ColorPaletteProp => {
  const statusMap: Record<string, ColorPaletteProp> = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'neutral',
    'brand new': 'success',
    'uk used': 'warning',
    out_of_stock: 'danger'
  };
  return statusMap[status?.toLowerCase()] || 'neutral';
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
    case 'brand new':
      return <CheckRoundedIcon />;
    case 'pending':
    case 'processing':
      return <AutorenewRoundedIcon />;
    case 'cancelled':
    case 'uk used':
    case 'out_of_stock':
      return <BlockIcon />;
    default:
      return null;
  }
};

const TruncatedText = ({ text, maxLength = 30 }: { text: string; maxLength?: number }) => {
  const shouldTruncate = text && text.length > maxLength;
  const truncated = shouldTruncate ? `${text.substring(0, maxLength)}...` : text;
  
  return shouldTruncate ? (
    <Tooltip title={text} placement="top" arrow>
      <Typography level="body-sm" sx={{ cursor: 'help' }}>
        {truncated}
      </Typography>
    </Tooltip>
  ) : (
    <Typography level="body-sm">{truncated || '-'}</Typography>
  );
};

interface RowMenuProps {
  onDelete: () => void;
  onView: () => void;
  onEdit: () => void;
  showEdit: boolean;
  showDelete: boolean;
}

function RowMenu({ onDelete, onView, onEdit, showEdit, showDelete }: RowMenuProps) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={onView}>
          <VisibilityRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        {showEdit && (
          <MenuItem onClick={onEdit}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        <Divider />
        {showDelete && (
          <MenuItem onClick={onDelete} color="danger">
            <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Dropdown>
  );
}

export const AnalysisTable = (props: AnalysisTableProps) => {
  const { 
    type = 'orders', 
    limit, 
    title, 
    showFilters = true, 
    showPagination = true,
    onRowClick,
    onSelectionChange 
  } = props;

  const { role, id } = useAppSelector((state) => state.user);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isTablet = useMediaQuery('(max-width: 960px)');

  // State
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [selected, setSelected] = React.useState<(string | number)[]>([]);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    status: 'all',
    search: '',
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage] = React.useState(limit || 10);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    color: 'neutral' as ColorPaletteProp,
  });
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState<string | number | null>(null);
  const [rowToEdit, setRowToEdit] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (role === 'manager') {
          response = await FetchManagerData() as ManagerDataProp;
        } else if (role === 'customer' && id) {
          response = await FetchCustomerData(id) as CustomerDataProp;
        } else {
          response = null;
        }
        
        if (!response?.success) {
          throw new Error('Failed to load data');
        }

        let fetchedData: any[] = [];
        
        switch (type) {
          case 'products':
            if (role === 'manager' && 'products' in response) {
              const managerResponse = response as ManagerDataProp;
              fetchedData = (managerResponse.products?.products || []).map((product: ProductItem) => ({
                id: product.id,
                name: product.name || 'Unnamed Product',
                category: product.categories?.[0] || 'Uncategorized',
                price: product.price || 0,
                stock_quantity: product.stock || product.stock_quantity || 0,
                status: product.status || 'Brand New',
                image: product.image_url || product.image,
                discount: product.discount || 0,
                description: product.description,
                brand: product.brands?.[0] || 'N/A',
                sales_count: product.sales_count || 0,
                created_at: product.created_at
              }));
            }
            break;
            
          case 'orders':
            if (role === 'manager' && 'orders' in response) {
              const managerResponse = response as ManagerDataProp;
              fetchedData = (managerResponse.orders?.order_details || []).map((order: OrderItem) => ({
                id: order.id,
                order_number: order.order_number || `ORD-${order.id}`,
                created_at: order.created_at || order.order_date,
                status: order.status?.toLowerCase() || 'pending',
                total_amount: order.total_amount || order.total_price || 0,
                total_items: order.total_items || order.items?.length || 0,
                customer_name: order.customer_name || order.customer?.name || 'N/A',
                customer_email: order.customer_email || order.customer?.email,
                first_name: order.first_name || order.customer?.first_name,
                last_name: order.last_name || order.customer?.last_name,
                phone_number: order.phone_number || order.customer?.phone,
                city: order.city || order.shipping_address?.city,
                town: order.town || order.shipping_address?.town,
                payment_method: order.payment_method || 'N/A',
                items: order.items || []
              }));
            } else if (role === 'customer' && 'Orders' in response) {
              const customerResponse = response as CustomerDataProp;
              fetchedData = (customerResponse.Orders?.details || []).map((order: OrderItem) => ({
                id: order.id,
                order_number: order.order_number || `ORD-${order.id}`,
                created_at: order.created_at || order.order_date,
                status: order.status?.toLowerCase() || 'pending',
                total_amount: order.total_amount || order.total_price || 0,
                total_items: order.total_items || order.items?.length || 0,
                payment_method: order.payment_method || 'N/A',
                items: order.items || []
              }));
            }
            break;
            
          case 'customers':
            if (role === 'manager' && 'orders' in response) {
              const managerResponse = response as ManagerDataProp;
              const orders = managerResponse.orders?.order_details || [];
              const customerMap = new Map<string | number, CustomerDerived>();
              
              orders.forEach((order: any) => {
                const customerId = order.customer?.id || order.customer_email || order.email;
                if (customerId && !customerMap.has(customerId)) {
                  customerMap.set(customerId, {
                    id: customerId,
                    first_name: order.first_name || order.customer?.first_name || '',
                    last_name: order.last_name || order.customer?.last_name || '',
                    email: order.customer_email || order.email || '',
                    phone_number: order.phone_number || order.customer?.phone || '',
                    total_orders: 1,
                    total_spent: order.total_amount || order.total_price || 0,
                    last_order_date: order.created_at || order.order_date,
                    city: order.city || order.shipping_address?.city,
                    town: order.town || order.shipping_address?.town
                  });
                } else if (customerId) {
                  const existing = customerMap.get(customerId);
                  if (existing) {
                    existing.total_orders += 1;
                    existing.total_spent += order.total_amount || order.total_price || 0;
                    const orderDate = order.created_at || order.order_date;
                    if (orderDate && new Date(orderDate) > new Date(existing.last_order_date || '')) {
                      existing.last_order_date = orderDate;
                    }
                  }
                }
              });
              
              fetchedData = Array.from(customerMap.values());
            }
            break;
        }
        
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Error loading data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    if ((role === 'manager' || role === 'customer') && (role !== 'customer' || id)) {
      fetchData();
    }
  }, [type, role, id]);

  // Filtered data
  const filteredRows = React.useMemo(() => {
    let filtered = [...data];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(row => 
        Object.values(row).some(value => 
          value && String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(row => 
        row.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (limit && filtered.length > limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [data, filters, limit]);

  // Sorting
  const sortedRows = React.useMemo(() => {
    const sorted = [...filteredRows];
    return sorted.sort((a, b) => {
      const aVal = a[orderBy as keyof typeof a];
      const bVal = b[orderBy as keyof typeof b];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      
      if (order === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [filteredRows, order, orderBy]);

  // Pagination
  const paginatedRows = React.useMemo(() => {
    if (limit || !showPagination) return sortedRows;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, currentPage, rowsPerPage, limit, showPagination]);

  const pageCount = Math.ceil(sortedRows.length / rowsPerPage);

  // Handlers
  const handleSort = (field: string) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? paginatedRows.map(row => row.id) : [];
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
    showSnackbar(checked ? 'All items selected' : 'Selection cleared', 'neutral');
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = checked 
      ? [...selected, id] 
      : selected.filter(itemId => itemId !== id);
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      search: '',
    });
    setCurrentPage(1);
    showSnackbar('Filters cleared', 'neutral');
  };

  const showSnackbar = (message: string, color: ColorPaletteProp = 'success') => {
    setSnackbar({ open: true, message, color });
  };

  const handleView = (row: any) => {
    setSelectedRow(row);
    setDetailModalOpen(true);
    onRowClick?.(row);
  };

  const handleEdit = (row: any) => {
    setRowToEdit(row);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: string | number) => {
    setRowToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      setSelected(selected.filter(id => id !== rowToDelete));
      setData(prev => prev.filter(item => item.id !== rowToDelete));
      showSnackbar(`Item #${rowToDelete} deleted`, 'danger');
      setDeleteConfirmOpen(false);
      setRowToDelete(null);
    }
  };

  // Column configurations based on type
  const getColumns = () => {
    switch (type) {
      case 'orders':
        return [
          { field: 'order_number', header: 'Order #', width: 140, sortable: true },
          { field: 'created_at', header: 'Date', width: 160, sortable: true },
          ...(role === 'manager' ? [{ field: 'customer_name', header: 'Customer', width: 200, sortable: true }] : []),
          { field: 'total_amount', header: 'Amount', width: 120, sortable: true },
          { field: 'status', header: 'Status', width: 140, sortable: true },
          { field: 'payment_method', header: 'Payment', width: 120, sortable: true },
        ];
      case 'products':
        return [
          { field: 'name', header: 'Product Name', width: 250, sortable: true },
          { field: 'category', header: 'Category', width: 150, sortable: true },
          { field: 'price', header: 'Price', width: 120, sortable: true },
          { field: 'stock_quantity', header: 'Stock', width: 100, sortable: true },
          { field: 'status', header: 'Status', width: 120, sortable: true },
          { field: 'brand', header: 'Brand', width: 120, sortable: true },
        ];
      case 'customers':
        return [
          { field: 'first_name', header: 'First Name', width: 140, sortable: true },
          { field: 'last_name', header: 'Last Name', width: 140, sortable: true },
          { field: 'email', header: 'Email', width: 220, sortable: true },
          { field: 'phone_number', header: 'Phone', width: 150, sortable: true },
          { field: 'total_orders', header: 'Orders', width: 100, sortable: true },
          { field: 'total_spent', header: 'Total Spent', width: 120, sortable: true },
        ];
      default:
        return [];
    }
  };

  // Responsive column configurations
  const getResponsiveColumns = () => {
    const allColumns = getColumns();
    
    if (isMobile) {
      switch (type) {
        case 'orders':
          return allColumns.filter(col => 
            ['order_number', 'status', 'total_amount'].includes(col.field)
          );
        case 'products':
          return allColumns.filter(col => 
            ['name', 'status', 'price'].includes(col.field)
          );
        case 'customers':
          return allColumns.filter(col => 
            ['first_name', 'email', 'total_spent'].includes(col.field)
          );
        default:
          return allColumns.slice(0, 3);
      }
    } else if (isTablet) {
      switch (type) {
        case 'orders':
          return allColumns.filter(col => 
            !['payment_method'].includes(col.field)
          );
        case 'products':
          return allColumns.filter(col => 
            !['brand'].includes(col.field)
          );
        case 'customers':
          return allColumns.filter(col => 
            !['phone_number'].includes(col.field)
          );
        default:
          return allColumns;
      }
    }
    
    return allColumns;
  };

  const renderCell = (row: any, field: string) => {
    switch (field) {
      case 'status':
        return (
          <Chip
            variant="soft"
            size="sm"
            startDecorator={getStatusIcon(row.status)}
            color={getStatusColor(row.status)}
          >
            {row.status?.replace('_', ' ').toUpperCase() || 'N/A'}
          </Chip>
        );
      
      case 'customer_name':
        return (
          <Box>
            <Typography level="body-sm" fontWeight="md">{row.customer_name || 'N/A'}</Typography>
            {row.customer_email && !isMobile && (
              <Typography level="body-xs">{row.customer_email}</Typography>
            )}
          </Box>
        );

      case 'first_name':
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar size="sm">
              {row.first_name?.[0]}{row.last_name?.[0]}
            </Avatar>
            <Typography level="body-sm">{row.first_name} {row.last_name}</Typography>
          </Box>
        );

      case 'total_amount':
      case 'price':
      case 'total_spent':
        return (
          <Typography level="body-sm" fontWeight="md">
            UGX: {Number(row[field]).toLocaleString()}
          </Typography>
        );

      case 'created_at':
        return (
          <Typography level="body-sm">
            {row[field] ? new Date(row[field]).toLocaleDateString() : 'N/A'}
          </Typography>
        );

      case 'stock_quantity':
        return (
          <Typography 
            level="body-sm" 
            color={row.stock_quantity < 10 ? 'danger' : row.stock_quantity < 50 ? 'warning' : 'success'}
            fontWeight="md"
          >
            {row.stock_quantity}
          </Typography>
        );

      case 'payment_method':
        return (
          <Typography level="body-sm" sx={{ textTransform: 'capitalize' }}>
            {row.payment_method?.replace('_', ' ') || 'N/A'}
          </Typography>
        );

      case 'total_orders':
        return (
          <Typography level="body-sm" fontWeight="md">
            {row.total_orders || 0}
          </Typography>
        );

      default:
        return <Typography level="body-sm">{row[field] || '-'}</Typography>;
    }
  };

  // Responsive cell rendering
  const renderResponsiveCell = (row: any, field: string) => {
    const content = renderCell(row, field);
    
    // Add truncation for text fields
    if (['name', 'customer_name', 'email', 'order_number', 'first_name', 'last_name'].includes(field)) {
      return <TruncatedText text={String(row[field] || '')} maxLength={isMobile ? 15 : 25} />;
    }
    
    return content;
  };

  const columns = getResponsiveColumns();

  return (
    <React.Fragment>
      {/* Title with responsive sizing */}
      {title && (
        <Typography 
          level={isMobile ? 'title-lg' : 'h4'} 
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
      )}

      {/* Active Filters - Responsive */}
      {(filters.status !== 'all' || filters.search) && (
        <Box sx={{ 
          mb: 2, 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center'
        }}>
          <Typography level="body-sm" sx={{ mr: 1 }}>Active filters:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.status !== 'all' && (
              <Chip
                size="sm"
                variant="soft"
                color="primary"
                endDecorator={<CloseRoundedIcon fontSize="small" />}
                onClick={() => handleFilterChange('status', 'all')}
              >
                Status: {filters.status}
              </Chip>
            )}
            {filters.search && (
              <Chip
                size="sm"
                variant="soft"
                color="primary"
                endDecorator={<CloseRoundedIcon fontSize="small" />}
                onClick={() => handleFilterChange('search', '')}
              >
                Search: {filters.search}
              </Chip>
            )}
            <Button size="sm" variant="plain" color="neutral" onClick={clearFilters}>
              Clear all
            </Button>
          </Box>
        </Box>
      )}

      {/* Search and Filters */}
      {showFilters && (
        <>
          {/* Mobile Filter Section */}
          <Sheet
            className="SearchAndFilters-mobile"
            sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
          >
            <Input
              size="sm"
              placeholder={`Search ${type}...`}
              startDecorator={<SearchIcon />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <IconButton
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setFilterOpen(true)}
            >
              <FilterAltIcon />
            </IconButton>
            <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
              <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                <ModalClose />
                <Typography id="filter-modal" level="h2">
                  Filters
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl size="sm">
                    <FormLabel>Status</FormLabel>
                    <Select
                      size="sm"
                      placeholder="Filter by status"
                      value={filters.status}
                      onChange={(_, value) => handleFilterChange('status', value)}
                    >
                      <Option value="all">All</Option>
                      {type === 'orders' && (
                        <>
                          <Option value="pending">Pending</Option>
                          <Option value="processing">Processing</Option>
                          <Option value="shipped">Shipped</Option>
                          <Option value="delivered">Delivered</Option>
                          <Option value="cancelled">Cancelled</Option>
                        </>
                      )}
                      {type === 'products' && (
                        <>
                          <Option value="brand new">Brand New</Option>
                          <Option value="uk used">UK Used</Option>
                          <Option value="out_of_stock">Out of Stock</Option>
                        </>
                      )}
                    </Select>
                  </FormControl>
                  <Button color="primary" onClick={() => setFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </Sheet>
              </ModalDialog>
            </Modal>
          </Sheet>

          {/* Desktop Filter Section */}
          <Box
            className="SearchAndFilters-tabletUp"
            sx={{
              borderRadius: 'sm',
              py: 2,
              display: { xs: 'none', sm: 'flex' },
              flexWrap: 'wrap',
              gap: 1.5,
              flexDirection: isTablet ? 'column' : 'row',
            }}
          >
            <FormControl sx={{ flex: 1 }} size="sm">
              <FormLabel>Search {type}</FormLabel>
              <Input 
                size="sm" 
                placeholder={`Search by any field...`} 
                startDecorator={<SearchIcon />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                endDecorator={filters.search && (
                  <IconButton size="sm" variant="plain" onClick={() => handleFilterChange('search', '')}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                )}
              />
            </FormControl>
            
            <FormControl size="sm" sx={{ minWidth: isTablet ? '100%' : 200 }}>
              <FormLabel>Status</FormLabel>
              <Select
                size="sm"
                placeholder="Filter by status"
                value={filters.status}
                onChange={(_, value) => handleFilterChange('status', value)}
              >
                <Option value="all">All</Option>
                {type === 'orders' && (
                  <>
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </>
                )}
                {type === 'products' && (
                  <>
                    <Option value="brand new">Brand New</Option>
                    <Option value="uk used">UK Used</Option>
                    <Option value="out_of_stock">Out of Stock</Option>
                  </>
                )}
              </Select>
            </FormControl>
          </Box>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Table View - With responsive adjustments */}
      {!loading && (
        <Sheet
          className="TableContainer"
          variant="outlined"
          sx={{
            width: '100%',
            borderRadius: 'sm',
            flexShrink: 0,
            overflow: 'auto',
            minHeight: 0,
            maxHeight: isMobile ? 'calc(100vh - 250px)' : 'calc(100vh - 300px)',
            '&::-webkit-scrollbar': {
              height: 8,
              width: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
          }}
        >
          <Table
            aria-labelledby="tableTitle"
            stickyHeader
            hoverRow
            sx={{
              '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
              '--Table-headerUnderlineThickness': '1px',
              '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
              '--TableCell-paddingY': isMobile ? '2px' : '4px',
              '--TableCell-paddingX': isMobile ? '4px' : '8px',
              minWidth: isMobile ? '100%' : 'auto',
            }}
          >
            <thead>
              <tr>
                <th style={{ 
                  width: isMobile ? 32 : 48, 
                  textAlign: 'center', 
                  padding: isMobile ? '8px 2px' : '12px 6px',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'var(--joy-palette-background-level1)',
                  zIndex: 3,
                }}>
                  <Checkbox
                    size="sm"
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={selected.length === paginatedRows.length && paginatedRows.length > 0}
                    onChange={(event) => handleSelectAll(event.target.checked)}
                    disabled={paginatedRows.length === 0}
                    color={selected.length > 0 ? 'primary' : undefined}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </th>
                {columns.map((column, index) => (
                  <th 
                    key={column.field}
                    style={{ 
                      width: isMobile ? 'auto' : column.width, 
                      padding: isMobile ? '8px 4px' : '12px 6px',
                      cursor: column.sortable ? 'pointer' : 'default',
                      minWidth: isMobile ? 80 : 'auto',
                      maxWidth: isMobile ? 120 : column.width,
                      whiteSpace: 'nowrap',
                      position: index === 0 ? 'sticky' : 'static',
                      left: index === 0 ? (isMobile ? 32 : 48) : 'auto',
                      backgroundColor: index === 0 ? 'var(--joy-palette-background-level1)' : 'transparent',
                      zIndex: index === 0 ? 2 : 1,
                    }}
                    onClick={() => column.sortable && handleSort(column.field)}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                    }}>
                      {column.header}
                      {column.sortable && orderBy === column.field && (
                        <ArrowDropDownIcon 
                          sx={{ 
                            transform: order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition: '0.2s',
                            fontSize: isMobile ? 16 : 20,
                          }} 
                        />
                      )}
                    </Box>
                  </th>
                ))}
                <th style={{ 
                  width: isMobile ? 60 : 80, 
                  padding: isMobile ? '8px 4px' : '12px 6px',
                  position: 'sticky',
                  right: 0,
                  backgroundColor: 'var(--joy-palette-background-level1)',
                  zIndex: 3,
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '40px' }}>
                    <Typography level="body-lg">No {type} found</Typography>
                    <Button size="sm" variant="plain" onClick={clearFilters} sx={{ mt: 1 }}>
                      Clear filters
                    </Button>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => onRowClick && onRowClick(row)}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    <td style={{ 
                      textAlign: 'center',
                      padding: isMobile ? '4px 2px' : '8px 6px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                    }} 
                    onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row.id)}
                        color={selected.includes(row.id) ? 'primary' : undefined}
                        onChange={(event) => handleSelectRow(row.id, event.target.checked)}
                        sx={{ verticalAlign: 'text-bottom' }}
                      />
                    </td>
                    {columns.map((column, index) => (
                      <td 
                        key={column.field}
                        style={{
                          padding: isMobile ? '4px 4px' : '8px 6px',
                          maxWidth: column.width,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          position: index === 0 ? 'sticky' : 'static',
                          left: index === 0 ? (isMobile ? 32 : 48) : 'auto',
                          backgroundColor: index === 0 ? 'white' : 'transparent',
                          zIndex: index === 0 ? 1 : 'auto',
                        }}
                      >
                        {renderResponsiveCell(row, column.field)}
                      </td>
                    ))}
                    <td 
                      style={{
                        padding: isMobile ? '4px 4px' : '8px 6px',
                        position: 'sticky',
                        right: 0,
                        backgroundColor: 'white',
                        zIndex: 1,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        gap: isMobile ? 0.5 : 1, 
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <RowMenu
                          onView={() => handleView(row)}
                          onEdit={() => handleEdit(row)}
                          onDelete={() => handleDeleteClick(row.id)}
                          showEdit={role === 'manager'}
                          showDelete={role === 'manager'}
                        />
                      </Box>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Sheet>
      )}

      {/* Pagination - Responsive */}
      {showPagination && !limit && pageCount > 1 && (
        <Box
          className="Pagination"
          sx={{
            pt: 2,
            gap: isMobile ? 0.5 : 1,
            [`& .${iconButtonClasses.root}`]: { 
              borderRadius: '50%',
              width: isMobile ? 28 : 36,
              height: isMobile ? 28 : 36,
            },
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            startDecorator={<KeyboardArrowLeftIcon />}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Previous
          </Button>

          <Box sx={{ 
            display: 'flex', 
            gap: isMobile ? 0.5 : 1, 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            order: isMobile ? -1 : 0,
          }}>
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter(page => {
                if (isMobile) {
                  const diff = Math.abs(page - currentPage);
                  return diff === 0 || diff === 1 || page === 1 || page === pageCount;
                }
                const diff = Math.abs(page - currentPage);
                return diff === 0 || diff === 1 || diff === 2 || page === 1 || page === pageCount;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <Typography level="body-sm" sx={{ alignSelf: 'center' }}>…</Typography>
                      <IconButton
                        size="sm"
                        variant={currentPage === page ? 'solid' : 'outlined'}
                        color={currentPage === page ? 'primary' : 'neutral'}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </IconButton>
                    </React.Fragment>
                  );
                }
                return (
                  <IconButton
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'solid' : 'outlined'}
                    color={currentPage === page ? 'primary' : 'neutral'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </IconButton>
                );
              })}
          </Box>

          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            endDecorator={<KeyboardArrowRightIcon />}
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Results Summary - Responsive */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 1,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0,
      }}>
        <Typography level="body-xs" textColor="text.secondary">
          Showing {paginatedRows.length} of {filteredRows.length} results
        </Typography>
        {!limit && filteredRows.length > 0 && showPagination && (
          <Typography level="body-xs" textColor="text.secondary">
            Page {currentPage} of {pageCount}
          </Typography>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        color={snackbar.color}
        variant="soft"
        size="md"
      >
        {snackbar.message}
      </Snackbar>

      {/* Detail Modal */}
      <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
        <ModalDialog
          aria-labelledby="detail-modal"
          layout="center"
          size="md"
          sx={{ maxWidth: 500, width: isMobile ? '90%' : 'auto' }}
        >
          <ModalClose />
          <Typography id="detail-modal" level="h2">
            {type === 'orders' && 'Order Details'}
            {type === 'products' && 'Product Details'}
            {type === 'customers' && 'Customer Details'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {selectedRow && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(selectedRow).map(([key, value]) => {
                if (value !== null && value !== undefined && key !== 'id' && key !== 'items') {
                  let displayValue = value;
                  if (key.includes('amount') || key.includes('price') || key.includes('spent')) {
                    displayValue = `UGX: ${Number(value).toLocaleString()}`;
                  } else if (key.includes('date') && value) {
                    displayValue = new Date(value as string).toLocaleString();
                  } else if (typeof value === 'object') {
                    return null;
                  }
                  
                  return (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography level="body-sm" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                        {key.replace('_', ' ')}:
                      </Typography>
                      <Typography level="body-sm" sx={{ maxWidth: '60%', textAlign: 'right' }}>
                        {String(displayValue)}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              })}
              {selectedRow.items && selectedRow.items.length > 0 && (
                <>
                  <Divider />
                  <Typography level="body-sm" fontWeight="bold">Order Items:</Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {selectedRow.items.map((item: any, index: number) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography level="body-xs">
                          {item.product_name || item.name || `Product #${item.product}`} x{item.quantity}
                        </Typography>
                        <Typography level="body-xs" fontWeight="md">
                          UGX: {(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
              <Divider />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="soft" color="neutral" onClick={() => setDetailModalOpen(false)}>
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </ModalDialog>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <ModalDialog
          aria-labelledby="delete-modal"
          layout="center"
          size="sm"
          sx={{ width: isMobile ? '90%' : 'auto' }}
        >
          <Typography id="delete-modal" level="h4" color="danger">
            Confirm Delete
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography level="body-md">
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Edit Product Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalDialog
          aria-labelledby="edit-modal"
          layout="center"
          size="md"
          sx={{ width: isMobile ? '90%' : 500 }}
        >
          <ModalClose />
          <Typography id="edit-modal" level="h4" color="primary">
            Edit Product
          </Typography>
          <Divider sx={{ my: 2 }} />
          <SmartForm 
            formControls={ProductFormFields}
            isLoading={false}
            buttonText="Update Product"
            formData={rowToEdit || {}}
            setFormData={() => {}}
            onSubmit={() => {}}
            variant="solid"
            isBtnDisabled={false}
            message="Updating..."
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export const OrdersTable = (props: Omit<AnalysisTableProps, 'type'>) => (
  <AnalysisTable type="orders" title="Orders Management" {...props} />
);

export const ProductsTable = (props: Omit<AnalysisTableProps, 'type'>) => (
  <AnalysisTable type="products" title="Products Inventory" {...props} />
);

export const CustomersTable = (props: Omit<AnalysisTableProps, 'type'>) => (
  <AnalysisTable type="customers" title="Customers List" {...props} />
);