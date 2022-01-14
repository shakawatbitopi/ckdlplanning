$(function () {
    //$("#Kendofilter").val("");
    //G_KendoGridName = "divBuyerColor";
    LoadddlData();
    ClearForm();
    BindGridData();
    $("#btnSave").click(function (e) {
        e.preventDefault();
        SaveFormValue();
    });

    $("#btnClear").click(function (e) {
        e.preventDefault();
        ClearForm();
    });
});
function LoadddlData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/ProductionReference/LoadDDLInformation",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlBuyerID").empty();
            $("#ddlBuyerID").append($("<option/>").val("-1").text("Select Buyer"));
            $.each(data.Buyer, function () {
                $("#ddlBuyerID").append($("<option/>").val(this.Code).text(this.Value));
            });
        }
    });

    $('#ddlBuyerID').selectpicker('refresh');
    $('#ddlBuyerID').selectpicker('render');
}
function BindGridData() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/BuyerColor/LoadAllBuyerColor",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#divBuyerColor").kendoGrid().empty();
    $("#divBuyerColor").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        BuyerColorID: { type: "number" },
                        BuyerID: { type: "string" },
                        ColorCode: { type: "string" }
                    }
                }
            }
        },
        toolbar: '<input filter-id="divBuyerColor" class="KendoCommonfilter k-textbox pull-right" type="text" placeholder="Search Here..">',
        columns: [
            { field: "BuyerColorID", title: "BuyerColorID", hidden: true, filterable: false },
            { field: "BuyerID", title: "Buyer Name", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "ColorCode", title: "Color Code", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)" onclick=GetEditData(#=BuyerColorID#)><span class="k-icon k-i-edit"></span>Edit</a>' +
                    '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=BuyerColorID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "BuyerColorID",
                title: "Action",
                width: 170,
                filterable: false,
                sortable: false,
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

function SaveFormValue() {
    var _isError = 0;
    var BuyerColorID = $("#hdBuyerColorID").val();
    var BuyerID = $("#ddlBuyerID").val();
    var ColorCode = $("#txtColorCode").val();

    if (BuyerID == "") {
        $("#ddlBuyerID").addClass("customError");
        _isError = 1;
    }
    else {
        $("#ddlBuyerID").removeClass("customError");
    }
    if (ColorCode == "") {
        $("#txtColorCode").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtColorCode").removeClass("customError");
    }

    if (_isError == 1) {
        return false;
    }

    var _dbModel = { 'BuyerColorID': BuyerColorID, 'BuyerID': BuyerID, 'ColorCode': ColorCode };

    $.ajax({
        type: "POST",
        url: baseURL + "/BuyerColor/SaveBuyerColor",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                BindGridData();
                swal('Good job!', 'Data Save Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
            ClearForm();
        }
    });
}

function GetEditData(BuyerColorID) {
    var _dbModel = { 'BuyerColorID': BuyerColorID };
    $.ajax({
        type: "POST",
        url: baseURL + "/BuyerColor/LoadSelectedBuyerColor",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                $("#hdBuyerColorID").val(item.BuyerColorID);
                $("#ddlBuyerID").val(item.BuyerID);
                $('#ddlBuyerID').selectpicker('refresh');
                $('#ddlBuyerID').selectpicker('render');
                $("#txtColorCode").val(item.ColorCode);
            });
        }
    });   
}

function DeleteGridData(BuyerColorID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'BuyerColorID': BuyerColorID };
        $.ajax({
            type: "POST",
            url: baseURL + "/BuyerColor/DeleteBuyerColor",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success == true) {
                    BindGridData();
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
    $("#hdBuyerColorID").val("");
    $("#ddlBuyerID").val("-1");
    $('#ddlBuyerID').selectpicker('refresh');
    $('#ddlBuyerID').selectpicker('render');
    $("#txtColorCode").val("");
}