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
    public class ProductionReferenceController : Controller
    {
        // GET: ProductionReference
        ProductionReferenceItem objItem;
        [PlanningSession]
        public ActionResult Create()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(6)]
        public ActionResult CancelledEO()
        {
            return View();
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadDDLInformation()
        {
            DataSet ds = new DataSet();
            objItem = new ProductionReferenceItem();

            List<ProductionReferenceDBModel> _dbModelCompanyList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelBuyerList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelProdyctTypesList = new List<ProductionReferenceDBModel>();

            ds = objItem.LoadMasterInformation();
            _dbModelCompanyList = objItem.ConvertDataTableToModel(ds.Tables[0]);
            _dbModelBuyerList = objItem.ConvertDataTableToModel(ds.Tables[1]);
            _dbModelProdyctTypesList = objItem.ConvertDataTableToModel(ds.Tables[2]);
            return this.Json(new
            {
                Company = _dbModelCompanyList,
                Buyer = _dbModelBuyerList,
                ProdyctTypes = _dbModelProdyctTypesList
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadFileRefData(ProductionReferenceDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadFileRefData(_dbModel);
            return this.Json(new
            {
                FileRef = _dbModelList
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadExportOrder(ProductionReferenceDBModel _dbModel)
        {
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadExportOrder(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveProductionReference(ProductionReferenceDBModel _dbModel)
        {
            string _result = "";
            objItem = new ProductionReferenceItem();
            _result = objItem.SaveProductionReference(_dbModel);
            if (_result == "Failed")
                return Json(new { success = "Failed" });
            else
                return Json(new { success = _result });
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadAllPRInformation()
        {
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadAllPRInformation();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            objItem = new ProductionReferenceItem();
            DataSet ds = new DataSet();
            List<ProductionReferenceDBModel> _dbModelMasterList = new List<ProductionReferenceDBModel>();
            List<ProductionReferenceDBModel> _dbModelChildList = new List<ProductionReferenceDBModel>();
            ds = objItem.LoadSelectedPRInformation(_dbModel);
            _dbModelMasterList = objItem.LoadMasterModelList(ds.Tables[0]);
            _dbModelChildList = objItem.LoadChildModelList(ds.Tables[1]);
            return this.Json(new
            {
                Master = _dbModelMasterList,
                Child = _dbModelChildList
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet, PlanningSession]
        public JsonResult LoadCancelledEO()
        {
            DataSet ds = new DataSet();
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadCancelledEO();
            return Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet, PlanningSession]
        public string LoadCancelledEOCount()
        {
            DataTable dt = new DataTable();
            objItem = new ProductionReferenceItem();
            dt = objItem.LoadCancelledEOCount();

            return JsonConvert.SerializeObject(dt);
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadEOQtyStatus()
        {
            DataSet ds = new DataSet();
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadEOQtyStatus();
            return Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost, PlanningSession]
        public JsonResult DeleteSelectedPRInformation(ProductionReferenceDBModel _dbModel)
        {
            int _result = 0;
            objItem = new ProductionReferenceItem();
            _result = objItem.DeleteSelectedPRInformation(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadCancelledEOLineNo(ProductionReferenceDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.LoadCancelledEOLineNo(_dbModel);
            return Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public ActionResult UpdateCancelledEOLineNo(List<Dictionary<string, string>> EOCancelQty)
        {
            DataTable dtEO = new DataTable();

            var columnNames = EOCancelQty.SelectMany(dict => dict.Keys).Distinct();
            dtEO.Columns.AddRange(columnNames.Select(c => new DataColumn(c)).ToArray());
            foreach (Dictionary<string, string> item in EOCancelQty)
            {
                var row = dtEO.NewRow();
                foreach (var key in item.Keys)
                {
                    row[key] = item[key];
                }

                dtEO.Rows.Add(row);
            }

            int _result = 0;
            objItem = new ProductionReferenceItem();
            _result = objItem.UpdateCancelledEOLineNo(dtEO);

            return Json(new { Error = false, Message = "Success" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult GetPREOStatus(ProductionReferenceDBModel _dbModel)
        {
            DataSet ds = new DataSet();
            objItem = new ProductionReferenceItem();
            List<ProductionReferenceDBModel> _dbModelList = new List<ProductionReferenceDBModel>();
            _dbModelList = objItem.GetPREOStatus(_dbModel);
            return Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }        

    }
}