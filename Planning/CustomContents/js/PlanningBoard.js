$(function () {
    $("#loading-div-background").css({ opacity: 0.8 });
    LoadAllPlanData();
    $('[data-toggle="popover"]').popover({
        placement: 'left',
        trigger: 'hover'
    });

    $('tbody').scroll(function (e) {
        $('thead').css("left", -$("tbody").scrollLeft());
        $('thead th:nth-child(1)').css("left", $("tbody").scrollLeft());
        $('tbody td:nth-child(1)').css("left", $("tbody").scrollLeft()); 
    });
});

function LoadAllPlanData() {
    $("#loading-div-background").show();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/LoadAllPlanData",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateColumnHeader(data);
        }
    });
}

function PopulateColumnHeader(data) {
    var columns = [];
    var header = $('<tr/>');

    for (var i = 0; i < data.length; i++) {
        var row = data[i];

        for (var k in row) {
            if ($.inArray(k, columns) == -1) {
                var valArray = k.toString().split(',');
                columns.push(k);
                header.append($('<th/>').html(valArray[0]));
            }
        }
    }
    $("#tblMain thead").append("<tr style='background-color:forestgreen; color: #fff;'>" + header[0].innerHTML + "<tr/>");

    PopulateGridData(data, columns);
}

function PopulateGridData(data, cols) {
    for (var i = 0; i < data.length; i++) {
        var row = $('<tr/>');
        var _oddEven = 0;

        for (var colIndex = 0; colIndex < cols.length; colIndex++) {
            var val = data[i][cols[colIndex]];
            var _indexValue = "";
            var _className = 'table table-condensed';
            var _RowclassName = "row";
            var _RowcallName = "col-md-12";
            if (val == null)
                val = "";
            else {
                var valArray = val.toString().split('#');
                val = valArray[0];
                _indexValue = valArray[6];
            }
            if (_indexValue == "1") {
                _oddEven++;
            }
            if (colIndex == 0) {
                row.append($('<td/>').html("<span class='tdheadspan'><a href='javascript:void(0)' style='color: #fff;'>" + val + "</a></span>"));
            }
            else {
                if (val != "") {
                    if (parseInt(_oddEven) % 2 == 0) {
                        row.append($('<td/>').html("<span class='tdspan' data-toggle='popover' title='Plan Details' data-html='true' data-content='<table class=" + _className + "><tr><td><strong>PRID</strong></td><td>" + valArray[2] +
                            "</td></tr><tr><td><strong>File Ref</strong></td><td>" + valArray[8] +
                            "</td></tr><tr><td><strong>Style</strong></td><td>" + valArray[9] +
                            "</td></tr><tr><td><strong>Buyer</strong></td><td>" + valArray[10] +
                            "</td></tr><tr><td><strong>SAM</strong></td><td>" + valArray[11] +
                            "</td></tr><tr><td><strong>Product</strong></td><td>" + valArray[7] +
                            "</td></tr><tr><td><strong>Plan Qty</strong></td><td>" + valArray[0] +
                            "</td></tr><tr><td><strong>Produce Qty</strong></td><td>" + valArray[1] +
                            "</td></tr><tr><td><strong>Plan Start</strong></td><td>" + valArray[4] +
                            "</td></tr><tr><td><strong>Plan End</strong></td><td>" + valArray[5] +
                            "</td></tr></table>'>" + valArray[0] + "</span>"));
                    }
                    else {
                        row.append($('<td/>').html("<span class='tdoddspan' data-toggle='popover' title='Plan Details' data-html='true' data-content='<div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>PRID</strong></div><div class=" + _RowcallName + ">" + valArray[2] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>File Ref</strong></div><div class=" + _RowcallName + ">" + valArray[8] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Style</strong></div><div class=" + _RowcallName + ">" + valArray[9] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Buyer</strong></div><div class=" + _RowcallName + ">" + valArray[10] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>SAM</strong></div><div class=" + _RowcallName + ">" + valArray[11] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Product</strong></div><div class=" + _RowcallName + ">" + valArray[7] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Plan Qty</strong></div><div class=" + _RowcallName + ">" + valArray[0] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Produce Qty</strong></div><div class=" + _RowcallName + ">" + valArray[1] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Plan Start</strong></div><div class=" + _RowcallName + ">" + valArray[4] + "</div></div>" +
                            "<div class=" + _RowclassName + "><div class=" + _RowcallName + "><strong>Plan End</strong></div><div class=" + _RowcallName + ">" + valArray[5] + "</div></div>" +
                            "</div>'>" + valArray[0] + "</span>"));
                        //row.append($('<td/>').html("<span class='tdoddspan' data-toggle='popover' title='Plan Details' data-html='true' data-content='<table class=" + _className + "><tr><td><strong>PRID</strong></td><td>" + valArray[2] +
                        //    "</td></tr><tr><td><strong>File Ref</strong></td><td>" + valArray[8] +
                        //    "</td></tr><tr><td><strong>Style</strong></td><td>" + valArray[9] +
                        //    "</td></tr><tr><td><strong>Buyer</strong></td><td>" + valArray[10] +
                        //    "</td></tr><tr><td><strong>SAM</strong></td><td>" + valArray[11] +
                        //    "</td></tr><tr><td><strong>Product</strong></td><td>" + valArray[7] +
                        //    "</td></tr><tr><td><strong>Plan Qty</strong></td><td>" + valArray[0] +
                        //    "</td></tr><tr><td><strong>Produce Qty</strong></td><td>" + valArray[1] +
                        //    "</td></tr><tr><td><strong>Plan Start</strong></td><td>" + valArray[4] +
                        //    "</td></tr><tr><td><strong>Plan End</strong></td><td>" + valArray[5] +
                        //    "</td></tr></table>'>" + valArray[0]+"</span>"));
                    }
                }
                else {
                    row.append($('<td/>').html("<span class='tdemptyspan'><a href='javascript:void(0)'>" + val + "</a></span>"));
                }
            }
        }
        $("#tblMain tbody").append(row);
    }
    $("#loading-div-background").hide();
}