package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForLinkText;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.*;
import static junit.framework.TestCase.assertEquals;
import static org.apache.commons.lang3.StringUtils.trim;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class ChainDetailsHelper extends LoginAndNavigationHelper {


    public static void populateNewChainFields(String chainId, String chainName) throws InterruptedException {
        enterChainId(chainId);
        enterChainName(chainName);
        submitChainDetails();

    }

    public static void populateChainAccessFields(String chainIdIndex, String memberIndex, String memberTypeIndex, String walletNodeIndex) throws InterruptedException {
        selectChain(chainIdIndex);
        selectMember(memberIndex);
        selectMemberType(memberTypeIndex);
        selectWalletNode(walletNodeIndex);
        saveChainAccess();
        verifyPopupMessageText("Updated Successfully", "Chain Access Success Message not displayed ");
    }


    public static void selectChainForUser(String user, String userID, String chainId) throws InterruptedException {
        selectNewPageToNavigateTo("menu_um");
        navigateToEditUserViaSearch(user);
        navigateToUserChainsTab();
        selectUserChain(userID, chainId);
        submitUserChainSelections();
        verifyPopupMessageText("Updated Successfully", "Chain Updated Success Message not displayed ");
    }

    public static void navigateToAddNewChainTab() throws InterruptedException {
        String text = "Add New Chain";
        WebElement link = driver.findElement(By.linkText(text));
        waitForLinkText(text, link);
        link.click();
    }

    private static void enterChainId(String chainId) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement chainIdField = driver.findElement(By.cssSelector("input.form-control.chainID"));
            wait.until(visibilityOf(chainIdField));
            wait.until(elementToBeClickable(chainIdField));
            chainIdField.clear();
            chainIdField.sendKeys(chainId);
        } catch (Exception e) {
            System.out.println("Chain Id field not ready " + e.getMessage());
        }
    }

    private static void enterChainName(String chainName) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement chainNameField = driver.findElement(By.cssSelector("input.form-control.chainName"));
            wait.until(visibilityOf(chainNameField));
            wait.until(elementToBeClickable(chainNameField));
            chainNameField.clear();
            chainNameField.sendKeys(chainName);
        } catch (Exception e) {
            System.out.println("Chain Id field not ready " + e.getMessage());
        }
    }

    private static void submitChainDetails() {
        driver.findElement(By.xpath("(//button[@type='submit'])[3]")).click();
    }


    public static void navigateToChainSearchTab() throws InterruptedException {
        for (int second = 0; ; second++) {
            if (second >= 3) fail("Chain Search Tab not found");
            try {
                if ("Search".equals(driver.findElement
                        (By.xpath("//a[contains(@href, '#chain-tab-1')]")).getText()))
                    break;
            } catch (Exception e) {
            }
            Thread.sleep(100);
        }
        driver.findElement(By.xpath("//a[contains(@href, '#chain-tab-1')]")).click();
    }

    public static void searchForChain(String chainId) throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement chainPage = driver.findElement(By.id("menu_chains"));
            wait.until(visibilityOf(chainPage));
            wait.until(elementToBeClickable(chainPage));
            chainPage.click();
            driver.findElement(By.cssSelector("#chain-search > a")).click();
            driver.findElement(By.cssSelector("#chain-table_filter > label > input.form-control.input-sm")).clear();
            driver.findElement(By.cssSelector("#chain-table_filter > label > input.form-control.input-sm")).sendKeys(chainId);
        } catch (Exception e) {
            System.out.println("Chain page not ready " + e.getMessage());
        }
    }

    public static void confirmNoChain() {
        assertTrue(isElementPresent(By.cssSelector("td.dataTables_empty")));
    }

    public static void confirmChainSearchResults(String expected) {
        assertEquals(expected, driver.findElement(By.cssSelector("td.chainName")).getText());
    }

    public static void actionChainDeletion(String button) throws InterruptedException {

        for (int second = 0; ; second++) {
            if (second >= 5) fail("timeout");
            try {
                if (isElementPresent(By.xpath("//table[@id='chain-table']/tbody/tr/td/div/button"))) break;
            } catch (Exception e) {
            }
            Thread.sleep(500);
        }

        driver.findElement(By.xpath("//table[@id='chain-table']/tbody/tr/td/div/button[" + button + "]")).click();
    }

    public static String[] generateRandomChainDetails() {
        String chainId = RandomStringUtils.randomNumeric(9);
        //trim leading zeroes
        chainId = trim(chainId.replaceFirst("^0+(?!$)", ""));
        String chainName = "Test_Chain_" + chainId;
        return new String[]{chainId, chainName};
    }

    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
}
