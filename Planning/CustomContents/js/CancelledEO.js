$(function () {
    LoadCancelledEO();
    LoadEOQtyStatus();
    $(document).delegate('#btnSaveCancelEO', 'click', function (e) {
        e.preventDefault();
        UpdateCancelEOQty();
    });

    $(document).delegate('#btnUpdateOrderQuantity', 'click', function (e) {
        e.preventDefault();
        var arrEOInformation = [];
        var _isError = 0;
        var PRID = $("#txtPRID").val();
        var SelectedQty = $("#txtPRNewEOQty").val();
        var PlannedProduction = $("#txtPRNewPlannedQty").val();

        var EOList = $("#divPREOStatus tbody input:checkbox:checked").map(function () {
            return this.value;
        }).toArray();
        if (EOList.toString() == "") {
            alert('No Selected EO Found..!');
            return false;
        }
        else {
            var grid = $("#divPREOStatus").data("kendoGrid");
            grid.refresh();
            $.each(grid.dataSource._data, function (i, item) {
                if (EOList.includes(item.ExportOrderID.toString())) {
                    if (item.RemainingQty !== "" && item.RemainingQty !== "0") {
                        arrEOInformation.push({
                            ExportOrderID: item.ExportOrderID,
                            SelectedQty: item.RemainingQty
                        });
                    }
                }
            });
        }

        if (arrEOInformation.length === 0) {
            alert("Please Check Export Order Information..!");
            return false;
        }

        if (SelectedQty.toString() === "") {
            $("#txtPRNewEOQty").addClass('customError');
            _isError = 1;
        }
        else {
            $("#txtPRNewEOQty").removeClass('customError');
        }

        if (PlannedProduction.toString() === "") {
            $("#txtPRNewPlannedQty").addClass('customError');
            _isError = 1;
        }
        else {
            $("#txtPRNewPlannedQty").removeClass('customError');
        }

        if (_isError === 1) {
            return false;
        }
        UpdateEOQuantity(PRID, SelectedQty, PlannedProduction, arrEOInformation);
    });

    $(document).delegate('.chkLine', 'click', function (e) {
        var grid = $('#divPREOStatus').data().kendoGrid;
        var id = grid.dataItem($(this).closest('tr')).ExportOrderID;

        if ($(this).is(':checked')) {
            $.each(grid._data, function (j, items) {
                var _grdExportOrderID = items.ExportOrderID;
                if (_grdExportOrderID === id) {
                    items.ISEOCheck = true;
                    grid.dataSource.sync();
                    grid.saveChanges();
                }
            });
        }
        else {
            $.each(grid._data, function (j, items) {
                var _grdExportOrderID = items.ExportOrderID;
                if (_grdExportOrderID === id) {
                    items.ISEOCheck = false;
                    grid.dataSource.sync();
                    grid.saveChanges();
                }
            });
        }
        CalculateQty();
    });
});

function UpdateEOQuantity(PRID, SelectedQty, PlannedProduction, arrEOInformation) {
    $("#modalExportOrderUpdate").modal("toggle");

    var _dbModel = {
        'PRID': PRID, 'SelectedQty': SelectedQty, 'PlannedProduction': PlannedProduction, 'arrEOInformationDBModel': arrEOInformation
    };

    $.ajax({
        type: "POST",
        url: baseURL + "/Utility/UpdateEOQuantity",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            if (data.success === true) {
                LoadEOQtyStatus();
                swal('Good job!', 'Data Updated Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function UpdateCancelEOQty() {
    var _EOCancelQty = [];
    var _table = $("#divCancelledEO").data("kendoGrid").dataSource.data();
    var _totalQty = 0;
    var EOQty = parseInt($("#spPRQty").text());
    $.each(_table, function (key, value) {
        var LineNumber = value.LineNumber;
        if ($("#txt" + LineNumber).val() !== "") {
            _totalQty += parseInt($("#txt" + LineNumber).val());

            _EOCancelQty.push({
                PRID: $("#spPRID").text(),
                EOID: $("#spEO").text(),
                PRQty: $("#spPRQty").text(),
                LineNumber: LineNumber,
                PRMasterID: value.PRMasterID,
                ReduceQty: $("#txt" + LineNumber).val()
            });
        }
    });

    if (EOQty !== _totalQty) {
        alert('Your PRQty is ' + EOQty + ' and Reduce Qty is ' + _totalQty + ' .\n PRQty and Reduce Qty should be same..!');
        return false;
    }

    var data = {
        "EOCancelQty": _EOCancelQty
    };

    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionReference/UpdateCancelledEOLineNo",
        data: JSON.stringify(data),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            //BindCancelledEO(data, PRID, ExportOrderID, PRQty);
        }
    });
}

function LoadCancelledEO() {
    $.ajax({
        type: "GET",
        url: baseURL + "/ProductionReference/LoadCancelledEO",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            BindGridData(data);
        }
    });
}

