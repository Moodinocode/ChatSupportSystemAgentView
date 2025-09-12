import React from 'react';

const ChatBubble = ({ 
  message, 
  isCurrentUser, 
  author, 
  profileImageUrl, 
  timestamp,
  media,
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
          {media ? (
            media.contentType.startsWith("image/") ? (
              <img 
                src={media.url} 
                alt="sent media" 
                className="max-w-xs rounded" 
              />
            ) : media.contentType.startsWith("video/") ? (
              <video controls className="max-w-xs rounded">
                <source src={media.url} type={media.contentType} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <a href={media.url} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                Download file
              </a>
            )
          ) : (
            messageContent
          )}
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