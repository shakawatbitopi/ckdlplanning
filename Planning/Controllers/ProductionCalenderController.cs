using Common;
using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class ProductionCalenderController : Controller
    {
        // GET: ProductionCalender
        [PlanningSession, MenuAuthorize(9)]
        public ActionResult Update()
        {
            return View();
        }
        ProductionCalenderItem objItem;

        [HttpPost, PlanningSession]
        public JsonResult LoadAllCompany()
        {
            objItem = new ProductionCalenderItem();
            List<ProductionCalenderDBModel> _dbModelList = new List<ProductionCalenderDBModel>();
            _dbModelList = objItem.LoadAllCompany();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedProductionDate(ProductionCalenderDBModel _dbModel)
        {
            objItem = new ProductionCalenderItem();
            List<ProductionCalenderDBModel> _dbModelList = new List<ProductionCalenderDBModel>();
            _dbModelList = objItem.LoadSelectedProductionDate(_dbModel);
            var jsonResult = Json(_dbModelList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        [HttpPost, PlanningSession]
        public JsonResult SaveProductionCalendar(ProductionCalenderDBModel[] ProductionCalenderDBModel)
        {
            int _result = 0;
            objItem = new ProductionCalenderItem();
            _result = objItem.SaveProductionCalendar(ProductionCalenderDBModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadAllCompanyLineNumber(ProductionCalenderDBModel _dbModel)
        {
            objItem = new ProductionCalenderItem();
            List<ProductionCalenderDBModel> _dbModelList = new List<ProductionCalenderDBModel>();
            _dbModelList = objItem.LoadAllCompanyLineNumber(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult UpdateProductionDate(ProductionCalenderDBModel ProductionCalenderDBModel)
        {
            int _result = 0;
            objItem = new ProductionCalenderItem();
            _result = objItem.UpdateProductionDate(ProductionCalenderDBModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}