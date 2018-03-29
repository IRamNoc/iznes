package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

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

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.fundCheckRoundingUp;
import static org.junit.Assert.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDUmbrellaFundsAcceptanceTest {

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
    public void shouldNavigateToSharesFundsUmbrellaFunds() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        String pageHeading = driver.findElement(By.id("am-product-home")).getText();
        assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
    }

    @Test
    public void shouldDisplaySameTitleIconAsNavIcon() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        String headingIcon = driver.findElement(By.xpath("//*[@id=\"am-product-home\"]/i")).getAttribute("class");
        String navIcon = driver.findElement(By.xpath("//*[@id=\"menu-product-home\"]/i")).getAttribute("class");
        assertTrue(headingIcon.equals(navIcon));
    }

    @Test
    public void shouldSeeCorrectFieldsOnSharesFundsUmbrellaFundsPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        validatePageLayout();
    }

    @Test
    public void shouldSeeCorrectHeadingsForUmbrellaFunds() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        validateUmbrellaFundsDataGridHeadings(umbrellaFundsHeadings);
    }

    @Test
    public void shouldCreateAnUmbrellaFund() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry("TestUmbrellaFunds1");
        searchAndSelectTopDropdown("uf_domicile", "Jordan");
        submitUmbrellaFund();
    }

    @Test
    public void shouldDisplayCreatedUmbrellaFundInFundsTable() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        try {
            String umbFundName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[1]")).getText();
            String umbFundLEI = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[2]")).getText();
            String umbFundManagement = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[3]")).getText();
            String umbFundCountry = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[4]")).getText();
            System.out.println(umbFundName + ", " + umbFundLEI + ", " + umbFundManagement + ", " + umbFundCountry);
            assertTrue(umbFundName.equals("TestUmbrellaFunds1"));
            assertTrue(umbFundLEI.equals("testLei"));
            assertTrue(umbFundManagement.equals("Management Company"));
            assertTrue(umbFundCountry.equals("Jordan"));
        }catch (Exception e){
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldShowTransferAgentIfFranceIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry("TestUmbrellaFunds1");
        searchAndSelectTopDropdown("uf_domicile", "France");
        submitUmbrellaFund();
    }

    @Test
    public void shouldShowTransferAgentIfLuxembourgIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry("TestUmbrellaFunds1");
        searchAndSelectTopDropdown("uf_domicile", "Luxembourg");
        submitUmbrellaFund();
    }

    @Test
    public void shouldShowTransferAgentIfIrelandIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry("TestUmbrellaFunds1");
        searchAndSelectTopDropdown("uf_domicile", "Ireland");
        submitUmbrellaFund();
    }

    @Test
    public void shouldNotCreateFundWithoutFieldEntered(){

    }

    private void submitUmbrellaFund() throws InterruptedException {
        try {
            driver.findElement(By.id("mcBtnSubmitForm")).click();
        }catch (Exception e){
            fail("Save button was not clicked. " + e.getMessage());
        }
    }

    private void fillUmbrellaDetailsNotCountry(String fundName){
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(fundName);
        driver.findElement(By.id("uf_lei")).sendKeys("testLei");
        driver.findElement(By.id("uf_registerOffice")).sendKeys("testOffice");
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys("testAddress");
        selectTopDropdown("uf_managementCompany");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_investmentAdvisor");
        selectTopDropdown("uf_fundAdministrator");
        selectTopDropdown("uf_investmentManager");
        selectTopDropdown("uf_payingAgent");
    }

    private void selectAddUmbrellaFund(){
        driver.findElement(By.id("new-umbrella-fund-btn")).click();
        try{
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a New Umbrella Fund"));
        }catch (Exception e){
            fail("Page heading text was not correct : " + e.getMessage());
        }
    }

    private void selectTopDropdown(String dropdownID){
        driver.findElement(By.id(dropdownID)).click();
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
    }

    private void searchAndSelectTopDropdown(String dropdownID, String search){
        driver.findElement(By.id(dropdownID)).click();
        driver.findElement(By.xpath("//*[@id=\"uf_domicile\"]/div/input")).sendKeys(search);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2018-04-27");
    }

    private void validateUmbrellaFundsDataGridHeadings(String [] umbrellaFundsHeadings) {
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div")).isDisplayed());
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/button")).getText().contentEquals(umbrellaFundsHeadings[0]));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/button")).getText().contentEquals(umbrellaFundsHeadings[1]));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[3]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[3]/div/button")).getText().contentEquals(umbrellaFundsHeadings[2]));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[4]/div/button")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[4]/div/button")).getText().contentEquals(umbrellaFundsHeadings[3]));
    }

    private void validatePageLayout() {
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-align-left")));
        assertTrue(isElementPresent(By.id("am-product-home")));
        assertTrue(driver.findElement(By.id("am-product-home")).getText().contentEquals("Shares / Funds / Umbrella funds"));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[1]/h1/span")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[2]/div/div")).getText().contentEquals("Display only active Shares"));
        assertTrue(isElementPresent(By.id("switchActiveShares")));
        assertTrue(driver.findElement(By.id("switchActiveShares")).isEnabled());
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[1]")).getText().contentEquals("Shares"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-right.rotate")));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[2]/div[1]/div[2]")).getText().contentEquals("Add new Share"));

        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[1]")).getText().contentEquals("Funds"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-right.rotate")));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[3]/div[1]/div[2]")).getText().contentEquals("Add new Fund"));

        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[1]/div[1]")).getText().contentEquals("Umbrella funds"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-right.rotate")));
        assertTrue(isElementPresent(By.xpath("//app-ofi-am-product-home/div[4]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.xpath("//app-ofi-am-product-home/div[4]/div[1]/div[2]")).getText().contentEquals("Add new Umbrella fund"));
    }

}
