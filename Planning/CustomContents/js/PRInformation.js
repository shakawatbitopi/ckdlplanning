var array = {};
var TotalSelectedEOQty = 0;
var TotalLineSelected = 0;
var Linearray = {};
$(function () {
    ClearForm();
    $("#tabs").tabs();
    $("#Kendofilter").val("");
    G_KendoGridName = "divPRInformation";
    LoadddlData();
    $(document).delegate('#ddlBuyer', 'change', function (e) {
        e.preventDefault();
        LoadFileRefInformation();
    });
    $(document).delegate('#ddlProductType', 'change', function (e) {
        e.preventDefault();
        LoadFileRefInformation();
    });
    $(document).delegate('#btnNew', 'click', function (e) {
        e.preventDefault();
        BindEOInformation([]);
        BindLineInformation([]);
        $(".txt").val("");
        $("#ddlCompany").val("-1");
        $("#ddlRepeatOrder").val("0");
        $("#ddlBuyer").val("-1");
        $("#ddlProductType").val("-1");
        $("#ddlQuantityFactor").val("1");
        $("#ddlStyleType").val("BOTTOMS");
        $("#ddlStatus").val("ACTIVE");
        $("#ddlFileRef").empty();
        TotalLineSelected = 0;

        $('#ddlCompany').selectpicker('refresh');
        $('#ddlCompany').selectpicker('render');
        $('#ddlBuyer').selectpicker('refresh');
        $('#ddlBuyer').selectpicker('render');
        $('#ddlProductType').selectpicker('refresh');
        $('#ddlProductType').selectpicker('render');
        $('#ddlStatus').selectpicker('refresh');
        $('#ddlStatus').selectpicker('render');
        $('#ddlFileRef').selectpicker('refresh');
        $('#ddlFileRef').selectpicker('render');
        $('#ddlQuantityFactor').selectpicker('refresh');
        $('#ddlQuantityFactor').selectpicker('render');

        $("#btnLoadPRMAtrix").addClass("hidden");

        $("#tabs").tabs({ active: 0 });
        array = {};
    });
    $(document).delegate('#btnLoad', 'click', function (e) {
        e.preventDefault();
        var _val = $("#txtOrderQty").val();
        if (_val === "")
            LoadEOInformation($("#ddlFileRef").val().join(","), $("#txtPRID").val(), $("#ddlCompany").val());
        else {
            var ans = confirm("Are you sure to Load Data Again?");
            if (ans == true) {
                BindEOInformation([]);
                if ($("#txtPRID").val() === "") {
                    LoadEOInformation($("#ddlFileRef").val().join(","), $("#txtPRID").val(), $("#ddlCompany").val());
                }
                else {
                    LoadGetEOInformation($("#ddlFileRef").val().join(","), $("#txtPRID").val(), $("#ddlCompany").val());
                }
            }
        }
        TotalLineSelected = $('#divLineInformation tbody input.chkLine:checked').length;
    });
    $(document).delegate('#chkAllGridValue', 'change', function () {
        TotalSelectedEOQty = 0;
        var grid = $('#divEOInformation').data().kendoGrid;
        if ($(this).is(":checked")) {
            $("#divEOInformation").find("[type='checkbox']").prop('checked', true);

            $.each(grid._data, function (i, item) {
                if (item.ExportOrderStatus !== "CANCELLED") {
                    array[item.RowID] = true;
                    var qty = parseInt(item.SelectedQty);
                    TotalSelectedEOQty += isNaN(qty) == true ? 0 : qty;
                }
            });
        }
        else {
            $("#divEOInformation").find("[type='checkbox']").prop('checked', false);
            TotalSelectedEOQty = 0;
            $.each(grid._data, function (i, item) {
                array[item.RowID] = false;
            });
        }
        var _QuantityFactor = $("#ddlQuantityFactor").val() == "" ? 1 : $("#ddlQuantityFactor").val();
        var _SelectQty = parseInt(TotalSelectedEOQty) * parseInt(_QuantityFactor);

        $('#lblTotalQty').text(TotalSelectedEOQty);
        $('#txtTotalOrderQty').val(TotalSelectedEOQty);
        $('#txtOrderQty').val(_SelectQty);
        CalculatePlannedProduction();
    });
    $(document).delegate('#btnSavePRMaster', 'click', function (e) {
        e.preventDefault();
        var arrEOInformation = [];
        var arrLineNumber = [];

        var EOList = $("#divEOInformation tbody input:checkbox:checked").map(function () {
            return this.value;
        }).toArray();
        if (EOList.toString() == "") {
            alert('No Selected EO Found..!');
            return false;
        }
        else {
            var grid = $("#divEOInformation").data("kendoGrid");
            grid.refresh();
            $.each(grid.dataSource._data, function (i, item) {
                if (EOList.includes(item.ExportOrderID.toString())) {
                    if (item.SelectedQty !== "" && item.SelectedQty !== "0") {
                        arrEOInformation.push({
                            ExportOrderID: item.ExportOrderID,
                            SelectedQty: item.SelectedQty
                        });
                    }
                }
            });
        }

        var _isDataSourceError = 0;
        var _isQuantityError = 0;
        var _PRID = $("#txtPRID").val();
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
                            if (_PRID === "") {
                                arrLineNumber.push({
                                    LineNumber: item.LineNumber,
                                    WorkStation: item.WorkStation,
                                    AverageEfficiency: item.AverageEfficiency,
                                    TargetQty: item.TargetQty,
                                    PlanStartDate: item.PlanStartDate,
                                    PriorityNo: item.PriorityNo,
                                    IsFixed: parseInt(item.TargetQty) > 0 ? true : false
                                });
                            }
                            else {
                                arrLineNumber.push({
                                    LineNumber: item.LineNumber,
                                    WorkStation: item.WorkStation,
                                    AverageEfficiency: item.AverageEfficiency,
                                    TargetQty: item.TargetQty,
                                    PlanStartDate: item.PlanStartDate,
                                    PriorityNo: item.PriorityNo,
                                    IsFixed: item.IsFixed
                                });
                            }
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
        SavePRMasterInformation(arrEOInformation, arrLineNumber);
    });
    $(document).delegate('#btnFind', 'click', function (e) {
        e.preventDefault();
        LoadAllPRInformation();
    });
    $(document).delegate('#btnFindSAM', 'click', function (e) {
        e.preventDefault();
        LoadSamWiseEfficiency();
    });
    $(document).delegate('.chkPO', 'click', function (e) {
        var grid = $('#divEOInformation').data().kendoGrid;
        var id = grid.dataItem($(this).closest('tr')).RowID;
        var qty = parseInt(grid.dataItem($(this).closest('tr')).SelectedQty);
        if ($(this).is(':checked')) {
            TotalSelectedEOQty += isNaN(qty) == true ? 0 : qty;
            array[id] = true;
        } else {
            array[id] = false;
            TotalSelectedEOQty -= isNaN(qty) == true ? 0 : qty;
        }
        var _QuantityFactor = $("#ddlQuantityFactor").val() == "" ? 1 : $("#ddlQuantityFactor").val();
        var _SelectQty = parseInt(TotalSelectedEOQty) * parseInt(_QuantityFactor);

        $('#txtTotalOrderQty').val(TotalSelectedEOQty);
        $('#lblTotalQty').text(TotalSelectedEOQty);
        $('#txtOrderQty').val(_SelectQty);
        CalculatePlannedProduction();
    });
    $('#txtPlanStartDate').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtPlanStartDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtPlanStartDate').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"]
    });
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
    $(document).delegate('.chkLine', 'change', function () {
        var LineAllocated = $("#txtLineAllocated").val();
        if (LineAllocated === "") {
            $(this).prop('checked', false);
            alert('Insert Total Line Allocated..!')
            return false;
        }

        if ($(this).is(":checked")) {
            if (TotalLineSelected + 1 > LineAllocated) {
                $(this).prop('checked', false);
                alert('You have already selected ' + LineAllocated + ' Line');
                return false;
            }
            else
                TotalLineSelected++;
        }
        else {
            TotalLineSelected--;
        }


        var date = new Date($("#txtPlanStartDate").val());
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
    $(document).delegate('#txtExtraPercentage', 'blur', function (e) {
        e.preventDefault();
        CalculatePlannedProduction();
    });
    $(document).delegate('#btnMoveLineData', 'click', function (e) {
        e.preventDefault();
        MoveLineDataToAnotherLine();
    });
    $(document).delegate('#txtPlanStartDate', 'blur', function (e) {
        e.preventDefault();
        var _PlanStartDate = "";

        if ($(this).val() !== "") {
            var date = new Date($("#txtPlanStartDate").val());
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
        var OrgEfficiency = $("#txtOrgEfficiency").val();
        var Efficiency = $("#txtEfficiency").val() == "" ? OrgEfficiency : $("#txtEfficiency").val();

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
    $(document).delegate('#btnPRMatrixSave', 'click', function (e) {
        e.preventDefault();
        SaveMatrixFormValue();
    });
    $(document).delegate('#ddlQuantityFactor', 'change', function (e) {
        e.preventDefault();
        var _QuantityFactor = $(this).val() == "" ? 1 : $(this).val();
        var TotalSelectedEOQty = $('#txtTotalOrderQty').val();
        var _SelectQty = parseInt(TotalSelectedEOQty) * parseInt(_QuantityFactor);

        $('#txtOrderQty').val(_SelectQty);
        CalculatePlannedProduction();
    });
    $(document).delegate('#txtMatrixEfficiencyWS', 'keyup', function (e) {
        e.preventDefault();
        CalculateDailyTarget($(this).val() === "" ? 0 : $(this).val());
    });
});
function CalculateDailyTarget(WorkStation) {
    var grid = $('#divMatrixEfficiency').data().kendoGrid;
    $.each(grid._data, function (i, item) {
        var SAM = parseInt($("#spanMatrixEfficiencySAM").text());
        var OrgEff = item.MatrixEfficiency;
        var HourlyProduction = Math.ceil((parseInt(WorkStation) * 60) / parseFloat(SAM));
        HourlyProduction = Math.ceil(HourlyProduction * (OrgEff / 100));
        var DailyProduction = parseInt(HourlyProduction) * parseInt(10);
        item.DailyTarget = DailyProduction;
    });
    grid.refresh();
}
function CalculatePlannedProduction() {
    var ExtraPercentage = $("#txtExtraPercentage").val();
    var OrderQty = $("#txtOrderQty").val();
    if (ExtraPercentage != "" && parseInt(ExtraPercentage) > 0) {
        $("#txtPlanProduction").val(parseInt(OrderQty) + (Math.floor((OrderQty * ExtraPercentage) / 100)));
    }
}
function LoadAllPRInformation() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionReference/LoadAllPRInformation",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            BindGridData(data);
        }
    });
    $("#modalPRInformation").modal("toggle");
    setTimeout(alertFunc, 2000);
}
function alertFunc() {
    var grid = $("#divPRInformation").data("kendoGrid");
    grid.refresh();
}
function BindGridData(data) {
    $("#divPRInformation").kendoGrid().empty();
    $("#divPRInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "number" },
                        PRID: { type: "string" },
                        CompanyName: { type: "string" },
                        BuyerName: { type: "string" },
                        ProductType: { type: "string" },
                        FileRefID: { type: "string" },
                        PRQty: { type: "number" }
                    }
                }
            }
        },
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            {
                field: "PRID", title: "PRID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPRInformation(' + dataItem.PRMasterID + ')><strong>' + dataItem.PRID + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "CompanyName", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "Buyer", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProductType", title: "Product Type", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "FileRef ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            //{ field: "Style", title: "FileRef No", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRQty", title: "PR Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeletePRInformation("#=PRMasterID#")><span class="k-icon k-i-trash"></span><strong>Delete</strong></a>',
                field: "PRMasterID",
                title: "Delete",
                headerAttributes: { style: "text-align: center" },
                attributes: { class: "text-center" },
                filterable: false
            },
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
        scrollable: true,
    });
    $("#Kendofilter").val("");
}
function GetPRInformation(PRMasterID) {
    $(".KendoCommonfilter").val("");
    BindEOInformation([]);
    BindLineInformation([]);
    $(".txt").val("");
    $("#ddlCompany").val("-1");
    $("#ddlQuantityFactor").val("1");
    $("#ddlProductType").val("-1");
    $("#ddlStyleType").val("BOTTOMS");
    $("#ddlStatus").val("ACTIVE");
    $("#ddlFileRef").empty();

    var _dbModel = {
        'PRMasterID': PRMasterID
    };

    $.ajax({
        type: "POST",
        url: baseURL + "/PRInformation/LoadSelectedPRInformation",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $("#txtPRID").val(data.Master[0].PRID);
            $("#ddlCompany").val(data.Master[0].CompanyID);
            $("#ddlBuyer").val(data.Master[0].BuyerID);
            $("#ddlProductType").val(data.Master[0].ProductType);
            $("#ddlStyleType").val(data.Master[0].StyleType);
            $("#txtOrderQty").val(data.Master[0].SelectedQty);
            $("#ddlQuantityFactor").val(data.Master[0].QuantityFactor);
            $("#txtExtraPercentage").val(data.Master[0].ExcessQty);
            $("#txtPlanProduction").val(data.Master[0].PlannedProduction);
            $("#txtBulletinID").val(data.Master[0].BulletinID);
            $("#txtSAM").val(data.Master[0].SAM);
            $("#txtPCD").val(data.Master[0].PCD);
            $("#txtPlanStartDate").val(data.Master[0].PlanStartDate);
            $("#txtLineAllocated").val(data.Master[0].LineAllocated);
            $("#txtTotalWorkingMinutes").val(data.Master[0].TotalWorkMinutes);
            $("#ddlStatus").val(data.Master[0].Status);
            $("#ddlRepeatOrder").val(data.Master[0].IsRepeatedOrder === true ? "1" : "0");
            $("#txtPriorityNo").val(data.Master[0].PriorityNo);
            $("#txtCustomMatrixLineNumber").val(data.Master[0].LineNumberList);

            LoadFileRefInformation();
            var names = data.Master[0].FileRefID;
            var nameArr = names.split(',');
            $('#ddlFileRef').selectpicker('val', nameArr);

            $('#ddlCompany').selectpicker('refresh');
            $('#ddlCompany').selectpicker('render');
            $('#ddlBuyer').selectpicker('refresh');
            $('#ddlBuyer').selectpicker('render');
            $('#ddlProductType').selectpicker('refresh');
            $('#ddlProductType').selectpicker('render');
            $('#ddlStatus').selectpicker('refresh');
            $('#ddlStatus').selectpicker('render');
            $('#ddlQuantityFactor').selectpicker('refresh');
            $('#ddlQuantityFactor').selectpicker('render');

            $('#btnLoadPRMAtrix').removeClass('hidden');

            BindEOInformation(data.EOInformation);
            BindLineInformation(data.LineInformation);
            //CalculatePlannedQty();
        }
    });
    $("#modalPRInformation").modal("toggle");
}
function SavePRMasterInformation(arrEOInformation, arrLineNumber) {
    var _isError = 0;
    var _message = "";
    var PRID = $("#txtPRID").val();
    var Company = $("#ddlCompany").val();
    var BuyerID = $("#ddlBuyer").val();
    var ProductType = $("#ddlProductType").val();
    var FileRefID = $("#ddlFileRef").val().join(",");
    var StyleType = $("#ddlStyleType").val();
    var SelectedQty = $("#txtOrderQty").val();
    var ExcessQty = $("#txtExtraPercentage").val();
    var PlannedProduction = $("#txtPlanProduction").val();
    var BulletinID = $("#txtBulletinID").val();
    var SAM = $("#txtSAM").val();
    var PCD = $("#txtPCD").val();
    var PlanStartDate = $("#txtPlanStartDate").val();
    var LineAllocated = $("#txtLineAllocated").val();
    var TotalWorkingMinutes = $("#txtTotalWorkingMinutes").val();
    var Status = $("#ddlStatus").val();
    var PriorityNo = $("#txtPriorityNo").val();
    var QuantityFactor = $("#ddlQuantityFactor").val();
    var IsRepeatedOrder = $("#ddlRepeatOrder").val() === "1" ? true : false;

    if (Company === null || Company === "-1") {
        _message += "Select Company Name..!\n";
        _isError = 1;
    }
    if (BuyerID === null || BuyerID === "-1") {
        _message += "Select Buyer Name..!\n";
        _isError = 1;
    }
    if (ProductType === null || ProductType === "-1") {
        _message += "Select Product Type..!\n";
        _isError = 1;
    }
    if (FileRefID === null || FileRefID === "-1") {
        _message += "Select File Reference..!\n";
        _isError = 1;
    }
    if (StyleType === null || StyleType === "") {
        _message += "Select Style Type..!\n";
        _isError = 1;
    }
    if (SelectedQty === null || SelectedQty === "") {
        _message += "No Quantity Found..!\n";
        _isError = 1;
    }
    if (ExcessQty === null || ExcessQty === "") {
        _message += "No Excess Qty Found..!\n";
        _isError = 1;
    }
    if (PlannedProduction === null || PlannedProduction === "") {
        _message += "No Planned Production Qty Found..!\n";
        _isError = 1;
    }
    if (SAM === null || SAM === "") {
        _message += "No SAM Found..!\n";
        _isError = 1;
    }
    else {
        if (parseFloat(SAM) === 0) {
            _message += "SAM Must Be Greater Then 0..!\n";
            _isError = 1;
        }
    }

    if (PCD === null || PCD === "") {
        _message += "PCD Date Not Found..!\n";
        _isError = 1;
    }
    if (PlanStartDate === null || PlanStartDate === "") {
        _message += "Plan Start Date Not Found..!\n";
        _isError = 1;
    }
    if (LineAllocated === null || LineAllocated === "") {
        _message += "Allocated Line Number Not Found..!\n";
        _isError = 1;
    }
    if (Status === null || Status === "") {
        _message += "Select PR Status..!\n";
        _isError = 1;
    }
    if (TotalWorkingMinutes === null || TotalWorkingMinutes === "") {
        _message += "Enter Working Minutes..!\n";
        _isError = 1;
    }

    if (PriorityNo === null || PriorityNo === "") {
        _message += "Enter Priority No..!\n";
        _isError = 1;
    }

    if (QuantityFactor === null || QuantityFactor === "") {
        _message += "Select Quantity Factor..!\n";
        _isError = 1;
    }

    if (_isError === 1) {
        alert(_message);
        return false;
    }

    if (PRID === "") {
        PRID = "<NEW>";
    }

    var _dbModel = {
        'PRID': PRID, 'CompanyID': Company, 'BuyerID': BuyerID, 'ProductType': ProductType, 'FileRefID': FileRefID,
        'StyleType': StyleType, 'SelectedQty': SelectedQty, 'ExcessQty': ExcessQty, 'PlannedProduction': PlannedProduction,
        'BulletinID': BulletinID, 'SAM': SAM, 'PCD': PCD, 'PlanStartDate': PlanStartDate, 'LineAllocated': LineAllocated,
        'Status': Status, 'IsRepeatedOrder': IsRepeatedOrder, 'WorkingMinutes': TotalWorkingMinutes, 'PriorityNo': PriorityNo,
        'QuantityFactor': QuantityFactor, 'arrEOInformationDBModel': arrEOInformation, 'arrLineInformationDBModel': arrLineNumber
    };

    $.ajax({
        type: "POST",
        url: baseURL + "/PRInformation/SaveProductionReference",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            if (data.success !== "Failed") {
                BindLineInformation([]);
                BindLineInformation(data.LineInformation);
                $("#txtPRID").val(data.success);
                swal('Good job!', 'Data Save Successfully..!', 'success');
                $('#btnLoadPRMAtrix').removeClass('hidden');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                $('#btnLoadPRMAtrix').addClass('hidden');
            }
        }
    });
}
function LoadddlData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/ProductionReference/LoadDDLInformation",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlCompany").empty();
            $("#ddlCompany").append($("<option/>").val("-1").text("Select Company"));
            $.each(data.Company, function () {
                $("#ddlCompany").append($("<option/>").val(this.Code).text(this.Value));
            });

            $("#ddlBuyer").empty();
            $("#ddlBuyer").append($("<option/>").val("-1").text("Select Buyer"));
            $.each(data.Buyer, function () {
                $("#ddlBuyer").append($("<option/>").val(this.Code).text(this.Value));
            });

            $("#ddlProductType").empty();
            $("#ddlProductType").append($("<option/>").val("-1").text("Select Product Type"));
            $.each(data.ProdyctTypes, function () {
                $("#ddlProductType").append($("<option/>").val(this.Code).text(this.Value));
            });
        }
    });

    $('#ddlCompany').selectpicker('refresh');
    $('#ddlCompany').selectpicker('render');
    $('#ddlBuyer').selectpicker('refresh');
    $('#ddlBuyer').selectpicker('render');
    $('#ddlProductType').selectpicker('refresh');
    $('#ddlProductType').selectpicker('render');
}
function LoadFileRefInformation() {
    var _Buyer = $('#ddlBuyer').val();
    var _ProductType = $('#ddlProductType').val();

    if (_Buyer !== "-1" && _ProductType !== "-1") {

        var _dbModel = { 'BuyerID': _Buyer, 'ProductType': _ProductType };

        $.ajax({
            type: "POST",
            url: baseURL + "/PRInformation/LoadFileRefData",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            async: false,
            success: function (data) {
                $("#ddlFileRef").empty();
                $("#ddlFileRef").append($("<option/>").val("-1").text("Select FileRef"));
                $.each(data.FileRef, function () {
                    $("#ddlFileRef").append($("<option/>").val(this.Code).text(this.Value));
                });
            }
        });

        $('#ddlFileRef').selectpicker('refresh');
        $('#ddlFileRef').selectpicker('render');
    }
}
function LoadEOInformation(FileRefID, PRID, CompanyID) {
    if (FileRefID == null || FileRefID == "") {
        alert('No File Reference Found..!');
        return false;
    }
    var _dbModel = { 'FileRefID': FileRefID, 'PRID': PRID, 'CompanyID': CompanyID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/LoadExportOrderAndLineNumber",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            $("#txtPCD").val("");
            $("#txtBulletinID").val("");
            $("#txtSAM").val("");
            $("#txtPlanStartDate").val("");
            $("#txtBulletinID").val("");

            $("#txtSAM").val(data.EOInformation[0].SAM);
            $("#txtPCD").val(data.EOInformation[0].PCD);
            $("#txtBulletinID").val(data.EOInformation[0].BulletinID);
            $("#txtPlanStartDate").val(data.EOInformation[0].PlanStartDate);
            $("#txtBulletinID").val(data.EOInformation[0].BulletinID);
            $("#txtTotalWorkingMinutes").val("600");

            BindEOInformation(data.EOInformation);
            BindLineInformation(data.LineInformation);
        }
    });
}
function LoadGetEOInformation(FileRefID, PRID, CompanyID) {
    if (FileRefID == null || FileRefID == "") {
        alert('No File Reference Found..!');
        return false;
    }
    var _dbModel = { 'FileRefID': FileRefID, 'PRID': PRID, 'CompanyID': CompanyID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/LoadEOInformation",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            BindEOInformation(data.EOInformation);
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
                        PriorityNo: { editable: true, type: "number" },
                        IsFixed: { editable: true, type: "boolean" },
                        MatrixCount: { editable: false, type: "number" },
                        PRMasterID: { editable: true, type: "number" }
                    }
                }
            },
            aggregate: [
                { field: "ProduceQty", aggregate: "sum" },
                { field: "TargetQty", aggregate: "sum" }
            ],
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
            //{ field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    return '<center><a href="javascript:void(0)" onclick="GetLineDetails(' + dataItem.LineNumber + ')">' + dataItem.LineNumber + '</a></center>';
                }
            },
            { field: "ProduceQty", title: "Produce Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
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
                headerTemplate: '<label class="yellowHeader">Allocated Qty</label>', footerTemplate: "#= sum # "
            },
            {
                field: "PlanStartDate", title: "Line Start Date",
                template: "#= kendo.toString(kendo.parseDate(PlanStartDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #",
                filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Line Start Date</label>'
            },
            {
                field: "PriorityNo", title: "Priority No", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Priority No</label>'
            },
            {
                field: "IsFixed", title: "IsFixed", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Fixed Quantity</label>'
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
            {
                field: "MatrixCount", title: "Matrix", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Matrix</label>',
                template: function (dataItem) {
                    if (parseInt(dataItem.PRMasterID) > 0) {
                        if (parseInt(dataItem.MatrixCount) > 0) {
                            return '<a href="javascript:void(0)" onClick=GetMatrixInformation(' + dataItem.PRMasterID + ',' + dataItem.LineNumber + ',' + dataItem.WorkStation + ',' + dataItem.AverageEfficiency + ',' + dataItem.MatrixCount + ')><ion-icon style="font-size: 12pt;" name="settings"></ion-icon></a>';
                        }
                        else {
                            return '<a href="javascript:void(0)" onClick=GetMatrixInformation(' + dataItem.PRMasterID + ',' + dataItem.LineNumber + ',' + dataItem.WorkStation + ',' + dataItem.AverageEfficiency + ',' + dataItem.MatrixCount + ')><ion-icon style="font-size: 12pt;" name="settings"></ion-icon></a>';
                        }
                    }
                    else {
                        return "";
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
        height: 450,
        pageable: false,
        scrollable: true
    });
    $("#spProductionQty").text($("#txtPlanProduction").val());

    if (data.length > 0)
        $("#spProduceQty").text(data[0].ProduceQty);
    else
        $("#spProduceQty").text("0");

    var grid = $("#divLineInformation").data("kendoGrid");
    var _planQty = 0;
    var _notPlanProduceQty = 0;
    TotalLineSelected = 0;
    $.each(grid._data, function (i, item) {
        var IsCheck = item.IsCheck;
        if (IsCheck === true) {
            array[item.LineNumber] = true;
            _planQty += parseInt(item.TargetQty);
            TotalLineSelected++;
        }

        if (IsCheck === false && item.ProduceQty !== "") {
            _notPlanProduceQty += parseInt(item.ProduceQty);
        }
    });
    var _PlannedQty = $("#txtPlanProduction").val();
    $("#spRemainingProductionQty").text(parseInt(_PlannedQty) - (parseInt(_planQty) + parseInt(_notPlanProduceQty)));

    var gridElement = $("#divLineInformation");
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(450);
    dataArea.height(450);

    $("#txtLineAllocated").val(TotalLineSelected);

    Linearray = [];
    $.each(data, function () {
        Linearray.push(this.LineNumber);
    });

    //$("#divLineInformation").data("kendoGrid").dataSource.read();
    var gridElement = $("#divLineInformation");
    var dataArea = gridElement.find(".k-grid-content");
    gridElement.height("450px");
    dataArea.height("450px");
}
function onChangeLine(e) {
    if (e.action == "itemchange" && e.field == "IsCheck") {
        CalculateRemainingQty();
    }
    else if (e.action == "itemchange" && e.field == "TargetQty") {
        CalculateRemainingQty();
    }
    else if (e.action == "itemchange" && e.field == "IsFixed") {
        var _TargetQty = e.items[0].TargetQty = "" ? 0 : parseInt(e.items[0].TargetQty);

        if (_TargetQty === 0) {
            e.items[0].IsFixed = false;
            alert('Quantity should not be 0 for fixed a line..!');
            return false;
        }
    }
}
function CalculateRemainingQty() {
    var grid = $("#divLineInformation").data("kendoGrid");
    var _planQty = 0;
    $.each(grid._data, function (i, item) {
        var IsCheck = item.IsCheck;
        if (IsCheck === true || $("#" + item.LineNumber).is(":checked")) {
            _planQty += parseInt(item.TargetQty);
        }
    });
    var _PlannedQty = $("#txtPlanProduction").val();
    $("#spRemainingProductionQty").text(parseInt(_PlannedQty) - parseInt(_planQty));
}
function BindEOInformation(data) {
    $("#divEOInformation").kendoGrid().empty();
    $("#divEOInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChange,
            schema: {
                model: {
                    Id: "RowID",
                    fields: {
                        RowID: { type: "number", editable: false },
                        IsCheck: { editable: false },
                        SeqNo: { type: "number", validation: { required: true, min: 1 } },
                        FileRefID: { editable: false, type: "string" },
                        StyleID: { editable: false, type: "string" },
                        ExportOrderID: { editable: false, type: "string" },
                        SizeGroup: { editable: false, type: "string" },
                        UOM: { editable: false, type: "string" },
                        Destination: { editable: false, type: "string" },
                        UnitName: { editable: false, type: "string" },
                        ShipMode: { editable: false, type: "string" },
                        ExportPONo: { editable: false, type: "string" },
                        PCD: { editable: false, type: "string" },
                        ExportOrderStatus: { editable: false, type: "string" },
                        TargetDate: { editable: false, type: "string" },
                        ExfactoryDate: { editable: false, type: "string" },
                        ShipDate: { editable: false, type: "string" },
                        OrderQty: { type: "number", editable: false },
                        PRQty: { type: "number", editable: false },
                        RemainingQty: { type: "number", editable: false },
                        SelectedQty: { type: "number", validation: { required: true, min: 0 } },
                    }
                }
            },
            aggregate: [
                { field: "OrderQty", aggregate: "sum" },
                { field: "PRQty", aggregate: "sum" },
                { field: "RemainingQty", aggregate: "sum" },
                { field: "SelectedQty", aggregate: "sum" }
            ],
        },
        toolbar: "<center style='width: 300px; float: right; margin-top: 5px;'><span class='tblSpanText'><strong>Total Selected: </strong><label id='lblTotalQty'></label></span></center>",
        columns: [
            { field: "RowID", title: "RowID", hidden: true, filterable: false },
            {
                title: "<center><input type='checkbox' data-vastype='vasOp' id='chkAllGridValue' value=''></center>", width: 30,
                template: function (dataItem) {
                    if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "CANCELLED") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "ACTIVE") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "RUNNING") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "PENDING") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "READY FOR SHIPMENT") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "APPROVED FOR SHIPMENT") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "CLOSED") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "1" && dataItem.ExportOrderStatus === "TO CLOSE") {
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                    else if (dataItem.IsCheck.toString() === "0" && dataItem.ExportOrderStatus === "CANCELLED") {
                        return '';
                    }
                    else if (dataItem.IsCheck.toString() === "0" && parseInt(dataItem.OrderQty) === 0) {
                        return '';
                    }
                    else if (dataItem.IsCheck.toString() === "0" && parseInt(dataItem.RemainingQty) === 0) {
                        return '';
                    }
                    else {
                        return '<center><input class="chkPO" type="checkbox" id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    }
                }
            },
            {
                field: "SeqNo", title: "Seq No", filterable: false,
                headerAttributes: { style: "white-space: normal" }, hidden: true, attributes: { style: "text-align: center" },
            },
            { field: "FileRefID", title: "FileRef ID", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderID", title: "EO ID", width: "100px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleID", title: "Style", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportPONo", title: "Export PONo", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PCD", title: "PCD", filterable: false, width: "90px", headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderStatus", title: "EO Status", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetDate", title: "ExFactory", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ShipDate", title: "Ship Date", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
            { field: "RemainingQty", title: "Remaining Qty", width: "90px", hidden: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
            { field: "PRQty", title: "PR Qty", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
            { field: "SelectedQty", title: "Selected Qty", width: "90px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # ", },
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
        dataBound: function () {
            for (f in array) {
                if (array[f]) {
                    $('#' + f).attr('checked', 'checked');
                }
            }
        },
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });

    var grid = $("#divEOInformation").data("kendoGrid");
    var data = grid.dataSource.data();
    $.each(data, function (i, row) {
        if (row.IsCheck.toString() === "1" && row.ExportOrderStatus === "CANCELLED") {
            $('tr[data-uid="' + row.uid + '"] ').css("background-color", "yellow");
        }
        else if (row.IsCheck.toString() === "1" && (row.ExportOrderStatus === "ACTIVE" || row.ExportOrderStatus === "RUNNING"
            || row.ExportOrderStatus === "PENDING" || row.ExportOrderStatus === "READY FOR SHIPMENT" || row.ExportOrderStatus === "APPROVED FOR SHIPMENT"
            || row.ExportOrderStatus === "CLOSED" || row.ExportOrderStatus === "TO CLOSE")) {
            if (parseInt(row.RemainingQty) < 0) {
                $('tr[data-uid="' + row.uid + '"] ').css("background-color", "yellow");
            }
        }
    });

    CalculatePlannedQty();
}
function onChange(e) {
    if (e.action == "itemchange" && e.field == "IsCheck") {
        CalculatePlannedQty();
    }
    else if (e.action == "itemchange" && e.field == "SelectedQty") {
        CalculatePlannedQty();

        // for updating column footer
        var grid = $("#divEOInformation").data("kendoGrid");
        var model = e.items[0];
        var groupFooterIndex = 0;
        var groupFooters = grid.tbody.children(".k-group-footer");

        function updateGroupFooters(items) {
            var updatedSubGroup;
            var updatedElement;
            for (var idx = 0; idx < items.length; idx++) {
                var item = items[idx];
                if (item.hasSubgroups) {
                    updatedSubGroup = updateGroupFooters(item.items);
                }
                if (updatedSubGroup || $.inArray(model, item.items) !== -1) {
                    updatedElement = true;
                    groupFooters.eq(groupFooterIndex).replaceWith(grid.groupFooterTemplate(item.aggregates));
                }
                groupFooterIndex++;
            }
            return updatedElement;
        }

        updateGroupFooters(this.view());

        grid.footer.find(".k-footer-template").replaceWith(grid.footerTemplate(this.aggregates()));
    }
}
function CalculatePlannedQty() {
    var grid = $("#divEOInformation").data("kendoGrid");
    var _totalQty = 0;
    $.each(grid.dataSource._data, function (i, item) {
        var id = item.RowID;
        if ($("#" + id).is(':checked')) {
            var _selectedQty = item.SelectedQty === "" ? 0 : item.SelectedQty;
            var _remainingQty = item.RemainingQty;

            //if (parseInt(_selectedQty) > parseInt(_remainingQty)) {
            //    _totalQty += item.RemainingQty;
            //    alert(item.ExportOrderID + " Selected Qty is Greater then Remaining Qty..!");
            //}
            //else
            _totalQty += item.SelectedQty;
        }
    });

    var _QuantityFactor = $("#ddlQuantityFactor").val() == "" ? 1 : $("#ddlQuantityFactor").val();
    var _SelectQty = parseInt(_totalQty) * parseInt(_QuantityFactor);

    //$('#lblTotalQty').text(TotalSelectedEOQty);
    //$('#txtTotalOrderQty').val(TotalSelectedEOQty);
    //$('#txtOrderQty').val(_SelectQty);

    TotalSelectedEOQty = _totalQty;
    $('#lblTotalQty').text(TotalSelectedEOQty);
    $('#txtTotalOrderQty').val(_totalQty);
    $('#txtOrderQty').val(_SelectQty);
    CalculatePlannedProduction();
}
function toggleAll(fieldName) {
    e = window.event;
    var checked = $(e.target).context.checked;
    var grid = $(e.target).closest('.k-grid').data("kendoGrid");
    grid.dataSource.data().forEach(function (d) {
        d.set(fieldName, checked);
    });

    SetSequenceNo();
}
function SetSequenceNo() {
    var grid = $("#divEOInformation").data("kendoGrid");
    var _SeqNo = 1;
    $.each(grid.dataSource._data, function (i, item) {
        if (item.IsCheck == true) {
            item.SeqNo = _SeqNo;
            _SeqNo++;
        }
        else {
            item.SeqNo = "";
        }
    });
    grid.refresh();
}
function DeletePRInformation(PRMasterID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'PRMasterID': PRMasterID };
        $.ajax({
            type: "POST",
            url: baseURL + "/ProductionReference/DeleteSelectedPRInformation",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success === true) {
                    LoadPRInformationAfterDelete();
                    swal('Good job!', 'Data Deleted Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}
function LoadPRInformationAfterDelete() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionReference/LoadAllPRInformation",
        data: {},
        async: true,
        dataType: "json",
        success: function (data) {
            BindGridData(data);
        }
    });
}
function MoveLineData(LineNumber) {
    $("#txtFromLineNumber").val("");
    $("#txtToLineNumber").val("");

    $("#txtFromLineNumber").val(LineNumber);
    $("#modalMoveLine").modal("toggle");
}
function MoveLineDataToAnotherLine() {
    var _FromLineNumber = $("#txtFromLineNumber").val();
    var _ToLineNumber = $("#txtToLineNumber").val();
    var _FromPlanStartDate = "";
    var _FromPlanTargetQty = "";
    var _FromPriorityNo = "";

    if (_ToLineNumber === "") {
        alert("Enter a Line Number..!");
        return false;
    }

    if (!Linearray.includes(parseInt(_ToLineNumber))) {
        alert("Enter a Valid Line Number..!");
        return false;
    }

    var grid = $('#divLineInformation').data().kendoGrid;
    $.each(grid._data, function (j, items) {
        var _grdLineNumber = items.LineNumber;
        if (_grdLineNumber.toString() === _FromLineNumber.toString()) {
            items.IsCheck = false;
            array[items.LineNumber] = false;
            _FromPlanStartDate = items.PlanStartDate;
            _FromPlanTargetQty = items.TargetQty;
            _FromPriorityNo = items.PriorityNo;
            items.PlanStartDate = null;
            items.TargetQty = 0;
            items.PriorityNo = "";
            grid.dataSource.sync();
            grid.saveChanges();
        }
    });

    $.each(grid._data, function (j, items) {
        var _grdLineNumber = items.LineNumber;
        if (_grdLineNumber.toString() === _ToLineNumber.toString()) {
            items.IsCheck = true;
            array[items.LineNumber] = true;
            items.PlanStartDate = _FromPlanStartDate;
            items.TargetQty = _FromPlanTargetQty;
            items.PriorityNo = _FromPriorityNo;
            grid.dataSource.sync();
            grid.saveChanges();
        }
    });
    $("#modalMoveLine").modal("toggle");
}
function LoadSamWiseEfficiency() {
    var _isError = 0;
    var _Message = "";
    var _SAM = $("#txtSAM").val();
    var _StyleType = $("#ddlStyleType").val();
    var _Company = $("#ddlCompany").val();

    if (_SAM === "") {
        _Message += "SAM not found..!\n";
        _isError = 1;
    }

    if (_StyleType === "") {
        _Message += "Style type not found..!\n";
        _isError = 1;
    }

    if (_Company === "-1") {
        _Message += "Company not found..!\n";
        _isError = 1;
    }

    if (_isError === 1) {
        alert(_Message);
        return false;
    }

    var _dbModel = { 'CompanyID': _Company, 'StyleType': _StyleType, 'SAM': _SAM };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/GetSamWiseEfficiency",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            PopulateSamWiseEfficiency(data, _SAM);
        }
    });
}
function PopulateSamWiseEfficiency(data, SAM) {
    $("#divMatrixEfficiency").kendoGrid().empty();
    $("#divMatrixEfficiency").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        StyleCriticality: { type: "string" },
                        DayNo: { type: "string" },
                        MatrixEfficiency: { type: "string" },
                        DailyTarget: { type: "string" },
                    }
                }
            }
        },
        toolbar: 'SAM: <span id="spanMatrixEfficiencySAM">' + SAM + '</span> <input id="txtMatrixEfficiencyWS" class="k-textbox pull-right" type="text" placeholder="Enter Work Station..">',
        columns: [
            { field: "StyleCriticality", title: "Style Criticality", filterable: false, attributes: { style: "text-align: center" } },
            { field: "DayNo", title: "Day", filterable: false, attributes: { style: "text-align: center" } },
            { field: "MatrixEfficiency", title: "Matrix Efficiency", filterable: false, attributes: { style: "text-align: center" } },
            { field: "DailyTarget", title: "Daily Target", filterable: false, attributes: { style: "text-align: center" } },

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
        //height: 400,
        pageable: false,
        scrollable: true
    });
    $("#modalSAMEfficiency").modal("toggle");
}
function GetMatrixInformation(PRMasterID, LineNumber, WorkStation, AverageEfficiency, MatrixCount) {
    $("#sideBarContent").empty();

    var _dataEntryArea = "";
    _dataEntryArea += "<div id='divEntryPRMatrix' class='row divCellInfo'>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtSAM'>SAM</label>";
    _dataEntryArea += " <input type='text' id='txtSAM' class='form-control' value='" + $("#txtSAM").val() + "' readonly=''>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtTotalWorkStation'>Work Station</label>";
    _dataEntryArea += " <input type='text' id='txtTotalWorkStation' class='form-control' value='" + WorkStation + "' readonly=''>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtOrgEfficiency'>Org Efficiency</label>";
    _dataEntryArea += " <input type='text' id='txtOrgEfficiency' class='form-control' value='" + AverageEfficiency + "' readonly=''>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtLineNumber'>Line Numbery</label>";
    _dataEntryArea += " <input type='text' id='txtLineNumber' class='form-control' value='" + LineNumber + "' readonly=''>";
    _dataEntryArea += " <input type='hidden' id='hdPRMatrixID'>";
    _dataEntryArea += " <input type='hidden' id='hdPRMasterID' value='" + PRMasterID + "'>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtEfficiency'>Efficiency</label>";
    _dataEntryArea += " <input type='text' id='txtEfficiency' class='form-control'>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtHourlyProduction'>Hourly Production</label>";
    _dataEntryArea += " <input type='text' id='txtHourlyProduction' class='form-control'>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtDailyProduction'>Daily Production</label>";
    _dataEntryArea += " <input type='text' id='txtDailyProduction' class='form-control'>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtStartDay'>Start Day</label>";
    _dataEntryArea += " <input type='text' id='txtStartDay' class='form-control'>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4'>";
    _dataEntryArea += " <label for='txtEndDay'>End Day</label>";
    _dataEntryArea += " <input type='text' id='txtEndDay' class='form-control'>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-4 col-lg-4' style='padding-top: 5px;'>";
    _dataEntryArea += "<button id='btnPRMatrixSave' type='button' class='btn btn-primary btn-block'>Save</button>";
    _dataEntryArea += "</div>";

    _dataEntryArea += "</div>";

    _dataEntryArea += "<div class='col-sm-12 col-md-12 col-lg-12 divCellInfo'>";
    _dataEntryArea += " <div id='tblPRLineMatrixInfo'>";
    _dataEntryArea += " </div>";
    _dataEntryArea += "</div>";
    $("#sideBarContent").html(_dataEntryArea);
    BindPRMatrixGridData(PRMasterID, LineNumber);
}
function BindPRMatrixGridData(PRMasterID, LineNumber) {
    var _dbModel = { 'PRMasterID': PRMasterID, 'LineNumber': LineNumber };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/GetPRLineEfficiencyMatrix",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            var _sideBarStatus = $("#sidebar2").attr("aria-hidden");

            $("#tblPRLineMatrixInfo").kendoGrid().empty();
            $("#tblPRLineMatrixInfo").kendoGrid({
                dataSource: {
                    data: data,
                    dataType: "json"
                },
                columns: [
                    {
                        field: "PRMatrixID", title: "PRMatrixID", filterable: false, hidden: true,
                        headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }
                    },
                    {
                        field: "PRMasterID", title: "PRMasterID", filterable: false, hidden: true,
                        headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }
                    },
                    {
                        field: "StartDay", title: "Start Day", filterable: false,
                        headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }
                    },
                    {
                        field: "EndDay", title: "End Day", filterable: false,
                        headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }
                    },
                    {
                        field: "MatrixEfficiency", title: "Efficiency", filterable: false,
                        headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }
                    },
                    {
                        field: "DailyLineTarget", title: "Target", filterable: false,
                        headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }
                    },
                    {
                        template: '<a role="button" class="k-button k-button-icontext" style="min-width: 14px !important;" href="javascript:void(0)" onclick=GetMatrixEditData(#=PRMatrixID#)><i class="fa fa-pencil"></i></a>' +
                            '<a role="button" class="k-button k-button-icontext" style="min-width: 14px !important;" href="javascript:void(0)" onclick=DeleteMatrixGridData("#=PRMatrixID#","#=PRMasterID#","' + LineNumber + '")><i class="fa fa-close"></i></a>',
                        field: "PRMatrixID",
                        title: "Action",
                        width: 80,
                        headerAttributes: { style: "text-align: center" },
                        attributes: { class: "text-center" }
                    },
                ],
                sortable: true,
                filterable: false,
                resizable: true,
                height: 200,
                pageable: false,
                scrollable: true
            });

            if (_sideBarStatus === "true")
                $("#btnSideBarClick").trigger("click");
        }
    });
}
function SaveMatrixFormValue() {
    var _isError = 0;
    var PRMatrixID = $("#hdPRMatrixID").val() === "" ? 0 : $("#hdPRMatrixID").val();
    var PRMasterID = $("#hdPRMasterID").val() === "" ? 0 : $("#hdPRMasterID").val();
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
                BindPRMatrixGridData(PRMasterID, LineNumber);
                if (PRMatrixID === "") {
                    swal('Good job!', 'Data Save Successfully..!', 'success');
                }
                else {
                    swal('Good job!', 'Data Updated Successfully..!', 'success');
                }
                $("#txtEfficiency").val("");
                $("#txtHourlyProduction").val("");
                $("#txtDailyProduction").val("");
                $("#txtStartDay").val("");
                $("#txtEndDay").val("");
                $("#hdPRMatrixID").val("");
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function GetMatrixEditData(PRMatrixID) {
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
        }
    });
}
function DeleteMatrixGridData(PRMatrixID, PRMasterID, LineNumber) {
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
                    BindPRMatrixGridData(PRMasterID, LineNumber);
                    swal('Good job!', 'Data Deleted Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}
function ClearForm() {
    BindEOInformation([]);
    BindLineInformation([]);
    $(".txt").val("");
    $(".KendoCommonfilter").val("");
    $("#ddlCompany").val("-1");
    $("#ddlBuyer").val("-1");
    $("#ddlProductType").val("-1");
    $("#ddlQuantityFactor").val("1");
    $("#ddlStyleType").val("BOTTOMS");
    $("#ddlStatus").val("ACTIVE");
    $("#ddlFileRef").empty();
    $("#ddlRepeatOrder").val("0");

    $('#ddlCompany').selectpicker('refresh');
    $('#ddlCompany').selectpicker('render');
    $('#ddlBuyer').selectpicker('refresh');
    $('#ddlBuyer').selectpicker('render');
    $('#ddlProductType').selectpicker('refresh');
    $('#ddlProductType').selectpicker('render');
    $('#ddlStatus').selectpicker('refresh');
    $('#ddlStatus').selectpicker('render');
    $('#ddlFileRef').selectpicker('refresh');
    $('#ddlFileRef').selectpicker('render');
    $('#ddlQuantityFactor').selectpicker('refresh');
    $('#ddlQuantityFactor').selectpicker('render');

    $("#tabs").tabs({ active: "#tabs-1" });
    array = {};
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
                    "           <label class='lblTitle'>Style :</label>" +
                    "       </div>" +
                    "       <div class='col-sm-12 col-md-8 col-lg-8'>" +
                    "           <span>" + value.Style + "</span>" +
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