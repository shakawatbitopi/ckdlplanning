$(function () {
    LoadAllUserForAuth();
});

function LoadAllUserForAuth() {
    $.ajax({
        type: "GET",
        url: baseURL + "/UserAccess/LoadAllUserForAuth",
        data: {},
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#tblPRUser").kendoGrid().empty();
    $("#tblPRUser").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        BuyerColorID: { type: "string" },
                        SLNO: { type: "string" },
                        EmployeeCode: { type: "string" },
                        UserCode: { type: "string" },
                        Name: { type: "string" },
                        CompanyName: { type: "string" }
                    }
                }
            }
        },
        toolbar: "<input filter-id='tblPRUser' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "SLNO", title: "SLNO", hidden: true, filterable: false },
            { field: "EmployeeCode", title: "Employee Code", filterable: true },
            { field: "UserCode", hidden: true, title: "User Code", filterable: true },
            { field: "Name", title: "Name", filterable: true },
            { field: "CompanyName", title: "Company", filterable: true },
            {
                template: '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UserLoginAuth("#=UserCode#")>Login</a>',
                field: "BuyerColorID",
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



function UserLoginAuth(UserCode) {
    var dbModel = { 'UserCode': UserCode };
    $.ajax({
        type: "POST",
        url: baseURL + "/UserAccess/LoadUserLoginInfo",
        data: JSON.stringify(dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.Success == 'True') {
                window.location.href = baseURL + "/Dashboard/Home";
            }
            else {
                alert("User Name Or Password Error..!");
            }
        }
    });
}

