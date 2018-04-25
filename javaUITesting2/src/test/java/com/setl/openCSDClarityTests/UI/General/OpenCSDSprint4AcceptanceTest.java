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
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;



import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToPage;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDSprint4AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldUpdateUmbrellaFund() throws IOException, InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        Thread.sleep(750);
        try {
            String popupBefore = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popupBefore);
            wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        }catch (Exception e){
            fail(e.getMessage());
        }
        //Get the name of the umbrella fund from the database
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")).getText();
        try {
            driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-umbrellaFundName\"]/span")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        String title = driver.findElement(By.id("edit-fund-title")).getText();
        assertTrue(title.contains("Umbrella fund:"));
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys("Updated");
        driver.findElement(By.id("mcBtnSubmitForm")).click();
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popup);
            assertTrue(popup.contains("has been successfully updated!"));
        }catch (Exception e){
            fail(e.getMessage());
        }
        try {
            String umFundName = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")).getText();
            assertTrue(umFundName.equals(umbFundNamePrev + "Updated"));
        }catch (Exception e){
            fail(e.getMessage());
        }
        //Assert umbrella fund name has been updated in the database
    }

    @Test
    @Ignore("Fund requires a management company entered again")
    public void shouldUpdateFund() throws IOException, InterruptedException {
        JavascriptExecutor jse = (JavascriptExecutor)driver;
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        //Get the name of the fund from the database
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
        try {
            driver.findElement(By.xpath("//*[@id=\"product-dashboard-fundID-0-fundName\"]/span")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        String title = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(title.contains("Fund:"));
        driver.findElement(By.id("fundName")).sendKeys("Updated");
        try {
            driver.findElement(By.id("fund-submitfund-btn")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            assertTrue(popup.contains("has been successfully updated!"));
        }catch (Exception e){
            fail(e.getMessage());
        }
        try {
            String umFundName = driver.findElement(By.id("product-dashboard-fundID-0-fundName")).getText();
            assertTrue(umFundName.equals(umbFundNamePrev + "Updated"));
        }catch (Exception e){
            fail(e.getMessage());
        }
        //Assert fund name has been updated in the database
    }

    @Test
    public void shouldAssertThatUmbrellaFundsTableDisplaysAllInformation() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");

        String umbFundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[1]/div[1]/a/h2")).getText();
        int umbFundCount = Integer.parseInt(umbFundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(umbFundCount);

        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        getUmbrellaTableRow(umbFundCount, uFundDetails[0], "testLei", "Management Company", "Jordan");
    }

    private void getUmbrellaTableRow(int rowNo, String umbFundNameExpected , String leiExpected, String managementCompExpected, String domicileExpected){
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

    @Test
    public void shouldAssertThatFundsTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatFundShareTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatUmbrellaFundsHas2ExpandableFields() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectUmbrellaFund();
        verifyOptInfoPageContents();
        verifyMainInfoPageContents();
    }

    private void selectUmbrellaFund() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")));
        wait.until(elementToBeClickable(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")));
        WebElement uFund = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName"));
        uFund.click();

        wait.until(visibilityOfElementLocated(By.id("edit-fund-title")));

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[1]/div[1]/div/a/h2")));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[2]/div[1]/div/a/h2")));
    }

    private void verifyOptInfoPageContents() {

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

    private void verifyMainInfoPageContents() {

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

    @Test
    public void shouldAssertThatFundsHas3ExpandableFields(){
    }

    @Test
    public void shouldAssertThatAnUmbrellaFundTabIsPresent(){
    }

    @Test
    public void shouldAssertThatAFundsTabIsPresent(){
    }

    @Test
    public void shouldAssertThatAFundSharesTabIsPresent(){
    }

    @Test
    public void shouldAssertThatFundSharesHas2ExpandableFields(){
    }

    @Test
    public void shouldCreateAndSetWalletWhenFundIsCreated(){
    }

    @Test
    public void shouldCreateFundShareAndCheckDatabase(){
    }

    @Test
    public void shouldUpdateFundShareAndCheckDatabase(){
    }

    public static void navigateToAddUser() {
    }
}
