$(function () {
    LoadddlFileRef();
    $(document).delegate('#btnNew', 'click', function (e) {
        e.preventDefault();
        SetDefaultInformation();
    });
    $(document).delegate('#btnSave', 'click', function (e) {
        e.preventDefault();
        SavePRInformation();
    });
    $(document).delegate('#ddlFileRef', 'change', function (e) {
        e.preventDefault();
        //alert($(this).val().join(","));
        LoadSelectedFileRefInformation($(this).val().join(","));
    });
    $(document).delegate('#txtExcessQty', 'keyup', function (e) {
        e.preventDefault();
        var SelectedQty = $("#spSelectedQty").text();
        if (SelectedQty != "") {
            if ($(this).val() != "") {
                var PercentQty = Math.ceil((SelectedQty * $(this).val()) / 100);
                alert(parseInt(SelectedQty) + PercentQty);
            }
        }
    });
    $(document).delegate('.CMI', 'blur', function (e) {
        e.preventDefault();
        CalculateMasterInformation();
    });
    $(document).delegate('#CheckAllEO', 'change', function (e) {
        e.preventDefault();
        if (this.checked) {
            $(".chkEO").prop("checked", true);

            var grid = $("#divEOInformation").data("kendoGrid");
            var _SeqNo = 1;
            $.each(grid.dataSource._data, function (i, item) {
                $("#txtSl" + item.RowID + "").val(_SeqNo);
                _SeqNo = _SeqNo + 1;
            });
        }
        else {
            $(".chkEO").prop("checked", false);
            $(".txtEOSeqNo").val("");
        }
    });
    $(document).delegate('.checkEO', 'click', function (e) {

        var $cb = $(this);
        var checked = $cb.is(':checked');
        setValueToGridData(checked);
    });
});
function setValueToGridData(val) {
    e = window.event;
    var checked = $(e.target).context.checked;
    var grid = $(e.target).closest('.k-grid').data("kendoGrid");
    grid.dataSource.data().forEach(function (d) {
        d.set('IsCheck', val);
    });
}
function LoadddlFileRef() {
    $.ajax({
        type: "GET",
        url: baseURL + "/Planning/LoadFileRefInformation",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#txtPriorityNo").val(data[0].PriorityNo);
            $("#ddlFileRef").empty();
            $("#ddlFileRef").append($("<option/>").val("-1").text("Select File Ref"));
            $.each(data, function () {
                $("#ddlFileRef").append($("<option/>").val(this.FileRefID).text(this.FileRefID));
            });
        }
    });

    //$('#ddlFileRef').selectpicker('refresh');
    $('#ddlFileRef').selectpicker('render');
}

function LoadSelectedFileRefInformation(FileRefID) {
    var _dbModel = { 'FileRefID': FileRefID };
    $.ajax({
        type: "POST",
        url: baseURL + "/Planning/LoadSelectedFileRefInformation",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            BindFileRefSummaryList(data.dbModelFileRefSummaryList);
            BindSAMInformation(data.SAMInformation);
            BindLineInformation(data.LineInformation);
            BindEOInformation(data.EOInformation);
            $("#spOrderQty").text(data.EOOrderQty[0].OrderQty);
        }
    });
}

