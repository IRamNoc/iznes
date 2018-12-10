package com.setl.UI.common.SETLUtils;

import org.apache.commons.io.FileUtils;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;

public class ScreenshotRule2 extends TestWatcher {
    private WebDriver driver = null;

    public ScreenshotRule2() {
    }

    public void setDriver(WebDriver driver) {
        this.driver = driver;

    }

    @Override
    protected void failed(Throwable e, Description description) {
        try {
            TakesScreenshot takesScreenshot = (TakesScreenshot) driver;
            File scrFile = takesScreenshot.getScreenshotAs(OutputType.FILE);
            File destFile = getDestinationFile(description);

            FileUtils.copyFile(scrFile, destFile);
        } catch (IOException ioe) {
            throw new RuntimeException(ioe);
        }
    }

    @Override
    protected void succeeded(Description description) {

    }

    @Override
    protected void finished(Description description){
        //Always gets called after any test
        driver.close();
        driver.quit();
    }

    private File getDestinationFile(Description description) {
        String OS = System.getProperty("os.name");
        String dir;
        if (OS.equals("Mac OS X")){
            dir = "/Users/shared/screenshots//";
        }
        else {//Directs to IznesEntireFlow Jenkins Project
            dir = "/var/lib/jenkins/workspace/IznesEntireFlowTest/target/test-attachments//";
        }
        String userDirectory = dir;

        String fileName = description.getClassName() + "." + description.getMethodName() + "." + "screenshot.jpg";
        String absoluteFileName = userDirectory + "/" + fileName;

        return new File(absoluteFileName);
    }
}


