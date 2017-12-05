package SETLAPIHelpers;

public class ManagementCompanyError extends ManagementCompany {


  public ManagementCompanyError() {
  }


  String Message;

  @Override
  public String toString() {
    return "ManagementCompanyError{" +
      "Message='" + Message + '\'' +
      '}';
  }

  public String getMessage() {
    return Message;
  }

  public void setMessage(String Message) { this.Message = Message;
  }

}



