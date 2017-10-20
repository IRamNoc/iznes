package src.RESTAPITests.User.Deletion;

import SETLAPIHelpers.User;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;


import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.RestAPI.UserHelper.*;



@RunWith(JUnit4.class)
public class deleteUserAcceptanceTest {

    private class Holder<T>{
      T value = null;
    }

    @Rule
    public Timeout globalTimeout = Timeout.millis(300000);

    String localAddress = "http://localhost:9788/api";


  @Test
  public void deleteUserTest() throws ExecutionException, InterruptedException {

    //USER DETAILS
      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];

    //CREATE NEW USER
      User user = createUserAndCaptureDetails(localAddress, "8", userName, email, "35", password);

    //DELETE USER
      deleteUserSuccess(localAddress, user.getUserID());

    }

  @Test
  public void failToDeleteUserNonExistentUserTest() throws ExecutionException, InterruptedException {

    //USER DETAILS
    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];

    //CREATE NEW USER
    User user = createUserAndCaptureDetails(localAddress, "8", userName, email, "35", password);

    //DELETE USER
    String userToDelete = user.getUserID();
    deleteUserSuccess(localAddress, userToDelete);

    //TRY TO DELETE SAME USER
    deleteUserError(localAddress, userToDelete);
  }


}
