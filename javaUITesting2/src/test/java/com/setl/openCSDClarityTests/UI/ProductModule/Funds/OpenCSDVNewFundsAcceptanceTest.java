package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;
import java.sql.*;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;


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
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("//*[@id='fund-umbrellaControl-select-1']/div")).click();
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try{
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        }catch (Error e){
            fail(e.getMessage());
        }
        shouldFillOutFundDetailsStep2("TestFund1");
        try {
            driver.findElement(By.id("fund-submitfund-btn")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        Thread.sleep(2500);
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popup);
            assertTrue(popup.equals("TestFund1 has been successfully created."));
        }catch (Exception e){
            fail(e.getMessage());
        }
        String fundName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[1]")).getText();
        assertTrue(fundName.equals("TestFund1"));
        validateDatabaseFundExists(1,"TestFund1");
    }

    @Test
    public void shouldDisplayCorrectTitle() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        String pageHeading = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(pageHeading.equals("Add a New Fund"));
    }

    @Test
    public void shouldClickAddNewUmbrellaFundAndBeNavigatedAway() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        try {
            driver.findElement(By.id("fund-add-new-umbrella-btn")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        try{
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a New Umbrella Fund"));
        }catch (Exception e){
            fail("Page heading text was not correct : " + e.getMessage());
        }
        }

    @Test
    public void shouldBeAbleToCancelFundCreationStep1() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
//        try {
//            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys("Test_Umbrella_Fund");
//        }catch (Exception e){
//            fail(e.getMessage());
//        }
        Thread.sleep(2000);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-cancelUmbrella-btn")).click();
        try {
            String pageHeading = driver.findElement(By.id("am-product-home")).getText();
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
        }catch (Exception e){
            fail(e.getMessage());
        }

    }

    @Test
    public void shouldDisplayUmbrellaFundInfoWhenUmbrellaFundIsSelected() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
//            try {
//                driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys("asdasd");
//            }catch (Exception e){
//                fail(e.getMessage());
//            }
        Thread.sleep(2000);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        String fundName = driver.findElement(By.id("umbrellaFundName")).getAttribute("value");
        assertTrue(fundName.equals("umbfund2"));
    }

    @Test
    public void shouldTakeUserToStep2WhenNextIsClicked() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
//        try {
//            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys("TestUmbrellaFunds1");
//        }catch (Exception e){
//            fail(e.getMessage());
//        }
        Thread.sleep(1750);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try{
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        }catch (Error e){
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldBeAbleToCancelFundCreationStep2() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
//        try {
//            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys("TestUmbrellaFunds1");
//        }catch (Exception e){
//            fail(e.getMessage());
//        }
        Thread.sleep(1750);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try{
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        }catch (Error e){
            fail(e.getMessage());
        }
        ((JavascriptExecutor) driver).executeScript("window.scrollBy(0,500)");
        driver.findElement(By.id("fund-cancelfund-btn")).click();
        try {
            String pageHeading = driver.findElement(By.id("am-product-home")).getText();
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
        }catch (Exception e){
        }
    }

    @Test
    public void shouldQueryDatabaseForFunds() throws InterruptedException, IOException{

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

    @Test
    public void shouldUpdateFund() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
        System.out.println(umbFundNamePrev);
        try {
            driver.findElement(By.xpath("//*[@id=\"product-dashboard-fundID-0-fundName\"]/span")).click();
        }catch (Exception e){
            fail(e.getMessage());}
        String title = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(title.contains("Fund"));
        driver.findElement(By.id("fundName")).sendKeys("Updated");
        driver.findElement(By.id("fund-submitfund-btn")).click();
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            Thread.sleep(750);
            assertTrue(popup.contains("has been successfully updated."));
        }catch (Exception e){
            fail(e.getMessage());}
        try {
            String umFundName = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
            assertTrue(umFundName.equals(umbFundNamePrev + "Updated"));
        }catch (Exception e){
            fail(e.getMessage());}
    }

    private void shouldFillOutFundDetailsStep2(String fundName) throws InterruptedException {
        driver.findElement(By.id("fundName")).sendKeys(fundName);
        driver.findElement(By.id("AuMFund")).sendKeys(fundName);
        driver.findElement(By.id("AuMFundDate")).sendKeys("2019-04-04");
        driver.findElement(By.id("domicile")).click();
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isEuDirective2")).click();
        driver.findElement(By.id("legalForm")).click();
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fundCurrency")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/div[3]/ul/li[1]/div/a")).click();
        ((JavascriptExecutor) driver).executeScript("window.scrollBy(0,500)");
        driver.findElement(By.id("fundManagers")).sendKeys("testManager");
        driver.findElement(By.id("managementCompanyID")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("custodianBank")).click();
        driver.findElement(By.xpath("//*[@id=\"custodianBank\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("portfolioCurrencyHedge")).click();
        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fiscalYearEnd")).sendKeys("2019-04");
        driver.findElement(By.id("openOrCloseEnded2")).click();
        driver.findElement(By.id("isFundOfFund2")).click();
        driver.findElement(By.id("fundAdministrator")).click();
        driver.findElement(By.xpath("//*[@id=\"fundAdministrator\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("nationalNomenclatureOfLegalForm")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isDedicatedFund1")).click();
    }
}
