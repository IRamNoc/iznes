package com.setl.UI.common.SETLUtils;

import org.apache.commons.io.FileUtils;
import org.junit.rules.ExternalResource;
import org.junit.rules.TestRule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;

public class TestMethodPrinterRule implements TestRule {

    private OutputStream out = null;
    private final TestMethodPrinter printer = new TestMethodPrinter();

    private String beforeContent = null;
    private String afterContent = null;
    private long timeStart;
    private long timeEnd;

    public TestMethodPrinterRule(OutputStream os) {
        out = os;
    }

    private class TestMethodPrinter extends ExternalResource {
        @Override
        protected void before() throws Throwable {
            timeStart = System.currentTimeMillis();
            out.write(beforeContent.getBytes());
        }


        @Override
        protected void after() {
            try {
                timeEnd = System.currentTimeMillis();
                double seconds = (timeEnd-timeStart)/1000.0;
                out.write((afterContent+"Time elapsed: "+new DecimalFormat("0.000").format(seconds)+" sec\n").getBytes());
            } catch (IOException ioe) { /* ignore */
            }
        }
    }

    public final Statement apply(Statement statement, Description description) {
        beforeContent = "\n[TEST " + description.getMethodName()+ " STARTING] "+"\n"; // description.getClassName() to get class name
        afterContent =  "[TEST ENDED] ";
        return printer.apply(statement, description);
    }
}
