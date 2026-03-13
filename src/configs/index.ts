export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

import {FaUser,FaUserPlus,FaCheck, FaSignOutAlt } from 'react-icons/fa';

export const AccountMenuItems_Auth = {
    items:[
  {
    name: "My Profile",
    to: "/my-profile", 
    icon: FaUser,
  },
 

    ],
    action_btns:[
{
    title: "Log Out",
    icon: FaSignOutAlt,
    function: () => {alert('clicked')}
  },
    ]
}
export const AccountMenuItems_NotAuth = {
 
    items:[
  {
    name: "Login",
    to: "/auth", 
    icon: FaUser,
    color:'success'
  },
  {
    name: "Sign Up",
    to: "/auth",
    icon: FaUserPlus,
    color:'danger'
  },


    ],
}

export const CartMenu_Items = {
    items:[
  {
    name: "View Cart",
    to: "cart", 
  }],
  action_buttons:[
    {
      title:'CheckOut',icon:FaCheck

    
    }
  ]


}

export const PaymentCardFormFields = [
  {
    name: 'card_number',
    label: 'Card Number',
    type: 'text',
    placeholder: 'Enter card number',
    required: true,
    validation: {minLength:16,maxLength:16,message:'Card number must be 16 characters long'}
  },
  {
    name: 'card_holder_name',
    label: 'Card Holder Name',
    type: 'text',
    placeholder: 'Enter card holder name',
    required: true
  },
  {
    name: 'expiry_date',
    label: 'Expiry Date',
    type: 'month',
    placeholder: 'MM/YY',
    required: true
  },
  {
    name: 'cvv',
    label: 'CVV',
    type: 'password',
    placeholder: 'Enter CVV',
    required: true,
    validation: {minLength:3,maxLength:4,message:'CVV must be 3-4 digits'}
  },
  {
    name: 'is_default',
    label: 'Set as default',
    type: 'checkbox',
    required: false
  }
];



export const CheckOutFormFields = [
{ name: 'first_name', type: 'text', placeholder: 'First Name',componentType: "input" },
{ name: 'last_name', type: 'text', placeholder: 'Last Name',componentType: "input" },
{ name: 'phone_number', type: 'text', placeholder: 'Phone Number',componentType: "input" },
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input" },
{ name: 'city', type: 'text', placeholder: 'City',componentType: "input"},    
{ name: 'town', type: 'text', placeholder: 'Town',componentType: "input"},    
]

export const UserOverview = [
  {label: "Pending Orders", value:'3'},
  {label: "New Messages", value:'2'},
  {label: "Addresses", value:'10'},
  {label: "Average Orders", value:'86%'},
]

export const UserAddressData = [
  {
    id:1,
    addressline1: "123 Main St",
    addressline2: "Apt 4B",
    city: "New York",
    town: "Manhattan"
  },
  {
    id:2,
    addressline1: "456 Elm St",
    addressline2: "",
    city: "Los Angeles",
    town: "Hollywood"
  },
  {
    id:3,
    addressline1: "789 Oak St",
    addressline2: "Suite 12",
    city: "Chicago",
    town: "Downtown"
  },
  {
    id:4,
    addressline1: "123 Main St",
    addressline2: "Apt 4B",
    city: "New York",
    town: "Manhattan"
  },
  {
    id:5,
    addressline1: "456 Elm St",
    addressline2: "",
    city: "Los Angeles",
    town: "Hollywood"
  },
  {
    id:6,
    addressline1: "789 Oak St",
    addressline2: "Suite 12",
    city: "Chicago",
    town: "Downtown"
  },
  {
    id:7,
    addressline1: "123 Main St",
    addressline2: "Apt 4B",
    city: "New York",
    town: "Manhattan"
  },
  {
    id:8,
    addressline1: "456 Elm St",
    addressline2: "",
    city: "Los Angeles",
    town: "Hollywood"
  },
  {
    id:9,
    addressline1: "789 Oak St",
    addressline2: "Suite 12",
    city: "Chicago",
    town: "Downtown"
  }
]

