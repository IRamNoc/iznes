package com.setl.workflows;


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

public class CreateUser {

    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";
    public static final Logger logger = (Logger) LogManager.getLogger(AssignGroupToUser.class);


    public CreateUser() throws ExecutionException, InterruptedException {


        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

      /*  Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
        createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);*/


       // connection.disconnect();
    }
}
