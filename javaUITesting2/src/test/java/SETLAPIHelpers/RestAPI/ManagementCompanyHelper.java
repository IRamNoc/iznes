package SETLAPIHelpers.RestAPI;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;



public class ManagementCompanyHelper {

    String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
    static RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }


   // public static ManagementCompany createManagementCompanyAndCaptureDetails(String localAddress, String description, String name, String member, int userId, String apiKey) throws InterruptedException {

     //   Container<ManagementCompany> container = new Container<>();

    //    api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        //api.sendMessage(msfFactory.newManagementCompany(), claim -> {
        // Map resp = claim.get("data").asList(Map.class).get(0);
        // try {
        //   ManagementCompany account = JsonToJava.convert(resp.toString(), ManagementCompany.class);
        //     container.setItem(account);
        //   } catch (IOException e) {
        //     e.printStackTrace();
        //    }

        //     });
        // return container.getItem();
        // }

        //public static void createManagementCompanySuccess(String localAddress, String description, String name, String member, int userId, String apiKey) throws InterruptedException {


        // api.start(userId, apiKey);
/*
    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newManagementCompany(description, name, member), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });
  }*/

        // public static void createManagementCompanyFailure(String localAddress, int userId, String apiKey, String description, String name, int member, String expectedError) throws InterruptedException{

        //   api.start(userId, apiKey);

  /*  MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newManagementCompany(description, name, member), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue(expectedError.equals(resp.get("Message")));
    });
  }*/

        // public static void createManagementCompany(String localAddress, int userId, String apiKey, String description, String name, String member, int noOfUsers) throws InterruptedException {
        //  for (int i = 0; i < noOfUsers; i++) {
        //    String [] memberDetails = generateMemberDetails();
        //    String memberName = memberDetails[0];
        //    String email = memberDetails[1];

        //    api.start(userId, apiKey);
/*
      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newManagementCompany(description, name, member), claim -> {
        Map resp = claim.get("data").asList(Map.class).get(0);
        assertTrue("OK".equals(resp.get("Status")));
      });
    }*/
        //}
/*


  public static void deleteManagementCompanySuccess(String localAddress, int userId, String apiKey, String memberId) throws InterruptedException {

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteManagementCompany(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });
  }

  public static void deleteManagementCompanyFailure(String localAddress, int userId, String apiKey, String memberId) throws InterruptedException {

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteManagementCompany(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue("".equals(resp.get("Message")));
    });
  }
*/

}
