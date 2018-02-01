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
    //@Ignore("TG #135 : Awaiting code completion")
    public void shouldNotDisplayTitleInTextField() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        //Manually check title is not displayed inside text field
    }

    @Test
    //@Ignore("TG #136 : Awaiting code completion")
    public void shouldHaveAsteriskDisplayedNextToTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        //Manually check asterisks are displayed next to title
    }

    @Test
    //("TG #137")
    public void shouldDisplayPopupWhenPageIsRefreshed() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        driver.navigate().refresh();
        checkAlert();
    }

    @Test
    //("TG138")
    public void shouldDisplayNavigationMenuOnLogin() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        assertTrue(driver.findElement(By.id("menu-account-module")).isDisplayed());
    }

    @Test
    @Ignore("TG #140 : Awaiting code completion")
    public void shouldTakeUserToFirstTabWhenNavItemSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/manage-member");
        navigateToAddNewMemberTab();
        try {
            navigateToPage("chain-admin/manage-member");
        }catch (Error e){
            System.out.println("Could not navigate back to manage member");
            fail();
        }
        WebElement tab = driver.findElement(By.id("link0"));
        assertTrue(elementHasClass(tab, "active"));
    }

    @Test
    //@Ignore("TG #141 : Awaiting code completion")
    public void shouldCheckWorkflowMessagesIsNotPresent() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("messages");
        assertButtonIsNotPresent("messagesworkflow");
    }

    @Test
    //@Ignore("TG #147 : Awaiting code completion")
    public void shouldChangeFundShareTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToPage("asset-manager-dashboard");
        WebElement FundTitle = driver.findElement(By.id("fund-share-label"));
        assertTrue(FundTitle.getText().equals("Please select a fund share in this list"));
    }

    @Test
    //@Ignore("TG #143 : Awaiting code completion")
    public void shouldRoundAllQuantitiesUnder5DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minsubscriptionUnits_0_0", "1.2", "1.20000");
    }

    public static void fundCheckRoundingUp(String enteringField, String value, String expected){
        driver.findElement(By.id(enteringField)).clear();
        driver.findElement(By.id(enteringField)).sendKeys(value);
        driver.findElement(By.id("fundName_0")).sendKeys("");
        String unitsField = driver.findElement(By.id(enteringField)).getAttribute("value");
        assertTrue(unitsField.equals(expected));
    }

    @Test
    //@Ignore("TG #143 : Awaiting code completion")
    public void shouldRoundAllQuantitiesOver5DecimalPlacesTo5DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minsubscriptionUnits_0_0", "1.255555", "1.25556");
    }

    @Test
    //@Ignore("TG #144 : Awaiting code completion")
    public void shouldRoundAllAmountsUnder4DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1.2", "1.2000");
    }

    @Test
    //@Ignore("TG #144 : Awaiting code completion")
    public void shouldRoundAllAmountsOver4DecimalPlacesTo4DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1.25555", "1.2556");
    }

    @Test
    //@Ignore("TG #145 : Awaiting code completion")
    public void shouldRoundAllNAVUnder2DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("fundInitialEstimatedNav_0_0", "1.2", "1.20");
    }

    @Test
    //@Ignore("TG #145 : Awaiting code completion")
    public void shouldRoundAllNAVOver2DecimalPlacesTo2DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("fundInitialEstimatedNav_0_0", "1.255", "1.25");
    }

    @Test
    //@Ignore("TG #146 : Awaiting code completion")
    public void shouldSeperateThousandsWithSpaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1000000", "1 000 000.0000");
    }
    @Test
    //@Ignore("TG #146 : Awaiting code completion")
    public void shouldSeperateDecimalPlacesWithPoint() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("btnAddNewFund");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "2000000", "2 000 000.0000");
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
