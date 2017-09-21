package com.setl.openCSDClarityTests.UI.Navigation;

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
import static org.junit.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDTabNavigationAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDTabNavigationAcceptanceTest.class);

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
    public void shouldNavigateToHomeTabRandomStuff() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        Thread.sleep(500);
        driver.findElement(By.id("clr-tab-link-1")).click();
    }
    @Test
    public void shouldNavigateToHomeTabForm() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        Thread.sleep(500);
        driver.findElement(By.id("clr-tab-link-2")).click();
    }
    @Test
    public void shouldNavigateToUserAdminTabAddUser() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/users");
        Thread.sleep(500);
        driver.findElement(By.id("user-tab-1")).click();
    }
    @Test
    public void shouldNavigateToUserAdminTabAddWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/wallets");
        Thread.sleep(500);
        driver.findElement(By.id("wallet-new-form-tab")).click();
    }
    @Test
    public void shouldNavigateToUserAdminTabAddPermissions() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/permissions");
        Thread.sleep(500);
        driver.findElement(By.id("testlink1")).click();
    }
    @Test
    public void shouldNavigateToChainAdminTabMember() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/manage-member");
        Thread.sleep(500);
        driver.findElement(By.id("link1")).click();
    }
    @Test
    public void shouldNavigateToChainAdminTabAccount() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/manage-account");
        Thread.sleep(500);
        driver.findElement(By.id("link1")).click();
    }

}