package com.setl.WebSocketAPITests.User.Initialisation;

import custom.junit.runners.OrderedJUnit4ClassRunner;
import io.setl.wsclient.shared.ResponseHandler;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(OrderedJUnit4ClassRunner.class)
public class initialiseUserAcceptanceTest {

    public static ResponseHandler print  = js -> js.toJSONString();

    @Before
    public void setUp() throws Exception
    {
    }

    @Test
    public void initialiseUser(){


    }

}
