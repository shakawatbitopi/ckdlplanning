$(function () {
    $("#txtLineNumber").val("");
    $("#Kendofilter").val("");
    G_KendoGridName = "divLineSequence";

    BindGridData([]);
    $(document).delegate('#btnFind', 'click', function (e) {
        e.preventDefault();
        if ($("#txtLineNumber").val() !== "")
            LoadSelectedLineSequence($("#txtLineNumber").val());
        else {
            alert('Enter a Valid Line Number..!');
            return false;
        }
    });
    $(document).delegate('#btnClear', 'click', function (e) {
        e.preventDefault();
        $("#txtLineNumber").val("");
        $("#Kendofilter").val("");
        BindGridData([]);
    });
});

function LoadSelectedLineSequence(LineNumber) {
    var _dbModel = { 'LineNumber': LineNumber };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/PRInformation/SelectedLineSequence",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            BindGridData(data);
        }
    });
}

function BindGridData(data) {
    $("#divLineSequence").kendoGrid().empty();
    $("#divLineSequence").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        PRID: { type: "string" },
                        StyleName: { type: "string" },
                        StartDate: { type: "string" },
                        EndDate: { type: "string" },
                        SeqNo: { type: "string" },
                    }
                }
            }
        },        
        columns: [
            { field: "PRID", title: "PR ID", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleName", title: "Style Name", width: 350, filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "StartDate", title: "Start Date", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "EndDate", title: "End Date", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SeqNo", title: "Sequence No", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        pageable: false,
        scrollable: true
    });
}