import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import { useForm, Controller,  type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ControlItem, FormProps } from '../../interfaces/form.interfaces';
import { useEffect, useRef,  useMemo} from 'react';

import { CircularProgress } from '@mui/joy';
import ImageInput from './file_input';

const createValidationSchema = (formControls?: ControlItem[]) => {
  if (!formControls || formControls.length === 0) return z.object({});
  
  const shape: Record<string, any> = {};
  
  formControls.forEach((control) => {
    let validator: z.ZodTypeAny;

    // Handle file upload specially
    if (control.componentType === 'file') {
      // Allow both File objects and URL strings
      validator = z.union([
        z.instanceof(File, {
          message: `${control.label || control.name} must be a valid file`
        }),
        z.string().url({ message: 'Invalid image URL' })
      ]);
      
      if (!control.required) {
        validator = validator.optional();
      }

      shape[control.name] = validator;
      return;
    }
    
    // Build validator based on type
    switch (control.type) {
      case 'number': {
        // Create base number validator and apply range checks before preprocessing
        let baseNumber = z.number();

        // Apply min validation if specified
        if (control.validation?.min !== undefined) {
          baseNumber = baseNumber.min(control.validation.min, {
            message: `${control.label || control.name} must be at least ${control.validation.min}`
          });
        }

        // Apply max validation if specified
        if (control.validation?.max !== undefined) {
          baseNumber = baseNumber.max(control.validation.max, {
            message: `${control.label || control.name} must be at most ${control.validation.max}`
          });
        }

        const numberValidator = z.preprocess(
          (val) => {
            if (val === '' || val === null || val === undefined) return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
          },
          baseNumber
        );

        validator = numberValidator;
        break;
      }
      
      case 'email': {
        let emailValidator = z.string().email({
          message: `${control.label || control.name} must be a valid email address`
        });
        
        // Apply max length if specified
        if (control.validation?.maxLength) {
          emailValidator = emailValidator.max(control.validation.maxLength, {
            message: `${control.label || control.name} must be at most ${control.validation.maxLength} characters`
          });
        }
        
        validator = emailValidator;
        break;
      }
      
      case 'password': {
        let stringValidator = z.string();
        
        // Apply min length
        if (control.validation?.minLength) {
          stringValidator = stringValidator.min(control.validation.minLength, {
            message: `${control.label || control.name} must be at least ${control.validation.minLength} characters`
          });
        }
        
        // Apply max length
        if (control.validation?.maxLength) {
          stringValidator = stringValidator.max(control.validation.maxLength, {
            message: `${control.label || control.name} must be at most ${control.validation.maxLength} characters`
          });
        }
        
        // Apply pattern validation
        if (control.validation?.pattern) {
          stringValidator = stringValidator.regex(control.validation.pattern, {
            message: control.validation.message || `${control.label || control.name} has invalid format`
          });
        }
        
        validator = stringValidator;
        break;
      }
      
      default: {
        let stringValidator = z.string({
          message: `${control.label || control.name} must be a string`
        });
        
        // Apply min length
        if (control.validation?.minLength) {
          stringValidator = stringValidator.min(control.validation.minLength, {
            message: `${control.label || control.name} must be at least ${control.validation.minLength} characters`
          });
        }
        
        // Apply max length
        if (control.validation?.maxLength) {
          stringValidator = stringValidator.max(control.validation.maxLength, {
            message: `${control.label || control.name} must be at most ${control.validation.maxLength} characters`
          });
        }
        
        // Apply pattern validation
        if (control.validation?.pattern) {
          stringValidator = stringValidator.regex(control.validation.pattern, {
            message: control.validation.message || `${control.label || control.name} has invalid format`
          });
        }
        
        validator = stringValidator;
      }
    }
    
    // Handle required fields for non-number types
    if (control.required && control.type !== 'number') {
      // For strings, ensure non-empty (already handled by required_error for numbers)
      validator = (validator as z.ZodString).min(1, {
        message: `${control.label || control.name} is required`
      });
    }
    
    if (!control.required) {
      validator = validator.optional();
    }
    
    shape[control.name] = validator;
  });
  
  return z.object(shape);
};

type FormData = Record<string, any>;


