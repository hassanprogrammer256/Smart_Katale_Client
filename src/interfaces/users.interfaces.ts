
export interface CustomerDataProp {
  success:boolean;
  Cards: {
    count: number;
    details: Array<{
      id: number;
      card_number?: string;
      expiry_date?: string;
      card_holder_name?: string;
    }>;
  };
  Addresses: {
    count: number;
    details: Array<{
      id: number;
      address_line1?: string;
      town?: string;
      city?: string;

    }>;
  };
  Orders: {
    pending_orders: number;
    details: Array<any>;
  };
}

export interface ManagerDataProp {
  success:boolean;
  products: {
    products: Array<any>;
    summary: any;
    sales: any;
  };
  orders: {
    pending: {
      count: number;
      details: Array<any>;
    };
    top_orders: Array<any>;
    order_details: Array<any>;
    summary: {
      delivered_orders: number;
      last_delivery_date: string;
    };
  };
}

export interface CustomerPaymnentCardsProps{
    count:number;
    details:[]
}
export interface CustomerAddressCardsProps{
    count:number;
    details:[]
}

export interface AddressCardProps {
  city: string;
  town: string;
  addressline1: string;
  addressline2?: string;
 
}

export interface OverviewData {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export interface OverviewProps {
  overview_data?: OverviewData[];
  role?: 'customer' | 'manager';
  userId?: number | string | null;
  showLoading?: boolean;
}

export interface PaymentCardFormProps {
  cardToEdit?: {
    id: number;
    card_number: string;
    expiry_date: string;
    cvv?: string;
    card_holder_name?: string;
    is_default?: boolean;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}



