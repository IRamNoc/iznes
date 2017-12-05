package com.setl.workflows;

import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;
import org.junit.Rule;
import org.junit.rules.Timeout;

import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;

public class CreateUser {

    @Rule
    public Timeout globalTimeout = Timeout.millis(3000);
    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "trb2017");
    String localAddress = "ws://localhost:9788/db/";
    public static final Logger logger = (Logger) LogManager.getLogger(AssignGroupToUser.class);


    public CreateUser() throws ExecutionException, InterruptedException {


        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

        Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
        createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);


        connection.disconnect();
    }
}
