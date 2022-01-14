using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LIB
{
    public class UtilityItem
    {
        UtilityList _objList;
        public List<UtilityDBModel> GetLineNumber()
        {
            List<UtilityDBModel> _modelList = new List<UtilityDBModel>();
            try
            {
                _objList = new UtilityList();
                DataTable dt = new DataTable();
                dt = _objList.GetLineNumber();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UtilityDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString(),
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
        public List<UtilityDBModel> LoadSelectedLineDetails(UtilityDBModel _dbModel)
        {
            _objList = new UtilityList();
            List<UtilityDBModel> _modelList = new List<UtilityDBModel>();
            try
            {
                DataTable dt = _objList.LoadSelectedLineDetails(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UtilityDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      PRID = row["PRID"].ToString(),
                                      StyleName = row["StyleName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      LineStartDate = row["LineStartDate"].ToString(),
                                      PlanStartDate = row["PlanStartDate"].ToString(),
                                      PlanEndDate = row["PlanEndDate"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      PriorityNo = row["PriorityNo"].ToString()
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
        public int ProcessLineNumberManually(UtilityDBModel _dbModel)
        {
            try
            {
                _objList = new UtilityList();
                return _objList.ProcessLineNumberManually(_dbModel);
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
        public int UpdateEOQuantity(ProductionReferenceDBModel _dbModel)
        {
            try
            {
                _objList = new UtilityList();
                return _objList.UpdateEOQuantity(_dbModel);
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
        public List<UtilityDBModel> LoadUnMappedFileRef(UtilityDBModel _dbModel)
        {
            _objList = new UtilityList();
            List<UtilityDBModel> _modelList = new List<UtilityDBModel>();
            try
            {
                DataTable dt = _objList.LoadUnMappedFileRef(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UtilityDBModel
                                  {
                                      FileRefID = row["FileRefID"].ToString(),
                                      FileOriginID = row["FileOriginID"].ToString(),
                                      Buyer = row["Buyer"].ToString(),
                                      StyleName = row["StyleName"].ToString(),
                                      FileCategory = row["FileCategory"].ToString(),
                                      FileStatus = row["FileStatus"].ToString(),
                                      OrderQty = Convert.ToInt32(row["OrderQty"].ToString()),
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
        public List<UtilityDBModel> CompanyLineNumber()
        {
            DataTable dt = new DataTable();
            List<UtilityDBModel> _modelList = new List<UtilityDBModel>();
            try
            {
                _objList = new UtilityList();                
                dt = _objList.CompanyLineNumber();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new UtilityDBModel
                                  {
                                      CompanyName = row["CompanyName"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      Operator = Convert.ToInt32(row["Operator"].ToString()),
                                      Helper = Convert.ToInt32(row["Helper"].ToString()),
                                      WorkStation = Convert.ToInt32(row["WorkStation"].ToString()),
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
        public int UpdateCompanyLineNumber(UtilityDBModel[] _dbModel)
        {
            try
            {
                _objList = new UtilityList();
                return _objList.UpdateCompanyLineNumber(_dbModel);
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
