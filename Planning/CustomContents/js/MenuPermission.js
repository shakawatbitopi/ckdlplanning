$(function () {
    ClearForm();
    PopulateGridData([]);
    BindEmployeeNames();

    $(document).delegate('#btnSave', 'click', function (e) {
        e.preventDefault();
        SaveFormValue();
    });

    $(document).delegate('#btnClear', 'click', function (e) {
        e.preventDefault();
        ClearForm();
    });

    $(document).delegate('#ddlEmployeeCode', 'change', function (e) {
        e.preventDefault();
        BindGridData();
    });
});

function SaveFormValue() {
    var arrMenuInformation = [];
    var grid = $("#divMenuPermission").data("kendoGrid");
    grid.refresh();
    $.each(grid.dataSource._data, function (i, item) {
        if (item.IsChecked === true) {
            arrMenuInformation.push({
                MenuSubCategoryID: item.MenuSubCategoryID,
                IsSelect: item.IsSelect,
                IsInsert: item.IsInsert,
                IsEdit: item.IsEdit,
                IsDelete: item.IsDelete
            });
        }
    });
    if (arrMenuInformation.length > 0 && $("#ddlEmployeeCode").val() !== "") {
        var _dbModel = {
            'EmployeeCode': $("#ddlEmployeeCode").val(), 'arrUserMenuPermissionDBModel': arrMenuInformation
        };

        $.ajax({
            type: "POST",
            url: baseURL + "/Menu/SaveUserMenu",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            async: true,
            success: function (data) {
                if (data.success === true) {
                    ClearForm();
                    swal('Good job!', 'Data Save Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
    else {
        swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
    }
}
function BindEmployeeNames() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Menu/LoadAllEmployee",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlEmployeeCode").empty();
            $("#ddlEmployeeCode").append($("<option/>").val("-1").text("--Select User--"));
            $.each(data, function () {
                $("#ddlEmployeeCode").append($("<option/>").val(this.EmployeeCode).text(this.EmployeeName));
            });

            $('#ddlEmployeeCode').selectpicker('refresh');
            $('#ddlEmployeeCode').selectpicker('render');
        }
    });
}
function BindGridData() {
    var _dbModel = { 'EmployeeCode': $("#ddlEmployeeCode").val() };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Menu/LoadAllUserMenu",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}
function PopulateGridData(data) {
    $("#divMenuPermission").kendoGrid().empty();
    $("#divMenuPermission").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                Id: "MenuSubCategoryID",
                model: {
                    fields: {
                        MenuSubCategoryID: { editable: false, type: "number", },
                        IsChecked: { editable: true, type: "boolean" },
                        IsSelect: { editable: true, type: "boolean" },
                        IsInsert: { editable: true, type: "boolean" },
                        IsEdit: { editable: true, type: "boolean" },
                        IsDelete: { editable: true, type: "boolean" },
                        CategoryName: { editable: false, type: "string" },
                        MenuName: { editable: false, type: "string" },
                    }
                }
            }
        },
        //toolbar: "<input filter-id='divMenuPermission' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "MenuSubCategoryID", title: "MenuSubCategoryID", hidden: true, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "IsChecked", title: "Choose", template: '<input type="checkbox" #= IsChecked ? \'checked="checked"\' : "" # class="chkbx" />', width: 110, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "CategoryName", title: "Category Name", width: 100, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "MenuName", title: "Menu Name", width: 150, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "IsSelect", title: "Select", template: '<input type="checkbox" #= IsSelect ? \'checked="checked"\' : "" # class="chkbxSelect" />', width: 110, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IsInsert", title: "Insert", template: '<input type="checkbox" #= IsInsert ? \'checked="checked"\' : "" # class="chkbxInsert" />', width: 110, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IsEdit", title: "Edit", template: '<input type="checkbox" #= IsEdit ? \'checked="checked"\' : "" # class="chkbxEdit" />', width: 110, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "IsDelete", title: "Delete", template: '<input type="checkbox" #= IsDelete ? \'checked="checked"\' : "" # class="chkbxDelete" />', width: 110, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: true,
        sortable: true,
        filterable: false,
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });

    $("#divMenuPermission .k-grid-content").on("change", "input.chkbx", function (e) {
        var grid = $("#divMenuPermission").data("kendoGrid"),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        dataItem.set("IsChecked", this.checked);

        if (this.checked === false) {
            dataItem.set("IsSelect", this.checked);
            dataItem.set("IsInsert", this.checked);
            dataItem.set("IsEdit", this.checked);
            dataItem.set("IsDelete", this.checked);
        }
    });

    $("#divMenuPermission .k-grid-content").on("change", "input.chkbxSelect", function (e) {
        var grid = $("#divMenuPermission").data("kendoGrid"),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        dataItem.set("IsSelect", this.checked);
    });

    $("#divMenuPermission .k-grid-content").on("change", "input.chkbxInsert", function (e) {
        var grid = $("#divMenuPermission").data("kendoGrid"),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        dataItem.set("IsInsert", this.checked);
    });

    $("#divMenuPermission .k-grid-content").on("change", "input.chkbxEdit", function (e) {
        var grid = $("#divMenuPermission").data("kendoGrid"),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        dataItem.set("IsEdit", this.checked);
    });

    $("#divMenuPermission .k-grid-content").on("change", "input.chkbxDelete", function (e) {
        var grid = $("#divMenuPermission").data("kendoGrid"),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        dataItem.set("IsDelete", this.checked);
    });
}
function ClearForm() {
    $("#ddlEmployeeCode").val("-1");
    $('#ddlEmployeeCode').selectpicker('refresh');
    $('#ddlEmployeeCode').selectpicker('render');
    PopulateGridData([]);
}