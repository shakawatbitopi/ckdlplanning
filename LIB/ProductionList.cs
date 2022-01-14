using Common;
using Model;
using System;
using System.Collections;
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
    public class ProductionList
    {
        public DataSet LoadAllPRInformation()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 1);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
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
        public DataSet LoadPlanDateInformation(ProductionDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@UnitID", _dbModel.UnitID);
            dAd.Parameters.AddWithValue("@QryOption", 2);
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
        public DataTable LoadAllPlanData(string CompanyID, DateTime EndDate)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PLANNING_BOARD", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);
            dAd.Parameters.AddWithValue("@EndDate", EndDate);
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
        public int SaveProductionUpdate(ProductionDBModel[] _dbModel)
        {
            DataTable dtLine = new DataTable();

            if (_dbModel != null && _dbModel.Length > 0)
            {
                dtLine = ConvertModelToDataTable(_dbModel);
            }

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.CommandTimeout=0;
            try
            {
                dCmd.Parameters.AddWithValue("@tblProduceQty", dtLine);
                dCmd.Parameters.AddWithValue("@QryOption", 3);
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

        private DataTable ConvertModelToDataTable(ProductionDBModel[] _dbModel)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[4] {
                    new DataColumn("PRMasterID", typeof(int)),
                    new DataColumn("PlanDate", typeof(DateTime)),
                    new DataColumn("LineNumber", typeof(int)),
                    new DataColumn("ProduceQty", typeof(int))
            });

            foreach (var dbModel in _dbModel)
            {
                int PRMasterID = Convert.ToInt32(dbModel.PRMasterID);
                DateTime PlanDate = DateTime.ParseExact(dbModel.PlanDate.ToString(), "dd/MM/yyyy", CultureInfo.InvariantCulture);//DateTime.ParseExact(dbModel.PlanDate, "dd-MMM-yyyy", null);
                int LineNumber = Convert.ToInt32(dbModel.LineNumber);
                int ProduceQty = Convert.ToInt32(dbModel.DayQty);
                dt.Rows.Add(PRMasterID, PlanDate, LineNumber, ProduceQty);
            }
            return dt;
        }
        public int SaveProductionUpdateData(ProductionDBModel[] _dbModel)
        {
            int _return = 1;
            SqlTransaction objTrans = null;
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            objTrans = conn.BeginTransaction();
            try
            {
                foreach (var item in _dbModel)
                {
                    DateTime PlanDate = DateTime.ParseExact(item.PlanDate.ToString(), "dd/MM/yyyy", CultureInfo.InvariantCulture);

                    SqlCommand dCmd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn, objTrans);
                    dCmd.CommandType = CommandType.StoredProcedure;

                    dCmd.Parameters.AddWithValue("@PRMasterID", item.PRMasterID);
                    dCmd.Parameters.AddWithValue("@LineNumber", item.LineNumber);
                    dCmd.Parameters.AddWithValue("@ProduceQty", item.DayQty);
                    dCmd.Parameters.AddWithValue("@PlanDate", PlanDate);
                    dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                    dCmd.Parameters.AddWithValue("@QryOption", 6);
                    dCmd.ExecuteNonQuery();
                    dCmd.Dispose();
                }
                objTrans.Commit();
                return _return;
            }
            catch (Exception ex)
            {
                objTrans.Rollback();
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                objTrans.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public DataSet LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public DataTable LoadAllPlanBoardPR()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 15);
            DataTable dt = new DataTable();
            try
            {
                sda.Fill(dt);
                return dt;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dt.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public DataTable LoadPRInformationWithDateByID(string PRMasterID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", PRMasterID);
            dAd.Parameters.AddWithValue("@QryOption", 16);
            DataTable dt = new DataTable();
            try
            {
                sda.Fill(dt);
                return dt;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dt.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public int CheckPlanDate(ProductionDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@PlanDate", _dbModel.PlanDate);
            dAd.Parameters.AddWithValue("@QryOption", 4);
            DataTable dt = new DataTable();
            try
            {
                sda.Fill(dt);
                return dt.Rows.Count;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dt.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public DataTable GetPRLineDateInformation(ProductionDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
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
        public DataSet LoadAllPlaningBoardData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PLANNING_BOARD_DATA", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            DataSet dt = new DataSet();
            try
            {
                sda.Fill(dt);
                return dt;
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                dt.Dispose();
                dAd.Dispose();
                conn.Close();
                conn.Dispose();
            }
        }
        public DataTable GetReportsCompanyInformation()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 21);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
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
        public DataTable DownloadReportData(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_REPORT_PLAN_DATA", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);
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
        public DataTable GetLineDetails(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@LineNumber", Convert.ToInt32(_dbModel.LineNumber.Trim()));
            dAd.Parameters.AddWithValue("@QryOption", 9);
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
        public DataTable GetPRLineQty(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@QryOption", 10);
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
        public DataTable GetPRLineInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public DataTable GetPREOInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public DataTable GetPRWiseProduceQty(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@QryOption", 13);
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
        public DataTable LoadSidebarPRInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public DataTable GetReportFinalData(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 8);
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);
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
        public DataTable GetProjectionReportAvailableMinutes(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_REPORT_PROJECTION_AVAILABLE_MINITES", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);
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
        public DataTable GetProjectionReportLinePlanDetails(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_REPORT_LINE_PLAN_DETAILS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);
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
        public DataTable GetProjectionReportOrderDetails(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_REPORT_ORDER_DETAILS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);
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
        public DataTable GetProductionUpdateData(ProductionDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PlanDate", _dbModel.PlanDate);
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 10);
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
        public int UpdateMissingDates(ProductionDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_PRODUCTION_UPDATE", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.CommandTimeout = 0;
            try
            {
                dCmd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
                dCmd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);                
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@QryOption", 7);
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
