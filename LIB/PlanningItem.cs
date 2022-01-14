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
    public class PlanningItem
    {
        PlanningList _objList;
        public List<PlanningDBModel> LoadFileRefInformation()
        {
            _objList = new PlanningList();
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                DataTable dt = _objList.LoadFileRefInformation();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      FileRefID = row["FileRefID"].ToString(),
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
        public DataSet LoadSelectedFileRefInformation(PlanningDBModel _dbModel)
        {
            try
            {
                _objList = new PlanningList();
                return _objList.LoadSelectedFileRefInformation(_dbModel);
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

        public List<PlanningDBModel> LoadFileRefSummary(DataTable dt)
        {

            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      ProductTypes = row["ProductTypes"].ToString(),
                                      BuyerName = row["BuyerName"].ToString(),
                                      BuyerDepartment = row["BuyerDepartment"].ToString(),
                                      OrderQty = row["OrderQty"].ToString(),
                                      FirstPCDDate = row["FirstPCDDate"].ToString(),
                                      LastPCDDate = row["LastPCDDate"].ToString(),
                                      TargetDate = row["TargetDate"].ToString(),
                                      FirstShipDate = row["FirstShipDate"].ToString(),
                                      LastShipDate = row["LastShipDate"].ToString(),
                                      BulletinID = row["BulletinID"].ToString(),
                                      SAM = row["SAM"].ToString()
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
        public List<PlanningDBModel> LoadSAMInformation(DataTable dt)
        {
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      SAM = row["SAM"].ToString(),
                                      WorkStation = row["WorkStation"].ToString(),
                                      WorkTime = row["WorkTime"].ToString(),
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
        public List<PlanningDBModel> LoadLineInformation(DataTable dt)
        {
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      IsCheck = row["IsCheck"].ToString(),
                                      Company = row["Company"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      WorkStation = row["WorkStation"].ToString(),
                                      AverageEfficiency = row["AverageEfficiency"].ToString(),
                                      TargetQty = row["TargetQty"].ToString(),
                                      IncrementQty = row["IncrementQty"].ToString(),
                                      HourlyTarget = row["HourlyTarget"].ToString(),
                                      DailyTargetPerLine = row["DailyTargetPerLine"].ToString(),
                                      TotalDaysRequired = row["TotalDaysRequired"].ToString()
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
        public List<PlanningDBModel> LoadEOInformation(DataTable dt)
        {
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      IsCheck = row["IsCheck"].ToString(),
                                      RowID = row["RowID"].ToString(),
                                      SeqNo = row["SeqNo"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      ExportOrderID = row["ExportOrderID"].ToString(),
                                      SizeGroup = row["SizeGroup"].ToString(),
                                      UOM = row["UOM"].ToString(),
                                      Destination = row["Destination"].ToString(),
                                      UnitName = row["UnitName"].ToString(),
                                      ShipMode = row["ShipMode"].ToString(),
                                      ExportPONo = row["ExportPONo"].ToString(),
                                      PCD = row["PCD"].ToString(),
                                      TargetDate = row["TargetDate"].ToString(),
                                      ExfactoryDate = row["ExfactoryDate"].ToString(),
                                      ShipDate = row["ShipDate"].ToString(),
                                      OrderQty = row["OrderQty"].ToString(),
                                      PRQty = row["PRQty"].ToString(),
                                      RemainingQty = row["RemainingQty"].ToString(),
                                      SelectedQty = row["SelectedQty"].ToString()
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
        public List<PlanningDBModel> LoadEOOrderQty(DataTable dt)
        {
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      OrderQty = row["OrderQty"].ToString()
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
        public int PRPRocess()
        {
            try
            {
                _objList = new PlanningList();
                return _objList.PRPRocess();
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
        public List<PlanningDBModel> LoadPendingProcessInformation()
        {
            _objList = new PlanningList();
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                DataTable dt = _objList.LoadPendingProcessInformation();
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      PRID = row["PRID"].ToString(),
                                      Company = row["Company"].ToString(),
                                      Buyer = row["Buyer"].ToString(),
                                      ProductType = row["ProductType"].ToString(),
                                      FileRefID = row["FileRefID"].ToString(),
                                      StyleID = row["StyleID"].ToString(),
                                      SAM = row["SAM"].ToString(),
                                      PlannedProduction = row["PlannedProduction"].ToString()
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
        public List<PlanningDBModel> LoadPendingProcessDetails(int PRMasterID)
        {
            _objList = new PlanningList();
            List<PlanningDBModel> _modelList = new List<PlanningDBModel>();
            try
            {
                DataTable dt = _objList.LoadPendingProcessDetails(PRMasterID);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new PlanningDBModel
                                  {
                                      PRMasterID = row["PRMasterID"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      StartDate = row["StartDate"].ToString(),
                                      EndDate = row["EndDate"].ToString(),
                                      ProcessBy = row["ProcessBy"].ToString(),
                                      ProcessDate = row["ProcessDate"].ToString(),
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
