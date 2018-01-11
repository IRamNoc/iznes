package com.setl.WebSocketAPITests.User.Login;

import SETLAPIHelpers.AccountError;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import com.setl.WebSocketAPITests.Account.Creation.createAccountTest;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import io.setl.wsclient.shared.Message.Type;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccountError;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertNull;
import static junit.framework.TestCase.assertTrue;

@RunWith(OrderedJUnit4ClassRunner.class)
public class loginTest {

    private static final Logger logger = LogManager.getLogger(loginTest.class);

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
    String address = "ws://uk-lon-li-006.opencsd.io:9788/db/";

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);;

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


        int MAXTRIES=20;
        for(int i=0; i<MAXTRIES; i++) {
            try {
                Future<Connection> connection = ws.start(address);
                l.await();
                connection.get().disconnect();
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if(i>=MAXTRIES-1)
                    throw(ex);
            }
            break;
        }
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

        int MAXTRIES=20;
        for(int i=0; i<MAXTRIES; i++) {
            try {
                Future<Connection> connection = ws.start(address);
                l.await();
                connection.get().disconnect();
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if(i>=MAXTRIES-1)
                    throw(ex);
            }
            break;
        }
    }

    @Test
    public void loginFailureWithUnknownUser() throws InterruptedException, ExecutionException {
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

        int MAXTRIES=20;
        for(int i=0; i<MAXTRIES; i++) {
            try {
                Future<Connection> connection = ws.start(address);
                l.await();
                connection.get().disconnect();
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if(i>=MAXTRIES-1)
                    throw(ex);
            }
            break;
        }
    }

}


