package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.Wallet;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import src.WebSocketAPITests.io.setl.Container;

import java.io.IOException;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;


public class WalletHelper {


public static Wallet createWalletAndCaptureDetails(String localAddress,
                              String account,
                              String walletName,
                              String email,
                              String walletType,
                              String password,
                              int userId,
                              String apiKey
                               )
                               throws InterruptedException{
  Container<Wallet> container = new Container<>();

    RestApi api = new RestApi(localAddress);

  api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newWallet(walletName,
                                         email,
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        ""), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      try {
        Wallet Wallet = JsonToJava.convert(resp.toString(), Wallet.class);
        container.setItem(Wallet);
      } catch (IOException e) {
        e.printStackTrace();
      }

    });

  return container.getItem();
  }

  public static void createWalletSuccess(String localAddress,
                                       String account,
                                       String walletName,
                                       String email,
                                       String walletType,
                                       String password,
                                       int userId,
                                       String apiKey
                               )
                               throws InterruptedException {


    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newWallet(walletName,
                                         email,
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        ""), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });

  }

  public static void createWalletFailure(String localAddress,
                                       String account,
                                       String walletName,
                                       String email,
                                       String walletType,
                                       String password,
                                       int userId,
                                       String apiKey
                               )
                               throws InterruptedException {


    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newWallet(walletName,
                                         email,
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        ""), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue("Wallet Name / Email Address already exists.".equals(resp.get("Message")));
    });

  }

  public static void deleteWalletSuccess(String localAddress, String walletID, int userId, String apiKey) {

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteWallet(walletID), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      String deletedWallet = resp.get("WalletID").toString();
      assertTrue("OK".equals(resp.get("Status")));
      assertTrue(deletedWallet.equals(walletID));
    });

  }

  public static void deleteWalletError(String localAddress, String walletID, int userId, String apiKey) {

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteWallet(walletID), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
    });

  }

}
