$(function () {
    LoadCompanyNames();
    $(document).delegate('#btnLoadReport', 'click', function (e) {
        e.preventDefault();
        if ($("#ddlCompany").val().join(",") !== "")
            DownloadReportData($("#ddlCompany").val().join(","));
        else
            alert('Please Select Company..!');
    });
    $(document).delegate('#btnOrderStatusData', 'click', function (e) {
        e.preventDefault();
        if ($("#ddlCompanyID").val().join(",") !== "")
            DownloadReportOrderStatusData($("#ddlCompanyID").val().join(","));
        else
            alert('Please Select Company..!');
    });
});
function DownloadReportOrderStatusData(CompanyID) {
    window.open(baseURL + "/Report/BuyerWiseExportOrderStatus?CompanyID=" + CompanyID);
}
function LoadCompanyNames() {
    $.ajax({
        type: "GET",
        url: baseURL + "/Report/GetReportsCompanyInformation",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlCompany").empty();
            $.each(data, function () {
                $("#ddlCompany").append($("<option/>").val(this.Code).text(this.Value));
            });
        }
    });
    $('#ddlCompany').selectpicker('refresh');
    $('#ddlCompany').selectpicker('render');
}

function DownloadReportData(CompanyID) {
    //window.open(baseURL + "/Report/DownloadReportData?CompanyID=" + CompanyID);
    window.open(baseURL + "/Report/DownloadReportDataFinal?CompanyID=" + CompanyID);
}
