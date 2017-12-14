package com.setl.WebSocketAPITests.Member.Creation;

import SETLAPIHelpers.Member;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;


import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.createMember;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.createMemberAndCaptureDetails;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createMemberTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);;
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

  @Test
  public void createNewMember() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createMember(factory, socket);
    connection.disconnect();
  }

  @Test
  public void createNewMemberAndVerifySuccess() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    System.out.println("Member Name = " +  memberName);
    String email = memberDetails[1];
    System.out.println("Member Email = " +  email);

    Member member = createMemberAndCaptureDetails(factory, socket, memberName, email);

    System.out.println("JSON MemberName = " + member.getMemberName());
    System.out.println("Member Name = " + memberName);
    assertTrue(member.getMemberName().equals(memberName));

    connection.disconnect();
  }

  @Test
  public void createMultipleMember() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createMember(factory, socket, 5);
    connection.disconnect();
  }

  @Test
  public void createMemberWithValidDataTest() throws InterruptedException, ExecutionException {

  final AtomicInteger atomicInt = new AtomicInteger(0);

  String memberDetails[] = generateMemberDetails();
  String accountName = memberDetails[0];
  String email = memberDetails[1];
  System.out.println("Member Name : " + accountName);
  System.out.println("Member email : " + email);

  CountDownLatch latch = new CountDownLatch(1);


  Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

  socket.registerHandler(Message.Type.gal.name(), message ->  {

  int call = atomicInt.getAndIncrement();
  if (call == 0) {
  JSONArray data = (JSONArray) message.get("Data");
  JSONObject resp = (JSONObject) data.get(data.size() - 1);
  Object lastMember = resp.get("accountName");
    System.out.println("Last member : " + lastMember.toString());
    System.out.println("Account Name : " + accountName);
  assertNotNull(lastMember);
  assertTrue(!lastMember.toString().equals(accountName));
  try {
  createMember(factory, socket);
  } catch (InterruptedException e) {
  e.printStackTrace();
  } catch (ExecutionException e) {
  e.printStackTrace();
  }
  return "";
  }


  JSONArray data = (JSONArray) message.get("Data");
  JSONObject resp = (JSONObject) data.get(data.size() - 1);
  Object lastMember = resp.get("accountName");
  assertNotNull(lastMember);
  assertTrue(lastMember.toString().equals(accountName));
  latch.countDown();
  return "";
  });

  socket.sendMessage(factory.listMembers());

  socket.registerHandler(Message.Type.nm.name(), message -> {
  JSONArray data = (JSONArray) message.get("Data");
  JSONObject resp = (JSONObject) data.get(0);
  Object newMember = resp.get("accountName");
  assertNotNull(newMember);
  assertTrue(newMember.toString().equalsIgnoreCase(accountName));
  socket.sendMessage(factory.listMembers());
  return "";
  });

  connection.disconnect();
  }
}

