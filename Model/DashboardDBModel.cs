using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class DashboardDBModel
    {
        public string LineNumber { get; set; }
        public string LineDayQty { get; set; }
        public string Buyer { get; set; }
        public string Company { get; set; }
        public string LineDate { get; set; }
        public string UnitName { get; set; }
        public string CurrentMonthQty { get; set; }
        public string CurrentMonthProduceQty { get; set; }
        public string LastPlanDate { get; set; }
    }
}
