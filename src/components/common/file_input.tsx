import React, { useState, useEffect } from 'react';
import { Button, Typography, CircularProgress } from '@mui/joy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageInputProps {
  controlItem: any;
  value: File | string | null; // Can be File object or image URL string
  onChange: (file: File | string | null) => void;
  error?: string;
  color?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
}

const ImageInput: React.FC<ImageInputProps> = ({
  controlItem,
  value,
  onChange,
  error,
  color = 'primary'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Allowed image types
  const allowedTypes = controlItem.validation?.fileTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = controlItem.validation?.maxSize || 5 * 1024 * 1024; // Default 5MB
  const acceptedFormats = allowedTypes.map((type: string) => type.split('/')[1]).join(', ');

  // Handle both File objects and URL strings
  useEffect(() => {
    if (value instanceof File) {
      // Handle File object
      setIsLoading(true);
      setFileName(value.name);
      setFileSize(`${(value.size / 1024).toFixed(1)} KB`);
      setFileType(value.type.split('/')[1].toUpperCase());
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setIsLoading(false);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === 'string' && value) {
      // Handle image URL from API
      setPreview(value);
      setFileName('Existing Image');
      setFileSize('');
      setFileType('IMAGE');
      setIsLoading(false);
    } else {
      setPreview(null);
      setFileName('');
      setFileSize('');
      setFileType('');
      setIsLoading(false);
    }
  }, [value]);

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `Invalid file type. Allowed: ${acceptedFormats}`
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
      primary: { border: '#0B6BCB', bg: '#E3EFFB', text: '#0B6BCB', hover: '#F0F6FF' },
      neutral: { border: '#6B6B6B', bg: '#F0F0F0', text: '#6B6B6B', hover: '#F5F5F5' },
      danger: { border: '#C41C1C', bg: '#FFE9E9', text: '#C41C1C', hover: '#FFF0F0' },
      success: { border: '#1F7A4C', bg: '#E4F8E9', text: '#1F7A4C', hover: '#F0FFF0' },
      warning: { border: '#B76E00', bg: '#FFF1D6', text: '#B76E00', hover: '#FFF8E0' },
    };
    return colorMap[color] || colorMap.primary;
  };

  const colors = getColorStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <AnimatePresence mode="wait">
        {!value ? (
          // Drag and drop area
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              relative w-full rounded-xl border-2 border-dashed 
              transition-all duration-300 cursor-pointer overflow-hidden
              ${isDragging ? 'border-solid scale-[1.02]' : ''}
              ${error ? 'border-red-500 bg-red-50' : ''}
            `}
            style={{
              borderColor: isDragging ? colors.border : error ? '#EF4444' : '#E5E7EB',
              backgroundColor: isDragging ? colors.bg : error ? '#FEF2F2' : '#F9FAFB',
              minHeight: '220px'
            }}
            whileHover={{ 
              backgroundColor: colors.hover,
              borderColor: colors.border,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ 
                  scale: isDragging ? 1.1 : 1,
                  rotate: isDragging ? [0, -5, 5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <CloudUploadIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: isDragging ? colors.border : error ? '#EF4444' : '#9CA3AF',
                    mb: 2,
                  }} 
                />
              </motion.div>
              
              <Typography level="h4" fontWeight="bold" sx={{ color: error ? '#EF4444' : colors.text, mb: 1 }}>
                {isDragging ? 'Drop your image here' : 'Upload an image'}
              </Typography>
              
              <Typography level="body-sm" sx={{ color: '#6B7280', mb: 2 }}>
                Drag & drop or click to browse
              </Typography>
              
              <Typography level="body-xs" sx={{ color: '#9CA3AF' }}>
                Supported: {acceptedFormats} • Max: {maxSize / (1024 * 1024)}MB
              </Typography>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4"
              >
                <Button
                  variant="soft"
                  color={color}
                  size="sm"
                  startDecorator={<CloudUploadIcon />}
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  Choose Image
                </Button>
              </motion.div>

              {controlItem.required && (
                <Typography level="body-xs" sx={{ color: '#EF4444', mt: 2 }}>
                  * Required
                </Typography>
              )}
            </motion.div>
          </motion.div>
        ) : (
          // Preview area
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full rounded-xl overflow-hidden"
            style={{
              border: `2px solid ${colors.border}`,
              backgroundColor: '#FFFFFF'
            }}
          >
            {/* Preview Image */}
            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center p-4">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CircularProgress size="lg" />
                </div>
              ) : (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={preview || ''}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Handle image load error
                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                  }}
                />
              )}
            </div>

            {/* File Info Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-3 flex flex-wrap items-center gap-2 bg-white"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <InsertPhotoIcon sx={{ color: colors.border, fontSize: 20 }} />
                <div className="flex-1 min-w-0">
                  <Typography level="body-sm" fontWeight="bold" noWrap>
                    {fileName || (typeof value === 'string' ? 'Current Image' : 'Uploaded Image')}
                  </Typography>
                  {(fileSize || fileType) && (
                    <Typography level="body-xs" sx={{ color: '#6B7280' }}>
                      {fileSize} {fileType && `• ${fileType}`}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outlined"
                  color={color}
                  onClick={handleClick}
                  startDecorator={<CloudUploadIcon />}
                  sx={{
                    borderRadius: '20px',
                    flexShrink: 0,
                  }}
                >
                  Change
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  color='danger'
                  onClick={handleRemoveFile}
                  startDecorator={<CloseIcon />}
                  sx={{
                    borderRadius: '20px',
                    flexShrink: 0,
                  }}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              level="body-xs"
              color="danger"
              sx={{ mt: 1, ml: 1 }}
            >
              {error}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageInput;