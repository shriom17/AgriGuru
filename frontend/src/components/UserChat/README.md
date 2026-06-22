# User-to-User Chat Feature

## Overview
Real-time messaging system that enables direct communication between users (farmers and customers) on the KisanMitra platform using Socket.IO.

## Features

### ✨ Core Functionality
- **Private Messaging** - Direct one-on-one chat between users
- **Real-time Communication** - Instant message delivery using WebSocket
- **Online Status** - See who's currently online
- **Typing Indicators** - Know when someone is typing
- **Unread Counts** - Badge showing number of unread messages
- **User Discovery** - Browse and search for other users
- **Message History** - Persistent storage of conversations in MongoDB

### 🎨 UI/UX Features
- **Modern Design** - Beautiful gradient UI with smooth animations
- **Responsive Layout** - Works perfectly on mobile and desktop
- **User Avatars** - Different icons for farmers (👨‍🌾) and customers (👤)
- **Search Functionality** - Quickly find users by name or email
- **Active Chat Highlighting** - Visual indicator for selected conversation
- **Message Bubbles** - Distinct styling for sent and received messages
- **Timestamps** - Message time display
- **Smooth Animations** - Slide-in effects for messages and UI elements

## Architecture

### Frontend Components

#### UserChat Component
**Location:** `frontend/src/components/UserChat/UserChat.jsx`

**State Management:**
- `isOpen` - Chat window visibility
- `activeChat` - Currently selected user ID
- `messages` - Message history by user ID
- `onlineUsers` - List of currently online users
- `allUsers` - Complete user list
- `typingUsers` - Users currently typing
- `unreadCounts` - Unread message counts per user

**Key Functions:**
- `openChat(userId)` - Start conversation with user
- `handleSendMessage()` - Send private message
- `handleTyping()` - Emit typing indicator
- Socket event handlers for real-time updates

#### Chat Service
**Location:** `frontend/src/services/chatService.js`

**Methods:**
- `connect(userId, userName, userType)` - Initialize socket connection
- `disconnect(userId)` - Close connection
- `sendMessage(message)` - Send private message
- `sendTyping(userId, userName, recipientId)` - Emit typing event
- `onPrivateMessage(callback)` - Listen for messages
- `onOnlineUsers(callback)` - Listen for online status
- `getUsers()` - Fetch user list
- `getChatHistory(userId, otherUserId)` - Get conversation history
- `markAsRead(userId, otherUserId)` - Mark messages as read
- `getUnreadCounts(userId)` - Get unread message counts

### Backend Implementation

#### Socket Events
**Location:** `back/main.py`

**Events Handled:**
- `connect` - Client connection
- `disconnect` - Client disconnection with cleanup
- `user_online` - User comes online, broadcasts user list
- `user_offline` - User goes offline
- `private_message` - Direct message between users
- `typing` - Typing indicator for private chats
- `join` - Join group chat room (legacy)
- `leave` - Leave group chat room (legacy)
- `chat_message` - Group chat message (legacy)

**Online Users Tracking:**
```python
online_users = {
    userId: {
        'sid': socket_id,
        'userName': name,
        'userType': type
    }
}
```

#### API Endpoints

**User Discovery:**
- `GET /api/users` - Get all users (except current user)
- `GET /api/users/search?q=query` - Search users by name/email

**Chat History:**
- `GET /api/chat/history?userId=X&otherUserId=Y&limit=50` - Get conversation
- `POST /api/chat/mark-read` - Mark messages as read
- `GET /api/chat/unread-counts?userId=X` - Get unread counts

### Database Schema

#### Private Messages Collection
```javascript
{
  type: 'private',
  senderId: String,
  senderName: String,
  recipientId: String,
  message: String,
  timestamp: ISODate,
  read: Boolean
}
```

#### Users Collection (Extended)
```javascript
{
  _id: ObjectId,
  email: String,
  full_name: String,
  userType: String,  // 'farmer' or 'customer'
  profile_image: String,
  last_login: ISODate,
  is_active: Boolean
}
```

## Usage

### For End Users

1. **Access Chat**
   - Click the blue 💬 button on the home page (bottom right)
   - Chat window opens showing user list

2. **Start Conversation**
   - Search for users using the search bar
   - Click on any user from the list
   - Type your message and press Enter or click send button

3. **Features**
   - Green dot indicates online users
   - Unread badge shows new messages
   - See when someone is typing
   - Messages appear in real-time

### For Developers

**Adding UserChat to a Page:**
```jsx
import UserChat from '../../components/UserChat/UserChat';

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <UserChat />
    </div>
  );
}
```

**Using Chat Service Directly:**
```javascript
import chatService from '../services/chatService';

// Connect
chatService.connect(userId, userName, userType);

// Send message
chatService.sendMessage({
  senderId: userId,
  senderName: userName,
  recipientId: recipientId,
  message: text,
  timestamp: new Date().toISOString()
});

// Listen for messages
chatService.onPrivateMessage((data) => {
  console.log('New message:', data);
});

// Disconnect
chatService.disconnect(userId);
```

