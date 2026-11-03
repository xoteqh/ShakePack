function CSInterface() { this.getExtensions = function() { return []; }; }
CSInterface.prototype.evalScript = function(script, callback) {
    if (navigator.userAgent.indexOf("AdobeScript") >= 0 || typeof __adobe_cep__ !== "undefined") {
        __adobe_cep__.evalScript(script, callback || function() {});
    } else { console.log("Executing JSX:\n" + script); }
};
