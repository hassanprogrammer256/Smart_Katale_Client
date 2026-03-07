import Box from '@mui/joy/Box';
import SmartForm from '../common/form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Card, Divider, Stack, Typography } from '@mui/joy';
import { UpdatePaymentCardFormFields } from '../../configs/form_fields';


export default function PaymentCardForm() {

const navigate = useNavigate()
  //  const dispatch= useDispatch()
 const  [isloading,setIsloading] = useState(false)
const userData: { card_holder:string; card_number:string; expiry: string; cvv: string; } = {
  card_holder: '',
  card_number: '',
    expiry: '',
    cvv: '',
  }
  const [formData, setFormData] =React.useState<{ [key: string]: string }>(userData);
// const  {addToast}  = useToast();

 const isFormValid = () => {
  return Object.entries(formData)
    .every(([_key,value]) => value !== "");
}


const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsloading(true);
  
    setIsloading(true);
navigate('/')
    setIsloading(false)

  


  }

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
 
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 1 },
          py: { xs: 2, md: 1 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">ADD CARD</Typography>
          </Box>
          <Divider />
  
          <Stack
            direction="column"
            spacing={2}
            sx={{ my: 1 }}
          >
   <SmartForm  formControls={UpdatePaymentCardFormFields}
          isLoading = {isloading}
          buttonText={"ADD CARD"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          variant='solid'
          isBtnDisabled={!isFormValid()}
          message='ADDING......'
         />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}