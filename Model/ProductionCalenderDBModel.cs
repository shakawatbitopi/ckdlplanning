using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class ProductionCalenderDBModel
    {
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string ProductionDate { get; set; }
        public string DaysName { get; set; }
        public string DateStatus { get; set; }
        public string ProductionHours { get; set; }
        public string LineNumber { get; set; }
    }
}
