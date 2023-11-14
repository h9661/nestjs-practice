import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`New connection: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('create_chat')
  createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {}

  @SubscribeMessage('enter_chat')
  enterChat(@MessageBody() data, @ConnectedSocket() client: Socket) {
    client.join(data.chatId.toString());
  }

  @SubscribeMessage('send_message')
  sendMeessage(
    @MessageBody() data: { message: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .in(data.chatId.toString())
      .emit('receive_message', data.message);
  }
}
