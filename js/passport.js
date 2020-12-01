var PassportPipeline = {

    passportParams: { 
                    method: '',
                    username: '',
                    email: '',
                    password: '',
                    code: '',
                    uid: '',
                    unlocked_balance: 0, 
                    balance: 0,
                    crfi_address: "",
                    crfi_stake_reward_address: "",
                    crfi_farming_reward_address: "",
                    usdt_address: "",
                    btc_address: "",
                    eth_address: "",
                    ltc_address: "",
                    locked_blocks: 0,
                    usdt_value: 0,
                    btc_value: 0,
                    eth_value: 0,
                    ltc_value: 0,
                    coinAPIurl: "",
                    timestamp: '',
                    date: '',
                    name: '',
                    addr: '',
                    pid: '',
                    receiver: '',
                    txid: '',
                    link: '',
                    notes: '',
                    lost_password: '',
                    telegramID: '',
                    telegramUsername: '',
                    bounty_id: '',
                    address: '',  
                    secret: '',
                    aindex: 0,
                    beneficiary_name: "",
                    beneficiary_email: "",
                    beneficiary_address: "",
                    beneficiary_aindex: 0
    },
    
    myCipher: Crypto.encryptData(Crypto.salt()),
    myDecipher: Crypto.decryptData(Crypto.salt()),

    crfiApi: 'https://id.crystaleum.org/api-crfi/api.php',
    etnxApi: 'https://pulse.electronero.org/api-etnx/api.php',
    etnxpApi: 'https://pulse.electronero.org/etnxp-api/api.php',
    etnxcApi: 'https://pulse.electronero.org/etnxc-api/api.php',
    ltnxApi: 'https://pulse.electronero.org/ltnx-api/api.php',
    gldxApi: 'https://pulse.electronero.org/gldx-api/api.php',

    crfiExpl: 'oracle.crystaleum.org',
    etnxExpl: 'blockexplorer.electronero.org',
    etnxpExpl: 'blockexplorer.electroneropulse.org',
    etnxcExpl: 'blockexplorer.electroneroclassic.org',
    ltnxExpl: 'blockexplorer.litenero.org',
    gldxExpl: 'blockexplorer.goldnero.org',
//     initRatesDates: null,
//     oraceleRatesApiNodeA: 'https://api.coingecko.com/api/v3/coins/crystaleum/history?date='+initRatesDates+'&localization=en',
    exRatesApi: 'https://api.coingecko.com/api/v3/simple/price?ids=crystaleum&vs_currencies=btc%2Cusd%2Ceth%2Cltc',
//     callDateTime: function(){
//       var d = new Date();
//       var a = d.getDate()
//       var b = d.getMonth()
//       var c = d.getDay();
//       var d = d.getFullYear();
//       var weekly = c + 7; // weekly
//       var monthly = c + 30; // monthly
//       var quarterly = f * 3; // quarterly
//       var annual = g * 4; // annual
//       var dayDate = c + b + d;
//       var weekOfDates = for(i=0; i < weekly; i++){
//           console.log(weekly);
//       }
//       var monthOfDates = c + b + d;
//       var quartersOfDates = c + b + d;
//       var annualDates = c + b + d;
//         initRatesDates = monthDayDate;
//         for(i=0;i<dayOfRates.length){
//         }
//         console.log(monthDayDate);
//     },

    saveParams: function(){
        console.log("saveParams");
        // Store account in session
        // cipher any sensitive data
        sessionStorage.setItem("username", this.myCipher(this.passportParams.username));
        sessionStorage.setItem("email", this.myCipher(this.passportParams.username));
        sessionStorage.setItem("password", this.myCipher(this.passportParams.password));
        
        // Confirm state of account
        this.passportParams.username = sessionStorage.getItem("username");
        this.passportParams.email = sessionStorage.getItem("email");
        this.passportParams.password = sessionStorage.getItem("password");
        // logs
        console.log(this.passportParams.username)
        console.log(this.passportParams.email)
        console.log(this.passportParams.password)
    },
    
    setWalletAindex: function(coinSymbol, aindex){ 
        console.log("setWalletAindex");
        if(!coinSymbol){
        coinSymbol = 'crfi'; // default crfi
        };
        sessionStorage.setItem("aindex", parseFloat(aindex));
        sessionStorage.setItem("beneficiary_aindex", parseFloat(aindex));
        this.passportParams.aindex = sessionStorage.getItem("aindex");
        this.passportParams.beneficiary_aindex = sessionStorage.getItem("aindex");
        console.log("setWalletAindex to: " + parseFloat(this.passportParams.aindex));
        console.log("setWalletAindex beneficiary to: " + parseFloat(this.passportParams.beneficiary_aindex));
    },
    
    getWalletAindex: function(coinSymbol){
        console.log("getWalletAindex");
        if(!coinSymbol){
        coinSymbol = 'crfi'; // default crfi
        };
    this.loadParams();
    this.passportParams.method = 'get_wallet_aindex';
    this.passportParams.uid = parseInt(this.getCoinUUID(coinSymbol));
    this.remoteCall(coinSymbol).then((response) => {
                console.log("getWalletAindex init");
                console.log(this.passportParams);
                if(response){
                    let passportGetAindex = JSON.parse(response);
                    if(passportGetAindex.hasOwnProperty("error")){
                        let aindexError = passportGetAindex.error;
                        $(".alert-danger").html(aindexError);
                        console.log(passportGetAindex);
                        return;
                    }   
                        const aindex = passportGetAindex.data;
                        this.passportParams.aindex = aindex;
                        this.setWalletAindex("crfi", aindex);
                        console.log(passportGetAindex);
                        console.log(passportGetAindex.data);
                        return;
                }
            });
    },
    
    setBeneficiary: function(coinSymbol, bene_name, bene_email, bene_address){
        console.log("setBeneficiary");
        if(!coinSymbol){
        coinSymbol = 'crfi'; // default crfi
        };
        if(!bene_name || !bene_email || !bene_address){
            return;
        } 
    this.loadParams();
    //this.getWalletAindex(coinSymbol);
    this.passportParams.method = 'add_beneficiary';
    this.passportParams.uid = parseInt(this.getCoinUUID(coinSymbol));
    this.passportParams.aindex = parseFloat(this.passportParams.aindex);
    this.passportParams.beneficiary_aindex = parseFloat(this.passportParams.beneficiary_aindex);
    this.passportParams.beneficiary_name = bene_name;
    this.passportParams.beneficiary_email = bene_email;
    this.passportParams.beneficiary_address = bene_address;
    this.remoteCall(coinSymbol).then((response) => {
                console.log("setBeneficiary init");
                console.log(this.passportParams);
                if(response){
                    let passportAddBene = JSON.parse(response);
                    if(passportAddBene.hasOwnProperty("error")){
                        let beneError = passportAddBene.error;
                        $(".alert-danger").html(beneError);
                        console.log(passportAddBene);
                        return;
                    }   
                        //const aindex = passportAddBene.data;
                        //this.passportParams.aindex = aindex;
                        this.saveParams();
                        console.log(passportAddBene);
                        return;
                }
            });
    },
    
    saveHash: function(key_set){   
        console.log("saveHash");
        if(key_set != undefined || key_set != null){
            sessionStorage.setItem("key_hash", this.myCipher(key_set));
            this.passportParams.lost_password = sessionStorage.getItem("key_hash");
           }
        else {
            sessionStorage.setItem("key_hash", this.myCipher(this.passportParams.lost_password));
            this.passportParams.lost_password = sessionStorage.getItem("key_hash");
        }
        console.log(this.passportParams.lost_password);    
        return(sessionStorage.getItem("key_hash"));
    },

    hasValidSession: function(){
        console.log("hasValidSession");
        return sessionStorage.hasOwnProperty("username")
                && sessionStorage.hasOwnProperty("password")
                && sessionStorage.hasOwnProperty("code")
    },
    
    logUU: function(){
        console.log("logUU");
        console.log(this.passportParams);
    },
    
    resetPassword: function(coinSymbol, email, password, repeat, key_set){
        console.log("resetPassword");
        if(!coinSymbol){
    coinSymbol = 'crfi'; // default crfi
    };
    this.loadParams();
    this.passportParams.method = 'reset_password';
        if(key_set == false){
            this.passportParams.email = email;
        }
        if(key_set == true && password != null){
            if(password != repeat){
                resetFail();
                return;
               }
            this.loadHash();
            this.passportParams.password = password;
            this.passportParams.method = 'reset_password_settings';
        }
    this.remoteCall(coinSymbol).then((response) => {
                console.log("reset init");
                console.log(this.passportParams);
                if(response){
                    let passportReset = JSON.parse(response);
                    if(passportReset.hasOwnProperty("error")){
                        let resetError = passportReset.error;
                        $(".alert-danger").html(resetError);
                        console.log(passportReset);
                        resetFail();
                        return;
                    }   
                        this.saveParams();
                        console.log(passportReset);
                        resetSuccess();
                        return;
                }
            });
    },
    
    resetCode: function(coinSymbol, email, pin, repeat, key_set){
        console.log("resetCode");
        if(!coinSymbol){
    coinSymbol = 'crfi'; // default crfi
    };
    this.loadParams();
    this.passportParams.method = 'reset_password';
        if(key_set == false){
            this.passportParams.email = email;
        }
        if(key_set == true && pin != null){
            if(pin != repeat){
                resetFail();
                return;
               }
            this.loadHash();
            this.passportParams.code = pin;
            this.passportParams.method = 'add_code';
        }
    this.remoteCall(coinSymbol).then((response) => {
                console.log("reset code init");
                console.log(this.passportParams);
                if(response){
                    let passportResetCode = JSON.parse(response);
                    if(passportResetCode.hasOwnProperty("error")){
                        let resetError = passportResetCode.error;
                        $(".alert-danger").html(resetError);
                        console.log(passportResetCode);
                        resetFail();
                        return;
                    }   
                        var secure_code = PassportPipeline.myCipher(this.passportParams.code);
                        this.passportParams.code = passportResetCode.data;
                        this.setCode(secure_code);
                        this.saveParams();
                        console.log(passportResetCode);
                        resetSuccess();
                        return;
                }
            });
    },
    
    setUUkey: function(coinSymbol){
        console.log("setUUkey");
        if(!coinSymbol){
    coinSymbol = 'crfi'; // default crfi
    };
    this.loadParams();
    this.passportParams.method = 'set_uu_key';
    this.passportParams.uid = parseInt(this.getCoinUUID(coinSymbol));
    this.remoteCall(coinSymbol).then((response) => {
                console.log("set_uu_key init");
                if(response){
                    
                    let passportSetUU = JSON.parse(response);
                    if(passportSetUU.hasOwnProperty("error")){
                        let resetError = passportSetUU.error;
                        $(".alert-danger").html(resetError);
                        console.log(passportSetUU);
                        //resetFail();
                        return;
                    }   
                        this.passportParams.lost_password = passportSetUU.data;
                        this.saveHash();
                        console.log("SET UU");
                        console.log(passportSetUU);
                        console.log("GET UU .DATA");
                        console.log(passportSetUU.data);
                        console.log(this.passportParams);
                        //resetSuccess();
                        return;
                }
            });
    },
    getUUkey: function(coinSymbol){
        console.log("getUUkey");
        if(!coinSymbol){
    coinSymbol = 'crfi'; // default crfi
    };
    this.loadParams();
    this.passportParams.method = 'get_uu_key';
    this.passportParams.uid = parseInt(this.getCoinUUID(coinSymbol));
    this.remoteCall(coinSymbol).then((response) => {
                console.log("get_uu_key init");
                console.log(this.passportParams);
                if(response){
                    let passportGetUU = JSON.parse(response);
                    if(passportGetUU.hasOwnProperty("error")){
                        let resetError = passportGetUU.error;
                        $(".alert-danger").html(resetError);
                        console.log(passportGetUU);
                        //resetFail();
                        return;
                    }                           
                        this.passportParams.lost_password = passportGetUU.data;
                        this.saveHash();
                        console.log("GET UU");
                        console.log(passportGetUU);
                        console.log("GET UU .DATA");
                        console.log(passportGetUU.data);
                        //resetSuccess();
                        return;
                }
            });
    },
    saveRates: function(usdt, btc, eth, ltc, crfi, coin){ 
        console.log("saveRates");
        if (coin != null && coin != undefined){
            console.log("coin not null, using defined coin");
        }
        else {
            coin = "crfi";
        }
        // Store rates in session 
        sessionStorage.setItem("crfi", crfi);
        sessionStorage.setItem("usdt", usdt);
        sessionStorage.setItem("btc", btc);
        sessionStorage.setItem("eth", eth);
        sessionStorage.setItem("ltc", ltc);
        // Confirm state of rates
        this.passportParams.usdt_value = sessionStorage.getItem("usdt");
        this.passportParams.btc_value = sessionStorage.getItem("btc");
        this.passportParams.eth_value = sessionStorage.getItem("eth");
        this.passportParams.ltc_value = sessionStorage.getItem("ltc");
        // Log it out to the console
        console.log(this.passportParams.crfi_value)
        console.log(this.passportParams.usdt_value)
        console.log(this.passportParams.btc_value)
        console.log(this.passportParams.eth_value)
        console.log(this.passportParams.ltc_value)
    },

    loadParams: function(){
        console.log("loadParams");
        // Read only persistent data needed
        this.passportParams.username = this.myDecipher(sessionStorage.username);
        this.passportParams.email = this.myDecipher(sessionStorage.email);
        this.passportParams.password = this.myDecipher(sessionStorage.password);
    },
    
    loadHash: function(){
        console.log("loadHash");
        // Read only persistent data needed
        this.passportParams.lost_password = this.myDecipher(sessionStorage.key_hash);
    },
    
    remoteCall: function(coinSymbol){
        console.log("remoteCall");
        coinSymbol = 'crfi';
        return $.ajax({
                    url: this.getPassportApi(coinSymbol),
                    type: 'POST',
                    cache: false,
                    data: this.passportParams
                });
    },
    
    remoteCallRates: function(coinSymbol){
        console.log("remoteCallRates");
        coinSymbol = 'crfi';
        var exchangeData = {
            ids: "crystaleum",
            vs_currencies: ["btc", "usd", "eth", "ltc"]
        };
        return $.ajax({
                    url: this.getRatesApi(coinSymbol),
                    type: 'GET',
                    cache: false
                    // data: exchangeData
                });
    },
    
     /*remoteCall: function(coinSymbol){
         return Passport.simulate(this.passportParams);
     },*/

    setCredentials: function(email, password, save){
        console.log("setCredentials");
        // maybe cipher the data, but it's done elsewhere
        this.passportParams.username = this.myDecipher(email);
        this.passportParams.email = this.myDecipher(email);
        this.passportParams.password = this.myDecipher(password);
        if(save)
        {
            return this.saveParams();
        }
    },

    setMethod: function(method){
        console.log("setMethod");
        return this.passportParams.method = method;
    },

    setCode: function(code){
        console.log("setCode");
        // We needed it for refresh data
        this.passportParams.code = code; 
        return sessionStorage.setItem("code", code);
    },

    loadCode: function(){
        console.log("loadCode");
        return this.passportParams.code = this.myDecipher(sessionStorage.code);
    },
    setCoinUUID: function(coinSymbol, passportLogin){
        console.log("setCoinUUID");
        coinSymbol = 'crfi';
        return sessionStorage.setItem(coinSymbol+"_uuid", this.myCipher(passportLogin.data.uid));
    },
    getCoinUUID: function(coinSymbol){
        console.log("getCoinUUID");
        coinSymbol = 'crfi';
        return this.myDecipher(sessionStorage.getItem(coinSymbol+"_uuid"));
    },
    performOperation: function(coinSymbol, operationCallback){
        console.log("performOperation");
        coinSymbol = 'crfi';
        this.loadParams();    
        
        
        this.passportParams.method = 'login';
        this.setMethod('login');
        this.passportParams.coinAPIurl = this.getPassportApi(coinSymbol);
        this.passportParams.uid = null;
        console.log("1");
        console.log(this.passportParams);
        this.remoteCall(coinSymbol).then((response) => {
            console.log(this.passportParams);
            if(response){
                let passportLogin = JSON.parse(response);
                if(passportLogin.hasOwnProperty("error")){
                    loginFail();
                    return;
                }

                this.setCoinUUID(coinSymbol, passportLogin);
                this.passportParams.uid = parseInt(this.getCoinUUID(coinSymbol));
                this.passportParams.code = parseInt(this.loadCode());
                this.passportParams.method = 'check_code';
                this.setMethod('check_code');
                console.log("2");
                console.log(this.passportParams);
                this.remoteCall(coinSymbol).then((response) => {
                    if(response){
                        console.log(response); 
                        let passportCheckCode = JSON.parse(response);
                        if(passportCheckCode.hasOwnProperty("error")){
                            let checkError = passportCheckCode.hasOwnProperty("error");
                            console.log(checkError);
                            loginCodeFail();
                            return;
                        }
                        if(ModelViewController.coinState){
                            console.log("MVC.coinState:")
                           console.log(ModelViewController.coinState)
                           }
                        console.log("3");
                        console.log(this.passportParams);
                        operationCallback(coinSymbol);
                    }
                });
            }
        });
    },
    registerOperation: function(coinSymbol, operationCallback){
        console.log("registerOpteration");
        coinSymbol = 'crfi';
        this.loadParams();
        
        this.passportParams.method = 'register';
        this.passportParams.coinAPIurl = this.getPassportApi(coinSymbol);
        this.passportParams.uid = null;
        console.log("1");
        console.log(this.passportParams);
        this.remoteCall(coinSymbol).then((response) => {
            if(response){
                let passportLogin = JSON.parse(response);
                let passportRegister = JSON.parse(response);
                if(passportRegister.hasOwnProperty("error")){
                    let resetError = passportRegister.error;
                    console.log(resetError);
                    registerFail(resetError)
                    $(".alert-danger").html(resetError);
                    console.log(passportRegister);
                    return;
                }   
                

                this.setCoinUUID(coinSymbol, passportLogin);
                this.passportParams.uid = parseInt(this.getCoinUUID(coinSymbol));
                this.passportParams.code = parseInt(this.loadCode());
                this.passportParams.method = 'add_code';
                console.log("2");
                console.log(this.passportParams);
                this.remoteCall(coinSymbol).then((response) => {
                    if(response){
                        console.log(response); 
                        let passportCheckCode = JSON.parse(response);
                        if(passportCheckCode.hasOwnProperty("error")){
                            loginCodeFail();
                            return;
                        }
                        ModelViewController.coinState++
                        // ModelViewController.coinState>=1 means crfi loaded proper
                        if(ModelViewController.coinState>=1){
                           location.href = "verify.html";
                           }
                        console.log("3");
                        console.log(this.passportParams);
                        operationCallback(coinSymbol);
                    }
                });
            }
        });
    },

    getPassportApi: function(coinSymbol){
        console.log("getPassportApi");
        if(!coinSymbol){
            coinSymbol = 'crfi';
        }
        coinSymbol = 'crfi';
        switch(coinSymbol){
            case 'crfi':
                return this.crfiApi;
            case 'etnx':
                return this.etnxApi;
            case 'etnxp':
                return this.etnxpApi;
            case 'etnxc':
                return this.etnxcApi;
            case 'ltnx':
                return this.ltnxApi;
            case 'gldx':
                return this.gldxApi;
            default:
                break;
        };
    },
    getRatesApi: function(coinSymbol){
        console.log("getRatesApi");
        if(!coinSymbol){
            coinSymbol = 'crfi';
        }
        coinSymbol = 'crfi';
        switch(coinSymbol){
            case 'crfi':
                return this.exRatesApi;
//             case 'etnx':
//                 return this.etnxApi;
            default:
                break;
        };
    },

    getBlockchainLink: function(coinSymbol){
        console.log("getBlockchainLink");
        if(!coinSymbol){
            coinSymbol = 'crfi';
        }
        coinSymbol = 'crfi';
        switch(coinSymbol){
            case 'crfi':
                return this.crfiExpl;
            case 'etnx':
                return this.etnxExpl;
            case 'etnxp':
                return this.etnxpExpl;
            case 'etnxc':
                return this.etnxcExpl;
            case 'ltnx':
                return this.ltnxExpl;
            case 'gldx':
                return this.gldxExpl;
            default:
                break;
        };
    }
};

