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
    public class ProductionDetailsController : Controller
    {
        // GET: ProductionDetails
        [PlanningSession]
        public ActionResult Details()
        {
            return View();
        }
        ProductionDetailsItem objItem;

        [HttpGet, PlanningSession]
        public JsonResult LoadPRInformation()
        {
            objItem = new ProductionDetailsItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.LoadPRInformation();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadBulletinDetails(ProductionDetailsDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new ProductionDetailsItem();
            List<ProductionDetailsDBModel> _dbModelSAMInformation = new List<ProductionDetailsDBModel>();
            List<ProductionDetailsDBModel> _dbModelLineInformation = new List<ProductionDetailsDBModel>();
            ds = objItem.LoadBulletinDetails(_dbModel);
            _dbModelSAMInformation = objItem.GetBulletinDetails(ds.Tables[0]);
            _dbModelLineInformation = objItem.GetLineInformation(ds.Tables[1]);
            return this.Json(new { SAMInformation = _dbModelSAMInformation, LineInformation = _dbModelLineInformation }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult SavePRInformation(ProductionDetailsDBModel _dbModel)
        {
            int _result = 0;
            objItem = new ProductionDetailsItem();
            _result = objItem.SavePRInformation(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
        [PlanningSession]
        public JsonResult GetLineInformationDetails(string LineNumber)
        {
            ProductionDetailsDBModel _dbModel = new ProductionDetailsDBModel();
            _dbModel.LineNumber = LineNumber;

            objItem = new ProductionDetailsItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.GetLineInformationDetails(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadPreviewData(ProductionDetailsDBModel _dbModel)
        {
            objItem = new ProductionDetailsItem();
            List<ProductionDetailsDBModel> _dbModelList = new List<ProductionDetailsDBModel>();
            _dbModelList = objItem.LoadPreviewData(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
    }
}