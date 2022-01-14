using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace LIB
{
    public class PRInformationItem
    {
        PRInformationList _objList = new PRInformationList();
        public DataSet LoadExportOrderAndLineNumber(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();

            try
            {
                DataSet dt = _objList.LoadExportOrderAndLineNumber(_dbModel);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<ProductionReferenceDBModel> LoadEOInformation(DataTable dt)
        {
            _objList = new PRInformationList();
            List<ProductionReferenceDBModel> _dbModelEOInformation = new List<ProductionReferenceDBModel>();

            try
            {

                _dbModelEOInformation = (from DataRow row in dt.Rows
                                         select new ProductionReferenceDBModel
                                         {
                                             IsCheck = row["IsCheck"].ToString(),
                                             RowID = row["RowID"].ToString(),
                                             SeqNo = row["SeqNo"].ToString(),
                                             FileRefID = row["FileRefID"].ToString(),
                                             StyleID = row["StyleID"].ToString(),
                                             ExportOrderID = row["ExportOrderID"].ToString(),
                                             ExportPONo = row["ExportPONo"].ToString(),
                                             PCD = row["PCD"].ToString(),
                                             ExportOrderStatus = row["ExportOrderStatus"].ToString(),
                                             TargetDate = row["TargetDate"].ToString(),
                                             ExfactoryDate = row["ExfactoryDate"].ToString(),
                                             ShipDate = row["ShipDate"].ToString(),
                                             OrderQty = row["OrderQty"].ToString(),
                                             PRQty = row["PRQty"].ToString(),
                                             RemainingQty = row["RemainingQty"].ToString(),
                                             SelectedQty = row["SelectedQty"].ToString(),
                                             SAM = row["SAM"].ToString(),
                                             BulletinID = row["BulletinID"].ToString(),
                                             PlanStartDate = row["PlanStartDate"].ToString()
                                         }).ToList();
                return _dbModelEOInformation;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelEOInformation = null;
            }
        }
        public List<ProductionDetailsDBModel> LoadLineInformation(DataTable dt)
        {
            _objList = new PRInformationList();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();

            try
            {

                _dbModelLineInformation = (from DataRow row in dt.Rows
                                           select new ProductionDetailsDBModel
                                           {
                                               PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
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
                                               IsFixed = Convert.ToBoolean(row["IsFixed"]),
                                               MatrixCount = Convert.ToInt32(row["MatrixCount"].ToString()),
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
        public string SaveProductionReference(ProductionReferenceDBModel _dbModel)
        {
            try
            {
                _objList = new PRInformationList();
                return _objList.SaveProductionReference(_dbModel);
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
            _objList = new PRInformationList();

            try
            {
                DataSet dt = _objList.LoadSelectedPRInformation(_dbModel);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ProductionReferenceDBModel> LoadMasterInformation(DataTable dt)
        {
            _objList = new PRInformationList();
            List<ProductionReferenceDBModel> _dbModelLineInformation = new List<ProductionReferenceDBModel>();

            try
            {
                _dbModelLineInformation = (from DataRow row in dt.Rows
                                           select new ProductionReferenceDBModel
                                           {
                                               PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                               PRID = row["PRID"].ToString(),
                                               CompanyID = row["CompanyID"].ToString(),
                                               BuyerID = row["BuyerID"].ToString(),
                                               ProductType = row["ProductType"].ToString(),
                                               FileRefID = row["FileRefID"].ToString(),
                                               StyleType = row["StyleType"].ToString(),
                                               SelectedQty = row["SelectedQty"].ToString(),
                                               ExcessQty = Convert.ToDecimal(row["ExcessQty"].ToString()),                                              
                                               PlannedProduction = row["PlannedProduction"].ToString(),
                                               BulletinID = row["BulletinID"].ToString(),
                                               SAM = row["SAM"].ToString(),
                                               PCD = row["PCD"].ToString().Replace(" ","-"),
                                               PlanStartDate = row["PlanStartDate"].ToString().Replace(" ", "-"),
                                               LineAllocated = Convert.ToInt32(row["LineAllocated"].ToString()),
                                               TotalWorkMinutes = row["TotalWorkMinutes"].ToString(),
                                               Status = row["Status"].ToString(),
                                               LineNumberList = row["LineNumberList"].ToString(),
                                               IsRepeatedOrder = Convert.ToBoolean(row["IsRepeatedOrder"].ToString()),
                                               PriorityNo = Convert.ToDecimal(row["PriorityNo"].ToString()),
                                               QuantityFactor = Convert.ToInt32(row["QuantityFactor"].ToString()),
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
        public List<ProductionReferenceDBModel> LoadFileRefData(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();
            List<ProductionReferenceDBModel> _modelList = new List<ProductionReferenceDBModel>();
            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadFileRefData(_dbModel);
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new ProductionReferenceDBModel
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
        public List<ProductionDetailsDBModel> GetSelectedPRLineNumber(string PRID)
        {
            _objList = new PRInformationList();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetSelectedPRLineNumber(PRID);
                _dbModelLineInformation = (from DataRow row in dt.Rows
                                           select new ProductionDetailsDBModel
                                           {
                                               PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
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
                                               TotalLineCount = row["TotalLineCount"].ToString(),
                                               IsFixed = Convert.ToBoolean(row["IsFixed"]),
                                               MatrixCount = Convert.ToInt32(row["MatrixCount"].ToString()),
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
        public DataTable GetSelectedEODetails(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();

            try
            {
                DataTable dt = _objList.GetSelectedEODetails(_dbModel);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ProductionDetailsDBModel> GetSamWiseEfficiency(ProductionDetailsDBModel _dbModel)
        {
            _objList = new PRInformationList();
            List<ProductionDetailsDBModel> _dbModelSamInformation = new List<ProductionDetailsDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetSamWiseEfficiency(_dbModel);
                _dbModelSamInformation = (from DataRow row in dt.Rows
                                           select new ProductionDetailsDBModel
                                           {
                                               StyleCriticality = row["StyleCriticality"].ToString(),
                                               DayNo = row["DayNo"].ToString(),
                                               MatrixEfficiency = row["MatrixEfficiency"].ToString()
                                           }).ToList();

                return _dbModelSamInformation;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelSamInformation = null;
            }
        }
        public List<ProductionDetailsDBModel> LoadPendingProcessLineNumber()
        {
            _objList = new PRInformationList();
            List<ProductionDetailsDBModel> _dbModelSamInformation = new List<ProductionDetailsDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadPendingProcessLineNumber();
                _dbModelSamInformation = (from DataRow row in dt.Rows
                                          select new ProductionDetailsDBModel
                                          {
                                              PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                              PRID = row["PRID"].ToString(),
                                              LineNumber = row["LineNumber"].ToString(),
                                              TargetQty = row["TargetQty"].ToString(),
                                          }).ToList();

                return _dbModelSamInformation;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelSamInformation = null;
            }
        }
        public int ProcessPlanData(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();

            try
            {
                return _objList.ProcessPlanData(_dbModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ProductionDetailsDBModel> LoadFileRefWisePR()
        {
            _objList = new PRInformationList();
            List<ProductionDetailsDBModel> _dbModelSamInformation = new List<ProductionDetailsDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadFileRefWisePR();
                _dbModelSamInformation = (from DataRow row in dt.Rows
                                          select new ProductionDetailsDBModel
                                          {
                                              FileRefID = row["FileRefID"].ToString(),
                                              Style = row["StyleName"].ToString(),
                                              PRID = row["PRID"].ToString()
                                          }).ToList();

                return _dbModelSamInformation;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelSamInformation = null;
            }
        }
        public List<ProductionReferenceDBModel> SelectedLineSequence(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.SelectedLineSequence(_dbModel);
                _dbModelList = (from DataRow row in dt.Rows
                                          select new ProductionReferenceDBModel
                                          {
                                              SeqNo = row["PriorityNo"].ToString(),
                                              PRID = row["PRID"].ToString(),
                                              StartDate = row["PlanStartDate"].ToString(),
                                              StyleName = row["StyleName"].ToString(),
                                              EndDate = row["PlanEndDate"].ToString(),
                                          }).ToList();

                return _dbModelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelList = null;
            }
        }
        public List<ProductionReferenceDBModel> LoadPRWiseStatus(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.LoadPRWiseStatus(_dbModel);
                _dbModelList = (from DataRow row in dt.Rows
                                select new ProductionReferenceDBModel
                                {
                                    PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                    PRID = row["PRID"].ToString(),
                                    StyleName = row["StyleName"].ToString(),
                                    CompanyName = row["CompanyName"].ToString(),
                                    BuyerName = row["BuyerName"].ToString(),
                                    FileRefID = row["FileRefID"].ToString(),
                                    ProductType = row["ProductType"].ToString(),
                                    StyleType = row["StyleType"].ToString(),
                                    SelectedQty = row["SelectedQty"].ToString(),
                                    ExcessQty = Convert.ToDecimal(row["ExcessQty"].ToString()),
                                    PlannedProduction = row["PlannedProduction"].ToString(),
                                    Status = row["Status"].ToString(),
                                    ProduceQty = row["ProduceQty"].ToString(),
                                }).ToList();

                return _dbModelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelList = null;
            }
        }
        public List<ProductionReferenceDBModel> GetPRLineEfficiencyMatrix(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.GetPRLineEfficiencyMatrix(_dbModel);
                _dbModelList = (from DataRow row in dt.Rows
                                select new ProductionReferenceDBModel
                                {
                                    PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                    PRMatrixID = Convert.ToInt32(row["PRMatrixID"].ToString()),
                                    StartDay = Convert.ToInt32(row["StartDay"].ToString()),
                                    EndDay = Convert.ToInt32(row["EndDay"].ToString()),
                                    MatrixEfficiency = Convert.ToDecimal(row["MatrixEfficiency"].ToString()),
                                    HourlyTarget = row["HourlyProduction"].ToString(),
                                    DailyLineTarget = row["DailyProduction"].ToString()
                                }).ToList();

                return _dbModelList;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelList = null;
            }
        }
        public List<ProductionDetailsDBModel> PRStatusInformationData()
        {
            _objList = new PRInformationList();
            List<ProductionDetailsDBModel> _dbModelSamInformation = new List<ProductionDetailsDBModel>();

            try
            {
                DataTable dt = new DataTable();
                dt = _objList.PRStatusInformationData();
                _dbModelSamInformation = (from DataRow row in dt.Rows
                                          select new ProductionDetailsDBModel
                                          {
                                              PRMasterID = Convert.ToInt32(row["PRMasterID"].ToString()),
                                              PRID = row["PRID"].ToString(),
                                              Company = row["Company"].ToString(),
                                              FileRefID = row["FileRefID"].ToString(),
                                              Style = row["StyleName"].ToString(),
                                              Status = row["Status"].ToString(),
                                          }).ToList();

                return _dbModelSamInformation;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                _dbModelSamInformation = null;
            }
        }
        public int UpdatePRStatusInformationData(ProductionReferenceDBModel _dbModel)
        {
            _objList = new PRInformationList();

            try
            {
                return _objList.UpdatePRStatusInformationData(_dbModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
