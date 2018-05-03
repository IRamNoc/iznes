package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

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
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.submitUmbrellaFund;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByClassName;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

@RunWith(OrderedJUnit4ClassRunner.class)


public class OpenCSDVNewFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";


    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
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
        fillOutFundDetailsStep2(uFundDetails[0]);

        try {

            scrollElementIntoViewByClassName("toast-title");
            String popup = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popup);
            assertTrue(popup.equals(uFundDetails[0] + " has been successfully created."));
        } catch (Exception e) {
            fail(e.getMessage());
        }
        getFundTableRow(fundCount, uFundDetails[0], "", "EUR Euro", "Management Company", "Afghanistan", "Contractual Fund", "");
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
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
        } catch (Exception e) {
            fail(e.getMessage());
        }

    }

    @Test
    public void shouldDisplayUmbrellaFundInfoWhenUmbrellaFundIsSelected() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-fund-btn")));
        driver.findElement(By.id("new-fund-btn")).click();
        searchAndSelectTopDropdown("fund-umbrellaControl-select-1", uFundDetails[0]);
        wait.until(visibilityOfElementLocated(By.id("fund-submitUmbrella-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitUmbrella-btn")));
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        String fundNameText = (driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/div[1]/div[1]/div/a/h2")).getText());
        String fundName = split(fundNameText, " ");
        assertTrue(fundName.equals(uFundDetails[0]));
    }

    @Test
    public void shouldDisplayNoUmbrellaFundWhenNoUmbrellaFundIsSelected() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-fund-btn")));
        driver.findElement(By.id("new-fund-btn")).click();
        searchAndSelectTopDropdown("fund-umbrellaControl-select-1", "none");
        wait.until(visibilityOfElementLocated(By.id("fund-submitUmbrella-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitUmbrella-btn")));
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        String fundName = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/div[1]/div[1]/div/a/h2")).getText();
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
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldQueryDatabaseForFunds() throws InterruptedException, IOException {

    }

    @Test
    public void shouldUpdateFund() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
        driver.findElement(By.xpath("//*[@id=\"product-dashboard-fundID-0-fundName\"]/span")).click();
        String title = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(title.contains("Fund"));
        driver.findElement(By.id("fundName")).sendKeys("Updated");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewById("fund-submitfund-btn");
        wait.until(visibilityOfElementLocated(By.id("fund-submitfund-btn")));
        wait.until(elementToBeClickable(driver.findElement(By.id("fund-submitfund-btn"))));
        WebElement submit = driver.findElement(By.id("fund-submitfund-btn"));
        submit.click();
        assertTrue(driver.findElement(By.className("toast-title")).getText().contains("has been successfully updated."));
        assertTrue(driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText().equals(umbFundNamePrev + "Updated"));

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

    public static void validateDatabaseFundExists(int expectedCount, String UFundName) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("select * from setlnet.tblIznFund where fundName =  " + "\"" + UFundName + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

}
