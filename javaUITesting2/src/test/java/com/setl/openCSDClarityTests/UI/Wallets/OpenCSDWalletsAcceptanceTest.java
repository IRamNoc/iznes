package com.setl.openCSDClarityTests.UI.Wallets;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.*;
import static junit.framework.TestCase.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDWalletsAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDWalletsAcceptanceTest.class);

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
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/wallets");
    }

    @Test
  public void shouldNavigateToWallets() throws IOException, InterruptedException {

    }
//    @Test
//    public void shouldEditWalletName() throws IOException, InterruptedException {
//        driver.findElement(By.id("edit-4")).click();
//        try {
//          driver.findElement(By.id("wallet-tab-2")).isDisplayed();
//        }catch (Error e){
//          System.out.println("wallet-tab-2 not present");
//          fail();
//        }
//        driver.findElement(By.id("new-wallet-name")).clear();
//        driver.findElement(By.id("new-wallet-name")).sendKeys("Testing_Wallet1");
//        driver.findElement(By.id("new-wallet-submit")).click();
//    }
//    @Test
//    public void shouldResetWallet() throws IOException, InterruptedException {
//      driver.findElement(By.id("edit-4")).click();
//      try {
//        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
//      }catch (Error e){
//        System.out.println("wallet-tab-2 not present");
//        fail();
//      }
//      driver.findElement(By.id("new-wallet-name")).clear();
//      driver.findElement(By.id("new-wallet-name")).sendKeys("Payment_Bank1");
//      driver.findElement(By.id("new-wallet-submit")).click();
//      try {
//        driver.findElement(By.className("new-wallet-name")).click();
//      } catch (Error e){
//        System.out.println("hello Jordan");
//        fail();
//      }
//    }
//    @Test
//    public void shouldEditWalletAccount() throws IOException, InterruptedException {
//        driver.findElement(By.id("edit-4")).click();
//      try {
//        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
//      }catch (Error e){
//        System.out.println("wallet-tab-2 not present");
//        fail();
//      }
//        driver.findElement(By.id("new-wallet-account-select")).click();
//        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[1]")).click();
//      driver.findElement(By.id("new-wallet-submit")).click();
//    }
//    @Test
//    public void shouldResetWalletAccount() throws IOException, InterruptedException {
//        driver.findElement(By.id("edit-4")).click();
//      try {
//        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
//      }catch (Error e){
//        System.out.println("wallet-tab-2 not present");
//        fail();
//      }
//      driver.findElement(By.id("new-wallet-account-select")).click();
//      driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[3]")).click();
//      driver.findElement(By.id("new-wallet-submit")).click();
//    }
//    @Test
//    public void shouldEditWalletStatus() throws IOException, InterruptedException {
//        driver.findElement(By.id("edit-4")).click();
//      try {
//        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
//      }catch (Error e){
//        System.out.println("wallet-tab-2 not present");
//        fail();
//      }
//      driver.findElement(By.className("toggle-switch")).click();
//      driver.findElement(By.id("new-wallet-submit")).click();
//      Thread.sleep(500);
//    }
//  @Test
//  public void shouldResetWalletStatus() throws IOException, InterruptedException {
//    driver.findElement(By.id("edit-4")).click();
//    try {
//      driver.findElement(By.id("wallet-tab-2")).isDisplayed();
//    }catch (Error e){
//      System.out.println("wallet-tab-2 not present");
//      fail();
//    }
//    driver.findElement(By.className("toggle-switch")).click();
//    driver.findElement(By.id("new-wallet-submit")).click();
//  }
//    @Test
//    public void shouldEditWalletType() throws IOException, InterruptedException {
//        driver.findElement(By.id("edit-4")).click();
//
//    }
//    @Test
//    public void shouldDeleteWallet() throws IOException, InterruptedException {
//    }
//    @Test
//    public void shouldNavigateToNextPageWalletSearch() throws IOException, InterruptedException {
//    }
//    @Test
//    public void shouldAddWallet() throws IOException, InterruptedException {
//    }
//    @Test
//    public void shouldNotAddWalletWithoutWalletName() throws IOException, InterruptedException {
//    }
//    @Test
//    public void shouldNotAddWalletWithoutAccountSelected() throws IOException, InterruptedException {
//    }
//    @Test
//    public void shouldNotAddWalletWithoutWalletTypeSelected() throws IOException, InterruptedException {
//    }
}
