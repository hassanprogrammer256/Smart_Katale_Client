import {
  Card,
  Sheet,
} from '@mui/joy';

import { ManagerOverview } from '../components/ui/analysis_overviews';
import { ManagerDashboard } from '../components/ui/tabs_horizontal_scroll';
import Header from '../components/common/header';




const StaffDashboard = () => {





  return (
    <>
    <Header />
   <Card variant="soft" sx={{marginBottom:3}}>
   <ManagerOverview/>
   </Card>
    
        <Sheet sx={{ p: 1, bgcolor: 'background.level1' }}>
<ManagerDashboard />
        </Sheet>
    
    </>
  );
};

export default StaffDashboard;



