var _MissingDateLine = "";
$(function () {
    LoadPRInformation();
    $(document).delegate('#btnLoad', 'click', function (e) {
        e.preventDefault();
        _MissingDateLine = "";
        LoadSelectedPRInformation();
    });
    $(document).delegate('#btnCheckMissingDate', 'click', function (e) {
        e.preventDefault();
        var _PRID = $("#ddlPRID").val();
        var _LineNumber = _MissingDateLine;

        if (_LineNumber === "") {
            alert('Please Select the Line Number..!');
            return false;
        }

        if (_PRID === null || _PRID === "") {
            alert('Please Select PR ID..!');
            return false;
        }
        UpdateMissingDates(_PRID, _LineNumber);
    });
    $(document).delegate('#btnUpdateQty', 'click', function (e) {
        e.preventDefault();
        IsDateExists();
    });
    $(document).delegate('#btnUpdateProduction', 'click', function (e) {
        e.preventDefault();
        SaveProductionUpdate();
    });
    $('#txtPlanDate').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtPlanDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtPlanDate').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"],
        disableDates: function (date) {
            return date > new Date();
        }
    });
    $(document).delegate('#chkAllGridValue', 'change', function () {
        if ($(this).is(":checked")) {
            $("#divTodayDateInformation").find("[type='checkbox']").prop('checked', true);
            $(".btnclstoolbar").removeClass("hidden");
        }
        else {
            $("#divTodayDateInformation").find("[type='checkbox']").prop('checked', false);
            $(".btnclstoolbar").addClass("hidden");
        }
    });
    $(document).delegate('.chkPlanDate', 'change', function (e) {
        var PlanDateList = $("#divTodayDateInformation tbody input:checkbox:checked").map(function () {
            return this.value;
        }).toArray();
        if (PlanDateList.toString() === "") {
            $(".btnclstoolbar").addClass("hidden");
        }
        else {
            $(".btnclstoolbar").removeClass("hidden");
        }
    });
    $(document).delegate('#btnUpdateAllDate', 'click', function (e) {
        e.preventDefault();
        UpdateSelectedData();
    });
});
function SaveProductionUpdate() {
    var arrProdUpdate = [];
    var grid = $("#divTodayDateInformation").data("kendoGrid");
    grid.refresh();

    $.each(grid.dataSource._data, function (i, item) {
        if (item.TargetQty !== "" && isNaN(parseInt(item.DayQty)) === true ? 0 : parseInt(item.DayQty) > 0) {
            arrProdUpdate.push({
                PRMasterID: item.PRMasterID,
                PlanDate: item.PlanDate,
                LineNumber: item.LineNumber,
                DayQty: item.DayQty
            });
        }
    });

    var _dbModel = { '_dbModel': arrProdUpdate };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Production/SaveProductionUpdate",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            if (data.success === true) {
                swal('Good job!', 'Data Updated Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function IsDateExists() {
    var PRMasterID = $("#ddlPRID").val();
    var PlanDate = $("#txtPlanDate").val();
    var LineNumber = $("#ddlLineNumber2").val();
    if (PRMasterID === "" || PRMasterID === null || PRMasterID === -1) {
        swal({ type: 'error', title: 'Oops...', text: 'Select valid PRID!' });
        return false;
    }
    if (LineNumber === "" || LineNumber === null || LineNumber === -1) {
        swal({ type: 'error', title: 'Oops...', text: 'Select valid Line Number!' });
        return false;
    }

    if (PlanDate === "" || PlanDate === null) {
        swal({ type: 'error', title: 'Oops...', text: 'Enter valid Plan Date!' });
        return false;
    }
    var _dbModel = { 'PRMasterID': PRMasterID, 'LineNumber': LineNumber, 'PlanDate': PlanDate };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Production/CheckPlanDate",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.success === true)
                SaveProductionUpdateNew();
            else
                swal({ type: 'error', title: 'Oops...', text: 'Selected Date Not Found For This Line Number..!' });
        }
    });

}
function SaveProductionUpdateNew() {
    var arrProdUpdate = [];
    var PRMasterID = $("#ddlPRID").val();
    var PlanDate = $("#txtPlanDate").val();
    var LineNumber = $("#ddlLineNumber2").val();
    var DayQty = parseInt($("#txtProduceQty").val());

    if (PRMasterID === "" || PRMasterID === null || PRMasterID === -1) {
        swal({ type: 'error', title: 'Oops...', text: 'Select valid PRID!' });
        return false;
    }
    if (LineNumber === "" || LineNumber === null || LineNumber === -1) {
        swal({ type: 'error', title: 'Oops...', text: 'Select valid Line Number!' });
        return false;
    }
    if (DayQty === "" || DayQty === null || DayQty <= 0 || isNaN(DayQty)) {
        swal({ type: 'error', title: 'Oops...', text: 'Enter valid Quantity!' });
        return false;
    }

    arrProdUpdate.push({
        PRMasterID: PRMasterID,
        PlanDate: PlanDate,
        LineNumber: LineNumber,
        DayQty: DayQty
    });

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
                $("#txtProduceQty").val("");
                LoadSelectedPRInformation();
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function LoadPRInformation() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Production/LoadAllPRInformation",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlPRID").empty();
            $("#ddlPRID").append($("<option/>").val("").text("--Select PR--"));
            $.each(data.PRID, function () {
                $("#ddlPRID").append($("<option/>").val(this.PRMasterID).text(this.PRID));
            });

            $("#ddlUNITID").empty();
            $("#ddlUNITID").append($("<option/>").val("").text("--Select Unit--"));
            $.each(data.Unit, function () {
                $("#ddlUNITID").append($("<option/>").val(this.UnitID).text(this.UnitName));
            });

            $("#ddlLineNumber").empty();
            $("#ddlLineNumber").append($("<option/>").val("").text("--Select Line--"));
            $.each(data.LineNumber, function () {
                $("#ddlLineNumber").append($("<option/>").val(this.LineNumber).text(this.LineNumber));
            });
        }
    });
    $('#ddlFileRef').selectpicker('render');
    $('#ddlUNITID').selectpicker('render');
    $('#ddlLineNumber').selectpicker('render');
}

