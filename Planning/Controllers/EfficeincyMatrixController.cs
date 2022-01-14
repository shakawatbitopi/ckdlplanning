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
    public class EfficeincyMatrixController : Controller
    {
        // GET: EfficeincyMatrix
        EfficeincyMatrixItem objItem;

        [PlanningSession, MenuAuthorize(8)]
        public ActionResult Matrix()
        {
            return View();
        }

        [PlanningSession, MenuAuthorize(25)]
        public ActionResult Update()
        {
            return View();
        }

        [PlanningSession, MenuAuthorize(28)]
        public ActionResult PRMatrix()
        {
            return View();
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadAllPRInformation()
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.LoadPRInformation();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadPRWiseLine(EfficeincyMatrixDBModel _dbModel)
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.LoadPRWiseLine(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            int _result = 0;
            objItem = new EfficeincyMatrixItem();
            _result = objItem.SaveEfficeincyMatrix(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.LoadAllEfficeincyMatrix(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.LoadSelectedEfficeincyMatrix(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            int _result = 0;
            objItem = new EfficeincyMatrixItem();
            _result = objItem.DeleteSelectedEfficeincyMatrix(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult ExecuteEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            int _result = 0;
            objItem = new EfficeincyMatrixItem();
            _result = objItem.ExecuteEfficeincyMatrix(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadEfficeincyMatrixMasterData()
        {
            DataSet dt = new DataSet();
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelCompanyList = new List<EfficeincyMatrixDBModel>();
            List<EfficeincyMatrixDBModel> _dbModelStyleList = new List<EfficeincyMatrixDBModel>();
            List<EfficeincyMatrixDBModel> _dbModelStyleCriticalityList = new List<EfficeincyMatrixDBModel>();
            dt = objItem.LoadMasterData();

            _dbModelCompanyList = objItem.GetCompanyList(dt.Tables[0]);
            _dbModelStyleList = objItem.GetStyleType(dt.Tables[1]);
            _dbModelStyleCriticalityList = objItem.GetStyleCriticality(dt.Tables[2]);
            return this.Json(new { Company = _dbModelCompanyList, StyleList = _dbModelStyleList, Criticality = _dbModelStyleCriticalityList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetSelectedEfficeincyMatrix(EfficeincyMatrixDBModel _dbModel)
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.GetSelectedEfficeincyMatrix(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult SaveManualEfficeincy(EfficeincyMatrixDBModel[] _dbModel)
        {
            int _result = 0;
            objItem = new EfficeincyMatrixItem();
            _result = objItem.SaveManualEfficeincy(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadPRWiseEfficiency(EfficeincyMatrixDBModel _dbModel)
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.LoadPRWiseEfficiency(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadAllActivePR()
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelList = new List<EfficeincyMatrixDBModel>();
            _dbModelList = objItem.LoadAllActivePR();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadPRMasterWiseEfficiency(EfficeincyMatrixDBModel _dbModel)
        {
            objItem = new EfficeincyMatrixItem();
            List<EfficeincyMatrixDBModel> _dbModelEfficiencyList = new List<EfficeincyMatrixDBModel>();
            List<EfficeincyMatrixDBModel> _dbModelLineNumberList = new List<EfficeincyMatrixDBModel>();
            DataSet dt = new DataSet();
            dt = objItem.LoadPRMasterWiseEfficiency(_dbModel);
            _dbModelEfficiencyList = objItem.LoadPREfficiencyList(dt.Tables[0]);
            _dbModelLineNumberList = objItem.LoadPREfficiencyLineNumber(dt.Tables[1]);
            return this.Json(new { Efficiency = _dbModelEfficiencyList, LineNumber = _dbModelLineNumberList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult SavePRWiseEfficeincy(EfficeincyMatrixDBModel[] _dbModel)
        {
            int _result = 0;
            objItem = new EfficeincyMatrixItem();
            _result = objItem.SavePRWiseEfficeincy(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpPost, PlanningSession]
        public JsonResult DeletePRWiseEfficeincy(EfficeincyMatrixDBModel _dbModel)
        {
            int _result = 0;
            objItem = new EfficeincyMatrixItem();
            _result = objItem.DeletePRWiseEfficeincy(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}