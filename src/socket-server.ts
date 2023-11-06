let onlineUsers: object[] = [];
export default function (socket: any, io: { emit: (arg0: string, arg1: object[]) => void }) {
  // user join to socket
  socket.on('join', (user: any) => {
    console.log('user joined', user);
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some((u: any) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    // send online users
    io.emit('get_online_users', onlineUsers);
  });
  // socket disconnect
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user: any) => user.socketId !== socket.id);
    
    io.emit('get_online_users', onlineUsers);
  });
  // join conversation
  socket.on('join_conversation', (conversation: any) => {
    socket.join(conversation);
  });
  // send and receive message
  socket.on('new_message', (message: any) => {
    const conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user: { _id: any }) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit('received_message', message);
    });
  });
  // typing
  socket.on('typing', (conversation: any) => {
    socket.in(conversation).emit('typing', conversation);
  });
  // stop typing
  socket.on('stop_typing', (conversation: any) => {
    socket.in(conversation).emit('stop_typing');
  });
}
