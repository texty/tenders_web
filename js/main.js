$(document).ready(function() {
    d3.csv('data/data1.csv', function(err, data1){
        if (err) throw err;

        // debugger;
        // return;
        $('#scheme-one-table').DataTable({
            "aaData": data1,
            "aoColumns": [
                {"mData": "winner_name", sTitle: "Переможець"},
                {"mData": "loser_name", sTitle: "Лузер"},
                {"mData": "total_count", sTitle: "Брали участь у тендерах"},
                {"mData": "total_volume", sTitle: "Сума по всіх тендерах"}
            ]
        });
    });




});

