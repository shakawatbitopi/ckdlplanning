$(function () {    
    LoadAllPendingProcessData();
    $(document).delegate('#btnProcess', 'click', function (e) {
        e.preventDefault();        
        ProcessStart();
    });
});

function ProcessStart() {
    $.ajax({
        type: "POST",
        url: baseURL + "/Planning/PRPRocess",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {            
            if (data.success == true) {
                LoadAllPendingProcessData();
                swal('Good job!', 'Data Process Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}

function LoadAllPendingProcessData() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/Planning/LoadPendingProcessInformation",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            LoadGridData(data);
        }
    });
}

function LoadGridData(data) {
    $("#divPendingPlanDateInformation").kendoGrid().empty();
    $("#divPendingPlanDateInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        toolbar: "<a role='button' id='btnProcess' class='k-button k-button-icontext k-grid-edit' href='##'><span class='k-icon k-i-check'></span>Process</a>",
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            { field: "PRID", title: "PR ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Company", title: "Company", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Buyer", title: "Buyer", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "ProductType", title: "Product Type", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "File Ref", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleID", title: "Style", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SAM", title: "SAM", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "PlannedProduction", title: "Planned Production", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
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
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit
    });
}

function detailInit(e) {
    var detailRow = e.detailRow;
    detailRow.find(".orders").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: baseURL + '/Planning/LoadPendingProcessDetails',
                    data: { PRMasterID: e.data.PRMasterID },
                    dataType: "json"
                }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            filter: { field: "PRMasterID", operator: "eq", value: e.data.PRMasterID }
        },
        scrollable: false,
        sortable: true,
        pageable: false,
        toolbar: "<div class='divGridInfo'>Line Information</div>",
        columns: [
            { field: "PRMasterID", title: "PRMasterID", filterable: false, hidden: true },
            { field: "LineNumber", title: "LineNumber", filterable: true },
            { field: "StartDate", title: "StartDate", filterable: true },
            { field: "EndDate", title: "EndDate", filterable: true },
            { field: "ProcessBy", title: "ProcessBy", filterable: true },
            { field: "ProcessDate", title: "ProcessDate", filterable: true }
        ]
    });
}