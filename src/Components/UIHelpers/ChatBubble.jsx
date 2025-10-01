import React from 'react';

const ChatBubble = ({ 
  message, 
  isCurrentUser, 
  author, 
  profileImageUrl, 
  timestamp,
  media,
  mediaUrl, // Add this prop
  loadingMedia, // Add this prop
  showAvatar = true, 
  showFooter = false 
}) => {
  // Handle both old message object format and new separate props format
  const messageContent = typeof message === 'object' && message !== null 
    ? (message.content || JSON.stringify(message)) 
    : (message || '');
  const messageAuthor = author || (typeof message === 'object' ? message.sender : 'Unknown');
  const messageTimestamp = timestamp || (typeof message === 'object' ? message.timestamp : null);
  const messageAvatar = profileImageUrl || (typeof message === 'object' ? message.avatar : null);

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to render media content
  const renderMedia = () => {
    if (!media) return null;

    // If we have mediaUrl (from temporary URL), use it
    const imageUrl = mediaUrl || (media && media.url);
    
    if (loadingMedia) {
      return (
        <div className="flex items-center justify-center p-4 bg-base-200 rounded max-w-xs">
          <div className="loading loading-spinner loading-sm mr-2"></div>
          <span className="text-sm">Loading media...</span>
        </div>
      );
    }

    if (!imageUrl) {
      return (
        <div className="flex items-center justify-center p-4 bg-base-200 rounded max-w-xs">
          <span className="text-sm">Media content unavailable</span>
        </div>
      );
    }
   
    if (media.contentType?.startsWith("image/")) {
      return (
        <img 
          src={imageUrl} 
          alt="sent media" 
          className="max-w-xs rounded" 
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.target.style.display = 'none';
          }}
        />
      );
    } else if (media.contentType?.startsWith("video/")) {
      return (
        <video controls className="max-w-xs rounded">
          <source src={imageUrl} type={media.contentType} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <a href={imageUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
          {media.filename || 'Download file'}
        </a>
      );
    }
  };

  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
      {showAvatar && (
        <div className="chat-image avatar">
          <div className={`w-10 rounded-full flex items-center justify-center ${
            messageAvatar ? "bg-base-300" : "bg-green-500" 
          }`}>
            {messageAvatar ? (
              <img
                alt={`${messageAuthor}'s avatar`}
                src={messageAvatar}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img
                alt={`${messageAuthor} avatar`}
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(messageAuthor || 'User')}&background=random`}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
        </div>
      )}
      
      <div className="chat-header">
        {messageAuthor}
        <time className="text-xs opacity-50 ml-2">
          {messageTimestamp ? (
            typeof messageTimestamp === 'string' ? messageTimestamp : 
            messageTimestamp.toLocaleTimeString ? messageTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
          ) : ''}
        </time>
      </div>
      
      <div className={`chat-bubble ${isCurrentUser ? 'chat-bubble-primary' : ''}`}>
        <div className="whitespace-pre-wrap">
          {media ? renderMedia() : messageContent}
        </div>
      </div>
      
      {showFooter && (
        <div className="chat-footer opacity-50">
          {isCurrentUser ? 'Delivered' : ''}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;