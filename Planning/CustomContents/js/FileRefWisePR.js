$(function () {
    $("#Kendofilter").val("");
    G_KendoGridName = "divFileRefWisePR";
    LoadFileRefWisePR();
});
function LoadFileRefWisePR() {
    $.ajax({
        type: "GET",
        url: baseURL + "/PRInformation/LoadFileRefWisePR",
        data: {},
        contentType: "application/json",
        datatype: "json",
        success: function (data) {
            BindGridData(data);
        }
    });
}

function BindGridData(data) {
    $("#divFileRefWisePR").kendoGrid().empty();
    $("#divFileRefWisePR").kendoGrid({
        dataSource: {
            data: data,
            dataType: "json",
            schema: {
                model: {
                    fields: {
                        FileRefID: { type: "string" },
                        Style: { type: "string" },
                        PRID: { type: "string" },
                    }
                }
            }
        },
        toolbar: "<input filter-id='divFileRefWisePR' class='KendoCommonfilter k-textbox pull-right' type='text' placeholder='Search Here..'>",
        columns: [
            { field: "PRID", width: 250, title: "PRID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },
            { field: "FileRefID", title: "FileRefID", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },          
            { field: "Style", title: "Style", filterable: false, headerAttributes: { style: "white-space: normal" }, attributes: { style: "text-align: left" } },

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
        scrollable: true
    });
}
