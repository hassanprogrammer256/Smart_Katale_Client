
import { Tabs } from "@mui/joy";

const CustomTabs = (props?:any) => {
  const { children } = props;
  return (
    <Tabs sx={{ bgcolor: "transparent" }} {...props}>
      {children}
    </Tabs>
  );
};

export default CustomTabs;