function BindGridData(data) {
    $("#divEOInformation").kendoGrid().empty();
    $("#divEOInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            group: [
                { field: "PRID" },
            ],
        },
        toolbar: "<div style='padding:5px;'><a role='button' href='javascript:void(0)'><span class=''></span>Cancelled Export Order</a></div>",
        columns: [
            //{ field: "PRID", title: "PRID", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            //{ field: "FileRefID", title: "File Ref ID", width: "65px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "FileRefID", title: "File Ref ID", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" },
                attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPREOStatus("' + dataItem.PRID + '",' + dataItem.PRMasterID + ')><strong>' + dataItem.FileRefID + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "FileRefNo", title: "File Ref No", width: "120px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "CompanyName", title: "Company", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderID", title: "EO ID", width: "80px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRQty", title: "PR Qty", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Status", title: "Status", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },

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

function UpdateCancelledEO(PRID, ExportOrderID, PRQty) {
    var _dbModel = { 'PRID': PRID };
    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionReference/LoadCancelledEOLineNo",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            BindCancelledEO(data, PRID, ExportOrderID, PRQty);
        }
    });
}

function BindCancelledEO(data, PRID, ExportOrderID, PRQty) {
    $("#spPRID").text(PRID);
    $("#spEO").text(ExportOrderID);
    $("#spPRQty").text(PRQty);

    $("#divCancelledEO").kendoGrid().empty();
    $("#divCancelledEO").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "LineNumber", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "TargetQty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<input type="text" class="form-control" id="txt#=LineNumber#" style="height: 20px;width: 100px;">',
                field: "PRMasterID",
                title: "Reduce Quantity",
                width: 150,
                headerAttributes: { style: "text-align: center" },
                attributes: { class: "text-center" },
                filterable: false
            },
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
        height: 400,
        pageable: false,
        scrollable: true
    });

    $("#modalCancelledEO").modal("toggle");
}

function LoadEOQtyStatus() {
    $.ajax({
        type: "GET",
        url: baseURL + "/ProductionReference/LoadEOQtyStatus",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            BindEOStatusGridData(data);
        }
    });
}

function BindEOStatusGridData(data) {
    $("#divEOOrderStatus").kendoGrid().empty();
    $("#divEOOrderStatus").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            group: [
                {
                    field: "PRID"
                },
            ],
        },
        toolbar: "<div style='padding:5px;'><a role='button' href='javascript:void(0)'><span class=''></span>Export Order Quantity (Increase / Decrease)</a></div>",
        columns: [
            //{ field: "PRID", title: "PRID", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                field: "FileRefID", title: "File Ref ID", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" },
                attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var dt = '<center><a href="javascript:void(0)" onclick=GetPREOStatus("' + dataItem.PRID + '",' + dataItem.PRMasterID + ')><strong>' + dataItem.FileRefID + '</strong></a></center>';
                    return dt;
                }
            },
            { field: "FileRefNo", title: "File Ref No", width: "120px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "CompanyName", title: "Company", width: "70px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderID", title: "EO ID", width: "85px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRQty", title: "PR Qty", filterable: false, width: "60px", headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BalanceQty", title: "Balance Qty", width: "60px", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        sortable: true,
        filterable: false,
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });
}

