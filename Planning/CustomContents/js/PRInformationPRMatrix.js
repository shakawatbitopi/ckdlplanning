$(function () {
    $(document).delegate('#btnLoadPRMAtrix', 'click', function (e) {
        e.preventDefault();
        $(".mtxtEff").val("");

        if ($("#txtPRID").val() === "") {
            alert('No PR Found. Please Load PR..!');
            return false;
        }
        LoadPREfficiency($("#txtPRID").val());
        $("#modalPRWiseMatrixfficiency").modal("toggle");
    });

    $(document).delegate('#txtWorkStation', 'keyup', function (e) {
        e.preventDefault();
        CalculateDailyTarget($(this).val() === "" ? 0 : $(this).val());
    });

    $(document).delegate('#btnUpdateData', 'click', function (e) {
        e.preventDefault();
        var ans = confirm("Are you sure to update?");
        if (ans == true) {
            UpdateGridData();
        }
    });

    $(document).delegate('#btnDeletePRMatrix', 'click', function (e) {
        e.preventDefault();
        var ans = confirm("Are you sure to delete PR Matrix?");
        if (ans == true) {
            DeletePRMatrixData();
        }
    });

    $(document).delegate('#btnUpdateEfficiency', 'click', function (e) {
        e.preventDefault();
        var ans = confirm("Are you sure to update update Efficiency?");
        if (ans == true) {
            UpdatePREfficiency();
        }
    });
    $(document).delegate('#txtEfficiency', 'keyup', function (e) {
        e.preventDefault();
        $("#txtQuantity").val("");
    });
    $(document).delegate('#txtQuantity', 'keyup', function (e) {
        e.preventDefault();
        $("#txtEfficiency").val("");
    });

});
function LoadPREfficiency(PRID) {
    var _dbModel = { 'PRID': PRID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/EfficeincyMatrix/LoadPRMasterWiseEfficiency",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            PopulateLineNumber(data.LineNumber);
            PopulateEfficiencyData(data.Efficiency);
        }
    });
}
function PopulateLineNumber(data) {
    $("#divLineNumber").kendoGrid().empty();
    $("#divLineNumber").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json"
        },
        columns: [
            { field: "LineNumber", title: "Line Number", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TotalWorkStation", title: "Work Station", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "TargetQty", title: "Target Qty", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
        ],
        editable: false,
        sortable: true,
        filterable: false,
        resizable: true,
        height: 300,
        pageable: false,
        scrollable: true
    });
}
function PopulateEfficiencyData(data) {
    $("#divPRWiseMatrixfficiency").kendoGrid().empty();
    $("#divPRWiseMatrixfficiency").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            change: onChangeEfficiencyMatrix,
            schema: {
                model: {
                    Id: "EfficiencyID",
                    fields: {
                        PRMasterID: { editable: false, type: "number" },
                        EfficiencyID: { editable: false, type: "number" },
                        StyleType: { editable: false, type: "string" },
                        StyleCriticality: { editable: false, type: "string" },
                        Days: { editable: false, type: "number" },
                        Efficiency: { editable: true, type: "number" },
                        SAM: { editable: false, type: "number" },
                        DailyTarget: { editable: true, type: "number" },
                    }
                }
            }
        },
        toolbar: "<a id='btnUpdateData' role='button' class='k-button k-button-icontext k-grid-edit' href='javascript:void(0)'><span class='k-icon k-i-check'></span>Update Data</a>" +
            "<a id='btnDeletePRMatrix' role='button' class='k-button k-button-icontext k-grid-edit hidden' href='javascript:void(0)'><span class='k-icon k-i-trash'></span>Delete PR Matrix</a>" +
            "<input id='txtWorkStation' type='text' class='k-textbox' style='float: right;' placeholder='Enter Work Station..' />",
        columns: [
            { field: "PRMasterID", title: "PRMasterID", hidden: true, filterable: false },
            { field: "EfficiencyID", title: "EfficiencyID", hidden: true, filterable: false },
            { field: "StyleType", title: "Style Type", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "StyleCriticality", title: "Criticality", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "SAM", title: "PR SAM", editable: false, filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Days", title: "Days", filterable: false, editable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            { field: "Efficiency", title: "Efficiency", filterable: false, headerAttributes: { style: "white-space: normal;background-color:yellow" }, attributes: { style: "text-align: center" } },
            { field: "DailyTarget", title: "Daily Target", filterable: false, headerAttributes: { style: "white-space: normal;background-color:yellow" }, attributes: { style: "text-align: center" } },
        ],
        editable: true,
        sortable: true,
        filterable: false,
        resizable: true,
        pageable: false,
        scrollable: true
    });

    if (data.length > 0) {
        if (data[0].MatrixType === "PR Matrix") {
            $("#btnDeletePRMatrix").removeClass('hidden');
        }
        else {
            $("#btnDeletePRMatrix").addClass('hidden');
        }
    }
    else {
        $("#btnDeletePRMatrix").addClass('hidden');
    }
}
function onChangeEfficiencyMatrix(e) {
    var grid = $('#divPRWiseMatrixfficiency').data().kendoGrid;
    var WorkStation = $('#txtWorkStation').val() === "" ? 0 : $('#txtWorkStation').val();

    if (e.action == "itemchange" && e.field == "Efficiency") {
        var OrgEff = e.items[0].Efficiency === null ? 0 : e.items[0].Efficiency;

        var SAM = e.items[0].SAM;
        var HourlyProduction = Math.ceil((parseInt(WorkStation) * 60) / parseFloat(SAM));
        HourlyProduction = Math.ceil(HourlyProduction * (OrgEff / 100));
        var DailyProduction = parseInt(HourlyProduction) * parseInt(10);
        e.items[0].DailyTarget = DailyProduction;
    }
    else if (e.action == "itemchange" && e.field == "DailyTarget") {
        var OrgEff = e.items[0].Efficiency === null ? 0 : e.items[0].Efficiency;
        var DailyProduction = e.items[0].DailyTarget === null ? 0 : e.items[0].DailyTarget;

        var SAM = e.items[0].SAM;
        var HourlyProduction = Math.ceil((parseInt(WorkStation) * 60) / parseFloat(SAM));

        var _HourlyProduction = Math.ceil(HourlyProduction * (OrgEff / 100));
        var TotalHour = parseInt(600) / 60;
        var _dailyProduction = parseInt(_HourlyProduction) * parseInt(TotalHour);
        var _editEfficiency = ((OrgEff * DailyProduction) / _dailyProduction).toFixed(2);

        e.items[0].DailyTarget = DailyProduction;
        e.items[0].Efficiency = _editEfficiency;
    }
    grid.refresh();
}
function CalculateDailyTarget(WorkStation) {
    var grid = $('#divPRWiseMatrixfficiency').data().kendoGrid;
    $.each(grid._data, function (i, item) {
        var SAM = item.SAM;
        var OrgEff = item.Efficiency;
        var HourlyProduction = Math.ceil((parseInt(WorkStation) * 60) / parseFloat(SAM));
        HourlyProduction = Math.ceil(HourlyProduction * (OrgEff / 100));
        var DailyProduction = parseInt(HourlyProduction) * parseInt(10);
        item.DailyTarget = DailyProduction;
    });
    grid.refresh();
}
function UpdateGridData() {
    var _isNormalValue = true;
    var arrEfficiency = [];
    var _ErrorList = "";
    var grid = $('#divPRWiseMatrixfficiency').data().kendoGrid;

    $.each(grid._data, function (i, item) {
        if (parseFloat(item.Efficiency) > 0) {
            arrEfficiency.push({
                PRMasterID: item.PRMasterID,
                StyleType: item.StyleType,
                StyleCriticality: item.StyleCriticality,
                SAM: item.SAM,
                Days: item.Days,
                Efficiency: item.Efficiency
            });
        }
        else {
            _ErrorList += "Days " + item.Days + " Efficiency Value Must Be Greater Then 0..!\n";
            _isNormalValue = false;
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
        url: baseURL + "/EfficeincyMatrix/SavePRWiseEfficeincy",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        async: true,
        success: function (data) {
            if (data.success === true) {
                LoadPREfficiency($("#txtPRID").val());
                swal('Good job!', 'Data Save Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function DeletePRMatrixData() {
    var PRID = $("#txtPRID").val()
    var _dbModel = { 'PRID': PRID };
    $.ajax({
        type: "POST",
        url: baseURL + "/EfficeincyMatrix/DeletePRWiseEfficeincy",
        data: JSON.stringify(_dbModel),
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                LoadPREfficiency(PRID);
                swal('Good job!', 'PR Matrix Deleted Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}
function UpdatePREfficiency() {
    var grid = $("#divPRWiseMatrixfficiency").data("kendoGrid");
    if (grid === undefined) {
        alert('No Grid Data Found..!');
        return false;
    }
    var WorkStation = $("#txtWorkStation").val();
    if (WorkStation === "") {
        alert('Please Work Station Number..!');
        return false;
    }
    var StartDay = $("#txtStartDay").val();
    if (StartDay === "") {
        alert('Please Enter Start Day Number..!');
        return false;
    }
    var EndDay = $("#txtEndDay").val();
    if (EndDay === "") {
        alert('Please Enter End Day Number..!');
        return false;
    }
    var Efficiency = $("#txtEfficiency").val();
    var Quantity = $("#txtQuantity").val();

    if (Efficiency === "" && Quantity === "") {
        alert('Please Enter Efficiency or Quantity..!');
        return false;
    }


    $.each(grid.dataSource._data, function (i, item) {
        var _IsQty = false;

        if (Efficiency === "") {
            _IsQty = true;
        }

        var _IsFound = isBetween(item.Days, parseInt(StartDay), parseInt(EndDay));
        if (_IsFound) {
            if (_IsQty) {

                var OrgEff = item.Efficiency === null ? 0 : parseFloat(item.Efficiency);
                var DailyProduction = parseInt(Quantity) === null ? 0 : parseInt(Quantity);

                var SAM = item.SAM;
                var HourlyProduction = Math.ceil((parseInt(WorkStation) * 60) / parseFloat(SAM));

                var _HourlyProduction = Math.ceil(HourlyProduction * (OrgEff / 100));
                var TotalHour = parseInt(600) / 60;
                var _dailyProduction = parseInt(_HourlyProduction) * parseInt(TotalHour);
                var _editEfficiency = ((OrgEff * DailyProduction) / _dailyProduction).toFixed(2);

                item.DailyTarget = DailyProduction;
                item.Efficiency = _editEfficiency;
            }
            else {

                var OrgEff = Efficiency === null ? 0 : parseFloat(Efficiency);

                var SAM = item.SAM;
                var HourlyProduction = Math.ceil((parseInt(WorkStation) * 60) / parseFloat(SAM));
                HourlyProduction = Math.ceil(HourlyProduction * (OrgEff / 100));
                var DailyProduction = parseInt(HourlyProduction) * parseInt(10);
                item.DailyTarget = DailyProduction;
                item.Efficiency = Efficiency;
            }
        }
    });
    grid.refresh();
}
function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
}