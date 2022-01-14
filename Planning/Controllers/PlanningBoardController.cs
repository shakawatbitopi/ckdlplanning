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
    public class PlanningBoardController : Controller
    {
        // GET: PlanningBoard
        [PlanningSession, MenuAuthorize(2)]
        public ActionResult Board()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(2)]
        public ActionResult PlanBoard()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(2)]
        public ActionResult PlanData()
        {
            return View();
        }
        ProductionItem objItem;

        [HttpPost, PlanningSession]
        public string LoadAllPlanData(string CompanyID, DateTime EndDate)
        {
            objItem = new ProductionItem();
            var data = objItem.LoadAllPlanData(CompanyID, EndDate);
            return JsonConvert.SerializeObject(data);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new ProductionItem();
            ds = objItem.LoadSelectedPRInformation(_dbModel);

            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelPRLineInfoList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelEOList = new List<ProductionReferenceDBModel>();
            _dbModelPRInfoList = objItem.LoadPRInformation(ds.Tables[0]);
            _dbModelPRLineInfoList = objItem.LoadPRLineInformation(ds.Tables[1]);
            _dbModelEOList = objItem.LoadPREOInformation(ds.Tables[2]);

            return this.Json(new
            {
                PRMaster = _dbModelPRInfoList,
                PRLine = _dbModelPRLineInfoList,
                PREO = _dbModelEOList
            }, JsonRequestBehavior.AllowGet);

        }

        [HttpGet, PlanningSession]
        public JsonResult LoadAllPlanBoardPR()
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.LoadAllPlanBoardPR();
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }

        [PlanningSession]
        public JsonResult LoadPRInformationWithDateByID(string PRMasterID)
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.LoadPRInformationWithDateByID(PRMasterID);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllPlaningBoardData()
        {
            DataSet ds = new DataSet();
            objItem = new ProductionItem();
            ds = objItem.LoadAllPlaningBoardData();

            List<ProductionReferenceDBModel> _dbModelLineList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            _dbModelLineList = objItem.LoadAllPlaningBoardLineNumber(ds.Tables[0]);
            _dbModelPRInfoList = objItem.LoadAllPlaningBoardPR(ds.Tables[1]);
            return this.Json(new
            {
                LineList = _dbModelLineList,
                PRList = _dbModelPRInfoList,
            }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost, PlanningSession]
        public JsonResult GetLineDetails(ProductionReferenceDBModel _dbModel)
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.GetLineDetails(_dbModel);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult GetPRLineQty(ProductionReferenceDBModel _dbModel)
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.GetPRLineQty(_dbModel);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetPRLineInformation(ProductionReferenceDBModel _dbModel)
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.GetPRLineInformation(_dbModel);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetPREOInformation(ProductionReferenceDBModel _dbModel)
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.GetPREOInformation(_dbModel);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult GetPRWiseProduceQty(ProductionReferenceDBModel _dbModel)
        {
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            objItem = new ProductionItem();
            _dbModelPRInfoList = objItem.GetPRWiseProduceQty(_dbModel);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadSidebarPRInformation(ProductionReferenceDBModel _dbModel)
        {
            objItem = new ProductionItem();
            List<ProductionReferenceDBModel> _dbModelPRInfoList = new List<ProductionReferenceDBModel>();
            _dbModelPRInfoList = objItem.LoadSidebarPRInformation(_dbModel);
            return this.Json(_dbModelPRInfoList, JsonRequestBehavior.AllowGet);
        }
    }
}