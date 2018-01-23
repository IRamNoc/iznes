package com.setl.WebSocketAPITests.Member.MemberManagement;

import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.junit.AfterClass;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;

import java.util.concurrent.*;

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.*;
import static junit.framework.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class addAccountToMemberAcceptanceTest {

    static ExecutorService executor  = Executors.newSingleThreadExecutor();

    @AfterClass
    public static void stop(){
        executor.shutdown();;
    }

    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";


    private void runTest(Runnable r){
        Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
        for (int i=0;i<3;i++)
            try {
                executor.submit(r).get(30, TimeUnit.SECONDS);
                break;
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            } catch (TimeoutException e) {
                e.printStackTrace();
            }
        connection.disconnect();
    }
;


  @Test
  @Ignore("Failing - needs investigation WRT WS timeout" )
  public void createNewMemberAndAddAccount() throws ExecutionException, InterruptedException {

      runTest(()-> {
          try {
              String memberDetails[] = generateMemberDetails();
              String memberName = memberDetails[0];
              String email = memberDetails[1];
              createMember(factory, socket);
          SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, memberName, "PASSWORD");
          } catch (InterruptedException| ExecutionException e) {
              fail(e.getMessage());
          }

          try {
              addAccountToMember(factory, socket, "SETL Private Admin");
          } catch (ExecutionException e) {
              e.printStackTrace();
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
      });
  }


  @Test
  @Ignore("Failing - needs investigation WRT WS timeout" )
  public void addAccountToExistingMember() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];
    createMember(factory, socket);

    connection.disconnect();
  }


}