var jsonLogin = {"status":"success","data":{"uid":"1","password":"test"}};

var jsonLoginError = {"error": "fail"};

var jsonGetAddr = {
        "address":"88owYM3JXB5i8zT9pzcNGkhC3LmFCehSsdnnLZi995cSTeRPzHwXoXgdKD39NpErU8E2zmNjyoK7BV7DQ4e8ntm17UsNw1W",
        "balances":
            {"balance":123456789, "multisig_import_needed":false, "unlocked_balance":4567890
        },
        "txs":{
            "in": [ { "amount" : 1200,
                        "height" : 1234561,
                        "txid" : "5516752caac1ad451ad87c4cd5972d44ef6a80535e0218b3ad1507bc0135c52f" },
                        {"amount" : 1200,
                        "height" : 1234562,
                        "txid" : "5516752caac1ad451ad87c4cd5972d44ef6a80535e0218b3ad1507bc0135c52f" },
                        {"amount" : 1200,
                        "height" : 1234563,
                        "txid" : "5516752caac1ad451ad87c4cd5972d44ef6a80535e0218b3ad1507bc0135c52f" } ],
            "out": [ { "amount" : 1200,
                        "height" : 1234564,
                        "txid" : "5516752caac1ad451ad87c4cd5972d44ef6a80535e0218b3ad1507bc0135c52f" },
                        {"amount" : 1200,
                        "height" : 1234565,
                        "txid" : "5516752caac1ad451ad87c4cd5972d44ef6a80535e0218b3ad1507bc0135c52f" },
                        {"amount" : 1200,
                        "height" : 1234566,
                        "txid" : "5516752caac1ad451ad87c4cd5972d44ef6a80535e0218b3ad1507bc0135c52f" }],
        },"imports":[],"contracts":[]};

