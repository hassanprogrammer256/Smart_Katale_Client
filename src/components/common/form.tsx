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
import { useEffect, useRef,  useMemo, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Card, IconButton, CircularProgress } from '@mui/joy';

const createValidationSchema = (formControls?: ControlItem[]) => {
  if (!formControls || formControls.length === 0) return z.object({});
  
  const shape: Record<string, any> = {};
  
  formControls.forEach((control) => {
    let validator: z.ZodTypeAny;

    // Handle file upload specially
    if (control.componentType === 'file') {
      let validator = z.custom<File>((val) => {
        if (!control.required && !val) return true;
        return val instanceof File;
      }, {
        message: `${control.label || control.name} must be a valid file`
      });

      // Add file type validation
      if (control.validation?.fileTypes) {
        validator = validator.refine(
          (file) => {
            if (!file) return !control.required;
            return control.validation?.fileTypes?.includes((file as File).type);
          },
          {
            message: `File must be of type: ${control.validation?.fileTypes?.join(', ')}`
          }
        );
      }

      // Add file size validation
      if (control.validation?.maxSize) {
        validator = validator.refine(
          (file) => {
            if (!file) return !control.required;
            return (file as File).size <= (control.validation?.maxSize || Infinity);
          },
          {
            message: `File size must be less than ${(control.validation?.maxSize || 0) / (1024 * 1024)}MB`
          }
        );
      }
      
      shape[control.name] = validator;
      return;
    }
    
    // Build validator based on type
    switch (control.type) {
      case 'number': {
        // Start with number validator
        validator = z.number({ 
          error: `${control.label || control.name} must be a number` 
        });
        
        // Apply min validation if specified
        if (control.validation?.min !== undefined) {
          validator = (validator as z.ZodNumber).min(control.validation.min, {
            message: `${control.label || control.name} must be at least ${control.validation.min}`
          });
        }
        
        // Apply max validation if specified
        if (control.validation?.max !== undefined) {
          validator = (validator as z.ZodNumber).max(control.validation.max, {
            message: `${control.label || control.name} must be at most ${control.validation.max}`
          });
        }
        break;
      }
      
      case 'email': {
        // Start with string email validator
        validator = z.string({
          error: `${control.label || control.name} must be a string`
        }).email({
          message: `${control.label || control.name} must be a valid email address`
        });
        
        // Apply max length if specified
        if (control.validation?.maxLength) {
          validator = (validator as z.ZodString).max(control.validation.maxLength, {
            message: `${control.label || control.name} must be at most ${control.validation.maxLength} characters`
          });
        }
        break;
      }
      
      case 'password': {
        // Start with string validator
        validator = z.string({
          error: `${control.label || control.name} must be a string`
        });
        
        // Apply min length
        if (control.validation?.minLength) {
          validator = (validator as z.ZodString).min(control.validation.minLength, {
            message: `${control.label || control.name} must be at least ${control.validation.minLength} characters`
          });
        }
        
        // Apply max length
        if (control.validation?.maxLength) {
          validator = (validator as z.ZodString).max(control.validation.maxLength, {
            message: `${control.label || control.name} must be at most ${control.validation.maxLength} characters`
          });
        }
        
        // Apply pattern validation
        if (control.validation?.pattern) {
          validator = (validator as z.ZodString).regex(control.validation.pattern, {
            message: control.validation.message || `${control.label || control.name} has invalid format`
          });
        }
        break;
      }
      
      default: {
        // Default string validator
        validator = z.string({
          error: `${control.label || control.name} must be a string`
        });
        
        // Apply min length
        if (control.validation?.minLength) {
          validator = (validator as z.ZodString).min(control.validation.minLength, {
            message: `${control.label || control.name} must be at least ${control.validation.minLength} characters`
          });
        }
        
        // Apply max length
        if (control.validation?.maxLength) {
          validator = (validator as z.ZodString).max(control.validation.maxLength, {
            message: `${control.label || control.name} must be at most ${control.validation.maxLength} characters`
          });
        }
        
        // Apply pattern validation
        if (control.validation?.pattern) {
          validator = (validator as z.ZodString).regex(control.validation.pattern, {
            message: control.validation.message || `${control.label || control.name} has invalid format`
          });
        }
      }
    }
    
    // Handle required fields AFTER all other validations
    if (control.required) {
      if (control.type === 'number') {
        // For numbers, ensure it's not null/undefined AND meets min requirement
        validator = validator.refine(
          (val) => val !== null && val !== undefined,
          { message: `${control.label || control.name} is required` }
        );
      } else {
        // For strings, ensure non-empty
        validator = (validator as z.ZodString).min(1, {
          message: `${control.label || control.name} is required`
        });
      }
    } else {
      // Make optional fields truly optional (allow undefined)
      validator = validator.optional();
    }
    
    shape[control.name] = validator;
  });
  
  return z.object(shape);
};

