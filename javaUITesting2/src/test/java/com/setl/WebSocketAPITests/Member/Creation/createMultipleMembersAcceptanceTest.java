package com.setl.WebSocketAPITests.Member.Creation;

import SETLAPIHelpers.Member;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.AfterClass;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;


import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.createMember;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.createMemberAndCaptureDetails;
import static junit.framework.Assert.fail;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;

@RunWith(OrderedJUnit4ClassRunner.class)
public class createMultipleMembersAcceptanceTest {

  private static final Logger logger = LogManager.getLogger(createMultipleMembersAcceptanceTest.class);
    static ExecutorService executor  = Executors.newSingleThreadExecutor();

    @AfterClass
    public static void stop(){
        executor.shutdown();;
    }

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);
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

  @Test
  public void createMultipleMembers() throws ExecutionException, InterruptedException {

      runTest(()-> {
          try {
              createMember(factory, socket, 5);
          } catch (InterruptedException| ExecutionException e) {
              fail(e.getMessage());
          }
      });
  }
}

