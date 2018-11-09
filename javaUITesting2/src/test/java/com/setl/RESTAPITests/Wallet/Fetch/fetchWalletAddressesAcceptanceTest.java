package com.setl.RESTAPITests.Wallet.Fetch;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class fetchWalletAddressesAcceptanceTest {

  @Rule
  public Timeout globalTimeout = new Timeout(30000);

  String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
    int userId = 9;
    String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";
    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }


    @Test
    @Ignore
    public void fetchWalletAddresses() throws ExecutionException, InterruptedException {


        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
/*
        api.sendMessage(msfFactory.addresses(), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            System.out.println(response);
            assertEquals(userId, response.get("userID"));
            assertEquals(3, response.get("walletID"));
            assertEquals(3, response.get("permission"));
            assertTrue("".equals(response.get("permissionDetail")));
            assertEquals(3, response.get("accountID"));
            assertTrue("AMWallet".equals(response.get("walletName")));
            assertTrue("FgPKlXh/MDru8FWQM/vPKk8nV/XmbxPSkEZkOBzyF14=".equals(response.get("commuPub")));
            assertEquals(3, response.get("walletType"));
            assertEquals(0, response.get("walletLocked"));
            assertEquals(null,(response.get("walletTypeName")));
            assertEquals(null,(response.get("GLEI")));
            assertEquals(null,(response.get("bankWalletID")));
            assertEquals(null,(response.get("CorrespondenceAddressD")));
        });*/

    }
  }

