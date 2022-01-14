using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Planning.Controllers
{
    public class ProductionProcessController : Controller
    {
        // GET: ProductionProcess
        [PlanningSession]
        public ActionResult Process()
        {
            return View();
        }
    }
}