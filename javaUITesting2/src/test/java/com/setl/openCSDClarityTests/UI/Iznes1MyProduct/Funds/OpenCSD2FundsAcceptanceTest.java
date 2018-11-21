package com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds;

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
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static SETLAPIHelpers.DatabaseHelper.validateDatabaseFundExists;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.submitUmbrellaFund;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByClassName;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.assertPopupNextFundNo;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.searchFundsTable;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

@RunWith(OrderedJUnit4ClassRunner.class)


public class OpenCSD2FundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(75000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBTwoFAOff();
    }

    @Test
    public void shouldCreateFundAndAssertDetailsInTableAreUpdated() throws InterruptedException, SQLException, IOException {

        String umbFundDetails = generateRandomUmbrellaFundName();
        String[] uFundDetails = generateRandomFundsDetails();
        String[] updateChars = generateRandomDetails();
        String randomLei = generateRandomLEI();
        String Lei = generateRandomLEI();
        String updatedLei = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry(umbFundDetails, randomLei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");

        fillOutFundDetailsStep1("yes", umbFundDetails);
        fillOutFundDetailsStep2(uFundDetails[0], Lei);

        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        getFundTableRow(0, uFundDetails[0], Lei, "EUR", "Management Company", "Afghanistan", "Contractual Fund", umbFundDetails);

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[4]/div/button");
        wait.until(refreshed(invisibilityOfElementLocated(By.className("toast-title"))));
        scrollElementIntoViewById("new-fund-btn");
        Thread.sleep(1000);
        wait.until(refreshed(elementToBeClickable(By.id("product-dashboard-fundID-0-fundName"))));
        driver.findElement(By.id("product-dashboard-fundID-0-fundName")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1")));

        driver.findElement(By.id("fundName")).sendKeys(updateChars[0]);
        driver.findElement(By.id("legalEntityIdentifier")).clear();
        driver.findElement(By.id("legalEntityIdentifier")).sendKeys(updatedLei);
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/div[2]/span/a")).click();

        searchAndSelectFundDropdown("domicile", "Albania");
        searchAndSelectLegalFormDropdown("legalForm", "Unit Trust");
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/div[3]/ul/li[2]/div/a")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div/div[3]/ul/li[1]/div/a")).click();
        searchAndSelectFundsDropdown("nationalNomenclatureOfLegalForm", "GB Authorised unit trust (AUT)");

        scrollElementIntoViewById("fund-submitfund-btn");
        wait.until(visibilityOfElementLocated(By.id("fund-submitfund-btn")));
        wait.until(elementToBeClickable(driver.findElement(By.id("fund-submitfund-btn"))));
        driver.findElement(By.id("fund-submitfund-btn")).click();
        wait.until(visibilityOfElementLocated(By.id("am-product-home")));
        searchFundsTable(uFundDetails[0]);

        //Assert that table displays the fund details with random chars at the end.
        getFundTableRow(0, uFundDetails[0] + updateChars[0], updatedLei, "USD", "Management Company", "Albania", "Unit Trust", umbFundDetails);
        validateDatabaseFundExists(0, uFundDetails[0]);
        validateDatabaseFundExists(1, uFundDetails[0] + updateChars[0]);

    }

    @Test
    public void shouldCreateFundAndDisplayCreatedFundInFundsTableAndCheckDatabase() throws InterruptedException, IOException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String fundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCount = Integer.parseInt(fundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(fundCount);

        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        driver.findElement(By.id("isFundStructure1")).isDisplayed();

        String[] uFundDetails = generateRandomFundsDetails();
        String lei = generateRandomLEI();
        fillOutFundDetailsStep2(uFundDetails[0], lei);

        assertPopupNextFundNo("Share");

        try {

            scrollElementIntoViewByClassName("toast-title");
            String popup = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popup);
            assertTrue(popup.equals(uFundDetails[0] + " has been successfully created."));
        } catch (Exception e) {
            fail(e.getMessage());
        }

        searchFundsTable(uFundDetails[0]);
        getFundTableRow(0, uFundDetails[0], lei, "EUR", "Management Company", "Afghanistan", "Contractual Fund", "");
        validateDatabaseFundExists(1, uFundDetails[0]);
    }


    @Test
    public void shouldDisplayCorrectTitle() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        String pageHeading = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(pageHeading.equals("Add a New Fund"));
    }

    @Test
    public void shouldClickAddNewUmbrellaFundAndBeNavigatedAway() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        try {
            driver.findElement(By.id("fund-add-new-umbrella-btn")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }
        try {
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a new Umbrella Fund"));
        } catch (Exception e) {
            fail("Page heading text was not correct : " + e.getMessage());
        }
    }

    @Test
    public void shouldBeAbleToCancelFundCreationStep1() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-cancelUmbrella-btn")).click();
        try {
            String pageHeading = driver.findElement(By.id("am-product-home")).getText();
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella Funds"));
        } catch (Exception e) {
            fail(e.getMessage());
        }

    }

    @Test
    public void shouldDisplayUmbrellaFundInfoWhenUmbrellaFundIsSelectedTG445() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-fund-btn")));
        driver.findElement(By.id("new-fund-btn")).click();
        searchAndSelectTopDropdown("fund-umbrellaControl-select-1", "none");
        wait.until(visibilityOfElementLocated(By.id("fund-submitUmbrella-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitUmbrella-btn")));
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        String fundName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/clr-tabs/clr-tab/clr-tab-content/form/div[1]/div[1]/div/a/h2")).getText();
        assertTrue(fundName.equals("No Umbrella Fund"));
    }

    @Test
    public void shouldShowSelectedUmbrellaFundInfoInFundCreationTG445() throws InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        String uFundDetails = generateRandomUmbrellaFundName();
        String randomLei = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");


        selectAddUmbrellaFund();
        fillCertainUmbrellaDetails(uFundDetails + "TG445", randomLei, "TestOffice1661", "TestAddress1661", "Management Company", "2019-10-20", "Custodian Bank 1", "Fund Admin 1");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_fundAdministrator");
        driver.findElement(By.id("uf_registerOfficeAddressZipCode")).sendKeys("ZIP");
        driver.findElement(By.id("uf_registerOfficeAddressCity")).sendKeys("City");
        searchAndSelectTopDropdownXpath("uf_registerOfficeAddressCountry", "Jordan");

        Thread.sleep(5000);
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");

        wait.until(visibilityOfElementLocated(By.id("new-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-fund-btn")));
        driver.findElement(By.id("new-fund-btn")).click();
        searchAndSelectTopDropdown("fund-umbrellaControl-select-1", uFundDetails);
        wait.until(visibilityOfElementLocated(By.id("fund-submitUmbrella-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitUmbrella-btn")));
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();

        String umbrellaFundHeader = (driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[1]/div[1]/div/a/h2")).getText());

        assertTrue(umbrellaFundHeader.equals("Umbrella Fund: " + uFundDetails + "TG445"));

        driver.findElement(By.cssSelector(".fundForm > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).click();
        wait.until(visibilityOfElementLocated(By.id("umbrellaEditLei")));

        String LEIActual = driver.findElement(By.id("umbrellaEditLei")).getAttribute("value");
        assertTrue(LEIActual.equals(randomLei));

        String DomicileActual = driver.findElement(By.id("umbrellaEditFundDomicile")).getAttribute("value");
        assertTrue(DomicileActual.equals("Jordan"));

        driver.findElement(By.cssSelector(".fundForm > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).click();
        scrollElementIntoViewById("payingAgent");
        wait.until(visibilityOfElementLocated(By.id("payingAgent")));

        String UmbNameActual = driver.findElement(By.id("uf_umbrellaFundName")).getAttribute("value");
        assertTrue(UmbNameActual.equals(uFundDetails + "TG445"));

        String regOfficeActual = driver.findElement(By.id("uf_registerOfficeAddress")).getAttribute("value");
        assertTrue(regOfficeActual.equals("TestAddress1661"));
    }

    @Test
    public void shouldNotDisplayUmbrellaFundWhenNoUmbrellaFundIsSelectedTG445() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-fund-btn")));
        driver.findElement(By.id("new-fund-btn")).click();
        searchAndSelectTopDropdown("fund-umbrellaControl-select-1", "none");
        wait.until(visibilityOfElementLocated(By.id("fund-submitUmbrella-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitUmbrella-btn")));
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        String fundName = driver.findElement(By.cssSelector(".fundForm > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).getText();
        assertTrue(fundName.equals("No Umbrella Fund"));
    }

    @Test
    public void shouldTakeUserToStep2WhenNextIsClicked() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        Thread.sleep(1750);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try {
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        } catch (Error e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldBeAbleToCancelFundCreationStep2() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        waitForHomePageToLoad();
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        Thread.sleep(1750);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try {
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        } catch (Error e) {
            fail(e.getMessage());
        }
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            scrollElementIntoViewById("fund-cancelfund-btn");
            Thread.sleep(750);
        } catch (Exception e) {
            fail(e.getMessage());
        }
        wait.until(visibilityOfElementLocated(By.id("fund-cancelfund-btn")));
        wait.until(elementToBeClickable(By.id("fund-cancelfund-btn")));
        try {
            driver.findElement(By.id("fund-cancelfund-btn")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }
        try {
            String pageHeading = driver.findElement(By.id("am-product-home")).getText();
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella Funds"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldQueryDatabaseForFunds() throws InterruptedException, IOException {

    }

    @Test
    @Ignore("WAITING FOR ORDERING TO BE FIXED")
    public void shouldDisplayCorrectHeadingIfUmbrellaFundIsNotSelectedTG445() throws InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String fundCounts = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCounter = Integer.parseInt(fundCounts.replaceAll("[\\D]", ""));
        String[] uFundDetails = generateRandomFundsDetails();
        String lei = generateRandomLEI();
        int fundCount = fundCounter - 1;

        fillOutFundDetailsStep1("no", "none");
        fillOutFundDetailsStep2(uFundDetails[0], generateRandomLEI());

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + "0" + "-umbrellaFundName")));
        driver.findElement(By.id("product-dashboard-link-fundID-0")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/div[1]/div[1]/div/a/h2")));
        String umbFund = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/div[1]/div[1]/div/a/h2")).getText();
        assertTrue(umbFund.equals("No Umbrella Fund"));
    }

    @Test
    @Ignore("Test needs to be re-written")
    public void shouldUpdateFund() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        createFund();
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
        scrollElementIntoViewById("product-dashboard-fundID-0-fundName");
        wait.until(elementToBeClickable(By.id("product-dashboard-fundID-0-fundName")));
        driver.findElement(By.id("product-dashboard-fundID-0-fundName")).click();
        scrollElementIntoViewById("fund-cancelfund-btn");
        String title = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(title.contains("Fund"));
        driver.findElement(By.id("fundName")).sendKeys("Updated");

        scrollElementIntoViewById("fund-submitfund-btn");

        try {
            wait.until(visibilityOfElementLocated(By.id("fund-submitfund-btn")));
            wait.until(elementToBeClickable(driver.findElement(By.id("fund-submitfund-btn"))));

            WebElement submit = driver.findElement(By.id("fund-submitfund-btn"));
            submit.click();
        } catch (WebDriverException wde) {
            fail(wde.getMessage());
        }

        wait.until(visibilityOfElementLocated(By.className("toast-title")));
        assertTrue(driver.findElement(By.className("toast-title")).getText().contains("has been successfully updated."));
        String test2 = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
        System.out.println(test2);
        System.out.println(umbFundNamePrev + "Updated");
        assertTrue(test2.equals(umbFundNamePrev + "Updated"));

    }

    public void createFund() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        driver.findElement(By.id("isFundStructure1")).isDisplayed();

        String[] uFundDetails = generateRandomFundsDetails();
        String lei = generateRandomLEI();
        fillOutFundDetailsStep2(uFundDetails[0], lei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);

        try {

            scrollElementIntoViewByClassName("toast-title");
            String popup = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popup);
            assertTrue(popup.equals(uFundDetails[0] + " has been successfully created."));
        } catch (Exception e) {
            fail(e.getMessage());
        }
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        getFundTableRow(0, uFundDetails[0], lei, "EUR", "Management Company", "Afghanistan", "Contractual Fund", "");


    }

    static String split(String value, String separator) {
        // Returns a substring containing all characters after a string.
        int posA = value.lastIndexOf(separator);
        if (posA == -1) {
            return "";
        }
        int adjustedPosA = posA + separator.length();
        if (adjustedPosA >= value.length()) {
            return "";
        }
        return value.substring(adjustedPosA);
    }

