var array = {};
var Linearray = {};
$(function () {
    $("#Kendofilter").val("");
    G_KendoGridName = "divAPRInformation";
    $('#txtPCD').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtPCD').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtPCD').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"]
    });
    LoadDDLData();
    LoadAllGridData();
    BindLineInformation([]);
    Clear();
    $(document).delegate('#ddlBuyer', 'change', function (e) {
        LoadFileByBuyer();
    });
    $(document).delegate('#btnSaveAPR', 'click', function (e) {
        SaveData();
    });
    $(document).delegate('#btnNew', 'click', function (e) {
        Clear();
    });
    $(document).delegate('#btnClear', 'click', function (e) {
        Clear();
    });
    $(document).delegate('#btnFind', 'click', function (e) {
        $("#modalPRInformation").modal("toggle");
    });
    $(document).delegate('#ddlCompany', 'change', function (e) {
        LoadCompanyLineNumber($(this).val());
    });
    $(document).delegate('.chkLine', 'change', function () {
        if ($("#txtPCD").val() === "") {
            alert('No PCD Date Found..!');
            return false;
        }

        var date = new Date($("#txtPCD").val());
        var _PlanStartDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        var grid = $('#divLineInformation').data().kendoGrid;
        var id = grid.dataItem($(this).closest('tr')).LineNumber;
        if ($(this).is(':checked')) {
            array[id] = true;
            $.each(grid._data, function (j, items) {
                var _grdLineNumber = items.LineNumber;
                if (_grdLineNumber === id) {
                    items.PlanStartDate = _PlanStartDate.replace("-", "");
                    items.PriorityNo = $("#txtPriorityNo").val() === "" ? 0 : $("#txtPriorityNo").val();
                    grid.dataSource.sync();
                    grid.saveChanges();
                }
            });
        }
        else {
            array[id] = false;

            $.each(grid._data, function (j, items) {
                var _grdLineNumber = items.LineNumber;
                if (_grdLineNumber === id) {
                    items.TargetQty = 0;
                    items.PlanStartDate = null;
                    items.PriorityNo = 0;
                    grid.dataSource.sync();
                    grid.saveChanges();
                }
            });
        }
    });

    $(document).delegate('#txtPCD', 'blur', function (e) {
        e.preventDefault();
        var _PlanStartDate = "";

        if ($(this).val() !== "") {
            var date = new Date($("#txtPCD").val());
            _PlanStartDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        }
        else {
            _PlanStartDate = null;
        }

        var grid = $('#divLineInformation').data().kendoGrid;
        $.each(grid._data, function (j, items) {
            var _grdLineNumber = items.LineNumber;
            if ($("#" + _grdLineNumber).is(":checked")) {
                items.PlanStartDate = _PlanStartDate.replace("-", "");
                grid.dataSource.sync();
                grid.saveChanges();
            }
        });
    });
    $(document).delegate('#txtPriorityNo', 'blur', function (e) {
        e.preventDefault();
        var _PriorityNo = $(this).val() === "" ? 0 : $(this).val();
        var grid = $('#divLineInformation').data().kendoGrid;
        $.each(grid._data, function (j, items) {
            var _grdLineNumber = items.LineNumber;
            if ($("#" + _grdLineNumber).is(":checked")) {
                items.PriorityNo = _PriorityNo;
                grid.dataSource.sync();
                grid.saveChanges();
            }
        });
    });
    $(".k-datepicker input").prop("readonly", true);
});

