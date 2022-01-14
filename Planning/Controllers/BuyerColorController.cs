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
    public class BuyerColorController : Controller
    {
        // GET: BuyerColor
        [PlanningSession,MenuAuthorize(22)]
        public ActionResult ColorNames()
        {
            return View();
        }
        BuyerColorItem objItem;

        [HttpPost, PlanningSession]
        public JsonResult SaveBuyerColor(BuyerColorDBModel _dbModel)
        {
            int _result = 0;
            objItem = new BuyerColorItem();
            _result = objItem.SaveBuyerColor(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });

        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllBuyerColor()
        {
            objItem = new BuyerColorItem();
            List<BuyerColorDBModel> _dbModelList = new List<BuyerColorDBModel>();
            _dbModelList = objItem.LoadAllBuyerColor();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);

        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedBuyerColor(BuyerColorDBModel _dbModel)
        {
            objItem = new BuyerColorItem();
            List<BuyerColorDBModel> _dbModelList = new List<BuyerColorDBModel>();
            _dbModelList = objItem.LoadSelectedBuyerColor(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteBuyerColor(BuyerColorDBModel _dbModel)
        {
            int _result = 0;
            objItem = new BuyerColorItem();
            _result = objItem.DeleteBuyerColor(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });

        }
    }
}