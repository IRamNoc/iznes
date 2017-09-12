package org.junit.internal.builders;

        import custom.junit.runners.OrderedJUnit4ClassRunner;
        import org.junit.runner.Runner;
        import org.junit.runners.BlockJUnit4ClassRunner;
        import org.junit.runners.model.RunnerBuilder;

/**
 * This must come first on the classpath before JUnit 4's jar so it
 * is instantiated instead of the default JUnit 4 builder.
 */
public class JUnit4Builder extends RunnerBuilder {
    @Override
    public Runner runnerForClass(Class<?> testClass) throws Throwable {

        // Using Class Runner with sorting of test methods:
        // sorting in order as they are in java code.
        return new OrderedJUnit4ClassRunner(testClass);

        // JUnit Original Class Runner
        // return new BlockJUnit4ClassRunner(testClass);
    }
}
