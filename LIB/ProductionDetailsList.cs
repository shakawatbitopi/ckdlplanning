using Common;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class ProductionDetailsList
    {
        public DataTable LoadPRInformation()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 8);
            dAd.Parameters.AddWithValue("@EmployeeCode", SessionVar.EmployeeCode);
            DataTable dSet = new DataTable();
            try
            {
                sda.Fill(dSet);
                return dSet;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dSet.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public DataSet LoadBulletinDetails(ProductionDetailsDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@QryOption", 9);
            DataSet dSet = new DataSet();
            try
            {
                sda.Fill(dSet);
                return dSet;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dSet.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public int SavePRInformation(ProductionDetailsDBModel _dbModel)
        {
            DataTable dtLine = new DataTable();

            if (_dbModel.arrLineInformationDBModel != null && _dbModel.arrLineInformationDBModel.Length > 0)
            {
                dtLine = ConvertLineModelToDataTable(_dbModel.arrLineInformationDBModel);
            }

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_SET_MASTER_INFORMATION", conn);
            dCmd.CommandTimeout = 0;
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
                dCmd.Parameters.AddWithValue("@TotalWorkMinutes", _dbModel.TotalWorkMinutes);
                dCmd.Parameters.AddWithValue("@SelectedQty", _dbModel.SelectedQty);
                dCmd.Parameters.AddWithValue("@ExcessQty", _dbModel.ExcessQty);
                dCmd.Parameters.AddWithValue("@PlannedProduction", _dbModel.PlannedProduction);
                dCmd.Parameters.AddWithValue("@SAM", _dbModel.SAM);
                dCmd.Parameters.AddWithValue("@TotalWorkStation", _dbModel.TotalWorkStation);
                dCmd.Parameters.AddWithValue("@HourlyTarget100PercentEffeincy", _dbModel.HourlyTarget100PercentEffeincy);
                dCmd.Parameters.AddWithValue("@OrgEfficiency", _dbModel.OrgEfficiency);
                dCmd.Parameters.AddWithValue("@HourlyTargetOrgPercentEffeincy", _dbModel.HourlyTargetOrgPercentEffeincy);
                dCmd.Parameters.AddWithValue("@DailyTargetPerLine", _dbModel.DailyTargetPerLine);
                dCmd.Parameters.AddWithValue("@FirstDayOutput", _dbModel.FirstDayOutput);
                dCmd.Parameters.AddWithValue("@IncrementType", _dbModel.IncrementType);
                dCmd.Parameters.AddWithValue("@IncrementQty", _dbModel.IncrementQty);
                dCmd.Parameters.AddWithValue("@LineDaysRequire", _dbModel.LineDaysRequire);
                dCmd.Parameters.AddWithValue("@MinLineDays", _dbModel.MinLineDays);
                dCmd.Parameters.AddWithValue("@LineAllocated", _dbModel.LineAllocated);
                dCmd.Parameters.AddWithValue("@FinishDays", _dbModel.FinishDays);
                dCmd.Parameters.AddWithValue("@ExFactoryDate", _dbModel.ExFactoryDate);
                dCmd.Parameters.AddWithValue("@PlanStartDate", _dbModel.PlanStartDate);
                dCmd.Parameters.AddWithValue("@PriorityNo", _dbModel.PriorityNo);
                dCmd.Parameters.AddWithValue("@BulletinID", _dbModel.BulletinID);
                dCmd.Parameters.AddWithValue("@tblPRLine", dtLine);
                dCmd.Parameters.AddWithValue("@QryOption", 1);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                return dCmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dCmd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        private DataTable ConvertLineModelToDataTable(LineInformationDBModel[] arrLineInformationDBModel)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[11] {
                    new DataColumn("LineNumber", typeof(int)),
                    new DataColumn("WorkStation", typeof(int)),
                    new DataColumn("AverageEfficiency", typeof(decimal)),
                    new DataColumn("TargetQty", typeof(int)),
                    new DataColumn("PlanStartDate", typeof(DateTime)),
                    new DataColumn("PlanEndDate", typeof(DateTime)),
                    new DataColumn("HourlyTarget", typeof(int)),
                    new DataColumn("DailyLineTarget", typeof(int)),
                    new DataColumn("FirstDayOutput", typeof(int)),
                    new DataColumn("IncrementQty", typeof(int)),
                    new DataColumn("PriorityNo", typeof(decimal))
            });

            foreach (var dbModel in arrLineInformationDBModel)
            {
                if (dbModel.TargetQty > 0)
                {
                    int LineNumber = dbModel.LineNumber;
                    int WorkStation = dbModel.WorkStation;
                    decimal AverageEfficiency = dbModel.AverageEfficiency;
                    int TargetQty = dbModel.TargetQty;
                    DateTime PlanStartDate = Convert.ToDateTime(dbModel.PlanStartDate);
                    DateTime PlanEndDate = Convert.ToDateTime(dbModel.PlanEndDate);
                    int HourlyTarget = dbModel.HourlyTarget;
                    int DailyLineTarget = dbModel.DailyLineTarget;
                    int FirstDayOutput = dbModel.FirstDayOutput;
                    int IncrementQty = dbModel.IncrementQty;
                    decimal PriorityNo = dbModel.PriorityNo;
                    dt.Rows.Add(LineNumber, WorkStation, AverageEfficiency, TargetQty, PlanStartDate, PlanEndDate, HourlyTarget, DailyLineTarget, FirstDayOutput, IncrementQty, PriorityNo);
                }
            }
            return dt;
        }
        public DataTable GetLineInformationDetails(ProductionDetailsDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@QryOption", 11);
            DataTable dSet = new DataTable();
            try
            {
                sda.Fill(dSet);
                return dSet;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dSet.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public DataTable LoadPreviewData(ProductionDetailsDBModel _dbModel)
        {
            string[] Numbers = _dbModel.LineNumbers.Split('&');
            List<string> NumberList = new List<string>();
            foreach (var number in Numbers)
            {
                string[] value = number.Split('=');
                NumberList.Add(value[0]);
            }

            string LineNumbers = string.Join(",", NumberList);

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_AUTO_PLAN_DATE_QTY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PlannedProduction", _dbModel.PlannedProduction);
            dAd.Parameters.AddWithValue("@PlanStartDate", _dbModel.PlanStartDate);
            dAd.Parameters.AddWithValue("@FirstDayOutput", _dbModel.FirstDayOutput);
            dAd.Parameters.AddWithValue("@IncrementQty", _dbModel.IncrementQty);
            dAd.Parameters.AddWithValue("@DailyTargetPerLine", _dbModel.DailyTargetPerLine);
            dAd.Parameters.AddWithValue("@TotalWorkMinutes", _dbModel.TotalWorkMinutes);
            dAd.Parameters.AddWithValue("@LineNumbers", LineNumbers);
            dAd.Parameters.AddWithValue("@SAM", _dbModel.SAM);
            dAd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
            dAd.CommandTimeout = 0;
            DataTable dSet = new DataTable();
            try
            {
                sda.Fill(dSet);
                return dSet;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dSet.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
    }
}
