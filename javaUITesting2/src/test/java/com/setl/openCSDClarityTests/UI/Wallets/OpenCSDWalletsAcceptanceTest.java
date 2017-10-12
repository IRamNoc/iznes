package com.setl.openCSDClarityTests.UI.Wallets;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.util.Random;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.*;
import static junit.framework.TestCase.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

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

  public static void verifyPopupMessageText(String alertText, String failText) throws InterruptedException {
    try {
      WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
      wait.until(visibilityOfElementLocated(By.className("jaspero__dialog")));
      wait.until(elementToBeClickable(driver.findElement(By.cssSelector("default ng-tns-c16-3"))));
    }catch (TimeoutException t) {
      System.out.println(failText + "Timed Out  " + t.getMessage());
    }catch (NoSuchElementException n) {
      System.out.println(failText + "Popup not present  " + n.getMessage());
    }catch (ElementNotVisibleException v) {
      System.out.println(failText + "Popup not visible  " + v.getMessage());
    }catch (ElementNotSelectableException s) {
      System.out.println(failText + "Confirm button not ready  " + s.getMessage());
    }
    try {
      WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
      wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
      if (!(driver.findElement(By.className("jaspero__dialog-title")).getText().contains(alertText))) {
        Assert.fail("Actual message was : " + (driver.findElement(By.cssSelector(SweetAlert)).getText() + " " + (driver.findElement(By.cssSelector((SweetAlertHeader))).getText())));
      }
    }catch (Exception e)
    {
      System.out.println("No Text present " + e.getMessage());
      fail();
    }
    driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
  }

    @Test
    public void shouldNotCreateWalletWithoutAccountAndWalletType() throws IOException, InterruptedException {
        driver.findElement(By.id("wallet-tab-1")).click();
        try {
          driver.findElement(By.id("manage-wallets")).isDisplayed();
        }catch (Error e){
          System.out.println("wallet-tab-2 not present");
          fail();
        }
        driver.findElement(By.id("new-wallet-name")).sendKeys("Testing_Wallet1");
        driver.findElement(By.id("new-wallet-submit")).click();
        verifyPopupMessageText("Error", "");
    }

    @Test
    public void shouldNotCreateWalletWithoutWalletType() throws IOException, InterruptedException {
        driver.findElement(By.id("wallet-tab-1")).click();
        try {
          driver.findElement(By.id("manage-wallets")).isDisplayed();
        }catch (Error e){
          System.out.println("wallet-tab-2 not present");
          fail();
        }
        driver.findElement(By.id("new-wallet-name")).sendKeys("Testing_Wallet");
        driver.findElement(By.id("new-wallet-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[1]")).click();
        driver.findElement(By.id("new-wallet-submit")).click();
        verifyPopupMessageText("Error", "");
    }

    @Test
    public void shouldCreateWallet() throws IOException, InterruptedException {
        driver.findElement(By.id("wallet-tab-1")).click();
        try {
          driver.findElement(By.id("manage-wallets")).isDisplayed();
        }catch (Error e){
          System.out.println("wallet-tab-2 not present");
          fail();
        }
      Random rand = new Random();
      int guess = rand.nextInt(998) + 1;
        driver.findElement(By.id("new-wallet-name")).sendKeys("Testing_Wallet" + guess);
        driver.findElement(By.id("new-wallet-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[1]")).click();
        driver.findElement(By.id("new-wallet-usertype-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-usertype-select\"]/div/ul/li[3]")).click();
        driver.findElement(By.id("new-wallet-submit")).click();
        verifyPopupMessageText("Success", "");
    }
    @Ignore
    @Test
    public void shouldNotCreateDuplicateWallet() throws IOException, InterruptedException {
        driver.findElement(By.id("wallet-tab-1")).click();
        try {
          driver.findElement(By.id("manage-wallets")).isDisplayed();
        }catch (Error e){
          System.out.println("wallet-tab-2 not present");
          fail();
        }
        driver.findElement(By.id("new-wallet-name")).sendKeys("Testing_Wallet12345");
        driver.findElement(By.id("new-wallet-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[1]")).click();
        driver.findElement(By.id("new-wallet-usertype-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-usertype-select\"]/div/ul/li[3]")).click();
        driver.findElement(By.id("new-wallet-submit")).click();
        verifyPopupMessageText("Success", "");
        driver.findElement(By.id("new-wallet-name")).sendKeys("Testing_Wallet12345");
        driver.findElement(By.id("new-wallet-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[1]")).click();
        driver.findElement(By.id("new-wallet-usertype-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-usertype-select\"]/div/ul/li[3]")).click();
        driver.findElement(By.id("new-wallet-submit")).click();
        verifyPopupMessageText("Error", "");
    }

  @Ignore
    @Test
    public void shouldResetWallet() throws IOException, InterruptedException {
      driver.findElement(By.id("edit-4")).click();
      try {
        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
      }catch (Error e){
        System.out.println("wallet-tab-2 not present");
        fail();
      }
      driver.findElement(By.id("new-wallet-name")).clear();
      driver.findElement(By.id("new-wallet-name")).sendKeys("Payment_Bank1");
      driver.findElement(By.id("new-wallet-submit")).click();
      try {
        driver.findElement(By.className("new-wallet-name")).click();
      } catch (Error e){
        System.out.println("hello Jordan");
        fail();
      }
    }
  @Ignore
    @Test
    public void shouldEditWalletAccount() throws IOException, InterruptedException {
        driver.findElement(By.id("edit-4")).click();
      try {
        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
      }catch (Error e){
        System.out.println("wallet-tab-2 not present");
        fail();
      }
        driver.findElement(By.id("new-wallet-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[1]")).click();
      driver.findElement(By.id("new-wallet-submit")).click();
    }
  @Ignore
    @Test
    public void shouldResetWalletAccount() throws IOException, InterruptedException {
        driver.findElement(By.id("edit-4")).click();
      try {
        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
      }catch (Error e){
        System.out.println("wallet-tab-2 not present");
        fail();
      }
      driver.findElement(By.id("new-wallet-account-select")).click();
      driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/ul/li[3]")).click();
      driver.findElement(By.id("new-wallet-submit")).click();
    }
  @Ignore
    @Test
    public void shouldEditWalletStatus() throws IOException, InterruptedException {
        driver.findElement(By.id("edit-4")).click();
      try {
        driver.findElement(By.id("wallet-tab-2")).isDisplayed();
      }catch (Error e){
        System.out.println("wallet-tab-2 not present");
        fail();
      }
      driver.findElement(By.className("toggle-switch")).click();
      driver.findElement(By.id("new-wallet-submit")).click();
      Thread.sleep(500);
    }
  @Ignore
  @Test
  public void shouldResetWalletStatus() throws IOException, InterruptedException {
    driver.findElement(By.id("edit-4")).click();
    try {
      driver.findElement(By.id("wallet-tab-2")).isDisplayed();
    }catch (Error e){
      System.out.println("wallet-tab-2 not present");
      fail();
    }
    driver.findElement(By.className("toggle-switch")).click();
    driver.findElement(By.id("new-wallet-submit")).click();
  }
  @Ignore
    @Test
    public void shouldEditWalletType() throws IOException, InterruptedException {
        driver.findElement(By.id("edit-4")).click();

    }
    @Test
    public void shouldDeleteWallet() throws IOException, InterruptedException {
    }
    @Test
    public void shouldNavigateToNextPageWalletSearch() throws IOException, InterruptedException {
    }
    @Test
    public void shouldAddWallet() throws IOException, InterruptedException {
    }
    @Test
    public void shouldNotAddWalletWithoutWalletName() throws IOException, InterruptedException {
    }
    @Test
    public void shouldNotAddWalletWithoutAccountSelected() throws IOException, InterruptedException {
    }
    @Test
    public void shouldNotAddWalletWithoutWalletTypeSelected() throws IOException, InterruptedException {
    }
}