## Configuration

### Environment Variables

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5001
```

**Backend (.env):**
```
MONGO_URI=mongodb://localhost:27017/KisanMitradb
PORT=5001
```

### Socket.IO Configuration

**Frontend:**
- Transports: `['websocket']`
- Credentials: `true`
- Reconnection: `true`
- Reconnection attempts: `5`

**Backend:**
- CORS: Configured for multiple origins
- Allowed origins include localhost and production URLs

## Testing

### Manual Testing

1. **Online Status:**
   - Open two browsers/incognito windows
   - Login as different users
   - Verify both users appear in each other's user list with green dot

2. **Messaging:**
   - Send message from User A to User B
   - Verify message appears instantly in User B's chat
   - Verify message shows in correct bubble style

3. **Typing Indicator:**
   - Start typing in User A's chat
   - Verify "typing..." appears in User B's chat

4. **Unread Counts:**
   - Send messages while recipient has chat closed
   - Verify unread badge appears with correct count
   - Open chat and verify count clears

5. **Offline Handling:**
   - Close one user's browser
   - Verify user disappears from online list
   - Send message to offline user
   - Reopen browser and verify message is delivered

### API Testing

```bash
# Get all users (requires authentication)
curl -X GET http://localhost:5001/api/users \
  --cookie "connect.sid=YOUR_SESSION_ID"

# Search users
curl -X GET "http://localhost:5001/api/users/search?q=john" \
  --cookie "connect.sid=YOUR_SESSION_ID"

# Get chat history
curl -X GET "http://localhost:5001/api/chat/history?userId=USER1&otherUserId=USER2" \
  --cookie "connect.sid=YOUR_SESSION_ID"
```

## Troubleshooting

### Common Issues

**1. Chat not connecting:**
- Check backend server is running on port 5001
- Verify CORS settings allow frontend origin
- Check browser console for WebSocket errors
- Ensure user is logged in (check AuthContext)

**2. Users not appearing:**
- Verify MongoDB is running and accessible
- Check users exist in database with `is_active: true`
- Verify `/api/users` endpoint returns data

**3. Messages not delivering:**
- Check Socket.IO connection status
- Verify `private_message` event is being emitted
- Check backend console for event logs
- Ensure recipient user ID is correct

**4. Online status not updating:**
- Check `user_online` event is emitted on connect
- Verify `online_users` dictionary is being maintained
- Check `disconnect` handler removes users properly

### Debug Logs

**Enable verbose logging:**

Frontend:
```javascript
// In UserChat.jsx
console.log('Socket connected:', socketRef.current?.connected);
console.log('Active chat:', activeChat);
console.log('Messages:', messages);
console.log('Online users:', onlineUsers);
```

Backend:
```python
# In main.py socket handlers
print(f"[SOCKET] Event: {event_name}, Data: {data}")
print(f"[SOCKET] Online users: {online_users}")
```

## Performance Considerations

### Optimization Tips

1. **Limit User List:**
   - Currently limited to 100 users per query
   - Implement pagination for large user bases

2. **Message History:**
   - Default limit of 50 messages per conversation
   - Load more messages on scroll (lazy loading)

3. **Socket Connections:**
   - Disconnect when chat is closed
   - Reconnect automatically when reopened

4. **Database Indexes:**
   - Index `senderId` and `recipientId` fields
   - Index `timestamp` for sorting
   - Compound index on `(senderId, recipientId, timestamp)`

### Scaling

For production deployments:

1. **Redis for Session Storage:**
   - Use Redis adapter for Socket.IO
   - Enables horizontal scaling across multiple servers

2. **Message Queue:**
   - Implement message queue for offline message delivery
   - Store messages temporarily before database write

3. **CDN for Assets:**
   - Serve static assets via CDN
   - Reduce server load

## Security

### Implemented Security Measures

1. **Authentication:**
   - All endpoints require active session
   - Socket connections validated

2. **Authorization:**
   - Users can only see their own conversations
   - No access to other users' private messages

3. **Input Sanitization:**
   - Message content sanitized before storage
   - User IDs validated before queries

4. **Rate Limiting:**
   - Consider implementing rate limits for message sending
   - Prevent spam and abuse

### Future Enhancements

1. **End-to-End Encryption:**
   - Implement E2E encryption for messages
   - Use Web Crypto API

2. **Message Reporting:**
   - Allow users to report inappropriate messages
   - Admin moderation tools

3. **Block/Mute Users:**
   - API endpoint structure already exists
   - Implement UI for blocking users

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the KisanMitra platform - Same license as main project.

## Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Check MongoDB connection
4. Verify Socket.IO connection status
5. Contact development team

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
