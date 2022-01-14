using Common;
using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class UserAccessController : Controller
    {
        // GET: UserAccess
        [PlanningSession, MenuAuthorize(19)]
        public ActionResult Index()
        {
            return View();
        }
        [PlanningSession, MenuAuthorize(18)]
        public ActionResult LoginAuth()
        {
            return View();
        }

        [HttpPost, PlanningSession]
        public JsonResult SaveUserAccess(UserAccessDBModel _dbModel)
        {
            int _result = 0;
            UserAccessItem objItem = new UserAccessItem();
            _result = objItem.SaveUserAccess(_dbModel);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadAllPRUserAccess()
        {
            UserAccessItem objItem = new UserAccessItem();
            List<UserAccessDBModel> _dbModelList = new List<UserAccessDBModel>();
            _dbModelList = objItem.LoadAllPRUserAccess();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadSelectedData(string PRUserAccessID)
        {
            UserAccessItem objItem = new UserAccessItem();
            List<UserAccessDBModel> _dbModelList = new List<UserAccessDBModel>();
            _dbModelList = objItem.LoadSelectedData(PRUserAccessID);
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult DeleteData(string PRUserAccessID)
        {
            int _result = 0;
            UserAccessItem objItem = new UserAccessItem();
            _result = objItem.DeleteData(PRUserAccessID);
            if (_result > 0)
                return Json(new { success = true });
            else
                return Json(new { success = false });
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadDDLData()
        {
            UserAccessItem objItem = new UserAccessItem();
            MasterDDL model = new MasterDDL();
            model = objItem.LoadDDLData();
            return this.Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet, PlanningSession]
        public JsonResult LoadAllUserForAuth()
        {
            UserAccessItem objItem = new UserAccessItem();
            List<UserAccessDBModel> _dbModelList = new List<UserAccessDBModel>();
            _dbModelList = objItem.LoadAllUserForAuth();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, PlanningSession]
        public JsonResult LoadUserLoginInfo(string UserCode)
        {
            UserLoginItem objLogin = new UserLoginItem();
            UserAccessItem objItem = new UserAccessItem();
            bool ItemList = objItem.LoadUserLoginInfo(UserCode);
            List<MenuDBModel> _modelList = new List<MenuDBModel>();

            _modelList = objLogin.GetUserMenuList();
            HtmlMenuList(_modelList);

            if (ItemList == true)
                return Json(new { Success = "True" });
            else
                return Json(new { Success = "False" });
        }
        private void HtmlMenuList(List<MenuDBModel> modelList)
        {
            var _commonMenus = new StringBuilder("");
            var _logOutMenus = new StringBuilder("");
            var _menuList = new StringBuilder("");
            var _userMenuList = new StringBuilder("");

            _commonMenus.Append("<li><a title='Dashboard' href='" + AppSettings.BaseURL + "/Dashboard/Home' class='notification'><ion-icon name='apps' size='large' style='color: purple;'></ion-icon></a></li>");
            _commonMenus.Append("<li><a title='Cancelled Export Order' href='" + AppSettings.BaseURL + "/ProductionReference/CancelledEO' class='notification'><ion-icon name='close-circle' size='large' style='color: purple;'></ion-icon><span class='badge' id='txtNotificationCounter'>0</span></a></li>");
            _commonMenus.Append("<li><a title='Pending Process' href='" + AppSettings.BaseURL + "/LinePriority/PendingProcess' class='notification'><ion-icon name='swap-horizontal' size='large' style='color: purple;'></ion-icon><span class='badge' id='txtPendingLineNotification'>0</span></a></li>");

            var _currentParentMenuName = "";
            var _currentCategoryMenu = new StringBuilder();
            foreach (var menu in modelList)
            {
                if (_currentParentMenuName == "")
                {
                    _currentParentMenuName = menu.CategoryName;
                    _currentCategoryMenu.Append("<li><a href=" + menu.MenuUrl + ">" + menu.MenuName + "</a></li>");
                }
                else
                {
                    if (_currentParentMenuName == menu.CategoryName)
                    {
                        _currentCategoryMenu.Append("<li><a href=" + menu.MenuUrl + ">" + menu.MenuName + "</a></li>");
                    }
                    else
                    {
                        //_currentCategoryMenu.Append("<li><a href=" + menu.MenuUrl + ">" + menu.MenuName + "</a></li>");
                        _menuList.Append("<li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown' aria-expanded='false'> <span>" + _currentParentMenuName + "</span> <i class='icon-submenu lnr lnr-chevron-down'></i></a><ul class='dropdown-menu'>" + _currentCategoryMenu.ToString() + "</ul></li>");

                        _currentCategoryMenu = new StringBuilder();
                        _currentCategoryMenu.Append("<li><a href=" + menu.MenuUrl + ">" + menu.MenuName + "</a></li>");
                        _currentParentMenuName = menu.CategoryName;
                    }
                }
            }
            if (_currentCategoryMenu.ToString() != "")
            {
                _menuList.Append("<li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown' aria-expanded='false'> <span>" + _currentParentMenuName + "</span> <i class='icon-submenu lnr lnr-chevron-down'></i></a><ul class='dropdown-menu'>" + _currentCategoryMenu.ToString() + "</ul></li>");
                _currentCategoryMenu = new StringBuilder();
                _currentParentMenuName = "";
            }

            _logOutMenus.Append("<li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown'><img src='" + @Common.AppSettings.BaseURL + "/Content/klorofil/assets/img/user.png' class='img-circle' alt='Avatar'> <span>" + @Common.SessionVar.EmployeeName + "</span> <i class='icon-submenu lnr lnr-chevron-down'></i></a><ul class='dropdown-menu'><li><a href='" + @Common.AppSettings.BaseURL + "/Login/Login'><i class='lnr lnr-exit'></i> <span>Logout</span></a></li></ul></li>");
            _userMenuList.Append(_commonMenus);
            _userMenuList.Append(_menuList);
            _userMenuList.Append(_logOutMenus);

            SessionVar.MenuNameList = _userMenuList;
        }
    }
}