using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class MenuItem
    {
        MenuList _objList;

        public int SaveMenuCategory(MenuDBModel _dbModel)
        {
            try
            {
                _objList = new MenuList();
                return _objList.SaveMenuCategory(_dbModel);
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
        public List<MenuDBModel> LoadAllMenuCategory()
        {
            _objList = new MenuList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllMenuCategory();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      MenuCategoryID = Convert.ToInt32(row["MenuCategoryID"].ToString()),
                                      CategoryName = row["CategoryName"].ToString(),
                                      SequenceNo = Convert.ToDecimal(row["SequenceNo"].ToString()),
                                      IsActive = Convert.ToBoolean(row["IsActive"].ToString())
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
        public List<MenuDBModel> LoadSelectedMenuCategory(MenuDBModel _dbModel)
        {
            _objList = new MenuList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedMenuCategory(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      MenuCategoryID = Convert.ToInt32(row["MenuCategoryID"].ToString()),
                                      CategoryName = row["CategoryName"].ToString(),
                                      SequenceNo = Convert.ToDecimal(row["SequenceNo"].ToString()),
                                      IsActive = Convert.ToBoolean(row["IsActive"].ToString())
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
        public int DeleteMenuCategory(MenuDBModel _dbModel)
        {
            try
            {
                _objList = new MenuList();
                return _objList.DeleteMenuCategory(_dbModel);
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

        public int SaveMenuSubCategory(MenuDBModel _dbModel)
        {
            try
            {
                _objList = new MenuList();
                return _objList.SaveMenuSubCategory(_dbModel);
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
        public List<MenuDBModel> LoadAllMenuSubCategory()
        {
            _objList = new MenuList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllMenuSubCategory();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      MenuSubCategoryID = Convert.ToInt32(row["MenuSubCategoryID"].ToString()),
                                      MenuCategoryID = Convert.ToInt32(row["MenuCategoryID"].ToString()),
                                      CategoryName = row["CategoryName"].ToString(),
                                      MenuName = row["MenuName"].ToString(),
                                      MenuUrl = row["MenuUrl"].ToString(),
                                      SequenceNo = Convert.ToDecimal(row["SequenceNo"].ToString()),
                                      IsActive = Convert.ToBoolean(row["IsActive"].ToString())
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
        public List<MenuDBModel> LoadSelectedMenuSubCategory(MenuDBModel _dbModel)
        {
            _objList = new MenuList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedMenuSubCategory(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      MenuSubCategoryID = Convert.ToInt32(row["MenuSubCategoryID"].ToString()),
                                      MenuCategoryID = Convert.ToInt32(row["MenuCategoryID"].ToString()),
                                      MenuName = row["MenuName"].ToString(),
                                      MenuUrl = row["MenuUrl"].ToString(),
                                      SequenceNo = Convert.ToDecimal(row["SequenceNo"].ToString()),
                                      IsActive = Convert.ToBoolean(row["IsActive"].ToString())
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
        public int DeleteMenuSubCategory(MenuDBModel _dbModel)
        {
            try
            {
                _objList = new MenuList();
                return _objList.DeleteMenuSubCategory(_dbModel);
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
        public List<MenuDBModel> LoadAllEmployee()
        {
            _objList = new MenuList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllEmployee();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      EmployeeCode = row["EmployeeCode"].ToString(),
                                      EmployeeName = row["EmployeeName"].ToString(),
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
        public List<MenuDBModel> LoadAllUserMenu(MenuDBModel _dbModel)
        {
            _objList = new MenuList();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllUserMenu(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new MenuDBModel
                                  {
                                      MenuSubCategoryID = Convert.ToInt32(row["MenuSubCategoryID"].ToString()),
                                      IsChecked = Convert.ToBoolean(row["IsChecked"]),
                                      IsSelect = Convert.ToBoolean(row["IsSelect"]),
                                      IsInsert = Convert.ToBoolean(row["IsInsert"]),
                                      IsEdit = Convert.ToBoolean(row["IsEdit"]),
                                      IsDelete = Convert.ToBoolean(row["IsDelete"]),
                                      CategoryName = row["CategoryName"].ToString(),
                                      MenuName = row["MenuName"].ToString(),
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
        public int SaveUserMenu(MenuDBModel _dbModel)
        {
            try
            {
                _objList = new MenuList();
                return _objList.SaveUserMenu(_dbModel);
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
    }
}
