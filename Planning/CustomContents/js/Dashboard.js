$(function () {
    LoadDashboardSummaryData();
    $("#spFactory").text("ALL");
    $(document).delegate('.btnPlanSummary', 'click', function (e) {
        e.preventDefault();
        $(".btnFilter").removeClass("btnFilter");
        $(this).addClass("btnFilter");

        var CompanyID = $(this).attr("data-company");
        $("#spFactory").text(CompanyID);
        LoadDashboardCompanySummaryData(CompanyID);
    });
    $(document).delegate('#divBookedQty', 'click', function (e) {
        e.preventDefault();
        LoadBookedQuantitySummaryData();
    });
    //$(document).delegate('#btnRightToPlanYear', 'click', function (e) {
    //    e.preventDefault();
    //    var YearNo = $("#txtToPlanYear").val();
    //    LoadYearWiseToPlanData(parseInt(YearNo) + 1);
    //});
    //$(document).delegate('#btnDownloadToPlanData', 'click', function (e) {
    //    e.preventDefault();
    //    var YearNo = $("#txtToPlanYear").val();
    //    window.open(baseURL + "/Report/DownloadReportToPlanData?YearNo=" + YearNo);
    //});
});
function LoadBookedQuantitySummaryData() {
    var _dbModel = { 'CompanyID': $("#spFactory").text() };
    var _companyName = "";
    if ($("#spFactory").text() === "ALL")
        _companyName = "ALL";
    else if ($("#spFactory").text() === "04")
        _companyName = "BGL";
    else if ($("#spFactory").text() === "06")
        _companyName = "MGL";
    else if ($("#spFactory").text() === "08")
        _companyName = "KTL";
    else if ($("#spFactory").text() === "09")
        _companyName = "RHL";

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: baseURL + "/Dashboard/LoadBookedQuantitySummaryData",
        data: JSON.stringify(_dbModel),
        async: true,
        datatype: "json",
        success: function (dataSource) {
            var data = JSON.parse(dataSource);
            $("#divPlanQuantity").kendoGrid().empty();
            $("#divPlanQuantity").kendoGrid({
                dataSource: {
                    data: data.Table,
                    dataType: "json",
                    schema: {
                        model: {
                            fields: {
                                CompanyName: { type: "string" },
                                PRID: { type: "string" },
                                StyleName: { type: "string" },
                                LineNumber: { type: "string" },
                                LineDayQty: { type: "string" },
                            }
                        }
                    }
                },
                toolbar: "<a class='btn'>" + _companyName + "</a><a class='btn btn-primary'><i class='fa fa-download'></i> Download Data</a> <input filter-id='divPlanQuantity' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
                columns: [
                    { field: "CompanyName", width: 100, title: "Company", filterable: true, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
                    { field: "PRID", width: 100, title: "PRID", filterable: true, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
                    { field: "StyleName", title: "Style", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: Left" } },
                    { field: "LineNumber", width: 150, title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal; text-align: center" }, attributes: { style: "text-align: center" } },
                    { field: "LineDayQty", width: 150, title: "Line Qty", filterable: false, headerAttributes: { style: "white-space: normal; text-align: center" }, attributes: { style: "text-align: center" } },
                ],
                editable: false,
                sortable: true,
                filterable: false,
                resizable: true,
                pageable: false,
                scrollable: true
            });
        }
    });
    $("#modalPRQuantityInformation").modal("toggle");
}
function LoadDashboardCompanySummaryData(CompanyID) {
    var _dbModel = { 'CompanyID': CompanyID };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: baseURL + "/Dashboard/LoadDashboardCompanySummaryData",
        data: JSON.stringify(_dbModel),
        async: false,
        datatype: "json",
        success: function (data) {
            $("#divBookedQty").empty();
            $("#divActivePR").empty();
            $("#divActiveLines").empty();

            $("#divMonthBookedQtyTitle").empty();
            $("#divMonthBookedQty").empty();

            $("#divMonthProduceQtyTitle").empty();
            $("#divMonthProduceQty").empty();
            var _data = JSON.parse(data);

            $("#divMonthBookedQtyTitle").text(_data.Table1[0].MonthNames + " BOOKED QTY");
            $("#divMonthProduceQtyTitle").text(_data.Table2[0].MonthNames + " PRODUCE QTY");

            $("#divBookedQty").text(_data.Table[0].BookedQty);
            $("#divMonthBookedQty").text(_data.Table1[0].MonthBookedQty);
            $("#divMonthProduceQty").text(_data.Table2[0].ProduceQty);
            $("#divActivePR").text(_data.Table3[0].ActivePR);
            $("#divActiveLines").text(_data.Table4[0].ActiveLine);
        }
    });

    $('.qtyCounter').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}
function LoadDashboardSummaryData() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: baseURL + "/Dashboard/LoadDashboardDataSummary",
        data: {},
        async: false,
        datatype: "json",
        success: function (data) {
            $("#divBookedQty").empty();
            $("#divActivePR").empty();
            $("#divActiveLines").empty();

            $("#divMonthBookedQtyTitle").empty();
            $("#divMonthBookedQty").empty();

            $("#divMonthProduceQtyTitle").empty();
            $("#divMonthProduceQty").empty();
            var _data = JSON.parse(data);

            $("#divMonthBookedQtyTitle").text(_data.Table1[0].MonthNames + " BOOKED QTY");
            $("#divMonthProduceQtyTitle").text(_data.Table2[0].MonthNames + " PRODUCE QTY");

            $("#divBookedQty").text(_data.Table[0].BookedQty);
            $("#divMonthBookedQty").text(_data.Table1[0].MonthBookedQty);
            $("#divMonthProduceQty").text(_data.Table2[0].ProduceQty);
            $("#divActivePR").text(_data.Table3[0].ActivePR);
            $("#divActiveLines").text(_data.Table4[0].ActiveLine);
        }
    });

    $('.qtyCounter').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}
