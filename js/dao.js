var dao = dao || (function() {
    var db = openDatabase('veddb', '1.0', '网站访问记录数据库', 2 * 1024 * 1024);

    function initDB(callback) {
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS record(hostname,visittime)', [], function() {
                return callback();
            }, function() {
                return callback();
            });
        });
    }

    function add(hostname) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO record(hostname, visittime)' +
                ' VALUES(?,?)', [hostname, Math.floor(Date.now() / 1000)]);
        });
    }

    function getAll(startDate, endDate, callback) {
        startDate = startDate ? startDate : 0;
        endDate = endDate ? endDate : Math.floor(Date.now() / 1000);
        db.transaction(function(tx) {
            tx.executeSql('SELECT hostname, COUNT(hostname) AS times ' +
                'FROM record ' +
                'WHERE visittime BETWEEN ? AND ?' +
                'GROUP BY hostname ' +
                'ORDER BY times DESC', [startDate, endDate],
                function(tx, result) {
                    return callback(result.rows);
                },
                function(tx, error) {
                    console.log(error);
                });
        });
    }

    return {
        initDB: initDB,
        add: add,
        getAll: getAll,
    };
})();
