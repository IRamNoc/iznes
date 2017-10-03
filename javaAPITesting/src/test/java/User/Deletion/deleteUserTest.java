package User.Deletion;

import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;


@RunWith(JUnit4.class)
public class deleteUserTest {

    private class Holder<T>{
      T value = null;
    }


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
    public void deleteUserWithTokenTest() throws InterruptedException, ExecutionException {

      final  AtomicInteger atomicInt = new AtomicInteger(0);

      Holder<Integer> userIdHolder = new Holder<>();

      String userDetails[] = generateUserDetails();
      String newUserName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];

      CountDownLatch latch = new CountDownLatch(1);

      socket.registerHandler(Message.Type.Login.name(), message -> {

      socket.sendMessage(factory.listUsers());

      return "";
      });

      socket.registerHandler(Message.Type.um_lu.name(), message -> {

        int call = atomicInt.getAndIncrement();
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(data.size()-1);
        Object lastUserName = resp.get("userName");
        Object oldUserName = lastUserName;

        switch (call){
          case 0: //first time
            assertNotNull(lastUserName);
            assertTrue(!lastUserName.toString().equals(newUserName));
            socket.sendMessage(factory.addUserToAccount(newUserName, email,"8","35", password));
            break;
          case 1: //second time

            assertNotNull(lastUserName);
            assertTrue(lastUserName.toString().equals(newUserName));
            System.out.println("UserIdHolder at delete = " + userIdHolder.value);
            socket.sendMessage(factory.deleteUserFromAccount(userIdHolder.value.toString()));

            break;
          case 2: //third time

            assertNotNull(lastUserName);
            assertTrue(lastUserName.equals(oldUserName));
            latch.countDown();
            break;
        }
        return "";
      });

      socket.registerHandler(Message.Type.nu.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object newUser = resp.get("userName");
        Object userID = resp.get("userID");
        userIdHolder.value = ((Number)userID).intValue();
        assertNotNull(newUser);
        assertTrue(newUser.toString().equalsIgnoreCase(newUserName));
        socket.sendMessage(factory.listUsers());

        return "";
      });

      socket.registerHandler(Message.Type.du.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object status = resp.get("Status");
        assertTrue(status.toString().equals("OK") );
        socket.sendMessage(factory.listUsers());

        return "";
      });

      Future<Connection> connexion = ws.start("ws://localhost:9788/db/");

      latch.await();
      connexion.get().disconnect();
    }

    public static String[] generateUserDetails() {
        String str = randomAlphabetic(5);
        String userName = "Test_User_" + str;
        String password = randomAlphabetic(12);
        String email = userName + "@test.com";

        return new String[]{userName, password, email};
    }
}
