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
    public class AdditionalPRController : Controller
    {
        AdditionalPRItem _objItem;
        // GET: AdditionalPR
        [PlanningSession, MenuAuthorize(5)]
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet, PlanningSession]
        public JsonResult LoadDDLData()
        {
            _objItem = new AdditionalPRItem();
            AdditionalPRMasterDDL masterModel = new AdditionalPRMasterDDL();
            masterModel = _objItem.LoadDDLData();
            return Json(masterModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadFileByBuyer(string BuyerID)
        {
            _objItem = new AdditionalPRItem();
            List<AdditionalFileRefDBModel> masterModel = new List<AdditionalFileRefDBModel>();
            masterModel = _objItem.LoadFileByBuyer(BuyerID);
            return Json(masterModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveData(AdditionalPRDBModel _dbModel)
        {
            _objItem = new AdditionalPRItem();
            string APRID = "";
            APRID = _objItem.SaveData(_dbModel);
            return Json(new { success = APRID });
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadAllData()
        {
            _objItem = new AdditionalPRItem();
            List<AdditionalPRDBModel> masterModel = new List<AdditionalPRDBModel>();
            masterModel = _objItem.LoadAllData();
            return Json(masterModel, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedData(String APRID)
        {
            _objItem = new AdditionalPRItem();
            DataSet ds = new DataSet();
            List<AdditionalPRDBModel> masterModel = new List<AdditionalPRDBModel>();
            List<ProductionDetailsDBModel> LineModel = new List<ProductionDetailsDBModel>();

            ds = _objItem.LoadSelectedData(APRID);

            masterModel = _objItem.LoadAdditionalPRMaster(ds.Tables[0]);
            LineModel = _objItem.LoadAdditionalPRLineInfo(ds.Tables[1]);

            return Json(new { Master = masterModel, Line = LineModel }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteData(AdditionalPRDBModel _dbModel)
        {
            _objItem = new AdditionalPRItem();
            int result = 0;
            result = _objItem.DeleteData(_dbModel);

            if (result != 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadCompanyWiseLineInformation(AdditionalPRDBModel _dbModel)
        {
            _objItem = new AdditionalPRItem();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            _dbModelLineInformation = _objItem.LoadCompanyWiseLineInformation(_dbModel);
            return Json(_dbModelLineInformation, JsonRequestBehavior.AllowGet);
        }
    }
}