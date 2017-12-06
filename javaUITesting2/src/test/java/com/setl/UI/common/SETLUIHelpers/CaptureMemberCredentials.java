package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.openqa.selenium.By.cssSelector;
import static org.openqa.selenium.By.xpath;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

public class CaptureMemberCredentials {


    public CaptureMemberCredentials() throws InterruptedException {
        WebElement credentials = driver.findElement(By.xpath("//div[@id='myModal']/div/div/div"));
            try {
            WebDriverWait wait = new WebDriverWait(driver , timeoutInSeconds);
                wait.until(visibilityOf(credentials));
            } catch (Exception e) {
                System.out.println("Member Credentials Modal not displayed " + e );
            }
    }

    public static String getMemberName() {
        return String.valueOf(driver.findElement(cssSelector("p.form-control-static")).getText());
    }

    public static String getAccountName() {
        return String.valueOf(driver.findElement(xpath("//div[@id='myModal']/div/div/div[2]/div/div[3]/div/p")).getText());
    }

    public static String getMemberEmail() {
        return String.valueOf(driver.findElement(xpath("//div[@id='myModal']/div/div/div[2]/div/div[4]/div/p")).getText());
    }

    public static String getNewMemberAdminUserName() throws InterruptedException {
        WebElement adminUserName = null;
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            adminUserName = wait.until(visibilityOfElementLocated(By.xpath("//div[@id='myModal']/div/div/div[2]/div/div[5]/div/p")));
        }catch(Exception e) {
            System.out.println("Admin User Name not present" + e.getMessage());
        }
        return String.valueOf(adminUserName.getText());
    }

    public static String getNewMemberAdminUserPassword() throws InterruptedException {
        WebElement adminUserPassword = null;
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            adminUserPassword = wait.until(visibilityOfElementLocated(By.cssSelector("input.auth-token.form-control-static")));
        } catch (Exception e) {
            System.out.println("Admin User Password not present " + e.getMessage());
        }
        return String.valueOf(adminUserPassword.getAttribute("value"));
    }

    public static String getNewMemberAdminUsername() throws InterruptedException {
        WebElement adminUsername = null;
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            adminUsername = wait.until(visibilityOfElementLocated(By.cssSelector("input.auth-token.form-control-static")));
        } catch (Exception e) {
            System.out.println("Admin User Password not present " + e.getMessage());
        }
        return String.valueOf(adminUsername.getAttribute("value"));
    }

}