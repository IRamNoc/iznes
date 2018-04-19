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

import java.io.IOException;



import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToPage;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

import static org.junit.Assert.*;


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
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdown("uf_domicile", "Jordan");
        submitUmbrellaFund();
        Thread.sleep(750);
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
    public void shouldAssertThatUmbrellaFundsTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatFundsTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatFundShareTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatUmbrellaFundsHas3ExpandableFields(){
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
