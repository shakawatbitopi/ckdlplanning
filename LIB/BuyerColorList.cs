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
    public class BuyerColorList
    {
        public int SaveBuyerColor(BuyerColorDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_BUYER_COLOR", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@BuyerColorID", _dbModel.BuyerColorID);
                dCmd.Parameters.AddWithValue("@BuyerID", _dbModel.BuyerID);
                dCmd.Parameters.AddWithValue("@ColorCode", _dbModel.ColorCode);
                dCmd.Parameters.AddWithValue("@Addedby", SessionVar.EmployeeCode);
                if (_dbModel.BuyerColorID > 0)
                    dCmd.Parameters.AddWithValue("@QryOption", 2);
                else
                    dCmd.Parameters.AddWithValue("@QryOption", 1);
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
        public DataTable LoadAllBuyerColor()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_BUYER_COLOR", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
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
        public DataTable LoadSelectedBuyerColor(BuyerColorDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_BUYER_COLOR", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@BuyerColorID", _dbModel.BuyerColorID);
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
        public int DeleteBuyerColor(BuyerColorDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_BUYER_COLOR", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@BuyerColorID", _dbModel.BuyerColorID);
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
    }
}
