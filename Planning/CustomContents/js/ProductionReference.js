var array = {};
var TotalSelectedEOQty = 0;
$(function () {
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
        window.location.href = baseURL + "/ProductionReference/Create";
    });
    $(document).delegate('#btnLoad', 'click', function (e) {
        e.preventDefault();
        LoadEOInformation($("#ddlFileRef").val().join(","), $("#txtPRID").val());
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
        $('#lblTotalQty').text(TotalSelectedEOQty);
    });
    $(document).delegate('#btnSavePRMaster', 'click', function (e) {
        e.preventDefault();
        var EOList = $("#divEOInformation tbody input:checkbox:checked").map(function () {
            return this.value;
        }).toArray();
        if (EOList.toString() == "") {
            alert('No Selected EO Found..!');
            return false;
        }
        else {
            SavePRMasterInformation(EOList.toString());
        }
    });
    $(document).delegate('#btnFind', 'click', function (e) {
        e.preventDefault();
        LoadAllPRInformation();
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
        $('#lblTotalQty').text(TotalSelectedEOQty);
    });
});

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
}
function GetPRInformation(PRMasterID) {
    var _dbModel = {
        'PRMasterID': PRMasterID
    };
    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionReference/LoadSelectedPRInformation",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $("#txtPRID").val(data.Master[0].PRID);
            $("#ddlCompany").val(data.Master[0].CompanyID);
            $("#ddlBuyer").val(data.Master[0].BuyerID);
            $("#ddlProductType").val(data.Master[0].ProductType);
            $("#ddlStatus").val(data.Master[0].Status);
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

            BindEOInformation(data.Child);
            CalculatePlannedQty();
        }
    });
    $("#modalPRInformation").modal("toggle");
}
function SavePRMasterInformation(EOID) {
    var _isError = 0;
    var _message = "";
    var PRID = $("#txtPRID").val();
    var Company = $("#ddlCompany").val();
    var BuyerID = $("#ddlBuyer").val();
    var ProductType = $("#ddlProductType").val();
    var FileRefID = $("#ddlFileRef").val().join(",");
    var Status = $("#ddlStatus").val();

    if (Company == null || Company == "-1") {
        _message += "Select Company Name..!\n";
        _isError = 1;
    }
    if (BuyerID == null || BuyerID == "-1") {
        _message += "Select Buyer Name..!\n";
        _isError = 1;
    }
    if (ProductType == null || ProductType == "-1") {
        _message += "Select Product Type..!\n";
        _isError = 1;
    }
    if (FileRefID == null || FileRefID == "-1") {
        _message += "Select File Reference..!\n";
        _isError = 1;
    }
    if (Status == null || Status == "") {
        _message += "Select PR Status..!\n";
        _isError = 1;
    }

    if (_isError == 1) {
        alert(_message);
        return false;
    }

    if (PRID == "") {
        PRID = "<NEW>";
    }

    var arrEOInformation = [];
    var grid = $("#divEOInformation").data("kendoGrid");
    grid.refresh();
    $.each(grid.dataSource._data, function (i, item) {
        if (item.SelectedQty !== "" && item.SelectedQty !== "0") {
            arrEOInformation.push({
                ExportOrderID: item.ExportOrderID,
                SelectedQty: item.SelectedQty
            });
        }
    });

    var _dbModel = {
        'PRID': PRID, 'CompanyID': Company, 'BuyerID': BuyerID, 'ProductType': ProductType,
        'FileRefID': FileRefID, 'ExportOrderID': EOID, 'Status': Status, 'arrEOInformationDBModel': arrEOInformation
    };
    $.ajax({
        type: "POST",
        url: baseURL + "/ProductionReference/SaveProductionReference",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success !== "Failed") {
                $("#txtPRID").val(data.success);
                swal('Good job!', 'Data Save Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
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
            url: baseURL + "/ProductionReference/LoadFileRefData",
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

function LoadEOInformation(FileRefID,PRID) {
    if (FileRefID == null || FileRefID == "") {
        alert('No File Reference Found..!');
        return false;
    }
    var _dbModel = { 'FileRefID': FileRefID, 'PRID': PRID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionReference/LoadExportOrder",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            BindEOInformation(data);
        }
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
                        StyleID: { editable: false },
                        ExportOrderID: { editable: false },
                        SizeGroup: { editable: false },
                        UOM: { editable: false },
                        Destination: { editable: false },
                        UnitName: { editable: false },
                        ShipMode: { editable: false },
                        ExportPONo: { editable: false },
                        PCD: { editable: false },
                        ExportOrderStatus: { editable: false },
                        TargetDate: { editable: false },
                        ExfactoryDate: { editable: false },
                        ShipDate: { editable: false },
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
        toolbar: "<a role='button' id='btnSavePRMaster' class='k-button k-button-icontext k-grid-edit' href='##'><span class='k-icon k-i-check'></span>Save</a> <center style='width: 300px; float: right; margin-top: 5px;'><span><strong>Total Selected: </strong><label id='lblTotalQty'></label></span></center>",
        columns: [
            { field: "RowID", title: "RowID", hidden: true, filterable: false },
            {
                title: "<center><input type='checkbox' data-vastype='vasOp' id='chkAllGridValue' value=''></center>", width: 30,
                template: function (dataItem) {
                    if (dataItem.ExportOrderStatus === "CANCELLED" || parseInt(dataItem.OrderQty) === 0) {
                        return "";
                    }
                    else if (dataItem.IsCheck === "1" && parseInt(dataItem.RemainingQty) > 0)
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                    else if (dataItem.IsCheck === "1" && parseInt(dataItem.RemainingQty) === 0)
                        return '<center><input class="chkPO" type="checkbox" checked id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';

                    else if ((dataItem.IsCheck === "1" || dataItem.IsCheck === "0") && parseInt(dataItem.RemainingQty) === 0) {
                        return "";
                    }
                    else
                        return '<center><input class="chkPO" type="checkbox" id=' + dataItem.RowID + ' name=' + dataItem.RowID + ' value=' + dataItem.ExportOrderID + ' ></center>';
                }
            },
            {
                field: "SeqNo", title: "Seq No", filterable: false,
                headerAttributes: { style: "white-space: normal" }, hidden: true, attributes: { style: "text-align: center" },
            },
            { field: "FileRefID", title: "FileRef ID",filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderID", title: "EO ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleID", title: "Style", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportPONo", title: "Export PONo", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PCD", title: "PCD", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExportOrderStatus", title: "EO Status", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetDate", title: "ExFactory", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ExfactoryDate", title: "Ex Factory Date", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ShipDate", title: "Ship Date", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PRQty", title: "PRQty", filterable: false, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "RemainingQty", title: "Remaining Qty", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SelectedQty", title: "Selected Qty", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SizeGroup", title: "Size Group", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UOM", title: "UOM", filterable: false, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Destination", title: "Destination", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UnitName", title: "Unit", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "Total: " },
            { field: "ShipMode", title: "Ship Mode", filterable: true, hidden: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "OrderQty", title: "Order Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
            { field: "PRQty", title: "PR Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
            { field: "RemainingQty", title: "Remaining Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # " },
            {
                field: "SelectedQty", title: "Selected Qty", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" }, footerTemplate: "#= sum # ",
                //editable:true
                //   function (dataItem) {
                //    if (dataItem.RemainingQty > 0) {
                //        return false;
                //    }
                //    else {
                //        return false;
                //    }
                //}
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
            _totalQty += item.SelectedQty;
        }
    });
    TotalSelectedEOQty = _totalQty;
    $('#lblTotalQty').text(TotalSelectedEOQty);
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
                    swal('Good job!', 'Data Save Successfully..!', 'success');
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