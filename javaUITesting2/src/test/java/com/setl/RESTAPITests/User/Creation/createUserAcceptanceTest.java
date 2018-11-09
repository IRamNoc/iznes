package com.setl.RESTAPITests.User.Creation;
import SETLAPIHelpers.RestAPI.DatabaseHelper;
import SETLAPIHelpers.RestAPI.UserHelper;
import com.setl.UI.common.SETLUtils.Repeat;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.wsclient.shared.ResponseHandler;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.DatabaseHelper.*;
import static SETLAPIHelpers.RestAPI.UserHelper.createUserAndCaptureDetails;
import static SETLAPIHelpers.RestAPI.UserHelper.createUserFailure;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class createUserAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);

    String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
    int userId = 62;
    String apiKey = "8hRWis4APGvOmgdUnhfLp8rNTh3Wp0h9EK2DcT5+YTiG";
    String userLocked = "0";
    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup() {
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }


    @Test
    public void createNewUser() throws SQLException, InterruptedException {
        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = "P4ssw0rd1.";
        String email = userDetails[2];
        System.out.println(userDetails[0]);

        int existingRows = databaseCountRows("Users");


        validateDatabaseCountRows("Users", existingRows);

        int newRows = existingRows + 1;

        UserHelper.createUserSuccess(localAddress, "2", userName, email, "35", password, userLocked, userId, apiKey);

        validateDatabaseCountRows("Users", newRows);
        deleteUserFromDatabase(email);
        validateDatabaseCountRows("Users", existingRows);
    }


    @Test
    public void shouldNotCreateDuplicateUserViaAPI() throws IOException, InterruptedException, SQLException {

        int openingRows = databaseCountRows("Users");
        createUserAndCaptureDetails(localAddress, "2", "2ndDuplicateUser", "2ndDuplicateuser@test.com", "35", "P4ssw0rd.", userLocked, userId, apiKey);
        int newRows = openingRows + 1;
        validateDatabaseCountRows("Users", newRows);
        validateDatabaseUsersTable("2ndDuplicateUser", "2ndDuplicateuser@test.com", 1);

        int latestRows = databaseCountRows("Users");
        createUserFailure(localAddress, "2", "2ndDuplicateUser", "2ndDuplicateuser@test.com", "35", "P4ssw0rd.", userLocked, userId, apiKey);
        validateDatabaseCountRows("Users", latestRows);
        validateDatabaseUsersTable("2ndDuplicateUser", "2ndDuplicateuser@test.com", 1);

    }

}

