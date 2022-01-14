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
    public class ProductionItem
    {
        ProductionList _objList;
        public DataSet LoadAllPRInformation()
        {
            _objList = new ProductionList();
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataSet ds = new DataSet();
                ds = _objList.LoadAllPRInformation();
                return ds;
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
        public List<ProductionDBModel> LoadAllPRID(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
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
        public List<ProductionDBModel> LoadAllPRLineNumber(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
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
        public List<ProductionDBModel> LoadAllPRUnitName(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      UnitID = row["UnitID"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
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
        public DataSet LoadPlanDateInformation(ProductionDBModel _dbModel)
        {
            _objList = new ProductionList();
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                return _objList.LoadPlanDateInformation(_dbModel);
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
        public List<ProductionDBModel> LoadAllPlanDate(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      PRID = row["PRID"].ToString(),
                                      StyleName = row["StyleName"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      FileRefNo = row["FileRefNo"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString(),
                                      RemainingQty = row["RemainingQty"].ToString(),
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

        public List<ProductionDBModel> LoadAllLineNumber(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
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
        public List<ProductionDBModel> LoadCurrentPlanDate(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      ID = row["ID"].ToString(),
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      TargetQty = row["LineDayQty"].ToString(),
                                      PlanDate = row["PlanDate"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString(),
                                      Status = row["Status"].ToString()
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

        public List<ProductionDBModel> LoadLineNumberInformation(DataTable dt)
        {
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      TotalProduceQty = Convert.ToInt32(row["ProduceQty"].ToString()),
                                      BalanceQty = Convert.ToInt32(row["RemainingQty"].ToString()),
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
        public DataTable LoadAllPlanData(string CompanyID, DateTime EndDate)
        {
            _objList = new ProductionList();
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable ds = new DataTable();
                ds = _objList.LoadAllPlanData(CompanyID, EndDate);
                return ds;
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
        public int SaveProductionUpdate(ProductionDBModel[] _dbModel)
        {
            try
            {
                _objList = new ProductionList();
                return _objList.SaveProductionUpdate(_dbModel);
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
        public int SaveProductionUpdateData(ProductionDBModel[] _dbModel)
        {
            try
            {
                _objList = new ProductionList();
                return _objList.SaveProductionUpdateData(_dbModel);
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
        public DataSet LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataSet ds = new DataSet();
                ds = _objList.LoadSelectedPRInformation(_dbModel);
                return ds;
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
        public List<ProductionReferenceDBModel> LoadPRInformation(DataTable dt)
        {

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRID = row["PRID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      PlannedProduction = row["PlannedProduction"].ToString(),
                                      OrgEfficiency = row["OrgEfficiency"].ToString(),
                                      SAM = row["SAM"].ToString(),
                                      IncrementType = row["IncrementType"].ToString(),
                                      Status = row["Status"].ToString(),
                                      BuyerName = row["BuyerName"].ToString(),
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

        public List<ProductionReferenceDBModel> LoadPRLineInformation(DataTable dt)
        {
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRID = row["PRID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      WorkStation = row["WorkStation"].ToString(),
                                      WorkingMinutes = row["WorkingMinutes"].ToString(),
                                      AverageEfficency = row["AverageEfficency"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      PlanStartDate = row["PlanStartDate"].ToString(),
                                      FirstDayOutput = row["FirstDayOutPut"].ToString(),
                                      IncrementQty = row["IncrementQty"].ToString(),
                                      HourlyTarget = row["HourlyTarget"].ToString(),
                                      DailyLineTarget = row["DailyLineTarget"].ToString(),
                                      AddedBy = row["AddedBy"].ToString(),
                                      DateAdded = row["DateAdded"].ToString()
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
        public List<ProductionReferenceDBModel> LoadPREOInformation(DataTable dt)
        {
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      SizeGroup = row["SizeGroup"].ToString(),
                                      UOM = row["UOM"].ToString(),
                                      Destination = row["Destination"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      ShipMode = row["ShipMode"].ToString(),
                                      ExportPONo = row["ExportPONo"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      TargetDate = row["TargetDate"].ToString(),
                                      //AddedBy = row["AddedBy"].ToString(),
                                      //DateAdded = row["DateAdded"].ToString()
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
        public List<ProductionReferenceDBModel> LoadAllPlanBoardPR()
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadAllPlanBoardPR();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRID = row["PRID"].ToString(),
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString())
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

        public List<ProductionReferenceDBModel> LoadPRInformationWithDateByID(string PRMasterID)
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadPRInformationWithDateByID(PRMasterID);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      LineNumber = row["LineNumber"].ToString(),
                                      StartDate = row["StartDate"].ToString(),
                                      EndDate = row["EndDate"].ToString()
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
        public int CheckPlanDate(ProductionDBModel _dbModel)
        {
            try
            {
                _objList = new ProductionList();
                return _objList.CheckPlanDate(_dbModel);
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

        public List<ProductionDBModel> GetPRLineDateInformation(ProductionDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPRLineDateInformation(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      ID = row["ID"].ToString(),
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      TargetQty = row["LineDayQty"].ToString(),
                                      PlanDate = row["PlanDate"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString(),
                                      Status = row["Status"].ToString()
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
        public DataSet LoadAllPlaningBoardData()
        {
            _objList = new ProductionList();
            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataSet ds = new DataSet();
                ds = _objList.LoadAllPlaningBoardData();
                return ds;
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
        public List<ProductionReferenceDBModel> LoadAllPlaningBoardLineNumber(DataTable dt)
        {
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
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
        public List<ProductionReferenceDBModel> LoadAllPlaningBoardPR(DataTable dt)
        {
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRID = row["PRID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      StartDate = row["StartDate"].ToString(),
                                      EndDate = row["EndDate"].ToString(),
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString())
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

        public List<ProductionDBModel> GetReportsCompanyInformation()
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetReportsCompanyInformation();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
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
        public DataTable DownloadReportData(string CompanyID)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                return dt = _objList.DownloadReportData(CompanyID);
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
        public List<ProductionReferenceDBModel> GetLineDetails(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetLineDetails(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRID = row["PRID"].ToString(),
                                      StartDate = row["StartDate"].ToString(),
                                      EndDate = row["EndDate"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      Style = row["StyleName"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString(),
                                      TotalDays = Convert.ToInt32(row["TotalDays"].ToString()),
                                      PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                      PriorityNo = Convert.ToDecimal(row["PriorityNo"].ToString())
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
        public List<ProductionReferenceDBModel> GetPRLineQty(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPRLineQty(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      TargetDate = row["PlanDate"].ToString(),
                                      TargetQty = row["LineDayQty"].ToString()
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
        public List<ProductionReferenceDBModel> GetPRLineInformation(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPRLineInformation(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString(),
                                      TargetQty = row["TargetQty"].ToString()
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
        public List<ProductionReferenceDBModel> GetPREOInformation(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPREOInformation(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      PRQty = row["PRQty"].ToString()
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
        public List<ProductionReferenceDBModel> GetPRWiseProduceQty(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPRWiseProduceQty(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      StartDate = row["PlanDate"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString()
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
        public List<ProductionReferenceDBModel> LoadSidebarPRInformation(ProductionReferenceDBModel _dbModel)
        {
            _objList = new ProductionList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadSidebarPRInformation(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
                                  {
                                      PRID = row["PRID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      PlannedProduction = row["PlannedProduction"].ToString(),
                                      SAM = row["SAM"].ToString(),
                                      BuyerName = row["BuyerName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString(),
                                      PlanStartDate = row["PlanStartDate"].ToString(),
                                      StartDate = row["StartDate"].ToString(),
                                      EndDate = row["EndDate"].ToString()
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
        public DataTable GetReportFinalData(string CompanyID)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                return dt = _objList.GetReportFinalData(CompanyID);
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
        public DataTable GetProjectionReportAvailableMinutes(string CompanyID)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                return dt = _objList.GetProjectionReportAvailableMinutes(CompanyID);
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
        public DataTable GetProjectionReportLinePlanDetails(string CompanyID)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                return dt = _objList.GetProjectionReportLinePlanDetails(CompanyID);
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
        public DataTable GetProjectionReportOrderDetails(string CompanyID)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                return dt = _objList.GetProjectionReportOrderDetails(CompanyID);
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
        public List<ProductionDBModel> GetProductionUpdateData(ProductionDBModel _dbModel)
        {
            _objList = new ProductionList();

            List<ProductionDBModel> _modelList = new List<ProductionDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetProductionUpdateData(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      PRID = row["PRID"].ToString(),
                                      CompanyName = row["CompanyName"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleName = row["StyleName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      PlanDate = row["PlanDate"].ToString(),
                                      DayQty = row["LineDayQty"].ToString(),
                                      ProduceQty = row["ProduceQty"].ToString()
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
        public int UpdateMissingDates(ProductionDBModel _dbModel)
        {
            try
            {
                _objList = new ProductionList();
                return _objList.UpdateMissingDates(_dbModel);
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
