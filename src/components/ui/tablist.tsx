import { TabList, tabClasses } from "@mui/joy";

const CustomTabList = (props?:any) => {
  const { children, sx } = props;

  // Define the styles for the TabList component
  const styles = [
    {
      p: 0.5,
      gap: 0.5,
      borderRadius: 'xl',
      bgcolor: 'background.level1',
      [`& .${tabClasses.root}[aria-selected="true"]`]: {
        boxShadow: 'sm',
        bgcolor: 'background.surface',
      },
    },
    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  return (
    <TabList
      disableUnderline
      {...props}
      sx={styles}
    >
      {children}
    </TabList>
  );
};

export default CustomTabList;