using Common;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class AdditionalPRList
    {
        public string SaveData(AdditionalPRDBModel _dbModel)
        {
            int _result = 0;
            DataTable dtLine = new DataTable();
            if (_dbModel.arrLineInformationDBModel != null && _dbModel.arrLineInformationDBModel.Length > 0)
            {
                dtLine = ConvertLineModelToDataTable(_dbModel.arrLineInformationDBModel);
            }

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                SqlParameter OutAPRID = new SqlParameter("@OUTPUT", SqlDbType.VarChar, 50) { Direction = ParameterDirection.Output };
                dCmd.Parameters.AddWithValue("@APRID", _dbModel.APRID);
                dCmd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
                dCmd.Parameters.AddWithValue("@BuyerID", _dbModel.BuyerID);
                dCmd.Parameters.AddWithValue("@StyleID", _dbModel.StyleID);
                dCmd.Parameters.AddWithValue("@FileRefID ", _dbModel.FileRefID);
                dCmd.Parameters.AddWithValue("@Qty ", _dbModel.Qty);
                dCmd.Parameters.AddWithValue("@PCD ", _dbModel.PCD);
                dCmd.Parameters.AddWithValue("@SAM ", _dbModel.SAM);
                dCmd.Parameters.AddWithValue("@CM ", _dbModel.CM);
                dCmd.Parameters.AddWithValue("@TotalWorkMinutes ", _dbModel.TotalWorkMinutes);
                dCmd.Parameters.AddWithValue("@StyleType ", _dbModel.StyleType);
                dCmd.Parameters.AddWithValue("@FOB ", _dbModel.FOB);
                dCmd.Parameters.AddWithValue("@Reason ", _dbModel.Reason);
                dCmd.Parameters.AddWithValue("@PriorityNo ", _dbModel.PriorityNo);
                dCmd.Parameters.AddWithValue("@IsRepeatedOrder ", _dbModel.IsRepeatedOrder);
                dCmd.Parameters.AddWithValue("@tblPRLineInfo", dtLine);
                dCmd.Parameters.AddWithValue("@AddedBy ", SessionVar.EmployeeCode);
                dCmd.Parameters.Add(OutAPRID);

                if (_dbModel.APRID != "<NEW>")
                    dCmd.Parameters.AddWithValue("@QryOption", 2);
                else
                    dCmd.Parameters.AddWithValue("@QryOption", 1);
                _result = dCmd.ExecuteNonQuery();

                if (_result > 0)
                {
                    return OutAPRID.Value.ToString();
                }
                else
                {
                    return "Failed";
                }
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
            dt.Columns.AddRange(new DataColumn[7] {
                    new DataColumn("LineNumber", typeof(int)),
                    new DataColumn("WorkStation", typeof(int)),
                    new DataColumn("AverageEfficiency", typeof(decimal)),
                    new DataColumn("TargetQty", typeof(int)),
                    new DataColumn("PlanStartDate", typeof(DateTime)),
                    new DataColumn("PriorityNo", typeof(decimal)),
                    new DataColumn("IsFixed", typeof(bool))
            });

            foreach (var dbModel in arrLineInformationDBModel)
            {
                int LineNumber = dbModel.LineNumber;
                int WorkStation = dbModel.WorkStation;
                decimal AverageEfficiency = dbModel.AverageEfficiency;
                int TargetQty = dbModel.TargetQty;
                DateTime PlanStartDate = dbModel.PlanStartDate;
                decimal PriorityNo = dbModel.PriorityNo;
                bool IsFixed = dbModel.IsFixed;
                dt.Rows.Add(LineNumber, WorkStation, AverageEfficiency, TargetQty, PlanStartDate, PriorityNo, IsFixed);
            }
            return dt;
        }
        public DataSet LoadDDLData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 6);
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
        public DataSet LoadFileByBuyer(string BuyerID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@BuyerID", BuyerID);
            dAd.Parameters.AddWithValue("@QryOption", 7);
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
        public DataSet LoadAllData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 3);
            dAd.Parameters.AddWithValue("@EmployeeCode", SessionVar.EmployeeCode);
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
        public DataSet LoadSelectedData(string APRID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@APRID", APRID);
            dAd.Parameters.AddWithValue("@QryOption", 4);
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
        public int DeleteData(AdditionalPRDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@APRID", _dbModel.APRID);
                dCmd.Parameters.AddWithValue("@QryOption", 5);

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
        public DataTable LoadCompanyWiseLineInformation(AdditionalPRDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_ADDITIONAL_PR_QTY_MASTER", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
            dAd.Parameters.AddWithValue("@QryOption", 8);
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
