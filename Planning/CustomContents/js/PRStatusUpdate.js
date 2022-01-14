$(function () {
    BindGridData();
    $(document).delegate('#btnDownloadPRStatus', 'click', function (e) {
        e.preventDefault();
        DownloadReportPRStatusData();
    });
});
function DownloadReportPRStatusData() {
    window.open(baseURL + "/Report/DownloadPRStatusData");
}
function BindGridData() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/PRStatusInformationData",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}

function PopulateGridData(data) {
    $("#divPRStatus").kendoGrid().empty();
    $("#divPRStatus").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRMasterID: { type: "number" },
                        PRID: { type: "string" },
                        Company: { type: "string" },
                        FileRefID: { type: "string" },
                        Style: { type: "string" },
                        Status: { type: "string" }
                    }
                }
            }
        },
        toolbar: '<a id="btnDownloadPRStatus" role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)"><span class="k-icon k-i-download"></span><strong>Download</strong></a><input filter-id="divPRStatus" class="KendoCommonfilter k-textbox pull-right" type="text" placeholder="Search Here..">',
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            { field: "PRID", title: "PR ID", width: 100, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Company", title: "Company", width: 100, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "FileRefID", title: "File Ref ID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Style", title: "Style", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "Status", title: "Status", width: 150, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            {
                title: "<center>Action</center>", width: 550, attributes: { style: "text-align: center" },
                template: function (dataItem) {
                    var _ToClose = "TO CLOSE";
                    var _PdnCOMPLETE = "PDN COMPLETE";
                    if (dataItem.Status === "ACTIVE") {
                        return '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"CLOSED")><span class="k-icon k-i-check"></span><strong>CLOSED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PROJECTED")><span class="k-icon k-i-check"></span><strong>PROJECTED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PENDING")><span class="k-icon k-i-check"></span><strong>PENDING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"RUNNING")><span class="k-icon k-i-check"></span><strong>RUNNING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _PdnCOMPLETE.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>PDN COMPLETE</strong></a>'+
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _ToClose.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>TO CLOSE</strong></a>';
                    }
                    else if (dataItem.Status === "CLOSED") {
                        return '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"ACTIVE")><span class="k-icon k-i-check"></span><strong>ACTIVE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PROJECTED")><span class="k-icon k-i-check"></span><strong>PROJECTED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PENDING")><span class="k-icon k-i-check"></span><strong>PENDING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"RUNNING")><span class="k-icon k-i-check"></span><strong>RUNNING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _PdnCOMPLETE.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>PDN COMPLETE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _ToClose.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>TO CLOSE</strong></a>';
                    }
                    else if (dataItem.Status === "PROJECTED") {
                        return '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"ACTIVE")><span class="k-icon k-i-check"></span><strong>ACTIVE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"CLOSED")><span class="k-icon k-i-check"></span><strong>CLOSED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PENDING")><span class="k-icon k-i-check"></span><strong>PENDING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"RUNNING")><span class="k-icon k-i-check"></span><strong>RUNNING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _PdnCOMPLETE.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>PDN COMPLETE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _ToClose.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>TO CLOSE</strong></a>';
                    }
                    else if (dataItem.Status === "PENDING") {
                        return '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"ACTIVE")><span class="k-icon k-i-check"></span><strong>ACTIVE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"CLOSED")><span class="k-icon k-i-check"></span><strong>CLOSED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PROJECTED")><span class="k-icon k-i-check"></span><strong>PROJECTED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"RUNNING")><span class="k-icon k-i-check"></span><strong>RUNNING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _PdnCOMPLETE.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>PDN COMPLETE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _ToClose.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>TO CLOSE</strong></a>';
                    }
                    else if (dataItem.Status === "RUNNING") {
                        return '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"ACTIVE")><span class="k-icon k-i-check"></span><strong>ACTIVE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"CLOSED")><span class="k-icon k-i-check"></span><strong>CLOSED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PROJECTED")><span class="k-icon k-i-check"></span><strong>PROJECTED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PENDING")><span class="k-icon k-i-check"></span><strong>PENDING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _PdnCOMPLETE.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>PDN COMPLETE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _ToClose.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>TO CLOSE</strong></a>';
                    }
                    else if (dataItem.Status === "TO CLOSE") {
                        return '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"ACTIVE")><span class="k-icon k-i-check"></span><strong>ACTIVE</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"CLOSED")><span class="k-icon k-i-check"></span><strong>CLOSED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PROJECTED")><span class="k-icon k-i-check"></span><strong>PROJECTED</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"PENDING")><span class="k-icon k-i-check"></span><strong>PENDING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"RUNNING")><span class="k-icon k-i-check"></span><strong>RUNNING</strong></a>' +
                            '<a role="button" class="k-button k-button-icontext k-grid-delete" href="javascript:void(0)" onclick=UpdatePRStatus(' + dataItem.PRMasterID + ',"' + _PdnCOMPLETE.split(' ').join('\xa0') + '")><span class="k-icon k-i-check"></span><strong>PDN COMPLETE</strong></a>';
                    }
                    else {
                        return '';
                    }
                }
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

function UpdatePRStatus(PRMasterID, Status) {
    var ans = confirm("Are you sure to update PR Status?");
    if (ans == true) {
        var _dbModel = { 'PRMasterID': PRMasterID, 'Status': Status };
        $.ajax({
            type: "POST",
            url: baseURL + "/PRInformation/UpdatePRStatusInformationData",
            data: JSON.stringify(_dbModel),
            contentType: "application/json",
            datatype: "json",
            success: function (data) {
                if (data.success == true) {
                    BindGridData();
                    swal('Good job!', 'PR Status Changed Successfully..!', 'success');
                }
                else {
                    swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
                }
            }
        });
    }
}