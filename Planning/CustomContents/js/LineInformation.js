$(function () {
    LoadLineInformation();
    $(document).delegate('#btnUpdateData', 'click', function (e) {
        e.preventDefault();
        var ans = confirm("Are you sure to update?");
        if (ans == true) {
            UpdateGridData();
        }
    });
});

function LoadLineInformation() {
    $.ajax({
        type: "POST",
        url: baseURL + "/Utility/CompanyLineNumber",
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
    $("#divLineInformation").kendoGrid().empty();
    $("#divLineInformation").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChange,
            schema: {
                model: {
                    fields: {
                        Operator: { type: "number", editable: true },
                        Helper: { type: "number", editable: true },
                        WorkStation: { type: "number", editable: false },
                        CompanyName: { type: "string", editable: false },
                        LineNumber: { type: "string", editable: false },
                        UnitName: { type: "string", editable: false }
                    }
                }
            }
        },
        toolbar: '<a id="btnUpdateData" role="button" class="k-button k-button-icontext k-grid-edit" href="javascript:void(0)"><span class="k-icon k-i-check"></span>Update Data</a><input filter-id="divLineInformation" class="KendoCommonfilter k-textbox pull-right" type="text" placeholder="Search Here..">',
        columns: [
            { field: "CompanyName", title: "Company", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "UnitName", title: "Unit", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "LineNumber", title: "Line Number", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Operator", title: "Operator", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Helper", title: "Helper", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "WorkStation", title: "Work Station", filterable: false, headerAttributes: { style: "white-space: normal;background-color:yellow;" }, attributes: { style: "text-align: center" } },

        ],
        editable: true,
        sortable: true,
        filterable: false,
        resizable: true,
        height: 450,
        pageable: false,
        scrollable: true
    });
}
function onChange(e) {
    var grid = $('#divLineInformation').data().kendoGrid;

    if (e.action == "itemchange" && e.field == "Operator") {
        var Operator = e.items[0].Operator === null ? 0 : e.items[0].Operator;
        var Helper = e.items[0].Helper === null ? 0 : e.items[0].Helper;
        e.items[0].WorkStation = parseInt(Operator) + parseInt(Helper);
    }
    else if (e.action == "itemchange" && e.field == "Helper") {
        var Operator = e.items[0].Operator === null ? 0 : e.items[0].Operator;
        var Helper = e.items[0].Helper === null ? 0 : e.items[0].Helper;
        e.items[0].WorkStation = parseInt(Operator) + parseInt(Helper);
    }
    grid.refresh();
}

function UpdateGridData() {
    var _isNormalValue = true;
    var arrEfficiency = [];
    var _ErrorList = "";
    var grid = $('#divLineInformation').data().kendoGrid;

    $.each(grid._data, function (i, item) {
        if (this.dirty == true) {
            if (parseInt(item.Operator) > 0 && parseInt(item.WorkStation) > 0) {
                arrEfficiency.push({
                    LineNumber: item.LineNumber,
                    Operator: item.Operator,
                    Helper: item.Helper
                });
            }
            else {
                _ErrorList += "Line Number " + item.LineNumber + " Operator and Work Station Must Be Greater Then 0..!\n";
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
        url: baseURL + "/Utility/UpdateCompanyLineNumber",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            if (data.success === true) {
                LoadLineInformation();
                swal('Good job!', 'Data Save Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}