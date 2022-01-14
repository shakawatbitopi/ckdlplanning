$(function () {
    $("#Kendofilter").val("");
    G_KendoGridName = "divPRInfo";
    LoadPRLineNumber();
    BindPRLineGridData([]);
    $(document).delegate('#ddlLineNumber', 'change', function (e) {
        if ($(this).val() === "-1")
            BindPRLineGridData([]);
        else
            LoadSelectedLineDetails($(this).val());
    });

    $(document).delegate('#btnManualProcess', 'click', function (e) {
        if ($("#ddlLineNumber").val() === "-1") {
            alert('Please Select Line Number..!');
            return false;
        }
        else {
            ProcessLineNumberManually($("#ddlLineNumber").val());
        }
    });
});

function LoadPRLineNumber() {
    $.ajax({
        type: "GET",
        url: baseURL + "/Utility/GetLineNumber",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlLineNumber").empty();
            $("#ddlLineNumber").append($("<option/>").val("-1").text("Select Line Number"));
            $.each(data, function (i, item) {
                $("#ddlLineNumber").append($("<option/>").val(item.LineNumber).text(item.LineNumber));
            });
        }
    });

    $("#ddlLineNumber").selectpicker('refresh');
    $("#ddlLineNumber").selectpicker('render');
}

function LoadSelectedLineDetails(LineNumber) {
    var _dbModel = { 'LineNumber': LineNumber };
    $.ajax({
        type: "POST",
        url: baseURL + "/Utility/LoadSelectedLineDetails",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            BindPRLineGridData(data);
        }
    });
}
function BindPRLineGridData(data) {
    $("#divPRInfo").kendoGrid().empty();
    $("#divPRInfo").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "string" },
                        PRID: { type: "string" },
                        StyleName: { type: "string" },
                        LineNumber: { type: "string" },
                        LineStartDate: { type: "string" },
                        PlanStartDate: { type: "string" },
                        PlanEndDate: { type: "string" },
                        TargetQty: { type: "string" },
                        PriorityNo: { type: "string" },
                    }
                }
            }
        },
        columns: [
            { field: "PRID", title: "PR ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleName", title: "Style", width: 350, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "LineNumber", title: "Line Number", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineStartDate", title: "Line Start Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlanStartDate", title: "Plan Start Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlanEndDate", title: "Plan End Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "Target Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PriorityNo", title: "Priority", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
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
function ProcessLineNumberManually(LineNumber) {
    var _dbModel = { 'LineNumber': LineNumber };
    $.ajax({
        type: "POST",
        url: baseURL + "/Utility/ProcessLineNumberManually",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                $("#ddlLineNumber").val("-1");
                BindPRLineGridData([]);
                swal('Good job!', 'Data Process Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}