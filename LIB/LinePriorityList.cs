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
    public class LinePriorityList
    {
        public DataTable LoadProductionLines()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PRIORITY_NO", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
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
        public DataTable LoadLineWisePriority(LinePriorityDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SET_PRIORITY_NO", conn);
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
        public int UpdateLinePriorityNumber(LinePriorityDBModel _dbModel)
        {
            DataTable dtLine = new DataTable();

            if (_dbModel.arrLinePriorityDBModel != null && _dbModel.arrLinePriorityDBModel.Length > 0)
            {
                dtLine = ConvertLineModelToDataTable(_dbModel.arrLinePriorityDBModel);
            }

            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_SET_PRIORITY_NO", conn);
            dCmd.CommandTimeout = 0;
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@tblPRLinePriority", dtLine);
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
        private DataTable ConvertLineModelToDataTable(LinePriorityNumberDBModel[] arrLinePriorityDBModel)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[2] {
                    new DataColumn("PRLineID", typeof(int)),
                    new DataColumn("PriorityNo", typeof(int))
            });
            foreach (var dbModel in arrLinePriorityDBModel)
            {
                    int PRLineID = dbModel.PRLineID;
                    int PriorityNo = dbModel.PriorityNo;
                    dt.Rows.Add(PRLineID, PriorityNo);
                
            }
            return dt;
        }
    }
}
