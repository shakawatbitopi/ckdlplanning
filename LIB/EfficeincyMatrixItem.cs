using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class EfficeincyMatrixItem
    {
        EfficeincyMatrixList _objList;
        public List<EfficeincyMatrixDBModel> LoadPRInformation()
        {
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                _objList = new EfficeincyMatrixList();
                DataTable dt = new DataTable();
                dt = _objList.LoadPRInformation();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
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

        public List<EfficeincyMatrixDBModel> LoadPRWiseLine(EfficeincyMatrixDBModel _dbModel)
        {
            _objList = new EfficeincyMatrixList();
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadPRWiseLine(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      LineNumber = Convert.ToInt32(row["LineNumber"].ToString()),
                                      TargetQty = Convert.ToInt32(row["TargetQty"].ToString()),
                                      SAM = Convert.ToDecimal(row["SAM"].ToString()),
                                      TotalWorkStation = Convert.ToInt32(row["TotalWorkStation"].ToString()),
                                      OrgEfficiency = Convert.ToDecimal(row["OrgEfficiency"].ToString()),
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
        public int SaveEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.SaveEfficeincyMatrix(_dbModel);
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
        public List<EfficeincyMatrixDBModel> LoadAllEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            _objList = new EfficeincyMatrixList();
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllEfficeincyMatrix(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRMatrixID = Convert.ToInt32(row["PRMatrixID"].ToString()),
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      LineNumber = Convert.ToInt32(row["LineNumber"].ToString()),
                                      StartDay = Convert.ToInt32(row["StartDay"].ToString()),
                                      EndDay = Convert.ToInt32(row["EndDay"].ToString()),
                                      Efficiency = Convert.ToDecimal(row["Efficiency"].ToString())
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
        public List<EfficeincyMatrixDBModel> LoadSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            _objList = new EfficeincyMatrixList();
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedEfficeincyMatrix(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRMatrixID = Convert.ToInt32(row["PRMatrixID"].ToString()),
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      LineNumber = Convert.ToInt32(row["LineNumber"].ToString()),
                                      StartDay = Convert.ToInt32(row["StartDay"].ToString()),
                                      EndDay = Convert.ToInt32(row["EndDay"].ToString()),
                                      Efficiency = Convert.ToDecimal(row["Efficiency"].ToString()),
                                      HourlyProduction = Convert.ToInt32(row["HourlyProduction"].ToString()),
                                      DailyProduction = Convert.ToInt32(row["DailyProduction"].ToString()),
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
        public int DeleteSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.DeleteSelectedEfficeincyMatrix(_dbModel);
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
        public int ExecuteEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.ExecuteEfficeincyMatrix(_dbModel);
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
        public DataSet LoadMasterData()
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.LoadMasterData();
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
        public List<EfficeincyMatrixDBModel> GetCompanyList(DataTable dt)
        {
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
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
        public List<EfficeincyMatrixDBModel> GetStyleType(DataTable dt)
        {
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      StyleType = row["StyleType"].ToString()
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
        public List<EfficeincyMatrixDBModel> GetStyleCriticality(DataTable dt)
        {
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      StyleCriticality = row["StyleCriticality"].ToString()
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
        public List<EfficeincyMatrixDBModel> GetSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            _objList = new EfficeincyMatrixList();
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                DataTable dt = _objList.GetSelectedEfficeincyMatrix(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      EfficiencyID = Convert.ToInt32(row["EfficiencyID"].ToString()),
                                      StyleType = row["StyleType"].ToString(),
                                      StyleCriticality = row["StyleCriticality"].ToString(),
                                      Days = Convert.ToInt32(row["Days"].ToString()),
                                      Efficiency = Convert.ToDecimal(row["ManualEfficiency"].ToString()),
                                      MinSMV = Convert.ToDecimal(row["MinSMV"].ToString()),
                                      MaxSMV = Convert.ToDecimal(row["MaxSMV"].ToString()),
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
        public int SaveManualEfficeincy(EfficeincyMatrixDBModel[] _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.SaveManualEfficeincy(_dbModel);
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
        public List<EfficeincyMatrixDBModel> LoadPRWiseEfficiency(EfficeincyMatrixDBModel _dbModel)
        {
            _objList = new EfficeincyMatrixList();
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                DataTable dt = _objList.LoadPRWiseEfficiency(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRWiseEfficiencyID = Convert.ToInt32(row["PRWiseEfficiencyID"].ToString()),
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      Days = Convert.ToInt32(row["Days"].ToString()),
                                      Efficiency = Convert.ToDecimal(row["ManualEfficiency"].ToString())
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
        public List<EfficeincyMatrixDBModel> LoadAllActivePR()
        {
            _objList = new EfficeincyMatrixList();
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                DataTable dt = _objList.LoadAllActivePR();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString()
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
        public DataSet LoadPRMasterWiseEfficiency(EfficeincyMatrixDBModel _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.LoadPRMasterWiseEfficiency(_dbModel);
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
        public List<EfficeincyMatrixDBModel> LoadPREfficiencyList(DataTable dt)
        {
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      EfficiencyID = Convert.ToInt32(row["EfficiencyID"].ToString()),
                                      StyleType = row["StyleType"].ToString(),
                                      StyleCriticality = row["StyleCriticality"].ToString(),
                                      Days = Convert.ToInt32(row["Days"].ToString()),
                                      Efficiency = Convert.ToDecimal(row["ManualEfficiency"].ToString()),
                                      SAM = Convert.ToDecimal(row["SAM"].ToString()),
                                      MinSMV = Convert.ToDecimal(row["MinSMV"].ToString()),
                                      MaxSMV = Convert.ToDecimal(row["MaxSMV"].ToString()),
                                      MatrixType = row["MatrixType"].ToString(),
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
        public List<EfficeincyMatrixDBModel> LoadPREfficiencyLineNumber(DataTable dt)
        {
            List<EfficeincyMatrixDBModel> _modelList = new List<EfficeincyMatrixDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new EfficeincyMatrixDBModel
                                  {
                                      LineNumber = Convert.ToInt32(row["LineNumber"].ToString()),
                                      TotalWorkStation = Convert.ToInt32(row["WorkStation"].ToString()),
                                      TargetQty = Convert.ToInt32(row["TargetQty"].ToString())
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
        public int SavePRWiseEfficeincy(EfficeincyMatrixDBModel[] _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.SavePRWiseEfficeincy(_dbModel);
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
        public int DeletePRWiseEfficeincy(EfficeincyMatrixDBModel _dbModel)
        {
            try
            {
                _objList = new EfficeincyMatrixList();
                return _objList.DeletePRWiseEfficeincy(_dbModel);
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
