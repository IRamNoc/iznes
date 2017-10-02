package custom.junit.runners;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.InitializationError;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OrderedJUnit4ClassRunner extends BlockJUnit4ClassRunner {

    private static final Logger logger = LogManager.getLogger(OrderedJUnit4ClassRunner.class.getName());

    public OrderedJUnit4ClassRunner(Class aClass) throws InitializationError {
        super(aClass);
        logger.info("Using custom JUNIT CLASS RUNNER: " + this.getClass().getCanonicalName());
    }

    @Override
    protected List<FrameworkMethod> computeTestMethods() {
        final List<FrameworkMethod> list = super.computeTestMethods();
        try {
            final List<FrameworkMethod> copy = new ArrayList<FrameworkMethod>(list);
            Collections.sort(copy, custom.junit.runners.MethodComparator.getFrameworkMethodComparatorForJUnit4());
            return copy;
        } catch (Throwable throwable) {
            logger.fatal("computeTestMethods(): Error while sorting test cases! Using default order (random).", throwable);
            return list;
        }
    }
}

