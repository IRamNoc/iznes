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
}
