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
    public class ProductionCalenderList
    {
        public DataTable LoadAllCompany()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PRODUCTION_CALENDAR_UPDATE", conn);
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
        public DataTable LoadSelectedProductionDate(ProductionCalenderDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_PRODUCTION_CALENDAR_UPDATE", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QryOption", 2);
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
            dAd.Parameters.AddWithValue("@CalendarDate", _dbModel.FromDate);
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
        public int SaveProductionCalendar(ProductionCalenderDBModel[] ProductionCalenderDBModel)
        {
            DataTable dtCalender = new DataTable();
            dtCalender = ConvertLineModelToDataTable(ProductionCalenderDBModel);

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_PRODUCTION_CALENDAR_UPDATE", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@tblPRCalendar", dtCalender);
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

        private DataTable ConvertLineModelToDataTable(ProductionCalenderDBModel[] productionCalenderDBModel)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[3] {
                    new DataColumn("CompanyID", typeof(string)),
                    new DataColumn("ProductionDate", typeof(DateTime)),
                    new DataColumn("ProductionHours", typeof(decimal))
            });

            foreach (var dbModel in productionCalenderDBModel)
            {
                string CompanyID = dbModel.CompanyID;
                DateTime ProductionDate = Convert.ToDateTime(dbModel.ProductionDate);
                decimal ProductionHours = Convert.ToDecimal(dbModel.ProductionHours);
                dt.Rows.Add(CompanyID, ProductionDate, ProductionHours);
            }
            return dt;
        }
        public DataTable LoadAllCompanyLineNumber(ProductionCalenderDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_GET_MASTER_INFORMATION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@CompanyID", _dbModel.CompanyID);
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
        public int UpdateProductionDate(ProductionCalenderDBModel dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_PRODUCTION_CALENDAR_UPDATE", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@CompanyID", dbModel.CompanyID);
                dCmd.Parameters.AddWithValue("@FromDate", dbModel.FromDate);
                dCmd.Parameters.AddWithValue("@ToDate", dbModel.ToDate);
                dCmd.Parameters.AddWithValue("@LineNumber", dbModel.LineNumber);
                dCmd.Parameters.AddWithValue("@ProductionHours", dbModel.ProductionHours);
                dCmd.Parameters.AddWithValue("@QryOption", 3);
                dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
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
    }
}
