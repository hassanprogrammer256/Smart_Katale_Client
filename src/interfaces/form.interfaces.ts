import type { ColorPaletteProp, VariantProp } from "@mui/joy";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ControlItem {
  name: string;
  type: string;
  placeholder?: string;
  componentType?: string;
  value?: any;
  options?: SelectOption[]; 
  label?: string; 
  required?: boolean; 
}

export interface FormProps {
  formControls?: ControlItem[];
  formData?: { [key: string]: any };
  setFormData?: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  buttonText?: string;
  isBtnDisabled?: boolean;
  isLoading?: boolean;
  message?: string;
  variant?: VariantProp;
  color?: ColorPaletteProp;
  showLabels?: boolean;
}