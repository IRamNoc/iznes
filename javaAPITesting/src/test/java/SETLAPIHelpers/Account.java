package SETLAPIHelpers;

public class Account {

  public Account() {
  }

  String Status;

  String accountDescription;

  String accountName;

  int accountMember;


   public String getStatus() {
    return Status;
  }

  public void setStatus(String Status) {
    this.Status = Status;
  }

  public String getAccountDescription() {
    return accountDescription;
  }

  public void setAccountDescription(String accountDescription) {
    this.accountDescription = accountDescription;
  }

  public String getAccountName() {
    return accountName;
  }

  public void setAccountName(String accountName) {
    this.accountName = accountName;
  }

  public int getAccountMember() {
    return accountMember;
  }

  public void setAccountMember(int accountMember) {
    this.accountMember = accountMember;
  }

  @Override
  public String toString() {
    return "Account{" +
      "Status='" + Status + '\'' +
      ", accountDescription='" + accountDescription + '\'' +
      ", accountName='" + accountName + '\'' +
      ", accountMember='" + accountMember + '\'' +
      '}';
  }
}



