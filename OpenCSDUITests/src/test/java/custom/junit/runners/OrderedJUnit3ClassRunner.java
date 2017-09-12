package custom.junit.runners;

import custom.junit.framework.OrderedTestSuite;
import junit.framework.Test;
import junit.framework.TestCase;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.internal.runners.JUnit38ClassRunner;

public class OrderedJUnit3ClassRunner extends JUnit38ClassRunner {

    private static final Logger logger = LogManager.getLogger(OrderedJUnit3ClassRunner.class.getName());

    public OrderedJUnit3ClassRunner(Class<?> aClass) {
        this(new OrderedTestSuite(aClass.asSubclass(TestCase.class)));
    }

    public OrderedJUnit3ClassRunner(Test test) {
        super(test);
        logger.info("Using custom JUNIT CLASS RUNNER: " + this.getClass().getCanonicalName());
    }
}