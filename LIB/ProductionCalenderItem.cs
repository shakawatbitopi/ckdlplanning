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
    public class ProductionCalenderItem
    {
        ProductionCalenderList _objList;
        public List<ProductionCalenderDBModel> LoadAllCompany()
        {
            _objList = new ProductionCalenderList();
            List<ProductionCalenderDBModel> _modelList = new List<ProductionCalenderDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllCompany();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionCalenderDBModel
                                  {
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
        public List<ProductionCalenderDBModel> LoadSelectedProductionDate(ProductionCalenderDBModel _dbModel)
        {
            _objList = new ProductionCalenderList();
            List<ProductionCalenderDBModel> _modelList = new List<ProductionCalenderDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedProductionDate(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionCalenderDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString(),
                                      ProductionDate = row["ProductionDate"].ToString(),
                                      DaysName = row["DaysName"].ToString(),
                                      ProductionHours = row["ProductionHours"].ToString()
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
        public int SaveProductionCalendar(ProductionCalenderDBModel[] ProductionCalenderDBModel)
        {
            try
            {
                _objList = new ProductionCalenderList();
                return _objList.SaveProductionCalendar(ProductionCalenderDBModel);
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
        public List<ProductionCalenderDBModel> LoadAllCompanyLineNumber(ProductionCalenderDBModel _dbModel)
        {
            _objList = new ProductionCalenderList();
            List<ProductionCalenderDBModel> _modelList = new List<ProductionCalenderDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllCompanyLineNumber(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionCalenderDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString()
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
        public int UpdateProductionDate(ProductionCalenderDBModel ProductionCalenderDBModel)
        {
            try
            {
                _objList = new ProductionCalenderList();
                return _objList.UpdateProductionDate(ProductionCalenderDBModel);
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
