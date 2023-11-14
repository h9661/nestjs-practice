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
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`New connection: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatsService.createChat(data);
  }

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