const SmartForm = <T extends FormData>({
  formControls,
  isLoading,
  buttonText,
  formData: externalFormData,
  setFormData: externalSetFormData,
  onSubmit,
  isBtnDisabled =false,
  color = 'success',
  message = 'Submitting...',
  showLabels = true,
}: FormProps<T>) => {
  
  // Create validation schema
  const validationSchema = useMemo(
    () => createValidationSchema(formControls),
    [formControls]
  );
  
  type ValidationSchema = z.infer<typeof validationSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting,},
    watch,
    reset,
    trigger
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: externalFormData as any
  });

  // Track previous external data to avoid unnecessary resets
  const prevExternalDataRef = useRef(externalFormData);
  const isFirstRender = useRef(true);

  // Sync with external form data when it changes externally
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const hasChanged = JSON.stringify(externalFormData) !== JSON.stringify(prevExternalDataRef.current);
    
    if (hasChanged && externalFormData) {
      reset(externalFormData as any);
      prevExternalDataRef.current = externalFormData;
    }
  }, [externalFormData, reset]);

  // Watch for changes and update external state
  const watchedValues = watch();
  
  // Use a timeout to debounce external updates
  const timeoutRef = useRef<any>(null);
  
  useEffect(() => {
    if (!externalSetFormData) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const hasChanged = JSON.stringify(watchedValues) !== JSON.stringify(prevExternalDataRef.current);
      
      if (hasChanged) {
        externalSetFormData(watchedValues as T);
        prevExternalDataRef.current = watchedValues as T;
      }
    }, 300);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watchedValues, externalSetFormData]);

  const onFormSubmit = handleSubmit((_data) => {
    if (onSubmit) {
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: document.createElement('form')
      } as React.FormEvent<HTMLFormElement>;
      
      onSubmit(syntheticEvent);
    }
  });

  const renderFieldError = (fieldName: string) => {
    const error = errors[fieldName as keyof typeof errors];
    if (!error) return null;
    
    return (
      <Typography 
        level="body-xs" 
        color="danger" 
        sx={{ mt: 0.5, ml: 1 }}
      >
        {error.message as string}
      </Typography>
    );
  };

  const renderInputByComponentType = (controlItem: ControlItem) => {
    const fieldName = controlItem.name as Path<ValidationSchema>;
    const error = errors[fieldName];

    const commonProps = {
      color: (error ? 'danger' : color) as any,
      variant: 'outlined' as const,
      placeholder: controlItem.placeholder,
      id: controlItem.name,
      required: controlItem.required,
    };

    // Handle file input separately
    if (controlItem.componentType === 'file') {
      return (
        <div key={controlItem.name} className="w-full">
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <ImageInput
                controlItem={controlItem}
                value={field.value as File | null}
                onChange={(file) => {
                  field.onChange(file);
                  trigger(fieldName);
                }}
                error={error?.message as string}
                color={color}
              />
            )}
          />
          {renderFieldError(controlItem.name)}
        </div>
      );
    }

    switch (controlItem.componentType) {
      case "input":
      case "password":
      case "email":
      
        return (
          <div key={controlItem.name} className="w-full">
            {showLabels && controlItem.label && (
              <label 
                htmlFor={controlItem.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {controlItem.label}
                {controlItem.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  {...commonProps}
                  type={controlItem.type}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = controlItem.type === 'number' 
                      ? (e.target.value === '' ? '' : e.target.value)
                      : e.target.value;
                    field.onChange(value);
                    trigger(fieldName);
                  }}
                  slotProps={{
                    input: controlItem.type === 'number' ? {
                      min: controlItem.validation?.min || 0,
                      step: 'any'
                    } : undefined
                  }}
                  aria-label={controlItem.label}
                />
              )}
            />
            {renderFieldError(controlItem.name)}
          </div>
        );

      case "select":
        return (
          <div key={controlItem.name} className="w-full">
            {showLabels && controlItem.label && (
              <label 
                htmlFor={controlItem.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {controlItem.label}
                {controlItem.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Select
                  {...commonProps}
                  value={field.value || null}
                  indicator={<KeyboardArrowDown />}
                  onChange={(_, newValue) => {
                    field.onChange(newValue);
                    trigger(fieldName);
                  }}
                  sx={{ width: '100%' }}
                  aria-label={controlItem.label}
                >
                  <Option value="">Select an option</Option>
                  {controlItem.options?.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {renderFieldError(controlItem.name)}
          </div>
        );

      case "textarea":
        return (
          <div key={controlItem.name} className="w-full">
            {showLabels && controlItem.label && (
              <label 
                htmlFor={controlItem.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {controlItem.label}
                {controlItem.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  {...commonProps}
                  minRows={3}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger(fieldName);
                  }}
                  sx={{
                    '&::before': { display: 'none' },
                    '&:focus-within': {
                      outline: '2px solid var(--Textarea-focusedHighlight)',
                      outlineOffset: '1px',
                    },
                  }}
                  aria-label={controlItem.label}
                />
              )}
            />
            {renderFieldError(controlItem.name)}
          </div>
        );
      
      case "file":
          return (
      <div key={controlItem.name} className="w-full">
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <ImageInput
              controlItem={controlItem}
              value={field.value as File | null}
              onChange={(file) => {
                field.onChange(file);
                trigger(fieldName as any);
              }}
              error={error?.message as string}
              color={color}
            />
          )}
        />
        {renderFieldError(controlItem.name)}
      </div>
    );


      default:
        return (
          <div key={controlItem.name} className="w-full">
            {showLabels && controlItem.label && (
              <label 
                htmlFor={controlItem.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {controlItem.label}
                {controlItem.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  {...commonProps}
                  type={controlItem.type || "text"}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger(fieldName);
                  }}
                  aria-label={controlItem.label}
                />
              )}
            />
            {renderFieldError(controlItem.name)}
          </div>
        );
    }
  };


  return (
    <form onSubmit={onFormSubmit} className="w-full" noValidate>
      <div className="flex flex-col gap-4">
        {formControls?.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}
      </div>
      
      {isLoading || isSubmitting ? (
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            className="w-full relative inline-flex justify-center items-center px-4 py-2.5 font-semibold border border-transparent rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="flex justify-center items-center">
              <CircularProgress size="sm" sx={{ mr: 2, color: 'white' }} />
              {message}
            </div>
          </button>
        </div>
      ) : (
        <div className="flex justify-center my-6">
          <Button
            variant="solid"
            color={color}
            type="submit"
            loading={isLoading || isSubmitting}
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
            aria-label={buttonText}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </form>
  );
};

export default SmartForm;