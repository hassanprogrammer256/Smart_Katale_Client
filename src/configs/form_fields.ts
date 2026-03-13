


export const ContactUsFooterFormFields = [
{ name: 'customer_name', type: 'text', placeholder: 'Full Names',componentType: "input",required:true,showLabels:true },
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input",required:true,showLabels:true, validation:{pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message:'Invalid email Address'} } , 
{ name: 'subject', type: 'text', placeholder: 'Subject',componentType: "input",required:true,showLabels:true },  
{ name: 'message', type: 'text', placeholder: 'Write message here.....',componentType: "textarea",required:true,showLabels:true }    
]


export const LoginFormFields = [
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input",validation:{pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message:'Invalid email Address'} } ,
{ name: 'password', type: 'password', placeholder: 'Password',componentType: "input"},    
]
export const RegisterFormFields = [
{ name: 'first_name', type: 'text', placeholder: 'First Name',componentType: "input" , required: true, validation:{minLength:5,maxLength:30,message:'First name must be between 5 and 30 characters'} } ,
{ name: 'last_name', type: 'text', placeholder: 'Last Name',componentType: "input"  , required: true, validation:{minLength:5,maxLength:30,message:'Last name must be between 5 and 30 characters'} } ,
{ name: 'phone_number', type: 'text', placeholder: 'Phone Number',componentType: "input" , required: true, validation:{minLength:10,maxLength:15,message:'Phone number must be between 10 and 15 characters'} },
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input"  , required: true, validation:{pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message:'Invalid email Address'} },
{ name: 'password', type: 'password', placeholder: 'Create Password',componentType: "input" , required: true,validation:{minLength:8,message:'Password must be at least 8 characters long'}},    
]
export const UpdateProfileFormFields = [
{ name: 'first_name', type: 'text', placeholder: 'First Name',componentType: "input",validation:{minLength:5,maxLength:30,message:'First name must be between 5 and 30 characters'} } ,
{ name: 'last_name', type: 'text', placeholder: 'Last Name',componentType: "input",validation:{minLength:5,maxLength:30,message:'Last name must be between 5 and 30 characters'} } ,
{ name: 'phone_number', type: 'text', placeholder: 'Phone Number',componentType: "input",validation:{minLength:10,maxLength:15,message:'Phone number must be between 10 and 15 characters'} } ,
{ name: 'email', type: 'email', placeholder: 'Email Address',componentType: "input",validation:{pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message:'Invalid email Address'} } ,
{ name: 'password', type: 'password', placeholder: 'Change Password',componentType: "input",validation:{minLength:8,message:'Password must be at least 8 characters long'}},
]
export const UnAuthUserCheckOutFormFields = [
  {
    name: 'first_name',
    label: 'First Name',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your first name',
    required: true,
    validation:{minLength:5,maxLength:30,message:'First name must be between 5 and 30 characters'}
  },
  {
    name: 'last_name',
    label: 'Last Name',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your last name',
    required: true,
    validation:{minLength:5,maxLength:30,message:'Last name must be between 5 and 30 characters'}
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    componentType: 'email',
    placeholder: 'you@example.com',
    required: true,
    validation:{pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message:'Invalid email Address'}
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'tel',
    componentType: 'input',
    placeholder: 'Enter your phone number (10 digits)',
    required: true,
    validation:{minLength:10,maxLength:15,message:'Phone number must be between 10 and 15 characters'}
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
    validation:{minLength:3,maxLength:100,message:'City must be between 3 and 100 characters'}

  },
  {
    name: 'town',
    label: 'Town',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your town',
    required: true,
    validation:{minLength:3,maxLength:100,message:'Town must be between 3 and 100 characters'}
  },
  {
    name: 'address',
    label: 'Current Address',
    type: 'text',
    componentType: 'input',
    placeholder: 'Enter your current Address',
    required: true,
    validation:{minLength:5,maxLength:200,message:'Address must be between 5 and 200 characters'}

  },
];
export const UpdateAddressFormFields = [
{ name: 'city', type: 'text', placeholder: 'City',componentType: "input",validation:{minLength:3,maxLength:100,message:'City must be between 3 and 100 characters'} },
{ name: 'town', type: 'text', placeholder: 'Town',componentType: "input",validation:{minLength:3,maxLength:100,message:'Town must be between 3 and 100 characters'} },
{ name: 'addressline1', type: 'text', placeholder: 'Address Line 1',componentType: "input",validation:{minLength:5,maxLength:200,message:'Address Line 1 must be between 5 and 200 characters'} },
{ name: 'addressline2', type: 'text', placeholder: 'Address Line 2 (Optional)',componentType: "input",validation:{minLength:5,maxLength:200,message:'Address Line 2 must be between 5 and 200 characters'} },  
]

export const UpdatePaymentCardFormFields = [
{ name: 'card_number', type: 'text', placeholder: 'Card Number',componentType: "input",validation:{minLength:16,maxLength:16,message:'Card number must be 16 characters long'} },
{ name: 'expiry', type: 'text', placeholder: 'Expiry Date (MM/YY)',componentType: "input",validation:{pattern:/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, message:'Invalid expiry date'} },
{ name: 'cvv', type: 'text', placeholder: 'CVV Code',componentType: "input",validation:{minLength:3,maxLength:4,message:'CVV must be between 3 and 4 characters'} },  
]
