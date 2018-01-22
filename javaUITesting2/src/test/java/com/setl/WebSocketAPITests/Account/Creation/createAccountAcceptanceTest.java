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
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.*;

import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccount;
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccountError;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static junit.framework.Assert.fail;
import static junit.framework.TestCase.assertTrue;


@RunWith(OrderedJUnit4ClassRunner.class)
public class createAccountAcceptanceTest {

  private static final Logger logger = LogManager.getLogger(createAccountAcceptanceTest.class);

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

  @Test
  public void createAccountWithValidDataTest(){
      runTest(()-> {
          try {
              createAccount(factory, socket, 1);
          } catch (InterruptedException| ExecutionException e) {
              fail(e.getMessage());
          }
      });
  }

  @Test
  public void failToCreateAccountWithIncorrectAccountID() {
      runTest(() -> {
          try {
              AccountError accountError = (AccountError) createAccountError(factory, socket, 2);
              assertTrue("Permission Denied.".equals(accountError.getMessage()));
          } catch (InterruptedException | ExecutionException e) {
              fail(e.getMessage());
          }
      });
  }

  @Test
  public void failToCreateDuplicateAccount() throws InterruptedException, ExecutionException {
      runTest(() -> {
          try {

              Account account = createAccount(factory, socket, 1);
              AccountError accountError = (AccountError) createAccountError(factory, socket, account.getAccountName(), account.getDescription(), 1);
              assertTrue("Account already exist under this member.".equals(accountError.getMessage()));
          } catch (InterruptedException | ExecutionException e) {
              fail(e.getMessage());
          }
      });
  }
}
