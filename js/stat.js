function saveData(hostName) {
    var currentHostInfo = res.site_info[hostName];
    if (currentHostInfo) {
        currentHostInfo.times++;
    } else {
        currentHostInfo = {
            times: 1
        }
    }
}

function geturl() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        var tabURL = tabs[0].url;
        tabURL = purl(tabURL);
        var hostName = tabURL.attr('host');
        chrome.storage.sync.get('site_info', function(data) {
            data = data['site_info'];
            var details = data.details;
            var currentHostInfo = details[hostName];
            if (currentHostInfo) {
                currentHostInfo.times++;
            } else {
                currentHostInfo = {
                    times: 1
                }
            }
            details[hostName] = currentHostInfo;
            data.totalTimes++;
            data.details = details;
            chrome.storage.sync.set({
                'site_info': data
            });

        });
    });
}
chrome.webNavigation.onCompleted.addListener(function(details) {
    dao.initRepo(function() {
        geturl();
    });
});
