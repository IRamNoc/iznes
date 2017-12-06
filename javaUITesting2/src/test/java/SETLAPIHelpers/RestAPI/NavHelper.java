package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.NavList;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Before;
import com.setl.WebSocketAPITests.io.setl.Container;

import java.io.IOException;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;


public class NavHelper {

    String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
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
