import React from 'react';

const ChatBubble = ({ 
  message, 
  isAgent = false, 
  showAvatar = true, 
  showFooter = false 
}) => {
  // Generate initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`chat ${isAgent ? 'chat-end' : 'chat-start'}`}>
      {showAvatar && (
        <div className="chat-image avatar">
          <div className={`w-10 rounded-full flex items-center justify-center ${
    message.avatar ? "bg-base-300":"bg-green-500" 
  }`}>
            {message.avatar ? (
              <img
                alt={`${message.senderName}'s avatar`}
                src={message.avatar}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-sm font-medium text-base-content mt-3 ml-3">
                {getInitials(message.senderName)}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="chat-header">
        {message.senderName}
        <time className="text-xs opacity-50 ml-2">
          {message.timestamp}
        </time>
      </div>
      
      <div className={`chat-bubble ${isAgent ? 'chat-bubble-primary' : ''}`}>
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
      
      {showFooter && (
        <div className="chat-footer opacity-50">
          {message.status || 'Delivered'}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;