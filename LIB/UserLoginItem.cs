using Common;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class UserLoginItem
    {
        public bool GetLogInInfo(string userName, string password)
        {
            bool IsTrue = false;
            UserLoginList _ItemList = new UserLoginList();
            try
            {
                DataTable dt = _ItemList.GetLogInInfo(userName, password);
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        LogInDBModel _DBModel = new LogInDBModel();
                        SessionVar.EmployeeCode = dr["EmployeeCode"].ToString();
                        SessionVar.UserCode = dr["UserCode"].ToString();
                        SessionVar.EmployeeName = dr["EmployeeName"].ToString();
                        SessionVar.Email = dr["Email"].ToString();
                    }

                    IsTrue = true;
                }
                else
                {
                    IsTrue = false;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {

            }
            return IsTrue;
        }
        public List<MenuDBModel> GetUserMenuList()
        {
            UserLoginList _objList = new UserLoginList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.GetUserMenuList();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      CategoryName = row["CategoryName"].ToString(),
                                      MenuName = row["MenuName"].ToString(),
                                      MenuUrl = AppSettings.BaseURL + row["MenuUrl"].ToString()
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
    }
}
