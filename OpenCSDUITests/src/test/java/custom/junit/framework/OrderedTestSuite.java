
package custom.junit.framework;

import custom.junit.runners.MethodComparator;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class OrderedTestSuite extends TestSuite {

    private static final Logger logger = LogManager.getLogger(OrderedTestSuite.class.getName());

    public OrderedTestSuite(final Class<?> theClass) {
        addTestsFromTestCase(theClass);
    }

    /**
     * Adds the tests from the given class to the suite
     */
    @Override
    public void addTestSuite(Class<? extends TestCase> testClass) {
        addTest(new OrderedTestSuite(testClass));
    }

    private void addTestsFromTestCase(final Class<?> theClass) {
        this.setName(theClass.getName());
        try {
            getTestConstructor(theClass); // Avoid generating multiple error messages
        } catch (NoSuchMethodException e) {
            addTest(warning("Class " + theClass.getName() + " has no public constructor TestCase(String name) or TestCase()"));
            return;
        }

        if (!Modifier.isPublic(theClass.getModifiers())) {
            addTest(warning("Class " + theClass.getName() + " is not public"));
            return;
        }

        Class<?> superClass = theClass;
        List<String> names = new ArrayList<String>();
        while (Test.class.isAssignableFrom(superClass)) {
            Method[] methods = superClass.getDeclaredMethods();

            // Sorting methods.
            final List<Method> methodList = new ArrayList<Method>(Arrays.asList(methods));
            try {
                Collections.sort(methodList, MethodComparator.getMethodComparatorForJUnit3());
                methods = methodList.toArray(new Method[methodList.size()]);
            } catch (Throwable throwable) {
                logger.fatal("addTestsFromTestCase(): Error while sorting test cases! Using default order (random).", throwable);
            }

            for (Method each : methods) {
                addTestMethod(each, names, theClass);
            }
            superClass = superClass.getSuperclass();
        }
        if (this.testCount() == 0)
            addTest(warning("No tests found in " + theClass.getName()));
    }

    private void addTestMethod(Method m, List<String> names, Class<?> theClass) {
        String name = m.getName();
        if (names.contains(name))
            return;
        if (!isPublicTestMethod(m)) {
            if (isTestMethod(m))
                addTest(warning("Test method isn't public: " + m.getName() + "(" + theClass.getCanonicalName() + ")"));
            return;
        }
        names.add(name);
        addTest(createTest(theClass, name));
    }

    private boolean isPublicTestMethod(Method m) {
        return isTestMethod(m) && Modifier.isPublic(m.getModifiers());
    }

    private boolean isTestMethod(Method m) {
        return m.getParameterTypes().length == 0 && m.getName().startsWith("test") && m.getReturnType().equals(Void.TYPE);
    }
}