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
    public class DashboardItem
    {
        DashboardList _objList;
        public DataSet LoadDashboardData()
        {
            try
            {
                _objList = new DashboardList();
                return _objList.LoadDashboardData();
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

        public List<DashboardDBModel> LoadLineSummaryData(DataTable dt)
        {
            List<DashboardDBModel> _modelList = new List<DashboardDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new DashboardDBModel
                                  {
                                      LineNumber = row["LineNumber"].ToString(),
                                      LineDayQty = row["LineDayQty"].ToString(),
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
        public List<DashboardDBModel> LoadBuyerSummaryData(DataTable dt)
        {
            List<DashboardDBModel> _modelList = new List<DashboardDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new DashboardDBModel
                                  {
                                      Buyer = row["Buyer"].ToString(),
                                      LineDayQty = row["LineDayQty"].ToString(),
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
        public List<DashboardDBModel> LoadPlanDateSummaryData(DataTable dt)
        {
            List<DashboardDBModel> _modelList = new List<DashboardDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new DashboardDBModel
                                  {
                                      LineDate = row["LineDate"].ToString(),
                                      LineDayQty = row["LineDayQty"].ToString(),
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
        public List<DashboardDBModel> LoadCompanySummaryData(DataTable dt)
        {
            List<DashboardDBModel> _modelList = new List<DashboardDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new DashboardDBModel
                                  {
                                      Company = row["Company"].ToString(),
                                      LineDayQty = row["LineDayQty"].ToString(),
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
        public DataSet LoadDashboardLineData()
        {
            try
            {
                _objList = new DashboardList();
                return _objList.LoadDashboardLineData();
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
        public List<DashboardDBModel> PlanLineInformation(DataTable dt)
        {
            List<DashboardDBModel> _modelList = new List<DashboardDBModel>();
            try
            {
                if (dt.Rows.Count > 0)
                {
                    _modelList = (from DataRow row in dt.Rows
                                  select new DashboardDBModel
                                  {
                                      UnitName = row["UnitName"].ToString(),
                                      LineNumber = row["LineNumber"].ToString(),
                                      LineDayQty = row["LineDayQty"].ToString(),
                                      CurrentMonthQty = row["CurrentMonthQty"].ToString(),
                                      CurrentMonthProduceQty = row["CurrentMonthProduceQty"].ToString(),
                                      LastPlanDate = row["LastPlanDate"].ToString(),
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
        public List<UtilityDBModel> LoadUnMappedFileRef(DataTable dt)
        {
            List<UtilityDBModel> _modelList = new List<UtilityDBModel>();
            try
            {
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
        public DataTable LoadYearWiseToPlanData(UtilityDBModel _dbModel)
        {
            try
            {
                _objList = new DashboardList();
                return _objList.LoadYearWiseToPlanData(_dbModel);
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
        public DataSet LoadDashboardDataSummary()
        {
            try
            {
                _objList = new DashboardList();
                return _objList.LoadDashboardDataSummary();
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
        public DataSet LoadDashboardCompanySummaryData(string CompanyID)
        {
            try
            {
                _objList = new DashboardList();
                return _objList.LoadDashboardCompanySummaryData(CompanyID);
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
        public DataSet LoadBookedQuantitySummaryData(string CompanyID)
        {
            try
            {
                _objList = new DashboardList();
                return _objList.LoadBookedQuantitySummaryData(CompanyID);
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
