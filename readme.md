Installation
=
```
npm install git+http://si-nexus01.dev.setl.io/SETL_Modules/Generic_modules/socketcluster-wrapper.git#1.0.0
```

Usage
=
In Angular

```
    var setlWebsocket = new SocketClusterWrapper('wss', 'localhost', '9788', 'db');
   
    setlWebsocket.openWebSocket();
    
    var Request = {
        MessageType: 'DataRequest',
        MessageHeader: '',
        RequestID: 0,
        //MessageBody: {RequestName: 'Login', UserName: username, Password: password, CFCountry: nz(document.cf_ipcountry, '.')}
        // CFCountry just legacy. It still required as a parameter, but it is not used for anything.
        MessageBody: {RequestName: 'Login', UserName: 'ofi_am_1', Password: 'alex01', CFCountry: '.'}
    };
    
    setlWebsocket.sendRequest([Request, function (errorCode, data) {
        console.log(data);
        document.body.innerHTML = "<h1>It works</h1>"
    }]);

```

Test
=
Build browser version of the library:
```
npm run build
```
Open test/index.html in browser.