//function LoadYearWiseToPlanData(YearNo) {
//    var _dbModel = { 'YearNo': YearNo };
//    $.ajax({
//        type: "POST",
//        contentType: "application/json",
//        url: baseURL + "/Dashboard/LoadYearWiseToPlanData",
//        data: JSON.stringify(_dbModel),
//        async: true,
//        datatype: "json",
//        success: function (data) {
//            PopulateToPlanData(data);
//            $("#txtToPlanYear").val(YearNo);
//        }
//    });
//}
//function LoadDashboardLineData() {
//    $.ajax({
//        type: "GET",
//        contentType: "application/json",
//        url: baseURL + "/Dashboard/LoadDashboardLineData",
//        data: {},
//        async: true,
//        datatype: "json",
//        success: function (data) {
//            PopulateLineSummaryData(data.LineSummaryData);
//            PopulateToPlanData(data.ToPlanData);

//            $("#txtToPlanYear").val(new Date().getFullYear());
//        }
//    });
//}
//function PopulateLineSummaryData(data) {
//    $("#divLineSummary").kendoGrid().empty();
//    $("#divLineSummary").kendoGrid({
//        dataSource: {
//            data: data,
//            dataType: "json",
//            schema: {
//                model: {
//                    fields: {
//                        UnitName: { type: "string" },
//                        LineNumber: { type: "string" },
//                        LineDayQty: { type: "string" },
//                        CurrentMonthQty: { type: "string" },
//                        CurrentMonthProduceQty: { type: "string" },
//                        LastPlanDate: { type: "string" },
//                    }
//                }
//            }
//        },
//        toolbar: "Line Information<input filter-id='divLineSummary' style='float: right;' class='k-textbox KendoCommonfilter' placeholder='Search..' />",
//        columns: [
//            { field: "UnitName", title: "Unit", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            { field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            { field: "LineDayQty", title: "Line Plan Qty", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            {
//                title: "Current Month", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" },
//                columns: [
//                    { field: "CurrentMonthQty", title: "Remaining Plan Qty", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//                    { field: "CurrentMonthProduceQty", title: "Total Produce Qty", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } }
//                ]
//            },
//            { field: "LastPlanDate", title: "Last Plan Date", filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//        ],
//        editable: false,
//        sortable: true,
//        filterable: false,
//        resizable: true,
//        height: 300,
//        pageable: false,
//        scrollable: true
//    });
//}
//function PopulateToPlanData(data) {
//    $("#divUnMappedFileRef").kendoGrid().empty();
//    $("#divUnMappedFileRef").kendoGrid({
//        dataSource: {
//            data: data,
//            dataType: "json",
//            schema: {
//                model: {
//                    fields: {
//                        FileRefID: { type: "string" },
//                        FileOriginID: { type: "string" },
//                        Buyer: { type: "string" },
//                        StyleName: { type: "string" },
//                        FileCategory: { type: "string" },
//                        FileStatus: { type: "string" },
//                        OrderQty: { type: "number" }
//                    }
//                }
//            }
//        },
//        toolbar: "To Plan Data <a id='btnLeftToPlanYear' style='margin-left: 5%;' href='javascript:void(0)' class='k-link k-button k-button-icon' title='Refresh'><span class='k-icon k-i-arrow-60-left'></span></a>" +
//            "<input style='width: 54px;' id='txtToPlanYear' class='k-textbox KendoCommonfilter' placeholder='' readonly />" +
//            "<a id='btnRightToPlanYear' href='javascript:void(0)' class='k-link k-button k-button-icon' title='Refresh'><span class='k-icon k-i-arrow-60-right'></span></a>" +
//            "<a id='btnDownloadToPlanData' href='javascript:void(0)' class='k-pager-refresh k-link k-button k-button-icon' title='Refresh'><span class='k-icon k-i-download'></span></a>"+
//            "<input filter-id='divUnMappedFileRef' style='float: right;' class='k-textbox KendoCommonfilter' placeholder='Search..' />",
//        columns: [
//            { field: "FileRefID", title: "File Ref ID", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            { field: "FileOriginID", title: "File ID", width: 70, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            { field: "Buyer", title: "Buyer", width: 80, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: left" } },
//            { field: "StyleName", title: "Style Name", width: 100, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: left" } },
//            { field: "FileCategory", title: "File Category", width: 80, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            { field: "FileStatus", title: "File Status", width: 80, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//            { field: "OrderQty", title: "Order Qty", width: 50, filterable: false, headerAttributes: { style: "white-space: normal;text-align: center" }, attributes: { style: "text-align: center" } },
//        ],
//        editable: false,
//        sortable: true,
//        filterable: false,
//        resizable: true,
//        height: 300,
//        pageable: false,
//        scrollable: true
//    });
//}