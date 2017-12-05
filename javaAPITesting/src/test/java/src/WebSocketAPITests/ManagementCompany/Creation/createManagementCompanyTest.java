package src.WebSocketAPITests.ManagementCompany.Creation;


import SETLAPIHelpers.ManagementCompany;
import SETLAPIHelpers.ManagementCompanyError;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccountError;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUser;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class createManagementCompanyTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String localAddress = "ws://localhost:9788/db/";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void createManagementCompanyWithValidDataTest() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createManagementCompany(factory, socket, 1);
    connection.disconnect();
  }

    private ManagementCompany createManagementCompany(MessageFactory factory, SocketClientEndpoint socket, int i) {
        return null;
    }
/*
  @Test
  public void failToCreateManagementCompanyWithIncorrectAccountID() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    ManagementCompanyError managementCompanyError = (ManagementCompanyError) createManagementCompanyError((factory, socket, 2);
    assertTrue("Permission Denied.".equals(managementCompanyError.getMessage()));
    connection.disconnect();
  }

  @Test
  public void failToCreateDuplicateManagementCompany() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    ManagementCompany managementCompany = createManagementCompany(factory, socket, 1);
    ManagementCompanyError managementCompanyError = (ManagementCompanyError) createManagementCompanyError(factory, socket, managementCompany.getMCName(), managementCompany.getDescription(), 1);
    assertTrue("Management Company already exists.".equals(managementCompanyError.getMessage()));
    connection.disconnect();
  }*/
}
