package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.sql.SQLException;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

public class FundsDetailsHelper extends LoginAndNavigationHelper {

    public static String[] generateRandomUmbrellaFundsDetails() {
        String str = randomAlphabetic(7);
        String umbrellaFundName = "Test_Umbrella_Fund_" + str;
        return new String[]{umbrellaFundName};
    }

    public static String[] generateRandomFundsDetails() {
        String str = randomAlphabetic(7);
        String umbrellaFundName = "Test_Fund_" + str;
        return new String[]{umbrellaFundName};
    }

    public static String[] generateRandomISIN() {
        String n = randomNumeric(10);
        String b = "JM";
        String randomISIN = b + n;
        return new String[]{randomISIN};
    }

    public static String generateRandomLEI() {
        //https://en.wikipedia.org/wiki/Legal_Entity_Identifier
        String louCode = randomNumeric(4);
        String reserved = "00";
        String entityId = randomAlphanumeric(12).toUpperCase();
        String checksum = randomNumeric(2); // if possible, could investigate making this a valid checksum

        return louCode + reserved + entityId + checksum;
    }

    public static String[] generateRandomSubPortfolioName() {
        String str = randomAlphabetic(7);
        String b = "JM Portfolio | ";
        String randomISIN = b + str;
        return new String[]{randomISIN};
    }

    public static String[] generateRandomAmount() {
        String str = randomNumeric(3);
        return new String[]{str};
    }

    public static String[] generateRandomSubPortfolioIBAN() {
        String n = randomNumeric(14);
        String b = "JM";
        String randomISIN = b + n;
        return new String[]{randomISIN};
    }

    public static String[] generateRandomDetails(){
        String str = randomAlphabetic(5);
        String random = str;
        return new String[]{random};
    }

    public static String[] generateRandomDuplicateDetails(){
        String str = randomAlphabetic(7);
        String duplicateFundName = "Duplicated_Umbrella_Fund_" + str;
        return new String[]{duplicateFundName};
    }

    public static void searchDraftByName(String fund) throws InterruptedException {
        driver.findElement(By.cssSelector("#iznes > app-root > app-basic-layout > div > ng-sidebar-container > div > div > div > main > div.router-container > div > app-ofi-am-product-home > div:nth-child(6) > div.row.panel-body > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-head.ng-star-inserted > div > clr-dg-column:nth-child(2) > div > clr-dg-string-filter > clr-dg-filter > button")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).clear();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(fund);
        driver.findElement(By.cssSelector("#iznes > app-root > app-basic-layout > div > ng-sidebar-container > div > div > div > main > div.router-container > div > app-ofi-am-product-home > div:nth-child(6) > div.row.panel-body > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-head.ng-star-inserted > div > clr-dg-column:nth-child(2) > div > clr-dg-string-filter > clr-dg-filter > div > div > button > clr-icon")).click();
    }

