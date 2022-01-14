$(function () {
    PopulateGridData([]);
    $('#txtPlanDate').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtPlanDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtPlanDate').data('kendoDatePicker').options.opened = false;
        },
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy-MM-dd"]
    });

    $(document).delegate('#btnLoadData', 'click', function (e) {
        e.preventDefault();
        if ($('#txtPlanDate').val() === null || $('#txtPlanDate').val() === "") {
            PopulateGridData([]);
        }
        else {
            LoadProductionData($('#txtPlanDate').val(), $('#ddlCompany').val());
        }
    });
});

function LoadProductionData(PlanDate, CompanyID) {
    var _dbModel = { 'PlanDate': PlanDate, 'CompanyID': CompanyID };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: baseURL + "/Production/GetProductionUpdateData",
        data: JSON.stringify(_dbModel),
        async: true,
        datatype: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#divProductionUpdate").kendoGrid().empty();
    $("#divProductionUpdate").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "number" },
                        PRID: { type: "string" },
                        CompanyName: { type: "string" },
                        FileRefID: { type: "string" },
                        StyleName: { type: "string" },
                        LineNumber: { type: "string" },
                        PlanDate: { type: "string" },
                        DayQty: { type: "string" },
                        ProduceQty: { type: "string" },
                    }
                }
            }
        },
        toolbar: "<input filter-id='divProductionUpdate' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            { field: "PRID", title: "PRID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "CompanyName", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "FileRefID", width: 200, title: "File Ref ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "StyleName", width: 300, title: "Style", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlanDate", title: "Plan Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "DayQty", title: "Day Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProduceQty", title: "Produce Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "ProduceQty", title: "Status", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var _val = parseInt(dataItem.ProduceQty) - parseInt(dataItem.DayQty);
                    if (parseInt(_val) < 0)
                        return "<span class='spRed'><strong>" + _val + "</strong></span>";
                    else if (parseInt(_val) === 0)
                        return "<span class='spYellow'><strong>" + _val + "</strong></span>";
                    if (parseInt(_val) > 0)
                        return "<span class='spGreen'><strong>" + _val + "</strong></span>";
                }
            }
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