package User.Creation;

import Utils.LoginHelper;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

import static Utils.LoginHelper.login;
import static Utils.UserDetailsHelper.createUser;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;


@RunWith(JUnit4.class)
public class createUserTest {

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);

    @Test
    public void createUserWithValidDataTest() throws InterruptedException, ExecutionException {

        final  AtomicInteger atomicInt = new AtomicInteger(0);

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];
        CountDownLatch latch = new CountDownLatch(1);

        socket.registerHandler(Message.Type.Login.name(), message -> {
        socket.sendMessage(factory.listUsers());
        socket.sendMessage(factory.addUserToAccount(userName,
                                                    email,
                                                    "8",
                                                    "35",
                                                     password));
        socket.sendMessage(factory.listUsers());
        return "";
        });



        socket.registerHandler(Message.Type.um_lu.name(), message -> {

            int call = atomicInt.getAndIncrement();
            if (call==0) {
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp = (JSONObject) data.get(data.size()-1);
            Object lastUser = resp.get("userName");
            assertNotNull(lastUser);
            assertTrue(!lastUser.toString().equals(userName));
            return "";}

            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp = (JSONObject) data.get(data.size()-1);
            Object lastUser = resp.get("userName");
            assertNotNull(lastUser);
            assertTrue(lastUser.toString().equals(userName));
            latch.countDown();
            return "";
        });

        socket.registerHandler(Message.Type.nu.name(), message -> {
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp = (JSONObject) data.get(0);
            Object newUser = resp.get("userName");
            assertNotNull(newUser);
            assertTrue(newUser.toString().equalsIgnoreCase(userName));
            return "";
        });

        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");

                latch.await();
        connexion.get().disconnect();

    }

    @Test
    public void failToCreateUserWithInvalidEmailTest() throws InterruptedException, ExecutionException {

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];

        CountDownLatch latch = new CountDownLatch(1);

        socket.registerHandler(Message.Type.Login.name(), message -> {
        socket.sendMessage(factory.addUserToAccount(userName,
                                                    "pop",
                                                    "8",
                                                    "35",
                                                     password));
        return "";
        });

        socket.registerHandler(Message.Type.nu.name(), message -> {
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp = (JSONObject) data.get(0);
            Object responseMessage = resp.get("Message");
            assertNotNull(message);
            assertTrue(responseMessage.toString().equalsIgnoreCase("Invalid User Name / Email Address."));
            latch.countDown();
            return "";
        });


        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
    latch.await();
    connexion.get().disconnect();

    }

    @Test
    @Ignore("Message format error")
    public void failToCreateUserWithInvalidAccountTypeTest() throws InterruptedException, ExecutionException {

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];


        CountDownLatch latch = new CountDownLatch(1);

        socket.registerHandler(Message.Type.Login.name(), message -> {
        socket.sendMessage(factory.addUserToAccount(userName,
                                                    email,
                                            "8",
                                           "fred",
                                                    password));
        return "";
        });

        socket.registerHandler(Message.Type.nu.name(), message -> {
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp = (JSONObject) data.get(0);
            Object sqlMessage = resp.get("Message");
            assertNotNull(message);
            assertTrue(sqlMessage.toString().contains("Incorrect integer value"));
            latch.countDown();
            return "";
        });
        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
    latch.await();
    connexion.get().disconnect();

    }

    @Test
    @Ignore("Message format error")
    public void failToCreateUserWithInvalidAccount() throws InterruptedException, ExecutionException {

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];


        CountDownLatch latch = new CountDownLatch(1);

        socket.registerHandler(Message.Type.Login.name(), message -> {
        socket.sendMessage(factory.addUserToAccount(userName,
                                                    email,
                                            "bob",
                                           "35",
                                                    password));
        return "";
        });

        socket.registerHandler(Message.Type.nu.name(), message -> {
            JSONArray data = (JSONArray) message.get("Data");
            JSONObject resp = (JSONObject) data.get(0);
            Object responseMessage = resp.get("Message");
            assertNotNull(message);
            assertTrue(responseMessage.toString().contains("Incorrect integer value"));
            latch.countDown();
            return "";
        });
        Future<Connection> connexion = ws.start("ws://localhost:9788/db/");
    latch.await();
    connexion.get().disconnect();

    }

    @Test
    public void createNewUser() throws ExecutionException, InterruptedException {
      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];
      login(socket, ws);
      createUser(factory, socket, ws, userName, email, "8", "35", password);
    }


    public static String[] generateUserDetails ()
    {
        String str = randomAlphabetic(5);
        String userName = "Test_User_" + str;
        String password = randomAlphabetic(12);
        String email = userName + "@test.com";

        return new String[] {userName, password, email};
    }
}
