import { formatMetadataValue } from "../../Utils/metaDataFormatting";

const MetadataValue = ({ value }) => {
  const formatted = formatMetadataValue(value);
  
  if (formatted.isCode) {
    return (
      <pre className={formatted.className}>
        {formatted.display}
      </pre>
    );
  }
  
  if (formatted.isClickable) {
    return (
      <span 
        className={formatted.className}
        onClick={() => {
          if (formatted.type === 'email') {
            window.location.href = `mailto:${formatted.display}`;
          } else if (formatted.type === 'url') {
            window.open(formatted.display, '_blank');
          }
        }}
      >
        {formatted.display}
      </span>
    );
  }
  
  return (
    <span className={formatted.className}>
      {formatted.display}
    </span>
  );
};

export default MetadataValue