using Microsoft.AspNetCore.Html;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Common
{
   public static class SessionVar
    {
        public static string UserCode
        {
            get
            {
                return HttpContext.Current.Session["UserCode"] as string;
            }
            set
            {
                HttpContext.Current.Session["UserCode"] = value;
            }
        }
        public static string EmployeeCode
        {
            get
            {
                return HttpContext.Current.Session["EmployeeCode"] as string;
            }
            set
            {
                HttpContext.Current.Session["EmployeeCode"] = value;
            }
        }
        public static string Department
        {
            get
            {
                return HttpContext.Current.Session["Department"] as string;
            }
            set
            {
                HttpContext.Current.Session["Department"] = value;
            }
        }
        public static string Designation
        {
            get
            {
                return HttpContext.Current.Session["Designation"] as string;
            }
            set
            {
                HttpContext.Current.Session["Designation"] = value;
            }
        }
        public static string EmpImage
        {
            get
            {
                return HttpContext.Current.Session["EmpImage"] as string;
            }
            set
            {
                HttpContext.Current.Session["EmpImage"] = value;
            }

        }
        public static string EmployeeName
        {
            get
            {
                return HttpContext.Current.Session["EmployeeName"] as string;
            }
            set
            {
                HttpContext.Current.Session["EmployeeName"] = value;
            }

        }
        public static string Email
        {
            get
            {
                return HttpContext.Current.Session["EMail"] as string;
            }
            set
            {
                HttpContext.Current.Session["EMail"] = value;
            }
        }
        public static string Unit
        {
            get
            {
                return HttpContext.Current.Session["Unit"] as string;
            }
            set
            {
                HttpContext.Current.Session["Unit"] = value;
            }

        }
        public static StringBuilder MenuNameList 
        {
            get
            {
                return HttpContext.Current.Session["MenuNameList"] as StringBuilder;
            }
            set
            {
                HttpContext.Current.Session["MenuNameList"] = value;
            }
        }
    }
}
