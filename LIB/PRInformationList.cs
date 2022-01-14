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
    public class PRInformationList
    {
        public DataSet LoadExportOrderAndLineNumber(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@FileRefID", _dbModel.FileRefID);
            dAd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
            dAd.Parameters.AddWithValue("@QryOption", 1);
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
        public string SaveProductionReference(ProductionReferenceDBModel _dbModel)
        {
            DataTable dtEO = new DataTable();
            DataTable dtLine = new DataTable();

            if (_dbModel.arrEOInformationDBModel != null && _dbModel.arrEOInformationDBModel.Length > 0)
            {
                dtEO = ConvertEOModelToDataTable(_dbModel.arrEOInformationDBModel);
            }


            if (_dbModel.arrLineInformationDBModel != null && _dbModel.arrLineInformationDBModel.Length > 0)
            {
                dtLine = ConvertLineModelToDataTable(_dbModel.arrLineInformationDBModel);
            }

            int _result = 0;
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.CommandTimeout = 0;
            try
            {
                SqlParameter OutPRID = new SqlParameter("@OUTPUT", SqlDbType.VarChar, 50) { Direction = ParameterDirection.Output };
                dCmd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
                dCmd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
                dCmd.Parameters.AddWithValue("@BuyerID", _dbModel.BuyerID);
                dCmd.Parameters.AddWithValue("@ProductType", _dbModel.ProductType);
                dCmd.Parameters.AddWithValue("@FileRefID", _dbModel.FileRefID);
                dCmd.Parameters.AddWithValue("@StyleType", _dbModel.StyleType);
                dCmd.Parameters.AddWithValue("@SelectedQty", _dbModel.SelectedQty);
                dCmd.Parameters.AddWithValue("@ExcessQty", _dbModel.ExcessQty);
                dCmd.Parameters.AddWithValue("@PlannedProduction", _dbModel.PlannedProduction);
                dCmd.Parameters.AddWithValue("@BulletinID", _dbModel.BulletinID);
                dCmd.Parameters.AddWithValue("@SAM", _dbModel.SAM);
                dCmd.Parameters.AddWithValue("@PCD", _dbModel.PCD);
                dCmd.Parameters.AddWithValue("@PlanStartDate", _dbModel.PlanStartDate);
                dCmd.Parameters.AddWithValue("@LineAllocated", _dbModel.LineAllocated);
                dCmd.Parameters.AddWithValue("@WorkingMinutes", _dbModel.WorkingMinutes);
                dCmd.Parameters.AddWithValue("@Status", _dbModel.Status);
                dCmd.Parameters.AddWithValue("@IsRepeatedOrder", _dbModel.IsRepeatedOrder);
                dCmd.Parameters.AddWithValue("@PriorityNo", _dbModel.PriorityNo);
                dCmd.Parameters.AddWithValue("@QuantityFactor", _dbModel.QuantityFactor);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@tblPREO", dtEO);
                dCmd.Parameters.AddWithValue("@tblPRLineInfo", dtLine);
                dCmd.Parameters.Add(OutPRID);

                if (_dbModel.PRID != "<NEW>")
                    dCmd.Parameters.AddWithValue("@QryOption", 5);
                else
                    dCmd.Parameters.AddWithValue("@QryOption", 2);
                _result = dCmd.ExecuteNonQuery();

                if (_result > 0)
                {
                    return OutPRID.Value.ToString();
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
        private DataTable ConvertEOModelToDataTable(EOInformationDBModel[] arrEOInformationDBModel)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[2] {
                    new DataColumn("ExportOrderID", typeof(string)),
                    new DataColumn("SelectedQty", typeof(int))
            });

            foreach (var dbModel in arrEOInformationDBModel)
            {
                string ExportOrderID = dbModel.ExportOrderID;
                int SelectedQty = dbModel.SelectedQty;
                dt.Rows.Add(ExportOrderID, SelectedQty);
            }
            return dt;
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
        public DataSet LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@QryOption", 3);
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
        public DataTable LoadFileRefData(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@BuyerID", _dbModel.BuyerID);
            dAd.Parameters.AddWithValue("@ProductType", _dbModel.ProductType);
            dAd.Parameters.AddWithValue("@QryOption", 4);
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
        public DataTable GetSelectedPRLineNumber(string PRID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRID", PRID);
            dAd.Parameters.AddWithValue("@QryOption", 6);
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
        public DataTable GetSelectedEODetails(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
            dAd.Parameters.AddWithValue("@FileRefID", _dbModel.FileRefID);
            dAd.Parameters.AddWithValue("@QryOption", 7);
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
        public DataTable GetSamWiseEfficiency(ProductionDetailsDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@SAM", _dbModel.SAM);
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
            dAd.Parameters.AddWithValue("@StyleType", _dbModel.StyleType);
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
        public DataTable LoadPendingProcessLineNumber()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 14);
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
        public int ProcessPlanData(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_SET_PR_PROCESS", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
                dCmd.Parameters.AddWithValue("@Addedby", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@QryOption", 1);
                dCmd.CommandTimeout = 0;
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
        public DataTable LoadFileRefWisePR()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_PROCESS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 2);
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
        public DataTable SelectedLineSequence(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_PROCESS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 3);
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
        public DataTable LoadPRWiseStatus(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_PROCESS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@Status", _dbModel.Status);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 4);
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
        public DataTable GetPRLineEfficiencyMatrix(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 5);
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
        public DataTable PRStatusInformationData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 12);
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
        public int UpdatePRStatusInformationData(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_UTILITY", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
                dCmd.Parameters.AddWithValue("@Status", _dbModel.Status);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@QryOption", 13);
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
    }
}
