import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Enable CORS for all origins
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // When a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // When a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Listen for 'control' events from clients
  @SubscribeMessage('control')
  handleControl(
    client: Socket,
    payload: { type: string; time?: number; seekSetter: number }
  ) {
    console.log(`Received control command:`, payload);

    // Broadcast the control event to all connected clients
    this.server.emit('control', payload);
  }
}
