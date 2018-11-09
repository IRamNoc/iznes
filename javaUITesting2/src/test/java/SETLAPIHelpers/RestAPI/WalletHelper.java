package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.Container;
import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.Wallet;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;


public class WalletHelper {


    static RestApi<MemberNodeMessageFactory> api;


    public static Wallet createWalletAndCaptureDetails(String localAddress,
                                                       String account,
                                                       String walletName,
                                                       String email,
                                                       String walletType,
                                                       String password,
                                                       int userId,
                                                       String apiKey
    )
        throws InterruptedException {
        Container<Wallet> container = new Container<>();

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());


        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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


        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.deleteWallet(walletID), claim -> {
            Map resp = claim.get("data").asList(Map.class).get(0);
            String deletedWallet = resp.get("WalletID").toString();
            assertTrue(deletedWallet.equals(walletID));
        });

    }

    public static void deleteWalletError(String localAddress, String walletID, int userId, String apiKey) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.deleteWallet(walletID), claim -> {
            Map resp = claim.get("data").asList(Map.class).get(0);
            assertTrue("Fail".equals(resp.get("Status")));
        });

    }

    public static void validateWalletCreation(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
        });

    }

    public static void validateLegalEntityWalletCreationBasic(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType, String LEI, String UID, String URL, String incDate) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(LEI, lastEntry.get("GLEI"));
            assertEquals(UID, lastEntry.get("uid"));
            assertEquals(URL, lastEntry.get("websiteURL"));
            String incISODate = incDate + " 00:00:00";
           // LocalDateTime datetime = LocalDateTime.parse(oldstring, DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
           // String newstring = datetime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
           // System.out.println("New String = " + newstring);
            assertEquals(incISODate, lastEntry.get("incorporationDate"));
        });
    }


    public static void validateLegalEntityWalletCreationAllDetails(String localAddress, int userId, String apiKey, String walletName, String accountName,
                                                                   int accountType, String LEI, String UID, String URL, String incDate, String country,
                                                                   String addressPrefix, String address1, String address2, String address3, String address4, String postcode) {
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(LEI, lastEntry.get("GLEI"));
            assertEquals(UID, lastEntry.get("uid"));
            assertEquals(URL, lastEntry.get("websiteURL"));
            String incISODate = incDate + " 00:00:00";
            assertEquals(incISODate, lastEntry.get("incorporationDate"));

            assertEquals(country, lastEntry.get("country"));
            assertEquals(addressPrefix, lastEntry.get("addressPrefix"));
            assertEquals(address1, lastEntry.get("address1"));
            assertEquals(address2, lastEntry.get("address2"));
            assertEquals(address3, lastEntry.get("address3"));
            assertEquals(address4, lastEntry.get("address4"));
            assertEquals(postcode, lastEntry.get("postalCode"));
        });
    }

    public static void validateIndividualWalletCreationAllDetails(String localAddress, int userId, String apiKey, String walletName, String accountName,
                                                                   int accountType, String aliases, String formerName, String idCard, String bankName, String bankBicCode, String bankAccountName, String bankAccountNum, String rdaCountry,
                                                                   String rdaAddressPrefix, String rdaAddress1, String rdaAddress2, String rdaAddress3, String rdaAddress4, String rdaPostcode, String caCountry,String caAddressPrefix,
                                                                  String caAddress1, String caAddress2, String caAddress3, String caAddress4, String caPostcode, String bdCountry, String bdAddressPrefix, String bdAddress1, String bdAddress2,
                                                                  String bdAddress3, String bdAddress4, String bdPostcode) {
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));

            assertEquals(aliases, lastEntry.get("aliases"));
            assertEquals(formerName, lastEntry.get("formerName"));
            assertEquals(idCard, lastEntry.get("idcardnum"));

            assertEquals(rdaCountry, lastEntry.get("rdaCountry"));
            assertEquals(rdaAddressPrefix, lastEntry.get("rdaAddressPrefix"));
            assertEquals(rdaAddress1, lastEntry.get("rdaAddress1"));
            assertEquals(rdaAddress2, lastEntry.get("rdaAddress2"));
            assertEquals(rdaAddress3, lastEntry.get("rdaAddress3"));
            assertEquals(rdaAddress4, lastEntry.get("rdaAddress4"));
            assertEquals(rdaPostcode, lastEntry.get("rdaPostalCode"));;

            assertEquals(caCountry, lastEntry.get("caCountry"));
            assertEquals(caAddressPrefix, lastEntry.get("caAddressPrefix"));
            assertEquals(caAddress1, lastEntry.get("caAddress1"));
            assertEquals(caAddress2, lastEntry.get("caAddress2"));
            assertEquals(caAddress3, lastEntry.get("caAddress3"));
            assertEquals(caAddress4, lastEntry.get("caAddress4"));
            assertEquals(caPostcode, lastEntry.get("caPostalCode"));

            assertEquals(bankName, lastEntry.get("bankName"));
            assertEquals(bankBicCode, lastEntry.get("bankBICcode"));
            assertEquals(bankAccountName, lastEntry.get("bankaccountname"));
            assertEquals(bankAccountNum, lastEntry.get("bankaccountnum"));
            assertEquals(bdCountry, lastEntry.get("bdCountry"));
            assertEquals(bdAddressPrefix, lastEntry.get("bdAddressPrefix"));
            assertEquals(bdAddress1, lastEntry.get("bdAddress1"));
            assertEquals(bdAddress2, lastEntry.get("bdAddress2"));
            assertEquals(bdAddress3, lastEntry.get("bdAddress3"));
            assertEquals(bdAddress4, lastEntry.get("bdAddress4"));
            assertEquals(bdPostcode, lastEntry.get("bdPostalCode"));

        });

    }

    public static void validateIndividualWalletCorrespondenceChecked(String localAddress, int userId, String apiKey, String walletName, String accountName,
                                                                  int accountType, String aliases, String formerName, String idCard, String bankName, String bankBicCode, String bankAccountName, String bankAccountNum, String rdaCountry,
                                                                  String rdaAddressPrefix, String rdaAddress1, String rdaAddress2, String rdaAddress3, String rdaAddress4, String rdaPostcode, String bdCountry, String bdAddressPrefix, String bdAddress1, String bdAddress2,
                                                                  String bdAddress3, String bdAddress4, String bdPostcode) {
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));

            assertEquals(aliases, lastEntry.get("aliases"));
            assertEquals(formerName, lastEntry.get("formerName"));
            assertEquals(idCard, lastEntry.get("idcardnum"));

            assertEquals(rdaCountry, lastEntry.get("rdaCountry"));
            assertEquals(rdaAddressPrefix, lastEntry.get("rdaAddressPrefix"));
            assertEquals(rdaAddress1, lastEntry.get("rdaAddress1"));
            assertEquals(rdaAddress2, lastEntry.get("rdaAddress2"));
            assertEquals(rdaAddress3, lastEntry.get("rdaAddress3"));
            assertEquals(rdaAddress4, lastEntry.get("rdaAddress4"));
            assertEquals(rdaPostcode, lastEntry.get("rdaPostalCode"));;


            assertEquals(bankName, lastEntry.get("bankName"));
            assertEquals(bankBicCode, lastEntry.get("bankBICcode"));
            assertEquals(bankAccountName, lastEntry.get("bankaccountname"));
            assertEquals(bankAccountNum, lastEntry.get("bankaccountnum"));
            assertEquals(bdCountry, lastEntry.get("bdCountry"));
            assertEquals(bdAddressPrefix, lastEntry.get("bdAddressPrefix"));
            assertEquals(bdAddress1, lastEntry.get("bdAddress1"));
            assertEquals(bdAddress2, lastEntry.get("bdAddress2"));
            assertEquals(bdAddress3, lastEntry.get("bdAddress3"));
            assertEquals(bdAddress4, lastEntry.get("bdAddress4"));
            assertEquals(bdPostcode, lastEntry.get("bdPostalCode"));

        });

    }


    public static void validateIndividualWalletCreationBasic(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType, String aliases, String formerName, String idCard) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(aliases, lastEntry.get("aliases"));
            assertEquals(formerName, lastEntry.get("formerName"));
            assertEquals(idCard, lastEntry.get("idcardnum"));
        });
    }

     //public static void validateLegalEntityWalletCreationCorrespondence(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType, String aliases, String formerName, String idCard) {

        //api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        //api.start(userId, apiKey);

        //MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        //api.sendMessage(msfFactory.getWalletList(), claim -> {

          //  List<Map> data = claim.get("data").asList(Map.class);
          //  data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
          //  Map lastEntry = data.get(data.size() - 1);

          //  assertEquals(walletName, lastEntry.get("walletName"));
         //   assertEquals(accountName, lastEntry.get("accountName"));
         //   assertEquals(accountType, lastEntry.get("walletType"));
         //   assertEquals(aliases, lastEntry.get("aliases"));
           // assertEquals(formerName, lastEntry.get("formerName"));
           // assertEquals(idCard, lastEntry.get("idcardnum"));
        //});
   // }

    public static void validateIndividualWalletCreationResidential(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType,
                                                                   String country, String addressPrefix, String address1, String address2, String address3, String address4, String postcode) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(country, lastEntry.get("rdaCountry"));
            assertEquals(addressPrefix, lastEntry.get("rdaAddressPrefix"));
            assertEquals(address1, lastEntry.get("rdaAddress1"));
            assertEquals(address2, lastEntry.get("rdaAddress2"));
            assertEquals(address3, lastEntry.get("rdaAddress3"));
            assertEquals(address4, lastEntry.get("rdaAddress4"));
            assertEquals(postcode, lastEntry.get("rdaPostalCode"));

        });
    }

    public static void validateIndividualWalletCreationCorrespondence(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType,
                                                                      String country, String addressPrefix, String address1, String address2, String address3, String address4, String postcode) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(country, lastEntry.get("caCountry"));
            assertEquals(addressPrefix, lastEntry.get("caAddressPrefix"));
            assertEquals(address1, lastEntry.get("caAddress1"));
            assertEquals(address2, lastEntry.get("caAddress2"));
            assertEquals(address3, lastEntry.get("caAddress3"));
            assertEquals(address4, lastEntry.get("caAddress4"));
            assertEquals(postcode, lastEntry.get("caPostalCode"));

        });
    }


    public static void validateIndividualWalletSettlementDetails(String localAddress, int userId, String apiKey, String walletName, String accountName, int accountType,  String bankName,
                                                                 String bankBicCode, String bankAccountName, String bankAccountNum,
                                                                 String country, String addressPrefix, String address1, String address2, String address3, String address4, String postcode) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(bankName, lastEntry.get("bankName"));
            assertEquals(bankBicCode, lastEntry.get("bankBICcode"));
            assertEquals(bankAccountName, lastEntry.get("bankaccountname"));
            assertEquals(bankAccountNum, lastEntry.get("bankaccountnum"));
            assertEquals(country, lastEntry.get("bdCountry"));
            assertEquals(addressPrefix, lastEntry.get("bdAddressPrefix"));
            assertEquals(address1, lastEntry.get("bdAddress1"));
            assertEquals(address2, lastEntry.get("bdAddress2"));
            assertEquals(address3, lastEntry.get("bdAddress3"));
            assertEquals(address4, lastEntry.get("bdAddress4"));
            assertEquals(postcode, lastEntry.get("bdPostalCode"));

        });
    }

    public static void validateLegalEntityWalletCreationCorrespondenceString (String localAddress, int userId, String apiKey, String walletName, String accountName,
    int accountType, String country, String addressPrefix, String address1, String address2, String address3, String address4, String postcode) {

        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.getWalletList(), claim -> {

            List<Map> data = claim.get("data").asList(Map.class);
            data.sort((a, b) -> ((Integer) a.get("walletID")).compareTo((Integer) b.get("walletID")));
            Map lastEntry = data.get(data.size() - 1);

            assertEquals(walletName, lastEntry.get("walletName"));
            assertEquals(accountName, lastEntry.get("accountName"));
            assertEquals(accountType, lastEntry.get("walletType"));
            assertEquals(country, lastEntry.get("country"));
            assertEquals(addressPrefix, lastEntry.get("addressPrefix"));
            assertEquals(address1, lastEntry.get("address1"));
            assertEquals(address2, lastEntry.get("address2"));
            assertEquals(address3, lastEntry.get("address3"));
            assertEquals(address4, lastEntry.get("address4"));
            assertEquals(postcode, lastEntry.get("postalCode"));
        });
    }
}
