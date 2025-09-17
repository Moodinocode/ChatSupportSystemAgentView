export const formatMetadataValue = (value) => {
  if (value === null || value === undefined) {
    return {
      type: 'empty',
      display: 'Not set',
      className: 'text-muted-foreground italic'
    };
  }
  
  if (typeof value === 'boolean') {
    return {
      type: 'boolean',
      display: value ? 'Yes' : 'No',
      className: `text-xs px-2 py-1 rounded ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`
    };
  }
  
  if (typeof value === 'object') {
    return {
      type: 'object',
      display: JSON.stringify(value, null, 2),
      className: 'text-xs bg-muted p-2 rounded max-w-full overflow-x-auto',
      isCode: true
    };
  }
  
  if (typeof value === 'string' && isDateString(value)) {
    return {
      type: 'date',
      display: formatDateString(value),
      className: 'text-sm'
    };
  }
  
  if (typeof value === 'string' && isURL(value)) {
    return {
      type: 'url',
      display: value,
      className: 'text-sm text-primary hover:underline cursor-pointer',
      isClickable: true
    };
  }
  
  if (typeof value === 'string' && isEmail(value)) {
    return {
      type: 'email',
      display: value,
      className: 'text-sm text-primary hover:underline cursor-pointer',
      isClickable: true
    };
  }
  
  if (typeof value === 'number' && Math.abs(value) >= 1000) {
    return {
      type: 'currency',
      display: value.toLocaleString(),
      className: 'text-sm font-medium'
    };
  }
  
  if (typeof value === 'string' && isCurrencyString(value)) {
    return {
      type: 'currency',
      display: value,
      className: 'text-sm font-medium text-green-600'
    };
  }
  
  if (typeof value === 'string' && isStatusString(value)) {
    return {
      type: 'status',
      display: value,
      className: getStatusClassName(value)
    };
  }
  
  return {
    type: 'default',
    display: String(value),
    className: 'text-sm'
  };
};


export const formatMetadataKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ') 
    .replace(/-/g, ' ') 
    .replace(/\b\w/g, char => char.toUpperCase()) 
    .trim();
};


export const hasDisplayableMetadata = (metadata) => {
  return metadata && 
         typeof metadata === 'object' && 
         !Array.isArray(metadata) && 
         Object.keys(metadata).length > 0;
};

