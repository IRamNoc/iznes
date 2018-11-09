package SETLAPIHelpers.WebSocketAPI;

import SETLAPIHelpers.Account;
import SETLAPIHelpers.AccountError;
import SETLAPIHelpers.JsonToJava;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import junit.framework.TestCase;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import java.io.IOException;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static junit.framework.TestCase.assertTrue;


public class AccountHelper {

  public static Account createAccount(MessageFactory factory, SocketClientEndpoint socket, int accountMember) throws InterruptedException, ExecutionException {

    Container<Account> container = new Container<>();
    CountDownLatch latch = new CountDownLatch(1);


    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];



    socket.registerHandler(Message.Type.na.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      try {
        Account account = JsonToJava.convert(resp.toJSONString(), Account.class);
        container.setItem(account);
      } catch (IOException e) {
        e.printStackTrace();
      }

      latch.countDown();
      return "";

    });

    socket.sendMessage(factory.createAccount(accountDescription, accountName, accountMember));

    latch.await();
    return container.getItem();

  }

  public static Account createAccountError(MessageFactory factory,
                                           SocketClientEndpoint socket,
                                           int accountMember) throws InterruptedException, ExecutionException {

      Container<Account> container = new Container<>();
      CountDownLatch latch = new CountDownLatch(1);

      String accountDetails[] = generateAccountDetails();
      String accountName = accountDetails[0];
      String accountDescription = accountDetails[1];


    socket.registerHandler(Message.Type.na.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        try {
          AccountError accountError = JsonToJava.convert(resp.toJSONString(), AccountError.class);
          container.setItem(accountError);
        } catch (IOException e) {
          e.printStackTrace();
        }

        latch.countDown();
        return "";

      });

      socket.sendMessage(factory.createAccount(accountDescription, accountName, accountMember));

      latch.await();
      return container.getItem();

  }

  public static Account createAccountError(MessageFactory factory,
                                           SocketClientEndpoint socket,
                                           String accountName,
                                           String accountDescription,
                                           int accountMember) throws InterruptedException, ExecutionException {

      Container<Account> container = new Container<>();
      CountDownLatch latch = new CountDownLatch(1);

    socket.registerHandler(Message.Type.na.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        try {
          AccountError accountError = JsonToJava.convert(resp.toJSONString(), AccountError.class);
          container.setItem(accountError);
        } catch (IOException e) {
          e.printStackTrace();
        }

        latch.countDown();
        return "";

      });

      socket.sendMessage(factory.createAccount(accountDescription, accountName, accountMember));

      latch.await();
      return container.getItem();

  }

    public static void deleteAccount(MessageFactory factory, SocketClientEndpoint socket, int accountID) throws InterruptedException, ExecutionException {

      CountDownLatch latch = new CountDownLatch(1);


      socket.registerHandler(Message.Type.da.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        System.out.println("Response account Id =  " + (resp.get("accountID")));
        System.out.println("Input account id = "  + accountID);
        TestCase.assertTrue(resp.get("accountID").toString().equals(String.valueOf(accountID)));
        latch.countDown();
        return "";

      });

      socket.sendMessage(factory.deleteAccount(accountID));

      latch.await();


  }

}
