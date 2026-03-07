import Box from '@mui/joy/Box';
import SmartForm from '../common/form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Card, Divider, Stack, Typography } from '@mui/joy';
import { UpdateAddressFormFields } from '../../configs/form_fields';


export default function Address() {

const navigate = useNavigate()

 const  [isloading,setIsloading] = useState(false)
const userData: { city:string; town:string; addressline1: string; addressline2: string; } = {
  city: '',
  town: '',
    addressline1: '',
    addressline2: '',
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
          px: { xs: 1, md: 2 },
          py: { xs: 1, md: 2 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">ADD ADDRESS</Typography>
          </Box>
          <Divider />
  
          <Stack
            direction="column"
            spacing={2}
            sx={{ my: 1 }}
          >
   <SmartForm  formControls={UpdateAddressFormFields}
          isLoading = {isloading}
          buttonText={"ADD ADDRESS"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          variant='solid'
          isBtnDisabled={!isFormValid()}
          message='ADDING ADDRESS......'
         />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}