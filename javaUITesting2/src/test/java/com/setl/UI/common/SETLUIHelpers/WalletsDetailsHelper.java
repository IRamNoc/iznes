package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class WalletsDetailsHelper extends LoginAndNavigationHelper {

    public static String populateNewWalletFields(String walletName, String accountIndex, String walletTypeIndex) throws InterruptedException {
        enterWalletName(walletName);
        selectAccount(accountIndex);
        selectWalletType(walletTypeIndex);
        submitWalletDetails();
        return walletName;
    }

    public static String populateNewWalletFieldsFromLEISearch(String LEI, String walletName, String accountIndex, String walletTypeIndex) throws InterruptedException {
        navigateToSelectWalletFromLEISearch();
        selectLEIFromLEISearch(LEI);
        navigateToWalletCreation();
        enterWalletName(walletName);
        selectAccount(accountIndex);
        selectWalletType(walletTypeIndex);
        submitWalletDetailsFromLEISearch();
        return walletName;
    }

    private static void navigateToSelectWalletFromLEISearch() {
        assertEquals("Legal Entities Search Button not displayed", "Create From LEI Search", driver.findElement(By.xpath("(//button[@type='submit'])[12]")).getText());
        driver.findElement(By.xpath("(//button[@type='submit'])[12]")).click();
        driver.findElement(By.id("leiSearch-btn")).click();
    }

    public static void selectLEIFromLEISearch(String LEI) {
        WebElement search = driver.findElement(By.id("lei-search-input"));
        search.clear();
        search.sendKeys(LEI);
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement leiButton = driver.findElement(By.xpath("//table[@id='legalentities-table']/tbody/tr/td/div/button"));
            wait.until(visibilityOf(leiButton));
            wait.until(elementToBeClickable(leiButton));
            leiButton.click();
        } catch (NoSuchElementException n) {
            System.out.println("Element not present " + n.getMessage());
        } catch (ElementNotVisibleException v) {
            System.out.println("Element not clickable " + v.getMessage());
        } catch (ElementNotSelectableException s) {
            System.out.println("Element not clickable " + s.getMessage());
        } catch (TimeoutException t) {
            System.out.println("Element not ready " + t.getMessage());
        }
    }

    private static void navigateToWalletCreation() {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement walletCreateButton = driver.findElement(By.xpath("(//button[@type='submit'])[7]"));
            wait.until(visibilityOf(walletCreateButton));
            wait.until(elementToBeClickable(walletCreateButton));
            walletCreateButton.click();
        }catch(Exception e){
            System.out.println("Wallet creation button not present " + e.getMessage());
        }
    }

    public static void navigateToAddNewWalletTab() {
       try{
          WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
          WebElement link = driver.findElement(By.linkText("Add New Wallet"));
          wait.until(visibilityOf(link));
          wait.until(elementToBeClickable(link));
          link.click();
       }catch(Exception e){
           System.out.println("Add New Wallet link not ready" + e.getMessage());
       }
    }

    private static void enterWalletName(String walletName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement wallet = driver.findElement(By.cssSelector("input.form-control.newwalletname"));
        wait.until(visibilityOf(wallet));
        wallet.clear();
        wallet.sendKeys(walletName);
    }

    private static void selectAccount(String accountIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#manage-wallet-tab-2 .chosen-select.account').val('" + accountIndex + "').trigger('chosen:updated').trigger('change')");

    }

    private static void selectWalletType(String walletTypeIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#manage-wallet-tab-2 .chosen-select.wallettype').val('" + walletTypeIndex + "').trigger('chosen:updated').trigger('change')");
    }

    private static void submitWalletDetails() throws InterruptedException {
        try {
            WebElement submitButton = driver.findElement(By.xpath("(//button[@type='submit'])[13]"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();

        } catch (Exception e) {
            System.out.println("Wallet Details Submit button not found" + e);
            throw e;
        }
    }

    private static void submitWalletDetailsFromLEISearch() throws InterruptedException {
        try {
            WebElement submitButton = driver.findElement(By.xpath("(//button[@type='submit'])[16]"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();

        } catch (Exception e) {
            System.out.println("Wallet Details Submit From LEI search button not found " + e);
            throw e;
        }
    }

    public static void actionWalletDeletion(String button) throws InterruptedException {
        try {
            WebElement deleteButton = driver.findElement(By.xpath("//table[@id='manage-wallet-table']/tbody/tr/td/div/button[" + button + "]"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(deleteButton));
            wait.until(elementToBeClickable(deleteButton));
            deleteButton.click();

            } catch (Exception e) {
                System.out.println("Delete Wallet button is not ready " + e);
                throw e;
            }
    }

    public static void searchForWallet(String wallet) throws InterruptedException {
        selectNewPageToNavigateTo("menu_wallets");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(elementToBeClickable(By.cssSelector("#manage-wallet-search > a")));
        driver.findElement(By.cssSelector("#manage-wallet-search > a")).click();
        driver.findElement(By.cssSelector("#manage-wallet-table_filter > label > input.form-control.input-sm")).clear();
        driver.findElement(By.cssSelector("#manage-wallet-table_filter > label > input.form-control.input-sm")).sendKeys(wallet);
    }

    public static void navigateToWalletSearchTab() throws InterruptedException {
        for (int second = 0; ; second++) {
            if (second >= 3) fail("Wallet Search Tab not found");
            try {
                if ("Search".equals(driver.findElement
                        (By.xpath("//a[contains(@href, '#manage-wallet-tab-1')]")).getText()))
                    break;
            } catch (Exception e) {
                System.out.println("Wallet Search Tab not found " + e);
            }
            Thread.sleep(100);
        }
        driver.findElement(By.xpath("//a[contains(@href, '#manage-wallet-tab-1')]")).click();
    }

    public static void confirmNoWallet() {
        assertTrue("Wallet has not been deleted" ,isElementPresent(By.cssSelector("td.dataTables_empty")));
    }

    public static void confirmSingleSearchResult(String expected) {
        assertEquals(expected, driver.findElement(By.xpath("//*[@id='manage-wallet-table']/tbody/tr/td[2]")).getText());
    }

    public static void confirmSearchResults(String expectedWallet, String expectedAccount, String row) {
        assertEquals(expectedWallet, driver.findElement(By.xpath("//*[@id='manage-wallet-table']/tbody/tr[" + row + "]/td[2]")).getText());
        assertEquals(expectedAccount, driver.findElement(By.xpath("//*[@id='manage-wallet-table']/tbody/tr[" + row + "]/td[3]")).getText());

    }

    public static void confirmWalletType(String expectedWallet, String expectedType) {
        assertEquals(expectedType, driver.findElement(By.xpath("//*[@id='manage-wallet-table']/tbody/tr/td[4]")).getText());
    }

    public static String generateRandomWalletName() {
        String walletName = "Test_Wallet_" + RandomStringUtils.randomAlphabetic(9);
        return walletName;
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