//    public static void validateDatabaseFundExists(int expectedCount, String UFundName) throws SQLException {
//        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
//        //for the query
//        Statement stmt = conn.createStatement();
//        ResultSet rs = null;
//        try {
//            rs = stmt.executeQuery("select * from setlnet.tblIznFund where fundName =  " + "\"" + UFundName + "\"");
//            int rows = 0;
//
//            if (rs.last()) {
//                rows = rs.getRow();
//                // Move to back to the beginning
//
//                rs.beforeFirst();
//            }
//            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
//        } catch (Exception e) {
//            e.printStackTrace();
//            fail();
//        } finally {
//            conn.close();
//            stmt.close();
//            rs.close();
//        }
//    }
//
//    public static void validateDatabaseShareExists(int expectedCount, String UShareName) throws SQLException {
//        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
//        //for the query
//        Statement stmt = conn.createStatement();
//        ResultSet rs = null;
//        try {
//            rs = stmt.executeQuery("select * from setlnet.tblIznFundShare where fundShareName =  " + "\"" + UShareName + "\"");
//            int rows = 0;
//
//            if (rs.last()) {
//                rows = rs.getRow();
//                // Move to back to the beginning
//
//                rs.beforeFirst();
//            }
//            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
//        } catch (Exception e) {
//            e.printStackTrace();
//            fail();
//        } finally {
//            conn.close();
//            stmt.close();
//            rs.close();
//        }
//    }
//
//    public static String getInvestorInvitationToken(String investorEmail) throws SQLException {
//        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
//        Statement stmt = conn.createStatement();
//        ResultSet rs = null;
//        String invEmaila = "";
//        try {
//            String getInvEmail = "select invitationToken from setlnet.tblIznInvestorInvitation where email = " + "\"" + investorEmail + "\"";
//            rs = stmt.executeQuery(getInvEmail);
//            rs.last();
//            invEmaila = rs.getString("invitationToken");
//
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            fail();
//        } finally {
//            conn.close();
//            stmt.close();
//            rs.close();
//        }
//        return invEmaila;
//    }

    @Test
    public void shouldAssertThatAFundsTabIsPresent(){
        System.out.println("Not Yet Implemented");
    }

    @Test
    public void shouldCreateAndSetWalletWhenFundIsCreated(){
        System.out.println("Not Yet Implemented");
    }
}

