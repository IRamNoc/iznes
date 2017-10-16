package SETLAPIHelpers;

import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import src.APITests.io.setl.Container;

import java.io.IOException;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;


public class AccountHelper {

  public static Account createAccount(MessageFactory factory, SocketClientEndpoint socket, String accountDescription, String accountName, int accountMember) throws InterruptedException, ExecutionException {

    Container<Account> container = new Container<>();
    CountDownLatch latch = new CountDownLatch(1);


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

  public static Account createAccountError(MessageFactory factory, SocketClientEndpoint socket, String accountDescription, String accountName, int accountMember) throws InterruptedException, ExecutionException {

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

   /* public static void deleteAccount(MessageFactory factory, SocketClientEndpoint socket, String accountDescription, String accountName, int accountMember) throws InterruptedException, ExecutionException {

      Container<Account> container = new Container<>();
      CountDownLatch latch = new CountDownLatch(1);


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

      socket.sendMessage(factory.deleteAccount(accountDescription, accountName, accountMember));

      latch.await();
      return container.getItem();

    }
*/
}
