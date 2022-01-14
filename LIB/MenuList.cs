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
    public class MenuList
    {
        public int SaveMenuCategory(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_MENU_CATEGORY", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@MenuCategoryID", _dbModel.MenuCategoryID);
                dCmd.Parameters.AddWithValue("@CategoryName", _dbModel.CategoryName);
                dCmd.Parameters.AddWithValue("@SequenceNo", _dbModel.SequenceNo);
                dCmd.Parameters.AddWithValue("@IsActive", _dbModel.IsActive);
                if (_dbModel.MenuCategoryID > 0)
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
        public DataTable LoadAllMenuCategory()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_MENU_CATEGORY", conn);
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
        public DataTable LoadSelectedMenuCategory(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_MENU_CATEGORY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@MenuCategoryID", _dbModel.MenuCategoryID);
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
        public int DeleteMenuCategory(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_MENU_CATEGORY", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@MenuCategoryID", _dbModel.MenuCategoryID);
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
        public int SaveMenuSubCategory(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_MENU_SUB_CATEGORY", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@MenuSubCategoryID", _dbModel.MenuSubCategoryID);
                dCmd.Parameters.AddWithValue("@MenuCategoryID", _dbModel.MenuCategoryID);
                dCmd.Parameters.AddWithValue("@MenuName", _dbModel.MenuName);
                dCmd.Parameters.AddWithValue("@MenuUrl", _dbModel.MenuUrl);
                dCmd.Parameters.AddWithValue("@SequenceNo", _dbModel.SequenceNo);
                dCmd.Parameters.AddWithValue("@IsActive", _dbModel.IsActive);
                if (_dbModel.MenuSubCategoryID > 0)
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
        public DataTable LoadAllMenuSubCategory()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_MENU_SUB_CATEGORY", conn);
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
        public DataTable LoadSelectedMenuSubCategory(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_SET_MENU_SUB_CATEGORY", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@MenuSubCategoryID", _dbModel.MenuSubCategoryID);
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
        public int DeleteMenuSubCategory(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dCmd = new SqlCommand("SP_SET_MENU_SUB_CATEGORY", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            try
            {
                dCmd.Parameters.AddWithValue("@MenuSubCategoryID", _dbModel.MenuSubCategoryID);
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
        public DataTable LoadAllEmployee()
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SP_SET_MENU_PERMISSION", conn);
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
        public DataTable LoadAllUserMenu(MenuDBModel _dbModel)
        {
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("PR_WEB_SP_SET_MENU_PERMISSION", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@EmployeeCode", _dbModel.EmployeeCode);
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
        public int SaveUserMenu(MenuDBModel _dbModel)
        {
            int _return = 1;
            SqlTransaction objTrans = null;
            SqlConnection conn = new SqlConnection(DBConnection.GetConnection());
            conn.Open();
            objTrans = conn.BeginTransaction();
            try
            {
                SqlCommand objCmd1 = new SqlCommand("PR_WEB_SP_SET_MENU_PERMISSION", conn, objTrans);
                objCmd1.CommandType = CommandType.StoredProcedure;
                objCmd1.Parameters.AddWithValue("@QryOption", 3);
                objCmd1.Parameters.AddWithValue("@EmployeeCode", _dbModel.EmployeeCode);
                objCmd1.ExecuteNonQuery();

                foreach (var item in _dbModel.arrUserMenuPermissionDBModel)
                {
                    SqlCommand dCmd = new SqlCommand("PR_WEB_SP_SET_MENU_PERMISSION", conn, objTrans);
                    dCmd.CommandType = CommandType.StoredProcedure;
                    dCmd.Parameters.AddWithValue("@QryOption", 4);
                    dCmd.Parameters.AddWithValue("@EmployeeCode", _dbModel.EmployeeCode);
                    dCmd.Parameters.AddWithValue("@MenuSubCategoryID", item.MenuSubCategoryID);
                    dCmd.Parameters.AddWithValue("@IsSelect", item.IsSelect);
                    dCmd.Parameters.AddWithValue("@IsInsert", item.IsInsert);
                    dCmd.Parameters.AddWithValue("@IsEdit", item.IsEdit);
                    dCmd.Parameters.AddWithValue("@IsDelete", item.IsDelete);
                    dCmd.Parameters.AddWithValue("@AddedBy", SessionVar.EmployeeCode);
                    dCmd.ExecuteNonQuery();
                    dCmd.Dispose();
                }

                SqlCommand objFinal = new SqlCommand("PR_WEB_SP_SET_MENU_PERMISSION", conn, objTrans);
                objFinal.CommandType = CommandType.StoredProcedure;
                objFinal.Parameters.AddWithValue("@QryOption", 5);
                objFinal.Parameters.AddWithValue("@EmployeeCode", _dbModel.EmployeeCode);
                objFinal.ExecuteNonQuery();

                objTrans.Commit();
                return _return;
            }
            catch (Exception ex)
            {
                objTrans.Rollback();
                throw ex;
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }
    }
}