function GetPREOStatus(PRID, PRMasterID) {
    var _dbModel = { 'PRMasterID': PRMasterID };
    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionReference/GetPREOStatus",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            var _EOQuantity = parseInt(data[0].SelectedQty) / parseInt(data[0].QuantityFactor);
            $("#txtPRID").val(PRID);
            $("#txtEOQty").val(_EOQuantity);
            $("#txtQuantityFactor").val(data[0].QuantityFactor);
            $("#txtPREOQty").val(data[0].SelectedQty);
            $("#txtPRExcessQty").val(data[0].ExcessQty);
            $("#txtPRPlannedQty").val(data[0].PlannedProduction);
            $("#txtPRNewPlannedQty").val("0");
            BindPREOStatusQty(data);
        }
    });
}

function BindPREOStatusQty(data) {
    $("#divPREOStatus").kendoGrid().empty();
    $("#divPREOStatus").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChangeLine,
            schema: {
                model: {
                    Id: "ExportOrderID",
                    fields: {
                        ISEOCheck: { editable: false, type: "boolean" },
                        PRID: { editable: false },
                        ExportOrderID: { editable: false },
                        ParentExportOrderID: { editable: false },
                        ExportOrderStatus: { editable: false, },
                        TargetQty: { editable: false, type: "number" },
                        PRQty: { editable: false, type: "number" },
                        RemainingQty: { editable: true, type: "number" }
                    }
                }
            },
        },
        toolbar: "<a id='btnUpdateOrderQuantity' role='button' class='k-button k-button-icontext k-grid-delete' href='javascript:void(0)'><span class='k-icon k-i-check'></span>Update Order Quantity</a>",
        columns: [
            {
                title: "<center></center>", width: 30,
                template: function (dataItem) {
                    if (parseInt(dataItem.RemainingQty) > 0 && dataItem.ExportOrderStatus != "CANCELLED") {
                        if (dataItem.ISEOCheck === false) {
                            return '<center><input class="chkLine" type="checkbox" id=' + dataItem.ExportOrderID + ' name=' + dataItem.ExportOrderID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                        }
                        else {
                            return '<center><input class="chkLine" checked type="checkbox" id=' + dataItem.ExportOrderID + ' name=' + dataItem.ExportOrderID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                        }
                    }
                    else {
                        return '';
                    }
                }
            },
            { field: "PRID", title: "PR ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderID", title: "EO ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ParentExportOrderID", title: "Parent EO ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderStatus", title: "EO Status", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "EO Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRQty", title: "PR Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "RemainingQty", title: "Remain Plan Qty", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },

        ],
        sortable: true,
        editable: true,
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
        height: 400,
        pageable: false,
        scrollable: true
    });
    CalculateQty();
    $("#modalExportOrderUpdate").modal("toggle");
    setTimeout(alertFunc, 1000);
}
function alertFunc() {
    var grid = $("#divPREOStatus").data("kendoGrid");
    grid.refresh();
}
function onChangeLine(e) {
    if (e.action == "itemchange" && e.field == "ISEOCheck") {
        CalculateQty();
    }
    else if (e.action == "itemchange" && e.field == "RemainingQty") {
        if (e.items[0].ISEOCheck === true)
            CalculateQty();
        else {
            alert('Select Export Order..!');
            return false;
        }
    }
}
function CalculateQty() {
    var grid = $("#divPREOStatus").data("kendoGrid");
    var _planQty = 0;
    $.each(grid._data, function (i, item) {
        var IsCheck = item.ISEOCheck;
        if (IsCheck === true && item.ExportOrderStatus !== "CANCELLED") {
            _planQty += parseInt(item.RemainingQty);
        }
    });
    var _QuantityFactor = $("#txtQuantityFactor").val();
    _planQty = _planQty * parseInt(_QuantityFactor);

    $("#txtPRNewEOQty").val(_planQty);
    var ExtraPercentage = $("#txtPRExcessQty").val();
    var OrderQty = _planQty;
    if (ExtraPercentage != "" && parseInt(ExtraPercentage) > 0) {
        $("#txtPRNewPlannedQty").val(parseInt(OrderQty) + (Math.floor((OrderQty * ExtraPercentage) / 100)));
    }
}