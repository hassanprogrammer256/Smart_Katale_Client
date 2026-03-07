import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Button, ButtonGroup } from '@mui/joy';
import { FaPen, FaTrash } from 'react-icons/fa';
import type { AddressCardProps } from '../../interfaces/users.interfaces';



export default function AddressCard(props: AddressCardProps) {
       const buttons = [
  <Button  size='sm' key="edit" color='success'><FaPen /></Button>,
  <Button   size='sm' key="space" variant='plain' color='neutral' disabled></Button>,
  <Button size='sm' key="delete" color='danger' onClick={() => alert('deleted')}><FaTrash /></Button>,
];
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
  
      
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 2,
      minWidth: 320,
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
      }}
    >
      <CardContent>
        <Typography level="title-lg" id="card-description">
            {props.addressline1}
        </Typography>
        <Typography
          level="body-sm"
          aria-describedby="card-description"
          sx={{ mb: 1 }}
        >

            {props.town}, {props.city}
          
        </Typography>
    <ButtonGroup size='sm'
        orientation="horizontal"
        variant="solid"
   
      >
        {buttons}
    </ButtonGroup>
      </CardContent>
    </Card>
  );
}
