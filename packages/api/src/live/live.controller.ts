import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LiveService } from './live.service';

@Controller('live')
export class LiveController {
  constructor(private live: LiveService) {}

  @Post('create-room')
  createRoom(@Body('room') room: string) {
    const roomName = room || 'room-' + Math.random().toString(36).slice(2, 8);
    return this.live.createRoom(roomName);
  }

  @Post('join/:room')
  joinRoom(
    @Param('room') room: string,
    @Body('name') name: string,
  ) {
    const participantId = 'user-' + Math.random().toString(36).slice(2, 10);
    return this.live.joinRoom(room, participantId, name || 'Guest');
  }
}
