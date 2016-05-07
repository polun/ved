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
        if (tabs.length > 0) {
            var tabURL = tabs[0].url;
            tabURL = purl(tabURL);
            var hostName = tabURL.attr('host');
            dao.add(hostName);
        }
    });
}
chrome.webNavigation.onCompleted.addListener(function(details) {
    dao.initDB(function() {
        geturl();
    });
});
