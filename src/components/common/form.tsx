import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/joy/Button';
import type { ControlItem, FormProps } from '../../interfaces/form.interfaces';


const SmartForm = ({
  formControls = [],
  formData = {},
  setFormData,
  onSubmit,
  buttonText = "Submit",
  isBtnDisabled = false,
  isLoading = false,
  message,
  color = "success",
  showLabels = true,
}: FormProps) => {
  
  const renderInputsByComponentType = (controlItem: ControlItem) => {
    const value = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case "input":
        return (
          <Input
            color={color}
            name={controlItem.name}
            variant="outlined"
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            required={controlItem.required}
            onChange={(event) =>
              setFormData ? setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              }) : null
            }
          />
        );

      case "select":
        return (
          <Select
            variant="outlined"
            color={color}
            placeholder={controlItem.placeholder || "Select an option"}
            indicator={<KeyboardArrowDown />}
            id={controlItem.name}
            value={value}
            required={controlItem.required}
            onChange={(_, newValue) => {
              if (setFormData) {
                setFormData({
                  ...formData,
                  [controlItem.name]: newValue,
                });
              }
            }}
            sx={{ width: '100%' }}
          >
            {controlItem.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            variant="outlined"
            color={color}
            placeholder={controlItem.placeholder}
            minRows={3}
            id={controlItem.name}
            value={value}
            required={controlItem.required}
            onChange={(event) => {
              if (setFormData) {
                setFormData({
                  ...formData,
                  [controlItem.name]: event.target.value,
                });
              }
            }}
            sx={{
              '&::before': { display: 'none' },
              '&:focus-within': {
                outline: '2px solid var(--Textarea-focusedHighlight)',
                outlineOffset: '1px',
              },
            }}
          />
        );

      case "password":
        return (
          <Input
            color={color}
            name={controlItem.name}
            variant="outlined"
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type="password"
            value={value}
            required={controlItem.required}
            onChange={(event) =>
              setFormData ? setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              }) : null
            }
          />
        );

      case "email":
        return (
          <Input
            color={color}
            name={controlItem.name}
            variant="outlined"
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type="email"
            value={value}
            required={controlItem.required}
            onChange={(event) =>
              setFormData ? setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              }) : null
            }
          />
        );

      case "number":
        return (
          <Input
            color={color}
            name={controlItem.name}
            variant="outlined"
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type="number"
            value={value}
            required={controlItem.required}
            onChange={(event) =>
              setFormData ? setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              }) : null
            }
          />
        );

      default:
        return (
          <Input
            color={color}
            name={controlItem.name}
            variant="outlined"
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type || "text"}
            value={value}
            required={controlItem.required}
            onChange={(event) => {
              if (setFormData) {
                setFormData({
                  ...formData,
                  [controlItem.name]: event.target.value,
                });
              }
            }}
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            {showLabels && controlItem.label && (
              <label 
                htmlFor={controlItem.name}
                className="text-sm font-medium text-gray-700"
              >
                {controlItem.label}
                {controlItem.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      
      {isLoading ? (
        <div className="w-full flex justify-center mt-6">
          <button
            className="w-full relative inline-flex justify-center items-center px-4 py-2.5 font-semibold border border-transparent rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            disabled
          >
            <div className="flex justify-center items-center">
              <div className="rounded-full border-2 border-white animate-spin w-5 h-5 border-t-transparent mr-3"></div>
              {message || 'LOADING...'}
            </div>
          </button>
        </div>
      ) : (
        <div className="flex justify-center my-6">
          <Button
            variant="solid"
            color={color}
            type="submit"
            loading={isLoading}
            disabled={isBtnDisabled}
            sx={{
              width: '50%',
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                transform: 'scale(1.02)',
              },
              transition: 'all 0.2s',
            }}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </form>
  );
};

export default SmartForm;