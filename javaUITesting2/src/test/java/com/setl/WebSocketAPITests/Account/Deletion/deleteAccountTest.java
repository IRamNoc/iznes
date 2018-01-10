package com.setl.WebSocketAPITests.Account.Deletion;

import SETLAPIHelpers.Account;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import com.setl.WebSocketAPITests.Account.Creation.createAccountTest;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.AfterClass;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.*;

import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccount;
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.deleteAccount;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static junit.framework.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)
public class deleteAccountTest {

    private static final Logger logger = LogManager.getLogger(deleteAccountTest.class);
    static ExecutorService executor  = Executors.newSingleThreadExecutor();

    @AfterClass
    public static void stop(){
        executor.shutdown();;
    }


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
  public void deleteAccountTest() throws InterruptedException, ExecutionException {
      runTest(()-> {
          try {
              Account account = createAccount(factory, socket, 1);
              deleteAccount(factory, socket, account.getAccountID());
          } catch (InterruptedException| ExecutionException e) {
              fail(e.getMessage());
          }
      });

  }
}
