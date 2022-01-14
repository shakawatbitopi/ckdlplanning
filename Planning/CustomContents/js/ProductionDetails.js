var array = {};
var TotalLineSelected = 0;

$(function () {
    G_KendoGridName = "divPRInformation";
    $("#Kendofilter").val("");
    $("#txtTotalWorkingMinutes").ForceNumericOnly();
    $("#txtNoOfWorkStation").ForceNumericOnly();
    $("#txtFirstDayOutput").ForceNumericOnly();
    $("#txtIncrementQty").ForceNumericOnly();
    $("#txtHourlyProduction").ForceNumericOnly();
    $("#txtHourlyProdOrgEff").ForceNumericOnly();
    $("#txtDailyTargetProductionPerLine").ForceNumericOnly();
    $("#txtLineAllocated").ForceNumericOnly();

    $('[data-toggle="popover"]').popover({
        placement: 'top',
        trigger: 'hover'
    });
    $(document).delegate('#txtOrderQty', 'blur', function (e) {
        e.preventDefault();
        var ExtraPercentage = $("#txtExtraPercentage").val();
        if (ExtraPercentage != "" && parseInt(ExtraPercentage) > 0) {
            $("#txtPlanProduction").val(parseInt($(this).val()) + (Math.floor(($(this).val() * ExtraPercentage) / 100)));
        }
    });
    $(document).delegate('#txtExtraPercentage', 'blur', function (e) {
        e.preventDefault();
        var ExtraPercentage = $("#txtExtraPercentage").val();
        var OrderQty = $("#txtOrderQty").val();
        if (ExtraPercentage != "" && parseInt(ExtraPercentage) > 0) {
            $("#txtPlanProduction").val(parseInt(OrderQty) + (Math.floor((OrderQty * ExtraPercentage) / 100)));
        }
        $("#spProductionQty").text($("#txtPlanProduction").val());
        CalculateTotalQty();
    });
    $(document).delegate('#txtTotalWorkingMinutes', 'blur', function (e) {
        e.preventDefault();
        HourlyProductionOrganizationEfficiency();
    });
    $(document).delegate('#txtSAM', 'blur', function (e) {
        e.preventDefault();
        HourlyProductionHundreadPercentEfficiency();
        HourlyProductionOrganizationEfficiency();
    });
    $(document).delegate('#txtSAM', 'keyup', function (e) {
        e.preventDefault();
        CalculateTotalQty();
    });

    $(document).delegate('#txtNoOfWorkStation', 'blur', function (e) {
        e.preventDefault();
        HourlyProductionHundreadPercentEfficiency();
        HourlyProductionOrganizationEfficiency();
    });
    $(document).delegate('#txtOrgEff', 'blur', function (e) {
        e.preventDefault();
        HourlyProductionOrganizationEfficiency();
    });
    $(document).delegate('#btnFind', 'click', function (e) {
        e.preventDefault();
        TotalLineSelected = 0;
        $("#divPRInformation").empty();
        var chkVal = $('input[type=radio][name=prRadio]:checked').val();
        if (chkVal == '0') {
            LoadAllPRInformation();
        }
        else if (chkVal == '1') {
            LoadAllAdditionalPRData();
        }
        $("#modalPRInformation").modal("toggle");
    });
    $(document).delegate('#txtFinishDays', 'blur', function (e) {
        e.preventDefault();
        CalculatePlanStartDate();
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
    $('#txtExFactoryDate').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtExFactoryDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtExFactoryDate').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"]
    });
    $(document).delegate('#btnSavePRInformation', 'click', function (e) {
        e.preventDefault();
        SavePRInformation();
    });
    $(document).delegate('#btnNew', 'click', function (e) {
        e.preventDefault();
        window.location.href = baseURL + "/ProductionDetails/Details";
    });
    $('input[type=radio][name=prRadio]').change(function () {
        $("#divPRInformation").empty();
        if (this.value == '0') {
            LoadAllPRInformation();
        }
        else if (this.value == '1') {
            LoadAllAdditionalPRData();
        }
    });
    //$(document).delegate('#chkAllGridValue', 'change', function () {
    //    var grid = $('#divLineInformation').data().kendoGrid;
    //    if ($(this).is(":checked")) {
    //        $("#divLineInformation").find("[type='checkbox']").prop('checked', true);
    //        //$.each(grid._data, function (i, item) {
    //        //    array[item.LineNumber] = true;
    //        //});
    //    }
    //    else {
    //        $("#divLineInformation").find("[type='checkbox']").prop('checked', false);
    //        $.each(grid._data, function (i, item) {
    //            array[item.LineNumber] = false;
    //        });
    //    }
    //});

    $(document).delegate('.chkPO', 'change', function () {
        var LineAllocated = $("#txtLineAllocated").val();
        if (LineAllocated === "") {
            $(this).prop('checked', false);
            alert('Insert Total Line Allocated..!')
            return false;
        }

        if ($(this).is(":checked")) {
            TotalLineSelected++;
            if (TotalLineSelected > LineAllocated) {
                $(this).prop('checked', false);
                alert('You have already selected ' + LineAllocated + ' Line');
                return false;
            }
        }
        else {
            TotalLineSelected--;
        }

        var grid = $('#divLineInformation').data().kendoGrid;
        var id = grid.dataItem($(this).closest('tr')).LineNumber;
        if ($(this).is(':checked')) {
            array[id] = true;
        }
        else {
            array[id] = false;

            $.each(grid._data, function (j, items) {
                var _grdLineNumber = items.LineNumber;
                if (_grdLineNumber === id) {
                    items.TargetQty = 0;
                    items.PlanStartDate = null;
                    items.PlanEndDate = null;
                    items.HourlyTarget = 0;
                    items.DailyLineTarget = 0;
                    items.FirstDayOutput = null;
                    items.IncrementQty = null;

                    grid.dataSource.sync();
                    grid.saveChanges();
                }
            });
        }

        if (LineAllocated !== "") {
            if (parseInt(LineAllocated) === TotalLineSelected) {
                LoadPreviewData();
            }
        }

    });

    $(document).delegate('#btnPreview', 'click', function (e) {
        e.preventDefault();
        LoadPreviewData();
    });
    $(document).delegate('#txtLineAllocated', 'blur', function (e) {
        e.preventDefault();
        if ($(this).val() != "") {
            if ($("#txtFirstDayOutput").val() == "") {
                alert('Please Insert First Day Output..!');
                return false;
            }
            if ($("#txtIncrementQty").val() == "" && $("#txtIncrementQty").val() != "NaN") {
                alert('Please Insert Increment Qty..!');
                return false;
            }
        }
        else {
            $(this).val("");
        }
    });
    $(".k-datepicker input").prop("readonly", true);
});
function CalculatePlanStartDate() {
    var tt = $("#txtExFactoryDate").val();
    var LineDaysRequire = $("#txtLineDaysRequire").val();
    var LineAllocated = $("#txtLineAllocated").val();
    var FinishDays = $("#txtFinishDays").val();

    var date = new Date(tt);
    var newdate = new Date(date);

    newdate.setDate(newdate.getDate() - parseInt(FinishDays) - Math.ceil(parseInt(LineDaysRequire) / parseInt(LineAllocated)));

    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();

    var someFormattedDate = mm + '/' + dd + '/' + y;
    $('#txtPlanStartDate').val(someFormattedDate);
}
function LoadAllPRInformation() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionDetails/LoadPRInformation",
        data: {},
        async: true,
        dataType: "json",
        success: function (data) {
            BindAllPRGridData(data);
        }
    });

}
function BindAllPRGridData(data) {
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
                        FileRefID: { type: "string" },
                        ProductType: { type: "string" },
                        PrQty: { type: "number" }
                    }
                }
            }
        },
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            {
                field: "PRID", title: "PRID", filterable: false,
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPRInformation(' + dataItem.PRMasterID + ',"' + dataItem.PRID + '"' + ')><strong>' + dataItem.PRID + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "CompanyName", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "Buyer", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "FileRef ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProductType", title: "Product", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PrQty", title: "PR Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
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
function GetPRInformation(PRMasterID, PRID) {
    var _dbModel = { 'PRMasterID': PRMasterID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionDetails/LoadBulletinDetails",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            $("#txtPRID").val(PRID);
            //$("#txtFileRefNo").val(Style);

            if (data.SAMInformation[0].IncrementType == "") {
                //$("#txtExFactoryDate").val(TargetDate);

                $("#txtFileRefNo").val(data.SAMInformation[0].StyleID);
                $("#txtTotalWorkingMinutes").val(data.SAMInformation[0].WorkTime);
                $("#txtOrderQty").val(data.SAMInformation[0].OrderQty);
                $("#txtExtraPercentage").val(data.SAMInformation[0].ExcessQty);
                if (data.SAMInformation[0].ExcessQty === "" || data.SAMInformation[0].ExcessQty === 0) {
                    $("#txtPlanProduction").val(data.SAMInformation[0].OrderQty);
                }
                else {
                    $("#txtOrderQty").trigger("blur");
                }
                $("#txtSAM").val(data.SAMInformation[0].SAM);
                $("#txtSAM").trigger("blur");
                $("#txtNoOfWorkStation").val(data.SAMInformation[0].NoOfWorkStation);
                $("#txtNoOfWorkStation").trigger("blur");
                $("#txtOrgEff").val(data.SAMInformation[0].OrganizationEfficiency);
                $("#txtOrgEff").trigger("blur");
                $("#txtBulletinID").val(data.SAMInformation[0].BulletinID);
                $("#txtPCD").val(data.SAMInformation[0].PCD);
            }
            else {
                $("#txtFileRefNo").val(data.SAMInformation[0].StyleID);
                $("#txtTotalWorkingMinutes").val(data.SAMInformation[0].WorkTime);
                $("#txtOrderQty").val(data.SAMInformation[0].OrderQty);
                $("#txtExtraPercentage").val(data.SAMInformation[0].ExcessQty);

                if (data.SAMInformation[0].ExcessQty === "" || data.SAMInformation[0].ExcessQty === "0") {
                    $("#txtPlanProduction").val(data.SAMInformation[0].OrderQty);
                }
                else {
                    $("#txtPlanProduction").val(data.SAMInformation[0].PlannedProduction);
                }

                $("#txtSAM").val(data.SAMInformation[0].SAM);
                $("#txtNoOfWorkStation").val(data.SAMInformation[0].NoOfWorkStation);
                $("#txtHourlyProduction").val(data.SAMInformation[0].HourlyTarget100PercentEffeincy);
                $("#txtOrgEff").val(data.SAMInformation[0].OrganizationEfficiency);
                $("#txtHourlyProdOrgEff").val(data.SAMInformation[0].HourlyTargetOrgPercentEffeincy);
                $("#txtDailyTargetProductionPerLine").val(data.SAMInformation[0].DailyTargetPerLine);
                $("#txtFirstDayOutput").val(data.SAMInformation[0].FirstDayOutput);
                $("#rbIncrementType").val(data.SAMInformation[0].FirstDayOutput);
                $("#txtIncrementQty").val(data.SAMInformation[0].IncrementQty);
                $("#txtLineDaysRequire").val(data.SAMInformation[0].LineDaysRequire);
                $("#txtMinLineDays").val(data.SAMInformation[0].MinLineDays);
                $("#txtLineAllocated").val(data.SAMInformation[0].LineAllocated);
                $("#txtFinishDays").val(data.SAMInformation[0].FinishDays);
                $("#txtExFactoryDate").val(data.SAMInformation[0].ExFactoryDate);
                $("#txtPlanStartDate").val(data.SAMInformation[0].PlanStartDate);
                $("#txtOrderPriority").val(data.SAMInformation[0].PriorityNo);
                $("#txtBulletinID").val(data.SAMInformation[0].BulletinID);
                $("#txtPCD").val(data.SAMInformation[0].PCD);
            }
            TotalLineSelected = $("#txtLineAllocated").val();
            BindLineInformation(data.LineInformation);
            $("#spProduceQty").text(data.SAMInformation[0].ProduceQty);
            CalculateTotalQty();
        }
    });
    $("#modalPRInformation").modal("toggle");
}

