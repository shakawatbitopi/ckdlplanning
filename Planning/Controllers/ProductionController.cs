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
    public class ProductionController : Controller
    {
        // GET: Production
        [PlanningSession, MenuAuthorize(4)]
        public ActionResult Update()
        {
            return View();
        }
        [PlanningSession]
        public ActionResult List()
        {
            return View();
        }
        ProductionItem objItem;

        [HttpPost, PlanningSession]
        public JsonResult LoadAllPRInformation()
        {
            objItem = new ProductionItem();
            DataSet ds = new DataSet();
            ds = objItem.LoadAllPRInformation();

            List<ProductionDBModel> _dbModelPRList = new List<ProductionDBModel>();
            List<ProductionDBModel> _dbModelLineList = new List<ProductionDBModel>();
            List<ProductionDBModel> _dbModelUnitList = new List<ProductionDBModel>();
            _dbModelPRList = objItem.LoadAllPRID(ds.Tables[0]);
            _dbModelLineList = objItem.LoadAllPRLineNumber(ds.Tables[1]);
            _dbModelUnitList = objItem.LoadAllPRUnitName(ds.Tables[2]);
            return this.Json(new
            {
                PRID = _dbModelPRList,
                LineNumber = _dbModelLineList,
                Unit = _dbModelUnitList
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadPlanDateInformation(ProductionDBModel _dbModel)
        {
            objItem = new ProductionItem();
            DataSet ds = new DataSet();
            List<ProductionDBModel> _dbModelAllList = new List<ProductionDBModel>();
            List<ProductionDBModel> _dbModelAllLineNumber = new List<ProductionDBModel>();
            List<ProductionDBModel> _dbModelTodayList = new List<ProductionDBModel>();
            List<ProductionDBModel> _dbModelLineNumberList = new List<ProductionDBModel>();

            ds = objItem.LoadPlanDateInformation(_dbModel);
            _dbModelAllList = objItem.LoadAllPlanDate(ds.Tables[0]);
            _dbModelAllLineNumber = objItem.LoadAllLineNumber(ds.Tables[2]);
            _dbModelTodayList = objItem.LoadCurrentPlanDate(ds.Tables[1]);
            _dbModelLineNumberList = objItem.LoadLineNumberInformation(ds.Tables[3]);
            return this.Json(new
            {
                AllData = _dbModelAllList,
                AllLineNumber = _dbModelAllLineNumber,
                TodayData = _dbModelTodayList,
                LineNumberData = _dbModelLineNumberList
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult SaveProductionUpdate(ProductionDBModel[] _dbModel)
        {
            int _result = 0;
            objItem = new ProductionItem();
            _result = objItem.SaveProductionUpdate(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveProductionUpdateData(ProductionDBModel[] _dbModel)
        {
            int _result = 0;
            objItem = new ProductionItem();
            _result = objItem.SaveProductionUpdateData(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult CheckPlanDate(ProductionDBModel _dbModel)
        {
            int _result = 0;
            objItem = new ProductionItem();
            _result = objItem.CheckPlanDate(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult GetPRLineDateInformation(ProductionDBModel _dbModel)
        {
            objItem = new ProductionItem();
            List<ProductionDBModel> _dbModelList = new List<ProductionDBModel>();
            _dbModelList = objItem.GetPRLineDateInformation(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetProductionUpdateData(ProductionDBModel _dbModel)
        {
            objItem = new ProductionItem();
            List<ProductionDBModel> _dbModelList = new List<ProductionDBModel>();
            _dbModelList = objItem.GetProductionUpdateData(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult UpdateMissingDates(ProductionDBModel _dbModel)
        {
            int _result = 0;
            objItem = new ProductionItem();
            _result = objItem.UpdateMissingDates(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}