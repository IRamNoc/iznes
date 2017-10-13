package SETLAPIHelpers;

import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;

public class MemberHelper {

  public static void createMember(MessageFactory factory, SocketClientEndpoint socket) throws InterruptedException, ExecutionException {

    CountDownLatch latch = new CountDownLatch(1);

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    socket.registerHandler(Message.Type.nm.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object newMember = resp.get("memberName");

      assertNotNull(newMember);
      latch.countDown();
      return "";
    });

    socket.sendMessage(factory.createMember(memberName, email));

    latch.await();
  }

  public static void createMember(MessageFactory factory, SocketClientEndpoint socket, int noOfUsers) throws ExecutionException, InterruptedException {
    for (int i = 0; i < noOfUsers; i++) {
      CountDownLatch latch = new CountDownLatch(1);

      String memberDetails[] = generateMemberDetails();
      String memberName = memberDetails[0];
      String email = memberDetails[1];


      socket.registerHandler(Message.Type.nm.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object newMember = resp.get("memberName");
        assertNotNull(newMember);
        latch.countDown();
        return "";
      });

      socket.sendMessage(factory.createMember(memberName, email));

      latch.await();
    }
  }


  public static void addAccountToMember(MessageFactory factory, SocketClientEndpoint socket, String account) throws ExecutionException, InterruptedException {
    CountDownLatch latch = new CountDownLatch(1);

    socket.registerHandler(Message.Type.na.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object status = resp.get("Status");
      assertNotNull(status);
      assertTrue(status.toString().equals("OK"));
      latch.countDown();
      return "";
    });

    socket.sendMessage(factory.addAccountToMember(account));

    latch.await();
  }
}
