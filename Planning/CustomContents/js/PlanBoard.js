$(function () {
    $(document).delegate('.clickabletd', 'click', function (e) {
        var $this = $(this);
        if ($this.hasClass('clicked')) {
            $this.removeClass('clicked');
           
            GetPRInformation($(this).attr('data-PRID'));
            //here is your code for double click
        } else {
            $this.addClass('clicked');
            setTimeout(function () {
                if ($this.hasClass('clicked')) {
                    var PlanDate = $this[0].attributes["data-date"];
                    var LineNo = $this[0].attributes["data-line"];
                    var PRID = $this[0].attributes["data-prid"];
                    var Qty = $this[0].attributes["data-qty"];
                    ShowPRUpdateModal(PlanDate.nodeValue, LineNo.nodeValue, PRID.nodeValue, Qty.nodeValue);
                    $this.removeClass('clicked');                    
                    //your code for single click               
                }
            }, 500);
        }
    });
    $(document).delegate('#UpdatePRBtn', 'click', function (e) {
        UpdatePRByDate();
    });

    $(document).on("mouseenter", "#tblMain tbody tr td", function (e) {
        $('.wy-tooltip').remove();
        var aTag;
        if (this.firstChild.className == "hero-image") {
            aTag = this.firstChild.firstChild.firstChild;
        } else {
            aTag = this.firstChild.firstChild;
        }
        var title = $(aTag).attr('data-title');
        $('<div class="wy-tooltip"></div>').html(title).appendTo('body');

        var toolTip = $('.wy-tooltip');
        var TTWidth = toolTip.width();
        var TTHeight = toolTip.height();

        var pLeft;
        var pTop;
        var offset = e.offsetX;
        var offsetY = e.offsetY;
        var CursorX = e.pageX;
        var CursorY = e.pageY;
        var WindowWidth = $("#divName").width();
        var WindowHeight = $("#divName").height();


        if (CursorX - offset >= (WindowWidth / 4) * 3) {
            pLeft = CursorX - TTWidth - offset;
        } else {
            pLeft = CursorX + offset;
        }
        if (CursorY - offset >= (WindowHeight / 4) * 3) {
            pTop = CursorY - TTHeight - offset;
        } else {
            pTop = CursorY + offset;
        }

        var divPos = {};
        var offsetDiv = $("#divName").offset();
        divPos = {
            left: e.pageX - offsetDiv.left,
            top: e.pageY - offsetDiv.top
        };

        var divWidth = $("#divName").width();

        if (typeof title !== "undefined") {
            if (CursorX > 700) {
                $('.wy-tooltip').css({ top: pTop, right: 100, width: divWidth * 0.7 });
            } else {
                $('.wy-tooltip').css({ top: pTop, left: 100, width: divWidth * 0.7 });
            }
        }


    });

    $(document).on("mouseleave", "#tblMain", function () {
        $('.wy-tooltip').remove();
    });


    $("#ddlCompanyID").val("ALL");
    $("#loading-div-background").css({ opacity: 0.8 });
    $(document).delegate('#btnLoadData', 'click', function (e) {
        e.preventDefault();
        LoadAllPlanData($("#ddlCompanyID").val(), $('#txtFromDate').val());
    });
    //$(document).delegate('#btnSelectedPR', 'click', function (e) {
    //    e.preventDefault();
    //    var trHeight = 24;
    //    var scroll = parseInt('161') * trHeight;
    //    $('#tblMain').scrollTop(scroll);
    //});addDays(new Date(2016, 0, 1), 5);
    $('#txtFromDate').kendoDatePicker({
        value: kendo.date.addDays(new Date(), 30),//new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtFromDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtFromDate').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"]
    });

    $(document).delegate('#btnSelectedPR', 'click', function (e) {
        e.preventDefault();
        LoadAllPlanBoardPR();
        $("#PRModal").modal("toggle");
    });

});

function LoadAllPlanBoardPR() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/LoadAllPlanBoardPR",
        data: {},
        async: true,
        dataType: "json",
        success: function (data) {
            BindPRListGrid(data);
        }
    });
}

