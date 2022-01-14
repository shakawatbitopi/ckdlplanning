$(function () {
    ClearForm();
    LoadPRInformation();
    $("#txtSAM").val("");
    $("#txtTotalWorkStation").val("");
    $("#txtOrgEfficiency").val("");

    $(document).delegate('#ddlPRID', 'change', function (e) {
        e.preventDefault();
        LoadPRWiseLine($(this).val());
    });
    $(document).delegate('#btnAddNewItem', 'click', function (e) {
        e.preventDefault();
        $("#hdPRMatrixID").val("");
        $("#txtStartDay").val("");
        $("#txtEndDay").val("");
        $("#txtEfficiency").val("");
        $("#txtHourlyProduction").val("");
        $("#txtDailyProduction").val("");
        $("#modalPRMatrix").modal("toggle");
    });
    $(document).delegate('#btnSave', 'click', function (e) {
        e.preventDefault();
        SaveFormValue();
    });
    $(document).delegate('#txtEfficiency', 'blur', function (e) {
        e.preventDefault();
        var OrgEff = $(this).val();
        var NoOfWorkStation = $("#txtTotalWorkStation").val();
        var SAM = $("#txtSAM").val();
        var HourlyProduction = Math.ceil((parseInt(NoOfWorkStation) * 60) / parseFloat(SAM));

        $("#txtHourlyProduction").val(Math.ceil(HourlyProduction * (OrgEff / 100)));
        var TotalHour = parseInt(600) / 60;
        $("#txtDailyProduction").val(parseInt($("#txtHourlyProduction").val()) * parseInt(TotalHour));
    });
    $(document).delegate('#txtDailyProduction', 'blur', function (e) {
        e.preventDefault();
        var Efficiency = $("#txtEfficiency").val();
        var DailyProduction = $(this).val();
        var NoOfWorkStation = $("#txtTotalWorkStation").val();
        var SAM = $("#txtSAM").val();
        var HourlyProduction = Math.ceil((parseInt(NoOfWorkStation) * 60) / parseFloat(SAM));

        var _HourlyProduction = Math.ceil(HourlyProduction * (Efficiency / 100));
        var TotalHour = parseInt(600) / 60;
        var _dailyProduction = parseInt(_HourlyProduction) * parseInt(TotalHour);
        $("#txtEfficiency").val(((Efficiency * DailyProduction) / _dailyProduction).toFixed(2));
        $("#txtHourlyProduction").val(DailyProduction / TotalHour);
    });
});

function LoadPRInformation() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/EfficeincyMatrix/LoadAllPRInformation",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlPRID").empty();
            $("#ddlPRID").append($("<option/>").val("").text("--Select PR--"));
            $.each(data, function () {
                $("#ddlPRID").append($("<option/>").val(this.PRMasterID).text(this.PRID));
            });
        }
    });
}

function LoadPRWiseLine(PRMasterID) {
    var _dbModel = { 'PRMasterID': PRMasterID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/EfficeincyMatrix/LoadPRWiseLine",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                BindLineNumberData(data);
                $("#txtSAM").val(data[0].SAM);
                $("#txtTotalWorkStation").val(data[0].TotalWorkStation);
                $("#txtOrgEfficiency").val(data[0].OrgEfficiency);
            }
            else {
                BindLineNumberData([]);
                $("#txtSAM").val("");
                $("#txtTotalWorkStation").val("");
                $("#txtOrgEfficiency").val("");
            }
        }
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
                field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=BindGridData(' + dataItem.PRMasterID + ',' + dataItem.LineNumber + ')><strong>' + dataItem.LineNumber + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "TargetQty", title: "Target Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=ExecuteEfficeincyMatrix("#=PRMasterID#","#=LineNumber#")>Process</a>',
                field: "BuyerColorID",
                title: "Action",
                headerAttributes: { style: "text-align: center" },
                attributes: { class: "text-center" },
                filterable: false
            },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        //height: 450,
        pageable: false,
        scrollable: true
    });
}

