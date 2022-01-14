$(function () {
    $("#Kendofilter").val("");
    G_KendoGridName = "divUnMappedFileRef";
    LoadYearNo();
    PopulateUnMappedFileRefGridData([]);
    $(document).delegate('#ddlYearNo', 'change', function (e) {
        if ($("#ddlYearNo").val() === "-1") {
            PopulateUnMappedFileRefGridData([]);
        }
        else {
            BindFileUnMappedGridData($("#ddlYearNo").val());
        }
    });
});
function LoadYearNo() {
    var _StartYear = 2018;
    var d = new Date();
    var YearNo = d.getFullYear();

    $("#ddlYearNo").empty();
    $("#ddlYearNo").append($("<option/>").val("-1").text("Select Year No"));
    for (var i = _StartYear; i <= YearNo; i++) {
        $("#ddlYearNo").append($("<option/>").val(i).text(i));
    }

    $("#ddlLineNumber").selectpicker('refresh');
    $("#ddlLineNumber").selectpicker('render');
}

function BindFileUnMappedGridData(YearNo) {
    var _dbModel = { 'YearNo': YearNo };
    $.ajax({
        type: "POST",
        url: baseURL + "/Utility/LoadUnMappedFileRef",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            PopulateUnMappedFileRefGridData(data);
        }
    });
}
function PopulateUnMappedFileRefGridData(data) {
    $("#divUnMappedFileRef").kendoGrid().empty();
    $("#divUnMappedFileRef").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        FileRefID: { type: "string" },
                        FileOriginID: { type: "string" },
                        Buyer: { type: "string" },
                        StyleName: { type: "string" },
                        FileCategory: { type: "string" },
                        FileStatus: { type: "string" },
                        OrderQty: { type: "number" }
                    }
                }
            }
        },
        columns: [
            { field: "FileRefID", title: "File Ref ID", width: 100, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileOriginID", title: "File Origin ID", width: 120, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Buyer", title: "Buyer", width: 200, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "StyleName", title: "Style Name", width: 400, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "FileCategory", title: "File Category", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileStatus", title: "File Status", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });
}