import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface SignalData {
  to: string;
  from: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  sdp?: any;
  candidate?: any;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/signaling',
})
export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(LiveGateway.name);
  private rooms = new Map<string, Set<string>>(); // roomName → Set of socketIds

  handleConnection(client: Socket) {
    this.logger.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected: ' + client.id);
    // Remove from all rooms
    this.rooms.forEach((members, room) => {
      members.delete(client.id);
      if (members.size === 0) this.rooms.delete(room);
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; userName: string },
  ) {
    client.join(data.room);

    if (!this.rooms.has(data.room)) {
      this.rooms.set(data.room, new Set());
    }
    this.rooms.get(data.room)!.add(client.id);

    // Notify others
    client.to(data.room).emit('user-joined', {
      userId: client.id,
      userName: data.userName,
    });

    this.logger.log(data.userName + ' joined room ' + data.room);
    return { success: true, userId: client.id };
  }

  @SubscribeMessage('signal')
  handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SignalData,
  ) {
    // Forward WebRTC signaling to specific peer
    this.server.to(data.to).emit('signal', {
      ...data,
      from: client.id,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    const room = this.rooms.get(data.room);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) this.rooms.delete(data.room);
    }
    client.to(data.room).emit('user-left', { userId: client.id });
  }
}
