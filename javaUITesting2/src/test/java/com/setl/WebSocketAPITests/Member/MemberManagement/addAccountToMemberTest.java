package com.setl.WebSocketAPITests.Member.MemberManagement;

import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
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

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.addAccountToMember;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.createMember;

@RunWith(JUnit4.class)
public class addAccountToMemberTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String localAddress = "ws://localhost:9788/db/";

  @Test
  @Ignore
  public void createNewMemberAndAddAccount() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];
    createMember(factory, socket);
    connection.disconnect();
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, memberName, "PASSWORD");

    addAccountToMember(factory, socket, "SETL Private Admin");

    connection.disconnect();
  }

  @Test
  @Ignore
  public void addAccountToExistingMember() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];
    createMember(factory, socket);

    connection.disconnect();
  }


}
