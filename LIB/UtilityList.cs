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
    public class UtilityList
    {
        public DataTable GetLineNumber()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
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
        public DataTable LoadSelectedLineDetails(UtilityDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
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
        public int ProcessLineNumberManually(UtilityDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_UTILITY", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
                dCmd.Parameters.AddWithValue("@QryOption", 3);
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
        public int UpdateEOQuantity(ProductionReferenceDBModel _dbModel)
        {
            DataTable dtEO = new DataTable();

            if (_dbModel.arrEOInformationDBModel != null && _dbModel.arrEOInformationDBModel.Length > 0)
            {
                dtEO = ConvertEOModelToDataTable(_dbModel.arrEOInformationDBModel);
            }

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_SET_PR_INFORMATION", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.CommandTimeout = 0;
            try
            {
                dCmd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
                dCmd.Parameters.AddWithValue("@SelectedQty", _dbModel.SelectedQty);
                dCmd.Parameters.AddWithValue("@PlannedProduction", _dbModel.PlannedProduction);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@tblPREO", dtEO);
                dCmd.Parameters.AddWithValue("@QryOption", 15);

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
        public DataTable LoadUnMappedFileRef(UtilityDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@YearNo", _dbModel.YearNo);
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
        public static bool GetPermisssion(int MenusId, string EmployeeCode)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SP_SET_MENU_PERMISSION", conn);
            dAd.Parameters.AddWithValue("@MenuSubCategoryID", MenusId);
            dAd.Parameters.AddWithValue("@EmployeeCode", EmployeeCode);
            dAd.Parameters.AddWithValue("@QryOption", 7);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            try
            {
                DataTable dt = new DataTable();
                sda.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                UtilityOptions.ErrorLog(ex.ToString(), MethodBase.GetCurrentMethod().Name);
                throw ex;
            }
            finally
            {

            }
        }
        public DataTable CompanyLineNumber()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_UTILITY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
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
        public int UpdateCompanyLineNumber(UtilityDBModel[] _dbModel)
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
                    SqlCommand dCmd = new SqlCommand("PR_WEB_UTILITY", conn, objTrans);
                    dCmd.CommandType = CommandType.StoredProcedure;

                    dCmd.Parameters.AddWithValue("@LineNumber", item.LineNumber);
                    dCmd.Parameters.AddWithValue("@Operator", item.Operator);
                    dCmd.Parameters.AddWithValue("@Helper", item.Helper);
                    dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                    dCmd.Parameters.AddWithValue("@QryOption", 11);
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
    }
}
