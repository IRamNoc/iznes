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
import static com.setl.UI.common.SETLUIHelpers.WalletDetailsHelper.navigateToAddWallet;
import static com.setl.UI.common.SETLUIHelpers.WalletDetailsHelper.verifyPopupMessageText;
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
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-wallets");

    }

    public static void enterWalletName(String walletname) throws IOException, InterruptedException {
        driver.findElement(By.id("new-wallet-name")).clear();
        driver.findElement(By.id("new-wallet-name")).sendKeys(walletname);
    }
    public static void clickWalletSubmit() throws IOException, InterruptedException {
        driver.findElement(By.id("new-wallet-submit")).click();
    }
    public static void selectAccountType() throws IOException, InterruptedException {
        driver.findElement(By.id("new-wallet-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-account-select\"]/div/div[3]/ul/li[1]")).click();
    }
    public static void selectWalletType() throws IOException, InterruptedException {
        driver.findElement(By.id("new-wallet-usertype-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-wallet-usertype-select\"]/div/div[3]/ul/li[1]")).click();
    }
    public static void toggleLockWallet() throws IOException, InterruptedException {
        driver.findElement(By.className("toggle-switch")).click();
    }

    @Test
    public void shouldNotCreateWalletWithoutAccountAndWalletType() throws IOException, InterruptedException {
        navigateToAddWallet();
        enterWalletName("Testing_Wallet");
        clickWalletSubmit();
        verifyPopupMessageText("Error", "");
    }

    @Test
    public void shouldNotCreateWalletWithoutWalletType() throws IOException, InterruptedException {
        navigateToAddWallet();
        enterWalletName("Testing_Wallet");
        selectAccountType();
        clickWalletSubmit();
        verifyPopupMessageText("Error", "");
    }

    @Test
    public void shouldCreateWallet() throws IOException, InterruptedException {
        navigateToAddWallet();
        Random rand = new Random();
        int guess = rand.nextInt(998) + 1;
        selectAccountType();
        enterWalletName("Testing_Wallet" + guess);
        selectWalletType();
        clickWalletSubmit();
        verifyPopupMessageText("Success", "");
    }
    @Ignore
    @Test
    public void shouldNotCreateDuplicateWallet() throws IOException, InterruptedException {
        navigateToAddWallet();
        enterWalletName("Testing_Wallet_dup");
        selectAccountType();
        selectWalletType();
        clickWalletSubmit();
        verifyPopupMessageText("Success", "");
        enterWalletName("Testing_Wallet_dup");
        selectAccountType();
        selectWalletType();
        clickWalletSubmit();
        verifyPopupMessageText("Error", "");
    }

    @Ignore
    @Test
    public void shouldResetWallet() throws IOException, InterruptedException {
        navigateToAddWallet();
        enterWalletName("Payment_Bank1");
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
        navigateToAddWallet();
        selectAccountType();
        clickWalletSubmit();
    }
    @Ignore
    @Test
    public void shouldResetWalletAccount() throws IOException, InterruptedException {
        navigateToAddWallet();
        selectWalletType();
        clickWalletSubmit();
    }
    @Ignore
    @Test
    public void shouldEditWalletStatus() throws IOException, InterruptedException {
        navigateToAddWallet();
        toggleLockWallet();
        clickWalletSubmit();
    }
    @Ignore
    @Test
    public void shouldResetWalletStatus() throws IOException, InterruptedException {
        navigateToAddWallet();
        toggleLockWallet();
        clickWalletSubmit();
    }
    @Ignore
    @Test
    public void shouldEditWalletType() throws IOException, InterruptedException {
      driver.findElement(By.id("edit-4")).click();

    }
}
