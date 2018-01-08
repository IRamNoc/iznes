package com.setl.WebSocketAPITests.Member.Deletion;

import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import SETLAPIHelpers.Member;
import com.setl.WebSocketAPITests.Account.Deletion.deleteAccountTest;
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

import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;

import static SETLAPIHelpers.WebSocketAPI.MemberHelper.createMemberAndCaptureDetails;
import static SETLAPIHelpers.WebSocketAPI.MemberHelper.deleteMember;


@RunWith(OrderedJUnit4ClassRunner.class)
public class deleteMemberTest {
    private static final Logger logger = LogManager.getLogger(deleteMemberTest.class);

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);;

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

    @Test
    public void deleteMemberTest() throws InterruptedException, ExecutionException {

      String memberDetails[] = generateMemberDetails();

      String memberName = memberDetails[0];
      String email = memberDetails[1];
        int MAXTRIES=4;
        for(int i=0; i<MAXTRIES; i++) {
            try {
                Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

      Member member = createMemberAndCaptureDetails(factory, socket, memberName, email);
      deleteMember(factory, socket, member.getMemberID());

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
