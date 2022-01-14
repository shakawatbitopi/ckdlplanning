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
    public class ProductionReferenceList
    {
        public DataSet LoadMasterInformation()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
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

        public DataTable LoadFileRefData(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@BuyerID", _dbModel.BuyerID);
            dAd.Parameters.AddWithValue("@ProductType", _dbModel.ProductType);
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
        public DataTable LoadExportOrder(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@FileRefID", _dbModel.FileRefID);
            dAd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
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
        public string SaveProductionReference(ProductionReferenceDBModel _dbModel)
        {
            DataTable dtLine = new DataTable();

            if (_dbModel.arrEOInformationDBModel != null && _dbModel.arrEOInformationDBModel.Length > 0)
            {
                dtLine = ConvertLineModelToDataTable(_dbModel.arrEOInformationDBModel);
            }

            int _result = 0;
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
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
                dCmd.Parameters.AddWithValue("@ExportOrderID", _dbModel.ExportOrderID);
                dCmd.Parameters.AddWithValue("@Status", _dbModel.Status);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@tblPREO", dtLine);
                dCmd.Parameters.Add(OutPRID);

                if (_dbModel.PRID != "<NEW>")
                    dCmd.Parameters.AddWithValue("@QryOption", 5);
                else
                    dCmd.Parameters.AddWithValue("@QryOption", 4);
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
        private DataTable ConvertLineModelToDataTable(EOInformationDBModel[] arrEOInformationDBModel)
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
        public DataTable LoadAllPRInformation()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure; 
            dAd.Parameters.AddWithValue("@QryOption", 6);
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
        public DataSet LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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

        public DataTable LoadCancelledEO()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 18);
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

        public DataTable LoadCancelledEOCount()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 19);
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
        public DataTable LoadEOQtyStatus()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 20);
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
        public int DeleteSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_DELETE_PR", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.CommandTimeout = 0;
            try
            {
                dCmd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public DataTable LoadCancelledEOLineNo(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UPDATE_CANCEL_EO_QTY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
            dAd.Parameters.AddWithValue("@QryOption", 1);
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

        public int UpdateCancelledEOLineNo(DataTable dtEO)
        {
            SqlConnection sqlConnection = new SqlConnection(DBConnection.GetConnection());
            SqlTransaction transaction;

            sqlConnection.Open();
            transaction = sqlConnection.BeginTransaction();
            try
            {
                foreach (DataRow dr in dtEO.Rows)
                {
                    new SqlCommand("UPDATE PRLine SET TargetQty= TargetQty - " + Convert.ToInt32(dr["ReduceQty"].ToString()) + " WHERE PRMasterID = " + dr["PRMasterID"] + " AND LineNumber = " + dr["LineNumber"] + "", sqlConnection, transaction).ExecuteNonQuery();
                    new SqlCommand("EXEC [dbo].[PR_WEB_SINGLE_LINE_PROCESS] "+SessionVar.EmployeeCode+ "," + dr["LineNumber"] + "", sqlConnection, transaction).ExecuteNonQuery();
                    new SqlCommand("INSERT Qwery3", sqlConnection, transaction).ExecuteNonQuery();
                }
                transaction.Commit();

                return 1;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {
                sqlConnection.Close();
            }
        }
        public DataTable GetPREOStatus(ProductionReferenceDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_CANCELLED_EO", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@QryOption", 1);
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
