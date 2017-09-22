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
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.navigateToAddUser;

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

    public static void enterManageUserUsername(String username){
      driver.findElement(By.id("new-user-username")).sendKeys(username);
    }
    public static void enterManageUserEmail(String email){
      driver.findElement(By.id("new-user-email")).sendKeys(email);
    }
    public static void selectManageUserAccountDropdown(){
      driver.findElement(By.id("new-user-account-select")).click();
      driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/ul/li[1]")).click();
    }
    public static void selectManageUserUserDropdown(){
      driver.findElement(By.id("new-user-usertype-select")).click();
      driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/ul/li[1]")).click();
    }
    public static void enterManageUserPassword(String password){
      driver.findElement(By.id("new-user-password")).sendKeys(password);
    }
    public static void enterManageUserPasswordRepeat(String password){
      driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
    }
    public static void clickManageUserSubmit(){
      driver.findElement(By.id("new-user-submit")).click();
    }

    @Test
    public void shouldCreateUser() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser5");
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
    }
    @Test
    public void shouldCreateRandomUser() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser5");
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
        clickManageUserSubmit();
    }
    @Test
    public void shouldNotCreateDuplicateUser() throws IOException, InterruptedException {
        navigateToAddUser();
        enterManageUserUsername("TestUser5");
        enterManageUserEmail("TestEmail@gmail.com");
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        enterManageUserPassword("Testpass123");
        enterManageUserPasswordRepeat("Testpass123");
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
      enterManageUserUsername("TestUser5");
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
      driver.findElement(By.id("user-tab-0")).click();
      driver.findElement(By.id("edit-1")).click();
      driver.findElement(By.id("user-tab-2")).isDisplayed();
      driver.findElement(By.xpath("//*[@id=\"edit-user2-form\"]/div/div[5]/div/button[2]")).click();
    }
    @Test
    public void shouldEditEmail() throws IOException, InterruptedException {
      navigateToAddUser();
      driver.findElement(By.id("user-tab-0")).click();
      driver.findElement(By.id("edit-1")).click();
      driver.findElement(By.id("user-tab-2")).isDisplayed();
      driver.findElement(By.id("edit-user2-email")).clear();
      driver.findElement(By.id("edit-user2-email")).sendKeys("test@test.com");
      driver.findElement(By.xpath("//*[@id=\"edit-user2-form\"]/div/div[5]/div/button[1]")).click();
    }
    @Test
    public void shouldResetEmail() throws IOException, InterruptedException {
      navigateToAddUser();
      driver.findElement(By.id("user-tab-0")).click();
      driver.findElement(By.id("edit-1")).click();
      driver.findElement(By.id("user-tab-2")).isDisplayed();
      driver.findElement(By.id("edit-user2-email")).clear();
      driver.findElement(By.id("edit-user2-email")).sendKeys("anthony.culligan@setl.io");
      driver.findElement(By.xpath("//*[@id=\"edit-user2-form\"]/div/div[5]/div/button[1]")).click();
    }

    @Test
    public void shouldDeleteUser() throws IOException, InterruptedException {
      navigateToAddUser();
      driver.findElement(By.id("user-tab-0")).click();
      navigateToPage5();
      Thread.sleep(5000);
      driver.findElement(By.id("delete-102")).click();
    }

    public static void navigateToPage5(){
      driver.findElement(By.className("pagination-next")).click();
      driver.findElement(By.className("pagination-next")).click();
      driver.findElement(By.className("pagination-next")).click();
      driver.findElement(By.className("pagination-next")).click();
    }
}
