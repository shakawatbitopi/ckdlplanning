$(function () {
    LoadAllCompany();
    $('input[type = radio][name = rbHoliDday][value="WH"]').prop("checked", true);
    $('#txtFromDate').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtFromDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtFromDate').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"]
    });
    $('#txtToDate').kendoDatePicker({
        value: new Date(),
        dateInput: true,
        open: function (e) {
            $('#txtToDate').data('kendoDatePicker').options.opened = true;
        },
        close: function (e) {
            $('#txtToDate').data('kendoDatePicker').options.opened = false;
        },
        format: "dd-MMM-yyyy",
        parseFormats: ["dd-MMM-yyyy"]
    });
    $(document).delegate('#btnLoad', 'click', function (e) {
        e.preventDefault();
        UpdateProductionDate();
    });
    $(document).delegate('#btnSaveProductionCalender', 'click', function (e) {
        e.preventDefault();
        UpdateProductionCalender();
    });
    $(document).delegate('#ddlCompany', 'change', function (e) {
        e.preventDefault();
        LoadLineNumber();
    });
    $(document).delegate('input[type = radio][name = rbCalendar]', 'change', function (e) {
        e.preventDefault();
        if (this.value == "H") {
            $("#txtWorkingHour").val("0");
        }
        else {
            $("#txtWorkingHour").val("10");
        }
    });
    $(document).delegate('input[type = radio][name = rbHoliDday]', 'change', function (e) {
        e.preventDefault();
        if (this.value == "ST") {
            $('input[type = radio][name = rbCalendar]').attr("disabled", true);
        }
        else {
            $('input[type = radio][name = rbCalendar]').removeAttr("disabled");
        }
    });

    $("#txtYear").yearpicker({
        year: 2020,
        startYear: 2015,
        endYear: 2040
    });
    $(document).delegate('#btnLoadYearData', 'click', function (e) {
        e.preventDefault();
        LoadProductionCalenderData();
    });
});
function LoadAllCompany() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionCalender/LoadAllCompany",
        data: {},
        async: true,
        dataType: "json",
        success: function (data) {
            $("#ddlCompany").empty();
            $("#ddlCompany").append($("<option/>").val("-1").text("Select Company"));
            $.each(data, function () {
                $("#ddlCompany").append($("<option/>").val(this.CompanyID).text(this.CompanyName));
            });
        }
    });
}
function LoadLineNumber() {
    var _dbModel = { 'CompanyID': $("#ddlCompany").val() };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionCalender/LoadAllCompanyLineNumber",
        data: JSON.stringify(_dbModel),
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlLineNumber").empty();
            $.each(data, function () {
                $("#ddlLineNumber").append($("<option/>").val(this.LineNumber).text(this.LineNumber));
            });
        }
    });
    $('#ddlLineNumber').selectpicker('refresh');
    $('#ddlLineNumber').selectpicker('render');
}

function UpdateProductionDate() {
    var _dbModel = {
        'CompanyID': $("#ddlCompany").val(), 'FromDate': $("#txtFromDate").val(), 'ToDate': $("#txtToDate").val(),
        'LineNumber': $("#ddlLineNumber").val().join(","),
        'ProductionHours': $("#txtWorkingHour").val()
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionCalender/UpdateProductionDate",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                swal('Good job!', 'Data Updated Successfully..!', 'success');
            } else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}

function LoadProductionCalenderData() {
    var _dbModel = {
        'CompanyID': $("#ddlCompany").val(), 'FromDate': $("#txtYear").val()
    };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: baseURL + "/ProductionCalender/LoadSelectedProductionDate",
        data: JSON.stringify(_dbModel),
        async: true,
        dataType: "json",
        success: function (data) {
            BindGridData(data);
        }
    });
}