export const UserPaymentCardData = [
  {
    "id": 1,
    "number": "1234 5678 9012 3456",
    "expiry": "12/25",
    "cvv": "123"
  },
  {
    "id": 2,
    "number": "9876 5432 1098 7654",
    "expiry": "11/24",
    "cvv": "456"
  },
  {
    "id": 3,
    "number": "1111 2222 3333 4444",
    "expiry": "01/26",
    "cvv": "789"
  },
  {
    "id": 4,
    "number": "5555 6666 7777 8888",
    "expiry": "07/23",
    "cvv": "321"
  },
  {
    "id": 5,
    "number": "9999 0000 1111 2222",
    "expiry": "03/27",
    "cvv": "654"
  }
]


export const OrderRows = [
  {
    id: 'INV-1234',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
    amount:54000
  },
  {
    id: 'INV-1233',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
    amount:587000
  },
  {
    id: 'INV-1232',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
    amount:874000
  },
  {
    id: 'INV-1231',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
    amount:540000
  },
  {
    id: 'INV-1230',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
    amount:550000
  },
  {
    id: 'INV-1229',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
    amount:5478000
  },
  {
    id: 'INV-1228',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
    amount:7401100
  },
  {
    id: 'INV-1227',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1226',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
  {
    id: 'INV-1225',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1224',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1223',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1221',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1220',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1219',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1218',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1217',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1216',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
];

export   const ManagerDashBoardOverview=[
    { label: 'Total Sales', value: 0 },
    { label: 'Products', value: 0 },
    { label: 'Customers', value: 0 },
    { label: 'Pending Orders', value: 0 },
  ];




// Sample Customer Rows
export const CustomerRows = [
  {
    id: 'CUST-001',
    name: 'Olivia Rhye',
    email: 'olivia.rhye@email.com',
    initial: 'OR',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    orders: 24,
    spent: 4589.75,
    lastOrder: '2024-02-15',
    status: 'vip',
    joined: '2022-03-12',
    preferences: ['Electronics', 'Gaming'],
    paymentMethod: 'Visa *4242'
  },
  {
    id: 'CUST-002',
    name: 'Steve Hampton',
    email: 'steve.h@email.com',
    initial: 'SH',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    orders: 12,
    spent: 2345.50,
    lastOrder: '2024-02-10',
    status: 'active',
    joined: '2023-01-05',
    preferences: ['Home Appliances', 'Audio'],
    paymentMethod: 'Mastercard *5678'
  },
  {
    id: 'CUST-003',
    name: 'Ciaran Murray',
    email: 'ciaran.m@email.com',
    initial: 'CM',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    orders: 8,
    spent: 1567.25,
    lastOrder: '2024-01-28',
    status: 'active',
    joined: '2023-06-18',
    preferences: ['Computers', 'Accessories'],
    paymentMethod: 'PayPal'
  },
  {
    id: 'CUST-004',
    name: 'Marina Macdonald',
    email: 'marina.m@email.com',
    initial: 'MM',
    phone: '+1 (555) 456-7890',
    location: 'Miami, FL',
    orders: 31,
    spent: 6789.90,
    lastOrder: '2024-02-18',
    status: 'vip',
    joined: '2021-11-30',
    preferences: ['Smart Home', 'Electronics'],
    paymentMethod: 'Amex *3456'
  },
  {
    id: 'CUST-005',
    name: 'Charles Fulton',
    email: 'charles.f@email.com',
    initial: 'CF',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA',
    orders: 3,
    spent: 456.80,
    lastOrder: '2024-01-15',
    status: 'inactive',
    joined: '2024-01-15',
    preferences: ['Audio', 'Gaming'],
    paymentMethod: 'Visa *7890'
  },
  {
    id: 'CUST-006',
    name: 'Jay Hoper',
    email: 'jay.h@email.com',
    initial: 'JH',
    phone: '+1 (555) 678-9012',
    location: 'Denver, CO',
    orders: 15,
    spent: 2899.45,
    lastOrder: '2024-02-05',
    status: 'active',
    joined: '2022-09-22',
    preferences: ['Gaming', 'Computers'],
    paymentMethod: 'Mastercard *1234'
  },
  {
    id: 'CUST-007',
    name: 'Sophie Chen',
    email: 'sophie.c@email.com',
    initial: 'SC',
    phone: '+1 (555) 789-0123',
    location: 'San Francisco, CA',
    orders: 19,
    spent: 4234.60,
    lastOrder: '2024-02-12',
    status: 'vip',
    joined: '2022-05-08',
    preferences: ['Wearables', 'Electronics'],
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'CUST-008',
    name: 'Marcus Williams',
    email: 'marcus.w@email.com',
    initial: 'MW',
    phone: '+1 (555) 890-1234',
    location: 'Austin, TX',
    orders: 7,
    spent: 1234.30,
    lastOrder: '2024-01-30',
    status: 'active',
    joined: '2023-08-14',
    preferences: ['Home Appliances'],
    paymentMethod: 'Visa *5678'
  },
  {
    id: 'CUST-009',
    name: 'Elena Rodriguez',
    email: 'elena.r@email.com',
    initial: 'ER',
    phone: '+1 (555) 901-2345',
    location: 'Phoenix, AZ',
    orders: 22,
    spent: 5123.75,
    lastOrder: '2024-02-14',
    status: 'vip',
    joined: '2022-02-28',
    preferences: ['Smart Home', 'Electronics', 'Gaming'],
    paymentMethod: 'PayPal'
  },
  {
    id: 'CUST-010',
    name: 'Tom Bradley',
    email: 'tom.b@email.com',
    initial: 'TB',
    phone: '+1 (555) 012-3456',
    location: 'Boston, MA',
    orders: 2,
    spent: 345.99,
    lastOrder: '2024-01-05',
    status: 'inactive',
    joined: '2024-01-05',
    preferences: ['Audio'],
    paymentMethod: 'Mastercard *9012'
  },
  {
    id: 'CUST-011',
    name: 'Nina Patel',
    email: 'nina.p@email.com',
    initial: 'NP',
    phone: '+1 (555) 123-4568',
    location: 'Atlanta, GA',
    orders: 11,
    spent: 2134.85,
    lastOrder: '2024-02-08',
    status: 'active',
    joined: '2023-04-17',
    preferences: ['Computers', 'Accessories'],
    paymentMethod: 'Amex *6789'
  },
  {
    id: 'CUST-012',
    name: 'David Kim',
    email: 'david.k@email.com',
    initial: 'DK',
    phone: '+1 (555) 234-5679',
    location: 'Portland, OR',
    orders: 16,
    spent: 3456.40,
    lastOrder: '2024-02-01',
    status: 'active',
    joined: '2022-07-11',
    preferences: ['Gaming', 'Wearables'],
    paymentMethod: 'Visa *3456'
  },
  {
    id: 'CUST-013',
    name: 'Rachel Green',
    email: 'rachel.g@email.com',
    initial: 'RG',
    phone: '+1 (555) 345-6780',
    location: 'Dallas, TX',
    orders: 5,
    spent: 876.50,
    lastOrder: '2024-01-20',
    status: 'active',
    joined: '2023-11-03',
    preferences: ['Home Appliances'],
    paymentMethod: 'PayPal'
  },
  {
    id: 'CUST-014',
    name: 'James Wilson',
    email: 'james.w@email.com',
    initial: 'JW',
    phone: '+1 (555) 456-7891',
    location: 'San Diego, CA',
    orders: 28,
    spent: 5890.20,
    lastOrder: '2024-02-16',
    status: 'vip',
    joined: '2021-12-09',
    preferences: ['Electronics', 'Computers', 'Gaming'],
    paymentMethod: 'Mastercard *7890'
  },
  {
    id: 'CUST-015',
    name: 'Lisa Thompson',
    email: 'lisa.t@email.com',
    initial: 'LT',
    phone: '+1 (555) 567-8902',
    location: 'Nashville, TN',
    orders: 9,
    spent: 1987.30,
    lastOrder: '2024-02-03',
    status: 'active',
    joined: '2023-09-25',
    preferences: ['Smart Home', 'Audio'],
    paymentMethod: 'Visa *2345'
  }
];

// Sample Analytics Data
export const AnalyticsData = {
  revenue: {
    daily: 12590.45,
    weekly: 87654.30,
    monthly: 345678.90,
    yearly: 4123456.70
  },
  orders: {
    daily: 124,
    weekly: 876,
    monthly: 3456,
    yearly: 41234
  },
  customers: {
    active: 1234,
    new: 56,
    returning: 89,
    churned: 23
  },
  products: {
    viewed: 5678,
    addedToCart: 1234,
    purchased: 890,
    wishlisted: 345
  },
  performance: {
    conversionRate: 3.24,
    averageOrderValue: 101.24,
    customerLifetimeValue: 1250.45,
    retentionRate: 76.5
  }
};