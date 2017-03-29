$(document).ready(function () {

    var language = {
        "sProcessing": "Зачекайте...",
        "sLengthMenu": "Показати _MENU_ записів",
        "sZeroRecords": "Записи відсутні.",
        "sInfo": "Записи з _START_ по _END_ із _TOTAL_ записів",
        "sInfoEmpty": "Записи з 0 по 0 із 0 записів",
        "sInfoFiltered": "(відфільтровано з _MAX_ записів)",
        "sInfoPostFix": "",
        "sSearch": "Пошук:",
        "sUrl": "",
        "oPaginate": {
            "sFirst": "Перша",
            "sPrevious": "Попередня",
            "sNext": "Наступна",
            "sLast": "Остання"
        },
        "oAria": {
            "sSortAscending": ": активувати для сортування стовпців за зростанням",
            "sSortDescending": ": активувати для сортування стовпців за спаданням"
        }
    };

    var count_template = Handlebars.compile($("#count_template").html());
    var volume_template = Handlebars.compile($("#volume_template").html());
    var table_one_modal_template = Handlebars.compile($("#table-one-modal-template").html());
    var table_two_modal_template = Handlebars.compile($("#table-two-modal-template").html());
    var link_to_deal_template = Handlebars.compile($("#link_to_deal_template").html());
    var link_to_buyer_template = Handlebars.compile($("#link_to_buyer_template").html());
    var link_to_seller_template = Handlebars.compile($("#link_to_seller_template").html());


    var currencyFmt = function (d) {
        return d3.format(",.0f")(+d / 1000).replace(/,/g, " ");
    };

    var partNumFmt = d3.format(",.2f");

    d3.csv('data/data1.csv', function (err, data1) {
        if (err) throw err;

        data1.forEach(function (d) {
            d.total_volume = +d.total_volume;

            if (d.winner_id == "NA") d.winner_id = null;
            if (d.loser_id == "NA") d.loser_id = null;
        });

        window.data1= data1;

        var table1 = $('#scheme-one-table').DataTable({
            language: language,

            aaData: data1,
            aoColumns: [
                {mData: "winner_name", sTitle: "Переможець", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_seller_template({seller_name: full.winner_name, seller_id: full.winner_id});
                    return data;
                }},
                {mData: "loser_name", sTitle: "Лузер", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_seller_template({seller_name: full.loser_name, seller_id: full.loser_id});
                    return data;
                }},
                {
                    mData: "total_count", sTitle: "Були у парі", mRender: function (data, type, full) {
                    if (type === 'display') return count_template(full);
                    return data;
                }
                },
                {
                    mData: "total_volume", mRender: function (data, type, full) {
                    if (type === 'display') return volume_template(currencyFmt(full.total_volume));
                    return data;
                }, sTitle: "Виграш на всіх тендерах, тис. грн", sType: "numeric"
                }
                // {mData: "total_volume", sTitle: "Сума по всіх тендерах"}
            ],
            "columnDefs": [
                {className: "dt-body-center", "targets": [2]},
                {className: "dt-body-right volume-padding-right", "targets": [3]}
            ],
            order: [[2, "desc"],[3, "desc"]],
            drawCallback: function (settings) {
                // Output the data for the visible rows to the browser's console
                $('#scheme-one-table tbody').on('click', 'td', function () {

                    var d = table1.row(this).data();
                    console.log(d);

                    $("#myModal").html(table_one_modal_template(d));

                    d3.csv('data/1/' + d.id + ".csv", function (err, data) {
                        $("#modal-table").DataTable({
                            language: language,
                            destroy: true,
                            paging: false,
                            info: false,
                            searching: false,
                            aaData: data,
                            aoColumns: [
                                {
                                    mData: "buyer_name", sTitle: "Замовник", mRender: function (data, type, full) {
                                    if (type === 'display') return link_to_buyer_template(full);
                                    return data;
                                }
                                },
                                {
                                    sTitle: "Переможець", mRender: function (data, type, full) {
                                    var seller;

                                    if (full.winner === "TRUE") seller = {
                                        seller_name: d.winner_name,
                                        seller_id: d.winner_id
                                    }; else seller = {
                                        seller_name: d.loser_name,
                                        seller_id: d.loser_id
                                    };

                                    return link_to_seller_template(seller);
                                }
                                },
                                {
                                    mData: "volume",
                                    sTitle: "Ціна переможця, тис. грн",
                                    mRender: function (data, type, full) {
                                        if (type === 'display') return link_to_deal_template({
                                            contract_id: full.contract_id,
                                            value: currencyFmt(full.volume)
                                        });
                                        return data;
                                    }
                                },
                                {
                                    mData: "loser_bid",
                                    sTitle: "Програшна ціна, тис. грн", mRender: function (data, type, full) {
                                        if (type === 'display') return link_to_deal_template({
                                            contract_id: full.contract_id,
                                            value: currencyFmt(full.loser_bid)
                                        });
                                        return data;
                                    }
                                }


                            ],
                            order: [[2, "desc"]]

                        });
                    });
                });


            }
        });
    });








    d3.csv('data/data2.csv', function (err, data2) {
        if (err) throw err;

        data2.forEach(function (d) {
            d.diff_reg = (d.diff_reg == 1) ? "так": "ні"
        });

        var table2 = $('#scheme-two-table').DataTable({
            language: language,

            aaData: data2,
            aoColumns: [
                {mData: "buyer_x_name", sTitle: "Замовник&nbsp;1", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_buyer_template({buyer_name: full.buyer_x_name, buyer_id: full.buyer_x});
                    return data;
                }},
                {mData: "seller_x_name", sTitle: "Переможець&nbsp;1", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_seller_template({seller_name: full.seller_x_name, seller_id: full.seller_x});
                    return data;
                }},
                {mData: "volume_x", sTitle: "Сума&nbsp;1", mRender: function (data, type, full) {
                    if (type === 'display') return volume_template(currencyFmt(full.volume_x));
                    return data;
                }},


                {mData: "buyer_y_name", sTitle: "Замовник&nbsp;2", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_buyer_template({buyer_name: full.buyer_y_name, buyer_id: full.buyer_y});
                    return data;
                }},
                {mData: "seller_y_name", sTitle: "Переможець&nbsp;2", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_seller_template({seller_name: full.seller_y_name, seller_id: full.seller_y});
                    return data;
                }},
                {mData: "volume_x", sTitle: "Сума&nbsp;2", mRender: function (data, type, full) {
                    if (type === 'display') return volume_template(currencyFmt(full.volume_y));
                    return data;
                }},

                {mData: "diff_reg", sTitle: "Обмін регіонами"}

            ],
            "columnDefs": [
                {className: "dt-body-center", "targets": [6]},
                {className: "dt-body-right", "targets": [2,5]}
            ],
            order: [[2, "desc"],[5, "desc"], [6, "desc"]],
            drawCallback: function (settings) {
                $('#scheme-two-table tbody').on('click', 'td', function () {

                    var d = table2.row(this).data();
                    console.log(d);

                    $("#myModal").html(table_two_modal_template(d));

                    d3.csv('data/2/' + d.id + ".csv", function (err, data) {
                        $("#modal-table").DataTable({
                            language: language,
                            destroy: true,
                            paging: false,
                            info: false,
                            searching: false,
                            aaData: data,
                            aoColumns: [
                                {
                                    mData: "buyer_name", sTitle: "Замовник", mRender: function (data, type, full) {
                                    if (type === 'display') return link_to_buyer_template(full);
                                    return data;
                                }},
                                {
                                    mData: "winner_name", sTitle: "Переможець", mRender: function (data, type, full) {
                                    if (type === 'display') return link_to_seller_template({
                                        seller_name: full.winner_name,
                                        seller_id: full.winner_id
                                    });
                                    return data;
                                }
                                },
                                {
                                    mData: "win_volume",
                                    sTitle: "Ціна переможця, тис. грн",
                                    mRender: function (data, type, full) {
                                        if (type === 'display') return link_to_deal_template({
                                            contract_id: full.contract_id,
                                            value: currencyFmt(full.win_volume)
                                        });
                                        return data;
                                    }
                                },
                                {
                                    mData: "lose_volume",
                                    sTitle: "Програшна ціна, тис. грн", mRender: function (data, type, full) {
                                    if (type === 'display') return link_to_deal_template({
                                        contract_id: full.contract_id,
                                        value: currencyFmt(full.lose_volume)
                                    });
                                    return data;
                                }
                                }


                            ],
                            order: [[2, "desc"]]

                        });
                    });
                });
            }
        });
    });

    d3.csv('data/data3.csv', function (err, data3) {
        if (err) throw err;

        data3.forEach(function (d) {
            d.volume=+d.volume;
        });

        var table3 = $('#scheme-three-table').DataTable({
            language: language,

            aaData: data3,
            aoColumns: [
                {mData: "buyer_name", sTitle: "Замовник", mRender: function (data, type, full) {
                    if (type === 'display') return link_to_buyer_template(full);
                    return data;
                }},
                {mData: "part_num", sTitle: "Середня к-сть учасників на тендер", mRender: function (data, type, full) {
                    if (type === 'display') return partNumFmt(full.part_num);
                    return data;
                }},
                {mData: "count", sTitle: "Тендерів"},
                {mData: "volume", sTitle: "Загальга сума, тис. грн", mRender: function (data, type, full) {
                    if (type === 'display') return currencyFmt(full.volume);
                    return data;
                }}
            ],
            "columnDefs": [
                {className: "dt-body-center", "targets": [1, 2]},
                {className: "dt-body-right volume-padding", "targets": [3]}
            ],
            order: [[1, "asc"],[3, "desc"], [2, "desc"]]
        });
    });


});