function BindPRListGrid(data) {
    $("#tblPRList").kendoGrid().empty();
    $("#tblPRList").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "PRMasterID", title: "PRMasterID", filterable: false, hidden: true },
            { field: "PRID", title: "PR ID", filterable: true, }
        ],
        sortable: true,
        filterable: {

            mode: "row",
            operators: {
                string: {
                    contains: "Contains"
                }
            },
            extra: false,
        },
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit
    });
}

function detailInit(e) {
    var detailRow = e.detailRow;
    detailRow.find(".orders").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: baseURL + '/PlanningBoard/LoadPRInformationWithDateByID',
                    data: { PRMasterID: e.data.PRMasterID },
                    dataType: "json"
                }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            filter: { field: "LineNumber", operator: "eq", value: e.data.LineNumber }
        },
        scrollable: false,
        sortable: true,
        pageable: false,
        toolbar: "<div class='divGridInfo'>Line Information</div>",
        columns: [
            {
                field: "LineNumber",
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=JumpToLocation(' + dataItem.LineNumber + ',' + dataItem.PRMasterID + ')><strong>' + dataItem.LineNumber + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "StartDate", title: "Plan Start Date", filterable: true },
            { field: "EndDate", title: "Plan End Date", filterable: true },
        ],

    });
}

function LoadAllPlanData(CompanyID, EndDate) {
    var _dbModel = {
        'CompanyID': CompanyID, 'EndDate': EndDate
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/LoadAllPlanData",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            PopulateColumnHeader(data);
        }
    });
}

function PopulateColumnHeader(data) {
    $("#tblMain thead").empty();
    var columns = [];
    var monthheader = $('<tr/>');
    var header = $('<tr/>');
    var _monthName = "";

    for (var i = 0; i < data.length; i++) {
        var row = data[i];

        for (var k in row) {
            if ($.inArray(k, columns) == -1) {
                var valArray = k.toString().split(',');
                columns.push(k);

                if (valArray.length > 1) {
                    var monthArray = valArray[0].split(' ');
                    if (_monthName != monthArray[0]) {
                        header.append($('<th/>').html(monthArray[0] + "-" + valArray[1].substring(3, 5) + "<br>" + monthArray[1]));
                    }
                    else {
                        header.append($('<th/>').html(monthArray[1]));
                    }
                    _monthName = monthArray[0];
                }
                else {
                    header.append($('<th/>').html(valArray[0]));
                }
            }
        }
    }
    $("#tblMain thead").append("<tr style='background-color:forestgreen; color: #fff;'>" + header[0].innerHTML + "<tr/>");

    PopulateGridData(data, columns);
}