function SaveFormValue() {
    var _isError = 0;
    var PRMatrixID = $("#hdPRMatrixID").val();
    var PRMasterID = $("#hdPRMasterID").val();
    var LineNumber = $("#txtLineNumber").val();
    var StartDay = $("#txtStartDay").val();
    var EndDay = $("#txtEndDay").val();
    var Efficiency = $("#txtEfficiency").val();
    var HourlyProduction = $("#txtHourlyProduction").val();
    var DailyProduction = $("#txtDailyProduction").val();

    if (PRMasterID == "") {
        $("#hdPRMasterID").addClass("customError");
        _isError = 1;
    }
    else {
        $("#hdPRMasterID").removeClass("customError");
    }

    if (LineNumber == "") {
        $("#txtLineNumber").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtLineNumber").removeClass("customError");
    }
    if (StartDay == "") {
        $("#txtStartDay").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtStartDay").removeClass("customError");
    }
    if (EndDay == "") {
        $("#txtEndDay").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtEndDay").removeClass("customError");
    }
    if (Efficiency == "") {
        $("#txtEfficiency").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtEfficiency").removeClass("customError");
    }

    if (HourlyProduction == "") {
        $("#txtHourlyProduction").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtHourlyProduction").removeClass("customError");
    }

    if (DailyProduction == "") {
        $("#txtDailyProduction").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtDailyProduction").removeClass("customError");
    }

    if (_isError == 1) {
        return false;
    }
    var _dbModel = {
        'PRMatrixID': PRMatrixID, 'PRMasterID': PRMasterID, 'LineNumber': LineNumber, 'HourlyProduction': HourlyProduction, 'DailyProduction': DailyProduction,
        'StartDay': StartDay, 'EndDay': EndDay, 'Efficiency': Efficiency
    };
    $.ajax({
        type: "POST",
        url: baseURL + "/EfficeincyMatrix/SaveEfficeincyMatrix",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                BindGridData(PRMasterID, LineNumber);
                $("#modalPRMatrix").modal("toggle");
                if (PRMatrixID === "") {
                    swal('Good job!', 'Data Save Successfully..!', 'success');
                }
                else {
                    swal('Good job!', 'Data Updated Successfully..!', 'success');
                }
                
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
            ClearForm();
        }
    });
}
function BindGridData(PRMasterID, LineNumber) {
    $("#hdPRMasterID").val(PRMasterID);
    $("#txtLineNumber").val(LineNumber);

    var _dbModel = { 'PRMasterID': PRMasterID, 'LineNumber': LineNumber };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/EfficeincyMatrix/LoadAllEfficeincyMatrix",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateMatrixData(data);
        }
    });
}

function PopulateMatrixData(data) {
    $("#divPlanMatrixInformation").kendoGrid().empty();
    $("#divPlanMatrixInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        toolbar: "<a id='btnAddNewItem' style='float: left;' href='javascript:void(0)' class='k-pager-refresh k-link k-button k-button-icon' title='Add'><span class='k-icon k-i-check'></span> Add Line Efficiency</a>",
        columns: [
            { field: "PRMatrixID", title: "PRMatrixID", hidden: true, filterable: false },
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            {
                field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPRLineDateInformation(' + dataItem.PRMasterID + ',' + dataItem.LineNumber + ',' + dataItem.PRMatrixID + ')><strong>' + dataItem.LineNumber + '</strong></a></center>';
                    return dt;
                }
            },
            //{ field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StartDay", title: "Start Day", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "EndDay", title: "End Day", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Efficiency", title: "Efficiency", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)" onclick=GetEditData(#=PRMatrixID#)><span class="k-icon k-i-edit"></span>Edit</a>' +
                    '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=PRMatrixID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "PRMatrixID",
                title: "Action",
                width: 170,
                headerAttributes: { style: "text-align: center" },
                attributes: { class: "text-center" }
            },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        //height: 450,
        pageable: false,
        scrollable: true
    });
}

function GetEditData(PRMatrixID) {
    var _dbModel = { 'PRMatrixID': PRMatrixID };
    $.ajax({
        type: "POST",
        url: baseURL + "/EfficeincyMatrix/LoadSelectedEfficeincyMatrix",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                $("#hdPRMatrixID").val(item.PRMatrixID);
                $("#hdPRMasterID").val(item.PRMasterID);
                $("#txtLineNumber").val(item.LineNumber);
                $("#txtStartDay").val(item.StartDay);
                $("#txtEndDay").val(item.EndDay);
                $("#txtEfficiency").val(item.Efficiency);
                $("#txtHourlyProduction").val(item.HourlyProduction);
                $("#txtDailyProduction").val(item.DailyProduction);
            });
            $("#modalPRMatrix").modal("toggle");
        }
    });
}
function DeleteGridData(PRMatrixID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'PRMatrixID': PRMatrixID };
        $.ajax({
            type: "POST",
            url: baseURL + "/EfficeincyMatrix/DeleteSelectedEfficeincyMatrix",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success === true) {
                    BindGridData($("#hdPRMasterID").val(), $("#txtLineNumber").val());
                    swal('Good job!', 'Data Deleted Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}
function ExecuteEfficeincyMatrix(PRMasterID, LineNumber) {
    var ans = confirm("Are you sure to Process?");
    if (ans === true) {
        var _dbModel = { 'LineNumber': LineNumber };
        $.ajax({
            type: "POST",
            url: baseURL + "/EfficeincyMatrix/ExecuteEfficeincyMatrix",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success === true) {
                    swal('Good job!', 'Data Process Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}

function ClearForm() {
    $("#ddlPRID").val("");
    $(".txt").val("");
}