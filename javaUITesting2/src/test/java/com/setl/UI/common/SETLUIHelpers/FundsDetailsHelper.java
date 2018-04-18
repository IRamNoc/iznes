package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class FundsDetailsHelper extends LoginAndNavigationHelper {

    public static String[] generateRandomUmbrellaFundsDetails() {
        String str = randomAlphabetic(5);
        String umbrellaFundName = "Test_Umbrella_Fund_" + str;
        return new String[] {umbrellaFundName};
    }

    public static void selectAddUmbrellaFund(){
        driver.findElement(By.id("new-umbrella-fund-btn")).click();
        try{
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a New Umbrella Fund"));
        }catch (Exception e){
            fail("Page heading text was not correct : " + e.getMessage());
        }
    }

    public static void fillUmbrellaDetailsNotCountry(String fundName) throws InterruptedException {
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(fundName);
        driver.findElement(By.id("uf_lei")).sendKeys("testLei");
        driver.findElement(By.id("uf_registerOffice")).sendKeys("testOffice");
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys("testAddress");
        searchAndSelectTopDropdown("uf_managementCompany", "Management Company");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_investmentAdvisor");
        selectTopDropdown("uf_fundAdministrator");
        selectTopDropdown("uf_investmentManager");
        selectTopDropdown("uf_payingAgent");
    }

    public static void submitUmbrellaFund() throws InterruptedException {
        try {
            driver.findElement(By.id("mcBtnSubmitForm")).click();
        }catch (Exception e){
            fail("Save button was not clicked. " + e.getMessage());
        }
    }

    public static void selectTopDropdown(String dropdownID) throws InterruptedException {
        try {
            driver.findElement(By.xpath("//*[@id='" + dropdownID + "']/div")).click();
        }catch (Exception e){
            fail("this step failed.");
        }
        try {
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li/div/a")).click();
        }catch (Exception e){
            fail("dropdown not selected..: " + e.getMessage());
        }
    }

    public static void searchAndSelectTopDropdown(String dropdownID, String search) throws InterruptedException {
        driver.findElement(By.xpath("//*[@id=\'" + dropdownID + "\']/div")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\'"+ dropdownID + "\']/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).clear();
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2018-04-27");
    }

}
