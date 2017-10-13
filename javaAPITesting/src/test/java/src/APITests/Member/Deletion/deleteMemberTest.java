package src.APITests.Member.Deletion;

import SETLAPIHelpers.LoginHelper;
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
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import static SETLAPIHelpers.LoginHelper.login;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.MemberHelper.createMember;
import static SETLAPIHelpers.MemberHelper.createMemberAndCaptureDetails;
import static SETLAPIHelpers.MemberHelper.deleteMember;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.UserHelper.*;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteMemberTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(3000);

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
    String localAddress = "ws://localhost:9788/db/";

    @Test
    public void deleteMemberTest() throws InterruptedException, ExecutionException {
      Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

      String memberDetails[] = generateMemberDetails();

      String memberName = memberDetails[0];
      String email = memberDetails[1];

      Member member = createMemberAndCaptureDetails(factory, socket, memberName, email);
      deleteMember(factory, socket, member.getMemberID());
      connection.disconnect();
      }
}
