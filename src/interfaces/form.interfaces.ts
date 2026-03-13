import type { ColorPaletteProp} from "@mui/joy";

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
  validation?: {
    fileTypes?:string[];
    maxSize?: number
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface FormProps<T = Record<string, any>> {
  formControls?: ControlItem[];
  isLoading: boolean;
  buttonText: string;
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  variant?: 'solid' | 'soft' | 'outlined' | 'plain';
  isBtnDisabled?: boolean;
  message?: string;
  color?: ColorPaletteProp;
  showLabels?: boolean;

}