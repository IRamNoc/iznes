 package com.setl.utils.cluster.trasport.impl;;

import java.io.IOException;
import java.net.URI;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest;
import org.eclipse.jetty.websocket.client.WebSocketClient;

import io.setl.utils.cluster.trasport.WebsocketMessageHandler;
import io.setl.utils.cluster.trasport.WebsocketWrapper;

@WebSocket(maxTextMessageSize = 256 * 1024)
public class JettyWsWrapper implements WebsocketWrapper {
	private static Logger logger = LogManager.getLogger(JettyWsWrapper.class);
	WebSocketClient client = new WebSocketClient();
	private WebsocketMessageHandler handler;
	private Session session;

	@Override
	public void setHandler(WebsocketMessageHandler websocketMessageHandler) {
		this.handler = websocketMessageHandler;

	}

	@Override
	public boolean setTimeout(long timeout) {
		if (session != null) {
			session.setIdleTimeout(timeout);
			return true;
		}
		return false;
	}

	@Override
	public void connect(String url) {
		logger.trace("Connecting to {}", url);
		try {

			client.start();
			ClientUpgradeRequest request = new ClientUpgradeRequest();
			Future<Session> future = client.connect(this, new URI(url), request);
			future.get(10, TimeUnit.SECONDS);
		} catch (Exception e) {
			try {
				client.stop();
			} catch (Exception e1) {
			}
			;
			handler.onClose(e.getMessage());

		}

	}

	@Override
	public void send(String message) {
		// if (session!=null){
		try {
			logger.trace("RAW write {} ",message);
			session.getRemote().sendString(message);
			logger.debug( message);
		} catch (IOException e) {
			logger.catching(e);
		}
		// }
	}

	@OnWebSocketConnect
	public void onOpen(Session session) {
		session.setIdleTimeout(20000);
		this.session = session;
		if (handler != null) {
			handler.onConnect();
		}
	}


	public void onMessage(String... messages) {
	for(String msg:messages){
	  onMessage(msg);
   }
	}

  @OnWebSocketMessage
  public void onMessage(String message) {
    logger.trace("RAW read {} ",message);
    if (handler != null) {
      handler.onTextMessage(message);
    }
  }

	@OnWebSocketClose
	public void onClose(int statusCode, String reason) {
		try {
			client.stop();

		} catch (Exception e) {
		}

		if (handler != null) {
			handler.onClose(reason);
		}
	}

	@Override
	public void disconect() {
		session.close(0, "OK");

	}

}
