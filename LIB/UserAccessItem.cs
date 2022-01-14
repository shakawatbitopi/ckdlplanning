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
    public class UserAccessItem
    {
        UserAccessList _objList;
        public int SaveUserAccess(UserAccessDBModel _dbModel)
        {
            try
            {
                _objList = new UserAccessList();
                return _objList.SaveData(_dbModel);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }
        public List<UserAccessDBModel> LoadAllPRUserAccess()
        {
            _objList = new UserAccessList();
            List<UserAccessDBModel> _modelList = new List<UserAccessDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllPRUserAccess();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UserAccessDBModel
                                  {
                                      PRUserAccessID = Convert.ToInt32(row["PRUserAccessID"].ToString()),
                                      EmployeeCode = row["EmployeeCode"].ToString(),
                                      Name = row["Name"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString()
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
        public List<UserAccessDBModel> LoadSelectedData(string PRUserAccessID)
        {
            _objList = new UserAccessList();
            List<UserAccessDBModel> _modelList = new List<UserAccessDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedData(PRUserAccessID);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UserAccessDBModel
                                  {
                                      PRUserAccessID = Convert.ToInt32(row["PRUserAccessID"].ToString()),
                                      EmployeeCode = row["EmployeeCode"].ToString(),
                                      Name = row["Name"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString()
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

        public int DeleteData(string PRUserAccessID)
        {
            try
            {
                _objList = new UserAccessList();
                return _objList.DeleteData(PRUserAccessID);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                _objList = null;
            }
        }

        public MasterDDL LoadDDLData()
        {
            _objList = new UserAccessList();
            MasterDDL model = new MasterDDL();
            List<DDLModel> _modelList1 = new List<DDLModel>();
            List<DDLModel> _modelList2 = new List<DDLModel>();
            try
            {
                DataSet dt = _objList.LoadDDLData();
                if (dt.Tables[0].Rows.Count > 0)
                {
                    _modelList1 = (from DataRow row in dt.Tables[0].Rows
                                  select new DDLModel
                                  {
                                      Code = row["Code"].ToString(),
                                      Value = row["Value"].ToString()
                                  }).ToList();
                    _modelList2 = (from DataRow row in dt.Tables[1].Rows
                                   select new DDLModel
                                   {
                                       Code = row["Code"].ToString(),
                                       Value = row["Value"].ToString()
                                   }).ToList();
                    model.CompanyList = _modelList1;
                    model.EmpList = _modelList2;
                }
                return model;
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
            finally
            {
                model = null;
            }
        }

        public List<UserAccessDBModel> LoadAllUserForAuth()
        {
            _objList = new UserAccessList();
            List<UserAccessDBModel> _modelList = new List<UserAccessDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllUserForAuth();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UserAccessDBModel
                                  {
                                      SLNO = row["SLNO"].ToString(),
                                      EmployeeCode = row["EmployeeCode"].ToString(),
                                      Name = row["Name"].ToString(),
                                      UserCode = row["UserCode"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
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

        public bool LoadUserLoginInfo(string UserCode)
        {
            _objList = new UserAccessList();
            List<UserAccessDBModel> _modelList = new List<UserAccessDBModel>();
            try
            {
                DataTable dt = _objList.LoadUserLoginInfo(UserCode);
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
                    return true;
                }
                else
                {
                    return false;
                }
               
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
