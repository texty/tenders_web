$(document).ready(function() {
    var currencyFmt = function(d){
        return d3.format(",.0f")(+d / 1000).replace(/,/g, " ");
    };



    d3.csv('data/data1.csv', function(err, data1){
        if (err) throw err;

        data1.forEach(function(d){d.total_volume = +d.total_volume});

        // debugger;

        $('#scheme-one-table').DataTable({
            language: {url: "Ukrainian.json"},

            aaData: data1,
            aoColumns: [
                {mData: "winner_name", sTitle: "Переможець"},
                {mData: "loser_name", sTitle: "Лузер"},
                {mData: "total_count", sTitle: "Брали участь у тендерах"},
                {mData: "total_volume", mRender: function(data, type, full) {
                    if (type === 'display') return currencyFmt(full.total_volume);
                    return data
                }, sTitle: "Сума по всіх тендерах, тис. грн"}
                // {mData: "total_volume", sTitle: "Сума по всіх тендерах"}
            ],

            order: [[3, "desc"]]
        });
    });




});

