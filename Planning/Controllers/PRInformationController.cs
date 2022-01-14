using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class PRInformationController : Controller
    {
        // GET: PRInformation
        [PlanningSession, MenuAuthorize(1)]
        public ActionResult Create()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(12)]
        public ActionResult FileRef()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(15)]
        public ActionResult LineSequence()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(14)]
        public ActionResult Status()
        {
            return View();
        }
        [PlanningSession]
        public ActionResult PRStatus()
        {
            return View();
        }

        PRInformationItem objItem;

        [HttpPost, PlanningSession]
        public JsonResult LoadExportOrderAndLineNumber(ProductionReferenceDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new PRInformationItem();
            List<ProductionReferenceDBModel> _dbModelEOInformation = new List<ProductionReferenceDBModel>();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            ds = objItem.LoadExportOrderAndLineNumber(_dbModel);
            _dbModelEOInformation = objItem.LoadEOInformation(ds.Tables[0]);
            _dbModelLineInformation = objItem.LoadLineInformation(ds.Tables[1]);
            return this.Json(new { EOInformation = _dbModelEOInformation, LineInformation = _dbModelLineInformation }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult SaveProductionReference(ProductionReferenceDBModel _dbModel)
        {
            string _result = "";
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            _result = objItem.SaveProductionReference(_dbModel);
            if (_result == "Failed")
                return Json(new { success = "Failed" });
            else
            {
                objItem = new PRInformationItem();
                _dbModelLineInformation = objItem.GetSelectedPRLineNumber(_result);
                return Json(new { success = _result, LineInformation = _dbModelLineInformation });
            }
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            objItem = new PRInformationItem();
            DataSet ds = new DataSet();
            List<ProductionReferenceDBModel> _dbModelMasterList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelEOInformation = new List<ProductionReferenceDBModel>();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            ds = objItem.LoadSelectedPRInformation(_dbModel);

            _dbModelMasterList = objItem.LoadMasterInformation(ds.Tables[0]);
            _dbModelEOInformation = objItem.LoadEOInformation(ds.Tables[1]);
            _dbModelLineInformation = objItem.LoadLineInformation(ds.Tables[2]);

            return this.Json(new { 
                Master = _dbModelMasterList, 
                EOInformation = _dbModelEOInformation, 
                LineInformation = _dbModelLineInformation 
            }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost, PlanningSession]
        public JsonResult LoadFileRefData(ProductionReferenceDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new PRInformationItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadFileRefData(_dbModel);
            return this.Json(new
            {
                FileRef = _dbModelList
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadEOInformation(ProductionReferenceDBModel _dbModel)
        {
            DataTable ds = new DataTable();
            objItem = new PRInformationItem();
            List<ProductionReferenceDBModel> _dbModelEOInformation = new List<ProductionReferenceDBModel>();
            ds = objItem.GetSelectedEODetails(_dbModel);
            _dbModelEOInformation = objItem.LoadEOInformation(ds);
            return this.Json(new { EOInformation = _dbModelEOInformation }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetSamWiseEfficiency(ProductionDetailsDBModel _dbModel)
        {
            DataTable ds = new DataTable();
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.GetSamWiseEfficiency(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpGet, PlanningSession]
        public JsonResult LoadPendingProcessLineNumber()
        {
            DataTable ds = new DataTable();
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.LoadPendingProcessLineNumber();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult ProcessPlanData(ProductionReferenceDBModel _dbModel)
        {
            int _result = 0;
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            _result = objItem.ProcessPlanData(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpGet, PlanningSession]
        public JsonResult LoadFileRefWisePR()
        {
            DataTable ds = new DataTable();
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.LoadFileRefWisePR();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult SelectedLineSequence(ProductionReferenceDBModel _dbModel)
        {
            objItem = new PRInformationItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.SelectedLineSequence(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadPRWiseStatus(ProductionReferenceDBModel _dbModel)
        {
            objItem = new PRInformationItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadPRWiseStatus(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetPRLineEfficiencyMatrix(ProductionReferenceDBModel _dbModel)
        {
            objItem = new PRInformationItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.GetPRLineEfficiencyMatrix(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpGet, PlanningSession]
        public JsonResult PRStatusInformationData()
        {
            DataTable ds = new DataTable();
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.PRStatusInformationData();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult UpdatePRStatusInformationData(ProductionReferenceDBModel _dbModel)
        {
            int _result = 0;
            objItem = new PRInformationItem();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            _result = objItem.UpdatePRStatusInformationData(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}