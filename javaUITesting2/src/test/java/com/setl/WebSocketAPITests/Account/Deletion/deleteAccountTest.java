package com.setl.WebSocketAPITests.Account.Deletion;

import SETLAPIHelpers.Account;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
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


@RunWith(JUnit4.class)
public class deleteAccountTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);;

  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

  @Test
  public void deleteAccountTest() throws InterruptedException, ExecutionException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

    Account account = createAccount(factory, socket, 1);
    deleteAccount(factory, socket, account.getAccountID());
    connection.disconnect();
  }

}