function LoadDDLData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/AdditionalPR/LoadDDLData",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlCompany").empty();
            $("#ddlCompany").append($("<option/>").val("-1").text("-Select-"));
            $.each(data.CompanyList, function () {
                $("#ddlCompany").append($("<option/>").val(this.Code).text(this.Value));
            });

            $("#ddlBuyer").empty();
            $("#ddlBuyer").append($("<option/>").val("-1").text("Select Buyer"));
            $.each(data.BuyerList, function () {
                $("#ddlBuyer").append($("<option/>").val(this.Code).text(this.Value));
            });
        }
    });

    $('#ddlBuyer').selectpicker('refresh');
    $('#ddlBuyer').selectpicker('render');
}
function LoadFileByBuyer() {
    var BuyerID = $("#ddlBuyer").val();
    var dbModel = { 'BuyerID': BuyerID };
    $.ajax({
        type: "POST",
        url: baseURL + "/AdditionalPR/LoadFileByBuyer",
        data: JSON.stringify(dbModel),
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlFileRef").empty();

            $("#ddlFileRef").append($("<option/>").val("-1").text("-Select-"));
            $("#ddlFileRef").append($("<option/>").val("NA").text("PR Without File Ref"));

            $.each(data, function () {
                $("#ddlFileRef").append($("<option/>").val(this.Code).text(this.Value));
            });
        }
    });

    $('#ddlFileRef').selectpicker('refresh');
    $('#ddlFileRef').selectpicker('render');
}
function SaveData() {
    var arrLineNumber = [];
    var _isDataSourceError = 0;
    var _isQuantityError = 0;

    var LineList = $("#divLineInformation tbody input:checkbox:checked").map(function () {
        return this.value;
    }).toArray();

    if (LineList.toString() === "") {
        alert('No Selected Line Found..!');
        return false;
    }
    else {
        var grid = $("#divLineInformation").data("kendoGrid");
        grid.refresh();
        $.each(grid.dataSource._data, function (i, item) {
            if (LineList.includes(item.LineNumber.toString())) {
                if (item.TargetQty !== null && item.TargetQty.toString() !== "") {
                    if (item.PriorityNo !== null && item.PriorityNo !== "") {
                        arrLineNumber.push({
                            LineNumber: item.LineNumber,
                            WorkStation: item.WorkStation,
                            AverageEfficiency: item.AverageEfficiency,
                            TargetQty: item.TargetQty,
                            PlanStartDate: item.PlanStartDate,
                            PriorityNo: item.PriorityNo
                        });
                    }
                    else {
                        _isDataSourceError = 1;
                    }
                }
                else {
                    _isQuantityError = 1;
                }
            }
        });
    }

    if (arrLineNumber.length === 0) {
        alert("Please check Line information..!");
        return false;
    }

    if (parseInt(_isDataSourceError) > 0) {
        alert("Priority Missing. Please check Line Priority..!");
        return false;
    }

    if (parseInt(_isQuantityError) > 0) {
        alert("Quantity Should be greater then or equal to zero..!");
        return false;
    }
    var _isError = 0;
    var APRID = $("#txtAPRID").val();
    var CompanyID = $("#ddlCompany").val();
    var BuyerID = $("#ddlBuyer").val();
    var FileRefID = $("#ddlFileRef").val();
    var PCD = $("#txtPCD").val();
    var Qty = $("#txtQty").val();
    var SAM = $("#txtSAM").val();
    var CM = $("#txtCM").val();
    var FOB = $("#txtFOB").val();
    var Reason = $("#txtReason").val();
    var TotalWorkMinutes = $("#txtTotalWorkingMinutes").val();
    var StyleType = $("#ddlStyleType").val();
    var PriorityNo = $("#txtPriorityNo").val();
    var IsRepeatedOrder = $("#ddlRepeatOrder").val() === "1" ? true : false;

    if (CompanyID === "-1") {
        $("#ddlCompany").addClass('customError');
        _isError = 1;
    }
    else {
        $("#ddlCompany").removeClass('customError');
    }

    if (BuyerID === null || BuyerID === "-1" || BuyerID === "") {
        $("#ddlBuyer").addClass('customError');
        _isError = 1;
    }
    else {
        $("#ddlBuyer").removeClass('customError');
    }

    if (FileRefID === null || FileRefID === "-1" || FileRefID === "") {
        $("#ddlFileRef").addClass('customError');
        _isError = 1;
    }
    else {
        $("#ddlFileRef").removeClass('customError');
    }

    if (PCD === "") {
        $("#txtPCD").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtPCD").removeClass('customError');
    }

    if (Qty === "") {
        $("#txtQty").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtQty").removeClass('customError');
    }

    if (SAM === "") {
        $("#txtSAM").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtSAM").removeClass('customError');
    }

    if (CM === "") {
        $("#txtCM").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtCM").removeClass('customError');
    }
    if (FOB === "") {
        $("#txtFOB").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtFOB").removeClass('customError');
    }

    if (Reason === "") {
        $("#txtReason").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtReason").removeClass('customError');
    }

    if (TotalWorkMinutes === "") {
        $("#txtTotalWorkingMinutes").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtTotalWorkingMinutes").removeClass('customError');
    }

    if (PriorityNo === "") {
        $("#txtPriorityNo").addClass('customError');
        _isError = 1;
    }
    else {
        $("#txtPriorityNo").removeClass('customError');
    }

    if (_isError === 1) {
        return false;
    }

    var dbModel = {
        'APRID': APRID, 'CompanyID': CompanyID, 'BuyerID': BuyerID, 'FileRefID': FileRefID, 'TotalWorkMinutes': TotalWorkMinutes,
        'PCD': PCD, 'Qty': Qty, 'SAM': SAM, 'CM': CM, 'FOB': FOB, 'Reason': Reason, 'StyleType': StyleType,
        'arrLineInformationDBModel': arrLineNumber, 'PriorityNo': PriorityNo, 'IsRepeatedOrder': IsRepeatedOrder,
    }

    $.ajax({
        type: "POST",
        url: baseURL + "/AdditionalPR/SaveData",
        data: JSON.stringify(dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            if (data.success !== "Failed") {
                $("#txtAPRID").val(data.success);
                swal('Good job!', 'Data Save Successfully..!', 'success');
                LoadAllGridData();
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });

}
function LoadAllGridData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/AdditionalPR/LoadAllData",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            PopulateGridData(data);
        }
    });

}
function PopulateGridData(data) {
    $("#divAPRInformation").kendoGrid().empty();
    $("#divAPRInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        APRID: { type: "string" },
                        CompanyName: { type: "string" },
                        BuyerName: { type: "string" },
                        FileRefID: { type: "string" },
                        PCD: { type: "string" },
                        SAM: { type: "number" },
                        CM: { type: "number" },
                        FOB: { type: "number" },
                        Qty: { type: "number" },
                    }
                }
            }
        },
        columns: [
            {
                field: "APRID", title: "PRID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetEditData("' + dataItem.APRID + '")><strong>' + dataItem.APRID + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "CompanyName", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "Buyer", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "File Ref", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PCD", title: "PCD", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SAM", title: "SAM", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "CM", title: "CM", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FOB", title: "FOB", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Qty", title: "Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)" onclick=GetEditData("#=APRID#")><span class="k-icon k-i-edit"></span>Edit</a>' +
                    '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=APRID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "APRID",
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
        height: 450,
        pageable: false,
        scrollable: true
    });
}
function GetEditData(APRID) {
    var dbModel = { 'APRID': APRID };
    $.ajax({
        type: "POST",
        url: baseURL + "/AdditionalPR/LoadSelectedData",
        data: JSON.stringify(dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            BindLineInformation([]);
            $("#txtAPRID").val(data.Master[0].APRID);
            $("#ddlCompany").val(data.Master[0].CompanyID);
            $("#ddlBuyer").val(data.Master[0].BuyerID);
            $("#ddlBuyer").trigger("change");
            $("#ddlFileRef").val(data.Master[0].FileRefID);
            $("#txtPCD").val(data.Master[0].PCD);
            $("#txtQty").val(data.Master[0].Qty);
            $("#txtSAM").val(data.Master[0].SAM);
            $("#txtCM").val(data.Master[0].CM);
            $("#txtFOB").val(data.Master[0].FOB);
            $("#txtReason").val(data.Master[0].Reason);
            $("#txtPriorityNo").val(data.Master[0].PriorityNo);
            $("#ddlRepeatOrder").val(data.Master[0].IsRepeatedOrder === true ? "1" : "0");
            $("#txtTotalWorkingMinutes").val(data.Master[0].TotalWorkMinutes);
            $("#ddlStyleType").val(data.Master[0].StyleType);
            $('#ddlFileRef').selectpicker('refresh');
            $('#ddlBuyer').selectpicker('refresh');
            BindLineInformation(data.Line);
        }
    });
    $("#modalPRInformation").modal("toggle");
}
function DeleteGridData(APRID) {
    var ans = "Are You Sure to Delete the PR?";
    if (window.confirm(ans)) {
        var dbModel = { 'APRID': APRID };
        $.ajax({
            type: "POST",
            url: baseURL + "/AdditionalPR/DeleteData",
            data: JSON.stringify(dbModel),
            contentType: "application/json",
            datatype: "json",
            async: true,
            success: function (data) {
                if (data.success) {
                    swal('Good job!', 'Data has been deleted..!', 'success');
                    LoadAllGridData();
                } else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }

}
function LoadCompanyLineNumber(CompanyID) {
    var _dbModel = { 'CompanyID': CompanyID };
    $.ajax({
        type: "POST",
        url: baseURL + "/AdditionalPR/LoadCompanyWiseLineInformation",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            BindLineInformation(data);
        }
    });
}
function BindLineInformation(data) {
    array = {};
    $("#divLineInformation").kendoGrid().empty();
    $("#divLineInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChangeLine,
            schema: {
                model: {
                    Id: "LineNumber",
                    fields: {
                        IsCheck: { editable: false, type: "boolean" },
                        Company: { editable: false },
                        UnitName: { editable: false },
                        ProduceQty: { editable: false },
                        LineNumber: { editable: false, type: "number" },
                        WorkStation: { editable: false, type: "number" },
                        AverageEfficiency: { editable: false, type: "number" },
                        TargetQty: { editable: true, type: "number" },
                        PlanStartDate: { editable: true, type: 'date' },
                        IsFixed: { editable: false, type: 'boolean' },
                        PriorityNo: { editable: true, type: "number" }
                    }
                }
            }
        },
        toolbar: "<strong class='tblSpanText'>Total Production Qty : </strong><span id='spProductionQty' class='tblSpanText'></span> <strong class='tblSpanText' style='margin-left: 15%;'>Total Produce Qty : </strong><span class='tblSpanText' id='spProduceQty'></span>  <strong class='tblSpanText' style='margin-left: 38%;'>Remaining Line Plan Qty : </strong><span class='tblSpanText' id='spRemainingProductionQty'></span>",
        columns: [
            {
                title: "<center></center>", width: 30,
                template: function (dataItem) {
                    if (dataItem.IsLineExists !== "0") {
                        if (dataItem.IsCheck === false) {
                            return '<center><input class="chkLine" type="checkbox" id=' + dataItem.LineNumber + ' name=' + dataItem.LineNumber + ' value=' + dataItem.LineNumber + ' ></center>';
                        }
                        else {
                            return '<center><input class="chkLine" checked type="checkbox" id=' + dataItem.LineNumber + ' name=' + dataItem.LineNumber + ' value=' + dataItem.LineNumber + ' ></center>';
                        }
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                field: "Company", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    if (dataItem.IsLineExists !== "0") {
                        return dataItem.Company;
                    }
                    else {
                        return '<span style="color:red">Calendar Not Found..!</span>';
                    }
                }
            },
            { field: "UnitName", title: "Unit Name", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    return '<center><a href="javascript:void(0)" onclick="GetLineDetails(' + dataItem.LineNumber + ')">' + dataItem.LineNumber + '</a></center>';
                }
            },
            { field: "ProduceQty", title: "Produce Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "WorkStation", title: "Work Station", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Work Station</label>'
            },
            {
                field: "AverageEfficiency", title: "Average Efficiency", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Average Efficiency</label>'
            },
            {
                field: "TargetQty", title: "Allocated Qty", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Allocated Qty</label>'
            },
            {
                field: "PlanStartDate", title: "Line Start Date",
                template: "#= kendo.toString(kendo.parseDate(PlanStartDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #",
                filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Line Start Date</label>'
            },
            {
                field: "IsFixed", title: "Fixed Qty", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Fixed Qty</label>'
            },
            {
                field: "PriorityNo", title: "Priority No", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Priority No</label>'
            },
            {
                field: "LineNumber", title: "Move", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Move</label>',
                template: function (dataItem) {
                    if (dataItem.TargetQty.toString() === "0" || dataItem.TargetQty.toString() === "" || dataItem.TargetQty === null) {
                        return "";
                    }
                    else {
                        return '<a href="javascript:void(0)" onClick=MoveLineData(' + dataItem.LineNumber + ')><i class="fa fa-bars"></i></a>';
                    }
                }
            },
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
        dataBound: function (e) {
            for (f in array) {
                if (array[f]) {
                    $('#' + f).attr('checked', 'checked');
                }
                else {
                    $('#' + f).prop('checked', false);
                }
            }
        },
        resizable: true,
        height: 400,
        pageable: false,
        scrollable: true
    });
    $("#spProductionQty").text($("#txtPlanProduction").val());

    if (data.length > 0)
        $("#spProduceQty").text(data[0].ProduceQty);
    else
        $("#spProduceQty").text("0");

    //if (data.length > 0) {
    var grid = $("#divLineInformation").data("kendoGrid");
    var _planQty = 0;
    $.each(grid._data, function (i, item) {
        var IsCheck = item.IsCheck;
        if (IsCheck === true) {
            array[item.LineNumber] = true;
            _planQty += parseInt(item.TargetQty);
        }
    });
    var _PlannedQty = $("#txtPlanProduction").val();
    $("#spRemainingProductionQty").text(parseInt(_PlannedQty) - parseInt(_planQty));

    Linearray = [];
    $.each(data, function () {
        Linearray.push(this.LineNumber);
    });
    //}
}
function onChangeLine(e) {
    if (e.action == "itemchange" && e.field == "IsCheck") {
        CalculateRemainingQty();
    }
    else if (e.action == "itemchange" && e.field == "TargetQty") {
        CalculateRemainingQty();
        e.items[0].IsFixed = true;
    }
}
function CalculateRemainingQty() {
    var grid = $("#divLineInformation").data("kendoGrid");
    var _planQty = 0;
    $.each(grid._data, function (i, item) {
        var IsCheck = item.IsCheck;
        if (IsCheck === true) {
            _planQty += parseInt(item.TargetQty);
        }
    });
    var _PlannedQty = $("#txtQty").val();
    $("#spRemainingProductionQty").text(parseInt(_PlannedQty) - parseInt(_planQty));
}
function Clear() {
    $(".txt").val("");
    $(".txt").removeClass("customError");
    $("#txtAPRID").val("<NEW>");
    $("#txtPriorityNo").val("");
    $("#ddlRepeatOrder").val("0");
    $("#ddlCompany").val("-1");
    $("#ddlBuyer").val("-1");
    $("#ddlFileRef").empty();
    $("#ddlFileRef").val("-1");
    $("#ddlStyleType").val("BOTTOMS");
    $('#ddlFileRef').selectpicker('refresh');
    $('#ddlBuyer').selectpicker('refresh');
    BindLineInformation([]);
}
/*****Side Bar Operation****/
function GetLineDetails(LineNumber) {
    var _sideBarStatus = $("#sidebar2").attr("aria-hidden");
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

            if (data.length > 0)
                $("#sideBarContent").html(_heading + _divData);
            else {
                $("#sideBarContent").append(_heading + "<div class='col-md-12 divCellInfo' style='padding: 20px;'><h4>The Line is Empty..!</h4></div>");
            }

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
/*****END****/