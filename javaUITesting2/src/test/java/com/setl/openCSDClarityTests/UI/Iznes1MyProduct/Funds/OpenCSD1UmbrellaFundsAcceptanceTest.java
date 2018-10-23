package com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds;

import com.setl.UI.common.SETLUtils.Repeat;
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
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static SETLAPIHelpers.DatabaseHelper.validateDatabaseUmbrellaFundExists;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.navigateToAddNewMemberTab;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSD1UmbrellaFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(400000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBTwoFAOff();
    }

    @Test
    public void shouldCreateUmbrellaFund() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        selectAddUmbrellaFund();

        String[] uFundDetails = generateRandomUmbrellaFundsDetails();

        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);

        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }
        submitUmbrellaFund();

        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(uFundDetails[0]);

        getUmbrellaTableRow(0, uFundDetails[0], lei, "Management Company", "Jordan");
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
    }

    @Test
    public void shouldUpdateUmbrellaFund() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String umbFundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[1]/div[1]/a/h2")).getText();
        int umbFundCount = Integer.parseInt(umbFundCountXpath.replaceAll("[\\D]", ""));

        selectAddUmbrellaFund();
        String[] umbFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();

        fillUmbrellaDetailsNotCountry(umbFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Afghanistan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Afghanistan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        submitUmbrellaFund();

        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(umbFundDetails[0]);

        getUmbrellaTableRow(0, umbFundDetails[0], lei, "Management Company", "Afghanistan");
        validateDatabaseUmbrellaFundExists(1, umbFundDetails[0]);

        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-0")).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/div/h1")));
        String[] updateChars = generateRandomDetails();
        String newLEI = generateRandomLEI();

        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(updateChars);
        driver.findElement(By.id("uf_lei")).clear();
        driver.findElement(By.id("uf_lei")).sendKeys(newLEI);
        driver.findElement(By.id("uf_registerOffice")).sendKeys(updateChars);
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys(updateChars);
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).clear();
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2020-10-20");
        selectTopDropdown("uf_managementCompany");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_fundAdministrator");
        searchAndSelectTopDropdownXpath("uf_domicile", "Albania");
        scrollElementIntoViewById("mcBtnSubmitForm");
        wait.until(visibilityOfElementLocated(By.id("mcBtnSubmitForm")));
        wait.until(elementToBeClickable(driver.findElement(By.id("mcBtnSubmitForm"))));
        driver.findElement(By.id("mcBtnSubmitForm")).click();
        wait.until(visibilityOfElementLocated(By.id("am-product-home")));

        searchUmbrellaTable(umbFundDetails[0]);
        getUmbrellaTableRow(0, umbFundDetails[0] + updateChars[0], newLEI, "Management Company", "Albania");
        validateDatabaseUmbrellaFundExists(1, umbFundDetails[0] + updateChars[0]);
        validateDatabaseUmbrellaFundExists(0, umbFundDetails[0]);

    }

    @Test
    public void shouldNavigateToSharesFundsUmbrellaFunds() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String pageHeading = driver.findElement(By.id("am-product-home")).getText();
        assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
    }

    @Test
    public void shouldDisplaySameTitleIconAsNavIcon() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String headingIcon = driver.findElement(By.xpath("//*[@id=\"am-product-home\"]/i")).getAttribute("class");
        String navIcon = driver.findElement(By.xpath("//*[@id=\"menu-product-home\"]/i")).getAttribute("class");
        assertTrue(headingIcon.equals(navIcon));
    }

    @Test
    public void shouldSeeCorrectFieldsOnSharesFundsUmbrellaFundsPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        validatePageLayout();
    }

    @Test
    public void shouldSeeCorrectHeadingsForUmbrellaFunds() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        validateUmbrellaFundsDataGridHeadings(umbrellaFundsHeadings);
    }

    @Test
    @Ignore("need to ensure that we have the correct Umbrella fund details")
    public void shouldCreateAnUmbrellaFundAndCheckDataBase() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();

        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
        try {
            String umbFundName = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-umbrellaFundName\"]/span")).getText();
            String umbFundLEI = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-legalEntityIdentifier\"]/span")).getText();
            String umbFundManagement = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-managementCompany\"]/span")).getText();
            String umbFundCountry = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-domicile\"]/span")).getText();
            System.out.println(umbFundName + ", " + umbFundLEI + ", " + umbFundManagement + ", " + umbFundCountry);
            System.out.println(uFundDetails[0]);
            assertTrue(umbFundName.equals(uFundDetails[0]));
            assertTrue(umbFundLEI.equals(lei));
            assertTrue(umbFundManagement.equals("Management Company"));
            assertTrue(umbFundCountry.equals("Jordan"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldShowTransferAgentIfFranceIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], generateRandomLEI());
        searchAndSelectTopDropdownXpath("uf_domicile", "France");
        assertTrue(driver.findElement(By.id("uf_centralizingAgent")).isDisplayed());
    }

    @Test
    public void shouldShowTransferAgentIfLuxembourgIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], generateRandomLEI());
        searchAndSelectTopDropdownXpath("uf_domicile", "Luxembourg");
        assertTrue(driver.findElement(By.id("uf_transferAgent")).isDisplayed());
    }

    @Test
    public void shouldShowTransferAgentIfIrelandIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], generateRandomLEI());
        searchAndSelectTopDropdownXpath("uf_domicile", "Ireland");
        assertTrue(driver.findElement(By.id("uf_transferAgent")).isDisplayed());
    }

    @Test
    public void shouldIncreaseTitleNumberWhenUmbrellaFundIsCreated() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String preCreationNo = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int i = Integer.parseInt(preCreationNo.replaceAll("[\\D]", ""));
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")));

            String postCreationNo = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
            assertNotEquals(postCreationNo, preCreationNo + 1);
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void shouldUpdateUmbrellaFunds() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")));
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")).getText();
        try {
            driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-umbrellaFundName\"]/span")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }
        assertTrue(driver.findElement(By.id("uf_umbrellaFundName")).isDisplayed());
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys("Updated");
        driver.findElement(By.id("mcBtnSubmitForm")).click();
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            assertTrue(popup.contains("has been successfully updated!"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
        try {
            String umFundName = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")).getText();
            assertTrue(umFundName.equals(umbFundNamePrev + "Updated"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldDisplaySaveDraftEnable() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        driver.findElement(By.id("mcBtnSubmitFormDraft")).getAttribute("enabled");
    }

    @Test
    public void shouldDisplaySaveDraftDisable() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        driver.findElement(By.id("mcBtnSubmitFormDraft")).getAttribute("disabled");
    }

    @Test
    public void shouldsaveDraft() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        driver.findElement(By.id("mcBtnSubmitFormDraft")).getAttribute("enabled");
        driver.findElement(By.id("mcBtnSubmitFormDraft")).click();
        scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[1]/div[1]/a/h2");
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"toast-container\"]/div/div/div[1]")));
        driver.findElement(By.cssSelector("#iznes > app-root > app-basic-layout > div > ng-sidebar-container > div > div > div > main > div.router-container > div > app-ofi-am-product-home > div:nth-child(6) > div.row.panel-body > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-head.ng-star-inserted > div > clr-dg-column:nth-child(2) > div > clr-dg-string-filter > clr-dg-filter > button")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(uFundDetails);
        driver.findElement(By.cssSelector("#iznes > app-root > app-basic-layout > div > ng-sidebar-container > div > div > div > main > div.router-container > div > app-ofi-am-product-home > div:nth-child(6) > div.row.panel-body > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-head.ng-star-inserted > div > clr-dg-column:nth-child(2) > div > clr-dg-string-filter > clr-dg-filter > div > div > button > clr-icon")).click();
        String umbrellaFundName = driver.findElement(By.id("product-dashboard-undefined-0-draftName")).getText();
        assertTrue(umbrellaFundName.equals(uFundDetails[0]));
        String fundType = driver.findElement(By.id("product-dashboard-undefined-0-draftType")).getText();
        assertTrue(fundType.equals("Umbrella Fund"));

    }
    @Test
    public void shouldDeleteDraft() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        driver.findElement(By.id("mcBtnSubmitFormDraft")).getAttribute("enabled");
        driver.findElement(By.id("mcBtnSubmitFormDraft")).click();
        scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[1]/div[1]/a/h2");
        wait.until(refreshed(visibilityOfElementLocated(By.className("toast-title"))));
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        searchDraftByName(uFundDetails[0]);
        String umbrellaFundName = driver.findElement(By.id("product-dashboard-undefined-0-draftName")).getText();
        assertTrue(umbrellaFundName.equals(uFundDetails[0]));
        String fundType = driver.findElement(By.id("product-dashboard-undefined-0-draftType")).getText();
        assertTrue(fundType.equals("Umbrella Fund"));
        driver.findElement(By.cssSelector("div.well:nth-child(6) > div:nth-child(2) > div:nth-child(1) > clr-datagrid:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > clr-dg-table-wrapper:nth-child(1) > div:nth-child(2) > clr-dg-row:nth-child(1) > div:nth-child(1) > clr-dg-cell:nth-child(5) > div:nth-child(1) > button:nth-child(2)")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]")))).isDisplayed();
        String draftDeletePopUp = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]")).getText();
        assertEquals(draftDeletePopUp, "Draft Delete");
        String confirmDelete =  driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).getText();
        assertTrue(confirmDelete.contains("Confirm Delete"));
        driver.findElement(By.cssSelector("#iznes > app-root > jaspero-confirmations > jaspero-confirmation > div.jaspero__dialog.ng-trigger.ng-trigger-wrapperAn > div.jaspero__dialog-actions > button.error")).click();
        wait.until(refreshed(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]"))));
        searchDraftByName(uFundDetails[0]);
    }

    @Test
    public void shouldEditAndSaveDraft() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        driver.findElement(By.id("mcBtnSubmitFormDraft")).getAttribute("enabled");
        driver.findElement(By.id("mcBtnSubmitFormDraft")).click();

        //form has been saved to draft, now lets find it in the drafts
        scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-footer/div");
        wait.until(refreshed(visibilityOfElementLocated(By.className("toast-title"))));
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        driver.findElement(By.cssSelector("#iznes > app-root > app-basic-layout > div > ng-sidebar-container > div > div > div > main > div.router-container > div > app-ofi-am-product-home > div:nth-child(6) > div.row.panel-body > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-head.ng-star-inserted > div > clr-dg-column:nth-child(2) > div > clr-dg-string-filter > clr-dg-filter > button")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(uFundDetails);
        driver.findElement(By.cssSelector("#iznes > app-root > app-basic-layout > div > ng-sidebar-container > div > div > div > main > div.router-container > div > app-ofi-am-product-home > div:nth-child(6) > div.row.panel-body > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-head.ng-star-inserted > div > clr-dg-column:nth-child(2) > div > clr-dg-string-filter > clr-dg-filter > div > div > button > clr-icon")).click();
        String umbrellaFundName = driver.findElement(By.id("product-dashboard-undefined-0-draftName")).getText();
        assertTrue(umbrellaFundName.equals(uFundDetails[0]));
        String fundType = driver.findElement(By.id("product-dashboard-undefined-0-draftType")).getText();
        assertTrue(fundType.equals("Umbrella Fund"));
        //edit the draft
        driver.findElement(By.cssSelector("#product-dashboard-Draftsundefined > div > clr-dg-cell:nth-child(5) > div > button.btn.btn-success.btn-sm.ng-star-inserted")).click();
        driver.findElement(By.id("uf_umbrellaFundName")).getText();
        assertTrue(umbrellaFundName.equals(uFundDetails[0]));
        //submitUmbrellaFund();

        //change something
        String[] uFundDetailsNew = generateRandomUmbrellaFundsDetails();
        driver.findElement(By.id("uf_umbrellaFundName")).clear();
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(uFundDetailsNew[0]);
        updateDraftUmbrellaFund();

        //check the toast notification
        wait.until(refreshed(visibilityOfElementLocated(By.className("toast-title"))));
        assertToastContainsText(uFundDetailsNew[0]);
        assertToastContainsText("successfully updated");
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));

        //searchUmbrellaTable(uFundDetails[0]);
        searchDraftsTableByProductName(uFundDetailsNew[0]);

        WebElement newName = driver.findElement(By.xpath("//*[@id=\"product-dashboard-undefined-0-draftName\"]"));
        assert newName.getText().contains(uFundDetailsNew[0]) : "draft was not updated";
