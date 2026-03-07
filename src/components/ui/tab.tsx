import { Tab } from "@mui/joy";

const CustomTab = (props:any) => {
  const { children } = props;
  return (
    <Tab disableIndicator {...props}>
      {children}
    </Tab>
  );
};

export default CustomTab;