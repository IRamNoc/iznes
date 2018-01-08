package com.setl.WebSocketAPITests.User.Creation;

import SETLAPIHelpers.User;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import com.setl.WebSocketAPITests.Account.Deletion.deleteAccountTest;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.ResponseHandler;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.updateUser;

@RunWith(JUnit4.class)
public class createUserTest {
    private static final Logger logger = LogManager.getLogger(createUserTest.class);

    public static ResponseHandler print = js -> js.toJSONString();

    @Before
    public void setUp() throws Exception {
    }


    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);
    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";


    @Test
    public void createUser() throws InterruptedException, ExecutionException {

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

        int MAXTRIES = 4;
        for (int i = 0; i < MAXTRIES; i++) {
            try {
                Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

                User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);

                System.out.println("userID " + user.getUserID());
                System.out.println("userName " + user.getUserName());
                System.out.println("email " + user.getEmailAddress());
                System.out.println("password " + password);

                connection.disconnect();
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if (i >= MAXTRIES - 1)
                    throw (ex);
            }
            break;
        }
    }
}