//        getUmbrellaTableRow(0, uFundDetails[0], lei, "Management Company", "Jordan");
//        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
    }
    @Test
    public void shouldDuplicateUmbrellaFund() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String[] dupFundDetails = generateRandomDuplicateDetails();
        String lei = generateRandomLEI();
        String duplei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");


        String registeredOffice = driver.findElement(By.id("uf_registerOffice")).getAttribute("value");
        String LEI = driver.findElement(By.id("uf_lei")).getAttribute("value");
        String address = driver.findElement(By.id("uf_registerOfficeAddress")).getAttribute("value");
        String custodianBank = driver.findElement(By.id("uf_custodian")).getText();
        String managementCompany = driver.findElement(By.id("uf_managementCompany")).getText();
        String umbrellaFundDomicile = driver.findElement(By.id("uf_domicile")).getText();
        String fundAdmin = driver.findElement(By.id("uf_fundAdministrator")).getText();
        String date = driver.findElement(By.id("uf_umbrellaFundCreationDate")).getAttribute("value");

        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(uFundDetails[0]);
        getUmbrellaTableRow(0, uFundDetails[0], lei, "Management Company", "Jordan");
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);

        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-0")).click();
        driver.findElement(By.id("uploadNavFileButton")).click();

        wait.until(visibilityOfElementLocated(By.id("uf_umbrellaFundName"))).isDisplayed();

        if(driver.findElement(By.id("uf_umbrellaFundName")).getAttribute("value").isEmpty()) {
        }
        else {
            fail("Duplicate UF Contain's Fund Name");
        }
        assertTrue(registeredOffice.contains(uFundDetails[0] + "testOffice"));
        assertTrue(LEI.contains(lei));
        assertTrue(address.contains("testAddress"));
        assertTrue(custodianBank.contains("Société Générale Securities Services France"));
        assertTrue(managementCompany.contains("Management Company"));
        assertTrue(umbrellaFundDomicile.contains("Jordan"));
        assertTrue(fundAdmin.contains("Société Générale Securities Services France"));
        assertTrue(date.equals("2019-10-20"));

        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(dupFundDetails[0]);
        driver.findElement(By.id("uf_lei")).clear();

        driver.findElement(By.id("uf_lei")).sendKeys(duplei);
        String duplicateUFName = driver.findElement(By.id("uf_umbrellaFundName")).getAttribute("value");
        submitUmbrellaFund();

        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(dupFundDetails[0]);
        wait.until(elementToBeClickable(By.id("product-dashboard-link-umbrellaFundID-0")));
        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-0")).click();
        assertTrue(duplicateUFName.equals(dupFundDetails[0]));

    }
    @Test
    public void shouldDuplicateFromExisting() throws SQLException, InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] dupFundDetails = generateRandomDuplicateDetails();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        String duplei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        String registeredOffice = driver.findElement(By.id("uf_registerOffice")).getAttribute("value");
        String LEI = driver.findElement(By.id("uf_lei")).getAttribute("value");
        String address = driver.findElement(By.id("uf_registerOfficeAddress")).getAttribute("value");
        String custodianBank = driver.findElement(By.id("uf_custodian")).getText();
        String managementCompany = driver.findElement(By.id("uf_managementCompany")).getText();
        String umbrellaFundDomicile = driver.findElement(By.id("uf_domicile")).getText();
        String fundAdmin = driver.findElement(By.id("uf_fundAdministrator")).getText();
        String date = driver.findElement(By.id("uf_umbrellaFundCreationDate")).getAttribute("value");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(uFundDetails[0]);
        getUmbrellaTableRow(0, uFundDetails[0], lei, "Management Company", "Jordan");
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
        scrollElementIntoViewById("new-umbrella-fund-btn");
        selectAddUmbrellaFund();
        selectAndSearchDuplicateFrom(uFundDetails[0]);
        assertTrue(registeredOffice.contains(uFundDetails[0] + "testOffice"));
        assertTrue(LEI.contains(lei));
        assertTrue(address.contains("testAddress"));
        assertTrue(custodianBank.contains("Société Générale Securities Services France"));
        assertTrue(managementCompany.contains("Management Company"));
        assertTrue(umbrellaFundDomicile.contains("Jordan"));
        assertTrue(fundAdmin.contains("Société Générale Securities Services France"));
        assertTrue(date.equals("2019-10-20"));
        if(driver.findElement(By.id("uf_umbrellaFundName")).getAttribute("value").isEmpty()) {
        }
        else {
            fail("Duplicate UF Contain's Fund Name");
        }
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(dupFundDetails[0]);
        driver.findElement(By.id("uf_lei")).clear();
        driver.findElement(By.id("uf_lei")).sendKeys(duplei);
        String duplicateUFName = driver.findElement(By.id("uf_umbrellaFundName")).getAttribute("value");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(dupFundDetails[0]);
        wait.until(refreshed(elementToBeClickable(By.id("product-dashboard-link-umbrellaFundID-0"))));
        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-0")).click();
        assertTrue(duplicateUFName.equals(dupFundDetails[0]));
    }
    @Test
    @Ignore
    public void shouldFillAllDetailsAndDuplicateAndAssertDetails() throws SQLException, InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        selectAddUmbrellaFund();
        String[] dupFundDetails = generateRandomDuplicateDetails();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        if (true) { driver.findElement(By.id("uf_registerOfficeAddressLine2")).sendKeys("Address Line 2 Shoud be optional"); }

        fillInOptionalDetailsUmbrellaFund();

        String payingAgent = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[11]/ng-select/div/span/span/span/span")).getText();
        String investmentAdvisor = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[10]/ng-select/div/span/span/span/span")).getText();
        String delegatedManagementCo = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div/div[2]/span/span")).getText();
        String auditor = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div/div[2]/span/span")).getText();
        String taxAuditor = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div/div[2]/span/span")).getText();
        String principalPromoter = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div/span/span/span/span")).getText();
        String legalAdvisor = driver.findElement(By.xpath("//*[@id=\"uf_legalAdvisor\"]/div/div[2]/span/span")).getText();
        String directors = driver.findElement(By.id("uf_directors")).getAttribute("value");
        String internalReference = driver.findElement(By.id("uf_internalReference")).getAttribute("value");
        String additionalNotes = driver.findElement(By.id("uf_additionnalNotes")).getAttribute("value");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(uFundDetails[0]);
        getUmbrellaTableRow(0, uFundDetails[0], lei, "Management Company", "Jordan");
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
        scrollElementIntoViewById("new-umbrella-fund-btn");
        selectAddUmbrellaFund();
        selectAndSearchDuplicateFrom(uFundDetails[0]);
        assertTrue(payingAgent.equals("Paying Agent 1"));
        assertTrue(investmentAdvisor.equals("Investment Advisor 1"));
        driver.findElement(By.cssSelector("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).click();
        scrollElementIntoViewById("ufBtnResetForm");
        assertTrue(delegatedManagementCo.equals("Management Company"));
        assertTrue(auditor.equals("Auditor 1"));
        assertTrue(taxAuditor.equals("Tax Auditor 1"));
        assertTrue(principalPromoter.equals("Principal Promoter 1"));
        scrollElementIntoViewById("mcBtnSubmitForm");
        assertTrue(legalAdvisor.equals("Legal Advisor 1"));
        assertTrue(directors.equals("Michael Bindley"));
        assertTrue(internalReference.equals("Internal Reference - Michael"));
        assertTrue(additionalNotes.equals("This test was created to allow the optional information to be filled in automatically"));
        scrollElementIntoViewById("uf_umbrellaFundName");
        wait.until(refreshed(elementToBeClickable(By.id("uf_umbrellaFundName")))).isDisplayed();
        fillFundNameRandom(dupFundDetails[0] + uFundDetails[0], "uf_umbrellaFundName");
        String duplicateUFName = driver.findElement(By.id("uf_umbrellaFundName")).getAttribute("value");
        scrollElementIntoViewById("mcBtnSubmitForm");
        driver.findElement(By.cssSelector("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).click();
        driver.findElement(By.id("mcBtnSubmitForm")).click();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(dupFundDetails[0]);
        wait.until(refreshed(elementToBeClickable(By.id("product-dashboard-link-umbrellaFundID-0"))));
        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-0")).click();
        assertTrue(duplicateUFName.equals(dupFundDetails[0] + uFundDetails[0]));
        assertTrue(payingAgent.equals("Paying Agent 1"));
        assertTrue(investmentAdvisor.equals("Investment Advisor 1"));
        driver.findElement(By.cssSelector("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).click();
        assertTrue(delegatedManagementCo.equals("Management Company"));
        assertTrue(auditor.equals("Auditor 1"));
        assertTrue(taxAuditor.equals("Tax Auditor 1"));
        assertTrue(principalPromoter.equals("Principal Promoter 1"));
        assertTrue(legalAdvisor.equals("Legal Advisor 1"));
        assertTrue(directors.equals("Michael Bindley"));
        assertTrue(internalReference.equals("Internal Reference - Michael"));
        assertTrue(additionalNotes.equals("This test was created to allow the optional information to be filled in automatically"));
    }
    @Test
    public void shouldAssertThatAnUmbrellaFundTabIsPresent(){
        System.out.println("Not Yet Implemented");
    }
}
