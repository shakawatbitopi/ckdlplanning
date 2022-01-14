$(function () {
    ClearForm();
    BindGridData();
    BindMenuCategory();

    $("#btnSave").click(function (e) {
        e.preventDefault();
        SaveFormValue();
    });

    $("#btnClear").click(function (e) {
        e.preventDefault();
        ClearForm();
    });
});
function BindMenuCategory() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Menu/LoadAllMenuCategory",
        data: {},
        async: true,
        dataType: "json",
        success: function (data) {
            $("#ddlMenuCategoryID").empty();
            $("#ddlMenuCategoryID").append($("<option/>").val("-1").text("--Select Menu Category--"));
            $.each(data, function () {
                $("#ddlMenuCategoryID").append($("<option/>").val(this.MenuCategoryID).text(this.CategoryName));
            });
        }
    });
}
function BindGridData() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Menu/LoadAllMenuSubCategory",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}
function PopulateGridData(data) {
    $("#divMenuSubCategory").kendoGrid().empty();
    $("#divMenuSubCategory").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        MenuSubCategoryID: { type: "number" },
                        MenuCategoryID: { type: "number" },
                        CategoryName: { type: "string" },
                        MenuName: { type: "string" },
                        MenuUrl: { type: "string" },
                        SequenceNo: { type: "number" },
                        IsActive: { type: "string" },
                    }
                }
            }
        },
        toolbar: "<input filter-id='divMenuSubCategory' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "MenuSubCategoryID", title: "MenuSubCategoryID", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "MenuCategoryID", title: "MenuCategoryID", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "CategoryName", title: "Category Name", width: 100, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "MenuName", title: "Menu Name", width: 150, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "MenuUrl", title: "Menu Url", width: 200, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "SequenceNo", title: "Sequence No", width: 60, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IsActive", title: "Active", width: 60, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)" onclick=GetEditData(#=MenuSubCategoryID#)><span class="k-icon k-i-edit"></span>Edit</a>' +
                    '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=MenuSubCategoryID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "MenuSubCategoryID",
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
    var MenuSubCategoryID = $("#hdMenuSubCategoryID").val();
    var MenuCategoryID = $("#ddlMenuCategoryID").val();
    var MenuName = $("#txtMenuName").val();
    var MenuUrl = $("#txtMenuUrl").val();
    var SequenceNo = $("#txtSequenceNo").val();
    var IsActive = $('#chkIsActive').is(":checked") ? 1 : 0;

    if (MenuSubCategoryID == "") {
        MenuSubCategoryID = 0;
    }

    if (MenuCategoryID === "-1") {
        $("#ddlMenuCategoryID").addClass("customError");
        _isError = 1;
    }
    else {
        $("#ddlMenuCategoryID").removeClass("customError");
    }

    if (MenuName === "") {
        $("#txtMenuName").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtMenuName").removeClass("customError");
    }

    if (MenuUrl === "") {
        $("#txtMenuUrl").addClass("customError");
        _isError = 1;
    }
    else {
        $("#txtMenuUrl").removeClass("customError");
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
    var _dbModel = {
        'MenuSubCategoryID': MenuSubCategoryID, 'MenuCategoryID': MenuCategoryID, 'MenuName': MenuName,
        'MenuUrl': MenuUrl, 'SequenceNo': SequenceNo, 'IsActive': IsActive
    };
    $.ajax({
        type: "POST",
        url: baseURL + "/Menu/SaveMenuSubCategory",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                BindGridData();
                if (MenuSubCategoryID == 0) {
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
function GetEditData(MenuSubCategoryID) {
    var _dbModel = { 'MenuSubCategoryID': MenuSubCategoryID };
    $.ajax({
        type: "POST",
        url: baseURL + "/Menu/LoadSelectedMenuSubCategory",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                $("#hdMenuSubCategoryID").val(item.MenuSubCategoryID);
                $("#ddlMenuCategoryID").val(item.MenuCategoryID);
                $("#txtMenuName").val(item.MenuName);
                $("#txtMenuUrl").val(item.MenuUrl);
                $("#txtSequenceNo").val(item.SequenceNo);

                if (item.IsActive === true)
                    $("#chkIsActive").prop('checked', true);
                else
                    $("#chkIsActive").prop('checked', false);
            });
        }
    });
}
function DeleteGridData(MenuSubCategoryID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'MenuSubCategoryID': MenuSubCategoryID };
        $.ajax({
            type: "POST",
            url: baseURL + "/Menu/DeleteMenuSubCategory",
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
    $(".ddl").val("-1");
    $("#chkIsActive").prop('checked', false);
}