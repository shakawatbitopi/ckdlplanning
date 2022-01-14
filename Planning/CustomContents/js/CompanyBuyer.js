$(function () {
    ClearForm();
    LoadDDLData();
    BindGridData();

    $(document).delegate('#btnSave', 'click', function (e) {
        e.preventDefault();
        SaveFormValue();
    });

    $(document).delegate('#btnAddNewItem', 'click', function (e) {
        e.preventDefault();
        ClearForm();
        $("#modalCompanyBuyer").modal("toggle");
    });

    $(document).delegate('#btnClear', 'click', function (e) {
        e.preventDefault();
        ClearForm();
    });
});

function LoadDDLData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/CompanyBuyer/LoadCompanyBuyerNames",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlCompanyID").empty();
            $("#ddlCompanyID").append($("<option/>").val("-1").text("--Select Company--"));
            $.each(data.Company, function () {
                $("#ddlCompanyID").append($("<option/>").val(this.Code).text(this.Value));
            });

            $("#ddlBuyerID").empty();
            $("#ddlBuyerID").append($("<option/>").val("-1").text("--Select Buyer--"));
            $.each(data.Buyer, function () {
                $("#ddlBuyerID").append($("<option/>").val(this.Code).text(this.Value));
            });
        }
    });

    $('#ddlBuyer').selectpicker('refresh');
    $('#ddlBuyer').selectpicker('render');
}

function BindGridData() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/CompanyBuyer/LoadAllCompanyBuyer",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#divCompanyBuyer").kendoGrid().empty();
    $("#divCompanyBuyer").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRBuyerCompanyID: { type: "number" },
                        CompanyName: { type: "string" },
                        BuyerName: { type: "string" }
                    }
                }
            }
        },
        toolbar: '<a id="btnAddNewItem" role="button" class="k-button k-button-icontext" href="javascript::void(0)"><span class="k-icon k-i-check"></span>Add New</a><input filter-id="divCompanyBuyer" class="KendoCommonfilter k-textbox pull-right" type="text" placeholder="Search Here..">',
        columns: [
            { field: "PRBuyerCompanyID", title: "PRBuyerCompanyID", hidden: true, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "CompanyName", title: "Company Name", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "BuyerName", title: "Buyer Name", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)" onclick=GetEditData("#=PRBuyerCompanyID#")><span class="k-icon k-i-edit"></span>Edit</a>' +
                    '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=PRBuyerCompanyID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "PRBuyerCompanyID",
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

function SaveFormValue() {
    var _isError = 0;
    var PRBuyerCompanyID = $("#hdPRBuyerCompanyID").val();
    var CompanyID = $("#ddlCompanyID").val();
    var BuyerID = $("#ddlBuyerID").val();

    if (PRBuyerCompanyID == "") {
        PRBuyerCompanyID = 0;
    }

    if (CompanyID == "") {
        $("#ddlCompanyID").addClass("customError");
        _isError = 1;
    }
    else {
        $("#ddlCompanyID").removeClass("customError");
    }

    if (BuyerID == "") {
        $("#ddlBuyerID").addClass("customError");
        _isError = 1;
    }
    else {
        $("#ddlBuyerID").removeClass("customError");
    }


    if (_isError == 1) {
        return false;
    }
    var _dbModel = {
        'PRBuyerCompanyID': PRBuyerCompanyID, 'CompanyID': CompanyID, 'BuyerID': BuyerID
    };
    $.ajax({
        type: "POST",
        url: baseURL + "/CompanyBuyer/SaveCompanyBuyer",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success === true) {
                BindGridData();
                $("#modalCompanyBuyer").modal("toggle");
                if (PRBuyerCompanyID === 0) {
                    swal('Good job!', 'Data Save Successfully..!', 'success');
                }
                else {
                    swal('Good job!', 'Data Updated Successfully..!', 'success');
                }
                ClearForm();
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function GetEditData(PRBuyerCompanyID) {
    var _dbModel = { 'PRBuyerCompanyID': PRBuyerCompanyID };
    $.ajax({
        type: "POST",
        url: baseURL + "/CompanyBuyer/LoadSelectedCompanyBuyer",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                $("#hdPRBuyerCompanyID").val(item.PRBuyerCompanyID);
                $("#ddlCompanyID").val(item.CompanyID);
                $("#ddlBuyerID").val(item.BuyerID);
            });
            $('#ddlBuyerID').selectpicker('refresh');
            $('#ddlBuyerID').selectpicker('render');
            $("#modalCompanyBuyer").modal("toggle");
        }
    });
}

function DeleteGridData(PRBuyerCompanyID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'PRBuyerCompanyID': PRBuyerCompanyID };
        $.ajax({
            type: "POST",
            url: baseURL + "/CompanyBuyer/DeleteCompanyBuyer",
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
    $(".txt").val("");
}