import {
    Component, OnInit
} from '@angular/core';

@Component({
    selector: 'app-help-page',
    templateUrl: './help-page.component.html',
   styleUrls: ['./help-page.component.css'],
})

export class HelpPageComponent  implements OnInit{
public faqList=[
    {
name:'How to invite collaborators to the IZNES platform?',
details:`As the Administrator of the IZNES platform within your company, you can invite employees to create their account on IZNES. <br/>

<b>Before you can send invitations, you will have to create teams. </b>
These teams will be used to define the rights of different users on the IZNES platform.


1- Go to the Administration > Teams module and click on Add a new team

2- Give a name and a reference to this team then, add a description
 
3 - At the bottom of this page, you will be able to define the permissions of the team on the IZNES platform.
Then, Click on Create Team when you are done. A pop-up will appear to confirm the creation of this team.

You will be able to change the permissions of the different teams by going back to them and clicking on Update team after modification.



You can now add a new user to this team. 

4- Go to the Administration > Users module and click on Add a new user 

Note: you can create several users at the same time by attaching them to the same team.

5- Fill in the required data and select one or more teams to which the user will belong.

Option 1: Click on Create User(s) to register the user. No invitation will be sent to the user. The user will have a "pending" status.

Option 2: Click Create and Send Invitation(s) to create the user and send them an invitation to create their account on IZNES.

A pop-up will appear to confirm the creation of the user. 
 

When the invitation is sent to the user, they will need to click on the link in the invitation email to create their password and activate their account on the IZNES platform.
`
    },
    {
name:'How to reset two-factor autentication?',
details:`You can reset your two-factor authentication from the IZNES platform login page.

1 - Login to your IZNES account

2- You will be redirected to the the page dedicated to the two-factor authentication. 
Click on "Lost access to your code?"

3- Enter your username 

4- An email inviting you to reset the two-factor code has been sent to the address linked to your account. Click on the link contained in this email.

5- Go to the login page and log in. You will have access to a new QR code to scan with your authentication app.

The new 6 digits-code linked to your account will be available on your authentication app. 
`
    },
    {
name:'How to reset my password?',
details:`If you have forgotten your password, it is possible to reset it from the IZNES platform login page.

1 – Go to the login page and click on “Forgot your password?”
Fill in your username 

2 - You will receive an e-mail inviting you to reset your password. Click on the link contained in this e-mail.

3 - Enter a new password and click on Send  

4 - You will receive an e-mail confirming that your password has been changed. 

You can login with your new password. 


It is also possible to change your password once logged-in from the “My information” page. 

1 - Access your profile settings, on the top left corner by clicking on the icon 
 and accessing "My information".

2- You have to scroll down the “View/Edit Information” tab to find the password change feature. 

3- Enter the old password and the new one. 

4- Click on Update

You will be able to login with your new password. 
`
    },
    {
name:'How to find my IDs and keys to use the APIs?',
details:`The APIs require the API IDs and keys specific to the users who use the platform.

1- Once logged in with your user account, access your information by clicking on the icon   > and accessing “My information”

2- Access the 3rd tab of this page " >__ API ".

3- On this tab, you will have access to the information about your User ID, Wallet ID and API Key of your wallet. 


[For Investors] If you want to use the NewOrder API,  access  My Sub-portfolios module to find the information related to the sub-portfolios (portfolio)

4- Click on the sub-portfolio you want to use for the API to see its blockchain address


You can use all these information to generate tokens for using IZNES APIs. 
`
    },
    {
name:'[Investors] How to change my bank details?',
details:`As an Investor, you can modify the bank account information related to your sub-portfolios. Please note that you will also have to modify this information in your Client File to keep it up to date and compliant. 

1 - Access the My Sub-portfolios module

2- Click on the Edit button of the sub-portfolio you want to modify. 

3- You can also delete the sub-portfolio by clicking on Delete. 

Please note that you will not be able to delete a sub-portfolio on which you have an available position. Also, after a deletion, you will not be able to use the same sub-portfolio name to create a new one. 


3- If you decide to edit your sub-portfolio, you will have access to the latest banking information entered in IZNES. You can modify all the necessary information.

4- Once the changes are done, you can click on the Update button to save your new banking information.`
    },
    {
name:'[Investors] How to place an order on the IZNES platform?',
details:`Before placing your first order, you will need to create a sub-portfolio. This sub-portfolio will require a name and an IBAN. You can create as many sub-portfolios as you want.

1- Click on My Sub-portfolios module

2- Once you access this module, you will be able to add a new sub-portfolio by clicking on Add a new subportfolio


3- When you click on Add a new subportfolio, a new window will appear to fill in your bank information (i.e. the cash account of the investing portfolio) as well as the information related to the bank that holds the account. 

 
4- Click on Create to add this sub-portfolio.

5- Once your sub-portfolio is created, you can then modify it by clicking on Edit or delete it by clicking on Delete from the main page. 


Note: you can add as many sub-portfolios as you want. 



 

 

Once your first sub-portfolio is created, you will be able to place orders on the products you have access to. 

6- Access the Order book module and the Place Order sub-module in the left menu. 

7- For each share you have access to, you can click Subscribe to place a subscription order, Redeem to place a redemption order or Sell/Buy to place a buy/sell order (if available).

 
You can only make a redemption once you have subscribed to that same stock, or in other words, if you do not have a position, you cannot make a redemption.

 

8- When you click on Subscribe or Redeem, you will be redirected to an order placement screen. On this screen, you will have to fill in the information related to the order you want to place (dates / quantity or amount). 

You will also have to choose the sub-portfolio to invest with. (see previous section)

9 - Once finished, check the box concerning the KIID and click on Place Order

10 - A new pop-up window appears to confirm your order. Click Confirm if you agree with the order details. 

11- Your order is now confirmed with an Initiated status. You can cancel it before the cut-off date and time by clicking on Cancel . `
    },
    {
name:'[Mangement Companies] How to Import NAVs via a CSV file?',
details:`Thanks to the management of the Net Asset Value, the Management Companies can add the net asset values by importing a CSV file. You will find in the appendix of this article the example of CSV file to use.

1. Go to My products module, then Net Asset Value .

2. Click on the Upload NAVs to download the CSV file containing the NAVs you want to fill in.

The CSV file should be formatted as followed: 
Date;VL;Devise;Nbre parts;Coupon;Capi Distrib;Rdt Net;Rdt Brut;Actif Net;Actif Net Global; Code Isin
3. Choose the CSV file you want to import and then click on the Download button.

The VLs will be filled in with a Validated status. `
    },
    {
name:'[Mangement Companies] How to invite fund managers on the IZNES platform?',
details:`As a Management Company, it is possible to invite a collaborator as a Portfolio Manager. The Portfolio Manager will have a specific User, which will allow him to act on behalf of the Funds he manages. 


1- Go to the module My Clients > Portfolio Managers , then click on Invite a portfolio Manager

 
2- Fill in the email address that will be used to create the User, then select the type of Portfolio Manager "Fund of Funds Manager". 

The e-mail address filled-in must not already be used for another user account.

3- Then select the funds on whose behalf the Manager will be able to act


4- Click on Create Mandate PortfolioManagers


The Portfolio Manager will receive an email inviting him to create his account on IZNES. 

5- Once his account is created, the administrator of the management company will be able to find this portfolio manager in the module My clients > Portfolio Managers 


 6- By clicking on a Portfolio Manager, the Management Company administrator will be able to modify the funds to which he has access. 


7- By clicking on Manage Shares Authorisation, the Management Company's administrator will be able to modify the shares to which the fund under management has access.`
    },
    {
name:'[Mangement Companies] How to invite mandate managers on the IZNES platform?',
details:`As a management company, it is possible to invite an employee as Portfolio Manager. The Portfolio Manager will then have a specific user who will allow him/her to act on behalf of the mandate he/she manages. 


1- Go to My clients > Client Referential, then click on Create Investor under mandate.

2- Select the type of investor between "Institutional Investor" or "Individual Investor".

3- If the mandate is an Institutional Investor, enter the Company name and a reference if necessary, then click on Create Mandate Investors.

3"- If the mandate is an individual investor, enter the first and last name of the investor and a reference if necessary, then click Create Mandate Investors.


The mandate is now created as a Client. You can invite a new Portfolio Manager to act on behalf of the client. 

 

4- Go to My Clients > Portfolio Managers module, then click on Invite a Portfolio Manager. 


5- Enter the email address that will be used to create the User and select the type of Portfolio manager "Discretionary Manager".

3- Choose the mandates on behalf of which he can act.

4- Click on Create Mandate PortfolioManagers

 
5- When you return to the main page, you will have access to all Portfolio Managers. By clicking on the Discretionary Manager, you can change the mandates on behalf of which he/she can act. 

6- By clicking on Manage Share Authorisations, you can change the shares that the mandate can access. `
    },
    {
name:'[Mangement Companies] How to invite investors on the IZNES platform?',
details:`As a Management Company, you can invite your Clients to create their account on the IZNES platform. To do so, you must have access to My Clients module.

Go to the My Clients > Client Referential module, then click on Invite Investors.

2- Fill in your client's email address, investor type and the language you want to send the invitation. Then, click on Send invitation by email. 

Note: the person who receives this invitation will become a SuperAdmin within their company.

3- You can find the sent invitations and their status at the bottom of the invitation page. 

The investor will receive an email inviting him to create his account on the IZNES platform. He will then have to fill in his client file (KYC) in order to use IZNES.
`
    }
]
constructor(){
    
}
    ngOnInit(): void {
    }
}
