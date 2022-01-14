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
    public class AdditionalPRItem
    {
        AdditionalPRList _objList;

        public string SaveData(AdditionalPRDBModel _dbModel)
        {
            try
            {
                _objList = new AdditionalPRList();
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
        public AdditionalPRMasterDDL LoadDDLData()
        {
            _objList = new AdditionalPRList();
            AdditionalPRMasterDDL masterModel = new AdditionalPRMasterDDL();
            List<AdditionalPRCompanyDBModel> _modelList = new List<AdditionalPRCompanyDBModel>();
            List<AdditionalPRBuyerDBModel> _modelList2 = new List<AdditionalPRBuyerDBModel>();
            try
            {
                DataSet dt = _objList.LoadDDLData();
                if (dt.Tables[0].Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Tables[0].Rows
                                  select new AdditionalPRCompanyDBModel
                                  {
                                      Code = row["Code"].ToString(),
                                      Value = row["Value"].ToString()
                                  }).ToList();
                    _modelList2 = (from DataRow row in dt.Tables[1].Rows
                                   select new AdditionalPRBuyerDBModel
                                   {
                                       Code = row["Code"].ToString(),
                                       Value = row["Value"].ToString()
                                   }).ToList();
                }

                masterModel.CompanyList = _modelList;
                masterModel.BuyerList = _modelList2;
                return masterModel;
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
        public List<AdditionalFileRefDBModel> LoadFileByBuyer(string BuyerID)
        {
            _objList = new AdditionalPRList();
            List<AdditionalFileRefDBModel> _modelList = new List<AdditionalFileRefDBModel>();
            try
            {
                DataSet dt = _objList.LoadFileByBuyer(BuyerID);
                if (dt.Tables[0].Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Tables[0].Rows
                                  select new AdditionalFileRefDBModel
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
        public List<AdditionalPRDBModel> LoadAllData()
        {
            _objList = new AdditionalPRList();
            List<AdditionalPRDBModel> _modelList = new List<AdditionalPRDBModel>();
            try
            {
                DataSet dt = _objList.LoadAllData();
                if (dt.Tables[0].Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Tables[0].Rows
                                  select new AdditionalPRDBModel
                                  {
                                      APRMasterID = Convert.ToInt32(row["APRMasterID"].ToString()),
                                      APRID = row["APRID"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      BuyerID = row["BuyerID"].ToString(),
                                      BuyerName = row["BuyerName"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      FileRefNo = row["FileRefNo"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      CM = Convert.ToDouble(row["CM"].ToString()),
                                      FOB = Convert.ToDouble(row["FOB"].ToString()),
                                      SAM = Convert.ToDouble(row["SAM"].ToString()),
                                      Qty = Convert.ToInt32(row["Qty"].ToString()),
                                      Reason = row["Reason"].ToString(),
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
        public DataSet LoadSelectedData(string APRID)
        {
            try
            {
                _objList = new AdditionalPRList();
                return _objList.LoadSelectedData(APRID);
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
        public List<AdditionalPRDBModel> LoadAdditionalPRMaster(DataTable dt)
        {
            _objList = new AdditionalPRList();
            List<AdditionalPRDBModel> _modelList = new List<AdditionalPRDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new AdditionalPRDBModel
                                  {
                                      APRID = row["APRID"].ToString(),
                                      CompanyID = row["CompanyID"].ToString(),
                                      BuyerID = row["BuyerID"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      SAM = Convert.ToDouble(row["SAM"].ToString()),
                                      CM = Convert.ToDouble(row["CM"].ToString()),
                                      FOB = Convert.ToDouble(row["FOB"].ToString()),
                                      Qty = Convert.ToInt32(row["Qty"].ToString()),
                                      Reason = row["Reason"].ToString(),
                                      TotalWorkMinutes = Convert.ToInt32(row["TotalWorkMinutes"].ToString()),
                                      StyleType = row["StyleType"].ToString(),
                                      PriorityNo = Convert.ToDecimal(row["PriorityNo"]),
                                      IsRepeatedOrder = Convert.ToBoolean(row["IsRepeatedOrder"]),
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
        public List<ProductionDetailsDBModel> LoadAdditionalPRLineInfo(DataTable dt)
        {
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _dbModelLineInformation = (from DataRow row in dt.Rows
                                               select new ProductionDetailsDBModel
                                               {
                                                   Company = row["Company"].ToString(),
                                                   UnitName = row["UnitName"].ToString(),
                                                   LineNumber = row["LineNumber"].ToString(),
                                                   WorkStation = row["WorkStation"].ToString(),
                                                   AverageEfficiency = row["AverageEfficiency"].ToString(),
                                                   TargetQty = row["TargetQty"].ToString(),
                                                   PlanStartDate = row["PlanStartDate"].ToString(),
                                                   IsCheck = Convert.ToInt32(row["TargetQty"]) > 0 ? true : false,
                                                   IsLineExists = row["IsLineExists"].ToString(),
                                                   PriorityNo = row["PriorityNo"].ToString(),
                                                   ProduceQty = row["ProduceQty"].ToString(),
                                                   IsFixed = Convert.ToInt32(row["IsFixed"]) > 0 ? true : false,
                                               }).ToList();                    
                }
                return _dbModelLineInformation;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _dbModelLineInformation = null;
            }
        }
        public int DeleteData(AdditionalPRDBModel _dbModel)
        {
            try
            {
                _objList = new AdditionalPRList();
                return _objList.DeleteData(_dbModel);
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
        public List<ProductionDetailsDBModel> LoadCompanyWiseLineInformation(AdditionalPRDBModel _dbModel)
        {
            try
            {
                DataTable dt = new DataTable();
                _objList = new AdditionalPRList();
                List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();

                dt = _objList.LoadCompanyWiseLineInformation(_dbModel);
                try
                {
                    _dbModelLineInformation = (from DataRow row in dt.Rows
                                               select new ProductionDetailsDBModel
                                               {
                                                   Company = row["Company"].ToString(),
                                                   UnitName = row["UnitName"].ToString(),
                                                   LineNumber = row["LineNumber"].ToString(),
                                                   WorkStation = row["WorkStation"].ToString(),
                                                   AverageEfficiency = row["AverageEfficiency"].ToString(),
                                                   TargetQty = row["TargetQty"].ToString(),
                                                   PlanStartDate = row["PlanStartDate"].ToString(),
                                                   IsCheck = Convert.ToInt32(row["TargetQty"]) > 0 ? true : false,
                                                   IsLineExists = row["IsLineExists"].ToString(),
                                                   PriorityNo = row["PriorityNo"].ToString(),
                                                   ProduceQty = row["ProduceQty"].ToString(),
                                                   IsFixed = Convert.ToInt32(row["IsFixed"]) > 0 ? true : false,
                                               }).ToList();

                    return _dbModelLineInformation;
                }
                catch (Exception ex)
                {

                    throw ex;
                }
                finally
                {
                    _dbModelLineInformation = null;
                }
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
