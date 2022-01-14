using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class LinePriorityController : Controller
    {
        // GET: LinePriority
        [PlanningSession, MenuAuthorize(15)]
        public ActionResult Update()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(7)]
        public ActionResult PendingProcess()
        {
            return View();
        }
        LinePriorityItem objItem;

        [HttpGet, PlanningSession]
        public JsonResult LoadProductionLines()
        {
            objItem = new LinePriorityItem();
            List<LinePriorityDBModel> _dbModelList = new List<LinePriorityDBModel>();
            _dbModelList = objItem.LoadProductionLines();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadLineWisePriority(LinePriorityDBModel _dbModel)
        {
            objItem = new LinePriorityItem();
            List<LinePriorityDBModel> _dbModelList = new List<LinePriorityDBModel>();
            _dbModelList = objItem.LoadLineWisePriority(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult UpdateLinePriorityNumber(LinePriorityDBModel _dbModel)
        {
            int _result = 0;
            objItem = new LinePriorityItem();
            _result = objItem.UpdateLinePriorityNumber(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}