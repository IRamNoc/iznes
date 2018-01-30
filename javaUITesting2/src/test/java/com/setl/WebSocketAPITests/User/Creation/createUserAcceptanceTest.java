package com.setl.WebSocketAPITests.User.Creation;

import SETLAPIHelpers.User;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.ResponseHandler;
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

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccount;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.updateUser;
import static junit.framework.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class createUserAcceptanceTest {
    private static final Logger logger = LogManager.getLogger(createUserAcceptanceTest.class);

    public static ResponseHandler print = js -> js.toJSONString();

    static ExecutorService executor = Executors.newSingleThreadExecutor();

    @AfterClass
    public static void stop() {
        executor.shutdown();
        ;
    }

    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

    private void runTest(Runnable r) {
        Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
        for (int i = 0; i < 3; i++)
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
    public void createUser() {

        runTest(() -> {
            try {

                String userDetails[] = generateUserDetails();
                String userName = userDetails[0];
                String password = userDetails[1];
                String email = userDetails[2];
                User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);

                System.out.println("userID " + user.getUserID());
                System.out.println("userName " + user.getUserName());
                System.out.println("email " + user.getEmailAddress());
                System.out.println("password " + password);

            } catch (InterruptedException | ExecutionException e) {
                fail(e.getMessage());
            }
        });
    }
}
