using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class UtilityController : Controller
    {
        // GET: Utility
        [PlanningSession, MenuAuthorize(11)]
        public ActionResult LineProcess()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(13)]
        public ActionResult FileRef()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(26)]
        public ActionResult LineInformation()
        {
            return View();
        }
        UtilityItem objItem;

        [HttpGet, PlanningSession]
        public JsonResult GetLineNumber()
        {
            objItem = new UtilityItem();
            List<UtilityDBModel> _dbModelList = new List<UtilityDBModel>();
            _dbModelList = objItem.GetLineNumber();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedLineDetails(UtilityDBModel _dbModel)
        {
            objItem = new UtilityItem();
            List<UtilityDBModel> _dbModelList = new List<UtilityDBModel>();
            _dbModelList = objItem.LoadSelectedLineDetails(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult ProcessLineNumberManually(UtilityDBModel _dbModel)
        {
            int _result = 0;
            objItem = new UtilityItem();
            _result = objItem.ProcessLineNumberManually(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpPost, PlanningSession]
        public JsonResult UpdateEOQuantity(ProductionReferenceDBModel _dbModel)
        {
            int _result = 0;
            objItem = new UtilityItem();
            _result = objItem.UpdateEOQuantity(_dbModel);
            if(_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = true });
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadUnMappedFileRef(UtilityDBModel _dbModel)
        {
            objItem = new UtilityItem();
            List<UtilityDBModel> _dbModelList = new List<UtilityDBModel>();
            _dbModelList = objItem.LoadUnMappedFileRef(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult CompanyLineNumber()
        {
            objItem = new UtilityItem();
            List<UtilityDBModel> _dbModelList = new List<UtilityDBModel>();
            _dbModelList = objItem.CompanyLineNumber();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult UpdateCompanyLineNumber(UtilityDBModel[] _dbModel)
        {
            int _result = 0;
            objItem = new UtilityItem();
            _result = objItem.UpdateCompanyLineNumber(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}