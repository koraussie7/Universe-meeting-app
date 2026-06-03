import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FederationService {
  private readonly logger = new Logger(FederationService.name);

  constructor(private prisma: PrismaService) {}

  /** Return an ActivityPub Actor (user profile) */
  async getActor(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    return {
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        'https://w3id.org/security/v1',
      ],
      id: 'https://universe.privseai.com/users/' + username,
      type: 'Person',
      preferredUsername: username,
      name: user.name || username,
      summary: user.bio || '',
      inbox: 'https://universe.privseai.com/api/v1/federation/' + username + '/inbox',
      outbox: 'https://universe.privseai.com/api/v1/federation/' + username + '/outbox',
      followers: 'https://universe.privseai.com/api/v1/federation/' + username + '/followers',
      following: 'https://universe.privseai.com/api/v1/federation/' + username + '/following',
      publicKey: {
        id: 'https://universe.privseai.com/users/' + username + '#main-key',
        owner: 'https://universe.privseai.com/users/' + username,
        publicKeyPem: 'TODO: RSA key pair generation',
      },
    };
  }

  /** Handle incoming ActivityPub activities */
  async handleInbox(username: string, activity: any) {
    this.logger.log('Inbox for ' + username + ': ' + activity.type);
    // In MVP: log and acknowledge
    return { received: true };
  }
}
