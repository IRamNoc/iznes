package com.setl.openCSDClarityTests.UI.AdministrationModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;

import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDUsersSubModuleTest {

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";

    static RestApi<MemberNodeMessageFactory> api;


    JavascriptExecutor jse = (JavascriptExecutor) driver;


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
    @Ignore
    public void shouldNotCreateUserNOTeam() throws InterruptedException {
        String[] emailaddress = generateEmail();
        String[] phoneNumber = generatePhoneNumber();
        String[] firstName = generateUser();
        String[] lastName = generateUser();
        String[] userRef = generateRandomTeamReference();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-users");
        selectAddNewUser();
        fillInUserDetails(emailaddress[0], firstName[0], lastName[0], userRef[0], phoneNumber[0]);
        selectUserType();
        createUserDisabled();
    }


    @Test
    @Ignore //Static Team no longer Exists it was removed due to old data
    public void shouldNotCreateUser() throws InterruptedException, SQLException {
        String[] emailaddress = generateBadEmail();
        String[] phoneNumber = generatePhoneNumber();
        String[] firstName = generateBadUser();
        String[] lastName = generateBadUser();
        String[] userRef = generateRandomTeamReference();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-users");
        selectAddNewUser();
        fillInUserDetails(emailaddress[0], firstName[0], lastName[0], userRef[0], phoneNumber[0]);
        selectStaticTeam();
        selectCreateUserWithBadDetails();
        validateUserNOTCreatedOrDeleted(0, emailaddress[0], firstName[0], lastName[0], phoneNumber[0], userRef[0]);
    }

    @Test
    @Ignore //Static Team no longer exists, this test needs reworking
    public void shouldCreateUser()throws InterruptedException, SQLException {
        String[] emailaddress = generateEmail();
        String[] phoneNumber = generatePhoneNumber();
        String[] firstName = generateUser();
        String[] lastName = generateUser();
        String[] userRef = generateRandomTeamReference();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-users");
        selectAddNewUser();
        fillInUserDetails(emailaddress[0], firstName[0], lastName[0], userRef[0], phoneNumber[0]);
        selectUserType();
        selectStaticTeam();
        selectCreateUser();
        searchUser(userRef[0],firstName[0], lastName[0], emailaddress[0], phoneNumber[0]);
        validateUserCreated(1, emailaddress[0], firstName[0], lastName[0], phoneNumber[0], userRef[0]);
    }
}