    public static void fillInOptionalDetailsUmbrellaFund() throws InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        //Investment Manager Selection
        wait.until(visibilityOfElementLocated(By.id("uf_investmentAdvisor")));
        wait.until(elementToBeClickable(By.id("uf_investmentAdvisor")));
        driver.findElement(By.id("uf_investmentAdvisor")).click();
        //Selecting from DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[10]/ng-select/div/div[2]/ul/li[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[10]/ng-select/div/div[2]/ul/li[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[10]/ng-select/div/div[2]/ul/li[1]")).click();
        //Paying Agent
        scrollElementIntoViewById("uf_payingAgent");
        wait.until(visibilityOfElementLocated(By.id("uf_payingAgent")));
        wait.until(elementToBeClickable(By.id("uf_payingAgent")));
        driver.findElement(By.id("uf_payingAgent")).click();
        //Selecting from DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[11]/ng-select/div/div[2]/ul/li[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[11]/ng-select/div/div[2]/ul/li[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[1]/div[2]/div[11]/ng-select/div/div[2]/ul/li[1]")).click();
        //Selecting Optional Information Header
        scrollElementIntoViewByCss("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)");
        wait.until(visibilityOfElementLocated(By.cssSelector("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")));
        wait.until(elementToBeClickable(By.cssSelector("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")));
        driver.findElement(By.cssSelector("div.well:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > h2:nth-child(2)")).click();
        //Delegated Management Company
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div");
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div")).click();
        //Selecting From DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div/div[3]/ul/li[1]/div/a")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div/div[3]/ul/li[1]/div/a")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[2]/ng-select/div/div[3]/ul/li[1]/div/a")).click();
        //Auditor
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div");
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div")).click();
        //Selecting From DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div/div[3]/ul/li[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div/div[3]/ul/li[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[3]/ng-select/div/div[3]/ul/li[1]")).click();
        //Tax Auditor
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div");
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div")).click();
        //Selecting From DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div/div[3]/ul/li[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div/div[3]/ul/li[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[4]/ng-select/div/div[3]/ul/li[1]")).click();
        //Principal Promoter
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div");
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div")).click();
        //Selecting From DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div/div[2]/ul/li[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div/div[2]/ul/li[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[5]/ng-select/div/div[2]/ul/li[1]")).click();
        //Legal Advisor
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div");
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div")).click();
        //Selecting From DropDown
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div/div[3]/ul/li[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div/div[3]/ul/li[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/clr-tabs/clr-tab/clr-tab-content/form/section/div[2]/div[2]/div[6]/ng-select/div/div[3]/ul/li[1]")).click();
        //Directors
        scrollElementIntoViewById("uf_directors");
        wait.until(visibilityOfElementLocated(By.id("uf_directors")));
        wait.until(elementToBeClickable(By.id("uf_directors")));
        driver.findElement(By.id("uf_directors")).sendKeys("Michael Bindley");
        //Internal Reference
        scrollElementIntoViewById("uf_internalReference");
        wait.until(visibilityOfElementLocated(By.id("uf_internalReference")));
        wait.until(elementToBeClickable(By.id("uf_internalReference")));
        driver.findElement(By.id("uf_internalReference")).sendKeys("Internal Reference - Michael");
        //Additional Notes
        scrollElementIntoViewById("uf_additionnalNotes");
        wait.until(visibilityOfElementLocated(By.id("uf_additionnalNotes")));
        wait.until(elementToBeClickable(By.id("uf_additionnalNotes")));
        driver.findElement(By.id("uf_additionnalNotes")).sendKeys("This test was created to allow the optional information to be filled in automatically");

    }

    public static void selectAndSearchDuplicateFrom(String fund) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath("//*[@id=\"umbrella_select\"]/div/div[2]/span/i[2]")).click();
        driver.findElement(By.xpath("//*[@id=\"umbrella_select\"]/div/div[3]/div/input")).sendKeys(fund);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"umbrella_select\"]/div/div[3]/ul/li[1]/div/a/div")));
        driver.findElement(By.xpath("//*[@id=\"umbrella_select\"]/div/div[3]/ul/li[1]/div/a/div")).click();
        wait.until(visibilityOfElementLocated(By.id("uf_umbrellaFundName")));
    }

    public static void selectAddUmbrellaFund() throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-umbrella-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-umbrella-fund-btn")));
        scrollElementIntoViewById("new-umbrella-fund-btn");
        Thread.sleep(1000);
        driver.findElement(By.id("new-umbrella-fund-btn")).click();
       // wait.until(invisibilityOfElementLocated(By.id("new-umbrella-fund-btn")));
        try {
            wait.until(visibilityOfElementLocated(By.id("add-fund-title")));
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a new Umbrella Fund"));
        } catch (Exception e) {
            fail("Page heading text was not correct : " + e.getMessage());
        }
    }
    public static void fillFundNameRandom (String fundNameDuplicate, String IDname) throws InterruptedException {

        driver.findElement(By.id(IDname)).sendKeys(fundNameDuplicate);
    }

    public static void fillUmbrellaDetailsNotCountry(String fundName, String lei) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        JavascriptExecutor js = (JavascriptExecutor) driver;

        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(fundName);
        driver.findElement(By.id("uf_registerOffice")).sendKeys("testOffice");
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys("testAddress");
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2019-10-20");
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys(Keys.ENTER);
        js.executeScript("document.getElementById(\"switchActiveShares\").click();");

        wait.until(visibilityOfElementLocated(By.id("uf_lei")));
        driver.findElement(By.id("uf_lei")).sendKeys(lei);

        selectTopDropdown("uf_managementCompany");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_fundAdministrator");
    }

    public static void fillCertainUmbrellaDetails(String fundName, String lei, String regOffice, String regAddress, String managementComp, String dateSelected, String custodian, String fundAdmin ) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        JavascriptExecutor js = (JavascriptExecutor) driver;

        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(fundName);
        driver.findElement(By.id("uf_registerOffice")).sendKeys(regOffice);
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys(regAddress);
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys(dateSelected);
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys(Keys.ENTER);

        js.executeScript("document.getElementById(\"switchActiveShares\").click();");

        wait.until(visibilityOfElementLocated(By.id("uf_lei")));
        driver.findElement(By.id("uf_lei")).sendKeys(lei);

        searchAndSelectTopDropdown("uf_managementCompany", managementComp);
        searchAndSelectTopDropdown("uf_custodian", custodian);
        searchAndSelectTopDropdown("uf_fundAdministrator", fundAdmin);
    }

