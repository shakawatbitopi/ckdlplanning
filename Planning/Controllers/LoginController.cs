using Common;
using LIB;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNetCore.Html;
using System.Text.Encodings.Web;
using System.Text;

namespace Planning.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Login()
        {
            SessionVar.EmployeeCode = null;
            SessionVar.UserCode = null;
            SessionVar.EmployeeName = null;
            SessionVar.Email = null;
            SessionVar.MenuNameList = null;
            return View();
        }
        [HttpPost]
        public JsonResult GetLogInInfo(LogInDBModel user)
        {

            UserLoginItem objItem = new UserLoginItem();
            Encryption objEncrypt = new Encryption();
            List<MenuDBModel> _modelList = new List<MenuDBModel>();

            string userName = objEncrypt.EncryptWord(user.UserName.Trim());
            string password = objEncrypt.EncryptWord(user.Password.Trim());

            bool ItemList = objItem.GetLogInInfo(userName, password);

            if (ItemList == true)
            {
                _modelList = objItem.GetUserMenuList();
                HtmlMenuList(_modelList);
            }

            if (ItemList == true)
                return Json(new { Success = "True", MenuList = _modelList });
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
        public static string GetString(IHtmlContent content)
        {
            var writer = new System.IO.StringWriter();
            content.WriteTo(writer, HtmlEncoder.Default);
            return writer.ToString();
        }

        [HttpPost]
        public JsonResult GetLogInUserMenus()
        {
            UserLoginItem objItem = new UserLoginItem();
            List<MenuDBModel> _dbModelList = new List<MenuDBModel>();
            _dbModelList = objItem.GetUserMenuList();
            return this.Json(_dbModelList, JsonRequestBehavior.AllowGet);

        }
    }
}