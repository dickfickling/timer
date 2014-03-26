chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.alarms.get('getUpdate', function (alarm) {
        if (!alarm || confirm("Do you want to create a new log?")) {
            var d = new Date();
            d.setHours(0,0,0,0);
            getUpdate(prompt("Which log should these events be added to?", d.toDateString()));
        } else {
            getUpdate();
        }
    });
});

function getUpdate(name) {
    chrome.storage.local.get('timer', function (got) {
        var timer = got.timer = got.timer || {}
        if (name === undefined) {
            var d = new Date();
            d.setHours(0,0,0,0);
            name = (timer && timer.latest) || prompt("Which log should these events be added to?", d.toDateString());
        }
        if (name === undefined) return;
        var done = prompt("What did you do?");
        if (done === 'end') {
            chrome.alarms.clear('getUpdate');
            alert(timer.histories[timer.latest].dones.join('\n') || 'nothing!');
        } else if (done != null) {
            timer.histories = timer.histories || {};
            var history = timer.histories[name];
            if (history == undefined) history = timer.histories[name] = {};
            history.dones = history.dones || [];
            history.dones.push(done);
            chrome.storage.local.set({timer: { latest: name, histories: timer.histories } }, function () {
                chrome.alarms.create('getUpdate', { delayInMinutes: 30 });
            });
        }
    });
};


function onAlarm(alarm) {
    if (alarm && alarm.name == 'getUpdate') {
        getUpdate();
    }
};

chrome.alarms.onAlarm.addListener(onAlarm);
