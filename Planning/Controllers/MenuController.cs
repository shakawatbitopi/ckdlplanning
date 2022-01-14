using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class MenuController : Controller
    {
        // GET: Menu
        [PlanningSession, MenuAuthorize(17)]
        public ActionResult Category()
        {
            return View();
        }

        [PlanningSession, MenuAuthorize(20)]
        public ActionResult SubCategory()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(21)]
        public ActionResult Permission()
        {
            return View();
        }

        MenuItem objItem;

        [HttpPost, PlanningSession]
        public JsonResult SaveMenuCategory(MenuDBModel _dbModel)
        {
            int _result = 0;
            objItem = new MenuItem();
            _result = objItem.SaveMenuCategory(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllMenuCategory()
        {
            objItem = new MenuItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.LoadAllMenuCategory();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedMenuCategory(MenuDBModel _dbModel)
        {
            objItem = new MenuItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.LoadSelectedMenuCategory(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteMenuCategory(MenuDBModel _dbModel)
        {
            int _result = 0;
            objItem = new MenuItem();
            _result = objItem.DeleteMenuCategory(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveMenuSubCategory(MenuDBModel _dbModel)
        {
            int _result = 0;
            objItem = new MenuItem();
            _result = objItem.SaveMenuSubCategory(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllMenuSubCategory()
        {
            objItem = new MenuItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.LoadAllMenuSubCategory();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedMenuSubCategory(MenuDBModel _dbModel)
        {
            objItem = new MenuItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.LoadSelectedMenuSubCategory(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteMenuSubCategory(MenuDBModel _dbModel)
        {
            int _result = 0;
            objItem = new MenuItem();
            _result = objItem.DeleteMenuSubCategory(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllEmployee()
        {
            objItem = new MenuItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.LoadAllEmployee();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadAllUserMenu(MenuDBModel _dbModel)
        {
            objItem = new MenuItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.LoadAllUserMenu(_dbModel);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveUserMenu(MenuDBModel _dbModel)
        {
            int _result = 0;
            objItem = new MenuItem();
            _result = objItem.SaveUserMenu(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }
    }
}