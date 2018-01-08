package com.setl.WebSocketAPITests.Account.Creation;


import SETLAPIHelpers.Account;
import SETLAPIHelpers.AccountError;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import com.setl.openCSDClarityTests.UI.Users.OpenCSDCreateUserAcceptanceTest;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
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
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccountError;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static junit.framework.TestCase.assertTrue;


@RunWith(OrderedJUnit4ClassRunner.class)
public class createAccountTest {

  private static final Logger logger = LogManager.getLogger(createAccountTest.class);

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  //SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

  @Test
  public void createAccountWithValidDataTest() throws InterruptedException, ExecutionException {



      int MAXTRIES=20;
      for(int i=0; i<MAXTRIES; i++) {
          try {
              Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
              createAccount(factory, socket, 1);
              connection.disconnect();
          } catch (Exception ex) {
              logger.error("Login:", ex);
              if(i>=MAXTRIES-1)
                  throw(ex);
          }
          break;
      }
  }

  @Test
  public void failToCreateAccountWithIncorrectAccountID() throws InterruptedException, ExecutionException {

      int MAXTRIES=20;
      for(int i=0; i<MAXTRIES; i++) {
          try {
              Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
              AccountError accountError = (AccountError) createAccountError(factory, socket, 2);
              assertTrue("Permission Denied.".equals(accountError.getMessage()));
              connection.disconnect();
          } catch (Exception ex) {
              logger.error("Login:", ex);
              if(i>=MAXTRIES-1)
                  throw(ex);
          }
          break;
      }
  }

  @Test
  public void failToCreateDuplicateAccount() throws InterruptedException, ExecutionException {

      int MAXTRIES=20;
      for(int i=0; i<MAXTRIES; i++) {
          try {
              Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
              Account account = createAccount(factory, socket, 1);
              AccountError accountError = (AccountError) createAccountError(factory, socket, account.getAccountName(), account.getDescription(), 1);
              assertTrue("Account already exist under this member.".equals(accountError.getMessage()));
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