type FormData = Record<string, any>;

// File input component with drag and drop
interface FileInputProps {
  controlItem: ControlItem;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
  label?: string;
  required?: boolean;
}

const FileInput = ({ controlItem, value, onChange, error, color = 'primary' }: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed image types
  const allowedTypes = controlItem.validation?.fileTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const maxSize = controlItem.validation?.maxSize || 5 * 1024 * 1024; // Default 5MB

  // Create preview when file is selected
  useEffect(() => {
    if (value && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      };
    }

    return { valid: true };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        onChange(file);
      } else {
        // Show error (will be handled by form validation)
        console.error(validation.message);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        onChange(file);
      }
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getColorStyles = () => {
    const colorMap = {
      primary: { border: '#0B6BCB', bg: '#E3EFFB', text: '#0B6BCB' },
      danger: { border: '#C41C1C', bg: '#FFE9E9', text: '#C41C1C' },
      success: { border: '#1F7A4C', bg: '#E4F8E9', text: '#1F7A4C' },
      warning: { border: '#B76E00', bg: '#FFF1D6', text: '#B76E00' },
      neutral: { border: '#6B6B6B', bg: '#F0F0F0', text: '#6B6B6B' },
    };
    return colorMap[color] || colorMap.primary;
  };

  const colors = getColorStyles();

  return (
    <div className="w-full">
      {/* Label for file input */}
      {controlItem.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {controlItem.label}
          {controlItem.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        id={`file-${controlItem.name}`}
        aria-label={controlItem.label}
      />
      
      {!value ? (
        // Drag and drop area
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${controlItem.label || 'file'}`}
          className={`
            relative w-full rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer
            ${isDragging 
              ? 'border-solid scale-105' 
              : error 
                ? 'border-red-500 bg-red-50' 
                : ''
            }
          `}
          style={{
            borderColor: isDragging ? colors.border : error ? '#EF4444' : '#CBD5E0',
            backgroundColor: isDragging ? colors.bg : error ? '#FEF2F2' : '#F7FAFC',
            minHeight: '200px'
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <CloudUploadIcon 
              sx={{ 
                fontSize: 48, 
                color: isDragging ? colors.border : error ? '#EF4444' : '#718096',
                mb: 2,
                transition: 'transform 0.2s',
                transform: isDragging ? 'translateY(-8px)' : 'none'
              }} 
            />
            <Typography level="body-md" fontWeight="bold" sx={{ color: error ? '#EF4444' : colors.text }}>
              {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
            </Typography>
            <Typography level="body-xs" sx={{ color: '#718096', mt: 1 }}>
              Supported formats: {allowedTypes.map(t => t.split('/')[1]).join(', ')}
            </Typography>
            <Typography level="body-xs" sx={{ color: '#718096' }}>
              Max size: {maxSize / (1024 * 1024)}MB
            </Typography>
            {controlItem.required && (
              <Typography level="body-xs" sx={{ color: '#EF4444', mt: 2 }}>
                * Required
              </Typography>
            )}
          </div>
        </div>
      ) : (
        // Preview area
        <Card
          variant="outlined"
          sx={{
            width: '100%',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: 'md',
              borderColor: colors.border,
            }
          }}
        >
          <Box sx={{ position: 'relative', p: 2 }}>
            <IconButton
              size="sm"
              onClick={handleRemoveFile}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                bgcolor: 'background.body',
                '&:hover': {
                  bgcolor: 'danger.softBg',
                  color: 'danger.plainColor'
                }
              }}
              aria-label="Remove file"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Preview image */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 'md',
                  overflow: 'hidden',
                  bgcolor: 'neutral.softBg',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: 'neutral.outlinedBorder'
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <InsertPhotoIcon sx={{ fontSize: 40, color: 'neutral.500' }} />
                )}
              </Box>

              {/* File info */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography level="body-sm" fontWeight="bold" noWrap>
                    {value.name}
                  </Typography>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.500' }} />
                </Box>
                <Typography level="body-xs" sx={{ color: 'neutral.600' }}>
                  {(value.size / 1024).toFixed(1)} KB • {value.type.split('/')[1].toUpperCase()}
                </Typography>
              </Box>

              {/* Change button */}
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={handleClick}
                sx={{ minWidth: 80 }}
                aria-label="Change file"
              >
                Change
              </Button>
            </Box>
          </Box>
        </Card>
      )}
    </div>
  );
};

const SmartForm = <T extends FormData>({
  formControls,
  isLoading,
  buttonText,
  formData: externalFormData,
  setFormData: externalSetFormData,
  onSubmit,
  isBtnDisabled = false,
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

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
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
              <FileInput
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
      case "number":
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

  const formIsValid = isValid && isDirty;

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
            disabled={!formIsValid || isBtnDisabled}
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