$(function () {
    $("#ddlStatus").val("-1");
    $("#Kendofilter").val("");
    G_KendoGridName = "divPRStatus";

    $("#divPRStatus").kendoGrid().empty();

    $(document).delegate('#ddlStatus', 'change', function (e) {
        e.preventDefault();
        $("#Kendofilter").val("");
        if ($(this).val() === "-1") {
            BindGridData([]);
        }
        else {
            LoadPRWiseStatus($(this).val());
        }
    });
});

function LoadPRWiseStatus(Status) {
    var _dbModel = { 'Status': Status };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/LoadPRWiseStatus",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            BindGridData(data);
        }
    });
}

function BindGridData(data) {
    $("#divPRStatus").kendoGrid().empty();
    $("#divPRStatus").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "string" },
                        PRID: { type: "string" },
                        StyleName: { type: "string" },
                        CompanyName: { type: "string" },
                        BuyerName: { type: "string" },
                        FileRefID: { type: "string" },
                        ProductType: { type: "string" },
                        StyleType: { type: "string" },
                        SelectedQty: { type: "string" },
                        ExcessQty: { type: "string" },
                        PlannedProduction: { type: "string" },
                        ProduceQty: { type: "string" },
                        Status: { type: "string" },
                    }
                }
            }
        },
        columns: [
            { field: "PRMasterID", hidden: true, title: "PR ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "PRID", title: "PR ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleName", title: "Style Name", width: 250, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "CompanyName", title: "Company", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "Buyer", width: 150, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "FileRefID", title: "File Ref ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProductType", title: "Product Type", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleType", title: "Style Type", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SelectedQty", title: "SelectedQty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExcessQty", title: "ExcessQty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlannedProduction", title: "Planned Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProduceQty", title: "Produce Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Status", title: "Status", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        pageable: false,
        scrollable: true,
        height: "400px"
    });
}