var Passport = {
    simulate: function(data){
        if(data.method == 'login'){
            if(data.password != "qwerty")
                return new Promise((resolve, reject) => {
                    setTimeout(function() { resolve(JSON.stringify(jsonLoginError)); }, 1000);
                });
            else
                return new Promise((resolve, reject) => {
                    setTimeout(function() { resolve(JSON.stringify(jsonLogin)); }, 1000);
                });
        }
        else if(data.method == 'check_code'){
            if(data.code != "12345")
                return new Promise((resolve, reject) => {
                    setTimeout(function() { resolve(JSON.stringify(jsonLoginError)); }, 1000);
                });
            else
                return new Promise((resolve, reject) => {
                    setTimeout(function() { resolve(JSON.stringify(jsonLogin)); }, 1000);
                });
        }
        else if(data.method == 'getaddr')
            return new Promise((resolve, reject) => {
                setTimeout(function() { resolve(JSON.stringify(jsonGetAddr)); }, 250);
            });
        else if(data.method == 'add_code')
            return new Promise((resolve, reject) => {
                setTimeout(function() { resolve(JSON.stringify(jsonGetAddr)); }, 250);
            });
        else if(data.method == 'register')
            return new Promise((resolve, reject) => {
                setTimeout(function() { resolve(JSON.stringify(jsonLogin)); }, 1000);
            });
        else if(data.method == 'send_transaction')
            return new Promise((resolve, reject) => {
                setTimeout(function() { resolve(JSON.stringify(jsonLogin)); }, 1000);
            });
        
        return new Promise((resolve, reject) => {
            reject("Method not supported");
        });
    }
};
