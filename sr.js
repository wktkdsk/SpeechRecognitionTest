
function MySpeechRecognition(lang, bContinueous, resultID, logID) {
    // self
    var m_self = this;

    // valuables
    this.bEnableSpeechRecognition = false;
    this.bFinal = false;

    // SpeechRecognition API
    window.SpeechRecognition
        = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof(window.SpeechRecognition) == "undefined") return;
    this.speechRecognition = new window.SpeechRecognition();
    this.speechRecognition.lang = lang;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.continuous = bContinueous;
    this.speechRecognition.maxAlternatives = 1;

//    console.log(this.speechRecognition);

    // callback functions for SpeechRecognition API
    this.speechRecognition.onresult = function(event) {
        m_self.postLog("result");
        console.log(event);
        var result = event.results[0];
        if (result.isFinal) {
            if (!m_self.bFinal) {
                m_self.bFinal = true;
                m_self.speechRecognition.stop();
                m_self.postResult(result[0].transcript);
            }
        } else {
            m_self.postInterimResult(result[0].transcript);
        }
    };
    this.speechRecognition.onstart = function(event) {
        m_self.postLog("start");
        m_self.bFinal = false;
    };
    this.speechRecognition.onend = function(event) {
        m_self.postLog("end");
        m_self.serialNumber += 1;
        if (m_self.bEnableSpeechRecognition) {
            m_self.speechRecognition.start();
        }
    };
    this.speechRecognition.onaudiostart = function(event) {
        m_self.postLog("audiostart");
    };
    this.speechRecognition.onaudioend = function(event) {
        m_self.postLog("audioend");
    };
    this.speechRecognition.onerror = function(event) {
        m_self.postLog("error");
    };
    this.speechRecognition.onnomatch = function(event) {
        m_self.postLog("nomatch");
    };
    this.speechRecognition.onsoundstart = function(event) {
        m_self.postLog("soundsgtart");
    };
    this.speechRecognition.onsoundend = function(event) {
        m_self.postLog("soundend");
    };
    this.speechRecognition.onspeechstart = function(event) {
        m_self.postLog("speechstart");
    };
    this.speechRecognition.onspeechend = function(event) {
        m_self.postLog("speechend");
    };
    
    // functions
    this.start = function() {
        m_self.bEnableSpeechRecognition = true;
        m_self.speechRecognition.start();
    };
    this.stop = function() {
        m_self.bEnableSpeechRecognition = false;
        m_self.speechRecognition.stop();
    };
    this.abort = function() {
        m_self.speechRecognition.abort();
    };
    this.postInterimResult = function(text) {
        var obj = $(resultID).children().last();
        if (obj.hasClass("interim_text")) {
            obj.text(text);
        } else {
            var html = '<div class="interim_text">' + text + "</div>";
            $(resultID).append(html);

        }
        $(resultID).scrollTop($(resultID).get(0).scrollHeight);
    };
    this.postResult = function(text) {
        var obj = $(resultID).children().last();
        if (obj.hasClass("interim_text")) {
            obj.removeClass("interim_text");
            obj.text(text);
        } else {
            var html = '<div>' + text + "</div>";
            $(resultID).append(html);
        }
        $(resultID).scrollTop($(resultID).get(0).scrollHeight);
    };
    this.postLog = function(text) {
        var html = "<div>"+text+"</div>";
        $(logID).append(html);
        $(logID).scrollTop($(logID).get(0).scrollHeight);
        
    };

}
