using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class UtilityOptions
    {
        public static void ErrorLog(string Exception, string ErrorMethodName)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("PR_WEB_ERROR_LOG", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@LoginID", SessionVar.EmployeeCode);
                dCmd.Parameters.AddWithValue("@ErrorMethodName", ErrorMethodName);
                dCmd.Parameters.AddWithValue("@ErrorTime", DateTime.Now);
                dCmd.Parameters.AddWithValue("@Exception", Exception);
                dCmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
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
