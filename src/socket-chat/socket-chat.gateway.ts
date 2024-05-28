import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({cors : true})
export class SocketChatGateway {

  constructor(private serviceUser : UsersService, private serviceMessage : MessagesService) {
    serviceMessage.setSockets(this.clients);
  }
  
  @WebSocketServer()
  server: Server;
  
  private clients: Map<string, Socket> = new Map();

  async handleConnection(client: Socket) {
    const email = client.handshake.headers.email;
    const idSocket = client.id;
    await this.serviceUser.updateSocket(email, idSocket)
    this.clients.set(client.id, client);
    this.serviceMessage.setSockets(this.clients)
  }

  async handleDisconnect(client: Socket) {
    const email = client.handshake.headers.email;
    await this.serviceUser.updateSocket(email, null)
    this.clients.delete(client.id);
  }


  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: CreateMessageDto ) {
    const anotherUser = await this.serviceUser.findByEmail(payload.send_to);
    const message = await this.serviceMessage.save(payload);
    client.emit('message', {
      'data' : message.data,
      'status' : message.status,
      'message' : message.message
    });

    const receiver = this.clients.get(anotherUser.id_socket);
      if (receiver) {
        receiver.emit('message', {
          'data' : message.data,
          'status' : message.status,
          'message' : message.message
        });
      } else {
        client.emit('error', { 'data': null , 'message' : 'User not connected' });
      }  
  }
}
