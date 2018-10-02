package com.setl.openCSDClarityTests.UI.AdministrationModule;

import SETLAPIHelpers.Container;
import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.User;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

import static SETLAPIHelpers.DatabaseHelper.databaseCountRows;
import static SETLAPIHelpers.DatabaseHelper.validateDatabaseCountRows;
import static SETLAPIHelpers.DatabaseHelper.validateDatabaseUsersTable;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static junit.framework.TestCase.assertTrue;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDUsersSubModuleTest {

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";

    static RestApi<MemberNodeMessageFactory> api;


    JavascriptExecutor jse = (JavascriptExecutor)driver;


    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(55000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

        @Test
        public void shouldCreateUser() throws InterruptedException {
            String[] emailaddress = generateEmail();
            String[] phoneNumber = generatePhoneNumber();
            String[] firstName = generateUser();
            String[] lastName = generateUser();
            String[] userRef = generateRandomTeamReference();
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("menu-administration");
            navigateToDropdown("menu-administration-users");
            selectAddNewUser();
            fillInUserDetails(emailaddress[0], firstName[0], lastName[0],userRef[0], phoneNumber[0]);
            selectUserType();
            selectCreateUser();
        }

        @Test
        public void shouldCreateUserViaAPI() throws SQLException {
            String userDetails[] = generateUserDetails();
            String userName = userDetails[0];
            String email = userDetails[2];

            int openingRows = databaseCountRows("Users");
            createUserAndCaptureDetails("http://uk-lon-li-006.opencsd.io:9788/api", "2", userName, email, "35", "P4ssw0rd.", 10, "W87JxUHiaY8bGQIWPz5tP5TJspT7qhZlSXMRtydH3F+T");
            int newRows = openingRows + 1;
            validateDatabaseCountRows("Users", newRows);
            validateDatabaseUsersTable(userName, email, 1);
        }


    private User createUserAndCaptureDetails(String localAddress, String account, String userName, String email, String userType, String password, int userId, String apiKey) {


            Container<User> container = new Container<>();

            api = new RestApi<>(localAddress, new MemberNodeMessageFactory());

            api.start(userId, apiKey);

            MemberNodeMessageFactory msfFactory = api.getMessageFactory();
            api.sendMessage(msfFactory.newUser(account, userName, email,userType, password), claim -> {
                Map resp = claim.get("data").asList(Map.class).get(0);
                try {
                    User user = JsonToJava.convert(resp.toString(), User.class);
                    container.setItem(user);
                } catch (IOException e) {
                    e.printStackTrace();
                }

            });

            return container.getItem();
        }

    @Test
    public void shouldNotCreateUser() throws InterruptedException {
        String[] emailaddress = generateBadEmail();
        String[] phoneNumber = generatePhoneNumber();
        String[] firstName = generateBadUser();
        String[] lastName = generateBadUser();
        String[] userRef = generateRandomTeamReference();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-users");
        selectAddNewUser();
        fillInUserDetails(emailaddress[0], firstName[0], lastName[0],userRef[0], phoneNumber[0]);
        selectCreateUserWithBadDetails();
    }
}
