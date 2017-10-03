package User.Login;

import io.setl.wsclient.WebSocketClientEndpoint;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.eclipse.jetty.websocket.client.WebSocketClient;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import io.setl.wsclient.shared.Message.Type;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertNull;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class loginTest {

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);

    @Before
    public void setUp() throws Exception
    {

    }


    @After
    public void tearDown() throws Exception
    {
    }

    @Test
    public void loginSuccessWithValidCredentials() throws InterruptedException, ExecutionException {
        CountDownLatch l  = new CountDownLatch(1);

        socket.registerHandler(Type.Login.name(),message->{
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp =(JSONObject) data.get(0);
            Object token = resp.get("Token");
            assertNotNull(token);
            assertTrue(!token.toString().equalsIgnoreCase("fail"));
            l.countDown();
            return "";});
        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
        l.await();
        connexion.get().disconnect();

    }

    @Test
    public void loginFailureWithInvalidCredentials() throws InterruptedException, ExecutionException {
        SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alx01");
        SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
        CountDownLatch l  = new CountDownLatch(1);

        socket.registerHandler(Type.Login.name(),message->{
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp =(JSONObject) data.get(0);
            Object token = resp.get("Token");
            assertTrue(token.toString().equalsIgnoreCase("fail"));
            l.countDown();
            return "";});
        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
        l.await();
        connexion.get().disconnect();

    }

    @Test
    public void loginFailureWithUnknownUser() throws InterruptedException
    {
        SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "bob", "alex01");
        SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
        CountDownLatch l  = new CountDownLatch(1);

        socket.registerHandler(Type.Login.name(),message->{
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp =(JSONObject) data.get(0);
            Object token = resp.get("Token");
            assertNotNull(token);
            assertTrue(token.toString().equalsIgnoreCase("fail"));
            Object accountName = resp.get("accountName");
            assertTrue(accountName == "" || accountName.toString().isEmpty());
            l.countDown();
            return "";});
        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
        l.await();

    }

    @Test
    @Ignore
    public void enumerationTest() throws InterruptedException, ExecutionException {
        SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alx01");
        SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
        CountDownLatch l  = new CountDownLatch(1);

        socket.registerHandler(Type.Login.name(),message->{
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp =(JSONObject) data.get(0);
            Object token = resp.get("Token");
            assertNotNull(token);
            assertTrue(token.toString().equalsIgnoreCase("fail"));
            Object accountName = resp.get("accountName");
            assertNull(accountName);
            l.countDown();
            return "";});
        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
        l.await();
        connexion.get().disconnect();

    }
}
