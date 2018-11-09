package SETLAPIHelpers.WebSocketAPI;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.ManagementCompany;
import SETLAPIHelpers.ManagementCompanyError;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import junit.framework.TestCase;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.ManagementCompanyDetailsHelper.generateManagementCompanyDetails;


public class ManagementCompanyHelper {

  public static ManagementCompany createManagementCompany(MessageFactory factory, SocketClientEndpoint socket, int managementCompanyMember) throws InterruptedException, ExecutionException {

    Container<ManagementCompany> container = new Container<>();
    CountDownLatch latch = new CountDownLatch(1);


    String managementCompanyDetails[] = generateManagementCompanyDetails();
    String managementCompanyName = managementCompanyDetails[0];
    String managementCompanyDescription = managementCompanyDetails[1];



    socket.registerHandler(Message.Type.na.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      try {
       ManagementCompany managementCompany = JsonToJava.convert(resp.toJSONString(), ManagementCompany.class);
        container.setItem(managementCompany);
      } catch (IOException e) {
        e.printStackTrace();
      }

      latch.countDown();
      return "";

    });

    //socket.sendMessage(factory.createManagementCompany(managementCompanyDescription, managementCompanyName, managementCompanyMember));

    latch.await();
    return container.getItem();

  }

  public static ManagementCompany createManagementCompanyError(MessageFactory factory,
                                           SocketClientEndpoint socket,
                                           int managementCompanyMember) throws InterruptedException, ExecutionException {

      Container<ManagementCompany> container = new Container<>();
      CountDownLatch latch = new CountDownLatch(1);

      String managementCompanyDetails[] = generateManagementCompanyDetails();
      String managementCompanyName = managementCompanyDetails[0];
      String managementCompanyDescription = managementCompanyDetails[1];


    socket.registerHandler(Message.Type.na.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        try {
          ManagementCompanyError managementCompanyError = JsonToJava.convert(resp.toJSONString(), ManagementCompanyError.class);
          container.setItem(managementCompanyError);
        } catch (IOException e) {
          e.printStackTrace();
        }

        latch.countDown();
        return "";

      });

      //socket.sendMessage(factory.createManagementCompany(managementCompanyDescription, managementCompanyName, managementCompanyMember));

      latch.await();
      return container.getItem();

  }

  public static ManagementCompany createManagementCompanyError(MessageFactory factory,
                                           SocketClientEndpoint socket,
                                           String managementCompanyName,
                                           String managementCompanyDescription,
                                           int managementCompanyMember) throws InterruptedException, ExecutionException {

      Container<ManagementCompany> container = new Container<>();
      CountDownLatch latch = new CountDownLatch(1);

    socket.registerHandler(Message.Type.na.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        try {
          ManagementCompanyError managementCompanyError = JsonToJava.convert(resp.toJSONString(), ManagementCompanyError.class);
          container.setItem(managementCompanyError);
        } catch (IOException e) {
          e.printStackTrace();
        }

        latch.countDown();
        return "";

      });

      //socket.sendMessage(factory.createManagementCompany(managementCompanyDescription, managementCompanyName, managementCompanyMember));

      latch.await();
      return container.getItem();

  }

    public static void deleteManagementCompany(MessageFactory factory, SocketClientEndpoint socket, int managementCompanyID) throws InterruptedException, ExecutionException {

      CountDownLatch latch = new CountDownLatch(1);


      socket.registerHandler(Message.Type.da.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        System.out.println("Response managementCompany Id =  " + (resp.get("managementCompanyID")));
        System.out.println("Input managementCompany id = "  + managementCompanyID);
        TestCase.assertTrue(resp.get("managementCompanyID").toString().equals(String.valueOf(managementCompanyID)));
        latch.countDown();
        return "";

      });

      //socket.sendMessage(factory.deleteManagementCompany(managementCompanyID));

      latch.await();


  }

}
