$(function () {
    LoadCompanyNames();
    $(document).delegate('#btnLoadProjectionReport', 'click', function (e) {
        e.preventDefault();
        if ($("#ddlCompany").val() !== "")
            DownloadProjectionReportData($("#ddlCompany").val());
        else
            alert('Please Select Company..!');
    });
});
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
function DownloadProjectionReportData(CompanyID) {
    window.open(baseURL + "/Report/DownloadProjectionReport?CompanyID=" + CompanyID);
}