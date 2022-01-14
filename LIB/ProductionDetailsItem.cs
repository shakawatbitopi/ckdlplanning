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
    public class ProductionDetailsItem
    {
        ProductionDetailsList _objList;
        public List<ProductionDetailsDBModel> LoadPRInformation()
        {
            _objList = new ProductionDetailsList();
            List<ProductionDetailsDBModel> _modelList = new List<ProductionDetailsDBModel>();
            try
            {
                DataTable dt = _objList.LoadPRInformation();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDetailsDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      BuyerName = row["BuyerName"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      //Style = row["Style"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      //TargetDate = row["TargetDate"].ToString(),
                                      PrQty = Convert.ToInt32(row["PrQty"].ToString())
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
        public DataSet LoadBulletinDetails(ProductionDetailsDBModel _dbModel)
        {
            _objList = new ProductionDetailsList();
            List<ProductionDetailsDBModel> _modelList = new List<ProductionDetailsDBModel>();
            try
            {
                DataSet dt = _objList.LoadBulletinDetails(_dbModel);
                return dt;
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
        public List<ProductionDetailsDBModel> GetBulletinDetails(DataTable dt)
        {
            _objList = new ProductionDetailsList();
            List<ProductionDetailsDBModel> _modelList = new List<ProductionDetailsDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDetailsDBModel
                                  {
                                      WorkTime = Convert.ToInt32(row["WorkTime"].ToString()),
                                      OrderQty = Convert.ToInt32(row["OrderQty"].ToString()),
                                      ExcessQty = Convert.ToDecimal(row["ExcessQty"].ToString()),
                                      PlannedProduction = Convert.ToInt32(row["PlannedProduction"].ToString()),
                                      SAM = Convert.ToDecimal(row["SAM"].ToString()),
                                      NoOfWorkStation = Convert.ToInt32(row["NoOfWorkStation"].ToString()),
                                      HourlyTarget100PercentEffeincy = Convert.ToInt32(row["HourlyTarget100PercentEffeincy"].ToString()),
                                      OrganizationEfficiency = Convert.ToDecimal(row["OrganizationEfficiency"].ToString()),
                                      HourlyTargetOrgPercentEffeincy = Convert.ToInt32(row["HourlyTargetOrgPercentEffeincy"].ToString()),
                                      DailyTargetPerLine = Convert.ToInt32(row["DailyTargetPerLine"].ToString()),
                                      FirstDayOutput = Convert.ToInt32(row["FirstDayOutput"].ToString()),
                                      IncrementType = row["IncrementType"].ToString(),
                                      IncrementQty = Convert.ToInt32(row["IncrementQty"].ToString()),
                                      LineDaysRequire = Convert.ToInt32(row["LineDaysRequire"].ToString()),
                                      MinLineDays = Convert.ToInt32(row["MinLineDays"].ToString()),
                                      LineAllocated = Convert.ToInt32(row["LineAllocated"].ToString()),
                                      FinishDays = Convert.ToInt32(row["FinishDays"].ToString()),
                                      ExFactoryDate = row["ExFactoryDate"].ToString(),
                                      PlanStartDate = row["PlanStartDate"].ToString(),
                                      PriorityNo = row["PriorityNo"].ToString(),
                                      BulletinID = row["BulletinID"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString(),
                                      StyleID = row["StyleID"].ToString()
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
        public List<ProductionDetailsDBModel> GetLineInformation(DataTable dt)
        {
            _objList = new ProductionDetailsList();
            List<ProductionDetailsDBModel> _modelList = new List<ProductionDetailsDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDetailsDBModel
                                  {
                                      Company = row["Company"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      WorkStation = row["WorkStation"].ToString(),
                                      AverageEfficiency = row["AverageEfficiency"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      PlanStartDate = row["PlanStartDate"].ToString(),
                                      PlanEndDate = row["PlanEndDate"].ToString(),
                                      HourlyTarget = Convert.ToInt32(row["HourlyTarget"].ToString()),
                                      DailyLineTarget = Convert.ToInt32(row["DailyLineTarget"].ToString()),
                                      FirstDayOutput = Convert.ToInt32(row["FirstDayOutPut"].ToString()),
                                      IncrementQty = Convert.ToInt32(row["IncrementQty"].ToString()),
                                      IsCheck = Convert.ToInt32(row["TargetQty"]) > 0 ? true : false,
                                      IsLineExists = row["IsLineExists"].ToString(),
                                      PriorityNo = row["PriorityNo"].ToString(),
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
        public int SavePRInformation(ProductionDetailsDBModel _dbModel)
        {
            try
            {
                _objList = new ProductionDetailsList();
                return _objList.SavePRInformation(_dbModel);
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
        public List<ProductionDetailsDBModel> GetLineInformationDetails(ProductionDetailsDBModel _dbModel)
        {
            _objList = new ProductionDetailsList();
            List<ProductionDetailsDBModel> _modelList = new List<ProductionDetailsDBModel>();
            try
            {
                DataTable dt = _objList.GetLineInformationDetails(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDetailsDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PRID = row["PRID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      Buyer = row["Buyer"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      SAM = Convert.ToDecimal(row["SAM"].ToString()),
                                      StartDate = row["StartDate"].ToString(),
                                      EndDate = row["EndDate"].ToString(),
                                      TotalPlanQty = row["TotalPlanQty"].ToString(),
                                      Status = row["Status"].ToString(),
                                      PriorityNo = row["PriorityNo"].ToString(),
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

        public List<ProductionDetailsDBModel> LoadPreviewData(ProductionDetailsDBModel _dbModel)
        {
            _objList = new ProductionDetailsList();
            List<ProductionDetailsDBModel> _modelList = new List<ProductionDetailsDBModel>();
            try
            {
                DataTable dt = _objList.LoadPreviewData(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDetailsDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString(),
                                      PlanStartDate = row["StartDate"].ToString(),
                                      PlanEndDate = row["EndDate"].ToString(),
                                      TotalPlanQty = row["TotalQty"].ToString(),
                                      IsCheck = Convert.ToInt32(row["TotalQty"]) > 0 ? true : false,
                                      WorkStation = row["WorkStation"].ToString(),
                                      AverageEfficiency = row["AverageEfficiency"].ToString(),
                                      HourlyProductionOrgEff = row["HourlyProductionOrgEff"].ToString(),
                                      DailyProductionOrgEff = row["DailyProductionOrgEff"].ToString(),
                                  }).ToList();
                }
                return _modelList;
            }
            catch (Exception ex)
            {
                //ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
            finally
            {
                _modelList = null;
            }
        }
    }
}
