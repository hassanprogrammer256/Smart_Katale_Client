import { Card, Typography } from "@mui/joy"
import { Overview } from "../components/ui/analysis_overviews"
import { CustomerDashboard } from "../components/ui/tabs_horizontal_scroll"


const MyProfile = () => {
  return (
<>
<Card variant="soft" sx={{marginBottom:3}}>
<Typography sx={{fontWeight:800,color:'gray',textTransform:'capitalize',fontSize:'xl',textAlign:'center',marginBottom:2}}>My Profile</Typography>
<Overview />
</Card>
<CustomerDashboard />

</>
  )
}

export default MyProfile