//    private static String generateRandomLEI() {
//        String str = randomAlphabetic(2);
//        String num = randomNumeric(18);
//        String LEI = str + num;
//        return LEI;
//    }

    public static void submitUmbrellaFund() throws InterruptedException {
        try {
            scrollElementIntoViewById("mcBtnSubmitForm");
            driver.findElement(By.id("mcBtnSubmitForm")).click();
        } catch (Exception e) {
            fail("Save button was not clicked. " + e.getMessage());
        }
    }

    public static void selectTopDropdown(String dropdownID) throws InterruptedException {
        try {
            driver.findElement(By.xpath("//*[@id='" + dropdownID + "']/div")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/ul/li/div/a")).click();
    }

    public static void searchAndSelectTopDropdown(String dropdownID, String search) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[2]/span/span")));
            wait.until(elementToBeClickable(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[2]/span/span")));
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[2]/span/span")).click();
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/div/input")));
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/div/input")).sendKeys(search);
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/div/input")).sendKeys(Keys.ENTER);

        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void searchAndSelectTopDropdownXpath(String dropdownID, String search) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();

        scrollElementIntoViewByXpath("//*[@id=\'" + dropdownID + "\']/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div"))));

        driver.findElement(By.xpath("//*[@id=\"uf_domicile\"]/div/div[3]/div/input")).sendKeys(search);
        try {
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void searchAndSelectLegalFormDropdown(String dropdownID, String search) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();

        scrollElementIntoViewByXpath("//*[@id=\'" + dropdownID + "\']/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div"))));

        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/div/input")).sendKeys(search);
        try {
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void searchAndSelectFundDropdown(String dropdownID, String search) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();

        scrollElementIntoViewByXpath("//*[@id=\'" + dropdownID + "\']/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div"))));

        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/div[3]/div/input")).sendKeys(search);
        try {
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void searchAndSelectFundsDropdown(String dropdownID, String search) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();

        scrollElementIntoViewByXpath("//*[@id=\'" + dropdownID + "\']/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div"))));

        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/div/input")).sendKeys(search);
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/div/input")).sendKeys(Keys.ENTER);
        //driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
    }

    public static void searchAndSelectTopFundXpath(String dropdownID, String search) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div"))));

        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/div/input")).sendKeys(search);
        try {
            driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void selectFund(int fundCount) {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        scrollElementIntoViewById("new-share-btn");
        if(fundCount > 10){
            fundCount = fundCount - 10;
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-footer/clr-dg-pagination/ul/li[3]/button")).click();
        String fundId = "product-dashboard-link-fundID-" + fundCount;
        wait.until(refreshed(visibilityOfElementLocated(By.id(fundId))));
        wait.until(refreshed(elementToBeClickable(By.id(fundId))));
        WebElement fund = driver.findElement(By.id(fundId));
        fund.click();
        }
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")));
    }

    public static void fillOutFundDetailsStep2(String fundName, String lei) throws InterruptedException {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("fundName")).sendKeys(fundName);
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/div[3]/ul/li[1]/div/a")).click();

        js.executeScript("document.getElementById(\"switchActiveShares\").click();");

        wait.until(visibilityOfElementLocated(By.id("legalEntityIdentifier")));
        driver.findElement(By.id("legalEntityIdentifier")).sendKeys(lei);

        js.executeScript("document.getElementById('isEuDirective2').click();");
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        scrollElementIntoViewById("fiscalYearEnd");
        wait.until(visibilityOfElementLocated(By.id("fiscalYearEnd")));
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/div[3]/ul/li[1]/div/a")).click();
        scrollElementIntoViewById("fund-cancelfund-btn");
        Thread.sleep(500);
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fundManagers")).sendKeys("testManager");
        scrollElementIntoViewByXpath("//*[@id=\"fundAdministrator\"]/div");
        driver.findElement(By.xpath("//*[@id=\"fundAdministrator\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundAdministrator\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div/div[3]/ul/li[1]/div/a")).click();

        scrollElementIntoViewById("fund-cancelfund-btn");
        wait.until(visibilityOfElementLocated(By.id("fund-cancelfund-btn")));
        wait.until(elementToBeClickable(By.id("fund-cancelfund-btn")));

        driver.findElement(By.xpath("//*[@id=\"custodianBank\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"custodianBank\"]/div/div[3]/ul/li[1]/div/a")).click();

        scrollElementIntoViewById("portfolioCurrencyHedge");
        wait.until(visibilityOfElementLocated(By.id("portfolioCurrencyHedge")));

        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div")).click();

        scrollElementIntoViewByXpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a")));

        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fiscalYearEnd")).sendKeys("2019-04");
        js.executeScript("document.getElementById('openOrCloseEnded2').click();");
        js.executeScript("document.getElementById('isFundOfFund2').click();");
        js.executeScript("document.getElementById('isDedicatedFund1').click();");

        scrollElementIntoViewById("fund-submitfund-btn");
        wait.until(visibilityOfElementLocated(By.id("fund-submitfund-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitfund-btn")));

        driver.findElement(By.id("fund-submitfund-btn")).click();
    }

    public static void fillOutFundDetails(String fundName, String umbFundName) throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(refreshed(visibilityOfElementLocated(By.id("new-fund-btn"))));
        wait.until(refreshed(elementToBeClickable(By.id("new-fund-btn"))));


        driver.findElement(By.id("new-fund-btn")).click();

        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys(umbFundName);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys(Keys.ENTER);
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        driver.findElement(By.id("isFundStructure1")).isDisplayed();
        driver.findElement(By.id("fundName")).sendKeys(fundName);
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isEuDirective2")).click();
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fundManagers")).sendKeys("testManager");
        scrollElementIntoViewByXpath("//*[@id=\"fundAdministrator\"]/div");
        driver.findElement(By.xpath("//*[@id=\"fundAdministrator\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundAdministrator\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div/div[3]/ul/li[1]/div/a")).click();
        scrollElementIntoViewById("fund-cancelfund-btn");
        driver.findElement(By.xpath("//*[@id=\"custodianBank\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"custodianBank\"]/div/div[3]/ul/li[1]/div/a")).click();
        scrollElementIntoViewByXpath("//*[@id=\"portfolioCurrencyHedge\"]/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div"))));
        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a"))));
        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fiscalYearEnd")).sendKeys("2019-04");
        driver.findElement(By.id("openOrCloseEnded2")).click();
        driver.findElement(By.id("isFundOfFund2")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isDedicatedFund1")).click();
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
    }

    public static void getFundTableRow(int rowNo, String fundNameExpected, String leiExpected, String fundCurrencyExpected, String managementCompExpected, String domicileExpected, String legalFormExpected, String umbFundExpected) {
        scrollElementIntoViewById("new-share-btn");

        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-fundName")));
        String shareNameID = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-fundName")).getAttribute("id");
        int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));
        String fundName = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-fundName")).getText();
        assertTrue(fundName.equals(fundNameExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-legalEntityIdentifier")));
        String leiName = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-legalEntityIdentifier")).getText();
        System.out.println(leiExpected);
        System.out.println(leiName);
        assertTrue(leiName.equals(leiExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-fundCurrency")));
        String fundCurrency = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-fundCurrency")).getText();
        assertTrue(fundCurrency.equals(fundCurrencyExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-managementCompany")));
        String managementComp = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-managementCompany")).getText();
        assertTrue(managementComp.equals(managementCompExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-domicile")));
        String domicile = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-domicile")).getText();
        assertTrue(domicile.equals(domicileExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-lawStatus")));
        String legalForm = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-lawStatus")).getText();
        assertTrue(legalForm.equals(legalFormExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundID-" + rowNo + "-umbrellaFundName")));
        String umbFund = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-umbrellaFundName")).getText();
        assertTrue(umbFund.equals(umbFundExpected));
    }

    public static void getShareTableRow(int rowNo, String shareNameExpected, String isinExpected, String fundNameExpected, String shareCurrencyExpected, String managementCompExpected, String umbFundExpected, String shareClassExpected, String statusExpected) {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-shareName")));

        //String shareNameID = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-shareName")).getAttribute("id");
        //int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));
        String shareName = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-shareName")).getText();
        assertTrue(shareName.equals(shareNameExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-isin")));
        String isinName = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-isin")).getText();
        assertTrue(isinName.equals(isinExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-fundName")));
        String fundName = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-fundName")).getText();
        assertTrue(fundName.equals(fundNameExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-shareCurrency")));
        String shareCurrency = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-shareCurrency")).getText();
        assertTrue(shareCurrency.equals(shareCurrencyExpected));

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-managementCompany")));
        String managementComp = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-managementCompany")).getText();
        assertTrue(managementComp.equals(managementCompExpected));

/*        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-shareClass")));
        String shareClass = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-shareClass")).getText();
        assertTrue(shareClass.equals(shareClassExpected));*/

        wait.until(visibilityOfElementLocated(By.id("product-dashboard-fundShareID-" + rowNo + "-status")));
        String status = driver.findElement(By.id("product-dashboard-fundShareID-" + rowNo + "-status")).getText();
        assertTrue(status.equals(statusExpected));
    }

    public static void getUmbrellaTableRow(int rowNo, String umbFundNameExpected, String leiExpected, String managementCompExpected, String domicileExpected) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-umbrella-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-umbrella-fund-btn")));
        String shareNameID = driver.findElement(By.id("product-dashboard-link-umbrellaFundID-" + rowNo)).getAttribute("id");
        int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));

        String umbFundName = driver.findElement(By.id("product-dashboard-link-umbrellaFundID-" + shareNameNo)).getText();
        System.out.println(umbFundName);
        System.out.println(umbFundNameExpected);
        assertTrue(umbFundName.equals(umbFundNameExpected));

        String leiName = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-legalEntityIdentifier")).getText();
        assertTrue(leiName.equals(leiExpected));

        String managementComp = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-managementCompany")).getText();
        assertTrue(managementComp.equals(managementCompExpected));

        String domicile = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-domicile")).getText();
        assertTrue(domicile.equals(domicileExpected));
    }

    public static void selectUmbrellaFund() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-link-umbrellaFundID-0")));
        wait.until(elementToBeClickable(By.id("product-dashboard-link-umbrellaFundID-0")));
        WebElement uFund = driver.findElement(By.id("product-dashboard-link-umbrellaFundID-0"));
        uFund.click();
        wait.until(visibilityOfElementLocated(By.id("edit-fund-title")));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[1]/div[1]/div/a/h2")));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[2]/div[1]/div/a/h2")));
    }

    public static void verifyUmbrellaFundOptInfoPageContents() {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/section/div[1]/div[1]/div/a/h2"));
        mainInfo.click();
        WebElement optInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/section/div[2]/div[1]/div/a/h2"));
        optInfo.click();
        wait.until(visibilityOfElementLocated(By.id("uf_giin")));
        wait.until(visibilityOfElementLocated(By.id("uf_delegatedManagementCompany")));
        wait.until(visibilityOfElementLocated(By.id("uf_auditor")));
        wait.until(visibilityOfElementLocated(By.id("uf_taxAuditor")));
        wait.until(visibilityOfElementLocated(By.id("uf_principalPromoter")));
        wait.until(visibilityOfElementLocated(By.id("uf_legalAdvisor")));
        wait.until(visibilityOfElementLocated(By.id("uf_directors")));
        wait.until(visibilityOfElementLocated(By.id("uf_internalReference")));
        wait.until(visibilityOfElementLocated(By.id("uf_additionnalNotes")));
        optInfo.click();


        wait.until(invisibilityOfElementLocated(By.id("uf_giin")));
        wait.until(invisibilityOfElementLocated(By.id("uf_delegatedManagementCompany")));
        wait.until(invisibilityOfElementLocated(By.id("uf_auditor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_taxAuditor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_principalPromoter")));
        wait.until(invisibilityOfElementLocated(By.id("uf_legalAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_directors")));
        wait.until(invisibilityOfElementLocated(By.id("uf_internalReference")));
        wait.until(invisibilityOfElementLocated(By.id("uf_additionnalNotes")));

    }

    public static void verifyUmbrellaFundMainInfoPageContents() {

        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/section/div[1]/div[1]/div/a/h2"));
        mainInfo.click();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("uf_umbrellaFundName")));
        wait.until(visibilityOfElementLocated(By.id("uf_lei")));
        wait.until(visibilityOfElementLocated(By.id("uf_registerOffice")));
        wait.until(visibilityOfElementLocated(By.id("uf_registerOfficeAddress")));
        wait.until(visibilityOfElementLocated(By.id("uf_domicile")));
        wait.until(visibilityOfElementLocated(By.id("uf_umbrellaFundCreationDate")));
        wait.until(visibilityOfElementLocated(By.id("uf_managementCompany")));
        wait.until(visibilityOfElementLocated(By.id("uf_fundAdministrator")));
        wait.until(visibilityOfElementLocated(By.id("uf_custodian")));
        wait.until(visibilityOfElementLocated(By.id("uf_investmentAdvisor")));
        wait.until(visibilityOfElementLocated(By.id("uf_payingAgent")));
        mainInfo.click();

        wait.until(invisibilityOfElementLocated(By.id("uf_umbrellaFundName")));
        wait.until(invisibilityOfElementLocated(By.id("uf_lei")));
        wait.until(invisibilityOfElementLocated(By.id("uf_registerOffice")));
        wait.until(invisibilityOfElementLocated(By.id("uf_registerOfficeAddress")));
        wait.until(invisibilityOfElementLocated(By.id("uf_domicile")));
        wait.until(invisibilityOfElementLocated(By.id("uf_umbrellaFundCreationDate")));
        wait.until(invisibilityOfElementLocated(By.id("uf_managementCompany")));
        wait.until(invisibilityOfElementLocated(By.id("uf_fundAdministrator")));
        wait.until(invisibilityOfElementLocated(By.id("uf_custodian")));
        wait.until(invisibilityOfElementLocated(By.id("uf_investmentAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_payingAgent")));
    }


    public static void verifyFundMainInfoPageContents() {

        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2"));

        mainInfo.click();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[1]/div[1]/div/a/h2")));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[1]/div[1]/div/a/h2")).getText().equals("Main information"));
        wait.until(visibilityOfElementLocated(By.id("fundName")));
        assertTrue(isElementPresent(By.id("isFundStructure1")));
        assertTrue(isElementPresent(By.id("isFundStructure2")));


        wait.until(visibilityOfElementLocated(By.id("legalEntityIdentifier")));
        wait.until(visibilityOfElementLocated(By.id("registerOffice")));
        wait.until(visibilityOfElementLocated(By.id("registerOfficeAddress")));
        wait.until(visibilityOfElementLocated(By.id("domicile")));
        assertTrue(isElementPresent(By.id("isEuDirective1")));
        assertTrue(isElementPresent(By.id("isEuDirective2")));
        wait.until(visibilityOfElementLocated(By.id("legalForm")));
        wait.until(visibilityOfElementLocated(By.id("nationalNomenclatureOfLegalForm")));
        wait.until(visibilityOfElementLocated(By.id("fundCreationDate")));
        wait.until(visibilityOfElementLocated(By.id("fundLaunchate")));
        wait.until(visibilityOfElementLocated(By.id("fundCurrency")));

        assertTrue(isElementPresent(By.id("openOrCloseEnded1")));
        assertTrue(isElementPresent(By.id("openOrCloseEnded2")));
        wait.until(visibilityOfElementLocated(By.id("fiscalYearEnd")));
        assertTrue(isElementPresent(By.id("isFundOfFund1")));
        assertTrue(isElementPresent(By.id("isFundOfFund2")));
        wait.until(visibilityOfElementLocated(By.id("managementCompanyID")));
        wait.until(visibilityOfElementLocated(By.id("fundAdministrator")));
        wait.until(visibilityOfElementLocated(By.id("custodianBank")));
        wait.until(visibilityOfElementLocated(By.id("investmentManager")));
        wait.until(visibilityOfElementLocated(By.id("principalPromoter")));
        wait.until(visibilityOfElementLocated(By.id("payingAgent")));
        wait.until(visibilityOfElementLocated(By.id("fundManagers")));
        assertTrue(isElementPresent(By.id("isDedicatedFund1")));
        assertTrue(isElementPresent(By.id("isDedicatedFund2")));
        wait.until(visibilityOfElementLocated(By.id("portfolioCurrencyHedge")));
        wait.until(visibilityOfElementLocated(By.id("investmentObjective")));
        mainInfo.click();

        wait.until(invisibilityOfElementLocated(By.id("fundName")));

        wait.until(invisibilityOfElementLocated(By.id("legalEntityIdentifier")));
        wait.until(invisibilityOfElementLocated(By.id("registerOffice")));
        wait.until(invisibilityOfElementLocated(By.id("registerOfficeAddress")));
        wait.until(invisibilityOfElementLocated(By.id("domicile")));

        wait.until(invisibilityOfElementLocated(By.id("legalForm")));
        wait.until(invisibilityOfElementLocated(By.id("nationalNomenclatureOfLegalForm")));
        wait.until(invisibilityOfElementLocated(By.id("fundCreationDate")));
        wait.until(invisibilityOfElementLocated(By.id("fundLaunchate")));
        wait.until(invisibilityOfElementLocated(By.id("fundCurrency")));

        wait.until(invisibilityOfElementLocated(By.id("fiscalYearEnd")));

        wait.until(invisibilityOfElementLocated(By.id("managementCompanyID")));
        wait.until(invisibilityOfElementLocated(By.id("fundAdministrator")));
        wait.until(invisibilityOfElementLocated(By.id("custodianBank")));
        wait.until(invisibilityOfElementLocated(By.id("investmentManager")));
        wait.until(invisibilityOfElementLocated(By.id("principalPromoter")));
        wait.until(invisibilityOfElementLocated(By.id("payingAgent")));
        wait.until(invisibilityOfElementLocated(By.id("fundManagers")));

        wait.until(invisibilityOfElementLocated(By.id("portfolioCurrencyHedge")));
        wait.until(invisibilityOfElementLocated(By.id("investmentObjective")));
    }

    public static void fillOutFundDetailsStep1(String umbFundName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        scrollElementIntoViewById("new-fund-btn");
        wait.until(elementToBeClickable(By.id("new-fund-btn")));
        wait.until(visibilityOfElementLocated(By.id("new-fund-btn")));
        driver.findElement(By.id("new-fund-btn")).click();

        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys(umbFundName);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys(Keys.ENTER);

        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try {
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        } catch (Error e) {
            fail(e.getMessage());
        }
    }


    public static void verifyFundDropdownElements(int fundCount) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        System.out.println(fundCount);
        fundCount = fundCount - 1;
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")));
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[1]/div[1]/div/a/h2")));
        //assertTrue(driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[1]/div[1]/div/a/h2")).getText().contentEquals("No Umbrella Fund"));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")));
        //assertTrue(driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")).getText().contentEquals("Fund: Test"));

    }

    public static void validateUmbrellaFundsDataGridHeadings(String[] umbrellaFundsHeadings) {
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div")).isDisplayed());
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/button")).getText().contentEquals(umbrellaFundsHeadings[0]));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/button")).getText().contentEquals(umbrellaFundsHeadings[1]));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[3]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[3]/div/button")).getText().contentEquals(umbrellaFundsHeadings[2]));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[4]/div/button")));
    }

    public static void validateNAVDataGridHeadings(String[] NAVHeadings) {
        assertTrue(isElementPresent(By.id("NAV-Title")));
        assertTrue(driver.findElement(By.id("NAV-Title")).isDisplayed());
        assertTrue(driver.findElement(By.id("NAV-CN-Share-Name")).getText().contentEquals(NAVHeadings[0]));
        assertTrue(driver.findElement(By.id("NAV-CN-ISIN")).getText().contentEquals(NAVHeadings[1]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV-Date")).getText().contentEquals(NAVHeadings[2]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV-Pub-Date")).getText().contentEquals(NAVHeadings[3]));
        assertTrue(driver.findElement(By.id("NAV-CN-Next-Valuation-Date")).getText().contentEquals(NAVHeadings[4]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV-CCY")).getText().contentEquals(NAVHeadings[5]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV")).getText().contentEquals(NAVHeadings[6]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV-Estimated")).getText().contentEquals(NAVHeadings[7]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV-Technical")).getText().contentEquals(NAVHeadings[8]));
        assertTrue(driver.findElement(By.id("NAV-CN-NAV-Validated")).getText().contentEquals(NAVHeadings[9]));
        assertTrue(driver.findElement(By.id("NAV-CN-Status")).getText().contentEquals(NAVHeadings[10]));
        assertTrue(driver.findElement(By.id("NAV-CN-Actions")).getText().contentEquals(NAVHeadings[11]));

    }

    public static void validatePageLayout() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-align-left")));
        assertTrue(isElementPresent(By.id("am-product-home")));
        assertTrue(driver.findElement(By.id("am-product-home")).getText().contentEquals("Shares / Funds / Umbrella funds"));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/div")).getText().contentEquals("Display only active Shares"));
        assertTrue(isElementPresent(By.id("switchActiveShares")));
        assertTrue(driver.findElement(By.id("switchActiveShares")).isEnabled());
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[1]/div[1]")).getText().contains("Shares "));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-right.rotate")));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[1]/div[2]")));
        scrollElementIntoViewById("new-share-btn");
        wait.until(visibilityOfElementLocated(By.id("new-share-btn")));
        wait.until(elementToBeClickable(By.id("new-share-btn")));
        assertTrue(driver.findElement(By.id("new-share-btn")).getText().contains("Add new Share"));

        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[1]")).getText().contains("Funds"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-right.rotate")));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.id("new-fund-btn")).getText().contains("Add new Fund"));

        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[1]")).getText().contains("Umbrella funds"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-right.rotate")));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.id("new-umbrella-fund-btn")).getText().contains("Add new Umbrella fund"));
    }

    public static void validateNAVPageLayout() {
        assertTrue(isElementPresent(By.id("NAV-Title")));
        assertTrue(driver.findElement(By.id("NAV-Title")).getText().contains("Net Asset Value"));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/div/span")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/div/span")).getText().contentEquals("Please select a date type and a date to access to the available NAVs.\n" +
            "You will have access to the NAV's history of a specific share in clicking on the corresponding row."));
        assertTrue(isElementPresent(By.id("netAssetValueTab")));
        //assertTrue(driver.findElement(By.id("netAssetValueTab")).getText().contentEquals("NAVs for all your shares"));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/clr-tabs/clr-tab/clr-tab-content/form/div/div/div[1]/label")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/clr-tabs/clr-tab/clr-tab-content/form/div/div/div[1]/label")).getText().contentEquals("Search a Share Name or ISIN"));
        assertTrue(isElementPresent(By.id("Search-field")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/clr-tabs/clr-tab/clr-tab-content/form/div/div/div[2]/label")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/clr-tabs/clr-tab/clr-tab-content/form/div/div/div[2]/label")).getText().contentEquals("Select a Date"));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/clr-tabs/clr-tab/clr-tab-content/form/div/div/div[2]/ng-select/div/div[2]/span/span")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/clr-tabs/clr-tab/clr-tab-content/form/div/div/div[2]/ng-select/div/div[2]/span/span")).getText().contentEquals("NAV Date"));
        assertTrue(isElementPresent(By.id("Date-filter")));
        assertTrue(driver.findElement(By.id("Date-filter")).getAttribute("value").contentEquals(getTodayDate()));
        assertTrue(isElementPresent(By.id("NAV-Date-Filter")));
        assertTrue(isElementPresent(By.id("NAV-Export-CSV")));
        assertTrue(driver.findElement(By.id("NAV-Export-CSV")).getText().contentEquals("Export List as CSV"));
    }

    public static void openDropdownAndSelectOption(String dropdownID, int childNo) throws SQLException, InterruptedException {
        driver.findElement(By.xpath("//*[@id='" + dropdownID + "']/div")).click();

        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(" + childNo + ") > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void assertClassRequiredIsPresent(String tabID) throws SQLException, InterruptedException {
        try {
            assertTrue(driver.findElement(By.xpath("//*[@id=\'" + tabID + "\']/span/span")).isDisplayed());
        } catch (Exception e) {
            fail("Asterisk was present " + e.getMessage());
        }
    }

    public static void assertHiddenAttributeIsPresent(String tabID) {
            final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\'" + tabID + "\']/span/span[2]")));
            assertFalse(driver.findElement(By.xpath("//*[@id=\'" + tabID + "\']/span/span[2]")).isDisplayed());
    }

    public static String getTodayDate() {
        Date todayDate = Calendar.getInstance().getTime();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String todayString = formatter.format(todayDate);
        return todayString;
    }
}
