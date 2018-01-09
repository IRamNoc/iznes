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
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccount;
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.deleteAccount;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;


@RunWith(OrderedJUnit4ClassRunner.class)
public class deleteAccountTest {

    private static final Logger logger = LogManager.getLogger(deleteAccountTest.class);

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);;

  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

  @Test
  @Ignore
  public void deleteAccountTest() throws InterruptedException, ExecutionException {
     int MAXTRIES=20;
      for(int i=0; i<MAXTRIES; i++) {
          try {
              Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
              Account account = createAccount(factory, socket, 1);
              deleteAccount(factory, socket, account.getAccountID());
              connection.disconnect();
          } catch (Exception ex) {
              logger.error("Login:", ex);
              if(i>=MAXTRIES-1)
                  throw(ex);
          }
          break;
      }
  }
}
