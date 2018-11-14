package com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;

import java.io.IOException;
import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSD4FundFlowAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(90000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBToProdOff();
        setDBTwoFAOff();
    }

    @After
    public void tearDown() throws Exception {
        setDBToProdOn();
    }

    @Test
    public void shouldTestEntireFundFlow() throws InterruptedException, SQLException, IOException {

        String umbFundDetails = generateRandomUmbrellaFundName();
        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        String randomLEI = generateRandomLEI();
        String randomLEI2 = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry(umbFundDetails, randomLEI);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(umbFundDetails);
        getUmbrellaTableRow(0, umbFundDetails, randomLEI, "Management Company", "Jordan");
        fillOutFundDetailsStep1("yes", umbFundDetails);
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI2);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        getFundTableRow(0, uFundDetails[0], randomLEI2, "EUR", "Management Company", "Afghanistan","Contractual Fund", umbFundDetails);
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        searchSharesTable(uShareDetails[0]);
        getShareTableRow(0, uShareDetails[0], uIsin[0], uFundDetails[0], "EUR", "Management Company", "", "share class", "Open" );
    }

}