function BindFileRefSummaryList(data) {
    $("#divFileRef").kendoGrid().empty();
    $("#divFileRef").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "FileRefID", title: "File Ref ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleID", title: "Style ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProductTypes", title: "Product Types", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "Buyer Name", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerDepartment", title: "Buyer Department", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FirstPCDDate", title: "First PCD Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LastPCDDate", title: "Last PCD Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FirstShipDate", title: "First Ship Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LastShipDate", title: "Last Ship Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetDate", title: "Target Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BulletinID", title: "Bulletin ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SAM", title: "SAM", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } }
        ],
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
function BindLineInformation(data) {
    $("#divLineInformation").kendoGrid().empty();
    $("#divLineInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    Id: "LineNumber",
                    fields: {
                        Company: { editable: false },
                        UnitName: { editable: false },
                        LineNumber: { editable: false },
                        WorkStation: { editable: false },
                        AverageEfficiency: { editable: false },
                        IncrementQty: { editable: false },
                        HourlyTarget: { editable: false },
                        DailyTargetPerLine: { editable: false },
                        TotalDaysRequired: { editable: false },
                        TargetQty: { type: "number", validation: { required: true, min: 1 } },
                    }
                }
            }
        },
        columns: [
            { field: "Company", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UnitName", title: "Unit Name", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "WorkStation", title: "Work Station", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "AverageEfficiency", title: "Average Efficiency", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "Target Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IncrementQty", title: "Increment Qty", filterable: true, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "HourlyTarget", title: "HourlyTarget", filterable: true, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "DailyTargetPerLine", title: "DailyTargetPerLine", filterable: true, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TotalDaysRequired", title: "TotalDaysRequired", filterable: true, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
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
                        IsCheck: { editable: false },
                        SeqNo: { type: "number", validation: { required: true, min: 1 } },
                        FileRefID: { editable: false },
                        ExportOrderID: { editable: false },
                        SizeGroup: { editable: false },
                        UOM: { editable: false },
                        Destination: { editable: false },
                        UnitName: { editable: false },
                        ShipMode: { editable: false },
                        ExportPONo: { editable: false },
                        PCD: { editable: false },
                        TargetDate: { editable: false },
                        ExfactoryDate: { editable: false },
                        ShipDate: { editable: false },
                        OrderQty: { editable: false },
                        PRQty: { editable: false },
                        RemainingQty: { editable: false },
                        SelectedQty: { type: "number", validation: { required: true, min: 1 } },
                    }
                }
            }
        },
        columns: [
            { field: "RowID", title: "RowID", hidden: true, filterable: false },
            {
                field: "IsCheck", title: "IsCheck", filterable: false,
                headerTemplate: '<input type="checkbox" onclick="toggleAll(\'IsCheck\')" />',
                template: '<input class=\"checkEO\" #=IsCheck==1? \'checked\' : \'\' # type=checkbox />',
                width: 50,
                sortable: false
            },
            {
                field: "SeqNo", title: "Seq No", filterable: false,
                headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" },
            },
            { field: "FileRefID", title: "FileRef ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderID", title: "EO ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SizeGroup", title: "Size Group", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UOM", title: "UOM", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Destination", title: "Destination", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UnitName", title: "Unit", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ShipMode", title: "Ship Mode", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportPONo", title: "Export PONo", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PCD", title: "PCD", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetDate", title: "Target Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExfactoryDate", title: "Ex Factory Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ShipDate", title: "Ship Date", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRQty", title: "PRQty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "RemainingQty", title: "Remaining Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SelectedQty", title: "Selected Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } }
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
function onChange(e) {
    if (e.action == "itemchange" && e.field == "IsCheck") {
        alert(1);
        CalculatePlannedQty();
    }
    else if (e.action == "itemchange" && e.field == "SelectedQty") {
        CalculatePlannedQty();
    }
}
function CalculatePlannedQty() {
    var grid = $("#divEOInformation").data("kendoGrid");
    var _totalQty = 0;
    $.each(grid.dataSource._data, function (i, item) {
        if (item.IsCheck == true) {
            _totalQty += item.SelectedQty;
        }
    });
    $("#spSelectedQty").text(_totalQty);
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
function BindSAMInformation(data) {
    if (data[0].SAM != "") {
        $("#txtVASSAM").val(data[0].SAM);
        $("#txtVASSAM").prop("disabled", false);
    }
    else {
        $("#txtVASSAM").val("");
        $("#txtVASSAM").prop("disabled", true);
    }

    $("#txtWorkStation").val(data[0].WorkStation);
    $("#txtWorkTime").val(data[0].WorkTime);
}

function CalculateMasterInformation() {
    var TotalLineRequired = 0;
    var VASSAM = $("#txtVASSAM").val();
    var UserSAM = $("#txtUserSAM").val();
    var WorkTime = $("#txtWorkTime").val();
    var OrderQty = $("#spSelectedQty").text();
    var ExtraPercentage = $("#txtExcessQty").val();
    var MinimumLineDays = $("#txtMinimumLineDays").val();
    var OrganizationEfficiency = $("#txtOrgEfficiency").val();
    var TotalWorkStation = $("#txtWorkStation").val();

    if (OrderQty == "") {
        alert('No Order Qty Found..!');
        return false;
    }

    var SAM = 0;
    if (VASSAM == "")
        SAM = UserSAM;
    else
        SAM = VASSAM;

    var PlannedProduction = Math.ceil(OrderQty + (OrderQty * ExtraPercentage / 100));
    var HourlyTargetPercent = Math.ceil((TotalWorkStation * 60) / SAM);
    var HourlyTarget = Math.ceil((TotalWorkStation * OrganizationEfficiency) / 100);
    var DailyLineTarget = Math.ceil((HourlyTarget) * (WorkTime / 60));
    var RequireLineDays = Math.ceil(PlannedProduction / DailyLineTarget);

    if (MinimumLineDays != "" && parseInt(MinimumLineDays) > 0) {
        TotalLineRequired = Math.ceil(RequireLineDays / MinimumLineDays);
    }

    $("#spSelectedQty").text(PlannedProduction);
    $("#txtHourlyTargetPercent").val(HourlyTargetPercent);
    $("#txtDailyTargetPerLine").val(DailyLineTarget);
    $("#txtRequireLineDays").val(RequireLineDays);
    $("#txtNoOfLineReq").val(TotalLineRequired);
}
function SetDefaultInformation() {
    $("#txtPRID").val("<NEW>");
    $("#ddlFileRef").val("-1");
    $("#txtVASSAM").val("");
    $("#txtUserSAM").val("60");
    $("#txtWorkStation").val("70");
    $("#txtWorkTime").val("600");
    $("#txtOrgEfficiency").val("80");
    $("#txtHourlyTarget").val("56");
    $("#txtDailyTargetPerLine").val("560");
}

function SavePRInformation() {
    var PRID = $("#txtPRID").val();
    var VASSAM = $("#ddlVASSAM").val();
    var UserSAM = $("#txtUserSAM").val();
    var WorkStation = $("#txtWorkStation").val();
    var WorkTime = $("#txtWorkTime").val();
    var OrgEfficiency = $("#txtOrgEfficiency").val();
    var HourlyTarget = $("#txtHourlyTarget").val();
    var MinimumLineDays = $("#txtMinimumLineDays").val();
    var AllocatedLine = $("#txtAllocatedLine").val();
    var PlanStartDate = $("#txtPlanStartDate").val();
    var PlanEndDate = $("#txtPlanEndDate").val();
    var FinishDays = $("#txtFinishDays").val();
    var ExcessQty = $("#txtExcessQty").val();
    var HourlyTargetPercent = $("#txtHourlyTargetPercent").val();
    var DailyTargetPerLine = $("#txtDailyTargetPerLine").val();
    var RequireLineDays = $("#txtRequireLineDays").val();
    var NoOfLineReq = $("#txtNoOfLineReq").val();
    var PriorityNo = $("#txtPriorityNo").val();
}