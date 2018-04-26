package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

public class FundsDetailsHelper extends LoginAndNavigationHelper {

    public static String[] generateRandomUmbrellaFundsDetails() {
        String str = randomAlphabetic(5);
        String umbrellaFundName = "Test_Umbrella_Fund_" + str;
        return new String[] {umbrellaFundName};
    }

    public static String[] generateRandomFundsDetails() {
        String str = randomAlphabetic(5);
        String umbrellaFundName = "Test_Fund_" + str;
        return new String[] {umbrellaFundName};
    }

    public static String[] generateRandomDetails() {
        String str = randomAlphabetic(5);
        String umbrellaFundName = str;
        return new String[] {umbrellaFundName};
    }

    public static void selectAddUmbrellaFund(){
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("new-umbrella-fund-btn")));
        wait.until(elementToBeClickable(By.id("new-umbrella-fund-btn")));
        driver.findElement(By.id("new-umbrella-fund-btn")).click();
        try{
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a new Umbrella Fund"));
        }catch (Exception e){
            fail("Page heading text was not correct : " + e.getMessage());
        }
    }

    public static void fillUmbrellaDetailsNotCountry(String fundName) throws InterruptedException {
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(fundName);
        driver.findElement(By.id("uf_lei")).sendKeys("testLei");
        driver.findElement(By.id("uf_registerOffice")).sendKeys("testOffice");
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys("testAddress");
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2019-10-20");
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys(Keys.ENTER);

        selectTopDropdown("uf_managementCompany");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_fundAdministrator");
    }

    public static void submitUmbrellaFund() throws InterruptedException {
        try {
            driver.findElement(By.id("mcBtnSubmitForm")).click();
        }catch (Exception e){
            fail("Save button was not clicked. " + e.getMessage());
        }
    }

    public static void selectTopDropdown(String dropdownID) throws InterruptedException {

            driver.findElement(By.xpath("//*[@id='" + dropdownID + "']/div")).click();

            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li/div/a")).click();

    }

    public static void searchAndSelectTopDropdown(String dropdownID, String search) throws InterruptedException {
        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();
        driver.findElement(By.id(dropdownID)).sendKeys(search);
        try {
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
    }
    public static void searchAndSelectTopDropdownXpath(String dropdownID, String search) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();

        scrollElementIntoViewByXpath("//*[@id=\'" + dropdownID + "\']/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\'" + dropdownID + "\']/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div"))));

        driver.findElement(By.xpath("//*[@id=\"uf_domicile\"]/div/div[3]/div/input")).sendKeys(search);
        try {
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
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
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
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
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
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
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    public static void selectFund() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-link-fundID-0")));
        wait.until(elementToBeClickable(By.id("product-dashboard-link-fundID-0")));
        WebElement fund = driver.findElement(By.id("product-dashboard-link-fundID-0"));

        fund.click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/div[1]/div[1]/div/a/h2")));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/div[2]/div[1]/div/a/h2")));


    }

    public static void shouldFillOutFundDetailsStep2(String fundName) {
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
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("//*[@id=\"portfolioCurrencyHedge\"]/div");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div"))));
        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fiscalYearEnd")).sendKeys("2019-04");
        driver.findElement(By.id("openOrCloseEnded2")).click();
        driver.findElement(By.id("isFundOfFund2")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isDedicatedFund1")).click();
    }

    public static void getFundTableRow(int rowNo, String fundNameExpected , String leiExpected, String fundCurrencyExpected, String managementCompExpected, String domicileExpected, String legalFormExpected, String umbFundExpected){
        String shareNameID = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-fundName")).getAttribute("id");
        System.out.println("before truncation : " + shareNameID);
        int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));
        System.out.println("after truncation : " + shareNameNo);

        String fundName = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-fundName")).getText();
        System.out.println("Expected : " + fundNameExpected);
        System.out.println("Actual   : " + fundName);
        assertTrue(fundName.equals(fundNameExpected));

        String leiName = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-legalEntityIdentifier")).getText();
        System.out.println("Expected : " + leiExpected);
        System.out.println("Actual   : " + leiName);
        assertTrue(leiName.equals(leiExpected));

        String fundCurrency = driver.findElement(By.id("product-dashboard-fundID-" + rowNo + "-fundCurrency")).getText();
        System.out.println("Expected : " + fundCurrencyExpected);
        System.out.println("Actual   : " + fundCurrency);
        assertTrue(fundCurrency.equals(fundCurrencyExpected));

        String managementComp = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-managementCompany")).getText();
        System.out.println("Expected : " + managementCompExpected);
        System.out.println("Actual   : " + managementComp);
        assertTrue(managementComp.equals(managementCompExpected));

        String domicile = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-domicile")).getText();
        System.out.println("Expected : " + domicileExpected);
        System.out.println("Actual   : " + domicile);
        assertTrue(domicile.equals(domicileExpected));

        String legalForm = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-lawStatus")).getText();
        System.out.println("Expected : " + legalFormExpected);
        System.out.println("Actual   : " + legalForm);
        assertTrue(legalForm.equals(legalFormExpected));

        String umbFund = driver.findElement(By.id("product-dashboard-fundID-" + shareNameNo + "-umbrellaFundName")).getText();
        System.out.println("Expected : " + umbFundExpected);
        System.out.println("Actual   : " + umbFund);
        assertTrue(umbFund.equals(umbFundExpected));
    }

    public static void getUmbrellaTableRow(int rowNo, String umbFundNameExpected , String leiExpected, String managementCompExpected, String domicileExpected){
        String shareNameID = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + rowNo + "-umbrellaFundName")).getAttribute("id");
        System.out.println("before truncation : " + shareNameID);
        int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));
        System.out.println("after truncation : " + shareNameNo);

        String umbFundName = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-umbrellaFundName")).getText();
        System.out.println("Expected : " + umbFundNameExpected);
        System.out.println("Actual   : " + umbFundName);
        assertTrue(umbFundName.equals(umbFundNameExpected));

        String leiName = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-legalEntityIdentifier")).getText();
        System.out.println("Expected : " + leiExpected);
        System.out.println("Actual   : " + leiName);
        assertTrue(leiName.equals(leiExpected));

        String managementComp = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-managementCompany")).getText();
        System.out.println("Expected : " + managementCompExpected);
        System.out.println("Actual   : " + managementComp);
        assertTrue(managementComp.equals(managementCompExpected));

        String domicile = driver.findElement(By.id("product-dashboard-umbrellaFundID-" + shareNameNo + "-domicile")).getText();
        System.out.println("Expected : " + domicileExpected);
        System.out.println("Actual   : " + domicile);
        assertTrue(domicile.equals(domicileExpected));
    }

   public static void selectUmbrellaFund() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")));
        wait.until(elementToBeClickable(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")));
        WebElement uFund = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName"));
        uFund.click();

        wait.until(visibilityOfElementLocated(By.id("edit-fund-title")));

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[1]/div[1]/div/a/h2")));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[2]/div[1]/div/a/h2")));
    }

    public static void verifyUmbrellaFundOptInfoPageContents() {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[1]/div[1]/div/a/h2"));
        mainInfo.click();
        WebElement optInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[2]/div[1]/div/a/h2"));
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

        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[1]/div[1]/div/a/h2"));
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
        wait.until(visibilityOfElementLocated(By.id("uf_investmentManager")));
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
        wait.until(invisibilityOfElementLocated(By.id("uf_investmentManager")));
        wait.until(invisibilityOfElementLocated(By.id("uf_investmentAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_payingAgent")));


    }

}
