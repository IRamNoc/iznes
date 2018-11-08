package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.NavList;
import SETLAPIHelpers.Container;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;

import java.io.IOException;
import java.util.Map;


public class NavHelper {

    String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
    static RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }



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


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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
