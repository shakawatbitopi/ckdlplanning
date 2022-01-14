$(function () {

    ClearForm();
    BindGridData();

    $("#btnSave").click(function (e) {
        e.preventDefault();
        SaveFormValue();
    });

    $("#btnAddNewItem").click(function (e) {
        e.preventDefault();
        ClearForm();
        $("#modalCTT").modal("toggle");
    });

    $("#btnClear").click(function (e) {
        e.preventDefault();
        ClearForm();
    });
});

function BindGridData() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Menu/LoadAllMenuCategory",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#divMenuCategory").kendoGrid().empty();
    $("#divMenuCategory").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        MenuCategoryID: { type: "number" },
                        CategoryName: { type: "string" },
                        SequenceNo: { type: "number" },
                        IsActive: { type: "string" },
                    }
                }
            }
        },
        toolbar: "<input filter-id='divMenuCategory' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "MenuCategoryID", title: "MenuCategoryID", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "CategoryName", title: "Category Name", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SequenceNo", title: "Sequence No", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IsActive", title: "Active", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)" onclick=GetEditData(#=MenuCategoryID#)><span class="k-icon k-i-edit"></span>Edit</a>' +
                    '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=MenuCategoryID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "MenuCategoryID",
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
    var MenuCategoryID = $("#hdMenuCategoryID").val();
    var CategoryName = $("#txtCategoryName").val();
    var SequenceNo = $("#txtSequenceNo").val();
    var IsActive = $('#chkIsActive').is(":checked") ? 1 : 0;

    if (MenuCategoryID === "") {
        MenuCategoryID = 0;
    }
    if (CategoryName === "") {
        $("#txtCategoryName").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtCategoryName").removeClass("customError");
    }
    if (SequenceNo === "") {
        $("#txtSequenceNo").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtSequenceNo").removeClass("customError");
    }

    if (_isError == 1) {
        return false;
    }
    var _dbModel = { 'MenuCategoryID': MenuCategoryID, 'CategoryName': CategoryName, 'SequenceNo': SequenceNo, 'IsActive': IsActive };
    $.ajax({
        type: "POST",
        url: baseURL + "/Menu/SaveMenuCategory",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                BindGridData();
                if (MenuCategoryID == 0) {
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
function GetEditData(MenuCategoryID) {
    var _dbModel = { 'MenuCategoryID': MenuCategoryID };
    $.ajax({
        type: "POST",
        url: baseURL + "/Menu/LoadSelectedMenuCategory",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                $("#hdMenuCategoryID").val(item.MenuCategoryID);
                $("#txtCategoryName").val(item.CategoryName);
                $("#txtSequenceNo").val(item.SequenceNo);

                if (item.IsActive === true)
                    $("#chkIsActive").prop('checked', true);
                else
                    $("#chkIsActive").prop('checked', false);
            });
        }
    });
}


function DeleteGridData(MenuCategoryID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'MenuCategoryID': MenuCategoryID };
        $.ajax({
            type: "POST",
            url: baseURL + "/Menu/DeleteMenuCategory",
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
    $("#chkIsActive").prop('checked', false);
}