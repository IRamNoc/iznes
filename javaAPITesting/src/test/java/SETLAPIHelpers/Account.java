package SETLAPIHelpers;

public class Account {

  public Account() {
  }

  String Status;

  int accountID;

  String accountName;

  String description;

  int accountMember;


   public String getStatus() {
    return Status;
  }

  public void setStatus(String Status) {
    this.Status = Status;
  }

  public int getAccountID() {
    return accountID;
  }

  public void setAccountID(int accountID) {
    this.accountID = accountID;
  }

  public String getAccountName() {
    return accountName;
  }

  public void setAccountName(String accountName) {
    this.accountName = accountName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public String toString() {
    return "Account{" +
      "Status='" + Status + '\'' +
      ", accountID=" + accountID +
      ", accountName='" + accountName + '\'' +
      ", description='" + description + '\'' +
      ", accountMember=" + accountMember +
      '}';
  }
}



