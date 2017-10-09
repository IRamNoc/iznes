package com.setl.openCSDClarityTests.UI.Users;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
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

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.*;

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

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
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
