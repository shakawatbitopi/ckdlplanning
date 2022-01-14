using Common;
using LIB;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        [PlanningSession]
        public ActionResult Home()
        {
            return View();
        }
        DashboardItem objItem;
        [HttpGet, PlanningSession]
        public JsonResult LoadDashboardData()
        {
            DataSet ds = new DataSet();
            objItem = new DashboardItem();
            List<DashboardDBModel> _dbModelLineSummaryData = new List<DashboardDBModel>();
            List<DashboardDBModel> _dbModelBuyerSummaryData = new List<DashboardDBModel>();
            List<DashboardDBModel> _dbModelCompanySummaryData = new List<DashboardDBModel>();
            List<DashboardDBModel> _dbModelPlanDateSummaryData = new List<DashboardDBModel>();

            ds = objItem.LoadDashboardData();
            _dbModelLineSummaryData = objItem.LoadLineSummaryData(ds.Tables[0]);
            _dbModelBuyerSummaryData = objItem.LoadBuyerSummaryData(ds.Tables[1]);
            _dbModelCompanySummaryData = objItem.LoadCompanySummaryData(ds.Tables[2]);
            _dbModelPlanDateSummaryData = objItem.LoadPlanDateSummaryData(ds.Tables[3]);

            return this.Json(new
            {
                LineSummaryData = _dbModelLineSummaryData,
                BuyerSummaryData = _dbModelBuyerSummaryData,
                CompanySummaryData = _dbModelCompanySummaryData,
                PlanDateSummaryData = _dbModelPlanDateSummaryData
            }, JsonRequestBehavior.AllowGet);

        }

        [HttpGet, PlanningSession]
        public JsonResult LoadDashboardLineData()
        {
            DataSet ds = new DataSet();
            objItem = new DashboardItem();
            List<DashboardDBModel> _dbModelLineSummaryData = new List<DashboardDBModel>();
            List<UtilityDBModel> _dbModelToPlanData = new List<UtilityDBModel>();

            ds = objItem.LoadDashboardLineData();
            _dbModelLineSummaryData = objItem.PlanLineInformation(ds.Tables[0]);
            _dbModelToPlanData = objItem.LoadUnMappedFileRef(ds.Tables[1]);

            return this.Json(new
            {
                LineSummaryData = _dbModelLineSummaryData,
                ToPlanData = _dbModelToPlanData
            }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost, PlanningSession]
        public JsonResult LoadYearWiseToPlanData(UtilityDBModel _dbModel)
        {
            DataTable dt = new DataTable();
            objItem = new DashboardItem();
            List<UtilityDBModel> _dbModelToPlanData = new List<UtilityDBModel>();

            dt = objItem.LoadYearWiseToPlanData(_dbModel);
            _dbModelToPlanData = objItem.LoadUnMappedFileRef(dt);
            return this.Json(_dbModelToPlanData, JsonRequestBehavior.AllowGet);

        }
        [HttpPost, PlanningSession]
        public string LoadDashboardDataSummary()
        {
            objItem = new DashboardItem();
            var data = objItem.LoadDashboardDataSummary();
            return JsonConvert.SerializeObject(data);
        }
        [HttpPost, PlanningSession]
        public string LoadDashboardCompanySummaryData(string CompanyID)
        {
            objItem = new DashboardItem();
            var data = objItem.LoadDashboardCompanySummaryData(CompanyID);
            return JsonConvert.SerializeObject(data);
        }
        [HttpPost, PlanningSession]
        public string LoadBookedQuantitySummaryData(string CompanyID)
        {
            objItem = new DashboardItem();
            var data = objItem.LoadBookedQuantitySummaryData(CompanyID);
            return JsonConvert.SerializeObject(data);
        }
    }
}