import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true, namespace: 'reports' })
export class ReportsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private logger = new Logger('ReportsGateway');

	afterInit() {
		this.logger.log('GATEWAY IS LIVE!');
	}
	handleConnection(client: any) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	sendUpdate(reportId: string, payload: { status: string; progress: number; message: string }) {
		this.server.emit(`report_${reportId}`, payload);
	}
}
