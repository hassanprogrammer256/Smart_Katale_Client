import { Box, Card, CircularProgress, Grid, Stack, Typography } from "@mui/joy"

export const BestStats = () => {
//   const { role } = useSelector((state) => state.auth);
  return (
    <Box sx={{ bgcolor: 'background.body', my: '5px' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: 14,
          p: 2,
          m: 0,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          bgcolor: 'success.900',
          color: 'common.white',
        }}
      >
       Latest Orders
      </Typography>
      <Grid spacing={1} sx={{ m: '2px' }}>
        {new Array(5).fill(0).map((e, index) => (
          
    <Grid xs={12} sm={12} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: 1,
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1} gap={2}>
                    <Typography level="h4">{index === 0 ? 1 : index + 1}</Typography>
                    <div className="flex justify-between w-full">
                     
                        <Typography component="h5" noWrap>{e?.name}</Typography>
                    
                     
                     <CircularProgress
                        color='success'
                        size="md"
                        determinate
                        value= {index * 2}
                        
                      >
                       `{index * 2}%`
                      </CircularProgress>
                    </div>
                  </Stack>
                </Card>
              </Grid>


            ))}
       
      </Grid>
    </Box>
  );
};