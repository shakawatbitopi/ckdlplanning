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
    public class DashboardList
    {
        public DataSet LoadDashboardData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_DASHBOARD_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
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
        public DataSet LoadDashboardLineData()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_DASHBOARD_DATA", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
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
        public DataTable LoadYearWiseToPlanData(UtilityDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_DASHBOARD_DATA", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@YearNo", _dbModel.YearNo);
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

        public DataSet LoadDashboardDataSummary()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_DASHBOARD_PLANNING_SUMMARY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
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

        public DataSet LoadDashboardCompanySummaryData(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_DASHBOARD_PLANNING_SUMMARY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);

            if (CompanyID == "ALL")
                dAd.Parameters.AddWithValue("@QryOption", 1);
            else 
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
        public DataSet LoadBookedQuantitySummaryData(string CompanyID)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_DASHBOARD_PLANNING_SUMMARY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", CompanyID);

            if (CompanyID == "ALL")
                dAd.Parameters.AddWithValue("@QryOption", 3);
            else
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
    }
}
