package SETLAPIHelpers;

public class AccountError extends Account {


  public AccountError() {
  }


  String Message;

  @Override
  public String toString() {
    return "AccountError{" +
      "Message='" + Message + '\'' +
      '}';
  }

  public String getMessage() {
    return Message;
  }

  public void setMessage(String Message) { this.Message = Message;
  }

}



