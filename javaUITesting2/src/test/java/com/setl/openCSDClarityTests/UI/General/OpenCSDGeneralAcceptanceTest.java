package com.setl.openCSDClarityTests.UI.General;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.xml.bind.SchemaOutputResolver;
import java.io.IOException;

import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.navigateToAddNewMemberTab;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.*;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDGeneralAcceptanceTest {

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
    }

    @Test
    @Ignore("TG #141 : Awaiting code completion")
    public void shouldAutosaveInformation() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("DisplayName");myAccountSendKeys("DisplayName", "autosave-check");
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/manage-member");
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        assertTrue("DisplayName".equals("autosave-check"));
    }

    @Test
    public void shouldNotDisplayTitleInTextField() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        //Manually check title is not displayed inside text field
    }

    @Test
    public void shouldHaveAsteriskDisplayedNextToTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        //Manually check asterisks are displayed next to title
    }

    @Test
    public void shouldDisplayPopupWhenPageIsRefreshed() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        driver.navigate().refresh();
        checkAlert();
    }

    @Test
    public void shouldDisplayNavigationMenuOnLogin() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        assertTrue(driver.findElement(By.id("menu-account-module")).isDisplayed());
    }

    @Test
    public void shouldTakeUserToFirstTabWhenNavItemSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        navigateToAddNewMemberTab();
        try {
            navigateToPageByID("menu-user-admin-users");
        }catch (Error e){
            System.out.println("Could not navigate back to manage member");
            fail();
        }
        WebElement tab = driver.findElement(By.id("user-tab-0"));
        assertTrue(elementHasClass(tab, "active"));
    }

    @Test
    public void shouldCheckWorkflowMessagesIsNotPresent() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("messages");
        assertButtonIsNotPresent("messagesworkflow");
    }

    @Test
    public void shouldChangeFundShareTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToPage("asset-manager-dashboard");
        WebElement FundTitle = driver.findElement(By.id("fund-share-label"));
        assertTrue(FundTitle.getText().equals("Please select a fund share in this list"));
    }

    @Test
    public void shouldRoundAllQuantitiesUnder5DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minsubscriptionUnits_0_0", "1.2", "1.20000");
    }

    @Test
    public void shouldRoundAllQuantitiesOver5DecimalPlacesTo5DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minsubscriptionUnits_0_0", "1.255555", "1.25556");
    }

    @Test
    public void shouldRoundAllAmountsUnder4DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1.2", "1.2000");
    }

    @Test
    public void shouldRoundAllAmountsOver4DecimalPlacesTo4DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1.25555", "1.2556");
    }

    @Test
    public void shouldRoundAllNAVUnder2DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("fundInitialEstimatedNav_0_0", "1.2", "1.20");
    }

    @Test
    public void shouldRoundAllNAVOver2DecimalPlacesTo2DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("fundInitialEstimatedNav_0_0", "1.255", "1.25");
    }

    @Test
    public void shouldSeperateThousandsWithSpaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1000000", "1 000 000.0000");
    }
    @Test
    public void shouldSeperateDecimalPlacesWithPoint() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "2000000", "2 000 000.0000");
    }

    @Test
    public void shouldHaveIZNESlogoOnLoginPage() throws IOException, InterruptedException {
        navigateToLoginPage();
        try {
            driver.findElement(By.id("logo-iznes")).isDisplayed();
        }catch (Error e){
            fail("logo was not present");
        }
    }

    @Test
    public void shouldHaveIZNESinSubHeadingOnLoginPage() throws IOException, InterruptedException {
        navigateToLoginPage();
        try {
            String subHeadingText = driver.findElement(By.className("login-subheading")).getText();
            assertTrue(subHeadingText.equals("Log in to IZNES"));
        }catch (Error e){
            fail("IZNES was not present in sub-heading");
        }
    }

    @Test
    @Ignore("test needs to be cleaned and have an assertion")
    public void shouldSendMessageToWallet() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToPageByID("menu-messages");
        driver.findElement(By.id("messagescompose")).click();
        driver.findElement(By.id("messagesRecipients")).click();
        driver.findElement(By.xpath("//*[@id=\"messagesRecipients\"]/div/div[2]/div/input")).sendKeys("Investor");
        driver.findElement(By.xpath("//*[@id=\"messagesRecipients\"]/div/div[2]/ul/li/div/a")).click();
        driver.findElement(By.id("messagesSubject")).sendKeys("Messages Subject");
        driver.findElement(By.xpath("//*[@id=\"messagesBody\"]/div[2]/div[1]")).click();
        driver.findElement(By.xpath("//*[@id=\"messagesBody\"]/div[2]/div[1]")).sendKeys("AMWallet");
        driver.findElement(By.id("messagesSendMessage")).click();
        Thread.sleep(2000);
    }

    public static void fundCheckRoundingUp(String enteringField, String value, String expected){
        driver.findElement(By.id(enteringField)).clear();
        driver.findElement(By.id(enteringField)).sendKeys(value);
        driver.findElement(By.id("fundName_0")).sendKeys("");
        String unitsField = driver.findElement(By.id(enteringField)).getAttribute("value");
        assertTrue(unitsField.equals(expected));
    }

    public static void assertFalseIdDisplayed(String element, String value){
        WebElement displayedElement = driver.findElement(By.id(value));
        assertFalse(displayedElement.isDisplayed());
    }

    public static void assertButtonIsNotPresent(String text) {
        try {
            driver.findElement(By.id(text));
            fail("Button with ID <" + text + "> is present");
        } catch (NoSuchElementException ex) {
            /* do nothing, button is not present, assert is passed */
        }
    }

    public void checkAlert() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, 2);
            wait.until(ExpectedConditions.alertIsPresent());
            Alert alert = driver.switchTo().alert();
            alert.accept();
        } catch (Exception e) {
            fail("Alert not present");
        }
    }

    public void clickID(String id) {
        try {
            driver.findElement(By.id(id)).click();
        } catch (Exception e) {
            fail(id + "not present");
        }
    }

    public boolean elementHasClass(WebElement element, String active) {
        return element.getAttribute("class").contains(active);
    }

}
