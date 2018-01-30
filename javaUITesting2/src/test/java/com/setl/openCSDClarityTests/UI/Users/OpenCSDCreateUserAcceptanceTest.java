package com.setl.openCSDClarityTests.UI.Users;

import SETLAPIHelpers.User;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.net.ConnectException;
import java.sql.SQLException;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.searchDatabaseFor;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.*;
import static junit.framework.TestCase.assertTrue;
import static junit.framework.TestCase.fail;


@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDCreateUserAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDCreateUserAcceptanceTest.class);
    int MAXTRIES=4;
    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://uk-lon-li-006.opencsd.io:9788/db/";

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    @Ignore
    public void shouldCreateUserViaAPI() throws IOException, InterruptedException, ExecutionException {

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

        int MAXTRIES=4;
        for(int i=0; i<MAXTRIES; i++) {
            try {
                Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
                createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
                connection.disconnect();
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if(i>=MAXTRIES-1)
                    throw(ex);
            }
            break;
        }

        navigateToAddUser();
        navigateToUserSearch();
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/div/clr-datagrid/div/div/div/clr-dg-footer/clr-dg-pagination/ul/li[4]/button")).click();

        String userAmount1 = driver.findElement(By.className("datagrid-foot-description")).getText();
        String userAmount = userAmount1.substring(userAmount1.length() - 3).trim();
        String usernameID = "username-" + userAmount;
        assertTrue(driver.findElement(By.id(usernameID)).isDisplayed());
    }

    @Test
    @Ignore
    public void shouldNotCreateDuplicateUserViaAPI() throws IOException, InterruptedException, ExecutionException {
        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];


        for(int i=0; i<MAXTRIES; i++) {
            try {
                Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
                createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
                connection.disconnect();
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if(i>=MAXTRIES-1)
                    throw(ex);
            }
            break;
        }

        navigateToAddUser();
        enterManageUserUsername(userDetails[0]);
        enterManageUserEmail(userDetails[2]);
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword(userDetails[1]);
        enterManageUserPasswordRepeat(userDetails[1]);
        clickManageUserSubmit();

        String userErrorText = driver.findElement(By.className("jaspero__dialog-content")).getText();
        System.out.println(userErrorText);
        System.out.println("Failed to update this user.");
        assertTrue(userErrorText.contains("Failed to update this user."));
    }

    @Test
    @Ignore
    public void shouldEditUserViaAPI() throws IOException, InterruptedException, ExecutionException {
        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

        User user = null;
        for(int i=0; i<MAXTRIES; i++) {
            try {
            Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
            user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
            connection.disconnect();
            if (user!=null) break;
            } catch (Exception ex) {
                logger.error("Login:", ex);
                if(i>=MAXTRIES-1)
                    throw(ex);
            }
            break;
        }
        navigateToAddUser();
        navigateToUserSearch();
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/div/clr-datagrid/div/div/div/clr-dg-footer/clr-dg-pagination/ul/li[4]/button")).click();
        String test = user.getUserID();
        driver.findElement(By.id("edit-" + test)).click();
    }

    @Test
    public void shouldCreateUser() throws IOException, InterruptedException, SQLException {
        navigateToAddUser();
        enterAllUserDetails("2");
        Thread.sleep(500);
        try {
            clickManageUserSubmit();
        }catch (Error e){
            System.out.println("user was not created");
            fail();
        }
        Thread.sleep(500);
        searchDatabaseFor("tblUsers","emailAddress", "TestEmail2@setl.io");
    }

    @Test
    public void shouldCreateRandomUser() throws IOException, InterruptedException, SQLException {
        navigateToAddUser();
        enterAllUserDetails("3");
        Thread.sleep(750);
        try {
            clickManageUserSubmit();
        }catch (Error e){
            System.out.println("user was not created");
            fail();
        }
        searchDatabaseFor("tblUsers","emailAddress", "TestEmail3@setl.io");
    }

    @Test
    public void shouldNotCreateDuplicateUser() throws IOException, InterruptedException, SQLException {
        navigateToAddUser();
        enterAllUserDetails("4");
        Thread.sleep(750);
        try {
            clickManageUserSubmit();
        }catch (Error e){
            System.out.println("user was not created");
            fail();
        }
        searchDatabaseFor("tblUsers","emailAddress", "TestEmail4@setl.io");
    }

    @Test
    public void shouldNotCreateUserWithoutUsername() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
        popupMessageEquals("Failed to update this user.");
    }

    public void popupMessageEquals(String message) {
        WebElement errorText = driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[3]"));
        assertTrue(errorText.getText().equals(message));
    }

    @Test
    public void shouldNotCreateUserWithoutEmail() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser6");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
        popupMessageEquals("Failed to update this user.");
    }

    @Test
    public void shouldNotCreateUserWithoutAccountTypeSelected() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser5");
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
        popupMessageEquals("Failed to update this user.");
    }

    @Test
    public void shouldNotCreateUserWithoutUserTypeSelected() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser" + Math.random());
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
        popupMessageEquals("Failed to update this user.");
    }

    @Test
    public void shouldNotCreateUserWithoutPasswordEntered() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser5");
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
        popupMessageEquals("Failed to update this user.");
    }

    @Test
    public void shouldNotCreateUserWithoutPasswordRepeated() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser5");
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        clickManageUserSubmit();
        popupMessageEquals("Failed to update this user.");
    }

    @Test
    @Ignore
    public void shouldEditUserWhenEditButtonIsClicked() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
        navigateToEditUsers();
        closeUserDetails();
    }

    @Test
    @Ignore
    public void shouldEditEmail() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
        navigateToEditUsers();
        editUserEmail("test@setl.io");
        saveUserDetails();
    }

    @Test
    @Ignore
    public void shouldResetEmail() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
        navigateToEditUsers();
        editUserEmail("anthony.culligan@setl.io");
        saveUserDetails();
    }

    @Test
    public void shouldChangeUserPermission() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
    }

    @Test
    public void shouldCreateUserWithPermissionAdministrative() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails("5");
    }

    @Test
    public void shouldCreateUserWithPermissionTransactional() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails("6");
    }

    @Test
    public void shouldCreateUserWithPermissionWallets() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails("7");
    }

    @Test
    public void shouldCreateUserWithPermissionChain() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails("8");
    }

    @Ignore
    @Test
    public void shouldDeleteUser() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
        navigateToPage5();
        clickDeleteUser("102");
    }

    @Test
    public void shouldNotDeleteUser() throws IOException, InterruptedException{
        navigateToAddUser();
        navigateToUserSearch();
    }
}
