package com.setl.openCSDClarityTests.UI.Iznes4General;

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
import org.openqa.selenium.support.ui.WebDriverWait;


import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyFundOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


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
    public void shouldAssertThatFundsTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatFundShareTableDisplaysAllInformation(){
    }

    @Test
    @Ignore ("Waiting for ID's to be placed on Expandable fields as Xpath is dynamic")
    public void shouldAssertThatUmbrellaFundsHas2ExpandableFields() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectUmbrellaFund();
        verifyOptInfoPageContents();
        verifyUmbrellaFundMainInfoPageContents();
    }

    @Test
    @Ignore("Plans to revisit")
    public void shouldAssertThatFundsHas2ExpandableFields() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver,timeoutInSeconds);
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        int fundCount = createFund();
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        scrollElementIntoViewById("fund-submitfund-btn");
        wait.until(visibilityOfElementLocated(By.id("fund-submitfund-btn")));
        wait.until(elementToBeClickable(By.id("fund-submitfund-btn")));
        driver.findElement(By.id("fund-submitfund-btn")).click();
        selectFund(fundCount);
        verifyFundDropdownElements(fundCount);
        verifyFundMainInfoPageContents();
        verifyFundOptInfoPageContents();
    }

    private int createFund() throws InterruptedException {

        selectAddUmbrellaFund();
        String [] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], generateRandomLEI());
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");

        //Store title number count for Funds

        driver.findElement(By.id("mcBtnSubmitForm")).click();
        String fundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCount = Integer.parseInt(fundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(fundCount + " funds are displayed in the funds table");

        //Navigate to fund creation and create a fund with umbFund

        String [] uFundDetails = generateRandomFundsDetails();

        //fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetails(uFundDetails[0], umbFundDetails[0]);
        return fundCount;
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
}
