$(function () {
    LoadLineNumbers();

    $(document).delegate('#btnLoadLineInformation', 'click', function (e) {
        LoadLineWisePriorityNoList($("#ddlLineNumber").val().join(","));
    });

    $(document).delegate('#btnUpdateLinePriority', 'click', function (e) {
        UpdateLinePriority();
    });
});

function LoadLineNumbers() {
    $.ajax({
        type: "GET",
        url: baseURL + "/LinePriority/LoadProductionLines",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlLineNumber").empty();
            $.each(data, function () {
                $("#ddlLineNumber").append($("<option/>").val(this.LineNumber).text(this.LineNumber));
            });
        }
    });

    $('#ddlLineNumber').selectpicker('refresh');
    $('#ddlLineNumber').selectpicker('render');
}

function LoadLineWisePriorityNoList(LineNumber) {
    var _dbModel = { 'LineNumber': LineNumber };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/LinePriority/LoadLineWisePriority",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#divLinePriority").kendoGrid().empty();
    $("#divLinePriority").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRLineID: { type: "number" },
                        PRID: { type: "string", editable: false },
                        LineNumber: { type: "number", editable: false },
                        PlanStartDate: { type: "string", editable: false },
                        PriorityNo: { type: "number", editable: true }
                    }
                }
            }
        },
        toolbar: "<a id='btnUpdateLinePriority' href='javascript:void(0)' class='k-pager-refresh k-link k-button k-button-icon pull-left' title='Update Priority'><span class='k-icon k-i-check'></span> Update Priority</a>",
        columns: [
            { field: "PRLineID", title: "PRLineID", hidden: true, filterable: false },
            { field: "PRID", title: "PRID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlanStartDate", title: "Plan Start Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PriorityNo", title: "Priority No", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: true,
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

function UpdateLinePriority() {
    var ans = confirm("Are you sure to update Priority No?");
    if (ans == true) {
        var _isDataSourceError = 0;
        var arrLineNumber = [];
        var grid = $("#divLinePriority").data("kendoGrid");
        grid.refresh();

        $.each(grid.dataSource._data, function (i, item) {
            if (item.PriorityNo !== null && item.PriorityNo.toString() !== "" && item.PriorityNo.toString() !== "0") {
                arrLineNumber.push({
                    PRLineID: item.PRLineID,
                    PriorityNo: item.PriorityNo
                });
            }
            else {
                _isDataSourceError = 1;
            }
        });

        if (_isDataSourceError === 1) {
            alert("Insert Priority No Properly..!");
            return false;
        }

        if (arrLineNumber.length == 0) {
            alert('No Priority No Found..!');
            return false;
        }

        var _dbModel = { 'arrLinePriorityDBModel': arrLineNumber };

        $.ajax({
            type: "POST",
            url: baseURL + "/LinePriority/UpdateLinePriorityNumber",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success == true) {
                    swal('Good job!', 'Data Save Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}