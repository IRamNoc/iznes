package SETLAPIHelpers;

public class Member {

  public Member() {
  }

  @Override
  public String toString() {
    return "Member{" +
      "Status='" + Status + '\'' +
      ", userID='" + userID + '\'' +
      ", userName='" + userName + '\'' +
      ", emailAddress='" + emailAddress + '\'' +
      ", accountID=" + accountID +
      ", parent=" + parent +
      ", isManager=" + isManager +
      ", accountLocked=" + accountLocked +
      ", userType=" + userType +
      ", isAdmin=" + isAdmin +
      ", accountName='" + accountName + '\'' +
      ", description='" + description + '\'' +
      ", billingWallet='" + billingWallet + '\'' +
      ", memberName='" + memberName + '\'' +
      ", pass='" + pass + '\'' +
      ", memberID='" + memberID + '\'' +
      '}';
  }

  String Status;

  String userID;

  String userName;

  String emailAddress;

  int accountID;

  int parent;

  int isManager;

  int accountLocked;

  int userType;

  int isAdmin;

  String accountName;

  String description;

  String billingWallet;

  String memberName;

  String pass;

  String memberID;

  public String getUserID() {
    return userID;
  }

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public String getStatus() {
    return Status;
  }

  public void setStatus(String Status) {
    this.Status = Status;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getEmailAddress() {
    return emailAddress;
  }

  public void setEmailAddress(String emailAddress) {
    this.emailAddress = emailAddress;
  }

  public int getAccountID() {
    return accountID;
  }

  public void setAccountID(int accountID) {
    this.accountID = accountID;
  }

  public int getParent() {
    return parent;
  }

  public void setParent(int parent) {
    this.parent = parent;
  }

  public int getIsManager() {
    return isManager;
  }

  public void setIsManager(int isManager) {
    this.isManager = isManager;
  }

  public int getAccountLocked() {
    return accountLocked;
  }

  public void setAccountLocked(int accountLocked) {
    this.accountLocked = accountLocked;
  }

  public int getUserType() {
    return userType;
  }

  public void setUserType(int userType) {
    this.userType = userType;
  }

  public int getIsAdmin() {
    return isAdmin;
  }

  public void setIsAdmin(int isAdmin) {
    this.isAdmin = isAdmin;
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

  public String getBillingWallet() {
    return billingWallet;
  }

  public void setBillingWallet(String billingWallet) {
    this.billingWallet = billingWallet;
  }

  public String getMemberName() {
    return memberName;
  }

  public void setMemberName(String memberName) {
    this.memberName = memberName;
  }

  public String getPass() {
    return pass;
  }

  public void setPass(String pass) {
    this.pass = pass;
  }


  public String getMemberID() {
    return memberID;
  }

  public void setMemberID(String memberID) {
    this.memberID = memberID;
  }
}

