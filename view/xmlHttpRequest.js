
function createXhrObject() {
    return new window.XMLHttpRequest();
}

function createAndSendHttpRequest(method, url, post, headers, responseType, callback) {

    var xhr = new createXhrObject();

    xhr.open(method, url, true);

    for(key in headers){
        xhr.setRequestHeader(key,headers[key]);
    }

    xhr.onload = function requestLoaded() {

        var statusText = xhr.statusText || '';

        var response = ('response' in xhr) ? xhr.response : xhr.responseText;

        var status = xhr.status === 1223 ? 204 : xhr.status;

        callback(status, response, xhr.getAllResponseHeaders(), statusText);

    };

    xhr.onerror = function requestError(){
        callback(-1, null, null, "");
    };

    xhr.onabort = function requestAbort(){
        callback(-2, null, null, "");
    }

    if (responseType) {
        try {
            xhr.responseType = responseType;
        } catch (e) {
            if (responseType !== 'json') {
                throw e;
            }
        }
    }

    xhr.send(post);
}