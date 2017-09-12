package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForLinkText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class WalletNodesDetailsHelper extends LoginAndNavigationHelper {

    public static void populateNewWalletNodesFields(String nodeName, String nodeIpAddress, String nodePath, String nodePort, String chainIndex) throws InterruptedException {
        enterNodeName(nodeName);
        enterNodeIpAddress(nodeIpAddress);
        enterNodePath(nodePath);
        enterNodePort(nodePort);
        selectChain(chainIndex);
        submitWalletNodeDetails();
    }

    public static void navigateToAddNewWalletNodeTab() throws InterruptedException {
        String text = "Add New Wallet Node";
        WebElement link = driver.findElement(By.linkText(text));
        waitForLinkText(text, link);
        link.click();
        }

    private static void enterNodeName(String nodeName) {
        driver.findElement(By.cssSelector("input.form-control.nodename")).clear();
        driver.findElement(By.cssSelector("input.form-control.nodename")).sendKeys(nodeName);
    }

    private static void enterNodeIpAddress(String nodeIpAddress) {
        driver.findElement(By.cssSelector("input.form-control.nodeaddress")).clear();
        driver.findElement(By.cssSelector("input.form-control.nodeaddress")).sendKeys(nodeIpAddress);
    }

    private static void enterNodePath(String nodePath) {
        driver.findElement(By.cssSelector("input.form-control.nodepath")).clear();
        driver.findElement(By.cssSelector("input.form-control.nodepath")).sendKeys(nodePath);
    }

    private static void enterNodePort(String nodePort) {
        driver.findElement(By.cssSelector("input.form-control.nodeport")).clear();
        driver.findElement(By.cssSelector("input.form-control.nodeport")).sendKeys(nodePort);
    }

    private static void selectChain(String chainIndex) {
        try {
            assertTrue(isElementPresent(By.linkText("choose chains...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }

        driver.findElement(By.xpath(".//*[@id='walletnode-tab-2']/div/form/div/div[6]/div/div/a/span")).click();
        String xpathTochain = ".//*[@id='walletnode-tab-2']/div/form/div/div[6]/div/div/div/ul/li[" + chainIndex + "]";

        driver.findElement(By.xpath(xpathTochain)).click();
    }

    private static void submitWalletNodeDetails() throws InterruptedException {
            try {
                WebElement walletNodeDetailsButton = driver.findElement(By.xpath("(//button[@type='submit'])[4]"));
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                wait.until(visibilityOf(walletNodeDetailsButton));
                wait.until(elementToBeClickable(walletNodeDetailsButton));
                walletNodeDetailsButton.click();

            } catch (Exception e) {
                System.out.println("Wallet Node Success not ready " + e);
            }
    }

    private static void handleSuccessfulWalletNodeCreationAlert() throws InterruptedException {
        for (int second = 0; ; second++) {
            if (second >= 2) fail("Add Wallet Node confirmation dialogue not displayed");
            try {
                if ("Add Wallet Node Successfully".equals(driver.findElement(By.xpath("//div[20]/p")).getText()))
                    break;
            } catch (Exception e) {
                System.out.println("Add Wallet Node confirmation dialogue not displayed " + e);
            }
            Thread.sleep(200);
        }
        driver.findElement(By.cssSelector("button.confirm")).click();
    }

    public static String[] generateRandomWalletNodeDetails() {
        String str = RandomStringUtils.randomAlphanumeric(6);
        String walletNodeId ="Test_Wallet_Node" + str;
        String nodePath =  walletNodeId + "path";
        return new String[] {walletNodeId, nodePath};
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