function LoadSelectedPRInformation() {
    var PRMasterID = $("#ddlPRID").val() === null ? "" : $("#ddlPRID").val();
    var LineNumber = $("#ddlLineNumber").val() === null ? "" : $("#ddlLineNumber").val();
    var UnitID = $("#ddlUNITID").val() === null ? "" : $("#ddlUNITID").val();
    var _isCurrentDate = $('#chkCurrentDate').is(":checked");

    var _dbModel = { 'PRMasterID': PRMasterID, 'LineNumber': LineNumber, 'UnitID': UnitID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Production/LoadPlanDateInformation",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            BindPlanDateGridData(data.AllData);
            //BindTodayDateGridData(data.TodayData);
            if (_isCurrentDate === true)
                BindPlanData(data.TodayData);
            else
                BindPlanData([]);

            BindLineNumberData(data.LineNumberData);

            $("#ddlLineNumber2").empty();
            $("#ddlLineNumber2").append($("<option/>").val("").text("--Select Line--"));
            $.each(data.AllLineNumber, function (i, item) {
                $("#ddlLineNumber2").append($("<option/>").val(item.LineNumber).text(item.LineNumber));
            });

            $("#DivPRoduceQtyForm").show();

        }
    });
}

function BindPlanDateGridData(data) {
    $("#divPlanDateInformation").kendoGrid().empty();
    $("#divPlanDateInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            { field: "PRID", title: "PR ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleName", title: "Style", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "FileRef ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            /*{ field: "FileRefNo", title: "FileRef No", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },*/
            { field: "TargetQty", title: "Target Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProduceQty", title: "Produce Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "RemainingQty", title: "Balance Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        pageable: false,
        scrollable: true
    });
}
function BindLineNumberData(data) {
    $("#divPlanLineInformation").kendoGrid().empty();
    $("#divPlanLineInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            {
                field: "LineNumber", title: "LineNumber", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPRLineDateInformation(' + dataItem.PRMasterID + ',' + dataItem.LineNumber + ')><strong>' + dataItem.LineNumber + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "TargetQty", title: "Target Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TotalProduceQty", title: "Produce Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BalanceQty", title: "Balance Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        pageable: false,
        scrollable: true
    });
}

function GetPRLineDateInformation(PRMasterID, LineNumber) {
    _MissingDateLine = LineNumber;
    var _dbModel = { 'PRMasterID': PRMasterID, 'LineNumber': LineNumber };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Production/GetPRLineDateInformation",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            BindPlanData(data);
        }
    });
}