function PopulateGridData(data, cols) {
    $("#tblMain tbody").empty();

    for (var i = 0; i < data.length; i++) {
        //alert(data[i][cols[0]].toString());
        var b = i + 1;
        var rowIndexArray = data[i][cols[0]].toString().split(' - ');
        var m = parseInt(rowIndexArray[2]) + parseInt(b);
        var row = $('<tr class="' + m + '"/>');
        var _oddEven = 0;

        for (var colIndex = 0; colIndex < cols.length; colIndex++) {
            var val = data[i][cols[colIndex]];
            var _indexValue = "";
            var _className = 'table table-condensed tbltooltip';
            var _RowclassName = "row";
            var _RowcallName = "col-md-12";
            if (val == null) {
                val = "";
            }
            else {
                //alert(val.toString());
                var valArray = val.toString().split('#');
                val = valArray[0];
                _indexValue = valArray[6];
            }
            if (_indexValue == "1") {
                _oddEven++;
            }

            if (colIndex == 0) {
                row.append($('<td style="width:300px" />').html("<span class='tdheadspan' style='width:100px;'><a href='javascript:void(0)'>" + val + "</a></span>"));
            }
            else {
                if (val != "") {
                    valArray[9] = valArray[9].replace("'"," ");
                    valArray[9] = valArray[9].replace('"',' ');
                    if (parseInt(_oddEven) % 2 == 0) {

                        if (valArray[18] == 1) {
                            row.append($('<td data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd ' + valArray[3] + '"/>').html("<div class='hero-image' style='background-image: linear-gradient(125deg, #" + valArray[12] + " 25%, #F6F0CF 25%, #F6F0CF 50%, #" + valArray[12] + " 50%, #" + valArray[12] +" 75%, #F6F0CF 75%, #F6F0CF 100%);'><span class='spOff customtooltip tdspan SpanHover clsPR" + valArray[3] + "'  style='background: #" + valArray[12] + "' data-color='" + valArray[12] + "' data-toggle='popover'" +

                                "'><a href='#' class='noselect customtooltip' data-title='<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Product :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[0] + " |<strong>Produce Qty :</strong> " + valArray[1] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] +" | '>" + valArray[0] + "</a></span></div>"));
                        } else {
                            row.append($('<td data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd ' + valArray[3] + '"/>').html("<span class='customtooltip tdspan SpanHover clsPR" + valArray[3] + "'  style='background: #" + valArray[12] + "' data-color='" + valArray[12] + "' data-toggle='popover'" +

                                "'><a href='#' class='noselect customtooltip' data-title='<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Product :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[0] + " |<strong>Produce Qty :</strong> " + valArray[1] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " | '>" + valArray[0] + "</a></span>"));
                        }
                    }
                    else {

                        if (valArray[18] == 1) {
                            row.append($('<td data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd ' + valArray[3] + '"/>').html("<div class='hero-image' style='background-image: linear-gradient(125deg, #" + valArray[12] + " 25%, #F6F0CF 25%, #F6F0CF 50%, #" + valArray[12] + " 50%, #" + valArray[12] +" 75%, #F6F0CF 75%, #F6F0CF 100%);'><span class='spOff customtooltip tdoddspan SpanHover clsPR" + valArray[3] + "'  style='background: #" + valArray[12] + "' data-color='" + valArray[12] + "' data-toggle='popover' title='' data-html='true' data-content='<table class=" + _className + "><tr><td><strong>PRID</strong></td><td>" + valArray[2] +
                                "'><a class='noselect customtooltip' data-title='<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Product :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[0] + " |<strong>Produce Qty :</strong> " + valArray[1] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " | ' href='#' )>" + valArray[0] + "</a></span></div>"));
                        } else {
                            row.append($('<td data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd ' + valArray[3] + '"/>').html("<span class='customtooltip tdoddspan SpanHover clsPR" + valArray[3] + "'  style='background: #" + valArray[12] + "' data-color='" + valArray[12] + "' data-toggle='popover' title='' data-html='true' data-content='<table class=" + _className + "><tr><td><strong>PRID</strong></td><td>" + valArray[2] +
                                "'><a class='noselect customtooltip' data-title='<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Product :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[0] + " |<strong>Produce Qty :</strong> " + valArray[1] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " | ' href='#' )>" + valArray[0] + "</a></span>"));
                        }
                        
                    }
                }
                else {
                    row.append($('<td/>').html("<span class='tdemptyspan'><a href='javascript:void(0)'>" + val + "</a></span>"));
                }
            }
        }
        $("#tblMain tbody").append(row);
    }
}
function ShowPRUpdateModal(PlanDate, Line, PRMasterID, Qty) {
    var pdate = PlanDate.split("-");
    PlanDate = pdate[2] + '/' + pdate[1] + '/' + pdate[0];
    $("#PlanDate").val(PlanDate);
    $("#LineNo").val(Line);
    $("#PRMasterID").val(PRMasterID);
    $("#txtPlanQty").val(Qty);
    //$('#PRUpdateModal').modal("toggle");
}
function UpdatePRByDate() {
    var PlanDate = $("#PlanDate").val();
    var LineNumber = $("#LineNo").val();
    var PRMasterID = $("#PRMasterID").val();
    var PlanQty = $("#txtPlanQty").val();
    var ProducedQty = $("#txtProducedQty").val();


    var arrProdUpdate = [];

    if (ProducedQty !== "") {
        arrProdUpdate.push({
            PRMasterID: PRMasterID,
            PlanDate: PlanDate,
            LineNumber: LineNumber,
            DayQty: ProducedQty
        });
    } else {
        alert("Produce Quantity Not Found!!");
        return false;
    }

    var _dbModel = { '_dbModel': arrProdUpdate };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Production/SaveProductionUpdate",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                swal('Good job!', 'Data Updated Successfully..!', 'success');
                $("#txtProducedQty").val("");
                $('#PRUpdateModal').modal("toggle");
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function GetPRInformation(PRMasterID) {
    //alert($(".clsPR" + PRMasterID).hasClass("currentPR"));    
    if ($(".clsPR" + PRMasterID).hasClass("currentPR") === false) {
        $(".tdoddspan").removeClass('currentPR');
        $(".tdspan").removeClass('currentPR');
        $(".clsPR" + PRMasterID).addClass('currentPR');
    }
    else {
        $(".clsPR" + PRMasterID).removeClass('currentPR');
    }
    var _dbModel = {
        'PRMasterID': PRMasterID
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/LoadSelectedPRInformation",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            $("#tblPRMaster tbody").empty();

            var _html = "";
            _html += "<tr><td><strong>PRID</strong></td><td><strong>FileRef ID</strong></td><td><strong>Style</strong></td><td><strong>Buyer Name</strong></td><td><strong>Company Name</strong></td><td><strong>Product Type</strong></td><td><strong>Status</strong></td><td><strong>SAM</strong></td><td><strong>Planned Production</strong></td><td><strong>Org Efficiency</strong></td><td><strong>Increment Type</strong></td></tr>";
            _html += "<tr><td>" + data.PRMaster[0].PRID + "</td><td>" + data.PRMaster[0].FileRefID + "</td><td>" + data.PRMaster[0].StyleID + "</td><td>" + data.PRMaster[0].BuyerName + "</td><td>" + data.PRMaster[0].CompanyName + "</td><td>" + data.PRMaster[0].ProductType + "</td><td>" + data.PRMaster[0].Status + "</td><td>" + data.PRMaster[0].SAM + "</td><td>" + data.PRMaster[0].PlannedProduction + "</td><td>" + data.PRMaster[0].OrgEfficiency + "</td><td>" + data.PRMaster[0].IncrementType + "</td></tr>";

            //_html += "<tr><td><strong>SAM</strong></td><td><strong>Planned Production</strong></td><td><strong>Org Efficiency</strong></td><td><strong>Increment Type</strong></td><td><strong></strong></td><td><strong></strong></td><td><strong></strong></td></tr>";
            //_html += "<tr><td>" + data.PRMaster[0].SAM + "</td><td>" + data.PRMaster[0].PlannedProduction + "</td><td>" + data.PRMaster[0].OrgEfficiency + "</td><td>" + data.PRMaster[0].IncrementType + "</td><td></td><td></td><td></td></tr>";

            $("#tblPRMaster tbody").append(_html);

            BindPRLineGridData(data.PRLine);
            BindPREOGridData(data.PREO);
        }
    });
}
function BindPRLineGridData(data) {
    $("#tblPRLine").kendoGrid().empty();
    $("#tblPRLine").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "PRID", title: "PR ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "WorkStation", title: "Work Station", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "WorkingMinutes", title: "Working Minutes", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "AverageEfficency", title: "Avg Efficency", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "Target Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlanStartDate", title: "Plan Start Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FirstDayOutput", title: "First Day OutPut", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IncrementQty", title: "Increment Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "HourlyTarget", title: "Hourly Target", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "DailyLineTarget", title: "Daily Line Target", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "AddedBy", title: "Added By", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "DateAdded", title: "Date Added", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } }
        ],
        sortable: true,
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains",
                    startswith: "Starts With",
                    eq: "Is Equal To"
                }
            }
        },
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });
}
function BindPREOGridData(data) {
    $("#tblPREO").kendoGrid().empty();
    $("#tblPREO").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "ExportOrderID", title: "EO ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SizeGroup", title: "Size Group", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UOM", title: "UOM", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Destination", title: "Destination", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UnitName", title: "Unit Name", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ShipMode", title: "Ship Mode", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportPONo", title: "Export PO No", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PCD", title: "PCD", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetDate", title: "Target Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        sortable: true,
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains",
                    startswith: "Starts With",
                    eq: "Is Equal To"
                }
            }
        },
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });
}

function JumpToLocation(LineNumber, PRMasterID) {

    var array = new Array();

    $('#tblMain tbody tr').each(function () {
        var firstCell = $(this).find('td').first();
        array.push(firstCell.context.firstChild.innerText.split(" - ")[2]);
    });

    var ind = 0;

    $.each(array, function (i, item) {
        if (item === LineNumber) {
            ind = i + 1;
        }
    });

    var scroll = parseInt(ind) * 22;
    $('#divName').scrollTop(scroll);

    GetPRInformation(PRMasterID);

    $("#PRModal").modal("hide");
}