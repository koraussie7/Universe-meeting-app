import { Injectable, Logger } from '@nestjs/common';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);
  private livekitHost: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.livekitHost = process.env.LIVEKIT_HOST || 'http://localhost:7880';
    this.apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || 'devsecret';
  }

  /** Generate a LiveKit access token for a participant */
  async generateToken(roomName: string, participantId: string, participantName: string): Promise<string> {
    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: participantId,
      name: participantName,
      ttl: '4h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return await at.toJwt();
  }

  /** Create a new meeting room */
  async createRoom(roomName: string): Promise<{ room: string; token: string }> {
    const client = new RoomServiceClient(this.livekitHost, this.apiKey, this.apiSecret);
    this.logger.log('Creating room: ' + roomName);

    try {
      await client.createRoom({
        name: roomName,
        emptyTimeout: 10 * 60,
        maxParticipants: 50,
      });
    } catch (e: any) {
      this.logger.log('Room may already exist: ' + e.message);
    }

    const token = await this.generateToken(roomName, `host-${Date.now()}`, 'Host');
    return { room: roomName, token };
  }

  /** Generate join token for guest */
  async joinRoom(roomName: string, participantId: string, participantName: string): Promise<{ token: string }> {
    const token = await this.generateToken(roomName, participantId, participantName);
    return { token };
  }
}
