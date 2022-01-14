$(function () {
    LoadMasterData();
    PopulateGridData([]);
    $(document).delegate('#btnLoadData', 'click', function (e) {
        e.preventDefault();
        var _isError = 0;
        var _CompanyID = "";
        var _StyleType = "";
        var _StyleCriticality = "";
        if ($("#ddlCompany").val() !== null || $("#ddlCompany").val() !== "") {
            _CompanyID = $("#ddlCompany").val();
        }
        else {
            _CompanyID = "";
            _isError = 1;
        }

        if ($("#ddlStyleType").val() !== null || $("#ddlStyleType").val() !== "") {
            _StyleType = $("#ddlStyleType").val();
        }
        else {
            _StyleType = "";
            _isError = 1;
        }

        if ($("#ddlStyleCriticality").val() !== null || $("#ddlStyleCriticality").val() !== "") {
            _StyleCriticality = $("#ddlStyleCriticality").val();
        }
        else {
            _StyleCriticality = "";
            _isError = 1;
        }

        if (_isError === 1) {
            alert('Something Went Wrong. Select All The Value..!');
            return false;
        }

        BindGridData(_CompanyID, _StyleType, _StyleCriticality);
    });
    $(document).delegate('#btnUpdateData', 'click', function (e) {
        e.preventDefault();
        var ans = confirm("Are you sure to update?");
        if (ans == true) {
            UpdateGridData();
        }
    });
});
function LoadMasterData() {
    $.ajax({
        type: "POST",
        url: baseURL + "/EfficeincyMatrix/LoadEfficeincyMatrixMasterData",
        data: {},
        contentType: "application/json",
        datatype: "json",
        async: false,
        success: function (data) {
            $("#ddlCompany").empty();
            $("#ddlStyleType").empty();
            $("#ddlStyleCriticality").empty();

            if (data.Company.length > 0)
                $("#ddlCompany").append($("<option/>").val("").text("--Select Company--"));

            $.each(data.Company, function () {
                $("#ddlCompany").append($("<option/>").val(this.CompanyID).text(this.CompanyName));
            });

            $.each(data.StyleList, function () {
                $("#ddlStyleType").append($("<option/>").val(this.StyleType).text(this.StyleType));
            });

            $.each(data.Criticality, function () {
                $("#ddlStyleCriticality").append($("<option/>").val(this.StyleCriticality).text(this.StyleCriticality));
            });
        }
    });

    $('#ddlCompany').selectpicker('refresh');
    $('#ddlCompany').selectpicker('render');

    $('#ddlStyleType').selectpicker('refresh');
    $('#ddlStyleType').selectpicker('render');

    $('#ddlStyleCriticality').selectpicker('refresh');
    $('#ddlStyleCriticality').selectpicker('render');
}
function BindGridData(CompanyID, StyleType, StyleCriticality) {
    var _dbModel = { 'CompanyID': CompanyID, 'StyleType': StyleType, 'StyleCriticality': StyleCriticality };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/EfficeincyMatrix/GetSelectedEfficeincyMatrix",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateGridData(data);
        }
    });
}
function PopulateGridData(data) {
    $("#divEfficiencyMatrix").kendoGrid().empty();
    $("#divEfficiencyMatrix").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChange,
            schema: {
                model: {
                    Id: "EfficiencyID",
                    fields: {
                        EfficiencyID: { editable: false, type: "number" },
                        StyleType: { editable: false, type: "string" },
                        StyleCriticality: { editable: false, type: "string" },
                        Days: { editable: false, type: "number" },
                        Efficiency: { editable: true, type: "number" },
                    }
                }
            }
        },
        toolbar: "<a id='btnUpdateData' role='button' class='k-button k-button-icontext k-grid-edit' href='javascript:void(0)'><span class='k-icon k-i-check'></span>Update Data</a> <input filter-id='divEfficiencyMatrix' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "EfficiencyID", title: "EfficiencyID", hidden: true, filterable: false },
            { field: "StyleType", title: "Style Type", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleCriticality", title: "Criticality", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Days", title: "Days", filterable: false, editable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Efficiency", title: "Efficiency", filterable: false, headerAttributes: { style: "white-space: normal;background-color:yellow" }, attributes: { style: "text-align: center" } },
        ],
        editable: true,
        sortable: true,
        filterable: false,
        resizable: true,
        height: 500,
        pageable: false,
        scrollable: true
    });
}
function onChange(e) {
    if (e.action == "itemchange" && e.field == "Efficiency") {
        var _Efficiency = e.items[0].Efficiency = "" ? 0 : parseFloat(e.items[0].Efficiency);
        if (_Efficiency === 0) {
            alert('Efficiency should be greater then 0..!');
            return false;
        }
    }
}
function UpdateGridData() {
    var _isNormalValue = true;
    var arrEfficiency = [];
    var _ErrorList = "";
    var grid = $('#divEfficiencyMatrix').data().kendoGrid;

    $.each(grid._data, function (i, item) {
        if (this.dirty == true) {
            if (parseFloat(item.Efficiency) > 0) {
                arrEfficiency.push({
                    EfficiencyID: item.EfficiencyID,
                    Efficiency: item.Efficiency
                });
            }
            else {
                _ErrorList += "Days " + item.Days + " Efficiency Value Must Be Greater Then 0..!\n";
                _isNormalValue = false;
            }
        }
    });

    if (!_isNormalValue) {
        alert(_ErrorList);
        return false;
    }

    if (arrEfficiency.length === 0) {
        alert('No Change Data Found For Update..!');
        return false;
    }

    var _dbModel = { '_dbModel': arrEfficiency };

    $.ajax({
        type: "POST",
        url: baseURL + "/EfficeincyMatrix/SaveManualEfficeincy",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            if (data.success === true) {
                BindGridData($("#ddlCompany").val(), $("#ddlStyleType").val(), $("#ddlStyleCriticality").val());
                swal('Good job!', 'Data Save Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}