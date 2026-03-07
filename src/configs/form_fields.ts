export const ContactUsFooterFormFields = [
{ name: 'customer_name', type: 'text', placeholder: 'Full Names',componentType: "input" },
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input" } , 
{ name: 'subject', type: 'text', placeholder: 'Subject',componentType: "input" },  
{ name: 'message', type: 'text', placeholder: 'Write message here.....',componentType: "textarea" }    
]
export const ProductFormFields = [
{ name: 'product_name', type: 'text', placeholder: 'Product Name',componentType: "input",required:true },
{ name: 'product_description', type: 'text', placeholder: 'Product Description',componentType: "input" ,required:true} , 
{ name: 'product_price', type: 'number', placeholder: 'Product Price',componentType: "input" ,required:true},  
{ name: 'product_categories', type: 'text', placeholder: 'Select All Product Categories',componentType: "select" ,required:true} ,   
{ name: 'product_brands', type: 'text', placeholder: 'Select All Product Brands',componentType: "select",required:true } ,   
{ name: 'product_discount', type: 'number', placeholder: 'Product Discount, if any',componentType: "input" } ,   
{ name: 'product_status', type: 'text', placeholder: 'Select Product Status',componentType: "select",options:[
  {
  label:'Brand New', value:'Brand New'
},
  {
  label:'Uk Used', value:'Uk Used'
}
] } ,   
{ name: 'product_categories', type: 'text', placeholder: 'Select All Product Categories',componentType: "select" } ,   
{ name: 'product_categories', type: 'text', placeholder: 'Select All Product Categories',componentType: "select" } ,   
]

export const LoginFormFields = [
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input" },
{ name: 'password', type: 'password', placeholder: 'Password',componentType: "input"},    
]
export const RegisterFormFields = [
{ name: 'first_name', type: 'text', placeholder: 'First Name',componentType: "input" , required: true },
{ name: 'last_name', type: 'text', placeholder: 'Last Name',componentType: "input"  , required: true},
{ name: 'phone_number', type: 'text', placeholder: 'Phone Number',componentType: "input" , required: true },
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input"  , required: true},
{ name: 'password', type: 'password', placeholder: 'Create Password',componentType: "input" , required: true},    
]
export const UpdateProfileFormFields = [
{ name: 'first_name', type: 'text', placeholder: 'First Name',componentType: "input" },
{ name: 'last_name', type: 'text', placeholder: 'Last Name',componentType: "input" },
{ name: 'phone_number', type: 'text', placeholder: 'Phone Number',componentType: "input" },
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input" },
{ name: 'password', type: 'text', placeholder: 'Change Password',componentType: "input"},
]
export const UnAuthUserCheckOutFormFields = [
  {
    name: 'first_name',
    label: 'First Name',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    name: 'last_name',
    label: 'Last Name',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your last name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    componentType: 'email',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'tel',
    componentType: 'input',
    placeholder: 'Enter your phone number (10 digits)',
    required: true,
  },
  {
    name: 'payment_method',
    label: 'Payment Method',
    type: 'text',
    componentType: 'select',
    placeholder: 'Select payment method',
    required: true,
    options: [
      { value: 'cash', label: 'Cash' },
      
    ],
  },
  {
    name: 'order_type',
    label: 'Order Type',
    type: 'text',
    componentType: 'select',
    placeholder: 'Select order type',
    required: true,
    options: [
      { value: 'door_delivery', label: 'Door Delivery' },
      { value: 'booking', label: 'Booking' },
    ],
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your city',
    required: true,
  },
  {
    name: 'town',
    label: 'Town',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your town',
    required: true,
  },
  {
    name: 'address',
    label: 'Current Address',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your current Address',
    required: true,
  },
];
export const UpdateAddressFormFields = [
{ name: 'city', type: 'text', placeholder: 'City',componentType: "input" },
{ name: 'town', type: 'text', placeholder: 'Town',componentType: "input" },
{ name: 'addressline1', type: 'text', placeholder: 'Address Line 1',componentType: "input" },
{ name: 'addressline2', type: 'text', placeholder: 'Address Line 2 (Optional)',componentType: "input" },  
]

export const UpdatePaymentCardFormFields = [
{ name: 'card_number', type: 'text', placeholder: 'Card Number',componentType: "input" },
{ name: 'expiry', type: 'text', placeholder: 'Expiry Date (MM/YY)',componentType: "input" },
{ name: 'cvv', type: 'text', placeholder: 'CVV Code',componentType: "input" },  
]
