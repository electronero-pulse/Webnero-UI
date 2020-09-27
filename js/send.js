$(document).ready(function(){
    ModelViewController.fillData();
});

$(document).on("click", "#send-modal", function(){
    $('.form-group').removeClass("has-error");
    if(checkMandatoryField("amount") && checkMandatoryField("receiver"))
        $("#send-code-modal").modal('show');
});

function checkMandatoryField(id){
    if($("#" + id).val() == ""){
        $("#" + id).closest('.form-group').addClass("has-error");
        return false;
    }
    
    return true;
}

function sendCallback(coinSymbol){
	coinSymbol = 'crfi';
    PassportPipeline.setMethod('send_transaction');
	
    const coinAmount = $("#amount").val();
    var coinAmountToString = JSON.stringify(coinAmount);
    var coinAmountFloat = parseFloat(coinAmount);
    console.log("coinAmount: " + JSON.stringify(coinAmount));
    console.log("coinAmountFloat: " + coinAmountFloat);
    console.log("coinAmountFloat * 100000000000: " + coinAmountFloat * 100000000000);
    var amountOut = parseInt(ModelViewController.formatCoinTransaction(coinAmount, coinSymbol));
    console.log("amountOut: " + amountOut);
    PassportPipeline.passportParams.amount = parseInt(ModelViewController.formatCoinTransaction(coinAmount, coinSymbol));
    PassportPipeline.passportParams.receiver = $("#receiver").val();
    PassportPipeline.passportParams.pid = $("#pid").val();
   
    const _uuid = PassportPipeline.myDecipher(sessionStorage.getItem(coinSymbol+"_uuid"));
    const _email = PassportPipeline.myDecipher(sessionStorage.getItem("username"));
    const _password = PassportPipeline.myDecipher(sessionStorage.getItem("password"));
	if(_uuid){
        // logs
        console.log(_uuid);
        console.log(_email);
        console.log(_password);
	}
    console.log(PassportPipeline.passportParams)
    
    PassportPipeline.remoteCall(coinSymbol).then((response) => {
        if(response){
            console.log(response); 
            var sendResult = JSON.parse(response);
            if(sendResult.hasOwnProperty("error"))
                sendFail("Transaction Fail");
            else
                sendSuccess();    
        }
        else
            sendFail("System Fail");
    });
}


$(document).on("click", "#send", function(){
    $(".alert").css("display", "none");
    $(".btn-code").css("display", "none");
    if(pin_code.length < 5){
        sendFail("Provide 5 digits code");
    }
    else {
        $("#spinner-modal").modal('show');
        $("#send-code-modal").modal('hide');

        sessionStorage.setItem("code", PassportPipeline.myCipher(pin_code));
        console.log(pin_code);
        // check_code

        var coin_selected = $(".btn-selected").attr("id");
        PassportPipeline.setCode(PassportPipeline.myCipher(pin_code));
	    switch(coin_selected){
		case 'crfi-send':
            return PassportPipeline.performOperation("crfi", sendCallback);
        default:
            break;
	    }
    }     
});

function sendSuccess(){
    $(".alert-success").css("display", "block");
    $("#spinner-modal").modal('hide');
}

function sendFail(message){
    $(".alert-danger").html("Transfer error: " + message);
    $(".alert-danger").css("display", "block");
    $(".btn-code").css("display", "block");
    $("#spinner-modal").modal('hide');
}
