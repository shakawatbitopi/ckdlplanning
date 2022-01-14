$(function () {
    $("#Kendofilter").val("");
    G_KendoGridName = "divPendingProcessLineNumber";
    LoadPendingLineProcess();
    $(".btnclstoolbar").addClass("hidden");
    $(document).delegate('#chkAllGridValue', 'change', function () {
        if ($(this).is(":checked")) {
            $("#divPendingProcessLineNumber").find("[type='checkbox']").prop('checked', true);
            $(".btnclstoolbar").removeClass("hidden");
        }
        else {
            $("#divPendingProcessLineNumber").find("[type='checkbox']").prop('checked', false);
            $(".btnclstoolbar").addClass("hidden");
        }
    });
    $(document).delegate('.chkLineNumber', 'change', function (e) {
        var LineNumberList = $("#divPendingProcessLineNumber tbody input:checkbox:checked").map(function () {
            return this.value;
        }).toArray();
        if (LineNumberList.toString() === "") {
            $(".btnclstoolbar").addClass("hidden");
        }
        else {
            $(".btnclstoolbar").removeClass("hidden");
        }
    });
});
function LoadPendingLineProcess() {
    $.ajax({
        type: "GET",
        url: baseURL + "/PRInformation/LoadPendingProcessLineNumber",
        data: {},
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            BindPendingProcessLineNumber(data);
        }
    });
}
function BindPendingProcessLineNumber(data) {
    $("#divPendingProcessLineNumber").kendoGrid().empty();
    $("#divPendingProcessLineNumber").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "number" },
                        PRID: { type: "string" },
                        LineNumber: { type: "number" },
                        TargetQty: { type: "number" },
                    }
                }
            }
        },
        toolbar: "<a role='button' class='btnclstoolbar hidden k-button k-button-icontext k-grid-edit' href='javascript:void(0)' onclick=ProcessSelected()><span class='k-icon k-i-check'></span>Process Selected</a>",
        columns: [
            {
                title: "<center><input type='checkbox' id='chkAllGridValue' value=''></center>", width: 30,
                template: function (dataItem) {
                    return dt = '<center><input class="chkLineNumber" type="checkbox" id=' + dataItem.LineNumber + ' name=' + dataItem.LineNumber + ' value=' + dataItem.LineNumber + ' ></center>'
                }
            },
            { field: "PRMasterID", title: "PRMasterID", width: "90px", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRID", title: "PRID", width: "90px", hidden: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "Line Number", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "Target Qty", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=ProcessPlanData("#=LineNumber#")><span class="k-icon k-i-close"></span>Process</a>',
                field: "LineNumber",
                title: "Process",
                headerAttributes: { style: "text-align: center" },
                attributes: { class: "text-center" },
                filterable: false,
                width: "80px"
            }
        ],
        editable: false,
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
function ProcessSelected() {
    var LineNumberList = $("#divPendingProcessLineNumber tbody input:checkbox:checked").map(function () {
        return this.value;
    }).toArray();

    if (LineNumberList.toString() === "")
        $(".btnclstoolbar").addClass("hidden");
    else {
        ProcessPlanData(LineNumberList.toString());
    }
}
function ProcessPlanData(LineNumber) {
    var ans = confirm("Are you sure to Process?");
    if (ans == true) {
        var _dbModel = { 'LineNumber': LineNumber };
        $.ajax({
            type: "POST",
            url: baseURL + "/PRInformation/ProcessPlanData",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success == true) {
                    LoadPendingLineProcess();
                    swal('Good job!', 'Data Process Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}