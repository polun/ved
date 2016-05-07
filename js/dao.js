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

    function getAll(callback) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT hostname, COUNT(hostname) AS times ' +
                'FROM record GROUP BY hostname ' +
                'ORDER BY times DESC', [],
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
