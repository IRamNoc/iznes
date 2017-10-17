package src.APITests.Account.Deletion;

import SETLAPIHelpers.Account;
import SETLAPIHelpers.LoginHelper;
import SETLAPIHelpers.Member;
import SETLAPIHelpers.User;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountHelper.createAccount;
import static SETLAPIHelpers.AccountHelper.deleteAccount;
import static SETLAPIHelpers.LoginHelper.login;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.MemberHelper.createMemberAndCaptureDetails;
import static SETLAPIHelpers.MemberHelper.deleteMember;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.UserHelper.*;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteAccountTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);

  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  String localAddress = "ws://localhost:9788/db/";

  @Test
  public void deleteAccountTest() throws InterruptedException, ExecutionException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

    Account account = createAccount(factory, socket, 1);
    deleteAccount(factory, socket, account.getAccountID());
    connection.disconnect();
  }

}
