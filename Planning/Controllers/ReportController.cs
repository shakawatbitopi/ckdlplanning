using Common;
using LIB;
using Model;
using Syncfusion.XlsIO;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class ReportController : Controller
    {
        // GET: Report
        [PlanningSession, MenuAuthorize(10)]
        public ActionResult Report()
        {
            return View();
        }

        [PlanningSession, MenuAuthorize(23)]
        public ActionResult Projection()
        {
            return View();
        }
        ProductionItem objItem;

        [HttpGet, PlanningSession]
        public JsonResult GetReportsCompanyInformation()
        {
            objItem = new ProductionItem();
            List<ProductionDBModel> _dbModelList = new List<ProductionDBModel>();
            _dbModelList = objItem.GetReportsCompanyInformation();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        int _indexStart = 0;
        public ActionResult DownloadReportData(string CompanyID)
        {
            objItem = new ProductionItem();
            DataTable dt = new DataTable();
            dt = objItem.DownloadReportData(CompanyID);
            try
            {
                ExcelEngine excelEngine = new ExcelEngine();
                excelEngine = new ExcelEngine();

                //IApplication app = excelEngine.Excel.Application;
                //app.DefaultVersion = ExcelVersion.Excel2010;

                IApplication application = excelEngine.Excel.Application;
                application.DefaultVersion = ExcelVersion.Excel2010;

                var workbook = application.Workbooks.Create(1);
                //workbook.Version = ExcelVersion.Excel97to2003;

                //Syncfusion.GridExcelConverter.GridExcelConverterControl gecc = new Syncfusion.GridExcelConverter.GridExcelConverterControl();

                IWorksheet sheet = workbook.Worksheets[0];
                IMigrantRange migrantRange = sheet.MigrantRange;
                int rowCount = dt.Rows.Count;
                int colCount = dt.Columns.Count;
                int _start = 1;

                //Header Column Style
                IStyle style = workbook.Styles.Add("NewStyle");
                style.Color = Color.Gray;
                style.Font.Bold = true;
                style.Font.Color = ExcelKnownColors.White;
                style.Font.Size = 8.5;
                style.VerticalAlignment = ExcelVAlign.VAlignCenter;
                style.HorizontalAlignment = ExcelHAlign.HAlignCenter;
                style.WrapText = true;

                //Line Summary Style
                IStyle styleLineSummary = workbook.Styles.Add("NewLineSummaryStyle");
                styleLineSummary.Color = Color.CadetBlue;
                styleLineSummary.Font.Bold = true;
                styleLineSummary.Font.Color = ExcelKnownColors.White;
                styleLineSummary.Font.Size = 10;
                styleLineSummary.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleLineSummary.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleLineSummary.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleLineSummary.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleLineSummary.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                styleLineSummary.WrapText = true;

                //Data Column Style
                IStyle styleDataCell = workbook.Styles.Add("NewDataStyle");
                styleDataCell.Font.Size = 9;
                styleDataCell.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleDataCell.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleDataCell.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleDataCell.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleDataCell.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

                //Grand Total Column Style
                IStyle styleGrandTotal = workbook.Styles.Add("NewLineGrandTotal");
                styleGrandTotal.Color = Color.DimGray;
                styleGrandTotal.Font.Bold = true;
                styleGrandTotal.Font.Color = ExcelKnownColors.White;
                styleGrandTotal.Font.Size = 10;
                styleGrandTotal.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleGrandTotal.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleGrandTotal.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleGrandTotal.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleGrandTotal.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                styleGrandTotal.WrapText = true;

                var _dataRowID = 0;
                //Set the Column Names and Column Styles Start
                foreach (DataColumn column in dt.Columns)
                {
                    sheet[2, _start].Text = column.ColumnName;
                    sheet[2, _start].CellStyle = style;
                    _start++;
                    _indexStart = _start;
                }
                //Set the Column Names and Column Styles End
                _dataRowID = 3;

                var _lastColumnName = "";
                var _isTotalColumn = false;
                for (int i = 1; i <= rowCount; i++)
                {
                    _isTotalColumn = false;
                    for (int j = 1; j <= colCount; j++)
                    {
                        var _columnName = sheet.Columns[j - 1];
                        _lastColumnName = _columnName.AddressLocal;

                        if (dt.Rows[i - 1][j - 1].ToString() == "TOTAL")
                        {
                            _isTotalColumn = true;
                        }

                        //Set the Line Number Day Wise Quantity Value Start
                        if (!_isTotalColumn)
                        {
                            if (j >= 11)
                            {
                                if (!string.IsNullOrEmpty(dt.Rows[i - 1][j - 1].ToString()))
                                    sheet[i + 2, j].Number = Convert.ToDouble(dt.Rows[i - 1][j - 1].ToString());
                            }
                            else
                            {
                                sheet[i + 2, j].Text = dt.Rows[i - 1][j - 1].ToString();
                            }
                        }
                        //Set the Line Number Day Wise Quantity Value End

                        //Set the Summary Formula for Line Number Start
                        if (j >= 11 && _isTotalColumn)
                        {
                            int _startFormulaID = 13;
                            for (int m = _startFormulaID; m <= colCount; m++)
                            {
                                var _localEndAddress = sheet.Range[i + 1, m].AddressLocal;
                                var _localStartAddress = sheet.Range[_dataRowID, m].AddressLocal;
                                sheet[i + 2, m].Formula = "=SUM(" + _localStartAddress + ":" + _localEndAddress + ")";
                                sheet[i + 2, m].CellStyle = styleLineSummary;
                                _startFormulaID++;
                            }
                            _dataRowID = i + 3;
                            j = _startFormulaID;
                        }
                        //Set the Summary Formula for Line Number End

                        //Merge the Line Number Summary Row Start

                        if (!_isTotalColumn)
                            sheet[i + 2, j].CellStyle = styleDataCell;

                        //Merge the Line Number Summary Row Start
                        if (j == 1 && _isTotalColumn == true)
                        {
                            sheet[i + 2, j + 1].Text = dt.Rows[i - 1][j].ToString();
                            sheet.Range[i + 2, 3, i + 2, 13].Merge();

                            sheet.Range[i + 2, 1, i + 2, 13].CellStyle = styleLineSummary;

                            j = 11;
                        }
                        //Merge the Line Number Summary Row End
                    }
                }

                //SET GRAND TOTAL START
                int _startGrandTotalRowID = rowCount + 2;
                int _excelStartRowIndex = 3;
                int _excelEndRowIndex = _startGrandTotalRowID;

                sheet[_excelEndRowIndex + 1, 1].Text = "Grand Total";
                sheet.Range[_excelEndRowIndex + 1, 2, _excelEndRowIndex + 1, 13].Merge();

                for (int k = 14; k <= colCount; k++)
                {
                    var _localEndAddress = sheet.Range[_excelEndRowIndex, k].AddressLocal;
                    var _localStartAddress = sheet.Range[_excelStartRowIndex, k].AddressLocal;
                    sheet[_startGrandTotalRowID + 1, k].Formula = "=SUMPRODUCT(" + _localStartAddress + ":" + _localEndAddress + "*NOT(ISFORMULA(" + _localStartAddress + ":" + _localEndAddress + ")))";
                }

                sheet.Range[_excelEndRowIndex + 1, 1, _excelEndRowIndex + 1, colCount].CellStyle = styleGrandTotal;

                //SET GRAND TOTAL END

                //SET FREEZE FIRST 10 COLUMNS START
                sheet.SetColumnWidth(1, 10);
                sheet.SetColumnWidth(2, 10);
                sheet.SetColumnWidth(3, 10);
                sheet.SetColumnWidth(4, 10);
                sheet.SetColumnWidth(5, 10);
                sheet.SetColumnWidth(6, 10);
                sheet.SetColumnWidth(7, 10);
                sheet.SetColumnWidth(8, 10);
                sheet.SetColumnWidth(9, 10);
                sheet.SetColumnWidth(10, 10);

                sheet.AutoFilters.FilterRange = sheet.Range[2, 1, 2, 13];

                IAutoFilter filter = sheet.AutoFilters[0];
                sheet.Range[2, 14].FreezePanes();

                //SET FREEZE FIRST 10 COLUMNS END

                string _fileName = string.Format("{0:yyyy_MM_dd_HH_mm_ss}", DateTime.Now);

                workbook.SaveAs(_fileName + ".xlsx", ExcelSaveType.SaveAsXLS, HttpContext.ApplicationInstance.Response, ExcelDownloadType.Open);
                return Json(new { success = true });

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }
        public ActionResult DownloadReportDataFinal(string CompanyID)
        {

            objItem = new ProductionItem();
            DataTable dt = new DataTable();
            dt = objItem.GetReportFinalData(CompanyID);

            ExcelEngine excelEngine = new ExcelEngine();
            excelEngine = new ExcelEngine();

            IApplication application = excelEngine.Excel.Application;
            application.DefaultVersion = ExcelVersion.Excel2010;

            var workbook = application.Workbooks.Create(2);

            IStyle styleToPlanReportHeaderStyle = workbook.Styles.Add("ToPlanReportHeaderStyle");
            styleToPlanReportHeaderStyle.Color = Color.Gray;
            styleToPlanReportHeaderStyle.Font.Bold = true;
            styleToPlanReportHeaderStyle.Font.Color = ExcelKnownColors.White;
            styleToPlanReportHeaderStyle.Font.Size = 8.5;
            styleToPlanReportHeaderStyle.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleToPlanReportHeaderStyle.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleToPlanReportHeaderStyle.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleToPlanReportHeaderStyle.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleToPlanReportHeaderStyle.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleToPlanReportHeaderStyle.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            styleToPlanReportHeaderStyle.WrapText = true;

            //Data Column Style
            IStyle styleToPlaReportnCellData = workbook.Styles.Add("ToPlaReportnCellData");
            styleToPlaReportnCellData.Font.Size = 9;
            styleToPlaReportnCellData.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleToPlaReportnCellData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleToPlaReportnCellData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleToPlaReportnCellData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleToPlaReportnCellData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

            IStyle stylePivotColText = workbook.Styles.Add("PivotColText");
            stylePivotColText.VerticalAlignment = ExcelVAlign.VAlignCenter;
            stylePivotColText.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            stylePivotColText.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            stylePivotColText.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            stylePivotColText.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            stylePivotColText.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            stylePivotColText.WrapText = true;

            IWorksheet pivotSheet = workbook.Worksheets[0];
            pivotSheet.Name = "Day Wise Plan Summary";

            IWorksheet sheet = workbook.Worksheets[1];
            sheet.Name = "Plan Data";

            IMigrantRange migrantRange = sheet.MigrantRange;
            int rowCount = dt.Rows.Count;
            int colCount = dt.Columns.Count;
            int _start = 1;
            List<int> numberColumnList = new List<int>();
            List<int> DateColumnList = new List<int>();

            foreach (DataColumn column in dt.Columns)
            {
                sheet[1, _start].Text = column.ColumnName;
                sheet[1, _start].CellStyle = styleToPlanReportHeaderStyle;

                if (column.ColumnName.Contains("SAM") || column.ColumnName.Contains("Target Qty")
                         || column.ColumnName.Contains("Allocated Qty") || column.ColumnName.Contains("Produce Qty")
                          || column.ColumnName.Contains("LineDayQty") || column.ColumnName.Contains("Working Hour"))
                {
                    numberColumnList.Add(_start);
                }
                else if (column.ColumnName.Contains("Plan Start Date") || column.ColumnName.Contains("PlanDate"))
                {
                    DateColumnList.Add(_start);
                }

                _start++;
            }
            _start = 1;
            for (int i = 1; i <= rowCount; i++)
            {
                sheet[i + 1, 1].Text = dt.Rows[i - 1]["Line Number"].ToString();
                sheet[i + 1, 2].Text = dt.Rows[i - 1]["UNIT"].ToString();

                sheet.Range[i + 1, 3].NumberFormat = "#,##0.00";
                sheet[i + 1, 3].Value = dt.Rows[i - 1]["Priority"].ToString();

                sheet[i + 1, 4].Text = dt.Rows[i - 1]["PRID"].ToString();
                sheet[i + 1, 5].Text = dt.Rows[i - 1]["Company"].ToString();

                sheet[i + 1, 6].Value = String.Format("{0:dd/MM/yyyy}", dt.Rows[i - 1]["Plan Start Date"].ToString());
                sheet.Range[i + 1, 6].NumberFormat = "m/d/yyyy";

                //sheet[i + 1, 7].Value = String.Format("{0:dd/MM/yyyy}", dt.Rows[i - 1]["First Produce Date"].ToString());
                //sheet.Range[i + 1, 7].NumberFormat = "m/d/yyyy";

                sheet[i + 1, 7].Value = String.Format("{0:dd/MM/yyyy}", dt.Rows[i - 1]["Line End Date"].ToString());
                sheet.Range[i + 1, 7].NumberFormat = "m/d/yyyy";

                sheet[i + 1, 8].Text = dt.Rows[i - 1]["Buyer"].ToString();
                sheet[i + 1, 9].Text = dt.Rows[i - 1]["Style"].ToString();

                sheet.Range[i + 1, 10].NumberFormat = "#,##0.00";
                sheet[i + 1, 10].Value = dt.Rows[i - 1]["SAM"].ToString();

                sheet[i + 1, 11].Text = dt.Rows[i - 1]["File Ref"].ToString();

                sheet.Range[i + 1, 12].NumberFormat = "#,##0.00";
                sheet[i + 1, 12].Value = dt.Rows[i - 1]["Order Quantity"].ToString();

                sheet.Range[i + 1, 13].NumberFormat = "#,##0.00";
                sheet[i + 1, 13].Value = dt.Rows[i - 1]["Allocated Qty"].ToString();

                sheet.Range[i + 1, 14].NumberFormat = "#,##0.00";
                sheet[i + 1, 14].Value = dt.Rows[i - 1]["Produce Qty"].ToString();

                sheet[i + 1, 15].Value = String.Format("{0:dd/MM/yyyy}", dt.Rows[i - 1]["PlanDate"].ToString());
                sheet.Range[i + 1, 15].NumberFormat = "m/d/yyyy";//Column

                sheet.Range[i + 1, 16].NumberFormat = "#,##0.00";
                sheet[i + 1, 16].Value = dt.Rows[i - 1]["LineDayQty"].ToString();//Value

               sheet[i + 1, 17].Text = dt.Rows[i - 1]["Product Category"].ToString();
                
                sheet[i + 1, 18].Text = dt.Rows[i - 1]["Style Type"].ToString();

                sheet.Range[i + 1, 19].NumberFormat = "#,##0.00";
                sheet[i + 1, 19].Value = dt.Rows[i - 1]["Working Hour"].ToString();

                sheet.Range[i + 1, 1, i + 1, 19].CellStyle = styleToPlaReportnCellData;
            }

            foreach (int dl in numberColumnList)
            {
                sheet.Range[1, dl, rowCount + 1, dl].NumberFormat = "#,##0.00";
            }

            foreach (int dl in DateColumnList)
            {
                sheet.Range[1, dl, rowCount + 1, dl].NumberFormat = "m/d/yyyy";
            }

            IPivotCache cache = workbook.PivotCaches.Add(sheet["A1:S" + rowCount]);

            //Create "PivotTable1" with the cache at the specified range
            IPivotTable pivotTable = pivotSheet.PivotTables.Add("PivotTable1", pivotSheet["A1"], cache);

            pivotTable.Fields[0].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[1].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[2].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[3].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[4].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[5].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[6].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[7].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[8].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[9].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[10].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[11].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[12].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[13].Axis = PivotAxisTypes.Row;
            //pivotTable.Fields[14].Axis = PivotAxisTypes.Row;
            pivotTable.Fields[14].Axis = PivotAxisTypes.Column;

            pivotTable.RowFields[1].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[2].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[3].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[4].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[5].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[6].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[7].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[8].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[9].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[10].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[11].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[12].Subtotals = PivotSubtotalTypes.None;
            pivotTable.RowFields[13].Subtotals = PivotSubtotalTypes.None;
            //pivotTable.RowFields[14].Subtotals = PivotSubtotalTypes.None;

            //Add data field
            IPivotField field = pivotTable.Fields[15];
            pivotTable.DataFields.Add(field, "Sum", PivotSubtotalTypes.Sum);

            pivotTable.Options.RowLayout = PivotTableRowLayout.Tabular;

            string _fileName = string.Format("{0:yyyy_MM_dd_HH_mm_ss}", DateTime.Now);

            workbook.SaveAs("Plan_Data_"+_fileName + ".xlsx", ExcelSaveType.SaveAsXLS, HttpContext.ApplicationInstance.Response, ExcelDownloadType.Open);
            return Json(new { success = true });
        }
        public ActionResult DownloadProjectionReport(string CompanyID)
        {
            objItem = new ProductionItem();
            DataTable dtAvailableMinutes = new DataTable();
            dtAvailableMinutes = objItem.GetProjectionReportAvailableMinutes(CompanyID);

            DataTable dtLineDetails = new DataTable();
            dtLineDetails = objItem.GetProjectionReportLinePlanDetails(CompanyID);

            DataTable dtOrderDetails = new DataTable();
            dtOrderDetails = objItem.GetProjectionReportOrderDetails(CompanyID);

            ExcelEngine excelEngine = new ExcelEngine();
            excelEngine = new ExcelEngine();

            IApplication application = excelEngine.Excel.Application;
            application.DefaultVersion = ExcelVersion.Excel2010;

            var workbook = application.Workbooks.Create(4);

            IWorksheet sheetLineDetails = GetLineDetails(workbook, workbook.Worksheets[0], dtLineDetails);
            IWorksheet sheetAvailableMinutes = GetAvailableMinutes(workbook, workbook.Worksheets[1], dtAvailableMinutes);
            IWorksheet sheetOrderDetails = GetOrderDetails(workbook, workbook.Worksheets[2], dtOrderDetails);

            sheetLineDetails.Name = "Line_Plan";
            sheetAvailableMinutes.Name = "Available_Min";
            sheetOrderDetails.Name = "Order_Details";

            string _fileName = string.Format("{0:yyyy_MM_dd_HH_mm_ss}", DateTime.Now);

            workbook.SaveAs(_fileName + ".xlsx", ExcelSaveType.SaveAsXLS, HttpContext.ApplicationInstance.Response, ExcelDownloadType.Open);
            return Json(new { success = true });
        }
        private IWorksheet GetOrderDetails(IWorkbook workbook, IWorksheet sheet, DataTable dt)
        {
            IStyle styleOrderDetailsHeader = workbook.Styles.Add("OrderDetailsHeader");
            styleOrderDetailsHeader.Font.Color = ExcelKnownColors.White;
            styleOrderDetailsHeader.Color = Color.Gray;
            styleOrderDetailsHeader.Font.Bold = true;
            styleOrderDetailsHeader.Font.Size = 9;
            styleOrderDetailsHeader.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleOrderDetailsHeader.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleOrderDetailsHeader.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsHeader.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsHeader.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsHeader.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsHeader.WrapText = true;

            IStyle styleOrderDetailsData = workbook.Styles.Add("OrderDetailsData");
            styleOrderDetailsData.Font.Size = 9;
            styleOrderDetailsData.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleOrderDetailsData.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleOrderDetailsData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleOrderDetailsData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

            int _start = 1;
            int _startHeader = 2;
            int _startRow = 3;
            int _startDataRow = _startRow;
            int rowCount = dt.Rows.Count;
            int colCount = dt.Columns.Count;

            sheet.Range[1, 1].Text = "Sewing Projection for " + DateTime.Now.ToString("MMMM") + "'" + DateTime.Now.Year.ToString();
            sheet.Range[1, 1].CellStyle.Font.Size = 12;
            sheet.Range[1, 1].CellStyle.Font.Bold = true;
            sheet.Range[1, 1, 1, 4].Merge();

            foreach (DataColumn column in dt.Columns)
            {
                sheet[_startHeader, _start].Text = column.ColumnName;
                sheet[_startHeader, _start].CellStyle = styleOrderDetailsHeader;
                sheet.Range[_startHeader, _start].ColumnWidth = 12;
                _start++;
            }

            int _roundColumn = 8;
            var BuyerName = "";
            var _currentBuyerName = "";

            for (int i = 1; i <= rowCount; i++)
            {
                for (int j = 1; j <= colCount; j++)
                {

                    if (j >= _roundColumn)
                    {
                        sheet.Range[_startRow, j].NumberFormat = "#,##0";
                        sheet.Range[_startRow, j].Value = dt.Rows[i - 1][j - 1].ToString();
                        sheet.Range[_startRow, j].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                        sheet.Range[_startRow, j].CellStyle.Font.Size = 9;
                    }
                    else
                    {
                        if (j == 1)
                        {
                            _currentBuyerName = dt.Rows[i - 1][j - 1].ToString();
                            if (_currentBuyerName == BuyerName)
                            {
                                sheet[_startRow, j].Text = "''";
                                sheet[_startRow, j].CellStyle = styleOrderDetailsData;
                                sheet[_startRow, j].ColumnWidth = 20;
                            }
                            else
                            {
                                sheet[_startRow, j].Value = dt.Rows[i - 1][j - 1].ToString();
                                sheet[_startRow, j].CellStyle = styleOrderDetailsData;
                                sheet[_startRow, j].CellStyle.HorizontalAlignment = ExcelHAlign.HAlignLeft;
                            }

                            BuyerName = _currentBuyerName;
                        }
                        else
                        {
                            sheet[_startRow, j].Value = dt.Rows[i - 1][j - 1].ToString();
                            sheet[_startRow, j].CellStyle = styleOrderDetailsData;

                            if (j == 2)
                            {
                                sheet[_startRow, j].ColumnWidth = 40;
                                sheet[_startRow, j].CellStyle.HorizontalAlignment = ExcelHAlign.HAlignLeft;
                            }
                        }

                    }
                }
                _startRow++;
            }

            var _TotalQtyColIndex = colCount - 3;
            var _TotalMinutesColIndex = colCount - 2;
            var _TotalFOBColIndex = colCount - 1;
            var _TotalCMColIndex = colCount;



            var _localStartAddress = sheet.Range[_startDataRow, _TotalQtyColIndex].AddressLocal;
            var _localEndAddress = sheet.Range[_startRow - 1, _TotalQtyColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].CellStyle.Color = Color.Yellow;

            _localStartAddress = sheet.Range[_startDataRow, _TotalCMColIndex].AddressLocal;
            _localEndAddress = sheet.Range[_startRow - 1, _TotalCMColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalCMColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].CellStyle.Color = Color.Yellow;

            _localStartAddress = sheet.Range[_startDataRow, _TotalFOBColIndex].AddressLocal;
            _localEndAddress = sheet.Range[_startRow - 1, _TotalFOBColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].CellStyle.Color = Color.Yellow;

            _localStartAddress = sheet.Range[_startDataRow, _TotalMinutesColIndex].AddressLocal;
            _localEndAddress = sheet.Range[_startRow - 1, _TotalMinutesColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].CellStyle.Color = Color.Yellow;

            return sheet;
        }
        private IWorksheet GetLineDetails(IWorkbook workbook, IWorksheet sheet, DataTable dt)
        {
            IStyle styleLineDetailsHeader = workbook.Styles.Add("LineDetailsHeader");
            styleLineDetailsHeader.Font.Color = ExcelKnownColors.White;
            styleLineDetailsHeader.Color = Color.Gray;
            styleLineDetailsHeader.Font.Bold = true;
            styleLineDetailsHeader.Font.Size = 9;
            styleLineDetailsHeader.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleLineDetailsHeader.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleLineDetailsHeader.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsHeader.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsHeader.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsHeader.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsHeader.WrapText = true;

            IStyle styleLineDetailsData = workbook.Styles.Add("LineDetailsData");
            styleLineDetailsData.Font.Size = 9;
            styleLineDetailsData.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleLineDetailsData.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleLineDetailsData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleLineDetailsData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

            int _start = 1;
            int _startHeader = 4;
            int _startRow = 5;
            int _startDataRow = _startRow;
            int rowCount = dt.Rows.Count;
            int colCount = dt.Columns.Count;

            foreach (DataColumn column in dt.Columns)
            {
                sheet[_startHeader, _start].Text = column.ColumnName;
                sheet[_startHeader, _start].CellStyle = styleLineDetailsHeader;
                sheet.Range[_startHeader, _start].ColumnWidth = 12;
                _start++;
            }

            int _roundColumn = 14;
            for (int i = 1; i <= rowCount; i++)
            {
                for (int j = 1; j <= colCount; j++)
                {

                    if (j >= _roundColumn)
                    {
                        sheet.Range[_startRow, j].NumberFormat = "#,##0";
                        sheet.Range[_startRow, j].Value = dt.Rows[i - 1][j - 1].ToString();
                        sheet.Range[_startRow, j].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                        sheet.Range[_startRow, j].CellStyle.Font.Size = 9;
                    }
                    else
                    {
                        sheet[_startRow, j].Value = dt.Rows[i - 1][j - 1].ToString();
                        sheet[_startRow, j].CellStyle = styleLineDetailsData;
                    }
                }
                _startRow++;
            }

            var _TotalQtyColIndex = colCount - 3;
            var _TotalCMColIndex = colCount - 2;
            var _TotalFOBColIndex = colCount - 1;
            var _TotalMinutesColIndex = colCount;

            var _localStartAddress = sheet.Range[_startDataRow, _TotalQtyColIndex].AddressLocal;
            var _localEndAddress = sheet.Range[_startRow - 1, _TotalQtyColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalQtyColIndex].CellStyle.Color = Color.Yellow;

            _localStartAddress = sheet.Range[_startDataRow, _TotalCMColIndex].AddressLocal;
            _localEndAddress = sheet.Range[_startRow - 1, _TotalCMColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalCMColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalCMColIndex].CellStyle.Color = Color.Yellow;

            _localStartAddress = sheet.Range[_startDataRow, _TotalFOBColIndex].AddressLocal;
            _localEndAddress = sheet.Range[_startRow - 1, _TotalFOBColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalFOBColIndex].CellStyle.Color = Color.Yellow;

            _localStartAddress = sheet.Range[_startDataRow, _TotalMinutesColIndex].AddressLocal;
            _localEndAddress = sheet.Range[_startRow - 1, _TotalMinutesColIndex].AddressLocal;

            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].NumberFormat = "#,##0";
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].Value = "=SUBTOTAL(9," + _localStartAddress + ":" + _localEndAddress + ")";
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].CellStyle.Font.Size = 9;
            sheet.Range[_startDataRow - 2, _TotalMinutesColIndex].CellStyle.Color = Color.Yellow;

            return sheet;
        }
        private IWorksheet GetAvailableMinutes(IWorkbook workbook, IWorksheet sheet, DataTable dt)
        {
            int _start = 1;
            int _startRow = 2;
            int _startMainRow = _startRow;
            int rowCount = dt.Rows.Count;
            int colCount = dt.Columns.Count;

            IStyle styleAvailableMinutesHeader = workbook.Styles.Add("AvailableMinutesHeader");
            styleAvailableMinutesHeader.Font.Color = ExcelKnownColors.White;
            styleAvailableMinutesHeader.Color = Color.Gray;
            styleAvailableMinutesHeader.Font.Bold = true;
            styleAvailableMinutesHeader.Font.Size = 9;
            styleAvailableMinutesHeader.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleAvailableMinutesHeader.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleAvailableMinutesHeader.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleAvailableMinutesHeader.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleAvailableMinutesHeader.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleAvailableMinutesHeader.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

            IStyle styleAvailableMinutesData = workbook.Styles.Add("AvailableMinutesData");
            styleAvailableMinutesData.Font.Size = 9;
            styleAvailableMinutesData.VerticalAlignment = ExcelVAlign.VAlignCenter;
            styleAvailableMinutesData.HorizontalAlignment = ExcelHAlign.HAlignCenter;
            styleAvailableMinutesData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
            styleAvailableMinutesData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
            styleAvailableMinutesData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
            styleAvailableMinutesData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

            ArrayList arlarrDynamicColumnsList = new ArrayList();
            int _columnStartIndex = 1;

            foreach (DataColumn column in dt.Columns)
            {
                decimal myInt = 0;
                bool isNumeric = decimal.TryParse(column.ColumnName, out myInt);
                if (isNumeric)
                    arlarrDynamicColumnsList.Add(column.ColumnName);

                sheet[1, _start].Text = column.ColumnName;
                sheet[1, _start].CellStyle = styleAvailableMinutesHeader;
                sheet.Range[1, _start].ColumnWidth = 12;
                _start++;
            }

            foreach (var item in arlarrDynamicColumnsList)
            {
                var _TotalMinutes = Convert.ToDecimal(item) * 60;
                sheet[1, _start].Text = _TotalMinutes.ToString();
                sheet[1, _start].CellStyle = styleAvailableMinutesHeader;
                _start++;
            }
            sheet[1, _start].Text = "Total";
            sheet[1, _start].CellStyle = styleAvailableMinutesHeader;

            for (int i = 1; i <= rowCount; i++)
            {
                int _vacantDays = 0;
                int _totalDays = 0;
                int _totalManpower = 0;

                for (int j = 1; j <= colCount; j++)
                {
                    sheet.Range[_startRow, j].NumberFormat = "#,##0.00";
                    sheet[_startRow, j].Value = dt.Rows[i - 1][j - 1].ToString();
                    sheet[_startRow, j].CellStyle = styleAvailableMinutesData;

                    if (j == 2)
                        _totalManpower = Convert.ToInt32(dt.Rows[i - 1][j - 1].ToString());

                    if (j == colCount)
                        _totalDays = Convert.ToInt32(dt.Rows[i - 1][j - 1].ToString());

                    if (j == colCount - 1)
                        _vacantDays = Convert.ToInt32(dt.Rows[i - 1][j - 1].ToString());
                }
                int _MinutesValue = colCount + 1;
                var _totalMinVal = 0.00;
                var _intArrIndex = 2;
                foreach (var item in arlarrDynamicColumnsList)
                {
                    if (dt.Rows[i - 1][_intArrIndex].ToString() != "")
                    {
                        var _workingHour = Convert.ToDecimal(item) * 60;
                        var _totalMinValue = _totalManpower * _totalDays * _workingHour;
                        _totalMinVal += Convert.ToDouble(_totalMinValue);

                        sheet.Range[_startRow, _MinutesValue].NumberFormat = "#,##0.00";
                        sheet[_startRow, _MinutesValue].Value = _totalMinValue.ToString();
                        sheet[_startRow, _MinutesValue].CellStyle = styleAvailableMinutesData;
                    }
                    else
                    {
                        sheet.Range[_startRow, _MinutesValue].NumberFormat = "#,##0.00";
                        sheet[_startRow, _MinutesValue].Value = "0";
                        sheet[_startRow, _MinutesValue].CellStyle = styleAvailableMinutesData;
                    }
                    _MinutesValue++;
                    _intArrIndex++;
                }
                sheet.Range[_startRow, _MinutesValue].NumberFormat = "#,##0.00";
                sheet[_startRow, _MinutesValue].Value = _totalMinVal.ToString();
                sheet[_startRow, _MinutesValue].CellStyle = styleAvailableMinutesData;

                _startRow++;
                int _footerColumn = dt.Columns.Count + arlarrDynamicColumnsList.Count + 1;

                sheet[_startRow, 1].Text = "Grand Total";
                sheet[_startRow, 1].CellStyle = styleAvailableMinutesHeader;

                for (int f = 2; f <= _footerColumn; f++)
                {
                    var _localStartAddress = sheet.Range[_startMainRow, f].AddressLocal;
                    var _localEndAddress = sheet.Range[_startRow - 1, f].AddressLocal;
                    sheet[_startRow, f].Formula = "SUM(" + _localStartAddress + ":" + _localEndAddress + ")";
                    sheet[_startRow, f].CellStyle = styleAvailableMinutesHeader;
                }
            }
            return sheet;
        }
        public ActionResult DownloadReportToPlanData(int YearNo)
        {
            UtilityDBModel _dbModel = new UtilityDBModel();
            _dbModel.YearNo = YearNo;

            DashboardItem objItem = new DashboardItem();
            DataTable dt = new DataTable();
            dt = objItem.LoadYearWiseToPlanData(_dbModel);
            try
            {
                ExcelEngine excelEngine = new ExcelEngine();
                excelEngine = new ExcelEngine();

                IApplication application = excelEngine.Excel.Application;
                application.DefaultVersion = ExcelVersion.Excel2010;

                var workbook = application.Workbooks.Create(1);

                IWorksheet sheet = workbook.Worksheets[0];
                IMigrantRange migrantRange = sheet.MigrantRange;
                int rowCount = dt.Rows.Count;
                int colCount = dt.Columns.Count;
                int _start = 1;

                //Header Column Style
                IStyle styleToPlanHeaderStyle = workbook.Styles.Add("ToPlanHeaderStyle");
                styleToPlanHeaderStyle.Color = Color.Gray;
                styleToPlanHeaderStyle.Font.Bold = true;
                styleToPlanHeaderStyle.Font.Color = ExcelKnownColors.White;
                styleToPlanHeaderStyle.Font.Size = 8.5;
                styleToPlanHeaderStyle.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleToPlanHeaderStyle.HorizontalAlignment = ExcelHAlign.HAlignCenter;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.WrapText = true;

                //Data Column Style
                IStyle styleToPlanCellData = workbook.Styles.Add("ToPlanCellData");
                styleToPlanCellData.Font.Size = 9;
                styleToPlanCellData.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

                var _dataRowID = 1;
                foreach (DataColumn column in dt.Columns)
                {
                    sheet[_dataRowID, _start].Text = column.ColumnName;
                    sheet[_dataRowID, _start].CellStyle = styleToPlanHeaderStyle;
                    _start++;
                }
                _dataRowID++;
                var _rowIndex = 0;

                for (int i = 1; i <= rowCount; i++)
                {
                    for (int j = 1; j <= colCount; j++)
                    {
                        sheet[_dataRowID, j].Text = dt.Rows[_rowIndex][j - 1].ToString();
                        sheet[_dataRowID, j].CellStyle = styleToPlanCellData;
                    }
                    _dataRowID++;
                    _rowIndex++;
                }

                string _fileName = string.Format("{0:yyyy_MM_dd_HH_mm_ss}", DateTime.Now);

                workbook.SaveAs(_fileName + ".xlsx", ExcelSaveType.SaveAsXLS, HttpContext.ApplicationInstance.Response, ExcelDownloadType.Open);
                return Json(new { success = true });

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }
        public ActionResult BuyerWiseExportOrderStatus(string CompanyID)
        {
            SqlDataAdapter sqlDa = new SqlDataAdapter();
            DataTable dt = new DataTable();
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();

            SqlCommand dCmd = new SqlCommand("BIMOB.dbo.VGSpBuyerWiseExportOrderStatusAndRollingGoodsQty", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.Parameters.AddWithValue("@CompanyID", CompanyID);
            dCmd.CommandTimeout = 0;
            sqlDa.SelectCommand = dCmd;
            sqlDa.Fill(dt);

            try
            {
                ExcelEngine excelEngine = new ExcelEngine();
                excelEngine = new ExcelEngine();

                IApplication application = excelEngine.Excel.Application;
                application.DefaultVersion = ExcelVersion.Excel2010;

                var workbook = application.Workbooks.Create(1);

                IWorksheet sheet = workbook.Worksheets[0];
                IMigrantRange migrantRange = sheet.MigrantRange;
                int rowCount = dt.Rows.Count;
                int colCount = dt.Columns.Count;
                int _start = 1;

                //Header Column Style
                IStyle styleToPlanHeaderStyle = workbook.Styles.Add("ToPlanHeaderStyle");
                styleToPlanHeaderStyle.Color = Color.Gray;
                styleToPlanHeaderStyle.Font.Bold = true;
                styleToPlanHeaderStyle.Font.Color = ExcelKnownColors.White;
                styleToPlanHeaderStyle.Font.Size = 8.5;
                styleToPlanHeaderStyle.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleToPlanHeaderStyle.HorizontalAlignment = ExcelHAlign.HAlignCenter;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                styleToPlanHeaderStyle.WrapText = true;

                //Data Column Style
                IStyle styleToPlanCellData = workbook.Styles.Add("ToPlanCellData");
                styleToPlanCellData.Font.Size = 9;
                styleToPlanCellData.VerticalAlignment = ExcelVAlign.VAlignCenter;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                styleToPlanCellData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

                var _dataRowID = 1;
                List<int> numberColumnList = new List<int>();
                List<int> DateColumnList = new List<int>();
                foreach (DataColumn column in dt.Columns)
                {
                    sheet[_dataRowID, _start].Text = column.ColumnName;
                    sheet[_dataRowID, _start].CellStyle = styleToPlanHeaderStyle;
                    if (column.ColumnName.Contains("OrderQty") || column.ColumnName.Contains("ShippedQty")
                         || column.ColumnName.Contains("FOB") || column.ColumnName.Contains("PROJECTED CM")
                          || column.ColumnName.Contains("File Qty") || column.ColumnName.Contains("PrecostSAM")
                          || column.ColumnName.Contains("PrecostCM") || column.ColumnName.Contains("PrecostCM"))
                    {
                        numberColumnList.Add(_start);
                    }
                    else if (column.ColumnName.Contains("FileAdded system Date") || column.ColumnName.Contains("Export PO System Added Date")
                         || column.ColumnName.Contains("ShipDate") || column.ColumnName.Contains("Ex Factory Date")
                          || column.ColumnName.Contains("Fabric First Inhance Date") || column.ColumnName.Contains("Fabric Second Inhance Date")
                          || column.ColumnName.Contains("Trims First Inhance Date") || column.ColumnName.Contains("Trims Second Inhance Date")
                          || column.ColumnName.Contains("PCD"))
                    {
                        DateColumnList.Add(_start);
                    }
                    _start++;
                }
                //sheet[i + 1, 6].Value = String.Format("{0:dd/MM/yyyy}", dt.Rows[i - 1]["Plan Start Date"].ToString());
                //sheet.Range[i + 1, 6].NumberFormat = "m/d/yyyy";
                _dataRowID++;
                var _rowIndex = 0;

                for (int i = 1; i <= rowCount; i++)
                {
                    for (int j = 1; j <= colCount; j++)
                    {
                        string _cellValue = dt.Rows[_rowIndex][j - 1].ToString();

                        bool trueInList = numberColumnList.Contains(j);
                        bool trueDateInList = DateColumnList.Contains(j);

                        if (trueInList)
                        {
                            sheet.Range[_dataRowID, j].NumberFormat = "#,##0.00";
                            sheet[_dataRowID, j].Value = _cellValue;
                        }
                        else if (trueDateInList)
                        {
                            //sheet[_dataRowID, j].Value = String.Format("{0:dd/MM/yyyy}", _cellValue);
                            sheet.Range[_dataRowID, j].NumberFormat = "m/d/yyyy";
                            if (_cellValue != null && _cellValue != "")
                                sheet[_dataRowID, j].DateTime = Convert.ToDateTime(_cellValue);
                        }
                        else
                        {
                            sheet[_dataRowID, j].Text = _cellValue;
                        }

                        sheet[_dataRowID, j].CellStyle = styleToPlanCellData;

                    }
                    _dataRowID++;
                    _rowIndex++;
                }
                foreach (int dl in DateColumnList)
                {
                    sheet.Range[2, dl, rowCount + 1, dl].NumberFormat = "m/d/yyyy";
                }

                string _fileName = string.Format("{0:yyyy_MM_dd_HH_mm_ss}", DateTime.Now);

                workbook.SaveAs("Order_Status_Data_" + _fileName + ".xlsx", ExcelSaveType.SaveAsXLS, HttpContext.ApplicationInstance.Response, ExcelDownloadType.Open);
                return Json(new { success = true });

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }
        public ActionResult DownloadPRStatusData()
        {
            PRInformationList _objList = new PRInformationList();

            DashboardItem objItem = new DashboardItem();
            DataTable dt = new DataTable();

            dt = _objList.PRStatusInformationData();

            try
            {
                ExcelEngine excelEngine = new ExcelEngine();
                excelEngine = new ExcelEngine();

                IApplication application = excelEngine.Excel.Application;
                application.DefaultVersion = ExcelVersion.Excel2010;

                var workbook = application.Workbooks.Create(1);

                IWorksheet sheet = workbook.Worksheets[0];
                IMigrantRange migrantRange = sheet.MigrantRange;
                int rowCount = dt.Rows.Count;
                int colCount = dt.Columns.Count;
                int _start = 1;

                //Header Column Style
                IStyle stylePRStatusHeaderStyle = workbook.Styles.Add("PRStatusHeaderStyle");
                stylePRStatusHeaderStyle.Color = Color.Gray;
                stylePRStatusHeaderStyle.Font.Bold = true;
                stylePRStatusHeaderStyle.Font.Color = ExcelKnownColors.White;
                stylePRStatusHeaderStyle.Font.Size = 8.5;
                stylePRStatusHeaderStyle.VerticalAlignment = ExcelVAlign.VAlignCenter;
                stylePRStatusHeaderStyle.HorizontalAlignment = ExcelHAlign.HAlignCenter;
                stylePRStatusHeaderStyle.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusHeaderStyle.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusHeaderStyle.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusHeaderStyle.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusHeaderStyle.WrapText = true;

                //Data Column Style
                IStyle stylePRStatusData = workbook.Styles.Add("PRStatusData");
                stylePRStatusData.Font.Size = 9;
                stylePRStatusData.VerticalAlignment = ExcelVAlign.VAlignCenter;
                stylePRStatusData.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusData.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusData.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.Thin;
                stylePRStatusData.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.Thin;

                var _dataRowID = 1;
                foreach (DataColumn column in dt.Columns)
                {
                    sheet[_dataRowID, _start].Text = column.ColumnName;
                    sheet[_dataRowID, _start].CellStyle = stylePRStatusHeaderStyle;
                    _start++;
                }
                _dataRowID++;
                var _rowIndex = 0;

                for (int i = 1; i <= rowCount; i++)
                {
                    for (int j = 1; j <= colCount; j++)
                    {
                        sheet[_dataRowID, j].Text = dt.Rows[_rowIndex][j - 1].ToString();
                        sheet[_dataRowID, j].CellStyle = stylePRStatusData;
                    }
                    _dataRowID++;
                    _rowIndex++;
                }

                string _fileName = string.Format("{0:yyyy_MM_dd_HH_mm_ss}", DateTime.Now);

                workbook.SaveAs("PR_STATUS_"+_fileName + ".xlsx", ExcelSaveType.SaveAsXLS, HttpContext.ApplicationInstance.Response, ExcelDownloadType.Open);
                return Json(new { success = true });

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }
    }
}