function BindPlanData(data) {
    $("#divTodayDateInformation").kendoGrid().empty();
    $("#divTodayDateInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        ID: { editable: false, type: "number" },
                        LineNumber: { editable: false, type: "number" },
                        PlanDate: { editable: false, type: "string" },
                        TargetQty: { editable: false, type: "number" },
                        ProduceQty: { editable: true, type: "number" },
                        Status: { editable: false, type: "string" },
                    }
                }
            },
        },
        toolbar: "<a id='btnUpdateAllDate' role='button' class='k-button k-button-icontext k-grid-edit' href='javascript:void(0)'><span class='k-icon k-i-check'></span>Update Selected</a>" +
            "<a id='btnCheckMissingDate' role='button' class='k-button k-button-icontext k-grid-edit pull-right' href='javascript:void(0)'><span class='k-icon k-i-calendar'></span>Add Missing Dates</a>",
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "LineNumber", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Status", title: "Status", hidden: true, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlanDate", title: "Plan Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "Target Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProduceQty", title: "Produce Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: true,
        sortable: true,
        filterable: false,
        resizable: true,
        height: 500,
        pageable: false,
        scrollable: true,
        edit: function (e) {
            if (e.model.Status == "0") {
                e.sender.closeCell();
            }
        }
    });
}

function GetPRUpdateDate(PlanDate, LineNumber, PRMasterID, ID) {
    var ans = confirm("Are you sure to update record?");
    if (ans === true) {
        var arrProdUpdate = [];
        var _isCurrentDate = $('#chkCurrentDate').is(":checked");

        arrProdUpdate.push({
            PRMasterID: PRMasterID,
            PlanDate: PlanDate,
            LineNumber: LineNumber,
            DayQty: $("#txt" + ID).val()
        });

        var _dbModel = { '_dbModel': arrProdUpdate };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: baseURL + "/Production/SaveProductionUpdate",
            data: JSON.stringify(_dbModel),
            async: true,
            dataType: "json",
            success: function (data) {
                if (data.success === true) {
                    LoadSelectedPRInformation();

                    if (_isCurrentDate === false)
                        GetPRLineDateInformation(PRMasterID, LineNumber);

                    swal('Good job!', 'Data Updated Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}

function UpdateSelectedData() {
    var ans = confirm("Are you sure to update record?");
    if (ans === true) {
        var PRMasterID = $("#ddlPRID").val() === null ? "" : $("#ddlPRID").val();

        var _isCurrentDate = $('#chkCurrentDate').is(":checked");

        var arrProdUpdate = [];
        var grid = $("#divTodayDateInformation").data("kendoGrid");
        grid.refresh();

        $.each(grid.dataSource._data, function (i, item) {
            if (this.dirty == true) {
                arrProdUpdate.push({
                    PRMasterID: item.PRMasterID,
                    PlanDate: item.PlanDate,
                    LineNumber: item.LineNumber,
                    DayQty: item.ProduceQty === null ? 0 : item.ProduceQty
                });
            }
        });

        if (arrProdUpdate.length === 0) {
            alert('No Data Found For Update..!');
            return false;
        }

        var _dbModel = { '_dbModel': arrProdUpdate };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: baseURL + "/Production/SaveProductionUpdateData",
            data: JSON.stringify(_dbModel),
            async: true,
            dataType: "json",
            success: function (data) {
                if (data.success === true) {
                    LoadSelectedPRInformation();

                    if (_isCurrentDate === false)
                        GetPRLineDateInformation(PRMasterID, "");

                    swal('Good job!', 'Data Updated Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}
function UpdateMissingDates(_PRID, _LineNumber) {
    var ans = confirm("Are you sure to add missing dates?");
    if (ans == true) {
        var _dbModel = { 'PRMasterID': _PRID, 'LineNumber': _LineNumber };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: baseURL + "/Production/UpdateMissingDates",
            data: JSON.stringify(_dbModel),
            async: true,
            dataType: "json",
            success: function (data) {
                if (data.success === true) {
                    GetPRLineDateInformation(_PRID, _LineNumber);
                    swal('Good job!', 'Date Added Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}
function GetPRUpdateFutureDate() {
    alert('You can not update future date..!');
}