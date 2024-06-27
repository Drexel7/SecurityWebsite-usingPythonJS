var produseDisponibile = null;
onmessage = function(message){
    if(message.data[0] != produseDisponibile){
        produseDisponibile = message.data[0];
        postMessage(["changed", message.data[1]]);
    }
}