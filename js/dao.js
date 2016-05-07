var dao = dao || (function() {
    function initRepo(callback) {
        chrome.storage.sync.get('site_info', function(res) {
            if (res['site_info']) {
                return callback();
            } else {
                chrome.storage.sync.set({
                    'site_info': {
                        totalTimes: 0,
                        details: {}
                    }
                }, function() {
                    return callback();
                });
            }
        });
    }

    function getAllSiteData(callback) {
        chrome.storage.sync.get('site_info', function(res) {
            return callback(res);
        });
    }

    return {
        initRepo: initRepo,
        getAllSiteData: getAllSiteData
    };
})();
