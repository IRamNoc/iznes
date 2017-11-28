package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = Timeout.seconds(300);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }
    @Test
    public void shouldLandOnLoginPage() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
    }
    @Test
    public void shouldCreateFundAsAMViewAsInvestor() throws  IOException, InterruptedException {
        double value = Math.random() * 501;
        int rounded = (int) Math.round(value);

        loginAndVerifySuccess("am", "alex01");
        System.out.println(rounded);
        navigateToDropdown("menu-product-module");
        navigateToPage("product-fund");
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/section/button")).click();
        driver.findElement(By.id("fundName")).sendKeys("TestFundJordan" + rounded);
        driver.findElement(By.id("fundLei")).sendKeys("TestFundJordan" + rounded);
        Thread.sleep(20000);

    /*
        AM creates fund
        Logout
        Investor login
        Navigate to list of funds
        See fund AM created
    */


    }
    @Test
    public void shouldNotAcceptFundWithQuantityLowerThan0() throws IOException, InterruptedException {
    /*
        Login as AM
        Edit a fund characteristic
        Store decimalisation value

        Login as Investor
        List of funds
        Subscribe to the same fund
        Set quantity 1 order of magnitude smaller than stored decimalisation
        Save
     */
    }
    @Test
    public void shouldNotAcceptFundWithQuantityLowerThan10() throws IOException, InterruptedException {
        /*

         */
    }
  }
