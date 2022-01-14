using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class CompanyBuyerItem
    {
        CompanyBuyerList _objList;
        public int SaveCompanyBuyer(CompanyBuyerDBModel _dbModel)
        {
            try
            {
                _objList = new CompanyBuyerList();
                return _objList.SaveCompanyBuyer(_dbModel);
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
        public List<CompanyBuyerDBModel> LoadAllCompanyBuyer()
        {
            _objList = new CompanyBuyerList();
            List<CompanyBuyerDBModel> _modelList = new List<CompanyBuyerDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllCompanyBuyer();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new CompanyBuyerDBModel
                                  {
                                      PRBuyerCompanyID = Convert.ToInt32(row["PRBuyerCompanyID"].ToString()),
                                      CompanyID = row["CompanyID"].ToString(),
                                      BuyerID = row["BuyerID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      BuyerName = row["BuyerName"].ToString()
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
        public List<CompanyBuyerDBModel> LoadSelectedCompanyBuyer(CompanyBuyerDBModel _dbModel)
        {
            _objList = new CompanyBuyerList();
            List<CompanyBuyerDBModel> _modelList = new List<CompanyBuyerDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedCompanyBuyer(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new CompanyBuyerDBModel
                                  {
                                      PRBuyerCompanyID = Convert.ToInt32(row["PRBuyerCompanyID"].ToString()),
                                      CompanyID = row["CompanyID"].ToString(),
                                      BuyerID = row["BuyerID"].ToString()
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
        public int DeleteCompanyBuyer(CompanyBuyerDBModel _dbModel)
        {
            try
            {
                _objList = new CompanyBuyerList();
                return _objList.DeleteCompanyBuyer(_dbModel);
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
        public DataSet LoadCompanyBuyerNames()
        {
            try
            {
                _objList = new CompanyBuyerList();
                return _objList.LoadCompanyBuyerNames();
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
        public List<CompanyBuyerDBModel> GetCompanyNames(DataTable dt)
        {
            List<CompanyBuyerDBModel> _modelList = new List<CompanyBuyerDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new CompanyBuyerDBModel
                                  {
                                      Code = row["Code"].ToString(),
                                      Value = row["Value"].ToString()
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
        public List<CompanyBuyerDBModel> GetBuyerNames(DataTable dt)
        {
            List<CompanyBuyerDBModel> _modelList = new List<CompanyBuyerDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new CompanyBuyerDBModel
                                  {
                                      Code = row["Code"].ToString(),
                                      Value = row["Value"].ToString()
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
