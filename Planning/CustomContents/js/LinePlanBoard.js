Date.prototype.getDayOfYear = function () {
    var fd = new Date(this.getFullYear(), 0, 0);
    var sd = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    return Math.ceil((sd - fd) / 86400000);
};

Date.prototype.getLastDayOfMonth = function () {
    var y = this.getFullYear();
    var m = this.getMonth();
    return new Date(y, m + 1, 0);
};

function dateDifference(d1, d2) {
    var fd = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
    var sd = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.ceil((sd - fd) / 86400000);
}

$(function () {
    $("#Kendofilter").val("");
    G_KendoGridName = "tblPRList";
    $(document).delegate('.clickabletd', 'click', function (e) {
        var $this = $(this);
        //$this.removeClass('clicked');
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
        var title = "";
        if (this.firstChild.className === "div-hero-image") {
            aTag = this.firstChild.firstChild.firstChild;
        } else {
            aTag = this.firstChild.firstChild;
        }
        var _className = this.firstChild.className;
        //alert(_className.includes("layout"));
        //if (this.firstChild.className === "layout") {
        if (_className.includes("layout")) {
            title = $(this).attr("data-title");
        }
        else {
            title = $(aTag).attr('data-title');
        }
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
        var WindowWidth = $("#divPlanArea").width();
        var WindowHeight = $("#divPlanArea").height();


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
        var offsetDiv = $("#divPlanArea").offset();
        divPos = {
            left: e.pageX - offsetDiv.left,
            top: e.pageY - offsetDiv.top
        };

        var divWidth = $("#divPlanArea").width();

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
    $(document).delegate('#tblMain tbody > tr > td', 'click', function (e) {
        if ($(this).attr('data-PR') !== undefined)
            CopyPRID($(this).attr('data-PR'));
    });
    $(".k-datepicker input").prop("readonly", true);
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
    $("#Kendofilter").val("");

    $("#tblPRList").kendoGrid().empty();
    $("#tblPRList").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "number" },
                        PRID: { type: "string" }
                    }
                }
            },
            sort: { field: "PRMasterID", dir: "asc" }
        },
        columns: [
            {
                field: "PRMasterID", title: "PRMasterID", filterable: false, hidden: true
            },
            { field: "PRID", title: "PR ID", filterable: false, }
        ],
        sortable: true,
        filterable: false,
        resizable: true,
        height: 400,
        pageable: false,
        scrollable: true,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit
    });
    setTimeout(alertFunc, 1000);
}
function alertFunc() {
    var grid = $("#tblPRList").data("kendoGrid");
    grid.refresh();
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
                field: "Line Number",
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
    var columns = [];

    for (var i = 0; i < data.length; i++) {
        var row = data[i];

        for (var k in row) {
            if ($.inArray(k, columns) == -1) {
                columns.push(k);
            }
        }
    }

    var nowDate = new Date();
    var date = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();
    var startDate = new Date(date);
    var _startDateNumber = nowDate.getDate();


    var d = new Date($('#txtFromDate').val());
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var _endDateStr = year.toString().replace("-", "") + "/" + month + "/" + date;
    var _lastMonthTotalDays = date;

    var _endDate = new Date(_endDateStr);

    var endDate = new Date(_endDate);
    var dayDiff = dateDifference(startDate, endDate);
    var _startMonth = nowDate.getMonth();

    var _startDateYear = nowDate.getFullYear();
    var _endDateYear = year.toString().replace("-", "");

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var EndMonthName = monthNames[month - 1];


    var months = '';
    var _isStartMonth = true;

    if (_startDateYear.toString() !== _endDateYear.toString()) {
        month = monthNames.length;
    }

    for (var i = _startMonth; i < month; i++) {
        if (_isStartMonth) {
            var _colspanNumber = monthDays[i] - _startDateNumber + 1;
            months += '<td>Line</td>';
            months += '<td colspan="' + _colspanNumber + '">' + monthNames[i] + '</td>';
            _isStartMonth = false;
        }
        else if (_startDateYear.toString() !== _endDateYear.toString()) {
            months += '<td colspan="' + monthDays[i] + '">' + monthNames[i] + '</td>';
        }
        else if (_startDateYear.toString() === _endDateYear.toString() && monthNames[i] === EndMonthName) {
            //var _colspanNumber = monthDays[i] - _startDateNumber + 1;
            //alert(1);
            //var _colspanNumber = _startDateNumber - 1;
            months += '<td colspan="' + _lastMonthTotalDays + '">' + monthNames[i] + '</td>';
        }
        else {
            months += '<td colspan="' + monthDays[i] + '">' + monthNames[i] + '</td>';
        }

        if (_startDateYear.toString() !== _endDateYear.toString()) {
            if (monthNames[i] === "December") {
                _startDateYear = parseInt(_startDateYear) + 1;
                _startMonth = 0;
                i = -1;

                if (_startDateYear.toString() === _endDateYear.toString()) {
                    month = d.getMonth() + 1;
                }
                else {
                    month = 12;
                }
            }
        }
    }
    $('tr#months').html(months);



    var numbers = '';
    var counter = _startDateNumber;
    var month = nowDate.getMonth();

    numbers += '<td>Number</td>';

    for (i = 0; i <= dayDiff; i++) {
        numbers += '<td>' + counter + '</td>';
        counter++;
        if (counter > monthDays[month]) {
            month++;
            counter = 1;

            if (month === 12) {
                month = 0;
            }
        }
    }
    $('tr#numbers').html(numbers);

    PopulateGridData(data, columns);
}
function PopulateGridData(data, cols) {
    $("#tblMain tbody").empty();

    for (var i = 0; i < data.length; i++) {
        var b = i + 1;
        var rowIndexArray = data[i][cols[0]].toString().split(' - ');
        var m = parseInt(rowIndexArray[2]) + parseInt(b);
        var row = $('<tr id="td' + m + '" class="' + m + '"/>');
        var _oddEven = 0;
        var _PrevPlanDate = "";
        var _lastColorName = "";

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
                var valArray = val.toString().split('#');
                val = valArray[0];
                _indexValue = valArray[6];
                _PrevPlanDate = valArray[16];
            }
            if (_indexValue == "1") {
                _oddEven++;
            }

            if (colIndex == 0) {
                row.append($('<td style="width:300px" />').html("<span class='tdheadspan' style='width: 85px;display: block;'><a href='javascript:void(0)' style='color: #000;font-size: 7pt;font-weight: 600;font-family: tahoma;' onclick=GetLineDetails('" + val.split(' ').join('\xa0') + "')>" + val + "</a></span>"));
            }
            else {
                if (val != "") {
                    var _isEndDate = "";
                    if (valArray[16] === valArray[22]) {
                        _isEndDate = "clsEndDate";
                    }

                    //if (valArray[23].indexOf('/') != -1) {
                    //    console.log(valArray[23] + '-' + _lastColorName + '-' + valArray[12]);
                    //}

                    valArray[9] = valArray[9].replace("'", " ");
                    valArray[9] = valArray[9].replace('"', ' ');
                    if (parseInt(_oddEven) % 2 == 0) {

                        if (valArray[18] == 1) {
                            var _dTitle = "<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Priority :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[23] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " |";
                            row.append($('<td style="background:#' + valArray[12] + ';" data-PR="' + valArray[2] + '" data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="div-hero-image clickabletd noselect customtooltip ' + _isEndDate + ' ' + valArray[3] + ' showOtherPR' + valArray[3] + '" data-title="' + _dTitle + '"  />').html("<section class='layout clsPR" + valArray[3] + "'><div class='section-tout'><i style='margin-top: 2px;margin-right: 5px;' class='fa fa-check-circle fa-lg'></i>" + valArray[0] + "</div></section>"));
                        } else {
                            var _dTitle = "<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Priority :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[23] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " |";
                            row.append($('<td style="background:#' + valArray[12] + ';border-bottom: 1px solid;" data-PR="' + valArray[2] + '" data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd noselect customtooltip ' + _isEndDate + ' ' + valArray[3] + ' showOtherPR' + valArray[3] + '" data-title="' + _dTitle + '"  />').html("<section class='layout clsPR" + valArray[3] + "'><div class='section-tout'>" + valArray[0] + "</div></section>"));

                            //row.append($('<td style="background:#' + valArray[12] + ';border-bottom: 1px solid;" data-PR="' + valArray[2] + '" data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd  ' + _isEndDate + ' ' + valArray[3] + ' showOtherPR' + valArray[3] + '"/>').html("<span class='customtooltip tdspan SpanHover clsPR" + valArray[3] + "'  style='background: #" + valArray[12] + "' data-color='" + valArray[12] + "' data-toggle='popover'" +
                            //    "'><a href='#' class='noselect customtooltip " + _isEndDate + "' data-title='<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Priority :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[23] + " |<strong>Produce Qty :</strong> " + valArray[1] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " | '>" + valArray[0] + "</a></span>"));
                        }
                    }
                    else {

                        if (valArray[18] == 1) {
                            var _dTitle = "<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Priority :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[23] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " |";
                            row.append($('<td style="background:#' + valArray[12] + ';" data-PR="' + valArray[2] + '" data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="div-hero-image clickabletd noselect customtooltip ' + _isEndDate + ' ' + valArray[3] + ' showOtherPR' + valArray[3] + '" data-title="' + _dTitle + '"  />').html("<section class='layout clsPR" + valArray[3] + "'><div class='section-tout'><i style='margin-top: 2px;margin-right: 5px;' class='fa fa-check-circle fa-lg'></i>" + valArray[0] + "</div></section>"));
                        } else {
                            var _dTitle = "<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Priority :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[23] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " |";
                            row.append($('<td style="background:#' + valArray[12] + ';border-bottom: 1px solid;" data-PR="' + valArray[2] + '" data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd noselect customtooltip ' + _isEndDate + ' ' + valArray[3] + ' showOtherPR' + valArray[3] + '" data-title="' + _dTitle + '"  />').html("<section class='layout clsPR" + valArray[3] + "'><div class='section-tout'>" + valArray[0] + "</div></section>"));
                            //row.append($('<td style="background:#' + valArray[12] + ';border-bottom: 1px solid;" data-PR="' + valArray[2] + '" data-PRID="' + valArray[3] + '" data-Line="' + valArray[17] + '" data-Date="' + valArray[16] + '" data-Qty="' + valArray[0] + '"  class="clickabletd ' + _isEndDate + ' ' + valArray[3] + ' showOtherPR' + valArray[3] + '"/>').html("<span class='customtooltip tdoddspan SpanHover clsPR" + valArray[3] + "" + valArray[3] + "'  style='background: #" + valArray[12] + "' data-color='" + valArray[12] + "' data-toggle='popover' title='' data-html='true' data-content='<table class=" + _className + "><tr><td><strong>PRID</strong></td><td>" + valArray[2] +
                            //    "'><a class='noselect customtooltip' data-title='<strong>PR ID : </strong>" + valArray[2] + " |<strong>File Ref : </strong>" + valArray[8] + " | <strong>Style :</strong> " + valArray[9] + " | <strong>Buyer :</strong> " + valArray[10] + " | <strong>SAM :</strong> " + valArray[11] + " | <strong>Priority :</strong> " + valArray[7] + " |<strong>Plan Qty :</strong> " + valArray[23] + " |<strong>Produce Qty :</strong> " + valArray[1] + " |<strong>Start Date :</strong> " + valArray[4] + " |<strong>End Date :</strong> " + valArray[5] + " |<strong>Total Planned Qty :</strong> " + valArray[13] + " |<strong>Total Produce Qty :</strong> " + valArray[14] + "|<strong>Total Balance Qty :</strong> " + valArray[15] + "|<strong>Line Target Qty :</strong> " + valArray[19] + "|<strong>Line Produce Qty :</strong> " + valArray[20] + "|<strong>Line Balance Qty :</strong> " + valArray[21] + " | ' href='#' )>" + valArray[0] + "</a></span>"));
                        }

                    }

                    _lastColorName = valArray[12];
                }
                else {
                    row.append($('<td style="background:yellow; border-bottom: 1px solid;" />').html("<span class='tdemptyspan'><a href='javascript:void(0)'>" + val + "</a></span>"));
                }
            }
        }
        $("#tblMain tbody").append(row);
    }

    $("#divDataAreaPanel").removeClass("hidden");
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
    var _sideBarStatus = $("#sidebar2").attr("aria-hidden");
    if ($(".clsPR" + PRMasterID).hasClass("currentPR") === false) {
        $(".tdoddspan").removeClass('currentPR');
        $(".tdspan").removeClass('currentPR');
        $(".layout").removeClass('currentPR');
        //$(".clickabletd").removeClass('currentPR');
        $(".clickabletd").addClass('hideOtherPR');
        $(".showOtherPR" + PRMasterID).removeClass('hideOtherPR');
        $(".clsPR" + PRMasterID).addClass('currentPR');

        var _dbModel = {
            'PRMasterID': PRMasterID
        };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: baseURL + "/PlanningBoard/LoadSidebarPRInformation",
            data: JSON.stringify(_dbModel),
            async: false,
            dataType: "json",
            success: function (data) {
                $("#tblPRSummaryInfo").kendoGrid().empty();
                $("#tblPRSummaryInfo").kendoGrid({
                    dataSource: {
                        data: data,
                        dataType: "json"
                    },
                    columns: [
                        { field: "PRID", title: "PR ID", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "FileRefID", title: "File Ref", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "BuyerName", title: "Buyer", width: "120px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "StyleID", title: "Style", width: "300px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "PlannedProduction", title: "Plan Qty", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "LineNumber", title: "Line", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "PlanStartDate", title: "Start Date", width: "80px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "EndDate", title: "End Date", width: "80px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                        { field: "TargetQty", title: "Line Qty", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
                    ],
                    sortable: true,
                    filterable: false,
                    resizable: true,
                    pageable: false,
                    height: 70,
                    scrollable: true
                });
                //$("#sideBarContent").empty();
                //var _htmlMaster = "";
                //var _htmlLine = "";

                //_htmlMaster += "<div class='divCellInfo sideBarMaster'>";
                //_htmlMaster += "<table style='margin-bottom: 0px;' class='table table-condenced'><tbody>";
                //_htmlMaster += "<tr><td><strong class='lblTitlePR'>PR ID</strong></td><td>" + data[0].PRID + "</td></tr>";
                //_htmlMaster += "<tr><td><strong class='lblTitlePR'>File Ref ID</strong></td><td>" + data[0].FileRefID + "</td></tr>";
                //_htmlMaster += "<tr><td><strong class='lblTitlePR'>Style Name</strong></td><td>" + data[0].StyleID + "</td></tr>";
                //_htmlMaster += "<tr><td><strong class='lblTitlePR'>Buyer Name</strong></td><td>" + data[0].BuyerName + "</td></tr>";
                //_htmlMaster += "<tr><td><strong class='lblTitlePR'>Planned Production</strong></td><td>" + data[0].PlannedProduction + "</td></tr>";
                //_htmlMaster += "</tbody></table>";
                //_htmlMaster += "</div>";

                //_htmlMaster += "<div class='divCellInfo sidebarLine'>";
                //_htmlLine += "<table style='margin-bottom: 0px;' class='table table-condenced'>";
                //_htmlLine += "<thead><tr><th>Line Number</th><th>Line Start Date</th><th>Plan Date</th><th>Target Qty</th></tr></thead>";
                //$.each(data, function (index, value) {
                //    _htmlLine += "<tr><td>" + value.LineNumber + "</td><td>" + value.PlanStartDate + "</td><td>" + value.StartDate + "<hr>" + value.EndDate + "</td><td>" + value.TargetQty + "<hr>" + value.ProduceQty + "</td></tr>";
                //});
                //_htmlLine += "</table>";
                //_htmlLine += "</div>";

                //$("#sideBarContent").html(_htmlMaster + _htmlLine);

                //if (_sideBarStatus === "true")
                //    $("#btnSideBarClick").trigger("click");
            }
        });
    }
    else {
        //if (_sideBarStatus === "false")
        //    $("#btnSideBarClick").trigger("click");
        $("#tblPRSummaryInfo").empty();
        $(".clsPR" + PRMasterID).removeClass('currentPR');        
        $(".clickabletd").removeClass('hideOtherPR');
        $("#sideBarContent").empty();
    }
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
    //var rowpos = $('.' + LineNumber).position();
    //rowpos.top = rowpos.top - 30;
    //$('#tblMain').scrollTop(rowpos.top);
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
    $('#divPlanArea').scrollTop(scroll);

    GetPRInformation(PRMasterID);

    $("#divPlanArea").modal("hide");
}
function GetLineDetails(val) {
    var _sideBarStatus = $("#sidebar2").attr("aria-hidden");

    var valArray = val.toString().split('-');
    var LineNumber = valArray[2];
    var _dbModel = {
        'LineNumber': LineNumber
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/GetLineDetails",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            $("#sideBarContent").empty();
            var _divData = "";
            $.each(data, function (index, value) {
                _divData += "<div class='divCellInfo'>" +
                    "   <div class='row'>" +
                    "       <div class='col-sm-12 col-md-4 col-lg-4 text-right'>" +
                    "           <label class='lblTitle'>PR ID :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <div class='row'>" +
                    "               <div class='col-sm-12 col-md-4 col-lg-4'>" +
                    "                   <a href='javascript:void(0)' onclick=GetPRLineQty(" + value.PRMasterID + "," + LineNumber + ")>" + value.PRID + "</a>" +
                    "               </div>" +
                    "               <div class='col-sm-12 col-md-8 col-lg-8' style='padding-left: 12%;font-size: 12pt;margin-top: -6px;'>" +
                    "                   <a title='Copy PR ID' href='javascript:void(0)' onclick=CopyPRID('" + value.PRID + "')><ion-icon name='document-attach-outline'></ion-icon></a>" +
                    "                   <a title='PR Line Plan Date' href='javascript:void(0)' onclick=GetPRLineQty(" + value.PRMasterID + "," + LineNumber + ")><ion-icon name='calendar-number-outline'></ion-icon></a>" +
                    "                   <a title='PR Line Wise Quantity' href='javascript:void(0)' onclick=GetPRLineInformation(" + value.PRMasterID + "," + LineNumber + ")><ion-icon name='cellular-outline'></ion-icon></a>" +
                    "                   <a title='PR EO Information' href='javascript:void(0)' onclick=GetPREOInformation(" + value.PRMasterID + "," + LineNumber + ")><ion-icon name='list-outline'></ion-icon></a>" +
                    "                   <a title='Produce Quantity' href='javascript:void(0)' onclick=GetPRWiseProduceQty(" + value.PRMasterID + "," + LineNumber + ")><ion-icon name='shield-half-outline'></ion-icon></a>" +
                    "               </div>" +
                    "           </div>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='row'>" +
                    "       <div class='col-sm-12 col-md-4 col-lg-4 text-right'>" +
                    "           <label class='lblTitle'>Style :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <span>" + value.Style + "</span>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='row'>" +
                    "       <div class='col-sm-12 col-md-4 col-lg-4 text-right'>" +
                    "           <label class='lblTitle'>Total Days :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <span>" + value.TotalDays + "</span>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='row'>" +
                    "       <div class='col-sm-12 col-md-4 col-lg-4 text-right'>" +
                    "           <label class='lblTitle'>Date :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <span>" + value.StartDate + " - " + value.EndDate + "</span>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='row'>" +
                    "       <div class='col-sm-12 col-md-4 col-lg-4 text-right'>" +
                    "           <label class='lblTitle'>Target Qty :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <span>" + value.TargetQty + " / <a title='Produce Qty' href='javascript:void(0)' onclick=GetPRWiseProduceQty(" + value.PRMasterID + "," + LineNumber + ")>" + value.ProduceQty + "</a></span>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='row'>" +
                    "       <div class='col-sm-12 col-md-4 col-lg-4 text-right'>" +
                    "           <label class='lblTitle'>Priority :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <span>" + value.PriorityNo + "</span>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='text-center divPRDateList divDateHide' id='divPR" + value.PRMasterID + "'>" +
                    "   </div>" +
                    "</div>";
            });

            var _heading = "<div class='divCellInfo'>" +
                "               <div class='row'>" +
                "                   <div class='col-sm-12 col-md-6 col-lg-6 text-center'><label>Line Details For </label></div>" +
                "                   <div class='col-sm-12 col-md-6 col-lg-6 text-center'><span class='spanLineTitle'>" + LineNumber + "</span></div>" +
                "               </div>" +
                "           </div> ";

            $("#sideBarContent").html(_heading + _divData);

            if (_sideBarStatus === "true")
                $("#btnSideBarClick").trigger("click");
        }
    });
}
function GetPRLineQty(PRMasterID, LineNumber) {
    var _dbModel = {
        'PRMasterID': PRMasterID, 'LineNumber': LineNumber
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/GetPRLineQty",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            $("#divPR" + PRMasterID).empty();
            var _dateHeader = "<div class='row divPlanDateRow'><div class='col-md-6'> Plan Date </div><div class='col-md-6'> Qty <a class='btnDateDivClose' href='javascript:void(0)' onclick=CloseDateDiv(" + PRMasterID + ")><i class='fa fa-close'></i></a></div></div>";
            var _dateList = "";
            $.each(data, function (index, value) {
                _dateList += "<div class='row divPlanDateRow'><div class='col-md-6'>" + value.TargetDate + "</div><div class='col-md-6'>" + value.TargetQty + "</div></div>";
            });
            $("#divPR" + PRMasterID).append(_dateHeader + _dateList);
            $("#divPR" + PRMasterID).removeClass("divDateHide");
        }
    });
}
function GetPRLineInformation(PRMasterID, LineNumber) {
    var _dbModel = {
        'PRMasterID': PRMasterID, 'LineNumber': LineNumber
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/GetPRLineInformation",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            $("#divPR" + PRMasterID).empty();
            var _dateHeader = "<div class='row divPlanDateRow'><div class='col-md-6'> Line Number </div><div class='col-md-6'> Target Qty <a class='btnDateDivClose' href='javascript:void(0)' onclick=CloseDateDiv(" + PRMasterID + ")><i class='fa fa-close'></i></a></div></div>";
            var _dateList = "";
            $.each(data, function (index, value) {
                _dateList += "<div class='row divPlanDateRow'><div class='col-md-6'>" + value.LineNumber + "</div><div class='col-md-6'>" + value.TargetQty + "</div></div>";
            });
            $("#divPR" + PRMasterID).append(_dateHeader + _dateList);
            $("#divPR" + PRMasterID).removeClass("divDateHide");
        }
    });
}
function GetPREOInformation(PRMasterID, LineNumber) {
    var _dbModel = {
        'PRMasterID': PRMasterID, 'LineNumber': LineNumber
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/GetPREOInformation",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            $("#divPR" + PRMasterID).empty();
            var _dateHeader = "<div class='row divPlanDateRow'><div class='col-md-6'> EO ID </div><div class='col-md-6'> EO Qty <a class='btnDateDivClose' href='javascript:void(0)' onclick=CloseDateDiv(" + PRMasterID + ")><i class='fa fa-close'></i></a></div></div>";
            var _dateList = "";
            $.each(data, function (index, value) {
                _dateList += "<div class='row divPlanDateRow'><div class='col-md-6'>" + value.ExportOrderID + "</div><div class='col-md-6'>" + value.PRQty + "</div></div>";
            });
            $("#divPR" + PRMasterID).append(_dateHeader + _dateList);
            $("#divPR" + PRMasterID).removeClass("divDateHide");
        }
    });
}
function GetPRWiseProduceQty(PRMasterID, LineNumber) {
    var _dbModel = {
        'PRMasterID': PRMasterID, 'LineNumber': LineNumber
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PlanningBoard/GetPRWiseProduceQty",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            $("#divPR" + PRMasterID).empty();
            if (data.length > 0) {
                var _dateHeader = "<div class='row divPlanDateRow'><div class='col-md-6'> Plan Date </div><div class='col-md-6'> Produce Qty <a class='btnDateDivClose' href='javascript:void(0)' onclick=CloseDateDiv(" + PRMasterID + ")><i class='fa fa-close'></i></a></div></div>";
                var _dateList = "";
                $.each(data, function (index, value) {
                    _dateList += "<div class='row divPlanDateRow'><div class='col-md-6'>" + value.StartDate + "</div><div class='col-md-6'>" + value.ProduceQty + "</div></div>";
                });
                $("#divPR" + PRMasterID).append(_dateHeader + _dateList);
                $("#divPR" + PRMasterID).removeClass("divDateHide");
            }
            else {
                $("#divPR" + PRMasterID).append("<div class='col-md-12'><a class='btnDateDivClose' href='javascript:void(0)' onclick=CloseDateDiv(" + PRMasterID + ")><i class='fa fa-close'></i></a></div><h4>No Produce Quantity Found..!</h4>");
                $("#divPR" + PRMasterID).removeClass("divDateHide");
            }
        }
    });
}
function CopyPRID(PRID) {
    navigator.clipboard.writeText(PRID);
}
function CloseDateDiv(PRMasterID) {
    $("#divPR" + PRMasterID).addClass("divDateHide");
    $("#divPR" + PRMasterID).empty();
}