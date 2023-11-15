import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { CreateMessageDto } from './message/dto/create-message.dto';
import { ChatsMessagesService } from './message/message.service';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatsMessagesService: ChatsMessagesService,
  ) {}

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
  async sendMeessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatsService.getChatById(data.chatId);
    if (!chat) {
      throw new WsException('Chat not found');
    }

    const message = await this.chatsMessagesService.createMessage(data);

    this.server.in(message.chat.id.toString()).emit('receive_message', message);
  }
}
