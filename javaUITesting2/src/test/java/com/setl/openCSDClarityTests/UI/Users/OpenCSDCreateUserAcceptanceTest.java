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
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.SetUp.username;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.*;
import static junit.framework.TestCase.assertTrue;
import static org.bouncycastle.asn1.x500.style.RFC4519Style.description;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDCreateUserAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDCreateUserAcceptanceTest.class);

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = Timeout.seconds(300);
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
    public void shouldCreateUserAPI() throws IOException, InterruptedException, ExecutionException {

        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

        Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
        User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);

            connection.disconnect();

        navigateToAddUser();
        navigateToUserSearch();
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/div/clr-datagrid/div/div/div/cltr-dg-footer/clr-dg-pagination/ul/li[4]/button")).click();

        String userAmount1 = driver.findElement(By.className("datagrid-foot-description")).getText();
        String userAmount = userAmount1.substring(userAmount1.length() - 3);
        String usernameID = "username-" + userAmount;
        assertTrue(driver.findElement(By.id(usernameID)).isDisplayed());
    }
    @Test
    public void shouldNotCreateDuplicateUserAPI() throws IOException, InterruptedException, ExecutionException {
        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];

        Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
        User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);

            connection.disconnect();

        navigateToAddUser();
        enterManageUserUsername(userDetails[0]);
        enterManageUserEmail(userDetails[2]);
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword(userDetails[1]);
        enterManageUserPasswordRepeat(userDetails[1]);
        clickManageUserSubmit();

        String userAmount1 = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(userAmount1.contains("Error!"));
    }

    @Test
    public void shouldCreateUser() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails();
        clickManageUserSubmit();
    }
    @Test
    public void shouldCreateRandomUser() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails();
        clickManageUserSubmit();
    }
    @Test
    public void shouldNotCreateDuplicateUser() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails();
        clickManageUserSubmit();
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
    }
    @Test
    public void shouldEditUserWhenEditButtonIsClicked() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
        navigateToEditUsers();
        closeUserDetails();
    }
    @Test
    public void shouldEditEmail() throws IOException, InterruptedException {
        navigateToAddUser();
        navigateToUserSearch();
        navigateToEditUsers();
        editUserEmail("test@setl.io");
        saveUserDetails();
    }
    @Test
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
        enterAllUserDetails();
    }
    @Test
    public void shouldCreateUserWithPermissionTransactional() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails();
    }
    @Test
    public void shouldCreateUserWithPermissionWallets() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails();
    }
    @Test
    public void shouldCreateUserWithPermissionChain() throws IOException, InterruptedException {
        navigateToAddUser();
        enterAllUserDetails();
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