function BindLineInformation(data) {
    $("#divLineInformation").kendoGrid().empty();
    $("#divLineInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChange,
            schema: {
                model: {
                    Id: "LineNumber",
                    fields: {
                        IsCheck: { editable: false, type: "boolean" },
                        Company: { editable: false },
                        UnitName: { editable: false },
                        LineNumber: { editable: false, type: "number" },
                        WorkStation: { editable: true, type: "number" },
                        AverageEfficiency: { editable: true, type: "number" },
                        TargetQty: { editable: true, type: "number" },
                        PlanStartDate: { editable: true, type: 'date' },
                        PlanEndDate: { editable: false, type: 'date' },
                        FirstDayOutput: { editable: true, type: "number" },
                        IncrementQty: { editable: true, type: "number" },
                        HourlyTarget: { editable: true, type: "number" },
                        DailyLineTarget: { editable: false },
                        PriorityNo: { editable: true, type: "number" }
                    }
                }
            }
        },
        toolbar: "<strong>Total Production Qty : </strong><span id='spProductionQty'></span> <strong style='margin-left: 15%;'>Total Produce Qty : </strong><span id='spProduceQty'></span>  <strong style='margin-left: 38%;'>Remaining Line Plan Qty : </strong><span id='spRemainingProductionQty'></span>",
        columns: [
            {
                title: "<center></center>", width: 30,
                template: function (dataItem) {
                    if (dataItem.IsLineExists !== "0") {
                        if (dataItem.IsCheck === false) {
                            return '<center><input class="chkPO" type="checkbox" id=' + dataItem.LineNumber + ' name=' + dataItem.LineNumber + ' value=' + dataItem.LineNumber + ' ></center>';
                        }
                        else {
                            return '<center><input class="chkPO" checked type="checkbox" id=' + dataItem.LineNumber + ' name=' + dataItem.LineNumber + ' value=' + dataItem.LineNumber + ' ></center>';
                        }
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                field: "Company", title: "Company", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    if (dataItem.IsLineExists !== "0") {
                        return dataItem.Company;
                    }
                    else {
                        return '<span style="color:red">Calendar Not Found..!</span>';
                    }
                }
            },
            { field: "UnitName", title: "Unit Name", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
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
                field: "PlanEndDate", title: "Line End Date", hidden: true,
                template: "#= kendo.toString(kendo.parseDate(PlanEndDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #",
                filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Line End Date</label>'
            },
            {
                field: "FirstDayOutput", title: "First Day O/P", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">First Day O/P</label>'
            },
            {
                field: "IncrementQty", title: "Increment Qty", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Increment Qty</label>'
            },
            {
                field: "HourlyTarget", title: "Hourly Target", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Hourly Target</label>'
            },
            { field: "DailyLineTarget", title: "Daily Target", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "PriorityNo", title: "Priority No", filterable: false, headerAttributes: { style: "white-space: normal;background-color: yellow" }, attributes: { style: "text-align: center" },
                headerTemplate: '<label class="yellowHeader">Priority No</label>'
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
        scrollable: true,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit
    });
    $("#spProductionQty").text($("#txtPlanProduction").val());
    var grid = $("#divLineInformation").data("kendoGrid");
    grid.dataSource.sort({ field: "TargetQty", dir: "desc" });

    $.each(grid._data, function (i, item) {
        var IsCheck = item.IsCheck;
        if (IsCheck === true)
            array[item.LineNumber] = true;
    });
}
function detailInit(e) {
    var detailRow = e.detailRow;
    detailRow.find(".orders").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: baseURL + '/ProductionDetails/GetLineInformationDetails',
                    data: { LineNumber: e.data.LineNumber },
                    dataType: "json"
                }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            filter: { field: "LineNumber", operator: "eq", value: e.data.LineNumber }
        },
        scrollable: false,
        sortable: true,
        pageable: false,
        toolbar: "<div class='divGridInfo'>Line Information</div>",
        columns: [
            { field: "PRMasterID", title: "PRMasterID", filterable: false, hidden: true },
            { field: "LineNumber", title: "LineNumber", filterable: false, hidden: true },
            { field: "PRID", title: "PR ID", filterable: true, width: 30, },
            { field: "FileRefID", title: "File Ref", filterable: true },
            { field: "StyleID", title: "Style", filterable: true },
            { field: "Buyer", title: "Buyer", filterable: true },
            { field: "ProductType", title: "Product", filterable: true },
            { field: "SAM", title: "SAM", filterable: true },
            { field: "StartDate", title: "Line Start", filterable: true },
            { field: "EndDate", title: "Line End", filterable: true },
            { field: "TotalPlanQty", title: "Total Plan Qty", filterable: true },
            { field: "PriorityNo", title: "Priority No", filterable: true },
            { field: "Status", title: "Status", filterable: true },
        ],

    });
}
function onChange(e) {
    if (e.action == "itemchange" && (e.field == "TargetQty" || e.field == "WorkStation" || e.field == "AverageEfficiency")) {
        CalculateTotalQty();
    }
    if (e.action == "itemchange" && e.field == "HourlyTarget") {
        var SAM = $("#txtSAM").val();
        var TotalWorkingMinutes = $("#txtTotalWorkingMinutes").val();
        var grid = $("#divLineInformation").data("kendoGrid");
        $.each(grid.dataSource._data, function (i, item) {
            if (item.TargetQty != "" && item.TargetQty != "0" && e.items[0].LineNumber == item.LineNumber) {
                var HourlyProduction = Math.ceil((parseInt(item.WorkStation) * 60) / parseFloat(SAM));
                var TotalHour = parseInt(TotalWorkingMinutes) / 60;
                var HourlyTarget = item.HourlyTarget;
                item.DailyLineTarget = parseInt(HourlyTarget) * parseInt(TotalHour);
                item.AverageEfficiency = ((HourlyTarget * 100) / HourlyProduction).toFixed(2);
            }
        });
        grid.refresh();
    }


}
function CalculateTotalQty() {
    var SAM = $("#txtSAM").val();
    var TotalWorkingMinutes = $("#txtTotalWorkingMinutes").val();
    var grid = $("#divLineInformation").data("kendoGrid");
    var _TotalOrderQty = 0;
    $.each(grid.dataSource._data, function (i, item) {
        if (item.TargetQty != "" && item.TargetQty != "0") {
            var OrgEff = item.AverageEfficiency;
            _TotalOrderQty += item.TargetQty == "" ? 0 : parseInt(item.TargetQty);
            var HourlyProduction = Math.ceil((parseInt(item.WorkStation) * 60) / parseFloat(SAM));
            var TotalHour = parseInt(TotalWorkingMinutes) / 60;
            var HourlyTarget = Math.ceil(HourlyProduction * (OrgEff / 100));
            item.HourlyTarget = HourlyTarget;
            item.DailyLineTarget = parseInt(HourlyTarget) * parseInt(TotalHour);
        }
    });
    grid.refresh();
    grid.dataSource.sort({ field: "TargetQty", dir: "desc" });
    $("#spRemainingProductionQty").text(parseInt($("#txtPlanProduction").val()) - _TotalOrderQty);
}
function SavePRInformation() {
    var _isError = 0;
    var _message = "";
    var PRID = $("#txtPRID").val();
    var TotalWorkingMinutes = $("#txtTotalWorkingMinutes").val();
    var OrderQty = $("#txtOrderQty").val();
    var ExtraPercentage = $("#txtExtraPercentage").val();
    var PlanProduction = $("#txtPlanProduction").val();
    var SAM = $("#txtSAM").val();
    var NoOfWorkStation = $("#txtNoOfWorkStation").val();
    var HourlyProduction100Percenteff = $("#txtHourlyProduction").val();
    var OrgEff = $("#txtOrgEff").val();
    var HourlyProdOrgEff = $("#txtHourlyProdOrgEff").val();
    var DailyTargetProductionPerLine = $("#txtDailyTargetProductionPerLine").val();
    var FirstDayOutput = $("#txtFirstDayOutput").val();
    var IncrementType = $("input[name='rbIncrementType']:checked").val();
    var IncrementQty = $("#txtIncrementQty").val();
    var LineDaysRequire = "0";// $("#txtLineDaysRequire").val();
    var MinLineDays = "0";//$("#txtMinLineDays").val();
    var LineAllocated = $("#txtLineAllocated").val();
    var FinishDays = "4";//$("#txtFinishDays").val();
    var ExFactoryDate = "1/1/1900";// $("#txtExFactoryDate").val();
    var PlanStartDate = $("#txtPlanStartDate").val();
    var OrderPriority = "0";//$("#txtOrderPriority").val();
    var BulletinID = $("#txtBulletinID").val();
    var PCD = $("#txtPCD").val();

    if (PRID == "") {
        _message += "No PRID Founds..!\n";
        _isError = 1;
    }

    if (TotalWorkingMinutes == "") {
        _message += "Enter Total Working Minutes..!\n";
        _isError = 1;
    }

    if (OrderQty == "") {
        _message += "Enter Order Qty..!\n";
        _isError = 1;
    }

    if (ExtraPercentage == "") {
        _message += "Enter Extra Percentage Qty..!\n";
        _isError = 1;
    }

    if (PlanProduction == "") {
        _message += "Enter Plan Production Qty..!\n";
        _isError = 1;
    }

    if (SAM == "") {
        _message += "Enter SAM..!\n";
        _isError = 1;
    }

    if (NoOfWorkStation == "") {
        _message += "Enter Total Work Station..!\n";
        _isError = 1;
    }

    if (OrgEff == "") {
        _message += "Enter Org Eff..!\n";
        _isError = 1;
    }

    if (FirstDayOutput == "") {
        _message += "Enter First Day Output..!\n";
        _isError = 1;
    }

    if (IncrementQty == "") {
        _message += "Enter Increment Qty..!\n";
        _isError = 1;
    }

    if (MinLineDays == "") {
        _message += "Enter Min Line Days..!\n";
        _isError = 1;
    }
    if (LineAllocated == "") {
        _message += "Enter Line Allocated..!\n";
        _isError = 1;
    }
    if (FinishDays == "") {
        _message += "Enter Finish Days..!\n";
        _isError = 1;
    }
    if (PlanStartDate == "") {
        _message += "Enter Plan Start Date..!\n";
        _isError = 1;
    }

    if (OrderPriority == "") {
        _message += "Enter Order Priority No..!\n";
        _isError = 1;
    }

    if (PCD == "") {
        _message += "PCD Date can not be empty..!\n";
        _isError = 1;
    }

    if (_isError === 1) {
        alert(_message);
        return false;
    }

    //var _PlanStartDate = formatDate(PlanStartDate).replace("-", "");
    //var _PCDDate = formatDate(PCD);

    //if (_PCDDate < _PlanStartDate.replace("-","")) {
    //    alert('Plan Start Date Should Be Greater Then PCD DATE..!');
    //    return false;
    //}

    var arrLineNumber = [];
    var grid = $("#divLineInformation").data("kendoGrid");
    grid.refresh();

    var _totalOrderQty = 0;
    var _isDataSourceError = 0;
    $.each(grid.dataSource._data, function (i, item) {
        if (item.TargetQty !== null && item.TargetQty.toString() !== "" && item.TargetQty.toString() !== "0") {
            if (item.PriorityNo !== null && item.PriorityNo !== "") {
                _totalOrderQty += parseInt(item.TargetQty);
                arrLineNumber.push({
                    LineNumber: item.LineNumber,
                    WorkStation: item.WorkStation,
                    AverageEfficiency: item.AverageEfficiency,
                    TargetQty: item.TargetQty,
                    HourlyTarget: item.HourlyTarget,
                    DailyLineTarget: item.DailyLineTarget,
                    PlanStartDate: item.PlanStartDate,
                    PlanEndDate: item.PlanEndDate,
                    FirstDayOutput: item.FirstDayOutput,
                    IncrementQty: item.IncrementQty,
                    PriorityNo: item.PriorityNo
                });
            }
            else {
                _isDataSourceError = 1;
                alert("Insert Priority No in Line Number " + item.LineNumber);
                return false;
            }
        }
    });
    if (_isDataSourceError === 1) {
        alert('Please Set Priority No for Selected Lines..!');
        return false;
    }
    if (arrLineNumber.length == 0) {
        alert('Please Assign Quantity In To Line..!');
        return false;
    }
    var _LineProduceQty = parseInt($("#spProduceQty").text() == "" ? "0" : $("#spProduceQty").text());

    if (parseInt($("#txtPlanProduction").val()) !== (_totalOrderQty + _LineProduceQty)) {
        alert('Production Plan Qty and Line Plan Qty Must be Same');
        return false;
    }


    var _dbModel = {
        'PRID': PRID, 'TotalWorkMinutes': TotalWorkingMinutes, 'SelectedQty': OrderQty, 'ExcessQty': ExtraPercentage,
        'PlannedProduction': PlanProduction, 'SAM': SAM, 'TotalWorkStation': NoOfWorkStation,
        'HourlyTarget100PercentEffeincy': HourlyProduction100Percenteff, 'OrgEfficiency': OrgEff,
        'HourlyTargetOrgPercentEffeincy': HourlyProdOrgEff, 'FirstDayOutput': FirstDayOutput, 'DailyTargetPerLine': DailyTargetProductionPerLine,
        'IncrementType': IncrementType, 'IncrementQty': IncrementQty, 'LineDaysRequire': LineDaysRequire,
        'MinLineDays': MinLineDays, 'LineAllocated': LineAllocated, 'FinishDays': FinishDays, 'ExFactoryDate': ExFactoryDate,
        'PlanStartDate': PlanStartDate, 'PriorityNo': OrderPriority, 'BulletinID': BulletinID, 'arrLineInformationDBModel': arrLineNumber
    };

    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionDetails/SavePRInformation",
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

function formatDate(date) {
    var d = new Date(date);
    var day = d.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var month = d.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var year = d.getFullYear();
    return day + "/" + month + "/" + year;
}

function HourlyProductionHundreadPercentEfficiency() {
    //(Total Work Station * 60)/SAM
    var NoOfWorkStation = $("#txtNoOfWorkStation").val();
    var SAM = $("#txtSAM").val();

    if (NoOfWorkStation !== "" && SAM !== "")
        $("#txtHourlyProduction").val(Math.ceil((parseInt(NoOfWorkStation) * 60) / parseFloat(SAM)));
}
function HourlyProductionOrganizationEfficiency() {
    //HourlyPDNLineWiseAt100 * (OrgEfficiency / 100)
    var PlanProduction = $("#txtPlanProduction").val();
    var TotalWorkingMinutes = $("#txtTotalWorkingMinutes").val();
    var HourlyProduction = $("#txtHourlyProduction").val();
    var OrgEff = $("#txtOrgEff").val();
    $("#txtHourlyProdOrgEff").val(Math.ceil(HourlyProduction * (OrgEff / 100)));
    var TotalHour = parseInt(TotalWorkingMinutes) / 60;
    $("#txtDailyTargetProductionPerLine").val(parseInt($("#txtHourlyProdOrgEff").val()) * parseInt(TotalHour));
    $("#txtLineDaysRequire").val(Math.ceil(parseInt(PlanProduction) / parseInt($("#txtDailyTargetProductionPerLine").val())));
}
function LoadAllAdditionalPRData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/AdditionalPR/LoadAllData",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            PopulateAdditionalGridData(data);
        }
    });

}
function PopulateAdditionalGridData(data) {
    $("#divPRInformation").kendoGrid().empty();
    $("#divPRInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            {
                field: "APRID", title: "PRID", filterable: true,
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPRInformation(' + dataItem.APRMasterID + ',' + "'" + dataItem.APRID.split(' ').join('\xa0') + "'" + ',' + "'" + dataItem.PCD.split(' ').join('\xa0') + "'" + ',' + "'" + dataItem.FileRefNo.split(' ').join('\xa0') + "'" + ')><strong>' + dataItem.APRID + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "APRID", title: "APRID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "CompanyName", title: "CompanyName", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "BuyerName", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "FileRefID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefNo", title: "FileRefNo", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PCD", title: "PCD", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SAM", title: "SAM", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "CM", title: "CM", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FOB", title: "FOB", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Qty", title: "Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },

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
function GetAPRInformation(APRID, Style) {
    var _dbModel = { 'APRID': APRID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionDetails/LoadBulletinDetails",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            $("#txtPRID").val(APRID);
            $("#txtFileRefNo").val(Style);

            if (data.SAMInformation[0].IncrementType == "") {
                $("#txtExFactoryDate").val(TargetDate);

                $("#txtTotalWorkingMinutes").val(data.SAMInformation[0].WorkTime);
                $("#txtOrderQty").val(data.SAMInformation[0].OrderQty);
                $("#txtExtraPercentage").val(data.SAMInformation[0].ExcessQty);
                $("#txtOrderQty").trigger("blur");
                $("#txtSAM").val(data.SAMInformation[0].SAM);
                $("#txtSAM").trigger("blur");
                $("#txtNoOfWorkStation").val(data.SAMInformation[0].NoOfWorkStation);
                $("#txtNoOfWorkStation").trigger("blur");
                $("#txtOrgEff").val(data.SAMInformation[0].OrganizationEfficiency);
                $("#txtOrgEff").trigger("blur");
                $("#txtBulletinID").val(data.SAMInformation[0].BulletinID);
            }
            else {
                //$("#txtFileRefNo").val(data.SAMInformation[0].StyleID);
                $("#txtTotalWorkingMinutes").val(data.SAMInformation[0].WorkTime);
                $("#txtOrderQty").val(data.SAMInformation[0].OrderQty);
                $("#txtExtraPercentage").val(data.SAMInformation[0].ExcessQty);
                $("#txtPlanProduction").val(data.SAMInformation[0].PlannedProduction);
                $("#txtSAM").val(data.SAMInformation[0].SAM);
                $("#txtNoOfWorkStation").val(data.SAMInformation[0].NoOfWorkStation);
                $("#txtHourlyProduction").val(data.SAMInformation[0].HourlyTarget100PercentEffeincy);
                $("#txtOrgEff").val(data.SAMInformation[0].OrganizationEfficiency);
                $("#txtHourlyProdOrgEff").val(data.SAMInformation[0].HourlyTargetOrgPercentEffeincy);
                $("#txtDailyTargetProductionPerLine").val(data.SAMInformation[0].DailyTargetPerLine);
                $("#txtFirstDayOutput").val(data.SAMInformation[0].FirstDayOutput);
                $("#rbIncrementType").val(data.SAMInformation[0].FirstDayOutput);
                $("#txtIncrementQty").val(data.SAMInformation[0].IncrementQty);
                $("#txtLineDaysRequire").val(data.SAMInformation[0].LineDaysRequire);
                $("#txtMinLineDays").val(data.SAMInformation[0].MinLineDays);
                $("#txtLineAllocated").val(data.SAMInformation[0].LineAllocated);
                $("#txtFinishDays").val(data.SAMInformation[0].FinishDays);
                $("#txtExFactoryDate").val(data.SAMInformation[0].ExFactoryDate);
                $("#txtPlanStartDate").val(data.SAMInformation[0].PlanStartDate);
                $("#txtOrderPriority").val(data.SAMInformation[0].PriorityNo);
                $("#txtBulletinID").val(data.SAMInformation[0].BulletinID);
            }
            BindLineInformation(data.LineInformation);
            CalculateTotalQty();
        }
    });
    $("#modalPRInformation").modal("toggle");
}
function LoadPreviewData() {
    var PlanProduction = $("#txtPlanProduction").val();
    var PlanStartDate = $("#txtPlanStartDate").val();
    var FirstDayOutput = $("#txtFirstDayOutput").val();
    var IncrementQty = $("#txtIncrementQty").val();
    var DailyTargetPerLine = $("#txtDailyTargetProductionPerLine").val();
    var TotalWorkMinutes = $("#txtTotalWorkingMinutes").val();
    var _HourlyTarget = $("#txtHourlyProdOrgEff").val();
    var _PRID = $("#txtPRID").val();
    var LineNumbers = $('.chkPO:checked').serialize();
    var _SAM = $("#txtSAM").val();
    var LineNumbers = $('.chkPO:checked').serialize();

    var _dbModel = {
        'PlannedProduction': PlanProduction, 'PlanStartDate': PlanStartDate, 'FirstDayOutput': FirstDayOutput,
        'IncrementQty': IncrementQty, 'DailyTargetPerLine': DailyTargetPerLine, 'TotalWorkMinutes': TotalWorkMinutes,
        'LineNumbers': LineNumbers, 'PRID': _PRID, 'SAM': _SAM
    };

    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionDetails/LoadPreviewData",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            TotalLineSelected = 0;
            var grid = $('#divLineInformation').data().kendoGrid;
            $.each(data, function (i, item) {
                var _LineNumber = item.LineNumber;
                var IsCheck = item.IsCheck;

                $.each(grid._data, function (j, items) {
                    var _grdLineNumber = items.LineNumber;
                    if (_grdLineNumber === parseInt(_LineNumber)) {
                        items.TargetQty = item.TotalPlanQty;
                        items.PlanStartDate = item.PlanStartDate;
                        items.PlanEndDate = item.PlanEndDate;
                        items.HourlyTarget = item.HourlyProductionOrgEff;
                        items.DailyLineTarget = item.DailyProductionOrgEff;
                        items.WorkStation = item.WorkStation;
                        items.AverageEfficiency = item.AverageEfficiency;
                        items.FirstDayOutput = $("#txtFirstDayOutput").val();
                        items.IncrementQty = $("#txtIncrementQty").val();

                        item.IsCheck = IsCheck;
                        TotalLineSelected++;

                        grid.dataSource.sync();
                        grid.saveChanges();
                    }
                });
            });

            grid.dataSource.sort({ field: "TargetQty", dir: "desc" });
        }
    });

}