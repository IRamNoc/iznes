package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.NavList;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import src.WebSocketAPITests.io.setl.Container;

import java.io.IOException;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;


public class NavHelper {


public static NavList NavList(String localAddress,
                              String fundName,
                              String navDate,
                              String status,
                              String pageNum,
                              String pageSize,
                              int userId,
                              String apiKey
                               )
                               throws InterruptedException{
  Container<NavList> container = new Container<>();

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.getNavList(fundName, navDate, status, pageNum, pageSize), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      try {
        NavList navlist = JsonToJava.convert(resp.toString(), NavList.class);
        container.setItem(navlist);
      } catch (IOException e) {
        e.printStackTrace();
      }

    });

  return container.getItem();
  }
}
