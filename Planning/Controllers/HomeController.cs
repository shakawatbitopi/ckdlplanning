using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class HomeController : Controller
    {
        [PlanningSession]
        public ActionResult Index()
        {
            return View();
        }
        [PlanningSession]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        [PlanningSession]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}