function BindGridData(data) {
    $("#tblProductionCalender").kendoGrid().empty();
    $("#tblProductionCalender").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    Id: "ProductionDate",
                    fields: {
                        ProductionDate: { editable: false },
                        DaysName: { editable: false },
                        LineNumber: { editable: false },
                        ProductionHours: { editable: false }
                    }
                }
            }
        },
        toolbar: "<span style='background-color: red;font-weight: 600;border-radius: 2px;padding: 0px 6px;color: white;'>Red:</span> Weekly Holiday, <span style='background-color: yellow;font-weight: 600;border-radius: 2px;padding: 0px 6px;color: black;'>Yellow:</span> General Holiday",
        columns: [
            {
                title: "Line Number",
                template: function (dataItem) {
                    var dt=""
                    if (dataItem.DaysName == "Friday") {
                        dt = '<span style="background-color:red;display: block;color: #fff;font-weight: 600;">' + dataItem.LineNumber + '</span>';
                    } else if (dataItem.ProductionHours == "0.00") {
                        dt = '<span style="background-color:yellow;display: block;color: #000;font-weight: 600;">' + dataItem.LineNumber + '</span>';
                    } else {
                        dt = '<span>' + dataItem.LineNumber + '</span>';
                    }
                    return dt;
                }
            },
            {
                title: "Production Date",
                template: function (dataItem) {
                    var dt = ""
                    if (dataItem.DaysName == "Friday") {
                        dt = '<span style="background-color:red;display: block;color: #fff;font-weight: 600;">' + dataItem.ProductionDate + '</span>';
                    } else if (dataItem.ProductionHours == "0.00") {
                        dt = '<span style="background-color:yellow;display: block;color: #000;font-weight: 600;">' + dataItem.ProductionDate + '</span>';
                    } else {
                        dt = '<span>' + dataItem.ProductionDate + '</span>';
                    }
                    return dt;
                }
            },
            {
                title: "Days Name",
                template: function (dataItem) {
                    var dt = ""
                    if (dataItem.DaysName == "Friday") {
                        dt = '<span style="background-color:red;display: block;color: #fff;font-weight: 600;">' + dataItem.DaysName + '</span>';
                    } else if (dataItem.ProductionHours == "0.00") {
                        dt = '<span style="background-color:yellow;display: block;color: #000;font-weight: 600;">' + dataItem.DaysName + '</span>';
                    }else {
                        dt = '<span>' + dataItem.DaysName + '</span>';
                    }
                    return dt;
                }
            },
            {
                title: "Production Hours",
                template: function (dataItem) {
                    var dt = ""
                    if (dataItem.DaysName == "Friday") {
                        dt = '<span style="background-color:red;display: block;color: #fff;font-weight: 600;">' + dataItem.ProductionHours + '</span>';
                    } else if (dataItem.ProductionHours == "0.00") {
                        dt = '<span style="background-color:yellow;display: block;color: #000;font-weight: 600;">' + dataItem.ProductionHours + '</span>';
                    }else {
                        dt = '<span>' + dataItem.ProductionHours + '</span>';
                    }
                    return dt;
                }
            },
            //{ field: "LineNumber", title: "Line Number", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            //{ field: "ProductionDate", title: "Production Date", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },
            //{ field: "DaysName", title: "Days Name", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } },            
            //{ field: "ProductionHours", title: "Production Hours", filterable: true, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: center" } }
        ],
        editable: true,
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
        scrollable: true
    });

}

function setColors() {
    var grid = $("#tblProductionCalender").data("kendoGrid");
    var data = grid.dataSource.data();

    grid.tbody.find('>tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (dataItem.DaysName == "Friday") {
            $(this).css('color', 'red');
        }
    });
}

function UpdateProductionCalender() {
    var arrProductionCalender = [];
    var grid = $("#tblProductionCalender").data("kendoGrid");
    grid.refresh();

    $.each(grid.dataSource._data, function (i, item) {
        arrProductionCalender.push({
            CompanyID: $("#ddlCompany").val(),
            ProductionDate: item.ProductionDate,
            ProductionHours: item.ProductionHours
        });
    });

    var _dbModel = {
        'ProductionCalenderDBModel': arrProductionCalender
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: baseURL + "/ProductionCalender/SaveProductionCalendar",
        data: JSON.stringify(_dbModel),
        async: true,        
        datatype: "json",
        success: function (data) {
            if (data.success == true) {
                swal('Good job!', 'Data Save Successfully..!', 'success');
            }
            else {
                swal({ type: 'error', title: 'Oops...', text: 'Something went wrong!' });
            }
        }
    });
}