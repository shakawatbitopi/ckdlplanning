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
    public class CompanyBuyerController : Controller
    {
        // GET: CompanyBuyer
        [PlanningSession, MenuAuthorize(16)]
        public ActionResult Buyer()
        {
            return View();
        }

        CompanyBuyerItem objItem;

        [HttpPost, PlanningSession]
        public JsonResult SaveCompanyBuyer(CompanyBuyerDBModel _dbModel)
        {
            int _result = 0;
            objItem = new CompanyBuyerItem();
            _result = objItem.SaveCompanyBuyer(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllCompanyBuyer()
        {
            objItem = new CompanyBuyerItem();
            List<CompanyBuyerDBModel> _dbModelList = new List<CompanyBuyerDBModel>();
            _dbModelList = objItem.LoadAllCompanyBuyer();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedCompanyBuyer(CompanyBuyerDBModel _dbModel)
        {
            objItem = new CompanyBuyerItem();
            List<CompanyBuyerDBModel> _dbModelList = new List<CompanyBuyerDBModel>();
            _dbModelList = objItem.LoadSelectedCompanyBuyer(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteCompanyBuyer(CompanyBuyerDBModel _dbModel)
        {
            int _result = 0;
            objItem = new CompanyBuyerItem();
            _result = objItem.DeleteCompanyBuyer(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadCompanyBuyerNames()
        {
            List<CompanyBuyerDBModel> _dbModelBuyer = new List<CompanyBuyerDBModel>();
            List<CompanyBuyerDBModel> _dbModelCompany = new List<CompanyBuyerDBModel>();

            DataSet dt = new DataSet();
            objItem = new CompanyBuyerItem();
            dt = objItem.LoadCompanyBuyerNames();

            _dbModelCompany = objItem.GetBuyerNames(dt.Tables[0]);
            _dbModelBuyer = objItem.GetCompanyNames(dt.Tables[1]);           

            return Json(new { Buyer = _dbModelBuyer, Company = _dbModelCompany }, JsonRequestBehavior.AllowGet);
        }
    }
}