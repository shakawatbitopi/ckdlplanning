$(function () {


    LoadDDLData();
    LoadAllPRUserAccess();
    ClearForm();
    $("#btnSave").click(function (e) {
        e.preventDefault();
        SaveFormValue();
    });
});

function LoadDDLData() {
    $.ajax({
        type: "GET",
        url: baseURL + "/UserAccess/LoadDDLData",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlCompany").empty();
            $("#ddlCompany").append($("<option/>").val("-1").text("Select"));
            $.each(data.CompanyList, function () {
                $("#ddlCompany").append($("<option/>").val(this.Code).text(this.Value));
            });

            $("#ddlEmployee").empty();
            $.each(data.EmpList, function () {
                $("#ddlEmployee").append($("<option/>").val(this.Code).text(this.Value + ' (' + this.Code + ')'));
            });
        }
    });

    $('#ddlEmployee').selectpicker('refresh');
    $('#ddlEmployee').selectpicker('render');
}

function SaveFormValue() {
    var _isError = 0;
    var PRUserAccessID = $("#hdPRUserAccessID").val();
    var CompanyID = $("#ddlCompany").val();
    var EMPList = $("#ddlEmployee").val().join(",");

    if (CompanyID == "") {
        $("#ddlCompany").addClass("customError");
        _isError = 1;
    }
    else {
        $("#ddlCompany").removeClass("customError");
    }
    if (EMPList.length == 0) {
        $("#ddlCompany").addClass("customError");
        _isError = 1;
    }
    else {
        $("#ddlCompany").removeClass("customError");
    }

    if (_isError == 1) {
        return false;
    }

    var _dbModel = { 'PRUserAccessID': PRUserAccessID, 'CompanyID': CompanyID, 'EMPList': EMPList };

    $.ajax({
        type: "POST",
        url: baseURL + "/UserAccess/SaveUserAccess",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                swal('Good job!', 'Data Save Successfully..!', 'success');
                LoadAllPRUserAccess();
                ClearForm();
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}

function LoadAllPRUserAccess() {
    $.ajax({
        type: "GET",
        url: baseURL + "/UserAccess/LoadAllPRUserAccess",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#tblPRUserAccess").kendoGrid().empty();
    $("#tblPRUserAccess").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRUserAccessID: { type: "number" },
                        Name: { type: "string" },
                        CompanyName: { type: "string" }
                    }
                }
            }
        },
        toolbar: "<input filter-id='tblPRUserAccess' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "PRUserAccessID", title: "PRUserAccessID", hidden: true, filterable: false },
            { field: "Name", title: "Name", filterable: true },
            { field: "CompanyName", title: "CompanyName", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=DeleteGridData("#=PRUserAccessID#")><span class="k-icon k-i-close"></span>Delete</a>',
                field: "PRUserAccessID",
                title: "Action",
                headerAttributes: { style: "text-align: center" },
                attributes: { class: "text-center" },
                filterable: false
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


function GetEditData(PRUserAccessID) {
    var _dbModel = { 'PRUserAccessID': PRUserAccessID };
    $.ajax({
        type: "POST",
        url: baseURL + "/UserAccess/LoadSelectedData",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                $("#hdPRUserAccessID").val(item.PRUserAccessID);
                $("#ddlCompany").val(item.CompanyID);
                $("#ddlEmployee").val(item.EmployeeCode);
                $('#ddlEmployee').selectpicker('refresh');
                $('#ddlEmployee').selectpicker('render');
            });
        }
    });
}

function DeleteGridData(PRUserAccessID) {
    var ans = confirm("Are you sure to delete a record?");
    if (ans == true) {
        var _dbModel = { 'PRUserAccessID': PRUserAccessID };
        $.ajax({
            type: "POST",
            url: baseURL + "/UserAccess/DeleteData",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success == true) {
                    LoadAllPRUserAccess();
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
    $("#hdPRUserAccessID").val("");
    $("#ddlCompany").val("-1");
    $("#ddlEmployee").val("");
    $('#ddlEmployee').selectpicker('refresh');
    $('#ddlEmployee').selectpicker('render');
}