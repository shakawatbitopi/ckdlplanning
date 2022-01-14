using Common;
using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class PlanningController : Controller
    {
        // GET: Planning
        [PlanningSession]
        public ActionResult Create()
        {
            return View();
        }
        PlanningItem objItem;

        [HttpGet, PlanningSession]
        public JsonResult LoadFileRefInformation()
        {
            objItem = new PlanningItem();
            List<PlanningDBModel> _dbModelList = new List<PlanningDBModel>();
            _dbModelList = objItem.LoadFileRefInformation();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedFileRefInformation(PlanningDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new PlanningItem();
            List<PlanningDBModel> _dbModelFileRefSummaryList = new List<PlanningDBModel>();
            List<PlanningDBModel> _dbModelSAMInformation = new List<PlanningDBModel>();
            List<PlanningDBModel> _dbModelLineInformation = new List<PlanningDBModel>();
            List<PlanningDBModel> _dbModelEOInformation = new List<PlanningDBModel>();
            List<PlanningDBModel> _dbModelEOOrderQty = new List<PlanningDBModel>();

            ds = objItem.LoadSelectedFileRefInformation(_dbModel);
            _dbModelFileRefSummaryList = objItem.LoadFileRefSummary(ds.Tables[0]);
            _dbModelSAMInformation = objItem.LoadSAMInformation(ds.Tables[1]);
            _dbModelLineInformation = objItem.LoadLineInformation(ds.Tables[2]);
            _dbModelEOInformation = objItem.LoadEOInformation(ds.Tables[3]);
            _dbModelEOOrderQty = objItem.LoadEOOrderQty(ds.Tables[4]);

            return this.Json(new
            {
                dbModelFileRefSummaryList = _dbModelFileRefSummaryList,
                SAMInformation = _dbModelSAMInformation,
                LineInformation = _dbModelLineInformation,
                EOInformation = _dbModelEOInformation,
                EOOrderQty = _dbModelEOOrderQty
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult PRPRocess()
        {
            int _result = 0;
            objItem = new PlanningItem();
            _result = objItem.PRPRocess();
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpGet, PlanningSession]
        public JsonResult LoadPendingProcessInformation()
        {
            objItem = new PlanningItem();
            List<PlanningDBModel> _dbModelList = new List<PlanningDBModel>();
            _dbModelList = objItem.LoadPendingProcessInformation();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpGet, PlanningSession]
        public JsonResult LoadPendingProcessDetails(int PRMasterID)
        {
            objItem = new PlanningItem();
            List<PlanningDBModel> _dbModelList = new List<PlanningDBModel>();
            _dbModelList = objItem.LoadPendingProcessDetails(PRMasterID);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
    }
}