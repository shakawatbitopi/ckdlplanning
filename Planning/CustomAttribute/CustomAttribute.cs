
using Common;
using LIB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Planning
{    
    public class PlanningSessionAttribute : AuthorizeAttribute
    {
        public PlanningSessionAttribute()
        {
        }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (SessionVar.UserCode != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "Login" }, { "controller", "Login" } });
        }
    }
    public class MenuAuthorizeAttribute : AuthorizeAttribute
    {
        int _menuID;
        public MenuAuthorizeAttribute(int MenuID)
        {
            this._menuID = MenuID;
        }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            bool hasPermission = UtilityList.GetPermisssion(_menuID, SessionVar.EmployeeCode);
            return hasPermission;
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "Home" }, { "controller", "Dashboard" } });
        }
    }
}