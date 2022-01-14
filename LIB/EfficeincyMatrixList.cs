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
    public class EfficeincyMatrixList
    {
        public DataTable LoadPRInformation()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 1);
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
        public DataTable LoadPRWiseLine(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 2);
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public int SaveEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@PRMatrixID", _dbModel.PRMatrixID);
                dCmd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
                dCmd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
                dCmd.Parameters.AddWithValue("@StartDay", _dbModel.StartDay);
                dCmd.Parameters.AddWithValue("@EndDay", _dbModel.EndDay);
                dCmd.Parameters.AddWithValue("@Efficiency", _dbModel.Efficiency);
                dCmd.Parameters.AddWithValue("@HourlyProduction", _dbModel.HourlyProduction);
                dCmd.Parameters.AddWithValue("@DailyProduction", _dbModel.DailyProduction);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                if (_dbModel.PRMatrixID > 0)
                    dCmd.Parameters.AddWithValue("@QryOption", 4);
                else
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
        public DataTable LoadAllEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
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
        public DataTable LoadSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PRMatrixID", _dbModel.PRMatrixID);
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
        public int DeleteSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@PRMatrixID", _dbModel.PRMatrixID);
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
        public int ExecuteEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_EFFICEINCY_MATRIX", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@LineNumber", _dbModel.LineNumber);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@QryOption", 8);
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
        public DataSet LoadMasterData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn);
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
        public DataTable GetSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
            dAd.Parameters.AddWithValue("@StyleType", _dbModel.StyleType);
            dAd.Parameters.AddWithValue("@StyleCriticality", _dbModel.StyleCriticality);
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
        public int SaveManualEfficeincy(EfficeincyMatrixDBModel[] _dbModel)
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
                    SqlCommand dCmd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn, objTrans);
                    dCmd.CommandType = CommandType.StoredProcedure;

                    dCmd.Parameters.AddWithValue("@EfficiencyID", item.EfficiencyID);
                    dCmd.Parameters.AddWithValue("@ManualEfficiency", item.Efficiency);
                    dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                    dCmd.Parameters.AddWithValue("@QryOption", 3);
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
        public DataTable LoadPRWiseEfficiency(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 4);
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
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
        public DataTable LoadAllActivePR()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 5);
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
        public DataSet LoadPRMasterWiseEfficiency(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 6);
            dAd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
            dAd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
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
        public int SavePRWiseEfficeincy(EfficeincyMatrixDBModel[] _dbModel)
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
                    SqlCommand dCmd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn, objTrans);
                    dCmd.CommandType = CommandType.StoredProcedure;

                    dCmd.Parameters.AddWithValue("@PRMasterID", item.PRMasterID);
                    dCmd.Parameters.AddWithValue("@StyleType", item.StyleType);
                    dCmd.Parameters.AddWithValue("@StyleCriticality", item.StyleCriticality);
                    dCmd.Parameters.AddWithValue("@Days", item.Days);
                    dCmd.Parameters.AddWithValue("@Efficiency", item.Efficiency);
                    dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                    dCmd.Parameters.AddWithValue("@QryOption", 7);
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
        public int DeletePRWiseEfficeincy(EfficeincyMatrixDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_MANUAL_EFFICIENCY_MATRIX", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@PRMasterID", _dbModel.PRMasterID);
                dCmd.Parameters.AddWithValue("@PRID", _dbModel.PRID);
                dCmd.Parameters.AddWithValue("@QryOption", 8);
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
